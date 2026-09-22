#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import {
  asNumber,
  isMainModule,
  meaningfulTokens,
  option,
  parseArgs,
  relativePath,
  tokenize,
  walkFiles,
  writeOutput,
} from "./lib.mjs";

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".css", ".html", ".js", ".json", ".jsx", ".mjs", ".md", ".mdx", ".scss", ".svelte", ".ts", ".tsx", ".vue", ".yaml", ".yml",
]);

const CODE_EXTENSIONS = new Set([
  ".cjs", ".css", ".html", ".js", ".jsx", ".mjs", ".scss", ".svelte", ".ts", ".tsx", ".vue",
]);

const IMPORT_EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".vue", ".svelte", ".css", ".scss", ".json"];
const NODE_BUILTINS = new Set([
  "assert", "buffer", "child_process", "cluster", "console", "crypto", "dgram", "diagnostics_channel", "dns", "events", "fs", "http", "https", "module", "net", "os", "path", "perf_hooks", "process", "punycode", "querystring", "readline", "repl", "stream", "string_decoder", "timers", "tls", "trace_events", "tty", "url", "util", "v8", "vm", "wasi", "worker_threads", "zlib",
]);

const HELP = `project-graph.mjs [project-root] [options]

Build a dependency-aware, local repository graph. No network access and no
project writes by default.

Options:
  --project <path>       Project root (also accepted as the first positional)
  --query <text>         Query nodes and return their graph neighborhood
  --format md|json       Output format (default: md)
  --output <path>        Write the graph instead of stdout
  --max-files <number>   Scan limit (default: 3000)
  --max-bytes <number>   Per-file text limit (default: 250000)
  --limit <number>       Query result count (default: 10)
`;

function classifyPath(path) {
  const lower = path.toLocaleLowerCase();
  if (/(^|\/)(app|pages|routes|screens)(\/|$)/.test(lower) || /(route|router|navigation)/.test(lower)) return "route";
  if (/(^|\/)(components?|ui|widgets?|views?|layouts?)(\/|$)/.test(lower) || /(button|input|dialog|modal|table|chart|form|nav|layout)[^/]*\.(tsx?|jsx?|vue|svelte)$/.test(lower)) return "component";
  if (/(tokens?|theme|variables|tailwind|styles?|typography|colors?)/.test(lower)) return "token";
  if (/(^|\/)(__tests__|e2e|playwright|cypress)(\/|$)|\.(test|spec)\.[^/]+$/.test(lower)) return "test";
  if (/\.(json|yaml|yml|toml)$/.test(lower)) return "config";
  if (/\.(md|mdx)$/.test(lower)) return "documentation";
  return "source";
}

function isCodePath(path) {
  return CODE_EXTENSIONS.has(extname(path).toLocaleLowerCase());
}

function readText(file, maxBytes) {
  try {
    if (statSync(file).size > maxBytes) return null;
    const content = readFileSync(file, "utf8");
    return content.includes("\u0000") ? null : content;
  } catch {
    return null;
  }
}

function parseImportSpecifiers(content) {
  const patterns = [
    /\bimport\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\bexport\s+[^'";]+?\s+from\s+['"]([^'"]+)['"]/g,
    /\b(?:import|require)\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  const specs = [];
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) specs.push(match[1]);
  }
  return [...new Set(specs)];
}

function packageName(specifier) {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

function isNodeBuiltin(specifier) {
  return specifier.startsWith("node:") || NODE_BUILTINS.has(specifier);
}

function resolveRelativeImport(fromFile, specifier) {
  const base = resolve(dirname(fromFile), specifier);
  const candidates = [
    base,
    ...IMPORT_EXTENSIONS.filter(Boolean).map((extension) => `${base}${extension}`),
    ...IMPORT_EXTENSIONS.filter(Boolean).map((extension) => join(base, `index${extension}`)),
  ];
  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // Ignore a path that disappears during a scan.
    }
  }
  return null;
}

function graphNode(id, fields = {}) {
  return { id, ...fields };
}

