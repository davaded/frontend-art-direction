#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);
const argv = process.argv.slice(2);
const command = argv[0];

const help = `frontend-art-direction ${packageJson.version}

Install the Codex skill or run its local inspection utilities.

Usage:
  frontend-art-direction                 Install/update the skill
  frontend-art-direction install [--copy]
  frontend-art-direction inspect <path> [--format md|json]
  frontend-art-direction map <path> --query "..." [--format md|json]
  frontend-art-direction graph <path> [--query "..."] [--format md|json]
  frontend-art-direction brief --query "..." [options]
  frontend-art-direction direction --query "..." [--profile "..."] [--authority artist|reference|project|model] [--format md|json]
  frontend-art-direction reference --query "..." [--profile "..."] [--style "..."] [--motion "..."]
  frontend-art-direction scout --query "..." [--category <id>] [--format md|json]
  frontend-art-direction reference-build --query "..." [--reference <id|url>] [--project <path>] [--reference-inspected]
  frontend-art-direction resource --query "..." [--stack react] [--format md|json]
  frontend-art-direction audit <path> --query "..." [--no-motion] [--format md|json]
  frontend-art-direction motion --intent "..." [--project <path>] [--phase review|apply|polish|all]
  frontend-art-direction check

Options:
  --copy    Copy skill files instead of symlinking them during install.
  -h, --help
  -v, --version
`;

if (argv.includes("-h") || argv.includes("--help")) {
  console.log(help);
  process.exit(0);
}

if (argv.includes("-v") || argv.includes("--version")) {
  console.log(packageJson.version);
  process.exit(0);
}

function runNodeScript(script, args) {
  const result = spawnSync(process.execPath, [join(root, "scripts", script), ...args], {
    stdio: "inherit",
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

if (command === "inspect") runNodeScript("inspect-project.mjs", argv.slice(1));
if (command === "map") runNodeScript("project-map.mjs", argv.slice(1));
if (command === "graph") runNodeScript("project-graph.mjs", argv.slice(1));
if (command === "brief") runNodeScript("design-brief.mjs", argv.slice(1));
if (command === "direction") runNodeScript("visual-direction.mjs", argv.slice(1));
if (command === "reference") runNodeScript("reference-composition.mjs", argv.slice(1));
if (command === "scout") runNodeScript("reference-scout.mjs", argv.slice(1));
if (command === "reference-build") runNodeScript("reference-build.mjs", argv.slice(1));
if (command === "resource") runNodeScript("resource-catalog.mjs", argv.slice(1));
if (command === "audit") runNodeScript("audit.mjs", argv.slice(1));
if (command === "motion") runNodeScript("transitions-adapter.mjs", argv.slice(1));
if (command === "check") runNodeScript("check.mjs", argv.slice(1));

const installArgs = command === "install" ? argv.slice(1) : argv;
const unknown = installArgs.filter((arg) => arg !== "--copy");
if (unknown.length > 0) {
  console.error(`Unknown option or command: ${unknown.join(" ")}`);
  console.error(help);
  process.exit(1);
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(
  npm,
  [
    "exec",
    "--yes",
    "--package",
    "skills",
    "--",
    "skills",
    "add",
    "davaded/frontend-art-direction",
    "-a",
    "codex",
    "-g",
    "-y",
    ...installArgs,
  ],
  { stdio: "inherit" },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
