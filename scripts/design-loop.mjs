#!/usr/bin/env node

import { isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";
import { resolveDesignOperation } from "./design-operation.mjs";
import { classifySurfaceMode } from "./surface-mode.mjs";

const ROUNDS = [
  ["context", "Read the request, project, audience, device, and existing visual authority.", "requirement-frame", "human-design"],
  ["job", "Name the visitor's primary job and the result that proves it.", "surface-mode", "openai-context"],
  ["constraints", "Separate hard invariants from preferences, risks, and reversible choices.", "constraint-register", "frontend-design-codex"],
  ["evidence", "Inspect routes, components, tokens, content, assets, runtime entrypoints, and sibling surfaces.", "evidence-map", "avoid-ai-design"],
  ["references", "Choose references by missing job; extract visible relationships instead of copying skins.", "reference-ledger", "reference-composition"],
  ["vernacular", "Find the subject's materials, artifacts, culture, language, and visual vocabulary.", "subject-thesis", "anthropic-frontend-design"],
  ["defaults", "Run a first-order and second-order AI-default scan before choosing a direction.", "anti-default-review", "avoid-ai-design"],
  ["diverge", "Create 3-5 structurally different directions, not cosmetic palette variants.", "concept-set", "openai-ideate"],
  ["converge", "Choose one direction against subject fit, hierarchy, emotional register, feasibility, and responsive viability.", "direction-verdict", "ideo-create-choices"],
  ["contract", "Write the chosen composition, type, geometry, material, motion, asset, and exception contract.", "design-contract", "ui-ux-pro-max"],
  ["system", "Extract tokens, type roles, component families, icon grammar, and page-specific overrides.", "design-system", "ui-ux-pro-max-persist"],
  ["storyboard", "Plan the full surface, states, route transitions, responsive continuation, and ending.", "surface-storyboard", "frontend-app-builder"],
  ["assets", "Source or generate production-quality media and reject placeholders, fake metrics, and weak crops.", "asset-inventory", "frontend-app-builder"],
  ["skeleton", "Build the semantic and interactive skeleton with real content and the intended container model.", "working-surface", "frontend-app-builder"],
  ["baseline", "Run the target and capture the actual desktop, mobile, and relevant state before judging polish.", "baseline-captures", "design-review"],
  ["macro", "Fix the biggest visible defect first: scope, silhouette, hierarchy, composition, content, or media.", "macro-revision", "screenshot-critique"],
  ["responsive", "Re-stage the design for mobile, tablet, touch, text wrapping, and input behavior.", "responsive-captures", "design-review"],
  ["states", "Exercise loading, empty, error, success, focus, reduced-motion, transition, and recovery paths.", "state-captures", "ui-ux-pro-max"],
  ["fresh-eyes", "Compare before/after and run an unprimed critique without implementation history bias.", "independent-critique", "screenshot-critique"],
  ["signoff", "Run static, runtime, visual, accessibility, and scope checks; record what remains open and update design memory.", "evidence-pack", "design-qa"],
].map(([id, objective, artifact, source], index) => ({
  round: index + 1,
  id,
  objective,
  artifact,
  source,
  evidence: index < 14 ? "decision or saved design artifact" : "rendered capture, comparison, or verified check",
}));

export function buildDesignLoop({ query = "", surfaceMode = null, operation = null, scope = "substantial" } = {}) {
  const mode = surfaceMode ?? classifySurfaceMode(query);
  const action = operation ?? resolveDesignOperation(query, { mode: mode.mode === "adaptive" ? "" : mode.mode });
  return {
    id: "design-production-loop-v1",
    status: "ready",
    rounds: 20,
    scope,
    surfaceMode: mode,
    operation: action,
    execution: {
      rule: "Twenty checkpoints, not twenty blind rewrites. Batch independent observations, but every round must end in a decision, artifact, rendered comparison, or explicit skipped-with-reason record.",
      divergence: "Rounds 1-9 create and narrow choices; do not polish a weak direction before the verdict.",
      construction: "Rounds 10-15 turn the verdict into a complete, runnable surface before detail polish.",
      verification: "Rounds 16-20 use actual renders, fresh eyes, responsive/state evidence, and a final evidence pack.",
      stop: "Stop only when the declared scope is complete and the last material defect has a repair or an explicit blocker. Do not count a green build as visual acceptance.",
    },
    roundsDetail: ROUNDS,
  };
}

export function renderDesignLoop(loop, { compact = false } = {}) {
  const rounds = loop.roundsDetail.map((item) => compact
    ? `- ${item.round}. **${item.id}**: ${item.objective}`
    : `- ${item.round}. **${item.id}** · ${item.objective} Output: \`${item.artifact}\`; evidence: ${item.evidence}.`)
    .join("\n");
  return `## 20-Round Design Production Loop

- Status: **${loop.status}**
- Surface: **${loop.surfaceMode.label}** (${loop.surfaceMode.confidence})
- Design operation: **${loop.operation.label}** (${loop.operation.confidence})
- Rule: ${loop.execution.rule}
- Divergence: ${loop.execution.divergence}
- Construction: ${loop.execution.construction}
- Verification: ${loop.execution.verification}
- Stop: ${loop.execution.stop}

${rounds}
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(`design-loop.mjs [plan|start|status|record|close] [options]\n\n  plan                  Emit the 20-round contract (default)\n  start                 Persist a project session under .art-direction/design-loop/\n  status                Read a persisted session\n  record                Complete, skip, or block one round\n  close                 Enforce signoff gates and close a session\n  --project <path>      Target project root for a session\n  --session <id>        Session id or path\n  --round <number>      Round number for record\n  --status <value>      complete|skipped|blocked\n  --decision <text>     Decision recorded for a round\n  --evidence <paths>    Comma-separated artifact or capture paths\n  --proof <kinds>       Comma-separated proof kinds\n  --issues <items>      Comma-separated issue records, e.g. P2:crop\n  --score <1-10>        Quality score for the round or signoff\n  --reason <text>       Reason for a skipped or blocked round\n  --query <text>       Product, page, or feedback description\n  --mode <id>          persuade|operate|read|experience\n  --action <id>        design operation override\n  --scope <text>       declared delivery scope\n  --format md|json     Output format (default: md)`);
    console.log("  --largest-gap <text>  Largest visible gap found in rounds 16-19\n  --repair <text>       Concrete repair applied in rounds 16-19\n  --verdict <value>     CURRENT WINS|REFERENCE WINS|INCONCLUSIVE\n  --comparison <paths>  Before/after comparison artifact paths\n  --critique <paths>    Fresh-eyes critique artifact paths (round 19)");
    return;
  }
  const command = ["start", "status", "record", "close"].includes(args.positionals[0]) ? args.positionals[0] : "plan";
  if (command !== "plan") {
    const sessionApi = await import("./design-loop-session.mjs");
    const projectRoot = option(args, "project", process.cwd());
    let result;
    if (command === "start") {
      const created = sessionApi.createDesignLoopSession({
        projectRoot,
        query: option(args, "query", args.positionals.slice(1).join(" ") || ""),
        mode: option(args, "mode", ""),
        action: option(args, "action", ""),
        scope: option(args, "scope", "substantial"),
      });
      result = { ...created.session, sessionPath: created.path };
    } else if (command === "status") {
      result = sessionApi.getDesignLoopSession({ projectRoot, session: option(args, "session", "") });
    } else if (command === "record") {
      result = sessionApi.recordDesignLoopRound({
        projectRoot,
        session: option(args, "session", ""),
        round: option(args, "round", ""),
        status: option(args, "status", "complete"),
        decision: option(args, "decision", ""),
        evidence: option(args, "evidence", ""),
        proof: option(args, "proof", ""),
        issues: option(args, "issues", ""),
        score: option(args, "score", ""),
        dimensions: option(args, "dimensions", ""),
        reason: option(args, "reason", ""),
        largestGap: option(args, "largest-gap", ""),
        repair: option(args, "repair", ""),
        verdict: option(args, "verdict", ""),
        comparison: option(args, "comparison", ""),
        critique: option(args, "critique", ""),
      });
    } else {
      result = sessionApi.closeDesignLoopSession({ projectRoot, session: option(args, "session", "") });
    }
    const format = option(args, "format", "md");
    writeOutput(format === "json" ? result : sessionApi.renderDesignLoopSession(result, result.sessionPath), { format, output: option(args, "output") });
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "");
  const mode = option(args, "mode", "");
  const surfaceMode = classifySurfaceMode(query, { explicit: mode });
  const operation = resolveDesignOperation(option(args, "action", "") || query, { mode: surfaceMode.mode === "adaptive" ? "" : surfaceMode.mode });
  const loop = buildDesignLoop({ query, surfaceMode, operation, scope: option(args, "scope", "substantial") });
  const requestedRound = Number(option(args, "round", "0"));
  const output = requestedRound > 0 ? { ...loop, roundsDetail: loop.roundsDetail.filter((item) => item.round === requestedRound) } : loop;
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? output : renderDesignLoop(output), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
