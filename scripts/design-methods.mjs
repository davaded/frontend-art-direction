import { loadDataset } from "./lib.mjs";

function normalize(value) {
  return String(value ?? "").toLocaleLowerCase().replace(/[-_]+/gu, " ").replace(/\s+/gu, " ").trim();
}

function positiveMatch(text, term) {
  const needle = normalize(term);
  if (!needle) return false;
  let index = text.indexOf(needle);
  while (index >= 0) {
    const before = text.slice(0, index);
    const after = text.slice(index + needle.length);
    const bounded = /\p{Script=Han}/u.test(needle)
      || ((!before || !/[\p{L}\p{N}]/u.test(before.at(-1))) && (!after || !/^[\p{L}\p{N}]/u.test(after)));
    const negated = /(?:不要|不需要|不用|不使用|避免|拒绝|别用)\s*$/u.test(before)
      || /\b(?:no|not|without|avoid|exclude)\s*$/u.test(before);
    if (bounded && !negated) return true;
    index = text.indexOf(needle, index + needle.length);
  }
  return false;
}

export function selectDesignMethods(query = "", { limit = 3 } = {}) {
  const dataset = loadDataset("design-methods.json");
  const text = normalize(query);
  const sources = new Map(dataset.sources.map((source) => [source.id, source]));
  const candidates = dataset.methods.map((method) => {
    const signalHits = method.signals.filter((signal) => positiveMatch(text, signal));
    const sourceHits = method.sourceIds.filter((id) => {
      const source = sources.get(id);
      return positiveMatch(text, source.url) || source.aliases.some((alias) => positiveMatch(text, alias));
    });
    return { method, signalHits, sourceHits, score: sourceHits.length * 10 + signalHits.length };
  }).filter((candidate) => candidate.score > 0).sort((left, right) => right.score - left.score);
  const count = Math.max(0, Math.floor(Number(limit) || 0));
  const selected = candidates.slice(0, count).map(({ method, signalHits, sourceHits }) => ({
    ...method,
    status: "candidate-not-applied",
    matched: { signals: signalHits, sources: sourceHits },
    sources: method.sourceIds.map((id) => sources.get(id)),
    inspectNext: "Inspect the actual source frames/sequence or supplied material, then translate the chosen relationship into the target and verify wide/narrow/static states.",
  }));
  return {
    status: selected.length ? "candidates-render-pending" : "open-selection",
    selected,
    alternatives: candidates.slice(count).map(({ method, signalHits, sourceHits }) => ({ id: method.id, label: method.label, matched: { signals: signalHits, sources: sourceHits } })),
    available: dataset.methods.map(({ id, label }) => ({ id, label })),
    policy: "Methods are optional, composable and replaceable. Query matches are research leads, not a style decision; use project/reference/artist authority and the rendered target to choose, extend or reject them. No method sets a page genre, palette, type ceiling or layout quota.",
    evidence: "Source notes describe the reading performed, not implementation or visual acceptance; blocked and unviewed sources need inspection before borrowing specific decisions.",
    runtimeProof: "not-collected",
    guide: "references/design-methods.md",
    source: "data/design-methods.json",
  };
}

export function renderDesignMethods(selection) {
  if (!selection?.selected?.length) return "";
  const items = selection.selected.map((method) => `### ${method.label} (${method.status})

- Matched: ${[...method.matched.signals, ...method.matched.sources].join(", ")}
- Purpose: ${method.purpose}
- Translate: ${method.translate.join(" ")}
- Implement: ${method.implementation}
- Motion: ${method.motion}
- Narrow: ${method.narrow}
- Static/failure fallback: ${method.fallback}
- Inspect: ${method.inspectNext}
- Watch: ${method.watchFor.join("; ")}
- Render questions: ${method.renderQuestions.join(" ")}
- Sources: ${method.sources.map((source) => `[${source.label}](${source.url}) (${source.evidence.status}: ${source.evidence.note})`).join("; ")}`).join("\n\n");
  return `## Design Methods (Candidates)

${selection.policy}

${items}

${selection.alternatives.length ? `Other matching methods: ${selection.alternatives.map((method) => method.label).join("; ")}.\n\n` : ""}${selection.evidence} Runtime proof: ${selection.runtimeProof}.
`;
}
