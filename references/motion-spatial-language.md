# Motion, Animation, and Spatial Language

Use this reference when a UI needs motion, animation, 3D, model viewers, spatial storytelling, or interactive visual systems. Motion and models are part of art direction, not decoration.

For resources such as transitions.dev, React Bits, Aceternity UI, HeroUI, Spectrum UI, and ElevenLabs UI, treat component structure and motion together. Use this guide to define how those animated components fit the product's broader motion grammar, spatial behavior, media, or animation system.

## Motion Lock

For meaningful motion or model work, define this before implementation:

```text
Motion purpose:
Motion grammar:
Spatial/model role:
Trigger model:
Timing and easing:
Performance budget:
Reduced-motion fallback:
What to avoid:
```

Motion purpose must be concrete: feedback, state change, continuity, reveal, instruction, comparison, progress, attention guidance, product demonstration, spatial understanding, brand memory, or delight after task success.

## Default Motion Requirement

For substantial frontend work, the default expectation is not a static screen. Implement a small motion system unless the user, platform, performance budget, or reduced-motion requirement makes that inappropriate.

Minimum viable motion should include at least one of:

- press, focus, selected, loading, success, error, drag, or media-state feedback
- panel, drawer, tab, route, filter, sort, expand, collapse, or detail-view continuity
- reveal sequencing that clarifies reading order
- data/status update transition that preserves object identity
- product-specific animation, model, or spatial moment tied to the core object

Do not count static visual styling, color-only hover, decorative background loops, or generic fade-in-on-scroll as sufficient motion for a meaningful UI pass.

## Motion Grammar

Define a small set of repeated rules:

- **Feedback**: press, hover, focus, selected, success, error, loading, listening, recording, dragging, dropping.
- **Continuity**: preserve object identity across navigation, filtering, expansion, collapse, tab changes, and route changes.
- **Reveal**: introduce hierarchy in sequence; reveal primary content before secondary ornament.
- **Spatial relationship**: show where panels, objects, layers, or models exist relative to one another.
- **Attention**: guide the eye to one action or status, not every action at once.
- **Narrative**: support scroll, onboarding, product explanation, or step-by-step comprehension.
- **Ambient life**: subtle background motion only when it reinforces product state or atmosphere.

## Animation and 3D Reference Sources

### Motion

- URL: https://motion.dev/
- Use for React/JS/Vue motion primitives, layout transitions, gestures, drag, hover, press, and route continuity.
- Good fit when UI state and component identity matter more than timeline-heavy choreography.

### View Transitions API

- URL: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- Use for browser-native route, page, gallery, detail, filter, and list continuity.
- Good fit when old/new DOM state snapshots communicate object identity better than manual enter/exit animation.

### CSS Scroll-Driven Animations

- URL: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- Use for scroll-linked timelines, reading/progress indicators, view progress, and lightweight scrollytelling.
- Good fit when motion should be controlled by actual scroll position and can remain transform/opacity-based.

### AutoAnimate

- URL: https://auto-animate.formkit.com/
- Use for quick add/remove/reorder/layout-change transitions in lists, forms, chips, rows, menus, and validation messages.
- Good fit when small state changes need polish and the project does not need a bespoke motion system.

### React Spring

- URL: https://react-spring.dev/docs/getting-started
- Use for React spring physics, tactile feedback, gesture-adjacent motion, SVG, and Three.js animation.
- Good fit when UI should feel physical, interruptible, or data-driven.

### Anime.js

- URL: https://animejs.com/documentation/
- Use for DOM/SVG/text/timeline choreography and WAAPI-backed focused motion.
- Good fit when CSS or component primitives are too limited but GSAP would be heavier than needed.

### GSAP

- URL: https://gsap.com/docs/v3/
- Use for advanced timeline choreography, scroll-driven sequences, pinned storytelling, SVG morphing/drawing, text reveals, and complex cross-element animation.
- Good fit when motion is a central part of the page narrative or visual identity.

### Theatre.js

- URL: https://www.theatrejs.com/docs/latest
- Use for authored motion design, HTML/SVG/Three.js sequence design, and cinematic product explanation.
- Good fit when the motion itself needs a designer/developer timeline workflow.

### Rive

- URL: https://riveanimation.com/
- Use for interactive vector animations, state machines, character/mascot systems, game-like controls, and product illustrations that respond to input or data.
- Good fit when animation needs logic and state, not just playback.

### LottieFiles and dotLottie

- URLs:
  - https://lottiefiles.com/
  - https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/
- Use for lightweight vector animation playback, onboarding, success/error states, empty states, loaders, and illustrative loops.
- Good fit when the asset is pre-authored and should remain lightweight and reusable.

### Three.js

- URLs:
  - https://threejs.org/docs/
  - https://threejs.org/examples/
