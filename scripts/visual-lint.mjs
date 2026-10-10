#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { isMainModule, option, parseArgs, relativePath, walkFiles, writeOutput } from "./lib.mjs";

const SOURCE_EXTENSIONS = new Set([".css", ".scss", ".sass", ".less", ".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".js", ".mjs", ".ts"]);

const RULES = [
  {
    id: "placeholder-content",
    severity: "P1",
    category: "content-truth",
    operation: "harden",
    pattern: /lorem\s+ipsum|your\s+text\s+here|(?:placeholder|dummy|sample)\s+(?:text|copy|content|data|image)|coming\s+soon|fake\s+(?:data|metrics)/iu,
    observation: "Placeholder or filler content is present in shipped source.",
    impact: "The surface cannot earn product-specific visual polish while its content is visibly provisional.",
  },
  {
    id: "transition-all",
    severity: "P2",
    category: "motion",
    operation: "animate",
    pattern: /transition\s*:\s*all\b|transition-all\b/iu,
    observation: "A broad transition target may animate layout or unrelated properties.",
    impact: "Unexpected motion and layout work make interaction feel generic and can obscure the state relationship.",
  },
  {
    id: "motion-without-reduced-motion",
    severity: "P1",
    category: "accessibility",
    pattern: /(?:@keyframes\b|animation\s*[:=]|requestAnimationFrame\s*\(|\.animate\s*\()/iu,
    observation: "Motion code exists without a detectable reduced-motion branch in the same source set.",
    impact: "Motion-sensitive users may lose a usable or comfortable path through the interface.",
    operation: "animate",
    aggregate: true,
  },
  {
    id: "interactive-focus",
    severity: "P1",
    category: "accessibility",
    pattern: /<(?:button|a|input|select|textarea)\b|role\s*=\s*["']button["']/iu,
    observation: "Interactive markup exists without a detectable focus selector in the source set.",
    impact: "Keyboard users may lose orientation and the visual system lacks a complete interaction state.",
    operation: "harden",
    aggregate: true,
  },
  {
    id: "generic-font-stack",
    severity: "P2",
    category: "typography",
    operation: "typeset",
    pattern: /font-family\s*:[^;\n]*(?:Inter|Arial|Helvetica|Roboto|system-ui|sans-serif)/iu,
    observation: "A common default font stack is used in a visual source file.",
    impact: "Typography may collapse toward the training median unless the choice is deliberate and subject-specific.",
  },
  {
    id: "default-gradient-stack",
    severity: "P2",
    category: "composition",
    operation: "colorize",
    pattern: /(?:linear|radial|conic)-gradient\s*\(/iu,
    observation: "A gradient is used as a visible treatment.",
    impact: "Gradients can become a substitute for hierarchy; inspect whether the color carries subject or state meaning.",
    minimumMatches: 2,
  },
  {
    id: "pure-default-palette",
    severity: "P3",
    category: "material",
    operation: "colorize",
    pattern: /(?:#[0]{3,8}\b|#[f]{3,8}\b|rgba?\(\s*0\s*,\s*0\s*,\s*0\s*\)|rgba?\(\s*255\s*,\s*255\s*,\s*255\s*\))/giu,
    observation: "Pure black or white literals are repeated in a visual source file.",
    impact: "Untinted defaults often flatten material hierarchy and make a page feel unconsidered.",
    minimumMatches: 3,
  },
  {
    id: "effect-stack",
    severity: "P2",
    category: "material",
    operation: "distill",
    pattern: /box-shadow\s*:|backdrop-filter\s*:|filter\s*:\s*blur|(?:linear|radial|conic)-gradient\s*\(/giu,
    observation: "Several effect layers are combined in one source file.",
    impact: "Effects may be compensating for a weak silhouette or hierarchy instead of carrying meaning.",
    minimumMatches: 4,
  },
  {
    id: "hardcoded-color-density",
    severity: "P2",
    category: "system",
    operation: "extract",
    pattern: /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/giu,
    observation: "Many color literals are repeated instead of being visibly tokenized.",
    impact: "Repeated literals make later visual refinement inconsistent and weaken the product's design memory.",
    minimumMatches: 18,
  },
];

function lineAt(content, index) {
  return content.slice(0, index).split("\n").length;
}

function matches(pattern, content) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  return [...content.matchAll(new RegExp(pattern.source, flags))];
}

function sourceFiles(projectRoot, maxFiles) {
  return walkFiles(projectRoot, { maxFiles, ignore: ["artifacts", ".art-direction", "coverage", "dist", "build"] })
    .filter((file) => SOURCE_EXTENSIONS.has(extname(file).toLocaleLowerCase()))
    .filter((file) => !/(^|\/)(?:scripts|test|tests|__tests__|fixtures|mocks)(\/|$)/iu.test(relativePath(projectRoot, file)));
}

function buildFinding(rule, file, matchCount, line, aggregate = false) {
  return {
    id: `${rule.id}:${aggregate ? "project" : relativePath(file.root, file.path)}`,
    rule: rule.id,
    severity: rule.severity,
    category: rule.category,
    file: aggregate ? "[project]" : relativePath(file.root, file.path),
    line,
    matches: matchCount,
    observation: rule.observation,
    impact: rule.impact,
    suggestedOperation: rule.operation,
    deterministic: true,
    advisory: rule.severity !== "P1" || rule.id === "motion-without-reduced-motion" || rule.id === "interactive-focus",
    scope: aggregate ? "project" : "file",
  };
}

export function lintProject(projectRoot, { maxFiles = 3000 } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const files = sourceFiles(root, maxFiles).map((path) => {
    let content = "";
    try {
      content = readFileSync(path, "utf8");
    } catch {
      content = "";
    }
    return { root, path, content };
  });
  const allContent = files.map((file) => file.content).join("\n");
  const findings = [];
  for (const rule of RULES) {
    if (rule.aggregate) {
      const ruleMatches = matches(rule.pattern, allContent);
      const hasRequiredCompanion = rule.id === "motion-without-reduced-motion"
        ? /prefers-reduced-motion/iu.test(allContent)
        : /:focus(?:-visible)?\b/iu.test(allContent);
      if (ruleMatches.length > 0 && !hasRequiredCompanion) {
        const first = ruleMatches[0];
        findings.push(buildFinding(rule, { root, path: "[project]" }, ruleMatches.length, lineAt(allContent, first.index ?? 0), true));
      }
      continue;
    }
    for (const file of files) {
      const ruleMatches = matches(rule.pattern, file.content);
      if (ruleMatches.length < (rule.minimumMatches ?? 1)) continue;
      findings.push(buildFinding(rule, file, ruleMatches.length, lineAt(file.content, ruleMatches[0].index ?? 0)));
    }
  }
  const counts = findings.reduce((result, item) => {
    result[item.severity] = (result[item.severity] ?? 0) + 1;
    return result;
  }, {});
  return {
    protocol: "frontend-art-direction/visual-lint-v1",
    status: findings.length > 0 ? "completed-with-findings" : "clean",
    project: root,
    filesScanned: files.length,
    rulesRun: RULES.length,
    counts,
    findings,
    note: "Deterministic findings route the next action; they cannot certify taste, originality, or visual quality without rendered critique.",
  };
}

export function renderVisualLint(report) {
  const findings = report.findings.length > 0
    ? report.findings.map((item) => `- **${item.severity} ${item.rule}** · \`${item.file}${item.line ? `:${item.line}` : ""}\` · suggested: **${item.suggestedOperation}**\n  ${item.observation} ${item.impact}`).join("\n")
    : "- No deterministic findings in the scanned source set.";
  return `# Visual Lint\n\n- Status: **${report.status}**\n- Files scanned: **${report.filesScanned}**\n- Rules run: **${report.rulesRun}**\n- Counts: ${Object.entries(report.counts).map(([key, value]) => `${key}=${value}`).join(", ") || "none"}\n\n${findings}\n\n${report.note}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(`visual-lint.mjs <project-root> [options]\n\n  --project <path> --max-files <number> --format md|json --output <path>`);
    return;
  }
  const projectRoot = option(args, "project", args.positionals[0] || process.cwd());
  if (!existsSync(resolve(projectRoot))) throw new Error(`Project root not found: ${projectRoot}`);
  const report = lintProject(projectRoot, { maxFiles: Number(option(args, "max-files", 3000)) || 3000 });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? report : renderVisualLint(report), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
