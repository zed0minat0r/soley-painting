# PLAN.md — Builder cycle 3 (2026-05-07 :03 slot — Portfolio Gallery)

## Target

**NEW SECTION: PortfolioGallery** — filterable project gallery inserted between
`<FounderBlock />` and `<Process />` in `app/page.tsx`.

## Files

| File | Change |
|---|---|
| `app/components/PortfolioGallery.tsx` | NEW — full component |
| `app/globals.css` | Add `portfolio-tile`, chip, filter-transition, and painted-swatch CSS (~60 lines) |
| `app/page.tsx` | Import + insert `<PortfolioGallery />` between FounderBlock and Process |

## Tiles (9 total, honest generic descriptors, no city/homeowner names)

| # | Category | Descriptor |
|---|---|---|
| 1 | INTERIOR | Two-story living room + stairwell · open-plan repaint |
| 2 | EXTERIOR | Single-family Cape Cod exterior · full repaint cycle |
| 3 | CABINET & TRIM | Kitchen cabinet refinish · 32 doors + drawer fronts |
| 4 | COMMERCIAL | Office suite build-out · primer + two-coat finish |
| 5 | INTERIOR | Primary bedroom + en-suite · accent wall treatment |
| 6 | EXTERIOR | Colonial revival facade · trim detail + shutters |
| 7 | SPECIALTY | Garage floor epoxy coating · two-part system |
| 8 | COMMERCIAL | Retail space repaint · 3,200 sq ft open floor plan |
| 9 | CABINET & TRIM | Built-in bookcase + crown molding refinish |

## Tile design

- Aspect ratio 4:3 CSS-generated painted-swatch placeholder (SVG abstract brushstroke blob, NO stock photo)
- Chalk-on-umber painted texture: umber base `#3D2B1F`, abstract painted mark in category swatch color at 30-40% opacity
- "Photography forthcoming" italic overlay label centered
- Category chip badge top-left
- 2-line descriptor bottom

## Filter chips (6)

ALL · INTERIOR · EXTERIOR · COMMERCIAL · CABINET & TRIM · SPECIALTY

- Active: terracotta bg + chalk text
- Inactive: chalk border + slate text
- Click updates React state; opacity transition 200ms
- Empty-state card if filter produces zero tiles

## Section copy

- Eyebrow: "Recent Work"
- Headline: "A sketch of the work we'll showcase."
- Sub-line: "First project photography lands as soon as our launch crew wraps their first set of jobs. Until then, here is a preview of the work categories."

## Grid layout

- Desktop (≥1024px): 3 columns
- Tablet (640-1023px): 2 columns
- Mobile (<640px): 1 column
- Filter chips wrap naturally, tap targets ≥ 44px (RULE 4 — no collapse to select)

## Scroll-reveal

Use existing `.scroll-reveal` class + `ScrollRevealObserver` IntersectionObserver pattern (catalog #9). No Framer Motion `whileInView`.

## Success criterion

- `npx next build` passes clean
- Section renders at `#portfolio` between FounderBlock and Process
- All 6 filter chips work via React state
- 9 tiles visible on ALL filter; correct subset on each category chip
- Empty-state shows for SPECIALTY (1 tile — may appear non-empty; show state handled regardless)

## Forbidden (per AGENT-PLAN.md)

- NO fabricated city/homeowner/project names
- NO ghost numbers
- NO matchMedia bail-outs
- NO Framer Motion whileInView on SSR elements
- NO touching FounderBlock / Process / ServicesScrollLock internals
- NO R3F re-introduction

## Diff scope

~250 lines new (PortfolioGallery) + ~70 lines CSS + ~3 lines page.tsx.
