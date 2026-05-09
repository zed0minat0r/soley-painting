# AUDIT.md — Soley Painting
**Cycle:** 6 (Nigel)
**Date:** 2026-05-07
**Axis:** typography-rhythm
**Auditor:** Nigel
**Live:** https://soley-painting.vercel.app
**Cap:** 7.5 pre-launch (no real photography, no real reviews, no real address)

---

## Scoring rubric
5.0 = average / 6.0 = generic / 7.0 = better than most / 8.0 = I would choose this over competitors / 9.0+ = exceptional

Scored from a real buyer's 90-second perspective across desktop 1440, iPhone 13 (390), iPhone SE (375).
Playwright verification: 5 runway positions × 3 viewports = 15 samples.

---

## 12-Feature Catalog Scores

| # | Feature | Present | Score | Notes |
|---|---------|---------|-------|-------|
| 1 | 3D / WebGL hero centerpiece | SVG signature reveal (approved equivalent) | 7.0 | SVG Soley script draw-in works cleanly on all viewports. Headless draws correctly. The hero section is compact and legible. Missing the depth/drama of a true R3F object — the signature box has flat presence, surrounded by too much dead brown space above the fold on desktop. Drop-cloth SVG corner and drip motifs visible but tiny and unreadable at thumbnail scale. |
| 2 | Brand palette threaded through | Yes | 7.5 | Terracotta / umber / teal / clay-gold system is coherent. Accent bars on services panels rotate palette correctly. Nav paint-stroke underline lands. Panel numerals carry terracotta. Consistent. |
| 3 | Section dividers with motion | Yes | 7.0 | Three teardrops + dual hairlines present. Gloss highlights and traveling pulses are visible on desktop. On mobile SE375 the divider renders as a thin 1px line — the teardrops are not visible at that width. Motion is subtle but present on desktop. |
| 4 | Horizontal scroll-lock | Yes — broken on mobile | 5.5 | CONFIRMED BLOCKER: double-panel bleed active on iPhone 13 AND iPhone SE at 5% runway. Two full panels (INTERIOR + EXTERIOR) are simultaneously visible — content clips at right edge. The JS runwway*0.9 fix from Refiner d26d04b resolves maxShift timing on desktop (panel 5 correctly settled by 90% runway) but the panel *width* on mobile is still wrong. Desktop 1440 scrolls correctly through all 5 panels. Panel label says "COMMERCIAL" while heading reads "CABINET & TRIM" — label/data mismatch detected at 50% desktop. |
| 5 | Animated workflow diagram | Yes — PaintFlow | 6.5 | The SVG dot-travel animation with ghost trail, splatter burst on node arrival, and per-node swatch tiles is technically impressive. HOWEVER: on desktop at correct scroll position the diagram section is sandwiched between two thick dark-umber bands with blank chalk gaps — the layout reads as fragmented (3 visible stripes). The node labels (WALL, PREP, PRIME, PAINT, FINISH) are barely visible at bottom, extremely small. Real user will not understand what this section communicates in 5 seconds. |
| 6 | Live conversational sequence | Yes — LiveEstimate | 7.5 | Two-column editorial layout works. Typing animation starts immediately (PROJECT TYPE field typing "Interior — 3"). Fixed-height card prevents layout jump. Commitment bullets are honest and specific. Copy "A written quote — no ballpark ranges" is sharp. This section earned its improvement this cycle. |
| 7 | Auto-advancing timeline | Yes — Process | 7.0 | Five-step horizontal timeline with auto-advance and countdown bar visible. "HOW WE WORK / Five steps. Zero surprises." headline is strong. Tab list + detail panel layout reads cleanly on desktop. Step content (Free Walkthrough bullets) is specific and honest. PaintFlow SVG diagram sits below this and appears connected — slightly confusing section boundary. |
| 8 | Premium text glow effects | Partial | 6.0 | Hero H1 "Every wall done right." has the italic "done right" in terracotta — but no visible 3-layer halo treatment. The section eyebrows (SOLEY PAINTING, HOW WE WORK) are small tracked text, no glow. WhySoley headline has no glow. The 3-layer halo catalog spec is largely absent — this reads as polished Tailwind typography, not premium glow treatment. |
| 9 | CSS scroll reveals | Yes | 7.0 | Scroll-reveal pattern confirmed working (IO + .in-view class toggle). WhySoley cards stagger-reveal on scroll. FounderBlock reveals. No SSR hydration flash detected in headless testing. |
| 10 | Custom feature cards with hover/depth | Partial | 6.0 | WhySoley four cards are present with clean content (rewritten bodies: two-coat primer, confirmed arrival window, line-for-line invoice, low-VOC standard). Mobile accordion is functional. BUT: cards are flat — no mousemove tilt, no gradient shift on hover. They read as styled divs with borders, not interactive depth objects. PortfolioGallery tiles are also flat. |
| 11 | Single-channel social as text link | Yes | 7.5 | "SOCIAL CHANNELS COMING SOON..." in bottom bar — honest pre-launch framing per RULE 7. Correct catalog pattern. |
| 12 | Constant-speed / perception integrity | N/A — no R3F | 7.0 | No R3F object so no drift issue. PaintFlow dot travels at constant velocity (no sin/lerp confirmed by Spark commit). SectionDivider hairlines travel at constant speed. Marquee scrolls at constant pace. No fake-perception drift detected. |

