# AGENT-PLAN.md — Soley Painting

**Cycle:** 13 (Coordinator)
**Date:** 2026-05-07
**Live:** https://soley-painting.vercel.app
**Prior Nigel score:** 6.9 (cap 7.5 pre-launch)
**Decision:** Continue ONE more substantive cycle pursuing genuinely NEW customer-value axes; if next Nigel doesn't move, signal convergence.

---

## Dispatch rationale (one line)

Site is polished but score-capped at 7.5 awaiting customer content; recent cycles trending toward marginal polish, so this cycle pursues two genuinely-new axes that don't require photography — dynamic OG image (real SEO/share artifact) + section-transition micro-moments (fresh visual axis untouched in 12 cycles).

---

## Scheduled agents (in order)

### 1. Builder — Dynamic OG image route + meta polish

**Target file:** `app/opengraph-image.tsx` (NEW) using Next.js 14 ImageResponse from `next/og`. Optionally `app/twitter-image.tsx` (re-export).

**What to ship:**
- A 1200x630 dynamic OG image generated at build time via Next.js ImageResponse API, painted in the Soley brand palette (rust #BF5B38, ochre #B8884A, linen, stone, slate).
- Use the on-site display font (Cormorant Garamond) for the wordmark "Soley Painting" + tagline "Every wall done right." Composition: warm umber gradient background, drop-cloth corner texture echo, rust accent rule, eyebrow "RESIDENTIAL & COMMERCIAL PAINTING".
- No photography. No fabricated phone/address. No fake reviews/stars.
- Verify in production by reading `<meta property="og:image">` rendered URL after deploy.
- Optional bonus (if time): expand homepage `description` meta to ~155 chars with real differentiators already stated on site (small crew, written quote, primer + two coats, low-VOC option).

**Why this is real value, not marginal polish:**
- The site currently has no OG image — when shared on iMessage/Twitter/Slack/LinkedIn, the preview is blank. This is a concrete share-artifact gap not yet touched.
- Pure config + asset work; doesn't need photography, doesn't fabricate anything, doesn't touch any existing component structurally.

**MEMORY.md rules to respect:**
- RULE 7 (content honesty): no fabricated address/phone/hours/credentials/reviews on the OG image. Wordmark + tagline only.
- `feedback_no_self_throttle`: design the OG composition with confidence, not "minimal/restrained."
- `feedback_no_dev_content`: no developer-feature lists in the OG.

**Forbidden this cycle:**
- All existing component structure (Hero3D, ServicesScrollLock, Process, PaintFlow, PortfolioGallery, FAQ, Contact, NotifySignup, LiveEstimate, WhySoley, FounderBlock, Footer, Navbar, SectionDivider, ServicesMarquee).
- R3F re-introduction.
- Editing app/layout.tsx metadata struct (already comprehensive per cycle 11) — only the OG image route is being added; if `description` polish is shipped, single-line change only.
- Stub /api routes (notify + contact already shipped).

**Brief:** Ship a real share-link artifact for Soley. ImageResponse API with the brand palette. Verify via og.png URL in production after merge. Treat this as the "site is fast, beautiful, but has no preview when shared" gap — close it.

---

### 2. Spark — Section-transition micro-moments (Frame B)

**Target axis:** The visual handoff between consecutive sections. Not the SectionDivider component itself (cooldown — Refiner a200114 already filled in 6 missing instances). The transition *moment* — the last 80px of one section blending into the first 80px of the next.

**What to ship (Frame B — replace, don't pile on):**
- Pick ONE handoff that currently feels abrupt (recommended: Hero3D → ServicesScrollLock OR ServicesScrollLock → PaintFlow OR Process → Contact). Choose by visual evaluation only.
- Add a subtle bg-color cross-fade ramp via CSS `linear-gradient` on the receiving section's first 120px so the umber→bg color transition feels intentional, not stepped.
- OR add a brief, opacity-fading rust accent rule that anchors the handoff visually.
- REPLACE one piece of existing transition behavior (a sharp seam, an existing bleed) — never pile on. RULE: "Spark replaces when adding."
- Globals.css cosmetic only. No component structural edits.

**MEMORY.md rules to respect:**
- `feedback_simplicity_over_polish`: replace, don't pile on (no glow-on-glow / rule-on-rule).
- `feedback_no_self_throttle`: do not write "subtle / refined / considered restraint" into the implementation — make the moment intentional and visible.
- `feedback_unique_design`: don't default to the standard cubic-easing fade; pick something painter-themed if a clean idea presents (e.g. drip color bleeding into next section).
- `feedback_pixel_alignment`: ensure the transition lands cleanly on iPhone SE 375 + iPhone 13 390 (mobile parity).
- RULE 8 (no ghost numbers): if you're tempted to anchor the transition with a faded numeral, don't.

**Forbidden this cycle:**
- All existing component structure.
- SectionDivider component (already touched extensively).
- New animations on positional motion using sin/lerp.
- matchMedia bail-outs (RULE 4 / `feedback_disabling_isnt_fixing`).
- Bloom, ghost numbers, glow-on-glow.
- "Subtle/considered/editorial-restraint" language in commit messages or comments.
- Removing existing animations.

**Brief:** Pick ONE section handoff that reads as a hard seam. Ship a deliberate transition moment via globals.css only. REPLACE the existing seam, don't add atop it.

---

## Forbidden sections (cycle-wide)

Hero3D / ServicesScrollLock / Process / PaintFlow / PortfolioGallery / FAQ / Contact / NotifySignup / LiveEstimate / WhySoley / FounderBlock / Footer / Navbar / SectionDivider / ServicesMarquee — ALL component structures are off-limits this cycle.

Eligible files only:
- `app/opengraph-image.tsx` (NEW — Builder)
- `app/twitter-image.tsx` (NEW optional — Builder)
- `app/layout.tsx` (single-line meta description polish only — Builder, optional)
- `app/globals.css` (transition cosmetics only — Spark)

---

## Standing rules reinforced for both agents

- **RULE 1 — Sub-agents do NOT text the user.** Ever. Builder/Spark return reports as tool results; the orchestrator decides what to forward.
- **RULE 2 — Execute the brief at full intensity.** No self-throttle. The OG image should be commanding (full brand-palette piece). The transition moment should be intentional, not whispered.
- **RULE 3 — Verify mid-runway, multi-viewport.** Spark must verify the transition at desktop 1440 + iPhone 13 390 + iPhone SE 375.
- **RULE 4 — Disabling is not fixing.** No matchMedia bail-outs.
- **RULE 7 — Content honesty.** No fabricated address/phone/credentials/reviews on the OG image or in any meta polish.
- **RULE 8 — No ghost numbers.** Don't anchor either deliverable with a faded background numeral.
- **Git author:** Matt Modica <mmodica3@gmail.com>.
- **Each agent commits before next runs.**

---

## Convergence note (for next Coordinator cycle)

If the next Nigel score does NOT move from 6.9 to 7.0+ after this cycle ships, the next Coordinator should propose a convergence-pause: site is awaiting customer content (real photography, real reviews, real address) and further agent cycles will be marginal. Pause cleanly with state recorded; resume when Matt has customer assets to wire in.
