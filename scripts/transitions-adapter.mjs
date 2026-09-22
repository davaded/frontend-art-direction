#!/usr/bin/env node

import {
  existsSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir, tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import {
  isMainModule,
  meaningfulTokens,
  option,
  parseArgs,
  relativePath,
  tokenize,
  walkFiles,
  writeOutput,
} from "./lib.mjs";

const UPSTREAM_COMMIT = "598d3d6ad89dabb4bdf742fd2e887ca53914a888";
const UPSTREAM_REPOSITORY = "https://github.com/Jakubantalik/transitions.dev";
const UPSTREAM_RAW_ROOT = `https://raw.githubusercontent.com/Jakubantalik/transitions.dev/${UPSTREAM_COMMIT}/`;

const TRANSITION_SLUGS = [
  "card-resize",
  "number-pop-in",
  "notification-badge",
  "text-states-swap",
  "menu-dropdown",
  "modal",
  "panel-reveal",
  "page-side-by-side",
  "icon-swap",
  "success-check",
  "avatar-group-hover",
  "error-state-shake",
  "input-clear-dissolve",
  "skeleton-reveal",
  "shimmer-text",
  "tabs-sliding",
  "tooltip",
  "texts-reveal",
  "card-tilt",
  "plus-menu-morph",
  "accordion",
  "toast",
  "like-button",
  "learn-more-hover",
  "checkbox-check",
  "spinning-counter",
  "toggle",
  "thinking-states",
  "reasoning-stream",
  "streaming-text",
  "matrix-loader",
  "banner-stacking",
];

const UPSTREAM_FILES = [
  "skills/transitions-dev/SKILL.md",
  "skills/transitions-dev/_root.css",
  ...TRANSITION_SLUGS.map((slug, index) => `skills/transitions-dev/${String(index + 1).padStart(2, "0")}-${slug}.md`),
  "skills/transitions-polish/SKILL.md",
  "skills/transitions-polish/_refine-rules.md",
  "skills/transitions-polish/_root.css",
];

const BUILTIN_TRANSITIONS = TRANSITION_SLUGS.map((id, index) => ({
  id,
  title: id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" "),
  source: `transitions-dev/${String(index + 1).padStart(2, "0")}-${id}.md`,
  sourceUrl: `${UPSTREAM_RAW_ROOT}skills/transitions-dev/${String(index + 1).padStart(2, "0")}-${id}.md`,
  when: "Use the matching transition only when the visible state or relationship needs it.",
  keywords: id.replaceAll("-", " "),
}));

const ALIASES = [
  ["modal", "modal dialog popup dialog 弹窗 对话框 模态"],
  ["menu-dropdown", "dropdown menu popover contextual 下拉 菜单 弹出菜单"],
  ["panel-reveal", "panel drawer sidebar sheet reveal 面板 抽屉 侧栏"],
  ["page-side-by-side", "page route navigation list detail step screen transition 页面 路由 页面切换"],
  ["card-resize", "resize expand collapse card size 展开 收起 尺寸 容器"],
  ["text-states-swap", "text swap label status copy 文本 文字 状态切换"],
  ["icon-swap", "icon symbol glyph swap 图标"],
  ["success-check", "success done complete confirmation check 成功 完成 确认"],
  ["error-state-shake", "error invalid validation shake form 错误 校验 表单"],
  ["input-clear-dissolve", "clear search input reset dissolve 清空 搜索 输入框 重置"],
  ["skeleton-reveal", "skeleton loading placeholder reveal 骨架 加载 占位"],
  ["shimmer-text", "shimmer pending waiting loading text 闪烁 文案 等待"],
  ["tabs-sliding", "tabs segmented control filter 标签 分段控件 筛选"],
  ["tooltip", "tooltip hint info hover 提示 信息悬浮"],
  ["texts-reveal", "text reveal headline stagger onboarding title 标题 文本进场"],
  ["card-tilt", "tilt 3d hover glare pointer card 倾斜 立体"],
  ["plus-menu-morph", "plus fab morph compose floating action 加号 浮动按钮"],
  ["accordion", "accordion disclosure faq details collapsible 折叠 手风琴 展开"],
  ["toast", "toast snackbar notification feedback 通知 提示条"],
  ["like-button", "like heart favorite reaction 点赞 喜欢 收藏"],
  ["learn-more-hover", "learn more arrow link hover 箭头 链接"],
  ["checkbox-check", "checkbox check selection 复选框 勾选"],
  ["spinning-counter", "counter odometer digits number reel 数字 计数器"],
  ["toggle", "toggle switch boolean 开关"],
  ["thinking-states", "thinking status agent ai pending 思考 AI 状态"],
  ["reasoning-stream", "reasoning transcript agent stream 推理 过程"],
  ["streaming-text", "streaming text words token response 流式 文本"],
  ["matrix-loader", "matrix dots loader loading 点阵 加载器"],
  ["banner-stacking", "banner stack stacked toast queue 堆叠 横幅"],
  ["avatar-group-hover", "avatar group chips people hover 头像 人员"],
  ["notification-badge", "badge notification dot unread 角标 未读 红点"],
  ["number-pop-in", "number update metric value pop 数值 指标"],
];

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".css", ".html", ".js", ".jsx", ".mjs", ".scss", ".svelte", ".ts", ".tsx", ".vue",
]);

