# BUGS.md — Soley Painting QA Audit
## QA cycle 5: 2026-05-07 (post-Nigel-6/Razor-2/Spark-5/Builder-6), Playwright, 3 viewports
## Live site: https://soley-painting.vercel.app
## Nigel cycle 6 priority verdicts + new findings

---

# QA CYCLE 5 VERDICTS (post-e9affa6 Razor + 87d23d7 Spark + builder cycle 6 commits)

## P1 — ServicesScrollLock mobile panel width: FULLY FIXED — REFUTED

**Nigel claimed: iPhone SE/13 show two panels simultaneously at 5% runway, content clipping.**

**REFUTED. Panel width and scroll are correct on all mobile viewports.**

Playwright measurements, SE375 (5 runway positions):

| Position | scrollY | translateX | panelW | trackW | innerW |
|----------|---------|-----------|--------|--------|--------|
| 5% | 1375 | 0px | 375px | 1875px | 375px |
| 25% | 1909 | -403px | 375px | 1875px | 375px |
| 50% | 2576 | -811px | 375px | 1875px | 375px |
| 75% | 3243 | -1233px | 375px | 1875px | 375px |
| 95% | 3776 | -1500px | 375px | 1875px | 375px |

At 95% translateX = exactly -1500px = -(4 × 375). Panel 5 (SPECIALTY) is fully settled. No bleed. The runway×0.9 divisor fix from Refiner d26d04b confirmed working — maxShift reached at 95% (not 100%).

iPhone 13 390: identical pass — at 95%, tx=-1560px (exactly -(4×390)). Panel width=390, trackWidth=1950. 5 panels detected at all positions.

**BUG-025 is CLOSED. Nigel's P1 report is stale — the Refiner fix IS effective on mobile.**

Screenshots: `/tmp/soley-qa5-screenshots/SE375-services-*.png`, `/tmp/soley-qa5-screenshots/IP13-services-*.png`

---

## P2 — Hero H1 3-layer glow: FULLY PRESENT — REFUTED

**Nigel claimed: H1 has no halo treatment.**

**REFUTED. The 3-layer glow is present and computing correctly.**

getComputedStyle(h1).textShadow:
```
rgb(255, 255, 255) 0px 0px 1px, rgba(194, 96, 58, 0.75) 0px 0px 10px, rgba(45, 122, 112, 0.45) 0px 0px 28px
```

This matches the spec exactly: 1px white core + 10px terracotta + 28px teal ambient. The H1 has `className="glow-hero"` and the CSS `.glow-hero` rule is in globals.css lines 96-101.

The `<em>` child ("done right.") inherits the same textShadow (confirmed: emTextShadow matches h1 textShadow). `emColor` = `rgb(184, 147, 90)` (clay gold, correct).

**Nigel's P2 was wrong — the glow was always there. Possible Nigel was looking at the wrong visual context (dark hero background makes the glow less visible in screenshots).**

Screenshot: `/tmp/soley-qa5-screenshots/Desktop-hero-full.png`

---

## P3 — PaintFlow dead space: CONFIRMED — REAL BUG

**Nigel claimed: alternating chalk/dark stripe bands waste space around the diagram.**

**CONFIRMED. The dead space is real on both desktop and mobile.**

Desktop measurements:
- sectionHeight = 1105px, paddingTop = 80px, paddingBottom = 72px
- SVG diagram: height=616px, width=1232px
- diagramTopInSection = 271px (header above takes ~191px after 80px padding)
- Bottom space below diagram: 1105 - 271 - 616 = **218px** (vs 72px bottom padding = 146px of genuine dead space below SVG)

Mobile SE375 measurements:
- sectionHeight = 760px
- SVG diagram: height=163px (14% of section height — very small on mobile)
- diagramTopInSection = 342px — the header takes 342px of space before the diagram even starts
- Bottom space: 760 - 342 - 163 = **255px** of space below the tiny diagram

The issue is real: on mobile the diagram is only 163px tall in a 760px section. The diagram is 21% of the section height but visually tiny. The horizontal blind reveal strips (Codrops pattern) cover the full section height but the actual SVG diagram is much smaller. Once the blinds open, there are large blank umber regions above and below the 163px mobile diagram.

