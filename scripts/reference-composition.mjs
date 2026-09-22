#!/usr/bin/env node

import { asNumber, isMainModule, isUnderspecifiedRequest, loadDataset, meaningfulTokens, option, parseArgs, tokenize, writeOutput } from "./lib.mjs";

const HELP = `reference-composition.mjs [options]

Compose a small reference set for one frontend job. References are assigned
distinct jobs; the command does not treat every reference as a checklist.

Options:
  --query <text>         Product, screen, or implementation question
  --profile <text>       Product profile or surface mode
  --style <text>         Existing or candidate design stance
  --motion <text>        Motion intent or grammar
  --format md|json       Output format (default: md)
  --output <path>        Write the composition instead of stdout
  --limit <number>       Maximum selected references (default: 4)
`;

const MOTION_TERMS = ["motion", "animation", "transition", "modal", "drawer", "panel", "route", "scroll", "hover", "loading", "动效", "动画", "过渡", "弹窗", "抽屉", "面板"];
const COMPONENT_TERMS = ["component", "primitive", "form", "dialog", "button", "table", "input", "library", "组件", "表单", "控件"];
const PRODUCT_TERMS = ["app", "application", "dashboard", "workspace", "editor", "settings", "tool", "product", "interface", "productive", "commerce", "ecommerce", "shop", "store", "checkout", "cart", "catalog", "transaction", "flow", "应用", "仪表盘", "工作台", "编辑器", "设置", "工具", "产品", "界面", "电商", "商品", "支付", "商城", "购物", "订单"];
const AI_TERMS = ["ai", "agent", "assistant", "streaming", "thinking", "approval", "tool", "chat", "代理", "流式", "思考"];
const DATA_TERMS = ["chart", "analytics", "data", "table", "dashboard", "monitoring", "chart", "数据", "分析", "监控"];
const SHOWCASE_TERMS = ["showcase", "gallery", "catalog", "portfolio", "landing", "demo", "展示", "画廊", "目录", "作品"];
const MICRO_INTERACTION_TERMS = ["micro", "microinteraction", "hover", "cursor", "press", "focus", "gesture", "feedback", "polish", "微交互", "悬停", "光标", "手势", "反馈", "细节"];

function hasAny(tokens, terms) {
  return terms.some((term) => tokens.includes(term));
}

function inferRoles(query, { profile = "", style = "", motion = "", motionSignal = false } = {}) {
  const queryTokens = meaningfulTokens(query);
  const tokens = meaningfulTokens(`${query} ${profile} ${style} ${motion}`);
  const roles = [];
  if (hasAny(tokens, PRODUCT_TERMS) || hasAny(tokens, COMPONENT_TERMS) || hasAny(tokens, ["accessibility", "keyboard", "focus", "状态", "可访问性"])) roles.push("foundation");
  if (hasAny(tokens, COMPONENT_TERMS) || hasAny(tokens, ["accessibility", "keyboard", "focus", "状态", "可访问性"])) roles.push("component-anatomy");
  if (hasAny(tokens, AI_TERMS)) roles.push("ai-product-patterns", "state-showcase");
  if (hasAny(tokens, DATA_TERMS)) roles.push("data-showcase");
  if (hasAny(tokens, SHOWCASE_TERMS)) roles.push("visual-language", "component-showcase");
  if (motionSignal || hasAny(queryTokens, MOTION_TERMS)) roles.push("motion-governance", "motion-language");
  if (hasAny(queryTokens, MICRO_INTERACTION_TERMS)) roles.push("micro-interaction");
  return [...new Set(roles)];
}

