# Media-Led Experiential Patterns

Use this reference for landing pages, portfolio pages, hero sections, launch pages, and visual demos where the primary experience is carried by strong media: video, photography, 3D renders, character assets, product imagery, GIFs, canvas, or authored motion.

This is not an "animation effects" category. Motion is only one layer. The category is a full visual system: media asset, crop, layout, typography, material, interaction, responsive framing, performance, and fallback.

## When This Pattern Fits

Use only when the surface has L2 or L3 content/media readiness:

- a real product, person, place, character, model, project, gameplay state, visual dataset, or editorial scene
- media that is good enough to carry the first impression
- a first-screen job of persuasion, demonstration, immersion, brand memory, portfolio proof, or product inspection
- time to verify media loading, crop, contrast, and motion behavior across viewports

If the media is weak or absent, first acquire, generate, search, or request better media. If that is not possible, downgrade to restrained interface craft instead of pretending the page is cinematic.

## Pattern Taxonomy

### Filmic Atmosphere

Primary object:

- full-bleed video, spatial background, product environment, launch scene, or cinematic loop

Useful for:

- aerospace, travel, entertainment, studio, launch, event, luxury, AI/media tooling, or immersive storytelling

Signature moves:

- full-viewport section with carefully framed background video
- minimal foreground chrome: navigation pill, CTA, proof chip, small stat cards
- restrained glass or translucent material only where contrast is needed
- typography that reads as a title treatment, not generic large text
- video fallback: poster frame, static still, or simplified solid-background layout

Checks:

- the subject remains visible on mobile crop
- text does not sit over the busiest part of the video
- loop transition is acceptable or custom-faded
- foreground glass does not become the visual gimmick

Reference-style systems:

- space-travel or aerospace hero with full-bleed video, glass nav, blur-in display type, compact stat cards, partner proof, and a second video-backed capabilities section
- studio or creative collective hero with inset rounded video, warm cream type, pull-up word animation, and structured feature cards

These systems are allowed to be visually heavy when the video and copy justify it. Build them with real media, not synthetic decoration.

### Object / Character Stage

Primary object:

- transparent PNG/WebP character, toy, model, product variant, avatar, or rendered object

Useful for:

- collectibles, games, avatars, toys, mascots, product variants, fashion items, vehicles, consumer objects

Signature moves:

- centered object with supporting ghost type or color field
- role-based carousel states such as center, left, right, back
- synchronized background color, object scale, blur, opacity, and position
- image preloading for all critical variants
- explicit mobile geometry instead of proportional shrink-only behavior

Checks:

- assets have consistent lighting, scale, crop, and transparent edges
- transition lock prevents state overlap
- keyboard/touch/reduced-motion behavior remains usable
- object does not hide the key CTA or brand label

Reference-style systems:

- figurine or character carousel where four assets rotate through center, side, and back roles
- product variant stage where the active item changes background color, scale, blur, and z-order
- collectible/game/avatar hero where oversized ghost type creates depth behind the object

The important part is the role system. Do not implement this as a generic carousel with sliding cards.

### Creator / Portfolio Editorial

Primary object:

- portrait, 3D render, case-study imagery, project thumbnails, motion previews, or authored visual grid

Useful for:

- designers, studios, artists, photographers, 3D creators, motion designers, portfolios, agencies

Signature moves:

- identity-scale type only when paired with a strong portrait/object/project anchor
- project proof appears early: marquee, tiled previews, sticky case-study stack, or image-led list
- tactile interaction such as magnetic object hover when it reinforces the craft identity
- service rows or project cards with distinct editorial hierarchy

Checks:

- portfolio media proves the claim instead of acting as filler
- marquee/GIF usage has a performance budget and does not overwhelm selection
- sticky effects do not trap mobile scroll
- the page still works when a project image loads late

Reference-style systems:

- 3D creator portfolio with a hero portrait/object, scroll-driven project marquee, full-height about section, service rows, and sticky project case-study cards
- creative studio landing page where typography, proof media, feature cards, and editorial copy work as one brand system

The proof media must appear early. A portfolio without real project imagery should use restrained layout and ask for assets.

### Trust-Sensitive Media Hero

Primary object:

- product/lifestyle video, real user scene, assistive product, medical/health/civic/finance/education proof

Useful for:

- healthcare, accessibility, civic tools, education, assistive tech, finance, safety, enterprise trust

Signature moves:

- video can be full-screen, but the UI stays quiet and legible
- small content block with concrete value proposition and one CTA
- system type, neutral material, and calm pacing
- minimal interaction polish instead of cinematic spectacle

Checks:

- copy is clear before it is poetic
- the user benefit is not hidden behind atmosphere
- motion does not reduce perceived trust
- contrast and legibility pass without heavy overlays

Reference-style systems:

- assistive/prosthetics product hero with full-screen real-life video, neutral nav pills, small bottom-left copy, and one CTA
- healthcare or accessibility hero where calm product proof matters more than cinematic spectacle

This can still be media-led, but the expression budget is spent on trust, not visual drama.

