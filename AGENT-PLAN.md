# AGENT-PLAN.md — Soley Painting

**Cycle:** :03 dispatch (post BLOCKER-cluster fix)
**Date:** 2026-05-07
**Coordinator focus axis:** new-value addition + visible-but-static animation polish
**Live:** https://soley-painting.vercel.app
**Current Nigel score:** 7.0 / 10 (cap 7.5 pre-launch)

---

## Dispatch decision

The site is in genuinely better shape than the cycle-10 AUDIT.md reflects. Three BLOCKERs landed in the last 48 hours:

- **BUG-054** scroll-reveal IO race (`0d6b979`) — 41/41 stuck elements now reveal correctly on mobile
- **BUG-055** hero glow inlined to bypass build pipeline strip (`0d6b979`)
- **BUG-056** ServicesScrollLock panels at correct width 375/390px (`0d6b979`)

Hero icon centerpiece is now actually drawing visibly at 1.9s/path with recognizable silhouettes (smiley/house/roller/star/heart) — Spark's last two cycles (`9247893` then `a3dc11a`) refined the strokes and timing.

This is the moment to step **off** the heavily-touched sections and add new value. Hero3D, ScrollRevealObserver, ServicesScrollLock, Contact, LiveEstimate, FounderBlock, WhySoley, FAQ all received structural work in the last 6 cycles. ServicesMarquee, PortfolioGallery tile imagery, and Process timeline visual richness have NOT been touched in 5+ cycles.

Bigger move available: with scroll-reveal now firing reliably, an entire layer of intended motion is suddenly visible. Spark's job this cycle is to audit what was supposed to animate that's now visible-but-static — sections that previously stayed at opacity 0 and never showed their motion.

For Builder, the highest-leverage new ship is a **pre-launch email-capture micro-section** ("Notify me when Soley launches") — honest pre-launch framing, real form (no fabrication), placed between FAQ and Process or as a trailer to Footer. That's a real customer-facing feature gain on top of the cosmetic-fix cycles.

**Rationale:** Builder ships net-new value (pre-launch email capture) on under-touched eligible ground; Spark does post-fix animation-polish audit on sections that just became visible. Distribute attention away from over-touched sections, add real customer value, polish the now-visible motion layer.

---

## Scheduled agents (this cycle, in order)

### 1. Builder — NEW pre-launch email capture micro-section + ServicesMarquee palette refresh

**Brief:** Two scopes.

