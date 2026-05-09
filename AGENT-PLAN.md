# AGENT-PLAN.md — Soley Painting

**Cycle:** :03 dispatch (post Refiner BUG-058 close)
**Date:** 2026-05-07
**Coordinator focus axis:** new-axis measurement (Lighthouse perf — never run) + cross-cutting motion-cohesion sweep
**Live:** https://soley-painting.vercel.app
**Current Nigel score:** 6.8 / 10 (cap 7.5 pre-launch)

---

## Dispatch decision

The site is in genuinely better shape than the cycle-11 6.8 reflects. Nigel cycle-11 P1 (ServicesScrollLock mobile track frozen) was REFUTED by QA (track 1950/1875px correct, tx 0→-1560px correct — Nigel queried the wrong DOM element). P3 (PaintFlow dots not traveling) and P4 (Process countdown bar missing) were also REFUTED — both are firing per Playwright RAF probes. The only real BLOCKER from cycle 11 was BUG-058 (WhySoley scroll-reveal in display:none parent), which Refiner closed in `22739c0`. The 6.8 score is partly artifact of false-positive Playwright queries, not a 0.2-point real regression.

So the queue is genuinely thin on real near-term BLOCKERs. The eligible new-value moves are cross-cutting axes that have not been measured or swept yet:

1. **Lighthouse / page-load perf audit** — never done in this project. No FCP/LCP/CLS/TBT measurement on record. We do not know whether the all-warm palette + multiple SVG drips + RAF animations + scroll-reveal IO + framer-motion bundle have stacked up to a perf cliff or sit comfortably under budget. Builder owns this — produce real numbers, identify any single low-hanging optimization (font preloading, image lazy-load defaults, render-blocking CSS), do NOT over-optimize prematurely.

2. **Page-wide motion-cohesion easing sweep** — many cycles have shipped animations. Each shipped its own easing. Some sections likely use `cubic-bezier(0.16, 1, 0.3, 1)` (Penn-Tech-tier expo-out, the project's established curve), others use generic `ease-out`, `ease-in-out`, or even `linear`. Spark Frame B audits every transition/animation declaration in the codebase, identifies inconsistent easings, and replaces them with the canonical curve. This is a REPLACE pass, not a piling-on pass. Zero new motion added — only existing motion harmonized. This satisfies `feedback_simplicity_over_polish` (replace, don't pile) and `feedback_unique_design` (a single signature easing curve is a brand voice).

Pixel scheduled for :48 slot will pick up post-edit a11y verification + standard mobile center-alignment sweep on whatever Builder/Spark touch.

**Rationale:** Builder produces never-before-collected perf data on a cross-cutting axis (no section structurally changed); Spark normalizes a cross-cutting motion-cohesion debt across the entire app (no new animations, only easing replacements). Both work agents step OFF every recently-touched section. No score-chasing. No false-positive Nigel chase.

---

## Scheduled agents (this cycle, in order)

### 1. Builder — Lighthouse / page-load perf audit (data-only, plus at most ONE low-hanging fix)

**Brief:** Run `next build` then a Lighthouse mobile + desktop audit (use `lighthouse` CLI or `@lhci/cli`; or, if neither installs cleanly, run a Playwright-based perf probe capturing FCP/LCP/CLS via PerformanceObserver). Record the numbers in BUGS.md or a dedicated `PERF.md` (do NOT write a generic `report.md` — RULE in your brief: no fabricated summary `.md` files; if you create `PERF.md`, it is a real ongoing artifact, not a one-shot report).

Mobile target = iPhone 13 emulation, Desktop target = 1440×900. Capture: FCP, LCP, CLS, TBT, total transfer size, JS bundle size, render-blocking resources count.

