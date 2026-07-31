import { copyFile, mkdir, readdir, rm, stat, utimes } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mediaExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".mp4",
  ".webm",
  ".mov",
  ".pdf"
]);

async function listMediaFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && mediaExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();
}

async function shouldCopy(sourcePath, targetPath, sourceStats) {
  try {
    const targetStats = await stat(targetPath);
    const sameSize = sourceStats.size === targetStats.size;
    const sameMtime = Math.abs(sourceStats.mtimeMs - targetStats.mtimeMs) < 1000;
    return !(sameSize && sameMtime);
  } catch {
    return true;
  }
}

export async function syncProjectAssets({ root = process.cwd(), log = true } = {}) {
  const dataResult = await syncMediaDirectory({
    sourceDir: path.join(root, "data"),
    targetDir: path.join(root, "public", "data")
  });
  const projectResult = await syncMediaDirectory({
    sourceDir: path.join(root, "data", "projects"),
    targetDir: path.join(root, "public", "data", "projects")
  });
  const certificationResult = await syncMediaDirectory({
    sourceDir: path.join(root, "data", "certifications"),
    targetDir: path.join(root, "public", "data", "certifications")
  });
  const honorResult = await syncMediaDirectory({
    sourceDir: path.join(root, "data", "honors"),
    targetDir: path.join(root, "public", "data", "honors")
  });
  const avatarResult = await syncMediaDirectory({
    sourceDir: path.join(root, "data", "avatar"),
    targetDir: path.join(root, "public", "data", "avatar")
  });

  if (log) {
    console.log(
      `Synced ${dataResult.copied} changed data asset${dataResult.copied === 1 ? "" : "s"} from data; pruned ${dataResult.pruned} stale copied data asset${dataResult.pruned === 1 ? "" : "s"}.`
    );
    console.log(
      `Synced ${projectResult.copied} changed project asset${projectResult.copied === 1 ? "" : "s"} from data/projects; pruned ${projectResult.pruned} stale copied project asset${projectResult.pruned === 1 ? "" : "s"}.`
    );
    console.log(
      `Synced ${certificationResult.copied} changed certification asset${certificationResult.copied === 1 ? "" : "s"} from data/certifications; pruned ${certificationResult.pruned} stale copied certification asset${certificationResult.pruned === 1 ? "" : "s"}.`
    );
    console.log(
      `Synced ${honorResult.copied} changed honor asset${honorResult.copied === 1 ? "" : "s"} from data/honors; pruned ${honorResult.pruned} stale copied honor asset${honorResult.pruned === 1 ? "" : "s"}.`
    );
    console.log(
      `Synced ${avatarResult.copied} changed avatar asset${avatarResult.copied === 1 ? "" : "s"} from data/avatar; pruned ${avatarResult.pruned} stale copied avatar asset${avatarResult.pruned === 1 ? "" : "s"}.`
    );
  }

  return {
    data: dataResult,
    projects: projectResult,
    certifications: certificationResult,
    honors: honorResult,
    avatar: avatarResult
  };
}

async function syncMediaDirectory({ sourceDir, targetDir }) {
  await mkdir(targetDir, { recursive: true });

  const files = await listMediaFiles(sourceDir);
  const sourceFiles = new Set(files);
  const targetFiles = await listMediaFiles(targetDir);
  let copied = 0;
  let pruned = 0;

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const sourceStats = await stat(sourcePath);

    if (await shouldCopy(sourcePath, targetPath, sourceStats)) {
      await copyFile(sourcePath, targetPath);
      await utimes(targetPath, sourceStats.atime, sourceStats.mtime);
      copied += 1;
    }
  }

  for (const file of targetFiles) {
    if (!sourceFiles.has(file)) {
      await rm(path.join(targetDir, file));
      pruned += 1;
    }
  }

  return { copied, pruned, files: files.length };
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
const isDirectRun = Boolean(invokedFile && path.resolve(currentFile) === invokedFile);

if (isDirectRun) {
  syncProjectAssets().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
