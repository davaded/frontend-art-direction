const PROFILE_SIGNALS = {
  "productive-app": {
    object: "the active work item, record, document, or selected detail",
    userJob: "complete one operational task with enough context to trust the result",
    coreLoop: "select -> inspect or change -> confirm -> preserve the updated context",
    primaryAction: "inspect or change the selected work item",
    visibleResult: "the selected item updates in place and exposes confirmation, error, or recovery",
    concreteData: "realistic labels, values, timestamps, status, and validation copy",
    prototypeInteraction: "select one item and complete the primary action before polishing secondary regions",
  },
  "creative-editor": {
    object: "the real image, canvas, crop, or edit preview",
    userJob: "make one visible change and understand what will be exported",
    coreLoop: "select object -> adjust -> preview -> undo or export",
    primaryAction: "apply one reversible adjustment to the selected object",
    visibleResult: "the object preview changes with an undoable state and export readiness",
    concreteData: "real media, adjustment values, crop bounds, and export status",
    prototypeInteraction: "change one control and keep the preview, value, and undo state synchronized",
  },
  "command-tool": {
    object: "the selected file, node, command result, or canvas object",
    userJob: "perform one focused build or inspection task without losing context",
    coreLoop: "focus -> act -> inspect result -> save or recover",
    primaryAction: "run or edit the focused command/object",
    visibleResult: "the result, dirty state, or error is visible beside the object that caused it",
    concreteData: "real file names, command output, identifiers, and actionable errors",
    prototypeInteraction: "focus one object, execute one action, and show its resulting state",
  },
  "data-workbench": {
    object: "the selected data record, chart, table, or live status",
    userJob: "answer one decision question from the available data",
    coreLoop: "filter or select -> inspect evidence -> compare -> act or save",
    primaryAction: "filter or select the data object that answers the current question",
    visibleResult: "the evidence updates while selected identity, freshness, and exceptions remain visible",
    concreteData: "named records, units, dates, freshness, totals, and partial/error labels",
    prototypeInteraction: "change one filter or row selection and preserve the detail context",
  },
  "commerce-flow": {
    object: "the actual product, variant, price, or order state",
    userJob: "inspect a product and make a confident selection or confirmation",
    coreLoop: "browse -> inspect -> configure -> confirm",
    primaryAction: "choose or confirm the product state shown on screen",
    visibleResult: "the selected variant, price, availability, or order state updates immediately",
    concreteData: "real product facts, variants, price, availability, and delivery/status copy",
    prototypeInteraction: "change one variant or confirmation control and expose the resulting state",
  },
  "hardware-product-story": {
    object: "the real hardware object, finish, configuration, or material detail",
    userJob: "understand why the object matters and inspect one meaningful configuration or proof",
    coreLoop: "observe -> inspect proof -> configure or compare -> continue",
    primaryAction: "inspect or configure the product object",
    visibleResult: "the object, specification, finish, or comparison state changes without losing identity",
    concreteData: "real product dimensions, materials, specifications, compatibility, and use context",
    prototypeInteraction: "switch one finish, angle, chapter, or specification and keep the object legible",
  },
  "editorial-marketing": {
    object: "the real product, work, person, place, or authored media that carries the claim",
    userJob: "understand the subject quickly and choose the next proof or action",
    coreLoop: "encounter subject -> inspect proof -> continue to a relevant chapter or action",
    primaryAction: "open, inspect, or continue from the actual subject",
    visibleResult: "the next proof, chapter, or action appears with continuity from the subject",
    concreteData: "specific subject facts, chapter labels, metadata, and outcome-oriented copy",
    prototypeInteraction: "open one chapter or proof state and preserve the subject as the anchor",
  },
  "portfolio-studio": {
    object: "the real project, case study, or authored work",
    userJob: "judge the work quickly and open the most relevant proof",
    coreLoop: "scan work -> open project -> inspect proof -> return or continue",
    primaryAction: "open the selected project or proof item",
    visibleResult: "the chosen work opens with its identity, context, and next step intact",
    concreteData: "real project names, roles, outcomes, dates, and media metadata",
    prototypeInteraction: "open one project and preserve the selected identity during the transition",
  },
  "media-experience": {
    object: "the playback item, waveform, conversation, or live state",
    userJob: "control or inspect the current media state without guessing what is happening",
    coreLoop: "load -> play or act -> monitor -> pause, recover, or continue",
    primaryAction: "control the current media state",
    visibleResult: "playing, paused, buffering, permission, or error state is explicit and actionable",
    concreteData: "real title, duration, progress, queue, status, and permission/error copy",
    prototypeInteraction: "toggle one playback state and keep progress, status, and controls coherent",
  },
  "component-workbench": {
    object: "the real interactive component specimen or target workflow",
    userJob: "inspect a component in context and decide whether it solves the target interaction",
    coreLoop: "browse -> select specimen -> change state or props -> copy or use",
    primaryAction: "interact with the selected specimen or copy its implementation",
    visibleResult: "the specimen changes state while its identity, props, and implementation context remain visible",
    concreteData: "real component names, props, labels, keyboard states, and usage constraints",
    prototypeInteraction: "change one specimen state and keep the preview, state label, and action context synchronized",
  },
  "adaptive-surface": {
    object: "the actual subject, object, content, or workflow named by the request",
    userJob: "complete the clearest task implied by that subject",
    coreLoop: "encounter subject -> choose one action -> see a meaningful result -> continue",
    primaryAction: "name one action on the subject before implementation",
    visibleResult: "the subject and its changed, inspected, or continued state remain visible",
    concreteData: "specific names, facts, units, labels, and state copy from the target domain",
    prototypeInteraction: "make one product-specific action work before adding decorative sections",
  },
};

