# Frontend Art Direction

An execution-focused Codex skill for people who can ship frontend code but do not want the result to be ugly, opaque, or expensive to iterate.

It turns art direction into a small, inspectable loop:

```text
inspect -> choose -> build -> prove
```

The skill is deliberately opinionated about evidence and deliberately flexible about style. It does not force every product into a cinematic landing page, a dark dashboard, a component gallery, or a giant headline.

## Install

```bash
npx -y frontend-art-direction@latest
```

Restart Codex after installing or updating. Then invoke it explicitly when useful:

```text
Use $frontend-art-direction to redesign this screen for real users.
```

## Local Developer Commands

The package contains dependency-free Node 18 utilities for the repository itself and for local project discovery:

```bash
npm test
npm run inspect -- /path/to/project --format md
npm run map -- /path/to/project --query "where is the main navigation?"
npm run graph -- /path/to/project --query "where is the main navigation?" --format md
npm run brief -- --query "inventory dashboard for warehouse operators" --format md
npm run direction -- --query "AI agent dashboard with approval modal" --profile productive-app --format md
npm run direction -- --query "experimental asymmetric editorial site" --authority artist --creative-direction "An authored typographic reading instrument" --format md
npm run reference -- --query "AI agent dashboard with approval modal" --format md
npm run scout -- --query "premium keyboard and mouse product website" --format md
npm run reference-build -- --query "Build a component gallery for our analytics SDK like Rare UI" --format md
npm run resource -- --query "accessible modal" --stack react --format md
npm run audit -- /path/to/project --query "inventory dashboard with partial data" --format md
```

The same commands are available through the package binary when it is resolved by npm:

```bash
frontend-art-direction inspect /path/to/project --format md
frontend-art-direction map /path/to/project --query "where is the settings form?"
frontend-art-direction graph /path/to/project --query "where is the settings form?"
frontend-art-direction brief --query "mobile editor for photographers"
frontend-art-direction direction --query "AI agent dashboard with approval modal" --profile productive-app
frontend-art-direction reference --query "AI agent dashboard with approval modal" --profile "agent workspace" --motion "modal continuity"
frontend-art-direction scout --query "premium hardware product website" --format md
frontend-art-direction reference-build --query "Build a component gallery for our analytics SDK like Rare UI" --project /path/to/project
frontend-art-direction resource --query "accessible modal" --stack react
frontend-art-direction audit /path/to/project --query "mobile editor with undo and loading"
frontend-art-direction motion --intent "filter list continuity" --project /path/to/project
frontend-art-direction check
```

All inspection commands are local-only and read-only by default. `inspect` gives a structural evidence map; `map` ranks relevant files and short source snippets; `graph` resolves relative imports, package edges, unresolved imports, and query neighborhoods; `brief` produces design candidates plus scene dials, quality gates, anti-patterns, implementation checks, and both UI-lens and product-reference candidates; `direction` resolves the concrete composition, constraint authority, alignment axis, dominant/counterweight, visual treatment, signature device, type ceiling, spacing rhythm, surface budget, and advisory AI-default checks; `reference` composes at most four implementation lenses after considering the full local inventory; `scout` ranks global official product references by category and quality signals; `reference-build` always produces an implementation-ready visual build contract; `resource` classifies the local decision catalog; `audit` runs the complete pipeline, including the internal Transitions.dev motion review by default. These are construction aids, not substitutes for inspecting or editing the target product. `check` validates the skill package and references.

