# AUDIT.md — Soley Painting
**Auditor:** Nigel  
**Cycle:** Post-Spark Frame B (commits b46fa24 / 8802038 / b10a171)  
**Axis:** scroll-experience  
**Date:** 2026-05-07  
**Live URL:** https://soley-painting.vercel.app  
**Viewports tested:** 1440x900 desktop, iPhone 13 (390), iPhone SE (375)

---

## Score Summary

| # | Feature | Score | Notes |
|---|---------|-------|-------|
| 1 | Custom branded centerpiece | 0.8 | Sacramento SVG signature reveal is genuinely brand-specific and cinematic. Brush sprite tracks the stroke. Cycling terracotta to teal to gold is on-brand. Dock: brush sprite is tiny at 375px; the reveal canvas shrinks to 340px but the signature barely reads at that size. |
| 2 | Brand palette threaded everywhere | 0.8 | Five palette tokens present and consistent. Cormorant Garamond + DM Sans pairing reads premium. Terracotta CTA, teal links, umber backgrounds all cohesive. Dock: Interior panel accent is chalk on dark umber — visually the swatch square reads as colorless/blank next to the terracotta and teal panels. |
| 3 | Section dividers with motion | 0.7 | Teardrop SVG drops present, traveling pulses visible. Paint-drop color variety is correct. Dock: the hairline rule is barely 1px and essentially invisible; the divider reads more as floating accent than structural separator. |
| 4 | Horizontal scroll-lock | 0.3 | CRITICAL BUG. On desktop 1440 at mid-scroll (3x viewport height), the entire screen renders blank chalk — no dark panel content visible. On iPhone 13 at the same scroll position, identical blank chalk screen. Services panel 01/05 appears at section entry (1x viewport), but the scroll handoff breaks entirely at mid-runway — exactly where a normal user spends most of their scroll time. On iPhone SE, panel 5 (Specialty) content overflows the right edge of the 375px viewport; body text and bullets run past screen width. |
| 5 | Animated workflow diagram | 0.6 | PaintFlow is present and node labels visible in desktop screenshot. SVG draw-in and animateMotion dots are coded. Dock: section renders on chalk background and is visually flat. Dot animation and node pulses are too subtle to distinguish from a static diagram at a glance. |
| 6 | Live conversational sequence | 0.6 | LiveEstimate component exists in codebase. Not visible in any viewport screenshot — unclear if it is rendered in page.tsx flow or buried between sections. Code inspection confirms proper auto-typing logic and sent-state animation. Dock: catalog item presence on the live page is unconfirmed. |
| 7 | Auto-advancing horizontal timeline | 0.8 | Process component has character-stagger titles, word-stagger descriptions, bullet pop animations, 10s countdown bar, and IntersectionObserver gating. All five steps present with interactive tab nav. Dock: countdown bar is 2px — extremely thin and missable. Mobile tab row wraps to flex-wrap losing the left-border active indicator. |
| 8 | Premium 3-layer text glow | 0.7 | .glow-hero (1px white core + 10px terracotta mid + 28px teal ambient) and .glow-sub correctly applied to hero headline and tagline. Dock: service panel titles — large uppercase INTERIOR / EXTERIOR / COMMERCIAL etc — have zero glow. Plain chalk on dark panels reads flat by comparison to the hero. |
| 9 | CSS scroll reveals | 0.8 | .scroll-reveal ships hidden in SSR HTML, IntersectionObserver adds .in-view. Pattern is correct and applied to section headings. Dock: WhySoley tilt cards use Framer Motion useSpring which may cause SSR flash on initial load for those elements. |
| 10 | Custom feature cards with hover/depth | 0.6 | WhySoley 4-card grid uses useSpring rotateX/Y tilt on mousemove. Mobile accordion coded. Dock: cards are bordered chalk on chalk with only a left-border accent — no gradient background, no icon background depth. The tilt mechanic is invisible to a buyer scanning at 90 seconds; the card surface itself needs visual richness to communicate quality before any hover interaction. |
| 11 | Social as text link in bottom bar | 0.3 | Footer bottom bar shows "SOCIAL CHANNELS COMING SOON..." instead of the catalog-spec "INSTAGRAM" wide-tracked text link. Even pre-launch the spec calls for the text link with an honest placeholder — not a coming-soon suffix. |
| 12 | Constant-speed centerpiece | 0.8 | SVG stroke-dashoffset uses linear easing — constant velocity. 3-color phase machine is clean. Brush tracks leading edge via rAF loop. Dock: ~400ms font-load delay leaves the chalk canvas visibly blank before the sequence starts, which can read as broken on fast connections. |

---

## Decimal Total

| Metric | Value |
|--------|-------|
| Sum of 12 items | 7.9 / 12.0 |
| **Weighted decimal score** | **6.6** |

Pre-launch cap applies (no real photography, no real reviews, no real address, no real service area, no real Instagram handle). Cap: 7.5.

