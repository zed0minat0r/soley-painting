# AUDIT.md — Soley Painting
**Cycle:** 8 (Nigel)
**Date:** 2026-05-07
**Axis:** conversion-friction
**Auditor:** Nigel
**Live URL:** https://soley-painting.vercel.app

---

## ServicesScrollLock Fix Verification (BUG-039 / Refiner 0316c52)

Tested with REAL deterministic scroll via `window.scrollTo(0, Y)` + 250ms settle. Five positions sampled on all three viewports.

**Desktop 1440:**
- 5%: translateX(0px) — clean entry, no dead zone detected
- 25%: translateX(-1145px) — advancing correctly
- 50%: translateX(-2629px) — midpoint correct
- 75%: translateX(-4590px) — advancing into panels 4–5
- 95%: translateX(-5760px) — max shift reached cleanly (5 panels x 1440px = 7200px total width, max shift = 5760px = panels 2–5 visible through)

**iPhone 13 (390px):**
- Panel width = 390px, track width = 1950px (5 x 390px)
- 5%: 0px — 25%: -329px — 50%: -928px — 75%: -1502px — 95%: -1560px (max = 4 x 390px)
- ADVANCING correctly.

**SE375 (375px):**
- Panel width = 375px, max shift = -1500px (4 x 375px)
- 5%: 0px — 25%: -289px — 50%: -868px — 75%: -1443px — 95%: -1500px
- ADVANCING correctly.

**VERDICT: JS handler is WORKING on all three viewports.** The BUG-039 entry dead zone fix from 0316c52 is confirmed. However, a visual BLOCKER remains:

**BUG-025 STILL OPEN (visual):** On SE375 at 75–95% of the runway, the panel title overflow is clipping mid-word ("CABINET & TRIM" visible with "SP" of Specialty bleeding in from the right edge). The translateX math is correct but panel content overflows its 375px container — the panel title itself is wider than the viewport, creating a visual double-panel impression even though only one panel is positioned in view. This is a CSS overflow/width containment issue on the individual panel divs, not the JS handler.

---

## 12-Feature Catalog Score

| # | Catalog Item | Status | Notes |
|---|---|---|---|
| 1 | Custom 3D / WebGL hero centerpiece | PARTIAL | SVG signature reveal (Sacramento font stroke-dashoffset) in place of R3F — user-approved per Catalog note. Signature reveal IS the approved equivalent. Canvas absent. SVG occupies full hero height (971px). Quality: present but low visual drama — chalk box on umber bg reads flat. |
| 2 | Brand palette threaded through everything | PASS | Terracotta/teal/chalk/slate/clay-gold evident across sections. 3-layer text glow on H1 confirmed (1px white core + 10px terra mid + 28px teal ambient). Palette consistent. |
| 3 | Section dividers with motion | FAIL | Zero `.divider` or `.drop` class elements found. Marquee separators present but between-section animated paint-drop dividers are absent or undetectable. A real buyer scrolling sees no visual cadence-setters between sections — the page feels like one long wall. |
| 4 | Horizontal scroll-lock (5 panels) | PASS with caveat | JS handler advancing correctly all 3 viewports. Max travel matches panel geometry. Visual overflow on mobile panel titles clips text at right edge (BUG-025 residual). |
| 5 | PaintFlow animated SVG diagram | PARTIAL | Section present (height 1106px), has SVG and circles. But `animateMotion` absent — dots are NOT animating along path in a live page read. Either the IO threshold is still gating it or the SVG animation is broken server-side. A buyer sees a static diagram. |
| 6 | LiveEstimate auto-typing sequence | PARTIAL | Section present (596px). Text content confirms honest framing. But no `input`, no `textarea`, no cursor element found in DOM snapshot — the typing animation elements may be client-only but the fixed-height container reads as a static text block to a user who lands mid-scroll. |
| 7 | Auto-advancing process timeline | PARTIAL | Tablist present (5 tabs, char-in animation confirmed on active tab). BUT countdown bar class not found in any element — the 10s countdown bar depleting left-to-right (catalog spec) appears absent. Only 1 tabpanel visible at a time, which is correct. Auto-advance timer behavior unconfirmed. |
| 8 | 3-layer text glow | PASS | H1 glow confirmed: `0 0 1px #fff, 0 0 10px rgba(194,96,58,0.75), 0 0 28px rgba(45,122,112,0.45)`. Correct 3 layers, brand colors. |
| 9 | CSS scroll reveals | PASS | 34 `.scroll-reveal` elements present. Pattern confirmed. |
| 10 | Tilt cards / hover depth | PASS | WhySoley: 4 cards with `perspective: 800px`, mobile accordion with `aria-expanded`. Confirmed. |
| 11 | Social as text link in bottom bar | FAIL | Footer bottom bar reads "Social channels coming soon" — not a proper INSTAGRAM/FACEBOOK wide-tracked text link. Pre-launch placeholder is honest but the catalog item is unfulfilled. No social link href exists anywhere in the footer. |
| 12 | Constant-speed rotation, no drift | N/A | R3F removed. SVG signature reveal replaces it. No rotation axis present. Approved equivalent does not require this check. |

