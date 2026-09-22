---
name: frontend-art-direction
description: Use when building or improving frontend UI that must feel intentional, product-specific, and visually verified instead of generic, especially when the user names a reference website or asks for a similar visual experience. Covers apps, dashboards, editors, marketing surfaces, mobile or embedded UI, and meaningful motion or 3D. It is not for backend-only work or a tiny CSS fix unless explicitly invoked.
metadata:
  version: "1.0.0"
---

# Frontend Art Direction

Make the visible product better without making the process expensive, vague, or theatrical. The default outcome is working UI with a clear point of view, complete states, useful motion, and visual proof.

## Operating Contract

- Inspect the project before choosing a style, library, font, animation, or hero layout.
- Treat the user's workflow, content, device, and existing system as the source of truth. External references fill named gaps; they do not replace product understanding.
- Use a restrained product surface when content or media is weak. Strong expression must be earned by a real product, data, media, or spatial object.
- Asset priority is user-provided -> existing/official -> high-quality searched -> generated -> deliberate assetless composition. Never hand off placeholders, low-resolution filler, random stock, or visibly flawed generated media.
- Every substantial surface gets a premium-finish pass: grayscale hierarchy, optical alignment, type ceiling, material layers, specific copy, and one restrained authored detail. “Premium” is not a gradient, glass layer, giant heading, or empty whitespace.
- Reuse and repair local primitives first. Use mature components for common controls and adapt their tokens, density, and states instead of shipping their default look.
- Do not add a dependency to create a mood. Name the missing job, inspect the current library/docs, and choose the lightest compatible resource before installing anything.
- Every substantial pass has at least one meaningful state transition and a reduced-motion or static fallback.
- Before code, emit a Visual Direction Contract: composition grammar, alignment axis, dominant/counterweight, type ceiling, spacing rhythm, surface budget, visual treatment, signature device, authority source, and advisory AI-default checks.
- Separate hard invariants from visual preferences. Accessibility, task/state completeness, responsive usability, asset truth, motion fallback, runtime integrity, and rendered proof are hard; local anti-AI checks are advisory and may be overridden by a project-owned `DESIGN.md`, an inspected reference, an accepted concept, explicit user direction, or a strong model proposal with an override record.
- Run a creative-divergence check before implementation: if the model, artist, project memory, or reference yields a stronger coherent thesis than the local candidate, promote that thesis instead of preserving the candidate for consistency.
- Verify the rendered surface. Static code or a successful build is not visual acceptance.
- State facts, assumptions, missing evidence, and blockers. Do not spend the user's token budget on generic praise or a long design essay.

## Route The Request

Use the smallest mode that can answer the request:

1. **Fast polish**: one component, one state, or one local spacing/type/color problem. Inspect the local pattern, make the smallest visible change, and verify that state.
2. **Product UI**: app, dashboard, editor, settings, commerce, developer tool, or embedded surface. Optimize for task clarity, density, trust, state coverage, and responsive input behavior.
3. **Media-led**: landing, portfolio, launch, product story, model viewer, or spatial surface. Use this only when real media or a meaningful object can carry the first screen; otherwise downgrade to Product UI.
4. **Reference-led build**: the user says “像/类似/参考某个网站” or names a URL and expects a working result. Treat this as implementation work, not a moodboard request.
5. **Direction-only**: the user asks for options, a plan, or analysis without implementation. Return a compact direction decision and implementation contract.

Read [references/operating-modes.md](references/operating-modes.md) when the work is substantial, ambiguous, or likely to affect several screens.

## The Four Passes

### 1. Inspect

For every frontend request, start with the decision pipeline. Keep the scan and response compact for a tiny local fix, but do not skip the capability checks. `<skill-root>` means the directory containing this `SKILL.md`; if the installer does not expose it directly, resolve that directory before running the command:

```bash
node <skill-root>/scripts/audit.mjs <project-root> \
  --query "<product, screen, or implementation question>" --format md
```

It runs the full local pipeline on every substantial pass: local evidence, dependency graph, design intelligence, all saved reference lenses, resource provenance, the reference/build contract, the internal Transitions.dev motion review, and the compact `Decision / Changed / Proof / Open` contract. Motion is on by default; add `--offline` only when the private motion cache must not be refreshed.

For a narrower read, run the local scanner directly:

```bash
node <skill-root>/scripts/inspect-project.mjs <project-root> --format md
```

When the repository is large or the question is specific, query the local map before reading broadly:

