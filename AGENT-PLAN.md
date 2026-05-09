# AGENT-PLAN.md — Soley Painting (:03 slot, post-Refiner)

**Date:** 2026-05-07 :03
**Live:** https://soley-painting.vercel.app
**Latest score:** 6.6 (scroll-experience, 2026-05-07 21:30)
**Latest commit:** 446a690 (Refiner — BUG-001 scroll-lock fix, LiveEstimate re-wired, Process aria-selected, WhySoley spotlight)

---

## Decision rule fired

**Default rotation + Section cooldown.** Score (6.6) is below 8.5 — full toolset available. No stuck-loop signal (last 4 changelog entries all show commits). Refiner just landed the BLOCKER + 3 high-priority fixes, but the Nigel top-5 still has open structural and content gaps (WhySoley **accordion** behavior, Contact left-column void, navbar logo wrap, founder/team human-signal). PaintFlow + LiveEstimate need visual elevation. Schedule **Builder → Spark** in that order: Builder closes the structural gaps, Spark elevates the two flat-reading catalog items.

**Section cooldown trigger:** Hero has been touched in 3 of the last 6 changelog entries (Frame A SOLEY path, Frame B brush sweep, Frame B Sacramento signature). **Hero is FORBIDDEN this cycle.** Distribute attention.

---

## Scheduled agents (in order)

### 1. Builder — structural gap-fill + human-signal block

**Targets:**
- **Nigel Priority #3 — Contact left-column void.** Audit `app/components/Contact.tsx` (or wherever the Contact section lives). The desktop screenshot shows a large pale void in the left column. Either the scroll-reveal IntersectionObserver is using too tight a threshold (drop from 0.3 → 0.1) or content is missing. Fill the left column with: contact-info stack (email + service area placeholder + "We answer the phone" honest claim) + the three honest commitments from Scout Site E reference ("We answer every call. We show up on time. We protect your floors."). Verify mid-runway with Playwright at 5/25/50/75/95 % per RULE 3.
- **Nigel Priority #2 — WhySoley mobile accordion.** Refiner only added spotlight glow on the card group. The catalog #10 spec calls for **mobile accordion** (tap to expand description + bullets) below ~640px while keeping the 3D tilt on desktop. Implement the accordion expand/collapse with `aria-expanded` and `aria-controls` — keep all 4 cards' content count intact (Frame B richness rule). Do NOT collapse to vertical static stack — that is RULE 4 disabling.
- **Nigel Priority #5a — Navbar logo wrap on iPhone SE.** Add `white-space: nowrap` to the navbar logo container so "Soley / Painting" doesn't stack to two lines at 375px. Pixel fixed the tap target (44px) but the wrapping is still open. Verify at 375px with Playwright.
- **New — Honest pre-launch human-signal section.** Insert a small founder/team intro block between WhySoley and Process with **honest pre-launch framing only**: a 2-line "Who's behind Soley" copy block + a placeholder portrait slot ("Founder photography forthcoming"). NO fabricated names, credentials, neighborhoods, "Est. YYYY" claims, or invented bios (RULE 7). The placeholder slot is the human signal, not a fake person.

**Forbidden moves (last 10 changelog):**
- Do NOT touch the Hero centerpiece (3 touches in last 6 entries — cooldown).
- Do NOT add ghost numbers behind WhySoley cards or the new founder block (RULE 8).
- Do NOT collapse WhySoley to a static vertical stack on mobile to "make it work" (RULE 4).
- Do NOT add `matchMedia` bail-outs to disable tilt on mobile (RULE 4).
- Do NOT remove any glows / animations / effects shipped by prior cycles (`feedback_nigel_no_removal.md`).
- Do NOT fabricate a founder name, bio, or "Est. 2018"-style claim (RULE 7).

**MEMORY.md entries Builder MUST respect:**
- `project_penn_tech_baseline.md` — the 12-item catalog is the floor; Contact + WhySoley + Process are catalog-tracked.
- RULE 4 / `feedback_disabling_isnt_fixing.md` — fix CSS/JS mismatch, never bail features.
- RULE 7 — pre-launch honest framing on the new founder block. Placeholder portrait + honest copy only.
- RULE 2 / `feedback_no_self_throttle.md` — no "subtle / considered / editorial restraint" language. Full-intensity execution.
- RULE 3 / `feedback_actually_scroll_test.md` — verify each fix at 5+ runway positions and at 375 + 390 + 1440 viewports.
- `feedback_frame_b_richness.md` — the WhySoley accordion keeps all 4 cards' content count intact.
- `feedback_pixel_alignment.md` — center-alignment on every section at 375 + 414.
- RULE 1 — do NOT text the user.

---

### 2. Spark — Catalog #5 PaintFlow depth + Catalog #6 LiveEstimate polish

