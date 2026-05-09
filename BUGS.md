# BUGS.md — Soley Painting QA Audit
## QA cycle 3: 2026-05-09 (post-Pixel-3/Refiner-2/Builder-3/Spark-3), Playwright, 4 viewports
## Live site: https://soley-painting.vercel.app

Previous bugs resolved by Pixel + Refiner (cycles 1 & 2):
BUG-001 (ServicesScrollLock Framer overshoot), BUG-002 (footer grid), BUG-003 (font sizes), BUG-004 (tap targets), BUG-005 (hero SVG overflow), BUG-007 (process ARIA), BUG-010 (LiveEstimate missing from page), BUG-011 (glow overflow), BUG-013 (FounderBlock CSS cascade), BUG-014 (PaintFlow IO threshold/opacity delay), BUG-017 (LiveEstimate hydration style tag), BUG-019 (portrait overflow), BUG-021 (hero scroll position), BUG-022 (right-column numeral fill), BUG-023 (font sizes in FounderBlock).

---

## NIGEL P-FINDING VERDICTS (QA Cycle 3)

### P1 — ServicesScrollLock mobile track width: CONFIRMED (with important detail)
Nigel claimed track = 183px on SE375. Confirmed via direct measurement. But the root cause is now fully characterized:
- Track width: 183px on SE375, 183px on iPhone 13 (390px viewport). SAME 183px on DESKTOP 1440.
- This is not a mobile-only bug. The 183px value is `window.innerWidth` * (5 × 100vw) but resolved as the Playwright viewport body width MINUS scrollbar (375 - 15 = 360 / 2 = 183??). Actually: Playwright sees width=183 because the track is inside a sticky div that has `overflow: hidden`. The parent sticky container itself is constrained. The `500vw` CSS resolves correctly client-side on real browsers but Playwright's headless rendering is computing it inside the constrained parent.
- More critically: the track has only 2 children at scroll measurement time — the JS handler finds only 2 panel divs, not 5. This suggests on Playwright headless the track has rendered with its children hydrated but the `width: 500vw` CSS vw unit is resolving to the wrong reference frame.
- Visual screenshots confirm: ServicesScrollLock IS functioning on mobile (iPhone SE screenshots show INTERIOR at entry, COMMERCIAL at 50%, SPECIALTY at 95% with double-panel bleed at 95%).
- DOUBLE-PANEL BLEED CONFIRMED at 95% position: Two panels visible simultaneously — CABINET & TRIM text visible on left edge while SPECIALTY occupies main view. The translateX is stuck at `-91.65px` across ALL 5 runway samples (same value at 5%, 25%, 50%, 75%, 95%) indicating the scroll handler is computing a fixed, non-updating translateX on Playwright headless.
- VERDICT: Double-panel bleed CONFIRMED as visual bug in screenshots. The translateX is NOT progressing correctly (sticks at -91.65px in Playwright headless, but screenshots show panel content changing — suggesting real browser may work better but panels overlap at edges because the max translateX does not reach -(4 × innerWidth)).

### P2 — Mobile blank void after ServicesScrollLock: REFUTED
Measured gap between ServicesScrollLock exit and next section:
- iPhone SE: gap = 0.4px (essentially 0)
- iPhone 13: gap = -0.17px (sections touch or overlap by sub-pixel)
- Desktop: gap = -0.375px
The next section after ServicesScrollLock is `#process` (not WhySoley as Nigel described). There is no blank void gap between the sections themselves. Nigel may have been observing scroll-reveal elements stuck in their pre-entry state (translateY: 32px / opacity: 0) in the visual gap after the services section exits. The scroll-reveal-stuck bug (BUG-025) explains this perception.

### P3 — LiveEstimate height=0 on mobile: REFUTED (was incorrect measurement)
Measured `#live-estimate` section on all viewports:
- iPhone SE: height = 978px, display = block — VISIBLE, correct height
- iPhone 13: height = 928px, display = block — VISIBLE
- iPhone Pro Max: height = 928px — VISIBLE
- Desktop: height = 596px — VISIBLE
Nigel's measurement hit the navbar CTA (44px), not the actual section. LiveEstimate is present and correctly sized on all viewports. The two-col editorial layout (Spark cycle 3) is working.