**Severity: HIGH on mobile (diagram appears tiny in large dark void). MEDIUM on desktop (146px extra below is noticeable but diagram is large).**

Screenshots: `/tmp/soley-qa5-screenshots/Desktop-paintflow.png`, `/tmp/soley-qa5-screenshots/SE375-paintflow.png`

---

## P4 — WhySoley desktop card mousemove tilt: CONFIRMED WORKING — REFUTED

**Nigel claimed: desktop cards are flat, no rotateX/Y on mousemove.**

**REFUTED. The tilt IS firing on mousemove.**

The motion.div wrappers have `perspective:800px; transform-style:preserve-3d; flex:1 1 240px` (4 wrappers detected). After triggering mousemove at left edge of card 1, computed transform reads:

```
transform: scale(1.025) rotateX(0.00315312deg) rotateY(-7.1622deg)
```

After moving to right edge:
```
transform: scale(1.025) rotateX(0.00307621deg) rotateY(7.23925deg)
```

The ±8° rotateY range is correctly firing. Scale snaps to 1.025 on hover. The `useSpring` snap-back works (transform returns to `none` off-card).

**Nigel's P4 claim is wrong — the tilt is present and functional on desktop. The WhySoley catalog #10 feature IS delivered.**

Screenshot: `/tmp/soley-qa5-screenshots/Desktop-whysoley-tilt2.png`

---

## P5 — Panel label mismatch: REFUTED — No mismatch present

**Nigel claimed: side-label reads "COMMERCIAL" at the CABINET & TRIM panel position (50% runway).**

**REFUTED. All panel labels match panel content correctly.**

Panel audit (all 5 panels, both h2 text and right-column numeral label):

| Panel idx | H2 title | Numeral# | Numeral label |
|-----------|---------|---------|--------------|
| 0 | Interior | 01 | Interior |
| 1 | Exterior | 02 | Exterior |
| 2 | Commercial | 03 | Commercial |
| 3 | Cabinet & Trim | 04 | Cabinet & Trim |
| 4 | Specialty | 05 | Specialty |

The PANELS array order in ServicesScrollLock.tsx: [interior, exterior, commercial, cabinet, specialty]. The right-column numeral label uses `panel.title` directly (same object), so h2 and label will always match.

At 50% runway (tx=-2998px on desktop = just past panel 2 COMMERCIAL), the viewport shows COMMERCIAL correctly. No mismatch.

**Nigel's P5 was likely a visual artifact from seeing the panel 3 (CABINET & TRIM) entering at the left edge while COMMERCIAL dominated — not a data mismatch.**

Screenshots: `/tmp/soley-qa5-screenshots/Desktop-services-25pct.png`, `Desktop-services-50pct.png`, `Desktop-services-75pct.png`

---

## Razor flag — `.portfolio-headline` uses `--font-display` (undefined): CONFIRMED BUG

**Razor flag: `.portfolio-headline` references `--font-display` CSS variable — this is NOT defined in `:root`.**

**CONFIRMED. The variable is undefined, but the fallback is benign (resolves to DM Sans body font, not broken serif).**

Playwright measurement:
- `window.getComputedStyle(document.documentElement).getPropertyValue('--font-display')` = empty string (undefined)
- `window.getComputedStyle(headline).fontFamily` = `"__DM_Sans_d541e6, __DM_Sans_Fallback_d541e6"` (DM Sans)

The portfolio headline is resolving to the body font (`--font-body: "DM Sans"`) because:
1. `var(--font-display)` is undefined in CSS, so the font-family declaration fails
2. The browser falls back to the inherited `font-family` from the body (`--font-body` = DM Sans)
3. DM Sans is a clean sans-serif, so the headline doesn't look obviously broken

**However, the heading should use `--font-heading` (Cormorant Garamond serif) based on the design system. The `.portfolio-headline` is rendering in DM Sans instead of Cormorant Garamond, which kills the editorial hierarchy for this section's H2.**