const FUNCTIONAL_PROFILES = new Set([
  "productive-app",
  "creative-editor",
  "command-tool",
  "data-workbench",
  "commerce-flow",
  "media-experience",
  "component-workbench",
]);

const AUTHORING_TERMS = /\b(?:editorial|portfolio|landing|marketing|brand|campaign|story|narrative|experimental|art|artwork|visual)\b|官网|品牌|作品|叙事|实验|艺术|视觉|展览|海报/;
const FUNCTIONAL_TERMS = /\b(?:app|dashboard|editor|tool|workflow|form|settings|builder|command|analytics|data|table|chart|monitoring|player|audio|video|component|specimen|sdk|checkout|payment|interaction)s?\b|应用|后台|工作台|工具|流程|表单|设置|编辑器|分析|数据|表格|图表|监控|播放器|组件|控件|支付|交互/;

function inferSignalMode(query, profileId, profile) {
  const text = String(query).toLocaleLowerCase();
  if (AUTHORING_TERMS.test(text) && !FUNCTIONAL_TERMS.test(text)) return "authored-experience";
  if (FUNCTIONAL_PROFILES.has(profileId)) return "product";
  if (profileId === "hardware-product-story" && FUNCTIONAL_TERMS.test(text)) return "product";
  if (AUTHORING_TERMS.test(text) || profile?.surfaceMode === "Editorial Marketing") return "authored-experience";
  if (FUNCTIONAL_TERMS.test(text)) return "product";
  return "open-experience";
}

function inferProfileId(query, profileId) {
  if (profileId !== "adaptive-surface") return profileId;
  const text = String(query).toLocaleLowerCase();
  if (/component|specimen|ui\s*kit|组件|控件|sdk/.test(text)) return "component-workbench";
  if (/hardware|device|keyboard|mouse|monitor|laptop|phone|camera|audio|speaker|headphone|peripheral|硬件|设备|键盘|鼠标|显示器|电脑|手机|耳机|音箱|外设/.test(text)) return "hardware-product-story";
  if (/analytics|dashboard|data|chart|table|monitoring|分析|数据|图表|监控/.test(text)) return "data-workbench";
  if (/editor|crop|retouch|image|photo|design|编辑|修图|照片|图像/.test(text)) return "creative-editor";
  if (/audio|video|music|player|waveform|realtime|音频|视频|音乐|播放器|实时/.test(text)) return "media-experience";
  if (/portfolio|studio|case study|作品集|工作室|案例/.test(text)) return "portfolio-studio";
  if (/landing|marketing|brand|campaign|官网|品牌|发布|宣传/.test(text)) return "editorial-marketing";
  return profileId;
}

function first(values, fallback) {
  return values.find((value) => typeof value === "string" && value.trim()) ?? fallback;
}

