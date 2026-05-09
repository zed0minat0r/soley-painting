# AUDIT.md — Soley Painting
**Cycle:** 9 (Nigel)
**Date:** 2026-05-07
**Axis:** micro-interactions
**Auditor:** Nigel
**Live URL:** https://soley-painting.vercel.app

---

## Cycle 9 Evidence Summary

Full live HTML pulled (198 kB). All findings derived from actual SSR HTML + source file inspection. Verified: section structure, JSON-LD, dividers, scroll-lock panels, countdown bar, hero, footer, Contact duplication bug.

---

## 12-Feature Catalog Score

| # | Catalog Item | Status | Notes |
|---|---|---|---|
| 1 | Custom 3D / WebGL hero centerpiece | PASS (approved equiv) | SVG signature reveal (Sacramento font, stroke-dashoffset). User-approved per standing note. Hero canvas-wrap `min(640px, 92vw)` aspect-ratio 16/7. Paint-drop SVG with animateTransform confirmed. Particle drift divs confirmed (10 elements). H1 `.glow-hero` confirmed. |
| 2 | Brand palette threaded through everything | PASS | Terracotta/teal/chalk/slate/clay-gold propagated across all sections. 3-layer text glow on H1 confirmed: `0 0 1px #fff, 0 0 10px rgba(194,96,58,0.75), 0 0 28px rgba(45,122,112,0.45)`. Panel accent bar rotation (terra/teal/gold/chalk/terra) confirmed. |
| 3 | Section dividers with motion | PASS | 8 dividers confirmed (page.tsx structure + HTML). Each: 96px height container, 2 IO-gated hairline gradients (opacity:0 SSR state, transition:opacity 0.6s on IO entry), 3 teardrop-path SVGs with `<ellipse>` + `<path>` per drop, animateTransform `type="translate"` with varying dur (9s/10s/11.5s/13s) for float animation. Correction from Nigel cycle 8 which incorrectly scored this FAIL. |
| 4 | Horizontal scroll-lock (5 panels) | PASS with caveat | 5 panels confirmed, each `width:100vw; height:100vh; overflow:hidden`. JS translateX handler confirmed working all 3 viewports (QA cycle 8, d9582a0). Panel h2 uses `clamp(2.5rem, 5.5vw, 5.5rem)` — at 375px resolves to 40px (fine). Sticky container is 100vh (not 100dvh) but BUG-025 closed via overflow:hidden containment — QA confirmed no bleed. Caveat: very slight panel-to-panel rhythm break at slow-scroll entry (dead zone fully resolved per 0316c52). |
| 5 | PaintFlow animated diagram | PASS | Section present (9 SVG elements, 12 circle elements). QA cycle 8 confirmed: JS RAF loop advances circle cx attributes at runtime. SSR HTML shows static cx values (expected — RAF runs client-side). Splatter burst, ghost trail, node pulse, chalk stroke border all in source. Catalog item fulfilled: animated dots travel path at runtime. |
| 6 | LiveEstimate auto-typing sequence | PARTIAL — STRUCTURAL BUG | Typing demo section present (pos 152863). Contact.tsx ALSO imports and renders `<LiveEstimate />` internally. page.tsx renders `<LiveEstimate />` as standalone BEFORE Contact. Result: two `id="live-estimate"` sections in the DOM — invalid HTML (duplicate IDs) and visible duplication: a buyer scrolling sees the LiveEstimate section twice. The standalone instance (pos 152863) appears to contain the description text. The Contact-embedded instance (pos 168035) renders the actual typing demo alongside the contact form. Fix: remove the standalone `<LiveEstimate />` from page.tsx — Contact.tsx handles it. |
| 7 | Auto-advancing process timeline | PASS | 5 tabs with tablist/tabpanel/aria-controls confirmed. Countdown bar confirmed in source: inline style `animation: none` in SSR (visible=false), activates to `animation: countdown 10000ms linear forwards` client-side. QA cycle 8 confirmed auto-advance fires. Char-stagger confirmed (split('') with animation-delay). ARIA fix (BUG-038) confirmed closed. |
| 8 | 3-layer text glow | PASS | `.glow-hero` on H1 confirmed. 3-layer structure per catalog spec. |
| 9 | CSS scroll reveals | PASS | 34 `.scroll-reveal` elements in HTML. IO pattern confirmed. |
| 10 | Tilt cards / hover depth | PASS | WhySoley 4 cards with `perspective:800px`. Mobile accordion with aria-expanded confirmed (9 instances — includes FAQ accordion). |
| 11 | Social as text link in bottom bar | PASS (pre-launch) | Footer bottom bar: "Social channels coming soon" — honest pre-launch framing per RULE 7 and catalog standing note. Renders as small uppercase tracked text in correct bottom-bar position. |
| 12 | Constant-speed rotation | N/A | R3F removed. SVG signature replaces it — approved equivalent has no rotation axis to audit. |

**Catalog score: 9/12 full passes, 1 partial (LiveEstimate structural bug), 2 N/A. Up from 6/12 in cycle 8.**

---

## Section Scores

