# Reference and Component Execution

Use this before implementing substantial frontend work. The goal is to make the UI depend on the requirement, local project evidence, inspected reference websites, mature components, and real interaction states instead of freehand styling.

## Non-Negotiable Rule

Do not build a substantial UI from imagination alone. Before implementation, frame the requirement, inspect the local component/token/asset reality, inspect reference websites or demos for the missing jobs, select component primitives, and map the inspected decisions into code.

If browser or web access is blocked, say so and use the closest local evidence: project screenshots, existing components, token files, installed docs, bundled references, or user-provided screenshots. Do not pretend a website was inspected.

## Reference Website Pass

For substantial UI work, inspect at least one real reference website, product surface, component demo, design-system page, or user-provided visual reference before changing the visible surface. Prefer 2-4 references when the direction is unclear. Choose references from the requirement and local evidence gaps, not from generic "beautiful UI" search.

Record:

```text
Reference Website Pass:
Requirement/job this reference answers:
Inspected URLs or files:
What was actually visible:
Layout/density borrowed:
Component/state behavior borrowed:
Motion/interaction borrowed:
Typography/color/material borrowed:
What not to borrow:
Where each decision appears in the target UI:
```

Named references do not count. "Use Apple-like", "use shadcn", "make it like Aceternity", or "inspired by getdesign" is not evidence unless a page, demo, screenshot, or file section was inspected.

## Component Adoption Plan

Before building new UI, choose the implementation source for common primitives. Start with the local system, then add external resources only when the local system is missing, weak, incomplete, or inappropriate for the scene.

```text
Component Adoption Plan:
Requirement/job:
Existing component system:
Local components/tokens/assets to preserve:
External component/resource source:
Components or blocks to use:
States to implement:
Motion/transition source:
Icon/source system:
What will be customized:
What will not be hand-rolled:
Why no external component is needed, if skipped:
```

Default choices:

- Use the project's existing component system when it is coherent and has the needed states.
- For React/Tailwind dashboards, apps, settings, forms, and tools, prefer shadcn/ui, Radix primitives, lucide icons, Motion, TanStack Table, and Recharts or the project's equivalents.
- For React apps that need a fuller kit, inspect HeroUI, Spectrum UI, or similar resources before hand-rolling complex controls.
- For animated component patterns, inspect transitions.dev, React Bits, Aceternity UI, Motion, AutoAnimate, View Transitions API, or similar demos and adapt the specific state behavior.
- For mobile/native work, use platform components and established native primitives first, then borrow web/React patterns only as interaction inspiration.

Do not choose a component library because it is fashionable. Choose it because it fits the framework, density, input model, states, accessibility needs, and implementation cost of the current requirement.

## No Freehand Primitive Rule

Do not hand-roll common UI primitives for substantial work when a mature local or external primitive exists:

- buttons, icon buttons, inputs, textareas, selects, comboboxes, checkboxes, switches, sliders
- tabs, menus, popovers, tooltips, drawers, dialogs, sheets, command palettes
- tables, lists, cards, filters, pagination, charts, media controls, navigation
- loading, empty, error, success, disabled, selected, hover, focus, pressed, expanded, and partial-data states

Freehand implementation is acceptable only when:

- the project has no framework/component path and the task is tiny
- the component is truly product-specific
- mature primitives would add more complexity than quality

When hand-rolling, still implement states, accessibility, spacing, responsive behavior, and motion deliberately.

## Interaction Quality Floor

For substantial UI work, the interaction layer must include more than static styling:

- visible press, hover, focus, selected, disabled, loading, error, success, or drag feedback
- panel, tab, route, filter, sort, expand/collapse, or detail-view continuity when those states exist
- keyboard/touch behavior for interactive controls
- reduced-motion or static fallback when motion is meaningful

Color-only hover, generic fade-in-on-scroll, decorative background loops, or static card grids do not satisfy interaction quality.

## Failure Response

If the output is ugly, incoherent, static, component-less, or disconnected from references:

1. Stop polishing the current surface.
2. Re-run the Requirement Frame and Local Evidence Scan.
3. Re-run the Reference Website Pass with at least one concrete visual/component source that answers a named gap.
4. Create or revise the Component Adoption Plan.
5. Replace freehand primitives with mature components or stronger local primitives.
6. Add one meaningful state transition or interaction pattern tied to the workflow.
7. Re-verify with screenshot/viewport evidence and name where requirement fit, local evidence, references, components, and motion are visible.

Do not defend the prior result as "premium", "clean", or "modern" if it lacks reference evidence, component craft, and interaction behavior.
