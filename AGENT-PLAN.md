# AGENT-PLAN.md — Soley Painting (Cycle 1)

**Date:** 2026-05-07
**Decision rule fired:** Default rotation (no prior cycles, no scores, no AUDIT). This is the first supervised cycle of a fresh scaffold — Scout-first ordering takes precedence over the standard rotation because the brand-specific catalog mappings have not been written yet.
**Repo state:** Two commits total — Next.js scaffold + tooling. `app/page.tsx` is a placeholder. Palette is terracotta + teal. R3F + framer-motion + Lucide already installed.
**Catalog reference:** `~/.claude/projects/-Users-modica/memory/project_penn_tech_baseline.md` — 12-feature blueprint. **None of the 12 are present yet** — every cycle this month closes gaps.

---

## Scheduled agents (in order)

### 1. Scout — research + catalog mapping
**Catalog items addressed:** All 12 (writes the brand-specific mapping document Builder + Spark consume).
**Brief:** Research 4-6 best-in-class painting / contractor sites and 2-3 feature-rich premium-craft sites (e.g. niche Aesop-tier service brands). Produce `SCOUT-REPORT.md` with:
- A 12-row table mapping each Penn Tech catalog item to its **Soley Painting equivalent** (cube → 3D paintbrush mid-stroke; cube-face palette → terracotta/teal/clay tile chips; services scroll-lock → 5 painting service categories; workflow diagram → prep → prime → paint → finish; live conversational moment → live "estimate request" form filling itself; etc.).
- Pre-launch honest framing only. **No fake reviews, no fake addresses, no fake project counts** — Scout must explicitly note where placeholders go ("Project gallery — photography forthcoming", "Service area — coming soon").
- Reference URLs for each mapping decision.

**MEMORY.md entries that bind Scout:**
- `project_penn_tech_baseline.md` — the 12-feature catalog **IS** the deliverable spec.
- `feedback_unique_design.md` — break Claude defaults; site must NOT look AI-generated.
- `feedback_no_self_throttle.md` — execute "impressive 3D" at full intensity; do NOT extrapolate brand inspiration into "subtle / restrained / considered."
- `feedback_interesting_scroll.md` + `feedback_horizontal_scroll.md` — mandatory scroll-driven sections, vertical-locks-then-scrolls-horizontally pattern.
- RULE 7 (CLAUDE.md) — content honesty; no fabricated team / addresses / reviews.
- RULE 1 — Scout does NOT text the user.

**Forbidden moves for Scout:**
- Do NOT propose copying Penn Tech's cube literally. The hero is a 3D paintbrush (or rotating color wheel / paint-can stir / brush-stroke ribbon).
- Do NOT invent a list of "5 fake testimonials" or "150+ projects" stats.
- Do NOT propose a generic dev-content / template-marketplace framing (RULE: `feedback_no_dev_content.md`).

---

### 2. Builder — page structure + skeleton sections
**Catalog items addressed:** #1 (3D hero scaffold), #2 (palette tokens propagated), #3 (section divider component), #4 (services scroll-lock skeleton), #9 (CSS scroll-reveal pattern wired in `globals.css`).
**Brief:** Build the page shell per `app/page.tsx` target outline in CLAUDE.md. Prioritize wiring the structural backbone — Builder ships skeletons; Spark layers visual intensity next.
- `Hero3D.tsx` — R3F canvas with a placeholder paintbrush primitive (cylinder handle + box bristles is fine for cycle 1). Constant rotation. No bloom postprocessing. Reserve a fixed-height container so layout doesn't jump.
- `SectionDivider.tsx` — brand-equivalent of Penn Tech's mini-cube divider (mini paint-drops or mini brush-tips traveling across a hairline gradient).
- `ServicesScrollLock.tsx` — vertical-locks-then-scrolls-horizontally through 5 painting service panels (Interior Residential / Exterior Residential / Commercial / Cabinet & Trim / Specialty Coatings — Scout confirms the final 5).
- `Workflow.tsx` placeholder — SVG dot-flow stub through prep → prime → paint → finish.
- `Process.tsx` placeholder — 5-step auto-advancing horizontal timeline stub.
- `Contact.tsx` — form skeleton with **honest pre-launch framing** ("Service area details coming soon", "Photography forthcoming").
- Globals: 3-layer text-glow utility classes; `.scroll-reveal` + `.in-view` IntersectionObserver pattern.

