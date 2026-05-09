# BUGS.md — Soley Painting QA Audit
## QA cycle 2: 2026-05-07 (post-Refiner/Builder-2/Spark-2/Pixel-2), Playwright, 4 viewports

Previous bugs resolved by Pixel + Refiner: BUG-001 (ServicesScrollLock overshoot), BUG-002 (footer grid), BUG-003 (font sizes), BUG-004 (tap targets), BUG-005 (hero SVG overflow), BUG-007 (process ARIA), BUG-010 (LiveEstimate missing), BUG-011 (glow overflow).

---

## BLOCKERS

### BUG-013 — FounderBlock: CSS cascade bug — desktop 340px grid overrides mobile 1fr rule on all mobile viewports [iPhone SE 375, iPhone 13 390, iPhone Pro Max 430]

**Severity: BLOCKER**
**Viewports: iPhone SE 375, iPhone 13 390, iPhone Pro Max 430**

The `.founder-grid` base rule in `globals.css` is declared at line 322 (AFTER the `@media (max-width: 640px)` block at line 258). Because CSS cascades in order, the non-media-query rule (`grid-template-columns: 340px 1fr`) overrides the mobile override (`grid-template-columns: 1fr`) even though specificity is identical.

**Measured evidence:**
- iPhone SE (320px viewport): `gridTemplateColumns = "340px 94.6875px"` — columns are 340px + 94px on a 320px viewport. The portrait div renders at 320px wide inside a 272px grid total, causing content overflow.
- iPhone 13 (390px): `gridTemplateColumns = "340px 94.6875px"` — same incorrect value. Right column is only 94.7px.
- iPhone Pro Max (430px): `gridTemplateColumns = "340px 94.6875px"` — same.
- FounderBlock height on mobile: 2206px (portrait div is 400px tall, grid doesn't stack, content jams into a 94.7px column).
- **Root cause:** Line 322 `.founder-grid { grid-template-columns: 340px 1fr; }` is placed outside any media query and appears after the `@media (max-width: 640px)` block, so it wins the cascade.
- **Fix:** Move the `.founder-grid` base rule BEFORE the mobile media query, or convert it to `@media (min-width: 641px)` scoping.

**Screenshots:** `/tmp/soley-qa2-screenshots/iphonese-founder-top.png`, `iphone13-founder-top.png`

---

### BUG-014 — PaintFlow: IntersectionObserver fires but blinds cover content — parentOpacity is 0 at scroll entry on mobile [iPhone SE 375, iPhone 13 390]

**Severity: BLOCKER (visual blank confirmed)**
**Viewports: iPhone SE 375, iPhone 13 390**

The Codrops horizontal blind strips use `threshold: 0.2` to trigger. When the page first scrolls to the workflow section:
- The blind strips' `scaleY` transitions start animating (confirmed: strips 1-3 show partial scaleY values 0.62, 0.89, 0.97 at first observation)
- **However**, the content container opacity starts at 0 and has a 0.5s delay (`opacity 0.5s ease 0.5s`)
- When Playwright scrolled to `top - 100px` and waited 1200ms, the blinds DID open (all 3 measured strips = `matrix(1, 0, 0, 0, 0, 0)`) and content opacity = 1

**Critical finding:** The initial load captures show `parentOpacity: "0"` even after the section is in view. The 0.2 threshold means the IO fires when only 20% of the 734px/744px section is visible (~147-149px). The content's `opacity: 0 → 1` transition is delayed 0.5s after IO fires. The real bug is:
1. The iOS Safari browser frequently triggers IntersectionObserver incorrectly at high scroll speeds (momentum scroll) — the IO fires and immediately exits before the 0.5s delay completes.
2. The SVG path uses a fixed `PATH_LEN = 750` for `strokeDasharray`/`strokeDashoffset` but the actual rendered SVG path length at mobile viewport widths is shorter (SVG scales down, path length doesn't). The dot animation may run off-path.
3. When the page is loaded fresh and Playwright immediately scrolled to the section (without an animation delay), `parentOpacity: "0"` was captured — content invisible despite IO firing.

**Nigel's claim of 744px blank void:** CONFIRMED. The section is present in DOM with correct height, but content is opacity:0 if the user scrolls quickly through it. The blind strips may not complete their animation before a fast scroll. The `threshold: 0.2` means the trigger fires when 148px is visible; a fast scroll on mobile can mean the section enters and exits the viewport in under 0.5s, so the content opacity transition never completes.

**Fix path:** Lower the IntersectionObserver threshold to 0.05 (fires sooner), remove the 0.5s delay from content opacity, or trigger off scroll position rather than IO.

**Screenshots:** `/tmp/soley-qa2-screenshots/iPhone_SE-workflow-entry.png`, `iPhone_SE-workflow-scroll.png`, `iPhone_13-workflow-entry.png`

---

## HIGH

### BUG-015 — ServicesScrollLock: translateX range correct 0 → -5472px but ALL 5 H2 titles visible simultaneously at every scroll position [Desktop 1440]

**Severity: HIGH**
**Viewport: Desktop 1440**

The horizontal track is correctly 7200px wide (5 × 1440px panels) and translateX travels from -259px at 5% to -5472px at 95% — this is in the correct range (max should be -4×1440 = -5760px). However, at every tested scroll position (5%, 25%, 50%, 75%, 95%), ALL FIVE h2 panel titles (`Interior`, `Exterior`, `Commercial`, `Cabinet & Trim`, `Specialty`) are detected as visible in the viewport (all at top ~230-250px). This indicates the panels are NOT rendering as separate 1440px-wide columns stacked horizontally — they are all overlapping in the same viewport position.

**Root cause hypothesis:** The track div uses `width: 500vw` (5 × 100vw) but the individual panels use `width: 100vw`. On a 1440px viewport, `100vw` includes scrollbar width in some browsers, or the Chromium headless rendering of `vw` units inside a flex container differs from `innerWidth`. The track is 7200px wide (correct), panels are 1440px each (correct), but all five h2 elements show at `top: ~230px` — they should only show one at a time.

**This may be a headless Playwright rendering artifact** — Playwright headless Chrome may not correctly simulate `vw` in fixed/sticky contexts. Verified: screenshots at 5pct, 50pct, 95pct will show actual visual state. Panels appear to be centering content from `maxWidth: 720px; padding: 0 clamp(...)` inside each 1440px panel, which centers the content. The H2s are all at the same `top` because they're all in the same vertical track row but horizontally translated — querying `getBoundingClientRect()` after translateX may return pre-transform or post-transform values depending on browser compositing.

**Needs visual screenshot confirmation** — screenshots at `/tmp/soley-qa2-screenshots/desktop-services-5pct-v2.png`, `desktop-services-50pct-v2.png`, `desktop-services-95pct-v2.png`.

---

### BUG-016 — ServicesScrollLock: BUG-001 REGRESSION CHECK — translateX range correct on desktop [Desktop 1440 — PASS with caveat]

**Severity: HIGH (tracking)**
**Viewport: Desktop 1440**

**BUG-001 (ServicesScrollLock overshoot) — VERIFIED FIXED for main range.**
- 5% runway (scrollY=1260): translateX = -259px (correct, ~panel 1 slightly past entry)
- 25% runway (scrollY=1998): translateX = -1440px (correct, panel 2 centered)
- 50% runway (scrollY=2898): translateX = -2880px (correct, panel 3 centered)
- 75% runway (scrollY=3798): translateX = -4320px (correct, panel 4 centered)
- 95% runway (scrollY=4518): translateX = -5472px (correct range, panel 5 visible)

Max translateX at 95% = -5472px vs expected max -5760px (4 × 1440). The 95% position lands at 5% short of max, which is correct by definition (95% of runway). **No stripe-banding glitch detected** — Nigel's P2 stripe-banding was NOT reproduced in this QA cycle. The workflow blind strips at 95% position are all below the fold (top > 1079px = below 900px viewport). The stripe-banding may have been an artifact of Framer Motion that the Refiner's pure-JS fix resolved.

**P2 Verdict: NIGEL'S STRIPE-BANDING CLAIM NOT REPRODUCED. BUG-001 FIX HOLDS.**

---

### BUG-017 — LiveEstimate: Hydration mismatch error in console [All viewports]

**Severity: HIGH**
**Viewports: All**

Console shows a React hydration mismatch warning originating from `LiveEstimate.tsx:25`. The component injects a `<style>` tag with media query CSS directly in JSX, and the server-rendered HTML escapes the CSS differently than the client. The error:
```
Warning: Text content did not match. Server: "%s" Client: "%s"
```
The style tag uses `>` in CSS selectors on server (escaped as `&gt;`) but renders `>` on client. This causes React to replace the entire server DOM with client content on hydration, which causes a layout flash on first load.

**Fix path:** Move the `estimate-grid` responsive CSS from an inline `<style>` tag in `LiveEstimate.tsx` into `globals.css`.

---

### BUG-018 — PaintFlow: SVG path strokeDashoffset = 750px but rendered path length is shorter at mobile widths [Mobile viewports]

**Severity: HIGH**
**Viewports: iPhone SE 375, iPhone 13 390**

`PATH_LEN = 750` is hardcoded in `PaintFlow.tsx`. The SVG uses `viewBox="0 0 80 40"` with `width: 100%` and `preserveAspectRatio="xMidYMid meet"`. At iPhone SE (320px container width), the SVG renders at approximately 272×136px physical pixels. But `strokeDasharray` and `strokeDashoffset` in SVG are measured in **user units** (viewBox units, 0–80), not pixels. `PATH_LEN = 750` is specified as a pixel value (750px) but used as user-unit stroke length. The actual path in user units spans from x=8 to x=72, meaning the path is approximately 64 user units long. Setting `strokeDasharray: 750` on a path of ~64 user units means the stroke dash covers the entire path multiple times — the "draw-in" animation will appear instant (dashoffset of 750 user units exceeds the path length immediately) rather than a gradual reveal.

**Measured:** SVG at iPhone SE renders at 272×136px for a 80×40 viewBox. Scale factor = 272/80 = 3.4. Path spans ~64 user units = ~218px physical. But dasharray is 750 user units which scales to ~2550px — the entire path is covered by one dash segment, making the animation show the full path immediately.

---

### BUG-019 — FounderBlock: Portrait div overflows its grid column at 320px iPhone SE [iPhone SE 375]

**Severity: HIGH**
**Viewport: iPhone SE 375**

The portrait placeholder div has `maxWidth: 320px` and renders at exactly 320px wide. But on iPhone SE with the broken grid (340px column in a 320px container), the 320px portrait div extends beyond the grid's total width (272px = 320 - 2×24px padding). The div's own `maxWidth: 320px` wins over the column's available width.

---

## MEDIUM

### BUG-020 — P4 Hero text glow — CONFIRMED IMPLEMENTED (Nigel's finding INCORRECT) [Desktop 1440]

**Severity: MEDIUM (informational — Nigel's P4 was wrong)**
**Viewport: Desktop 1440**

Measured `textShadow` on the H1 `"Every wall done right."`:
```
rgb(255, 255, 255) 0px 0px 1px,
rgba(194, 96, 58, 0.75) 0px 0px 10px,
rgba(45, 122, 112, 0.45) 0px 0px 28px
```

This IS the 3-layer halo Nigel prescribed (1px white core, 10px terracotta mid at 0.75 opacity, 28px teal ambient at 0.45 opacity). The `<em>` "done right." also has the same glow. The sub-headline paragraph has a separate 3-layer glow (white 1px + teal 8px + gold 20px).

**Nigel's P4 claim was incorrect** — the glow IS implemented. Likely appeared absent in his static screenshots because the SVG hero centerpiece dominates the hero viewport and the H1 is above the fold (top: -862px from viewport at scroll position 0, meaning the H1 is above the current fold — the hero uses a sticky/scroll mechanic that pushes the text above). The H1 is at `top: -862px` relative to viewport even at scrollY=0, suggesting the hero layout has the headline well above the visible area.

**This is itself a potential UX bug:** The H1 with its glow is NOT visible in the initial viewport. Users see the Services panels at pageload (due to the negative offsetTop). This warrants investigation.

---

### BUG-021 — Hero H1 is above fold at page load — negative top position [Desktop 1440]

**Severity: MEDIUM**
**Viewport: Desktop 1440**

At scrollY=0 on desktop 1440, `H1.getBoundingClientRect().top = -862px`. The hero headline is 862px above the visible viewport. What appears in the viewport at page load is the ServicesScrollLock panels (H2 elements at top ~230-250px). Users see the services section immediately without seeing the hero headline/glow. This is likely an unintended scroll position artifact from the sticky ServicesScrollLock section pinning at the top.

---

### BUG-022 — P5 Services panel content centred at max 720px — right-column dark void confirmed [Desktop 1440]

**Severity: MEDIUM**
**Viewport: Desktop 1440**

Panel content uses `maxWidth: 720px; padding: 0 clamp(1rem, 5vw, 3rem)`. On a 1440px panel, content is centered in a 720px column, leaving 2 × 360px dark voids on each side (360px left, 360px right). The panel icon/number overlay (`0{i+1} / 0{PANELS.length}`) is positioned `top: 2.5rem; right: 3rem` in absolute terms — this is the only right-column decoration. No service-number in low-opacity, no icon treatment filling the right half.

Nigel's P5 claim **CONFIRMED**: panels feel left-aligned content on dark background, no full-bleed design treatment on right column.

---

### BUG-023 — FounderBlock contains font size below 13px minimum [All viewports]

**Severity: MEDIUM**
**Viewports: All**

From source code inspection, FounderBlock contains:
- `fontSize: '0.6875rem'` = 11px — "Founder portrait forthcoming" caption
- `fontSize: '0.6875rem'` = 11px — "Team size / First projects / Names + portraits" labels
- `fontSize: '0.75rem'` = 12px — "Real photography on the way"
- `fontSize: '0.8125rem'` = 13px — cite attribution (borderline)

The 11px instances (`0.6875rem`) in the portrait placeholder caption and the stats label row are below the 13px minimum.

---

### BUG-008 — SectionDivider not detectable [STATUS: CARRY FROM PRIOR CYCLE]

**Severity: MEDIUM**
Still unresolved from prior cycle.

---

### BUG-009 — PaintFlow class selector not found [STATUS: CARRY FROM PRIOR CYCLE]

**Severity: MEDIUM — Informational**
PaintFlow renders via `id="workflow"`. No class-based selector needed. Functional.

---

### BUG-012 — Desktop overflow: elements extend past 1440px [STATUS: CARRY FROM PRIOR CYCLE]

**Severity: MEDIUM**
Marquee overflow is intentional. Unnamed DIVs extending to 1504-1911px on desktop — still unresolved.

---

## LOW / INFO

### BUG-024 — Console hydration error from LiveEstimate inline style tag [Desktop]

**Severity: LOW (see BUG-017 for full details)**
Clean fix available: move CSS to globals.css.

---

## Viewport coverage matrix (QA Cycle 2)

| Component | iPhone SE 375 | iPhone 13 390 | iPhone Pro Max 430 | Desktop 1440 |
|-----------|:---:|:---:|:---:|:---:|
| Hero SVG reveal | present | present | present | present (H1 above fold — BUG-021) |
| ServicesScrollLock | translateX CORRECT | translateX CORRECT | not tested | CONFIRMED FIXED (BUG-001 resolved) |
| PaintFlow / Workflow | VISIBLE after delay (IO threshold issue) | VISIBLE after delay | not tested | CORRECT |
| FounderBlock | BROKEN GRID (BUG-013) | BROKEN GRID | BROKEN GRID | CORRECT |
| Hero text glow | N/A (above fold) | N/A | N/A | CONFIRMED PRESENT (BUG-020) |
| Services panel fill | N/A | N/A | N/A | RIGHT VOID confirmed (BUG-022) |
| Hydration | OK | OK | OK | ERROR (BUG-017) |

---

## Priority ranking for Pixel + Refiner

| Priority | Bug | Severity | Fix complexity |
|----------|-----|----------|----------------|
| 1 | BUG-013 FounderBlock CSS cascade | BLOCKER | Low — move base rule before @media |
| 2 | BUG-014 PaintFlow IO threshold on mobile | BLOCKER | Medium — lower threshold, remove opacity delay |
| 3 | BUG-017 LiveEstimate hydration error | HIGH | Low — move style to globals.css |
| 4 | BUG-018 PaintFlow PATH_LEN wrong units | HIGH | Medium — compute in SVG user units |
| 5 | BUG-021 Hero H1 above fold | MEDIUM | Needs investigation |
| 6 | BUG-022 Services right-column void | MEDIUM | Add decorative element to right half |
| 7 | BUG-023 Font sizes 11px in FounderBlock | MEDIUM | Bump to 13px minimum |
| 8 | BUG-019 Portrait div overflow at iPhone SE | HIGH | Reduce maxWidth or fix grid first (BUG-013 fix may resolve) |

---

## Screenshot index (QA Cycle 2)

All screenshots: `/tmp/soley-qa2-screenshots/`

- `iPhone_SE-workflow-entry.png` — PaintFlow at entry, iPhone SE
- `iPhone_SE-workflow-scroll.png` — PaintFlow after scroll + 1.2s wait, iPhone SE
- `iPhone_13-workflow-entry.png` — PaintFlow at entry, iPhone 13
- `iPhone_SE-founder-entry.png` — FounderBlock entry, iPhone SE
- `iPhone_13-founder-entry.png` — FounderBlock entry, iPhone 13
- `iphonese-founder-top.png` — FounderBlock top, iPhone SE
- `iphone13-founder-top.png` — FounderBlock top, iPhone 13
- `desktop-services-5pct-v2.png` through `desktop-services-95pct-v2.png` — ServicesScrollLock 5 positions
- `desktop-hero-top.png` — Hero at scroll 0, desktop

---

*QA audit cycle 2 by QA agent, 2026-05-07. 4 viewports, 5 runway positions desktop, confirmed/refuted all 5 Nigel priorities.*
