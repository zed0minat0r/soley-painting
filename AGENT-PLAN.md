# AGENT-PLAN.md — Soley Painting (:03 slot, post-Refiner d6c2ccf)

**Date:** 2026-05-07 :03 (post-QA-3 / Pixel-4 / Refiner-3)
**Live:** https://soley-painting.vercel.app
**Latest score:** 7.3 (brand-cohesion axis, Nigel cycle 4 / commit 240391b)
**Latest commit:** e093a7f (Refiner CHANGELOG append after BUG-025/026/027/028/032 closure d6c2ccf)
**Cap:** 7.5 pre-launch — 0.2 below cap

---

## Decision rule fired

**Default rotation + section cooldown.** Score (7.3) is below the 8.5 polish-mode gate so full toolset is available. No stuck-loop signal — last commits (240391b, ba942b8, 6e88be7, d6c2ccf, e093a7f) all show real work landing. Nigel's cycle-4 priorities P1/P2/P5b are already closed by Refiner d6c2ccf. The two catalog deductions Nigel actually scored low this cycle are #1 (R3F absent — IGNORE per orchestrator brief, SVG signature is the approved equivalent) and #11 (footer social link — IGNORE per orchestrator brief, honest pre-launch is intentional). That leaves the two catalog items at 0.7 with real headroom (#3 SectionDivider, #5 PaintFlow) plus a copywriting honesty pass that has never run. Schedule **Builder → Spark** in that order: Builder runs a word-level honesty + clarity pass across every section (no new components), Spark pushes #3 SectionDivider and #5 PaintFlow visual depth toward 0.9.

**Section cooldown register (touches in last 6 changelog entries):**

| Section | Recent touches | Status this cycle |
|---|---|---|
| ServicesScrollLock | Refiner BUG-025 (d6c2ccf) | **HARD FORBID** — 3rd touch = cooldown trigger |
| Process | Refiner BUG-026/032 (d6c2ccf) + Spark cycle 3 (85888ef) | **HARD FORBID** — 2 touches, soft-cool |
| ScrollRevealObserver | Refiner BUG-028 (d6c2ccf) | **HARD FORBID** — just refit |
| PortfolioGallery | Builder cycle 3 (55adef2) + Pixel BUG-031 (6e88be7) + Refiner BUG-027 (d6c2ccf) | **HARD FORBID** — 3 touches |
| Footer | Pixel BUG-030 (6e88be7) | Soft-cool, structure only — Builder may copy-edit honest framing only |
| Hero environment | Spark cycle 3 (85888ef) | Soft-cool — Spark may NOT re-touch hero this cycle |
| LiveEstimate | Last touched 181d376 (5+ entries back) | OK — eligible if Spark sees a clear win, not the primary target |
| PaintFlow | Last touched 181d376 (5+ entries back) | **PRIMARY Spark target** |
| SectionDivider | Not touched in 6+ cycles | **PRIMARY Spark target** |
| FounderBlock / WhySoley / Contact | All touched 4+ cycles back | OK for copy-edits (Builder) |

**Spark frequency check:** Spark ran cycle 3 last cycle (85888ef). Within window — schedule normal Spark this cycle.

**Memory drift check:** No 7-day-old MEMORY entries lacking visible action. Penn Tech catalog binding is being respected.

---

## Scheduled agents (in order)

### 1. Builder — Section-by-section copywriting honesty + clarity pass

**Brief:** Builder runs a word-level pass across every section's headline, eyebrow, sub-copy, button labels, and microcopy. NO new components. NO new sections. NO restructured layouts. Only word-level edits to the React components' text content. Goal: every line earns its space, sounds like a human painter (not a marketing template), and contains zero fabrication.

**Targets (file paths, all under `/Users/modica/projects/soley-painting`):**

