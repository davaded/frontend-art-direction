const COMMON_REQUIREMENTS = [
  "declare the intended route, screen, scene, component, or experience scope before implementation",
  "finish every named region, chapter, specimen, or workflow step in that scope with real content or an intentional assetless treatment",
  "define desktop and target-mobile composition, reading order, overflow, and input behavior",
  "include the relevant loading, empty, error, fallback, reduced-motion, or stable-ending path",
  "exercise the complete first meaningful path and capture rendered evidence before handoff",
];

function modeOf(signal = {}) {
  return signal.mode ?? "open-experience";
}

export function buildCompletionContract({
  query = "",
  productSignal = {},
  pagePlan = [],
  componentGrammar = [],
  buildOrder = [],
  responsivePlan = null,
} = {}) {
  const mode = modeOf(productSignal);
  const sections = pagePlan.map((section) => section.id).filter(Boolean);
  const isProduct = mode === "product";
  const isAuthored = mode === "authored-experience";
  const scope = isProduct
    ? sections.some((section) => /specimen|component|catalog/i.test(section))
      ? "working component or product surface"
      : "complete functional surface"
    : isAuthored ? "complete authored experience" : "complete open-ended experience";
  const requirements = [
    ...COMMON_REQUIREMENTS,
    ...(isProduct
      ? [
        "the primary task can be completed from entry to visible result, with recovery when it fails",
        "all important product states named by the brief or component grammar are represented and reachable",
        "primary actions have a real destination, handler, or deliberate disabled reason; no dead CTA remains",
      ]
      : isAuthored
        ? [
          "the opening, development, and ending or stable final composition are all authored; do not stop at a hero or mood frame",
          "every major visual or motion device has a resolved final state and a static or reduced-motion reading",
          "the subject, text, media, sound, object, or spatial material carries the full argument of the piece",
        ]
        : [
          "choose and finish the work's own form, sequence, or ending before borrowing a familiar page genre",
          "the selected subject, material, or relationship remains legible across the complete surface",
          "one deliberate transition, stable ending, or usable path proves the chosen direction",
        ]),
  ];
  const forbidden = [
    "a first viewport presented as the finished page when the brief implies more content",
    "lower sections represented by headings, empty rectangles, repeated filler cards, or TODO copy",
    "a CTA, nav item, specimen control, or chapter marker that has no destination or state",
    "desktop-only completion with mobile overflow, missing media, or a collapsed reading order",
    "motion or imagery used to conceal unfinished content, missing states, or missing fallback",
  ];
  const proof = [
    "desktop screenshot of the complete intended scope",
    "target-mobile screenshot of the complete intended scope",
    "inspected baseline and recapture with observed defects, implemented repairs, and regression checks",
    "selected image revision and translated code/asset changes when generation was used; generated images are not runtime evidence",
    "one exercised end-to-end path, non-default state, transition, or stable ending",
    "console/build output and asset provenance where applicable",
  ];
  const planned = sections.length > 0 ? sections.join(", ") : "scope still needs to be declared from the request";
  return {
    id: "surface-completeness",
    mode,
    status: sections.length > 0 || buildOrder.length > 0 ? "scoped" : "scope-open",
    scope,
    query,
    plannedRegions: planned,
    requirements,
    forbidden,
    proof,
    doneWhen: isProduct
      ? "A user can enter, perform the primary task, see the result, recover from the relevant failure, and use the surface at the target viewport."
      : isAuthored
        ? "The piece has a deliberate opening, development, and ending or stable final state, with its subject and thesis intact at desktop and mobile."
        : "The chosen experience has a complete scope, coherent attention path, real material, and a deliberate transition or ending at desktop and mobile.",
    openEvidence: sections.length === 0
      ? ["Declare the intended full scope before implementation; do not use the first viewport as a substitute for a finished surface."]
      : [],
    responsivePlan: responsivePlan ? Object.values(responsivePlan).filter(Boolean) : [],
    componentCount: componentGrammar.length,
  };
}

export function renderCompletionContract(contract) {
  const list = (items) => (items ?? []).map((item) => `- ${item}`).join("\n") || "- None recorded.";
  return `## Completion Contract

- Scope: **${contract.scope}**
- Mode: **${contract.mode}**
- Status: **${contract.status}**
- Planned regions: ${contract.plannedRegions}
- Done when: ${contract.doneWhen}

Must ship:
${list(contract.requirements)}

Reject as incomplete:
${list(contract.forbidden)}

Proof required:
${list(contract.proof)}
${contract.openEvidence.length > 0 ? `
Open scope decision:
${list(contract.openEvidence)}
` : ""}`;
}