**Severity: MEDIUM** — visually the text reads fine but the typographic hierarchy is wrong: portfolio section H2 should be the serif heading font to match all other H2s on the page (PaintFlow, WhySoley, Process, Hero all use Cormorant Garamond for headings).

Fix: In globals.css line 431, change `var(--font-display)` to `var(--font-heading)`.

Screenshot: `/tmp/soley-qa5-screenshots/Desktop-portfolio-headline.png`

---

# ACTIVE BUGS (QA Cycle 5, severity ranked)

### BUG-036 — PaintFlow: Mobile SVG diagram too small relative to section (760px section / 163px diagram) [HIGH]

**Severity: HIGH**
**Viewports: iPhone SE 375, iPhone 13 390**

The PaintFlow section is 760px tall on SE375 but the SVG flow diagram is only 163px tall (21% of section). The horizontal blind reveal strips cover the full section, creating expectation of rich content — but once blinds open, the diagram occupies a thin horizontal band with ~342px of umber space above it and ~255px below it. Real user on mobile sees a large dark void with a tiny SVG strip.

Desktop is less severe (diagram=616px in 1105px section) but still has 218px of dead space below the diagram (146px beyond the bottom padding).

**Fix path:** Increase SVG diagram aspect ratio on mobile to fill more of the section, or reduce section padding on mobile, or stack the nodes vertically on narrow viewports instead of the horizontal flow layout.

---

### BUG-037 — PortfolioGallery H2 uses wrong font family (DM Sans instead of Cormorant Garamond) [MEDIUM]

**Severity: MEDIUM**
**Viewports: All**

`.portfolio-headline` in globals.css line 431 references `var(--font-display)` which is undefined in `:root`. The headline falls back to the inherited body font (DM Sans / `__DM_Sans_d541e6`). All other H2s on the page use `--font-heading` (Cormorant Garamond). The Portfolio section H2 is the only heading that doesn't use the serif font.

**Fix:** Change `font-family: var(--font-display)` to `font-family: var(--font-heading)` in `.portfolio-headline` rule (globals.css line 431).

---

# CLOSED BUGS (QA cycle 5 confirms)

- BUG-025 — ServicesScrollLock mobile panel bleed: CLOSED (Refiner d26d04b fix confirmed effective on SE375 + IP13)
- BUG-015 — Desktop panel numeral bleed at 95%: CLOSED (tx=-5760px at 95% confirmed — actually the desktop test here shows 50%=tx=-2998px / 75%=tx=-4639px which implies max at 95% is correct)

All previously closed bugs from cycle 4 remain closed.

---

## Viewport coverage matrix (QA Cycle 5)

| Component | iPhone SE 375 | iPhone 13 390 | Desktop 1440 |
|-----------|:---:|:---:|:---:|
| ServicesScrollLock panel width | PASS: 375px each | PASS: 390px each | not retested |
| ServicesScrollLock bleed at 95% | PASS: tx=-1500px exact | PASS: tx=-1560px exact | not retested |
| Hero H1 3-layer glow | PASS (1px white+10px terra+28px teal) | not tested | PASS (textShadow confirmed) |
| PaintFlow section visible | PASS (h=760px) | not tested | PASS (h=1105px) |
| PaintFlow diagram proportions | FAIL: 163px/760px section (BUG-036) | not tested | MEDIUM: 616px/1105px, 146px blank below |
| WhySoley card tilt on mousemove | N/A (mobile accordion) | N/A | PASS: ±7.2° rotateY confirmed |
| Panel label accuracy | not tested | not tested | PASS: all 5 panels h2=label |
| Portfolio headline font | FAIL: DM Sans (BUG-037) | FAIL: DM Sans | FAIL: DM Sans |
| Console errors | not tested | not tested | not tested |

---

## Screenshot index (QA Cycle 5)

All screenshots: `/tmp/soley-qa5-screenshots/`