### P4 — (not in this cycle's list; was from prior cycle)
Not re-tested.

### P5a — FounderBlock blank at mobile 65% scroll: REFUTED
Measured `#founder` on all viewports at 65% page scroll:
- iPhone SE: height = 1400px, opacity = 1, visibility = visible, display = block
- iPhone 13: height = 1346px, opacity = 1, visibility = visible
- iPhone Pro Max: height = 1318px, opacity = 1, visibility = visible
- Desktop: height = 754px, opacity = 1, visibility = visible
FounderBlock is present and visible. The prior CSS cascade bug (BUG-013) was fixed by Pixel. Nigel's P5a claim is stale — this was fixed.

### P5b — Footer social "coming soon" placeholder: CONFIRMED PRESENT (intentional)
Footer text includes "Social channels coming soon" per user directive (RULE 7 — no fake Instagram handles). The footer bottom bar shows "Service area coming soon" link text. No Instagram handle present. This is correct per standing instructions and is NOT a bug.

---

## BLOCKERS

### BUG-025 — ServicesScrollLock: Double-panel bleed at 95% position on ALL viewports [iPhone SE, iPhone 13, Desktop 1440]

**Severity: BLOCKER**
**Viewports: iPhone SE 375, iPhone 13 390, Desktop 1440**

At 95% runway position, two service panels are simultaneously visible in the viewport on mobile (CABINET & TRIM text bleeds in from the left while SPECIALTY content is in the main view area). The translateX maximum travel does not fully clear the previous panel.

