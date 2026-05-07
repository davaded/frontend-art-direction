# Frontend Resource Catalog

Use this catalog when a UI task needs concrete components, animated component patterns, motion behavior, icon sources, or implementation references. Components and motion belong together here because many modern component resources include state transitions as part of their quality. These are resources for execution and taste calibration, not a substitute for product-specific art direction. `Use for` describes common strong fits, not exclusive boundaries; choose resources by judging product goals, interaction value, implementation fit, and how well the pattern can be translated.

## Component, Motion, and Interaction Resources

### Motion

- URL: https://motion.dev/
- Use for: production-grade React, JavaScript, and Vue animation; gestures; layout transitions; exit animations; scroll effects; spring physics; animation orchestration.
- Borrow: clear animation primitives, native-feeling hover/press/drag feedback, layout continuity, and restrained spring motion.
- Avoid: adding motion where hierarchy, spacing, or copy are the real problem.
- Check: reduced-motion behavior, transform/opacity performance, layout shift, and whether animation still communicates state when skipped.

### GSAP

- URL: https://gsap.com/docs/v3/
- Use for: advanced timeline animation, scroll-driven sequences, SVG/text animation, choreography across many elements, and narrative web pages.
- Borrow: timeline discipline, ScrollTrigger-style sequencing, precise control over easing, stagger, pinning, and cross-element motion.
- Avoid: hiding core content behind choreography, adding scroll tricks to task-heavy apps, or animating many elements without hierarchy.
- Check: reduced-motion fallback, scroll control, CPU/GPU cost, cleanup on route changes, and whether motion improves comprehension.

### Rive

- URL: https://riveanimation.com/
- Use for: interactive vector animations, state-machine visuals, mascots, product illustrations, realtime feedback, and app/game-like UI moments.
- Borrow: state-driven animation, input-reactive visuals, and animation that behaves like part of the interface.
- Avoid: looping character or mascot motion that distracts from the task.
- Check: runtime size, state-machine logic, input accessibility, static fallback, and whether the animation communicates a real state.

### LottieFiles and dotLottie

- URLs:
  - https://lottiefiles.com/
  - https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/
- Use for: lightweight pre-authored vector animations, loading, success, error, empty, onboarding, and illustrative loops.
- Borrow: compact animation assets and reusable state illustrations.
- Avoid: generic celebration animations or loaders that do not match the product's visual language.
- Check: file size, playback performance, license/attribution, color theming, reduced-motion fallback, and whether the animation remains legible when paused.

### Vivus

- URL: http://maxwellito.github.io/vivus/
- Use for: SVG path-drawing moments, logos, diagrams, onboarding marks, and technical visual explanations.
- Borrow: delayed, sync, and one-by-one SVG drawing patterns when a drawn reveal supports the message.
- Avoid: long decorative SVG intros, animated body text, or paths that distract from the primary task.
- Check: SVG path quality, timing on low-power devices, replay/rewind controls where useful, and static fallback.

### View Transitions API

- URL: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- Use for: browser-native continuity between route, page, list, detail, filter, gallery, and state changes in SPAs or same-origin MPAs.
- Borrow: old/new view snapshots, `startViewTransition()`, `view-transition-name`, and browser-managed transition lifecycle for object continuity.
- Avoid: using it as a generic page fade, ignoring focus/reading-position issues, or stacking it with other route animations that fight the browser snapshot.
- Check: browser support, feature detection, skipped transitions, same-origin constraints for cross-document use, focus behavior, reduced motion, and fallback.

### CSS Scroll-Driven Animations

- URL: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- Use for: lightweight scroll progress indicators, reveal tied to reading progress, pinned explanatory moments, data/storytelling sequences, and element-in-view emphasis.
- Borrow: CSS timelines, `animation-timeline`, scroll progress, and view progress when motion should be coupled to real scroll position.
- Avoid: scroll hijacking, hiding core reading behind choreography, using scroll effects in dense task tools, or animating properties that cause layout jank.
- Check: browser support, fallback, accessibility, scroll container behavior, transform/opacity performance, and whether scrolling still feels user-controlled.

