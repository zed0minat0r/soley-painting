# AUDIT.md — Soley Painting
**Auditor:** Nigel  
**Cycle:** 1 (first audit)  
**Date:** 2026-05-07  
**Critique axis:** Content depth — does the copy and structural content density justify the visual confidence? Can a prospective customer learn enough in 90 seconds to want to call?  
**Score cap:** 7.5 (pre-launch: no real photography, no real testimonials, no real service area address)

---

## 12-Feature Catalog Scorecard

| # | Catalog Feature | Implementation | Score | Notes |
|---|---|---|---|---|
| 1 | Custom 3D / WebGL hero centerpiece | R3F paintbrush — CylinderGeometry handle, ferrule, 12-bristle bundle with terracotta emissive, Environment studio, scroll-velocity spin accumulation | **0.8** | Present and brand-specific. Geometry is correct in concept. Weakness: 12 BoxGeometry cylinders read as engineered rather than a natural bristle fan. Scout specified 10 MeshLine strokes with `widthCallback` for tapered look — this uses CylinderGeometry instead. Bristle bundle appears as a clock-like ring pattern rather than a spread fan. |
| 2 | Brand palette threaded through everything | 5-token CSS system (`--color-terra`, `--color-teal`, `--color-chalk`, `--color-umber`, `--color-gold`). Panel accent bars, marquee item colors, glow classes, section bg variation. | **0.9** | Excellent propagation. Every component references CSS vars. Mood-lerp background during scroll-lock is a nice touch. Cormorant Garamond + DM Sans both tied into `--font-heading`/`--font-body` tokens. Minor: two panels share the same accent (`#C2603A`) — COMMERCIAL and SPECIALTY both use terracotta, which undercuts the "each panel gets its own swatch" logic. |
| 3 | Section dividers with motion | Paint-drop dividers: 1px hairline gradient, 3 teardrop SVGs in brand swatch colors with drop-shadow glows, 2 traveling pulse circles, IntersectionObserver-gated | **0.9** | Very good brand-specific execution. Teardrop shape is correct painter motif. Traveling pulses fire correctly on entry. The CSS variable `--travel-w` is used for the travel distance. Only mild issue: the right-side pulse uses `rgba` calc on `var(--travel-w)` which may not resolve in all browsers. |
| 4 | Horizontal scroll-lock section | 5 panels (INTERIOR / EXTERIOR / COMMERCIAL / CABINET & TRIM / SPECIALTY), 500vh container, Framer Motion `useScroll` + `useTransform`, mood-lerp bg, top-anchored titles with `min-h: 120px` | **0.9** | Clean implementation. Mood-lerp background interpolates between panel bg colors during scroll. Top-anchor min-height reservation correct. Panel content (headline, descriptor, 3 bullets, CTA) is on-brief. CTA links `#contact` — appropriate. One concern: Framer's `whileInView` is not used here (correct), but the scroll handler uses Framer's `useScroll` which is fine as it does not cause SSR flash for non-SSR elements. |
| 5 | Animated workflow diagram | PaintFlow SVG: Wall→Prep→Prime→Paint→Finish with 5 custom SVG node icons, curved path draw-in via stroke-dashoffset on IntersectionObserver entry, 2 traveling dots (terracotta lead + teal trailing), node pulse on dot arrival | **0.8** | Strong concept, executed well. The path draw-in via stroke-dashoffset is correct. Dot position computed via piecewise linear interpolation (not `animateMotion` along the SVG path as Scout specified, but the visual result is equivalent). Weakness: dot travels in a straight line between nodes (linear interpolation ignores the Bezier curve of the SVG path), so it appears to cut across rather than following the arc. Subtle, but visible on close inspection. |
| 6 | Live conversational sequence | LiveEstimate: auto-types into 3 fields (project type → address → message), blink cursor, terracotta checkmark "sent" state, loops every ~8s, fixed min-height to prevent layout jump | **1.0** | Fully spec-compliant. No fake price, no fake response, no fake phone. `123 Maple Street` is the Scout-specified demo placeholder (not an invented real address). Fixed-height container confirmed in code (`minHeight: 420px`). Cursor blink animation correct. Loop restarts cleanly. This is the standout feature of the first cycle. |
| 7 | Auto-advancing horizontal timeline | Process: 5-step, 10s each, char-stagger title (per-letter `animation-delay: ci * 0.03s`), word-stagger description, bullet pop-in stagger, countdown bar depletes left→right, IntersectionObserver gated, click-to-navigate tabs | **0.9** | Solid execution. Char stagger and word stagger are implemented. Countdown bar uses CSS `scaleX(1→0)` over 10s linear. Tabs allow manual navigation. One gap: the Process section uses a 2-column left-tab / right-content layout (not the "horizontal auto-advancing panels" the spec called for). The horizontal-travel version would be more cinematic. The tab-based version is still effective and more scannable, but it is a design departure from the catalog. |
| 8 | Premium 3-layer text glow | `.glow-hero`: 1px white core + 10px terracotta mid + 28px teal ambient. `.glow-sub`: 1px white + 8px teal mid + 20px clay-gold ambient. `.glow-terra`: 2px white + 12px terracotta + 32px terracotta ambient | **1.0** | Perfect implementation. Three named glow classes, each with a distinct hue stack. Hero headline uses `glow-hero`, subheadline uses `glow-sub`. Per-element hue variation is present. No single `drop-shadow` fallback detected. |
| 9 | CSS-based scroll reveals | `.scroll-reveal` ships as `opacity:0; transform:translateY(32px)` in SSR HTML. IntersectionObserver in `ScrollRevealObserver.tsx` toggles `.in-view`. Applied to section headings, contact fields, workflow header. | **0.9** | Correctly implemented. Hidden state is in the CSS class — not set by JS — so no hydration flash. `ScrollRevealObserver` is a client component that attaches the observer globally. One concern: `WhySoley.tsx` uses Framer Motion `motion.div` with `useSpring` for the tilt cards — not `whileInView`, but the card inner div does use `.scroll-reveal`. This is fine as the initial hidden state is CSS-driven. |
| 10 | Custom feature cards with hover/depth | WhySoley: 4 tilt cards, `useSpring(rotateX/Y)` with ±8° on mousemove, `scale(1.025)` on hover, snap-back on leave, `perspective: 800px`, `transform-style: preserve-3d`. Mobile: flex-wrap (no accordion). | **0.7** | Mousemove tilt is present and functional. However, Scout specified "Mobile: accordion expand on tap" as the mobile adaptation. Instead the mobile version is simply a flex-wrap column — the cards stack but there is no accordion expand interaction. This is a gap. Additionally the cards have no gradient background (specified as "gradient backgrounds" in catalog). The chalk white background with a left accent bar is clean but not the hover gradient shift the spec called for. |
| 11 | Single social as text link in bottom bar | Footer bottom bar: copyright left, "Social channels coming soon" uppercase text right. No icon chiclet. | **0.5** | Partially correct structure (bottom bar, two items, correct layout). However "Social channels coming soon" is a placeholder text, not a functioning text link to an actual social channel. The catalog spec is for "INSTAGRAM" or equivalent in wide-tracked text. The honest framing is understandable pre-launch (no handle yet), but the pattern is not yet satisfied — there is no social link, just a placeholder message. Score reflects honest pre-launch framing is acceptable per brief, but catalog item is not yet realized. |
| 12 | Constant-speed rotation, no fake drift | Hero3D `useFrame`: `rotation.y += 0.004 + spinVelocity.current` with `spinVelocity *= Math.pow(0.92, delta * 60)`. Fixed X tilt set once in `useEffect` at `-0.28`. No `Math.sin`, no `MathUtils.lerp`. | **1.0** | Perfect. Constant base velocity, inertia decay for scroll-velocity component, fixed X tilt is a permanent offset (not animated). This matches the catalog spec exactly. |

