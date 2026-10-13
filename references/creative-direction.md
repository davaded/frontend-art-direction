# Creative Direction And Divergence

Use this guide when the request is open-ended, the current result feels generic, or the product needs a point of view that local presets cannot supply. The saved profiles, directions, treatments, and reference recipes are routing vocabulary. They are useful evidence and gap-fill material; they are not a style menu the agent must obey.

## The Creative Pass

Before committing to code on a substantial greenfield or redesign, generate two or three structurally different hypotheses from the real object, audience, content, and task. Change the relationship between regions, not only the palette:

```text
Concept A:
  composition / dominant object / reading order / type-media relationship / interaction idea
Concept B:
  composition / dominant object / reading order / type-media relationship / interaction idea
Concept C:
  composition / dominant object / reading order / type-media relationship / interaction idea
Chosen concept:
  why it belongs to this product / what evidence supports it / what risk remains
```

Useful differences include rail versus open field, object-led versus type-led, continuous scene versus chapters, dense instrument versus calm index, or a layout shaped by the media itself. A new color, a larger heading, a different shadow, or a second font is a polish variant, not a new concept.

Choose one direction by product specificity, hierarchy, silhouette, content truth, responsive viability, interaction meaning, and implementation cost. Do not average the concepts into a safe middle. Record the rejected directions briefly so later polish does not quietly return to the generic default.

Inspect the actual materials before standardizing the regions around them. A wide painting, a portrait, a long paragraph, and a working instrument imply different distances and proportions. Their relationship can supply the composition and rhythm; a repeated component ratio can erase it. A deliberate crop or repeated format remains valid when it supports the chosen thesis and preserves the intended subject. A generic implementation noun such as `viewer` identifies an interaction, not evidence that the work needs a 3D, hardware, or commerce genre.

Run a subject-specificity check before polishing: what material, record, process, behavior, or content relationship could only belong to this subject? Inspect an official archive, process record, specimen, source document, or real object detail when one exists, then test whether one useful piece can become the counterweight, proof, or transition of the page. Keep it small when the work is already complete; do not add a gallery or a content band merely to avoid an empty field. If no subject-native material is available, make the content, task, or interaction relationship carry the distinction and record the evidence boundary.

Let the sentence's content medium influence the hypothesis without turning it into a preset: sound, moving image, a publication, a collection, a tool, or a physical object can change the dominant relationship and the useful state to prototype. Keep at least one alternative that treats the same material differently, then choose by the subject and attention path rather than by the nearest catalog label.

When iterations only repair overflow, spacing, or controls, separately challenge whether the subject still carries the composition. A technically complete frame can remain weak because the important material is tiny, unresolved, obscured, or disconnected from its observations. Compare a materially different subject-to-type relationship before continuing fine polish. Preserve useful ideas across alternatives when they strengthen the same thesis; avoid averaging incompatible skins into a safe middle.

For an underspecified request, `visual-direction` exposes three provisional structural frames so the agent has something concrete to compare:

```bash
node <skill-root>/scripts/visual-direction.mjs --query "我要一个网站" --format json
node <skill-root>/scripts/visual-direction.mjs --query "我要一个网站" --concept object-story --format json
```

The frames are `open-field`, `object-story`, and `sequence-chapters`. They are not a closed list of genres. They are deliberately different starting hypotheses; a real subject, an inspected reference, an authored direction file, or the model's stronger proposal may replace all three. The generated composition plan now carries a renderable regional map for each alternative: compare its local anchors, fields, measures, and intermediate-width regrouping, rather than treating three labels as enough divergence. Each map separates core regions from optional candidates; optional candidates are discardable and must earn their place through real content or interaction.

## Authority And References

When a user supplies a reference, inspect it and translate its relationships. When no reference is supplied, form the independent thesis first, then use saved references to research a missing job such as specimen anatomy, navigation indexing, motion continuity, or component behavior. A reference may influence the result without becoming its skin.

The order is:

1. Understand the subject, audience, content, task, feeling, or question the work is carrying.
2. Form independent structural hypotheses.
3. Inspect only the relevant reference lenses and write borrow / reject / translate decisions.
4. Promote the strongest coherent thesis to the direction authority.
5. Use local datasets to fill missing fields such as state coverage, tokens, or fallback behavior.
6. Render an early composition and a relevant state or moment, then finish the declared scope and iterate its desktop/mobile captures before handoff.

