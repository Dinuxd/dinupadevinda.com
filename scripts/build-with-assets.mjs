import { spawn } from "node:child_process";
import { syncProjectAssets } from "./sync-project-assets.mjs";

await syncProjectAssets();

const child = spawn("next", ["build", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: process.platform === "win32"
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
