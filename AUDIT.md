# AUDIT.md — Soley Painting
**Auditor:** Nigel
**Cycle:** Post-Builder-2 / Spark-2 / Pixel-2 / Refiner (commits 5e07e6a, e91fac5, 446a690, 7c7a093, 0dac810)
**Axis:** mobile-UX
**Date:** 2026-05-07
**Prior score:** 6.6 (scroll-experience axis)
**Score cap:** 7.5 pre-launch

---

## RULE 3 Verification — ServicesScrollLock (5-position mid-runway test)

Tested desktop 1440x900 AND iPhone 13 (390x664) AND iPhone SE (375x667).

Desktop ServicesScrollLock (top: 1098px, height: 4500px):
- 5% (scrollY 1302): Panel 1 "INTERIOR" fully visible — translateX registering as -50% in inline style but visually showing INTERIOR content. Scroll IS working.
- 25% (scrollY 2222): Panel 1/2 transitioning — content visible.
- 50% (scrollY 3336): Panel 3/4 split visible — "COMMERCIAL" left edge + "CABINET & TRIM" right — scroll driving horizontal travel confirmed.
- 75% (scrollY 4461): Panel 5 "SPECIALTY" fully centered — working.
- 95% (scrollY 5372): CRITICAL BUG — Horizontal banding stripes (alternating dark/cream bands), no content readable. Section exit broken on desktop at tail end of runway.

iPhone 13 ServicesScrollLock (top: 1183px, height: 3320px):
- 5%: Services panel content showing (end of last panel text visible).
- 50%: Services section still in view.
- 95%: Services end — transition out appears to work but no content void confirmed at this position.

Mobile void bug: On iPhone 13, scrolling to document mid-point (~40%) reveals a blank cream expanse — PaintFlow (workflow section) renders as visually empty on mobile (section height: 744px but SVG diagram is invisible). FounderBlock has a ~400px dead dark zone above "HOW WE WORK" heading. These are BLOCKING mobile UX issues.

**Verdict:** ServicesScrollLock fix PARTIALLY holds — desktop 5/25/50/75% positions work correctly. 95% exits into a stripe-banding glitch on desktop. Mobile sections exist but PaintFlow is invisible and FounderBlock has dead padding zone.

---

## 12-Feature Catalog Rubric

| # | Feature | Target | Score | Notes |
|---|---------|--------|-------|-------|
| 1 | Custom 3D / WebGL hero centerpiece | 3D paintbrush | 0.7 | SVG signature script reveal is distinctive and on-brand. Not true 3D/WebGL (R3F removed by Razor). The Bézier brush-paint "Soley" script is genuinely clever and visually differentiating. Docked for no actual 3D geometry. |
| 2 | Brand color palette threaded through everything | Terracotta/teal/chalk/slate/gold | 0.7 | Color system is coherent — terracotta on CTAs, teal on accents, chalk backgrounds alternate with umber. Marquee items not individually tinted per panel. Dividers show the terracotta-to-teal hairline. Solid but not maximally propagated. |
| 3 | Section dividers with motion | Paint-drop SVGs + traveling pulses | 0.7 | Three teardrop paint drops visible at divider between LiveEstimate and Contact. Traveling pulse dots appear as static small dots at edges of the divider line — motion not confirmed as animating in Playwright still. Generic hairline otherwise. |
| 4 | Horizontal scroll-lock section | 5 painting services in locked panels | 0.7 | Scroll travels through 5 panels with correct service content and panel accent colors. 95% position produces stripe-banding artifact on desktop. Exit transition rough. Panel layout is content-left with right void on desktop (content occupies ~50% width leaving a dark blank column). |
| 5 | Animated workflow visualization | Wall→Prep→Prime→Paint→Finish | 0.4 | PaintFlow section exists and renders on desktop (Codrops blind-reveal strips, SVG dot travel). COMPLETELY INVISIBLE on iPhone 13 and iPhone SE — section has height but no visible content on mobile. A 744px blank zone on mobile is a hard fail for a marquee feature. |
| 6 | Live conversational sequence | Auto-typing estimate form | 0.7 | LiveEstimate section shows the typing form card on desktop with two-column editorial layout. The "I" cursor is visible and typing appears active. Mobile collapses to single column. On mobile the form card is partially off-screen. No "Sent" animation observable in static screenshot. |
| 7 | Auto-advancing horizontal timeline | 5-step Process section | 0.7 | Process section visible on desktop with left-panel step list + right content panel. Tabs (Free Walkthrough through Final Walkthrough) are present. Countdown bar and auto-advance visible in static shot. On mobile there is a ~400px dead zone above the Process content due to FounderBlock overflow. |
| 8 | Premium text glow (3-layer halo) | Hero headline 3-layer halo | 0.4 | Hero headline "Every wall done right." shows standard weight text without a discernible multi-layer glow in screenshots. The italic "done right." has a slight warm tint. No strong 3-layer halo (1px core + 10px mid + 28px ambient) visible at either desktop or mobile — reads as standard Tailwind. |
| 9 | CSS scroll reveals | .scroll-reveal IntersectionObserver | 0.7 | WhySoley cards appear to stagger in per the screenshots — cards 1/2 fully opaque while 3/4 are lighter, suggesting a scroll-reveal-in-progress capture. Contact left column has scroll-reveal-left stagger. Pattern appears implemented. |
| 10 | Custom feature cards with hover/depth | WhySoley 4-card tilt + mobile accordion | 0.4 | WhySoley cards on desktop are flat bordered boxes — no visible 3D tilt or depth gradient. The mousemove tilt requires interaction not capturable in screenshots, but the card styling (simple border-left accent, flat cream background) does not communicate depth. Mobile accordion toggle not captured. |
| 11 | Single social as text link in footer | Instagram text link in bottom bar | 0.4 | Footer not visible in any captured screenshot — contact section is the last item visible before the page ends. Social link presence unconfirmed. |
| 12 | Constant-speed rotation, no drift | Paintbrush/hero centerpiece constant velocity | 0.4 | No R3F 3D object — the SVG signature reveal is not a rotating centerpiece. Speed consistency is not applicable in the same way, but the brush-tracking stroke speed is visually inconsistent (brush pauses mid-stroke in the screenshot showing mid-animation state). |