Use [visual-iteration.md](visual-iteration.md) to revise a weak thesis with real screenshots and generated proposals. Inspect a current capture before using it as an image-edit target, translate the selected visual changes into code, and verify fresh browser renders. A selected concept is a direction hypothesis; its content, states, typography, and full-scope implementation still need proof.

The creative direction can deliberately override local anti-AI checks, geometry defaults, type ceilings, treatments, and recipes. Keep accessibility, the relevant task/state or authored-experience completeness, responsive usability, asset truth, motion fallback, runtime integrity, and rendered proof intact. Record the reason and the visual evidence for the override.

## Authored Direction File

Use `--direction-file` when the model, user, or designer already has a stronger direction. The file is partial by design: omitted fields are filled from local candidates, while supplied fields become the working direction.

```json
{
  "id": "tactile-reading-instrument",
  "label": "Tactile Reading Instrument",
  "signature": "The page behaves like a folded paper object: one continuous reading field, a clipped index, and evidence that enters from the fold.",
  "rationale": "The content is a sequence of decisions, so the layout should feel handled and unfolded rather than presented as a marketing stack.",
  "firstViewport": {
    "layout": "A continuous off-axis reading field with the primary artifact crossing the fold and a narrow index attached to its edge.",
    "alignmentAxis": "The artifact edge, index marks, and primary action share a vertical datum.",
    "dominant": "The real artifact or content sequence.",
    "counterweight": "A small index and one contextual action.",
    "belowFoldPeek": "The next artifact enters as a cropped continuation of the same field."
  },
  "geometryRules": {
    "edgeCharacter": "Soft folded surfaces with one deliberate clipped edge; avoid a stack of cards.",
    "cornerHierarchy": "The reading field is broad, the index is tighter, and controls are compact.",
    "separation": "Folds, crop, tone, and whitespace before borders.",
    "linePolicy": "Short index marks only; no page-wide dividers.",
    "sharpException": "Exact marks may remain sharp where they identify sequence or measurement."
  },
  "visualTreatment": {
    "label": "Authored Material Reading",
    "signature": "A restrained paper/material language supports the artifact.",
    "composition": "One continuous field with an attached index.",
    "material": "Layered paper tone and controlled crop, without decorative noise.",
    "geometry": "Soft field, clipped edge, compact index."
  },
  "build": {
    "buildOrder": ["artifact field", "attached index", "first state", "mobile fold", "continuation"],
    "acceptance": ["the artifact reads before the explanation", "the mobile fold keeps the same thesis"]
  }
}
```

An authored file is a design proposal, not visual proof. Run the target, compare desktop and mobile, test one non-default state, and revise the thesis when the render is interchangeable with another product.

An optional `compositionPlan` records arbitrary real regions without a shared alignment mandate. Each region requires only its `region` name; supplied `placement`, `textAlignment`, `measure`, `relation`, `space`, `priority`, `scope`, `wide`, `intermediate`, `narrow`, `occupancy`, `field`, `surface`, `pause`, and optional `geometry` are preserved. `geometry` records `anchor`, `measure`, `field`, `density`, and `mobile` as implementation-facing tokens. `guardrails` can record the alignment sequence, natural measure sequence, field sequence, counterfield, full-bleed policy, responsive advice, and an explicit creative override. The derived `spaceChoreography` turns those decisions into a region-by-region sequence with local anchors, measures, fields, density, pauses, mobile actions, and counterfield evidence; it is an execution aid and can be replaced by authored direction or stronger inspected evidence. A centered overview, centered block of start-aligned prose, and edge-attached end-aligned index can coexist. A generated plan also carries three replaceable structural hypotheses and a selected render candidate; the alternatives exist to force a composition decision, not to create three mandatory page sections. Generated plans expose `regions` as core relationships and `optionalRegions` as discardable candidates. If no authored plan is supplied, the resolver emits a direction-specific provisional plan with the same fields so the first implementation has a real hypothesis to render and challenge. This field records a decision or hypothesis; it does not prescribe a minimum number of regions, mixed alignment, proportions, or page types. Use the region map in [visual-composition.md](visual-composition.md) and verify the actual result.
