# Architecture

## Why The Repository Was Rebuilt

The previous version had useful judgment but too much of it was loaded at once. Similar rules were repeated across many long references, while the repository had no deterministic project scan, no local design candidate generator, and no package-level validation. That made the skill expensive to read, difficult to audit, and easy to apply as a style lecture instead of an implementation workflow.

The new shape is intentionally small:

```text
SKILL.md -> route and quality contract
references/ -> mode-specific decisions
scripts/ -> deterministic local evidence and validation
data/ -> candidate profiles, styles, types, palettes, motion, stacks, visual directions, reference lenses, product reference sources, build recipes
templates/ -> artifacts that persist project decisions
live -> page-level surface mode, design action, browser-variant evidence protocol
research-atlas -> persisted inspection evidence, section winners, synthesis, and template-risk gate
design-loop -> 20-round production plan, linked session, quality rubric, and signoff gate
```

## Reference Capabilities, Implemented Locally

The design was informed by public projects, but the package does not claim that a reference name alone is an integration. Each capability below has a local executable path. No upstream skill library is vendored into this package:

- [OpenAI Product Design and Frontend App Builder skills](https://github.com/openai/role-specific-plugins/tree/main/plugins/product-design/skills): `scripts/reference-scout.mjs`, `references/reference-discovery.md`, and `references/verification.md` separate reference discovery, concept direction, implementation, and visual QA instead of treating a prompt as sufficient visual specification.
- [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design): product purpose, audience, conceptual direction, typography, color, composition, and motion are resolved before decorative implementation; local profiles, styles, and anti-pattern gates reject generic AI-looking defaults.
- [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): `scripts/design-brief.mjs` and `data/quality-gates.json` provide local searchable design candidates, scene dials, anti-patterns, and pre-delivery gates.
- [Graphify](https://github.com/Graphify-Labs/graphify): `scripts/project-graph.mjs` builds file/package/import edges, exposes unresolved imports, and answers queries with graph neighborhoods.
- [Caveman](https://github.com/JuliusBrussee/caveman): `scripts/audit.mjs` emits a compact `Decision / Changed / Proof / Open` report with a bounded evidence set instead of a catalog dump.
- [Composio's curated skills](https://github.com/ComposioHQ/awesome-claude-skills): `scripts/resource-catalog.mjs` groups resources by missing job and returns practical entry points plus rejection conditions.
- [VoltAgent's curated skills](https://github.com/VoltAgent/awesome-agent-skills): resource records carry source type, trust tier, provenance, license boundary, and verification requirements.
- [Transitions](https://transitions.dev/skill): `scripts/transitions-adapter.mjs` separates Review, Apply, and Polish, and returns purpose, cleanup, reduced-motion, and fallback guardrails. It fetches a pinned upstream commit into a private cache instead of redistributing the upstream library.
- [Rare UI](https://www.rareui.com/), [Rewamp UI](https://www.rewampui.com/components), [Beautiful UI](https://beautifului.dev/), [beUI](https://beui.dev/), [Magic UI](https://magicui.design/), [React Bits](https://reactbits.dev/), [Aceternity UI](https://ui.aceternity.com/), [Obsidian UI](https://www.obsidianui.dev/), [Bencho](https://bencho.dev/), [Design Spells](https://designspells.com/), and [shadcn/ui](https://ui.shadcn.com/): `scripts/reference-composition.mjs` stores their distinct jobs, visual lenses, borrow/reject rules, and translation guidance in `data/reference-lenses.json`; it selects only the references relevant to the current product question.
- Reference-led generation: `scripts/reference-build.mjs` combines a one-sentence request, a primary reference, local project evidence, and `data/reference-recipes.json` into a visual genome, first-viewport plan, page sections, component grammar, state/motion contract, responsive plan, asset fallback, build order, and acceptance gates.
- Asset quality: `references/assets.md`, the `asset-readiness` gate, and the evidence templates make user-provided, sourced, generated, and deliberate assetless paths explicit; placeholder or low-quality filler is rejected before visual acceptance.
- Premium finish: `references/premium-finish.md` and the `premium-finish` gate turn “高级/有质感” into a grayscale, type, material, spacing, copy, asset, and interaction pass instead of a style keyword.
- Visual composition, geometry, creative divergence, authority, and completion: `scripts/visual-direction.mjs`, `scripts/creative-process.mjs`, `scripts/completion-contract.mjs`, `scripts/authority.mjs`, `data/visual-directions.json`, `data/visual-treatments.json`, `data/constraint-policy.json`, `references/visual-composition.md`, `references/geometry-language.md`, `references/creative-direction.md`, and `references/product-prototype.md` keep local candidates from becoming a visual template, define edge/corner/separation/line behavior, protect hard invariants, and prevent a polished first viewport from standing in for a finished surface.
- Creative divergence: open requests receive three provisional structural concept frames from `visual-direction`; `--concept` can accept one, while an authored direction, inspected reference, or project authority can replace the set. The frames are hypotheses for comparison, not universal page types.
- Product reference discovery: `scripts/reference-scout.mjs` ranks official product sources by category, quality signals, and distinct job; it does not claim that a URL was inspected and it does not use geography as a quality quota.
- Page-level visitor routing: `scripts/surface-mode.mjs` classifies the current route as `Persuade`, `Operate`, `Read`, or `Experience` with confidence and evidence, while `scripts/design-operation.mjs` translates visual feedback into one bounded action without forcing a product genre.
- Live visual iteration: `scripts/live-iteration.mjs` persists a provider-neutral development session for baseline capture, bounded variants, accept/discard decisions, source diffs, and after-capture proof. `live close` requires valid local captures for the baseline, at least two variants, and the final render, plus an existing source diff for accepted variants. It is an execution handoff and evidence journal; it does not pretend to capture a browser by itself.
- Design production loop: `scripts/design-loop.mjs` turns the research synthesis into 20 executable checkpoints from context and divergent concepts through complete construction, rendered critique, responsive/state proof, fresh-eyes review, and signoff. `start`, `record`, and `close` persist the session and enforce evidence gates; rounds 15-20 require local captures, rounds 16-19 require before/after captures, a comparison artifact, and a largest-gap repair record, round 19 requires a fresh-eyes critique artifact, and substantial sessions cannot skip rounds before `CURRENT WINS` signoff. The target project still supplies the actual browser captures and edits. `data/quality-rubric.json` keeps the quality bar explicit.
- Research atlas: `scripts/research-atlas.mjs` persists inspected references, user-reference triage, section-level winners, selected/unavailable skills, synthesis, and template-risk decisions. It requires local inspection evidence for selected sources. `design-loop start` creates and links one automatically, and `design-loop close` requires the atlas to be closed first.

The package remains dependency-free and local-only for `inspect`, `map`, `graph`, `brief`, `reference`, `scout`, `reference-build`, `resource`, `audit`, and `check`. Motion work is the deliberate exception: the internal adapter may fetch the pinned upstream Skill on first use, but it does not install an animation runtime or change the target project's dependency manifest.

The Product or Experience Signal Contract is the semantic floor beneath visual freedom. It selects the right evidence mode: functional work can require an object, task, action, result, data, state, and vertical slice; narrative or art-directed work can require a subject, thesis, attention path, proof, and ending. It constrains intent, not composition, medium, page genre, or interaction model.

The Completion Contract sits after that signal and defines the actual delivery boundary. It is intentionally scope-aware: a full route, narrative scene, specimen workbench, and single component have different completion floors, but none can claim completion from a polished first viewport alone.

`scripts/creative-process.mjs` also emits a shared screenshot/image iteration plan used by `direction`, `brief`, `reference-build`, and `audit`. `references/visual-iteration.md` defines actual capture, defect review, code repair, recapture, and optional screenshot editing through image generation. The agent executes the browser and image tools; the local utilities emit `planned-not-executed`, and audit leaves this stage pending. Generated revisions are proposals or assets, while actual rendered captures supply acceptance evidence.

## Integration Matrix

| Capability | Runtime entrypoint | Acceptance signal |
| --- | --- | --- |
| Design intelligence | `brief`, `audit` | profile, quality gates, anti-patterns, implementation checks |
| Visual direction and authority | `direction`, `brief`, `reference-build`, `audit` | candidate versus authored selection, composition/geometry contract, authority source, hard invariants, overrideable defaults, rendered proof |
| Repository graph | `graph`, `audit` | nodes, edges, query neighborhood, unresolved imports |
| Concise agent output | `audit` | fixed four-section contract and bounded evidence |
| Resource curation | `resource`, `audit` | ranked candidates, trust tier, source, avoid, verify |
| Reference composition | `reference`, `brief`, `audit` | 2-4 distinct lenses with borrow/reject/translate decisions |
| Product reference scouting | `scout`, `brief`, `audit` | category, official source candidates, quality signals, live-inspection prompts |
| Reference-led build | `reference-build` | one sentence -> implementation contract; primary reference remains explicit |
| Product/experience signal and completion | `direction`, `brief`, `reference-build`, `audit` | chosen evidence mode, declared scope, complete regions/states/responsive paths, and rendered ending/fallback |
| Visitor surface and design action | `surface-mode`, `design-operation`, `brief`, `audit` | per-route visitor job, explicit operation, evidence/confidence, and adaptive fallback |
| Motion workflow | `motion`, `audit` | Review -> Apply -> Polish plus four guardrails on every full run |
| Live visual iteration | `live` | baseline, two or more valid variants, acceptance decision, source diff, and after-capture proof |
| Research atlas | `research-atlas`, `design-loop` | inspected references, section winners, synthesis, selected/unavailable skills, and template-risk decision |
| Design production loop | `design-loop`, `brief`, `audit` | 20 checkpoints, linked research, persisted artifacts, quality rubric, rendered evidence, and scope-aware signoff |

## Runtime Flow

1. The agent sees a short name/description and loads `SKILL.md` only when relevant.
2. `SKILL.md` chooses fast polish, Product UI, Media-led, Reference-led build, or Direction-only.
3. `audit.mjs` runs the full pipeline: local files, repository graph, design intelligence, visual direction contract, per-surface visitor mode, design operation, 20-round production loop, complete reference inventory, reference/build contract, resource matrix, internal Transitions.dev motion review, live iteration contract, and one bounded decision report.
4. `inspect-project.mjs` and `project-graph.mjs` expose evidence, dependencies, hotspots, and gaps.
5. `design-brief.mjs` ranks local candidates and quality gates as candidate/inferred, then resolves a concrete visual direction before implementation; `authority.mjs` keeps hard invariants above all style choices and lets a project `DESIGN.md`, inspected reference, accepted concept, explicit user direction, or evidence-backed model proposal outrank local defaults.
6. `reference-composition.mjs` considers every saved UI lens, assigns distinct jobs, and rejects redundant or irrelevant lenses; it never treats a reference as permission to copy a whole surface.
7. `reference-scout.mjs` ranks product and brand sources separately from component/motion lenses, so a hardware site can borrow product storytelling without importing a component gallery skin; when a category source exists, it becomes the primary product reference for the build contract.
8. `reference-build.mjs` turns a named, scouted product, or supporting reference plus one sentence into an implementation contract; named references win, scouted product references lead category work, and component/motion lenses support rather than replace the primary visual grammar.
9. `resource-catalog.mjs` returns a small shortlist; it never installs a dependency or treats a URL as current API proof.
10. `transitions-adapter.mjs` resolves the pinned upstream source on every full audit and returns a project-specific `Review -> Apply -> Polish` plan, even when the final implementation chooses a static fallback.
11. `research-atlas` keeps external references inspectable: candidates become evidence only after local capture, section winners are compared by job, and the synthesis records what is rejected as well as what is borrowed.
12. `design-loop` keeps the substantial pass ordered: create choices, choose a thesis, extract the system, build the complete scope, then judge actual renders and states; its linked atlas must close before sign-off.
13. For a running development target, `live` records browser iteration evidence without claiming that a journal entry is a rendered pass.
14. The implementation is verified at static, runtime, and visual layers.

## Maintenance Rules

- Keep `SKILL.md` under 220 lines and move conditional detail into references.
- Keep local direction records as candidates; changes that add creative freedom should update `references/creative-direction.md` and an executable smoke path.
- Add a dataset record only when it changes a decision and has an explicit misuse risk.
- Keep scripts dependency-free unless a dependency removes substantial fragility.
- Every new script needs a smoke path in `npm test`.
- Every substantial design-loop session needs a closed research atlas with local evidence for selected references and an explicit synthesis before sign-off.
- Every substantial request carries the 20-round design production contract; small local repairs may batch or skip rounds only with a recorded reason.
- Every substantial output needs a scope-aware Completion Contract; do not use first-viewport proof as a substitute for full-scope proof.
- Every visual-direction record needs a first-viewport contract, type/spacing/surface/geometry rules, anti-AI checks, and rendered checks.
- Product-reference records are candidates; update their review date and inspect the live URL before relying on current details.
- Upstream motion sources are fetched into a private cache; do not copy the Transitions.dev library into this repository or publish it as part of this package.
- Do not claim a reference was inspected from its name alone.
- Do not turn one user's aesthetic preference or one anti-AI heuristic into a universal rule.
- Do not force a project-owned `DESIGN.md` into the saved direction IDs; use the IDs to fill missing fields only.