## Reference Capture Format

For a user-provided media-led prompt, capture it before adapting:

```text
Reference name:
Page type:
Sections:
Primary media:
Secondary media:
Typeface system:
Color/material system:
Signature layout:
Signature interaction:
Motion/scroll system:
Component families:
Responsive-specific rules:
Asset risks:
Performance risks:
What must transfer:
What can change:
```

If the reference is strong, keep the component and motion specificity. If the target product differs, change the medium or intensity, not the level of craft.

## Durable Building Blocks

## Implementation Capability Cards

Use these as capability choices inside a media-led surface. They are not a style by themselves.

### Spline Interactive 3D

Role:

- designer-authored spatial object or organic 3D scene

Use when:

- the page needs an interactive 3D presence faster than custom modeling or custom Three.js scene engineering
- the object is part of the product story, portfolio proof, or spatial brand memory

Do not use when:

- the scene is only background decoration
- performance, accessibility, or loading fallback cannot be verified
- the product needs precise custom shader, physics, model pipeline, or data-driven 3D behavior

### Route Prefetch And Instant Transitions

Role:

- perceived-performance and navigation-continuity layer

Use when:

- an app or landing page has a trend, gallery, article, project, or product-detail section where the next view is predictable
- the framework supports safe prefetching and the target page assets are reasonable

Do not use when:

- prefetching would waste bandwidth on large videos, heavy 3D, or many unlikely routes
- authenticated, user-specific, or rapidly changing data could become stale

### WebGL ShaderMaterial

Role:

- procedural visual material, not an image replacement

Use when:

- color, light, distortion, liquid, iridescence, or spatial feedback should respond to cursor, scroll, audio, time, or product state
- the shader expresses the page's subject or interaction model

Do not use when:

- a static image or video would communicate better
- shader motion is merely decorative noise
- mobile GPU performance and reduced-motion fallback are not planned

### GSAP ScrollTrigger

Role:

- authored scroll narrative and pinned-section choreography

Use when:

- a heading, product object, or scene should pin while another layer changes independently
- scroll position controls a clear explanation, comparison, reveal, or spatial transition

Do not use when:

- native CSS scroll-driven animation, Motion, or a simpler sticky layout is enough
- scroll choreography hides core content or makes mobile navigation feel trapped

### CSS Clamp

Role:

- responsive sizing primitive for display type, object scale, spacing, and fixed-format UI

Use when:

- a media-led page needs large type or objects to scale across mobile and desktop without overflow
- min and max bounds are known and verified

Do not use when:

- the size needs semantic type roles, user text scaling, or container-specific behavior that viewport-only math cannot handle

### Media Asset Contract

For every hero-critical asset, define:

```text
Role:
Source:
Subject/focal point:
Crop rules:
Mobile crop:
Loop behavior:
Fallback:
Load/performance budget:
Rights/licensing:
```

This is often more important than the color palette. A strong visual page with weak media will collapse into decoration.

### Type Contract

Define:

- display font and body font
- where display type is allowed
- largest text role and approximate size
- line-height and tracking behavior
- whether the type is identity, headline, proof, label, or control text
- text-fit rules for mobile and narrow containers

Display type is not permission to shout. It needs a role: brand mark, editorial title, spatial depth, product category, or portfolio identity.

### Material Contract

Define:

- where glass/translucency appears
- blur strength and border treatment
- whether material is foreground chrome, card surface, control, or atmospheric layer
- how contrast is maintained without burying the media

Avoid making every component a glass card. A material language is stronger when it has restraint.

### Interaction Contract

Define:

- what changes state
- what motion expresses
- duration and easing
- input lock if needed
- cleanup for timers, animation frames, video listeners, and scroll listeners
- reduced-motion fallback

Good experiential UI often has fewer interactions, but each one feels deliberate.

### Responsive Contract

Define:

- viewport-specific crop and focal point
- object position and scale maps
- type ceilings
- nav compression
- CTA position
- media fallback on low-power/mobile contexts

Do not merely shrink desktop composition. Re-stage the scene for mobile.

## Implementation Notes

- Use native video/image behavior where possible, but implement custom loops when the visual transition matters.
- Preload only first-screen critical assets; lazy load proof grids and lower sections.
- Prefer transform and opacity for frequent animation.
- Avoid unbounded render loops unless a 3D/canvas scene genuinely needs them.
- Add `prefers-reduced-motion` behavior for scroll-linked, marquee, carousel, and cinematic reveal systems.
- Verify with screenshots or browser inspection because media crop and text overlap are hard to judge from code.

## Downgrade Rules

Downgrade the style when:

- assets are missing, generic, low-resolution, watermarked, badly cropped, or legally uncertain
- the product is a dense tool, admin UI, table, settings flow, or repeated work surface
- the main user need is speed, comparison, accuracy, or trust rather than immersion
- mobile framing breaks the visual object
- motion becomes the thing users notice more than the product

When downgraded, preserve craft through layout, hierarchy, type roles, component states, and useful micro-interactions rather than decorative substitutes.
