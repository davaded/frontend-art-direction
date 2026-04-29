# Reference Quality

High-quality references are not merely attractive screenshots. They help determine product character, hierarchy, proportion, interaction quality, and completion level.

## Preferred Reference Roles

High-quality reference use starts by assigning each source a job. A reference can be excellent and still be wrong for the role an agent is trying to use it for.

1. **User-provided direction**
   - URLs, screenshots, component demos, `DESIGN.md` files, examples, or named products supplied by the user.
   - Use first. The user has already done part of the taste selection; inspect it, then classify whether it is foundation, visual language, component/motion implementation, asset, or flow evidence.

2. **Foundation and quality systems**
   - getdesign.md, public `DESIGN.md` files, Apple HIG, Material, Carbon, Polaris, Radix, typography, color, layout, accessibility, token systems, and interaction foundations.
   - Use to extract quality bars, consistency rules, reusable constraints, and system-level design decisions. getdesign.md belongs here because it collects design systems and foundations, not because it is a moodboard.

3. **Project visual memory**
   - Existing `DESIGN.md`, design docs, screenshots, components, tokens, theme files, and shipped surfaces.
   - Use to preserve intentional product continuity, but do not preserve weak local patterns by default.

4. **Visual language and art direction**
   - Godly, Awwwards, Land-book, siteInspire, Brand New, Identity Designed, BP&O, Mindsparkle, Designspiration, Cosmos, Dribbble, Behance, Pinterest, curated screenshots, identity systems, and admired visual systems.
   - Use for mood, composition, art direction, product-specific visual language, imagery, material, and recognizability. Do not trust these as the only source for usability or component completeness.

5. **Component, motion, and implementation resources**
   - shadcn/ui, Radix, HeroUI, Spectrum UI, ElevenLabs UI, Reacticx, React Bits, Aceternity UI, transitions.dev, Motion, GSAP, Rive, Lottie, Vivus, Three.js, React Three Fiber, model-viewer, Spline, TanStack Table, Recharts, icon sets, and similar resources.
   - Use for implementation primitives, animated component patterns, motion/state behavior, spatial/media moments, and state coverage only after product character, layout, typography, and state needs are clear.

6. **Optional pattern and flow checks**
   - Mobbin, Page Flows, Nicelydone, SaaS Interface, real products, and same-category screenshots.
   - Use only when workflow, states, navigation, density, or platform expectations need evidence. Do not use them as the primary art direction source unless the user explicitly chooses one as a visual reference.

Same-category product constraints are not required for art direction and can mislead the design toward an average category look. Keep them separate from visual direction.

For category-specific handling, use `reference-ingestion.md`.

## Reference Brief

Convert references into evidence-backed decisions, not a list of names. Use the card format from `reference-ingestion.md` for major work:

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

## Quality Test

Before using a reference, ask:

- What job is this reference doing: foundation, visual language, component/motion implementation, asset, or optional flow check?
- Is it from a mature product, platform guideline, credible design system, strong visual system, or relevant implementation resource?
- Is it appropriate for this product type, device, and density?
- Does it show real content and states, not only a marketing mockup?
- Can its principle be translated without copying the surface?
- Does it improve the product's character, hierarchy, or interaction quality?
- Can the final UI point to a visible implementation decision borrowed from this reference?

If a reference is only visually appealing but not useful for the product, treat it as mood input, not direction.
