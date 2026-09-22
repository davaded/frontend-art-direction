# Implementation Guide

Use this guide when the change is larger than one local component. It keeps the visual direction attached to real components, states, and constraints. For a premium or high-end request, pair it with [premium-finish.md](premium-finish.md) and finish the hierarchy pass before decorative polish.

## Component Adoption

Start with the local component and token system. If it is coherent, extend it. If it is weak, repair the primitive before styling every screen around it. Add an external source only for a named gap.

For each major family record:

```text
Family and job:
Input model: mouse / keyboard / touch / remote / voice / mixed
Density:
Existing primitive or external source:
Chosen form:
State cycle:
Feedback and motion:
Accessibility constraint:
Default pattern rejected:
```

Use mature primitives for buttons, inputs, menus, popovers, dialogs, sheets, tabs, command surfaces, tables, lists, charts, media controls, and state feedback when they are available. Customize composition, tokens, copy, and behavior. Do not ship a library demo as the product identity.

## State Matrix

Before visual polish, enumerate the states the workflow actually needs:

```text
idle | hover | focus | pressed | selected | disabled
loading | empty | partial | error | success | updating
expanded | collapsed | filtered | sorted | dragged | offline
```

Do not implement every state mechanically. Implement the relevant states with real labels, data shape, keyboard/touch behavior, and recovery paths. A static screenshot of the happy path is not component completeness.

## Composition Before Decoration

Lock these decisions in order:

1. first read and primary action;
2. workflow order and information hierarchy;
3. layout rhythm, density contrast, and responsive re-staging;
4. visual anchor or product object;
5. type roles and component silhouette;
6. color, material, imagery, and motion polish.

If a page reads as equal boxes, remove a generic layer and recompose around the task, object, or data relationship. Do not add a gradient to hide a weak skeleton.

Before touching JSX, CSS, or a component generator, copy the Visual Direction Contract into the implementation frame:

```text
Direction / composition grammar:
Alignment axis:
Dominant object or relationship:
Counterweight and primary action:
Below-fold proof:
Type ceiling and roles:
Spacing rhythm:
Surface/card/radius/elevation budget:
Edge character and corner hierarchy:
Separation strategy and line policy:
Localized sharp exceptions:
Direction authority and source:
Rules inherited from the authority source:
Advisory defaults intentionally overridden:
Override reason and evidence:
Hard invariants preserved:
Rendered proof required:
```

Treat hard invariants as construction constraints. Treat the local visual direction, geometry contract, and AI-default list as a starting hypothesis. A component can be technically correct and still fail if it breaks the authoritative axis, equalizes the visual weights without intent, exceeds the authority source's type ceiling, spends the surface budget on decorative wrappers, or rebuilds the page as nested border boxes. It can also be correct to break a local heuristic when the stronger authority source makes the exception coherent and the rendered proof supports it.

## Content And Media Contract

Use [assets.md](assets.md) as the default acquisition policy. The order is user-provided material, existing or official material, high-quality attributable search, generated media, then a deliberate assetless composition. A placeholder is not an acceptable final fallback.

For every first-screen image, video, model, chart, or canvas object, record:

```text
Role and product meaning:
Source / generation path and rights:
Focal point / crop:
Mobile framing:
Loading / poster / empty fallback:
Performance budget:
Reduced-motion behavior:
Quality inspection:
```

If a required asset is missing, find or generate one before the visual acceptance pass. If no candidate meets the quality bar, use a complete assetless composition or report the blocker; do not use a low-quality image to make the page look finished.

## Responsive Translation

Do not scale desktop down mechanically. Define what changes by viewport:

- navigation and action placement;
- reading order and density;
- touch target and input affordance;
- media crop, object scale, and focal point;
- type ceiling and text wrapping;
- sticky, scroll, and panel behavior.

Keep fixed-format controls, boards, tables, and media frames dimensionally stable so dynamic text and states do not shift the layout.

## Accessibility And Trust

Preserve semantic controls, visible focus, keyboard order, touch targets, labels, error recovery, contrast, and user text scaling. Do not make hover the only way to discover an action. Do not let animation delay an essential task or obscure a critical message.

## Implementation Contract Example

```text
Existing system: local tokens and list primitives preserved.
Layout: split workspace with selected object and detail pane.
Geometry: open workspace field, softly contoured preview stage, compact controls, tonal grouping before dividers.
Components: local tabs, table, command menu; new product-specific preview frame.
States: loading, empty, selected, filtered, error, success.
Motion: selected row and preview continuity; 180-260ms; reduced motion keeps content visible.
Mobile: list-first flow, detail as sheet, actions in thumb reach.
Proof: desktop/mobile screenshots, keyboard selection, filter transition, console clean.
```