```bash
node <skill-root>/scripts/project-map.mjs <project-root> \
  --query "where is the settings form and its validation state?" \
  --format md
```

Record only what is evidenced: framework and scripts, routes, components, tokens, assets, existing design memory, weak primitives, and constraints. If a project is not runnable, say so and keep the scan static.

When file relationships matter, query the repository graph instead of relying on path names:

```bash
node <skill-root>/scripts/project-graph.mjs <project-root> \
  --query "where is the settings form and its validation state?" \
  --format md
```

For external inspiration, load the complete local reference inventory after the scan, then choose at most 2-4 implementation lenses by distinct job. All references are considered; only evidenced, non-redundant decisions are applied. Write what to borrow, reject, and translate:

```bash
node <skill-root>/scripts/reference-composition.mjs \
  --query "<product, screen, or implementation question>" \
  --profile "<product profile>" --style "<candidate stance>" \
  --motion "<motion intent>" --format md
```

Read [references/reference-composition.md](references/reference-composition.md) for the role model. Rare UI, Rewamp UI, Beautiful UI, beUI, Magic UI, React Bits, Aceternity UI, and Obsidian UI are visual or specimen lenses; Rewamp UI is the focused component-workbench lens. Bencho and Design Spells are micro-interaction research; Transitions.dev is motion governance; shadcn/ui is a source-owned foundation. The selector decides which of them matter for this job rather than forcing a fixed bundle.

When the user gives only a product type and no case, infer a provisional profile from the query and local evidence, label confidence and open evidence, and leave `selected` empty when no reference job is justified. When the request is only “做一个网站” or equivalent, use the adaptive default and do not infer commerce, dashboard, or editorial structure. Do not invent a visual skin from the saved examples.

For product, brand, hardware, or peripheral work without a named case, run `scripts/reference-scout.mjs` and read [references/reference-discovery.md](references/reference-discovery.md). Choose live sources by product fit and demonstrated quality, not by geography or popularity; inspect official pages before borrowing any visible decision. When the scout returns a category source, pass it into the reference/build contract as the primary product direction; component and motion lenses support the build but cannot replace its object, material, proof, or first-viewport hierarchy.

For a greenfield, visually-led surface with no screenshot or live target, use a concept-first pass with the installed image-generation skill before coding. Treat the accepted concept as a visual hypothesis to translate into tokens, assets, sections, and states; skip it for small fixes or an established local design system.

Read [references/assets.md](references/assets.md) whenever visible media matters. User-provided assets are authoritative; otherwise find a high-quality attributable source or generate target-specific media. If nothing passes the quality bar, use a complete assetless composition or report the blocker instead of inserting a placeholder.

When the request names a reference website or says “make something like this”, generate an implementation contract before editing:

```bash
node <skill-root>/scripts/reference-build.mjs \
  --query "<one-sentence request>" --project <project-root> --format md
```

Read [references/reference-build.md](references/reference-build.md). The contract is a construction input: visual genome, first viewport, page plan, component grammar, state/motion contract, responsive re-staging, asset fallback, build order, and acceptance gates. Continue into the target project's code and browser proof; do not stop after producing the contract.

For a substantial request, create a short frame:

```text
Goal / workflow:
Surface / device / input:
Density / frequency:
Real content, data, and media:
Critical states:
Top visible problems:
Risk if wrong:
```

### 2. Choose

Use the local brief generator to get candidates, not authority:

```bash
node <skill-root>/scripts/design-brief.mjs \
  --query "<product and screen>" \
  --project <project-root> \
  --format md
```

Read [references/design-system.md](references/design-system.md) when choosing type, color, component shape, content readiness, or a persistent `DESIGN.md`. The brief must expose:

- product profile and surface mode
- design stance and one signature move
- type ceiling and type roles
- component shape language and card budget
- Visual Direction Contract: first-viewport composition, alignment, dominant/counterweight, spacing rhythm, surface budget, visual stance/signature device, authority source, and advisory AI-default checks
- motion purpose and fallback
- what is intentionally not used
- confidence and evidence gaps
- scene dials, quality gates, anti-pattern watchlist, and implementation checks
- a role-based reference composition with borrow, reject, and translate decisions

Read [references/constraint-authority.md](references/constraint-authority.md) when a project has a `DESIGN.md`, the user supplies a strong visual direction, or a reference conflicts with a local default. Treat the strongest evidenced direction as authority and use local datasets to fill gaps, not to normalize the design.

