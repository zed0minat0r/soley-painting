# AGENT-PLAN.md — Soley Painting (Cycle 6, post-Nigel-5 cap-hit)

**Date:** 2026-05-07 (Cycle 6 / post-Refiner-d26d04b / post-Nigel-cycle-5 / post-QA-cycle-4)
**Live:** https://soley-painting.vercel.app
**Latest score:** 7.5 (conversion-friction axis, Nigel cycle 5 / commit 4419d6c) — **HIT pre-launch cap**
**Latest commit:** d26d04b (Refiner BUG-025 panel-bleed Option B + Nigel P4 accent bars)
**Cap:** 7.5 pre-launch — score CAN'T rise until real photography + real reviews + real address all land (`feedback_nigel_stricter.md`)

---

## Decision rule fired

**Polish-mode at the cap. Default rotation with strict cooldown register.** Score is exactly at the 7.5 pre-launch cap and CAN'T rise this cycle no matter what the team ships — per `feedback_nigel_stricter.md` the cap stays until real photography + real reviews + real address all land. The 8.5 polish-gate rule does NOT apply (the gate fires at >=8.5, not at the pre-launch cap), so Builder + Spark stay in rotation. But the *axis* of work shifts: the goal is no longer "fix what's broken" (all BLOCKERs/HIGHs closed by Refiner d26d04b — only 1 LOW BUG-035 remains, already fixed in e2f0637) — the goal is **accumulating quality on individual catalog items toward 1.0 each, building real headroom for when the cap lifts.**