### Hero (Catalog #1, #2, #8, #12)
**Score: 7.0/10**

Canvas-wrap at `min(640px, 92vw)` 16:7 aspect ratio — significantly larger than the 280px in cycle 8. Paint-drop float animation (animateTransform) adds craft-appropriate ambient motion. 10 particle drift divs add depth. H1 at `clamp(2.75rem, 7vw, 6.5rem)` is commanding. Three-layer glow confirmed.

Gap remaining: the chalk card background reads slightly clinical against the warm umber section. The SVG signature card box-shadow (`0 32px 80px rgba(0,0,0,0.55)`) is strong but the chalk white surface still reads as a flat tile rather than a studio centerpiece. A real buyer lands here and notices it's a logo reveal, not a 3D object — the "wow" is moderate, not visceral. For a pre-launch site without photography this is the right level. No false positives from prior cycle repeated here.

### ServicesScrollLock (Catalog #4, #10)
**Score: 7.5/10**

JS handler confirmed correct. Panel overflow contained. Accent bar rotation (4px, full-width, rotating palette) confirmed. Panel h2 clamp correct. Tilt cards: not detected in HTML on panels — the WhySoley section has tilt cards; ServicesScrollLock panels appear to use bullet lists not tilt card depth. This is a catalog gap: catalog #10 specifies tilt on mousemove for service cards. Panels have bullets and CTAs but no perspective tilt observable in source. Subtract 0.5 for absent panel tilt.

### PaintFlow (Catalog #5)
**Score: 7.0/10**

Fully implemented per QA confirmation. Chalk stroke border, node pulse, splatter burst, ghost trail all in source. The visual register (dark umber, chalk strokes, terracotta dots) is consistent with the brand. From a buyer's perspective this reads as "something moves when I scroll to it" — which is precisely the right register for a craft brand. Up from 5.5/10 in cycle 8 (was wrongly scored as static).

### LiveEstimate (Catalog #6)
**Score: 5.5/10**

The structural duplication is the primary issue: `id="live-estimate"` appears twice. A buyer scrolling encounters the LiveEstimate content in two locations — once before Contact, once embedded in Contact. This reads as a layout mistake regardless of intent. Fix is one-line: remove the standalone `<LiveEstimate />` from page.tsx (line 38). Contact.tsx already wraps it. Until fixed: the duplicated section undermines the pre-launch polish claim.

The typing simulation itself (when it fires client-side) is honest and specific. The card copy is clear. The "Example — how your request looks" eyebrow frame is correct.

### Process Timeline (Catalog #7)
**Score: 7.5/10**

Countdown bar confirmed. Char-stagger confirmed. ARIA tablist/tabpanel complete. 5 steps, honest copy. This is one of the strongest sections. No issues detected in this cycle.

### WhySoley Cards (Catalog #10)
**Score: 7.5/10**

Perspective tilt at 800px. Four honest card bodies (two-coat primer, single contact, line-item invoice, low-VOC). Mobile accordion present. Font sizes all 0.8125rem (13px) — passes floor. Strong section.

### PortfolioGallery
**Score: 6.0/10**

Filter chips confirmed (ALL/INTERIOR/EXTERIOR/COMMERCIAL/CABINET & TRIM/SPECIALTY). Nine placeholder tiles. Honest "Photography forthcoming" overlays. BUG-037 portfolio H2 font confirmed Cormorant Garamond (Pixel cycle 8 fix). Badge font confirmed 13px after BUG-034/046 fixes. Portfolio reads as a wireframe without real photography — this is honest but limits the section's contribution to buyer confidence.

### FAQ
**Score: 7.0/10**

9 questions confirmed (6 original + 3 scope-clarity additions from Builder cycle 8). Aria-expanded accordion confirmed. Umber background, chevron animation. The 3 scope-clarity questions (drywall, wallpaper, color matching) significantly improve the honest scope setting. Strong section for pre-launch.

### FounderBlock
**Score: 6.0/10**

Present. Owner-takes-calls-before-8pm and same-crew-start-to-finish operational specifics confirmed. Portrait placeholder honest. Reads as text-heavy without photography anchor. No fabricated name or credential — correct.

### Contact
**Score: 6.5/10**

Four-field form (name, phone, email, message) confirmed. Submit button present. Left column commitment copy confirmed. The contact section is correctly structured. Minus 0.5: no Formspree/action endpoint visible in form (form may silently fail on submit). Formspree integration is a pre-launch dependency.

### Footer
**Score: 6.5/10**

Four-column structure. Copyright 2026 confirmed. "Social channels coming soon" in correct position. Font sizes: 0.875rem on links (14px — pass), 0.8125rem on small labels (13px — pass, BUG-046 fix confirmed). Clean, honest. Not a remarkable footer but correct.

### Section Dividers (Catalog #3)
**Score: 8.0/10**

This is a significant correction from cycle 8's FAIL. 8 dividers confirmed between all major sections. Each has: hairline gradient pair (terracotta and teal, IO-gated), 3 teardrop-path SVGs in brand colors (terracotta/teal/clay-gold), animateTransform float animation with varying durations (staggered cadence). This is a well-executed catalog item. Drop 2 points from max because the IO gating means a user who scrolls quickly past may not see the animation fire, but this is a minor UX caveat.

