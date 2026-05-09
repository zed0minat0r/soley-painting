# AGENT-PLAN.md — Soley Painting (Cycle 10, SEO foundation + targeted Pixel verification)

**Date:** 2026-05-07 :03 ET
**Live:** https://soley-painting.vercel.app
**Latest score:** 6.2 (Nigel cycle 8, axis: conversion-friction, commit df6e01d) — under the 7.5 pre-launch cap
**Latest commits:** 388cbae (refiner CHANGELOG) ← a200114 (BUG-043 SectionDivider 6 missing placements) ← d9582a0 (QA cycle 7 — BUG-025/038/039/040 confirmed CLOSED) ← a7d96ab (builder cycle 9 CHANGELOG) ← e037aae (FAQ +3 scope-clarity items)
**Cap:** 7.5 pre-launch — score CAN'T rise until real photography + real reviews + real address all land (`feedback_nigel_stricter.md`).

---

## Decision rule fired

**Cap-mode polish + one HIGH-LEVERAGE foundation gap.** Score 6.2 is below the 8.5 polish gate, but the active BLOCKER list is empty and recent cycles have been incremental. Wake-up summary cron fires at 8:07 ET — this is the last :03 before user check-in, so prioritize ONE substantive, non-fabricating improvement over generic polish.

**State of the site (verified, not relying on cycle-8 Nigel SSR-snapshot misreads):**

- BUG-025 (mobile panel overflow) — **CONFIRMED CLOSED** by QA cycle 7 (d9582a0). Spark cycle 9 CSS containment fix (37c5f5f) holds at all 15 positions across SE375/IP13/D1440.
- BUG-038 (Process tablist ARIA) — **CONFIRMED CLOSED** by QA cycle 7. Refiner 0316c52 added role=tablist/tab/tabpanel + aria-controls + arrow-key handler.
- BUG-039 (ServicesScrollLock entry dead zone) — **CONFIRMED CLOSED** by QA cycle 7. Refiner 0316c52 fix verified.
- BUG-040 (12px eyebrow/label fonts) — **CONFIRMED CLOSED** by QA cycle 7. Pixel 594201e bumped 10 elements to 13px.
- BUG-043 (SectionDivider only 2/8 placements) — **CONFIRMED CLOSED** by Refiner a200114 — added 6 missing dividers; page now has 8 total.
- PaintFlow `animateMotion` — QA cycle 7 confirmed dots advancing via RAF. Nigel cycle 8 "absent" claim was a Playwright SSR-snapshot artifact.
- LiveEstimate typing — client-rendered only, framed honestly as "Example — how your request looks" demo card (Builder cycle 6 commit 934d25a).
- Process countdown bar — Refiner d6c2ccf (BUG-032) keyed countdown to visible state. QA cycle 5+7 confirmed 10s countdown firing.

**Open items in BUGS.md:** Nothing actionable — all real BLOCKERs cleared. Nigel cycle 8 priorities P2/P3/P4 were SSR-snapshot artifacts; P5 (mobile font violations) needs a quick re-verification on the two specific elements he named (`.portfolio-tile-badge`, LiveEstimate label) — but Pixel 594201e covered LiveEstimate eyebrow + label per the commit message, so this is most likely already fixed and just needs confirmation.

**HIGH-LEVERAGE untouched gap: SEO + crawler foundation.**

The site has zero JSON-LD structured data, no `robots.txt`, no `sitemap.xml`, no Open Graph image, and Next.js metadata limited to the bare title + description. For a local-business website, **LocalBusiness + Service + FAQ JSON-LD** is the single highest-leverage non-fabricating improvement the agents can ship. It does not require photography, reviews, or any client testimonials. It uses honest pre-launch values (service area "Coming soon", phone unset = `null`, no fake `aggregateRating`). It directly improves Google rich-result eligibility — which for a painter means showing up in local-pack searches the moment Adam adds his real address.

This is also the ONLY remaining catalog-adjacent improvement that has not been touched in 70 commits over 6 hours. Every section structurally has been fortified; the SEO/discovery layer is untouched.

**No convergence stall.** Last 4 entries each shipped real distinct work (Refiner BUG-043, QA cycle 7, Builder FAQ extension, Spark BUG-025 CSS containment). Continue.

**Why NOT auto-pause:** auto-pause rule fires after 2 no-change cycles. The last 4 cycles all produced commits with verified diffs. We are not idle.