**MEMORY.md entries that bind Builder:**
- `project_penn_tech_baseline.md` — Builder MUST hit catalog items #1, #2, #3, #4, #9 in this cycle.
- `feedback_agent_stability.md` — first action MUST be a tool call; keep prompts short.
- `feedback_disabling_isnt_fixing.md` (RULE 4) — never bail JS via `matchMedia` to "make it work on mobile." One consistent layout; CSS + JS agree.
- `feedback_simplicity_over_polish.md` — replace when adding; don't pile.
- RULE 7 — pre-launch honest framing. NO invented testimonials or stats.
- RULE 1 — Builder does NOT text the user.
- Vercel deploy: commit author email must be `mmodica3@gmail.com`.

**Forbidden moves for Builder:**
- Do NOT add fake testimonials, fake star ratings, fake project counts, fake addresses, fake phone numbers.
- Do NOT use `framer-motion` `whileInView` on SSR-rendered elements (causes visible→hidden flash). Use the CSS `.scroll-reveal` pattern (catalog item #9).
- Do NOT add postprocessing bloom to the R3F canvas (flickers on alpha canvases).
- Do NOT collapse the scroll-lock to a vertical stack on mobile — fix the CSS instead.

---

### 3. Spark — visual intensity layer (3D paintbrush + palette accents + glow)
**Catalog items addressed:** #1 (paintbrush detail + materials), #2 (palette propagated through dividers/marquee/glow), #8 (3-layer text glow on hero), #10 (custom feature cards with tilt for the services panels).
**Brief:** Take Builder's skeleton and lift it to **eye-catching, full-intensity** (per RULE 2). The hero centerpiece is a 3D paintbrush — **make it the centerpiece**, not a stage prop.
- Real paintbrush geometry: handle (lathed cylinder), ferrule (metallic ring), bristle bundle (instanced thin boxes with slight curvature). Dual rim lights — terracotta key + teal fill. Constant angular velocity. Brand-tinted emissive on the bristle tip as if loaded with paint.
- Hero text: 3-layer halo glow (1px near-white core + 8-14px terracotta mid + 20-34px ambient). Per-element hue shifts available via `color-mix`.
- Section dividers: paint-drop motifs in palette colors traveling across hairline gradient — IntersectionObserver-gated.
- Services panels: 3D tilt on mousemove (rotateX/Y based on cursor); each panel uses one of the palette tile colors as accent.
- Mobile: cards become accordion expand-interaction (catalog #10), NOT static glass cards.

**MEMORY.md entries that bind Spark:**
- `feedback_no_self_throttle.md` (RULE 2) — **execute at full intensity.** Do NOT write "subtle / considered / restrained / tasteful / delicate" anywhere. Brand inspiration ≠ throttle.
- `feedback_simplicity_over_polish.md` — Frame B refines, never strips content count. Replace when adding; don't pile glow-on-glow or rule-on-rule.
- `feedback_frame_b_richness.md` — Frame B keeps content count.
- `feedback_no_ghost_numbers.md` (RULE 8) — NO large faded background numerals. Foreground oversized at full opacity is fine.
- `feedback_unique_design.md` — break Claude default patterns. Asymmetric layouts welcome.
- RULE 1 — Spark does NOT text the user.

**Forbidden moves for Spark:**
- Do NOT add ghost numbers (faded large background numerals).
- Do NOT pile glow-on-glow, gradient-on-gradient, or rule-on-rule. Replace; don't stack.
- Do NOT downgrade to "subtle" — full-intensity 3D is the brief.
- Do NOT remove animations / glows that Builder shipped (RULE: `feedback_nigel_no_removal.md` — applies to Spark too).

---

### 4. Pixel — mobile alignment audit
**Catalog items addressed:** #4 / #10 (mobile parity); ensures the scroll-lock + cards work at 375 + 414.
**Brief:** Playwright audit at **375×667 (iPhone SE 3rd gen)** AND **390×664 (iPhone 13)** AND **414×896 (iPhone 11 Pro Max)** AND desktop **1440×900**. Sample at 5%/25%/50%/75%/95% through the scroll-lock runway and through the page as a whole. Capture screenshots at each sample. Verify:
- Center-alignment consistency on every section (per `feedback_pixel_alignment.md` — non-negotiable).
- The 3D paintbrush hero is centered and the canvas is not clipped at any viewport.
- Scroll-lock horizontal travel works mid-runway, not just at the entry/exit.
- Tap targets are ≥44px on mobile.
- No overflow-x at any sample.
**Output:** `PIXEL-AUDIT.md` listing each sampled position + viewport + finding. If something is broken, file the bug — do NOT fix by `matchMedia` guard (RULE 4).

**MEMORY.md entries that bind Pixel:**
- `feedback_pixel_alignment.md` — center-alignment audit on mobile is non-negotiable.
- `feedback_actually_scroll_test.md` (RULE 3) — sample 5+ positions through the runway. Single-snapshot verification is theater.
- `feedback_disabling_isnt_fixing.md` (RULE 4) — file bugs; do not "fix" by hiding features.
- RULE 1 — Pixel does NOT text the user.

**Forbidden moves for Pixel:**
- Do NOT claim "fixed" from a single screenshot or a `getComputedStyle` read.
- Do NOT propose disabling a feature on mobile as a fix.

---

### 5. Nigel — score from real prospective customer's lens
**Catalog items addressed:** Scores against all 12 catalog items as the rubric.
**Brief:** Score the live site (Vercel deploy) from the perspective of a real homeowner / facilities manager evaluating Soley Painting for a job. Use the Penn Tech catalog as the rubric: **how many of the 12 features are present in a brand-appropriate form?** A site with hero + a couple cards is missing 10+ items and should NOT approach Penn Tech's score. Starting score for a fresh site is **~5.5, not 7.0** (per `feedback_nigel_stricter.md`).
- Output: `SCORES.log` line: `2026-05-07 cycle1 — N.NN — <one-sentence headline>`
- Output: `AUDIT.md` with top-3 priorities for next cycle.
- Score cap stays in place because real photography + real reviews + real address have not landed yet (per `/loop` cycle rules in CLAUDE.md).

**MEMORY.md entries that bind Nigel:**
- `feedback_nigel_stricter.md` — start ~5.5, score from real customer's lens.
- `feedback_nigel_no_removal.md` — NEVER recommend removing glows / animations / effects. Only add or improve.
- `project_penn_tech_baseline.md` — the 12-item catalog IS the rubric.
- RULE 1 — Nigel does NOT text the user.

**Forbidden moves for Nigel:**
- Do NOT recommend stripping animations / glows / 3D for "performance" or "polish."
- Do NOT score above the cap until real photography + real reviews + real address arrive.
- Do NOT recommend fabricating any content to raise the score.

---

## Forbidden cycle-wide

- **No fabricated content of any kind.** Pre-launch honest framing ONLY. (RULE 7)
- **No copying Penn Tech moves verbatim.** Cube → 3D paintbrush. Cube-face tile palette → terracotta/teal/clay paint chips. (Catalog rule)
- **No `matchMedia` bail-outs** to make features "work" on mobile. Fix the CSS/JS mismatch. (RULE 4)
- **No ghost numbers.** Large faded background numerals are out. (RULE 8)
- **No agent texts the user.** Only the orchestrator does. (RULE 1)
- **No "subtle / considered / editorial restraint" qualifiers** invented by the agents. The brief is full-intensity 3D + scroll-driven feature density. (RULE 2)

## Section cooldown

None — first cycle, no history.

---

## Rationale (one line)

Cycle 1 of a fresh scaffold: Scout maps the 12-item Penn Tech catalog onto Soley Painting first, then Builder ships the skeleton, Spark adds full-intensity 3D + glow, Pixel verifies mobile, Nigel scores against the catalog as rubric.