### AutoAnimate

- URL: https://auto-animate.formkit.com/
- Use for: fast list, table row, form message, drawer, menu, chip, validation, filter, add/remove, and reorder transitions when the project needs small state motion quickly.
- Borrow: parent-level drop-in transitions for layout changes across React, Vue, Svelte, Angular, Solid, Preact, and native JS.
- Avoid: using default motion where custom state choreography is needed, applying it to large complex layouts, or hiding poor information architecture behind automatic transitions.
- Check: unique keys, reduced motion, duration tuning, layout shift, nested animated regions, and whether the transition clarifies state.

### React Spring

- URL: https://react-spring.dev/docs/getting-started
- Use for: React interaction motion, tactile spring feedback, drag/gesture-adjacent UI, SVG, Three.js, and data-driven animated components.
- Borrow: spring-based component state, `useSpring`, `animated`, and event-driven animation control for UI that should feel physical or responsive.
- Avoid: using spring motion for every transition, creating bouncy operational tools, or choosing it when simple CSS/Motion transitions are enough.
- Check: React version, bundle cost, interruption behavior, accessibility, reduced motion, and whether spring physics match product character.

### Anime.js

- URL: https://animejs.com/documentation/
- Use for: DOM, SVG, text, timeline, WAAPI-backed, and choreographed microanimation where CSS or simple component motion is too limited.
- Borrow: timelines, stagger, SVG/text animation, and WAAPI options for focused interface moments.
- Avoid: character-by-character text gimmicks, long intro animations, or choreography that slows task completion.
- Check: API version, tree-shaking, autoplay/RAF behavior, reduced motion, cleanup on route changes, and whether animation still communicates state.

### Theatre.js

- URL: https://www.theatrejs.com/docs/latest
- Use for: authored motion design, cinematic product explanation, WebGL/Three.js scenes, HTML/SVG choreography, and design-led timeline work.
- Borrow: designer/developer animation workflow, sequence authoring, and cross-medium choreography when motion is central to the surface.
- Avoid: adding a professional timeline tool for ordinary hover, list, or route transitions.
- Check: runtime/editor split, bundle cost, team workflow, export/replay behavior, reduced motion, and whether the authored sequence supports product meaning.

### Lenis

- URL: https://github.com/darkroomengineering/lenis
- Use for: smooth scrolling, scroll-to behavior, WebGL scroll sync, parallax/editorial pages, creative product narratives, and scroll-linked visual systems.
- Borrow: controlled scroll engine, RAF integration, GSAP ScrollTrigger syncing, anchors, and nested-scroll prevention patterns.
- Avoid: applying smooth scroll to dense dashboards, forms, modals, car/head-unit surfaces, or tools where native scroll predictability is more important.
- Check: nested scroll, modals, anchors, scroll reset on navigation, touch behavior, performance, `prevent` rules, and reduced-motion/native-scroll fallback.

## 3D, Models, and Spatial Interfaces

### Three.js

- URLs:
  - https://threejs.org/docs/
  - https://threejs.org/examples/
- Use for: custom WebGL/WebGPU scenes, shaders, particles, immersive product visuals, model interaction, spatial data, and 3D hero experiences.
- Borrow: scene graph thinking, camera/framing discipline, lighting/material control, and interactive spatial composition.
- Avoid: generic rotating objects, heavy scenes for decorative value, or custom 3D where a simple model viewer is enough.
- Check: frame rate, memory, asset size, mobile fallback, loading state, camera bounds, and canvas nonblank verification.

### React Three Fiber and Drei

- URLs:
  - https://docs.pmnd.rs/react-three-fiber/
  - https://github.com/pmndrs/drei
- Use for: React-owned Three.js scenes, declarative 3D components, GLB loading, camera controls, environment lighting, helpers, and reusable spatial UI.
- Borrow: componentized scene structure, reusable controls, and React state integration for spatial experiences.
- Avoid: adding 3D complexity when the project does not need custom scene behavior.
- Check: React version fit, suspense/loading states, resize behavior, event handling, and cleanup.

