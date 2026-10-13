#!/usr/bin/env node

import { asNumber, isMainModule, isUnderspecifiedRequest, loadDataset, meaningfulTokens, option, parseArgs, writeOutput } from "./lib.mjs";

const HELP = `reference-scout.mjs [options]

Find quality-first references and discovery channels for any frontend direction.
This command is local-only: selected URLs are candidates for live inspection,
not proof that a source is current or suitable.

Options:
  --query <text>         Product, audience, or website description
  --profile <text>       Candidate product profile or surface mode
  --category <id>        Force a reference category
  --format md|json       Output format (default: md)
  --output <path>        Write the result instead of stdout
  --limit <number>       Candidate count (default: 4)
`;

const DEFAULT_CATEGORY = "general-product";
const GENERIC_SOURCE_TOKENS = new Set(["官网", "网站", "网页", "页面", "品牌", "设计", "产品", "landing", "website", "site", "page", "web"]);

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function categoryScore(category, tokens) {
  const hits = tokens.filter((token) => category.keywords.includes(token));
  return { score: new Set(hits).size, hits: unique(hits) };
}

function resolveCategory(categories, query, requested) {
  if (requested) {
    const exact = categories.find((category) => category.id === requested);
    if (exact) return { category: exact, confidence: "explicit", hits: [requested], score: 99 };
    throw new Error(`Unknown reference category: ${requested}`);
  }
  const tokens = meaningfulTokens(query);
  const ranked = categories
    .map((category) => ({ category, ...categoryScore(category, tokens) }))
    .sort((left, right) => right.score - left.score || left.category.id.localeCompare(right.category.id));
  const best = ranked[0]?.score > 0
    ? ranked[0]
    : ranked.find((item) => item.category.id === DEFAULT_CATEGORY) ?? ranked[0];
  return {
    category: best.category,
    confidence: best.score >= 3 ? "high" : best.score >= 1 ? "medium" : "low",
    hits: best.hits,
    score: best.score,
  };
}

function scoreSource(source, tokens, category) {
  const searchable = new Set(meaningfulTokens([
    source.id,
    source.label,
    ...(source.categories ?? []),
    ...(source.roles ?? []),
    ...(source.keywords ?? []),
    ...(source.visualSignals ?? []),
  ].join(" ")));
  const queryHits = unique(tokens.filter((token) => searchable.has(token)));
  const jobHits = unique((category.jobs ?? []).filter((job) => source.roles?.includes(job)));
  const categoryHit = source.categories?.includes(category.id) ? 8 : 0;
  const quality = Number(source.qualityTier ?? 1) * 1.5;
  const score = categoryHit + queryHits.length * 3 + jobHits.length * 2 + quality;
  return { score, queryHits, jobHits };
}

function selectCandidates(sources, tokens, category, limit) {
  const ranked = sources
    .map((source) => ({ source, ...scoreSource(source, tokens, category) }))
    .sort((left, right) => right.score - left.score || right.source.qualityTier - left.source.qualityTier || left.source.id.localeCompare(right.source.id));

  const selected = [];
  const coveredJobs = new Set();
  for (const item of ranked) {
    if (selected.length >= limit) break;
    const newJobs = item.jobHits.filter((job) => !coveredJobs.has(job));
    if (newJobs.length === 0 && item.queryHits.length === 0) continue;
    selected.push({
      id: item.source.id,
      label: item.source.label,
      sourceType: item.source.sourceType,
      qualityTier: item.source.qualityTier,
      official: Boolean(item.source.official),
      urls: item.source.urls,
      jobs: newJobs.length > 0 ? newJobs : item.jobHits,
      jobLabels: newJobs.length > 0 ? newJobs : item.jobHits,
      score: Number(item.score.toFixed(2)),
      confidence: item.score >= 24 ? "high" : item.score >= 14 ? "medium" : "low",
      why: item.queryHits.length > 0
        ? `匹配 ${item.queryHits.slice(0, 8).join(", ")}${newJobs.length > 0 ? `；覆盖 ${newJobs.join(", ")}` : ""}`
        : `覆盖 ${item.jobHits.slice(0, 4).join(", ")}`,
      visualSignals: item.source.visualSignals,
      borrow: item.source.borrow,
      reject: item.source.reject,
      inspect: item.source.inspect,
    });
    for (const job of item.jobHits) coveredJobs.add(job);
  }

  const selectedIds = new Set(selected.map((item) => item.id));
  const notSelected = ranked
    .filter((item) => !selectedIds.has(item.source.id))
    .slice(0, 6)
    .map((item) => ({
      id: item.source.id,
      label: item.source.label,
      reason: item.queryHits.length > 0 ? "有匹配，但当前职责已经被更高信号来源覆盖" : "当前类别没有足够直接匹配",
    }));

  return { selected, notSelected };
}

function discoveryJobs(query) {
  const jobs = ["composition", "responsive"];
  if (/dashboard|editor|app\b|workflow|settings|form|工作流|编辑器|表单|后台|任务/u.test(query.toLowerCase())) jobs.push("workflow", "component");
  if (/motion|animation|interaction|动效|动画|交互/u.test(query.toLowerCase())) jobs.push("interaction");
  if (/illustration|texture|photograph|artwork|moodboard|插画|摄影|材质|拼贴/u.test(query.toLowerCase())) jobs.push("material", "artwork");
  return unique(jobs);
}