---

## Typography Rhythm Assessment (this cycle's axis)

Spark's cycle 5 Frame B work measurably improved rhythm: eyebrow 0.75rem/0.3em tracking, body 1rem/1.72 line-height, section padding 7rem unified. The improvements are felt:

**What landed:**
- Body text is noticeably more breathable — 1.72 line-height on paragraph blocks gives the WhySoley cards and FounderBlock copy room to read without cramping.
- Eyebrow labels (THE PROCESS, SOLEY PAINTING, HOW WE WORK) are consistent in size and tracking across sections.
- Section-to-section vertical rhythm is smoother — padding feels deliberate rather than ad hoc.
- The paint-stroke nav underline (scaleX 0→1 on hover) is a genuine micro-interaction upgrade over the bare color hover.

**What still needs work:**
- Hero sub-headline below the signature box ("One crew. One contact. Every wall done right.") is too small relative to the H1. Real user misses it.
- LiveEstimate form label typography (PROJECT TYPE, PROPERTY ADDRESS) is very small — at 1440 it reads as fine-print, not confident form UX.
- Process section eyebrow "HOW WE WORK" sits above the H2 with no visual separation from the above divider — the transition from chalk panel to dark panel is abrupt.
- PaintFlow node labels (WALL / PREP / PRIME / PAINT / FINISH) are rendered at a size that requires squinting even at desktop — they are below 11px equivalent.

---

## Section-by-Section Impressions (buyer lens)

**Hero:** Strong headline, clean SVG signature. The brown space above the fold on desktop is substantial — real buyer's first scroll impulse is "what is below the fold?" The three trust chips (Free consultation / Low-VOC / Single point of contact) at bottom are a smart addition. MOBILE: Hero renders cleanly on SE375 — headline + signature + CTAs all above fold. Good.

**ServicesScrollLock (desktop):** Panel travel works. The large panel numerals (01, 02, 03...) at full opacity in terracotta are striking — the Refiner accent bar upgrade from last cycle is visible and adds rhythm. Bullet copy is sharp. "Zero-damage surface protection / Low-VOC & zero-VOC formulations on request / Same-day cleanup" reads as real and earned. BLOCKER: Mobile panel bleed is still live.

**PaintFlow:** The dot animation with ghost trail and splatter burst is technically the most ambitious component on the site. But the layout surrounding it — alternating chalk/dark stripe bands with empty gaps — dilutes its impact. A real user arriving at this section on desktop sees a confusing sandwich of colors. The diagram itself is only ~200px tall in a 1100px section. Too much dead space.

**WhySoley:** Best content section. The four rewritten card bodies are specific, honest, and differentiated. "Two-coat primer on bare drywall, sanding between coats" — this is exactly what a homeowner shopping painters wants to read. Mobile accordion works. Hover cards remain flat.

**FounderBlock:** Honest, specific, appropriately modest. "The owner takes calls before 8pm and shows up on day one with the same crew that finishes the job." This earns trust. The placeholder portrait frame is fine pre-launch.

**PortfolioGallery:** Functional. Filter chips work. "Photography forthcoming" overlays are honest. The CSS painted-swatch textures give each tile a distinct color identity. Real buyer will forgive placeholder photos pre-launch if the rest of the site builds trust.