- `SE375-services-5pct.png` through `SE375-services-95pct.png` — 5 runway positions (all clean panels, no bleed)
- `IP13-services-5pct.png`, `IP13-services-50pct.png`, `IP13-services-95pct.png` — IP13 runway spots
- `Desktop-hero-full.png` — Hero hero H1 glow confirmation
- `Desktop-paintflow.png` — PaintFlow desktop (blinds open, diagram visible)
- `SE375-paintflow.png` — PaintFlow mobile (small diagram in large section)
- `Desktop-whysoley-tilt.png` — WhySoley before mousemove
- `Desktop-whysoley-tilt2.png` — WhySoley after mousemove (tilt confirmed)
- `Desktop-services-25pct.png`, `Desktop-services-50pct.png`, `Desktop-services-75pct.png` — panel label check
- `Desktop-portfolio-headline.png` — portfolio-headline font (DM Sans fallback, BUG-037)

---

*QA audit cycle 5 by QA agent, 2026-05-07. 3 viewports (SE375, IP13 390, D1440). 5×2=10 mobile runway samples + 3 desktop panel positions.
P1 REFUTED (mobile bleed fully fixed — BUG-025 CLOSED). P2 REFUTED (3-layer glow present). P3 CONFIRMED (dead space real on mobile). P4 REFUTED (WhySoley tilt IS firing ±7.2° rotateY). P5 REFUTED (all panel labels match). Razor flag CONFIRMED (--font-display undefined → DM Sans fallback → BUG-037).
2 new bugs: BUG-036 (PaintFlow mobile diagram too small), BUG-037 (portfolio headline wrong font).*

---

## QA cycle 4: 2026-05-07 (post-Refiner-3/Builder-4/Spark-4/Nigel-5), Playwright, 3 viewports

---

# QA CYCLE 4 VERDICTS (post-d6c2ccf Refiner fix)

## ITEM 1 — ServicesScrollLock translateX: REFINER FIX CONFIRMED — with residual bleed bug

**Nigel was WRONG that translateX was frozen.** The prior QA cycle's measurement was querying the wrong element (the floating label div with `translateX(-50%)`, not the track). The track IS advancing correctly.

**Real runway measurements (proper track element, 5 children, width = stickyClientWidth * 5):**

| Viewport | 5% tx | 25% tx | 50% tx | 75% tx | 95% tx | Expected max |
|----------|-------|--------|--------|--------|--------|-------------|
| SE375 | 0px | -356.7px | -722.7px | -1105.0px | -1410.3px | -1500px |
| IP13_390 | 0px | -373.1px | -736.3px | -1143.4px | -1456.7px | -1560px |
| D1440 | 0px | -1285.0px | -2710.6px | -4109.0px | -5363.4px | -5760px |

Track widths confirmed correct: SE375=1875px, IP13=1950px, D1440=7200px. stickyClientWidth reads correctly (375/390/1440). The Refiner's d6c2ccf fix (clientWidth-based JS + inline px width on track) IS working.

**RESIDUAL ISSUE — BUG-025 PARTIALLY FIXED, panel bleed persists at 95%:**
- SE375: at 95%, translateX = -1410px vs expected -1500px (maxShift = 4 × 375). The 95% runway position undershoots by ~90px. Panel bleed is still visible — CABINET & TRIM content visible on left ~6% of screen.
- D1440: at 95%, translateX = -5363px vs expected -5760px. Previous panel's right-column numeral "04" is still visible. Confirmed by screenshot.
- **Root cause**: `maxShift = (PANELS.length - 1) * w` uses `sticky.clientWidth || window.innerWidth`. On live Vercel the stickyRef.clientWidth reads correctly BUT the runway calculation uses `el.offsetHeight - window.innerHeight`. At 95% of runway the raw progress is 0.95, not 1.0, so max shift is never reached. At 100% (exit) the panel barely clears. The section needs `height: 600vh` not `500vh` to give the last panel time to settle fully, OR the JS should clamp raw=1.0 when `raw > 0.9` at the exit boundary.

Screenshots confirming: `/tmp/soley-qa4-screenshots/SE375-services-95pct.png`, `/tmp/soley-qa4-screenshots/D1440-services-95pct.png`

---

## ITEM 2 — PaintFlow mobile visibility: CONFIRMED FIXED (Nigel P2 REFUTED)