export function scoutReferences(query = "", { profile = "", category: requestedCategory = "", limit = 4 } = {}) {
  const dataset = loadDataset("reference-sources.json");
  // An inferred profile must not turn an unrelated subject into hardware.
  const combined = query.trim() || profile.trim();
  const adaptiveDefault = !requestedCategory && isUnderspecifiedRequest(combined);
  const tokens = meaningfulTokens(combined).filter((token) => !GENERIC_SOURCE_TOKENS.has(token));
  const resolved = resolveCategory(dataset.categories, combined, requestedCategory);
  const active = !adaptiveDefault;
  const catalogMatch = active && (Boolean(requestedCategory) || (resolved.score > 0 && !["general-product", "premium-consumer"].includes(resolved.category.id)));
  const jobs = discoveryJobs(combined);
  const category = adaptiveDefault
    ? { id: "unspecified", label: "No category selected", confidence: "low", hits: [], score: 0, jobs: [], searchQueries: [] }
    : catalogMatch ? resolved.category : { id: "open-discovery", label: "Open discovery for the actual brief", jobs, searchQueries: [
      `${combined} website design original live site`,
      `${combined} full project composition responsive`,
    ] };
  const selection = catalogMatch
    ? selectCandidates(dataset.sources, tokens, resolved.category, Math.min(Math.max(Number(limit) || 4, 1), 6))
    : {
        selected: [],
        notSelected: dataset.sources.slice(0, 6).map((source) => ({
          id: source.id,
          label: source.label,
          reason: active ? "当前对象不属于这份硬件候选清单；转入开放搜寻" : "没有足够的对象、内容或任务信息",
        })),
      };
  return {
    query,
    profile: profile || null,
    category: {
      id: category.id,
      label: category.label,
      confidence: adaptiveDefault ? category.confidence : catalogMatch ? resolved.confidence : "open",
      matched: catalogMatch ? resolved.hits : [],
      jobs: category.jobs,
    },
    active,
    selectionPolicy: dataset.selectionPolicy,
    selected: selection.selected,
    notSelected: selection.notSelected,
    discoveryPlan: {
      status: active ? "live-inspection-required" : "brief-needed",
      jobs: active ? jobs : [],
      channels: active ? (dataset.discoveryChannels ?? [])
        .map((channel, index) => ({ ...channel, score: channel.roles.filter((role) => jobs.includes(role)).length, index }))
        .filter((channel) => channel.score > 0)
        .sort((left, right) => right.score - left.score || left.index - right.index)
        .slice(0, Math.min(Math.max(Number(limit) || 4, 1), 6))
        .map(({ score, index, ...channel }) => channel) : [],
      channelInventory: dataset.discoveryChannels ?? [],
      componentReserve: "Use reference-composition and resource-catalog for source-owned component or motion jobs after the full-page relationships are chosen.",
      policy: "These are discovery channels, never selected visual authorities. Follow the original source, record access failures honestly, and continue with an accessible alternative. Existing categories are accelerators, not the boundaries of design.",
    },
    liveSearchPlan: category.searchQueries,
    liveInspectionChecklist: adaptiveDefault
      ? ["先补充对象、受众、任务、内容类型或真实素材，再启动外部参考搜寻。"]
      : [
        "从画廊或作品找到原网站，检查第一视口、完整章节和结尾；不要只看一张展示图。",
        "分别记录每个区域的摆放、文字对齐、内容宽度、留白用途，以及和相邻区域的关系。",
        "记录对象、导航、章节顺序、素材类型、真实内容和使用/阅读路径。",
        "分别检查移动端首屏、图片/视频加载、键盘焦点、减少动态和无媒体 fallback。",
        "只把可迁移的层级、节奏、对象展示和交互关系带入目标项目；不要复制品牌或整页布局。",
      ],
    source: "data/reference-sources.json",
  };
}

function renderSource(item, index) {
  return `### ${index + 1}. ${item.label}

- Quality: **${item.qualityTier}/5** · ${item.official ? "official source" : "inspect source"} · ${item.confidence}
- Jobs: ${item.jobs.join(", ") || "supplementary context"}
- Why: ${item.why}
- URLs: ${item.urls.map((url) => `[official](${url})`).join(" · ")}
- Visual signals: ${item.visualSignals.join("；")}
- Borrow: ${item.borrow.join("；")}
- Reject: ${item.reject.join("；")}
- Inspect: ${item.inspect.join("；")}`;
}

export function renderReferenceScout(result) {
  const selected = result.selected.length > 0
    ? result.selected.map(renderSource).join("\n\n")
    : result.active ? "本地清单没有该对象的现成参考；按下面的渠道寻找并检查原网站，不套用硬件或电商结构。" : "先补充对象、受众、内容或任务，再启动外部参考搜寻。";
  return `# Reference Scout

Query: **${result.query || "(none)"}**
Category: **${result.category.label}** (${result.category.confidence})
Matched: ${result.category.matched.join(", ") || "none"}

## Selection Policy

${result.selectionPolicy.principles.map((item) => `- ${item}`).join("\n")}

## Selected Candidates

${selected}

## Live Search Plan

${result.liveSearchPlan.map((item) => `- ${item}`).join("\n")}

## Discovery Channels

${result.discoveryPlan.channels.map((channel) => `- [${channel.label}](${channel.url}): ${channel.use} ${channel.limit}`).join("\n") || "- Brief needed before choosing channels."}

${result.discoveryPlan.policy}

${result.discoveryPlan.componentReserve}

## Live Inspection Checklist

${result.liveInspectionChecklist.map((item) => `- ${item}`).join("\n")}

## Not Selected

${result.notSelected.length > 0 ? result.notSelected.map((item) => `- **${item.label}**: ${item.reason}`).join("\n") : "- No alternatives were left out."}

The catalog is a shortlist, not visual proof. Inspect the live source before calling a reference used.
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const result = scoutReferences(option(args, "query", args.positionals.join(" ") || ""), {
    profile: option(args, "profile", ""),
    category: option(args, "category", ""),
    limit: asNumber(option(args, "limit", 4), 4),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderReferenceScout(result), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
