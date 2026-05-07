# Visual Quality Gates

Use these gates for meaningful frontend work, whether improving an existing UI or building a new UI from requirements. The goal is to prevent shallow styling, template-like output, and late discovery that the result is visually weak.

## Gate 1: Product and Surface Diagnosis

Before implementation, identify:

- product type, audience, and primary workflow
- device class, input method, viewing distance, and density target
- realistic content, data states, and edge cases
- existing components, tokens, routes, screenshots, or app shell

For existing UI, name the top 3 visible problems. Prefer issues like weak hierarchy, poor grouping, wrong density, unclear navigation, generic component language, bad content rhythm, or touch/desktop mismatch over vague statements like "needs polish."

For new UI, define the first screen's job, the primary user action, and what the user should understand in the first 3 seconds.

## Gate 2: Reference Lock

Select and inspect 2-4 references before meaningful implementation. Use `reference-ingestion.md` to classify each reference by role before using it. User-provided references come first; do not skip them to search for easier examples. When internet access is available and the user has not already supplied enough direction, search for the missing role: foundation/quality systems, project visual memory, visual-language/art-direction references, component/motion implementation resources, or asset/icon sources.

Use getdesign.md, public `DESIGN.md`, Apple HIG, Material, Carbon, Polaris, Radix, typography, color, layout, accessibility, and token references as foundation constraints for quality and consistency. Do not treat them as moodboards.

Use Mobbin, Page Flows, Nicelydone, SaaS Interface, same-category products, and real-product screenshots only as optional pattern/flow checks when workflow, states, density, or platform expectations are unclear. They should not lead art direction unless the user explicitly chose one as visual direction.

Include `references/visual-foundations.md` when layout, typography, color, tokens, or accessibility choices are not already settled. Include `references/visual-language.md` when imagery, material, motif, atmosphere, brand feeling, or visual identity is not already settled. Include `references/motion-spatial-language.md` when motion, animation, 3D, model viewers, spatial interaction, or immersive effects are part of the direction.

For each reference, record:

```text
Reference:
Role:
Evidence inspected:
What this reference is for:
What to borrow:
What not to borrow:
Applicable surface:
Concrete translation into this UI:
Verification check:
```

Use references for judgment and implementation translation, not surface copying. A component library, animation library, or icon source is not a complete reference by itself unless its product behavior and visual system fit the task. A reference that was only named, not inspected, is tentative and should not drive implementation.

Combine the selected cards into a short Reference Translation Brief:

```text
Primary direction reference:
Supporting references:
Foundation/quality reference:
Visual-language reference:
Component/motion resource reference:
Optional flow/state check:
Borrowed layout decisions:
Borrowed typography/color/component decisions:
Borrowed visual-language decisions:
Borrowed interaction/motion/state decisions:
Explicitly not borrowing:
Implementation mapping:
Verification checks:
```

For substantial UI work, lock the foundations explicitly:

```text
Layout reference:
Typography reference:
Color reference:
Derived layout decisions:
Derived typography decisions:
Derived color decisions:
Avoid:
```

Do not proceed from component/motion implementation references alone when layout, type, color, and visual language are still unresolved. Do not claim a reference was used unless the final UI can point to visible evidence from the card.

## Gate 3: Art Direction Brief

Create a concise Art Direction Brief before changing the visible surface. It must answer:

- product character
- reference direction
- visual hierarchy
- layout rhythm
- composition signature
- visual language
- motion/spatial language
- color and material
- typography
- type scale restraint: whether display-size text is allowed, largest text role, and what must not become oversized
- component language
- interaction feel
- device translation

Expose the brief when the direction is ambiguous, the UI is new, or the work affects a major screen. If the user asked for direct implementation, keep it concise and move into implementation after the brief is clear.

## Gate 4: Expressive Composition First

Do this before decorative styling:

- choose one visual anchor: product object, data object, media object, live preview, workflow area, or dominant content state
- establish page or screen structure
- set information hierarchy
- define primary, secondary, and tertiary content
- tune density, spacing, rhythm, alignment, scale contrast, and focal areas
- group related controls and content
- place the primary action where the workflow expects it
- create at least one product-specific composition move: asymmetry, density contrast, editorial rhythm, instrument-panel grouping, material treatment, or typographic signature
- choose responsive behavior based on the device, not simple scaling

Do not start with gradients, shadows, glow, animated backgrounds, glassmorphism, or decorative cards when the layout and hierarchy are unresolved. If the result looks like an evenly spaced card template, use `expressive-composition.md` before continuing.

## Gate 5: Visual Language Pass

Define the visual system before polishing surfaces:

- visual metaphor or product object
- imagery, photo, illustration, 3D, chart, or media treatment
- graphic motif such as crop, frame, line, grid, waveform, coordinate, mask, contour, corner, or symbol
- surface material, depth logic, borders, shadow, translucency, and texture
- color mood, temperature, contrast, and background energy
- icon and illustration style
- visual rules for empty, loading, error, and success states

Use `visual-language.md` when the UI is clean but looks generic, stock-like, or visually lifeless. Do not add unrelated decorative effects; create one coherent product-specific visual idea and extend it lightly.

