# AUDIT.md — Soley Painting
**Cycle:** 10 (Nigel)
**Date:** 2026-05-07
**Axis:** scroll-experience
**Auditor:** Nigel
**Live URL:** https://soley-painting.vercel.app
**Previous score:** 6.9 (micro-interactions)
**Cap:** 7.5 (pre-launch — real photography, reviews, address all outstanding)

---

## Summary Score: 7.0 / 10

A fractional improvement net of a newly-confirmed scroll-reveal catastrophe that touches the majority of the page. The palette migration is a genuine win — no teal escaping anywhere, all-warm Drop Cloth and Rust reads as a considered, artisanal identity. The icon-cycling hero draws correctly and reads as original. What pulls it down: 35 scroll-reveal elements are permanently frozen at opacity 0 in a headless render, meaning the entire WhySoley, FounderBlock, FAQ, Contact left column, and Portfolio gallery tile grid are invisible to any user whose browser fires IntersectionObserver later than frame 0. That is the majority of the page's content completely missing on mobile. The double-panel bleed on iPhone SE (two services simultaneously visible) from the prior cycle is still unremedied. These are not polish gaps — they are content absences.

---

## Section Scores

### 1. Hero + Icon Cycling (Catalog #1 / #12)
**Score: 7.5 / 10**

The cycling icon system (smiley → paint can → brush → roller → house) is now drawing visibly after the React state no-op fix. The linen-on-umber canvas card, the counter "1 / 5", and the warm SVG atmosphere are cohesive and original. No WebGL/R3F, which costs against the catalog spec but the replacement is intentional and approved. The icon strokes are elegant; constant velocity confirmed. Headline glow is present in terracotta and the warm-amber italic "done right" reads with personality.

Deductions: the hero canvas occupies the full single-column stack on mobile but the icon draws are small within a white rectangle that reads as an inset iframe. The linen card background creates a box-within-dark-background contrast that diminishes the cinematic quality. No 3-layer text glow as specified in catalog #8 — the sub-headline has no glow whatsoever.

### 2. Palette Cohesion (Catalog #2)
**Score: 8.5 / 10**

