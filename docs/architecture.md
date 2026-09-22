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
- Visual composition, geometry, and authority: `scripts/visual-direction.mjs`, `scripts/authority.mjs`, `data/visual-directions.json`, `data/visual-treatments.json`, `data/constraint-policy.json`, `references/visual-composition.md`, and `references/geometry-language.md` separate content structure from visual expression, define edge/corner/separation/line behavior, then protect hard invariants while keeping AI-default checks overrideable by project-owned, user-owned, reference-led, concept-led, or evidence-backed model direction.
- Product reference discovery: `scripts/reference-scout.mjs` ranks official product sources by category, quality signals, and distinct job; it does not claim that a URL was inspected and it does not use geography as a quality quota.

The package remains dependency-free and local-only for `inspect`, `map`, `graph`, `brief`, `reference`, `scout`, `reference-build`, `resource`, `audit`, and `check`. Motion work is the deliberate exception: the internal adapter may fetch the pinned upstream Skill on first use, but it does not install an animation runtime or change the target project's dependency manifest.

## Integration Matrix

| Capability | Runtime entrypoint | Acceptance signal |
| --- | --- | --- |
| Design intelligence | `brief`, `audit` | profile, quality gates, anti-patterns, implementation checks |
| Visual direction and authority | `direction`, `brief`, `reference-build`, `audit` | named composition grammar, authority source, hard invariants, overrideable defaults, type/spacing/surface/geometry rules, rendered proof |
| Repository graph | `graph`, `audit` | nodes, edges, query neighborhood, unresolved imports |
| Concise agent output | `audit` | fixed four-section contract and bounded evidence |
| Resource curation | `resource`, `audit` | ranked candidates, trust tier, source, avoid, verify |
| Reference composition | `reference`, `brief`, `audit` | 2-4 distinct lenses with borrow/reject/translate decisions |
| Product reference scouting | `scout`, `brief`, `audit` | category, official source candidates, quality signals, live-inspection prompts |
| Reference-led build | `reference-build` | one sentence -> implementation contract; primary reference remains explicit |
| Motion workflow | `motion`, `audit` | Review -> Apply -> Polish plus four guardrails on every full run |

## Runtime Flow

1. The agent sees a short name/description and loads `SKILL.md` only when relevant.
2. `SKILL.md` chooses fast polish, Product UI, Media-led, Reference-led build, or Direction-only.
3. `audit.mjs` runs the full pipeline: local files, repository graph, design intelligence, visual direction contract, complete reference inventory, reference/build contract, resource matrix, internal motion review, and one bounded decision report.
4. `inspect-project.mjs` and `project-graph.mjs` expose evidence, dependencies, hotspots, and gaps.
5. `design-brief.mjs` ranks local candidates and quality gates as candidate/inferred, then resolves a concrete visual direction before implementation; `authority.mjs` keeps hard invariants above all style choices and lets a project `DESIGN.md`, inspected reference, accepted concept, explicit user direction, or evidence-backed model proposal outrank local defaults.
6. `reference-composition.mjs` considers every saved UI lens, assigns distinct jobs, and rejects redundant or irrelevant lenses; it never treats a reference as permission to copy a whole surface.
7. `reference-scout.mjs` ranks product and brand sources separately from component/motion lenses, so a hardware site can borrow product storytelling without importing a component gallery skin; when a category source exists, it becomes the primary product reference for the build contract.
8. `reference-build.mjs` turns a named, scouted product, or supporting reference plus one sentence into an implementation contract; named references win, scouted product references lead category work, and component/motion lenses support rather than replace the primary visual grammar.
9. `resource-catalog.mjs` returns a small shortlist; it never installs a dependency or treats a URL as current API proof.
10. `transitions-adapter.mjs` resolves the pinned upstream source on every full audit and returns a project-specific `Review -> Apply -> Polish` plan, even when the final implementation chooses a static fallback.
11. The implementation is verified at static, runtime, and visual layers.

## Maintenance Rules

- Keep `SKILL.md` under 220 lines and move conditional detail into references.
- Add a dataset record only when it changes a decision and has an explicit misuse risk.
- Keep scripts dependency-free unless a dependency removes substantial fragility.
- Every new script needs a smoke path in `npm test`.
- Every visual-direction record needs a first-viewport contract, type/spacing/surface/geometry rules, anti-AI checks, and rendered checks.
- Product-reference records are candidates; update their review date and inspect the live URL before relying on current details.
- Upstream motion sources are fetched into a private cache; do not copy the Transitions.dev library into this repository or publish it as part of this package.
- Do not claim a reference was inspected from its name alone.
- Do not turn one user's aesthetic preference or one anti-AI heuristic into a universal rule.
- Do not force a project-owned `DESIGN.md` into the saved direction IDs; use the IDs to fill missing fields only.
