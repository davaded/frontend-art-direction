# Frontend Resource Catalog

Use this catalog when a UI task needs concrete components, animation patterns, icon sources, or implementation references. These are resources for execution and taste calibration, not a substitute for product-specific art direction. `Use for` describes common strong fits, not exclusive boundaries; choose resources by judging product goals, interaction value, implementation fit, and how well the pattern can be translated.

## Motion and Interaction

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

## Animated Component References

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

## Component Systems

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

## Selection Rules

- Start with the product need: component system, motion behavior, or asset source.
- Prefer the product's existing component and icon stack before adding a new dependency.
- Use copy-paste component libraries as implementation accelerators, not art-direction replacements.
- Use shadcn/ui, Spectrum UI, and similar block libraries as owned implementation material: adapt tokens, spacing, content, states, and interaction to the selected art direction.
- Evaluate specialty libraries such as ElevenLabs UI by their transferable interaction ideas and implementation fit, not by a fixed category whitelist.
- Choose the lightest motion or spatial medium that expresses the intended state or product idea.
- Use 3D models only when they help inspect, understand, demonstrate, sell, or embody the product.
- Keep motion purposeful: feedback, continuity, reveal, or spatial understanding.
- For mobile or car/head-unit work, avoid hover-first resources unless there is a touch/remote equivalent.
- Before shipping, verify keyboard, touch, reduced motion, responsive layout, console errors, and visual consistency.