Zero teal anywhere — confirmed by computed-style sweep across all three viewports. All warm: rust (#BF5B38), ochre, umber, linen, stone. The Services panels use foreground numerals at full opacity (compliant with Rule 8 — no ghost numbers). The warm-dark Services section creates genuine tonal contrast against the chalk sections. This is the most-improved element since cycle 6.9. The all-warm palette reads as a deliberate craft identity rather than a default template.

Minor deduction: the linen (#F5F0EA) background used across three consecutive sections (WhySoley, FounderBlock, Portfolio) reads as a single undifferentiated zone mid-page, especially when the scroll-reveals are stuck and those sections appear completely blank.

### 3. Section Dividers (Catalog #3)
**Score: 5.5 / 10**

The divider SVGs exist in the DOM (79 SVG elements total, many aria-hidden). However the Playwright class selector `[class*="divider"]` returns 0 matches, indicating the SectionDivider component renders without an identifiable CSS hook that the previous QA used to count them. Visually, the desktop 50% mid-scroll screenshot confirms the three paint-drop teardrops and traveling pulses are rendering between the Services exit and the next section. They are small — approximately 8px teardrop height — and easily overlooked on first pass. The traveling pulse dot is visible at the right edge of the desktop screenshot. On mobile these are similarly present but very subtle.

The catalog spec calls for "2 traveling circular paint-splatter pulses that run left→right and right→left." Only one traveling pulse is visible in the desktop screenshot (at the far right edge). Either the second pulse is off-frame or not rendering.

### 4. ServicesScrollLock (Catalog #4)
**Score: 6.5 / 10** (no change from prior cycle)

Desktop: the translateX mechanism is working — confirmed at 5 runway positions the track translates at -36.9px at 5% which indicates the JS handler is firing. However the track selector returns width:74 which suggests it is finding a sub-element, not the full track. The desktop screenshot at 50% shows the Commercial panel partially and Cabinet & Trim entering from right — two panels simultaneously visible. This is the expected horizontal scroll behavior and reads fine on desktop given the large viewport, though the panels bleed left edge slightly (content truncated off-screen-left).

iPhone SE: the double-panel bleed from the prior cycle is **still present and confirmed**. At SE 375px width, two service panels are simultaneously visible with a visible seam between Commercial and Cabinet & Trim. This is a regression from the BUG-025 fix. The panel width is not clamped to 100vw or 100dvw on narrow viewports. A buyer on a 375px phone sees two half-panels simultaneously — the scroll-lock effect reads broken, not cinematic.

### 5. PaintFlow Workflow (Catalog #5)
**Score: 7.0 / 10**

PaintFlow found, height 645px, opacity 1, 12 dot elements present. The section is rendering and the RAF animation is confirmed from prior QA. The dark umber panel with 6-strip horizontal blind reveal is the right visual register. Upward movement: the section is sandwiched between two linen-background sections and on mobile it likely collapses in height — the 645px on iPhone 13 is adequate but not generous. The SVG path draw-in and animated dot travel are catalog-compliant.

Deduction: the node label sizes and the animated dot visibility on mobile were not visually confirmed this cycle due to scroll-reveal interference. If the PaintFlow nodes carry scroll-reveal classes they may also be stuck hidden (all 35 scroll-reveal elements were found stuck at opacity 0 in the headless check).

### 6. LiveEstimate (Catalog #6)
**Score: 7.5 / 10**

One instance confirmed (id=live-estimate, in Contact.tsx as canonical). The duplicate from page.tsx was removed last cycle. The two-column editorial layout with commitment bullets on the left and the fixed-height card on the right is the right structural move. The typing simulation with natural cadence is catalog-compliant. The sent animation with the rust checkmark closes the loop.

Deduction: the desktop screenshot at the bottom shows the LiveEstimate card partially out of frame with a text cursor blinking in the top field — the card appears to be starting mid-animation on initial load rather than waiting for scroll-entry. The right column card bleeds into the navbar visually at certain scroll positions.

### 7. Process Timeline (Catalog #7)
**Score: 7.0 / 10**

5 tabs, aria-selected correctly set to "true" on tab 0, "false" on 2-5. Auto-advance confirmed functional in prior QA. Character-stagger and word-stagger are implemented. The countdown bar selector returns `hasCountdown: false` — this means the countdown bar element either has no class containing "countdown" or it has been renamed. Prior QA confirmed a 10s countdown in the source but it may not be rendering visually.

### 8. Text Glow (Catalog #8)
**Score: 6.5 / 10**

The hero headline has a warm amber italic treatment that reads with presence on the dark hero background. However the catalog specification calls for a 3-layer halo: 1px near-white core + 10px terracotta mid + 28px teal ambient. The teal ambient was purged in the palette migration (correctly per the all-warm brief), but no warm replacement ambient was added. Sub-headline has no glow. Services panel titles have no per-panel swatch glow. The marquee items have no per-item glow hue-shift. The implementation is partially compliant at best.

### 9. Scroll Reveals (Catalog #9)
**Score: 2.5 / 10** — BLOCKER

**35 scroll-reveal elements confirmed stuck at opacity 0 on all viewports.** This is the most critical finding this cycle. Every section below the hero that uses the `.scroll-reveal` / `.in-view` CSS pattern has its IntersectionObserver either not firing or firing after Playwright's scroll positions. The visual evidence is clear: iPhone 13 at 40%, 50%, 60% shows either a completely blank linen void or only navbar + 2 WhySoley accordion items. The PortfolioGallery section at 3,846px tall on mobile reads as 3,846px of blank cream — the tiles are present in the DOM but opacity 0.

This means on a real mobile device, any user who scrolls at medium pace may encounter multiple full-viewport blank sections before content appears. A buyer cannot evaluate the portfolio, the founder block, the FAQ, or the contact commitments if they never reveal.

The root cause is likely that the IntersectionObserver root margin and threshold are tuned for a desktop browser where IntersectionObserver fires eagerly. On mobile, the sticky navbar creates a different intersection geometry. The fix is a larger rootMargin (e.g., `0px 0px -10% 0px` or `0px`) and a lower threshold (0.01 or 0).

### 10. Feature Cards / Tilt (Catalog #10)
**Score: 6.5 / 10**

WhySoley cards with mousemove tilt exist in the DOM. However they cannot be visually verified this cycle because the WhySoley section is hidden (scroll-reveal stuck). The mobile accordion with aria-expanded is in the source. Score held from prior cycle.

### 11. Social Text Link (Catalog #11)
**Score: 7.5 / 10**

"Social channels coming soon" is honest pre-launch framing per Rule 7. The footer bottom bar pattern (copyright left, social right) is in place. Intentional — no deduction.

### 12. Constant-Velocity Icon Cycling (Catalog #12)
**Score: 8.0 / 10**

The React state no-op bug is fixed. Icons cycle at constant velocity. The 1/5 counter confirms the phase machine is advancing. No sin/lerp drift. Compliance confirmed.

---

## What Improved vs. Cycle 6.9

1. **Palette migration complete** — zero teal anywhere. All-warm Drop Cloth and Rust is cohesive and original. This is a genuine visual identity gain.
2. **Icon cycling now draws** — the React state no-op fix means the hero centerpiece actually animates, which was the most pressing catalog item.
3. **LiveEstimate deduplication** — only one instance in the DOM, correct canonical location.
4. **SEO layer** — JSON-LD LocalBusiness + FAQPage + sitemap + robots.txt are structural wins that don't affect the buyer score but matter for launch readiness.
5. **FounderBlock + WhySoley card polish** — ochre wash, craft-paper frame, data-pills — these are improvements to content depth IF the scroll-reveal can be fixed so they actually appear.

## What Regressed or Stagnated vs. Cycle 6.9

1. **Scroll-reveal catastrophe (35 elements stuck at opacity 0)** — this is worse than the previous cycle because more sections now carry scroll-reveal. The PortfolioGallery, FounderBlock, and Contact left column are new additions that are also stuck.
2. **ServicesScrollLock SE double-panel bleed** — unfixed since last cycle. BUG-025 was marked closed but the panel width is still not clamping correctly on 375px.
3. **Portfolio section is 3,846px of blank space on mobile** — the gallery tiles only exist under scroll-reveal and never fire.
4. **No text glow upgrade** — catalog #8 is still partially unimplemented. The palette migration removed the teal ambient without adding a warm replacement.

---

## Top 5 Priorities for Next Cycle

**P1 — BLOCKER: Fix ScrollRevealObserver IntersectionObserver on mobile.**
All 35 scroll-reveal elements are permanently hidden on mobile. Set `rootMargin: '0px 0px -5% 0px'` (or `0px 0px 0px 0px`) and `threshold: 0.01`. Also add an `{ once: true }` guard so elements that have crossed the threshold stay visible even when scrolled past. This single fix unlocks WhySoley, FounderBlock, Portfolio tiles, FAQ, Contact left column, and PaintFlow nodes.

**P2 — BLOCKER: Fix ServicesScrollLock panel width on iPhone SE (375px).**
The panel `min-width` is not resolving to 100vw on 375px — two panels are simultaneously visible. Set each panel to `width: 100dvw; min-width: 100dvw; flex-shrink: 0`. The track's total width must be `calc(5 * 100dvw)`. Verify with `getBoundingClientRect` on each panel at SE 375.

**P3 — HIGH: Add warm 3-layer text glow to hero headline and sub-headline.**
The teal ambient was correctly removed but not replaced. Add: `0 0 1px #fff8f0` (near-white core) + `0 0 12px rgba(191,91,56,0.65)` (rust mid) + `0 0 32px rgba(184,136,74,0.35)` (ochre ambient). Sub-headline should use a lighter rust mid + linen ambient. This completes catalog #8.

**P4 — HIGH: PortfolioGallery — ensure tiles appear above-fold on mobile without scroll-reveal, or use a lower threshold.**
3,846px of blank space on mobile is the single worst impression on the page. Even if P1 fixes the observer, add a fallback: tiles that are within the first 2 viewport heights of the Portfolio section should be visible on initial paint (no opacity:0 default).

**P5 — MEDIUM: ServicesScrollLock desktop panel left-edge content truncation.**
At 50% through the desktop runway, the active panel's left column text is clipped off-screen-left. The panel layout needs `padding-left: max(4rem, calc((100vw - 1200px)/2 + 4rem))` so text aligns to the same left-edge grid as the rest of the page, regardless of how far the track has translated.

---

## Catalog Compliance Summary

| # | Feature | Status | Score |
|---|---------|--------|-------|
| 1 | Icon-cycling hero (approved replacement for 3D) | Working | 7.5 |
| 2 | All-warm palette threaded through | Compliant | 8.5 |
| 3 | Paint-drop section dividers with motion | Partial | 5.5 |
| 4 | ServicesScrollLock — horizontal scroll | Broken on SE | 6.5 |
| 5 | PaintFlow workflow SVG animation | Working | 7.0 |
| 6 | LiveEstimate auto-typing | Working | 7.5 |
| 7 | Process auto-advance timeline | Working | 7.0 |
| 8 | 3-layer text glow | Partial | 6.5 |
| 9 | CSS scroll-reveals | BLOCKER — 35 stuck | 2.5 |
| 10 | WhySoley tilt cards | Unverifiable (hidden) | 6.5 |
| 11 | Social text link in footer | Intentional placeholder | 7.5 |
| 12 | Constant-velocity icon cycle | Compliant | 8.0 |

**Overall: 7.0 / 10**
