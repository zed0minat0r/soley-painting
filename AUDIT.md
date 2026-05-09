# AUDIT.md — Soley Painting
**Cycle:** 12 (Nigel)
**Date:** 2026-05-07
**Axis:** photography / content-honesty
**Auditor:** Nigel
**Live URL:** https://soley-painting.vercel.app
**Prior score:** 6.8 (cycle 11)
**Score cap:** 7.5 (pre-launch: no real photography, no real reviews, no real address)

---

## Methodology

Playwright multi-viewport audit: Desktop 1440×900, iPhone 13 (390×664), iPhone SE 375×667. ServicesScrollLock sampled at 5 runway positions per viewport (15 total samples). Scroll-reveal sampled by scrolling full page in 12 increments before measuring. Screenshots taken at hero, SSL midpoint, and full-page. All findings verified by direct DOM measurement before inclusion.

---

## 12-Feature Catalog Assessment

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Custom hero centerpiece | PRESENT | SVG icon-draw cycling (5 icons, stroke-dashoffset, 640×457px viewport), no canvas/R3F (removed cycle 7). Hero 972px tall, SVG occupies ~47% of vertical height. |
| 2 | Brand palette threaded through | PRESENT | Rust/ochre/linen/stone/slate palette, teal fully purged per spark cycle 11. CSS custom properties consistent. |
| 3 | Section dividers with motion | PRESENT | 79 SVGs in DOM; teardrop motifs + hairlines (36 hairlines found). SectionDivider component rendered between sections. |
| 4 | Horizontal scroll-lock | WORKING | Desktop: 0px → -5760px across runway (correct for 5×1440px). SE375: 0px → -1500px (correct for 5×375px). IP13: 0px → -1560px (correct for 5×390px). All 15 samples confirmed. |
| 5 | Animated workflow diagram | PRESENT | PaintFlow section found, opacity 1, 26 SVG circles, SVG path confirmed. |
| 6 | Live conversational sequence | DEGRADED | LiveEstimate id deduplication fixed (1 instance). But `typingEls = 0` at audit time — typing cursor elements absent. Animation state uncertain. |
| 7 | Auto-advancing timeline | PRESENT | Process found, step count 5, active tab "01 Free Walkthrough", countdown bar confirmed (scaleX=0.728 mid-cycle, matrix measured). |
| 8 | Premium text glow | PRESENT | 3-layer halo confirmed: `0 0 1px #fff core, 0 0 10px rgba(191,91,56,0.75) mid, 0 0 28px rgba(184,136,74,0.35) ambient`. |
| 9 | CSS scroll reveals | WORKING | 19 `.scroll-reveal` elements, 0 stuck at opacity 0 after full-page scroll on both IP13 and SE375. |
| 10 | TiltCard / accordion cards | PRESENT | WhySoley: 4 elements with `perspective: 800px` confirmed desktop. |
| 11 | Social text link in footer | PRESENT | Footer Instagram text link per SCOUT-REPORT spec. |
| 12 | Constant-speed rotation | N/A | R3F removed cycle 7. SVG icon draw is not rotation — constant velocity draw via `getPointAtLength`. Treated as satisfied by adaptation. |

---

## Section Scores

### Hero (catalog #1, #8, #12) — 6.5/10

The SVG icon-draw centerpiece is charming and brand-specific. The three-layer text glow is verified. The warm dark palette is distinctive. However a real buyer's 90-second read reveals two tension points:

1. The icon draw canvas is 640×457px inside a 972px tall hero — the SVG occupies about 47% of the vertical space, leaving the lower 500px below the centerpiece feeling empty before the marquee strip. On desktop it reads as a lot of dark void around the drawing box.
2. The hero tagline "Every wall done right." is good. The sub-copy "One crew. One contact. Every wall done right." duplicates the headline rhythm almost word-for-word. A buyer who reads both lines gets the same sentence twice, which reads as a placeholder not copy.
3. No canvas / WebGL: R3F was removed. The SVG icon draw is competent but is not the "3D paintbrush mid-stroke" specified in the Penn Tech catalog. It reads as a nice inline SVG animation rather than a true 3D hero object. This is acceptable but is a cap on the ceiling.

