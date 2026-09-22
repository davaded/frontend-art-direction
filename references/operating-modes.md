# Operating Modes

Use this file for work larger than one local polish change. The aim is to spend planning effort in proportion to the cost of being wrong.

## The Evidence Ladder

Move through the ladder in order. Stop when the next rung would not change a decision.

```text
request -> local scan -> requirement frame -> direction assumption
        -> brief / reference-build -> implementation contract -> code
        -> runtime state -> visual evidence -> short report
```

Do not search for visual inspiration before the local scan identifies a missing job. Do not call a named reference "used" unless a visible decision was inspected and translated. For substantial work, `scripts/audit.mjs` runs the complete sequence every time; `scripts/project-graph.mjs` supplies relationship evidence, `scripts/reference-composition.mjs` considers the full lens inventory, `scripts/resource-catalog.mjs` supplies provenance and a bounded dependency shortlist, and the internal motion bridge runs Review -> Apply -> Polish by default.

## Fast Path

Use for one control, one dialog, a local state, or a small spacing/type/color issue.

```text
Requirement: what visible problem is being fixed?
Local pattern: which component/token/screen was inspected?
Change: smallest behavior and visual correction.
Proof: the exact state, viewport, or test checked.
```

The full audit still runs. Keep its output compact and limit implementation to the affected surface, but preserve the same reference, resource, motion, and verification checks.

## Full Path

Use for a new screen, a redesign, a new visual language, a media-led page, or a change touching several component families.

### Requirement Frame

```text
User goal:
Primary workflow:
Surface: app / dashboard / editor / marketing / media / embedded / other
Audience and frequency:
Device, viewport, and input:
Information density:
Critical states:
Real content, data, and media:
What must improve:
What must not change:
Risk if wrong:
```

### Local Evidence Map

Record paths, not impressions:

```text
Framework and scripts:
Routes and shell:
Components and primitive source:
Tokens, theme, and fonts:
Assets and real content:
Existing DESIGN.md or rules:
Weak or missing primitives:
Runtime constraints:
Decision: preserve / repair / extend / replace / supplement
```

Resolve authority at this point: hard invariants stay fixed, while a project `DESIGN.md`, current user direction, inspected reference, accepted concept, or evidence-backed model proposal may replace local visual defaults. Do not silently normalize a project direction into the saved style IDs.

Run `inspect-project.mjs` when possible. Its output is a map of observed files, not a design judgment. When a question is specific, use `project-map.mjs --query` to rank the relevant files and snippets before opening the whole repository.

### Design Read

Choose values for the scene, not for decoration:

```text
Surface mode: Productive UI / Editorial Marketing / Spatial Experiential
Design stance: quiet precision / instrument panel / visual object / editorial authority / kinetic product / consumer character
Variance: low / medium / high
Motion: low / medium / high
Density: low / medium / high
Component distinctiveness: low / medium / high
Content readiness: L0 / L1 / L2 / L3
Expression budget: low / medium / high / exceptional
```

### Direction Checkpoint

Use a checkpoint only if both conditions are true:

- two or more materially different directions fit the evidence; and
- choosing incorrectly would make implementation expensive or damage the product.

Otherwise write one **Direction Assumption** and proceed. A checkpoint contains at most three materially different options. Each option names its anchor, signature move, type ceiling, medium, borrow list, avoid list, misuse risk, and verification clue.

### Implementation Contract

Before editing a substantial surface, make the contract concrete:

```text
Files/surfaces:
Layout skeleton:
Existing primitives to reuse:
New primitives justified:
State matrix:
Content/media contract:
Motion trigger and fallback:
Asset source / generation path and quality proof:
Responsive changes by viewport:
Verification steps:
```

The contract is not a design essay. If code drifts, update the contract or explain the evidence that changed.

## Reference Budget

Use 2-4 references for substantial work, with distinct jobs:

1. foundation: layout, type, color, accessibility, or platform behavior;
2. visual direction: composition, material, imagery, or product character;
3. implementation: component states, motion, model, chart, or media behavior;
4. flow check: always considered; expand it when state order, density, or platform expectation is uncertain.

Prefer user-provided and local references. Search only for the missing job. For every selected reference record what was visible, what is borrowed, what is rejected, and where it appears in the target.

For visible media, use [assets.md](assets.md): user material first, then existing/official or high-quality attributable sources, then target-specific generation. Do not use placeholders or low-quality filler in the rendered result.

The repository's saved references are all reviewed as candidates on every full run, but they are not a fixed implementation bundle. Use the role-based selector and cap the applied set at four. A component foundation, a visual language, a motion/state lens, and one domain specimen are usually enough; omit a role when the product does not need it.

When the user names a reference website or asks for a similar site, switch to the reference-led build mode in [reference-build.md](reference-build.md). The success criterion is a working, rendered target surface, not a high-fidelity description.

## Persistent Memory

Create or update `DESIGN.md` only when the direction will be reused. Use [../templates/DESIGN.md](../templates/DESIGN.md) as the starting shape. Do not create a document to avoid implementing the UI.
