# Reference Ingestion

Use this guide when selecting or using references. The goal is to make references operational: inspect them, classify their job, extract useful evidence, translate that evidence into the current UI, and verify that the implementation actually used it.

Do not proceed from named references only. A reference only counts when it has been inspected enough to produce a concrete evidence card.

## Contents

- Core Rule
- Reference Role Map
- Selection Recipe
- Reference Evidence Card
- Reference Translation Brief
- Reference-Backed Verification

## Core Rule

Classify references by role, not by fame or category similarity. A beautiful site, a component library, and a design-system guideline solve different problems. Mixing those jobs is one of the easiest ways to produce generic or self-satisfied UI.

For meaningful UI work, select 2-4 references that cover the missing jobs in the task. User-provided references come first, but still classify what each one is for. At least one reference should be a visibly inspectable website, product surface, design-system page, component demo, or screenshot when the task is substantial.

## Reference Role Map

### User-Supplied Direction

Includes user-provided URLs, screenshots, files, component examples, `DESIGN.md`, brand docs, named products, or "make it like this" references.

- Use for: honoring the user's taste selection and explicit intent.
- Inspect: the provided surface directly, including screenshots, rendered demos, or file sections when possible.
- Borrow: the specific quality the user points to: density, composition, motion, component treatment, brand tone, state handling, or interaction feel.
- Avoid: replacing the user's target with an easier fashionable direction.
- Translate: classify the reference into one of the roles below, then state exactly which parts of the current UI will adopt which traits.

### Foundation and Quality Systems

Includes getdesign.md, public `DESIGN.md` files, Apple HIG, Material, Carbon, Polaris, Atlassian, Radix, typography systems, color systems, layout principles, accessibility references, token systems, brand systems, and platform guidelines.

getdesign.md belongs here: it collects Design Systems and Foundations such as Apple HIG, Material, Carbon, Polaris, Radix, typography, color, layout, and accessibility. Use it to constrain quality and consistency, not as a moodboard.

- Use for: quality bars, consistency, token roles, component states, typography hierarchy, layout discipline, accessibility, and responsive rules.
- Inspect: product character, layout principles, token roles, type hierarchy, color roles, component states, motion rules, responsive behavior, accessibility expectations, and do/don't rules.
- Borrow: structure, naming, constraints, quality bars, system-level decisions, and reusable visual rules.
- Avoid: copying another brand identity wholesale or treating foundation docs as visual novelty.
- Translate: convert extracted rules into local tokens, component variants, layout rhythm, and QA checks.

### Project Visual Memory

Includes the existing project's `DESIGN.md`, design docs, screenshots, components, tokens, theme files, prior UI, and shipped surfaces.

- Use for: preserving product continuity and respecting the implementation reality.
- Inspect: intentional product-specific rules, reusable components, token conventions, current shipped behavior, and visible weak spots.
- Borrow: patterns that are intentionally part of the product and still working.
- Avoid: preserving weak or accidental local patterns only because they already exist.
- Translate: decide which existing patterns to preserve, extend, or replace.

### Visual Language and Art Direction

Includes Awwwards, Godly, Land-book, siteInspire, Brand New, Identity Designed, BP&O, Mindsparkle, Designspiration, Cosmos, editorial references, identity systems, moodboards, and admired visual systems.

- Use for: recognizability, visual character, imagery, material, motif, atmosphere, composition, and product-specific visual memory.
- Inspect: composition, image treatment, material, color temperature, typography character, graphic device, rhythm, pacing, and motion atmosphere.
- Borrow: visual language and composition principles that fit the product's desired character.
- Avoid: treating inspiration as proof of usability, flow completeness, component completeness, or accessibility.
- Translate: extract one or two visual moves, then ground them with foundation and implementation references.

### Component, Motion, and Implementation Resources

Includes shadcn/ui, Radix, HeroUI, Spectrum UI, ElevenLabs UI, Reacticx, React Bits, Aceternity UI, transitions.dev, Motion, GSAP, Rive, Lottie, Vivus, Three.js, React Three Fiber, Drei, model-viewer, Spline, glTF, Sketchfab, TanStack Table, Recharts, and code/demo blocks.

- Use for: primitives, state coverage, implementation speed, accessibility scaffolding, animated component patterns, interaction mechanics, motion grammar, spatial/model behavior, and media treatment.
- Inspect: live demo, states, accessibility behavior, API shape, theme model, responsive behavior, dependency cost, license, trigger, timing, easing, reduced-motion behavior, performance cost, camera/framing, loading/poster state, and meaning when relevant.
- Borrow: implementation primitives, state handling, keyboard/touch behavior, built-in transition treatment, motion mechanics, spatial/model patterns, and reusable structure.
- Avoid: importing demo aesthetics as the whole product identity, adding decorative loops, using scroll tricks in task-heavy tools, or adding 3D that does not clarify the product.
- Translate: state the local component, route, interaction, transition, or spatial/media moment where the resource will be adapted and which defaults will be overwritten.

