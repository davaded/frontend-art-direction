---
name: frontend-art-direction
description: "Use when Codex is asked to create or improve a frontend surface that should feel beautiful, premium, polished, coherent, or product-grade. Applies to new UI built from requirements, web apps, dashboards, landing pages, mobile UI, embedded displays, car/head-unit UI, design-system refreshes, UI redesigns, and rough/demo UI that must become a refined real product. Use when the task needs visual hierarchy, art direction, interaction feel, motion/animation, 3D or model-based visual experiences, component craft, responsive/cross-device presentation, or DESIGN.md visual memory."
---

# Frontend Art Direction

## Mission

Elevate frontend UI and interaction quality with art-direction thinking, high-quality references, visual hierarchy, motion taste, component craft, and real implementation. Think like an art director, then build like a product engineer.

This skill is not a document generator and not a generic component cookbook. Its purpose is to make the visible product more beautiful, premium, coherent, and interaction-polished. If the user gives only product requirements and asks to build a frontend from scratch, treat art direction as part of product definition instead of waiting for a separate "make it beautiful" request. If the user asks for development, deliver working UI, not only a brief or DESIGN.md.

## Operating Modes

- **Direct development mode**: Use by default when the user asks to build, redesign, beautify, polish, or improve UI. This includes building a new frontend from plain requirements. Do the art-direction thinking explicitly enough to guide the work, edit the product, run it when possible, and verify the visible result.
- **Direction-only mode**: Use when the user asks to discuss, plan, compare styles, or not edit code yet. Produce an art direction brief, reference analysis, or design options.
- **Visual memory mode**: Use when the project will continue, the user asks for a design system, or the UI direction should persist. Create or update `DESIGN.md`, then continue implementation if development was requested.

## Scope Calibration

Use the full workflow for new screens, redesigns, direction changes, visually weak demos, or work that affects several components. Use a fast path for small polish tasks such as one control, one dialog, a local spacing/type/color issue, or a minor state fix.

Fast path:

1. Inspect the affected surface and existing component or token pattern.
2. Name the visible problem and the intended correction in one or two sentences.
3. Skip external reference search unless the local pattern is weak or the user asks for broader direction.
4. Make the smallest visible improvement that preserves the product's current visual language.
5. Verify the changed state on the real surface when possible.

## Core Workflow