- Use for custom WebGL/WebGPU 3D scenes, shaders, particles, spatial data, product visualization, immersive hero scenes, and interactive model systems.
- Good fit when the 3D scene is a primary product experience or visual anchor.

### React Three Fiber and Drei

- URLs:
  - https://docs.pmnd.rs/react-three-fiber/
  - https://github.com/pmndrs/drei
- Use for React-owned Three.js scenes, declarative 3D components, GLB loading, camera controls, environment lighting, helpers, and reusable scene primitives.
- Good fit when the frontend stack is React and 3D should participate in component state.

### model-viewer

- URL: https://modelviewer.dev/
- Use for simple interactive 3D model viewing, product inspection, hotspots, AR-friendly GLB/USDZ workflows, and cases where a full custom Three.js scene is unnecessary.
- Good fit when the main need is to display and inspect a model reliably.

### Spline

- URL: https://spline.design/
- Use for designer-authored interactive 3D scenes, lightweight product explainers, web-ready 3D visuals, and rapid spatial prototypes.
- Good fit when the team needs visual 3D authoring faster than custom scene engineering.

### Lenis

- URL: https://github.com/darkroomengineering/lenis
- Use for smooth scrolling, scroll-to behavior, WebGL scroll syncing, and creative scroll narratives.
- Good fit when scroll feel is a deliberate part of the product or editorial experience; poor fit for dense tools, modals, and utility screens that need native predictability.

### glTF

- URL: https://www.khronos.org/gltf/
- Use for runtime 3D asset delivery, GLB/GLTF model pipelines, PBR materials, textures, and interoperable model handoff.
- Good fit when 3D assets must be portable and production-ready.

### Sketchfab

- URL: https://sketchfab.com/
- Use for 3D model discovery, inspection, licensing checks, and mood references for model quality, topology, material, and presentation.
- Good fit when looking for existing model references or licensed assets.

## Choosing the Medium

Before choosing a library or effect, make the medium decision: static interface, image/photo, illustration, motion/animation, 3D/model, or hybrid. The winning choice should be the clearest way to express product meaning, state, continuity, inspection, atmosphere, or user understanding on the target device.

- Use CSS transitions for simple state feedback.
- Use View Transitions API for browser-native page, route, list, gallery, and detail-state continuity.
- Use CSS scroll-driven animations for scroll-linked effects that should follow actual scroll position.
- Use AutoAnimate for quick add/remove/reorder and layout-change transitions.
- Use Motion for component-level UI motion and layout continuity.
- Use React Spring for tactile, physics-like, interruptible React motion.
- Use Anime.js for focused DOM/SVG/text/timeline choreography when CSS is too limited.
- Use GSAP for timeline choreography, scroll narrative, SVG/text animation, and cross-element sequences.
- Use Theatre.js for authored designer/developer motion sequences.
- Use Rive for interactive state-machine vector animation.
- Use Lottie for pre-authored lightweight vector playback.
- Use Lenis only when smooth scroll itself is part of the experience.
- Use model-viewer for simple product/model inspection.
- Use Three.js or React Three Fiber for custom interactive 3D scenes.
- Use Spline for designer-authored interactive 3D visuals.

Do not choose a heavier medium when a lighter one communicates the state clearly.

## Spatial and Model Quality Checks

Before shipping motion, animation, or models:

- Does motion communicate state or meaning, or is it just motion?
- Is the object being animated the thing the user is thinking about?
- Does timing feel calm, fast, playful, cinematic, technical, or tactile according to the product character?
- Are too many elements moving at once?
- Does scroll animation preserve reading and control?
- Does 3D help users inspect, understand, compare, or remember the product?
- Is the model optimized for web: size, texture resolution, material count, lighting, camera framing, and loading state?
- Is there a reduced-motion or static fallback?
- Does keyboard/touch interaction still work when motion is disabled?
- Does the scene stay nonblank and framed correctly across desktop and mobile?

## Anti-Generic Rules

- Do not add floating orbs, particle fields, rotating objects, or scroll tricks without a product-specific reason.
- Do not animate every card into view; sequence only what helps comprehension.
- Do not hide core content behind scroll choreography.
- Do not use a 3D model as decoration if it does not explain, inspect, sell, or embody the product.
- Do not ship unoptimized GLB/texture assets or unbounded render loops.
- Do not use motion to cover weak composition or vague visual language.

## Implementation Rule

When motion or models feel generic:

1. Name the user-visible state or product idea being expressed.
2. Choose the lightest medium that expresses it.
3. Define timing, easing, trigger, and fallback.
4. Build one high-quality motion/model moment first.
5. Reuse its grammar for related states.
6. Verify performance, framing, accessibility, and reduced-motion behavior.
