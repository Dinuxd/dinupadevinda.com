import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import { syncProjectAssets } from "./sync-project-assets.mjs";

const root = process.cwd();
const sourceDir = path.join(root, "data", "projects");
const nextArgs = ["dev", ...process.argv.slice(2)];

let syncTimer;

async function runSync() {
  try {
    await syncProjectAssets({ root });
  } catch (error) {
    console.error("Project asset sync failed:");
    console.error(error);
  }
}

await runSync();

const watcher = watch(sourceDir, { persistent: true }, () => {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(runSync, 150);
});

const child = spawn("next", nextArgs, {
  stdio: "inherit",
  shell: process.platform === "win32"
});

function shutdown(signal) {
  watcher.close();
  child.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", (code) => {
  watcher.close();
  process.exit(code ?? 0);
});