**Why NOT generic Builder + Spark polish:** Builder copy + Spark visual depth have already had 9 passes. Diminishing returns. One concrete foundation move > another decorative pass.

---

## Section cooldown register (touches in last 6 changelog entries)

| Section | Recent touches | Status this cycle |
|---|---|---|
| Hero3D | Refiner 0316c52 (BUG-042 mobile canvas) | **HARD FORBID** structurally |
| ServicesScrollLock | Spark 37c5f5f (BUG-025 CSS containment) + Refiner 0316c52 | **HARD FORBID** — just-shipped, confirmed closed |
| Process | Refiner 0316c52 (BUG-038 ARIA) | **HARD FORBID** |
| PortfolioGallery | Pixel e2f0637 + Builder copy | **HARD FORBID** |
| ScrollRevealObserver | Refiner d6c2ccf | **HARD FORBID** |
| SectionDivider | Refiner a200114 (just added 6 placements) | **HARD FORBID** |
| PaintFlow | Refiner e81b122 (mobile dead space) + Spark 451cca8 | **HARD FORBID** |
| Footer | Pixel 6e88be7 | **HARD FORBID** |
| Navbar | Spark c6f7093 (CTA hover + focus rings) | **HARD FORBID** |
| LiveEstimate | Builder cycle 6 + Pixel 594201e | **HARD FORBID** structurally |
| WhySoley | Builder cycle 6 copy | Soft-cool |
| FounderBlock | Builder cycle 6 copy | Soft-cool |
| FAQ | Builder cycle 9 (e037aae +3 items) | **HARD FORBID** — just-shipped |
| Contact | Last copy touch cycle 4 | Soft-cool |
| **CTA hover** | Spark c6f7093 | **HARD FORBID** |
| **`app/layout.tsx` metadata + `app/` SEO files** | NEVER TOUCHED | **OPEN — primary target this cycle** |

**Convergence guard:** Last 4 entries — Refiner (a200114), QA (d9582a0), Builder (e037aae/a7d96ab), Spark (37c5f5f). All distinct, all landed real changes. NOT a stuck loop.

**Score gate:** 6.2 < 8.5 polish gate → Builder stays in rotation. Polish-only mode does NOT apply.

**Spark frequency:** Spark ran cycle 9 (37c5f5f). One cycle ago. NOT due. Skip Spark this cycle to avoid piling visual effects on top of just-shipped CSS containment work (`feedback_simplicity_over_polish.md`).

**Memory drift check:** `feedback_no_self_throttle.md` (RULE 2) and `feedback_disabling_isnt_fixing.md` (RULE 4) remain relevant guardrails for any future scroll-lock work but are not in scope this cycle. `feedback_no_invented_fight_data.md` and `feedback_no_dev_content.md` are CRITICAL this cycle — schema markup is high-risk for fabrication if Builder invents address/phone/rating values. Schema must reflect honest pre-launch state ONLY.

**Audit priority match:** Nigel cycle 8 P5 (`.portfolio-tile-badge` 9.6px, LiveEstimate label 11px) is the only Nigel-cycle-8 priority that hasn't been triple-confirmed-closed. Pixel verification + targeted bump is the second piece of work this cycle.

---

## Scheduled agents (in order)

### 1. Builder — SEO foundation: JSON-LD LocalBusiness + Service + FAQPage schema, robots.txt, sitemap.xml, Open Graph metadata polish

**Brief:** Builder ships the discovery / SEO foundation layer. This is the single highest-leverage non-fabricating improvement available — it adds real value for the moment Adam connects his real address and phone, and it costs nothing in honest framing. NO new visible UI sections. NO copy changes to existing components. Only `app/layout.tsx` metadata, a new `app/robots.ts`, `app/sitemap.ts`, and JSON-LD `<script>` tags rendered into `app/layout.tsx` or `app/page.tsx`.

**Memory entries Builder MUST respect this run:**

- `feedback_no_invented_fight_data.md` — Schema must NOT invent values. No `streetAddress`, no `telephone`, no `aggregateRating`, no `review`, no fake `priceRange`, no `openingHours` if hours are not yet set. Use honest pre-launch fields only.
- `feedback_no_dev_content.md` — This is for a local-business site selling painting services. Schema must reflect that, NOT a developer template feature list.
- `feedback_unique_design.md` — No template-y AI-generated `description` field. The schema description must use the same honest brand voice already on the live site.
- `feedback_simplicity_over_polish.md` — Replace, don't pile. The new metadata block in `layout.tsx` REPLACES the existing thin `metadata` export — it does not duplicate alongside it.

