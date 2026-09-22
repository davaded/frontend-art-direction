#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import {
  asNumber,
  existsAny,
  fileExtensionCounts,
  isMainModule,
  option,
  parseArgs,
  relativePath,
  walkFiles,
  writeOutput,
} from "./lib.mjs";

const HELP = `inspect-project.mjs [project-root] [options]

Read-only local evidence scan. No network access and no project writes by default.

Options:
  --project <path>       Project root (also accepted as the first positional)
  --format md|json       Output format (default: md)
  --output <path>        Write the report instead of stdout
  --max-files <number>   Scan limit (default: 5000)
`;

const DESIGN_AUTHORITY_LIMIT = 12000;

function extractDesignAuthority(root, relativeFiles) {
  const candidates = relativeFiles
    .filter((file) => /(^|\/)design\.md$/i.test(file))
    .filter((file) => !/(^|\/)(templates|references|node_modules|vendor)(\/|$)/i.test(file))
    .sort((left, right) => {
      const rootWeight = (value) => /^(design\.md)$/i.test(value) ? 0 : /^(docs\/design\.md)$/i.test(value) ? 1 : 2;
      return rootWeight(left) - rootWeight(right) || left.length - right.length || left.localeCompare(right);
    });
  const path = candidates[0];
  if (!path) return null;

  let content = "";
  try {
    content = readFileSync(join(root, path), "utf8").slice(0, DESIGN_AUTHORITY_LIMIT);
  } catch {
    content = "";
  }

  const headings = [...content.matchAll(/^#{1,3}\s+(.+)$/gim)].map((match) => match[1].trim()).slice(0, 30);
  const fields = {};
  for (const match of content.matchAll(/^\s*[-*]\s*([^:\n]{2,80}):\s*(.+)$/gm)) {
    const key = match[1].trim().toLocaleLowerCase().replace(/\s+/g, "-");
    if (!fields[key]) fields[key] = match[2].trim();
  }
  const declaredExceptions = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /intentionally\s+not\s+used|override|exception|avoid|do\s+not\s+use|不使用|例外|覆盖|避免/i.test(line))
    .slice(0, 12);
  const hasDirectionHeading = headings.some((heading) => /direction|visual|composition|type|color|material|motion|方向|视觉|构图|字体|颜色|材质|动效/i.test(heading));
  const hasDirectionField = Object.keys(fields).some((key) => /design-stance|style-anchor|signature-move|signature-interaction|visual|composition|type|palette|color|material|motion|设计|风格|签名|视觉|构图|字体|颜色|材质|动效/i.test(key));
  const hasDirectionContract = Boolean(content.trim()) && (hasDirectionHeading || hasDirectionField);

  return {
    exists: true,
    path,
    authority: "project-owned",
    confidence: hasDirectionContract ? "high" : "medium",
    hasDirectionContract,
    fields,
    headings,
    declaredExceptions,
    excerpt: content.trim().slice(0, 1400),
    status: content.trim() ? "observed" : "unreadable",
  };
}

export function scanProject(projectRoot, { maxFiles = 5000 } = {}) {
  const root = resolve(projectRoot);
  const files = walkFiles(root, { maxFiles });
  const relativeFiles = files.map((file) => relativePath(root, file));
  const packagePath = join(root, "package.json");
  let packageJson = null;
  if (existsSync(packagePath)) {
    try {
      packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
    } catch (error) {
      packageJson = { parseError: error.message };
    }
  }

  const dependencyNames = packageJson
    ? Object.keys({ ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}), ...(packageJson.peerDependencies ?? {}) })
    : [];
  const fileNames = relativeFiles.map((file) => basename(file).toLocaleLowerCase());
  const lowerFiles = relativeFiles.map((file) => file.toLocaleLowerCase());
  const frameworks = [];
  const frameworkRules = [
    ["next", ["next"]],
    ["react", ["react", "react-dom"]],
    ["vue", ["vue"]],
    ["nuxt", ["nuxt"]],
    ["svelte", ["svelte"]],
    ["sveltekit", ["@sveltejs/kit"]],
    ["angular", ["@angular/core"]],
    ["solid", ["solid-js"]],
    ["vite", ["vite"]],
    ["tailwind", ["tailwindcss"]],
  ];
  for (const [name, needles] of frameworkRules) {
    if (needles.some((needle) => dependencyNames.includes(needle))) frameworks.push(name);
  }

  const routeFiles = relativeFiles.filter((file) => /(^|\/)(app|pages|routes|screens)(\/|$)/i.test(file)).slice(0, 40);
  const componentFiles = relativeFiles
    .filter((file) => /(^|\/)(components?|ui|widgets?|views?)(\/|$)/i.test(file) || /(^|\/)(button|input|dialog|modal|table|chart|form|nav|layout)[^/]*\.(tsx?|jsx?|vue|svelte)$/i.test(file))
    .slice(0, 60);
  const tokenFiles = relativeFiles
    .filter((file) => /(tokens?|theme|variables|tailwind|styles?|design|font|typography|color)/i.test(file))
    .slice(0, 60);
  const assetFiles = relativeFiles.filter((file) => /\.(avif|gif|jpg|jpeg|png|svg|webp|mp4|webm|mov|glb|gltf|usdz|woff2?|ttf|otf)$/i.test(file));
  const testFiles = relativeFiles.filter((file) => /(test|spec)\.[^/]+$/i.test(file) || /(^|\/)(__tests__|e2e|playwright|cypress)(\/|$)/i.test(file)).slice(0, 60);
  const designMemory = relativeFiles.filter((file) => /(^|\/)(design\.md|agents\.md|claude\.md|readme\.md|\.cursor\/rules)(\/|$)/i.test(file)).slice(0, 60);
  const designAuthority = extractDesignAuthority(root, relativeFiles);
  const manifests = existsAny(root, [
    "package.json", "pnpm-lock.yaml", "package-lock.json", "yarn.lock", "bun.lockb", "vite.config.ts", "vite.config.js",
    "next.config.js", "next.config.mjs", "nuxt.config.ts", "svelte.config.js", "tsconfig.json", "tailwind.config.js",
    "pyproject.toml", "pubspec.yaml", "Package.swift", "Podfile",
  ]);
  const scripts = packageJson?.scripts ?? {};
  const evidence = [];
  const addEvidence = (kind, paths, detail) => {
    if (paths.length > 0) evidence.push({ kind, paths, detail });
  };
  addEvidence("stack", manifests, frameworks.length > 0 ? frameworks.join(", ") : "manifest/config files found");
  addEvidence("routes", routeFiles, "possible route or screen surfaces");
  addEvidence("components", componentFiles, "reusable UI or likely primitives");
  addEvidence("tokens", tokenFiles, "possible theme, token, style, or typography sources");
  addEvidence("assets", assetFiles.slice(0, 80), `${assetFiles.length} media/font files found`);
  addEvidence("design-memory", designMemory, "project guidance or existing visual memory");
  if (designAuthority) addEvidence("design-authority", [designAuthority.path], `project-owned visual direction (${designAuthority.confidence} confidence)`);
  addEvidence("tests", testFiles, "test or browser verification files");

  const gaps = [];
  if (!packageJson) gaps.push("No package.json found; framework and scripts are not confirmed.");
  if (componentFiles.length === 0) gaps.push("No obvious component directory or primitive file was found.");
  if (tokenFiles.length === 0) gaps.push("No obvious token/theme/style source was found.");
  if (assetFiles.length === 0) gaps.push("No local image, video, model, or font asset was found.");
  if (testFiles.length === 0) gaps.push("No test or browser-evidence path was found.");
  if (files.length >= maxFiles) gaps.push(`Scan stopped at ${maxFiles} files; evidence may be incomplete.`);

  return {
    project: root,
    scan: { fileCount: files.length, truncated: files.length >= maxFiles, extensionCounts: fileExtensionCounts(files) },
    stack: { frameworks, dependencies: dependencyNames.slice(0, 120), scripts },
    manifests,
    evidence,
    paths: { routes: routeFiles, components: componentFiles, tokens: tokenFiles, designMemory, designAuthority: designAuthority?.path ?? null, tests: testFiles },
    designAuthority,
    assets: { count: assetFiles.length, examples: assetFiles.slice(0, 80) },
    gaps,
    status: gaps.length === 0 ? "evidence-ready" : "partial-evidence",
  };
}