const HELP = `transitions-adapter.mjs [options]

Internal motion bridge for frontend-art-direction. It fetches the pinned
Transitions.dev Skill into a private cache when motion work needs it, then
returns a project-specific Review -> Apply -> Polish plan.

Options:
  --intent <text>          Motion job or UI state to solve
  --transition <id>        Pin one upstream transition id
  --phase review|apply|polish|all
  --project <path>         Optional project root for Review scanning
  --source-dir <path>      Reuse an existing transitions skill directory
  --cache <path>           Override the private source cache
  --offline                Do not fetch; use an existing cache only
  --format md|json         Output format (default: md)
  --output <path>          Write the plan instead of stdout
`;

function cacheBase() {
  if (process.env.FRONTEND_ART_DIRECTION_CACHE) return process.env.FRONTEND_ART_DIRECTION_CACHE;
  if (process.env.XDG_CACHE_HOME) return join(process.env.XDG_CACHE_HOME, "frontend-art-direction");
  if (process.platform === "darwin") return join(homedir(), "Library", "Caches", "frontend-art-direction");
  return join(homedir(), ".cache", "frontend-art-direction");
}

function defaultCacheRoot() {
  return join(cacheBase(), "transitions-dev", UPSTREAM_COMMIT);
}

function normalizeSourceRoot(candidate) {
  if (!candidate) return null;
  const absolute = resolve(candidate);
  if (existsSync(join(absolute, "transitions-dev", "SKILL.md"))) return absolute;
  if (existsSync(join(absolute, "skills", "transitions-dev", "SKILL.md"))) return join(absolute, "skills");
  if (existsSync(join(absolute, "SKILL.md")) && basename(absolute) === "transitions-dev") return dirname(absolute);
  return null;
}

function existingSourceCandidates(sourceDir) {
  const candidates = [
    sourceDir,
    process.env.FRONTEND_ART_DIRECTION_TRANSITIONS_DIR,
    join(process.cwd(), ".agents", "skills"),
    join(process.cwd(), ".codex", "skills"),
    join(homedir(), ".agents", "skills"),
    join(homedir(), ".codex", "skills"),
    join(homedir(), ".claude", "skills"),
    join(homedir(), ".cursor", "skills"),
  ];
  return candidates.map(normalizeSourceRoot).filter(Boolean);
}