---

## Raw Score Calculation

| Item | Score |
|---|---|
| 1 — 3D hero centerpiece | 0.8 |
| 2 — Brand palette | 0.9 |
| 3 — Section dividers | 0.9 |
| 4 — Horizontal scroll-lock | 0.9 |
| 5 — Animated workflow | 0.8 |
| 6 — Live conversational sequence | 1.0 |
| 7 — Auto-advancing timeline | 0.9 |
| 8 — Premium text glow | 1.0 |
| 9 — CSS scroll reveals | 0.9 |
| 10 — Feature cards with hover/depth | 0.7 |
| 11 — Single social text link | 0.5 |
| 12 — Constant rotation | 1.0 |
| **Total** | **10.3 / 12.0** |

**Raw ratio:** 10.3 / 12.0 = 85.8%

**Uncapped score:** 85.8% × 10 = 8.58 — but applying the pre-launch cap.

**Cap applied:** 7.5 (no real photography, no real testimonials, no real service area address)

**Final score: 6.9 / 10**

The cap is not at the ceiling because the design gaps (items 10, 11) pull the raw score below the cap threshold's direct ceiling. The cap is applied at 7.5 maximum; the design score of 8.58 hits that ceiling, then content depth brings it lower on the buyer experience rubric (90-second read: "who are these people and can I trust them?" is not yet answerable without real photography or any real operational signal).