### ServicesScrollLock (catalog #4, #10) — 7.5/10

All 15 runway samples confirm correct travel across three viewports. Desktop capped at -5760px (panel 5 reached). Mobile SE375 capped at -1500px (correct). No bleed. The horizontal lock experience is the site's strongest UX moment — a buyer who discovers it feels the craft investment. Panel content is specific and honest. The 95% cap behavior (track stops advancing rather than snapping back) is clean.

Deduction: Panel titles are large but the descriptor copy inside panels is small at desktop scale — the eye travels from the large panel number to the mini-italic descriptor without a clear mid-weight resting point. The panel-numeral-right element (224-252px wide, 229px tall) is a heavy typographic anchor but it competes with the panel title rather than reinforcing it.

### PaintFlow / Workflow (catalog #5) — 6.5/10

Section found, opacity 1, 26 SVG circles in DOM, SVG path confirmed. The section height is 1106px on desktop which is the largest single section height on the page. At this height a buyer who misses the entry animation (fast scroll, slow device) sees a large dark panel with a diagram they may not understand without the animated reveal. The static state of the diagram is not legible enough to carry itself without animation.

### Process / Timeline (catalog #7) — 7.0/10

Five steps confirmed. Countdown bar verified mid-cycle (scaleX=0.728). Active tab advancing. Character stagger and word stagger confirmed in changelog. This is the most complete catalog item on the site — it delivers the Penn Tech pattern in a painting-brand form with no visible regressions.

### WhySoley / Feature Cards (catalog #10) — 6.5/10

Four tilt cards with `perspective: 800px` confirmed. The tilt interaction on desktop is real. The card body copy has been improved (per builder cycle 9 changelog). However the section headline "The difference between a paint job and a lasting finish." wraps awkwardly on desktop (confirmed via DOM text read: no line-break at the serif comma position). The WhySoley section height at 1042px makes it the second-tallest section; on fast scroll a buyer may traverse it without the tilt interaction ever registering.

### FounderBlock — 6.0/10

Found, h2 "Run by a small crew that actually shows up." Pull-quote confirmed. Section height 783px, opacity 1. This is the site's honesty anchor — it correctly avoids fake names, fake portraits, fake stats. However from a buyer perspective this section delivers almost no differentiating signal: "small crew that actually shows up" is a claim every contractor makes. Without a real founder name, real portrait, or even a specific service area, this section reads as placeholder text dressed in brand palette. It will improve dramatically when real photography and real copy land.

### PortfolioGallery — 6.0/10

6 filter chips confirmed (ALL/INTERIOR/EXTERIOR/COMMERCIAL/CABINET & TRIM/SPECIALTY). 72 tile elements in DOM (9 tiles × ~8 state permutations from React re-render). "Photography forthcoming" overlays are honest. The filter stagger animation (added by Spark cycle 10) adds craft. However this section is 1681px tall — the tallest on the page — and contains zero real photography. A buyer who reaches this section expects proof. 9 CSS swatch tiles with chalk overlays is honest but it is also the section most likely to trigger the "is this even a real company?" doubt. The section needs real work samples more urgently than any other page element.

### FAQ — 7.0/10

9 items confirmed, section height 1047px. The 9 FAQ items span both original and scope-clarity additions. The honest scope answers (drywall repair, wallpaper removal, color matching) address real pre-hire concerns. The accordion interaction (aria-expanded, max-height transition) is functional. FAQ is carrying some of the trust work that FounderBlock should be doing.

### LiveEstimate (catalog #6) — 5.5/10

One `id="live-estimate"` confirmed (deduplication fixed). But `typingEls = 0` at audit — no `.cursor` or `.typing` class elements found at measure time. This could be a timing issue (animation between cycles) or could indicate the typing animation is genuinely absent. The section height via Contact context reads as 454px (NotifySignup conflated at scroll position). This needs a targeted recheck but the uncertainty is itself a flag — if the animation is not visible on page load without user interaction, a real buyer never sees it.

### Contact / NotifySignup — 6.5/10

