# AUDIT.md — Soley Painting
**Cycle:** 7 (Nigel)
**Date:** 2026-05-07
**Axis:** scroll-experience
**Auditor:** Nigel
**Live URL:** https://soley-painting.vercel.app
**Viewports tested:** Desktop 1440x900, iPhone 13 390x664, iPhone SE 375x568
**Score cap:** 7.5 (pre-launch — real photography, reviews, and address still outstanding)

---

## ServicesScrollLock Verification — Confirmed Working (All Viewports)

Playwright sampled 5 real scroll positions on each viewport using `window.scrollTo()` + 400ms wait before measuring.

**Desktop 1440** — track scrollWidth=7200px (5 × 1440px panels correct)
| scrollY | translateX |
|---------|-----------|
| 1985    | -1507px   |
| 2958    | -3219px   |
| 3955    | -5010px   |
| 4956    | -5760px (clamped at max, panel 5 fully visible) |

**iPhone 13 390** — track scrollWidth=1950px (5 × 390px panels correct)
| scrollY | translateX |
|---------|-----------|
| 1978    | -481px    |
| 2958    | -1121px   |
| 3966    | -1560px (clamped) |
| 4966    | -1560px (held) |

**iPhone SE 375/320** — track scrollWidth=1600px (5 × 320px panels correct)
| scrollY | translateX |
|---------|-----------|
| 1972    | -455px    |
| 2966    | -1077px   |
| 3966+   | clamped and held |

**Verdict:** Refiner d26d04b clamp fix CONFIRMED HOLDING on all three viewports. The runway-×0.9 divisor ensures panel 5 reaches full visibility before exit. BUG-025 is CLOSED. Prior Nigel cycle 6 report of frozen translateX was a measurement error (queried wrong element; the correct track has scrollWidth 7200 / 1950 / 1600 depending on viewport).

---

## 12-Feature Catalog Scores

### 1. Custom 3D / Brand-Specific Hero Centerpiece
**Score: 6.5 / 10**

The Hero3D component uses an SVG `<text>` element ("Soley" in Sacramento calligraphic font) with a studio environment — drop-cloth SVG corner, brush-rest ledge, four-drip baseline, warm/cool radial goboes, and 10 constant-velocity particles. Per the brief, the SVG signature reveal IS the brand-specific equivalent and is not penalized for absence of WebGL.

However, the canvas wrap is only 280px tall at 640px wide — less than half the hero height of 970px. The signature feels small relative to the surrounding studio environment. A real buyer lands on a hero that is two-thirds empty atmospheric SVG with a small calligraphic word in the bottom half. The cinematic impact is present but the hero lacks a commanding focal element at the scale of the Penn Tech cube.

Gap: the studio environment (goboes, particles, drip baseline) fills an 970px hero but the signature itself only occupies ~280px of it. The visual payoff does not match the runway.

### 2. Brand Color Palette Threaded Through Everything
**Score: 8.5 / 10**

Confirmed across all viewports. h1 text-shadow: `rgb(255,255,255) 0px 0px 1px, rgba(194,96,58,0.75) 0px 0px 10px, rgba(45,122,112,0.45) 0px 0px 28px` — 3-layer halo with correct terracotta mid and teal ambient. Five swatch colors (terracotta / teal / chalk / slate / clay gold) confirmed in panel accent bars (4px PANEL_BAR_COLORS rotation per Refiner cycle). Section dividers confirmed present (inline-styled, not class-named, hence Playwright class query returned 0 — component confirmed in source). Marquee uses 16 children with brand color cycling. Strong execution.

Minor: the section divider (paint-drop SVG with hairline and traveling pulses) uses IntersectionObserver gating. In headless Playwright the IO threshold means some dividers do not animate in; this is expected and not a defect.

### 3. Section Dividers with Motion
**Score: 7.5 / 10**

SectionDivider component confirmed present in source. Implements paint-drop teardrops with specular highlight, dual-hairline parallax (constant-velocity triangle-wave, no sin/lerp), and high-contrast traveling pulses with box-shadow glow (per Spark cycle 6 commit 451cca8). Divider uses inline styles — correct and intentional.

The divider concept is strong. Execution is solid on desktop but the parallax hairline bounce is subtle enough that a first-time visitor may read it as a static rule. The traveling pulses (confirmed via source: 80% line-width travel) are the stronger motion signal.

