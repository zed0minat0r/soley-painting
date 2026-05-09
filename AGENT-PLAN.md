# AGENT-PLAN.md — Soley Painting (:03 slot, post-QA-Pixel-Refiner)

**Date:** 2026-05-07 :03 (post-Refiner round)
**Live:** https://soley-painting.vercel.app
**Latest score:** 7.2 (mobile-UX axis, 2026-05-07 — Nigel cycle 3 / commit 19cf86f)
**Latest commit:** 6aa205e (Refiner — BUG-014/017/018/021/022 closures)
**Cap:** 7.5 pre-launch — currently 0.3 below cap

---

## Decision rule fired

**Default rotation + Section cooldown + Catalog gap-fill.** Score (7.2) is below the 8.5 polish-mode gate — full toolset available. No stuck-loop signal — last 6 changelog entries all show commits. QA + Pixel + Refiner closed every BLOCKER and HIGH from the last cycle. Now there is real headroom to push beyond the 7.2 plateau toward 7.5: the Penn Tech catalog still has true gaps (portfolio section never built, Process auto-advance is present but the cinematic polish lags Penn Tech's char/word-stagger reference, Hero centerpiece scored 0.7 because the SVG signature stands alone with no environment around it). Schedule **Builder → Spark** in that order: Builder fills the catalog gap (Portfolio section — Scout Site D Hedlund pattern), Spark elevates the two catalog items still scoring 0.7 (Hero environment + Process timeline cinematic transitions).

**Section cooldown trigger (3+ of last 6 changelog touches → forbid this cycle):**
- **FounderBlock** — touched in 280f953 (Pixel cycle 2), 5e07e6a (Builder cycle 2). 2 touches — soft cool, do not refactor structure.
- **WhySoley** — Builder cycle 2 + Refiner spotlight. Soft cool.
- **Contact** — Builder cycle 2 (left col fill). Soft cool.
- **LiveEstimate** — Spark cycle 2 (e91fac5) + Refiner BUG-017 (181d376). 2 touches — verify only, no redesign.
- **PaintFlow** — Spark cycle 2 (e91fac5) + Refiner BUG-014/018 (181d376). 2 touches — verify only, no redesign.
- **ServicesScrollLock** — Refiner BUG-022 panel numerals (181d376). Soft cool — do not re-touch the scroll handler.

No section has 3+ touches yet, so nothing is hard-forbidden by the cooldown rule alone — but Builder + Spark this cycle should explicitly steer clear of these six sections. The catalog gap (portfolio) and the two underscored catalog items (#1 Hero environment, #7 Process cinematic) are the right targets.

---

## Scheduled agents (in order)

### 1. Builder — Portfolio placeholder section (catalog gap-fill)

**Targets:**

- **NEW SECTION — Portfolio / Project Gallery (catalog gap, Nigel cycle 1 priority 5).** This was on the cycle-1 priority list and never shipped. Scout Site D (Hedlund Painting, https://hedlundpainting.com/) is the explicit reference pattern: filterable project gallery with **All / Interior / Exterior / Commercial / Cabinet & Trim / Specialty** filter chips matching the 5 services. Build the section between FounderBlock and Process (insert in `app/page.tsx` accordingly).
  - **Component:** `app/components/PortfolioGallery.tsx`.
  - **Filter chips row:** 6 chips (All + 5 service categories). Active chip uses terracotta background + chalk text; inactive chips use chalk border + slate text. Filter behavior: clicking a chip sets a state and shows tiles whose `data-category` matches; "All" shows everything.
  - **Tile grid:** 6–9 placeholder tiles in a CSS grid (3-up desktop, 2-up tablet, 1-up mobile). Each tile is an aspect-ratio 4:3 framed slot with: (a) honest pre-launch caption "Photography forthcoming", (b) a colored accent stripe at top using the swatch color of the matching service, (c) a 2-line metadata row showing service category + a placeholder neighborhood like "Project location coming soon" — **NEVER fabricate a real city / neighborhood / project name** (RULE 7). Tiles must use a tasteful neutral fill (chalk-toned subtle gradient, NOT a stock photo, NOT a fake before/after).
  - **Section eyebrow + headline:** "Recent Work" eyebrow, headline like "Projects in progress." Sub-line acknowledges pre-launch honestly: "Real photography drops as projects wrap." NO fabricated stats ("47 projects completed"), NO fake testimonials inside tiles.
  - **Honest empty state:** if a filter has no matching tiles, show a small empty-state card "More <category> work coming soon."
  - **Filter UX:** clicks must update the visible tiles via React state. Animate the show/hide with a 200ms opacity transition — no layout-shift jank.
  - **Mobile audit:** tile grid stacks 1-up below 640px. Filter chips wrap to two rows if needed. Tap targets ≥ 44px on chips.

- **Verification (RULE 3 — mid-runway scrolling, not snapshots).** Build a Playwright check that:
  1. Loads the live preview (or `npm run dev` localhost:3000).
  2. Locates `#portfolio` (give the section that id) — read `getBoundingClientRect().top + window.scrollY` and `offsetHeight`.
  3. Samples 5 positions through the section (5 / 25 / 50 / 75 / 95 %).
  4. At each position captures a screenshot at 1440×900, iPhone 13 (390×664), iPhone SE (375×667).
  5. Clicks each filter chip and confirms tile-count changes match expectation.
  6. Saves screenshots to `/tmp/soley-portfolio-cycle3/` for human review.

**Forbidden moves:**

- **Do NOT touch FounderBlock, WhySoley, Contact, LiveEstimate, PaintFlow, or ServicesScrollLock structure** (all on soft-cool). Inserting the new Portfolio section between FounderBlock and Process is fine — but do not edit those sections' internal markup or styles.
- **Do NOT touch the Hero centerpiece** — Spark owns Hero environment this cycle.
- **Do NOT fabricate** any real project name, city, neighborhood, customer name, before/after photo, project count, square-footage, or completion date (RULE 7). Every tile says "Photography forthcoming." Every metadata row stays generic.
- **Do NOT add a "View All" link** that goes to a /projects page that doesn't exist. If the link is included, it must scroll to the top of the section or be omitted entirely.
- **Do NOT add ghost numbers** behind tiles or behind the headline (RULE 8).
- **Do NOT use Framer Motion `whileInView`** on the tiles — use the existing `.scroll-reveal` IntersectionObserver pattern that already lives in `globals.css` (catalog #9). Tiles ship hidden in SSR HTML and toggle `.in-view` on intersect.
- **Do NOT collapse the filter to a select dropdown on mobile** — keep the chip row, just let it wrap (RULE 4 — disabling a feature is not a fix).
- **Do NOT remove or downgrade** any glow / animation / effect from prior cycles (`feedback_nigel_no_removal.md`).
- **No "subtle / considered / editorial restraint / tasteful / delicate"** language in commit messages or code comments (RULE 2).

**MEMORY.md entries Builder MUST respect:**

- `project_penn_tech_baseline.md` — Portfolio is the brand-equivalent of Penn Tech's case-study / project-gallery pattern; the 12-item catalog is the floor. The filterable gallery is also referenced in Scout Site D's "honest portfolio pattern."
- RULE 7 / `feedback_no_invented_fight_data.md` analogue — no fabricated project names, cities, before/after pics, customer names, project counts. Generic + honest only.
- RULE 8 / `feedback_no_ghost_numbers.md` — no large faded background numerals behind tiles or headline.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — filter chips must work on every viewport; do not collapse to a select.
- RULE 3 / `feedback_actually_scroll_test.md` — verify at 5 runway positions on 3 viewports.
- `feedback_pixel_alignment.md` — center-alignment of tile grid + chip row at 375 + 414.
- `feedback_frame_b_richness.md` — keep all 6–9 tiles; do not strip count if it feels "too dense."
- `feedback_simplicity_over_polish.md` — replace when adding (e.g., if the new section accidentally duplicates an existing visual treatment, replace, don't stack).
- RULE 1 / `feedback_always_imessage.md` — Builder is a sub-agent: do NOT call the iMessage reply tool.

---

### 2. Spark — Hero centerpiece environment + Process timeline cinematic upgrade

**Targets:**

- **Catalog #1 — Hero centerpiece environment (still 0.7 in Nigel rubric).** The SVG Sacramento signature reveal works but it floats alone in a chalk void — Nigel docked it for "no actual 3D geometry" and the user has flagged that the centerpiece "needs more presence than just a floating word." Add ambient atmosphere AROUND the signature (not on top of it — RULE 2: don't dilute, elevate):
  - **Painter's environment props** as low-key SVG backdrop layers behind the signature: a subtle drop-cloth corner texture at the bottom edge, a brush rest silhouette to one side, scattered paint-drip marks at the canvas baseline (terracotta + teal + clay-gold drips, varying sizes, low opacity ~12–18 %). These props live in a `.hero-environment` div with `pointer-events: none` and `z-index: -1` relative to the signature.
  - **Ambient-light SVG goboes:** a soft warm-light wash from upper-right (terracotta gradient at 8 % opacity) and a cool fill from lower-left (teal gradient at 6 %). Implement as two large `<radialGradient>` SVG circles, not box-shadow.
  - **Subtle particle drift:** 8–12 small painted-dust SVG circles drifting slowly upward (CSS keyframes, `animation-duration: 14–22s`, staggered delays, opacities 0.1–0.25, mixed swatch colors). NO bloom postprocessing — bloom flickers on alpha canvases.
  - **Constant-velocity rule (catalog #12):** the drift speed is constant — no `Math.sin` oscillation, no `MathUtils.lerp` smoothing. Each particle has its own constant rate.
  - **Mobile parity:** the environment scales down but NEVER disappears via `matchMedia` (RULE 4). Particles can drop to 4–6 on mobile but the props + goboes stay.
  - **Replace, don't stack:** if any prior chalk-empty padding or "subtle gradient" lives in the hero, REPLACE it with the environment layer. Do not pile glow on glow.

- **Catalog #7 — Process timeline cinematic upgrade (still 0.7).** Process auto-advances and has the countdown bar but Nigel scored it 0.7 because the transition between tabs is not as cinematic as Penn Tech's character-stagger title + word-stagger description + bullet pop. Upgrade:
  - **Character-stagger on title:** wrap each character of the active step's headline in a `<span>` with `animation-delay: N * 0.04s` and a CSS keyframe `from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; }`. Re-trigger on every tab change.
  - **Word-stagger on description:** same pattern but per-word with `animation-delay: N * 0.06s` and `translateX(-6px)` entry.
  - **Bullet pop:** each bullet has `animation-delay: (charsTotalDuration + N * 0.12s)` so they pop in sequence after the description settles. `transform: translateX(-8px) → 0` + opacity 0 → 1.
  - **Countdown bar:** keep the existing `scaleX(1 → 0)` over 10s linear. Reset on tab change.
  - **Tab transition out:** previous tab content fades out + slides 12px left over 0.32s ease-in before the next tab's char-stagger begins. Stagger the entry by ~0.12s so the cross-fade reads as a deliberate cinematic transition.
  - **Reduce-motion fallback:** if `prefers-reduced-motion: reduce`, skip the staggers but keep the auto-advance + countdown. Static fade replaces the slide.
  - **Verification (RULE 3):** Playwright must let the timeline auto-advance, capture screenshots at the start, mid-stagger, and steady-state for each of the 5 steps. 3 viewports (1440 / 390 / 375).

- **Verification of Refiner's recent fixes (no edits — verify only):**
  - **LiveEstimate (Spark touched in cycle 2, Refiner BUG-017 hydrated cleanly):** open the live URL, scroll to the LiveEstimate section, confirm the typing sequence runs, the cursor blinks, the "Sent" checkmark fires, and the form loops after the 8s pause. If any regression is observed, **report it back in the Spark return — do NOT silently fix it** because the section is on soft-cool and a third touch this cycle would trigger the cooldown rule next round.
  - **PaintFlow (Refiner BUG-014/018 fixed):** confirm the SVG draw-in runs and the dots travel the path on iPhone 13 + iPhone SE. Same rule: report regressions, don't re-touch.

**Forbidden moves:**

- **Do NOT touch FounderBlock, WhySoley, Contact, LiveEstimate, PaintFlow, or ServicesScrollLock structure** (soft-cool). Verify only.
- **Do NOT replace the Sacramento signature itself** with another animation. The environment is ADDITIVE behind/around it. The signature reveal stays.
- **Do NOT add a true 3D R3F paintbrush** — Razor uninstalled three / R3F earlier this cycle and the SVG signature was deliberately chosen as the centerpiece. Do not re-introduce three / R3F / @react-three/fiber.
- **Do NOT use bloom postprocessing.** Bloom flickers on alpha canvases — catalog item #1 explicitly forbids it.
- **Do NOT use `matchMedia` to drop the hero environment on mobile** (RULE 4). Scale down particle counts; do not bail.
- **Do NOT use `Math.sin` oscillation, `MathUtils.lerp`, or any speed-easing on particle drift** (RULE 12 — constant velocity).
- **Do NOT add ghost numbers** behind Process or behind Hero (RULE 8). The Process step number is foreground oversized and stays at full opacity.
- **Do NOT pile glow-on-glow** in the hero environment. Replace any redundant gradient that already exists. (`feedback_simplicity_over_polish.md`).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered elements — use the `.scroll-reveal` CSS pattern (catalog #9).
- **Do NOT strip content count** from Process (5 steps stay) or any other section (`feedback_frame_b_richness.md`).
- **Do NOT downgrade** any prior glow / animation / effect (`feedback_nigel_no_removal.md`).
- **No "subtle / considered / editorial restraint / tasteful / delicate"** language anywhere (RULE 2). The brief is "more presence" and "as good as Penn Tech's cinematic transitions" — execute at full intensity.
- **Do NOT fabricate** any copy in Process (no fake project names, customer names, or invented stats inside the bullets).

**MEMORY.md entries Spark MUST respect:**

- `project_penn_tech_baseline.md` — Hero (#1) and Process (#7) are the explicit catalog targets; #12 (constant velocity) governs the particle drift.
- RULE 2 / `feedback_no_self_throttle.md` — no "subtle / considered" reframings of "more presence." The user said "impressive enough?" — execute at full intensity.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — no `matchMedia` bail-outs to drop the environment on mobile.
- RULE 7 — no fabricated names / stats / dates inside Process bullets or Hero environment captions.
- RULE 8 / `feedback_no_ghost_numbers.md` — no large faded background numerals behind Process or Hero.
- RULE 3 / `feedback_actually_scroll_test.md` — Process verified across 5 step transitions, Hero environment verified at 3 viewports.
- `feedback_simplicity_over_polish.md` — replace, don't pile.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — never remove a prior glow or animation.
- `feedback_interesting_scroll.md` — Process cinematic upgrade reinforces the "fun to scroll, not template" mandate.
- `feedback_unique_design.md` — the hero environment must NOT look like default Claude / template patterns. Hand-tuned SVG props, not generic "particles.js" presets.
- RULE 1 / `feedback_always_imessage.md` — Spark is a sub-agent: do NOT call the iMessage reply tool.

---

## Forbidden cycle-wide

- **Sub-agents texting the user** (RULE 1). Builder, Spark, Pixel, Nigel, QA, Refiner, Coordinator are all sub-agents. Only the orchestrator texts.
- **Touching FounderBlock / WhySoley / Contact / LiveEstimate / PaintFlow / ServicesScrollLock structure** (all soft-cool). Verify-only on those.
- **Hero R3F re-introduction** (Razor removed three / @react-three/fiber / drei / @types/three). The SVG signature is the deliberate centerpiece.
- **Footer "SOCIAL CHANNELS COMING SOON" → fake INSTAGRAM swap.** User has explicitly said no fake handles. Honest pre-launch only.
- **Fake project names / cities / customer names / before-after photos / project counts** in the new Portfolio section (RULE 7).
- **Fake founder names / bios / "Est. YYYY"** in any block (RULE 7).
- **`matchMedia` bail-outs** to disable any feature on mobile (RULE 4).
- **`whileInView`** on SSR-rendered elements — use `.scroll-reveal` (catalog #9).
- **Ghost numbers** behind any section (RULE 8).
- **Bloom postprocessing** on hero (flickers on alpha canvas).
- **`Math.sin` / `lerp` smoothing** on hero particle drift (RULE 12 / catalog #12 — constant velocity).
- **"Subtle / considered / editorial restraint / tasteful / delicate"** language anywhere (RULE 2).

## Section cooldown register (for next-cycle Coordinator)

| Section | Touches in last 6 entries | Cycle pressure |
|---|---|---|
| Hero | 0 (post-Razor; this cycle Spark adds environment — counts as 1 going into next cycle) | Active — Spark touches |
| Portfolio | 0 (NEW — built this cycle) | Active — Builder touches |
| Process | 0 (this cycle Spark adds cinematic — counts as 1 going into next cycle) | Active — Spark touches |
| FounderBlock | 2 (280f953, 5e07e6a) | Soft-cool. Hard-forbid if a 3rd touch lands. |
| WhySoley | 2 (5e07e6a + Refiner spotlight) | Soft-cool. |
| Contact | 1 (5e07e6a) | OK. |
| LiveEstimate | 2 (e91fac5, 181d376) | Soft-cool. |
| PaintFlow | 2 (e91fac5, 181d376) | Soft-cool. |
| ServicesScrollLock | 2 (panel numerals 181d376 + scroll handler refit before that) | Soft-cool. |

---

## Rationale (one line)

Score is 7.2 / 7.5 cap with all BLOCKERS + HIGHs closed by Refiner — schedule **Builder** to fill the standing catalog gap (Portfolio section, Scout Site D Hedlund pattern) and **Spark** to push the two catalog items still scoring 0.7 (Hero centerpiece environment + Process cinematic char/word-stagger) toward 0.9, while every recently-touched section sits in soft-cool with verify-only.