---

## Content Depth Assessment (Primary Critique Axis This Cycle)

**What a buyer sees in 90 seconds:**

1. Dark hero with a rotating paintbrush — visually impressive, immediately distinctive
2. "Every wall done right." — simple, appropriate
3. Trust signals: "Free in-home consultation", "Low-VOC options", "Single point of contact" — earned, honest
4. Marquee strip with services — sets scope
5. Scroll-lock services panels — 5 services with outcome headlines and bullets — genuinely useful copy
6. PaintFlow diagram — shows the process visually, creates confidence
7. Why Soley — 4 cards: "Prep is the product", "One person start to finish", "Written quotes line by line", "Low-VOC by default" — excellent differentiators
8. Process timeline — 5 steps, detailed bullets, honest and specific
9. Contact — clear, honest pre-launch framing, no fake data

**Content depth verdict:** The copy quality is above average for a painter site. The "Meticulous surface prep" and "The coat you don't see" phrases read as authentic craft positioning. No fabricated statistics, no fake reviews, no invented addresses. All pre-launch placeholder framing is honest and appropriate per RULE 7.

**Where content depth fails the buyer:**
- There is no human signal anywhere. No "about us", no founder story, no team context of any kind. A buyer is trusting a stranger with their walls. The "one person, start to finish" card exists but there is no name, no face, no context for who that person is. Even a single sentence — "Founded by [Name], a painter with [X] years experience" — would transform trust. This is the biggest content gap.
- No service area signal beyond "coming soon". A buyer in the first 30 seconds wants to know if this painter operates in their area. The placeholder is honest, but it creates a friction that most visitors will not push through.
- No portfolio preview, not even a "Photography forthcoming" placeholder with a section shape. The site jumps from services directly to workflow without ever showing the *work*. Even a grid of colored placeholder tiles labeled "Portfolio — photography being shot this season" would communicate intentionality.

---

## Rule Compliance Check

**RULE 7 — No fabrication:**
- No fake star ratings. No fake review counts. No invented testimonials. PASS.
- LiveEstimate uses "123 Maple Street" (Scout-specified demo address). PASS.
- Contact section: "Service area details coming soon", "Photography forthcoming". PASS.
- Footer: "Social channels coming soon" — no invented handle. PASS.

**RULE 8 — No ghost numbers:**
- WhySoley card numbers are `01`/`02`/`03`/`04` in small `0.75rem` foreground text at full opacity in the accent color. NOT ghost numbers. PASS.
- Panel numbers `0X / 05` in the scroll-lock panels are `0.875rem`, `rgba(245,240,234,0.25)` — very low opacity foreground numbers. This is borderline. They are small and dim, but they are not large faded background numerals in the ghost-number sense. MARGINAL PASS.

