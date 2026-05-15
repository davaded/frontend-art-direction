# Requirement and Evidence Workflow

Use this before substantial frontend work. The goal is to prevent style-first UI by forcing the agent to understand the product job, inspect local evidence, fill only the missing gaps with external references, and let the scene determine layout, components, motion, and visual expression.

Core rule:

```text
Requirement first -> local evidence second -> external references third -> expression last.
```

Do not start by choosing an aesthetic style, component library, animation technique, large type treatment, hero layout, or 3D medium. Those decisions must come from the requirement, available content, local system, and inspected references.

## 1. Requirement Framing

Before searching or implementing, classify the requested surface.

```text
Requirement Frame:
User goal:
Primary workflow:
Surface type: app / dashboard / editor / marketing / ecommerce / data visualization / media / game / embedded / other
User frequency: one-time / occasional / high-frequency
Information density: low / medium / high
Input model: mouse / keyboard / touch / remote / voice / mixed
Target device and viewport:
Critical states:
Real content/data/assets available:
What must feel better:
What must not change:
Risk if wrong:
```

Use this to decide what evidence is missing. A dashboard needs data density, filtering, chart, table, empty/error/loading, and drill-down evidence. An editor needs canvas, toolbars, inspector panels, keyboard flow, selection, and undo/redo evidence. A marketing page needs copy, media quality, product object, proof, scroll rhythm, and conversion evidence.

## 2. Local Evidence Scan

Inspect the project before looking outward unless the user has provided a specific external reference that must be honored first.

Check for:

- existing `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, design docs, README design notes
- `package.json` dependencies and installed UI/motion/chart/3D/icon libraries
- `components/`, `ui/`, `design-system/`, `stories/`, `storybook/`, `tokens/`, `theme/`, `styles/`, and existing page patterns
- routes, layouts, app shell, navigation, data-fetching patterns, forms, dialogs, tables, charts, media, and state handling
- local assets: images, logos, icons, fonts, video, audio, models, screenshots, sample data

Record:

```text
Local Evidence Scan:
Component system found:
Token/theme source:
Relevant existing screens:
Installed UI/motion/chart/icon/model libraries:
Available real content/data/assets:
Reusable layout or interaction patterns:
Weak or missing primitives:
Local constraints:
Decision: preserve / extend / replace / add external support
```

Do not introduce external components or a new visual language before deciding whether the local system should be preserved, extended, repaired, or replaced.

## 3. Gap-Driven External Search

Search externally only for the missing jobs discovered by the requirement frame and local scan. Search exact needs, not generic beauty.

Examples:

- For dashboard density: mature analytics dashboards, table/filter patterns, chart interaction, empty/error states.
- For editor tools: Figma, Framer, Webflow, code editor, canvas, toolbar, inspector, selection and shortcut patterns.
- For app settings/forms: mature design-system form patterns, validation, dialog, disclosure, settings navigation.
- For motion: route continuity, list reorder, panel reveal, data update, command feedback, product inspection.
- For components: GitHub/npm/component demos that match the framework and states needed.

Record:

```text
External Evidence:
Missing job searched:
Query or source:
Inspected URL/demo/repo/docs:
Why it fits this requirement:
What to borrow:
What not to borrow:
Implementation implication:
Verification check:
```

External references are not moodboards by default. They are evidence to fill a specific gap: foundation quality, layout pattern, component implementation, motion behavior, visual language, asset quality, or flow/state coverage.

## 4. Scene Fit Decision

After local and external evidence, decide the interface system from the scene.

```text
Scene Fit Decision:
Layout model:
Component source:
State coverage:
Motion purpose:
Motion source:
Visual medium:
Typography ceiling:
Expression budget:
External references used:
Local patterns preserved:
What is intentionally not used:
```

Motion, animation, layout, component choice, and type scale are not user-permission switches. The scene decides them:

- Use motion when it clarifies feedback, continuity, state change, hierarchy, or product meaning.
- Use restrained typography when the surface is high-frequency, dense, operational, or content/media support is weak.
- Use large type, cinematic layout, 3D, or strong editorial treatment only when the requirement, content, media, and references all support it.
- Use mature components when the surface needs common primitives, accessibility, states, and behavior.
- Custom primitives are reserved for product-specific interactions or tiny tasks.

## 5. Implementation Contract

Before code, convert the decisions into a short implementation contract.

```text
Implementation Contract:
Files/surfaces to change:
Layout skeleton:
Components to reuse/adopt:
States to implement:
Motion/interaction triggers:
Assets/media to use:
Responsive/device behavior:
Verification steps:
```

If the implementation drifts from the contract, pause and revise the contract or explain why the evidence changed.

## Fast Path

For tiny UI fixes, do a compressed version:

```text
Fast Evidence Check:
Requirement:
Local pattern inspected:
Component/token reused:
Change:
Verification:
```

Do not use the full external search loop for a one-control polish task unless the local pattern is weak, the user asks for broader direction, or the change introduces a new component language.