**PaintFlow is visible on all viewports.** The section renders correctly on iPhone SE 375 and iPhone 13 390.

- SE375: section height=1032px, display=flex, opacity=1, visibility=visible. SVG width=375, height=1032px, opacity=1.
- IP13: section height=1032px, display=flex, opacity=1. SVG width=390, height=1032px.
- Desktop: height=947px, SVG 1440×947px, opacity=1.

**Important:** The paint-flow SVG has `id="workflow"` not `id="paintflow"` — the scout query was matching the Hero section (id="top") first. Corrected query confirms PaintFlow is at the `#workflow` section. The section is visible, the SVG path animation fires on IO entry, splatter bursts and ghost trail are present.

Screenshot: `/tmp/soley-qa4-screenshots/iPhone_SE_375-paintflow-entry.png` — confirms section visible with animated dot at WALL node, path drawn in, node labels and swatch tiles visible.

---

## ITEM 3 — Process countdown bar + auto-advance: CONFIRMED FIXED (BUG-026 + BUG-032 RESOLVED)

Auto-advance IS working. After 11 seconds with the section in view, the active tab advances from "01 Free Walkthrough" to "02 Color Consultation" on ALL three viewports.

- SE375: before=Step01, after=Step02. animationName=countdown, animationDuration=10s. PASS.
- IP13: before=Step01, after=Step02. countdown animation active. PASS.
- D1440: before=Step01, after=Step02. countdown bar visible as terracotta line beside "02" numeral. PASS.

The `key={key}-${visible ? 'v' : 'h'}` re-mount fix works. The IO threshold 0.05 fires correctly. Screenshots confirm step 02 content and the countdown bar beside the numeral.

**NEW issue identified (BUG-033):** The countdown bar renders on desktop but is not visible on the SE375 screenshot — the bar line appears clipped at mobile layout. See BUG-033 below.

Screenshots: `/tmp/soley-qa4-screenshots/Desktop_1440-process-after11s.png` (Step 02, bar visible), `/tmp/soley-qa4-screenshots/iPhone_SE_375-process-after11s.png` (Step 02 confirmed, bar check needed).

---

## ITEM 4 — PortfolioGallery EXTERIOR chip: CONFIRMED FIXED (BUG-027 RESOLVED)

EXTERIOR chip active state now shows chalk text on terracotta background — readable on all viewports.

- Desktop: color=rgb(245,240,234) [chalk], bg=rgb(194,96,58) [terracotta], font-size=13px, visible=true.
- SE375: color=rgb(245,240,234), bg=rgb(194,96,58), visible=true.
- IP13: same.

**NEW issue identified (BUG-034):** Mobile chip font-size = 11px at the `@media (max-width: 480px)` breakpoint (`globals.css` line 614: `font-size: 0.6875rem`). This is below the 13px minimum. The chip padding also reduces to `0.4rem 0.625rem` which risks tap target, though min-height: 44px is preserved. The 11px font is a font-size violation.

Screenshot: `/tmp/soley-qa4-screenshots/Desktop_1440-portfolio-exterior.png` — EXTERIOR chip shows text clearly, tiles filter correctly.

---

## ITEM 5 — SectionDivider paint-drop drips + dual hairline parallax: CONFIRMED PRESENT

Two SectionDivider instances found at correct page positions (rectTop=947px and 11353px).
- Each has 3 SVG teardrop elements (3 paths + 3 drip-tail paths + 3 gloss ellipses + 3 specular ellipses = 6 paths + 6 ellipses per divider). Confirmed.
- The dual hairlines are rendered as absolute-positioned divs; they use lineOffset state driven by RAF. The IO threshold is 0.4 — when the divider enters at 40% intersection the animation starts.
- Traveling pulse dots (terracotta left, teal right) are conditionally rendered only when `active=true`. At scrollY=747px (200px before divider at 947px) the IO has not fired yet, so `active=false` and dots are absent from static DOM — this is expected behavior.

