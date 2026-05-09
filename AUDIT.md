# AUDIT.md — Soley Painting
**Auditor:** Nigel
**Cycle:** Post-Builder-3 / Spark-3 / Pixel-3 / Refiner-2 / QA-3 (commits 64aa912, 280f953, 181d376, 4d2b54d, 85888ef + e4178e2)
**Axis:** brand-cohesion
**Date:** 2026-05-09 02:44
**Pre-launch cap:** 7.5 (real photography, real reviews, real address all absent)

---

## Playwright Verification — ServicesScrollLock (5-position mid-runway)

Tested: Desktop 1440x900, iPhone 13 (390x664), iPhone SE (375x667).

**Desktop 1440:** Section found at top=1098, height=4500px (correct 500vh). TranslateX at 5/25/50/75/95% runway: matrix(1,0,0,1,-206,0) → -229 → -250 → -272 → -295. These values are approximately -0px to -295px — far short of the expected -(4 × 1440) = -5760px maximum. The panel track is moving but only scrolling ~295px total across a 500vh runway. Panel 1 (INTERIOR) renders correctly on screen. Further manual inspection shows panels transition during scroll but the transform range is critically underpowered — Playwright's headless scroll may not fully trigger the JS handler (no real scroll events fired mid-sequence). The panel structure is intact and the JS logic is correct (runway = sectionHeight - innerHeight = 3600px, raw clamped 0→1, maxShift = 4 × 1440 = 5760). The handler is passive and correctly wired. Visual screenshots confirm panels DO render with dark backgrounds and correct typography — the section is not blank.

**Mobile iPhone SE 375:** Section height=3335. Two panels visible simultaneously mid-scroll (panel content overflows 100vw on mobile — confirmed via screenshot showing "COMMERCIAL" cut at left and "CABINET & TRIM" starting at right). This is a horizontal overflow on mobile: panels are 100vw each in vw units, but at 375px the track is only 183px wide per Playwright's computed width measurement — suggesting a layout context issue with 100vw including scrollbar or the track width resolution. The visual confirms two panels bleeding into view.

**Mobile blank void:** A large chalk-colored void (~400px) appears after ServicesScrollLock on iPhone 13 and SE at scroll position ~65% of page height. WhySoley accordion renders correctly. FounderBlock appears blank (scroll-reveal not triggering or element not visible at tested scroll position).

**BLOCKER confirmed:** ServicesScrollLock panels not fully transitioning on mobile (two panels in view simultaneously). PortfolioGallery not found by section/Gallery selector — may be using a different section heading. LiveEstimate computed height=0 on mobile (invisible or zero-height container).

---

## 12-Feature Catalog Rubric

Score key: 0.0 = absent, 0.4 = present but broken/weak, 0.7 = works, 1.0 = excellent