- `app/components/Hero3D.tsx` (or wherever the hero copy lives) — confirm "Every wall done right." headline + sub-copy reads honest and confident; tighten if there's filler.
- `app/components/ServicesMarquee.tsx` — service category strings + the marquee separators.
- `app/components/ServicesScrollLock.tsx` — **TEXT ONLY** for each panel (eyebrow, headline, bullets, caption). DO NOT touch the scroll handler, transform math, panel widths, or any layout/JS — that section is HARD FORBIDDEN structurally this cycle.
- `app/components/PaintFlow.tsx` — **TEXT ONLY** for any node labels / step captions. Spark owns the visual depth pass; Builder only sharpens copy if the labels read weak.
- `app/components/WhySoley.tsx` — 4-card titles + body copy. Confirm each card answers a real buyer concern in concrete language.
- `app/components/FounderBlock.tsx` — confirm copy is honest pre-launch (no fabricated names/dates) and the framing reads as a real working painter, not a generic "About" block.
- `app/components/PortfolioGallery.tsx` — **TEXT ONLY** for the section eyebrow / headline / sub-line / "Photography forthcoming" overlays. DO NOT touch the chip filter, tile grid, or any JS — section is HARD FORBIDDEN structurally.
- `app/components/Process.tsx` — **TEXT ONLY** for each of the 5 step titles + descriptions + bullets. DO NOT touch the auto-advance JS, countdown bar, or stagger keyframes — HARD FORBIDDEN structurally.
- `app/components/LiveEstimate.tsx` — TEXT ONLY for the typed-message script + commitment bullets. Verify each line reads honestly.
- `app/components/Contact.tsx` — confirm form field labels, helper text, submit button, and the "we answer the phone"-style commitments read confident and concrete.
- `app/components/Footer.tsx` — copy-edit only. The "SOCIAL CHANNELS COMING SOON" honest framing stays — DO NOT swap to a fake INSTAGRAM link.

**What "honest + clarity" means in practice:**

- Replace marketing filler ("we strive to deliver excellence") with concrete commitments ("we answer on the second ring; we show up when we said we would").
- Cut adverbs that don't carry weight ("really", "truly", "honestly").
- If a sentence could appear on any painter's site, rewrite it so it could only appear on Soley's.
- NO fabricated specifics — no "Est. 2018", no "47 projects completed", no fake neighborhood names, no fake reviews, no fake project counts.
- Generic role / category language is fine ("residential clients", "property managers"). Specific fake people / addresses / dates are not.
- Headlines stay short. Sub-copy stays under 24 words per line.
- **Brand voice:** honest, hands-on, professional. The painter equivalent of "we answer the phone." (per CLAUDE.md.)

**Verification (RULE 3):**

- After edits, run `npm run build` — must pass clean.
- Run a Playwright check on the live URL (or `npm run dev`) at desktop 1440×900 + iPhone SE 375×667 + iPhone 13 390×664. Capture full-page screenshots so the next agent can confirm no copy got truncated by edits.
- Save screenshots to `/tmp/soley-builder-cycle4-copy/`.

**Forbidden moves:**