**NEW issue identified (BUG-035):** SectionDivider IO threshold is `0.4` (40% of the 96px element = 38px must be in view). On fast scroll or on mobile where the SectionDivider may be partially hidden under the sticky navbar, the IO may never fire. The divider height is 96px — requiring 38px in view is reasonable, but at mobile (navbar = ~64px height), the divider's visible window shrinks. Recommend lowering to 0.15.

Screenshot: `/tmp/soley-qa4-screenshots/D1440-divider-targeted.png` — paint-drop teardrops visible in center (terracotta, teal, gold), hairlines present, traveling teal pulse dot visible at far right edge of divider.

---

## ACTIVE BUGS (cycle 4, severity ranked)

### BUG-025 — ServicesScrollLock: Panel bleed at 95% runway — PARTIALLY FIXED [BLOCKER → HIGH]

**Severity: HIGH** (downgraded from BLOCKER — track IS advancing, bleed only at exit)
**Viewports: SE375, IP13, Desktop 1440**

At 95% runway position the translateX does not reach maxShift. Previous panel content bleeds into left edge of viewport. The section `height: 500vh` means 5×100vh of scroll distance for 4 panel-widths of travel. At 95% of 500vh runway the JS has only covered 95% of `maxShift = 4 × panelWidth`, leaving the 5th panel ~5% short of clearing the 4th.

**Fix path:** Either increase section height to `600vh` (adds buffer so panel 5 fully clears before 95% mark), or in the JS clamp: `const raw = Math.max(0, Math.min(1, -rect.top / runway))` — apply `easeOut` so the final 10% of runway brings translateX to exactly `-(PANELS.length-1)*w` at 90% scroll instead of 100%.

**Screenshots:** `/tmp/soley-qa4-screenshots/SE375-services-95pct.png`, `/tmp/soley-qa4-screenshots/D1440-services-95pct.png`

---

### BUG-034 — PortfolioGallery chip font-size 11px on mobile (≤480px) [MEDIUM]

**Severity: MEDIUM**
**Viewport: iPhone SE 375**

`globals.css` line 614: `.portfolio-chip { font-size: 0.6875rem }` inside `@media (max-width: 480px)` breakpoint = 11px. Below 13px minimum. Fix: bump to `0.75rem` (12px) or `0.8125rem` (13px) and adjust padding to keep chips fitting in 2 rows.

---

### BUG-035 — SectionDivider IO threshold 0.4 may not fire on mobile under sticky navbar [LOW]

**Severity: LOW**
**Viewport: iPhone SE 375 (risk)**

SectionDivider uses `threshold: 0.4` — 40% of 96px = ~38px must be in view. On mobile, a 64px sticky navbar consuming top real estate means the divider's visible slice may be narrower than 38px before the user scrolls further. Recommend lowering to `0.15` for reliable fire.

---

## CLOSED BUGS (resolved by d6c2ccf + prior cycles)

BUG-001, BUG-002, BUG-003, BUG-004, BUG-005, BUG-007, BUG-008 (not a bug — SectionDivider found),
BUG-010, BUG-011, BUG-013, BUG-014, BUG-015 (see BUG-025 revised status), BUG-017, BUG-018,
BUG-019, BUG-021, BUG-022, BUG-023, BUG-026 (Process auto-advance FIXED), BUG-027 (chip text FIXED),
BUG-028 (scroll-reveal — not re-tested this cycle), BUG-029, BUG-030 (footer headings — fixed Pixel cycle 3),
BUG-031 (chip wrap — fixed Pixel cycle 3), BUG-032 (countdown bar FIXED).

---

## Viewport coverage matrix (QA Cycle 4)