**File targets (all under `/Users/modica/projects/soley-painting`):**

- **`app/layout.tsx`** — Expand the existing `metadata` export with full Open Graph + Twitter card + canonical URL + keyword-honest fields. Use the live URL `https://soley-painting.vercel.app` as `metadataBase`. Add a `<Script type="application/ld+json">` (or inline `<script>` via `next/script` strategy="beforeInteractive") rendering a LocalBusiness JSON-LD object with HONEST values:
  - `@type: "PaintingService"` (or `LocalBusiness` if PaintingService not in schema.org — verify)
  - `name: "Soley Painting"`
  - `url: "https://soley-painting.vercel.app"`
  - `description:` use the existing site headline/subheadline copy, not a new invented blurb
  - `image:` omit if no real photography (or use a deliberately-empty placeholder array)
  - `address:` omit OR include `addressCountry: "US"` only — NO street, NO zip
  - `telephone:` omit — NO fake phone
  - `priceRange:` omit — NO fake range
  - `aggregateRating:` ABSOLUTELY OMIT — fabrication risk
  - `areaServed:` if Adam has not specified, omit; if a service area is mentioned anywhere on the site already, mirror that exact wording
- **`app/robots.ts`** — NEW file. Standard Next.js 14 App Router robots config. `Allow: /`, `Sitemap: https://soley-painting.vercel.app/sitemap.xml`.
- **`app/sitemap.ts`** — NEW file. Standard Next.js 14 App Router sitemap config. Single entry for the homepage with `lastModified: new Date()`. Add anchors for major sections if Builder reads the page.tsx and finds stable IDs (e.g., `#services`, `#process`, `#contact`, `#faq`).
- **JSON-LD FAQPage** — Read the FAQ component (`app/components/FAQ.tsx` or wherever it lives — Builder must locate it). Render a `<script type="application/ld+json">` FAQPage schema that mirrors the actual on-page Q&A items 1:1. NO new questions invented. NO answer rephrasing — use the live answers verbatim.
- **JSON-LD Service** — Render five Service schema entries mirroring the actual five panels of ServicesScrollLock (interior, exterior, commercial, cabinet & trim, specialty). Use the actual on-page panel titles + descriptions verbatim. NO invented prices, NO invented turnaround times.

**Verification:**

- Run `npm run build` — confirm passes clean, no TypeScript errors, no Next.js metadata warnings.
- After build, run a quick Playwright fetch of `https://soley-painting.vercel.app/robots.txt` and `https://soley-painting.vercel.app/sitemap.xml` AFTER Vercel deploy completes (Builder confirms both endpoints respond 200 with correct content-type).
- View-source the homepage HTML — confirm three `<script type="application/ld+json">` tags present (LocalBusiness/PaintingService, FAQPage, Service array).
- Paste each JSON-LD payload into Google's Rich Results Test mentally (or note in commit message that schema is well-formed JSON parseable).
- Confirm zero new visual changes on screen (`npm run dev` quick eyeball of the page renders identically).

**Forbidden moves:**