(a) **NEW pre-launch email-capture section** ("Notify me when Soley launches") — honest pre-launch framing, single-input email field + submit button, success state. Form posts to a placeholder endpoint (`/api/notify` route stub returning `{ ok: true }` is acceptable — do NOT fabricate a Formspree URL the user hasn't given). Section copy must read as honest pre-launch ("We'll text or email when we open booking. No spam, no list-sharing"), NOT as a generic newsletter signup. Place between FAQ and Process, OR as a banded strip above Footer (your call — pick whichever rhythms better).

(b) **ServicesMarquee palette refresh** — the marquee was last styled before the all-warm Drop Cloth & Rust migration. Audit token usage in `ServicesMarquee.tsx`, replace any residual neutral grays / off-palette colors with `--color-rust` / `--color-ochre` / `--color-stone` per-item rotation. Do NOT add per-item glow piling. Replace, don't pile.

**MEMORY.md entries to respect:**
- RULE 1 (sub-agent NEVER texts user) — return your report as tool result only
- RULE 7 (no fabrication — do NOT invent a Formspree URL, real testimonials, address, phone)
- RULE 10 (respectful tone — copy reads "we'll let you know when we're ready", not "we apologize")
- `feedback_no_dev_content` — copy is for prospective painting customers, not developers
- `feedback_simplicity_over_polish` — when adding the email section, replace; do not pile glow-on-glow

**Forbidden sections this cycle (do NOT structurally change):**
Hero3D, ScrollRevealObserver, ServicesScrollLock, Contact, LiveEstimate, FounderBlock, WhySoley, FAQ structural, PaintFlow, Process timer JS, PortfolioGallery, Footer structural, Navbar, SectionDivider

**Forbidden patterns:**
R3F re-intro, fabricated Formspree URL, fake address/phone/hours/credentials, matchMedia bail-outs, ghost background numerals, sin/lerp on positional motion, "subtle"/"considered"/"editorial restraint" language anywhere in commits or comments, score-chasing, score targets in code, dev-feature-list copy.

---

### 2. Spark — Frame B: post-fix animation polish on now-visible sections

**Brief:** Frame B pass. Now that scroll-reveal IO actually fires (`0d6b979`), an entire layer of motion is suddenly visible that may have been built but never seen — sections that sat at opacity 0 for many cycles. Audit these specifically:

- **PortfolioGallery** — 9 placeholder tiles with painted-swatch SVG textures. Anything intended to animate on tile reveal that isn't? Stagger? Hover-reveal? Edge accent draw-in?
- **Process timeline** — auto-advance + character-stagger + countdown bar are all confirmed working. But under the now-visible reveal, does the tab-switch transition still read as crisp, or does it feel weak under the new palette?
- **PaintFlow workflow** — splatter burst + ghost trail + draw-in border were all added in `451cca8` but were under scroll-reveal lock until `0d6b979`. Does each fire correctly on entry now? Is the timing tuned for the new IO threshold?
- **WhySoley tilt cards** — tilt was implemented but invisible during the IO catastrophe. Verify the mousemove tilt + accent rotation reads correctly under all-warm palette.

Pick ONE section that has the most polish-debt under the new-visibility regime, ship the polish. Replace, don't pile. No glow-on-glow. No new bloom.

**MEMORY.md entries to respect:**
- RULE 1 (sub-agent NEVER texts user)
- RULE 4 (disabling isn't fixing — no matchMedia guards on customer-asked features)
- RULE 5 + RULE 6 (regenerate `style.min.css` if you touch CSS in that pipeline; bump cache-buster — this project is Next.js so style.min.css doesn't apply, but if you touch any CSS file with that pattern, follow the rule)
- `feedback_simplicity_over_polish` — when adding, REPLACE the prior treatment, do not pile on
- `feedback_no_self_throttle` — full intensity on the brief; "impressive" not "tasteful"
- `feedback_unique_design` — break Claude default patterns; this is a craft-painter brand, not a generic Tailwind site
- `feedback_actually_scroll_test` — sample 5+ scroll positions, not one snapshot, on Desktop 1440 + iPhone 13 + iPhone SE
- `feedback_nigel_no_removal` — never remove glows/animations/effects; only add or improve
- `feedback_frame_b_richness` — never strip content count from rich sections

**Forbidden sections this cycle (do NOT structurally change):**
Hero3D structural, ScrollRevealObserver, ServicesScrollLock JS, Contact, LiveEstimate, FounderBlock, FAQ accordion, Footer, Navbar structural, SectionDivider structural

**Forbidden patterns:**
glow-on-glow piling, rule-on-rule, ghost numbers, bloom, sin/lerp on positional motion, R3F re-intro, fake INSTAGRAM swap, matchMedia bail-outs, "subtle"/"considered"/"editorial restraint" language, score targets, removing existing glows or animations.

---

## Out of scope this cycle (post-pipeline polish queue)

- Real photography (still pending user)
- Real reviews / testimonials (still pending user)
- Real service area / address (still pending user)
- Real Formspree endpoint (still pending user — Builder uses route stub for the email-capture micro-section)
- Pre-launch cap remains 7.5 until those four land

---

## Convergence + drift checks (executed this cycle)

- **Convergence guard:** PASS — last 4 changelog entries have real commits (`a3dc11a`, `9247893`, `0d6b979`, `1d2f804` QA), no STOP markers.
- **Score gate:** PASS — 7.0 < 8.5, full crew eligible (no QA-only polish-mode constraint).
- **Section cooldown:** Hero3D appeared in 3+ of last 6 entries (`a3dc11a`, `9247893`, `6ad296f`, `6575891`) — FORBIDDEN structurally for both agents. ScrollRevealObserver just received the `0d6b979` fix — also forbidden structurally. ServicesScrollLock in 3+ recent entries — forbidden structurally.
- **Spark frequency:** PASS — Spark scheduled this cycle, alternation rule selects Frame B (last cycle was Frame A `a3dc11a`).
- **Memory drift:** RULE 1 (no sub-agent texts) reinforced in both briefs. RULE 2 (no self-throttle) reinforced in both briefs. `feedback_no_dev_content` reinforced in Builder copy guidance.
- **Audit priority match:** Nigel cycle 10 P1 + P2 + P4 closed by `0d6b979`. P3 (warm 3-layer glow) addressed by `0d6b979` BUG-055 inline textShadow. P5 (ServicesScrollLock desktop padding-left) deferred — section in cooldown this cycle, can revisit next cycle when cooldown clears.
