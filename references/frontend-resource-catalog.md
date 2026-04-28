# Frontend Resource Catalog

Use this catalog when a UI task needs concrete components, animation patterns, icon sources, or implementation references. These are resources for execution and taste calibration, not a substitute for product-specific art direction.

## Motion and Interaction

### Motion

- URL: https://motion.dev/
- Use for: production-grade React, JavaScript, and Vue animation; gestures; layout transitions; exit animations; scroll effects; spring physics; animation orchestration.
- Borrow: clear animation primitives, native-feeling hover/press/drag feedback, layout continuity, and restrained spring motion.
- Avoid: adding motion where hierarchy, spacing, or copy are the real problem.
- Check: reduced-motion behavior, transform/opacity performance, layout shift, and whether animation still communicates state when skipped.

### Vivus

- URL: http://maxwellito.github.io/vivus/
- Use for: SVG path-drawing moments, logos, diagrams, onboarding marks, and technical visual explanations.
- Borrow: delayed, sync, and one-by-one SVG drawing patterns when a drawn reveal supports the message.
- Avoid: long decorative SVG intros, animated body text, or paths that distract from the primary task.
- Check: SVG path quality, timing on low-power devices, replay/rewind controls where useful, and static fallback.

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

### HeroUI

- URL: https://heroui.com/
- Use for: polished React UI components across web and mobile contexts, especially forms, menus, modals, tables, dashboards, chat, and finance-like surfaces.
- Borrow: component completeness, state coverage, themeable component language, and compact-but-friendly product UI examples.
- Avoid: replacing an existing design system without a reason, or accepting default styling when the product needs a stronger identity.
- Check: framework compatibility, accessibility behavior, theming model, dependency cost, and how well it coexists with existing primitives.

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
- Keep motion purposeful: feedback, continuity, reveal, or spatial understanding.
- For mobile or car/head-unit work, avoid hover-first resources unless there is a touch/remote equivalent.
- Before shipping, verify keyboard, touch, reduced motion, responsive layout, console errors, and visual consistency.