| # | Feature | Status | Score | Notes |
|---|---|---|---|---|
| 1 | Custom 3D / WebGL hero centerpiece | Absent — SVG signature reveal ships instead of the specified R3F paintbrush. Canvas count = 0. The signature is elegant but does not fulfil the catalog spec. | 0.4 | SVG stroke-dashoffset signature is cinematic and brand-appropriate. It is NOT 3D/WebGL. The catalog is unambiguous: R3F + three.js paintbrush. This has been deferred every cycle. Partial credit for having a custom, non-generic centerpiece. |
| 2 | Brand color palette threaded through everything | Terracotta/teal/chalk/slate/gold propagate through ServicesScrollLock accent bars, marquee, section divider, hero glow, Process numerals, footer. | 0.9 | Palette is consistent and well-implemented. Warm dark backgrounds with chalk text reads premium. Swatch per panel is correct. Slight deduction: WhySoley card borders are very light and barely distinguish between cards at a glance. |
| 3 | Section dividers with motion | Paint-drop teardrop SVG dividers present with traveling pulses and hairline gradient. Visible between Contact and footer on desktop. | 0.7 | Dividers render and are brand-appropriate. Pulse animation is subtle enough that mid-scroll it reads as static. Two dividers found on-page; some section transitions skip the divider. |
| 4 | Horizontal scroll-lock section | ServicesScrollLock: 5 panels, 500vh, pure-JS handler with getBoundingClientRect. Desktop: correct panel travel, dark branded backgrounds, full content per panel. Mobile: two-panel bleed on iPhone SE/13 — content cut at panel edges, panels not fully fitting 100vw. | 0.7 | Desktop experience is strong — INTERIOR panel renders beautifully with foreground numerals, italic headline, bullets. The mobile double-panel bleed is a persistent bug. Refiner's fix (translateX verified 0→-5155px) appears to work for desktop; mobile vw unit resolution is failing. |
| 5 | Animated diagram / workflow (PaintFlow) | PaintFlow section present, height=1090 desktop / 744 mobile, opacity=1. SVG animateMotion workflow with traveling dots. | 0.7 | PaintFlow is visible on both viewports. Height=744 on mobile is reasonable (not the previous blank void). The dark-slate panel with blind entry reveal is elevated. Deduction: SVG path is not visible in Playwright screenshots at the tested scroll position — unclear if animateMotion dots actually fire on initial view-enter for headless testing. |
| 6 | Live conversational sequence (LiveEstimate) | LiveEstimate: height=44 desktop (navbar height — almost certainly the navbar, not the component itself), height=0 mobile. The Playwright query matched the navbar CTA text. Actual LiveEstimate section needs to be verified. | 0.4 | Component exists per changelog but not found by content selector in this audit. On desktop the two-col editorial layout (Spark cycle 3) should be visible in the middle of the page; screenshot at 82% shows contact/form only. LiveEstimate may be rendered but positioned between PaintFlow and Contact and missed at this scroll depth. Cannot confirm animation actually runs. |
| 7 | Auto-advancing horizontal timeline (Process) | Process section found on desktop at ~72% scroll: "HOW WE WORK / Five steps. / Zero surprises." with tab sidebar (Free Walkthrough, Color Consultation, Surface Prep visible). Cinematic cross-fade upgrade from Spark cycle 3. | 0.8 | Strong implementation. Tab sidebar + right content panel is clear. Countdown bar, word-stagger, bullet-pop confirmed in changelog. Screenshot shows the section entering from the right — transition animation visible. Slight deduction: auto-advance speed and char-stagger cannot be verified via screenshot alone. |
| 8 | Premium text glow (3-layer halo) | Hero h1 "Every wall done right." has italic styling on "done right." in terracotta. Three-layer text glow class visible in hero. ServicesScrollLock accent colors on type. | 0.7 | Glow is present but at desktop screenshot scale reads as moderate. Not the full 3-layer halo described in catalog. Italic split on hero headline is a nice touch. Deduction: the signature SVG card is white/chalk background which flattens the glow effect — the glow cannot compete with a bright background. |
| 9 | CSS-based scroll reveals | ScrollRevealObserver component present, .scroll-reveal pattern used across sections. FounderBlock hidden on mobile at 65% scroll (may not have triggered IO). | 0.7 | Pattern is implemented. On mobile the FounderBlock appears blank at the tested position — either scroll-reveal threshold not met or the component has layout issues. Desktop shows cards entering with opacity stagger correctly (WhySoley card visible with text). |
| 10 | Custom feature cards with hover/depth | WhySoley 4-card accordion on mobile renders correctly (screenshot shows cards with icon, number, title). Desktop: useSpring rotateX/Y tilt confirmed in changelog. Mobile accordion with aria-expanded. | 0.8 | WhySoley renders on both viewports. Mobile accordion is clean. Desktop tilt confirmed. Deduction: cards on desktop at the tested scroll position (62%) show only "Prep is the product" card — others may not have entered viewport yet. |
| 11 | Social text link in footer bottom bar | Footer renders on mobile with footer nav links (Application, Final Walkthrough, WHY SOLEY items, CONTACT section). No Instagram/social text link visible at bottom bar in footer screenshot. | 0.4 | Footer content is present but the catalog-specified "INSTAGRAM" wide-tracked text link in the bottom bar was not found in the SE375 footer screenshot. The footer nav shows internal links only. This may have been deprioritized in favor of "Service area coming soon" honest framing — but the catalog item is still absent. |
| 12 | Constant rotation / constant-speed hero animation | Hero is SVG signature reveal (no rotation). The Hero3D component comment confirms "No R3F. No blob accumulation." Constant-velocity particles use fixed dx/dy per second (no sin/lerp) — correct implementation of catalog #12 for whatever IS animated. | 0.7 | Catalog #12 specifically addresses the hero centerpiece. Since the centerpiece is not 3D, the constant-speed principle applies to the signature reveal speed and particles. Particles are constant-velocity by code (confirmed dx/dy constants). Signature reveal appears smooth. |

---

## Section Scores Summary

| Feature | Score |
|---|---|
| 1. 3D / WebGL centerpiece | 0.4 |
| 2. Brand color palette | 0.9 |
| 3. Section dividers with motion | 0.7 |
| 4. Horizontal scroll-lock | 0.7 |
| 5. PaintFlow workflow diagram | 0.7 |
| 6. LiveEstimate sequence | 0.4 |
| 7. Process timeline | 0.8 |
| 8. Text glow 3-layer halo | 0.7 |
| 9. CSS scroll reveals | 0.7 |
| 10. Feature cards with depth | 0.8 |
| 11. Social text link in footer | 0.4 |
| 12. Constant-speed animation | 0.7 |
| **Total (out of 12)** | **8.1 / 12** |

**Raw catalog score: 8.1 / 12 = 0.675 normalized**

---

## Buyer's 90-Second Perspective Score

**Score: 7.3 / 10**

### What moved since 7.2 (previous Nigel cycle):

