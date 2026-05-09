# AGENT-PLAN.md — Soley Painting

**Cycle:** 14 (Coordinator)
**Date:** 2026-05-07
**Live:** https://soley-painting.vercel.app
**Prior Nigel score:** 7.1 (cap 7.5 pre-launch)
**Score gate:** 7.1 < 8.5 — full-team eligibility, but ceiling is close.
**Decision:** ONE LIGHT Spark final-polish pass only. Signal CONVERGENCE-PAUSE if next Nigel does not clear +0.2.

---

## Dispatch rationale (one line)

Score moved 6.9 → 7.1 on substantive Refiner work (OG fix + SVG icons + LiveEstimate→Contact bridge + portfolio framing + phone copy honesty); ALL five Nigel cycle-13 priorities are closed; remaining gaps are customer-blocked (photography / reviews / address / Formspree) — schedule one light Spark cohesion pass and signal convergence to the orchestrator if Nigel cycle 14 doesn't clear 7.3.

---

## Convergence analysis

**Closed in last cycle (commit ee55ef4):**
- P1 OG image font fetch — fixed via local font bundle
- P2 phone/text contact hook — honest "Phone available at launch" placeholder shipped
- P3 LiveEstimate→Contact bridge — anchor CTA shipped
- P4 ServicesScrollLock emoji icons — replaced with 5 SVG icons
- P5 PortfolioGallery framing — pre-launch framing line added

**Remaining gaps that would actually move the score:**
- Real photography (CUSTOMER, not agent)
- Real reviews / testimonials (CUSTOMER, not agent)
- Real street address (CUSTOMER, not agent)
- Real Formspree wiring (CUSTOMER credential, not agent)
- Real founder portrait (CUSTOMER, not agent)

**Verdict:** The site has reached the agent-only ceiling. Score 7.1 of 7.5 cap = 95%. Further agent cycles risk churn (regression cycles like the OG-image break) without proportional value gain.

**Why one more light cycle, not immediate stop:**
- Single Spark cohesion pass is low-risk (cosmetic only) and may surface a final detail.
- If it ships and Nigel still doesn't move ≥+0.2, the case for convergence-pause becomes airtight rather than presumed.

---

## Scheduled agents (in order)

### 1. Spark — Final cohesion polish pass (Frame B — replace, don't pile on)

**Target axis:** Whole-site visual cohesion review with surgical patching only. No structural component edits. Globals.css and inline-style cosmetic adjustments only.

**What to ship (pick ONE — only the highest-leverage item):**
1. Hero → ServicesScrollLock handoff: if there's still a hard seam after the recent transition work, add a brief umber→panel-bg ramp on the first 120px of ServicesScrollLock (replace any existing hard-cut, don't stack on top of it).
2. PortfolioGallery → FounderBlock handoff: paint-bleed transition similar to the Process→Contact gradient already shipped, in palette.
3. Final easing-cohesion sweep: scan globals.css for any `transition-timing-function` that isn't on the project's standard easing curve and bring it in line.
4. Letter-spacing audit on display headings (H1/H2): if any heading is using default tracking, tighten to project standard.

**Decision rule for Spark:** Pick the ONE that produces the most visible cohesion delta. Ship that. Do not ship multiples.

**REPLACE rule:** If you add a new transition rule, REPLACE the existing seam/cut. Never pile on glow-on-glow or rule-on-rule. (`feedback_simplicity_over_polish`)

**Verification:** Mid-runway scroll test at desktop 1440 + iPhone 13 390 + iPhone SE 375 — capture before/after on the chosen handoff. Single-position screenshot is NOT sufficient (RULE 3 / `feedback_actually_scroll_test`).

