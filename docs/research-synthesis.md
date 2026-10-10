# Design Skill And Designer Workflow Synthesis

This note records the research used for the current skill redesign. It is a synthesis of the main public frontend/design skills and established design-process sources, not a claim that every design skill on the internet was exhaustively enumerated.

## Reference Corpus

| Source | What it contributes | What we keep |
| --- | --- | --- |
| [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | Subject-grounded direction, compact plan, self-review against generic defaults, deliberate copy, one memorable move | Subject vernacular, plan review, anti-default calibration, copy as part of design |
| [OpenAI Product Design](https://github.com/openai/role-specific-plugins/tree/main/plugins/product-design/skills) | Context router, research/audit/ideate/image-to-code/design-QA sequence, browser and image tooling | Context gate, concept-to-code handoff, visual source plus render QA |
| [OpenAI frontend-app-builder](https://github.com/openai/plugins/blob/main/plugins/build-web-apps/skills/frontend-app-builder/SKILL.md) | Complete concept coverage, section/state concepts, design-system extraction, faithful implementation, browser proof | Full-surface planning, asset inventory, section-level visual comparison |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Searchable design intelligence, persisted master/page overrides, variance/motion/density dials, stack/domain queries | Searchable local evidence, persistent global/page direction, explicit dials |
| [Impeccable](https://github.com/pbakaus/impeccable) | Action vocabulary, live browser variants, hooks, context artifacts, bounded verification | Action routing, live variant contract, bounded passes, project context |
| [Avoid AI Design](https://github.com/funboy322/avoid-ai-design) | Code-certain detector versus pixel judgment, first/second-order defaults, silhouette test, surgical versus rebuild depth | Separate detector and visual critique, anti-default calibration, scope-aware rewrite |
| [Designer Skills design-review](https://github.com/julianoczkowski/designer-skills) | Mandatory screenshots, desktop/tablet/mobile states, interaction states, prioritized refinement list | Screenshot evidence at 3 viewports and state matrix |
| [Screenshot Critique](https://github.com/dzhng/skills/tree/main/skills/visual/screenshot-critique) | Fresh unprimed reviewer, crops, before/after pixel proof, no self-certification | Fresh-eyes review and before/after evidence |
| [AnyDesign](https://github.com/uxKero/anydesign) | Extract a reconstruction-oriented design system from URLs, images, and Figma | Source extraction: tokens, components, visual relationships, reconstruction notes |
| [Frontend Design Codex](https://github.com/dachent/skills/tree/main/frontend-design-codex) | Token-first build, complete states, desktop/mobile captures, visual lint | Tokens before repetition, responsive/state proof |
| [Design Rules Companion](https://github.com/Kotelberg/design-rules-companion-skill) | Diagnose the failure mode before applying visual heuristics | Hierarchy/spacing/type/color diagnosis before repair |
| [Design Slop](https://github.com/wpgaurav/design-slop) | Judge the artifact rather than the tool; remove template residue and fake product thinking | Product-specificity and honest content checks |
| [IDEO design thinking](https://designthinking.ideo.com/process) | Create choices, make choices, inspiration, synthesis, ideation, making, testing | Divergence/convergence rhythm |
| [Google Design Sprint](https://designsprintkit.withgoogle.com/methodology/overview) | Understand, define, sketch, decide, prototype, validate | Short decision cycle around a concrete question |
| [Figma critique practice](https://www.figma.com/blog/design-critiques-at-figma/) | Critique is for improving a design, not for making roadmap decisions; feedback needs a requested mode | Separate critique from product decision and request concrete feedback |
| [NN/g parallel and iterative design](https://www.nngroup.com/articles/parallel-and-iterative-design/) | Test multiple alternatives, merge the strongest ideas, iterate V1 to V3 | Parallel alternatives before convergence and iterative testing |

## Repeated Findings

1. **Context precedes style.** The strongest skills first determine the product, audience, subject, task, platform, and existing authority. A style keyword is not a design brief.
2. **Choice precedes commitment.** Designers create several materially different possibilities, then choose one. They do not average three weak concepts into a safe middle.
3. **A visual target improves implementation.** Image concepts, screenshots, Figma frames, and live references make fidelity judgeable. They are useful only when translated into tokens, components, assets, states, and responsive rules.
4. **The browser is part of the design toolchain.** Source review catches architecture and token problems; screenshots catch hierarchy, crop, font loading, overflow, spacing rhythm, and visual sameness.
5. **Critique must be separate from self-approval.** A fresh reviewer, a before/after comparison, and a severity-ranked repair list reduce the tendency to approve the change because the implementer remembers the intention.
6. **Rules need calibration.** Anti-pattern detectors are useful for defaults, but a detector cannot decide whether an intentional direction is good. User direction, existing design systems, and inspected references can override advisory rules.
7. **Consistency lives in durable artifacts.** Product context, a master design system, page overrides, surface briefs, screenshots, and critique ledgers stop later pages from drifting back to the training median.
8. **Completion is broader than the hero.** Real designers account for lower sections, states, responsive behavior, content, assets, and the ending before sign-off.
9. **Iteration must have a question.** A new round is justified by a visible defect, an unresolved decision, a failed state, a fidelity gap, or a new user signal. Blind polishing consumes time without improving the design.

## Resulting Skill Contract

```text
context
  -> create choices
  -> make a direction decision
  -> extract a system
  -> storyboard the full surface
  -> make a working artifact
  -> capture the real render
  -> critique with fresh eyes
  -> repair the largest evidence-backed defect
  -> repeat through responsive, state, and accessibility proof
  -> update design memory and sign off
```

The implementation is exposed as a 20-round contract in [design-production-loop.md](../references/design-production-loop.md) and [scripts/design-loop.mjs](../scripts/design-loop.mjs). Twenty rounds are checkpoints for decisions and evidence, not a demand for twenty arbitrary rewrites.
