#!/usr/bin/env node

import { isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";
import { classifySurfaceMode } from "./surface-mode.mjs";

const OPERATIONS = [
  {
    id: "polish",
    label: "Polish",
    terms: ["polish", "refine", "premium", "quality", "质感", "高级", "精致", "打磨"],
    purpose: "tighten hierarchy, optical alignment, material behavior, copy, and state finish without replacing the thesis",
    defaultMode: "all",
  },
  {
    id: "layout",
    label: "Layout",
    terms: ["layout", "composition", "grid", "spacing", "square", "rigid", "方正", "僵硬", "排版", "布局", "分割线"],
    purpose: "change reading order, proportion, alignment, spacing, and edge relationships before decorative detail",
    defaultMode: "all",
  },
  {
    id: "typeset",
    label: "Typeset",
    terms: ["type", "typography", "font", "text", "headline", "字体", "文字", "排字", "标题"],
    purpose: "repair type roles, measure, language fit, line length, and hierarchy",
    defaultMode: "read",
  },
  {
    id: "bolder",
    label: "Bolder",
    terms: ["bold", "bolder", "stronger", "distinctive", "creative", "大胆", "鲜明", "创造力", "有个性"],
    purpose: "increase a chosen visual commitment while protecting subject truth and usability",
    defaultMode: "all",
  },
  {
    id: "quieter",
    label: "Quieter",
    terms: ["quiet", "quieter", "calm", "minimal", "simple", "克制", "安静", "简洁", "太吵"],
    purpose: "reduce competing treatments and return attention to the subject, task, or reading path",
    defaultMode: "all",
  },
  {
    id: "distill",
    label: "Distill",
    terms: ["distill", "simplify", "clean", "messy", "clutter", "乱", "复杂", "冗余", "简化"],
    purpose: "remove competing sections, equal-weight containers, and decorative decisions that do not carry meaning",
    defaultMode: "all",
  },
  {
    id: "harden",
    label: "Harden",
    terms: ["complete", "finish", "missing", "unfinished", "state", "完整", "不完整", "草稿", "缺少", "收尾"],
    purpose: "finish the declared scope, state matrix, responsive path, fallback, and ending before surface polish",
    defaultMode: "operate",
  },
  {
    id: "adapt",
    label: "Adapt",
    terms: ["mobile", "responsive", "touch", "tablet", "移动端", "响应式", "手机", "触摸"],
    purpose: "re-stage the composition and interaction model for the actual viewport and input method",
    defaultMode: "all",
  },
  {
    id: "animate",
    label: "Animate",
    terms: ["motion", "animation", "transition", "animate", "动效", "动画", "过渡"],
    purpose: "bind one purposeful transition to a real state relationship with cleanup, reduced-motion, and a static fallback",
    defaultMode: "all",
  },
  {
    id: "generate",
    label: "Generate",
    terms: ["variant", "concept", "direction", "reference", "mockup", "inspiration", "方案", "方向", "参考", "灵感"],
    purpose: "create a small set of structurally different visual hypotheses or browser variants for comparison",
    defaultMode: "all",
  },
];

function scoreOperation(query, operation) {
  const text = String(query ?? "").toLocaleLowerCase();
  const hits = operation.terms.filter((term) => text.includes(term.toLocaleLowerCase()));
  return { operation, hits: [...new Set(hits)], score: hits.length };
}

export function resolveDesignOperation(query = "", { mode = "" } = {}) {
  const ranked = OPERATIONS
    .map((operation) => scoreOperation(query, operation))
    .sort((left, right) => right.score - left.score || left.operation.id.localeCompare(right.operation.id));
  const top = ranked[0];
  const explicitOperation = top?.score > 0 ? top : null;
  const surfaceMode = mode ? classifySurfaceMode(query, { explicit: mode }) : classifySurfaceMode(query);
  const operation = explicitOperation?.operation ?? OPERATIONS.find((item) => item.id === "polish");
  const vague = /\b(?:better|improve|nice|good)\b|更好|优化|好看|变美|改善/u.test(String(query ?? "").toLocaleLowerCase());
  const needsDirection = vague && !explicitOperation;

  return {
    operation: operation.id,
    label: operation.label,
    confidence: explicitOperation ? (top.score >= 2 ? "high" : "medium") : "provisional",
    evidence: explicitOperation?.hits ?? [],
    purpose: operation.purpose,
    mode: surfaceMode.mode,
    needsDirection,
    directionQuestion: needsDirection
      ? "Which visible change matters most: hierarchy, composition, type, material, motion, or completeness?"
      : null,
    candidates: ranked.filter((item) => item.score > 0).map((item) => item.operation.id).slice(0, 4),
    next: needsDirection
      ? "Ask one direction question, then route the answer to a single operation before editing."
      : `Inspect the target state, apply ${operation.id}, then capture and compare the real render.`,
  };
}

export function renderDesignOperation(operation) {
  return `## Design Operation

- Operation: **${operation.operation}** (${operation.confidence})
- Surface mode: **${operation.mode}**
- Evidence: ${operation.evidence.length > 0 ? operation.evidence.join(", ") : "no explicit operation signal"}
- Purpose: ${operation.purpose}
- Next: ${operation.next}
- Candidate operations: ${operation.candidates.join(", ") || "polish"}
${operation.directionQuestion ? `- Direction question: ${operation.directionQuestion}\n` : ""}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(`design-operation.mjs [options]\n\n  --query <text>     User feedback or requested visual change\n  --mode <id>        Optional surface mode\n  --format md|json   Output format (default: md)`);
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "");
  const operation = resolveDesignOperation(query, { mode: option(args, "mode", "") });
  writeOutput(option(args, "format", "md") === "json" ? operation : renderDesignOperation(operation), {
    format: option(args, "format", "md"),
    output: option(args, "output"),
  });
}

if (isMainModule(import.meta.url)) main();
