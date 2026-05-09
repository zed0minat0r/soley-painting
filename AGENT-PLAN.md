# AGENT-PLAN.md — Soley Painting (Cycle 9, BUG-025 CSS containment + content honesty micro-add)

**Date:** 2026-05-09 06:52 ET
**Live:** https://soley-painting.vercel.app
**Latest score:** 6.2 (conversion-friction axis, Nigel cycle 8 / commit df6e01d) — under the 7.5 pre-launch cap
**Latest commits:** d079eea (Scout Round 4 — BUG-025 root cause + clamp/dvh recipes) ← df6e01d (Nigel cycle 8 audit) ← 0316c52 (Refiner BUG-039/038/042) ← 594201e (Pixel BUG-040 fonts) ← f3cc3fb (Builder cycle 6 FAQ)
**Cap:** 7.5 pre-launch — score CAN'T rise until real photography + real reviews + real address all land (`feedback_nigel_stricter.md`).

---

## Decision rule fired

**Default rotation, NOT polish-mode (score 6.2 < 8.5 polish gate).** No convergence stall — last 4 entries each landed real changes (Refiner ARIA + entry dead zone, Pixel font fix, Nigel cycle 8 audit, Scout Round 4 concrete recipes). All BLOCKERs cleared except the visual residual of BUG-025 (Scout Round 4 has the exact CSS recipe — implement it).

**Reality check on Nigel cycle 8 (re-confirmed via prior QA cycles):** Several "absent" items in the AUDIT were Playwright SSR-snapshot artifacts:

- PaintFlow `animateMotion` — Spark cycle 4 commit 451cca8 added burst-on-arrival + ghost trail + draw-in border. QA cycle 5 CONFIRMED VISIBLE all viewports. Almost certainly a static-snapshot read on Nigel's part.
- Process countdown bar — Refiner d6c2ccf BUG-032 explicitly fixed the countdown bar key. QA cycle 5 CONFIRMED auto-advance + countdown both fixed.
- LiveEstimate typing — known to be client-rendered and intentionally absent from SSR snapshot (per Builder cycle 6 framing as "Example — how your request looks" demo card).
- Section dividers — Spark cycle 5 commit 451cca8 added gloss teardrops + dual-hairline parallax + traveling pulses. QA confirmed visible. Pixel e2f0637 set IO threshold 0.4→0.15 for partial-visibility reveal.

**Real, untouched issues with concrete recipes:**

- **BUG-025 mobile panel overflow** — Scout Round 4 has a CONCRETE three-part CSS fix (panel `max-width: 100vw; overflow: hidden`, title `font-size: clamp(2rem, 0.947rem + 4.5vw, 5rem)`, sticky inner track `height: 100dvh` not `100vh`). This is the exact remaining BLOCKER the audit calls out and the only one with an unimplemented recipe.
- **BUG-041 mobile DOM bloat** — WhySoley desktop perspective elements present on mobile. Logged but unaddressed.
- **Mobile font violations Nigel re-flagged** — portfolio tile badge at 9.6px, LiveEstimate label at 11px on iPhone 13. Pixel cycle 8 (commit 594201e) bumped 10 elements to 13px but apparently missed `.portfolio-tile-badge` and the LiveEstimate label specifically. Verify; bump if real.

**Schedule: Spark → Builder in that order.**