function requiredRelativeFiles() {
  return UPSTREAM_FILES.map((file) => file.replace(/^skills\//, ""));
}

function sourceFilesPresent(root, { requirePolish = true } = {}) {
  const required = requiredRelativeFiles().filter((file) => requirePolish || !file.startsWith("transitions-polish/"));
  return required.every((file) => existsSync(join(root, file)));
}

function sourceInfo(root, status, error = undefined, commit = UPSTREAM_COMMIT) {
  const info = {
    repository: UPSTREAM_REPOSITORY,
    commit,
    root,
    status,
    transitionsSkill: root ? join(root, "transitions-dev", "SKILL.md") : null,
    polishSkill: root ? join(root, "transitions-polish", "SKILL.md") : null,
    terms: "https://transitions.dev/terms.html",
    redistribution: "The adapter fetches upstream files on demand; this package does not redistribute the upstream library.",
  };
  if (error) info.error = error;
  return info;
}

async function fetchText(url) {
  if (typeof fetch !== "function") throw new Error("Node 18+ fetch is unavailable");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "text/plain", "User-Agent": "frontend-art-direction-motion-bridge" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${url}`);
    return response.text();
  } finally {
    clearTimeout(timer);
  }
}

function copyPinnedFiles(repositoryRoot, destinationRoot) {
  const head = execFileSync("git", ["-C", repositoryRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  if (head !== UPSTREAM_COMMIT) {
    execFileSync("git", ["-C", repositoryRoot, "fetch", "--depth", "1", "origin", UPSTREAM_COMMIT], { stdio: "ignore" });
    execFileSync("git", ["-C", repositoryRoot, "checkout", "--detach", UPSTREAM_COMMIT], { stdio: "ignore" });
  }
  const verified = execFileSync("git", ["-C", repositoryRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  if (verified !== UPSTREAM_COMMIT) throw new Error(`Pinned commit mismatch: expected ${UPSTREAM_COMMIT}, got ${verified}`);
  for (const file of UPSTREAM_FILES) {
    const sourceFile = join(repositoryRoot, file);
    const destinationFile = join(destinationRoot, file.replace(/^skills\//, ""));
    mkdirSync(dirname(destinationFile), { recursive: true });
    copyFileSync(sourceFile, destinationFile);
  }
}

function tryGitSource(staging) {
  const checkout = join(tmpdir(), `frontend-art-direction-transitions-${process.pid}`);
  rmSync(checkout, { recursive: true, force: true });
  try {
    const env = {
      ...process.env,
      GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
      GIT_TERMINAL_PROMPT: "0",
    };
    execFileSync("git", ["clone", "--depth", "1", UPSTREAM_REPOSITORY + ".git", checkout], { stdio: "ignore", env });
    copyPinnedFiles(checkout, staging);
    return true;
  } catch {
    return false;
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
}

export async function ensureTransitionsSource({ cacheRoot = defaultCacheRoot(), sourceDir, offline = false } = {}) {
  for (const candidate of existingSourceCandidates(sourceDir)) {
    if (sourceFilesPresent(candidate)) {
      let commit = "unknown (existing source)";
      let status = "existing-unpinned";
      const metadataPath = join(candidate, "SOURCE.json");
      if (existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
          if (metadata.commit === UPSTREAM_COMMIT) {
            commit = UPSTREAM_COMMIT;
            status = "existing-pinned";
          }
        } catch {
          // Treat an unreadable cache manifest as an unpinned source.
        }
      }
      return sourceInfo(candidate, status, undefined, commit);
    }
  }

  const destination = resolve(cacheRoot);
  if (sourceFilesPresent(destination)) return sourceInfo(destination, "cached");
  if (offline) return sourceInfo(null, "unavailable", `No local Transitions.dev source was found at ${destination}`);

  const staging = `${destination}.partial-${process.pid}`;
  rmSync(staging, { recursive: true, force: true });
  mkdirSync(staging, { recursive: true });
  try {
    if (!tryGitSource(staging)) {
      for (const file of UPSTREAM_FILES) {
        const content = await fetchText(`${UPSTREAM_RAW_ROOT}${file}`);
        const destinationFile = join(staging, file.replace(/^skills\//, ""));
        mkdirSync(dirname(destinationFile), { recursive: true });
        writeFileSync(destinationFile, content);
      }
    }
    writeFileSync(join(staging, "SOURCE.json"), `${JSON.stringify({
      repository: UPSTREAM_REPOSITORY,
      commit: UPSTREAM_COMMIT,
      fetchedAt: new Date().toISOString(),
      files: UPSTREAM_FILES,
      terms: "https://transitions.dev/terms.html",
    }, null, 2)}\n`);
    mkdirSync(dirname(destination), { recursive: true });
    rmSync(destination, { recursive: true, force: true });
    renameSync(staging, destination);
    return sourceInfo(destination, "fetched");
  } catch (error) {
    rmSync(staging, { recursive: true, force: true });
    return sourceInfo(null, "unavailable", error instanceof Error ? error.message : String(error));
  }
}

function section(content, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`^##\\s+${escaped}\\s*\\n([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, "mi"));
  return match?.[1]?.trim() ?? "";
}

function firstHeading(content) {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
}

function compactText(value, max = 420) {
  const text = String(value ?? "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^\s*\|.*$/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function documentRecord(root, file) {
  const absolute = join(root, "transitions-dev", file);
  if (!existsSync(absolute)) return null;
  const content = readFileSync(absolute, "utf8");
  const id = file.replace(/^\d{2}-/, "").replace(/\.md$/, "");
  return {
    id,
    title: firstHeading(content) || BUILTIN_TRANSITIONS.find((item) => item.id === id)?.title || id,
    source: relativePath(root, absolute),
    absolute,
    when: compactText(section(content, "When to use")) || "Use the matching transition only when the visible state or relationship needs it.",
    html: compactText(section(content, "HTML usage"), 620),
    javascript: compactText(section(content, "JavaScript orchestration"), 620),
    content,
  };
}

function recordsFromSource(root) {
  if (!root || !existsSync(join(root, "transitions-dev"))) return BUILTIN_TRANSITIONS;
  const files = readdirSync(join(root, "transitions-dev"))
    .filter((file) => /^\d{2}-.+\.md$/.test(file))
    .sort();
  const records = files.map((file) => documentRecord(root, file)).filter(Boolean);
  return records.length > 0 ? records : BUILTIN_TRANSITIONS;
}

function expandIntent(intent) {
  const lower = String(intent ?? "").toLocaleLowerCase();
  const expanded = new Set(meaningfulTokens(intent));
  for (const [id, aliases] of ALIASES) {
    const words = aliases.split(" ");
    if (words.some((word) => word.length > 1 && lower.includes(word.toLocaleLowerCase()))) {
      expanded.add(id);
      for (const token of tokenize(aliases)) expanded.add(token);
    }
  }
  return [...expanded];
}

function scoreRecord(record, intentTokens) {
  const source = `${record.id} ${record.title} ${record.when} ${record.html ?? ""} ${record.keywords ?? ""}`.toLocaleLowerCase();
  const words = new Set(tokenize(source));
  const generic = new Set(["close", "cleanup", "reduced", "motion", "state", "transition", "animation", "use", "when"]);
  const hits = intentTokens.filter((token) => !generic.has(token) && (words.has(token) || source.includes(token)));
  const exact = intentTokens.filter((token) => record.id.includes(token));
  return { record, score: new Set(hits).size + (exact.length * 8), hits: [...new Set(hits)] };
}

export function selectTransitions(records, intent, { transition, limit = 3 } = {}) {
  if (transition) {
    const requested = String(transition).replace(/\.md$/, "").replace(/^\d{2}-/, "");
    const exact = records.find((record) => record.id === requested);
    if (exact) return [{ ...scoreRecord(exact, [requested]), confidence: "explicit" }];
  }
  const tokens = expandIntent(intent);
  const ranked = records
    .map((record) => scoreRecord(record, tokens))
    .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id));
  const meaningful = ranked.filter((item) => item.score >= 2).slice(0, limit);
  return meaningful.map((item) => ({
    ...item,
    confidence: item.score >= 6 ? "high" : item.score >= 3 ? "medium" : "low",
  }));
}

function inferStatePair(intent, record) {
  const text = `${intent} ${record?.id ?? ""}`.toLocaleLowerCase();
  if (/error|invalid|shake|错误|校验/.test(text)) return "valid -> invalid -> show what needs correction";
  if (/loading|skeleton|stream|thinking|matrix|shimmer|加载|流式|思考/.test(text)) return "waiting -> ready -> show what became available";
  if (/success|check|done|complete|成功|完成/.test(text)) return "idle -> complete -> confirm the action landed";
  if (/filter|tab|page|route|swap|切换|筛选|路由/.test(text)) return "old state -> new state -> preserve context while the object changes";
  if (/hover|tilt|avatar|tooltip|like|悬浮|点赞/.test(text)) return "resting -> engaged -> expose affordance without stealing focus";
  return "closed / idle -> open / active -> make the next available action legible";
}

function cleanupNote(record) {
  if (!record?.content) return "Keep the local state cleanup explicit; do not leave closing or replay classes behind.";
  const text = record.content;
  const notes = [];
  if (/setTimeout|remove\(\)|removeClass|classList\.remove/.test(text)) notes.push("preserve the documented close-state timeout and class removal");
  if (/offsetWidth|offsetHeight|reflow|requestAnimationFrame/.test(text)) notes.push("preserve the forced reflow/replay step when the animation must restart");
  if (/addEventListener|removeEventListener/.test(text)) notes.push("scope event listeners to the component and remove them on teardown");
  return notes.length > 0 ? notes.join("; ") : "No extra JS cleanup is documented; keep the state toggle idempotent and teardown-safe.";
}

function fallbackNote(record) {
  if (!record?.content) return "Keep the resting and final states readable without animation; use a static state for unsupported motion.";
  const hasReduced = /prefers-reduced-motion\s*:\s*reduce/.test(record.content);
  return hasReduced
    ? "Keep the upstream reduced-motion guard and retain a readable resting/final state when animation is disabled."
    : "Add a static state and a prefers-reduced-motion guard before applying this recipe.";
}

function applyRecord(record, source) {
  if (!record) {
    return {
      selected: false,
      source: null,
      steps: ["Do not invent a recipe; return to Review and name the state relationship first."],
    };
  }
  return {
    selected: true,
    transition: record.id,
    source: record.absolute ?? record.sourceUrl ?? join(source?.root ?? "", record.source),
    steps: [
      "Read the selected upstream reference before editing the target component.",
      "Copy only the variables, namespaced CSS, and documented hooks needed for this state.",
      "Preserve the documented close-state cleanup, replay reflow, and event teardown.",
      "Keep the prefers-reduced-motion guard and define a static/final-state fallback.",
      "Adapt selectors to the existing component instead of adding a motion dependency.",
    ],
  };
}

function polishPlan(source) {
  const polishPath = source?.polishSkill ?? null;
  return {
    source: polishPath,
    dimensions: ["duration", "distance", "scale", "blur", "easing"],
    rules: [
      "Infer usage before choosing a token; never replace a value only because a number is nearby.",
      "Make open states inviting and close states faster/quieter, except for symmetric swaps such as tabs and page side-by-side.",
      "Keep stagger totals short, reserve delay for intent gating or sequencing, and never delay dismissal.",
      "Use blur/scale/distance only when they explain a swap or spatial relationship; leave plain fades alone.",
    ],
  };
}

function scanMotion(projectRoot, records, intent) {
  if (!projectRoot) return [];
  const root = resolve(projectRoot);
  const hits = [];
  const files = walkFiles(root, { maxFiles: 3000, ignore: [".frontend-art-direction", ".cache", "docs", "references", "data", ".github", "bin", "scripts", "test", "tests", "__tests__"] });
  const patterns = [
    [/(modal|dialog|popover)/i, "modal"],
    [/(dropdown|menu|context-menu)/i, "menu-dropdown"],
    [/(drawer|sidebar|panel|sheet)/i, "panel-reveal"],
    [/(skeleton|placeholder|loading)/i, "skeleton-reveal"],
    [/(tooltip|popover-hint)/i, "tooltip"],
    [/(toast|snackbar|notification)/i, "toast"],
    [/(tabs?|segmented|filter)/i, "tabs-sliding"],
    [/(accordion|disclosure|collaps)/i, "accordion"],
    [/(shake|invalid|validation|error)/i, "error-state-shake"],
    [/(transition|animation|@keyframes|motion|duration-)/i, null],
  ];
  for (const file of files) {
    if (!TEXT_EXTENSIONS.has(extname(file).toLocaleLowerCase())) continue;
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (content.includes("\u0000")) continue;
    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index].trim();
      if (!line) continue;
      const match = patterns.find(([pattern]) => pattern.test(line));
      if (!match) continue;
      const explicit = match[1] && match[1] !== "transition" ? match[1] : undefined;
      const selected = selectTransitions(records, explicit || `${intent} ${line}`, { limit: 1 })[0];
      hits.push({
        path: relativePath(root, file),
        line: index + 1,
        signal: line.length > 220 ? `${line.slice(0, 217)}...` : line,
        candidate: selected?.record.id ?? null,
        confidence: selected?.confidence ?? "review-needed",
      });
      if (hits.length >= 24) return hits;
    }
  }
  return hits;
}

