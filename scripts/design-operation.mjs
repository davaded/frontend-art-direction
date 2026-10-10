#!/usr/bin/env node

import { isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";
import { classifySurfaceMode } from "./surface-mode.mjs";

const OPERATIONS = [
  {
    id: "shape",
    label: "Shape",
    terms: ["shape", "structure", "wireframe", "information architecture", "ux structure", "结构", "规划", "信息架构", "用户流程"],
    purpose: "decide the experience structure, protagonist, reading order, and core interaction before visual polish",
    defaultMode: "all",
  },
  {
    id: "audit",
    label: "Audit",
    terms: ["audit", "accessibility", "a11y", "contrast", "performance", "technical quality", "responsive qa", "审计", "可访问性", "对比度", "性能", "技术质量"],
    purpose: "find deterministic accessibility, performance, responsive, and implementation-quality defects without pretending a detector can judge taste",
    defaultMode: "all",
  },
  {
    id: "critique",
    label: "Critique",
    terms: ["critique", "visual review", "design review", "emotional resonance", "cognitive load", "审美评审", "视觉评审", "认知负担", "层级判断"],
    purpose: "evaluate hierarchy, clarity, emotional register, subject fit, and template risk with fresh rendered evidence",
    defaultMode: "all",
  },
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
    id: "colorize",
    label: "Colorize",
    terms: ["colorize", "color", "palette", "monochrome", "gray", "grey", "dull", "flat color", "颜色", "色彩", "配色", "灰", "单调", "暗淡"],
    purpose: "use color as hierarchy, meaning, and atmosphere while preserving brand, semantic roles, and contrast",
    defaultMode: "all",
  },
  {
    id: "clarify",
    label: "Clarify",
    terms: ["clarify", "copy", "microcopy", "label", "instruction", "unclear", "confusing text", "文案", "微文案", "标签", "说明", "不清楚", "看不懂"],
    purpose: "repair unclear copy, labels, error messages, and instructions before adding visual decoration",
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
    id: "delight",
    label: "Delight",
    terms: ["delight", "joy", "personality", "memorable", "fun", "surprise", "delightful", "惊喜", "愉悦", "有趣", "记忆点", "个性"],
    purpose: "add one meaningful moment of personality or joy after the core hierarchy, states, and fallback are sound",
    defaultMode: "experience",
  },
  {
    id: "harden",
    label: "Harden",
    terms: ["complete", "finish", "missing", "unfinished", "state", "完整", "不完整", "草稿", "缺少", "收尾"],
    purpose: "finish the declared scope, state matrix, responsive path, fallback, and ending before surface polish",
    defaultMode: "operate",
  },
  {
    id: "onboard",
    label: "Onboard",
    terms: ["onboarding", "onboard", "first run", "activation", "welcome", "getting started", "首次使用", "首次运行", "引导", "激活", "欢迎"],
    purpose: "make first-run context, activation, empty states, and the first successful action legible",
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
    id: "overdrive",
    label: "Overdrive",
    terms: ["overdrive", "technically extraordinary", "immersive", "webgl", "shader", "3d", "three.js", "parallax", "沉浸", "空间", "着色器", "技术炫技"],
    purpose: "explore technically ambitious effects only when they carry the subject or experience and retain a complete fallback",
    defaultMode: "experience",
  },
  {
    id: "optimize",
    label: "Optimize",
    terms: ["optimize", "slow", "jank", "latency", "bundle", "load time", "paint", "卡顿", "延迟", "包体", "加载速度", "性能优化"],
    purpose: "reduce measured runtime, loading, paint, bundle, or interaction cost without flattening the visual thesis",
    defaultMode: "all",
  },
  {
    id: "extract",
    label: "Extract",
    terms: ["extract", "tokens", "components", "reusable", "design system", "component system", "提取", "设计令牌", "组件系统", "可复用"],
    purpose: "pull observed tokens, component families, and repeated relationships into a source-owned design system without exporting the reference skin",
    defaultMode: "all",
  },
  {
    id: "document",
    label: "Document",
    terms: ["document", "design memory", "design spec", "design documentation", "product context", "设计文档", "设计记忆", "设计规范", "产品背景"],
    purpose: "persist the product truth, chosen direction, exceptions, and evidence so later work does not drift back to the training median",
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
