# AGENT-PLAN.md — Soley Painting (Cycle 7, polish-mode at the cap)

**Date:** 2026-05-07 (Cycle 7 / post-Pixel-BUG-037 / post-Refiner-BUG-036 / post-QA-cycle-5)
**Live:** https://soley-painting.vercel.app
**Latest score:** 6.9 (typography-rhythm axis, Nigel cycle 6 / commit 5a13627) — under the 7.5 pre-launch cap
**Latest commits:** 55b423d (changelog) ← e81b122 (Refiner BUG-036 PaintFlow mobile dead space) ← 65f37b4 (Pixel BUG-037 portfolio H2 font)
**Cap:** 7.5 pre-launch — score CAN'T rise until real photography + real reviews + real address all land (`feedback_nigel_stricter.md`)

---

## Decision rule fired

**Default rotation in polish-mode, with a NEW component shipping this cycle.** No convergence stall — last 4 entries are productive (Pixel, Refiner, QA, Nigel each landed real changes). Score 6.9 is below the 7.5 cap so Builder + Spark stay in rotation (the 8.5 polish-gate doesn't apply). All known BLOCKERs / HIGHs are closed (BUG-025 confirmed CLOSED in QA cycle 5; BUG-036 + BUG-037 closed by e81b122 + 65f37b4). Active bug list is empty.

The orchestrator brief explicitly opens this cycle to a **NEW micro-feature** because most of Nigel's cycle 6 "remaining priorities" were refuted as Playwright artifacts in QA cycle 5 (P1 mobile bleed REFUTED — track widths exact at 1875/1950px; P2 hero glow REFUTED — 3-layer textShadow confirmed computing; P4 WhySoley tilt REFUTED — ±7.2° rotateY firing; P5 panel label mismatch REFUTED — all 5 panels match). Only P3 (PaintFlow mobile dead space) was real and is now closed.

**The highest-leverage move this cycle is ADDING a FAQ section** — a buyer-shopping-painters concern that the site doesn't currently answer. FAQ is genuine new value, not score-chasing. Builder ships it as a NEW component (HONEST answers only — no fabricated stats, no fake credentials, no invented warranty terms). Spark adds CTA paint-stroke hover delight + a11y micro-pass (focus styles, ARIA polish) — this closes the never-touched a11y gap and adds genuine micro-interaction quality without piling on existing glow.

**Schedule: Builder → Spark in that order.** Builder ships the new FAQ component (slotted between PortfolioGallery and Process per orchestrator brief). Spark ships paint-stroke CTA hover treatment + page-wide focus-style sweep for keyboard nav.

---

## Section cooldown register (touches in last 6 changelog entries)

| Section | Recent touches | Status this cycle |
|---|---|---|
| Hero3D / Hero environment | Spark 85888ef + Builder copy | **HARD FORBID** structurally |
| ServicesScrollLock | Refiner d6c2ccf + d26d04b | **HARD FORBID** structurally |
| Process | Refiner d6c2ccf + Spark 85888ef + Builder cycle 6 copy | **HARD FORBID** structurally |
| PortfolioGallery | Builder 55adef2 + Pixel e2f0637/65f37b4 + Refiner d6c2ccf | **HARD FORBID** — 3+ touches |
| ScrollRevealObserver | Refiner d6c2ccf | **HARD FORBID** |
| SectionDivider | Spark 451cca8 + Pixel e2f0637 | **HARD FORBID** structurally |
| PaintFlow | Spark 451cca8 + Refiner e81b122 | **HARD FORBID** — just-refit |
| Footer | Pixel 6e88be7 | **HARD FORBID** structurally |
| Navbar | Spark cycle 6 (paint-stroke nav underline) | **HARD FORBID** structurally |
| LiveEstimate | Builder cycle 6 copy polish | Soft-cool — leave content alone |
| WhySoley | Builder cycle 6 copy polish | Soft-cool |
| FounderBlock | Builder cycle 6 copy polish | Soft-cool |
| Contact | Last touched cycle 4 (commitment bullet) | OK if needed but not primary |
| **NEW: FAQ component** | Never existed | **PRIMARY Builder target** |
| **CTA hover + focus styles (page-wide a11y)** | Never run as a sweep | **PRIMARY Spark target** |

**Spark frequency check:** Spark ran cycle 6 (commit 87d23d7 — paint-stroke nav underline + typography rhythm sweep). Within window — schedule Spark normally.

**Memory drift check:** Scanned MEMORY.md. No 7-day-old entries lacking action. Penn Tech catalog binding respected; ghost numbers explicitly forbidden every cycle; matchMedia bail-outs forbidden every cycle; honest pre-launch framing held; `feedback_nigel_no_removal.md` enforced — Spark is replacing/refining hover treatments, not removing existing ones; `feedback_just_do_simple_swaps.md` respected (no "which one?" friction).

**Audit priority match:** AUDIT.md cycle 6 top-5 priorities — P1 (mobile bleed), P2 (hero glow), P4 (WhySoley tilt), P5 (panel label) all REFUTED by QA cycle 5 as Playwright artifacts. P3 (PaintFlow dead space) closed by Refiner e81b122. So all Nigel cycle 6 priorities are resolved. Cycle 7 targets are Coordinator-selected from open-opportunity space.

---

## Scheduled agents (in order)

### 1. Builder — NEW FAQ component (HONEST answers, slotted between PortfolioGallery and Process)

**Brief:** Builder adds a new FAQ section answering 5-6 common painter questions a homeowner would actually ask before booking. This is the kind of buyer-shopping-painters concern the site doesn't currently address — adding it is genuine new value, not polish theater. **HONEST answers only.** No fabricated stats, no fake warranties, no invented timelines, no fabricated crew sizes.

**File targets (all under `/Users/modica/projects/soley-painting`):**

- **`app/components/FAQ.tsx`** — NEW component. Reuse the WhySoley card pattern as expandable accordion items (so visual language matches the rest of the site). Each FAQ item:
  - Question on top (h3, eyebrow-treatment optional)
  - Answer body underneath in 2-4 sentences
  - Click/tap to expand (`aria-expanded`, `aria-controls`, proper button semantics)
  - Mobile: same accordion pattern as WhySoley mobile (already proven UX)
  - Desktop: cards may render expanded by default, OR same accordion as mobile — pick whichever reads cleaner. Do NOT pile a second interaction model on top of the existing accordion.

- **Suggested questions (Builder picks 5-6, may rephrase for painter voice):**
  - "How long does prep work usually take?" — honest answer about prep being most of the job, depends on wall condition
  - "Will you cover my furniture and floors?" — yes, drop cloths and zero-damage surface protection (this language is already on the site, stay consistent)
  - "What about pets and kids during the work?" — honest answer about low-VOC standard, daily cleanup
  - "Do you guarantee the work?" — honest answer about workmanship + paint manufacturer warranties, NO INVENTED TERM LENGTHS
  - "How do I get an estimate?" — point to the LiveEstimate flow + Contact form
  - "When can you start?" — honest pre-launch-friendly answer ("typical scheduling window depends on season — share your project on the contact form and we'll come back with a real date")
  - **NO fabricated specifics:** no "we've completed 500 jobs", no "X-year warranty", no fake "ABC certified" language, no neighborhood claims, no "Est. 2018".
  - Generic operational language is fine ("our crews", "our process") — fake people / fake numbers / fake credentials are NOT.

- **`app/page.tsx`** — Insert `<FAQ />` between `<PortfolioGallery />` and `<Process />` per orchestrator brief. Confirm import order, scroll-reveal threshold consistent with other sections. If a SectionDivider sits between PortfolioGallery and Process, FAQ goes after the divider so the visual cadence stays the same.

- **`app/globals.css` (FAQ-scoped CSS only)** — Reuse existing card / accordion / eyebrow / heading variables. Brand palette (terracotta / umber / teal / clay-gold) only — no new color introductions. Card hover states should match WhySoley card hover behavior, not invent a new pattern.

**What "FAQ shipped at full quality" looks like:**

- Visually consistent with WhySoley + PortfolioGallery (same card pattern, same brand palette, same eyebrow treatment, same heading typography).
- 5-6 items, every answer honest and specific to painters (no marketing filler — "our team strives to deliver excellence" is banned).
- Accordion ARIA attributes correct (`aria-expanded`, `aria-controls`, `id` linking question button to answer panel, `role="button"` on the trigger if not already a button element).
- `prefers-reduced-motion` honored on expand animation.
- Scroll-reveal pattern consistent with other sections.
- Build passes clean (`npm run build`).

**Verification (RULE 3):**

- Run Playwright on the live URL (or `npm run dev`) at desktop 1440x900 + iPhone SE 375x667 + iPhone 13 390x664.
- For the FAQ section, capture mid-section screenshots at 5 scroll positions (5%/25%/50%/75%/95%) per RULE 3.
- Click/tap one FAQ item open and capture the expanded state. Click/tap to close and confirm `aria-expanded` toggles.
- Save screenshots to `/tmp/soley-builder-cycle7-faq/`.

**Forbidden moves:**

- **HARD FORBID structural edits to:** Hero3D, ServicesScrollLock, Process, PortfolioGallery, ScrollRevealObserver, SectionDivider, PaintFlow, Footer, Navbar. Builder ships a new component AND inserts the import — it does not modify any of the above.
- **Soft-cool (do NOT re-edit):** LiveEstimate, WhySoley, FounderBlock — Builder cycle 6 just ran a copy polish on these. Don't re-touch.
- **Do NOT introduce R3F / @react-three/fiber / drei / three.**
- **Do NOT use `matchMedia` to hide FAQ on mobile** (RULE 4).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered text.
- **Do NOT add ghost numbers** behind FAQ headings (RULE 8).
- **Do NOT fabricate** any specifics in answers (RULE 7) — no fake warranty term lengths, no fake project counts, no fake certifications, no fake crew sizes, no fake "Est. YYYY", no fake neighborhoods.
- **Do NOT pile a new accordion library** — use plain React state + ARIA, matching the WhySoley pattern already shipped.
- **Do NOT remove or downgrade** any prior animation / glow / effect (`feedback_nigel_no_removal.md`).
- **Do NOT call the iMessage reply tool** (RULE 1 — Builder is a sub-agent).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** in copy or commit message (RULE 2).
- **Do NOT call the user a bottleneck** in commits or reports (`feedback_respectful_tone.md`).

**MEMORY.md entries Builder MUST respect:**

- RULE 7 / `feedback_no_invented_fight_data.md` — no fabricated FAQ specifics anywhere. Honest pre-launch answers only.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — execute the FAQ at full intensity; no "subtle" reframings.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — no `matchMedia` bail-outs.
- RULE 8 / `feedback_no_ghost_numbers.md` — no ghost numerals.
- `feedback_simplicity_over_polish.md` — reuse WhySoley accordion pattern; do NOT introduce a second interaction model.
- `feedback_frame_b_richness.md` — preserve content count on existing sections (FAQ is purely additive).
- `feedback_nigel_no_removal.md` — never remove a prior animation / glow / effect.
- `feedback_respectful_tone.md` — collaborative framing only.
- `feedback_no_dev_content.md` — no developer-feature lists in FAQ; this is buyer-facing painter Q&A.
- `feedback_unique_design.md` — FAQ visual treatment must match the established Soley brand system, not generic Tailwind FAQ accordion defaults.
- `project_penn_tech_baseline.md` — Penn Tech catalog binding stays the floor; FAQ is additive, not a catalog item.

---

### 2. Spark — Paint-stroke CTA hover delight + page-wide focus-style a11y sweep

**Brief:** Spark adds a brand-distinctive paint-stroke hover treatment to the primary CTA buttons across the site (Book a free estimate / Call us / Send / etc.) AND runs a page-wide focus-style sweep so keyboard navigation has visible, brand-consistent focus rings on every interactive element. Frame B territory: refine and replace, never strip content count (`feedback_frame_b_richness.md`). The CTA hover and focus styles MUST replace any generic browser default — they do not pile on top of existing hover.

**File targets (all under `/Users/modica/projects/soley-painting`):**

- **`app/globals.css`** — Primary work surface. Add:
  - **CTA paint-stroke hover** — A brushed-stroke fill or underline that paints across the button on hover (using terracotta → teal → gold cycle, OR a single brand color with a hand-tuned mask animation). Pick ONE treatment, apply it to all primary CTAs (the existing nav CTA already has the paint-stroke nav underline from Spark cycle 6 — match that aesthetic for consistency, don't invent a competing language). Constant velocity on the stroke (no `Math.sin`/`lerp` smoothing on positional motion).
  - **Page-wide focus styles** — Every focusable element (`button`, `a`, `input`, `textarea`, `[role="button"]`, accordion triggers, filter chips, nav links) gets a visible `:focus-visible` outline using the brand palette. The focus ring should be hand-tuned (not the browser default blue), use a brand color (terracotta or teal), be at least 2px thick, with appropriate offset. Must be visible against both chalk-on-umber and chalk-on-slate panel backgrounds.
  - `prefers-reduced-motion` honored on the CTA paint-stroke (snap to filled state instead of animating).
  - **No new color introductions** — palette stays terracotta / umber / teal / chalk / clay-gold.

- **Per-component CSS edits if needed** — If a component declares its own button hover that conflicts with the new paint-stroke treatment, REPLACE the conflicting rule (don't pile both on top — `feedback_simplicity_over_polish.md`). Components likely needing a tweak:
  - Contact form submit button
  - LiveEstimate CTA (if any in copy area)
  - Hero3D primary CTAs
  - Footer "Service area coming soon" link

- **ARIA polish (light pass)** — While running the focus-style sweep, audit interactive elements for missing ARIA:
  - Confirm all icon-only buttons have `aria-label`.
  - Confirm form inputs have associated `<label>` elements.
  - Confirm accordion triggers have `aria-expanded` / `aria-controls`.
  - Confirm any custom buttons rendered as `<div>` have `role="button"` + `tabindex="0"`.
  - **Do NOT restructure components.** If an ARIA gap requires a structural change, log to BUGS.md and skip — Refiner can pick it up next cycle.

**Verification (RULE 3):**

- Playwright on the live URL (or `npm run dev`) at desktop 1440x900 + iPhone SE 375x667 + iPhone 13 390x664.
- For each of 3-4 primary CTAs: hover (desktop) / tap (mobile) and capture before + during + after states. Capture computed `transform` / `background` / `:focus-visible` outline values.
- Tab through the page sequentially (5-10 tab stops): screenshot the focus ring on each interactive element. Confirm the ring is visible against both light + dark panel backgrounds.
- Save screenshots to `/tmp/soley-spark-cycle7-cta-focus/`.
- Confirm `prefers-reduced-motion: reduce` collapses the paint-stroke animation to a static filled state.

**Forbidden moves:**

- **HARD FORBID structural edits to:** Hero3D, ServicesScrollLock, Process, PortfolioGallery, ScrollRevealObserver, SectionDivider, PaintFlow, Footer, Navbar, LiveEstimate, WhySoley, FounderBlock. Spark touches button/link CSS + focus styles + light ARIA only.
- **Do NOT pile** the new CTA hover on top of an existing hover treatment — replace any conflicting rule.
- **Do NOT pick more than ONE CTA hover treatment** — picking multiple competing accents counts as piling (`feedback_simplicity_over_polish.md`).
- **Do NOT introduce R3F / @react-three/fiber / drei / three.**
- **Do NOT add bloom postprocessing.**
- **Do NOT use `Math.sin` oscillation, `MathUtils.lerp`, or any speed-easing on positional motion** (RULE 12 — constant velocity). Easing on opacity / scale / color / mask-position is fine; not on positional travel.
- **Do NOT use `matchMedia` to disable the CTA hover or focus styles on mobile** (RULE 4). Tap states stand in for hover; focus styles apply identically.
- **Do NOT add ghost numbers** anywhere (RULE 8).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered elements.
- **Do NOT remove or downgrade** the existing nav paint-stroke underline (Spark cycle 6) or any prior glow / animation / effect (`feedback_nigel_no_removal.md`).
- **Do NOT strip content count** from any section (`feedback_frame_b_richness.md`).
- **Do NOT call the iMessage reply tool** (RULE 1 — Spark is a sub-agent).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** anywhere in code, commits, or comments (RULE 2). Brief is "delight + a11y sweep" — execute at full intensity.
- **Do NOT fabricate** any nav labels, link text, or `aria-label` strings (RULE 7).

**MEMORY.md entries Spark MUST respect:**

- `project_penn_tech_baseline.md` — Penn Tech catalog #2 (brand palette threaded through everything) governs the CTA hover. Catalog #12 (constant velocity) governs the stroke animation.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — no "subtle / considered" reframings.
- RULE 3 / `feedback_actually_scroll_test.md` — verify hover + focus at 3 viewports; capture multiple states per CTA.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — no `matchMedia` bail-outs.
- RULE 8 / `feedback_no_ghost_numbers.md` — no ghost numerals introduced as a focus-treatment device.
- `feedback_simplicity_over_polish.md` — replace, don't pile. ONE CTA hover treatment.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — never remove a prior glow / animation / effect.
- `feedback_unique_design.md` — hand-tuned painter-brand CTA hover and focus rings, not generic Bootstrap / Tailwind defaults.
- `feedback_pixel_alignment.md` — center-alignment audit at 375 + 414 mobile while testing CTAs.

---

## Forbidden cycle-wide

- **Sub-agents texting the user** (RULE 1).
- **Touching Hero3D / ServicesScrollLock / Process / PortfolioGallery / ScrollRevealObserver / SectionDivider / PaintFlow / Footer / Navbar / LiveEstimate / WhySoley / FounderBlock structurally.** All HARD FORBIDDEN this cycle (recently refit OR just-touched in cycle 6).
- **Hero R3F re-introduction** (Razor removed it deliberately; SVG signature is the approved centerpiece).
- **Footer "SOCIAL CHANNELS COMING SOON" → fake INSTAGRAM swap.** Honest pre-launch only (RULE 7).
- **Catalog #11 Instagram bottom bar** — orchestrator-approved as intentional pre-launch framing. Ignore Nigel's INSTAGRAM suggestions every cycle until real social channels exist.
- **Fake project / customer / founder / neighborhood / city names**, fake "Est. YYYY", fake reviews, fake stats, fake warranty terms, fake certifications, fake crew sizes (RULE 7).
- **`matchMedia` bail-outs** to disable any feature on any viewport (RULE 4).
- **Framer Motion `whileInView`** on SSR-rendered elements.
- **Ghost numbers** behind any section (RULE 8).
- **Bloom postprocessing.**
- **`Math.sin` / `lerp` smoothing** on positional motion (RULE 12 / catalog #12).
- **"Subtle / considered / editorial restraint / tasteful / delicate / refined"** language anywhere (RULE 2).
- **Stripping content count** from any section (`feedback_frame_b_richness.md`).
- **Removing or downgrading** any prior glow / animation / effect (`feedback_nigel_no_removal.md`).
- **Calling the user a bottleneck** in commits or reports (`feedback_respectful_tone.md`).
- **Score-chasing.** Score is below cap but cap is 7.5 until real photo + reviews + address land. Polish for quality, not for the number.

---

## Section cooldown register (for next-cycle Coordinator)

| Section | Touches in last 6 entries (after this cycle) | Cycle pressure |
|---|---|---|
| ServicesScrollLock | 2 (Refiner d6c2ccf + d26d04b) | **HARD COOLDOWN** |
| Process | 2 (Spark 85888ef + Refiner d6c2ccf) | **HARD COOLDOWN** |
| PortfolioGallery | 3 (Builder 55adef2 + Pixel e2f0637/65f37b4 + Refiner d6c2ccf) | **HARD COOLDOWN** |
| SectionDivider | 2 (Spark 451cca8 + Pixel e2f0637) | **HARD COOLDOWN** |
| PaintFlow | 2 (Spark 451cca8 + Refiner e81b122) | **HARD COOLDOWN** |
| Hero environment | 1 (Spark 85888ef) | Soft-cool |
| Footer | 1 (Pixel 6e88be7) | Soft-cool |
| Navbar | 1 (Spark cycle 6) | Soft-cool |
| LiveEstimate | 1 (Builder cycle 6 copy) | Soft-cool |
| WhySoley | 1 (Builder cycle 6 copy) | Soft-cool |
| FounderBlock | 1 (Builder cycle 6 copy) | Soft-cool |
| **NEW: FAQ** | 0 → 1 after this cycle (Builder ships) | Active this cycle |
| **CTA hover + focus styles** | 0 → 1 after this cycle (Spark) | Active this cycle |
| Contact | 0 in last 6 | OK for next cycle |

---

## Rationale (one line)

Score 6.9 / 7.5 cap, all BLOCKERs/HIGHs closed, Nigel cycle 6 priorities mostly REFUTED as Playwright artifacts — schedule **Builder** to ship a NEW FAQ component (HONEST answers, slotted between PortfolioGallery and Process) and **Spark** to add brand-distinctive paint-stroke CTA hover delight + a page-wide keyboard-focus-style a11y sweep, while every other section sits hard-forbidden after recent refits.