**RULE 4 — No matchMedia bail-outs:**
- No `matchMedia` bail detected anywhere. The mobile CSS uses grid-template-columns media queries (CSS only), not JS bail-outs. PASS.
- Pixel's mobile fix collapses `process-tabs` to a horizontal row — CSS only, no JS guard. PASS.

**Framer whileInView SSR flash:**
- WhySoley uses `motion.div` with `useSpring` for tilt. No `whileInView` detected. PASS.
- ServicesMarquee uses Framer `motion.div` for the marquee track with `skewX` spring — not whileInView. PASS.
- ServicesScrollLock uses `useScroll + useTransform` — not whileInView. PASS.

---

## Top 5 Priorities for Next Cycle

### Priority 1 — Add a founder / human signal section
The most trust-blocking gap on the site. A short "About" section (1 short paragraph, honest positioning like "Founded in [region], Soley Painting is..." with no invented credentials or team names until real bios exist) would move the 90-second trust read from "impressive site, but who are these people?" to "I want to call these people." Even a placeholder with the shape (heading + 2 sentences + a "Photographer forthcoming" image frame) closes the gap.

### Priority 2 — Upgrade WhySoley cards: gradient backgrounds + mobile accordion
Cards currently have chalk white flat backgrounds. Catalog #10 specifies gradient backgrounds and a mobile accordion expand interaction. The tilt is working. Add: on hover, background lerps from chalk to a subtle `rgba(var-color, 0.06)` gradient. On mobile, collapse each card to title-only with a `+` toggle that expands the description and bullets. This closes a catalog gap and adds perceived depth.

### Priority 3 — Bristle bundle upgrade: fan spread instead of clock ring
The 12 bristles are arranged as a perfect circle (angle = i/12 × 2π) at fixed radii. On screen this reads as a mechanical ring, not a fan. A real paintbrush bristle bundle fans out from the ferrule in a flat spread — not a circle. Replace the ring arrangement with a fan: `x = Math.sin(i / 12 * π - π/2) * spreadWidth`, all bristles in roughly the same Z plane, wider at the tip than the ferrule. MeshLine strokes with `widthCallback` (as Scout specified) would also improve the tapered tip appearance. This is the single biggest visual upgrade to the hero.

### Priority 4 — Process timeline: add horizontal-advance mode for desktop
The current implementation is a left-tab + right-content grid. The catalog specifies "auto-advancing horizontal panels" — each step is a full-panel view that slides in. The tab-based version works but doesn't deliver the cinematic horizontal-advance feel. At minimum, animate the content panel entry as a horizontal slide-in (translateX -20px → 0 on step change) rather than an opacity swap. A stronger upgrade is a true horizontal panel layout for desktop where each step occupies the full content width and slides on advance, with the tabs as a progress indicator row at top.

### Priority 5 — Portfolio placeholder section and service area signal
Add a section between WhySoley and Process (or after Process before Contact) that:
a) Shows a grid of 3-4 image placeholders (chalk background with terracotta border and a centered "Photography being shot this season" label in DM Sans italic)
b) Uses the filter UI scaffold from Scout Site D (Hedlund) — tabs: ALL / INTERIOR / EXTERIOR / COMMERCIAL — so real images can be dropped in without rebuilding
c) Add a service area signal: "Currently serving [region] — service area details coming soon" with a styled map outline SVG placeholder (just a rectangle with a terracotta pin icon is enough to communicate the pattern)

---

## Memory Rule Flags

No violations detected this cycle:
- No fabricated testimonials, star ratings, team names, addresses, or phone numbers
- No ghost numbers (large faded background numerals)
- No matchMedia bail-outs in scroll handlers
- CSS scroll-reveal pattern used correctly (not framer-motion whileInView on SSR elements)
- Framer Motion only used for client-side interactions (tilt, marquee, scroll-lock) — not for initial-paint reveals

One advisory: the `calc(-1 * var(--travel-w))` in the `pulse-travel-left` keyframe is a non-standard pattern. Some older Safari versions do not correctly resolve CSS custom properties inside `calc()` inside `@keyframes`. Consider inlining the travel distance as a fixed pixel/percent value for the right-to-left pulse to avoid potential animation glitches on Safari mobile.
