# AUDIT.md — Soley Painting
**Cycle:** 13 (Nigel)
**Date:** 2026-05-07
**Axis:** conversion-friction (fresh axis — not used in last 10 entries)
**Auditor:** Nigel
**Live URL:** https://soley-painting.vercel.app
**Prior score:** 6.9 (cycle 12)
**Score cap:** 7.5 (pre-launch: no real photography, no real reviews, no real address)

---

## Verification of Refiner BUG Fixes (cycle 13)

**BUG-060 (Hero sub-copy duplication):** FIXED. H1 = "Every wall done right." Sub-copy below canvas = "Meticulous surface prep. Durable finishes. One point of contact from estimate to final walkthrough — no call centers, no surprises." Distinct. No repetition.

**BUG-059 (LiveEstimate cursor always-mounted):** FIXED in code. The `.le-cursor` span is rendered for all three fields unconditionally; opacity toggled via state. Structurally correct.

**BUG-061 (PortfolioGallery mobile height):** FIXED. CSS at `max-width: 639px` applies `grid-template-columns: repeat(2, 1fr)` with `aspect-ratio: 3/2` on tiles, bringing mobile height from 4066px down to the ~1722px range. Grid confirmed in globals.css line 843.

**Font floor (Pixel cycle 13 — 34 selectors):** CLEAN. Searched all component files and globals.css. No inline `fontSize` properties below `0.875rem` remain. The one `0.75rem` found is on a `padding` value in Footer.tsx, not a font-size. LiveEstimate labels overridden via `!important` in globals.css at 0.875rem. Clean.