**Catalog score: 6/12 full passes, 4 partial, 2 fails.**

---

## Section Scores

### Hero (Catalog #1, #2, #8, #12)
**Score: 6.5/10**

The "Soley" SVG signature on a chalk card within a dark umber hero is distinctive and hand-crafted in feel. The 3-layer glow on the H1 ("Every wall done right.") at 100px is commanding on desktop. However:

- The chalk card (SVG container) reads as a floating widget rather than a hero centerpiece. It has no weight or depth — it looks like a browser modal on top of the background.
- The hero structure is two text blocks framing a box. A buyer's eye has nowhere to travel.
- On mobile (SE375, iPhone 13) the SVG card occupies roughly 40% of the hero height, which is better than the 13% flagged last cycle, but the card's chalk background clashes with the warm umber — it reads as an unfinished placeholder rather than a polished reveal.
- Subheadline ("One crew. One contact. Every wall done right.") is correct honest copy.
- No marquee below hero visible in hero section itself — the services marquee that should reinforce palette item #2 was not observed.

### ServicesScrollLock (Catalog #4, #10)
**Score: 7.0/10**

JS handler working. Panel structure solid. Five distinct panel backgrounds. Tilt card depth in panels. The panel title sizing (5-7vw uppercase tracked) is visually strong. Visual overflow bug on mobile titles is the remaining blocker — "CABINET & TRIM" clips mid-word at 375px, bleeding the next panel into view. That is a UX defect that breaks the "one service at a time" promise of the scroll-lock pattern.

### PaintFlow (Catalog #5)
**Score: 5.5/10**

Section is present and tall enough (1106px). But `animateMotion` is absent — the animated dots that catalog #5 specifies are not operating (either IO threshold is suppressing them or the SVG implementation reverted). A static node diagram reads as a fancy list, not an animated diagram. The dark umber panel and chalk stroke borders read premium. The section headline is honest and specific. Gap: no dots traveling the path.

### LiveEstimate (Catalog #6)
**Score: 5.5/10**

Section exists at 596px. The editorial two-column layout with copy left and card right is correctly framed. However, no input or textarea found in the DOM — the typing simulation elements are either client-rendered and absent from this snapshot, or removed. A buyer landing here mid-scroll sees a text block about estimates rather than a live demonstration. Fixed-height container confirmed, which is good. But the "live" part of LiveEstimate is unconfirmed active.

### Process Timeline (Catalog #7)
**Score: 6.0/10**

Five tabs with char-in animation running on the active step. Char-stagger is present. But the countdown bar — the 10s scaleX(1→0) depleting bar that is the signature of this catalog item — is not present in the DOM. Without it, the auto-advance feels arbitrary rather than cinematic. The buyer has no visual cue that a timer is running. Also: only 1 tabpanel is shown at a time (correct), but the transition between tabs was not observable in static snapshot.

### WhySoley Cards (Catalog #10)
**Score: 7.5/10**

Four cards with perspective tilt at 800px, accordion on mobile. Tilt verified previously at ±7.6° / ±7.7°. Card body copy is honest and specific (two-coat primer, confirmed arrival window, line-for-line invoice). This is one of the stronger sections. No issues.

### PortfolioGallery
**Score: 6.0/10**

Gallery present with filter chips (ALL/INTERIOR/EXTERIOR/COMMERCIAL/CABINET & TRIM/SPECIALTY). Nine placeholder tiles. Honest "Photography forthcoming" overlays — correct pre-launch framing. BUT: portfolio tile badges render at 9.6px on mobile (iPhone 13) — below the 13px floor. Filter chip font is 13px which passes. Badge text at 9.6px is a real usability defect on small screens.