### model-viewer

- URL: https://modelviewer.dev/
- Use for: simple interactive 3D model viewing, product inspection, hotspots, AR handoff, GLB/USDZ display, and model-first product pages.
- Borrow: declarative model embed, accessible model inspection, AR-friendly workflows, and camera/hotspot patterns.
- Avoid: rebuilding a full Three.js viewer when model-viewer handles the needed interaction.
- Check: GLB/USDZ availability, model size, texture optimization, lighting, controls, poster image, loading state, and mobile framing.

### Spline

- URL: https://spline.design/
- Use for: designer-authored interactive 3D scenes, rapid spatial prototypes, web-ready explainers, interactive product visuals, and stylized 3D brand moments.
- Borrow: fast 3D art direction, interactive scenes, and product-specific visual metaphors.
- Avoid: embedding heavy or decorative scenes that slow the first screen or obscure content.
- Check: export/runtime cost, responsiveness, fallback image, keyboard/touch behavior, and visual fit with the app.

### glTF

- URL: https://www.khronos.org/gltf/
- Use for: runtime 3D asset delivery, GLB/GLTF pipelines, PBR materials, textures, animations, and interoperable model handoff.
- Borrow: production model format discipline and asset pipeline thinking.
- Avoid: unoptimized source assets, oversized textures, and model formats that require unnecessary conversion at runtime.
- Check: compression, texture sizes, material count, animation clips, license, and loader support.

### Sketchfab

- URL: https://sketchfab.com/
- Use for: 3D model discovery, model mood references, licensed assets, topology/material inspection, and interactive model presentation ideas.
- Borrow: model quality benchmarks, inspection patterns, material presentation, and category-specific spatial references.
- Avoid: using assets without checking license, attribution, optimization, and fit with the product's visual language.
- Check: license, polycount, texture size, format availability, attribution, and whether the model needs cleanup.

## Animated Component and Transition Patterns

These examples combine component structure, state, and motion. Use them as component/motion references together.

### Transitions.dev

- URL: https://transitions.dev/
- Use for: minimal web components and UI state patterns with built-in transitions, such as card resize, number changes, badges, text swaps, menu/modal/panel reveals, page transitions, and icon swaps.
- Borrow: compact component structure, state-to-state continuity, restrained transition details, and copy-adaptable CSS/React patterns.
- Avoid: treating transition demos as complete product components, applying effects before the component's role and state model are clear, or letting motion compensate for weak layout.
- Check: keyboard and touch behavior, reduced-motion fallback, layout shift, text fit during state changes, and whether the transition improves component comprehension.

### React Bits

- URLs:
  - https://www.reactbits.dev/
  - https://reactbits.dev/get-started/introduction
- Use for: animated React components, text effects, backgrounds, cursors, transitions, and expressive microinteractions.
- Borrow: focused interaction ideas and implementation details for memorable surfaces.
- Avoid: stacking many effects on one screen, using novelty effects in operational tools, or copying a component without adapting density and tone.
- Check: bundle impact, accessibility, reduced motion, mobile/touch behavior, and whether the effect improves the user task.

### Aceternity UI

- URL: https://ui.aceternity.com/components/card-hover-effect
- Use for: Tailwind/shadcn-compatible animated blocks, cards, backgrounds, hero effects, nav patterns, and hover-driven component ideas.
- Borrow: polished card-hover treatment, directional highlights, and production-ready copy-paste patterns when they fit the product.
- Avoid: hover-only critical interactions, generic SaaS hero composition, overuse of glow/beam/sparkle effects, and ornamental backgrounds in dense tools.
- Check: keyboard focus parity, touch fallback, dark/light theme fit, and whether the block matches the existing component system.

## Component Systems and Effectful UI Kits

### shadcn/ui

