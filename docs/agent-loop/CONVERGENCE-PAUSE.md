# CONVERGENCE-PAUSE — Soley Painting

**Date:** 2026-05-07
**Final agent-loop Nigel score:** 7.2 / 10 (cap 7.5 pre-real-photography)
**Status:** Agent-loop ceiling reached. Pause recurring loops. Resume only when customer content arrives.

---

## 1. Current state summary

- **Nigel score:** 7.2 — cycle 14 audit, narrative-structure axis. Did not clear the 7.3 checkpoint flagged in cycle 14's pre-flight by 0.1.
- **Catalog completion:** 12 / 12 Penn Tech catalog features present. None absent outright. One nested rather than standalone (LiveEstimate was inside Contact; Refiner cycle 15 then promoted it to a standalone section between FAQ and Process).
- **Total commits on main:** ~110+ across the four-week build (Coordinator / Builder / Spark / Pixel / Nigel / Refiner / Razor / Scout / QA rotation). Last 5 commits: d242128 (Refiner cycle 15), ae25bc1 (Nigel cycle 14), 09b8412 (Spark cycle 14 final easing sweep), 290d28d (Coordinator cycle 14 plan), e11a5c8 (changelog).
- **Live URL:** https://soley-painting.vercel.app
- **Build state:** clean. Lighthouse mobile 95/100, desktop 100/100. OG image route returning 200 OK with branded PNG. No open BLOCKER bugs in QA queue. Section-by-section scores all ≥ 7.0 except FounderBlock and PortfolioGallery, which are gated by missing customer content rather than agent-fixable defects.

---

## 2. What agents shipped

Material features delivered across the build, by area:

**Hero**
- SVG signature reveal hero with brush-tracking leading edge, 3-color brand palette cycle, constant 140px/s velocity, 5-icon cycling draw centerpiece (smiley / house / roller / star / heart) with deliberate paint timing.
- 3-layer text glow on hero H1 (near-white core + rust mid + ochre ambient).
- Drop-cloth corner SVG, brush-rest ledge, drip baseline, warm/cool goboes, 10 constant-velocity ambient particles (no sin/lerp drift).
- Mobile aspect-ratio fix for hero canvas (BUG-042).

**Services**
- ServicesScrollLock 5-panel horizontal lock (Interior / Exterior / Commercial / Cabinet & Trim / Specialty) with pure-JS getBoundingClientRect handler (replaced flaky Framer Motion useScroll). Substantive bullets per panel. 4px panel accent bars rotating through brand palette.
- 5 custom SVG line-drawing icons (house, chimney, office block, cabinet, roller) replacing emoji set.
- ServicesMarquee with velocity-skew and stone+rust+ochre+terra rotation.
- BUG-025 double-panel-bleed CSS containment fix (100vh→100dvh, max-width:100vw, clamp() heading typography).

**Process & flow**
- PaintFlow SVG animateMotion 5-node wall-to-finish diagram with dot travel, ghost trail, splatter burst on node arrival, draw-in border.
- Process: 5-step auto-advancing horizontal timeline, 10s per step, char/word stagger, bullet-pop scale, full-opacity step numerals (no ghost numbers), countdown bar, prefers-reduced-motion fallback. Full ARIA tablist semantics.

**Trust & narrative**
- WhySoley 4-card 3D tilt (rotateX/Y on mousemove) with mobile accordion (aria-expanded), top accent bars, spotlight glow, real-differentiator copy (two-coat primer + sand between coats, confirmed arrival window, line-for-line invoice match, low-VOC).
- FounderBlock — Refiner cycle 15 promoted to centered pull-quote block (placeholder portrait removed) with rust/ochre/terra data-pills.
- PortfolioGallery — 6-chip filter, 9 tiles, painted-swatch SVG textures, honest "Photography forthcoming" framing, real-painter pre-launch signal copy.
- FAQ — 9 honest accordion Q&A items (prep, furniture, pets, guarantee, estimate, paint brands, drywall, wallpaper, color matching). Full ARIA.
- LiveEstimate — auto-typing estimate form, natural cadence, blink cursor, sent checkmark, 8s loop, bridge CTA into Contact. Refiner cycle 15 made it a standalone section between FAQ and Process.
- NotifySignup — pre-launch email-capture micro-section with /api/notify route stub.
- Contact — honest pre-launch framing, 6 commitment bullets, scroll-reveal-left stagger.

