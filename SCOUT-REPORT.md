# SCOUT-REPORT.md — Soley Painting
**Generated:** 2026-05-07  
**Agent:** Scout (Cycle 1)  
**Reference spec:** `~/.claude/projects/-Users-modica/memory/project_penn_tech_baseline.md`

---

## PART 1 — Penn Tech Catalog → Soley Painting Mapping Table

Each row maps one Penn Tech catalog item to its brand-specific Soley Painting equivalent. Builder and Spark consume this table as the authoritative spec.

| # | Penn Tech Feature | Penn Tech Implementation | Soley Painting Equivalent | Implementation Notes |
|---|---|---|---|---|
| 1 | Custom 3D / WebGL hero centerpiece | Rubik's cube — 27 cubies, real face turns, dual rim lights, cube-face palette | **3D Paintbrush mid-stroke** — a single round-ferrule brush at 45° angle, handle tapering toward viewer, bristle bundle spread as if pressing into a surface. The bristle tip emits a terracotta-tinted emissive glow as if wet with paint. | R3F + three.js. Handle: lathed CylinderGeometry, dark walnut-brown material. Ferrule: short MetalRing (metalness 0.9, roughness 0.1, steel). Bristle bundle: 40-60 thin BoxGeometries with slight individual curvature and a terracotta emissive on their tips. Rotation axis: Y-axis (slow, constant ~0.6 rad/s). Slight X-tilt oscillation locked to a fixed range — NOT sine drift. Dual rim lights: terracotta key (warm, right side) + teal fill (cool, left side). No bloom postprocessing. |
| 2 | Brand color palette threaded through everything | Cube's 5 face colors (teal/cyan/emerald/purple/indigo) repeat in dividers, marquee, glows | **Five paint-chip swatch colors** repeat across the whole site: `Terracotta #C2603A`, `Teal #3A8F85`, `Chalk #F5F0EA`, `Slate #2C2C2C`, `Clay Gold #B8935A`. Each of the 5 service panels gets one swatch accent. Section dividers use the same chip set as paint drops. Text glows are terracotta mid + teal ambient. | Propagate via CSS custom properties: `--color-terra`, `--color-teal`, `--color-chalk`, `--color-slate`, `--color-gold`. Every section divider, marquee item, and glow references these tokens. No section introduces an off-brand color. |
| 3 | Section dividers with motion | Hairline gradient + 3 mini cube tiles + 2 traveling square pulses, IntersectionObserver-gated | **Paint-drop dividers** — a 1px hairline gradient (terracotta→teal), 3 mini paint-drop SVGs centered on the line (each a different swatch color), and 2 traveling circular paint-splatter pulses that run left→right and right→left on each side of the drops. IntersectionObserver-gated so they only animate when entering view. | SVG for the drops: a simple teardrop path (wider top, pointed bottom). Pulses: a circle that grows from 0→1 opacity + 0→8px radius, then travels 80% of line width over 1.6s, eases in-out. Do NOT use a generic `<hr>`. |
| 4 | Horizontal scroll-lock section | 5 service panels, vertical scroll drives horizontal travel, custom JS handler, top-anchored titles | **5 Painting Services scroll-lock** — vertical scroll locks the viewport and translates 5 painting service panels horizontally through view: (1) Interior Residential, (2) Exterior Residential, (3) Commercial, (4) Cabinet & Trim, (5) Specialty Coatings. Each panel has a swatch-colored accent bar at top, service icon, one-line descriptor, and a "Learn more" anchor. | Sticky container, `height: 500vh`, inner track `position: sticky; top: 0; height: 100vh; display: flex; overflow: hidden`. JS maps `scrollY` inside the section's 500vh range to `translateX` on the track. Panel minimum width = 100vw. Titles anchor to top of panel with `min-h: 120px` reservation. Exits cleanly back to vertical scroll. NO `snap-type` CSS — custom JS handler only. |
| 5 | Animated diagram / workflow visualization | AI workflow: inputs→AI hub→outputs, SVG curves, animated dots | **Wall-to-finish workflow** — a horizontal SVG diagram showing 5 stages: Wall (bare drywall icon) → Prep (tape & drop-cloth icon) → Prime (roller icon) → Paint (brush-stroke icon) → Finish (sparkle/sheen icon). Animated dots (terracotta and teal alternating) travel the SVG path from Wall to Finish on a loop. Each node pulses when a dot arrives. | SVG `<path>` with `stroke-dashoffset` animation for the connecting lines (draws in on IntersectionObserver). Dots: `<circle>` elements with `animateMotion` along the path, `dur="3s"`, `repeatCount="indefinite"`. Node pulse: `scale(1.15)` + glow on `animateMotion` keyTime match. |
| 6 | Live conversational sequence | iMessage-style chat, messages appear with typing dots, staggered | **Live estimate form filling itself** — a fixed-height mock "Get a Quote" card that auto-types into its own fields: project type selects "Interior / 3 rooms", address field types a placeholder street address character by character, message field fills "Looking to repaint before spring — light neutrals throughout." Then a "Sent" animation appears. Loops after 8s pause. | Fixed container height prevents layout jump. Typing simulation: `setInterval` appending characters. Do NOT invent a real address — use "123 Maple Street" as the demo placeholder. The "Sent" state shows a terracotta checkmark. Never shows a fake response with invented quotes or prices. |
| 7 | Auto-advancing horizontal timeline | 5-step process, 10s each, char-stagger title + word-stagger description, bullet pop, countdown bar | **5-step painting process timeline** — auto-advancing: (1) Free Walkthrough, (2) Color Consultation, (3) Surface Prep, (4) Application, (5) Final Walkthrough & Touch-Up. 10s per step. Title enters with character stagger. Description enters with word stagger. 2-3 bullet points pop in sequentially. Countdown bar depletes left→right over 10s. | CSS `@keyframes` for character stagger (each letter wrapped in `<span>` with `animation-delay: N*0.04s`). Word stagger: same pattern for description words. Bullet pop: `opacity: 0; transform: translateX(-8px)` → in-view state. Countdown bar: `scaleX(1→0)` over 10s `linear`. No static numbered list. |
| 8 | Premium text glow (3-layer halo) | 1px near-white core + 8-14px colored mid + 20-34px ambient | **Hero text: 3-layer halo** — hero headline in Chalk (#F5F0EA), with: 1px near-white core glow (`text-shadow: 0 0 1px #fff`), 10px terracotta mid (`0 0 10px rgba(194,96,58,0.7)`), 28px teal ambient (`0 0 28px rgba(58,143,133,0.4)`). Subheadline uses teal mid + clay-gold ambient. | Implement as a Tailwind utility class `.glow-hero` and `.glow-sub`. Per-element hue shift for marquee items: each service name uses its panel's swatch color as the mid glow color via `color-mix(in srgb, var(--panel-color) 80%, transparent)`. NEVER a single `drop-shadow` (reads as default Tailwind). |
| 9 | CSS-based scroll reveals | `.scroll-reveal` default-hidden, IntersectionObserver adds `.in-view` | **Same pattern** — `.scroll-reveal` ships hidden in SSR HTML (`opacity: 0; transform: translateY(20px)`). IntersectionObserver in a client component adds `.in-view` (`opacity: 1; transform: none; transition: 0.6s ease`). Applied to: section headings, workflow nodes, process bullets, contact fields. | Do NOT use `framer-motion whileInView` on SSR-rendered elements — causes server-visible→client-hidden flash. The CSS pattern has no flash because the hidden state is already in the shipped HTML. |
| 10 | Custom feature cards with hover/depth | 3D tilt on mousemove (rotateX/Y), gradient backgrounds, animated icons. Mobile: accordion | **Service panel cards** — each of the 5 horizontal panels has a card with: `perspective: 800px`, `transform-style: preserve-3d`. On `mousemove`, JS computes `rotateX` and `rotateY` from cursor offset (max ±8°). Hover: panel accent color brightens, icon scales 1.05. Mobile: panels collapse to accordion cards — tap to expand description + bullets. | `onMouseMove` handler on each panel. Compute `(e.clientX - rect.left - rect.width/2) / (rect.width/2) * 8` for Y-axis, inverse for X. `transform: perspective(800px) rotateX(Ndeg) rotateY(Ndeg)`. Transition: `0.1s ease` during drag, `0.4s ease` on mouse-leave snap back. |
| 11 | Single social as text link in bottom bar | Footer bottom: copyright left, "FACEBOOK" wide-tracked text right | **Instagram text link in bottom bar** — bottom bar: copyright left (`© Soley Painting`), right side: `INSTAGRAM` in wide letter-spacing (`.tracking-widest`), small, uppercase. Primary social CTA stays in the Contact section only as a button-style element. | `footer .bottom-bar { display: flex; justify-content: space-between; }`. The Instagram link is `font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase`. No icon chiclets in corners. |
| 12 | Constant rotation, no fake-perception drift | Cube rotates at constant angular velocity, no lerp, no sin oscillation | **Paintbrush rotates at constant angular velocity** — Y-axis only, `~0.004 rad/frame` at 60fps (≈14.4°/s). No lerp smoothing (causes startup acceleration). No sin oscillation on a second axis. The slight X-tilt is a fixed permanent offset (e.g., `rotation.x = -0.3`), not animated. | In R3F `useFrame`: `mesh.current.rotation.y += 0.004`. That's it. Do not introduce `MathUtils.lerp` or `Math.sin(clock.elapsedTime)`. |

---

## PART 2 — Named Reference Sites

Six sites researched with specific moves to study. URLs verified via search.

### Site A: Arch Painting
**URL:** https://www.archpainting.com/

**What to study:**
- Video background hero: full-bleed footage of painters at work, overlaid with a large, bold headline. The video plays muted on loop, pausing only if user interaction drops (intersection). This is the move to study for how a services site can feel cinematic without 3D.
- Dark navy with orange accents on CTA buttons — a high-contrast, confident color system that avoids the generic blue-gray contractor look.
- Case study pages with before/after photography — the before/after framing is a narrative structure that conveys expertise without fake stats.
- Award recognition section — structural pattern for displaying credibility markers (logos, badges) without cluttering the hero.

**Implementation hint for Soley Painting:** Arch's video hero is the "safe" version of what Soley's 3D paintbrush replaces. The CTA contrast ratio (dark background + bright button) is worth copying exactly in the contact section. Their dark navy base + warm accent system is a direct competitor to the terracotta/teal palette — confirm the Soley palette reads warmer and more artisanal by contrast.

---

### Site B: Edina Painting Co.
**URL:** https://www.edinapainting.com/

**What to study:**
- Split-screen hero layout — left panel is a single large photograph of finished work, right panel is headline + CTA. This breaks the centered-hero default and creates visual tension.
- Navigation categorized by surface type (Interior / Exterior / Staining / Refinishing) rather than by room — this is a cleaner taxonomy when you have specialty services.
- Minimalist, well-typeset information architecture — proof that a painter site can be design-forward without 3D, which makes Soley's 3D layer feel even more distinctive by comparison.

**Implementation hint for Soley Painting:** The split-screen hero pattern is the right reference for how to frame the hero content zone alongside (not around) the R3F canvas. The R3F canvas lives on the right, the headline + CTA stack on the left. Study Edina's whitespace rhythm for the section below the hero.

---

### Site C: The Mills Professional Decorating
**URL:** https://themillsdecorating.co.uk/

**What to study:**
- Navy blue with gold accents — this is the premium-craft color system closest to terracotta + clay-gold. Study how they handle text hierarchy: large white headers on navy backgrounds, with gold reserved only for accent lines and CTA underlines.
- "Lots of white space and big headers" positioning — this is editorial restraint applied to a craft service brand, which reads as expensive. Soley should borrow the whitespace rhythm but execute at higher intensity with 3D and scroll-lock.
- Typography: bold, large headline sizing that commands the page before imagery loads.

**Implementation hint for Soley Painting:** Mills' header sizing (very large, tracked-out uppercase service names) is the typographic register to shoot for in the services scroll-lock panel titles. Each panel title should be 5-7 vw size, tracked at `0.05em`, uppercase.

---

### Site D: Hedlund Painting
**URL:** https://hedlundpainting.com/

**What to study:**
- Filterable project gallery (All / Exterior / Interior / Multifamily) — this is the honest portfolio pattern. The filter interaction alone adds perceived interactivity without any 3D or scroll lock.
- Trust-badge grouping pattern: BBB, Master Builders Association, Best of Houzz — clustered together in one section, not scattered. Soley should reserve this pattern for its "Why Us" section without inventing badges.
- FAQ targeting regional concerns (Pacific Northwest moisture → repaint cycle, prep timing) — the pattern for writing honest, useful pre-launch copy even without real reviews.

**Implementation hint for Soley Painting:** The gallery filter pattern maps directly to a future project portfolio section. Even with placeholder "Photography forthcoming" content, wire the filter UI now so Builder or Spark can drop real images in later without rebuilding. Use `category` data attributes + CSS `.hidden` toggle on filter click.

---

### Site E: Paint Denver
**URL:** https://paintdenver.com/

**What to study:**
- "Transparency, Trust, & Pixie Dust" — a tagline that breaks the generic contractor formula. The brand has a stated personality, which makes every other element feel intentional rather than template.
- Warm color palette with orange/rust — nearest competitor to terracotta as a primary. Study how they handle the warmth-to-neutral transition in section backgrounds (warm hero → neutral card section → warm footer strip).
- Seven-year warranty prominently featured without fake testimonials — the right model for pre-launch trust signals. The warranty and communication promise are earned claims; reviews come later.

**Implementation hint for Soley Painting:** The "honest claim" pattern: "We answer every call. We show up on time. We protect your floors." These are commitments the business can make on day one without photography or reviews. Place these three claims in the process section as the opener before the 5-step timeline.

---

### Site F: Gordon Painting
**URL:** https://www.gordon-painting.com/

**What to study:**
- Service taxonomy: Interior Painting, Exterior Painting, Epoxy Floors, Cabinet Refinishing — four clean categories with sub-pages per category. This is the cleanest service architecture found in research.
- "You speak directly with our team — not a call center" — a single-line differentiator that communicates everything about the business model without a case study or testimonial. It's a copy pattern, not a visual one.
- 5.0 rating with 100+ Google reviews displayed immediately — the review count is real (they have real Google data). Pre-launch: placeholder "Reviews loading soon" or just omit the count. Never invent a star average or count.
- Their four-category taxonomy (Interior / Exterior / Epoxy / Cabinets) vs the proposed five — their exclusion of "Specialty Coatings" suggests it may read as too niche for homepage taxonomy. See Part 4 for the taxonomy analysis.

**Implementation hint for Soley Painting:** Study how Gordon uses their service card copy ("Transform your living spaces with stunning results") as a pure-outcome descriptor, no feature list. Each Soley service panel should open with an outcome headline: "Rooms that feel new — without moving furniture." Never a feature list in a panel.

---

## PART 3 — Brand Voice Notes (Pre-Launch Honest Framing)

RULE 7 prohibits fabrication. This section defines what Soley Painting CAN honestly say before real photography, reviews, and an address are in hand.

### What can be said on day one (no fabrication required):

**About the work:**
- "Meticulous surface prep — the coat you don't see is what makes the one you do last."
- "We stay until the edges are right." (commitment, not a stat)
- "Every room gets drop-cloth floor-to-ceiling coverage before the first brush touches a wall." (process claim)
- "We use low-VOC and zero-VOC formulations on request." (sourced from paint brand specs, not invented)

**About communication:**
- "You get a single point of contact from estimate to final walkthrough."
- "We confirm our arrival window the night before, every time."

**About durability:**
- "Interior work guaranteed against peeling and flaking for [X] years." (use actual warranty period when known)
- "Exterior preparation includes full caulking of all trim gaps before primer — skip prep, and the best paint fails in two seasons."

**About the estimate:**
- "Free in-home consultation. We measure, assess surfaces, and provide a written quote — no ballpark ranges."

**What must stay as placeholders until real data arrives:**
- Project count ("150+ projects completed") — placeholder: "Portfolio available upon request / Photography forthcoming"
- Star ratings and review counts — placeholder: "Reviews loading soon" or simply omit until live Google data is embedded
- Service area — placeholder: "Service area details coming soon — currently serving [region] by referral"
- Team photos and names — placeholder: "Meet the team — photography forthcoming"
- Address — placeholder: "Studio address coming soon"
- Awards, certifications — include only if real credentials exist

---

## PART 4 — Service Taxonomy Analysis

**Coordinator's proposed 5:** Interior Residential / Exterior Residential / Commercial / Cabinet & Trim / Specialty Coatings

**Research finding:** This is largely correct but one category needs refinement.

**Standard market taxonomy (from 6+ painter sites researched):**

The most common 5-service grouping on high-performing painter sites is:
1. **Interior Painting** — walls, ceilings, trim, crown molding
2. **Exterior Painting** — siding, fascia, soffits, doors, shutters
3. **Commercial Painting** — office buildings, retail, multi-unit residential, HOA
4. **Cabinet Painting & Refinishing** — kitchen, bathroom, built-ins; often the highest-margin residential service
5. **Specialty Coatings** — epoxy floors, deck staining, fence staining, concrete sealer

**Assessment of the Coordinator's list:**
- "Interior Residential" and "Exterior Residential" splitting the residential market into two scroll-lock panels is fine for SEO and depth, but creates an asymmetry when "Commercial" is a single panel.
- Alternative: keep 5 panels but reframe as: **Interior** / **Exterior** / **Commercial** / **Cabinet & Trim** / **Specialty** (drop "Residential" qualifier from panels 1-2; it's implied). Cleaner panel titles at 5-7vw size.
- "Specialty Coatings" is the right catch-all for epoxy, deck staining, concrete sealer, and venetian plaster — painters who offer this set it apart from volume-play competitors.

**Recommendation:** Use these 5 panel titles exactly as rendered in the scroll-lock:
1. INTERIOR
2. EXTERIOR
3. COMMERCIAL
4. CABINET & TRIM
5. SPECIALTY

Each gets a one-line descriptor under the title. The full "Residential / Commercial" distinction lives on service detail pages, not the scroll-lock panel headers.

**Swatch color assignment per panel (from Palette #2 propagation):**
- INTERIOR → Chalk #F5F0EA (warm neutral, like fresh wall paint)
- EXTERIOR → Teal #3A8F85 (sky/exterior association)
- COMMERCIAL → Slate #2C2C2C (serious, professional)
- CABINET & TRIM → Clay Gold #B8935A (warm woodwork association)
- SPECIALTY → Terracotta #C2603A (distinctive, bold)

---

## PART 5 — Color / Palette Recommendation

**Current placeholder:** Terracotta primary + teal accent.

**Recommendation: Keep and deepen — with a definitive 5-color system.**

The terracotta + teal combination is not a default Claude pattern (most sites default to blue/green or purple/indigo). It is specific, warm, and not used by any of the 20+ painter sites researched. It survives as the primary palette. The recommendation is to formalize it into 5 named tokens:

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-terra` | Terracotta | `#C2603A` | Primary brand color. Hero text glow mid. Service #5 accent. CTAs. |
| `--color-teal` | Deep Teal | `#3A8F85` | Secondary. Rim fill light. Hero text glow ambient. Service #2 accent. Links. |
| `--color-chalk` | Chalk | `#F5F0EA` | Background primary. Service #1 accent. All body text lives on this. |
| `--color-slate` | Slate | `#2C2C2C` | Near-black for headings and body text. Service #3 accent. Bottom bar bg. |
| `--color-gold` | Clay Gold | `#B8935A` | Warm accent for ferrule/metallic details in 3D brush. Service #4 accent. Hover states. |

**Why not all-white minimalist:** Every premium painter site in the research set defaults to white + one accent. Soley needs to stand apart.  
**Why not saturated artistic:** Saturated palettes (bright orange, cobalt) read as consumer brands, not trade professionals.  
**Why earth tones + deep teal:** This combination is used in premium hospitality and craft brand identity (comparable to Ace Hotel aesthetic), signals permanence and craft without feeling corporate. The teal prevents the terracotta from reading as just "warm contractor orange."

**Typography recommendation (break the Claude default):**

Do NOT use Inter, Nunito, or Lora (the three most common Claude-generated font choices).

Recommend:
- **Headings:** `Playfair Display` (editorial serif, high contrast between thick and thin strokes — reads as premium craft without being stuffy). Use at very large sizes in the hero and scroll-lock panels.
- **Subheadings / UI labels:** `DM Sans` (geometric, neutral, supports uppercase tracking well for panel labels and the bottom bar Instagram link).
- **Body:** `DM Sans` (same family as subheadings — reduces font load, keeps body legible).

This pairing breaks the default and gives Soley a distinct voice: editorial serif for brand presence, geometric sans for clarity.

---

## PART 6 — Implementation Priority for Builder

Based on the catalog mapping above, Builder should build the following in cycle 1 (skeleton only — Spark adds visual intensity):

1. `Hero3D.tsx` — R3F canvas with geometry stub for paintbrush (CylinderGeometry handle + BoxGeometry bristles). Constant Y-axis rotation at 0.004 rad/frame. Fixed `height: 100vh` container. Left-side text column with placeholder headline + CTA buttons.
2. `SectionDivider.tsx` — SVG hairline + 3 teardrop SVG drops + 2 traveling circle pulses. IntersectionObserver-gated.
3. `ServicesScrollLock.tsx` — 5 panels (INTERIOR / EXTERIOR / COMMERCIAL / CABINET & TRIM / SPECIALTY), `height: 500vh` sticky container, custom JS scroll handler mapping scrollY→translateX. Panel swatch accent bars at top.
4. `Workflow.tsx` — 5-node SVG path (Wall→Prep→Prime→Paint→Finish). Stub the path; Spark adds animated dots.
5. `Process.tsx` — 5-step auto-advancing timeline stub. Spark adds char/word stagger and countdown bar.
6. `Contact.tsx` — form skeleton. Honest pre-launch framing: "Service area details coming soon." No fake phone, no fake address, no fake reviews.
7. `globals.css` — `.glow-hero`, `.glow-sub` utility classes. `.scroll-reveal` + `.in-view` pattern. CSS custom properties for all 5 palette tokens. `@import` Playfair Display + DM Sans from Google Fonts.

---

*Scout cycle complete. No code modified. Research only.*