**MEMORY.md rules to respect:**
- `feedback_no_self_throttle` — execute with confidence, no "subtle/considered/editorial-restraint" language anywhere.
- `feedback_simplicity_over_polish` — replace, don't pile on.
- `feedback_pixel_alignment` — verify on iPhone SE 375 + iPhone 13 390.
- `feedback_unique_design` — don't default to standard cubic-easing; lean into painter brand if a clean idea surfaces.
- `feedback_no_ghost_numbers` (RULE 8) — never anchor a transition with a faded background numeral.
- `feedback_disabling_isnt_fixing` (RULE 4) — never use matchMedia to bail features.
- `feedback_actually_scroll_test` (RULE 3) — multi-position scroll verification mandatory.
- `feedback_frame_b_richness` — refine, don't strip content count.
- `feedback_no_dev_content` — site is the customer-facing demo, not a developer feature list.
- RULE 1 — sub-agent does NOT text the user.

**Forbidden this cycle:**
- All existing component STRUCTURE (Hero3D, ServicesScrollLock, Process, PaintFlow, PortfolioGallery, FAQ, Contact, NotifySignup, LiveEstimate, WhySoley, FounderBlock, Footer, Navbar, SectionDivider, ServicesMarquee) — NO structural rewrites.
- Glow-on-glow stacking; bloom; ghost numbers.
- New positional motion using sin/lerp.
- matchMedia bail-outs.
- "Subtle / considered / editorial-restraint / minimal" language in commits, comments, or PR notes.
- New JS animations.
- Removing any existing animation, glow, or effect (`feedback_nigel_no_removal` standing rule applies to Spark too in this final-polish posture).
- R3F re-introduction.

**Brief:** Final cohesion polish. Pick ONE high-leverage cosmetic item. Ship it via globals.css only. REPLACE the existing seam, don't pile on. Verify multi-viewport with mid-runway scroll samples. RULE 1 — do not text the user; return your report as the tool result and exit.

---

## Skipped this cycle

- **Builder** — no structural gap to fill; all Nigel P1-P5 closed.
- **Refiner** — no open BUGs in the priority queue; recent ee55ef4 closed the queue.
- **Pixel** — font floor was swept clean cycle 13; nothing to fix without a new violation surfacing.
- **Nigel** — runs naturally on the next :48 slot per the standard rotation; this :03 slot is for build/polish, not audit.
- **QA** — no new feature shipped that needs verification beyond Spark's own mid-runway check.
- **Scout** — research budget exhausted; the catalog floor (Penn Tech baseline) is fully met.

---

## Forbidden sections (cycle-wide)

ALL component structures are off-limits. Eligible file is `app/globals.css` only.

---

## Convergence-pause trigger (for the next Coordinator cycle)

After Spark ships and Nigel cycle 14 runs:
- If Nigel score does NOT clear **7.3** (≥ +0.2 movement), the next Coordinator MUST signal convergence-pause to the orchestrator. Site has reached the agent-only ceiling; remaining lift requires customer-supplied assets (photography, reviews, address, Formspree credentials, founder portrait).
- If Nigel clears 7.3, schedule one more disciplined cycle on whatever axis Nigel surfaces.
- If Nigel SCORE drops, treat as regression and schedule Refiner against the regression only.

---

## Standing rules reinforced for Spark this cycle

- **RULE 1** — Sub-agent does NOT text the user. Ever. Return the report as a tool result.
- **RULE 2** — Execute the brief at full intensity. No self-throttle.
- **RULE 3** — Multi-position mid-runway scroll verification mandatory (5%, 25%, 50%, 75%, 95%) on desktop 1440 + iPhone 13 390 + iPhone SE 375.
- **RULE 4** — Disabling is not fixing. No matchMedia bail-outs.
- **RULE 5** — Soley uses Tailwind/Next.js, NOT a vanilla `style.min.css`. No clean-css regen needed; rule does not apply structurally — but verify the change actually renders in production after Vercel deploy.
- **RULE 7** — Content honesty. No fabricated specifics anywhere.
- **RULE 8** — No ghost numbers.
- **Git author:** Matt Modica <mmodica3@gmail.com>.