export function buildProjectGraph(projectRoot, { maxFiles = 3000, maxBytes = 250000 } = {}) {
  const root = resolve(projectRoot);
  const files = walkFiles(root, { maxFiles });
  const nodes = new Map();
  const edges = [];
  const contents = new Map();
  const searchIndex = new Map();
  const dependencyNames = new Set();
  const packagePath = join(root, "package.json");
  let packageJson = null;

  if (existsSync(packagePath)) {
    try {
      packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
      for (const name of Object.keys({
        ...(packageJson.dependencies ?? {}),
        ...(packageJson.devDependencies ?? {}),
        ...(packageJson.peerDependencies ?? {}),
        ...(packageJson.optionalDependencies ?? {}),
      })) dependencyNames.add(name);
    } catch {
      packageJson = null;
    }
  }

  for (const file of files) {
    const path = relativePath(root, file);
    if (!TEXT_EXTENSIONS.has(extname(path).toLocaleLowerCase())) continue;
    const content = readText(file, maxBytes);
    if (content === null) continue;
    const id = `file:${path}`;
    contents.set(file, content);
    searchIndex.set(id, new Set(tokenize(content)));
    nodes.set(id, graphNode(id, {
      kind: classifyPath(path),
      path,
      label: basename(path),
      extension: extname(path).toLocaleLowerCase() || "[none]",
    }));
  }

  if (packageJson) {
    nodes.set("package:root", graphNode("package:root", {
      kind: "manifest",
      path: "package.json",
      label: packageJson.name ?? basename(root),
    }));
    for (const name of dependencyNames) {
      nodes.set(`package:${name}`, graphNode(`package:${name}`, {
        kind: "package",
        label: name,
        package: name,
      }));
      edges.push({ from: "package:root", to: `package:${name}`, type: "declares" });
    }
  }

  const addEdge = (from, to, type, specifier) => {
    const key = `${from}|${to}|${type}`;
    if (edges.some((edge) => `${edge.from}|${edge.to}|${edge.type}` === key)) return;
    edges.push({ from, to, type, ...(specifier ? { specifier } : {}) });
  };

  for (const [file, content] of contents) {
    const from = `file:${relativePath(root, file)}`;
    if (relativePath(root, file) === "package.json" && packageJson) addEdge(from, "package:root", "manifest");
    if (!isCodePath(file)) continue;
    for (const specifier of parseImportSpecifiers(content)) {
      if (specifier.startsWith(".")) {
        const resolvedFile = resolveRelativeImport(file, specifier);
        if (resolvedFile) {
          const target = `file:${relativePath(root, resolvedFile)}`;
          if (nodes.has(target)) addEdge(from, target, "import", specifier);
        } else {
          const unresolved = `unresolved:${specifier}`;
          if (!nodes.has(unresolved)) nodes.set(unresolved, graphNode(unresolved, { kind: "unresolved", label: specifier, specifier }));
          addEdge(from, unresolved, "unresolved-import", specifier);
        }
        continue;
      }
      const name = packageName(specifier);
      const builtin = isNodeBuiltin(specifier);
      const target = `${builtin ? "builtin" : "package"}:${name}`;
      if (!nodes.has(target)) nodes.set(target, graphNode(target, { kind: builtin ? "builtin" : dependencyNames.has(name) ? "package" : "external", label: name, package: name }));
      addEdge(from, target, builtin ? "builtin-import" : dependencyNames.has(name) ? "package-import" : "external-import", specifier);
    }
  }

  const degree = new Map();
  for (const edge of edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }
  const normalizedNodes = [...nodes.values()].map((node) => ({ ...node, degree: degree.get(node.id) ?? 0 }));
  const fileCount = files.length;
  const graph = {
    project: root,
    scan: {
      filesSeen: fileCount,
      readableTextFiles: contents.size,
      graphNodes: normalizedNodes.length,
      graphEdges: edges.length,
      truncated: fileCount >= maxFiles,
    },
    package: packageJson ? { name: packageJson.name ?? null, dependencies: [...dependencyNames].sort() } : null,
    nodes: normalizedNodes,
    edges,
    hotspots: normalizedNodes
      .filter((node) => ["route", "component", "token", "source", "manifest"].includes(node.kind))
      .sort((left, right) => right.degree - left.degree || (left.path ?? left.id).localeCompare(right.path ?? right.id))
      .slice(0, 18),
  };
  Object.defineProperty(graph, "_searchIndex", { value: searchIndex, enumerable: false });
  return graph;
}

function nodeText(node) {
  return `${node.id} ${node.kind} ${node.path ?? ""} ${node.label ?? ""}`;
}

