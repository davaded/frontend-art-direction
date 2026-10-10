# Direction: Light Changes The Reading

## Choices

- Date-led catalogue: useful for many works, but three works do not need a dense catalogue and this would underuse their surface and colour.
- One permanent painting stage with a rail of work selectors: strong close looking, but too similar to the Type / Lab instrument and too little authored progression.
- A continuous essay whose changing image ratio shapes the reading: coastal opening, wide field, close water surface, then a return to the works. Chosen because the actual paintings supply three different distances and silhouettes.

## Visual Direction Contract

Authority: inspected real paintings, saved collection metadata, and this essay's own thesis. Local profile suggestions are candidates. This is not a Rare UI or Common Ground skin.

Composition: full-bleed coast and literal artist name, an open introductory reading band, the whole wheat painting at its wide natural ratio, a close-reading water chapter, and a deliberate ending. Dominant: the actual painting. Counterweight: a compact label and viewing action. Axis: image edges and essay baselines; the water chapter deliberately changes the axis rather than repeating three alternating cards. Below-fold peek: the introduction appears under the opening at the target desktop/mobile heights.

Type: Sora 112px opening title and 38px chapter headings, Newsreader 52px looking thesis, Sora 14px body and 11-12px metadata. Display sizes belong to the essay, not dialog controls. Letter spacing stays zero. On mobile use fixed 58px title and 36-40px editorial text, with literal content fit verified. At 320px the title uses a fixed 48px step and a higher position so the two figures remain clear; the 58px container-fitting version failed that visual relationship.

Material: real brushstrokes and unfiltered colour supply texture. Neutral white/graphite surfaces and a restrained plum action accent frame the works. No artificial paper texture, dark wash over the paintings, noisy gradient, floating section cards, or decorative metrics.

Geometry: unframed sections; circular familiar-icon viewing controls; a native dialog with 8px corners. Separation uses actual image ratio, whitespace, tone, and authored copy. No repeated full-width rules. The controls have stable 44px dimensions.

Signature: whole composition and authored brushwork detail refer to the same real painting. A detail is labelled as a crop; it never pretends to be the original whole canvas. The user can return to the whole painting and to its actual collection/source record.

Motion: native open/close and a short opacity entry acknowledge the viewing state. No automatic slideshow, animated type, scroll hijack, or decorative loop. Reduced motion makes the state immediate. The view remains useful with a static image and normal document scrolling; no additional animation dependency is justified.

## Reference Translation

Consider the maintained inventory. Apply Rare UI's clear specimen state and compact inspect control; reject its landing layout and copy. Apply Design Spells' focus on a small purposeful state change; reject a collection of unrelated tricks. Apply Transitions.dev's Review / Apply / Polish, cleanup and reduced-motion review; retain native/static behavior when no recipe is a better fit. Use the existing local Lucide source for familiar icons. shadcn/ui, Rewamp, Beautiful UI, beUI, Magic UI, React Bits, Aceternity, Obsidian, and Bencho do not supply a missing implementation job here, so no dependency or default skin is imported.

## Image Source Boundary

The official API's public-domain flags and metadata are saved in `../shared/assets/monet-source.json`. Direct museum image requests returned 403 and the ordinary museum page showed an automatic security verification screen. No challenge was solved or bypassed. Corresponding original-resolution Commons files were inspected instead: Google Art Project reproduction for the coast, museum CC0 reproductions for wheat and lilies. The 280px wheat preview was rejected. Whole-image display and cropped details use these local full-resolution files, with visible sources recorded separately from runtime proof.
