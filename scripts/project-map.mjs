#!/usr/bin/env node

import { readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { asNumber, isMainModule, meaningfulTokens, option, parseArgs, relativePath, tokenize, walkFiles, writeOutput } from "./lib.mjs";

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".css", ".html", ".js", ".json", ".jsx", ".mjs", ".md", ".mdx", ".scss", ".svelte", ".ts", ".tsx", ".vue", ".yaml", ".yml", ".toml",
]);

const HELP = `project-map.mjs [project-root] --query "..." [options]

Read-only, local question-to-file map. It ranks paths and short source snippets.

Options:
  --query <text>         Question or concept to find
  --format md|json       Output format (default: md)
  --output <path>        Write the map instead of stdout
  --max-files <number>   Scan limit (default: 3000)
  --max-bytes <number>   Per-file text limit (default: 250000)
  --limit <number>       Result count (default: 12)
`;

function classify(file) {
  const lower = file.toLocaleLowerCase();
  if (/(^|\/)(readme|docs?|documentation)(\/|\.|$)/.test(lower) || /\.mdx?$/.test(lower)) return "documentation";
  if (/(^|\/)(component|ui|widget|view|screen|layout|page)(s?)(\/|$)/.test(lower)) return "component-or-screen";
  if (/(route|router|navigation|menu|sidebar|header)/.test(lower)) return "navigation-or-route";
  if (/(style|theme|token|tailwind|css|scss|font|typography|color)/.test(lower)) return "visual-system";
  if (/\.(json|yaml|yml|toml)$/.test(lower)) return "configuration";
  if (/(^|\/)(__tests__|e2e|playwright|cypress)(\/|$)|\.(test|spec)\.[^/]+$/.test(lower)) return "verification";
  return "source";
}

function snippetsFor(content, queryTokens) {
  const lines = content.split(/\r?\n/);
  const snippets = [];
  for (let index = 0; index < lines.length && snippets.length < 4; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;
    const lower = line.toLocaleLowerCase();
    if (queryTokens.some((token) => lower.includes(token))) {
      snippets.push({ line: index + 1, text: line.length > 220 ? `${line.slice(0, 217)}...` : line });
    }
  }
  if (snippets.length === 0) {
    for (let index = 0; index < lines.length && snippets.length < 2; index += 1) {
      const line = lines[index].trim();
      if (/^(#{1,3}\s|export\s|function\s|class\s|const\s+\w+\s*=|<title|\[.*\])/.test(line)) {
        snippets.push({ line: index + 1, text: line.length > 220 ? `${line.slice(0, 217)}...` : line });
      }
    }
  }
  return snippets;
}

function mapProject(projectRoot, query, { maxFiles = 3000, maxBytes = 250000, limit = 12 } = {}) {
  const root = resolve(projectRoot);
  const queryTokens = meaningfulTokens(query);
  const files = walkFiles(root, { maxFiles });
  const results = [];
  let readableFiles = 0;
  let skippedFiles = 0;

  for (const file of files) {
    if (!TEXT_EXTENSIONS.has(extname(file).toLocaleLowerCase())) {
      skippedFiles += 1;
      continue;
    }
    let size = 0;
    try {
      size = statSync(file).size;
    } catch {
      skippedFiles += 1;
      continue;
    }
    if (size > maxBytes) {
      skippedFiles += 1;
      continue;
    }
    let content = "";
    try {
      content = readFileSync(file, "utf8");
    } catch {
      skippedFiles += 1;
      continue;
    }
    if (content.includes("\u0000")) {
      skippedFiles += 1;
      continue;
    }
    readableFiles += 1;
    const path = relativePath(root, file);
    const pathTokens = new Set(tokenize(path));
    const lowerContent = content.toLocaleLowerCase();
    const pathHits = queryTokens.filter((token) => pathTokens.has(token));
    const contentTokens = new Set(tokenize(content));
    const contentHits = queryTokens.filter((token) => contentTokens.has(token));
    const uniqueContentHits = [...new Set(contentHits)];
    const phrase = queryTokens.length > 1 && lowerContent.includes(queryTokens.join(" "));
    const score = pathHits.length * 4 + uniqueContentHits.length + (phrase ? 3 : 0);
    if (score === 0 && queryTokens.length > 0) continue;
    results.push({
      path,
      kind: classify(path),
      score,
      reasons: [...new Set([
        ...pathHits.map((token) => `path:${token}`),
        ...uniqueContentHits.slice(0, 8).map((token) => `content:${token}`),
        ...(phrase ? ["phrase-match"] : []),
      ])],
      snippets: snippetsFor(content, queryTokens),
    });
  }

  results.sort((left, right) => right.score - left.score || left.path.localeCompare(right.path));
  const ranked = results.slice(0, limit);
  const suggestions = ranked.length > 0
    ? []
    : [
        "Try a concept from the UI vocabulary: navigation, route, component, token, form, table, loading, error, or settings.",
        "Inspect the project manifest and app shell before assuming a framework or component system.",
      ];

  return {
    project: root,
    query,
    scan: { filesSeen: files.length, readableFiles, skippedFiles, truncated: files.length >= maxFiles },
    results: ranked,
    suggestions,
  };
}

function renderMapMarkdown(map) {
  const cards = map.results.length > 0
    ? map.results.map((result, index) => `### ${index + 1}. \`${result.path}\`\n\n- Kind: **${result.kind}**\n- Score: **${result.score}**\n- Why: ${result.reasons.join(", ") || "query context"}\n${result.snippets.length > 0 ? result.snippets.map((snippet) => `- L${snippet.line}: \`${snippet.text.replaceAll("`", "'")}\``).join("\n") : "- No short matching line; open the file around its headings or exports."}`).join("\n\n")
    : "No matching text files were found.";
  return `# Project Map

Project: \`${map.project}\`
Question: **${map.query || "(structure only)"}**
Files seen: **${map.scan.filesSeen}** · readable: **${map.scan.readableFiles}** · skipped: **${map.scan.skippedFiles}**${map.scan.truncated ? " · scan truncated" : ""}

## Ranked Evidence

${cards}

## Next Checks

${map.suggestions.length > 0 ? map.suggestions.map((suggestion) => `- ${suggestion}`).join("\n") : "- Read the ranked files, then verify the behavior on the running surface."}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const root = option(args, "project", args.positionals[0] ?? process.cwd());
  const query = option(args, "query", args.positionals.slice(1).join(" ") || "");
  const map = mapProject(root, query, {
    maxFiles: asNumber(option(args, "max-files", 3000), 3000),
    maxBytes: asNumber(option(args, "max-bytes", 250000), 250000),
    limit: asNumber(option(args, "limit", 12), 12),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? map : renderMapMarkdown(map), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();

export { mapProject, renderMapMarkdown };