### SEO Layer (New this cycle — Builder cycle 8, c74a48f/32051d8)
**Score: 7.5/10**

JSON-LD confirmed: 6 structured data blocks (LocalBusiness + 5 Service + FAQPage schema). Canonical confirmed. OG title/description/type/locale/site_name confirmed. Twitter card confirmed. robots.ts and sitemap.ts confirmed as Next.js static routes. No fabricated address/phone/hours/ratings — correct. The LocalBusiness schema has `addressCountry:US` only (no fake address) — honest. FAQPage schema draws from the live 9 FAQ items. Strong foundation for search indexing post-launch.

---

## Overall Score

**6.9 / 10**

This is a materially stronger site than cycle 8's 6.2. The false positives in cycle 8 (section dividers absent, PaintFlow static, countdown bar missing) are all corrected by evidence. Real gaps are now narrower:

The site has all 12 catalog features in some form. Eight pass outright. The primary remaining quality gap is the LiveEstimate structural duplication (one-line fix). Secondary gaps are: no real photography (limits buyer confidence on portfolio/founder), no social handle (pre-launch honest), no Formspree endpoint (form silently fails).

From a 90-second buyer scan: the scroll-lock services section is impressive, the FAQ is thorough, the process timeline auto-advances, and the brand palette is consistent. The hero signature reveal is distinctive. A buyer comparing this to a basic WordPress painter site would find this significantly more polished and trustworthy. The cap at 7.5 is appropriate until photography + reviews + address land. Current 6.9 reflects the gap accurately.

---

## Top 5 Priorities for Next Session

1. **DUPLICATE LiveEstimate (ONE-LINE FIX — BUG-044):** Remove line 38 from page.tsx (`<LiveEstimate />`). Contact.tsx already renders LiveEstimate internally. The standalone instance creates two `id="live-estimate"` sections and a visible layout repeat. Builder can close this in under 5 minutes.

2. **ServicesScrollLock panel tilt cards:** Catalog #10 specifies `perspective:800px, rotateX/Y on mousemove` on service panel cards. The panels have bullets and CTAs but no tilt interaction. Add `onMouseMove` tilt (±8°) to each panel's inner card div — same pattern as WhySoley. This elevates the scroll-lock section from 7.5 to potentially 8.5.

3. **Contact form Formspree endpoint:** The contact form submits to no endpoint. A buyer who fills in name/email/message and clicks "Request Free Walkthrough" will get no confirmation and no email will be received. Add Formspree action URL to the form element before launch — this is a conversion blocker.

4. **Hero visual weight (ServicesMarquee visible?):** The ServicesMarquee component exists in page.tsx above ServicesScrollLock. Confirm it renders visibly below the hero. A scrolling marquee reinforcing the 5 service names + palette colors immediately after the hero is a buyer signal that this is a full-service outfit. Verify it's not hidden or zero-height.

5. **PaintFlow mobile layout (BUG-036 residual):** Refiner's commit (e81b122) reduced padding and node size for mobile. QA cycle 8 confirmed fix. However the section is still the tallest non-scroll-locked section at roughly 636px on SE375. Verify the diagram SVG is not clipping on 375px — the horizontal diagram may need a different layout on narrow viewports (e.g., vertical node stack with vertical path).

---

## Pre-Launch Hard Cap

Score capped at 7.5 until: real photography lands (portfolio + founder portrait), real reviews or testimonials present, real service area or address confirmed, Formspree endpoint active. Current pre-launch framing is honest throughout. Do not fabricate any of these.

---

## Overnight Cycle Progression Summary

| Cycle | Agent | Key Deliverable |
|---|---|---|
| Coord 7 | Coordinator | BUG-025 containment recipe assigned |
| Spark 7 | Spark | BUG-025 CSS containment (100dvh attempt + overflow:hidden + clamp h2), font floor bumps |
| Builder 7 | Builder | 3 scope-clarity FAQ items (total 9 questions) |
| QA 8 | QA | BUG-025 CONFIRMED CLOSED, PaintFlow RAF CONFIRMED, countdown CONFIRMED, FAQ 9 CONFIRMED, BUG-043 SectionDivider new LOW |
| Refiner 7 | Refiner | BUG-043 closed: 8 SectionDivider placements, panel accent bars upgraded to 4px full-width |
| Coord 8 | Coordinator | SEO foundation layer + font verification assigned |
| Builder 8 | Builder | JSON-LD LocalBusiness + 5×Service + FAQPage schemas, robots.ts, sitemap.ts, expanded OG/Twitter metadata |
| Pixel 8 | Pixel | BUG-046: Contact labels + WhySoley card numbers + Footer social span font floor bumped to 13px |
| Nigel 9 (this) | Nigel | Axis: micro-interactions. Score: 6.9. Found: LiveEstimate duplicate (BUG-044). Corrected: dividers, PaintFlow, countdown bar all CONFIRMED present. |