function scoreReference(reference, queryTokens, requiredRoles, contextTokens) {
  const searchable = new Set(tokenize(`${reference.id} ${reference.label} ${(reference.keywords ?? []).join(" ")} ${(reference.bestFor ?? []).join(" ")} ${(reference.roles ?? []).join(" ")} ${reference.visual?.family ?? ""} ${reference.visual?.layout ?? ""}`));
  const queryHits = queryTokens.filter((token) => searchable.has(token));
  const contextHits = contextTokens.filter((token) => searchable.has(token));
  const roleHits = requiredRoles.filter((role) => reference.roles?.includes(role));
  const roleScore = roleHits.length * 5;
  const queryScore = new Set(queryHits).size * 2;
  const contextScore = new Set(contextHits).size;
  return {
    score: roleScore + queryScore + contextScore,
    queryHits: [...new Set(queryHits)],
    contextHits: [...new Set(contextHits)],
    roleHits,
  };
}

function roleLabel(role) {
  const labels = {
    "visual-language": "视觉语言",
    "component-showcase": "组件展示",
    "motion-proof": "动效证明",
    "ai-product-patterns": "AI 产品状态",
    "state-showcase": "状态展示",
    "motion-language": "动效语言",
    "motion-governance": "动效治理",
    "data-showcase": "数据展示",
    foundation: "基础组件",
    "component-anatomy": "组件结构",
    "accessibility-reference": "可访问性基础",
    "quality-reference": "质量参考",
    "micro-interaction": "微交互参考",
    "optional-context": "补充视角",
  };
  return labels[role] ?? role;
}

function translationFor(reference, assignedRole) {
  if (assignedRole === "foundation" || assignedRole === "component-anatomy") return "借行为、语义、焦点和状态覆盖；目标项目重新拥有 tokens、密度、形状和组合方式。";
  if (assignedRole === "motion-language" || assignedRole === "motion-governance") return "只把动效绑定到真实状态关系，并保留 cleanup、reduced-motion 和静态最终态。";
  if (assignedRole === "ai-product-patterns" || assignedRole === "state-showcase") return "把过程状态当作产品对象设计，明确 loading、thinking、streaming、approval、success 和 error。";
  if (assignedRole === "data-showcase") return "借数据关系的可读性和交互提示，不复制演示数据或图表装饰。";
  if (assignedRole === "micro-interaction") return "借触发、反馈、节奏和最终态的关系；保留键盘、触摸、reduced-motion 和静态 fallback。";
  return "借构图、节奏、对比和展示方式；替换为目标产品的真实对象、内容、色彩和约束。";
}

