# Constraint Authority

The skill must protect the product without flattening the person designing it. Visual rules therefore have levels of authority.

## The Order Of Authority

1. **Hard invariants** protect accessibility, the relevant task/state or authored-experience completeness, responsive usability, asset truth and rights, motion fallback, runtime integrity, and honest rendered proof. They are not style preferences.
2. **Current user direction** wins when the user explicitly asks for a visual language, supplies a concept, or pins a direction for this pass.
3. **A named or inspected reference** can define composition, material, type, rhythm, and interaction when those decisions are actually inspected and translated.
4. **Project-owned `DESIGN.md`** is the default visual authority for an existing product. Read it before replacing its language. It may define a direction that does not exist in the local candidate data.
5. **An accepted concept or model proposal** may establish a new direction when its rationale and rendered proof are recorded.
6. **A fresh model or designer thesis** can replace local candidates when it is specific, coherent, and rendered; record it as an authored proposal rather than forcing it into a saved style ID.
7. **Local profiles, treatments, recipes, and AI-default checks** fill gaps. They are useful priors, not a universal style law.

The current request can intentionally replace an existing project direction. Preserve the product's hard invariants and record that the current request superseded the inherited visual memory for this pass.

## What Can Be Overridden

The following are advisory smell detectors:

- centered hero compositions;
- equal-card or repeated split layouts;
- oversized type;
- dark gradients, glow, glass, blur, noise, or cinematic motion;
- beige, black-and-gold, or editorial treatments;
- pills, rounded containers, or component-library skins;
- any local profile, visual treatment, or reference recipe.

Use them deliberately when the authority source makes the choice coherent. A deliberate exception is often better than mechanically obeying a generic anti-pattern list.

## Override Record

When a direction intentionally breaks a local default, write a compact record before polishing:

```text
Authority source:
Default being overridden:
Deliberate reason:
Evidence: reference / project DESIGN.md / concept / user direction:
Risk and mitigation:
Hard invariants preserved:
Rendered proof: desktop / mobile / non-default / reduced-motion or static fallback:
```

The record is not a request for permission, and it is not required when no default is being broken. It is a way to keep a strong exception legible, testable, and reversible.

## How To Read `DESIGN.md`

Treat a substantive project `DESIGN.md` as project-owned design memory, not as another suggestion to rank against a generic dataset. Preserve its type, material, composition, motion, and intentional omissions unless the current task explicitly replaces them. If it is incomplete, use the local direction contract only for missing fields and mark those fields as inferred.

Do not force a project direction into the saved direction IDs. The IDs are fallback vocabulary; the project's own language is allowed to be more specific, stranger, quieter, or more experimental.

## Freedom With Accountability

Freedom does not mean removing review. It means reviewing the right things:

- Is the chosen language coherent with the object, audience, and task?
- Does it preserve the hard invariants?
- Does the rendered hierarchy survive desktop, mobile, grayscale, and the important state?
- Is the exception intentional rather than an accidental return to a default?

If the answer is yes, keep the direction even when it violates a local heuristic.

Before implementation, run one creative-divergence check: temporarily ignore the local style IDs and form 2-3 structurally different hypotheses from the object, audience, task, reference, project memory, or current model capability. If one is stronger and coherent, promote it to the authority source. Consistency with the dataset is never a reason to keep a weaker direction. Read [creative-direction.md](creative-direction.md) for the comparison frame and authored file format.