- **NEVER invent address, phone, hours, price range, ratings, reviews, photo URLs, opening dates, "Est. YYYY" claims** (RULE 7 + `feedback_no_invented_fight_data.md`).
- **HARD FORBID structural edits to** every existing component listed in the cooldown register above. Pure additive `app/`-level configuration.
- **HARD FORBID restructuring `app/page.tsx`** — only inject JSON-LD `<script>` tags at the top or via a small `<JsonLd />` helper component.
- **Do NOT introduce R3F / @react-three/fiber / drei / three** (kept out per Razor's removal).
- **Do NOT add a Google Analytics / Plausible / Vercel Analytics tag** — out of scope, separate decision needed from user.
- **Do NOT call the iMessage reply tool** (RULE 1).
- **Do NOT use the words "subtle / considered / editorial restraint / tasteful / delicate / refined"** anywhere in commits or code (RULE 2 + `feedback_no_self_throttle.md`).
- **Do NOT** create any new `.md` summary / report files. Return findings inline. (Refiner-style hygiene.)
- **Do NOT** add a JSON-LD `aggregateRating`, `review`, or `breadcrumb` field. No fake breadcrumbs for a single-page site.
- **Do NOT touch `BUGS.md` / `AUDIT.md` / `SCORES.log`.** Those belong to QA / Nigel.

**Commit message format:** `feat(seo): JSON-LD LocalBusiness + FAQPage + Service schema, robots.txt, sitemap.xml, OG metadata expansion (cycle 10)`

---

### 2. Pixel — Targeted Nigel-cycle-8-P5 verification on `.portfolio-tile-badge` + LiveEstimate label

**Brief:** Pixel does ONE thing this cycle: re-verify Nigel cycle 8's only un-triple-confirmed font-violation claim — `.portfolio-tile-badge` reportedly 9.6px on iPhone 13 and LiveEstimate label reportedly 11px. Pixel cycle 8 (commit 594201e) bumped 10 eyebrow/label elements to 13px and may have already covered both. If both compute >= 13px on iPhone 13, Pixel commits a verification note (no code change) and the cycle 8 audit P5 is officially refuted-via-already-fixed. If either still measures < 13px, Pixel ships a one-line CSS bump.

**Memory entries Pixel MUST respect this run:**

- `feedback_pixel_alignment.md` — Pixel always audits center-alignment consistency on mobile. While verifying fonts, also visually confirm `.portfolio-tile-badge` placement and LiveEstimate label center-alignment at iPhone 13 (390) and iPhone SE (375).
- `feedback_actually_scroll_test.md` — Verification must scroll-into-view both elements and re-read computed `font-size` AFTER they have entered the viewport (scroll-reveal can change CSS class state).
- `feedback_simplicity_over_polish.md` — If both elements already compute >= 13px, Pixel does NOT make any cosmetic change. No-op + verification note in CHANGELOG only.

**File targets:**

- **READ ONLY first** — `app/globals.css` and the relevant component files (`PortfolioGallery.tsx`, `LiveEstimate.tsx`) to identify the exact selectors.
- **IF AND ONLY IF** computed font-size on iPhone 13 < 13px: bump the failing selector to `font-size: 0.8125rem` (13px) in `app/globals.css`.
- **DO NOT** rewrite or reformat surrounding CSS. Surgical one-line bump only.

**Verification:**

- Playwright on `iPhone 13 (390x664)` AND `iPhone SE (375x667)`:
  1. Navigate to live URL.
  2. Scroll to PortfolioGallery — wait for first tile to enter viewport — read computed `font-size` of `.portfolio-tile-badge` (or actual selector).
  3. Scroll to LiveEstimate — wait for the demo card to settle — read computed `font-size` of the eyebrow + label elements.
  4. Save screenshots of both sections to `/tmp/soley-pixel-cycle10/`.
- If ANY value < 13px → ship the bump and re-verify. Otherwise no-op.

**Forbidden moves:**

- **HARD FORBID structural edits anywhere** — Pixel does not touch component JSX this cycle.
- **HARD FORBID** changes to any other selector outside `.portfolio-tile-badge` and the LiveEstimate eyebrow/label.
- **Do NOT regress** the 10 elements Pixel cycle 8 already bumped. If Pixel's grep finds Nigel-8-P5 references the same elements as 594201e, Pixel notes it and exits.
- **Do NOT call the iMessage reply tool** (RULE 1).
- **Do NOT use** disallowed throttle words (RULE 2).
- **Do NOT** create a `.md` summary file — inline result back in CHANGELOG-AGENT.md only.

**Commit format (only if a change is shipped):** `pixel(cycle10): verify Nigel-8 P5 — bump <selector> 11px→13px on iPhone 13 (sole remaining font violation)`
**No-op format:** Pixel appends a single line to CHANGELOG-AGENT.md noting verification without code change.

---

## One-line rationale

Cycle 10 ships the SEO foundation layer (LocalBusiness + Service + FAQPage JSON-LD + robots.txt + sitemap.xml + OG metadata expansion) — the single highest-leverage non-fabricating improvement available before user check-in — plus one targeted Pixel verification of the only remaining un-confirmed-closed Nigel-cycle-8 priority.

---

## Forbidden sections summary (for fast Builder/Pixel reference)

Hero3D, ServicesScrollLock, Process, PortfolioGallery (structurally), ScrollRevealObserver, SectionDivider, PaintFlow, Footer, Navbar, LiveEstimate (structurally), WhySoley, FounderBlock, FAQ, CTA hover. R3F re-intro forbidden. matchMedia bail-outs forbidden. Ghost numbers forbidden. Self-throttle language forbidden. Fabricated business data forbidden. New `.md` reports forbidden.