export function selectReferenceComposition(query = "frontend interface", {
  profile = "",
  style = "",
  motion = "",
  motionSignal = false,
  limit = 4,
} = {}) {
  const selectionLimit = Math.min(Math.max(Number(limit) || 4, 1), 4);
  const references = loadDataset("reference-lenses.json").references;
  const adaptiveDefault = isUnderspecifiedRequest(query) && !profile && !style && !motion;
  const queryTokens = adaptiveDefault ? [] : meaningfulTokens(query);
  const contextTokens = adaptiveDefault ? [] : meaningfulTokens(`${profile} ${style} ${motion}`);
  const requiredRoles = adaptiveDefault ? [] : inferRoles(query, { profile, style, motion, motionSignal });
  const hasRoleSignal = requiredRoles.length > 0;
  const ranked = references.map((reference) => ({
    reference,
    ...scoreReference(reference, queryTokens, requiredRoles, contextTokens),
  })).sort((left, right) => right.score - left.score || left.reference.id.localeCompare(right.reference.id));

  const selected = [];
  const usedIds = new Set();
  const usedRoles = new Set();
  for (const role of requiredRoles) {
    const match = ranked.find((item) => !usedIds.has(item.reference.id) && item.reference.roles?.includes(role));
    if (!match) continue;
    const assignedRole = match.roleHits.find((candidate) => !usedRoles.has(candidate)) ?? match.roleHits[0] ?? role;
    selected.push({
      id: match.reference.id,
      label: match.reference.label,
      url: match.reference.url,
      sourceType: match.reference.sourceType,
      assignedRole,
      assignedRoleLabel: roleLabel(assignedRole),
      score: match.score,
      confidence: match.score >= 12 ? "high" : match.score >= 6 ? "medium" : "low",
      why: match.queryHits.length > 0 ? `命中 ${match.queryHits.slice(0, 6).join(", ")}` : `承担「${roleLabel(assignedRole)}」职责`,
      borrow: match.reference.borrow.slice(0, 3),
      reject: match.reference.reject.slice(0, 2),
      translate: translationFor(match.reference, assignedRole),
    });
    usedIds.add(match.reference.id);
    usedRoles.add(assignedRole);
    if (selected.length >= selectionLimit) break;
  }

  for (const item of ranked) {
    if (selected.length >= selectionLimit || usedIds.has(item.reference.id)) continue;
    if (item.score <= 0) continue;
    const availableRoles = (item.reference.roles ?? []).filter((role) => requiredRoles.includes(role) && !usedRoles.has(role));
    if (availableRoles.length === 0) continue;
    const assignedRole = availableRoles.find((candidate) => item.roleHits.includes(candidate)) ?? availableRoles[0];
    selected.push({
      id: item.reference.id,
      label: item.reference.label,
      url: item.reference.url,
      sourceType: item.reference.sourceType,
      assignedRole,
      assignedRoleLabel: roleLabel(assignedRole),
      score: item.score,
      confidence: item.score >= 12 ? "high" : item.score >= 6 ? "medium" : "low",
      why: item.queryHits.length > 0 ? `补充 ${item.queryHits.slice(0, 6).join(", ")}` : "补充一个不同职责的参考视角",
      borrow: item.reference.borrow.slice(0, 3),
      reject: item.reference.reject.slice(0, 2),
      translate: translationFor(item.reference, assignedRole),
    });
    usedIds.add(item.reference.id);
    usedRoles.add(assignedRole);
  }

  const notSelected = ranked.filter((item) => !usedIds.has(item.reference.id)).slice(0, 5).map((item) => ({
    id: item.reference.id,
    label: item.reference.label,
    reason: item.score > 0 ? "职责已由更高信号参考覆盖" : "当前任务没有命中其职责",
  }));
  return {
    query,
    context: { profile: profile || null, style: style || null, motion: motion || null },
    requiredRoles: requiredRoles.map((role) => ({ id: role, label: roleLabel(role) })),
    selectionPolicy: hasRoleSignal
      ? "每次最多 4 个：foundation + visual language + motion/state + micro-interaction/domain specimen；同一职责不重复堆参考。"
      : "没有明确的参考职责信号时，不强行选择外部视觉案例；先依据产品证据建立方向。",
    mode: hasRoleSignal ? "role-signaled" : "no-reference-default",
    selected,
    notSelected,
    rule: "参考只提供可迁移的决策，不提供整页复制许可；每个选中的参考必须同时写明 borrow、reject、translate。",
    source: "data/reference-lenses.json",
  };
}

export function renderReferenceComposition(result) {
  const selected = result.selected.length > 0
    ? result.selected.map((item, index) => `### ${index + 1}. ${item.label} · ${item.assignedRoleLabel}

- Confidence: **${item.confidence}** · ${item.why}
- Borrow: ${item.borrow.join("；")}
- Reject: ${item.reject.join("；")}
- Translate: ${item.translate}
- Source: [${item.sourceType}](${item.url})`).join("\n\n")
    : "没有明确参考职责；不强行套用外部视觉皮肤，先做本地证据扫描和产品方向判断。";
  return `# Reference Composition

Query: **${result.query}**

Selection policy: ${result.selectionPolicy}

Required roles: ${result.requiredRoles.map((role) => role.label).join("、")}

## Selected

${selected}

## Not Selected

${result.notSelected.length > 0 ? result.notSelected.map((item) => `- **${item.label}**: ${item.reason}`).join("\n") : "- No alternatives were left out."}

## Rule

${result.rule}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "frontend interface");
  const result = selectReferenceComposition(query, {
    profile: option(args, "profile", ""),
    style: option(args, "style", ""),
    motion: option(args, "motion", ""),
    motionSignal: Boolean(option(args, "motion", "")),
    limit: asNumber(option(args, "limit", 4), 4),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderReferenceComposition(result), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