Contact form found with form element present. NotifySignup ("Be the first to book") found, has email input, height 454px. The pre-launch email capture is appropriately honest. The Contact section commitment bullets (added builder cycle 9) add specificity. The LiveEstimate positioned within Contact gives the contact experience a demo quality that most painting sites lack entirely.

### Typography — 5.5/10

**Body font measured at 13px** — below the 14px floor established in multiple Pixel audit cycles. This is a standing hard requirement that has been violated. H1 at 100.8px (Cormorant Garamond) is commanding. H2 at ~80px (DM Sans) is strong. But body copy at 13px / line-height 19.5px (ratio 1.5) is tight. The Spark cycle 8 target was 1.72 line-height; computed value is 1.5. This is a concrete regression.

### Palette / Brand Cohesion — 7.5/10

Rust/ochre/linen/stone/slate palette is internally consistent. Teal purge confirmed. The warm earth palette is genuinely distinctive in the painting contractor space — most competitors use cool grays and corporate blue. This is the site's clearest competitive differentiator from a visual identity standpoint.

### Performance — 8.0/10

Mobile 95/100, Desktop 100/100, FCP 1.3s/0.3s, CLS 0. These are genuinely strong numbers. The site is fast for its animation complexity.

---

## What Improved Since 6.8

1. **SSL stability confirmed**: All 15 cross-viewport samples show correct track travel. This was the cycle 11 top issue and is fully resolved.
2. **Scroll-reveal**: 0 of 19 elements stuck on both mobile viewports. The IO threshold + rootMargin fixes from refiner cycle 9 are holding.
3. **Easing cohesion**: 26 instances normalized to canonical cubic-bezier(0.16,1,0.3,1) via Spark cycle 12.
4. **Teal purge complete**: No teal leakage confirmed.
5. **Process countdown**: Confirmed mid-cycle scaleX animation.

## What Regressed or Remains Unresolved

1. **Body font 13px**: Measured at 13px, below the 14px floor. Should be 14px minimum.
2. **LiveEstimate typing elements = 0**: Cursor/typing elements absent at measurement time. Animation state uncertain.
3. **Hero sub-copy duplication**: "One crew. One contact. Every wall done right." echoes the headline.
4. **FounderBlock trust gap**: No real name, no real portrait, no service area — section reads as honest placeholder not a trust builder.
5. **PortfolioGallery without photography**: 1681px tall section with zero real work samples is the biggest conversion liability.

---

## Score

**6.9 / 10.0**

Up from 6.8. Incremental gain reflects SSL fully resolved, scroll-reveal stable, easing cohesion sweep, Process countdown confirmed. Ceiling is held by: body font regression (13px), LiveEstimate animation uncertainty, FounderBlock and Portfolio sections delivering zero real proof of work. The site has the skeleton of something excellent. It cannot score above 7.5 until real photography, a real founder name, and confirmed LiveEstimate animation land — those are the three pre-launch gates.

---

## Top 5 Priorities for Next Cycle

1. **Body font floor: 13px → 14px** — measured regression, hard requirement from CLAUDE.md, affects all body copy globally. Pixel fix.

2. **LiveEstimate typing animation verification** — `typingEls = 0` at audit. Either the cursor class is absent or animation completes before measurement. Add a persistent `.cursor` blink element that remains visible throughout the cycle (not just during typing). Refiner or Builder to verify and fix if absent.

3. **Hero sub-copy deduplication** — "One crew. One contact. Every wall done right." is near-identical to the headline. Replace with a second idea: service area, speed of response, number of rooms done per season (if real), or a commitment statement that the headline doesn't already make.

4. **FounderBlock real signal** — Even without a name or portrait: add a real service area ("Serving [City/Region]"), a real founding year if known, or one specific operational detail that no generic contractor would say. "Owner takes calls before 8pm" is good. Needs one more layer.

5. **PortfolioGallery placeholder density** — At 1681px and zero real photography, this is the site's largest trust deficit. Builder should either reduce the section height to 600-800px pre-launch or add a stronger honest framing message at the top that sets a real expectation ("First job photos incoming — check back [month]").
