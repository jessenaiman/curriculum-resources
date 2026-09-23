# Iteration log — "One Two Three Four" Canvas

Purpose: keep every iteration's *mistakes* on the record. Each version lists what was
wrong with it, so improvement is measurable and nothing gets silently erased.

Song: "One, Two, Three, Four" — *I Love to Hear the Sounds*, Kathy Reid-Naiman
Spec: 1080x1920 portrait (Spotify Canvas), 8.0s, seamless visual loop, real song audio embedded

---

## v1 — baseline (2026-09-23)

**Source:** `index.html` — single file, numerals nested inside full-frame timed
`<section class="clip">` elements.

**Render:** `renders/one-two-three-four_2026-09-23_15-13-39.mp4`
8.0s · 240 frames · h264 + aac · 921.6 KB · hardware GPU · 15.7s render

**Gate:** `npm run check` — 0 errors / 0 warnings; contrast 8/8 WCAG AA.

### Known wrongs (preserved, not fixed)

1. **Word label collides with the roof apex.** The bottoms of "ONE" and "TWO" are
   visually clipped by the roofline, and the bell knob pokes into the label on every
   beat. `check` passed it — both elements are inside the canvas, so this is an
   aesthetic collision, not a bounds error. Found by ffmpeg frame review, not by the gate.
2. **Audio loop seam.** An 8s cut from a 15.9s song lands mid-phrase and clicks when
   the Canvas loops.
3. **Beat timing is arbitrary.** Numerals pop on a fixed 2s cadence rather than
   aligning to the sung phrase.
4. **Numerals are not independently movable design elements.** Each digit/word span is
   nested inside a full-frame timed section, so the addressable unit is the full-frame
   box — dragging it does nothing useful. This blocks design takeover in Studio.
5. **Dead space.** The bottom ~25% is a flat empty green hill.

### What v1 still proved

- Pipeline works end to end: scaffold -> author -> check (clean) -> render -> verify -> self-review.
- The ffmpeg frame-extraction self-review loop works without the desktop-app browser
  (`browser.*` is unavailable to CLI-driven sessions).

---

## v2 — numerals as movable design elements (2026-09-23)

**Source:** `index.html` (host: static scene + 4 sub-composition mounts)
+ `compositions/count-1.html` … `count-4.html`

**Render:** `renders/one-two-three-four_2026-09-23_16-53-51.mp4`
8.0s · 240 frames · h264 + aac · 925.7 KB · hardware GPU · 19.0s render

**Gate:** `npm run check` — 0 errors / 0 warnings; contrast **10/10** WCAG AA (up from
8/8 in v1 — the numerals are now contrast-checked inside their own compositions
instead of skipped as nested children).

### Wrongs fixed

- **#1 word/roof collision — FIXED.** Numeral stack lifted 310px (`padding-bottom:
  620px` on each sub root) so the label sits in clear sky. Verified by frame review
  at 0.6s / 2.6s / 4.6s / 6.6s.
- **#4 numerals not movable — FIXED.** Each numeral is now its own composition
  (`npx hyperframes compositions` reports 5 compositions, 2 elements each), so each is
  an independent timeline row and an independently movable/selectable element in
  Studio.

### Trap documented (cost real debugging time if forgotten)

All four numerals share **one document**. An unscoped GSAP selector (`.digit`) in any
sub-composition would match and animate **every** instance at once. Each file therefore
scopes its tweens to unique ids (`#c1-digit`, `#c2-digit`, …). Verified correct: frame
review shows exactly one numeral visible per 2s window.

### Still open (carried forward)

- **#2 audio loop seam** — an 8s cut from a 15.9s song lands mid-phrase and clicks on
  loop. Needs a phrase-aligned cut or a crossfade at the seam.
- **#3 beat timing** — numerals pop on a fixed 2s cadence, not aligned to the sung
  phrase. `npx hyperframes beats` now exists in this CLI version and is the intended
  tool: it detects beats in the track and writes `beats/<audio>.json`.
- **#5 dead space** — the bottom ~25% is still a flat empty green hill.
- New observation: the two twinkling stars dip to a dull grey mid-loop rather than
  reading as a twinkle.