- **Spark** implements Scout Round 4's BUG-025 three-part CSS fix (clamp + max-width + 100dvh + overflow). This is a CSS containment fix on `app/globals.css` only — NOT a structural ServicesScrollLock change. Refiner's recent work touched the JS runway math; this fix touches CSS containment of panels and titles. Different concern, no conflict. Spark also verifies the two remaining font violations Nigel called out (portfolio badge 9.6px, LiveEstimate label 11px) and bumps both to 13px floor if confirmed.
- **Builder** ships a small content-honesty addition: a "What we don't do" / scope-clarity micro-section (or paragraph block within Contact, depending on Builder's read of where it fits cleanest). This is genuine new buyer information — painters routinely face "do you also do roof?" / "do you do drywall repair?" — and a 3-4 line scope-clarity block prevents wasted estimate-request time. HONEST framing only — list what they DO NOT do without inventing partner referrals. NO new section structure if Builder reads it as fitting under Contact or FAQ — additive copy preferred.

---

## Section cooldown register (touches in last 6 changelog entries)

| Section | Recent touches | Status this cycle |
|---|---|---|
| Hero3D | Refiner 0316c52 (BUG-042 mobile canvas min-height) | **HARD FORBID** structurally — Refiner just touched |
| ServicesScrollLock | Refiner 0316c52 (BUG-039 entry dead zone) + d6c2ccf | **STRUCTURAL FORBID** for Spark — but **CSS-only BUG-025 containment fix** is OPEN target (different surface, Scout Round 4 recipe) |
| Process | Refiner 0316c52 (BUG-038 ARIA tablist) | **HARD FORBID** structurally |
| PortfolioGallery | Pixel e2f0637/65f37b4 + Builder copy | **STRUCTURAL FORBID** — but `.portfolio-tile-badge` font-size fix is OPEN if 9.6px confirmed |
| ScrollRevealObserver | Refiner d6c2ccf | **HARD FORBID** |
| SectionDivider | Spark 451cca8 + Pixel e2f0637 | **HARD FORBID** structurally |
| PaintFlow | Spark 451cca8 + Refiner e81b122 | **HARD FORBID** — just-refit |
| Footer | Pixel 6e88be7 | **HARD FORBID** structurally |
| Navbar | Spark cycle 6 + cycle 7 c6f7093 | **HARD FORBID** structurally |
| LiveEstimate | Builder cycle 6 copy + Pixel cycle 8 font sweep | **STRUCTURAL FORBID** — but eyebrow/label font-size confirm/bump is OPEN if 11px confirmed |
| WhySoley | Builder cycle 6 copy | Soft-cool |
| FounderBlock | Builder cycle 6 copy | Soft-cool |
| FAQ | Builder cycle 7 (just shipped f3cc3fb) | **HARD FORBID** — just-shipped |
| Contact | Last copy touch cycle 4 | **OPEN for Builder content-honesty addition** |
| **CTA hover** | Spark cycle 7 c6f7093 | Soft-cool |

**Convergence guard:** Last 4 changelog entries — Pixel (commit 594201e), Refiner (0316c52), Nigel (df6e01d), Scout (d079eea). All landed real commits. NOT a stuck loop. Continue.

**Score gate:** 6.2 < 8.5 polish gate → Builder + Spark stay in rotation. NOT polish-only mode.

**Spark frequency:** Spark last ran cycle 7 (c6f7093). Within window. Schedule Spark normally.

**Memory drift check:** Scanned MEMORY.md. RULE 4 (`feedback_disabling_isnt_fixing.md`) and RULE 2 (`feedback_no_self_throttle.md`) explicitly relevant — Spark's BUG-025 fix MUST keep the horizontal scroll-lock feature working, not bail it via matchMedia or compress to single-panel-mobile fallback. The Scout Round 4 fix is a CSS containment fix, not a feature disable.

**Audit priority match:** Nigel cycle 8 priorities — P1 BUG-025 panel overflow → Spark this cycle. P2 Process countdown → already fixed (Playwright artifact). P3 PaintFlow animateMotion → already fixed (Playwright artifact). P4 Section dividers absent → already fixed (Playwright artifact). P5 mobile font violations → Spark verifies + fixes the two specific elements (`.portfolio-tile-badge` + LiveEstimate label) Pixel may have missed.

---

## Scheduled agents (in order)

### 1. Spark — BUG-025 three-part CSS fix (Scout Round 4 recipe) + targeted font violation cleanup

**Brief:** Spark implements the exact CSS recipe Scout researched in Round 4 (lines 1382–1535 of `SCOUT-REPORT.md`) for BUG-025 panel overflow on mobile. This is a CSS containment fix on `app/globals.css` only — Spark does NOT touch `ServicesScrollLock.tsx` JS or restructure the section. Spark also verifies and bumps the two remaining font violations Nigel cycle 8 called out (`.portfolio-tile-badge` at 9.6px and LiveEstimate label at 11px on iPhone 13).

**File targets (all under `/Users/modica/projects/soley-painting`):**

- **`app/globals.css`** — Primary work surface. Three additions per Scout Round 4 PROMPT BLOCK R4-1:

  1. **Panel containment** — On the panel selector that the scroll-lock track holds (likely `.services-panel` or equivalent in the existing CSS):
     ```css
     flex: 0 0 100vw;
     max-width: 100vw;       /* the missing containment */
     overflow: hidden;       /* clip any title/content overflow at the edge */
     ```
     Confirm this rule does NOT conflict with existing `min-width: 100vw` already declared.

  2. **Panel title fluid clamp** — On the panel title selector (likely `.services-panel h2` or `.panel-title`):
     ```css
     font-size: clamp(2rem, 0.947rem + 4.5vw, 5rem);
     line-height: 1.05;
     letter-spacing: 0.02em;
     ```
     This replaces any fixed `vw` font-size that causes "CABINET & TRIM" to clip at 375px. The clamp formula anchors min 32px at 375px and scales smoothly to 80px at 1440px.

  3. **Sticky inner track height swap** — Replace EVERY `height: 100vh` inside the ServicesScrollLock CSS scope with `height: 100dvh`. This addresses the iOS Safari URL-bar layout-viewport mismatch.

- **Font violation verification + fix** — In the same CSS file:
  - Audit `.portfolio-tile-badge` (or the actual selector for the "Photography forthcoming" badge overlay). If computed font-size on iPhone 13 (390px) is < 13px, bump to `font-size: 0.8125rem` (13px).
  - Audit the LiveEstimate eyebrow / form-label selector. If computed font-size on iPhone 13 is < 13px, bump to `0.8125rem` (13px).
  - Pixel cycle 8 (594201e) already bumped 10 eyebrow/label elements. Spark verifies these two were NOT included; if they were, no-op the font work and note in commit.

**What "BUG-025 fixed at full quality" looks like:**

- "CABINET & TRIM" panel renders fully within the 375px viewport — no right-edge clip, no next-panel bleed.
- All five panels render single-at-a-time at every position from 5% to 95% on iPhone SE (375), iPhone 13 (390), iPhone Pro Max (414), and desktop 1440.
- iOS Safari panel height matches visual viewport (no extra scroll past panel bottom).
- Horizontal scroll-lock JS handler still firing identically (Refiner's runway math is untouched).
- Font violations Nigel called out (badge 9.6px, label 11px) computed at >= 13px on iPhone 13.

**Verification (RULE 3 — non-negotiable):**

- Open `https://soley-painting.vercel.app` (or `npm run dev`) in Playwright.
- For ServicesScrollLock: scroll to 5%, 25%, 50%, 75%, 95% of the runway on **desktop 1440x900**, **iPhone SE 375x667**, **iPhone 13 390x664**, AND **iPhone Pro Max 414x896**.
- At each position, capture a screenshot AND read computed `getBoundingClientRect()` of the active panel + the panel title's `font-size` + the sticky track's computed `height`.
- Confirm panel bounds stay inside `[0, viewportWidth]` at every position.
- Confirm panel title font-size scales correctly: ~32px at 375px, ~80px at 1440px.
- Confirm sticky track computed height equals visual-viewport height on iPhone (read `window.visualViewport.height` and compare).
- For font violation fixes: capture computed `font-size` on `.portfolio-tile-badge` AND LiveEstimate label at iPhone 13 (390x664). Confirm both >= 13px.
- Save screenshots to `/tmp/soley-spark-cycle9-bug025/`.

**Post-edit hygiene (RULES 5/6):**

- This project is Next.js + Tailwind, not the static-CSS pattern from RULE 5/6. Skip clean-css-cli + cache-buster (those rules apply to projects that reference `style.min.css` from `index.html`). For Next.js + Tailwind: `npm run build` instead — confirm passes clean.

**Forbidden moves:**

- **HARD FORBID structural edits to `ServicesScrollLock.tsx`** (or any component file). CSS-only this cycle. The JS handler stays untouched.
- **HARD FORBID structural edits to:** Hero3D, Process, PortfolioGallery, ScrollRevealObserver, SectionDivider, PaintFlow, Footer, Navbar, LiveEstimate, WhySoley, FounderBlock, FAQ.
- **Do NOT introduce R3F / @react-three/fiber / drei / three.**
- **Do NOT use `matchMedia` to disable** the scroll-lock or any panel feature on mobile (RULE 4). The point of this fix is to make the existing feature WORK on mobile, not bail it.
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered elements.
- **Do NOT introduce a new accordion / vertical fallback** for ServicesScrollLock on mobile. Single layout, CSS + JS agree.
- **Do NOT add ghost numbers** anywhere (RULE 8).
- **Do NOT remove or downgrade** any prior glow / animation / effect (`feedback_nigel_no_removal.md`).
- **Do NOT pile** a new color or new animation on top of the existing CTA paint-stroke or section dividers (`feedback_simplicity_over_polish.md`).
- **Do NOT call the iMessage reply tool** (RULE 1 — Spark is a sub-agent).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** anywhere in code, commits, or comments (RULE 2).
- **Do NOT score-chase** — this cycle is a real BLOCKER fix, not a polish round.
- **Do NOT verify from a single snapshot** (RULE 3) — must capture all 5 runway positions on all 4 viewports.

**MEMORY.md entries Spark MUST respect:**

- RULE 4 / `feedback_disabling_isnt_fixing.md` — never bail ServicesScrollLock via matchMedia. Fix the CSS containment so the feature works on mobile.
- RULE 3 / `feedback_actually_scroll_test.md` — mid-runway 5-position verification at 4 viewports. No single-snapshot claims.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — execute the BUG-025 fix at full intensity. Don't introduce "subtle" reframings.
- RULE 8 / `feedback_no_ghost_numbers.md` — no ghost numerals.
- `feedback_horizontal_scroll.md` — user explicitly LOVES the horizontal scroll-lock pattern. Keep it working.
- `feedback_simplicity_over_polish.md` — replace, don't pile. CSS containment fix, not a redesign.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — never remove a prior animation / glow / effect.
- `feedback_pixel_alignment.md` — center-alignment audit at 375 + 414 mobile.
- `project_penn_tech_baseline.md` — Penn Tech catalog #4 (horizontal scroll-lock) is the floor. The fix preserves and improves the catalog floor.

---

### 2. Builder — Scope-clarity content addition (HONEST "what we don't do" buyer information)

**Brief:** Builder adds a small content-honesty addition: a "Scope clarity" / "What we don't do" block that helps homeowners self-qualify before requesting an estimate. This is genuine new buyer information — painters routinely field "do you also do roofs / drywall repair / wallpaper removal" questions, and pre-launch transparency saves both sides time. Builder picks the cleanest placement (likely either inside Contact as a left-column block, OR as a new short section between FAQ and Process / Contact). Strict honesty — list what they DO NOT do; do NOT invent partner referrals or fabricate scope claims.

**File targets (all under `/Users/modica/projects/soley-painting`):**

- **Builder picks ONE of these placements (no piling — `feedback_simplicity_over_polish.md`):**
  - **Option A:** Add a 4-6 bullet "What we don't do" block inside `Contact.tsx` left column, complementing the existing commitment bullets. This keeps it contained — no new section, no new file.
  - **Option B:** Add a 2-3 question pair to the existing `FAQ.tsx` covering scope (e.g. "Do you do drywall repair / wallpaper removal / roof painting?"). Smallest change, reuses existing component.
  - **Option C:** Add a new short `ScopeClarity.tsx` section between FAQ and Contact, mirroring the WhySoley card pattern. Most prominent but more structure.
  - **Recommendation: Option B** — it's the smallest change, reuses an existing accordion that's already proven, and FAQ is the natural home for "do you do X?" questions. Builder may pick A or C if they have a strong reason to disagree, but must NOT pick more than one.

- **`app/page.tsx`** — only modified if Builder picks Option C.

- **Honest content** (suggested questions for Option B — Builder may rephrase for painter voice):
  - "Do you do drywall repair?" — honest answer about light patching being included; major drywall replacement being a separate trade.
  - "Do you remove wallpaper?" — honest answer about wallpaper removal being included; cost depends on layers and adhesive.
  - "Do you paint roofs / metal siding / brick exteriors?" — honest answer about which exterior surfaces ARE in scope.
  - **NO fabricated specifics:** no "we partner with ABC drywall company", no fake referral networks, no fake pricing, no "we charge $X per sq ft", no fake square-footage thresholds.
  - Generic operational framing is fine ("major drywall replacement is a separate trade — happy to flag it during the walkthrough").

**What "scope clarity addition shipped at full quality" looks like:**

- Visually consistent with existing FAQ / Contact pattern (no new card style, no new color introductions).
- 2-3 (Option B) or 4-6 (Option A) honest items.
- Every answer painter-specific, no marketing filler ("we strive to deliver excellence" banned).
- ARIA correctness preserved (Option B inherits FAQ's accordion ARIA).
- Build passes clean (`npm run build`).

**Verification (RULE 3):**

- `npm run build` passes.
- Run Playwright on the live URL (or `npm run dev`) at desktop 1440x900 + iPhone SE 375x667 + iPhone 13 390x664.
- For the new content: capture mid-section screenshots at 5 scroll positions per RULE 3 if Option C (new section). For Option A or B, capture before + after states on the existing section it modifies.
- Save screenshots to `/tmp/soley-builder-cycle9-scope/`.

**Forbidden moves:**

- **HARD FORBID structural edits to:** Hero3D, ServicesScrollLock, Process, PortfolioGallery, ScrollRevealObserver, SectionDivider, PaintFlow, Footer, Navbar, LiveEstimate, WhySoley, FounderBlock.
- **Soft-cool (do NOT structurally edit):** FAQ — Builder may ADD 2-3 items if Option B chosen, but does NOT restyle, restructure, or refactor the existing FAQ component. Pure additive copy.
- **Do NOT introduce R3F / @react-three/fiber / drei / three.**
- **Do NOT use `matchMedia` bail-outs** anywhere (RULE 4).
- **Do NOT use Framer Motion `whileInView`** on SSR-rendered text.
- **Do NOT add ghost numbers** anywhere (RULE 8).
- **Do NOT fabricate** ANY scope specifics (RULE 7) — no fake partner companies, no fake pricing, no fake referral networks, no fake sq ft thresholds, no fake response times, no fake crew availability windows.
- **Do NOT pick more than one** of Option A / B / C (`feedback_simplicity_over_polish.md`).
- **Do NOT call the iMessage reply tool** (RULE 1 — Builder is a sub-agent).
- **Do NOT use "subtle / considered / editorial restraint / tasteful / delicate / refined"** anywhere (RULE 2).
- **Do NOT remove or downgrade** any prior animation / glow / effect (`feedback_nigel_no_removal.md`).
- **Do NOT call the user a bottleneck** (`feedback_respectful_tone.md`).
- **Do NOT score-chase** — this is honest content for buyers, not score polish.

**MEMORY.md entries Builder MUST respect:**

- RULE 7 / `feedback_no_invented_fight_data.md` — no fabricated scope or partner-referral specifics.
- RULE 1 / `feedback_always_imessage.md` — sub-agent: do NOT text the user.
- RULE 2 / `feedback_no_self_throttle.md` — execute the addition at full intensity; no "subtle" reframings.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — no `matchMedia` bail-outs.
- RULE 8 / `feedback_no_ghost_numbers.md` — no ghost numerals.
- `feedback_simplicity_over_polish.md` — pick ONE placement option, do not pile.
- `feedback_frame_b_richness.md` — additive only; preserve content count on existing sections.
- `feedback_nigel_no_removal.md` — never remove a prior animation / glow / effect.
- `feedback_respectful_tone.md` — collaborative framing only.
- `feedback_no_dev_content.md` — buyer-facing painter scope language; no developer-feature framing.
- `feedback_unique_design.md` — visual treatment matches established Soley brand system.
- `project_penn_tech_baseline.md` — Penn Tech catalog binding stays the floor. Scope clarity is additive, not a catalog item.

---

## Forbidden cycle-wide

- **Sub-agents texting the user** (RULE 1).
- **Touching Hero3D / Process / PortfolioGallery / ScrollRevealObserver / SectionDivider / PaintFlow / Footer / Navbar / WhySoley / FounderBlock / FAQ structurally.** All HARD FORBIDDEN this cycle.
- **Touching `ServicesScrollLock.tsx` JS** structurally. Spark's BUG-025 fix is CSS-only.
- **Hero R3F re-introduction** (Razor removed it deliberately; SVG signature is the approved centerpiece).
- **Footer "SOCIAL CHANNELS COMING SOON" → fake INSTAGRAM swap.** Honest pre-launch only (RULE 7).
- **Catalog #11 Instagram bottom bar** — orchestrator-approved as intentional pre-launch framing. Ignore Nigel's INSTAGRAM suggestions every cycle until real social channels exist.
- **Fake project / customer / founder / neighborhood / city names**, fake "Est. YYYY", fake reviews, fake stats, fake warranty terms, fake certifications, fake crew sizes, fake partner companies, fake referral networks, fake pricing, fake sq ft thresholds (RULE 7).
- **`matchMedia` bail-outs** to disable any feature on any viewport (RULE 4). Especially relevant for Spark — fixing BUG-025 means making the existing feature work, not bailing it on mobile.
- **Framer Motion `whileInView`** on SSR-rendered elements.
- **Ghost numbers** behind any section (RULE 8).
- **Bloom postprocessing.**
- **`Math.sin` / `lerp` smoothing** on positional motion (catalog #12).
- **"Subtle / considered / editorial restraint / tasteful / delicate / refined"** language anywhere (RULE 2).
- **Stripping content count** from any section (`feedback_frame_b_richness.md`).
- **Removing or downgrading** any prior glow / animation / effect (`feedback_nigel_no_removal.md`).
- **Calling the user a bottleneck** in commits or reports (`feedback_respectful_tone.md`).
- **Score-chasing.** Cycle is a real BLOCKER fix + honest content addition. Score will follow.
- **Single-snapshot verification** (RULE 3). 5 runway positions × 4 viewports for Spark; 5 positions for Builder if Option C, before/after if A or B.

---

## Section cooldown register (for next-cycle Coordinator)

| Section | Touches in last 6 entries (after this cycle) | Cycle pressure |
|---|---|---|
| ServicesScrollLock | 3 (Refiner d6c2ccf + 0316c52 + Spark cycle 9 CSS containment) | **HARD COOLDOWN** for cycle 10 |
| Process | 2 (Refiner d6c2ccf + 0316c52) | Hard cooldown |
| PortfolioGallery | 3 (Builder + Pixel e2f0637/65f37b4 + Refiner d6c2ccf) | **HARD COOLDOWN** |
| Hero3D | 2 (Spark 85888ef + Refiner 0316c52) | Hard cooldown |
| SectionDivider | 2 (Spark 451cca8 + Pixel e2f0637) | Hard cooldown |
| PaintFlow | 2 (Spark 451cca8 + Refiner e81b122) | Hard cooldown |
| Navbar | 2 (Spark cycle 6 + cycle 7 c6f7093) | Hard cooldown |
| LiveEstimate | 2 (Builder cycle 6 copy + Pixel cycle 8 font + Spark cycle 9 if 11px confirmed) | Hard cooldown |
| WhySoley | 1 (Builder cycle 6 copy) | Soft-cool |
| FounderBlock | 1 (Builder cycle 6 copy) | Soft-cool |
| Footer | 1 (Pixel 6e88be7) | Soft-cool |
| FAQ | 2 (Builder f3cc3fb + Builder cycle 9 if Option B) | Hard cooldown |
| Contact | 1 if Option A | Soft-cool |
| ScopeClarity NEW | 1 if Option C | Soft-cool |
| **CTA hover** | Spark cycle 7 c6f7093 | Soft-cool |

---

## Rationale (one line)

Score 6.2 / 7.5 cap, BUG-025 panel overflow remains the only confirmed-real BLOCKER (Scout Round 4 has the exact CSS recipe), Nigel cycle 8's other "absent" items match prior Playwright-snapshot artifact patterns — schedule **Spark** to ship the Scout Round 4 BUG-025 three-part CSS fix (`max-width: 100vw; overflow: hidden`, panel-title clamp formula, `100vh → 100dvh`) plus targeted font violations, and **Builder** to add an honest 2-3 item scope-clarity addition (preferring Option B: extend FAQ in place) that helps buyers self-qualify before booking.
