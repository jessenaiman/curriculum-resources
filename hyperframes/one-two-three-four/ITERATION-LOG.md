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

## v2 — next

Planned changes:

- Split the numerals into `compositions/count-1.html` … `count-4.html`, mounted with
  `data-composition-src` so each numeral is its own timeline row and independently
  movable element in Studio.
  - Each file gets a **unique `data-composition-id`** and **uniquely scoped GSAP
    selectors** (e.g. `#c1-digit`). All four numerals share one document, so unscoped
    selectors like `.digit` would cross-animate every instance.
- Fix wrong #1: shift the numeral stack up ~150px for clear sky above the roof apex.
- Still open: wrong #2 (audio loop seam), #3 (beat sync), #5 (dead space).
