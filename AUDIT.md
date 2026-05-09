# AUDIT.md — Soley Painting
**Nigel cycle 14 — Convergence checkpoint**
**Date:** 2026-05-07
**Axis:** Narrative structure
**Viewports tested:** Desktop 1440, iPhone 13 (390), iPhone SE (375)
**Live URL:** https://soley-painting.vercel.app

---

## Cycle 14 deliverable verification

Five claimed fixes from ee55ef4 — verified independently:

| Fix claimed | Verified? | Notes |
|---|---|---|
| OG image fixed (local fonts, nodejs runtime) | YES | /opengraph-image returns 200 OK, 76KB PNG — confirmed |
| ServicesScrollLock SVG icons (no emojis) | YES | 5 named SVG components (IconInterior, IconExterior, etc.) wired in PANEL_ICONS map — code confirmed |
| Footer "Phone available at launch" line | YES | Contact column in footer shows this exact string |
| LiveEstimate→Contact CTA bridge | YES | "Ready to send your own request?" present at line 459 of LiveEstimate.tsx, confirmed by WebFetch |
| PortfolioGallery framing line above grid | PARTIAL | A pre-launch text paragraph sits between chips and grid ("Photography fills in as first projects complete"), but there is no decorative line / rule element — only a p tag. Not a visual framing line in the design sense. |

---

## 12-feature catalog audit

| # | Feature | Status | Score |
|---|---|---|---|
| 1 | 3D Paintbrush hero (R3F) | PRESENT — SVG signature-reveal hero (Sacramento path, brush tracks leading edge, 3-color cycle) replaced R3F. Not a 3D object per catalog spec but brand-appropriate and visually distinctive. | 8/10 |
| 2 | Brand palette threaded through everything | PRESENT — terracotta/teal/chalk/slate/gold propagated via CSS custom properties; panel accent bars, dividers, marquee, glows all token-referenced | 8/10 |
| 3 | Section dividers with motion | PRESENT — teardrop SVG motif, hairline gradient, traveling pulses. IO-gated. On-brand. | 8/10 |
| 4 | Horizontal scroll-lock (5 panels) | PRESENT — pure-JS handler confirmed in prior cycles; 5 painting services, track translates correctly. SVG icons now replace emojis. Solid. | 8/10 |
| 5 | Animated workflow diagram (PaintFlow) | PRESENT — SVG animateMotion 5-node wall-to-finish diagram with dot travel and node pulse | 7/10 |
| 6 | Live conversational sequence (LiveEstimate) | PRESENT — auto-typing estimate form, natural cadence, blink cursor, checkmark sent state, 8s loop, bridge CTA. Nested inside Contact section rather than standalone, which reduces its visual impact. | 7/10 |
| 7 | Auto-advancing horizontal timeline (Process) | PRESENT — 5-step, 10s per step, char/word stagger, bullet pop, countdown bar, cinematic cross-fade transitions | 8/10 |
| 8 | 3-layer text glow (hero) | PRESENT — .glow-hero class: near-white core + terracotta mid + teal ambient on hero H1 | 7/10 |
| 9 | CSS scroll reveals (no whileInView flash) | PRESENT — .scroll-reveal / .in-view pattern, IO observer, BUG-058 WhySoley IO fix confirmed | 8/10 |
| 10 | 3D-tilt hover cards / mobile accordion | PRESENT — WhySoley tiltCard rotateX/Y on mousemove, mobile accordion with aria-expanded | 7/10 |
| 11 | Single-channel social as text link in bottom bar | PRESENT — "Social channels coming soon" wide-tracked text in bottom bar. Will need live Instagram handle eventually. | 7/10 |
| 12 | Constant-speed rotation / no fake-perception drift | PRESENT — SVG stroke-dashoffset at constant 140px/s, no lerp, no sin drift | 8/10 |

**Catalog completion: 12/12 features present** (none absent outright, one nested rather than standalone)

---

## Narrative structure audit (focus axis)

A real buyer landing on this site in 90 seconds can follow the story:

- **Hero:** "Every wall done right." — clear brand promise, distinctive animated wordmark
- **Services:** 5 horizontal panels with substantive bullet points and genuine descriptor copy
- **How it works:** PaintFlow diagram signals process without promising fake stats
- **Why Soley:** 4 cards with real differentiators (written quotes, low-VOC, single contact, night-before confirm) — these are genuinely credible
- **Who's behind this:** FounderBlock with "Founder portrait forthcoming" — honest but a blank void where a face should be

**Narrative gaps — the story loses thread at two points:**

1. **FounderBlock** sits between WhySoley and Portfolio but has no face, no name, no city. A buyer investing 90 seconds hits a full-width placeholder portrait and zero identifying information. The section title "Who's behind Soley" creates a promise the content cannot yet fulfill. This is better than fabrication but worse than deferring the section entirely until real content exists.

2. **Portfolio** is 9 painted SVG swatches labeled "Photography forthcoming." After four strong feature sections, the evidence section produces nothing. The pre-launch framing text is honest but the sheer size of the placeholder gallery makes the absence feel like a gap rather than a temporary state. There is no "first job booked" hook that would make a warm lead feel like they're catching something in progress.

