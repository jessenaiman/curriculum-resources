# Iteration log — "One Two Buckle my Shoe" Canvas

Purpose: keep every iteration's *mistakes* on the record so improvement is measurable.

Song: "One, Two, Buckle my Shoe" — *I Love to Hear the Sounds*, Kathy Reid-Naiman
Spec: 1080x1920 portrait (Spotify Canvas), 8.0s, seamless visual loop

**This video exists to prove the workflow improvements** carried over from
`../one-two-three-four`: beat-driven timing and a genuinely seamless audio seam.

---

## v1 — beats + seamless loop (2026-09-23)

**Source:** `index.html` (host) + `compositions/count-1.html` … `count-4.html`

**Render:** `renders/one-two-buckle-my-shoe_2026-09-23_17-26-16.mp4`
8.0s · 240 frames · h264 + aac · 931.9 KB · hardware GPU · 18.1s render

**Gate:** `npm run check` — 0 errors / 0 warnings; contrast 6/6 WCAG AA.

### Workflow improvements proved

- **Beat-driven timing (was wrong #3 on the previous video).** `npx hyperframes beats`
  detected **56 beats @ 176 BPM** and wrote `beats/assets/buckle.mp3.json`. The numerals
  are mounted at real detected onsets instead of a fixed 2s cadence. The 8s slice starts
  at 3.989s; chosen local onsets are **0.94 / 1.81 / 3.66 / 5.54s** (the 7.648s source
  beat is the strongest in the window, strength 0.677).
- **Seamless audio seam (was wrong #2 on the previous video).** An 8s slice **cannot**
  be a whole number of bars at 176 BPM (8s = 5.87 bars), so trimming alone can never
  produce a clean loop. `assets/buckle-loop.mp3` is a phrase-aligned 8.000000s cut whose
  final 0.75s is crossfaded into its first 0.75s, so the Canvas loop flows instead of
  clicking.
- **Numerals are independently movable elements** — same sub-composition pattern as
  `one-two-three-four` v2, so design takeover works from the first version here.

### A real bug caught by frame review (not by the gate)

The first render rotated the door on its hinge. Frame review at 5.7s showed the door
panel **arcing upward through the word "FOUR"**, with the knob landing inside the "F" —
and `check` raised `rotation_pivot_drift` on `#door`.

The lint hint ("rotation should pivot about the element's own center") would have been
the wrong fix for a door. A door reads as swinging *in the picture plane*, so the correct
technique is **foreshortening with `scaleX` anchored at the hinge** (0.12 = open/edge-on,
1 = shut). That removed the collision and cleared the warning honestly rather than by
suppression. Gate is now 0 warnings.

### Known wrongs (preserved, not fixed)

- **Only 4 of the song's 10 numbers are shown.** The lyric runs one..ten; an 8s Canvas
  cannot hold all ten at readable size.
- **The open doorway reads as a dark cave.** At `scaleX: 0.12` the doorway interior is an
  empty dark arch with no depth cue or light behind it.
- **The door frame is plain** — a single flat arch, no wall around it, so it floats.
- **The numeral sits close to the door top** — tight but not overlapping.
- **No Jev involvement.** Art style was hand-authored again.
- The doorway and ground are large flat fields of colour with no texture.

### Verification

Frame review at 1.1s / 2.0s / 3.9s / 5.8s / 6.2s / 7.9s confirms:
door ajar → mid-swing on the "four" beat → fully shut at 6.2s → reopened by 7.9s, so the
loop returns to its t=0 rest state.
