# PLAN.md — Builder cycle (2026-05-07 :03 slot)

## Targets (4)

### 1. Contact left-column scroll-reveal void
- **File:** `app/components/Contact.tsx`
- **Change:** Drop IntersectionObserver threshold from 0.15 → 0.05. Add a
  `scroll-reveal-left` stagger class to each item in the left column so the
  content slides in from the left when the section enters the viewport.
- **Success:** Left column content visible at all 5 mid-runway scroll positions.

### 2. WhySoley mobile accordion (≤640px)
- **File:** `app/components/WhySoley.tsx`
- **Change:** Add per-card `isOpen` state tracked in parent via `openId` string.
  On mobile (≤640px) cards render in a vertical accordion stack: header row is
  always visible, description body collapses/expands on tap via CSS max-height
  transition + `aria-expanded` / `aria-controls`. Desktop 3D tilt unchanged. All
  4 cards, all content kept (Frame B richness rule).
- **Success:** Tap to expand works at 375px; desktop tilt unaffected.

### 3. Navbar logo `white-space: nowrap` at 375px
- **File:** `app/globals.css`
- **Change:** Add `white-space: nowrap` to `.nav-logo` inside the ≤640px block.
- **Success:** "Soley Painting" stays on one line at 375px.

### 4. Honest founder / human-signal block
- **File:** `app/components/FounderBlock.tsx` (new) + `app/page.tsx`
- **Change:** Insert between WhySoley and Process. Contains: placeholder portrait
  frame (chalk silhouette on umber tile) + two-line honest copy ("Run by a small
  crew that actually shows up. Founder portrait forthcoming — real photography on
  the way.") + a short pull-quote attributed only to "the painter behind Soley".
  NO name, NO "Est. YYYY", NO neighborhood. Umber-background section, contrasts
  with chalk sections on either side.
- **Success:** Section renders between WhySoley and Process; build passes.

## Diff scope
~200 lines new (FounderBlock) + ~60 lines modified (WhySoley, Contact, globals.css, page.tsx).

## Build check
`npx next build` must pass clean before commit.