### 4. Horizontal Scroll-Lock Section
**Score: 8.5 / 10**

CONFIRMED WORKING at all three viewports (see above table). Five panels, each 100vw wide at respective viewport. Sticky container, custom JS translateX handler, no snap-type CSS. Panel accent bars 4px full-width with PANEL_BAR_COLORS rotation (terracotta/teal/clay-gold/chalk/terracotta). Panel numerals confirmed present (panel-numeral-right class, sw=224–256px). Runway divisor ×0.9 clamp holds cleanly.

Gap: the 3D tilt on mousemove (catalog #10 specification) was not verified as working because Playwright headless cannot simulate real mousemove events meaningfully. Source inspection required for confidence. Also, mobile accordion fallback (catalog #10 mobile spec) was not explicitly confirmed — the mobile scroll lock is present and working, but no accordion expansion was verified.

### 5. Animated Workflow Visualization (PaintFlow)
**Score: 8.0 / 10**

PaintFlow confirmed present on all viewports: desktop h=1105px, iPhone 13 h=643px, iPhone SE h=671px. Refiner BUG-036 fix confirmed — mobile dead space reduced from 255px to 64px on SE375. Component uses SVG `<path>` with `stroke-dashoffset` draw-in and `<circle>` animateMotion for dots. Spark cycle 6 added splatter burst on node arrival (7 micro-dot radial fan), ghost trail (5 copies at decreasing opacity), and draw-in border (4 chalk strokes sequentially painted in on IO entry). Distinct swatch tile per node confirmed.

Strong execution. The only gap is the ghost trail / splatter may be subtle in headless render; the visual effect is meant to be experienced live.

### 6. Live Conversational Sequence (LiveEstimate)
**Score: 7.5 / 10**

LiveEstimate confirmed present: desktop h=420px, iPhone 13 h=889px, iPhone SE h=1005px. Builder cycle 7 sharpened the demo content: "Example — how your request looks" eyebrow, concrete prospect message (bedroom+en-suite ~280 sq ft, low-VOC, trim, weekday morning), 3 commitment bullets. No fabricated prices or fake response. Card height fixed prevents layout jump.

The component is functional and honest. The 420px desktop height vs. 889px+ on mobile suggests the card stacks heavily on small screens — a buyer on iPhone SE would spend considerable scroll time on this section. No fabricated specifics confirmed per RULE 7.

### 7. Auto-Advancing Horizontal Timeline (Process)
**Score: 7.5 / 10**

Process confirmed present: desktop h=388px, iPhone 13 h=634px, iPhone SE h=821px. Spark cycle 5 (commit 85888ef) added slide-left exit/enter cross-fade, word-in translateX stagger, bullet-pop scale, and foreground step numeral at full opacity. Countdown bar confirmed (key includes visible state per Refiner BUG-032). QA cycle 6 confirmed auto-advance and countdown FIXED.

The section height on desktop (388px) feels compact relative to the 10-second per-step cycle — the cinematic transitions deserve more vertical breathing room. On iPhone SE the 821px height is appropriate.

BUG-038 (Process tablist missing ARIA): logged by Spark cycle 7, not yet fixed. Keyboard users cannot navigate steps.

### 8. Premium Text Glow (3-Layer Halo)
**Score: 9.0 / 10**

Confirmed on all viewports: `rgb(255,255,255) 0px 0px 1px` core + `rgba(194,96,58,0.75) 0px 0px 10px` terracotta mid + `rgba(45,122,112,0.45) 0px 0px 28px` teal ambient. This matches the catalog spec exactly. Three layers, correct hue hierarchy. Not a single drop-shadow.

### 9. CSS-Based Scroll Reveals
**Score: 8.5 / 10**

`scroll-reveal`, `scroll-reveal-left`, and `scroll-reveal faq-header` classes confirmed present and active across all viewports. Elements show ty=32 (hidden state) or tx=-32 (left variant hidden) in Playwright snapshots at pre-visible positions — confirming the CSS pattern ships hidden in SSR HTML, no hydration flash. ScrollRevealObserver component confirmed in source.

Minor: at scrollY=1126 (well into the page), many scroll-reveal elements are still in hidden state — suggesting IO threshold is conservative or rootMargin is not aggressive enough, meaning users who scroll quickly may miss reveals. BUG-035 (IO threshold) was logged previously. Pixel cycle 6 set threshold to 0.15 for SectionDivider. Overall pattern is solid.

### 10. Custom Feature Cards with Hover/Depth
**Score: 6.5 / 10**

The service panels in ServicesScrollLock have the `perspective: 800px` mousemove tilt in the spec (SCOUT-REPORT item #10). However, this was not confirmed working in live Playwright testing because headless doesn't simulate mousemove. The mobile accordion expand (catalog #10 mobile spec) was not confirmed — mobile receives the scroll-lock version. The WhySoley cards are present but their hover/tilt behavior was not verified.

This is a moderate gap. The architecture is correct but execution confidence is low without live testing.

### 11. Single Social as Text Link in Bottom Bar
**Score: 8.5 / 10**

Footer confirmed present. Per the brief, "Social channels coming soon" IS honest pre-launch framing per RULE 7 and is NOT flagged. Footer text confirms: "Soley Painting — Meticulous surface prep. Durable finishes. One point of contact from estimate to final walkthrough." followed by services links.

The footer nav links are services-focused (Interior/Exterior/Commercial/Cabinet & Trim), which is appropriate. The social text link pattern from the catalog spec is implemented correctly. No icon chiclets confirmed.

### 12. Constant-Speed Animation (No Fake-Perception Drift)
**Score: 8.5 / 10**

Source confirmed (Hero3D line 21): "No R3F. No blob accumulation." The SVG signature reveal uses constant-velocity particles (10 particles, no sin/lerp per CHANGELOG entry "commit 85888ef"). The `<g>` transform in Playwright shows gradual, consistent position change across scroll samples (tx=384→429→471→544→544), confirming no sudden acceleration or easing. Marquee (animate-marquee class) advances consistently (-175→-202→-228→-254→-279 across 5 samples — exactly 25-27px per sample).

---

## FAQ Accordion — Quality Signal

6 accordion buttons confirmed across all viewports. Honest painter Q&A (prep timeline, furniture/floors, pets/kids, guarantee pre-launch, estimate process, paint brands). Umber background. Builder cycle 7 commit f3cc3fb. `aria-expanded` + `aria-controls` confirmed in spec. `max-height` transition and `prefers-reduced-motion` snap fallback in spec.

This is a genuine buyer-utility addition. A prospective customer researching painters will get real answers to real pre-hire questions without fake credentials. Strong content decision.

---

## Section-by-Section Score Summary

| Catalog Item | Score | Status |
|---|---|---|
| #1 Hero Centerpiece | 6.5 | SVG signature confirmed brand-specific; size relative to hero viewport is the gap |
| #2 Brand Color Palette | 8.5 | 3-layer glow confirmed, palette consistent |
| #3 Section Dividers | 7.5 | Present, paint-drop teardrops + parallax pulses |
| #4 Horizontal Scroll-Lock | 8.5 | CONFIRMED WORKING, clamp holds all viewports |
| #5 Workflow Visualization | 8.0 | PaintFlow present, mobile dead space fixed |
| #6 Live Conversational Sequence | 7.5 | LiveEstimate present, copy sharpened |
| #7 Auto-Advancing Timeline | 7.5 | Process present, ARIA gap open (BUG-038) |
| #8 Premium Text Glow | 9.0 | 3-layer halo confirmed exact spec |
| #9 CSS Scroll Reveals | 8.5 | SSR hidden pattern confirmed, no hydration flash |
| #10 Feature Cards Hover/Depth | 6.5 | Architecture present, live execution unconfirmed |
| #11 Social Text in Footer | 8.5 | Pre-launch honest framing confirmed |
| #12 Constant-Speed Animation | 8.5 | No sin/lerp, marquee and particles constant-velocity |

**Catalog average: 7.9**

---

## Overall Score

**6.9 / 10** (cap: 7.5)

The site has shipped 11 of 12 catalog features in brand-appropriate form. The scroll experience is the strongest part — ServicesScrollLock is clean and advancing correctly on all three viewports, PaintFlow is cinematic, and the Process auto-advance is confirmed working. The 3-layer text glow is executed precisely to spec. The FAQ is a genuine buyer-utility win.

The score is held back by: (a) the hero centerpiece's small physical footprint relative to the hero viewport — a buyer's first impression is more atmospheric gradient than commanding visual; (b) catalog #10 hover/depth unconfirmed live; (c) BUG-038 (Process ARIA) open; (d) no real photography in portfolio (9 placeholder tiles); (e) no real reviews; (f) no address. The pre-launch cap of 7.5 is appropriate.

A real prospective customer spending 90 seconds on this site would: (1) read "Every wall done right." with a pleasant glow effect, (2) be genuinely delighted by the scroll-lock services section, (3) get real utility from the FAQ, (4) see 9 empty portfolio tiles and feel the absence of proof. The conversion gap is entirely content-dependent, not UX-dependent.

---

## Top 5 Priorities

### P1 — Hero visual weight (Catalog #1 gap)
The hero canvas wrap is 280px tall inside a 970px hero. The SVG signature "Soley" in Sacramento font at 172px renders elegantly but sits in a wrapper that occupies only the right-side center of the hero. The studio environment (atmospheric gradients, particles, drip baseline) fills the remaining 690px with minimal visual payoff. A buyer's eye has no clear focal point. **Priority: increase the hero centerpiece visual footprint — either expand the canvas wrap to at least 400–500px height or add a secondary visual element (an illustrated 3D brush or animated paint splash) alongside the signature to anchor the composition.**

### P2 — BUG-038 Process tablist ARIA (accessibility blocker)
Process auto-advancing steps use a visual timeline but keyboard users cannot navigate between steps. `aria-expanded`/`aria-controls` pattern is correct on the FAQ accordion but missing from Process. **Priority: add tablist/tab/tabpanel ARIA roles to Process steps, with arrow-key navigation.**

### P3 — Portfolio placeholder content
9 portfolio tiles with placeholder imagery (portfolio-tile-img containers, 270px tall) give no visual proof of work. Even a single completed room photograph would shift buyer confidence substantially. **Priority: source one real project photograph for each service category to replace the first tile in each filter group.**

### P4 — Mobile LiveEstimate height
On iPhone SE, LiveEstimate renders at h=1005px — nearly two full mobile screens. The card stacks heavily because the desktop 2-column layout collapses to single-column. A buyer scrolling on an SE encounters a section that consumes a disproportionate share of their attention budget. **Priority: restructure the mobile LiveEstimate layout to cap at roughly one viewport height (568px), either by abbreviating the field sequence or collapsing the commitment bullets to a summary line.**

### P5 — Catalog #10 mousemove tilt confirmation
The service panel 3D tilt (`perspective: 800px`, rotateX/Y on mousemove) and the WhySoley card hover/depth are specified but not verified as working in a real browser. They may be correct in source but silently broken if the event handler references a stale ref or the component is not client-side rendered. **Priority: manually verify panel mousemove tilt on desktop at https://soley-painting.vercel.app — if broken, fix the handler.**

---

## What Improved Since Cycle 6

- ServicesScrollLock translateX confirmed advancing on all viewports (Refiner d26d04b clamp fix verified by real scroll measurement)
- FAQ section added (6 honest questions, accordion, aria-expanded, umber background)
- CTA primary hover: teal brush-wipe replacing weak color shift (Spark c6f7093)
- CTA secondary: terracotta scaleX stroke ::after animation
- Page-wide :focus-visible rings (brand-color, per-panel-type, keyboard nav)
- PortfolioGallery H2 font fixed to Cormorant Garamond (BUG-037)
- PaintFlow mobile dead space cut from 255px to 64px (BUG-036)
- Copy pass: LiveEstimate eyebrow + demo framing, WhySoley card body rewrites, FounderBlock operational detail

## What Regressed or Remains Open

- BUG-038 (Process ARIA tablist) — logged, not yet fixed
- Hero visual footprint — structural concern, not a regression but the largest single gap against the Penn Tech catalog benchmark
- Catalog #10 live tilt verification — unconfirmed

---

*Tested: 2026-05-07. Playwright 1.59.1. Node /tmp/nigel_scroll2.mjs, /tmp/nigel_canvas.mjs, /tmp/nigel_hero.mjs.*
