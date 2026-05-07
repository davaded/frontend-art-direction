# Visual Foundations References

Use these references for layout, typography, and color decisions before choosing decorative components or motion. The goal is to make composition, type, and color systematic instead of taste-only.

## Discovery Order

Start with GitHub when internet access is available:

- Use getdesign.md and public `DESIGN.md` collections as foundation references for design-system structure, token naming, layout, typography, color, accessibility, and component consistency.
- Search for public `DESIGN.md` files in design systems, UI kits, open-source apps, and similar products only when they expose foundation decisions.
- Search for the product category plus foundation terms like `design system`, `tokens`, `theme`, `layout`, `typography`, `color`, and `dashboard`, not competitor screenshots.
- Prefer repos that include real implementation, tokens, screenshots, Storybook, docs, or a mature component system.
- Use GitHub findings to understand how real teams name tokens, structure layout, and apply colors in code.

These are foundation references, not the visual direction by themselves. Use `visual-language.md` for art-direction mood, identity, image treatment, material, and brand-like references. Use product/category screenshots only as optional flow or state checks.

Useful GitHub searches:

```text
DESIGN.md design system SaaS
DESIGN.md dashboard typography color
site:github.com DESIGN.md "Color Palette"
site:github.com DESIGN.md "Layout Principles"
site:github.com "tokens" "typography" "color" "spacing"
site:github.com "tailwind.config" "colors" "fontFamily" "spacing"
```

## DESIGN.md Libraries

### Awesome DESIGN.md

- URL: https://github.com/VoltAgent/awesome-design-md
- Use for: reusable `DESIGN.md` and getdesign.md examples that collect design-system and foundation patterns from recognizable products and brand systems.
- Borrow: document structure, token naming, color roles, typography hierarchy, layout principles, component styling, responsive rules, and do/don't guardrails.
- Avoid: copying another brand identity wholesale, especially when the product category, audience, or content model differs.
- Check: whether the selected example matches the product's category, density, device, and interaction model.

## Layout and Composition

### Apple Human Interface Guidelines: Layout

- URL: https://developer.apple.com/design/human-interface-guidelines/layout
- Use for: platform-native hierarchy, spacing, adaptive layout, device translation, and interface clarity.
- Borrow: restraint, focus, platform expectations, and layout decisions that respect the target device.
- Avoid: importing Apple-like emptiness into dense operational tools where scanning and comparison matter.

### Material Design: Layout

- URL: https://m3.material.io/foundations/layout/overview
- Use for: responsive layout, panes, window size classes, grids, and adaptive product surfaces.
- Borrow: layout regions, breakpoint logic, and component-area organization.
- Avoid: letting Material defaults erase a product's own character.

### IBM Carbon 2x Grid

- URL: https://carbondesignsystem.com/elements/2x-grid/usage/
- Use for: enterprise, dashboard, data-heavy, and documentation-heavy interfaces.
- Borrow: grid discipline, key lines, negative space, density control, and layout contrast.
- Avoid: overly corporate density for expressive consumer or editorial surfaces.

### Every Layout

- URL: https://every-layout.dev/
- Use for: resilient CSS layout primitives and composition that relies on browser algorithms instead of brittle breakpoints.
- Borrow: stack, cluster, sidebar, switcher, cover, and intrinsic layout thinking.
- Avoid: hard-coded magic numbers when layout can be made content-aware.

### Laws of UX

- URL: https://lawsofux.com/
- Use for: information grouping, cognitive load, decision complexity, target sizing, and interaction expectations.
- Borrow: proximity, common region, chunking, Hick's Law, Fitts's Law, and Jakob's Law as layout checks.
- Avoid: treating UX laws as decoration rules rather than task-flow constraints.

## Optional Pattern and Flow Checks

These sources are useful only when workflow, states, navigation, density, or platform expectations need evidence. They should not lead art direction by default because same-category patterns can push the UI toward an average category look.

### Mobbin

- URL: https://mobbin.com/
- Use for: real mobile and web app screenshots, state inventory, screen sequencing, and mobile/web pattern checks.
- Borrow: required states, information density checks, navigation affordances, and flow order.
- Avoid: copying category visual skin or treating common competitor patterns as the desired art direction.

### Page Flows

- URL: https://pageflows.com/
- Use for: full user journeys, onboarding, upgrade, checkout, settings, and task flows.
- Borrow: sequence, progressive disclosure, state transitions, content order, and missing-state evidence.
- Avoid: replacing product thinking with isolated screenshot copying or using the average flow as visual identity.

### Nicelydone

- URL: https://nicelydone.club/
- Use for: real SaaS/web app UI patterns such as dashboards, onboarding, billing, settings, tables, and empty states.
- Borrow: workflow-specific state coverage, product-grade density checks, and practical empty/loading/error patterns.
- Avoid: generic SaaS sameness when the product needs a stronger identity.

### SaaS Interface

- URL: https://saasinterface.com/
- Use for: dashboard and SaaS page patterns.
- Borrow: KPI, navigation, filter, table, and data-grouping checks when the product is truly workflow or metric driven.
- Avoid: using dashboard patterns for products that are not metric or workflow driven, or letting SaaS convention override art direction.

## Typography

### Apple Human Interface Guidelines: Typography

- URL: https://developer.apple.com/design/human-interface-guidelines/typography
- Use for: platform-native type hierarchy, legibility, dynamic type, and device fit.
- Borrow: type restraint and readable hierarchy.
- Avoid: platform mimicry when the app is clearly cross-platform or brand-led.

### Material Design: Typography

- URL: https://m3.material.io/styles/typography/overview
- Use for: role-based type scales and app-friendly text hierarchy.
- Borrow: defined roles for display, headline, title, body, and label.
- Avoid: applying large marketing-style scales inside compact tools.