3. **Section order** creates a momentum dip: the cinematic Process timeline and LiveEstimate auto-typing come after the portfolio letdown. A buyer who hit the portfolio emptiness and then sees the process auto-advancing reads as "impressive demo, no real work." The most trust-building content (specificity of process, honest differentiators) precedes the evidence void rather than following it.

---

## Section-by-section scores

| Section | Score | Key issue |
|---|---|---|
| Hero3D (SVG signature reveal) | 8.5 | Distinctive, constant-speed, brand-colored — strong first impression |
| ServicesMarquee | 7.5 | Functional, velocity-skew is nice |
| ServicesScrollLock | 8.0 | SVG icons confirmed, substantive copy, clean horizontal lock |
| PaintFlow | 7.5 | Good diagram, nodes pulse on arrival |
| WhySoley | 7.5 | Tilt cards work, accordion mobile fix confirmed |
| FounderBlock | 5.5 | Placeholder portrait + zero identity info — promise with no payoff |
| PortfolioGallery | 5.0 | 9 "Photography forthcoming" swatches — honest but 0 real proof |
| Process | 8.0 | Cinematic, char-stagger, countdown bar — one of the strongest sections |
| LiveEstimate | 7.0 | Auto-typing works, CTA bridge present, but buried inside Contact section |
| Contact | 7.0 | Honest framing, real commitment list |
| Footer | 7.5 | "Phone available at launch" present, social coming-soon handled cleanly |
| OG Image | 8.0 | Fixed — 200 OK, 76KB PNG with brand wordmark |

---

## What improved since cycle 13 (score 7.1)

1. **OG image regression resolved** — was returning 0-byte PNG; now 200 OK with correct branded image. Social link previews are no longer broken. This was the single highest-impact fix.
2. **SVG icons in ServicesScrollLock** — 5 custom SVG line drawings (house, chimney, office block, cabinet, roller) replace prior emojis. Professional register achieved.
3. **Footer phone hook** — "Phone available at launch" present in Contact column. Honest pre-launch framing.
4. **LiveEstimate bridge CTA** — "Ready to send your own request?" closes the demo sequence with a real conversion action.
5. **Easing cohesion** (Spark cycle 14) — 5 bare `ease` instances replaced with canonical cubic-bezier(0.16,1,0.3,1). Removes micro-jank on slower hardware.

## What regressed or remained flat

- **PortfolioGallery "framing line"** — claimed in changelog, implemented as a p tag, not a visual design element. Not a regression but the fix was cosmetic only.
- **Narrative dip** — FounderBlock and Portfolio remain the same content blockers as cycle 13. No new content landed. The sequence (WhySoley → FounderBlock void → Portfolio void → strong Process) breaks momentum exactly where a buyer would decide.
- **LiveEstimate position** — still embedded inside Contact rather than as a standalone section. Its visual impact is diluted because users who haven't scrolled to Contact never see the auto-typing demo.

---

## Top 5 priorities

1. **Customer-supplied: real founder portrait + name** — FounderBlock is a promise to the buyer with no payoff. Even a single candid phone photo and first name would change the score. Primary remaining ceiling.

2. **Customer-supplied: any real project photography** — even 2-3 photos from a single job replaces 9 "Photography forthcoming" swatches. The portfolio section currently undermines the trust built by every preceding section.

3. **Section reorder — LiveEstimate to standalone section before PortfolioGallery** — the auto-typing demo is impressive and should land when buyer attention is highest, not buried in the Contact section. Moving it between WhySoley and FounderBlock would front-load the most interactive feature.

4. **PortfolioGallery pre-launch hook copy** — replace generic "photography forthcoming" with a brief signal like "First job walkthrough in progress — checking back this season." A buyer who feels like they're arriving at launch-time has a very different emotional response than one who sees a static placeholder.

5. **FounderBlock honest deferral** — if no portrait or name is ready for launch, consider temporarily replacing FounderBlock with a single pull-quote block of the brand philosophy in large type. A fulfilled sentence beats an unfulfilled section every time.

---

## Score

**7.2 / 10** (cap: 7.5 pre-real-photography)

**Movement from 7.1:** +0.1

The OG image fix, SVG icons, and easing cohesion are genuine improvements that clear the 7.1 floor. The site does not reach 7.3 because the two largest trust-building gaps (founder identity, real project photography) are unchanged. The narrative dip at FounderBlock→Portfolio is now the site's dominant buyer-experience problem — everything before it is strong; the sequence then loses altitude for two full sections before recovering with Process.

**Convergence verdict:** Score moved from 7.1 to 7.2 — did not clear the 7.3 checkpoint. By the pre-flagged convergence rule, the next Coordinator should signal convergence-pause to the orchestrator. The agent queue is near-empty on things agents can actually do — the remaining blockers (founder content, real photography, phone number, address) are customer-supplied and cannot be manufactured or improvised.

**Queue status: near-empty. Primary blockers are customer-supplied content.**
