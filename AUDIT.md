# AUDIT.md — Soley Painting
**Cycle:** 11 (Nigel)
**Date:** 2026-05-07
**Axis:** micro-interactions
**Auditor:** Nigel
**Score:** 6.8 / 10 (cap 7.5 pre-launch)

---

## Scoring rubric reminder
5.0 = average | 6.0 = generic | 7.0 = better than most | 8.0 = I would choose this over competitors | 9.0+ = exceptional

---

## Overall verdict

The site has genuine bones — a custom SVG icon-cycling hero, a working horizontal scroll-lock on desktop, an honest brand voice, and a well-populated section structure. But a real prospective customer landing on this site on their phone sees vast stretches of empty linen. Four scroll-reveal elements remain permanently stuck at opacity:0 after a full scroll-to-bottom pass, and the ServicesScrollLock is completely broken on mobile (panel width 195px instead of 390px, track frozen at -97.5px across all 5 runway positions). These are not cosmetic issues — they are content voids that destroy credibility before a user reaches the contact form.

Since last audit (cycle 10, 7.0): the icon system improved (Spark cycles 8+9 delivered recognisable smiley/house/bucket/star/heart paths, slowed to 1.9s, strokeWidth 4.5). NotifySignup landed cleanly between FAQ and Process. PortfolioGallery stagger animation shipped. The net is a wash: feature additions are offset by a recurring mobile scroll-lock regression and the unresolved 4-element scroll-reveal failure on both desktop and mobile.

---

## Penn Tech 12-feature catalog scorecard

| # | Feature | Status | Score |
|---|---------|--------|-------|
| 1 | Custom hero centerpiece (icon cycling) | PASS — 5-icon draw system (smiley/house/bucket/star/heart) animating, dashoffsets confirmed changing, stroke 4.5px, 280×200 viewBox renders at 640px wide on desktop | 8.5 |
| 2 | Brand palette threaded through everything | PASS — Drop Cloth & Rust system (rust/linen/stone/umber/ochre) present. No teal residuals confirmed by Spark sweep. Consistent across visible sections | 7.5 |
| 3 | Section dividers with motion | PARTIAL — SectionDivider instances exist with teardrop SVGs and traveling pulses. However only 2 of 8 placements were firing per QA-65 (BUG-043). Not re-verified post-fix in this cycle but small divider dots visible in full-page screenshot | 6.0 |
| 4 | Horizontal scroll-lock | REGRESSION — Desktop PASSES (translateX 0px → -5760px across 5 positions, correct). Mobile FAILS: iPhone 13 track width 195px (should be 7×390=2730px), translateX frozen at -97.5px across all 5 runway positions. Panel width 195px (half viewport). Broken on every mobile user | 5.0 |
| 5 | Animated workflow (PaintFlow) | PARTIAL — PaintFlow section found (H2: "Wall to finish — nothing skipped"), 19 circles present, SVGs with animateMotion detected. However playwright cannot find animateMotion via querySelector ('PaintFlow SVG not found' error), suggesting the dots may not be travelling. Section height correct. Screenshot shows three small dots (SectionDivider) in that region, not a workflow diagram | 5.5 |
| 6 | Live conversational sequence (LiveEstimate) | PASS — Section present, height 972px desktop, 519px mobile (NotifySignup section). Two email inputs found (Contact form + NotifySignup). LiveEstimate typing simulation section confirmed visible | 7.0 |
| 7 | Auto-advancing timeline (Process) | PARTIAL — Section found, active step confirmed ("01 Free Walkthrough"), char-stagger and slide transitions present per Spark commits. Countdown bar NOT FOUND via Playwright (countdownBarFound: false). Auto-advance firing but bar missing or mis-queried | 6.0 |
| 8 | Premium text glow (3-layer halo) | PASS — Hero H1 textShadow confirmed: rgb(255,255,255) 0 0 1px (core) + rgba(191,91,56,0.75) 0 0 10px (terra mid) + rgba(184,136,74,0.35) 0 0 28px (ochre ambient). Three layers present. Inlined per Refiner BUG-055 fix | 9.0 |
| 9 | CSS scroll reveals | FAIL — 4 elements permanently stuck at opacity:0, no in-view class, on both desktop and mobile after full scroll-to-bottom. 27 total, 4 unresolved. Same failure as cycle 10. WhySoley cards not found via card/Card class query — likely inside those 4 stuck elements | 4.0 |
| 10 | Custom feature cards with hover/depth | PARTIAL — WhySoley mousemove tilt confirmed in prior QA (±7.6°Y/±7.7°X). Card count returned 0 from DOM query this cycle suggesting class name mismatch or hidden behind stuck scroll-reveal. PortfolioGallery filter chips render correctly (44px height, 6 chips), stagger commit shipped but stagger class not detected post-click | 6.0 |
| 11 | Social as text link in bottom bar | INTENTIONAL PLACEHOLDER — "Social channels coming soon" per brief. NotifySignup is the pre-launch trust signal. Not scored against | N/A |
| 12 | Constant-speed rotation / no drift | PASS — Icon cycle uses stroke-dashoffset advancing at constant speed (1.9s per path per Spark commit). No R3F sin/lerp drift. The cycling SVG approach at constant velocity satisfies this catalog item | 8.0 |