1. Identify the product character and canvas: product type, audience, device class, input method, viewing distance, density, usage context, and primary workflow.
2. Inspect the existing UI before changing it: current components, tokens, theme files, screenshots, live page, or device surface. If building from scratch, inspect the app shell, tech stack, routes, content model, real content/data availability, and media/assets before choosing a visual direction.
3. Ingest 2-4 references before meaningful implementation and classify each by role. Use user-provided references first, then decide whether each source is foundation/quality evidence, project visual memory, visual-language direction, component/motion implementation, spatial/media execution, functional frontend utility, asset/icon material, or an optional flow/state check. getdesign.md, public `DESIGN.md`, Apple HIG, Material, Carbon, Polaris, Radix, typography, color, layout, accessibility, and token references are foundation constraints for quality and consistency, not moodboards. Use same-category products, Mobbin, Page Flows, Nicelydone, and SaaS Interface only as optional pattern/flow checks unless the user explicitly chose one as visual direction. Inspect each reference enough to create a Reference Evidence Card; do not proceed from named references only. See `references/reference-ingestion.md` and `references/reference-quality.md`. For content/media readiness, surface mode, and expression budget, see `references/content-media-readiness.md`. For avoiding bland middle-ground output, see `references/taste-positioning.md`. For layout, typography, type scale, and color foundations, see `references/visual-foundations.md`. For imagery, material, atmosphere, motif, and brand-like visual language, see `references/visual-language.md`. For motion, animation, 3D, models, and spatial interaction, see `references/motion-spatial-language.md`. For concrete component, motion, model, functional utility, and icon sources, see `references/frontend-resource-catalog.md`.
4. Form a short Reference Translation Brief, Content/Media Readiness Card, Surface Mode, Expression Budget, Art Direction Brief, Taste Positioning Card, and Medium Decision before implementation when the work is substantial or direction-sensitive. Use them as the visual compass, not as a stopping point. See `references/reference-ingestion.md`, `references/content-media-readiness.md`, `references/art-direction-brief.md`, and `references/taste-positioning.md`.
5. Run the quality gates in `references/visual-quality-gates.md`: diagnosis, reference stack, content/media readiness, surface mode, expression budget, brief, taste positioning, composition, visual language, motion/spatial language, component/state pass, resource discipline, visual evidence pack, and self-iteration.
6. Choose the strongest visual medium before implementation: static interface, image/photo, illustration, animation/motion, 3D/model, or a hybrid. Pick the medium that best serves the product character, workflow, state changes, content, device, and performance budget; briefly note why the obvious alternatives are weaker. Then implement a stance before decoration: design stance, visual anchor, signature move, signature interaction, layout, density, proportion, hierarchy, content grouping, typographic rhythm, visual language, motion/spatial language, and primary workflow come before color, shadow, gradients, or animation. Lock type scale before styling: display-size text is off by default and is only a rare exception for surfaces that genuinely need a display role. Good copy, imagery, animation, models, data objects, or editorial material are necessary support for large type, not permission to use it. Use display-size text only when the product job, reference evidence, content role, and supporting medium all justify that scale; otherwise use restrained type and create quality through composition, density, state, and interaction. If the result feels bland, safe, or middle-ground, use `references/taste-positioning.md`. If it feels mechanical, use `references/expressive-composition.md`. If it feels visually generic or lifeless, use `references/visual-language.md`. If motion, animation, or models feel absent, decorative, or generic, use `references/motion-spatial-language.md`.
7. Implement with existing project patterns and mature components. Improve primitives first when weak buttons, inputs, lists, dialogs, or cards would drag down the whole UI.
8. Treat every visible state change as a design moment: hover, focus, press, loading, empty, error, success, navigation, filtering, and transitions.
9. Translate the same aesthetic across devices instead of merely scaling the layout.
10. Verify the real surface with browser, screenshot, emulator, device, or canvas checks when available. For existing UI, compare before and after. For new UI, compare the result against the brief and references. Fix obvious visual defects before finishing.

## Art-Direction Priorities

Prioritize these quality dimensions:

- **Product character**: The UI should have a clear identity: calm, precise, immersive, premium, warm, editorial, utilitarian, playful, cinematic, or another intentional character.
- **Taste stance**: Choose a visible stance. Do not average references into "clean modern premium." The result should be clearly restrained, clearly expressive, kinetic, object-led, editorial, instrument-like, or consumer-characterful.
- **Content/media readiness**: Before expressive styling, classify whether the project has placeholder content, real data/workflow, a strong product/data/media object, or high-quality editorial/model/animation media. Let readiness set the surface mode and expression budget.
- **Medium fit**: Choose static UI, photography, illustration, motion, 3D/model, or a hybrid because it best serves the scene. Do not default to screenshots, stock imagery, component animation, or 3D decoration when another medium communicates the product better. If high-quality material is unavailable, use restrained interface craft instead of pretending the surface is a cinematic hero.
- **Reference taste**: Use references to raise judgment. Borrow principles, not screenshots. A resource catalog entry is not enough by itself; translate it through the product's character and workflow.
- **Proportion and composition**: Tune scale, density, spacing, rhythm, balance, focal areas, and one product-specific visual anchor before decorative styling.
- **Visual hierarchy**: Make the first read, primary action, secondary information, and detail layer obvious.
- **Color and material**: Use color roles, contrast, background/foreground depth, borders, shadow, imagery, material, motif, and texture as one visual system.
- **Typography**: Set readable type scale, weight, line height, numeric treatment, labels, and content tone from foundation references or project tokens. Use typographic contrast and rhythm to create character. Avoid oversized type as a substitute for design. In product tools, prefer dense, role-based type over hero-scale headings. Strong content or media can support a rare display moment, but it does not create the need for one; the surface must still require that scale.
- **Component craft**: Use mature components for consistency and behavior, then customize composition and styling to fit the art direction.
- **Interaction feel**: Make interactions fast, legible, restrained, and responsive to the device and input method. Motion, animation, and 3D should express state, continuity, product meaning, or spatial understanding.
- **Real content**: Design with realistic copy, data, media, states, and edge cases. Avoid placeholder-only beauty.

## Component Craft

Use existing project components, design tokens, and theme conventions first. Do not introduce a new component language unless the current one is clearly blocking quality.