function neighborsFor(graph, nodeId) {
  const ids = new Set();
  for (const edge of graph.edges) {
    if (edge.from === nodeId) ids.add(edge.to);
    if (edge.to === nodeId) ids.add(edge.from);
  }
  return [...ids].map((id) => graph.nodes.find((node) => node.id === id)).filter(Boolean);
}

export function queryProjectGraph(graph, query = "", { limit = 10 } = {}) {
  const queryTokens = meaningfulTokens(query);
  const ranked = graph.nodes.map((node) => {
    const tokens = new Set(tokenize(nodeText(node)));
    for (const token of graph._searchIndex?.get(node.id) ?? []) tokens.add(token);
    const pathTokens = new Set(tokenize(node.path ?? ""));
    const hits = queryTokens.filter((token) => tokens.has(token));
    const pathHits = queryTokens.filter((token) => pathTokens.has(token));
    const kindBonus = queryTokens.some((token) => token === node.kind || token === `${node.kind}s`) ? 3 : 0;
    const meaningfulHit = pathHits.length > 0 || hits.length > 0 || kindBonus > 0;
    const score = queryTokens.length === 0
      ? node.degree
      : meaningfulHit ? pathHits.length * 5 + hits.length * 2 + kindBonus + Math.min(node.degree, 4) * 0.25 : 0;
    return { node, score, hits: [...new Set(hits)], meaningfulHit };
  }).filter((item) => queryTokens.length === 0 || item.meaningfulHit)
    .sort((left, right) => right.score - left.score || right.node.degree - left.node.degree || left.node.id.localeCompare(right.node.id));

  const results = ranked.slice(0, limit).map((item) => ({
    id: item.node.id,
    path: item.node.path ?? null,
    kind: item.node.kind,
    label: item.node.label,
    score: Number(item.score.toFixed(2)),
    hits: item.hits,
    degree: item.node.degree,
    neighbors: neighborsFor(graph, item.node.id).slice(0, 8).map((neighbor) => ({
      id: neighbor.id,
      label: neighbor.label,
      kind: neighbor.kind,
      path: neighbor.path ?? null,
    })),
  }));
  return { query, tokens: queryTokens, results };
}

export function renderGraphMarkdown(graph, queryResult = null) {
  const hotspots = graph.hotspots.length > 0
    ? graph.hotspots.slice(0, 10).map((node) => `- \`${node.path ?? node.label}\` (${node.kind}, degree ${node.degree})`)
    : ["- No structural hotspots found."];
  const querySection = queryResult
    ? queryResult.results.length > 0
      ? queryResult.results.map((result, index) => `### ${index + 1}. \`${result.path ?? result.label}\`

- Kind: **${result.kind}**
- Score: **${result.score}** · degree: **${result.degree}**
- Hits: ${result.hits.length > 0 ? result.hits.join(", ") : "structure"}
- Neighbors: ${result.neighbors.length > 0 ? result.neighbors.map((neighbor) => `\`${neighbor.path ?? neighbor.label}\``).join(", ") : "none observed"}`).join("\n\n")
      : "No graph nodes matched the query."
    : "Run with `--query` to rank nodes and show their dependency neighborhood.";
  return `# Project Graph

Project: \`${graph.project}\`
Files seen: **${graph.scan.filesSeen}** · text nodes: **${graph.scan.readableTextFiles}** · nodes: **${graph.scan.graphNodes}** · edges: **${graph.scan.graphEdges}**${graph.scan.truncated ? " · scan truncated" : ""}

## Structural Hotspots

${hotspots.join("\n")}

## Query Neighborhood

${querySection}

## Graph Semantics

- Relative imports become file-to-file edges.
- Bare imports become package or external-package edges.
- Route, component, token, test, configuration, and documentation paths are classified for faster decisions.
- Unresolved relative imports stay visible as unresolved nodes; they are not silently discarded.
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const root = option(args, "project", args.positionals[0] ?? process.cwd());
  const graph = buildProjectGraph(root, {
    maxFiles: asNumber(option(args, "max-files", 3000), 3000),
    maxBytes: asNumber(option(args, "max-bytes", 250000), 250000),
  });
  const query = option(args, "query", args.positionals.slice(1).join(" ") || "");
  const queryResult = query || args.options.limit
    ? queryProjectGraph(graph, query, { limit: asNumber(option(args, "limit", 10), 10) })
    : null;
  const format = option(args, "format", "md");
  const output = format === "json" ? { ...graph, query: queryResult } : renderGraphMarkdown(graph, queryResult);
  writeOutput(output, { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
