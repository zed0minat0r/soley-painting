# AGENT-PLAN.md — Soley Painting

**Cycle:** :03 dispatch (post hero-icon fix)
**Date:** 2026-05-07
**Coordinator focus axis:** post-palette visual cohesion + under-attended sections
**Live:** https://soley-painting.vercel.app
**Current Nigel score:** 6.9 / 10 (cap 7.5 pre-launch)

---

## Dispatch decision

Hero icon-cycling bug closed by Refiner (6575891) — `useState(-1)` boot fix verified to ship. Score is 6.9 (well below the 8.5 polish-mode gate), so full build crew remains eligible. Recently-touched sections (Hero3D, Contact, LiveEstimate) are forbidden for structural change this cycle — verify-only allowed.

The all-warm "Drop Cloth & Rust" palette migration (6ad296f) dropped teal entirely. Several sections were last visually polished BEFORE the migration and may now feel out of rhythm. WhySoley (cycle 5 content polish + cycle 6 accordion) and FounderBlock (cycle 5 content) are the strongest candidates — both score 6.0–7.5 in Nigel cycle 9 and haven't received visual work under the new system.

Spark also gets a polish lane: hero environment now actually animates icons, so the surrounding atmosphere (drop cloth + brush rest + drips + particles) deserves a verification pass with the new palette in mind.

**Rationale:** Builder visual-refinement on under-attended sections + Spark atmosphere verification + palette-cohesion sweep — distribute attention away from over-touched sections, lift FounderBlock/WhySoley scores.

---

## Scheduled agents (this cycle, in order)

### 1. Builder — visual refinement on FounderBlock + WhySoley under all-warm palette

**Brief:** Visual upgrade pass on `FounderBlock` (currently 6.0) and `WhySoley` (currently 7.5) under the all-warm Drop Cloth & Rust palette. Do NOT strip content count. FounderBlock is text-heavy without photography anchor — add craft-paper texture treatment, tighten the portrait-placeholder framing so it reads as intentional "photo coming" rather than empty rectangle, surface the operational specifics (owner-takes-calls-before-8pm, same-crew) with stronger visual hierarchy. WhySoley: review the 4 tilt cards under the new palette — verify the rust+linen+stone+umber+ochre rotation reads cohesively across all 4 cards, NOT all the same accent.

**MEMORY.md entries to respect:**
- RULE 7 (no fabrication — no fake portrait, no fake crew names, no invented founding date)
- RULE 8 (no ghost numbers — do NOT add large faded background numerals behind WhySoley cards)
- `feedback_simplicity_over_polish` — when adding, replace; do not pile glow-on-glow
- `feedback_no_self_throttle` — execute the brief at full intensity; do not write "subtle" / "considered" / "editorial restraint" into your own implementation
- `feedback_frame_b_richness` — never strip content count from rich sections

**Forbidden sections this cycle (do NOT structurally change):**
Hero3D, Contact, LiveEstimate, ServicesScrollLock structural JS, PaintFlow, Process, PortfolioGallery, FAQ, Footer, Navbar, SectionDivider, ScrollRevealObserver

**Forbidden patterns:**
R3F re-intro, fake testimonials/credentials/awards, matchMedia bail-outs, ghost background numerals, sin/lerp on positional motion, "subtle"/"considered"/"editorial restraint" language anywhere in commits or comments, score-chasing, score targets in code.

---

### 2. Spark — Frame A: hero atmosphere verification + page-wide palette cohesion sweep

**Brief:** Frame A pass. Two scopes: (a) verify the hero environment (drop cloth tile, brush rest, paint drips, particle drift) still reads correctly with the icon system now actually firing — does the brush draw the smiley/paint-can icon cleanly, do the surrounding elements support or compete with it? (b) page-wide palette cohesion sweep under all-warm Drop Cloth & Rust — scan dividers, accent bars, glow rings, button borders for any residual teal references that escaped the 6ad296f migration. Replace, don't pile. Verify-only on Hero3D structurally — if the icon draw still looks weak after the Refiner fix, log it as a finding for next cycle, do NOT restructure Hero3D this cycle.

**MEMORY.md entries to respect:**
- RULE 4 (disabling isn't fixing — no matchMedia guards on customer-asked features)
- RULE 5 + RULE 6 (regenerate `style.min.css` if you touch any CSS file with that pipeline; bump cache-buster)
- `feedback_simplicity_over_polish` — when adding, REPLACE the prior treatment, do not pile on
- `feedback_no_self_throttle` — full intensity on the brief; "impressive" not "tasteful"
- `feedback_unique_design` — break Claude default patterns; this is a craft-painter brand, not a generic Tailwind site
- `feedback_actually_scroll_test` — if you verify hero atmosphere via Playwright, sample 5+ scroll positions, not one snapshot

**Forbidden sections this cycle (do NOT structurally change):**
Hero3D structural (verify-only on icon system), ServicesScrollLock JS, Contact, LiveEstimate, PaintFlow JS, Process timer JS, FAQ accordion, Footer, Navbar structural, SectionDivider structural

**Forbidden patterns:**
glow-on-glow piling, rule-on-rule, ghost numbers, bloom (per prior coord directive), sin/lerp on positional motion, R3F re-intro, fake INSTAGRAM swap, matchMedia bail-outs, "subtle"/"considered"/"editorial restraint" language, score targets.

---

## Out of scope this cycle (post-pipeline polish queue)

- Real photography (still pending user)
- Real reviews / testimonials (still pending user)
- Real service area / address (still pending user)
- Formspree endpoint (still pending user)
- Pre-launch cap remains 7.5 until those four land

---

## Convergence + drift checks (executed this cycle)

- Convergence guard: PASS — last 4 changelog entries have real commits (6575891, ef90147, fc13222, 81725df), no STOP markers.
- Score gate: PASS — 6.9 < 8.5, full crew eligible.
- Section cooldown: ServicesScrollLock and Hero3D have appeared in 3+ of last 6 entries — FORBIDDEN structurally for both agents this cycle (Hero3D verify-only).
- Spark frequency: PASS — Spark scheduled this cycle.
- Memory drift: no entries from last 7 days are unhandled. RULE 1 (sub-agents never text user) and RULE 2 (no self-throttle) explicitly reinforced in both briefs.
- Audit priority match: Nigel cycle 9 P1 (LiveEstimate duplicate) closed by Refiner fc13222. P2 (panel tilt cards on ServicesScrollLock) deferred — section is in cooldown. P3 (Formspree) blocked on user. P4 (ServicesMarquee verify) deferred to QA next cycle. P5 (PaintFlow mobile) closed by e81b122.