**Targets:**
- **Catalog #5 — PaintFlow visual elevation.** Nigel scored 0.6: "section renders on chalk background and is visually flat. Dot animation and node pulses are too subtle to distinguish from a static diagram at a glance." Lift it: dark slate panel background (matches services panel mood), brighter terracotta + teal alternating animateMotion dots with a glowing trail (`filter: drop-shadow(0 0 6px var(--accent))`), node pulse on dot arrival (scale 1.15 + flash glow), thicker connecting path stroke (4–6px), node icons at higher contrast on dark background. Replace the flat chalk panel — do not pile on top of it.
- **Catalog #6 — LiveEstimate auto-typing polish.** Refiner just re-wired it into page.tsx. Verify it renders at the right scroll position and elevate: ensure the form chrome reads as a real "Get a Quote" card (terracotta border accent, fixed height to prevent layout jump, blink cursor on the active typing field, characters at constant ~80ms cadence). Add the "Sent" terracotta checkmark animation at sequence end, then 8s pause + loop. Honest demo address only — "123 Maple Street" placeholder per Scout spec; **never invent a real address**.
- **Hero polish (REJECTED — hero in cooldown).** The brief mentions "Hero polish — paintbrush sprite quality at the leading edge." Section cooldown rule blocks Hero this cycle. Carry to next cycle.

**Forbidden moves (last 10 changelog):**
- **Hero is FORBIDDEN this cycle** (cooldown trigger). No edits to Hero.tsx, the Sacramento SVG signature, the brush sprite, or globals affecting `.glow-hero` exclusively.
- Do NOT pile glow-on-glow or rule-on-rule (`feedback_simplicity_over_polish.md`). Replace, don't stack.
- Do NOT introduce `whileInView` Framer Motion on SSR-rendered elements — use the CSS `.scroll-reveal` pattern already in place.
- Do NOT add ghost numbers behind PaintFlow nodes (RULE 8).
- Do NOT downgrade PaintFlow to "subtle" or "considered" (RULE 2). The brief is "feels flat" — the fix is to elevate, not to refine restrained-ly.
- Do NOT invent a real demo address, real phone number, or real customer name in the LiveEstimate sequence (RULE 7).
- Do NOT strip content count from WhySoley or any other section (`feedback_frame_b_richness.md`).
- Do NOT replace "SOCIAL CHANNELS COMING SOON…" with a fake INSTAGRAM handle. The user has explicitly said no fake social handles even though Nigel suggested it. Leave the footer bottom-bar as-is or use an honest "Instagram launching soon" treatment.

**MEMORY.md entries Spark MUST respect:**
- `project_penn_tech_baseline.md` — catalog #5 + #6 are the explicit targets.
- RULE 2 / `feedback_no_self_throttle.md` — execute at full intensity. PaintFlow needs to feel premium, not "considered."
- RULE 7 — no fake addresses / customer names / phone numbers in LiveEstimate.
- RULE 8 / `feedback_no_ghost_numbers.md` — no large faded background numerals behind PaintFlow nodes.
- `feedback_simplicity_over_polish.md` — replace when adding; no piling.
- `feedback_frame_b_richness.md` — preserve content count.
- `feedback_nigel_no_removal.md` — no removing existing glows/animations.
- RULE 3 / `feedback_actually_scroll_test.md` — verify PaintFlow + LiveEstimate at 5 runway positions, 3 viewports.
- RULE 1 — do NOT text the user.

---

## Forbidden cycle-wide

- **Hero centerpiece edits.** Section cooldown — touched 3 of last 6 entries.
- **Footer "SOCIAL CHANNELS COMING SOON" → fake INSTAGRAM swap.** Nigel suggested this but the user has explicitly said no fake social handles. Leave as-is.
- **Fake founder names / bios / "Est. YYYY" claims** in the new human-signal block (RULE 7).
- **`matchMedia` bail-outs** to disable WhySoley tilt or scroll-lock on mobile (RULE 4).
- **`whileInView`** on SSR-rendered elements — use `.scroll-reveal` (catalog #9).
- **Ghost numbers** behind any new section (RULE 8).
- **Sub-agents texting the user** (RULE 1).
- **"Subtle / considered / editorial restraint / tasteful / delicate"** language in any agent prompt or commit message (RULE 2).

## Section cooldown

- **Hero — FORBIDDEN this cycle.** 3 touches in last 6 entries (8802038 SOLEY path, b46fa24 brush sweep, b10a171 Sacramento signature).
- **ServicesScrollLock — soft-cool.** Refiner fixed the BLOCKER in 446a690. Do not edit again unless verification reveals regression.

---

## Rationale (one line)

Refiner closed the BLOCKER and three high-priority bugs in 446a690 — Builder now closes the remaining Nigel structural gaps (Contact left column, WhySoley mobile accordion, navbar logo wrap, honest founder block) while Spark elevates the two flat-reading catalog items (PaintFlow + LiveEstimate); Hero is in cooldown for one cycle.