For web surfaces, prefer appropriate mature primitives such as shadcn/ui, Radix, Tailwind, lucide icons, Motion, TanStack Table, Recharts, or the project's existing equivalents. Add dependencies only when they fit the stack and task. Use `references/frontend-resource-catalog.md` to choose concrete motion, component, and icon resources when the existing stack needs support. Never let a copy-paste component library determine the product's visual identity.

For mobile, Android, embedded, or car/head-unit UI, prefer platform components, existing app components, Material/Compose/XML theme tokens, and device-appropriate control sizing.

Good component use should produce complete states, accessible controls, coherent spacing, consistent icons, and predictable behavior. Do not let a library's default look replace the product's art direction.

## Interaction Quality

High-end interaction is not spectacle. It is clear, immediate, and well-paced state change.

In direct development mode, a polished UI should not be static. Implement at least one meaningful motion or transition layer unless the user, platform, or accessibility context rules it out. Minimum acceptable motion is stateful and visible: press/focus feedback, panel reveal, route or tab continuity, loading/empty transition, list filtering continuity, drag/selection feedback, media/voice state feedback, or success/error response. A color-only hover change is not enough for substantial UI work.

Check:

- Does every click, hover, focus, touch, drag, submit, and navigation have appropriate feedback?
- Are loading, empty, error, disabled, success, and partial-data states designed rather than incidental?
- Are transitions short and purposeful, generally using opacity, transform, or layout continuity rather than heavy effects?
- Are mobile, touch, remote, rotary, or car-display flows free from hover-only affordances?
- Does motion remain performant on the target device?
- Do microcopy and state labels sound like a real product rather than template filler?

When using component/motion resources such as transitions.dev, React Bits, Aceternity UI, HeroUI, or Spectrum UI, borrow both component structure and state behavior. Do not strip the motion away and leave a static clone.

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
- Inspect screenshots for hierarchy, spacing, overflow, contrast, alignment, visual coherence, and template-like or generic AI aesthetics.
- Verify the content/media readiness decision: the final expression should match the readiness level, surface mode, and expression budget.
- Inspect type scale specifically: no hero-sized heading, giant number, or marketing headline should dominate a compact product surface. For any display-size text, verify display need first, then locked typography reference, product context, and supporting content/media.
- Exercise interaction states, not only the default screen.
- Confirm at least one meaningful state transition or motion moment is implemented and visible, with reduced-motion behavior when appropriate.
- Check console/build errors and performance red flags.
- For existing UI, capture or inspect the before state and compare against the after state.
- For new UI, compare the implemented surface against the Art Direction Brief and the selected references.
- Do one self-iteration before final delivery when the first visible result has obvious composition, density, hierarchy, or taste problems.

If full verification is blocked, state the blocker and provide the closest completed evidence.

## Minimum Done Criteria

For UI development, do not finish with design intent only. A complete pass should usually include:

- a brief reference or direction decision appropriate to the task size, backed by inspected evidence
- a content/media readiness level, surface mode, and expression budget for substantial UI work
- an explicit medium decision for substantial UI: static, image/photo, illustration, motion/animation, 3D/model, or hybrid, with a reason tied to the product
- real code edits to the visible surface
- a desktop and target-device or target-viewport check when runnable
- at least one interaction or state check beyond the default screen
- at least one implemented stateful motion or transition layer for substantial UI work, unless explicitly inappropriate
- a typography scale check against foundation references or project tokens, especially for oversized headings and numbers
- a display-need and display-support check when large type is used: explain why the surface truly needs that scale, then name the content, image, animation, model, data object, or editorial material that makes it feel earned
- an evidence pack when the work is substantial: references used, largest text role/size, viewport or screenshot check, motion trigger, and reduced-motion or fallback note
- one self-iteration when the first visible result has obvious hierarchy, spacing, text-fit, motion, or generic-template problems

## Feedback Loop

When the user says the result is ugly, generic, bland, lifeless, static, gimmicky, "食之无味", or the direction is wrong, treat it as art-direction calibration. Do not defend the previous aesthetic. Quickly identify whether the problem is taste stance, product character, reference choice, proportion, expressive composition, visual language, motion/spatial language, color/material, density, type scale, component language, or interaction feel, then revise or roll back the affected surface with a clear scope.
