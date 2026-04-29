# Art Direction Brief

Use this brief before meaningful UI implementation, including frontend work built from scratch from plain requirements. Keep it short enough to guide building, not long enough to replace building.

For substantial or direction-sensitive UI work, expose a concise version of the brief before or alongside the implementation plan. Do not let the brief remain only an internal thought when the visual direction is ambiguous, newly invented, or likely to affect many components.

## Template

```text
Art Direction Brief:
Product character:
Reference direction:
Visual hierarchy:
Layout rhythm:
Composition signature:
Visual language:
Motion/spatial language:
Color/material:
Typography:
Component language:
Interaction feel:
Device translation:
```

## Field Guidance

- **Product character**: Define the intended feeling and identity. Examples: precise productivity tool, immersive music library, quiet enterprise console, fast command surface, low-distraction car display.
- **Reference direction**: Name 2-4 references and state what to borrow from each. Borrow principles, not the whole look.
- **Visual hierarchy**: Define what the user should notice first, second, and third.
- **Layout rhythm**: Specify whether the surface is split-panel, dense dashboard, open editorial, content-led, toolbelt, cockpit, or focused single-task flow.
- **Composition signature**: Define the visual anchor, asymmetry, density contrast, product-specific motif, or typographic move that prevents the UI from feeling generic.
- **Visual language**: Define imagery, material, graphic motif, depth, texture, icon/illustration/3D approach, and the product-specific metaphor behind them.
- **Motion/spatial language**: Define motion purpose, timing/easing, animation grammar, 3D/model role, triggers, and reduced-motion fallback.
- **Color/material**: Define base, accent, contrast, depth, imagery, borders, shadow, translucency, or texture.
- **Typography**: Define scale, weight, density, labels, numbers, headings, and content voice.
- **Component language**: Define how controls, cards, lists, dialogs, navigation, charts, media, or toolbars should feel.
- **Interaction feel**: Define feedback speed, motion restraint, state treatment, loading, empty, error, and navigation continuity.
- **Device translation**: Define how the direction changes for desktop, mobile, touch, car/head-unit, big screen, or embedded surfaces.

## Example

```text
Art Direction Brief:
Product character: calm, precise, premium productivity workspace.
Reference direction: borrow Linear's hierarchy and density, Apple HIG's restraint, and Raycast's command clarity.
Visual hierarchy: active work item first, primary actions second, metadata third.
Layout rhythm: split-panel workspace with dense controls and generous internal spacing.
Composition signature: active work object anchors the left pane, with tighter metadata and command regions orbiting it.
Visual language: quiet instrument-panel surfaces, precise separators, sparse iconography, no generic gradients or decorative blobs.
Motion/spatial language: short feedback transitions, continuity between work item states, no decorative loops unless they communicate live status.
Color/material: neutral base, subtle borders, restrained depth, one confident accent.
Typography: compact readable scale, strong section labels, tabular numbers for metrics.
Component language: quiet buttons, crisp inputs, clear tabs, precise menus, no ornamental chrome.
Interaction feel: fast feedback, clear hover/focus, short transitions, non-disruptive loading and errors.
Device translation: desktop supports density; mobile collapses into a task-first flow with larger touch targets.
```

## When to Show It

- Show the brief when the user is discussing direction or has asked not to edit code yet.
- Show or summarize the brief before implementation when building a new UI, changing a major screen, choosing a new visual language, or using strong references/components.
- Keep the brief internal only for tiny local fixes where the product character and component language are already obvious.
- Save the direction into `DESIGN.md` when the project needs persistent visual memory.
