# AUDIT.md — Soley Painting
**Cycle:** 5 (Nigel)
**Date:** 2026-05-07
**Axis:** conversion-friction
**Auditor:** Nigel
**Live:** https://soley-painting.vercel.app
**Cap:** 7.5 pre-launch (no real photography, no real reviews, no real address)

---

## 12-Feature Catalog Scores

| # | Feature | Score | Notes |
|---|---------|-------|-------|
| 1 | Custom hero centerpiece | 0.7 | Sacramento SVG signature reveal of "Soley" is brand-specific and well-executed. Brush-sprite tracks the leading edge with a 3-color cycle. The chalk card with the painted word on dark-umber is genuinely distinctive. Lost 0.3: the centerpiece card feels slightly undersized at 140px wide on desktop — the signature reads charming but not commanding. On mobile it fills nicely and is the right scale. |
| 2 | Brand palette threaded through everything | 0.7 | Terracotta/teal/chalk/slate/clay-gold are consistent across navbar, hero, service panels, dividers, PaintFlow nodes, and footer. Lost 0.3: the divider teardrops appear in the contact-to-footer transition but the scrollLock panels all share the same dark umber background — the individual swatch accent colors per panel are hard to read at the top (tiny squares), so the palette "threading" is more conceptual than felt. |
| 3 | Section dividers with motion | 0.7 | Three paint-drop SVG teardrops with specular highlights visible between contact and footer. Dual hairline with parallax triangle-wave bounce is a genuine upgrade from prior cycle. Lost 0.3: the Playwright search returned 0 elements matching `.divider`/`.Divider` class — the selector may be non-standard, and the dividers appear only once between contact and footer rather than between every major section, reducing their rhythm effect. |
| 4 | Horizontal scroll-lock (ServicesScrollLock) | 0.4 | BIG ISSUE PERSISTS. The Refiner's fix claimed to have resolved the panel bleed (commit d6c2ccf), but the desktop 50% sample screenshot shows COMMERCIAL and CABINET & TRIM panels simultaneously visible side-by-side — the track translateX is static at -92px regardless of scroll position (same value at 5%, 25%, 50%, 75%, 95% of the runway on desktop). On iPhone 13 the value is stuck at -195px. On SE375 stuck at -188px. The scroll handler is not responding to scrollY changes mid-runway. The section exists and renders correctly when at the panel it lands on, but horizontal travel is broken — panels do not advance as the user scrolls through the 500vh runway. Score held at 0.4 (up from 0.0 because the visual design of each panel is strong). |
| 5 | Animated workflow visualization (PaintFlow) | 0.7 | The PaintFlow SVG workflow is now visible on desktop — 5 nodes on a wavy path, animated dot travels between nodes, splatter burst on node arrival, 5-copy ghost trail behind the lead dot. The dark-slate umber background with chalk strokes looks premium. Lost 0.3: PaintFlow is not found on mobile (Playwright: found: false on iPhone 13). The section may be rendering but the querySelector isn't matching — regardless the mobile screenshot at the portfolio area shows a blank void in that region. This is a repeat of the previous cycle's BUG-014 — not fully resolved on mobile. |
| 6 | Live conversational sequence (LiveEstimate) | 0.7 | LiveEstimate is confirmed present on SE375 at 752px height. The two-column editorial layout (copy left, card right) with auto-typing cadence and blink cursor is distinctive. Lost 0.3: the contact section screenshot shows a split view but the estimate card feels disconnected from the real contact form below — a real buyer scrolling will see "estimate" twice (once auto-typing, once the real form) and may hesitate about which one to fill in. CTA hierarchy between these two is ambiguous. |
| 7 | Auto-advancing horizontal timeline (Process) | 0.4 | On mobile (SE375) the Process section renders as a vertical accordion with numbered tabs — the auto-advance timeline collapses to static row list. On desktop the Playwright screenshot shows a completely blank chalk-colored view — the Process section content appears invisible or scroll-reveal hasn't triggered at that scroll position. The countdown bar is confirmed absent by Playwright (found: false). Score 0.4 — section architecture exists (5 steps, accordion on mobile) but the cinematic auto-advance character-stagger and countdown bar are not operative. |
| 8 | Premium text glow (3-layer halo) | 1.0 | Confirmed via computed style: H1 textShadow = `rgb(255,255,255) 0px 0px 1px, rgba(194,96,58,0.75) 0px 0px 10px, rgba(45,122,112,0.45) 0px 0px 28px`. Exactly 3-layer — near-white core, terracotta mid, teal ambient. Full marks. |
| 9 | CSS scroll reveals | 0.7 | IntersectionObserver pattern confirmed working across sections. Contact left column reveals stagger on scroll. Lost 0.3: the desktop Process section screenshot shows a blank white area — scroll-reveal state appears stuck in hidden for that section, suggesting IO threshold or rootMargin still failing mid-page in Playwright's environment. BUG-028 territory still not fully clean. |
| 10 | Custom feature cards with hover/depth | 0.4 | WhySoley cards selector returned 0 count via Playwright — either the class name is non-standard or the component isn't rendering to DOM as expected. On mobile (SE375 accordion) the WhySoley expandable cards exist, which is the correct mobile pattern. But the tilt/mousemove 3D interaction on desktop WhySoley cards cannot be confirmed. PortfolioGallery tiles exist (72 detected, 7 filter chips) but no tilt interaction evidence from computed styles. Score 0.4 for structural presence without confirmed interaction depth. |
| 11 | Single-channel social in bottom bar | 0.7 | Footer confirmed with copyright and "Social channels coming soon" framing (honest per RULE 7). Lost 0.3: the bottom-bar Instagram text link is NOT present — footer.instagram = false on SE375. The footer has a 4-column nav with the coming-soon note, which is correct framing, but the catalog-spec quiet text link "INSTAGRAM" in the bottom strip is absent. |
| 12 | Constant-speed rotation, no drift | 0.7 | The Sacramento SVG signature reveal runs at a constant speed per CHANGELOG (constant px/s). No perceived acceleration or oscillation drift. Lost 0.3: the signature card on desktop appears narrow (140px wide per Playwright) — at 1440 wide the centerpiece card feels slightly scaled down. Speed itself is consistent and correct. |