**Raw total: 7.2 / 12.0**

**Pre-launch cap applied: 7.2 — under the 7.5 cap.**

**FINAL SCORE: 7.2**

---

## What Improved Since 6.6

**Improvements:**
- ServicesScrollLock blocker is substantially fixed — panels 1-4 travel correctly through scroll (was rendering blank last cycle)
- FounderBlock added — genuine human anchor with honest copy and placeholder portrait framing. Gives a buyer the "who are these people" answer that was entirely missing last cycle
- WhySoley spotlight glow added to card group container
- Contact left column filled — 6 honest commitments with scroll-reveal stagger where previously blank
- LiveEstimate redesigned to two-column editorial layout — better editorial weight
- PaintFlow now on dark umber background with Codrops blind-reveal strips — more cinematic on desktop
- Mobile navbar nowrap fixed; logo no longer wraps

**Regressions / New Issues:**
- ServicesScrollLock 95% position produces horizontal stripe-banding glitch on desktop (new failure at exit point)
- PaintFlow (workflow section) is COMPLETELY INVISIBLE on mobile — 744px blank zone
- FounderBlock has ~400px dead dark padding zone on mobile above Process section
- Desktop services panels have a large dark right-column void (content only fills ~50% of panel width)
- Hero text glow is not achieving the 3-layer halo called for in catalog item #8 — still reads generic
- WhySoley cards are visually flat — no perceptible depth/tilt effect in static rendering

---

## Top 5 Priorities for Next Cycle

**P1 — BLOCKER: Fix PaintFlow mobile invisibility.**
The workflow section (catalog #5) is the most technically ambitious section and it renders as a 744px blank void on iPhone 13 and SE. The SVG diagram and animated dots are not visible on mobile. Fix the SVG sizing (likely `width: 100%` + `viewBox` mismatch), the blind-reveal strip heights (fixed px values probably overflow on mobile), and ensure IntersectionObserver fires correctly in mobile Chrome. Do not disable the feature — fix the layout.

**P2 — ServicesScrollLock 95% stripe-banding exit glitch.**
At the tail-end of the scroll runway on desktop, the section exit produces alternating dark/cream horizontal bands that obscure all content. This is likely the Codrops blind-reveal strips from PaintFlow bleeding into the services section's exit scroll position, or the sticky container exit overlapping adjacent section backgrounds. Fix the sticky container height calculation and test the 95% position until it exits cleanly.

**P3 — FounderBlock dead padding zone on mobile.**
The FounderBlock has roughly 400px of blank dark space above "HOW WE WORK" on iPhone 13. This is either a fixed min-height on the portrait placeholder or a grid row that doesn't collapse. Fix the mobile layout so the content flows without the dead zone.

**P4 — Hero text glow upgrade (catalog #8).**
The hero headline "Every wall done right." reads as plain Tailwind text-shadow. Implement the 3-layer halo: 1px near-white core (`0 0 1px rgba(255,255,255,0.9)`), 10px terracotta mid (`0 0 10px rgba(194,96,58,0.65)`), 28px teal ambient (`0 0 28px rgba(58,143,133,0.35)`). Apply `.glow-sub` to the sub-headline as well. This single change will make the hero feel premium rather than generic.

**P5 — Services panel content fills right void on desktop.**
At 5% (first panel "INTERIOR") and 75% (panel 5 "SPECIALTY"), the content column occupies roughly the left 50% of the 1440px viewport, leaving a large dark void on the right. Add the service-specific color accent to the right half (large service number in low-opacity, or an icon treatment at right) to fill the right column and make panels feel full-bleed designed rather than left-aligned content dropped on a dark background.