### Shopify Polaris Typography

- URL: https://polaris-react.shopify.com/design/typography
- Use for: commerce, admin, operational, and SaaS tools.
- Borrow: hierarchy through size, weight, color, and positioning; tabular numbers for money and metrics.
- Avoid: relying on color alone to communicate hierarchy.

### Atlassian Typography

- URL: https://atlassian.design/foundations/typography/applying-typography
- Use for: productivity, collaboration, issue tracking, docs, and enterprise tooling.
- Borrow: heading hierarchy, body readability, accessible contrast, and scannable labels.
- Avoid: tiny text except for fine print or secondary metadata.

### Google Fonts Knowledge

- URL: https://fonts.google.com/knowledge
- Use for: font selection, pairing, language support, and type basics.
- Borrow: practical font education and pairing decisions.
- Avoid: choosing a display font before confirming body text and UI label readability.

### Practical Typography

- URL: https://practicaltypography.com/
- Use for: line length, line height, paragraph rhythm, headings, tables, and body copy.
- Borrow: typographic fundamentals and reading comfort.
- Avoid: novelty fonts or oversized headings as a substitute for hierarchy.

## Type Scale Restraint

Before implementing UI type, choose a role-based scale from project tokens or foundation references. Do not invent large display sizes just to make the screen feel designed.

Default restraint:

- Dashboards, admin tools, forms, settings, tables, developer tools, CRM, commerce admin, and operational UI should usually use compact title scales, strong weights, grouping, and spacing instead of huge headings.
- Landing pages, editorial pages, immersive product introductions, campaigns, and brand moments may use display type, but only when the first screen is truly a hero and the reference evidence supports it.
- Metrics can be large only when the metric is the primary object of the workflow; otherwise use tabular numeric treatment, grouping, and contrast.
- CJK or mixed-language UI needs extra restraint because oversized Chinese text quickly becomes heavy and awkward at short line lengths.

Type scale lock:

```text
Surface type:
Typography reference:
Display text allowed? yes/no and why:
Largest text role and approximate size:
Heading/body/label/numeric roles:
What must not be oversized:
```

Reject a type scale when the screenshot reads as a poster, generic landing hero, or large-word composition instead of a usable product surface.

### Typewolf and Fonts In Use

- URLs:
  - https://www.typewolf.com/
  - https://fontsinuse.com/
- Use for: seeing type choices in real websites, brands, editorial systems, and product contexts.
- Borrow: pairing direction, contrast between display and body faces, and category-specific type personality.
- Avoid: selecting fonts only because they look fashionable in unrelated categories.

### CJK and Mixed-Language UI

- URLs:
  - https://github.com/adobe-fonts/source-han-sans
  - https://fonts.google.com/noto/specimen/Noto+Sans+SC
- Use for: Chinese, Japanese, Korean, and mixed Latin/CJK interfaces.
- Borrow: robust glyph coverage, multiple weights, and predictable UI rendering.
- Avoid: Latin-only font choices that fall back poorly for Chinese content.

## Color

### Apple Human Interface Guidelines: Color

- URL: https://developer.apple.com/design/human-interface-guidelines/color
- Use for: color roles, platform appearance, status meaning, dark mode, and consistent interaction color.
- Borrow: consistent semantic color use and accessible contrast thinking.
- Avoid: using the same color for both interactive and noninteractive meaning.

### Material Design: Color

- URL: https://m3.material.io/styles/color/overview
- Use for: semantic roles, tonal palettes, state layers, and app theme systems.
- Borrow: source color, role mapping, surface hierarchy, and light/dark variants.
- Avoid: a Material-looking palette when the product needs a distinct brand system.

### Radix Colors

- URL: https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette
- Use for: accessible, balanced UI color scales in Radix/shadcn-style systems.
- Borrow: 12-step color scales, neutral/accent pairing, and foreground/background combinations.
- Avoid: mixing multiple unrelated hue scales without defined roles.

### Tailwind Colors

- URL: https://tailwindcss.com/docs/customizing-colors
- Use for: Tailwind projects, OKLCH palettes, and implementation-ready color tokens.
- Borrow: neutral scale, accent scale, and utility-to-token mapping.
- Avoid: sprinkling raw utility colors without semantic roles.

### Leonardo

- URL: https://leonardocolor.io/
- Use for: accessible color systems, contrast-ratio-based palettes, adaptive themes, and data visualization colors.
- Borrow: contrast-first palette generation and light/dark theme control.
- Avoid: checking contrast only after the palette is already implemented.

### Adobe Color Accessibility

- URL: https://helpx.adobe.com/creative-cloud/adobe-color-accessibility-tools.html
- Use for: color-blind safe themes and accessibility checks.
- Borrow: early accessibility testing for meaningful color distinctions.
- Avoid: communicating important state by hue alone.

### Realtime Colors

- URL: https://www.realtimecolors.com/
- Use for: previewing text, background, primary, secondary, and accent colors in page context.
- Borrow: role-based preview and quick CSS/Tailwind export.
- Avoid: accepting a palette because swatches look good without checking a real UI surface.

### Coolors and Huemint

- URLs:
  - https://coolors.co/
  - https://huemint.com/
- Use for: early palette exploration, image extraction, and mood discovery.
- Borrow: fast exploration and palette ideas.
- Avoid: treating generated palettes as final without semantic roles, contrast checks, and UI previews.

## Required Foundation Lock

For meaningful UI work, record these before implementation:

```text
Layout reference:
Typography reference:
Color reference:
Type scale lock:
Derived layout decisions:
Derived typography decisions:
Derived color decisions:
Avoid:
```

If a project already has strong tokens or a mature design system, use this lock to validate and extend the existing system instead of replacing it.
