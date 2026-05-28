# High-Fidelity Prompt Patterns

Use this reference when the user provides detailed landing-page, portfolio, hero, carousel, or cinematic UI prompts and asks whether they are useful as art-direction material. These prompts are style-specific examples, not universal defaults.

The goal is to extract reusable execution discipline: asset readiness, visual medium choice, typography, layout, motion, component states, responsive behavior, and verification requirements.

## Core Rule

Treat strong media as a first-class input, not decoration. Cinematic, editorial, spatial, or character-led pages usually work because high-quality video, photography, 3D renders, GIFs, product imagery, or authored motion carry the page. Do not replace missing media with a few abstract SVG shapes, gradient blobs, generic noise, or arbitrary CSS effects.

If the prompt depends on external media links, preserve the lesson while avoiding brittle dependency on the exact URL:

- identify the asset role: hero video, product object, character figure, portfolio tile, icon, proof, ambient background, or state preview
- note the required quality: focal point, framing, contrast, motion speed, transparency, resolution, loopability, file size, and licensing
- verify the asset loads and has a fallback: poster, solid background, generated/local asset, or downgraded layout
- do not copy a URL into durable skill guidance unless it is a stable, licensed project asset

## What To Extract

When reading a high-fidelity UI prompt, make an evidence card:

```text
Prompt family:
Surface mode:
Primary visual medium:
Asset dependency:
Signature visual move:
Typography system:
Color/material system:
Layout skeleton:
Motion system:
Component/state requirements:
Responsive translation:
Performance/accessibility risks:
What transfers:
What does not transfer:
```

Transfer principles, not screenshots. A "dark cinematic studio page" can teach media framing, type scale, glass material restraint, and scroll pacing without forcing every future product into dark video heroes.

## Useful Prompt Granularity

Good build prompts are specific enough for implementation and verification. They often specify:

- stack and dependency boundaries, including exact libraries and version constraints when needed
- fonts, fallback fonts, weights, and where each font is used
- color roles, not only color swatches
- real copy, labels, counts, states, and link text
- asset URLs or asset requirements, plus preloading/fallback behavior
- section structure, viewport behavior, spacing, grid rules, and breakpoint changes
- component morphology: pills, rails, cards, docks, media frames, buttons, tags, and icon placement
- motion triggers, timing, easing, stagger, locking, cleanup, and reduced-motion fallback
- interaction states: hover, focus, active, disabled, loading, selected, drag, and scroll-linked behavior
- verification expectations: desktop/mobile viewports, screenshots, media load, console errors, and text-fit checks

This level of specificity is useful because it makes the visual system executable. It should be adapted to the product context instead of copied mechanically.

## Style Families From The Provided Examples

### Cinematic Space / Liquid Glass

Best fit:

- L3 media readiness with strong looping video or spatial background
- editorial marketing, launch, event, travel, aerospace, entertainment, or immersive product explanation
- one or two full-viewport sections where atmosphere is part of the message

Transferable moves:

- full-bleed video with deliberate focal framing
- liquid-glass controls used as chrome, not as every surface
- word-by-word reveal for primary copy
- rAF video fade loops when seamless video matters
- compact proof chips, partner rows, or stats cards floating over media

Avoid:

- using glass panels to compensate for weak media
- placing dense product workflows over high-motion backgrounds
- relying on dark overlays so heavily that the media becomes invisible

### Creator Portfolio / 3D Editorial

Best fit:

- creator, studio, art, design, 3D, motion, or project showcase pages
- strong renders, portfolio thumbnails, character images, or authored project images

Transferable moves:

- large identity type earned by a real person/object/project anchor
- magnetic hover on the primary object
- scroll-driven marquee for portfolio breadth
- sticky stacking project cards for sequential case studies
- service rows with oversized numbering only when the page is intentionally editorial

Avoid:

- giant type without a strong portrait/object/project image
- GIF walls that overpower project selection or hurt performance
- sticky stacks that trap mobile users in too much scroll choreography

### Character Carousel / Toy Figurine

Best fit:

- game, collectible, character, toy, mascot, avatar, product variant, or visual catalogue hero
- isolated transparent PNG/WebP assets with consistent lighting and scale

Transferable moves:

- role-based carousel state: center, left, right, back
- synchronized background, scale, blur, opacity, and position changes
- navigation lock during transitions
- preloading all hero-critical images
- mobile-specific size and bottom-position maps instead of pure proportional scaling

Avoid:

- applying the carousel to unrelated card content
- using inconsistent asset crops that break role transitions
- leaving keyboard, touch, or reduced-motion behavior undefined

### Minimal Trust Hero With Video

Best fit:

- healthcare, accessibility, assistive tech, civic, finance, education, or trust-sensitive products
- real video exists, but the message needs clarity and calm over spectacle

Transferable moves:

- small bottom-left content block over a full-screen product/lifestyle video
- neutral pills and restrained system type
- direct value proposition and one clear CTA
- minimal animation limited to hover and state feedback

Avoid:

- forcing cinematic typography onto sensitive or utility products
- masking weak product proof behind atmosphere
- adding extra sections when the request is a single hero

## Asset Readiness Gate

Before implementing a media-led prompt, answer:

- What exact asset carries the first impression?
- Is it real, provided, generated, searched, or placeholder?
- Can it load quickly enough for the viewport?
- Does it still work when cropped on mobile?
- Is the focal subject visible without text covering it?
- What is the fallback if the video/image/model fails?
- Is the asset legally and ethically usable for the project?

If the answer is weak, reduce expression or acquire better media before building a cinematic page.

## Prompt-to-Implementation Translation

Use this sequence:

1. Classify the prompt family and surface mode.
2. Separate durable principles from brittle asset URLs.
3. Inventory media assets and fallbacks.
4. Convert style details into tokens: fonts, color roles, radii, material, spacing, type scale, motion durations.
5. Convert effects into stateful components with cleanup and reduced-motion behavior.
6. Implement the smallest complete surface that proves the style.
7. Verify media load, text fit, performance, and responsive framing.

## Anti-Patterns

- treating external media URLs as permanent design-system assets
- copying a prompt's exact aesthetic into a mismatched product category
- using display type because a reference did, without proving display need
- using scroll reveals, blur text, or marquee motion as a substitute for content
- building a beautiful first screen with no loading, fallback, mobile, or interaction states
- hand-drawing generic vector decorations when the page needs a real product, person, place, scene, chart, model, or gameplay object
