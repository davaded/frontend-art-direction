---
name: frontend-art-direction
description: "Use when Codex is asked to make a frontend surface more beautiful, premium, polished, coherent, or product-grade, including web apps, dashboards, landing pages, mobile UI, embedded displays, car/head-unit UI, design-system refreshes, and UI redesigns. Applies when users ask to improve aesthetics, art direction, visual hierarchy, interaction feel, component craft, responsive/cross-device presentation, or to turn a rough/demo UI into a refined real product. Also use when creating or updating DESIGN.md as a visual memory for ongoing UI work."
---

# Frontend Art Direction

## Mission

Elevate frontend UI and interaction quality with art-direction thinking, high-quality references, visual hierarchy, motion taste, component craft, and real implementation. Think like an art director, then build like a product engineer.

This skill is not a document generator and not a generic component cookbook. Its purpose is to make the visible product more beautiful, premium, coherent, and interaction-polished. If the user asks for development, deliver working UI, not only a brief or DESIGN.md.

## Operating Modes

- **Direct development mode**: Use by default when the user asks to build, redesign, beautify, polish, or improve UI. Do the art-direction thinking in the background, edit the product, run it when possible, and verify the visible result.
- **Direction-only mode**: Use when the user asks to discuss, plan, compare styles, or not edit code yet. Produce an art direction brief, reference analysis, or design options.
- **Visual memory mode**: Use when the project will continue, the user asks for a design system, or the UI direction should persist. Create or update `DESIGN.md`, then continue implementation if development was requested.

## Core Workflow

1. Identify the product character and canvas: product type, audience, device class, input method, viewing distance, density, and usage context.
2. Inspect the existing UI before changing it: current components, tokens, theme files, screenshots, live page, or device surface.
3. Gather or infer high-quality references. Prefer design systems, real products, and same-category examples over generic inspiration screenshots. See `references/reference-quality.md`. For concrete component, motion, and icon sources, see `references/frontend-resource-catalog.md`.
4. Form a short Art Direction Brief before implementation. Use it as the visual compass, not as a stopping point. See `references/art-direction-brief.md`.
5. Implement with existing project patterns and mature components. Improve primitives first when weak buttons, inputs, lists, dialogs, or cards would drag down the whole UI.
6. Treat every visible state change as a design moment: hover, focus, press, loading, empty, error, success, navigation, filtering, and transitions.
7. Translate the same aesthetic across devices instead of merely scaling the layout.
8. Verify the real surface with browser, screenshot, emulator, device, or canvas checks when available. Fix obvious visual defects before finishing.

## Art-Direction Priorities

Prioritize these quality dimensions:

- **Product character**: The UI should have a clear identity: calm, precise, immersive, premium, warm, editorial, utilitarian, playful, cinematic, or another intentional character.
- **Reference taste**: Use references to raise judgment. Borrow principles, not screenshots.
- **Proportion and composition**: Tune scale, density, spacing, rhythm, balance, and focal areas before decorative styling.
- **Visual hierarchy**: Make the first read, primary action, secondary information, and detail layer obvious.
- **Color and material**: Use color roles, contrast, background/foreground depth, borders, shadow, imagery, and texture as one visual system.
- **Typography**: Set readable type scale, weight, line height, numeric treatment, labels, and content tone. Avoid oversized type as a substitute for design.
- **Component craft**: Use mature components for consistency and behavior, then customize composition and styling to fit the art direction.
- **Interaction feel**: Make interactions fast, legible, restrained, and responsive to the device and input method.
- **Real content**: Design with realistic copy, data, media, states, and edge cases. Avoid placeholder-only beauty.

## Component Craft

Use existing project components, design tokens, and theme conventions first. Do not introduce a new component language unless the current one is clearly blocking quality.

For web surfaces, prefer appropriate mature primitives such as shadcn/ui, Radix, Tailwind, lucide icons, Motion, TanStack Table, Recharts, or the project's existing equivalents. Add dependencies only when they fit the stack and task. Use `references/frontend-resource-catalog.md` to choose concrete motion, component, and icon resources when the existing stack needs support.

For mobile, Android, embedded, or car/head-unit UI, prefer platform components, existing app components, Material/Compose/XML theme tokens, and device-appropriate control sizing.

Good component use should produce complete states, accessible controls, coherent spacing, consistent icons, and predictable behavior. Do not let a library's default look replace the product's art direction.

## Interaction Quality

High-end interaction is not spectacle. It is clear, immediate, and well-paced state change.

Check:

- Does every click, hover, focus, touch, drag, submit, and navigation have appropriate feedback?
- Are loading, empty, error, disabled, success, and partial-data states designed rather than incidental?
- Are transitions short and purposeful, generally using opacity, transform, or layout continuity rather than heavy effects?
- Are mobile, touch, remote, rotary, or car-display flows free from hover-only affordances?
- Does motion remain performant on the target device?
- Do microcopy and state labels sound like a real product rather than template filler?

## Cross-Device Translation

Keep the same art direction across devices, but translate layout, density, control size, interaction feedback, and motion according to:

- viewing distance
- input method
- attention level
- screen size and aspect ratio
- performance constraints
- task frequency and information density

Do not treat responsive design as shrinking. Reorganize hierarchy, navigation, and density for the canvas.

## DESIGN.md

Use `DESIGN.md` as project visual memory when it helps ongoing work. It is not the primary deliverable unless the user asks specifically for it.

Create or update it when:

- the project will keep evolving
- a new visual direction has been established
- styles are inconsistent across screens
- the user asks for a design system, visual language, or persistent UI guidance
- future agents or teammates need a stable art-direction source

If `DESIGN.md` conflicts with visible product quality, improve the UI and update the document afterward. Do not obey stale design notes blindly. See `references/design-md.md`.

## Verification

Before finishing UI development, verify the visible result where possible:

- Run the app or open the page.
- Check desktop and relevant mobile/device viewports.
- Inspect screenshots for hierarchy, spacing, overflow, contrast, alignment, and visual coherence.
- Exercise interaction states, not only the default screen.
- Check console/build errors and performance red flags.

If full verification is blocked, state the blocker and provide the closest completed evidence.

## Feedback Loop

When the user says the result is ugly or the direction is wrong, treat it as art-direction calibration. Do not defend the previous aesthetic. Quickly identify whether the problem is product character, reference choice, proportion, color/material, density, component language, or interaction feel, then revise or roll back the affected surface with a clear scope.
