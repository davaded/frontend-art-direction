#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

const forwarded = process.argv.slice(2);

if (forwarded.includes("-h") || forwarded.includes("--help")) {
  console.log(`frontend-art-direction

Install the frontend-art-direction Codex skill.

Usage:
  npx frontend-art-direction

Options:
  --copy    Copy skill files instead of symlinking them.
  -h, --help

This command runs:
  npm exec --yes --package skills -- skills add davaded/frontend-art-direction -a codex -g -y
`);
  process.exit(0);
}

const passthrough = [];
for (const arg of forwarded) {
  if (arg === "--copy") {
    passthrough.push(arg);
  } else {
    console.error(`Unknown option: ${arg}`);
    console.error("Run with --help to see supported options.");
    process.exit(1);
  }
}

const args = [
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
  ...passthrough,
];

const result =
  process.platform === "win32"
    ? spawnSync("cmd.exe", ["/d", "/s", "/c", ["npm", ...args].join(" ")], {
        stdio: "inherit",
      })
    : spawnSync("npm", args, { stdio: "inherit" });

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