---

## Micro-interactions axis (this cycle's focus)

The brief specifically instructs Nigel to evaluate micro-interactions as the fresh axis. Assessment:

**Positive finds:**
- Nav paint-stroke underline (scaleX 0→1 on hover, 1.5px terracotta, 0.28s cubic-bezier) — Spark commit 87d23d7. Clean, brand-appropriate, perceptible.
- ServicesScrollLock accent bars (4px full-width, PANEL_BAR_COLORS rotation) — visible in desktop screenshot.
- CTA button hover: brush-wipe terra→teal background-position slide (0.32s linear). Present per Spark.
- PortfolioGallery chip filter: stagger commit 1bf60e2 shipped, brand-accent left-rail hover. Filter chips render at 44px, correct count.
- WhySoley tilt: ±7.6°/±7.7° confirmed in prior QA, satisfying #10.
- Process bullets: pop-in with translateX(-8px) → in-view per Spark commit.
- Icon cycle brush sprite tracking leading edge.

**Failures / gaps:**
- PortfolioGallery stagger on click: after clicking INTERIOR filter, only 2 items found in grid (down from 72), no stagger class detected. The filter is either collapsing the grid incorrectly or the stagger animation fires and ends before Playwright can detect the class. Visually unverifiable without a video.
- Process countdown bar: not detectable via DOM after 3+ rebuild attempts. Users do not see the depleting progress bar that is the signature of catalog #7.
- PaintFlow dots animateMotion: cannot be confirmed traveling. The section exists but dot animation status ambiguous.
- 4 permanently stuck scroll-reveal elements: the content behind these (likely WhySoley cards, FounderBlock, or Contact right-column) never appears. This is the most damaging micro-interaction failure — the "reveal" interaction simply does not happen.

---

## Section-by-section scores

| Section | Score | Notes |
|---------|-------|-------|
| Hero (icon cycle + glow + atmosphere) | 8.0 | Icon cycling confirmed, 3-layer glow confirmed, 4-drip baseline present, 10-particle atmosphere. Strong. |
| ServicesScrollLock | 6.0 | Desktop works perfectly. Mobile completely broken — frozen track, half-width panels. |
| PaintFlow workflow | 5.5 | Section present, SVG circles exist, animateMotion status ambiguous. Full-page screenshot shows only divider dots at that position. |
| WhySoley | 5.0 | Stuck behind scroll-reveal. Cards not reachable via DOM query. Tilt likely working when visible. |
| FounderBlock | 5.5 | Honest copy, ochre wash, data pills. But may be in stuck scroll-reveal group. |
| PortfolioGallery | 6.5 | 6 filter chips (44px, all 6 categories), stagger commit present. Filter behavior ambiguous post-click. Photography placeholder honest. |
| FAQ | 7.0 | 9 items, accordion correct. Content honest. Clean section. |
| NotifySignup | 7.0 | New this cycle. Clean pre-launch signal between FAQ and Process. Honest copy. 519px mobile height reasonable. |
| Process (timeline) | 6.5 | Auto-advance confirmed, char-stagger present. Countdown bar not detected. |
| Contact | 6.5 | Honest commitments, form present, scroll-reveal issue may be hiding right column. |
| Footer | 6.5 | Social coming-soon intentional. Logo, links, 4-col desktop. |