- URL: https://ui.shadcn.com/
- Use for: open-source React components that can become the foundation of a custom design system, especially Tailwind/Radix projects, dashboards, forms, command surfaces, settings, tables, charts, and app shells.
- Borrow: source-owned component code, accessibility primitives, composable blocks, copy-and-adapt workflow, and the idea of starting from strong primitives then making them your own.
- Avoid: shipping the default shadcn look unchanged, treating it as a finished brand identity, or mixing it with another component system without a token plan.
- Check: Radix/Tailwind fit, registry compatibility, local component ownership, theme tokens, keyboard behavior, dark mode, and whether the resulting UI still has product-specific character.

### HeroUI

- URL: https://heroui.com/
- Use for: polished React UI components across web and mobile contexts, especially forms, menus, modals, tables, dashboards, chat, and finance-like surfaces.
- Borrow: component completeness, state coverage, themeable component language, and compact-but-friendly product UI examples.
- Avoid: replacing an existing design system without a reason, or accepting default styling when the product needs a stronger identity.
- Check: framework compatibility, accessibility behavior, theming model, dependency cost, and how well it coexists with existing primitives.

### Spectrum UI

- URL: https://ui.spectrumhq.in/
- Use for: production-ready Next.js, shadcn/ui, and Tailwind component blocks such as auth, billing, charts, metrics, settings, quick actions, productivity widgets, and SaaS-style interface sections.
- Borrow: ready-to-use block structures, compact dashboard patterns, practical SaaS states, and implementation shortcuts when the product category matches.
- Avoid: using it as the whole art direction, dropping unrelated blocks into a product, or inheriting generic SaaS density and copy.
- Check: whether each block matches the target workflow, token system, responsive behavior, accessibility expectations, and existing component language.

### ElevenLabs UI

- URL: https://ui.elevenlabs.io/
- Use for: open-source agent, voice, audio, and conversational UI components such as voice chat, waveforms, audio players, realtime agent states, and interactive orbs.
- Borrow: audio-state visualization, voice-first interaction patterns, realtime feedback, agent status treatment, media control details, and high-signal ambient feedback patterns that can be translated to other realtime interfaces.
- Avoid: importing voice UI chrome as generic decoration, or using orbs/waveforms without a clear state, feedback, or interaction purpose.
- Check: whether the pattern communicates useful state in this product, audio permissions when applicable, loading/listening/talking/error states, reduced motion, accessibility labels, latency feedback, and fallback behavior when media features are unavailable.

### Reacticx

- URL: https://www.reacticx.com/
- Use for: React Native UI ideas built around Expo, Reanimated, Gesture Handler, and Skia.
- Borrow: mobile-first premium interaction patterns, smooth gestures, bottom sheets, parallax headers, carousels, split views, and tactile settings/chat flows.
- Avoid: porting native/mobile patterns directly to desktop web without rethinking density and input method.
- Check: React Native dependency fit, gesture performance, Skia/Reanimated setup, and behavior on real devices or emulators.

## Icons and SVG Assets

### Developer Icons

- URL: https://github.com/xandemon/developer-icons
- Use for: optimized SVG technology logos in developer tools, integration pages, stack badges, onboarding, docs, and portfolio surfaces.
- Borrow: consistent React component usage for tech-logo rendering and scalable SVG delivery.
- Avoid: mixing logo systems with mismatched sizes, colors, or visual weights.
- Check: brand usage rules, package license, icon naming, tree-shaking behavior, and dark/light theme visibility.

### All SVG Icons

- URL: https://allsvgicons.com/
- Use for: broad SVG icon discovery when the existing icon set does not cover the needed symbol or brand.
- Borrow: raw SVG, JSX, PNG, or Base64 exports only after choosing one source library and keeping the visual style coherent.
- Avoid: mixing icons from many libraries on one surface, using unverified brand marks, or pasting inaccessible SVGs.
- Check: original icon library license, stroke/fill consistency, accessible labels, sizing, and theme color control.

## Functional Frontend Utilities (Low Direction Weight)

Use these only when the product requires the capability. They are front-end implementation references, not primary visual direction references.

