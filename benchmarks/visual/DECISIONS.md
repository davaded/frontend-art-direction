# Choices Before Construction

## Common Ground

The subject is three photographed architectural observations, not invented commissioned projects. Captions credit the actual photographers and use the locations supplied with each image. No client, prize, revenue, or building-performance claim is invented.

Alternatives considered:

- A typographic research index: quick scanning, but it underuses the photographs.
- A full photographic spread followed by unequal observation sequences: keeps material, angle, and daylight visible; chosen.
- A horizontal cinematic gallery: stronger motion, but less reliable reading and touch navigation for this small collection; rejected.

The Eye Museum photograph is portrait-oriented. Preserve its diagonal and foreground rather than stretching it into a generic landscape. The first viewport introduces the notebook name and a real observation; the next section remains visible. Later photographs retain their native portrait ratio. Image titles open a native modal viewer with keyboard continuity, sources, and previous/next controls. Closing returns focus to the observation that opened it.

Borrow from Rare UI: visible specimen states and small, consistent controls. Reject its landing-page composition as unrelated to a photographic notebook. No Rare UI source code or brand assets are copied.

## Type / Lab

Alternatives considered:

- A font storefront: attractive specimens, but it hides the edit/export job behind browsing.
- An instrument around one live artboard: immediate relationship between controls and output; chosen.
- An immersive fullscreen type performance: expressive, but it sacrifices precise adjustments and history; rejected.

The specimen is the primary object. UI text stays compact; large type belongs to the user's artwork. The baseline used a serif specimen on mint, but comparison with the notebook exposed a repeated serif/green preference. The revised default uses the actually tested Sora 500 study on rose paper, surrounded by a neutral instrument. Mint, ink, and sulfur remain user choices. The first mobile revision put the artboard before text properties; continuous use showed that this still lost the artwork while editing lower controls. The current mobile layout keeps a compact preview above a scrollable editing panel, with properties and families/studies as keyboard-operable tabs. A font, palette, slider, or copy change updates the same object. Paragraph fitting uses native word/grapheme segmentation and Canvas measurement; preview and export share line decisions. History restores actual values; saved studies persist locally; export generates a real PNG from the loaded font and current state. These are decisions for this tool, not requirements for unrelated briefs.

Borrow from Rare UI: immediate selection/pressed feedback and a visible final state. Reject decorative effect stacks. Native form controls, native dialog, Canvas 2D, and browser font shaping supply established behavior; Lucide supplies tool icons.

## Runbook

Compare a date-led calendar, a lane-led board, and a task queue with a detail reader. The real job is scanning, changing, and reading task records, so the queue wins without manufacturing a dashboard or decorative hero. Use local Sora/Space Mono and Lucide, near-black ink, coral view selection, and blue working-state marks. The four initial entries describe the actual trials, but their local journal state is not project signoff evidence.

The same detail becomes a native dialog on mobile. Selected-object continuity matters more than keeping every selected record inside the current filter: completing a task must show that task's completed result. Explicit search or view changes reconcile the selected item. Long identifiers wrap without reducing UI text, and native date/priority fields stack only where the actual values otherwise become unreadable. No new component dependency or external data service is needed for this scope.

The paragraph work uses the standard browser [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) and [Canvas text measurement](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText). These provide segmentation and metrics; the captured browser/export files establish the tested layout. Mixed-language glyphs may use a system fallback rather than the selected local Latin family.

## Asset Provenance

In The Light compares a catalogue, a permanent inspection stage, and a painting-led essay before choosing the essay. The original-resolution files were inspected before construction. An initial opening left the essay outside the first desktop read; a shorter stage and transition exposed its beginning without darkening the artwork. A narrow title fit its container but obscured a figure, so its local breakpoint was restaged. The ending's first uniform portrait crops removed parts of the wheat stacks; its current tracks retain the three paintings' real proportions. These choices follow the paintings, not a requirement for other subjects to use natural-ratio pictures or a dark ending.

Official metadata and public-domain flags are saved in `shared/assets/monet-source.json`. The museum's ordinary page displayed automatic security verification and direct IIIF image requests returned 403; no challenge was solved or bypassed. Corresponding original Commons reproductions were used after inspection. The 280px wheat file was rejected. The [museum API documentation](https://api.artic.edu/docs/) establishes the metadata/image protocol; the file pages below identify these downloaded versions and their reuse declarations.