---

## Section Totals

| Feature | Raw |
|---------|-----|
| #1 Hero centerpiece | 0.7 |
| #2 Brand palette | 0.7 |
| #3 Section dividers | 0.7 |
| #4 Scroll-lock | 0.4 |
| #5 PaintFlow workflow | 0.7 |
| #6 LiveEstimate | 0.7 |
| #7 Process timeline | 0.4 |
| #8 Text glow | 1.0 |
| #9 Scroll reveals | 0.7 |
| #10 Feature card depth | 0.4 |
| #11 Social bottom bar | 0.7 |
| #12 Constant rotation | 0.7 |
| **Raw total** | **7.8 / 12** |

**Pre-launch cap applied: 7.5**

**Cycle 5 score: 7.5**

---

## Change vs Cycle 4 (scored 7.3)

**Improved:**
- Text glow now confirmed 3-layer at exact spec values — full marks for the first time
- Hero copy tightened — "Every wall done right." is punchy and honest
- PaintFlow now visible on desktop with splatter burst + ghost trail (strong upgrade)
- SectionDivider specular teardrops + dual hairline parallax are a genuine visual upgrade
- LiveEstimate editorial two-column layout is more premium
- FounderBlock renders cleanly — "Run by a small crew that actually shows up" is the right honest human signal
- ServicesScrollLock individual panel visual design (INTERIOR, COMMERCIAL etc.) is high quality