**Foundation & polish**
- SectionDivider — teardrop SVG motif, gloss highlights, dual-hairline parallax (constant-velocity triangle wave), traveling pulses, 8 placements between major sections.
- Drop Cloth & Rust palette migration (teal removed site-wide, rust / linen / stone / ochre / terra tokens propagated via CSS custom properties).
- Process→Contact rust paint-bleed ramp transition.
- Navbar paint-stroke underline (left-origin scaleX, terracotta).
- Page-wide easing cohesion sweep — canonical cubic-bezier(0.16,1,0.3,1) on 31+ rules.
- Page-wide :focus-visible accessibility ring sweep (terra + teal hand-tuned per element).
- Font-size floor swept to 14px minimum across 34 instances; 13px confirmed at minor labels under 14px floor and bumped.
- Mobile audit passes — iPhone SE 375 + iPhone 13 390 + iPhone 14 Pro Max 414, tap targets ≥44px, font sizes ≥14px, no horizontal overflow.
- SEO foundation: LocalBusiness JSON-LD (no fabricated phone/address), 5 Service schemas, FAQPage schema, expanded OG+Twitter metadata, robots.txt, sitemap.xml.
- Dynamic OG image route — edge-runtime ImageResponse 1200×630, branded wordmark, fixed via local TTF fonts + nodejs runtime (was 0-byte at Vercel edge).
- Lighthouse perf audit — mobile 95/100, desktop 100/100.

**Honest pre-launch framing throughout**
- "Phone available at launch" instead of fabricated number.
- "Photography forthcoming" instead of fabricated portfolio.
- "Studio address coming soon" instead of fabricated address.
- "Social channels coming soon" instead of fabricated Instagram handle.
- No fabricated names, reviews, testimonials, ratings, awards, or "Est. YYYY" claims.

---

## 3. What's left for the customer

These are the five blockers that gate further score movement. Agents cannot manufacture or improvise these without violating the content-honesty rule.

1. **Real founder portrait + name + city.** FounderBlock has been refactored to a centered pull-quote block (Refiner cycle 15) so the absence is no longer a blank face — but it still under-signals identity. A single candid phone photo + first name + city would change the section score from 5.5 to 7.5+.

2. **Real project photography.** Even 2–3 photos from a single completed job would replace 9 "Photography forthcoming" swatches. PortfolioGallery is currently the site's largest pre-launch trust deficit (1681px tall on desktop with zero real work shown). Agent ceiling on this section is ~5.0 until real photography lands.

3. **Real street address.** LocalBusiness JSON-LD is intentionally limited to `addressCountry: US` until a real address is supplied. Adding the real address unlocks the LocalBusiness SEO surface (Google business panel eligibility, local-search ranking) and lifts the Footer from 7.5 to 8.0+.

4. **Real Formspree (or other form-handler) credentials.** Contact form is wired but the action target is a placeholder. Without a real endpoint, a buyer who fills out the form will hit a non-functional submit. This is the single biggest conversion-pipeline gap.

5. **Real phone number.** Footer + Contact both display "Phone available at launch." Replacing this with a real number gives a buyer a second contact path beyond the form, which is the standard expectation for a residential trades business.

**Optional but score-moving:** real reviews / testimonials (would add a trust section currently absent from the page); real Instagram handle (would replace "Social channels coming soon" in footer); confirmed launch date (would let "pre-launch" framing across the site become "launching MM/DD").

---

## 4. Recommendation to orchestrator

**Pause the recurring agent loops on this project.**

- The agent-doable priority queue is empty as of commit d242128 (Refiner cycle 15). All five Nigel cycle-13 priorities AND all three remaining post-cycle-14 agent-doable items have shipped.
- Agent ceiling is **7.5 / 10** pre-real-content per the standing rule. Current score is 7.2. The 0.3 of remaining headroom is achievable only via cosmetic polish that risks regression cycles (the OG-image break in cycle 12 cost two cycles to recover from — a clear precedent for diminishing returns).
- Continued agent cycles past this point produce churn without proportional value gain. The 4-cycle convergence-guard pattern is exactly what would trip if the loop were left running.

**Resume only when at least ONE of the five customer items above arrives.** Specifically:
- If real photography lands → schedule Builder + Pixel for PortfolioGallery integration cycle.
- If founder portrait + name lands → schedule Builder for FounderBlock identity cycle.
- If address / phone / Formspree credential lands → schedule Builder for one focused content-integration cycle, then Pixel + QA verification, then Nigel re-score.
- If reviews / testimonials land → schedule Builder for a NEW Testimonials section (between WhySoley and FounderBlock would be the natural slot).

**Single resume cycle pattern (when content arrives):**
Builder integrates content → Pixel mobile audit → QA mid-runway scroll verification → Nigel re-score. One cycle, then re-evaluate. Do NOT resume the full 4-agent rotation; surgical integration only.

**Do not resume on a timer.** The orchestrator should resume only on a user-triggered signal that customer content is in hand.

---

## 5. Why pause now and not one more cycle

The cycle 14 pre-flight (Coordinator commit 290d28d) explicitly flagged: *"if Nigel cycle 14 does not clear 7.3, the next Coordinator MUST signal convergence-pause to the orchestrator."* That trigger has fired (7.2 < 7.3). Honoring the pre-flagged trigger is the correct path — overriding it now to schedule "one more polish pass" would itself be a convergence anti-pattern, the same kind of self-extending loop the standing memory rule `feedback_auto_pause_idle_loops` was written to prevent.

The site is genuinely good. It looks distinctive, scrolls well, has 12/12 catalog features, ships honest content, passes mobile + accessibility + SEO foundation gates, and Lighthouse scores 95/100 mobile. The remaining 0.3 of agent-doable lift is not where the customer value lives. Customer content is.