The two raw catalog items still scoring 0.4 (#4 ServicesScrollLock + #7 Process + #10 WhySoley feature cards) — Nigel cycle 5 docked them based on a wrong-element measurement on ServicesScrollLock and a Playwright querySelector miss on PaintFlow + WhySoley card tilt. QA cycle 4 (commit d777487) confirmed translateX IS advancing, PaintFlow IS visible on all viewports, Process auto-advance IS firing, and EXTERIOR chip IS readable. So Nigel's 0.4 scores on #4 and #7 are stale. The real headroom this cycle lives on items at 0.7 that have NOT been touched recently:

- **#6 LiveEstimate** — last touched 2 cycles ago. Cycle 5 deduction: "estimate card feels disconnected from real contact form below — buyer sees 'estimate' twice and may hesitate which one to fill in." Real win available: tighter narrative connection between LiveEstimate and Contact, sharper CTA hierarchy.
- **#10 WhySoley** — last touched 2 cycles ago. Cycle 5 deduction: card tilt unconfirmed. Real win available: micro-content polish + sharper card body copy + confirmed-working tilt depth on desktop.

Plus two areas with NEVER-touched headroom:

- **Navbar** — never touched substantively in 6 cycles. Pure structural drift territory; a polish pass closes a gap nothing has.
- **Page-wide typography rhythm** — Builder's earlier copy passes touched per-section text, but no agent has run a global rhythm sweep on heading hierarchy, eyebrow tracking, body line-heights, vertical spacing between sections.

**Schedule: Builder → Spark in that order.** Builder runs micro-content polish on LiveEstimate + WhySoley + FounderBlock (NO new components, NO new sections — this is a tightening pass). Spark runs a brand-distinctive Navbar polish + page-wide typography rhythm pass (Frame B territory — refine spacing/typography, never strip content count per `feedback_frame_b_richness.md`).

---

## Section cooldown register (touches in last 6 changelog entries)

| Section | Recent touches | Status this cycle |
|---|---|---|
| ServicesScrollLock | Refiner d26d04b (BUG-025 + P4) | **HARD FORBID** structurally |
| Process | Refiner d6c2ccf (BUG-026 + 032) + Spark 85888ef | **HARD FORBID** structurally |
| ScrollRevealObserver | Refiner d6c2ccf (BUG-028) | **HARD FORBID** |
| PortfolioGallery | Pixel e2f0637 (BUG-034) + Refiner d6c2ccf (BUG-027) + Builder 55adef2 | **HARD FORBID** — 3 touches in last 6 |
| SectionDivider | Spark 451cca8 (gloss teardrops) + Pixel e2f0637 (BUG-035) | **HARD FORBID** — touched 2 of last 3 cycles |
| PaintFlow | Spark 451cca8 (splatter + ghost trail + draw-in border) | **HARD FORBID** — just refit |
| Footer | Pixel 6e88be7 (BUG-030) | **HARD FORBID** structurally — copy edits OK if needed |
| Hero environment | Spark 85888ef (drop-cloth, gobos, particles) | **HARD FORBID** structurally |
| Hero copy | Builder cycle 4 (Hero tagline edit) | Soft-cool — no edits this cycle unless trivial |
| LiveEstimate | Last touched e91fac5 (5+ entries back) | **PRIMARY Builder target** |
| WhySoley | Last touched 5e07e6a (mobile accordion) | **PRIMARY Builder target** |
| FounderBlock | Last touched 280f953 (Pixel cascade fix) | **PRIMARY Builder target** for body copy refinement |
| Navbar | Never touched substantively | **PRIMARY Spark target** |
| Page-wide typography rhythm | Never run as a sweep | **PRIMARY Spark target** |
| Contact | Last touched cycle 4 (commitment bullet edit) | OK — Builder may copy-edit if obvious win, not primary |

**Spark frequency check:** Spark ran cycle 4 last cycle (commit 451cca8). Within window — schedule normal Spark this cycle.

**Memory drift check:** Scanned MEMORY.md. No 7-day-old entries lacking visible action. Penn Tech catalog binding is being respected; ghost numbers explicitly forbidden every cycle; matchMedia bail-outs forbidden every cycle; honest pre-launch framing being held.

**Audit priority match:** AUDIT.md cycle 5 top priorities P1 (ServicesScrollLock) + P3 (Process) are HARD FORBIDDEN this cycle (just refit, QA confirmed working in cycle 4). P2 (PaintFlow mobile) is also confirmed fixed by QA cycle 4. P4 (panel swatch accent expansion) was implemented by Refiner d26d04b. P5 (Instagram bottom bar) is **deliberately ignored** per orchestrator standing brief — the honest "SOCIAL CHANNELS COMING SOON" framing stays per RULE 7 (no fabrication, including no fake handles). So all 5 Nigel priorities are either resolved, just-refit, or intentionally non-actionable. The cycle's polish targets (LiveEstimate / WhySoley / FounderBlock / Navbar / typography rhythm) are NOT on Nigel's top-5 — they're Coordinator-selected from the 0.7-scoring catalog items with available headroom and from never-touched gaps.

---

## Scheduled agents (in order)

### 1. Builder — Micro-content polish: LiveEstimate + WhySoley + FounderBlock

**Brief:** Builder runs a tightening pass on three sections that each scored 0.7 in Nigel cycle 5 with concrete deductions. NO new components. NO new sections. NO restructured layouts. This is a word-level + bullet-level + body-copy precision pass that turns 0.7 sections into 0.9-quality content. Goal: when a buyer reads each section they get one more concrete, hands-on, real-painter detail than they did last cycle.

**Targets (file paths, all under `/Users/modica/projects/soley-painting`):**

- **`app/components/LiveEstimate.tsx`** — Cycle 5 deduction: "the estimate card feels disconnected from the real contact form below — a real buyer scrolling will see 'estimate' twice (once auto-typing, once the real form) and may hesitate about which one to fill in. CTA hierarchy between these two is ambiguous." Tighten by:
  - Adjust the section eyebrow / headline to clearly frame the auto-typing card as a *demo* (e.g. "How a Soley estimate comes together" or similar honest framing) so buyers don't read it as a duplicate of the contact form.
  - Sharpen the auto-typed message so each line carries one concrete commitment that wouldn't appear on a generic painter's site.
  - Tighten commitment bullets — every bullet must answer a specific buyer concern (response time, walkthrough scope, pricing transparency, scheduling). No marketing filler.
  - Confirm the CTA hierarchy reads "this is a demo → scroll to real form below." NO fabricated quote prices. NO fabricated addresses (the demo "123 Maple Street" placeholder stays generic).

- **`app/components/WhySoley.tsx`** — Cycle 5 deduction: cards selector returned 0 elements via Playwright (likely class-name mismatch); tilt interaction unconfirmed. Tighten the **content** by:
  - Audit each of the 4 card titles + body copy. Each card must answer a specific buyer concern in concrete language. If any card reads generic ("quality work", "experienced team", "professional service"), rewrite it with a concrete, hands-on detail a real working painter would say.
  - Confirm card body copy is under ~24 words each. If a card has filler, cut.
  - Add one specific commitment-style detail per card if missing — e.g. specific paint brands used, specific cleanup standards, specific response windows. NO fabricated specifics. NO fake numbers, fake reviews, fake project counts.
  - DO NOT touch the tilt JS / mousemove handler / accordion logic / CSS — content edits only this cycle. If a card class-name issue surfaces during edits, log to BUGS.md, do not fix.

- **`app/components/FounderBlock.tsx`** — Body copy refinement. Cycle 5 noted: "Run by a small crew that actually shows up' is the right honest human signal." Push it further by:
  - Body copy that follows the headline must extend the "small crew that actually shows up" framing with one concrete operational detail (how the crew shows up, what they bring, what they leave the space looking like). Honest, hands-on, painter-voice — NOT marketing ("we strive to deliver excellence").
  - Cut adverbs that don't carry weight ("really", "truly", "honestly", "professionally").
  - NO fabricated specifics: no founder name, no "Est. YYYY", no neighborhood claims, no fabricated project counts. Generic role language is fine; specific fake people are not.
  - Photo placeholder framing stays honest ("Photography forthcoming" or equivalent). DO NOT swap to a fabricated headshot URL.

**What "polish toward 0.9" means in practice:**

- Replace marketing filler with concrete commitments. The painter equivalent of "we answer the phone."
- If a sentence could appear on any painter's site, rewrite it so it could only appear on Soley's.
- Headlines stay short. Sub-copy stays under 24 words per line.
- Brand voice: honest, hands-on, professional (per CLAUDE.md).
- Preserve content count — every existing card / bullet / commitment must remain present after this pass (`feedback_frame_b_richness.md`). If a bullet is genuinely redundant and a replacement would be sharper, REPLACE it (don't pile a new one on top — `feedback_simplicity_over_polish.md`).

**Verification (RULE 3):**

- After edits, run `npm run build` — must pass clean.
- Run a Playwright check on the live URL (or `npm run dev`) at desktop 1440x900 + iPhone SE 375x667 + iPhone 13 390x664. For each section edited, capture mid-section screenshots at 5 scroll positions through the section's runway (5%/25%/50%/75%/95%) per RULE 3.
- Save screenshots to `/tmp/soley-builder-cycle6-polish/`.

**Forbidden moves:**

- **Do NOT touch any structure / JS / CSS / layout / component hierarchy.** Text-content + body-copy + bullet-list edits only. If a copy edit reveals a layout bug, log to BUGS.md, do not fix.
- **HARD FORBID structural edits to:** ServicesScrollLock, Process, PortfolioGallery, ScrollRevealObserver, SectionDivider, PaintFlow, Footer, Hero environment. Copy edits inside any of these are NOT permitted this cycle either — cooldown register is strict because too many sections are still in their post-refit settling window.
- **Do NOT add ghost numbers, fake testimonials, fake names, fake dates, or fake project stats** anywhere (RULE 7, RULE 8).
- **Do NOT swap the honest "SOCIAL CHANNELS COMING SOON" footer line to a fake INSTAGRAM handle.**
- **Do NOT introduce R3F / @react-three/fiber / drei / three.**
- **Do NOT use `matchMedia` to hide any feature on any viewport** (RULE 4).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered text.
- **Do NOT call the iMessage reply tool** (RULE 1 — Builder is a sub-agent).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** in any copy or commit message (RULE 2).
- **Do NOT remove or downgrade any glow / animation / effect** from prior cycles (`feedback_nigel_no_removal.md`).
- **Do NOT strip content count** from any section (`feedback_frame_b_richness.md`). 4 cards stay 4 cards. 4 bullets stay 4 bullets.
- **Do NOT call the user a bottleneck** in any commit message or report (`feedback_respectful_tone.md`).
- **Do NOT skip the "which one?" question on trivial copy edits** — ship the obvious target (`feedback_just_do_simple_swaps.md`).

**MEMORY.md entries Builder MUST respect:**

- RULE 7 / `feedback_no_invented_fight_data.md` — no fabricated specifics anywhere.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — execute "polish toward 0.9" at full intensity; no "subtle" reframings.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — never remove a prior animation / glow / effect.
- `feedback_simplicity_over_polish.md` — replace, don't pile.
- `feedback_respectful_tone.md` — collaborative framing only.
- `feedback_just_do_simple_swaps.md` — for trivial copy edits, ship without asking "which one?"
- `feedback_no_dev_content.md` — no developer-feature lists, no template-marketplace voice.
- `project_penn_tech_baseline.md` — Penn Tech catalog is the floor; LiveEstimate is catalog #6, WhySoley is catalog #10 — copy edits should make each read as the brand-specific painter equivalent of its Penn Tech analog.

---

### 2. Spark — Navbar polish + page-wide typography rhythm pass

**Brief:** Spark runs a brand-distinctive **Navbar polish** (never touched substantively in 6 cycles) AND a **page-wide typography rhythm pass** (never run as a sweep). Frame B territory — refine spacing/typography while preserving content count (`feedback_frame_b_richness.md`). The goal is to close a never-touched gap (Navbar) and to elevate the global type rhythm so every section's headline / eyebrow / body / micro-copy reads as part of the same brand system, not as 12 independent components.

**Targets (file paths, all under `/Users/modica/projects/soley-painting`):**

- **`app/components/Navbar.tsx` + relevant CSS in `app/globals.css`** — Navbar polish:
  - Add a brand-distinctive accent: e.g. a 1-2px painted-stroke underline that draws in on hover for nav links (using the brand swatch cycle terracotta → teal → gold), OR a tiny paint-drop dot beside the active link, OR a subtle painted-stroke divider between the logo and nav links. Pick ONE — do not pile multiple accents. The accent must be hand-tuned (painter brand-specific), not a generic Bootstrap-style hover underline.
  - Confirm CTA button on the right has a brand-distinctive treatment (paint-stroke hover state would qualify) — but if it already reads strong, leave it.
  - Mobile parity: navbar tap-target min-height 44px is preserved (per Pixel cycle 1 / RULE per Pixel pattern). Mobile menu (if any) gets the same accent treatment scaled. NO `matchMedia` bail-outs.
  - Center-alignment audit at 375 + 414 mobile during verification (`feedback_pixel_alignment.md`).

- **Page-wide typography rhythm pass** — touch `app/globals.css` and per-component CSS to:
  - Audit heading hierarchy: `h1` / `h2` / `h3` sizes, weights, letter-spacing. Confirm scale is consistent across sections (Hero h1 vs WhySoley h2 vs Process h2 vs LiveEstimate h2 — all in the same scale ratio).
  - Audit eyebrow text: tracking, font-size, color across sections (every eyebrow should use the same uppercase-tracked treatment with consistent size).
  - Audit body copy: line-height, max-width, color contrast on chalk-on-umber and chalk-on-slate panels.
  - Audit vertical section padding: every section should have consistent `padding-top` / `padding-bottom` so the page rhythm reads as a single document, not 12 disconnected sections. (If one section is 80px and another is 160px without a reason, normalize.)
  - Mobile typography: confirm 14px+ minimum on all body text, eyebrow tracking scales sensibly down (no 11px tracked-out eyebrow).
  - **Preserve content count** — this is a refinement pass on the existing scale; do NOT remove headings, eyebrows, or body paragraphs.

- **Verification (RULE 3):**
  - Playwright loads at 5 scroll positions through the full page (5%/25%/50%/75%/95%) on desktop 1440x900 + iPhone SE 375x667 + iPhone 13 390x664. Capture screenshots at each position.
  - Confirm heading hierarchy looks consistent visually across sections (Spark eyeballs the screenshots; consistency is the test).
  - Save screenshots to `/tmp/soley-spark-cycle6-typography/`.

**Verification of recent fixes (no edits — verify only):**

- ServicesScrollLock translateX advancing across runway (Refiner d26d04b confirmed by QA cycle 4): if regression observed, **report in Spark return — do NOT silently fix** (HARD FORBIDDEN structurally).
- Process auto-advance + countdown bar (Refiner d6c2ccf, QA cycle 4 confirmed): same rule — report regressions, do not re-touch.
- PortfolioGallery EXTERIOR chip readable (Refiner d6c2ccf, Pixel e2f0637 chip font fix, QA cycle 4 confirmed): same rule.
- SectionDivider gloss teardrops + parallax hairlines (Spark 451cca8, QA cycle 4 confirmed): same rule.
- PaintFlow visible across viewports + animated (Spark 451cca8, QA cycle 4 confirmed): same rule.

**Forbidden moves:**

- **HARD FORBID structural edits to:** ServicesScrollLock, Process, PortfolioGallery, ScrollRevealObserver, SectionDivider, PaintFlow, Footer, Hero environment, Hero copy. Spark touches Navbar + typography rhythm only.
- **Do NOT introduce R3F / @react-three/fiber / drei / three.**
- **Do NOT add bloom postprocessing.**
- **Do NOT use `Math.sin` oscillation, `MathUtils.lerp`, or any speed-easing on motion path velocity** (RULE 12 — constant velocity). Easing is fine on opacity, scale, color — not on positional travel.
- **Do NOT use `matchMedia` to disable Navbar or any typography behavior on mobile** (RULE 4). Scale down complexity if needed; never bail.
- **Do NOT add ghost numbers** anywhere (RULE 8).
- **Do NOT pile glow-on-glow or rule-on-rule** — replace any redundant treatment that already exists rather than stacking new ones (`feedback_simplicity_over_polish.md`).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered elements.
- **Do NOT strip content count** from any section (`feedback_frame_b_richness.md`).
- **Do NOT downgrade any prior glow / animation / effect** from prior cycles (`feedback_nigel_no_removal.md`).
- **Do NOT call the iMessage reply tool** (RULE 1 — Spark is a sub-agent).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** anywhere in code, commits, or comments (RULE 2). The brief is "polish toward 0.9" + "Navbar gets a brand-distinctive accent" — execute at full intensity.
- **Do NOT fabricate** any copy in nav labels (RULE 7).
- **Do NOT add a fake INSTAGRAM handle** to any nav element.
- **Do NOT pick more than ONE Navbar accent treatment** — picking three competing accents counts as piling (`feedback_simplicity_over_polish.md`).

**MEMORY.md entries Spark MUST respect:**

- `project_penn_tech_baseline.md` — Penn Tech catalog #2 (brand palette threaded through everything) governs the Navbar accent — it must use the established 5-swatch cycle. #12 (constant velocity) governs any motion in the accent.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — no "subtle / considered" reframings.
- RULE 3 / `feedback_actually_scroll_test.md` — verify at 5 scroll positions on 3 viewports.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — no `matchMedia` bail-outs.
- RULE 7 — no fabricated nav labels (no fake INSTAGRAM, no fake address-line, no fake "Est. YYYY").
- RULE 8 / `feedback_no_ghost_numbers.md` — no large faded background numerals as a typography rhythm device.
- `feedback_simplicity_over_polish.md` — replace, don't pile. ONE Navbar accent.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — never remove a prior glow / animation / effect.
- `feedback_interesting_scroll.md` — typography rhythm should reinforce "fun to scroll, not template."
- `feedback_unique_design.md` — hand-tuned painter-brand accents, not generic Bootstrap / Tailwind defaults.
- `feedback_pixel_alignment.md` — center-alignment audit at 375 + 414 mobile.

---

## Forbidden cycle-wide

- **Sub-agents texting the user** (RULE 1).
- **Touching ServicesScrollLock / Process / PortfolioGallery / ScrollRevealObserver / SectionDivider / PaintFlow / Footer / Hero environment / Hero copy** structurally (all HARD FORBIDDEN this cycle — too recently refit, or held by orchestrator brief).
- **Hero R3F re-introduction** (Razor removed it deliberately; SVG signature is the approved centerpiece).
- **Footer "SOCIAL CHANNELS COMING SOON" → fake INSTAGRAM swap.** Honest pre-launch only (RULE 7).
- **Catalog #11 Instagram bottom bar** — orchestrator-approved as intentional pre-launch framing. Ignore Nigel's INSTAGRAM suggestion every cycle until real social channels exist.
- **Fake project / customer / founder / neighborhood / city names**, fake "Est. YYYY", fake reviews, fake stats (RULE 7).
- **`matchMedia` bail-outs** to disable any feature on any viewport (RULE 4).
- **Framer Motion `whileInView`** on SSR-rendered elements.
- **Ghost numbers** behind any section (RULE 8).
- **Bloom postprocessing.**
- **`Math.sin` / `lerp` smoothing** on positional motion (RULE 12 / catalog #12).
- **"Subtle / considered / editorial restraint / tasteful / delicate / refined"** language anywhere (RULE 2).
- **Stripping content count** from any section (`feedback_frame_b_richness.md`).
- **Removing or downgrading** any prior glow / animation / effect (`feedback_nigel_no_removal.md`).
- **Calling the user a bottleneck** in commits or reports (`feedback_respectful_tone.md`).
- **Score-chasing.** Score is at the cap. Until real photography + real reviews + real address land, score CAN'T move. Polish for quality, not for the number.

---

## Section cooldown register (for next-cycle Coordinator)

| Section | Touches in last 6 entries (after this cycle) | Cycle pressure |
|---|---|---|
| ServicesScrollLock | 2 (Refiner d6c2ccf + d26d04b) | **HARD COOLDOWN** — do not touch next cycle |
| Process | 2 (Spark 85888ef + Refiner d6c2ccf) | **HARD COOLDOWN** |
| PortfolioGallery | 3 (Builder 55adef2 + Pixel e2f0637 + Refiner d6c2ccf) | **HARD COOLDOWN** |
| ScrollRevealObserver | 1 (Refiner d6c2ccf) | Soft-cool |
| SectionDivider | 2 (Spark 451cca8 + Pixel e2f0637) | **HARD COOLDOWN** |
| PaintFlow | 1 (Spark 451cca8) | Soft-cool |
| Hero environment | 1 (Spark 85888ef) | Soft-cool |
| Footer | 1 (Pixel 6e88be7) | Soft-cool |
| LiveEstimate | 0 → 1 after this cycle (Builder polish) | Active this cycle |
| WhySoley | 0 → 1 after this cycle (Builder polish) | Active this cycle |
| FounderBlock | 0 → 1 after this cycle (Builder polish) | Active this cycle |
| Navbar | 0 → 1 after this cycle (Spark) | Active this cycle |
| Page-wide typography | 0 → 1 after this cycle (Spark) | Active this cycle |
| Contact | 0 in last 6 | OK for next cycle |

---

## Rationale (one line)

Score 7.5 / 7.5 cap (frozen until real photo + reviews + address) and all BLOCKERs/HIGHs closed by Refiner d26d04b — polish-mode at the cap with strict cooldown register: schedule **Builder** for micro-content polish on LiveEstimate + WhySoley + FounderBlock (the 0.7 catalog items with concrete deductions and no recent refit) and **Spark** for a brand-distinctive Navbar accent + page-wide typography rhythm pass (closing two never-touched gaps), while ServicesScrollLock / Process / PortfolioGallery / ScrollRevealObserver / SectionDivider / PaintFlow / Footer / Hero all sit hard-forbidden structurally after recent refits.
