# Motion, Animation, and Spatial Language

Use this reference when a UI needs motion, animation, 3D, model viewers, spatial storytelling, or interactive visual systems. Motion and models are part of art direction, not decoration.

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

### GSAP

- URL: https://gsap.com/docs/v3/
- Use for advanced timeline choreography, scroll-driven sequences, pinned storytelling, SVG morphing/drawing, text reveals, and complex cross-element animation.
- Good fit when motion is a central part of the page narrative or visual identity.

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

### glTF

- URL: https://www.khronos.org/gltf/
- Use for runtime 3D asset delivery, GLB/GLTF model pipelines, PBR materials, textures, and interoperable model handoff.
- Good fit when 3D assets must be portable and production-ready.

### Sketchfab

- URL: https://sketchfab.com/
- Use for 3D model discovery, inspection, licensing checks, and mood references for model quality, topology, material, and presentation.
- Good fit when looking for existing model references or licensed assets.

## Choosing the Medium

- Use CSS transitions for simple state feedback.
- Use Motion for component-level UI motion and layout continuity.
- Use GSAP for timeline choreography, scroll narrative, SVG/text animation, and cross-element sequences.
- Use Rive for interactive state-machine vector animation.
- Use Lottie for pre-authored lightweight vector playback.
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
