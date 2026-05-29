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

## Preserve The Reference, Then Translate

When a user gives a long, detailed UI prompt as a reference, do not flatten it into a vague style label. First preserve its executable structure, then translate it to the current project.

Keep:

- section order and viewport behavior
- named components and interaction roles
- exact font pairings or equivalent type roles
- color/material tokens and their usage roles
- media asset roles and focal rules
- animation timing, easing, cleanup, and reduced-motion expectations
- responsive breakpoints and mobile-specific geometry
- verification requirements

Translate:

- brand names, copy, imagery, domain details, and external asset URLs
- framework-specific syntax when the target stack differs
- display type scale when the target content cannot support it
- motion intensity when the product is more trust-sensitive or task-heavy

Do not reduce "cinematic video hero with rAF fading, liquid-glass chrome, word blur-in, stats chips, and media cards" to "make it modern and animated." The craft is in the specificity.

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

Implementation signature from the reference prompts:

- two-section or hero-plus-capabilities structure
- full-bleed looping background video, sometimes manually crossfaded with requestAnimationFrame instead of CSS transitions
- floating or fixed nav with restrained liquid-glass pills
- blur-in or pull-up word animation for the primary headline
- compact proof layer: badge, stats, partner names, capability cards, tags
- no heavy dark overlay when the media is strong enough; contrast is handled through composition and foreground chrome
- verification must include media load, loop quality, mobile crop, and text contrast over moving footage

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

Implementation signature from the reference prompts:

- full-height identity hero with a centered portrait/object layer and oversized name/title typography
- magnetic hover or subtle object-follow interaction for the main image when it reinforces craft
- scroll-linked marquee or proof strip that shows actual project breadth
- full-height about section with corner media objects only if they are high-quality 3D/renders, not generic decoration
- service list with large numbering and editorial spacing
- sticky project cards that scale/stack only when the page has strong project imagery
- performance checks for GIFs, sticky sections, and scroll-triggered image grids

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

Implementation signature from the reference prompts:

- state model with `activeIndex`, animation lock, mobile breakpoint, and derived roles
- roles such as center, left, right, and back, each with explicit scale, blur, opacity, z-index, height, bottom, and left values
- background color and panel color tied to the active item
- all hero-critical images preloaded on mount
- navigation buttons are visible object controls, not hidden gesture-only behavior
- transition duration and easing are shared across object, background, blur, opacity, and position
- mobile layout uses separate role geometry instead of shrinking the desktop stage

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

Implementation signature from the reference prompts:

- full-screen real product/lifestyle video with restrained foreground UI
- neutral nav pills and a small, clear bottom-left message block
- direct headline, short support text, one primary CTA
- system type can be stronger than expressive type for trust-sensitive surfaces
- animation is limited to state feedback and hover movement
- verification focuses on copy legibility, calm pacing, and whether the product benefit is visible

### Creative Studio / Warm Cinematic Editorial

Best fit:

- creative studios, production houses, visual artists, collectives, workshops, editorial portfolios
- strong video or image-led feature proof with a moody but controlled color system

Transferable moves:

- warm cream text on black or near-black backgrounds
- one display identity moment supported by video or image texture
- italic serif accent used sparingly for personality, paired with a readable body face
- pull-up word animation for titles and scroll-linked character opacity for a short editorial paragraph
- noise texture as atmosphere only when it supports the media, not as the main visual
- feature cards mixing one media card with utility cards, icons, checklists, and links

Avoid:

- turning every section into a card
- making noise/cream/dark palette the whole design
- using character-by-character animation for long body copy or task UI

Implementation signature from the reference prompts:

- hero with inset rounded video container and bottom-aligned grid content
- nav as a hanging top pill or compact glass/pill system
- big brand word with a small custom mark or asterisk only when it functions as identity
- about section as an editorial statement with mixed font styles
- features section with staggered card entry, one media card, and several structured workflow cards
- custom CSS utilities for texture, but content/media remains primary

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