export async function buildMotionPlan({
  intent = "motion for a frontend interface",
  projectRoot,
  transition,
  phase = "all",
  sourceDir,
  cacheRoot,
  offline = false,
} = {}) {
  const source = await ensureTransitionsSource({ sourceDir, cacheRoot, offline });
  const records = recordsFromSource(source.root);
  const selected = selectTransitions(records, intent, { transition });
  const primary = selected[0]?.record ?? null;
  const review = {
    purpose: primary?.when ?? "Name the user-facing purpose before selecting a motion recipe.",
    statePair: inferStatePair(intent, primary),
    trigger: "Identify the real user or system trigger; do not animate on a decorative timer.",
    projectFindings: scanMotion(projectRoot, records, intent),
    decision: primary ? `Candidate: ${primary.id} (${selected[0].confidence} confidence).` : "No single recipe matched confidently; review the catalog before applying one.",
  };
  const apply = applyRecord(primary, source);
  return {
    intent,
    phase,
    source,
    selected: selected.map((item) => ({
      id: item.record.id,
      title: item.record.title,
      score: item.score,
      confidence: item.confidence,
      hits: item.hits,
      source: item.record.absolute ?? item.record.sourceUrl ?? item.record.source,
      when: item.record.when,
      html: item.record.html,
      javascript: item.record.javascript,
    })),
    workflow: {
      review: phase === "apply" || phase === "polish" ? undefined : review,
      apply: phase === "review" || phase === "polish" ? undefined : apply,
      polish: phase === "review" || phase === "apply" ? undefined : polishPlan(source),
    },
    guardrails: {
      motionPurpose: "feedback / continuity / reveal / comparison / progress / inspection / narrative",
      cleanup: cleanupNote(primary),
      reducedMotion: fallbackNote(primary),
      fallback: "The final state must remain understandable with animation removed, interrupted, or unsupported on the target device.",
    },
    next: primary
      ? `Read ${primary.absolute ?? primary.sourceUrl ?? primary.source}, then implement the smallest stateful version and verify it on the running surface.`
      : "Run Review against the project and choose one recipe only after the state relationship is clear.",
  };
}

