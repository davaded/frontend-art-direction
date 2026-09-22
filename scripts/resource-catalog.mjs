#!/usr/bin/env node

import { asNumber, isMainModule, isUnderspecifiedRequest, loadDataset, meaningfulTokens, option, parseArgs, tokenize, writeOutput } from "./lib.mjs";

const HELP = `resource-catalog.mjs [options]

Select a small, provenance-aware set of resources for a named frontend job.
This command is local-only; source URLs are provenance and current docs still
need to be inspected before installation.

Options:
  --query <text>         Missing job or product context
  --job <text>           Explicit missing job
  --stack <text>         Framework or runtime context
  --category <name>      Filter by category
  --format md|json       Output format (default: md)
  --output <path>        Write the result instead of stdout
  --limit <number>       Candidate count (default: 5)
`;

const TRUST_LABELS = {
  5: "primary or local evidence",
  4: "maintainer source",
  3: "curated index",
  2: "secondary reference",
};

function recordText(record) {
  return [record.id, record.label, record.job, record.category, ...(record.keywords ?? []), ...(record.frameworks ?? [])].join(" ");
}

function scoreResource(record, queryTokens, stackTokens, category) {
  const keywordSet = new Set(tokenize(recordText(record)));
  const jobSet = new Set(tokenize(record.job));
  const frameworkSet = new Set(tokenize((record.frameworks ?? []).join(" ")));
  const queryHits = queryTokens.filter((token) => keywordSet.has(token));
  const jobHits = queryTokens.filter((token) => jobSet.has(token));
  const stackHits = stackTokens.filter((token) => frameworkSet.has(token) || keywordSet.has(token));
  const categoryHit = category && record.category === category;
  const agentQuery = queryTokens.some((token) => ["agent", "skill", "workflow", "resource", "catalog", "代理", "技能"].includes(token));
  const frontendQuery = queryTokens.some((token) => ["component", "form", "table", "motion", "animation", "chart", "3d", "icon", "frontend", "ui", "界面", "动效"].includes(token));
  const domainPenalty = record.category === "agent-workflow" && frontendQuery && !agentQuery ? 2 : 0;
  const localBoost = record.id === "local-primitives" ? 1.5 : 0;
  const score = queryHits.length * 2 + jobHits.length * 3 + stackHits.length * 1.5 + (categoryHit ? 4 : 0) + record.trustTier * 0.25 + localBoost - domainPenalty;
  return { score, queryHits: [...new Set(queryHits)], jobHits: [...new Set(jobHits)], stackHits: [...new Set(stackHits)] };
}

export function queryResources(query = "", { job = "", stack = "", category, limit = 5 } = {}) {
  const records = loadDataset("resources.json").resources;
  const combinedQuery = `${query} ${job}`.trim();
  const queryTokens = meaningfulTokens(combinedQuery);
  const stackTokens = meaningfulTokens(stack);
  const underspecified = !category && !job && isUnderspecifiedRequest(combinedQuery);
  const eligibleRecords = underspecified
    ? records.filter((record) => record.id === "local-primitives")
    : records;
  const ranked = eligibleRecords.map((record) => ({
    record,
    ...scoreResource(record, queryTokens, stackTokens, category),
  })).filter((item) => !category || item.record.category === category)
    .sort((left, right) => right.score - left.score || right.record.trustTier - left.record.trustTier || left.record.id.localeCompare(right.record.id));

  const selected = ranked.slice(0, limit).map((item) => ({
    ...item.record,
    score: Number(item.score.toFixed(2)),
    match: {
      query: item.queryHits,
      job: item.jobHits,
      stack: item.stackHits,
    },
    why: item.queryHits.length > 0 || item.jobHits.length > 0
      ? `matches ${[...new Set([...item.queryHits, ...item.jobHits])].slice(0, 6).join(", ")}`
      : item.record.id === "local-primitives" ? "lowest-cost first check" : "high-trust fallback for the named job",
    verifyBeforeUse: [
      item.record.sourceUrl ? `Inspect current source/docs: ${item.record.sourceUrl}` : "Inspect the local implementation directly.",
      item.record.licenseBoundary,
      item.record.accessibility,
      item.record.performance,
    ],
  }));

  return {
    query,
    job: job || null,
    stack: stack || null,
    category: category || null,
    selectionPolicy: underspecified
      ? "full catalog is retained for review; rank only local evidence until the missing product job is named"
      : "local primitive -> platform -> mature narrow primitive -> specialized resource",
    candidates: selected,
    rejectedByDefault: records.filter((record) => !selected.some((candidate) => candidate.id === record.id)).slice(0, 8).map((record) => ({
      id: record.id,
      label: record.label,
      reason: record.avoid,
    })),
  };
}

export function renderResourceMarkdown(result) {
  const candidates = result.candidates.length > 0
    ? result.candidates.map((candidate, index) => `### ${index + 1}. ${candidate.label}

- ID: \`${candidate.id}\`
- Job: ${candidate.job}
- Trust: **${candidate.trustTier}/5** (${TRUST_LABELS[candidate.trustTier] ?? "verify source"})
- Source type: **${candidate.sourceType}**${candidate.sourceUrl ? ` · [provenance](${candidate.sourceUrl})` : ""}
- Install policy: **${candidate.installPolicy}**
- Why: ${candidate.why}
- States: ${candidate.states}
- Avoid: ${candidate.avoid}
- Verify: ${candidate.verifyBeforeUse.join(" ")}`).join("\n\n")
    : "No resource matched the named job. Start with the local primitive and inspect the project manually.";
  return `# Resource Decision

Query: **${result.query || "(none)"}**${result.job ? ` · job: **${result.job}**` : ""}${result.stack ? ` · stack: **${result.stack}**` : ""}

Selection policy: ${result.selectionPolicy}

## Candidates

${candidates}

## Rejected By Default

${result.rejectedByDefault.length > 0 ? result.rejectedByDefault.map((item) => `- \`${item.id}\`: ${item.reason}`).join("\n") : "- No alternatives were ranked below the selected candidates."}

Do not install from this output alone. Inspect the current source/docs, license, state model, accessibility, performance cost, and fallback in the target project.
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "");
  const result = queryResources(query, {
    job: option(args, "job", ""),
    stack: option(args, "stack", ""),
    category: option(args, "category"),
    limit: asNumber(option(args, "limit", 5), 5),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderResourceMarkdown(result), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