- **Do NOT touch any structure / JS / CSS / layout / component hierarchy.** Text-content edits only. If a copy edit reveals a layout bug, log it as a BUGS.md entry, do not fix it.
- **HARD FORBID structural edits to:** ServicesScrollLock, Process, PortfolioGallery, ScrollRevealObserver, Hero environment, Footer columns. Copy edits inside these are allowed; structural / JS / CSS edits are not.
- **Do NOT add ghost numbers, fake testimonials, fake names, fake dates, or fake project stats** anywhere (RULE 7, RULE 8).
- **Do NOT swap the honest "SOCIAL CHANNELS COMING SOON" footer line to a fake INSTAGRAM handle** (per orchestrator brief — Nigel's catalog #11 suggestion is IGNORED).
- **Do NOT introduce R3F / @react-three/fiber / drei / three** (Razor removed it deliberately; SVG signature is the approved centerpiece).
- **Do NOT use `matchMedia` to hide any feature on any viewport** (RULE 4).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered text — copy edits should not change rendering pattern.
- **Do NOT call the iMessage reply tool** (RULE 1 — Builder is a sub-agent).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** in any copy or commit message (RULE 2).
- **Do NOT remove or downgrade any glow / animation / effect** from prior cycles (`feedback_nigel_no_removal.md`).
- **Do NOT strip content count** from any section — if a card / bullet / panel has 4 items today, it has 4 items after this pass (`feedback_frame_b_richness.md`).
- **Do NOT call the user a bottleneck** in any commit message or report (`feedback_respectful_tone.md`).

**MEMORY.md entries Builder MUST respect:**

- RULE 7 / `feedback_no_invented_fight_data.md` — no fabricated specifics anywhere in copy.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — execute the brief at full intensity; no "subtle" reframings.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — never remove a prior animation / glow / effect.
- `feedback_simplicity_over_polish.md` — replace, don't pile.
- `feedback_respectful_tone.md` — collaborative framing only.
- `feedback_just_do_simple_swaps.md` — for trivial copy edits, ship the obvious target without asking "which one?"
- `project_penn_tech_baseline.md` — Penn Tech catalog is the floor; copy edits should make each catalog feature read as the brand-specific painter equivalent of its Penn Tech analog.

---

### 2. Spark — SectionDivider depth + PaintFlow visual depth (Frame A or B)

**Brief:** Spark pushes the two catalog items still scoring 0.7 toward 0.9 by elevating their visual depth. Frame A (replace + add) or Frame B (refine spacing/typography while keeping content count) — Spark picks based on which reads as the bigger uplift. Two clear targets; no others touched this cycle.

**Targets (file paths, all under `/Users/modica/projects/soley-painting`):**

- **Catalog #3 — `app/components/SectionDivider.tsx` push toward 0.9.** Today: teardrop SVG with traveling pulses + hairline gradient. Nigel docked it to 0.7 because "pulse animation is subtle enough that mid-scroll it reads as static" and "some section transitions skip the divider." Push it to 0.9 by:
  - Adding a brand-specific paint-drop motif: a small terracotta drip silhouette descending from the teardrop's apex with a 1.6s `cubic-bezier(.4, 0, .2, 1)` easing. Constant-velocity rule (catalog #12) — no `Math.sin`, no `lerp`, just a CSS keyframe with linear timing for the drop's vertical translate. The drop loops.
  - Bumping the traveling pulse contrast: terracotta → teal → gold cycle at full saturation (not the current near-static low-opacity pulse).
  - Audit `app/page.tsx` to confirm the divider appears between every section transition (Nigel said "some transitions skip the divider"). Insert wherever missing — but keep the divider component itself unchanged structurally; only adjust placement.
  - Mobile parity: the paint-drop motif scales down but does not disappear via `matchMedia` (RULE 4).

- **Catalog #5 — `app/components/PaintFlow.tsx` push toward 0.9.** Today: dark-slate panel, 6-strip Codrops blind reveal, lead-dot bloom, node pulse 1.0→1.18 terracotta flash, SVG stroke 0.9px. Nigel docked it because "SVG path is not visible at the tested scroll position — unclear if animateMotion dots actually fire on initial view-enter." Push to 0.9 by adding visual depth (NOT replacing existing animations — `feedback_nigel_no_removal.md`):
  - **Depth pass — pick at least 3 of the following:**
    - Add a subtle paint-can / brush silhouette behind the SVG path at low opacity (~10–15%) using existing brand swatches as fill.
    - Add a foreground splatter mark at each node when the node pulse fires — a 4–6 small dot burst in the swatch color, animating outward over 240ms with constant velocity (no easing curves on position; opacity fade is fine).
    - Add a horizontal motion-blur streak behind the lead dot at high travel velocities — a 60px linear gradient mask following the dot, terracotta-tinted, 8% opacity.
    - Replace the current static dark-slate panel border with an animated paint-stroke border SVG that draws in once on view-enter (stroke-dashoffset, 1.8s linear).
    - Bump the node-pulse swatch cycle so each of the 4 nodes uses a distinct brand color (terracotta → teal → gold → chalk-cream) instead of all-terracotta — gives a sense of "the project moves through stages."
    - Confirm the `IntersectionObserver` rootMargin is generous enough (Refiner already lowered to 0.05) — but if Spark sees the path still hidden in headless Playwright, log it and add a CSS `path-prefers-immediate` fallback class.
  - **Verification (RULE 3):** Playwright loads PaintFlow at 5 runway positions (5/25/50/75/95%) on desktop 1440 + iPhone 13 + iPhone SE; confirm SVG path is rendered with stroke visible at each position; confirm at least 1 node pulse fires within 4s of view-enter on each viewport. Save screenshots to `/tmp/soley-spark-cycle4-paintflow/`.

**Verification of Refiner's recent fixes (no edits — verify only):**

- ServicesScrollLock mobile double-panel bleed (BUG-025, fixed in d6c2ccf) — confirm mid-runway scrolling shows ONE panel at a time on iPhone SE 375 / iPhone 13 390 / iPhone Pro Max 414. If regression observed, **report in Spark return — do NOT silently fix** because ServicesScrollLock is HARD FORBIDDEN structurally.
- Process auto-advance (BUG-026, fixed in d6c2ccf) — confirm Process auto-advances within 4s of view-enter on all 3 viewports. Same rule: report regressions, do not re-touch.
- PortfolioGallery EXTERIOR chip text (BUG-027, fixed in d6c2ccf) — confirm active-chip text reads correctly, not as an orange block.

**Forbidden moves:**

- **HARD FORBID structural edits to:** ServicesScrollLock, Process, PortfolioGallery, ScrollRevealObserver, Hero environment, Footer. Copy edits or visual depth additions to those sections are NOT permitted this cycle. Spark touches SectionDivider + PaintFlow only.
- **Do NOT introduce R3F / @react-three/fiber / drei / three** (Razor removed it; SVG signature is the approved hero centerpiece).
- **Do NOT add bloom postprocessing** (flickers on alpha canvases — catalog item #1 forbids it).
- **Do NOT use `Math.sin` oscillation, `MathUtils.lerp`, or any speed-easing on motion path velocity** (RULE 12 — constant velocity). Easing is fine on opacity, scale, color — not on positional travel speed.
- **Do NOT use `matchMedia` to disable PaintFlow / SectionDivider on mobile** (RULE 4). Scale down complexity if needed; never bail.
- **Do NOT add ghost numbers** behind any section (RULE 8).
- **Do NOT pile glow-on-glow** — replace any redundant gradient that already exists rather than stacking new ones (`feedback_simplicity_over_polish.md`).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered elements — use `.scroll-reveal` IO pattern (catalog #9).
- **Do NOT strip content count** from PaintFlow nodes (4 stays) or any other section (`feedback_frame_b_richness.md`).
- **Do NOT downgrade any prior glow / animation / effect** from prior cycles (`feedback_nigel_no_removal.md`).
- **Do NOT call the iMessage reply tool** (RULE 1 — Spark is a sub-agent).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** anywhere in code, commits, or comments (RULE 2). The brief is "more visual depth" — execute at full intensity.
- **Do NOT fabricate** any copy in node labels or divider tooltips (RULE 7).

**MEMORY.md entries Spark MUST respect:**

- `project_penn_tech_baseline.md` — SectionDivider (#3) and PaintFlow (#5) are explicit catalog targets; #12 (constant velocity) governs any positional motion.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — no "subtle / considered" reframings of "more visual depth."
- RULE 3 / `feedback_actually_scroll_test.md` — verify at 5 runway positions on 3 viewports.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — no `matchMedia` bail-outs.
- RULE 7 — no fabricated specifics in any new copy.
- RULE 8 / `feedback_no_ghost_numbers.md` — no large faded background numerals.
- `feedback_simplicity_over_polish.md` — replace, don't pile.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — never remove a prior glow / animation / effect.
- `feedback_interesting_scroll.md` — depth pass should reinforce "fun to scroll, not template."
- `feedback_unique_design.md` — hand-tuned SVG / CSS, not generic particle.js / template patterns.
- `feedback_horizontal_scroll.md` — ServicesScrollLock pattern is verified-only this cycle.
- `feedback_pixel_alignment.md` — Spark must check center-alignment at 375 + 414 mobile during verification.

---

## Forbidden cycle-wide

- **Sub-agents texting the user** (RULE 1). Builder, Spark, Pixel, Nigel, QA, Refiner, Coordinator are all sub-agents. Only the orchestrator texts.
- **Touching ServicesScrollLock / Process / PortfolioGallery / ScrollRevealObserver / Hero environment** structurally (all HARD FORBIDDEN this cycle — too recently refit).
- **Hero R3F re-introduction** (Razor removed three / @react-three/fiber / drei deliberately; SVG signature is the approved centerpiece).
- **Footer "SOCIAL CHANNELS COMING SOON" → fake INSTAGRAM swap.** Honest pre-launch only (RULE 7).
- **Catalog #1 R3F push** — orchestrator approved SVG signature reveal as the catalog #1 equivalent. Ignore Nigel's R3F suggestion.
- **Catalog #11 footer social link** — orchestrator-approved as intentional pre-launch framing. Ignore Nigel's INSTAGRAM suggestion.
- **Fake project / customer / founder / neighborhood / city names**, fake "Est. YYYY", fake reviews, fake stats (RULE 7).
- **`matchMedia` bail-outs** to disable any feature on any viewport (RULE 4).
- **Framer Motion `whileInView`** on SSR-rendered elements — use `.scroll-reveal` IO pattern (catalog #9).
- **Ghost numbers** behind any section (RULE 8).
- **Bloom postprocessing** (flickers on alpha canvases).
- **`Math.sin` / `lerp` smoothing** on positional motion (RULE 12 / catalog #12).
- **"Subtle / considered / editorial restraint / tasteful / delicate / refined"** language anywhere (RULE 2).
- **Stripping content count** from any section (`feedback_frame_b_richness.md`).
- **Removing or downgrading** any prior glow / animation / effect (`feedback_nigel_no_removal.md`).
- **Calling the user a bottleneck** in commits or reports (`feedback_respectful_tone.md`).

---

## Section cooldown register (for next-cycle Coordinator)

| Section | Touches in last 6 entries (after this cycle) | Cycle pressure |
|---|---|---|
| ServicesScrollLock | 1 (Refiner d6c2ccf) | Soft-cool, hard-forbid this cycle |
| Process | 2 (Spark 85888ef + Refiner d6c2ccf) | Soft-cool, hard-forbid this cycle |
| PortfolioGallery | 3 (Builder 55adef2 + Pixel 6e88be7 + Refiner d6c2ccf) | **HARD COOLDOWN active** — do not touch next cycle either |
| ScrollRevealObserver | 1 (Refiner d6c2ccf) | Soft-cool |
| Hero environment | 1 (Spark 85888ef) | Soft-cool, hard-forbid this cycle |
| Footer | 1 (Pixel 6e88be7) | Soft-cool, copy-edits OK this cycle |
| SectionDivider | 0 → 1 after this cycle (Spark) | Active this cycle |
| PaintFlow | 0 → 1 after this cycle (Spark) | Active this cycle |
| LiveEstimate | 0 in last 6 | OK |
| FounderBlock / WhySoley / Contact | 0 in last 6 | OK |

---

## Rationale (one line)

Score 7.3 / 7.5 cap with all BLOCKERS / HIGHs closed by Refiner d6c2ccf — schedule **Builder** for a word-level honesty + clarity copywriting pass across every section (no structural edits) and **Spark** to push catalog #3 SectionDivider + catalog #5 PaintFlow toward 0.9 with brand-specific paint-drop motion + visual depth, while ServicesScrollLock / Process / PortfolioGallery / ScrollRevealObserver / Hero environment all sit hard-forbidden structurally after the recent refits.