The saved visual references have different jobs: [Rare UI](https://www.rareui.com/), [Rewamp UI](https://www.rewampui.com/components), [Magic UI](https://magicui.design/), [React Bits](https://reactbits.dev/), [Aceternity UI](https://ui.aceternity.com/), and [Obsidian UI](https://www.obsidianui.dev/) are source-owned visual or component lenses; Rewamp UI specifically contributes the searchable rail, stable single-specimen stage, action dock, and mobile re-staging pattern of a component workbench. [Beautiful UI](https://beautifului.dev/) and [beUI](https://beui.dev/) are state/motion specimen lenses; [Bencho](https://bencho.dev/) and [Design Spells](https://designspells.com/) are interaction research; [Transitions.dev](https://transitions.dev/skill) governs motion review; and [shadcn/ui](https://ui.shadcn.com/) supplies source-owned component behavior. They are lenses, not skins to copy wholesale.

When a request only names a product type and gives no example, the skill infers a provisional profile, style, type, palette, and motion grammar with confidence labels. For a request as open as “make a website”, it uses an adaptive default and does not assume commerce, dashboard, or editorial structure. When a real category is present, the product-reference scout feeds a quality-first product source into the build contract; component and motion lenses remain supporting evidence. It selects a saved lens only when a concrete job is present, such as component anatomy, data display, AI state, or motion governance; otherwise it leaves the reference set empty instead of inventing a visual skin.

An adaptive default is not a bland default. Content structure stays provisional, but the visual layer still receives a concrete stance such as `Quiet Editorial Studio`: a tonal canvas, restrained type contrast, one repeatable graphic device, deliberate material rules, and a bounded expression budget. The stance remains provisional until real content, assets, and a rendered target confirm it.

Visual rules are tiered. Accessibility, task/state completeness, responsive usability, asset truth, motion fallback, runtime integrity, and rendered proof are hard invariants. Profiles, treatments, anti-AI checks, and reference recipes are advisory defaults. A substantive project `DESIGN.md`, an inspected reference, an accepted concept, explicit user direction, or an evidence-backed model proposal can override those defaults when the direction remains coherent and the override is recorded and rendered.

For greenfield visual work with no live target, it can use a concept-first pass: generate a complete visual hypothesis, extract a small design system, implement the first viewport and states, then compare browser screenshots against the concept before handoff. Small existing-product fixes keep the implementation narrow, but still run the same audit and motion/reference checks.

`motion` is an always-on internal bridge in every full audit. It fetches the pinned Transitions.dev Skill into a private cache when needed, runs the `Review -> Apply -> Polish` plan with purpose, cleanup, reduced-motion, and fallback checks, and then lets the evidence decide whether the final surface stays static or uses motion. Users do not need to install transitions.dev or a motion library separately.

When a target project contains a substantive root `DESIGN.md`, `inspect`, `brief`, `reference-build`, and `audit` expose it as project-owned visual authority. The local directions remain gap-fill candidates. Use `--reference-inspected` after actually inspecting a supplied reference, or `--authority artist|model` when the current pass has an intentional authored direction. These flags do not disable accessibility, state, responsive, asset, motion fallback, runtime, or rendered-proof checks; they only prevent local anti-AI preferences from overriding a better visual decision.

For machine-readable output through npm scripts, add npm's quiet flag: `npm run --silent brief -- --query "..." --format json`.

## What It Changes In Practice

- starts with the user's workflow, device, content, and existing UI evidence
- keeps the core instructions small and loads detailed guidance only by mode
- makes type, component shape, motion, media readiness, and verification explicit decisions
- locks composition, alignment, type scale, spacing rhythm, and surface/card budget before decorative styling
- runs a premium-finish pass for grayscale hierarchy, optical alignment, material layers, specific copy, and restrained interaction instead of equating “高级” with gradients, glass, glow, or oversized type
- treats user-provided assets as authoritative and requires sourced or generated production-quality media instead of placeholders or low-quality filler
- uses mature primitives without inheriting their default visual identity
- requires a meaningful state transition and a reduced-motion or static fallback for substantial UI work
- reports proof separately from assumptions and blockers

## Package Shape

```text
SKILL.md                 short router and quality contract
references/              mode-specific guidance
scripts/                 inspect, graph, brief, direction, reference, reference-build, resource, audit, motion, validation
data/                    local decision, visual-direction, quality-gate, resource, lens, and recipe datasets
templates/               reusable DESIGN.md and evidence files
docs/                    architecture and maintenance notes
agents/openai.yaml       Codex display metadata
bin/                     installer and local command entrypoint
```

## Scope

This is a frontend judgment and execution aid. It does not replace product requirements, accessibility review, performance profiling, legal review of assets, or a real design system owned by the project. It also does not claim that a static build proves a polished interface.