Read [references/premium-finish.md](references/premium-finish.md) when the user asks for high-end, premium, refined, luxury, 高级, 质感, or when the first render feels generic. Run the finish pass before adding another reference or dependency.

Pause for a direction lock only when the direction is genuinely ambiguous and expensive to undo. Otherwise record a Direction Assumption and continue. Never present three cosmetic variations of the same generic style.

### 3. Build

Read [references/implementation.md](references/implementation.md) for substantial work. Build the composition and interaction model before decorative styling:

- first read, primary action, information hierarchy, and responsive re-staging
- local or mature primitives with complete hover, focus, pressed, disabled, loading, empty, error, success, selected, and partial-data states where relevant
- realistic copy/data and the actual product or workflow object
- one signature interaction tied to a real state, not a decorative loop
- accessible keyboard/touch behavior and reduced-motion behavior

For a reference-led build, preserve the target product's content and workflow while borrowing the reference's visual grammar. Do not copy logos, brand names, proprietary assets, source code, exact copy, or an indistinguishable full-page clone. “Similar” means comparable hierarchy, material, rhythm, specimen behavior, and motion purpose translated into the target product.

Read [references/resources.md](references/resources.md) before adding a component, motion, chart, icon, media, or 3D dependency. Use the executable catalog to narrow the choice. Treat Bencho and Design Spells as inspiration-only unless source, license, and implementation evidence say otherwise; treat Rewamp UI, Magic UI, React Bits, Aceternity UI, and Obsidian UI as copy-and-adapt candidates, never as default skins:

```bash
node <skill-root>/scripts/resource-catalog.mjs \
  --query "<missing technical job>" --stack <detected-stack> --format md
```

The full audit always opens the internal motion bridge. Read [references/motion.md](references/motion.md) when the implementation needs detailed rules for motion, scroll, route continuity, GSAP, 3D, or model behavior; the final surface may still remain static when the reviewed state relationship does not justify animation.

For every substantial pass, run the internal Transitions.dev bridge before editing, even when the final decision is to keep a state static. It fetches the pinned upstream Skill into a private cache when needed and returns the recipe source plus the `Review -> Apply -> Polish` contract; the user does not install or invoke another skill:

```bash
node <skill-root>/scripts/transitions-adapter.mjs \
  --intent "<state or relationship>" --project <project-root> --phase all --format md
```

Read the returned upstream reference before applying it. Copy only the needed recipe into the target project, preserve cleanup and replay behavior, keep its reduced-motion guard, and provide a static/final-state fallback. Never add a motion dependency merely to reproduce a recipe.

### 4. Prove

Read [references/verification.md](references/verification.md). Run the product, inspect desktop and target mobile/device viewports, exercise one non-default state, and check console/build output. Capture the closest available evidence. Keep static checks, runtime checks, and visual checks separate in the report.

For this skill itself, run:

```bash
npm test
```

The reference integrations are executable rather than name-only documentation: design intelligence (`brief`), visual direction (`direction`), repository graph (`graph`), role-based reference composition (`reference`), one-sentence implementation contracts (`reference-build`), compact response pipeline (`audit`), curated resources (`resource`), and the internal motion bridge (`motion`).

## Output Contract

Default to a short, decision-oriented response:

```text
Decision: <what changed and why>
Changed: <files or surface>
Proof: <commands, screenshots, states, or runtime evidence>
Open: <only real blockers or unverified claims>
```

Use a longer brief only when the user asks for it, the direction is high-risk, or the artifact will be reused by another agent. Read [references/response-contract.md](references/response-contract.md) for the terse/deep modes.

## Hard Invariants And Advisory Biases

Hard invariants are never traded away for style: preserve semantic accessibility, task and state completeness, responsive usability, asset truth and rights, motion cleanup/reduced-motion/fallback, runtime integrity, and honest rendered proof.

The following are advisory bias checks, not universal style bans: oversized type, equal-card walls, centered hero templates, default library skins, effect stacks, generic luxury palettes, weak media, and decorative motion. A project-owned `DESIGN.md`, inspected reference, accepted concept, explicit user direction, or evidence-backed model proposal may deliberately override them. Record the source, reason, evidence, risk, preserved invariants, and rendered proof in the direction contract.

When feedback says the result is ugly, bland, generic, static, or expensive, do not defend the prior pass. Re-run Inspect, replace the weak decision, and verify the visible result again.