After capture, identify ONE low-hanging optimization only (e.g. add `next/font` preload hint that's missing, swap a render-blocking CSS @import to a non-blocking pattern, lazy-load a below-fold heavy component). Ship that one fix. Do NOT bundle 3-5 speculative optimizations. Single targeted commit.

If the numbers are already in budget (LCP < 2.5s mobile, CLS < 0.1, TBT < 200ms), record that fact and ship NO code change — the data itself is the deliverable. Coordinator considers a "no code change because budget already met" outcome a successful Builder cycle.

**Forbidden:**
- Disabling animations / scroll-reveal / RAF handlers to "improve perf" — RULE 4 (disabling isn't fixing)
- Adding `loading="lazy"` to above-the-fold elements
- Removing any existing motion or glow per `feedback_nigel_no_removal`
- matchMedia bail-outs anywhere
- Writing a fabricated/aspirational performance summary `.md` — only real measured numbers
- New 3rd-party scripts / analytics / tag managers
- "Considered" / "editorial" / "subtle" / "tasteful" / "refined" language anywhere — RULE 2

**MEMORY.md entries to respect:**
- RULE 1 (sub-agent never texts user — return report as tool result only)
- RULE 4 (disabling isn't fixing — never bail features for perf)
- RULE 7 (no fabricated numbers — only real captured Lighthouse / PerformanceObserver data)
- `feedback_actually_scroll_test` — measure on multiple viewports (desktop 1440 + iPhone 13 + iPhone SE), not one snapshot
- `feedback_no_self_throttle` — execute the perf brief at full intensity; do NOT downgrade the brief to "we'll skip Lighthouse and just guess"
- `feedback_nigel_no_removal` — never remove glows/animations to chase a perf number

**Forbidden sections (do NOT structurally change):**
Hero3D, ScrollRevealObserver, ServicesScrollLock, Contact, LiveEstimate, FounderBlock, WhySoley, FAQ, PaintFlow, Process, PortfolioGallery, Footer, Navbar, SectionDivider, ServicesMarquee, NotifySignup. Builder is in MEASURE-mode this cycle. The single allowable code change is ONE targeted perf fix at the framework / asset-loading layer (next.config / app/layout / fonts / metadata), not a section structural edit.

---

### 2. Spark — Frame B: page-wide motion-cohesion easing sweep (REPLACE-only)

**Brief:** Frame B pass. Audit every CSS `transition` / `animation-timing-function` / Framer Motion `ease` / inline transition declaration across `app/`, `components/`, and `globals.css`. Catalogue every easing curve currently in use. The canonical project curve is `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out, Penn-Tech-tier). Where the existing curve is generic (`ease`, `ease-out`, `ease-in-out`, `linear` on positional motion, custom one-off cubic-beziers), REPLACE with the canonical curve. Where `linear` is intentional (constant-velocity marquees, constant-velocity icon-stroke draws, brush-wipe gradient slides — these MUST stay linear because constant-velocity is a `feedback_unique_design` signature), DO NOT change.

Decision rule for each easing site:
- Positional motion (translate / opacity / scale on hover/click/in-view) → canonical `cubic-bezier(0.16, 1, 0.3, 1)` unless already.
- Constant-velocity ambient motion (marquee, icon-cycle, particle drift, brush sprite tracking) → keep `linear`. Do NOT touch.
- Color / background-position transitions on hover (CTA brush-wipe) → keep `linear` if currently linear (intentional brush-wipe feel).
- Accordion height / max-height transitions → canonical curve.
- prefers-reduced-motion fallbacks → leave snap behavior intact.

Ship a single commit titled `spark cycle 12 — Frame B: motion-cohesion easing sweep`. The diff should be REPLACE-only — zero new animations, zero removed animations, zero new glow / bloom / gradient-stroke. Just easing-curve normalization.

**Forbidden:**
- Adding any new animation, glow, blur, bloom, gradient, particle, drip
- Removing any existing animation, glow, drip, particle, accent
- Replacing `linear` with the canonical curve on constant-velocity ambient motion (will look wrong)
- matchMedia bail-outs
- R3F re-intro
- Touching ServicesScrollLock JS (just refuted, do not re-touch)
- Touching ScrollRevealObserver JS (Refiner just touched in `22739c0`)
- Adding ghost background numerals (RULE 8, `feedback_no_ghost_numbers`)
- Score-chasing language in commits / comments
- "Considered" / "editorial" / "subtle" / "tasteful" / "refined" / "delicate" anywhere — RULE 2 + `feedback_no_self_throttle`

**MEMORY.md entries to respect:**
- RULE 1 (sub-agent never texts user)
- RULE 2 (no self-throttle — execute the cohesion sweep at full coverage; do not skip 30% of the easings as "good enough")
- RULE 3 (verification = mid-runway scrolling — sample at least 5 positions per touched section on Desktop 1440 + iPhone 13 + iPhone SE before claiming the sweep is clean)
- `feedback_simplicity_over_polish` — REPLACE only; do not pile new motion on top of normalized motion
- `feedback_frame_b_richness` — never strip content count from rich sections (this brief is easing-only, content untouched anyway)
- `feedback_unique_design` — a single signature easing curve IS the brand voice; this sweep is what makes the site stop looking like default Tailwind
- `feedback_nigel_no_removal` — never remove glows/animations/effects
- `feedback_actually_scroll_test` — verify on 5 scroll positions across 3 viewports

**Forbidden sections (do NOT structurally change):**
Hero3D structural, ServicesScrollLock JS, ScrollRevealObserver, Contact structural, LiveEstimate structural, FounderBlock structural, WhySoley structural, FAQ accordion structural, Footer structural, Navbar structural, SectionDivider structural, PaintFlow JS, Process JS, PortfolioGallery structural, NotifySignup structural. Spark is in CSS-easing-sweep mode this cycle — diffs touch transition-timing-function and animation-timing-function declarations and Framer Motion `ease` props, nothing else.

---

## Out of scope this cycle (post-pipeline polish queue)

- Real photography (still pending user)
- Real reviews / testimonials (still pending user)
- Real service area / address (still pending user)
- Real Formspree endpoint (still pending user — NotifySignup uses /api/notify stub)
- Pre-launch cap remains 7.5 until those four land
- Formal axe-core a11y audit (queued for next :48 Pixel slot or following cycle Pixel)
- 404 / empty-state polish (low leverage, deferred)

---

## Convergence + drift checks (executed this cycle)

- **Convergence guard:** PASS — last 5 commits show real productive work (`22739c0` Refiner BUG-058 fix, `8b28f5f` QA, `84222af` Nigel, `1bf60e2` Spark, `de1afff` Builder NotifySignup). No STOP markers. Not stuck.
- **Score gate:** PASS — 6.8 < 8.5, full crew eligible. Builder + Spark not blocked.
- **Section cooldown:** Hero3D, ServicesScrollLock, ScrollRevealObserver, WhySoley, NotifySignup, PortfolioGallery all in 3+ of last 6 entries — FORBIDDEN structurally for both agents. Builder dispatched to a non-section axis (perf measurement). Spark dispatched to a cross-cutting CSS axis (easing curves), not a section.
- **Spark frequency:** PASS — Spark scheduled. Alternation: last Spark was Frame B (`1bf60e2` PortfolioGallery filter stagger), so this should be Frame A by alternation. However, Frame A is generative-add territory and the brief is REPLACE-only normalization — Frame B is the correct frame for replace-only sweeps. Frame B selected explicitly to enforce "replace, don't add" per `feedback_simplicity_over_polish`.
- **Memory drift:** RULE 1 reinforced in both briefs. RULE 2 reinforced (no self-throttle, no "subtle/considered" language). RULE 3 reinforced for Spark (5-position scroll-test). RULE 4 reinforced for Builder (no disabling for perf). RULE 7 reinforced for Builder (no fabricated numbers). `feedback_simplicity_over_polish` is the load-bearing rule for Spark this cycle. `feedback_unique_design` reinforced as the rationale for the easing-cohesion sweep.
- **Audit priority match:** Nigel cycle-11 P1 REFUTED (track widths correct), P2 closed (`22739c0` Refiner WhySoley scroll-reveal), P3 REFUTED (PaintFlow active per QA RAF probe), P4 REFUTED (Process countdown active per QA), P5 deferred (PortfolioGallery stagger — already shipped `1bf60e2`, post-click visibility ambiguity is a Playwright-detection issue, not a real bug). Top-3 priorities all touched OR refuted within last 5 cycles → Refiner-on-priorities not warranted this slot.
- **False-positive Nigel pattern:** acknowledged. Coordinator NOT scheduling Nigel re-audit this slot — Nigel ran cycle 11 with multiple refuted complaints. Next Nigel slot should re-audit only after Builder perf data and Spark easing sweep land, so Nigel has fresh non-rehashed material to score against.