**New OG image (Builder cycle 13):** PARTIAL PASS. Route `app/opengraph-image.tsx` exists and is well-formed — correct ImageResponse usage, edge runtime, proper font loading. However the WebFetch call returned a 0-byte PNG, which is consistent with the Google Fonts fetch failing at Vercel edge runtime (the CSS regex for font URL may not match the woff2 format string Vercel's edge runtime receives). OG card may not render correctly when shared on social — needs a fallback or static font bundle.

**Process→Contact transition (Spark cycle 13):** CONFIRMED PRESENT. `#contact::before` defined in globals.css with `top: -80px`, `height: 200px`, rust gradient from `rgba(191,91,56,0.52)` at top to transparent at bottom. The seam between Process (umber) and Contact (chalk) now has a warm gradient bleed rather than a hard cut. Visually the right call for a painter brand.

---

## 12-Feature Catalog Audit

| # | Feature | Present | Grade | Notes |
|---|---------|---------|-------|-------|
| 1 | Custom hero centerpiece | Yes | B+ | SVG path draw cycling 5 icons, brush sprite tracking leading edge, constant velocity. Legible, paint-trade relevant. Not 3D but the R3F was removed intentionally; SVG draw is brand-appropriate. |
| 2 | Brand palette threaded through | Yes | A- | Drop Cloth & Rust palette (rust #BF5B38, ochre #B8884A, umber, linen, stone). Teal fully purged. Consistent from hero to footer. Section dividers, marquee accents, panel bars all on-palette. |
| 3 | Section dividers with motion | Yes | B | SectionDivider teardrop motif with traveling pulses and gloss-highlight. 8 instances. Painter-relevant (drip/teardrop). Motion gated via IntersectionObserver. |
| 4 | Horizontal scroll-lock | Yes | B+ | ServicesScrollLock 5-panel JS handler, pure getBoundingClientRect approach. BUG-025 panel bleed has had multiple fix attempts; last QA confirmed track resolving correctly. Accent bars added per cycle 12. |
| 5 | Animated diagram / workflow | Yes | B+ | PaintFlow: Wall→Prep→Prime→Paint→Finish. SVG curves, animated dots via rAF, node pulse on arrival, splatter burst, ghost trail, drawn-in border, per-node swatch tiles. Rich. |
| 6 | Live conversational sequence | Yes | A- | LiveEstimate: two-col editorial layout, 3 fields typing with natural cadence (50-80ms + ±10ms jitter), blink cursor always mounted, sent checkmark + "within 24 hours" confirmation, 8s loop. Fixed height card, no layout jump. Duplicate removed cycle 9. |
| 7 | Auto-advancing horizontal timeline | Yes | B+ | Process: 5 steps, char-stagger title, word-stagger description, bullet pop, foreground step numeral, countdown bar, cross-fade transitions. Cinematic. |
| 8 | Premium text glow | Yes | A- | 3-layer halo on H1 and sub-copy. `.glow-hero` (1px white / 10px rust 0.75 / 28px ochre 0.35) + `.glow-sub` variant. Inline fallback so CSS purge cannot strip it. |
| 9 | CSS scroll reveals (SSR-safe) | Yes | B | `.scroll-reveal` + `.scroll-reveal-left` with IO. BUG-054 IO race fixed (100ms delay + rootMargin 200px). Removed from display:none parents (BUG-058). Generally solid now. |
| 10 | Custom feature cards with depth | Yes | B | WhySoley TiltCards (rotateX/Y on mousemove ±7.6°, confirmed by QA). Mobile accordion. Card numbers upgraded to 1.75rem display heading. Spotlight glow on group container. |
| 11 | Social as quiet text link | Yes | B+ | Footer bottom bar "Social channels coming soon" — appropriate honest pre-launch framing. Not a garish icon grid. |
| 12 | Constant-speed animation | Yes | A- | SVG icon draw at constant velocity (progress = elapsed / STROKE_DURATION_MS). No lerp, no sin oscillation on positional motion. Particles at constant-velocity CSS animations. |

**Catalog score: 12/12 present. Average grade: B+ / A- range.**

---

## Section-by-Section Scores

### Hero (catalog #1, #8, #12)
**7.8 / 10**

The cycling SVG icon draw is compelling — five painter-relevant icons, constant-velocity brush tracking, warm paper canvas on umber. The studio environment (drop-cloth corner SVG, brush rest ledge, paint drips, drifting particles) adds genuine depth without clutter. H1 glow is clean and not default Tailwind. Sub-copy post-Refiner fix no longer repeats the headline. Strong.

Minor friction: the hero sub-copy and the three trust-signal bullets below it cover the same ground ("free consultation / low-VOC / single point of contact" repeated in both). A real buyer does not need the same three claims in two formats within scrolling distance of each other. Slightly redundant but not a blocker.

### ServicesScrollLock (catalog #4)
**6.8 / 10**

Content is excellent — five services, honest bullets, panel accent bars in palette rotation, good typography contrast. The scroll-lock mechanism has been through 7+ fix cycles and last QA confirmed it works. I am not re-flagging it as broken without a fresh verification. The emoji icons (🏠 🏡) read as placeholder-level; they survive but weaken the premium feel. No real photography means these panels are pure text on dark background — functional but not selling work yet.

### PaintFlow (catalog #5)
**7.5 / 10**

Technically accomplished: splatter bursts on node arrival, ghost trail behind lead dot, drawn-in border, per-node swatch tiles. The dark umber panel makes terracotta dots pop. The Codrops blind-reveal on entry adds ceremony. Content (Wall→Prep→Prime→Paint→Finish) is genuinely process-specific — not generic.

### LiveEstimate (catalog #6)
**8.2 / 10**

Best single section on the site. Two-col editorial layout with substantive copy left and animated demo card right is a premium pattern. Typing cadence feels genuinely human. The framing ("Example — how your request looks") is honest. Commitment bullets are specific and operational. Fixed height — no layout jump. Cursor always-mounted with opacity toggle is correct engineering. Sends a checkmark and 24-hour promise. This section alone elevates trust.

### Process (catalog #7)
**7.6 / 10**

Cinematic upgrade paid off. Char-stagger title entry, word-stagger description, bullet pop, foreground step numerals, countdown bar and cross-fade transitions. Content is specific and honest (sample board test in natural + lamp light, surface moisture assessment, final walkthrough walkthrough). Strong.

### WhySoley (catalog #10)
**7.0 / 10**

Four cards, genuine operational specificity (two-coat primer + sand between, arrival window, line-item invoice, low-VOC as standard). TiltCard mousemove depth verified by QA at ±7.6°. Mobile accordion functional. Card numbers upgraded to display heading size. Solid, but still feels like a "why us" grid that every agency site has. The content differentiates but the visual pattern does not.

### PortfolioGallery
**5.5 / 10**

The honest "Photography forthcoming" overlays are the correct call — fabricating reviews or fake project photos would be worse. But from a real buyer's 90-second perspective, nine uniform dark tiles with SVG painted-swatch textures and "Photography forthcoming" overlays read as a site under construction. The filter chips (ALL / INTERIOR / EXTERIOR / COMMERCIAL / CABINET & TRIM / SPECIALTY) add interaction but feel premature without real content behind them. The 2-col mobile grid fix brings height to a manageable ~1722px. Score reflects the pre-launch honest state, not a design failure.

### FounderBlock
**6.5 / 10**

Honest copy, good operational specificity (owner takes calls before 8pm, same crew start to finish, I'd rather walk every project myself). The pull-quote 4px border and foreground quote mark add editorial weight. Portrait placeholder ("Founder portrait forthcoming") is the correct honest approach. The craft-paper frame paired stripes are a nice textural detail. Score is capped pre-launch by the absence of a real face.

### FAQ
**7.2 / 10**

9 honest Q&A items, 2-col desktop grid, scope-clarity items included (drywall repair, wallpaper removal, color matching). The umber background with terracotta accents stays on-palette. Chevron animation and aria-expanded are correct.

### Contact
**7.0 / 10**

Form is functional. Left col scroll-reveal restored (was removed from display:none parent correctly). Six honest commitments on the left. Process→Contact rust gradient bleed transition at the seam reads as a deliberate design moment — "wet paint dripping off the dark panel into the light section" is exactly what it should do. No Formspree URL wired yet — form submits to state only.

### OG Image
**5.0 / 10**

Code is well-authored: umber background, Cormorant Garamond wordmark, rust corner brackets, ochre tagline, paintbrush silhouette. The design would be excellent. However the route returns a 0-byte PNG in production — the Google Fonts CSS regex `src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)` may not match the woff2 format string at Vercel edge runtime. Effectively zero social-preview benefit until the font fetch is fixed or fonts are bundled as base64.

---

## Conversion-Friction Analysis (This Cycle's Axis)

From a real buyer arriving via Google search and spending 90 seconds on the site:

**Friction points that cost inquiries:**

1. **OG image broken** — first impression when the link is shared via text or iMessage is a blank card. For a local painting company, word-of-mouth link shares are a primary discovery path. This is a real loss.

2. **No contact info above the fold or in the sticky nav** — "Get a Quote" CTA is in the nav but there is no phone number anywhere. A buyer who is ready to call cannot find a number. Pre-launch framing allows "phone number coming soon" but means zero call-in leads.

3. **LiveEstimate and Contact form are both present but disconnected** — the LiveEstimate demo drives toward a "request sent" confirmation but the actual Contact form below is a separate submission. A buyer who watches the LiveEstimate demo animation expects to interact with it; instead they must scroll further to find the real form. The relationship between the two is not communicated.

4. **Portfolio section signals "not open for business yet"** — nine "Photography forthcoming" tiles in a 2-col grid with filter chips signals that the company has not done jobs yet. This is the most trust-damaging element for a prospective buyer.

5. **No urgency or social proof anchors** — no "booked 3 weeks out in your area" type signal, no review snippet, no service-area specification. These would normally be fabrication risks, but their total absence means the site gives no reason to act now vs. later.

**Positive friction-reduction wins:**

- LiveEstimate section is excellent at demonstrating the estimate process before a buyer commits to asking for one. This lowers the mental barrier.
- FAQ covers the real pre-purchase objections (prep time, furniture protection, pet safety, guarantee terms) in specific, honest language.
- Process section specificity (sample boards in natural + lamp light, zero-ballpark-range pricing) is trust-building without fabrication.

---

## What Improved Since 6.9

1. **Hero sub-copy no longer duplicates H1** — post-Refiner BUG-060 fix, the tagline and the sub-copy below the icon canvas cover distinct ground. Reduces redundancy.
2. **Font floor clean** — Pixel cycle 13's 34-selector sweep closed the last visible 13px violations. No sub-14px instances detected.
3. **LiveEstimate cursor always-mounted** — BUG-059 fix means no cursor pop-in on first interaction. Cleaner.
4. **PortfolioGallery mobile height** — 4066px → ~1722px is a major UX improvement on SE375. Section was previously unscrollable in a reasonable time.
5. **Process→Contact rust gradient bleed** — the umber→chalk hard cut is now softened with a painter-brand paint-bleed moment. Small but elevating.
6. **OG image route shipped** — even though the font fetch appears broken in production, the architecture is correct and fixable in one targeted patch.
7. **Teal fully purged** — all-warm Drop Cloth & Rust palette is now consistent site-wide. LiveEstimate live-dot, FAQ wallpaper accent, all confirmed converted.

## What Regressed or Remains Open

1. **OG image 0-byte PNG** — new feature, broken in production. Net negative vs. no OG route.
2. **Portfolio content wall** — no real photography. Score cap remains.
3. **No phone number / contact info outside form** — conversion friction.
4. **ServicesScrollLock emoji icons** — minor polish issue; 🏠 🏡 read as placeholder.

---

## Score

**7.1 / 10**

Up from 6.9. The font floor, hero sub-copy fix, portfolio mobile height, and paint-bleed transition all represent real buyer-visible improvements. The LiveEstimate section continues to be the strongest trust-building element on the site. Score is capped at 7.5 pre-launch; we are close. The OG image breaking on production is the most actionable regression this cycle — it should be P1 for next cycle because it directly impacts discovery.

---

## Top 5 Priorities for Next Cycle

1. **P1 — Fix OG image font fetch** (Builder/Refiner): The Google Fonts CSS regex in `app/opengraph-image.tsx` fails at Vercel edge runtime, producing a 0-byte PNG. Fix by bundling a local font file as `readFileSync` + ArrayBuffer, or use a reliable fetch pattern that handles woff2 format string. Route design is correct; font loading is the single failure point.

2. **P2 — Add phone number / contact hook** (Builder): One line in the nav or footer bottom bar. "Questions? Call [number]" or "Text us for a same-day estimate" with an honest placeholder or SMS form. Buyers who are ready to act need a path that doesn't require filling a form. Pre-launch: "Phone number available at launch" is acceptable framing.

3. **P3 — LiveEstimate→Contact flow continuity** (Spark/Builder): The LiveEstimate demo animates through a request, shows a sent-checkmark, then the real Contact form appears further down the page with no bridge. Add a brief bridge sentence at the bottom of LiveEstimate: "Ready to send your own request?" with an anchor CTA scrolling to `#contact`. Reduces the disconnect.

4. **P4 — ServicesScrollLock icon upgrade** (Spark): Replace 🏠 🏡 emojis with inline SVG icons matching the PaintFlow / SectionDivider visual language. The rest of the site uses SVG — the emoji stand out as placeholder-tier even if the copy is excellent.

5. **P5 — PortfolioGallery placeholder state polish** (Builder/Spark): The "Photography forthcoming" overlays are honest but 9 uniform dark tiles is visually heavy. Consider reducing to 6 tiles or adding a pre-launch framing block above the grid: "First projects wrapping this season — portfolio fills as jobs complete." Gives the section purpose rather than reading as an empty placeholder.

---

*Nigel audit complete. Score cap at 7.5 remains until real photography, real reviews, and real address are all present.*