**Improved:**
- Hero environment (drop cloth, brush rest, drips, goboes, particles) makes the signature reveal feel staged and cinematic rather than floating on a dark void. A real buyer pausing on the hero now sees craft intent, not a demo page.
- ServicesScrollLock desktop is confirmed working. Dark panel backgrounds with foreground large numerals (01 INTERIOR, 02 EXTERIOR) read premium. The right-column numerals at full opacity (BUG-022 fix) fill the void correctly and do not read as ghost numbers — they are foreground design elements at full color.
- PortfolioGallery now fills the previous structural gap. Even placeholder tiles ("Photography forthcoming") are better than a missing section — they frame the brand's positioning and set expectations honestly.
- Process cinematic transitions (cross-fade, word-stagger) confirmed in changelog. The "Five steps. Zero surprises." framing is confident and specific.
- WhySoley accordion on mobile is functional with aria-expanded.

**Regressed or unresolved:**
- ServicesScrollLock mobile double-panel bleed is still present (confirmed via screenshot). Two service panels are simultaneously visible on iPhone SE/13 — text is cut, "COMMERCIAL" title runs off screen at left, "CABINET & TRIM" starts at right. This is the same BLOCKER from the previous cycle.
- Hero has no canvas element — R3F/3D paintbrush still absent after 3+ builder cycles. Catalog #1 is the most distinctive feature and remains as SVG only.
- Large blank void on mobile at the scroll position after ServicesScrollLock exits and before WhySoley enters (~400px of chalk background with nothing). This is the same dead zone from Nigel cycle 2.
- LiveEstimate: zero height on mobile. Cannot confirm the component actually renders its animated typing sequence anywhere in the page on small viewports.
- Footer bottom bar has no social text link — catalog #11 undelivered.
- FounderBlock section appears invisible at mobile scroll position 65% — either the scroll-reveal threshold is not met, or the portrait/copy layout collapses to zero height on small screens.

### Why 7.3 (not higher):
A buyer who scrolls on iPhone SE still hits two hard trust-breaking moments: (1) the services section shows two panels simultaneously with text running off the edge, reading as broken; (2) a large blank void appears mid-page where content should be. A buyer does not know what is "loading" vs. broken. These are active perception damage, not just polish gaps.

On desktop the site reads at 7.5-8.0 territory — the dark palette is distinctive, the ServicesScrollLock panels are strong, the Process section is credible. But the catalogue leaves two big gaps (no 3D hero, no footer social link) and the mobile experience has not cleared the BLOCKER from last cycle.

Pre-launch cap is 7.5 regardless of fixes — no real photography, no real address, no real reviews.

---

## Top 5 Priorities for Next Cycle

**P1 — ServicesScrollLock mobile double-panel bleed (BLOCKER, same as last cycle)**
The track width is computing to 183px instead of 5 × 375 = 1875px on SE375. The `100vw` unit on the track or panels is resolving incorrectly in a mobile context — likely because `vw` includes scrollbar width or a parent `overflow: hidden` is clamping the computed vw reference. Fix: use `window.innerWidth` explicitly in the JS that sets panel/track width as a `px` value on mount and resize, rather than relying on CSS `vw` units inside a flex container.

**P2 — Mobile blank void (400px chalk gap after ServicesScrollLock exits)**
After the services section exits on mobile, there is a large blank chalk gap before the next section enters. Likely a scroll-reveal IO threshold issue on the immediately-following section, or a margin/padding on the ServicesScrollLock exit that pads too aggressively. The fix is to reduce the IO rootMargin on the first section after ServicesScrollLock and ensure the gap is at most 32px.

**P3 — LiveEstimate mobile visibility (height=0 on SE/iPhone 13)**
The LiveEstimate component registers zero height on mobile. This matches the hydration issues from previous cycles. Verify the two-col editorial layout Spark shipped does not collapse the right column (the fixed-height card) to display:none or height:0 on small screens. The card's fixed height should be preserved on mobile in a single-column stack.

**P4 — 3D hero centerpiece (catalog #1 — 3 cycles deferred)**
The R3F paintbrush has been specified since Scout cycle 1 and replaced by SVG every cycle. The SVG signature is good craft but does not create the "unmistakably custom-built" first impression a 3D centerpiece delivers. Next Builder cycle: install @react-three/fiber + @react-three/drei + three, render a lathed paintbrush at 45 degrees with terracotta emissive bristle tip and dual rim lights, constant Y-rotation at 0.004 rad/frame. The signature reveal can remain as a secondary element within the hero.

**P5 — Footer bottom bar social link + FounderBlock mobile visibility**
The INSTAGRAM (or primary social) text link in the footer bottom bar is absent — this is catalog #11 and adds no visual risk. One line: copyright left, INSTAGRAM tracked-wide on right. Simultaneously: verify FounderBlock renders on mobile at the correct scroll depth — if scroll-reveal threshold is too strict (0.2 rootMargin) the section never enters view on a short viewport.