## Gate 6: Motion and Spatial Language Pass

Define motion and model rules before implementing effects:

- motion purpose: feedback, state change, continuity, reveal, instruction, comparison, progress, attention, product demonstration, spatial understanding, brand memory, or delight
- motion grammar: which states move, how fast, with what easing, and in what sequence
- trigger model: hover, press, focus, scroll, route change, data update, drag, voice/media state, or explicit user command
- spatial/model role: product inspection, 3D hero, model viewer, data space, interactive diagram, configurator, avatar, or ambient brand object
- technology choice: CSS, Motion, GSAP, Rive, Lottie, Three.js, React Three Fiber, model-viewer, Spline, or another fit
- fallback: reduced motion, static poster, simplified interaction, or non-3D layout

For substantial UI work, implement at least one meaningful motion or transition layer unless the context explicitly rules it out. It can be simple, but it must be stateful and visible: interaction feedback, panel/route continuity, reveal sequence, filtering/list continuity, loading/empty/error/success response, drag/selection feedback, media/voice state, product inspection, or spatial understanding. Do not count static styling, color-only hover, decorative loops, or generic fade-in-on-scroll as sufficient.

Use `motion-spatial-language.md` when motion, animation, or models are central to the experience, when existing motion feels absent, static, gimmicky, generic, too busy, or disconnected from state, or when a component/motion resource is being used.

## Gate 7: Component and State Pass

Unify the component language:

- buttons, icon buttons, inputs, selects, tabs, menus, dialogs, lists, cards, tables, charts, media, and navigation
- hover, focus, pressed, disabled, loading, empty, error, success, selected, and partial-data states
- labels, numbers, dates, helper text, and error text
- keyboard and touch affordances

If weak primitives drag down the whole surface, improve the primitives before polishing individual screens.

## Gate 8: Resource Discipline

Use `frontend-resource-catalog.md` as an execution catalog, not as a taste shortcut.

- Classify component/motion, model, and icon resources with `reference-ingestion.md` before importing or copying them.
- Treat effectful component libraries as component/motion references. transitions.dev, React Bits, Aceternity UI, HeroUI, Spectrum UI, ElevenLabs UI, and Reacticx provide components or component patterns whose motion belongs to state, feedback, and perceived quality.
- React Bits and Aceternity UI can provide motion or component ideas, but they must be adapted to the product character and density.
- shadcn/ui, HeroUI, Spectrum UI, ElevenLabs UI, Reacticx, and similar libraries can accelerate implementation, but defaults should not become the product identity.
- Motion should communicate feedback, continuity, reveal, product meaning, or spatial relationship.
- Vivus should be limited to SVG moments where drawing supports meaning.
- Reacticx is useful for React Native and touch-first interaction ideas.
- Icon sources must stay visually coherent; do not mix many icon systems on one surface.

Reject resource choices that make the UI look like a generic template, animation demo, or component-gallery page.

## Gate 9: Visual QA

Verify the real surface when possible:

- desktop viewport
- mobile or target device viewport
- screenshot inspection for hierarchy, spacing, overflow, contrast, alignment, text fit, and visual coherence
- type-scale inspection: oversized headings, giant numbers, hero-sized words inside compact tools, marketing-page typography used in product UI, or type not justified by the foundation/reference lock
- mechanical-layout inspection: repeated equal cards, average spacing everywhere, weak visual anchor, generic hero pattern, flat type rhythm, or random SaaS-template feel
- visual-language inspection: stock imagery, random decoration, inconsistent icon/illustration/photo treatment, weak material logic, generic gradient background, or no recognizable product motif
- motion/spatial inspection: decorative loops, too many moving elements, weak state meaning, scroll hijacking, unoptimized model assets, poor camera framing, missing poster/loading state, or no reduced-motion fallback
- interaction states, not only the default screen
- console/build errors and obvious performance issues

For existing UI, compare before and after. For new UI, compare the result against the brief and references.

Reference-backed verification:

- Which Reference Evidence Card is visible in the result?
- Which role did each reference play, and was that role respected?
- Which borrowed decisions are present in layout, typography, component states, visual language, or motion?
- Which borrowed decisions were dropped, and why?
- Did any reference get misapplied to the wrong product type, density, or device?

## Gate 10: Self-Iteration Before Final

Before final delivery, ask:

- Is the first read obvious?
- Does the layout feel composed before it feels decorated?
- Is there a memorable visual anchor or composition signature?
- Is there a coherent visual language: imagery, motif, material, depth, texture, and icon style?
- Does motion or spatial media communicate state, meaning, continuity, or product understanding?
- Are animation/model choices performant, accessible, and framed correctly on the target device?
- Is the rhythm varied, or are all regions/cards the same weight?
- Does typography create character beyond a tidy scale?
- Is the largest text role appropriate for this product surface, or did the UI become a big-word poster?
- Is there a clear product character?
- Are controls and states complete enough for real use?
- Does anything look like a generic AI-generated landing page or copied component demo?
- Does the result hold up on the target device size?

If the answer is no, revise once before presenting the work.