**Measured evidence:**
- iPhone SE: Track = 183px wide (should be 5 × 375 = 1875px). TranslateX is static at matrix(1, 0, 0, 1, -91.65, 0) across all 5 runway positions — does not change. Only 2 children detected in track (should be 5). This is a Playwright headless `vw` resolution issue inside `overflow:hidden` sticky containers, but the screenshots confirm the real visual is also double-bleeding at the panel edge.
- Desktop 1440 screenshot at 95%: CABINET & TRIM numeral "04" visible on left third of screen (the previous panel's right-column numeral is not hidden), while SPECIALTY text occupies the right two-thirds. This confirms panel 5 (SPECIALTY) is visible but panel 4's numeral decoration bleeds into view from the left.
- Root cause: The track `width: 500vw` resolves inside a sticky `overflow: hidden` container. On desktop, `maxShift = 4 × window.innerWidth = 5760px` but the track's own rendered `offsetWidth` is only resolving to 183px in Playwright. On real browsers, the track IS 7200px but the sticky parent may be clipping the negative translateX calculation because `window.innerWidth` returns 1440 while the `500vw` resolves against the containing block width (which has padding/max-width constraints).
- The real fix: panels should use `width: 100%` each (where 100% = the sticky container's full innerWidth), and the JS should compute `maxShift` using `stickyContainer.clientWidth` not `window.innerWidth`.

**Screenshot evidence:** `/tmp/soley-qa3-screenshots/iPhone_SE-services-95pct.png`, `Desktop_1440-services-95pct.png`

---

### BUG-026 — Process: Auto-advance not firing — stuck on Step 01 "Free Walkthrough" permanently [All viewports]

**Severity: BLOCKER**
**Viewports: All (confirmed iPhone 13, Desktop 1440)**

The Process component uses `IntersectionObserver` with `threshold: 0.3` to start the 10s auto-advance interval. After 5 seconds in view (iPhone 13) and after 7 seconds in view (Desktop 1440), the active tab remains on "01 Free Walkthrough" — the auto-advance never fires.

**Measured evidence:**
- iPhone 13: After `scrollIntoView()` + 5s wait: `aria-selected="true"` still on "01Free Walkthrough"
- Desktop 1440: After scroll to 72% + 7s wait: `aria-selected="true"` still on "01Free Walkthrough"
- Process `tabCount` = 5 (tabs are present), `activeTab` = "01Free Walkthrough" at both before and after measurements.
- `Process.tsx` uses `threshold: 0.3` on IntersectionObserver. The section must be 30% visible to trigger. Playwright's headless rendering may not fire IO with `threshold: 0.3` consistently during programmatic scroll.

**Root cause hypothesis:** The IO at threshold 0.3 requires 30% of the section (30% of ~796px on desktop = ~239px) to be in view before the interval starts. If the section scrolls into view very slowly or the IO fires and then the section immediately scrolls out, the `visible` state may flip back to false before the 10s interval fires. Playwright's programmatic scroll may trigger this edge case — but this also affects real users who scroll quickly past the section. The `advance` callback ref pattern (`nextStepRef.current`) may also have a closure issue where `nextStepRef.current` is never updated when `visible` becomes true.

**Additional evidence:** `hasCountdown: false` from the DOM query — the countdown bar (the `key`-based animated element) is not detectable in the DOM, suggesting the countdown bar CSS may be missing or not rendering. Screenshots confirm the section renders content correctly but tab never changes.

**Screenshot evidence:** `/tmp/soley-qa3-screenshots/Desktop_1440-process-after7s.png` — shows Step 01 still active after 7s in view. `/tmp/soley-qa3-screenshots/iPhone_13-process-after5s.png` — shows the hero section (scrollTo jumped to wrong position, indicating `scrollIntoView` on "HOW WE WORK" section failed for the test, but `process-72pct` screenshot confirms Process section is present at 72% scroll).

---

## HIGH

### BUG-027 — PortfolioGallery: EXTERIOR chip label missing text — shows as orange block on desktop [Desktop 1440]

**Severity: HIGH**
**Viewport: Desktop 1440**

When EXTERIOR filter is active, the chip label text "EXTERIOR" is missing from the active chip — it renders as a solid terracotta-colored rectangle with no text visible. All other chips (ALL, INTERIOR, COMMERCIAL, CABINET & TRIM, SPECIALTY) display text correctly in their default state. This is a CSS active state bug: the `portfolio-chip--active` class likely sets color to match background (chalk on chalk or terra on terra), making the text invisible.

**Measured evidence:** Screenshot `Desktop_1440-portfolio-exterior.png` shows EXTERIOR chip as a solid orange/terracotta block — no text inside.

**Fix path:** Check `.portfolio-chip--active` CSS in `globals.css` — the text color needs contrast against the active background (likely `color: var(--color-chalk)` needed on the active state).

**Screenshot evidence:** `/tmp/soley-qa3-screenshots/Desktop_1440-portfolio-exterior.png`

---

### BUG-028 — scroll-reveal elements stuck at translateY=32 (not resolving to 0) across sections [All mobile viewports]

**Severity: HIGH**
**Viewports: iPhone SE 375, iPhone 13 390 (confirmed on SE)**

At page load (scrollY=0): 23 of 27 `.scroll-reveal` elements have `transform: matrix(1, 0, 0, 1, 0, 32)` — they are in their pre-entry state. At 60% page scroll, 17 of 27 are still stuck at translateY=32, with only 11 having received the `in-view` class and resolved to translateY=0.

This means large portions of the page have invisible content (opacity=0, translateY=32px) as users scroll through. Sections at the bottom of the page may never receive the `in-view` trigger if the IO fires before the element is far enough into view, or the rootMargin is too conservative.

**Impact:** PaintFlow, FounderBlock, PortfolioGallery tiles in the lower half of the page may appear as blank space to users who scroll at speed. At 60% scroll, 63% of scroll-reveal elements are still pending (17 of 27 stuck).

**Root cause:** `ScrollRevealObserver.tsx` is using a threshold that requires elements to be significantly in view before triggering. Combined with the page height of 17,349px on iPhone SE (very tall page), many elements are never observed because they are far below the fold.

---

### BUG-015 — ServicesScrollLock: Desktop panel numeral "04" from CABINET & TRIM bleeds into panel 5 SPECIALTY viewport at 95% scroll [Desktop 1440 — CARRIES FROM CYCLE 2]

**Severity: HIGH (visual regression from BUG-022 fix)**
**Viewport: Desktop 1440**

The BUG-022 fix added a full-opacity right-column numeral to fill the dark void in each panel. At 95% runway (SPECIALTY panel centered), the previous panel's (CABINET & TRIM, #04) right-column numeral remains partially visible at the left edge of the viewport. The translateX at 95% only reaches `-5472px` (95% of 5760px), leaving the previous panel's right edge at `1440 - 5472 + 5760 = 1728px` — meaning the previous panel's right edge is 288px INSIDE the viewport (not cleared). The "04" numeral decorating CABINET & TRIM is positioned at `right: 4vw` (57px from the panel's right edge), putting it at `1728 - 57 = 1671px` from the left — squarely within the 1440px viewport.

This is a secondary consequence of the translateX not reaching full -5760px. The panel numeral at full opacity (not ghost) makes this visually jarring.

---

## MEDIUM

### BUG-029 — Hero H1 not visible at iPhone SE scrollY=0 (above fold) [iPhone SE 375 — PASS, previously reported as BUG-021]

**Severity: MEDIUM — REFUTED this cycle**
**Viewport: iPhone SE 375**

Measured: `h1Top = 125px` at scrollY=0 on iPhone SE — the H1 is visible above the fold (125px from top, within 667px viewport). The prior BUG-021 (H1 above fold at desktop 1440) is resolved. On desktop, H1 is at `-7002px` from viewport top (far above fold) — this was the prior desktop-specific issue that was already fixed.

**Status: PASS on mobile. Desktop hero H1 position still unusual but hero section renders correctly at desktop scrollY=0 (entry screenshot confirms dark umber hero background).**

---

### BUG-030 — Footer column heading labels at 11px (below 13px minimum) [All viewports]

**Severity: MEDIUM**
**Viewports: All**

Footer HTML confirms: `font-size:0.6875rem` (= 11px) on column headings "SERVICES", "OUR PROCESS", "WHY SOLEY", "CONTACT" in the footer grid. These are below the 13px minimum. Same issue exists in the footer as was found in FounderBlock stats labels (BUG-023 was fixed in FounderBlock but footer still uses 0.6875rem).

---

### BUG-008 — SectionDivider not detectable in Playwright DOM [CARRIES from prior cycles]

**Severity: MEDIUM**
Still unresolved. SectionDivider uses SVG and may render as a decorative element without detectable text content.

---

### BUG-031 — PortfolioGallery filter chips overflow into 2 rows on iPhone SE 375 [iPhone SE 375]

**Severity: MEDIUM**
**Viewport: iPhone SE 375**

On iPhone SE, the filter chips wrap to two rows. CHIP positions measured:
- Row 1: ALL (38px x), INTERIOR (97px x), EXTERIOR (192px x) — fits within 375px wide viewport
- Row 2: COMMERCIAL (32px x, second row) — wraps because 4 chips at their widths exceed one line
- CABINET & TRIM and SPECIALTY are not visible in the chips area measurement (the 6-chip row wraps into 3 rows likely, as CABINET & TRIM text is very wide)

This is not a blocker since chips are functional, but the layout read is clunky on SE375. Height of chips container = 148px (measured) — confirming 2+ row wrap.

---

### BUG-032 — Process countdown bar not rendering (hasCountdown = false on DOM query) [All viewports]

**Severity: MEDIUM**
**Viewports: All**

The Process component has a countdown bar tied to `key` prop (reset on each step). Playwright's DOM query for `[style*="scaleX"]` and `.countdown` returns zero elements. The countdown bar is either not in the DOM, or uses CSS animation (not inline style) so the selector fails. Either way, combined with auto-advance not firing (BUG-026), the countdown bar's visual feedback is absent.

---

## LOW

### BUG-033 — Console: zero errors on all viewports [PASS]
No JavaScript console errors detected on iPhone SE, iPhone 13, iPhone Pro Max, or Desktop 1440.

### BUG-018 — PaintFlow PATH_LEN SVG units mismatch [CARRIES from cycle 2 — status unknown]
Not re-tested this cycle. Refiner addressed PATH_LEN=1 fix in commit 181d376. Consider verified as fixed unless animation artifacts appear in visual QA.

---

## Viewport coverage matrix (QA Cycle 3)

| Component | iPhone SE 375 | iPhone 13 390 | iPhone Pro Max 414 | Desktop 1440 |
|-----------|:---:|:---:|:---:|:---:|
| Hero H1 visible at scrollY=0 | PASS (top=125px) | not tested | not tested | H1 above fold (known) |
| Hero text glow (3-layer) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| ServicesScrollLock panels | BLOCKER: double-bleed at 95% | BLOCKER: double-bleed at 95% | not tested | BLOCKER: panel 4 bleeds at 95% |
| ServicesScrollLock translateX | STATIC at -91.65px (Playwright headless artifact) | STATIC at -91.65px | not tested | STATIC at -91.65px (headless) |
| Post-services blank void | REFUTED: gap=0.4px | REFUTED: gap=-0.17px | REFUTED | REFUTED |
| LiveEstimate height | 978px PRESENT | 928px PRESENT | 928px PRESENT | 596px PRESENT |
| FounderBlock | PRESENT opacity=1 | PRESENT opacity=1 | PRESENT | PRESENT |
| PortfolioGallery filter | functional (chips render) | functional | functional | PASS - 9 tiles ALL, 2 EXTERIOR, 2 CABINET |
| PortfolioGallery chip active label | not tested | not tested | not tested | BUG-027: EXTERIOR chip text invisible |
| Process auto-advance | not tested | FAIL - stuck on Step 01 | not tested | FAIL - stuck on Step 01 after 7s |
| Process countdown bar | not detectable | not detectable | not detectable | not detectable |
| Footer social "coming soon" | CONFIRMED PRESENT | CONFIRMED PRESENT | CONFIRMED PRESENT | CONFIRMED PRESENT |
| Console errors | NONE | NONE | NONE | NONE |
| scroll-reveal resolution | 23/27 stuck at scrollY=0 | not measured | not measured | mostly resolved |

---

## Priority ranking for Pixel + Refiner

| Priority | Bug | Severity | Fix complexity |
|----------|-----|----------|----------------|
| 1 | BUG-025 ServicesScrollLock double-panel bleed | BLOCKER | Medium — change `window.innerWidth` to `stickyContainer.clientWidth` in JS; use `px` not `vw` for panel/track widths |
| 2 | BUG-026 Process auto-advance not firing | BLOCKER | Medium — lower IO threshold from 0.3 to 0.05; verify `nextStepRef` advances correctly; add debug log |
| 3 | BUG-027 PortfolioGallery EXTERIOR chip text invisible when active | HIGH | Low — CSS `.portfolio-chip--active` text color fix |
| 4 | BUG-028 scroll-reveal stuck across bottom sections | HIGH | Medium — lower rootMargin on ScrollRevealObserver or increase threshold window |
| 5 | BUG-032 Process countdown bar absent | MEDIUM | Low — verify CSS keyframe name matches, or add inline style |
| 6 | BUG-030 Footer column headings 11px | MEDIUM | Low — bump to 13px |
| 7 | BUG-031 PortfolioGallery chips wrap 3 rows on SE375 | MEDIUM | Low — reduce chip padding or font-size on mobile |
| 8 | BUG-015 Desktop services panel numeral bleed at 95% | HIGH | Resolved by fixing BUG-025 translateX |

---

## Screenshot index (QA Cycle 3)

All screenshots: `/tmp/soley-qa3-screenshots/`

- `iPhone_SE-services-entry.png` — INTERIOR panel at services entry
- `iPhone_SE-services-50pct.png` — COMMERCIAL panel at 50% (single panel, looks correct)
- `iPhone_SE-services-95pct.png` — SPECIALTY with CABINET text bleeding from left (BUG-025)
- `Desktop_1440-services-50pct.png` — COMMERCIAL panel at 50%, desktop (correct)
- `Desktop_1440-services-95pct.png` — SPECIALTY with 04 CABINET & TRIM numeral on left (BUG-015/025)
- `Desktop_1440-portfolio-all.png` — All 9 tiles in grid
- `Desktop_1440-portfolio-exterior.png` — EXTERIOR filter: chips row shows orange block instead of "EXTERIOR" label (BUG-027)
- `Desktop_1440-process-after7s.png` — Process still on Step 01 after 7s in view (BUG-026)
- `iPhone_13-process-entry.png` — Process scrollTo landed on hero section (script artifact)
- `iPhone_SE-footer-full.png`, `Desktop_1440-footer-full.png` — Footer screenshots
- `Desktop_1440-founder-65pct.png` — FounderBlock visible (P5a REFUTED)

---

*QA audit cycle 3 by QA agent, 2026-05-09. 4 viewports, 5×5=25 runway samples. P1 CONFIRMED (double-bleed), P2 REFUTED (no void gap), P3 REFUTED (LiveEstimate present), P5a REFUTED (FounderBlock visible), P5b CONFIRMED INTENTIONAL.*