### FAQ
**Score: 6.5/10**

Accordion present with aria-expanded. Six honest questions. Umber background. Chevron animation. Structure is solid. No issues to flag this cycle.

### FounderBlock
**Score: 6.0/10**

Present. Honest copy with operational specifics (owner answers calls, same crew). Placeholder portrait. No fabricated name. Pre-launch framing correct. Reads as a wall of text without a strong visual anchor — the portrait placeholder needs real photography to carry this section.

### Contact
**Score: 7.0/10**

Four-field form (name, phone, email, message). Submit button. Honest pre-launch copy. Left column commitments present. No Formspree endpoint confirmed (form may be non-functional pre-launch). Section height and layout not flagged.

### Footer
**Score: 5.5/10**

Four-column footer with honest service and process link structure. Copyright present. But catalog item #11 (social as wide-tracked text link) is replaced by "Social channels coming soon" — a placeholder that is honest but leaves the bottom bar visually unresolved. No social handle confirmed. Footer lacks the quiet text-link that anchors the bottom bar pattern.

### Section Dividers (Catalog #3)
**Score: 3.0/10**

Zero animated paint-drop dividers detected between sections. The catalog spec — hairline gradient + 3 teardrop SVGs + 2 traveling pulses — is either absent or rendered in a way that is invisible to the DOM scan. Without visual cadence setters between 10+ sections, the site reads as one undifferentiated scroll. This is a significant catalog gap.

---

## Overall Score

**6.2 / 10**

This is a site with genuine distinguishing features — the SVG signature hero, horizontal scroll-lock, WhySoley tilt cards, and strong palette system — but it has real gaps that a buyer in 90 seconds would feel without being able to name:

1. The hero feels like a box on a background rather than a centerpiece.
2. Scrolling between sections has no rhythm — no dividers creating pacing.
3. Three catalog animations (PaintFlow dots, LiveEstimate typing, Process countdown bar) are either broken or absent.
4. Mobile panel title overflow in ServicesScrollLock remains visually disorienting.
5. Sub-13px text on mobile portfolio badges and LiveEstimate labels.

The site is impressively structured for a 7-cycle build. It is not yet a site a buyer would choose over a well-photographed competitor with zero features. The cap at 7.5 pre-launch is appropriate and the current 6.2 reflects that remaining gaps are real, not cosmetic.

---

## Top 5 Priorities for Next Cycle

1. **BUG-025 MOBILE PANEL OVERFLOW (BLOCKER):** Panel content (especially "CABINET & TRIM") overflows the 375px/390px container — title text clips at the right edge, next panel bleeds in visually. Fix: add `overflow: hidden` and `max-width: 100vw` on each panel div, ensure title font-size clamps at mobile (e.g., `clamp(2rem, 8vw, 5rem)` not fixed `7vw`).

2. **PROCESS COUNTDOWN BAR ABSENT:** The 10s scaleX(1→0) depleting bar that signals auto-advance is missing from the DOM. Re-add it to the active tab panel as a thin (3px) terracotta bar below the tab strip, `animation: countdown 10s linear forwards` keyed to tab activation.

3. **PAINTFLOW animateMotion ABSENT:** Dots are not traveling the SVG path. Check whether the IO observer is suppressing them (threshold too high) or whether the SVG `<animateMotion>` elements were removed. Restore the traveling dots — this is a named catalog item and the section is visually static without them.

4. **SECTION DIVIDERS ABSENT:** Zero animated paint-drop dividers between sections. The catalog specifies hairline + 3 teardrop SVGs + traveling pulses, IntersectionObserver-gated. Add them between major section transitions. Without dividers the 10-section page reads as one wall.

5. **MOBILE FONT VIOLATIONS REMAINING:** Portfolio tile badges at 9.6px and LiveEstimate labels at 11px on iPhone 13 fail the 13px floor. Bump `.portfolio-tile-badge` to `font-size: 0.8125rem` (13px) and LiveEstimate eyebrow/label to match.

---

## Pre-Launch Hard Cap

Score is capped at 7.5 until: real photography lands, real reviews/testimonials present, real address or service area confirmed. Current pre-launch framing is honest and correct. Do not invent any of these.