**Regressed / Still broken:**
- ServicesScrollLock horizontal travel STILL not functioning — track stuck at static translateX regardless of scroll position. Confirmed broken across all 3 viewports. This is the most damaging issue on the site.
- PaintFlow still absent on mobile (iPhone 13 Playwright: found: false)
- Process countdown bar absent (Playwright: found: false)
- Desktop Process section renders blank in scroll-reveal context
- WhySoley card tilt interaction unconfirmed via computed styles

---

## ServicesScrollLock Fix Verification

**BLOCKER STILL ACTIVE.**

Refiner cycle 3 (commit d6c2ccf) claimed to fix BUG-025 via `stickyRef.clientWidth` px fix. Tested at 5 positions through the 500vh runway on all 3 viewports:

- Desktop 1440: translateX = **-92px at ALL 5 positions** (5%/25%/50%/75%/95% of 4500px runway). Does not change.
- iPhone 13: translateX = **-195px at ALL 5 positions**. Static.
- iPhone SE 375: translateX = **-188px at ALL 5 positions**. Static.

The section has correct 500vh footprint (top=1114, height=4500 on desktop). The scroll handler is bound but the translateX value is frozen — JS is not converting scrollY progress into horizontal travel.

Mid-runway desktop 50% screenshot confirms: COMMERCIAL and CABINET & TRIM panels simultaneously visible side-by-side, both cropped at viewport edges. Double-panel bleed confirmed. The fix from d6c2ccf did not resolve the scroll-drive.

Most likely root cause: `sectionTop` / `sectionHeight` are being read from `getBoundingClientRect()` at mount time before hydration is complete, producing incorrect values that make `progress` always evaluate to a constant near 0. Fix requires reading fresh bounds inside the scroll handler on every event (not cached at mount).

---

## Top 5 Priorities for Cycle 6

### P1 (BLOCKER) — Fix ServicesScrollLock horizontal travel
The scroll handler is not responding to scrollY changes. Fix: recalculate `sectionTop` and `sectionHeight` inside the scroll event handler using `parentRef.getBoundingClientRect().top + window.scrollY` at event time, not cached at mount. Then recompute `progress = (scrollY - sectionTop) / (sectionHeight - vh)`, clamp 0–1, apply `translateX = -progress * (totalTrackWidth - vw)`. Verify translateX changes at each of 5 runway positions on all 3 viewports before declaring fixed.

### P2 (BLOCKER) — Fix PaintFlow visibility on mobile
PaintFlow querySelector returns `found: false` on iPhone 13. The section either has a conditional render guard hiding it on mobile, or its CSS hides it below a breakpoint. Fix: ensure PaintFlow renders on all viewports. If the diagram is too wide for mobile, reflow nodes to 2-column or vertical stack — but do not hide the section. Confirm with mid-section screenshot on iPhone 13 and SE375.

### P3 — Process countdown bar + desktop scroll-reveal
Two concurrent issues: (a) the countdown bar element is missing from DOM (Playwright found: false) — ensure it is present regardless of scroll state, (b) the desktop Process section screenshot at scroll position shows blank white — IO observer is not triggering. Lower IO threshold to 0 + rootMargin "200px" and confirm with a desktop screenshot showing the auto-advance timeline content visible.

### P4 — ServicesScrollLock panel swatch accent expansion
Each of the 5 service panels has a tiny square accent that's too small to register the palette variation. Expand the accent to a 4px full-width color bar spanning the panel top, matching each panel's swatch color (terracotta for Interior, teal for Exterior, gold for Commercial, etc.). This threads catalog #2 through the scroll-lock without any structural change.

### P5 — Instagram bottom bar link
Add the catalog #11 quiet text link: `INSTAGRAM` in tracked uppercase in the bottom strip of the footer (right side, copyright on left). Even with "channels coming soon" in the body, the bottom bar should have the text link placeholder present per the catalog spec.

---

*Audit conducted 2026-05-07. Playwright tested: Desktop 1440x900, iPhone 13 (390x664), iPhone SE 375x667. ServicesScrollLock sampled at 5 positions through the full 500vh runway on all viewports.*