### Canvas, Drawing, and Diagramming

- Fabric.js: object-based Canvas/SVG editing, annotation, lightweight image/layout editors, and product customizers. Check serialization, selection handles, text editing, export, and mobile pointer behavior.
- Konva and react-konva: interactive canvas scenes, whiteboards, diagrams, editors, map-like layers, drag/resize handles, and React-owned canvas components. Check hit testing, high-DPI rendering, accessibility alternatives, and responsive scaling.
- p5.js: generative visuals, creative coding, lightweight visual experiments, and interactive sketches. Use carefully in production tools; avoid making generative sketches the product identity unless that is the concept.
- Atrament and react-native-sketch-canvas: drawing, signature, sketch, and touch-first input surfaces. Check pressure/touch behavior, undo/redo, export, and device performance.

### Lightweight Spatial, Physics, and Inspection

- Zdog: designer-friendly pseudo-3D Canvas/SVG objects for lightweight playful product objects or diagrams. Avoid using it where real model inspection is needed.
- Curtains.js: WebGL effects that map DOM/media into interactive planes. Use for media-driven editorial/product surfaces, not dense tools.
- Matter.js and Planck.js: 2D physics for tactile demos, games, playful configurators, or constrained interaction moments. Avoid physics as decoration.
- Pannellum and JS-Cloudimage-360-View: panorama, 360 view, and product inspection. Check asset size, controls, keyboard/touch behavior, loading state, and fallback imagery.

### Data, Chart, and Media Rendering

- ECharts, Chart.js, ApexCharts, Vega, and Lightweight Charts: data visualization engines for dashboards, finance, scientific, and operational UI. Borrow interaction patterns and rendering capability, then apply local tokens, density, typography, and accessibility.
- wavesurfer.js: audio waveform display and interaction for media, voice, podcast, transcription, and music tools. Check waveform meaning, seek/selection behavior, loading state, and reduced-motion or static fallback.
- Canvid: canvas playback for short video-like sequences when normal video or Lottie is not suitable. Check file weight, playback controls, and accessibility.

### Image Editing, Filters, Capture, and Export

- TUI Image Editor, DarkroomJS, and canvasfilters: low-weight functional references for image editing, crop, transform, annotation, and filter features. Treat their UI as old/default unless restyled into the product system.
- html2canvas, dom-to-image, html-to-image, and html2pdf.js: low-weight functional references for screenshot, poster, image, and PDF export pipelines. Use for output features only; they are not primary visual or motion references. Check font loading, cross-origin images, canvas tainting, output scale, pagination, and dark/light theme rendering.

### Single-Purpose Effects

- canvas-confetti and react-particle-effect-button-style effects: low-weight functional references for state-specific celebration or completion feedback. Use only for meaningful success moments; keep duration short and provide a reduced-motion fallback.

## Selection Rules

- Start with the product need: component system, animated component pattern, motion behavior, or asset source.
- Prefer the product's existing component and icon stack before adding a new dependency.
- Use copy-paste component libraries as implementation accelerators, not art-direction replacements.
- Use shadcn/ui, Spectrum UI, and similar block libraries as owned implementation material: adapt tokens, spacing, content, states, and interaction to the selected art direction.
- Treat transitions.dev, React Bits, Aceternity UI, and similar effectful component catalogs as component/motion references: adapt the component state, density, timing, and accessibility to the product.
- Evaluate specialty libraries such as ElevenLabs UI by their transferable interaction ideas and implementation fit, not by a fixed category whitelist.
- Treat functional utilities as low-weight implementation references: useful for capabilities, not for visual identity.
- Choose the lightest motion or spatial medium that expresses the intended state or product idea.
- Use 3D models only when they help inspect, understand, demonstrate, sell, or embody the product.
- Keep motion purposeful: feedback, continuity, reveal, or spatial understanding.
- For mobile or car/head-unit work, avoid hover-first resources unless there is a touch/remote equivalent.
- Before shipping, verify keyboard, touch, reduced motion, responsive layout, console errors, and visual consistency.
