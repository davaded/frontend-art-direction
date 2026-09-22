import { existsSync, readdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DATA_ROOT = join(REPO_ROOT, "data");

export function isMainModule(moduleUrl, argv1 = process.argv[1]) {
  if (!argv1) return false;
  const modulePath = fileURLToPath(moduleUrl);
  try {
    return realpathSync(argv1) === realpathSync(modulePath);
  } catch {
    return resolve(argv1) === resolve(modulePath);
  }
}

export function parseArgs(argv) {
  const options = {};
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      positionals.push(value);
      continue;
    }

    const raw = value.slice(2);
    if (raw.includes("=")) {
      const [key, ...rest] = raw.split("=");
      options[key] = rest.join("=");
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("-")) {
      options[raw] = next;
      index += 1;
    } else {
      options[raw] = true;
    }
  }

  return { options, positionals };
}

export function option(args, name, fallback = undefined) {
  return args.options[name] ?? fallback;
}

export function asNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function tokenize(value) {
  const chunks = String(value ?? "")
    .toLocaleLowerCase()
    .match(/[\p{Script=Han}]+|[\p{L}\p{N}]+/gu) ?? [];
  const tokens = [];

  for (const chunk of chunks) {
    tokens.push(chunk);
    if (!/^\p{Script=Han}+$/u.test(chunk)) continue;
    // Keep short CJK phrases queryable without a heavyweight tokenizer.
    for (const size of [2, 3, 4]) {
      for (let index = 0; index <= chunk.length - size; index += 1) {
        tokens.push(chunk.slice(index, index + size));
      }
    }
  }

  return [...new Set(tokens)];
}

const QUERY_STOP_WORDS = new Set([
  "a", "an", "and", "are", "can", "do", "does", "for", "from", "here", "how", "in", "is", "it", "me", "of", "on", "or", "please", "show", "the", "there", "to", "what", "where", "which", "with",
]);

const GENERIC_REQUEST_PATTERNS = [
  /(?:请给我|给我一个|帮我|我要|我想要|想做|需要一个|做一个|做个|创建一个|设计一个|开发一个|制作一个|生成一个)/g,
  /(?:一个|一款|一套|一页|通用的?|普通的?|简单的?|基础的?)/g,
  /\b(?:please|i want|i need|make|build|create|design|develop|give me|a|an|the|some|generic|general|simple|basic)\b/gu,
  /\b(?:website|web\s*site|webpage|web|site|frontend|front\s*end|interface|page|ui|ux|product|application|app)\b/gu,
  /(?:网站|网页|官网|前端|界面|页面|产品|应用|用户界面)/g,
];

export function isUnderspecifiedRequest(value) {
  const raw = String(value ?? "").trim().toLocaleLowerCase();
  if (!raw) return true;
  if (/https?:\/\/|www\./u.test(raw)) return false;
  const remainder = GENERIC_REQUEST_PATTERNS.reduce((result, pattern) => result.replace(pattern, " "), raw)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  return remainder.length === 0;
}

export function meaningfulTokens(value) {
  return [...new Set(tokenize(value).filter((token) => !QUERY_STOP_WORDS.has(token) && token.length > 1))];
}

export function flattenStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

export function scoreRecord(record, queryTokens, fields = []) {
  const text = flattenStrings(
    fields.length > 0 ? Object.fromEntries(fields.map((field) => [field, record[field]])) : record,
  ).join(" ");
  const haystack = new Set(tokenize(text));
  const hits = queryTokens.filter((token) => haystack.has(token));
  const phraseBonus = queryTokens.length > 1 && text.toLocaleLowerCase().includes(queryTokens.join(" ")) ? 2 : 0;
  return { score: hits.length + phraseBonus, hits: [...new Set(hits)] };
}

export function chooseRecord(records, queryTokens, preferredId, fallbackId, fields = ["id", "label", "keywords"]) {
  if (preferredId) {
    const exact = records.find((record) => record.id === preferredId);
    if (exact) return { record: exact, score: 99, hits: [preferredId], confidence: "explicit" };
  }

  const ranked = records
    .map((record) => ({ record, ...scoreRecord(record, queryTokens, fields) }))
    .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id));
  const fallback = records.find((item) => item.id === fallbackId) ?? records[0];
  const best = ranked[0]?.score > 0
    ? ranked[0]
    : { record: fallback, score: 0, hits: [] };
  const confidence = best.score >= 4 ? "high" : best.score >= 2 ? "medium" : "low";
  return { ...best, confidence, candidates: ranked.slice(0, 3).map((item) => ({ id: item.record.id, score: item.score, hits: item.hits })) };
}

export function walkFiles(root, { maxFiles = 5000, ignore = [] } = {}) {
  const results = [];
  const ignored = new Set([
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".svelte-kit",
    "coverage",
    "target",
    "DerivedData",
    ...ignore,
  ]);

  function visit(directory) {
    if (results.length >= maxFiles) return;
    let entries = [];
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (results.length >= maxFiles) return;
      if (ignored.has(entry.name)) continue;
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile()) results.push(fullPath);
    }
  }

  visit(root);
  return results;
}

export function relativePath(root, path) {
  const value = relative(root, path).split("\\").join("/");
  return value || ".";
}

export function writeOutput(value, { format = "md", output } = {}) {
  const rendered = format === "json" ? `${JSON.stringify(value, null, 2)}\n` : String(value).trimEnd() + "\n";
  if (output) {
    const destination = isAbsolute(output) ? output : resolve(process.cwd(), output);
    writeFileSync(destination, rendered);
  } else {
    process.stdout.write(rendered);
  }
}

export function loadDataset(name) {
  return readJson(join(DATA_ROOT, name));
}

export function existsAny(root, names) {
  return names.filter((name) => existsSync(join(root, name)));
}

export function fileExtensionCounts(files) {
  const counts = {};
  for (const file of files) {
    const extension = extname(file).toLocaleLowerCase() || "[none]";
    counts[extension] = (counts[extension] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((left, right) => right[1] - left[1]));
}
