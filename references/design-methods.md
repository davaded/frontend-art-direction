# Design Methods From Graphic And Motion Work

Use these references when a target needs a stronger type/image relationship,
reading rhythm, material, information sequence or distinctive graphic voice.
They are composable research leads, not a menu of website genres. A designer's
own direction or a better model proposal can replace or extend every method.

Search terms: Swiss / grid / editorial / kinetic typography / Hanzi / halftone /
papercraft / lower-third / data story / glass / Art Deco / diagonal / CRT.

## Find A Useful Relationship

`data/design-methods.json` records 24 supplied sources and 13 transferable
methods. The existing `reference`, `brief`, `reference-build` and `audit`
commands include matching candidates with implementation, motion, narrow-screen
and static-state guidance. Candidates do not change the product profile, choose
a palette, replace an authored composition or install a dependency.

```bash
node <skill-root>/scripts/reference-composition.mjs \
  --query "中文排版，字就是画面，有半调印刷质感" --format md
```

The query matcher is a convenience, not the definition of the design space.
When feedback or screenshots expose a gap absent from the original request,
inspect this inventory or rerun with that gap. No match means open selection,
not an instruction to stay visually neutral. The default output shows three
matching methods and retains other matches as alternatives; this is an output
budget, not a limit on the author's vocabulary.

## Translate Around The Actual Target

Start from the target's subject and strongest unresolved relationship. Record
which source decision is useful, how it changes actual content and geometry,
and why it survives the target's reading distance, input and runtime. The
methods are independent: typographic order can coexist with expressive local
type, a tactile image and a calm working area. Combining them must produce a
coherent thesis rather than a stack of unrelated effects.

| Method | Decision it can improve | Translation to inspect |
| --- | --- | --- |
| Typographic order | Proportion, negative space and local alignment | Invisible tracks; independent heading, prose and media measures; regrouping at intermediate widths |
| Editorial rhythm | Content selection and reading distance | Actual title/image/caption hierarchy; useful dense passages and pauses; a specific editorial voice |
| Kinetic type | Words as image and temporal composition | Semantic phrases, deliberate hold/transition/settled frames, readable static message |
| Hanzi structure | Chinese glyph recognition and expression | Stroke rhythm, internal space, center of gravity, punctuation and mixed scripts |
| Information choreography | Focus through new information | Trigger, old/new fact, persistent context, visible result and interruption behavior |
| Print material | Physical character without losing the subject | Dot/grain scale, image treatment, pattern purpose and actual device rendering |
| Paper assembly | Subject-specific material and depth | Cut edges, thickness, contact shadows, deliberate frame movement and a strong poster |
| Evidence narrative | Understanding a fact or process | Question, attributable evidence, visual relationship and a readable conclusion |
| Optical depth | Light/material relationships | Foreground/background, contrast during movement, static depth and a compatible runtime |
| Graphic contrast | Deliberate spatial tension | Dominant object, unequal contrast, intentional hard edges and useful controls |
| Ornamental rhythm | Motifs tied to type and subject | Original proportions/terminals, readable passages and scaled motif relationships |
| Directional tension | Direction that expresses the work | Vector/counterweight, phrase bounds, narrow recomposition and predictable hit areas |
| Retro light | A coherent authored scene or signal | Real light sources, material response, clear subject and stable operational text |

These are decisions to explore, not quotas for alignment, whitespace, font
size, sharpness, section count, animation count or stylistic intensity.

## What The Sources Actually Establish

Source records retain URL, source kind, reading status, date and limitations.
Descriptions, interviews and fetched articles do not prove motion timing,
responsive behavior, implementation quality or asset rights. Inaccessible
sources remain discovery leads; do not fabricate screenshots or detailed
observations to promote them to evidence.

- Fudge's accessible Claude study describes dark editorial captures with paper
  accents. It does not establish a light newspaper skin or unseen breakpoints.
- Apple's linked 2016 PDF is a typography/font course, not a current keynote
  template. Read current documentation for platform-specific implementation.
- BRUTUS's interview concerns editorial concepts and print/video collaboration;
  inspect actual publication/web pages for typography and page composition.
- Stripe Sessions describes an original metallic gradient wave. A stock mesh
  background does not reproduce its material relationship.
- Vox's link is production notes. Follow the actual stories before borrowing a
  specific map, annotation or infographic arrangement.
- The supplied GOCA gallery is blocked. The separate Athletics interview
  describes generative patterns; it does not verify the requested halftone
  technique. Generic print guidance is a method proposal, not a GOCA observation.
- The Notion breakdown is a third-party analysis of Notion; it supplies no
  separately inspected Linear example. The two YouTube candidates remain
  unviewed; verify their actual work before attributing specific decisions.

## Build And Compare

Choose a relationship worth implementing, then use the target's existing
primitives or the lightest compatible resource. Authored lettering, paper
objects, textures and scenes need real or deliberately made high-quality
assets. Preserve a semantic text/content path when expressive media carries
the visible composition. A generated proposal is a design input, not proof of
implementation; use [visual-iteration.md](visual-iteration.md) to translate it.

For moving work, use [motion.md](motion.md) and the internal Transitions bridge
for trigger, cleanup, replay, reduced motion and fallback. Design motion around
the phrase/object/state, then inspect transition and settled frames. A static
screenshot cannot establish the cadence of a sequence.

Compare the actual target at wide, ordinary, intermediate and narrow sizes,
with real content, a relevant changed state and motion disabled. Keep evidence
of the largest improvement and any remaining gap. Reject or replace the chosen
method when it produces a weaker result. Adding this inventory does not itself
prove that the skill produces better websites.