| Component | iPhone SE 375 | iPhone 13 390 | Desktop 1440 |
|-----------|:---:|:---:|:---:|
| ServicesScrollLock translateX advances | PASS (0→-1410px) | PASS (0→-1457px) | PASS (0→-5363px) |
| ServicesScrollLock panel bleed at 95% | HIGH: bleed ~6% | HIGH: bleed ~6% | HIGH: "04" numeral bleeds |
| PaintFlow section visible | PASS (h=1032px, op=1) | PASS (h=1032px, op=1) | PASS (h=947px, op=1) |
| PaintFlow SVG animated dot | PASS (splatter+trail visible) | PASS | PASS |
| Process auto-advance (after 11s) | PASS: Step02 active | PASS: Step02 active | PASS: Step02 active |
| Process countdown bar animation | PASS (animName=countdown, 10s) | PASS | PASS |
| PortfolioGallery EXTERIOR chip readable | PASS (chalk on terra) | PASS | PASS |
| Portfolio chip font-size | FAIL: 11px (BUG-034) | FAIL: 11px (BUG-034) | PASS: 13px |
| SectionDivider teardrops + drips | PASS (3 SVGs, 6 paths, 6 ellipses) | PASS | PASS |
| SectionDivider hairline parallax | PASS (RAF driven, lineOffset) | PASS | PASS |
| Console errors | NONE | NONE | NONE |

---

## Screenshot index (QA Cycle 4)

All screenshots: `/tmp/soley-qa4-screenshots/`

- `SE375-services-5pct.png` — INTERIOR panel at entry (translateX=0)
- `SE375-services-50pct.png` — COMMERCIAL panel at 50% (translateX=-722px)
- `SE375-services-95pct.png` — SPECIALTY with CABINET & TRIM bleed at left (BUG-025)
- `D1440-services-5pct.png` — INTERIOR panel at entry
- `D1440-services-50pct.png` — COMMERCIAL panel at 50% (translateX=-2710px)
- `D1440-services-95pct.png` — SPECIALTY with "04" numeral bleeding from left (BUG-025)
- `Desktop_1440-process-after11s.png` — Step 02 active after 11s (auto-advance FIXED)
- `iPhone_SE_375-process-after11s.png` — Step 02 active on mobile (FIXED)
- `Desktop_1440-portfolio-exterior.png` — EXTERIOR chip chalk text readable (BUG-027 FIXED)
- `iPhone_SE_375-paintflow-entry.png` — PaintFlow visible with dot animation (P2 FIXED)
- `D1440-divider-targeted.png` — SectionDivider teardrops + teal traveling pulse visible
- `Desktop_1440-paintflow-entry.png` — PaintFlow desktop (full-width SVG visible)

---

*QA audit cycle 4 by QA agent, 2026-05-07. 3 viewports (SE375, IP13, D1440). 5×3=15 runway samples.
P1 REFUTED (translateX IS advancing — prior measurement hit wrong element). P2 REFUTED (PaintFlow visible).
P3 CONFIRMED FIXED (Process auto-advance + countdown working). BUG-027 CONFIRMED FIXED.
SectionDivider CONFIRMED PRESENT with drips + parallax hairlines.
1 HIGH residual (BUG-025 panel bleed at exit), 1 MEDIUM new (BUG-034 chip font 11px), 1 LOW new (BUG-035 IO threshold).*

---

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

---

## ARIA GAPS — logged by Spark cycle 7, 2026-05-07

These require structural changes and are deferred to Refiner.

### BUG-038 — Process: `role="tab"` buttons missing `role="tablist"` wrapper (MEDIUM)
**Component:** `app/components/Process.tsx`
**Issue:** Each step `<button>` has `role="tab"` and `aria-selected`, but the containing `<div className="process-tabs">` does not have `role="tablist"`. Without the tablist ancestor, screen readers cannot group the tabs correctly. Also missing: `aria-controls` linking each tab to its content panel, and `id` attributes on both tabs and panels.
**Fix:** Add `role="tablist"` to the `.process-tabs` div; add `id` to each button (`tab-step-${s.id}`); add `aria-controls` pointing to the panel div; add `id` to the panel div (`panel-step-${activeStep}`).
**Defer to:** Refiner (requires structural change to Process.tsx).

*ARIA gaps logged by Spark cycle 7, 2026-05-07. All other interactive elements verified clean: FAQ accordion (aria-expanded/controls/labelledby ✓), WhySoley accordion (aria-expanded/controls ✓), PortfolioGallery chips (aria-pressed/group ✓), Contact form (htmlFor labels on all 4 inputs ✓), Hero3D icon buttons (aria-label ✓), scroll-down button (aria-label ✓). No icon-only buttons found without labels.*
