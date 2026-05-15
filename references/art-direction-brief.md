# Art Direction Brief

Use this brief before meaningful UI implementation, including frontend work built from scratch from plain requirements. Keep it short enough to guide building, not long enough to replace building.

For substantial or direction-sensitive UI work, expose a concise version of the brief before or alongside the implementation plan. Do not let the brief remain only an internal thought when the visual direction is ambiguous, newly invented, or likely to affect many components.

## Template

```text
Art Direction Brief:
Product character:
Design stance:
Reference direction:
Reference website pass:
Component adoption plan:
Content/media readiness:
Surface mode:
Expression budget:
Visual hierarchy:
Layout rhythm:
Composition signature:
Signature interaction:
Medium decision:
Visual language:
Motion/spatial language:
Color/material:
Typography:
Type ceiling:
Display need:
Display support:
Component language:
Interaction feel:
Device translation:
```

## Field Guidance

- **Product character**: Define the intended feeling and identity. Examples: precise productivity tool, immersive music library, quiet enterprise console, fast command surface, low-distraction car display.
- **Design stance**: Choose a visible stance such as quiet precision, kinetic product, visual object, editorial authority, instrument panel, or consumer character. Avoid vague "clean modern premium."
- **Reference direction**: Name 2-4 inspected references, classify each reference's role, and state what to borrow from each. Borrow principles, not the whole look.
- **Reference website pass**: Name the inspected URL/demo/screenshot/file evidence and what visible decisions will appear in the target UI.
- **Component adoption plan**: Name the existing or external component/resource source, the primitives or blocks to use, the states to implement, and what will not be hand-rolled.
- **Content/media readiness**: Classify the available content and assets as L0/L1/L2/L3 from `content-media-readiness.md`.
- **Surface mode**: Choose Productive App UI, Editorial Marketing, Spatial Experiential, or a primary mode with a subordinate secondary mode.
- **Expression budget**: Set low, medium, high, or exceptional. This determines whether the UI should rely on restrained product craft, a focused object/media anchor, or rare stronger expression.
- **Visual hierarchy**: Define what the user should notice first, second, and third.
- **Layout rhythm**: Specify whether the surface is split-panel, dense dashboard, open editorial, content-led, toolbelt, cockpit, or focused single-task flow.
- **Composition signature**: Define the visual anchor, asymmetry, density contrast, product-specific motif, or typographic move that prevents the UI from feeling generic.
- **Signature interaction**: Define one stateful interaction or motion moment that makes the product feel alive without becoming gimmicky.
- **Medium decision**: Choose static interface, image/photo, illustration, motion/animation, 3D/model, or a hybrid. State why this medium best serves the product, workflow, device, and state changes, and what obvious alternatives are being rejected.
- **Visual language**: Define imagery, material, graphic motif, depth, texture, icon/illustration/3D approach, and the product-specific metaphor behind them.
- **Motion/spatial language**: Define motion purpose, timing/easing, animation grammar, 3D/model role, triggers, and reduced-motion fallback.
- **Color/material**: Define base, accent, contrast, depth, imagery, borders, shadow, translucency, or texture.
- **Typography**: Define scale, weight, density, labels, numbers, headings, and content voice.
- **Type ceiling**: Define the largest allowed type role for the surface. In tools, dashboards, tables, forms, settings, and compact panels, display type is usually not allowed.
- **Display need**: If display-size text is proposed, state why the surface actually needs it. Good content or assets can support display type, but they do not make it necessary.
- **Display support**: If display-size text is still justified, name what supports it: real content, strong image/photo, illustration, animation, model, data object, or editorial material. If the support is weak or missing, lower the type scale.
- **Component language**: Define how controls, cards, lists, dialogs, navigation, charts, media, or toolbars should feel.
- **Interaction feel**: Define feedback speed, motion restraint, state treatment, loading, empty, error, and navigation continuity.
- **Device translation**: Define how the direction changes for desktop, mobile, touch, car/head-unit, big screen, or embedded surfaces.

## Example

```text
Art Direction Brief:
Product character: calm, precise, premium productivity workspace.
Reference direction: foundation reference uses Apple HIG's restraint; visual/product references borrow Linear's hierarchy and Raycast's command clarity without copying their brand skin.
Reference website pass: inspect the product/reference surface for split-panel density, command action placement, and compact keyboard-friendly feedback.
Component adoption plan: use existing app shell primitives plus mature buttons, tabs, menus, dialogs, command/list states, lucide-style icons, and short state transitions; do not hand-roll bare controls.
Content/media readiness: L1 because the workflow, data, and controls are real, but there is no strong media/model object.
Surface mode: Productive App UI.
Expression budget: medium; use density, state, and interaction quality, not a cinematic hero.
Visual hierarchy: active work item first, primary actions second, metadata third.
Layout rhythm: split-panel workspace with dense controls and generous internal spacing.
Composition signature: active work object anchors the left pane, with tighter metadata and command regions orbiting it.
Medium decision: mostly static dense UI with short stateful transitions; no stock imagery or decorative 3D because the product value is task focus and continuity.
Visual language: quiet instrument-panel surfaces, precise separators, sparse iconography, no generic gradients or decorative blobs.
Motion/spatial language: short feedback transitions, continuity between work item states, no decorative loops unless they communicate live status.
Color/material: neutral base, subtle borders, restrained depth, one confident accent.
Typography: compact readable scale, strong section labels, tabular numbers for metrics.
Type ceiling: page title stays compact; no hero-scale text because the product value is task focus, not a marketing moment.
Display need: none; the screen should communicate task focus and operational hierarchy, not poster impact.
Display support: none needed because display type is not used.
Component language: quiet buttons, crisp inputs, clear tabs, precise menus, no ornamental chrome.
Interaction feel: fast feedback, clear hover/focus, short transitions, non-disruptive loading and errors.
Device translation: desktop supports density; mobile collapses into a task-first flow with larger touch targets.
```

## When to Show It

- Show the brief when the user is discussing direction or has asked not to edit code yet.
- Show or summarize the brief before implementation when building a new UI, changing a major screen, choosing a new visual language, or using strong references/components.
- Keep the brief internal only for tiny local fixes where the product character and component language are already obvious.
- Save the direction into `DESIGN.md` when the project needs persistent visual memory.