export function buildProductSignal({
  query = "",
  profile = {},
  visualDirection = null,
  firstViewport = null,
  componentGrammar = [],
  referenceMode = "adaptive-no-reference",
} = {}) {
  const requestedProfileId = String(profile.id ?? "adaptive-surface").split(/\s+/)[0];
  const profileId = inferProfileId(query, requestedProfileId);
  const defaults = PROFILE_SIGNALS[profileId] ?? PROFILE_SIGNALS["adaptive-surface"];
  const mode = inferSignalMode(query, profileId, profile);
  const dominant = first([
    visualDirection?.firstViewport?.dominant,
    firstViewport?.mustShow?.[0],
    profile.anchor,
  ], defaults.object);
  const states = [...new Set([
    ...(profile.states ?? []),
    ...componentGrammar.flatMap((component) => component.states ?? []),
  ])].slice(0, 10);
  const productMode = mode === "product";
  const authoredMode = mode === "authored-experience";
  const provisional = mode === "open-experience" || !query.trim();
  const experience = {
    subject: dominant || "the subject, material, or world of the piece",
    audienceIntent: "decide what should be noticed, felt, understood, or remembered",
    attentionPath: "choose an authored reading, looking, listening, or spatial path",
    creativeThesis: "make one deliberate formal claim about the subject instead of averaging familiar website patterns",
    proof: "use specific media, text, artifact, object, or interaction that belongs to the chosen world",
    transition: "give one meaningful reveal, reframe, sequence, or state change; it may be atmospheric rather than transactional",
  };
  return {
    mode,
    status: productMode ? "draft-ready" : authoredMode ? "authored-direction" : "open-thesis",
    query,
    object: dominant,
    userJob: productMode ? defaults.userJob : null,
    coreLoop: productMode ? defaults.coreLoop : null,
    primaryAction: productMode ? defaults.primaryAction : null,
    visibleResult: productMode ? defaults.visibleResult : null,
    stateMatrix: productMode ? (states.length > 0 ? states : ["idle", "loading", "empty", "error", "success"]) : [],
    concreteData: productMode ? defaults.concreteData : null,
    firstViewportProof: productMode
      ? ["the actual product object or work surface", "the primary action attached to that object", "the next proof, result, or state change entering the viewport"]
      : ["the subject or world is legible", "the chosen point of view is visible", "the next moment, proof, or spatial relationship is intentionally introduced"],
    prototypeInteraction: productMode ? defaults.prototypeInteraction : null,
    experience,
    draftFloor: productMode
      ? [
        "one real object, artifact, record, or media item is visible",
        "one primary action is tied to that object",
        "one realistic state transition produces visible feedback",
        "one empty, error, loading, partial, or recovery path is meaningful",
        "the next result or proof is visible before decorative polish",
      ]
      : authoredMode
        ? [
          "the subject, world, or artifact is specific enough to carry the composition",
          "the point of view and formal thesis are visible without an explanatory essay",
          "the attention path has a deliberate order, tension, or spatial relationship",
          "real media, text, artifact, or authored content supplies proof",
          "one reveal, transition, or stable ending completes the chosen experience",
        ]
        : [
          "form an independent creative thesis before selecting a familiar genre",
          "choose what leads: subject, type, material, movement, sound, or space",
          "make the chosen relationship legible in the first viewport",
          "use real or deliberately authored content rather than filler",
          "prove the chosen experience at desktop and mobile before polish",
        ],
    referenceTranslation: referenceMode === "adaptive-no-reference"
      ? "References may shape material, rhythm, or interaction after the experience thesis is chosen; they cannot replace the target's subject or point of view."
      : "Translate the reference around the target's own subject, thesis, and attention path; reference fidelity cannot replace authorship.",
    antiShell: productMode
      ? "Reject a hero, slogan, CTA, decorative image, and generic feature grid when no product object, task, result, or state feedback is visible."
      : "A presentation surface is valid when it is the deliberate medium of the work; reject only an unintentional template with no subject, thesis, attention path, or authored proof.",
    openEvidence: provisional
      ? ["Choose the experience's subject and formal thesis before implementation; no product type, layout, or interaction genre is prescribed."]
      : [],
  };
}

export function renderProductSignal(signal) {
  const list = (items) => (items ?? []).map((item) => `- ${item}`).join("\n");
  if (signal.mode !== "product") {
    return `## Experience Signal Contract

- Mode: **${signal.mode}**
- Status: **${signal.status}**
- Subject or world: ${signal.experience.subject}
- Audience intent: ${signal.experience.audienceIntent}
- Attention path: ${signal.experience.attentionPath}
- Creative thesis: ${signal.experience.creativeThesis}
- Proof: ${signal.experience.proof}
- Transition or ending: ${signal.experience.transition}
- First viewport proof: ${signal.firstViewportProof.join("；")}

Draft floor:
${list(signal.draftFloor)}

- Freedom: no preset product type, page genre, layout, component system, or interaction model is required.
- Reference translation: ${signal.referenceTranslation}
- Shell check: ${signal.antiShell}
${signal.openEvidence.length > 0 ? `
Open creative decision:
${list(signal.openEvidence)}
` : ""}`;
  }
  return `## Product Signal Contract

- Status: **${signal.status}**
- Product object: ${signal.object}
- User and job: ${signal.userJob}
- Core loop: ${signal.coreLoop}
- Primary action: ${signal.primaryAction}
- Visible result: ${signal.visibleResult}
- Concrete content/data: ${signal.concreteData}
- State matrix: ${signal.stateMatrix.join(", ")}
- First viewport proof: ${signal.firstViewportProof.join("；")}
- Prototype interaction: ${signal.prototypeInteraction}

Draft floor:
${list(signal.draftFloor)}

- Reference translation: ${signal.referenceTranslation}
- Anti-shell check: ${signal.antiShell}
${signal.openEvidence.length > 0 ? `
Open product evidence:
${list(signal.openEvidence)}
` : ""}`;
}
