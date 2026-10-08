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

Use the [Product Or Experience Signal Gate](product-prototype.md) before the composition is polished. Functional surfaces need a concrete vertical slice; narrative and art-directed surfaces need their own subject, thesis, attention path, proof, and ending. This is an intent requirement, not a mandate for a dashboard, commerce, card, split-panel, or interaction-heavy layout.

Use the Completion Contract as the definition of done. Declare whether the deliverable is a route, full page, scene, component, specimen workbench, or another bounded surface. Finish every named region and destination in that scope, then prove the complete scope at desktop and target mobile. The first viewport is where review begins; it is never permission to leave the rest as filler.

Use [visual-iteration.md](visual-iteration.md) during implementation, not only after it. Let inspected screenshots guide repairs. For a composition or media problem, use an image revision to choose the visual delta, translate it into code and individual assets, and verify the next real capture. Text, controls, states, and responsive layout remain implemented elements rather than a flattened mockup image.

Lock these decisions in order:

1. first read and primary action;
2. the correct product or experience signal for the chosen mode;
3. workflow or attention order and information hierarchy;
4. layout rhythm, density contrast, and responsive re-staging;
5. visual anchor, subject, or formal relationship;
6. type roles and component silhouette;
7. color, material, imagery, and motion polish.

If a page reads as equal boxes, remove a generic layer and recompose around the task, object, or data relationship. Do not add a gradient to hide a weak skeleton.

Build the first viewport and one meaningful state, transition, or stable ending before lower-page decoration. A functional hero shell with no usable object and state feedback is a presentation shell; a narrative or experimental surface may remain intentionally still when its subject and thesis are clear.

For substantial open work, write 2-3 structurally different concepts before locking the implementation frame. They must change the composition grammar, reading order, dominant object, or interaction relationship. Choose one with a concrete reason, then let the local direction data fill only missing implementation fields.

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
