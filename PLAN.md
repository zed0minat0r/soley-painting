# PLAN.md — Cycle 11 Builder: FounderBlock + WhySoley Visual Polish

**Date:** 2026-05-07
**Scope:** Visual refinement only — no content count changes, no JS structure changes

## Files to change

1. `app/components/FounderBlock.tsx`
   - Remove teal radial gradient background wash (bottom-right, line 59-69) — replace with ochre/rust warm wash to match Drop Cloth & Rust palette
   - Portrait placeholder frame: upgrade border from thin 1px dashed to a stronger craft-paper treatment — thicker border, terracotta corner marks already present (keep), add a subtle inset texture stripe at top/bottom
   - Honest signals row: make each signal more visually distinct — wrap in a styled "data pill" box with left-border accent (rotate rust/ochre/stone per item) instead of plain text pairs
   - Pull-quote: bump the left border from 3px to 4px, add a small terracotta quote-mark SVG above the quote text for visual weight
   - "Owner takes calls before 8pm" copy is already in body text — surface it as a standalone callout chip above the blockquote

2. `app/components/WhySoley.tsx`
   - Card accents verify: 01=terra/rust, 02=ochre, 03=gold, 04=rust — confirm accent values hit the Drop Cloth & Rust tokens (current: terra, ochre, gold, rust — terra aliases rust so all warm, good)
   - Card number "01"–"04": bump from 0.8125rem (small) to a more commanding display-size (1.75rem) so it reads as a visual anchor, not a footnote — full opacity, foreground (NOT ghost per RULE 8)
   - Spotlight glow: verify the rgba uses `--color-rust` (#BF5B38 = rgb 191,91,56) not old terracotta #C2603A — update if needed
   - Card icon container: bump background tint from rgba(44,31,22,0.04) to 0.07 so icons have more presence on chalk background
   - Add a thin painted-edge top bar (2px, matching card accent) at very top of card body — supplements the existing left-edge bar for corner-to-corner brand presence

3. `app/globals.css`
   - No changes required (palette vars already correct)

## Success criterion

`npx next build` passes clean. No new teal references. No ghost numbers. No fabricated content. Mobile accordion structure untouched.

## Scope limit

Touch ONLY `FounderBlock.tsx` and `WhySoley.tsx`. Zero JS logic changes.

**Word count: ~190**