For substantial work, do not treat component/motion resources as optional if the local project lacks strong primitives. Choose a component or motion source and map it into the Component Adoption Plan in `reference-component-execution.md`.

### Functional Frontend Utilities

Includes canvas/drawing libraries, image editors, charting engines, screenshot/export tools, image filters, audio waveform tools, video-on-canvas utilities, physics engines, panorama/360 viewers, and single-purpose effects such as confetti.

This role has low visual-direction weight. These references can solve real frontend functionality, but they should not lead art direction, typography, layout, color, density, or component language.

- Use for: implementing a required frontend capability such as drawing, annotation, diagramming, image editing, export, PDF/image capture, data visualization, audio visualization, 360/product inspection, physics interaction, or state-specific celebration.
- Inspect: API shape, framework fit, maintenance, license, bundle cost, performance, mobile/touch behavior, accessibility, export quality, and how the tool handles real content.
- Borrow: functional primitives, interaction mechanics, rendering approach, data/media handling, export pipeline, and implementation constraints.
- Avoid: treating a utility demo as a visual reference, importing old plugin aesthetics, adding novelty effects without product state meaning, or letting a functional library override the selected component system.
- Translate: state the exact feature it supports and the quality boundaries it must respect: visual system, accessibility, responsive behavior, reduced motion, performance, and fallback.

### Asset and Icon Sources

Includes Developer Icons, All SVG Icons, brand-logo packs, illustration sources, model asset sources, and media asset libraries.

- Use for: finding a specific missing symbol, logo, SVG, image, illustration, or model asset after the visual language is clear.
- Inspect: license, source library, visual weight, stroke/fill style, theme behavior, accessibility labels, and brand usage rules.
- Borrow: the asset or SVG structure only when it fits the selected visual system.
- Avoid: mixing many unrelated icon or asset styles on one surface.
- Translate: normalize sizing, color, stroke/fill, labels, and theme behavior in the local component system.

### Optional Pattern and Flow Checks

Includes Mobbin, Page Flows, Nicelydone, SaaS Interface, real products, and same-category screenshots.

This role is optional and should not lead art direction by default. Same-category product constraints can easily make the result look default, safe, or templated. Use these only when workflow, states, navigation, density, platform expectations, or risk of missing a required flow matters.

- Use for: state inventory, journey order, screen sequencing, density sanity checks, platform expectations, and missing workflow details.
- Inspect: required states, navigation affordances, inputs, filters, empty/error/loading behavior, density limits, and device constraints.
- Borrow: only the workflow or usability constraint that prevents failure.
- Avoid: importing category conventions as visual direction or copying the average competitor look.
- Translate: state the constraint separately from the art direction so it does not override the selected aesthetic references.

## Selection Recipe

For substantial work, build a small reference stack:

1. Start with user-supplied references and classify each one by role.
2. Add a foundation or quality-system reference when layout, type, color, tokens, states, or accessibility are not already settled.
3. Add a visual-language reference when the UI must become more memorable, less generic, or more brand/product-specific.
4. Add component/motion implementation references or asset references only for the concrete execution layer they support.
5. Add functional frontend utility references only when a concrete feature needs that capability. They do not replace foundation, visual-language, or component/motion references.
6. Add an optional pattern/flow check only if state coverage, workflow order, density, or platform behavior is unclear.

Do not use component/motion implementation references alone when layout, typography, color, and visual language are still unresolved.

Do not implement substantial new UI without a component/motion implementation reference or an explicit reason why the existing local component system is sufficient.

## Reference Evidence Card

Create one card per important reference. Keep cards short enough to guide implementation.

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
Transferable evidence:
```

Evidence can be a URL, screenshot, rendered page, component demo, file section, token file, or user-provided asset. If the evidence was not inspected, mark the reference as tentative instead of treating it as direction.

Transferable evidence should be concrete enough to implement or verify: type role/scale, layout density, spacing rhythm, component states, motion trigger/timing, image/model/media quality, content structure, accessibility behavior, or an explicit "do not borrow" constraint.

## Reference Translation Brief

Before major implementation, combine the cards into a brief:

```text
Reference Translation:
Primary direction reference:
Foundation/quality reference:
Visual-language reference:
Component/motion resource reference:
Optional flow/state check:
Borrowed layout decisions:
Borrowed typography/color/component decisions:
Borrowed visual-language decisions:
Borrowed interaction/motion/state decisions:
Explicitly not borrowing:
Content/media readiness impact:
Surface mode impact:
Expression budget impact:
Implementation mapping:
Verification checks:
```

The brief should explain how the target UI will become closer to the references. It should not be a moodboard summary.

## Reference-Backed Verification

After implementation, compare the result against the cards:

- Did the target UI actually adopt the referenced layout rhythm, hierarchy, density, component behavior, visual language, or motion?
- Which reference roles are visible in the rendered result?
- Which borrowed decisions were dropped, and why?
- Did any reference get used for the wrong job, such as using a component demo as art direction or a same-category product as visual identity?
- If the result still feels generic, which card failed to translate into concrete UI?

If the implementation cannot point to visible evidence from at least one card, do not claim the reference was used.
