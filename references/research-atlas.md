# Research Atlas

The atlas is the durable research layer between a request and a visual direction. It turns “look at these good sites” into evidence that can be inspected, compared, reused, and challenged during later design rounds.

## What It Records

- user references first, followed by discovered and local references
- the source's role, visible strengths, weaknesses, borrow decisions, reject decisions, and local evidence
- section winners chosen by job: entry, first viewport, object/content, composition, responsive behavior, states, motion, material, and ending
- selected local skills and unavailable skills with reasons
- the synthesized direction, type, material, motion, asset strategy, unresolved gaps, and template-risk decision

A URL is a candidate. It becomes usable research only after the agent opens it, inspects the relevant sections and states, and saves a local capture or research artifact. A reference name alone never counts as visual evidence.

## Commands

Create an atlas directly:

```bash
node <skill-root>/scripts/research-atlas.mjs start \
  --project <project-root> \
  --query "Build a product website for a physical audio instrument" \
  --format md
```

Add a user reference after inspecting it and saving a local capture:

```bash
node <skill-root>/scripts/research-atlas.mjs add \
  --project <project-root> --session <atlas-id> \
  --id apple-product --label "Apple product pages" \
  --url https://www.apple.com/ --kind user --status selected \
  --role "object storytelling" \
  --evidence artifacts/research/apple-desktop.png,artifacts/research/apple-notes.md \
  --strengths "object scale,material proof,quiet navigation" \
  --weaknesses "brand-specific copy,high media budget" \
  --borrow "object-led sequencing" \
  --reject "copying Apple shell" \
  --observations "the first scroll reveals the next product chapter"
```

Record a winner for a section. Different sections may select different references:

```bash
node <skill-root>/scripts/research-atlas.mjs section \
  --project <project-root> --session <atlas-id> \
  --section first-viewport --winner apple-product \
  --decision "The object owns the first viewport while the next chapter remains visible." \
  --evidence artifacts/research/first-viewport-comparison.md
```

Record the synthesis before close:

```bash
node <skill-root>/scripts/research-atlas.mjs synthesize \
  --project <project-root> --session <atlas-id> \
  --direction "A quiet instrument story that unfolds around the physical object" \
  --visual-language "soft structural geometry, deep field, restrained accent" \
  --composition "off-axis object stage with a narrow evidence rail" \
  --type "one display face plus compact utility text" \
  --material "matte field, controlled reflection, tactile close crops" \
  --motion "state-bound reveal with cleanup and static final state" \
  --assets "generated macro photography plus authored diagrams" \
  --template-risk "Do not collapse into a centered hero and equal card grid" \
  --gaps "real product dimensions need confirmation" \
  --rejected-defaults "generic SaaS dashboard, glassmorphism, decorative gradient blobs"
```

`design-loop start` creates and links an atlas automatically. `design-loop close` refuses sign-off while its linked atlas remains open, so research cannot silently disappear between the direction round and visual proof.

## Research Rules

1. Inspect user-provided references before the local catalog. Their visual authority is higher than a popularity ranking.
2. Compare references by section and job. One source may win navigation while another wins object presentation, mobile staging, or motion.
3. Record what is rejected as well as what is borrowed. Rejection protects the target from becoming a stitched-together imitation.
4. Synthesize an original direction before implementation. The result needs a subject, a composition, a material language, an interaction grammar, and a reason for its exceptions.
5. Treat template-risk as a live review question. If the synthesis can describe any unrelated site without changing a word, return to the subject evidence and diverge again.
6. Keep the atlas separate from rendered acceptance. Research evidence proves what was observed; browser captures prove what was built.

The protocol follows the useful parts of research-first and critique-first workflows from [design-loop](https://github.com/rithvikx/design-loop), [design-visual-frontend](https://github.com/Xialiang98/design-visual-frontend), [frontend-visual-qa](https://github.com/ytvee-dev/webdev-agent-kit/tree/main/skills/frontend-visual-qa), and [ui-from-image](https://github.com/Ixe1/ui-from-image), while keeping the final direction project-specific and allowing an authored direction to override local defaults.