**Process:** Clean auto-advancing timeline. Step content is specific. CountDown bar visible. Minor: when landed at scrollY 10100 the section was partially occluded by PaintFlow bleed — layout boundary is unclear.

**LiveEstimate:** Best improved section this cycle. The editorial two-col layout, typing animation, and honest commitment bullets combine to make this feel like a real premium service offering.

**Contact/Footer:** Contact form is clean. Footer five-column grid is solid on desktop. "Service area coming soon" is honest. Footer bottom bar correct pattern.

---

## Verified: ServicesScrollLock d26d04b Fix

- Desktop 1440: translateX advances correctly. At 50% runway panel 3 (CABINET & TRIM) is fully in frame. At 95% the section exits cleanly. runway*0.9 divisor fix confirmed working.
- iPhone 13 / SE375: Double-panel bleed CONFIRMED ACTIVE at 5% runway. Two panels simultaneously visible. Content clips on right edge. The panel width calculation for mobile is not matching viewport width — this was BUG-025 and remains open despite the d6c2ccf Refiner fix commit message claiming resolution.

---

## Decimal Scores

| Category | Weight | Score |
|----------|--------|-------|
| Catalog features present (12-item) | 40% | 6.6 avg |
| Typography rhythm (this axis) | 20% | 7.0 |
| Mobile UX integrity | 20% | 5.8 |
| Content quality / honesty | 10% | 8.0 |
| Conversion clarity | 10% | 7.2 |

**Weighted total: 6.9**

Applied cap: 7.5 pre-launch. Score is below cap — no capping needed.

**FINAL SCORE: 6.9**

---

## What Improved vs Last Cycle (axis: conversion-friction)

- Typography rhythm measurably smoother (Spark cycle 5 Frame B): body 1.72lh, section padding 7rem unified, eyebrow consistency across 9 components. Felt improvement.
- LiveEstimate section is now genuinely compelling — two-col editorial, concrete example message (bedroom + en-suite 280 sq ft), honest commitment bullets.
- WhySoley card bodies are the strongest written content on the site — specific, earned, differentiated.
- FounderBlock copy sharpened: owner-answers-phone-before-8pm + same-crew operational detail lands well.
- Paint-stroke nav underline is a real micro-interaction upgrade.
- ServicesScrollLock desktop scroll fix confirmed working (runway*0.9).

## What Regressed / Remains Blocked

- ServicesScrollLock mobile double-panel bleed STILL ACTIVE (BUG-025 not fully resolved — desktop fixed, mobile not).
- WhySoley and Portfolio cards remain flat (no mousemove tilt — catalog #10 partial gap).
- Hero 3-layer text glow absent (catalog #8 gap).
- PaintFlow section layout has too much dead space — the diagram impact is diluted by blank chalk band gaps.
- Panel label mislabel detected: side numeral label reads "COMMERCIAL" when panel heading is "CABINET & TRIM" (at 50% runway desktop).

---

## Top 5 Priorities for Next Cycle

1. **[BLOCKER] ServicesScrollLock mobile panel width** — Fix panel width on mobile so each panel fills exactly 1 viewport width. The runway*0.9 fix resolved timing but not panel sizing. At SE375 two panels are simultaneously visible. This is catalog #4 and it affects every mobile user.

2. **[HIGH] Hero text glow + depth** — Add the 3-layer halo to the H1 "Every wall" / "done right." — near-white core + terracotta mid + umber ambient. The hero reads as sophisticated typography but not premium. This is the highest-visibility gap in catalog #8.

3. **[HIGH] PaintFlow dead space** — Collapse the alternating chalk/dark stripe bands around the diagram. The dot animation is strong; the surrounding layout wastes it. The diagram should fill its panel without empty bands boxing it.

4. **[MEDIUM] WhySoley card mousemove tilt** — Add 3D tilt on mousemove (rotateX/Y based on cursor position) to the four WhySoley cards. Mobile accordion already works. Desktop cards are flat — catalog #10 partial gap.

5. **[MEDIUM] Panel label mislabel** — The large foreground numeral label on the ServicesScrollLock left side reads "COMMERCIAL" at the CABINET & TRIM panel position (50% runway desktop). Verify PANELS array order matches the label rotation.
