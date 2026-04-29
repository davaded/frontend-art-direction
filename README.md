# Frontend Art Direction

A Codex skill for creating or improving frontend surfaces with stronger art direction, visual hierarchy, expressive composition, coherent visual language, motion taste, component craft, and real implementation.

This skill is intended for product-grade UI work, including new frontend builds from requirements, dashboards, web apps, landing pages, mobile UI, embedded displays, car/head-unit UI, design-system refreshes, and UI redesigns.

It is not a generic component cookbook. It helps Codex make visible product decisions before writing UI code.

## Install

Clone this repository into your Codex skills directory.

Windows PowerShell:

```powershell
git clone https://github.com/davaded/frontend-art-direction.git "$env:USERPROFILE\.codex\skills\frontend-art-direction"
```

macOS/Linux:

```bash
git clone https://github.com/davaded/frontend-art-direction.git ~/.codex/skills/frontend-art-direction
```

Restart Codex after installing or updating the skill.

## Use

Ask Codex to use the skill explicitly:

```text
Use $frontend-art-direction to build this dashboard from the requirements.
```

```text
Use $frontend-art-direction to make this UI feel less generic and more product-grade.
```

```text
Use $frontend-art-direction to redesign this landing page with stronger visual direction, motion, and responsive behavior.
```

The skill also applies when the user asks for frontend work that should feel polished, premium, coherent, expressive, or production-ready, even if they do not explicitly say "beautify" or "redesign."

## Workflow

The skill pushes Codex through a stricter frontend art-direction workflow:

1. Identify the product character, user, device, density, primary workflow, and canvas.
2. Inspect the existing UI or app shell before choosing a direction.
3. Lock references before implementation, including GitHub searches for public `DESIGN.md`, design systems, token files, UI repos, screenshots, and same-category products.
4. Produce a concise Art Direction Brief when the direction is substantial or ambiguous.
5. Run visual quality gates before and after implementation.
6. Implement composition before decoration.
7. Treat component states, motion, loading, empty, error, and success states as part of the design.
8. Verify the actual rendered surface with browser, screenshots, responsive viewports, and interaction checks when possible.

## Quality Gates

The skill is designed to prevent common AI-generated UI problems:

- mechanical card grids
- generic centered hero layouts
- decorative gradients, glows, and orbs without product meaning
- layout that is tidy but lifeless
- typography that is mathematically clean but emotionally flat
- component-library defaults masquerading as visual identity
- stock imagery or random decoration
- motion and 3D that do not communicate state, meaning, or product value

It adds explicit gates for:

- reference quality
- visual foundations: layout, typography, and color
- expressive composition
- visual language
- motion, animation, and spatial/model-based media
- component and state completeness
- visual QA and self-iteration

## Reference Files

The skill keeps detailed guidance in `references/` so Codex can load only what it needs.

| File | Purpose |
| --- | --- |
| `reference-quality.md` | How to choose useful references instead of generic inspiration. |
| `art-direction-brief.md` | Brief template for product character, hierarchy, composition, visual language, motion, and device translation. |
| `visual-quality-gates.md` | Required gates for diagnosis, reference lock, composition, visual language, motion, QA, and self-iteration. |
| `visual-foundations.md` | Layout, typography, color, GitHub search, DESIGN.md examples, and foundation references. |
| `expressive-composition.md` | Rules for avoiding mechanical layouts and creating memorable composition. |
| `visual-language.md` | Imagery, material, motif, depth, texture, brand feel, and anti-generic visual rules. |
| `motion-spatial-language.md` | Motion grammar, animation purpose, 3D/model roles, performance, and reduced-motion fallbacks. |
| `frontend-resource-catalog.md` | Component, motion, icon, animation, and 3D implementation resources. |
| `design-md.md` | Guidance for creating or updating a project-level `DESIGN.md`. |

## Included Resource Families

The catalog includes references and execution resources such as:

- shadcn/ui, HeroUI, Spectrum UI, ElevenLabs UI, Aceternity UI, React Bits, Reacticx
- Motion, GSAP, Rive, Lottie/dotLottie, Vivus
- Three.js, React Three Fiber, Drei, model-viewer, Spline, glTF, Sketchfab
- Developer Icons and All SVG Icons
- Apple HIG, Material Design, Carbon, Polaris, Atlassian, Radix Colors, Tailwind Colors
- Awwwards, siteInspire, Land-book, Godly, Brand New, Identity Designed, BP&O, Designspiration, Cosmos

These resources are decision inputs, not templates to copy wholesale.

## Design Principles

- Borrow principles, not screenshots.
- Start from the product's actual workflow and content.
- Define a visual anchor and composition signature before decoration.
- Use color, material, imagery, and motion as one system.
- Let motion express feedback, continuity, state, spatial understanding, or product meaning.
- Choose the lightest implementation medium that communicates the idea.
- Verify the real UI, not just the code.

## Repository Structure

```text
frontend-art-direction/
  SKILL.md
  agents/
    openai.yaml
  references/
    art-direction-brief.md
    design-md.md
    expressive-composition.md
    frontend-resource-catalog.md
    motion-spatial-language.md
    reference-quality.md
    visual-foundations.md
    visual-language.md
    visual-quality-gates.md
```

## Update

If installed with `git clone`, update with:

```bash
git -C ~/.codex/skills/frontend-art-direction pull
```

On Windows PowerShell:

```powershell
git -C "$env:USERPROFILE\.codex\skills\frontend-art-direction" pull
```

Restart Codex after updating.
