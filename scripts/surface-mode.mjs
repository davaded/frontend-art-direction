#!/usr/bin/env node

import {
  isMainModule,
  isUnderspecifiedRequest,
  meaningfulTokens,
  option,
  parseArgs,
  writeOutput,
} from "./lib.mjs";

const SURFACE_MODES = [
  {
    id: "persuade",
    label: "Persuade",
    question: "What should the visitor believe, value, or choose next?",
    jobs: ["brand and product stories", "marketing pages", "launches", "conversion paths"],
    terms: ["brand", "campaign", "landing", "marketing", "launch", "pricing", "signup", "product story", "官网", "品牌", "发布", "宣传", "转化"],
    strongTerms: ["campaign", "launch", "product story", "官网", "发布"],
    proof: "subject-specific proof, a clear value hierarchy, and a credible next action",
    avoid: "a slogan-first hero followed by interchangeable feature cards",
  },
  {
    id: "operate",
    label: "Operate",
    question: "What must the visitor do, and what state proves it worked?",
    jobs: ["apps", "editors", "dashboards", "forms", "configuration", "component workbenches"],
    terms: ["app", "dashboard", "editor", "tool", "workflow", "form", "settings", "builder", "configure", "component", "操作", "后台", "工作台", "编辑器", "表单", "设置", "配置", "控件"],
    strongTerms: ["app", "dashboard", "editor", "workflow", "后台", "工作台", "编辑器"],
    proof: "a real object, a primary action, and a visible result or recovery state",
    avoid: "a presentation shell that hides the active work behind decorative panels",
  },
  {
    id: "read",
    label: "Read",
    question: "What should the visitor understand, compare, or remember?",
    jobs: ["documentation", "reports", "editorial pages", "knowledge surfaces", "case studies"],
    terms: ["docs", "documentation", "article", "report", "essay", "knowledge", "manual", "case study", "read", "文档", "文章", "报告", "知识库", "说明", "案例"],
    strongTerms: ["docs", "documentation", "report", "knowledge", "文档", "知识库"],
    proof: "a legible reading order, evidence relationships, and a stable wayfinding path",
    avoid: "forcing every content page into a marketing hero or card grid",
  },
  {
    id: "experience",
    label: "Experience",
    question: "What should the visitor notice, feel, explore, or inhabit?",
    jobs: ["portfolios", "immersive stories", "galleries", "experimental pages", "spatial work"],
    terms: ["portfolio", "gallery", "immersive", "experimental", "narrative", "visual", "interactive", "showcase", "作品", "画廊", "沉浸", "实验", "叙事", "视觉", "展览"],
    strongTerms: ["portfolio", "immersive", "experimental", "narrative", "spatial", "作品", "沉浸", "实验", "叙事", "展览"],
    proof: "a specific subject, a deliberate attention path, and an authored transition or ending",
    avoid: "generic interaction effects without a subject or formal point of view",
  },
];

const MODE_BY_ID = new Map(SURFACE_MODES.map((mode) => [mode.id, mode]));

function scoreMode(query, mode) {
  const text = String(query ?? "").toLocaleLowerCase();
  const contains = (term) => {
    const normalized = term.toLocaleLowerCase();
    if (/^\p{Script=Han}+$/u.test(normalized)) return text.includes(normalized);
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`, "u").test(text);
  };
  const hits = mode.terms.filter(contains);
  const strongHits = (mode.strongTerms ?? []).filter(contains);
  return { score: hits.length + strongHits.length * 2, hits: [...new Set(hits)] };
}

export function classifySurfaceMode(query = "", { explicit = "" } = {}) {
  if (explicit && !MODE_BY_ID.has(explicit)) {
    throw new Error(`Unknown surface mode: ${explicit}. Expected persuade, operate, read, or experience.`);
  }

  if (explicit) {
    const mode = MODE_BY_ID.get(explicit);
    return {
      mode: explicit,
      label: mode.label,
      confidence: "explicit",
      evidence: { hits: [], source: "user" },
      candidates: SURFACE_MODES.map((item) => item.id),
      decision: mode.question,
      proof: mode.proof,
      avoid: mode.avoid,
      perSurface: true,
    };
  }

  const ranked = SURFACE_MODES
    .map((mode) => ({ mode, ...scoreMode(query, mode) }))
    .sort((left, right) => right.score - left.score || left.mode.id.localeCompare(right.mode.id));
  const top = ranked[0];
  const runnerUp = ranked[1];
  const underspecified = isUnderspecifiedRequest(query);
  const unresolved = underspecified || !top || top.score === 0 || top.score === runnerUp.score;
  const selected = unresolved ? null : top.mode;

  return {
    mode: selected?.id ?? "adaptive",
    label: selected?.label ?? "Adaptive surface",
    confidence: selected ? (top.score >= 2 ? "high" : "medium") : "provisional",
    evidence: {
      hits: selected ? top.hits : [],
      source: selected ? "query" : "awaiting surface evidence",
    },
    candidates: ranked.filter((item) => item.score > 0).map((item) => item.mode.id).slice(0, 3),
    decision: selected?.question ?? "Choose the visitor's primary job before fixing the page genre or interaction model.",
    proof: selected?.proof ?? "the subject, task, or reading path is legible before visual polish",
    avoid: selected?.avoid ?? "committing to a product type, layout, or visual skin from an underspecified request",
    perSurface: true,
  };
}

export function renderSurfaceMode(mode) {
  const candidates = mode.candidates.length > 0 ? mode.candidates.join(", ") : "none";
  return `## Surface Mode

- Mode: **${mode.mode}** (${mode.confidence})
- Scope: **per surface**; a single product may use different modes on different routes.
- Evidence: ${mode.evidence.source}${mode.evidence.hits.length > 0 ? ` (${mode.evidence.hits.join(", ")})` : ""}
- Decision question: ${mode.decision}
- Proof: ${mode.proof}
- Avoid: ${mode.avoid}
- Candidate modes: ${candidates}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(`surface-mode.mjs [options]\n\n  --query <text>     Page, route, or surface description\n  --mode <id>        Explicit mode: persuade|operate|read|experience\n  --format md|json   Output format (default: md)`);
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "");
  const surfaceMode = classifySurfaceMode(query, { explicit: option(args, "mode", "") });
  writeOutput(option(args, "format", "md") === "json" ? surfaceMode : renderSurfaceMode(surfaceMode), {
    format: option(args, "format", "md"),
    output: option(args, "output"),
  });
}

if (isMainModule(import.meta.url)) main();
