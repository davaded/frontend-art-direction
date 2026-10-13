# Common Frame / Visual Direction

## Thesis and authority

An independent film club as an edited programme: an open typographic masthead, an inspectable film image, a useful screening index, and a quiet curatorial reading. This is an authored trial based on live source relationships in RESEARCH.md. The local narrative-chapters candidate is replaceable; it does not prescribe these sections.

## Region decisions

| Region | Placement / line alignment | Natural measure and field | Narrow change / purpose |
| --- | --- | --- | --- |
| Navigation | Small start identity; end-attached saved programme | 1240px maximum, open white field | Keep Programme and Saved directly available; About remains in the footer |
| Club masthead | Centered short brand; start/end edition details | 1240px field; display independent of prose | Brand takes two deliberate lines; edition details regroup |
| Lead film | Centered image; start identity, end action | 1240px softened image stage, no chapter card | 4:3 image holds both characters; caption and date separate |
| Programme | Start heading, end filters; each screening chooses its own local relation | 1080px open working index; space separates rows before rules do | First screening reads date -> image -> copy; second reverses image/copy/date on wide screens, then returns to a readable sequence on narrow screens |
| Reading room | Offset short heading with a process artifact; narrower start-aligned prose | 960px relationship in a continuous grey field; the artifact is a counterweight, not a card | Keep the real storyboard visible beside the thesis on wide screens; stack it before the copy on narrow screens |
| About and credits | Start club note, end sources | 1080px field; 420px prose; small deliberate ending | Single column, credits visible |
| Film detail | Native centered overlay; start text | 720px dialog; natural-ratio image; 56ch prose | Bounded scrollable sheet, reachable dismissal and actions |

Fields may grow beyond these measures without stretching prose or control travel. No alignment variety quota or repeated viewport-height bands. Programme density is earned by dates and decisions; the masthead's pause introduces the club; the reading gives a reason to discuss the films.

## System

Newsreader: literal brand (112px desktop, 76px intermediate, 56px narrow), curatorial titles 48/38px. Sora: navigation, film identity, body. Space Mono: short dates only. Letter spacing 0. White page, near-black text, deep green actions, grey reading field, coral edition mark, distinct colours from actual images. No gradients or decorative effects. Lead-image corner 20px, repeated image/control 6px, process artifact 12px, dialog 8px. Open sections have no cards; programme rows use space and dates before adding rules. Stable media ratios, icon buttons, and filter tracks.

## Motion review -> apply -> polish

The bridge inspected cached upstream commit 598d3d6ad89dabb4bdf742fd2e887ca53914a888. Its modal recipe is adapted into t-modal on the native dialog: 250ms / .96 opening, 150ms / .96 dismissal, native focus containment. Keep the required reduced-motion guard. Cancelled/replayed states clear classes and timers; bounded dismissal is a fallback if transitions are interrupted. Save/filter feedback is immediate; no decorative scroll loop or new library.

## Scope and acceptance

Two licensed real films, two explicitly sample screening dates, all/saved filtering, persistent save/remove with session-only storage feedback, film details and official sources, calendar export, empty state, failed-image retry, keyboard/Escape, reduced motion, static image fallback, credits and ending. No checkout or registration service. Actual captures and exercised paths are recorded in PROOF.md. State review and final sign-off remain open; these decisions are not visual acceptance.

## Render-led revisions

The first desktop opening concealed the programme and left a lone `A` at the start of the reading title. A shorter lead stage, a smaller handoff, a short-height masthead, and a two-line reading title repair those relationships. The two characters and mechanical hand remain visible; the desktop crop gives the male character's hair room. The subject image, programme, prose, and credits retain independent measures rather than inheriting one site-wide alignment.

At narrow widths, the curatorial prose now uses 15px / 1.7 rather than 13px; programme and club descriptions use 14px, separately from dates and credits. Navigation and filter controls have 44px height. Sample-edition metadata remains visible at intermediate widths. `Remove screening` retains the calendar action in the same narrow action row. Removing a saved film returns to the visible programme controls when its opener disappears; empty recovery does the same. The storyboard remains a small piece of process evidence before the mobile reading copy, rather than turning the grey field into a stack of feature blocks. These decisions belong to this content and are not global font, shape, or layout prescriptions.

The 390px geometry audit flags `packed-content-field`. The inspected image and programme are intentionally close to the device width with 20px gutters; the reading has 24px gutters, a distinct 342px measure, and legible line rhythm. Keep the unframed mobile relationship rather than shrinking these regions to clear an advisory detector. This is a rendered exception, not permission to ignore future density problems. The lead image's small `01 / of 02 / open movie` mark is a subject-native index and remains inside the media stage at wide and narrow widths.

An explicit first/last Tab wrap was added after the observed native sequence reached the document body. The reverse and forward edges were verified inside the dialog at 320x740; settled Escape returned to the opener and cleared body overflow. Film length and unavailable-storage behavior are also evidenced. The deliberately reset implementing-agent critique is complete with one open P2 visual gap around the wide programme pause; final sign-off remains pending.