function renderList(items, formatter) {
  return items?.length > 0 ? items.map((item, index) => `${index + 1}. ${formatter(item)}`).join("\n") : "- None";
}

export function renderMotionMarkdown(plan) {
  const selected = plan.selected.length > 0
    ? renderList(plan.selected, (item) => `**${item.id}** — ${item.confidence}; source: \`${item.source}\`\n   ${item.when}`)
    : "- No confident recipe selected; keep the motion static until Review names the relationship.";
  const findings = plan.workflow.review?.projectFindings ?? [];
  const findingText = findings.length > 0
    ? renderList(findings, (item) => `\`${item.path}:${item.line}\` — ${item.candidate ?? "manual review"} (${item.confidence}) — ${item.signal.replaceAll("`", "'")}`)
    : "- No project motion hits were supplied or found.";
  const review = plan.workflow.review ? `## Review

- Purpose: ${plan.workflow.review.purpose}
- State pair: ${plan.workflow.review.statePair}
- Trigger: ${plan.workflow.review.trigger}
- Decision: ${plan.workflow.review.decision}

Project signals:
${findingText}
` : "";
  const apply = plan.workflow.apply ? `## Apply

${renderList(plan.workflow.apply.steps, (step) => step)}

Selected source: ${plan.workflow.apply.source ? `\`${plan.workflow.apply.source}\`` : "none"}
` : "";
  const polish = plan.workflow.polish ? `## Polish

- Source: ${plan.workflow.polish.source ? `\`${plan.workflow.polish.source}\`` : "upstream polish source unavailable; use local motion guide"}
- Dimensions: ${plan.workflow.polish.dimensions.join(", ")}
${renderList(plan.workflow.polish.rules, (rule) => rule)}
` : "";
  return `# Internal Motion Plan

Intent: **${plan.intent}**
Phase: **${plan.phase}**

## Candidate Recipes

${selected}

${review}${apply}${polish}## Required Guardrails

- Motion purpose: ${plan.guardrails.motionPurpose}
- Cleanup: ${plan.guardrails.cleanup}
- Reduced motion: ${plan.guardrails.reducedMotion}
- Fallback: ${plan.guardrails.fallback}

## Source

- Repository: ${plan.source.repository}
- Pinned commit: \`${plan.source.commit}\`
- Status: **${plan.source.status}**
${plan.source.error ? `- Fetch note: ${plan.source.error}\n` : ""}
- ${plan.source.redistribution}

Next: ${plan.next}
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const phase = option(args, "phase", "all");
  const intent = option(args, "intent", args.positionals.join(" ") || "motion for a frontend interface");
  const plan = await buildMotionPlan({
    intent,
    projectRoot: option(args, "project"),
    transition: option(args, "transition"),
    phase,
    sourceDir: option(args, "source-dir"),
    cacheRoot: option(args, "cache"),
    offline: Boolean(args.options.offline),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? plan : renderMotionMarkdown(plan), {
    format,
    output: option(args, "output"),
  });
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