**Final score: 6.6 / 10**

---

## Critical Issues Found

### Issue A — ServicesScrollLock blank mid-scroll (BLOCKER)
The horizontal scroll-lock renders a blank chalk screen on both desktop 1440 and iPhone 13 when scrolled to mid-runway (3x viewport height). Panel 01/05 appears at section entry, but the scroll mapping breaks in the middle. The blank is chalk-colored — the sticky container is likely exiting early or `scrollYProgress` offset calculation misfires once the section travels past the first viewport. This is the site's signature experience and it is broken at exactly the position a normal user reaches.

Root cause hypothesis: `useScroll({ target: containerRef, offset: ['start start', 'end end'] })` should track correctly when `containerRef` is on the 500vh `<section>`. But if the hero's new single-column layout changed the document scroll height vs the previous 2-col grid, the scroll range may have shifted. Verify with `scrollYProgress.onChange(v => console.log(v))` at mid-scroll.

### Issue B — iPhone SE content overflow in scroll panels
At 375px, panel content uses `padding: '0 3rem'` (96px total) leaving 279px usable width inside a 375px panel. Body text wraps and overflows the fixed-height panel. Fix: reduce panel padding to `clamp(1rem, 4vw, 3rem)` on viewports under 640px.

### Issue C — Contact section left column void (desktop)
The footer screenshot shows the contact form right column but the left half of the desktop viewport is a large pale void. The left column's contact info, promise copy, or "why call us" block appears to have failed its scroll-reveal trigger or is not rendering.

### Issue D — Navbar logo line-wrap on iPhone SE
On iPhone SE (375px), "Soley / Painting" wraps to two stacked lines while the CTA button inflates. Force `white-space: nowrap` on the logo container.

### Issue E — LiveEstimate not confirmed on live page
No screenshot from any viewport captured the LiveEstimate section. Verify it is imported and rendered in page.tsx, and take a full-page screenshot to confirm its scroll position.

---

## Top 5 Priorities for Next Cycle

**Priority 1 — Fix ServicesScrollLock blank mid-scroll (BLOCKER)**
Debug `scrollYProgress.onChange` to confirm the progress value is non-zero at section mid-point. If `scrollYProgress` reads 0 or 1 when it should read ~0.5, the `containerRef` attachment or the offset config is wrong. Also fix iPhone SE overflow: reduce panel padding from `0 3rem` to `clamp(1rem, 5vw, 3rem)` with no `!important` override needed — just conditional inline style or a CSS media query on `.services-panel-content`.

**Priority 2 — Add visual depth to WhySoley cards**
The 4-card grid is the "why choose us" moment — it needs to land visually before any hover. Add a radial gradient background to each card using the card's accent color at 5% opacity from top-left. Give icon containers a filled tile at 12% accent opacity. The left-border accent alone is too subtle for a buyer scanning on mobile.

**Priority 3 — Fix Contact left column**
Audit what is in the left column of the Contact section. If it has a scroll-reveal class and the IntersectionObserver is not firing (because the section enters above a threshold), change its trigger threshold from `0.3` to `0.1` or remove the scroll-reveal from the left column heading entirely and let it render visible on load.

**Priority 4 — Confirm LiveEstimate placement in page flow**
Check page.tsx imports and render order. If LiveEstimate is missing from the rendered page, re-add it between WhySoley and Process. Take a full-page Playwright screenshot to confirm its presence at the right scroll depth.

**Priority 5 — Navbar logo fix + panel title glow**
Add `white-space: nowrap` to the navbar logo container. Add a single-layer text glow to service panel titles: `text-shadow: 0 0 24px rgba(245,240,234,0.15)` — barely perceptible but adds depth against the dark panel backgrounds. Replace "SOCIAL CHANNELS COMING SOON..." in the footer bottom bar with "INSTAGRAM" as a wide-tracked text link (even if href="#" pre-launch).

---

## Regression vs Previous Cycle

**Previous score: 6.9 (content-depth axis)**

The Sacramento SVG signature reveal is a genuine improvement over the CanvasTexture figure-8 and the Bezier path brush from the prior two Spark commits. It is more legible, more brand-specific (a painter's signature), and cleaner to maintain. The hero centerpiece itself improved.

The score regressed from 6.9 to 6.6 for one primary reason: the ServicesScrollLock blank mid-scroll bug. This is likely a side effect of the hero's document-flow change (from a full-bleed 2-col grid to a centered single-column layout with different scroll height), which shifted the `containerRef` offset calculations for the scroll-lock section. The hero commit changed the page scroll architecture without recalibrating the downstream scroll-lock.

Secondary regression: catalog #11 (social text link in bottom bar) remains at 0.3 from the previous cycle with no improvement.

---

*Nigel audit complete. Score: 6.6. Axis: scroll-experience. Top issue: ServicesScrollLock blank mid-scroll breaks the site's signature section at the exact position users reach.*