export function renderScanMarkdown(report) {
  const list = (items) => items.length > 0 ? items.map((item) => `- \`${item}\``).join("\n") : "- None observed";
  const evidence = report.evidence.length > 0
    ? report.evidence.map((item) => `- **${item.kind}**: ${item.detail}\n  ${item.paths.slice(0, 12).map((path) => `- \`${path}\``).join("\n  ")}`).join("\n")
    : "- No structured evidence found.";
  return `# Local Evidence Scan

Project: \`${report.project}\`
Status: **${report.status}**
Files scanned: **${report.scan.fileCount}**${report.scan.truncated ? " (truncated)" : ""}

## Stack

- Framework/config signals: ${report.stack.frameworks.length > 0 ? report.stack.frameworks.join(", ") : "not confirmed"}
- Manifests: ${report.manifests.length > 0 ? report.manifests.map((item) => `\`${item}\``).join(", ") : "none found"}
- Scripts: ${Object.keys(report.stack.scripts).length > 0 ? Object.keys(report.stack.scripts).map((item) => `\`${item}\``).join(", ") : "none found"}

## Evidence

${evidence}

## Candidate Paths

### Routes / Screens
${list(report.paths.routes)}

### Components
${list(report.paths.components)}

### Tokens / Theme / Styles
${list(report.paths.tokens)}

### Design Memory
${list(report.paths.designMemory)}

### Design Authority
${report.designAuthority ? `- **${report.designAuthority.status}** \`${report.designAuthority.path}\` (${report.designAuthority.confidence}); project-owned direction: ${report.designAuthority.hasDirectionContract ? "detected" : "not yet structured"}` : "- No project-owned DESIGN.md detected; local direction remains provisional."}

### Tests / Browser Evidence
${list(report.paths.tests)}

## Assets

Count: **${report.assets.count}**
${list(report.assets.examples)}

## Gaps

${report.gaps.length > 0 ? report.gaps.map((gap) => `- ${gap}`).join("\n") : "- No obvious evidence gaps from this scan."}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const projectRoot = option(args, "project", args.positionals[0] ?? process.cwd());
  const report = scanProject(projectRoot, { maxFiles: asNumber(option(args, "max-files", 5000), 5000) });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? report : renderScanMarkdown(report), {
    format,
    output: option(args, "output"),
  });
}

if (isMainModule(import.meta.url)) main();