---

## Top 5 priorities

**P1 (BLOCKER) — ServicesScrollLock mobile: track width and translateX frozen.**
Track resolves to 195px (exactly 50% of 390px viewport) with translateX capped at -97.5px across all 5 runway positions on iPhone 13 and iPhone SE 375. The JS handler reads `stickyRef.clientWidth` but the sticky container appears to report half-width. The panel minWidth is set to 1440px on desktop but not adapting to 390px on mobile — panel count × viewport width should set the track width. This is the signature horizontal scroll feature. It must work on mobile.

**P2 (BLOCKER) — 4 scroll-reveal elements permanently stuck at opacity:0.**
After a full scroll-to-bottom pass (scrollY = body.scrollHeight), 4 of 27 scroll-reveal elements remain at opacity:0, no in-view class. WhySoley cards, FounderBlock details, or Contact form elements are likely among them. A user scrolling at any normal speed will hit blank white voids. The IO rootMargin/threshold fix from BUG-054 helped 37 of 41 elements — the remaining 4 are a second-order problem not yet diagnosed.

**P3 (HIGH) — PaintFlow animateMotion dots: confirm or fix.**
The "Wall to finish" section exists but dot travel cannot be confirmed via Playwright. The full-page screenshot at that region shows only the SectionDivider dots. If animateMotion is not firing (e.g. SVG inside a hidden overflow container, or IO not triggering the animation start), catalog #5 is a blank diagram.

**P4 (HIGH) — Process countdown bar: not detectable.**
The auto-advancing timeline fires correctly (active step confirmed), but the depleting progress bar — which is the distinguishing visual element of catalog #7 over a static list — is not found via DOM query. If it has the wrong class or is hidden behind a scroll-reveal, users never see it.

**P5 (MEDIUM) — PortfolioGallery stagger animation: verify post-click.**
After clicking INTERIOR filter, the grid reduced to 2 items with no stagger class visible. Either the grid is collapsing incorrectly (all tiles hidden including matching ones) or the stagger class fires and clears so fast Playwright misses it. A slow-motion click test or console.log in the stagger handler would confirm.

---

## What improved since cycle 10 (score: 7.0)

- Icon cycling quality: smiley/house/bucket/star/heart paths are distinctly recognisable now. The earlier abstract paintbrush and paint-can were icon-shaped noise; these five are actual pictographs. StrokeWidth 4.5 reads at hero scale. The 1.9s timing feels considered without being slow.
- NotifySignup: clean addition. Pre-launch framing ("Be the first to book") is honest and useful. Slots correctly between FAQ and Process. Two email inputs on page (form + notify) — structurally sound.
- PortfolioGallery stagger commit shipped (1bf60e2). Brand-accent left-rail hover and stagger-animation intent are present even if not fully confirmed.
- Hero atmosphere SVG (drips, particles) confirmed clean of teal residuals.

## What regressed or remained broken since cycle 10

- ServicesScrollLock mobile: was broken at 7.0, still broken at 6.8. Despite multiple Refiner passes (d6c2ccf, 0316c52, 37c5f5f), mobile track width resolves to 50% viewport.
- Scroll-reveal count reduced from 41 stuck → 4 stuck (progress) but 4 remaining failures are significant — they blank out entire sections.
- No real photography, no real reviews, no address. Pre-launch cap binding (7.5 max). These are user-controlled inputs, not agent failures — noted for context only.

---

## Score: 6.8

Down 0.2 from cycle 10's 7.0. The icon improvements and NotifySignup are genuine gains, but the ServicesScrollLock mobile regression (unchanged across 4 Refiner cycles) and the 4 permanently-stuck scroll-reveal elements drag the buyer experience below the prior mark. A real customer on iPhone sees blank voids where WhySoley and FounderBlock should be, and gets a frozen services section. That is not a 7.0 experience.