| Local file | Source | Author / license | Intended role |
| --- | --- | --- | --- |
| `shared/assets/eye-museum.jpg` | [Eye Film Museum photograph](https://unsplash.com/photos/architectural-photograph-of-concrete-structure-clrS7NSsJLk) | John Unwin; Unsplash License | First photographic spread; original aspect and diagonal inspected |
| `shared/assets/ottawa-colonnade.jpg` | [Ottawa colonnade photograph](https://unsplash.com/photos/concrete-pillars-line-the-exterior-of-a-modern-building-VQbpgDEstfU) | Jonathan Lim; Unsplash License | Rhythm/material observation; portrait image |
| `shared/assets/kunsthalle.jpg` | [Kunsthalle photograph](https://unsplash.com/photos/modern-concrete-building-facade-with-geometric-shadows-wcdlRkLTtrg) | Julia Taubitz; Unsplash License | Daylight/shadow observation; portrait image |
| `shared/assets/monet-cliff.jpg` | [Cliff Walk at Pourville](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg) | Claude Monet; Google Art Project reproduction, public-domain declaration | 2807x2251 original; coastal opening and whole/detail viewer |
| `shared/assets/monet-wheat.jpg` | [Stacks of Wheat (End of Summer)](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Stacks_of_Wheat_(End_of_Summer)_-_1985.1103_-_Art_Institute_of_Chicago.jpg) | Claude Monet; museum reproduction, CC0 declaration | 3000x1778 original; whole wide field and brushwork detail |
| `shared/assets/monet-lilies.jpg` | [Water Lilies](https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1933.1157_-_Art_Institute_of_Chicago.jpg) | Claude Monet; museum reproduction, CC0 declaration | 3000x2887 original; water chapter and whole/detail viewer |
| `shared/assets/sora.ttf` | [Google Fonts Sora](https://github.com/google/fonts/tree/main/ofl/sora) | Sora Project Authors; bundled OFL | UI and sans specimen |
| `shared/assets/newsreader.ttf` | [Google Fonts Newsreader](https://github.com/google/fonts/tree/main/ofl/newsreader) | Newsreader Project Authors; bundled OFL | Notebook identity and serif specimen |
| `shared/assets/space-mono.ttf` | [Google Fonts Space Mono](https://github.com/google/fonts/tree/main/ofl/spacemono) | Space Mono Project Authors; bundled OFL | Mono specimen |
| `shared/assets/lucide.min.js` | [Lucide 0.468.0](https://www.npmjs.com/package/lucide/v/0.468.0) | Lucide contributors; bundled ISC license | Familiar tool icons |

The photographs were inspected at their downloaded resolution before use. They illustrate the real subject; they are not evidence of work commissioned from an invented studio. [Unsplash's license](https://unsplash.com/license) and font licenses are recorded separately from browser proof. No image was generated in these trials.

## Night Shift

Night Shift is a fifth brief and a deliberate test of an ordinary product-like surface with a strong subject. It is a field guide for one real Hubble image, not a space dashboard, telescope shop, or generic dark landing page.

Alternatives considered:

- A dense observatory dashboard: rejected because one image does not justify fake telemetry or repeated data tiles.
- A cinematic space poster: rejected because it makes the image decorative and loses the reading task.
- A field guide with changing reading distance: chosen. The same source image can be read as a wide field, companion relationship, and core detail without inventing new material.

The hero scale follows the actual image: a first render left M51 too small, so the real image was enlarged and repositioned. The reading controls are a meaningful interaction because they change the visitor's distance from the same material. A control-triggered state must keep the changed image visible; this exposed and repaired a deep-scroll visibility bug. Mobile keeps all three primary destinations after a narrow-header check. The ending gives the source record its own visual section and retains the NASA/ESA/STScI credit.

The image is the original 7095x6219 Wikimedia Commons reproduction of NASA/ESA Hubble material. Its source record is saved at `shared/assets/m51-source.json`; the file page declares the NASA/ESA material public domain with credit. The browser tests also induced an image failure and verified the source links, disabled controls, and readable fallback. No generated or placeholder image is used.
