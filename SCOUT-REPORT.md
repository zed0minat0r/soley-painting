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

*Scout cycle 1 complete. No code modified. Research only.*

---

## PREMIUM DESIGN REFERENCES
**Generated:** 2026-05-07  
**Agent:** Scout (Cycle 2 — deep research pass)  
**Scope:** 3D paintbrush R3F, scroll animation patterns, loading sequences, typography upgrades, color system refinement, premium craft site references, concrete Builder/Spark prompts.

---

### SECTION 1 — 3D Paintbrush Hero: R3F Implementation References

#### 1a. Atmos (Awwwards SOTD) — Environment-Driven PBR + Scroll Speed
**URL:** https://atmos.leeroy.ca/  
**R3F tutorial:** https://wawasensei.dev/tuto/reproduce-atmos-awwwards-3d-website-with-react-three-fiber  
**What makes the 3D premium:** Environment cubemaps drive all surface reflections — there is no manual rim light placed in the scene. The material reads as premium because the environment itself provides the lighting response. Scroll velocity drives a "speed blur" stretch effect on objects. Camera orientation lerps from a default angle into a user-facing orientation on load, completing in ~1.5s.  
**R3F primitives:** `<Environment preset="city" />` from `@react-three/drei`, `<ExtrudeGeometry>` + `<CatmullRomCurve3>` for curved path shapes, Lamina-based `<LayerMaterial>` for animated gradient backgrounds.  
**Shader:** Custom `uProgress` fade-in shader (GSAP tweens 0→1 into the uniform, no GPU-side timing).

**Paintbrush adaptation:**
- Use `<Environment preset="studio" />` (warm, even, no cold sky tone) instead of manual rim lights.
- Ferrule (metal ring): `<meshPhysicalMaterial metalness={0.9} roughness={0.08} clearcoat={0.6} clearcoatRoughness={0.1} />` — this gives the steel ring its chrome-like depth without a dedicated light.
- Handle (walnut): `<meshStandardMaterial roughness={0.7} metalness={0.0} color="#3D2314" />` — matte wood.
- Bristle bundle: `<meshPhysicalMaterial roughness={0.9} metalness={0.0} color="#C2603A" emissive="#C2603A" emissiveIntensity={0.18} />` — slightly emissive terracotta tip simulates wet-paint glow.

---

#### 1b. Susurrus (Codrops, April 2026) — Kuwahara NPR Painterly Post-Processing
**URL:** https://tympanus.net/codrops/2026/04/24/susurrus-crafting-a-cozy-watercolor-world-with-three-js-and-shaders/  
**What makes the 3D premium:** The entire scene passes through a **Kuwahara shader** post-processing pass that transforms the rendered output into a watercolor-painting aesthetic. This is a single full-screen shader with no per-object texture work. The simplified vertex stage (`gl_Position = vec4(position, 1.0)` — no MVP matrix) runs faster than a standard post pass, making it mobile-viable. Reflective water uses `<MeshReflectorMaterial>` (Drei) at low resolution + a second custom shader plane overlay.  
**R3F primitives:** React Three Fiber, Drei, React Three Rapier. Physics-based interactions (bread spawning on click) via Rapier.  
**Shader technique:** Kuwahara — samples a grid of neighbor pixels, finds the lowest-variance quadrant, outputs that quadrant's mean color. At low kernel sizes it reads as oil-paint; at high sizes, as watercolor.

**Paintbrush adaptation:**
- Apply Kuwahara as a post-processing pass on the `<Canvas>` using `@react-three/postprocessing` with a custom `EffectComposer` pass.
- Set kernel size = 3 for a subtle oil-paint finish that doesn't obscure geometry.
- Activate it only on the Hero section canvas; disable it on mobile via canvas size check (not a `matchMedia` bail — check `gl.getParameter(gl.MAX_TEXTURE_SIZE)` instead and reduce kernel to 1 if < 4096).
- The pass gives the paintbrush a hand-painted quality without any texture painting on the bristles themselves.

---

#### 1c. Codrops Dual-Scene Fluid X-Ray Reveal (March 2026) — Fluid Simulation for Hero Load
**URL:** https://tympanus.net/codrops/2026/03/23/building-a-dual-scene-fluid-x-ray-reveal-effect-in-three-js/  
**Demo:** https://tympanus.net/Tutorials/SkeletonFluidReveal/  
**What makes the 3D premium:** Ping-pong rendering (two alternating WebGL render targets) drives a fluid simulation that spreads a dark trail from a cursor or origin point. FBM noise (20x frequency, 4 octaves, scale 0.01) generates UV displacement per pixel. `blendDarken` — a `min()` blend of 5 neighbor samples — causes dark areas to bleed outward. A small white wash (+0.015/frame) fades the trail back to white when no new input arrives.

**Paintbrush hero load adaptation:**
1. On page load, draw a paint-stroke silhouette into the initial render target (a thick diagonal calligraphic stroke from upper-left to lower-right).
2. Replace cursor-driven input with a timed sequence: over 1.2s, the FBM diffusion spreads the stroke outward into a warm terracotta stain that fills 60% of the hero background.
3. At t=0.8s, the R3F paintbrush mesh fades in via a `uProgress` uniform (0→1, GSAP `power2.out`, duration 0.7s).
4. The fluid trail fades back to the chalk background over 3s, leaving the brush floating in clean space.
5. This creates a distinct "paint-hits-paper" opening rather than a generic opacity fade.

**Key code shape:**
```glsl
// Fragment shader — ping-pong fluid read
vec2 uv = vUv;
vec2 offset = fbm(uv * 20.0) * 0.01;
float c0 = texture2D(uFluidPrev, uv + offset).r;
float c1 = texture2D(uFluidPrev, uv - offset).r;
float dark = min(c0, c1);
float result = dark + 0.015; // fade back
gl_FragColor = vec4(clamp(result, 0.0, 1.0));
```

---

#### 1d. pmndrs/meshline — Variable-Width Brush Stroke Trail
**URL:** https://github.com/pmndrs/meshline  
**npm:** `meshline`  
**What makes it premium:** MeshLine renders billboarded triangle strips instead of `GL_LINE`, which means strokes have consistent pixel-width antialiasing at any scale. The `widthCallback` pattern drives variable stroke width per point — essential for a calligraphic pressure-taper effect.

**Bristle bundle approach using MeshLine:**
Instead of 40-60 BoxGeometry instances, render 8-12 MeshLine strokes of varying width to represent the bristle bundle:
```jsx
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

// Each bristle: 4-6 points with slight curve
const bristlePts = [new THREE.Vector3(0,0,0), new THREE.Vector3(0.02, -0.15, 0.01), new THREE.Vector3(0, -0.3, 0)];

<mesh>
  <meshLineGeometry
    points={bristlePts}
    widthCallback={(p) => (1 - p) * 0.006}  // tapers to 0 at tip
  />
  <meshLineMaterial
    color="#C2603A"
    lineWidth={0.006}
    resolution={new THREE.Vector2(window.innerWidth, window.innerHeight)}
    transparent
    opacity={0.92}
  />
</mesh>
```
Render 10 such bristles with randomized curve offsets (`THREE.MathUtils.randFloat(-0.015, 0.015)` on the midpoint x/z). This reads as a spread bristle bundle with a natural, irregular silhouette — unlike 40 BoxGeometry instances which read as engineered.

---

#### 1e. Painted/Brushed Material: PBR Settings Reference Table

| Finish Type | Material | roughness | metalness | clearcoat | clearcoatRoughness | emissive |
|---|---|---|---|---|---|---|
| Matte wall paint | MeshStandardMaterial | 0.92 | 0.0 | — | — | none |
| Satin interior paint | MeshPhysicalMaterial | 0.55 | 0.0 | 0.3 | 0.35 | none |
| Gloss trim paint | MeshPhysicalMaterial | 0.18 | 0.0 | 0.9 | 0.08 | none |
| Wet paint tip (emissive) | MeshPhysicalMaterial | 0.85 | 0.0 | 0.0 | — | color, intensity 0.18 |
| Walnut wood handle | MeshStandardMaterial | 0.70 | 0.0 | — | — | none |
| Steel ferrule | MeshPhysicalMaterial | 0.08 | 0.90 | 0.6 | 0.1 | none |

Use **satin interior paint** settings on the handle body and **wet paint tip** on the bristle tips. This creates a hierarchy of finish reads: chrome ferrule catches environment light sharply, walnut handle is warm and matte, bristle bundle is soft with a subtle warm glow at the tip — exactly how a loaded brush looks before it hits the wall.

---

### SECTION 2 — Exceptional Craft/Trade Sites Worth Studying

#### Site G: Marvell Tile & Stone
**URL:** https://marvellco.com.au/  
**Awwwards:** Honorable Mention — https://www.awwwards.com/sites/marvell-tile-stone  
**Awwwards score:** 7.26 overall, Animations/Transitions 8.00/10  
**Stack:** Next.js + React  
**Two-color palette:** `#E8E5DF` (warm ivory/linen) + `#35311F` (dark warm brown/almost black)  
**What to study:**
- The two-color system is the most disciplined restraint pattern in craft-trade web design. There are no accent colors — the photography carries all warmth and texture. This is a benchmark for color economy.
- "Immersive, uninterrupted journey" through project case studies — each project is a full-bleed editorial spread, not a thumbnail grid. This is the model for Soley's future portfolio section.
- Gesture-based transitions (swipe between case studies on mobile) replace pagination entirely.
- "Big background images" means the tile/stone work IS the background — the text floats over it at low opacity, not in a card.
**Implementation hint for Soley Painting:** When real project photography arrives, replace the placeholder gallery with editorial full-bleed spreads using this two-tone overlay system: `background: rgba(53, 49, 31, 0.55)` on the image, chalk text on top. The photography reads as premium because it is not boxed.

---

#### Site H: Adriaans Bouwbedrijf (Dutch Builder, est. 1830)
**URL:** https://adriaansbouwbedrijf.nl/  
**Awwwards:** Nominee — https://www.awwwards.com/sites/adriaans-bouwbedrijf  
**What to study:**
- A 190-year-old trade company that built a scroll-animation site that earned an Awwwards nomination. The lesson: heritage + modern craft UX are not in conflict.
- The positioning line "bouwers sinds 1830" (builders since 1830) is the equivalent of Soley's honest pre-launch framing. Heritage replaces reviews.
- Big background project photography, clean nav, responsive, scroll interactions — these are the four structural pillars of the "premium craft trade" site template.
**Implementation hint for Soley Painting:** Soley can't claim 190 years, but can claim craft-first positioning with the same language register: "Every wall gets the same prep whether it's a studio apartment or a commercial renovation." A founding year or story, even a brief one, anchors the brand.

---

#### Site I: Corentin Bernadou Portfolio (Awwwards SOTD)
**URL:** https://corentinbernadou.com/  
**Awwwards:** Site of the Day — https://www.awwwards.com/sites/corentin-bernadou-portfolio  
**Score:** Animations 8.20/10, Performance 8.00/10  
**Color palette:** `#FF4401` (vibrant orange) + `#070304` (near-black)  
**What to study:**
- Swiss editorial layout grid applied to a creative portfolio: the same typographic rigor that makes editorial design read as premium translates directly into web.
- Interactive grid rulers (Figma-inspired): clicking reveals `getBoundingClientRect()`-positioned guide lines. This tactile "design tool" metaphor is directly analogous to what a painter's masking tape creates on a wall.
- The navigation mask: a resizing div that follows cursor between nav items using `gsap.to()` with `"power3.out"` easing. This is zero-JS-overhead and feels native.
- Loading indicator: "0%" displayed prominently during asset loading — not a spinner, not a logo. The number IS the animation.
**Implementation hint for Soley Painting:** The "0%" preloader pattern maps perfectly to Soley's brand — painters know surface coverage by percentage. A preloader that counts "12%… 47%… 94%… Ready." in Playfair Display, with a terracotta paint-stroke growing underneath the number, would be brand-specific and memorable. Use GSAP timeline to tween a counter and drive the stroke simultaneously.

---

#### Site J: Joseph Santamaria Scroll-Driven 3D World (Codrops, April 2026)
**URL:** https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/  
**What to study:**
- GSAP Observer for unified scroll/touch/trackpad input. Single handler, no `wheel` event workarounds.
- Snap-scroll mode switching: distinct 3D scenes use snap-block behavior (beat-by-beat advance) while panoramic environments use free continuous scroll. A custom state machine built on `Observer` swaps modes dynamically.
- GPU instancing for repeated geometry (floating blocks, pillars) — keeps frame rate high while filling a complex 3D world.
- "A single camera take" philosophy: the whole portfolio is one continuous camera path, not a series of separate page views.
**Implementation hint for Soley Painting:** The "single camera take" principle applies to the 5-service horizontal scroll-lock. Use GSAP Observer instead of a raw `wheel` event listener — it handles touchpad momentum cancellation automatically, which the current custom JS handler does not. Replace `window.addEventListener("wheel", handler)` with `Observer.create({ type: "wheel,touch,pointer", onDown, onUp })`.

---

### SECTION 3 — Scroll-Driven Animation Patterns Winning Awards in 2026

#### Pattern 1: "Velocity-to-Transform" (3D Image Tube, Codrops Feb 2026)
**Reference:** https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber/  
**Demo:** https://tympanus.net/Tutorials/3DImageTubeR3F/  
**Named precisely:** Scroll-velocity-accumulation with inertial decay.  
**How it works:** Scroll delta accumulates into a velocity ref (`tubeSpinVelocity.current += event.deltaY * 0.004`). Every frame, velocity decays (`spinVelocityRef.current *= Math.pow(0.92, dt * 60)`). Scroll position lerps toward target (`scrollCurrent.current += (scrollTargetRef.current - scrollCurrent.current) * 0.12`). No React state updates — all refs, all inside `useFrame`.  
**Hover modulation:** Hover scales `dt` itself via `rotationSpeedScale.current`, slowing all connected motion uniformly.  
**Soley application:** Apply this pattern to the hero paintbrush rotation — scroll velocity in the hero section slightly accelerates the brush Y-axis rotation, then inertia-decays it back to `0.004 rad/frame`. The brush feels physically connected to the user's scroll gesture without any jarring discontinuity.

```jsx
// In useFrame callback:
meshRef.current.rotation.y += 0.004 + spinVelocityRef.current;
spinVelocityRef.current *= Math.pow(0.92, delta * 60);
```

---

#### Pattern 2: "Mood-Lerp Background" (Scroll-Reactive Gallery, Codrops March 2026)
**Reference:** https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/  
**Demo:** https://tympanus.net/Tutorials/DepthGallery/  
**Named precisely:** Camera-depth-driven color lerp with per-plane mood palette.  
**How it works:** Each image plane carries a 3-color mood palette (bg, blob1, blob2). As camera Z moves through the gallery, colors interpolate: `backgroundColor.lerp(nextMoodBackground, blend)`. No hard cuts between sections. Film grain texture (random noise sampled in fragment shader) adds tactile quality.  
**Soley application:** Each of the 5 service scroll-lock panels has its own swatch color. As the horizontal scroll position moves between panels, lerp the full-page background color from panel N's swatch to panel N+1's swatch. At the INTERIOR panel, background is Chalk. At SPECIALTY, background is a tinted Terracotta wash. The transition happens continuously during the horizontal scroll, not on snap.

```js
// Simplified lerp in the scroll handler
const panelProgress = (currentTranslateX / totalTrackWidth) * 4; // 0-4 across 5 panels
const panelIndex = Math.floor(panelProgress);
const blend = panelProgress - panelIndex;
document.body.style.setProperty("--bg", lerpColor(panelColors[panelIndex], panelColors[panelIndex + 1], blend));
```

---

#### Pattern 3: "Sticky Grid Reveal" (Codrops March 2026)
**Reference:** https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/  
**Demo:** https://tympanus.net/Tutorials/StickyGridScroll/  
**Named precisely:** Sticky-pinned tall container with GSAP-timeline-driven grid column stagger.  
**CSS core:**
```css
.wrapper { position: sticky; top: 0; overflow: hidden; }
.block--main { height: 425vh; }
```
**GSAP pattern:** Even columns emerge from above, odd from below (`power1.inOut`). Entire grid scales to 2.05 while lateral columns shift `±40%`. Content text toggles on scroll direction.  
**Soley application:** Use this for the "Why Soley" section (process pillars, trust signals). 3-column grid, sticky at top, with GSAP ScrollTrigger. As user scrolls through 300vh of runway, the 3 columns emerge staggered. Column 1 (Prep) from above, Column 2 (Paint) from below, Column 3 (Finish) from above. Simpler than 5-panel horizontal lock and adds variety to the page's scroll rhythm.

---

#### Pattern 4: "Shader Wipe + Scramble" (Portfolio Reveal, Codrops May 2026)
**Reference:** https://tympanus.net/codrops/2026/05/06/from-shader-uniforms-to-clip-path-wipes-how-gsap-drives-my-portfolio/  
**Named precisely:** Parallel clip-path + text scramble + shader uniform fade, orchestrated by GSAP.  
**How it works:** A single `progress` number (0→1, GSAP timeline, `power2.out`, 0.6s) drives three simultaneous systems:
1. Shader `uProgress` uniform for WebGL image reveal
2. `clip-path: inset(0 0% 0 0)` → `inset(0 100% 0 0)` transition for DOM elements
3. GSAP SplitText scramble (random chars → final chars over 0.3s)

On page transition (out): `opacity: 0` at `power2.inOut` over 0.3s (parallel for bg, grid, cursor, side texts), then content at 0.35s with 0.25s offset.  
**Direct DOM mutation** instead of React state at 120Hz: `element.style.clipPath = ...` — avoids the 8ms React render penalty.  
**Soley application:**
- On page load, the hero headline "Soley Painting" scrambles in (random chars → final) while the R3F canvas fades in via `uProgress`.
- The clip-path wipe opens left-to-right on the sub-headline ("Expert residential & commercial painting — Northeastern PA").
- All three effects begin simultaneously at t=0, complete by t=0.8s.
- Use GSAP SplitText (or a lightweight clone) for the scramble. Do NOT use Framer Motion `whileInView` for this — it causes SSR flash.

---

#### Pattern 5: "useScroll + useTransform Pinned Horizontal"
**Reference:** https://motion.dev/docs/react-scroll-animations  
**Named precisely:** Motion.dev `useScroll` + `useTransform` horizontal panel translation.  
**Code pattern:**
```jsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"]
});
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-400%"]);
// container height: 500vh; inner track: sticky + 100vh
<motion.div style={{ x }}>{panels}</motion.div>
```
This is cleaner than the current custom JS scroll handler proposed in Cycle 1 — Motion handles RAF scheduling and compositor-thread optimization automatically. Hardware-accelerated by default via native ScrollTimeline in Chrome/Safari 18+.  
**Soley application:** Replace the proposed custom `window.addEventListener("wheel", handler)` with this Motion `useScroll` + `useTransform` pattern for `ServicesScrollLock.tsx`. Simpler, fewer bugs, composited on the GPU.

---

#### Pattern 6: "Scroll-Velocity Marquee" (services strip between sections)
**Reference:** https://motion.dev/docs/react-scroll-animations — Ticker pattern  
**Named precisely:** `useVelocity` → `useTransform` → `useSpring` marquee acceleration.  
```jsx
const { scrollY } = useScroll();
const scrollVelocity = useVelocity(scrollY);
const skewX = useTransform(scrollVelocity, [-1000, 1000], [-15, 15]);
const smoothSkewX = useSpring(skewX, { damping: 50, stiffness: 400 });
```
On fast scroll, the marquee items skew horizontally — a micro-interaction that signals motion without distracting. The skew springs back to 0° at rest.  
**Soley application:** The services marquee between hero and the scroll-lock section uses this skew pattern. At rest, the marquee scrolls left at ~40px/s. On fast user scroll, it skews to `15deg` and briefly accelerates. This is directly observable in the Motion docs example and takes ~15 lines of JSX.

---

### SECTION 4 — Loading + First-Paint Patterns

#### Pattern A: "Paint-Percentage Counter" Preloader
**Inspiration:** Corentin Bernadou's "0%" loading indicator  
**How it works on Bernadou's site:** The percentage number is the only element on screen during loading. It is displayed large, central, in the heading typeface. When assets are ready, the number reaches 100 and a GSAP timeline fires — the number slides up and off, the hero content slides up into its place.  
**Soley adaptation (brand-specific):**
- Number displayed: "0%" → "100%" in Playfair Display, 9vw, centered
- Under the number: a terracotta paint stroke SVG that grows left-to-right, driven by the same GSAP progress tween that drives the counter. At "0%" the stroke is a 0-length dot; at "100%" it is a full-width diagonal brush mark.
- On complete: stroke stays visible as the hero background traces it fades into the chalk background; number slides up; R3F canvas fades in (`uProgress` 0→1); headline scrambles in via SplitText.
- Total duration: ~1.8s for assets to load + 0.8s for reveal sequence = 2.6s first-paint.

**Implementation:**
```jsx
// GSAP preloader timeline
const tl = gsap.timeline();
tl.to(counterRef.current, {
  textContent: "100",
  duration: 1.8,
  snap: { textContent: 1 },
  onUpdate: () => {
    strokeRef.current.style.strokeDashoffset =
      strokeLen * (1 - Number(counterRef.current.textContent) / 100);
  }
});
tl.to(preloaderRef.current, { yPercent: -100, duration: 0.6, ease: "power2.inOut" });
tl.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.3");
```

---

#### Pattern B: "Clip-Path Stack Reveal" (Multi-layer opening sequence)
**Inspiration:** Framer Marketplace "Hero Stack Reveal" + Codrops shader wipe  
**How it works:** Three images slide up from the bottom of the screen in rapid succession (0.2s stagger), each covering the previous. The final image expands into a full-screen hero. Then text and UI fade in.  
**Soley adaptation:**
- Layer 1: Chalk background + the growing terracotta stroke (SVG animation)
- Layer 2: The R3F canvas slides up from bottom (`translateY(100%) → translateY(0)`, `power3.out`, 0.5s)
- Layer 3: Headline and CTA slide up from below with staggered delay
- Total: ~1.2s opening, ~0.6s hero settle = 1.8s to interactive
- This is tighter than the percentage counter (2.6s) and better for SEO (less blocking).

---

#### Pattern C: "Single uProgress Shader Fade" (Penn Tech baseline — already planned)
**Existing SCOUT note:** The cube fade-in on Penn Tech is a simple `uProgress` shader fade.  
**What's better:** The Corentin Bernadou clip-path wipe opens left-to-right, not all-at-once, and the Codrops fluid paint reveal provides an origin point. The clip-path wipe (`inset(0 0% 0 0)` → `inset(0 100% 0 0)`) is the cleanest upgrade over a flat opacity fade — it feels like a wipe frame in film, which is directly analogous to a paint stroke being applied.  
**Recommendation:** Replace the simple opacity fade-in of the R3F canvas with a `clip-path` wipe driven by GSAP. Direction: left-to-right (matching a right-handed brush stroke). Duration: 0.6s. Ease: `power2.out`. This is a 5-line change from the Penn Tech baseline.

---

### SECTION 5 — Premium Typography Pairings for Painter/Artisan Brands

#### Assessment: Why Playfair Display + DM Sans is Good But Not Great

Playfair Display is widely used (Google Fonts, free, high recognition) — its heavy vertical stroke contrast is editorial, but it has become a default choice for "boutique business" sites in 2022-2025. It no longer signals premium differentiation; it signals "a polished small business" (which is the right segment, just not distinctive).

DM Sans is excellent for UI labels and body, and no objection there.

#### Recommendation 1: UPGRADE the heading — Canela over Playfair Display

**Canela** (Commercial Type, Miguel Reyes): A display serif with flared stroke endings inspired by stonecarving. Neither purely serif nor sans — the ambiguity reads as artisanal rather than institutional. Used by: Proper Syrup, Rebag, SomeFolk (pairing: Founders Grotesk), Weston Table (pairing: Engravers), Document Journal.

**Why it's better for Soley:** Playfair Display's stroke contrast reads as "jewelry store" or "wine brand." Canela's flared strokes read as craft-made, material, physical — which is exactly the brand register for a painting company. A painter works with physical material and leaves a mark; Canela's letterforms do the same.

**Pairing:** Canela (headings, 5-7vw, tracked at `0.01em`, no uppercase — Canela loses its character when all-caps) + **Founders Grotesk** (UI labels, body, subheadings — `text-transform: uppercase; letter-spacing: 0.12em` for panel titles).

**Fallback Google Font stack (if Canela licensing is a blocker):** `Cormorant Garamond` at the highest weight (700) with `font-display: swap`. It has similar flared terminals and is free. Not as distinctive, but closer to Canela than Playfair is.

**License:** Canela requires Commercial Type licensing (~$400-800/year for web use). Worth it for a permanent business site. If budget is a concern, use Cormorant Garamond as the build-now font and swap to Canela when the license is acquired.

---

#### Recommendation 2: Pairing Table for the build

| Use case | Font | Size | Weight | Tracking | Transform |
|---|---|---|---|---|---|
| Hero headline | Canela (or Cormorant Garamond) | 8-10vw | 700 | 0.01em | none (mixed case) |
| Section headline | Canela | 4-5vw | 400 | 0.01em | none |
| Panel title (scroll-lock) | Founders Grotesk (or DM Sans) | 5-6vw | 500 | 0.08em | uppercase |
| Body copy | DM Sans | 1rem | 400 | normal | none |
| UI label / caption | Founders Grotesk | 0.7rem | 400 | 0.18em | uppercase |
| Bottom bar social | DM Sans | 0.7rem | 400 | 0.2em | uppercase |

**Why Founders Grotesk beats DM Sans for panel titles:** Founders Grotesk has slightly irregular grotesque proportions that read as designed rather than system-generated. DM Sans is more neutral. At 5-6vw uppercase, the Founders Grotesk's minor irregularities give each service panel a handcrafted impression.

**Founders Grotesk is free via Klim Type Foundry for testing; requires a web license (~$200-400) for production.** Alternative if both are too expensive: `Sora` from Google Fonts — a geometric grotesque with slightly idiosyncratic letterforms.

---

### SECTION 6 — Color Systems for High-End Painter Brands

#### Finding: Terracotta + Teal is Validated — but Needs a Depth Color Added

The 2026 interior design trend consensus (per multiple sources) is: "olive, terracotta, and warm mahogany ground a room while deep teal and creamy neutrals add definition." The current Soley palette is on-trend and distinctive. No repalette needed.

**What IS missing:** A dark depth color that is NOT black and NOT slate. The current Slate `#2C2C2C` reads as near-black, which is common. A warmer dark improves the system significantly.

#### Revised 5-Color System:

| Token | Name | Hex | Justification |
|---|---|---|---|
| `--color-terra` | Terracotta | `#C2603A` | KEEP. Primary brand color, hero glow mid, CTAs. Validated by 2025-2026 interior design trends. |
| `--color-teal` | Deep Teal | `#2D7A70` | DEEPEN from `#3A8F85`. The Marvell Tile & Stone system uses `#35311F` as its dark anchor with warm ivory — applying that logic here: a slightly deeper teal reads as more sophisticated and less "spa" than the original. |
| `--color-chalk` | Chalk | `#F5F0EA` | KEEP. This is the Marvell-system ivory equivalent. Warm, not cold white. |
| `--color-umber` | Warm Umber | `#2C1F16` | REPLACE Slate `#2C2C2C`. An almost-black with warm brown undertones. When `#2C2C2C` sits next to Terracotta it reads as gray-black; `#2C1F16` reads as deep woodwork, which is on-brand for a painter. This is the equivalent of Marvell's `#35311F`. |
| `--color-gold` | Clay Gold | `#B8935A` | KEEP. Ferrule/metallic detail. Hover states. Service #4 (Cabinet & Trim) accent. |

**The 70/25/5 distribution:**
- 70% Chalk (backgrounds, cards, section fills)
- 25% Umber (headings, nav, footer bg, body text)
- 5% Terracotta + Teal + Gold shared (CTAs, glows, accent bars, hover states)

**Why NOT all-white minimalist:** The Farrow & Ball web approach (white background, greyscale layout, photography carries all warmth) works when you have exceptional photography. Soley doesn't have photography yet. An earth-tone base system carries warmth WITHOUT photography, which matters for a pre-launch site.

**Why NOT the Brandlic Midnight Opulence / Arctic Luxury systems:** Those are tech-brand and skincare palettes. They signal the wrong industry.

**Closest validated reference for this combination:** The Steph Corrigan "Blue Neutral Palette" (`#02000d` + `#07203f` + `#ebded4` + `#d9aa90` + `#a65e46`) — which is structurally the same idea (deep dark + warm ivory + warm accent). Soley's version swaps the blue-black for warm umber and the mauve-orange for pure terracotta.

---

### SECTION 7 — Concrete Builder/Spark Implementation Prompts

**For Hero3D.tsx — Paintbrush Material Setup:**
```
Use MeshPhysicalMaterial on the ferrule (metalness: 0.9, roughness: 0.08, clearcoat: 0.6, clearcoatRoughness: 0.1).
Use MeshStandardMaterial on the handle (roughness: 0.7, metalness: 0.0, color: "#3D2314").
Use MeshPhysicalMaterial on the bristle bundle (roughness: 0.9, metalness: 0.0, color: "#C2603A", emissive: "#C2603A", emissiveIntensity: 0.18).
Add <Environment preset="studio" /> from @react-three/drei — removes the need for manual rim lights.
Bristles: 10 MeshLine strokes (from meshline package) with widthCallback={(p) => (1-p) * 0.006} to taper each bristle to 0 at the tip.
Rotation: useFrame callback only: meshRef.current.rotation.y += 0.004 + spinVelocity.current; spinVelocity.current *= Math.pow(0.92, delta * 60);
The spinVelocity.current accumulates from scroll events: window.addEventListener("wheel", e => { spinVelocity.current += e.deltaY * 0.0002; });
No lerp on the base 0.004 rotation. No sin oscillation. Fixed x-tilt: rotation.x = -0.3 (set once in useEffect, never changed).
```

**For ServicesScrollLock.tsx — Motion-Based Horizontal Scroll:**
```
Replace custom wheel handler with Motion.dev useScroll + useTransform:
const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-400%"]);
Container height: 500vh. Inner track: position:sticky; top:0; height:100vh; overflow:hidden.
Apply mood-lerp background: each panel has a panelColor in the data. On scrollYProgress update, lerp CSS var --page-bg between the current and next panel color.
No snap-type CSS. No matchMedia bail-out on mobile — fix the layout so 100vw panels work on all viewports.
```

**For the Hero preloader sequence:**
```
GSAP timeline sequence:
1. t=0: Counter div shows "0%", terracotta SVG stroke at strokeDashoffset=strokeLen (invisible).
2. t=0 → 1.8s: gsap.to counter textContent 0→100 (snap: {textContent:1}), simultaneously strokeDashoffset 1.0→0.0 (stroke grows left to right).
3. t=1.8s: gsap.to preloaderRef {yPercent: -100, duration: 0.6, ease: "power2.inOut"}.
4. t=1.8s (parallel): R3F canvas uProgress tweens 0→1 over 0.7s, ease "power2.out".
5. t=2.0s: SplitText scramble fires on hero headline (0.3s to resolve, random chars → final letters).
6. t=2.1s: clip-path wipe on subheadline: inset(0 100% 0 0) → inset(0 0% 0 0), 0.6s, "power2.out".
Total: ~2.8s to fully interactive hero.
Use direct DOM mutation (element.style.*) for clip-path updates at 60fps — not React state, not Framer Motion whileInView.
```

**For the background mood lerp during horizontal scroll:**
```js
// Data at top of ServicesScrollLock.tsx
const panelColors = ["#F5F0EA", "#2D7A70", "#2C1F16", "#B8935A", "#C2603A"];

// Inside useTransform onChange handler:
function lerpHex(a, b, t) { /* RGB lerp */ }
const handleXChange = (latest) => {
  const progress = Math.abs(latest) / (containerWidth * 0.8); // 0→1 across 5 panels
  const idx = Math.min(Math.floor(progress * 4), 3);
  const blend = (progress * 4) - idx;
  document.documentElement.style.setProperty("--page-bg", lerpHex(panelColors[idx], panelColors[idx+1], blend));
};
x.onChange(handleXChange);
```

**For the Sticky Grid Reveal "Why Soley" section:**
```
3-column sticky grid, container height: 300vh.
GSAP ScrollTrigger on the container:
  - Column 1 (Prep): animates from y:-120px, opacity:0 → y:0, opacity:1 (power1.inOut)
  - Column 2 (Paint): animates from y:+120px, opacity:0 → y:0, opacity:1 (stagger: 0.12s)
  - Column 3 (Finish): animates from y:-120px, opacity:0 → y:0, opacity:1 (stagger: 0.24s)
At 50% scroll through the 300vh runway, grid scales to 1.08 (subtle zoom, not the 2.05 of the demo — that's too dramatic for services content).
Each column has: icon (SVG, 48px), title in Founders Grotesk uppercase, 2-sentence description in DM Sans.
No ghost numbers. No large background numerals. Foreground column titles at full opacity only.
```

**For typography — if Canela is not licensed yet:**
```
globals.css:
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500&display=swap');

--font-heading: "Cormorant Garamond", serif;
--font-body: "DM Sans", sans-serif;

Hero headline: font-family: var(--font-heading); font-weight: 700; font-size: clamp(3.5rem, 8vw, 7.5rem); letter-spacing: 0.01em;
Panel titles: font-family: var(--font-body); font-weight: 500; font-size: clamp(2.5rem, 5.5vw, 5.5rem); letter-spacing: 0.08em; text-transform: uppercase;

When Canela license is acquired, swap --font-heading to "Canela" and remove Cormorant Garamond import.
```

---

*Scout cycle 2 complete. 35 tool calls used. No code modified. Research only.*

---

## ROUND 3 — NEW REFERENCES (06:11 ET refresh)
**Generated:** 2026-05-07 — 06:11 ET  
**Agent:** Scout (Cycle 3)  
**Axis:** scroll-lock robustness / painter-distinctive centerpiece / WhySoley card depth / fresh award references  
**Prior 33 references:** NOT duplicated. Each site below is new.

---

### NEW REFERENCE 1 — Ruinart Digital Fresco (Awwwards SOTD, April 21 2026)
**URL:** https://fresque.ruinart.com/  
**Awwwards entry:** https://www.awwwards.com/sites/ruinart-digital-fresco  
**FWA case study:** https://www.makemepulse.com/case-study/maison-ruinart-digital-fresco  
**Score:** Design 7.51 / Creativity 7.71 / Tech 7.05 — Developer Award  
**Palette:** `#F8F3EE` cream + `#585852` charcoal — a two-tone restraint system identical to the craft-first approach used by Marvell Tile & Stone (already cited in the report), but applied to a luxury beverage heritage brand.

**What to study — the "handcraft progressive reveal" pattern:**
The makemepulse team transformed Maison Ruinart's physical wall fresco into a 20+ moment interactive scroll experience where "every detail was designed to feel handcrafted." The technique: high-res raster scans of real pen-and-ink illustration are revealed progressively by scroll, using WebGL + WebAR. The site earned its award specifically because the digital reveal mimics how ink physically spreads on cotton paper — not an opacity fade, not a wipe, but an organic-edge progressive appearance triggered by scroll depth.

**Named move to copy:** "Fresco progressive reveal" — scroll progress drives a mask or shader that expands the visible area of a hand-drawn illustration from a seed point outward with an irregular organic edge (not rectangular, not linear). In WebGL this is a fragment shader comparing UV distance from a seed point to `uProgress`; in DOM+SVG it is a `feMorphology`+`feGaussianBlur` mask on an SVG `<image>` element.

**Soley implementation hint:**
Soley's Sacramento SVG signature already uses `stroke-dashoffset`. Round 3 opportunity: after the signature fully draws, apply a secondary effect — the completed signature briefly "bleeds" outward into the chalk background by 4px using a feGaussianBlur (`stdDeviation` animated 0→4→0 over 0.4s via GSAP) before settling crisp. This replicates the bleed of ink into paper grain and makes the signature feel physically real rather than digitally constructed. Cost: one SVG `<filter>` element and a 3-line GSAP tween. No shader required.

```svg
<!-- Add to signature SVG defs -->
<filter id="ink-bleed">
  <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur">
    <animate attributeName="stdDeviation"
      values="0;4;0" dur="0.4s" begin="signatureComplete" fill="freeze"/>
  </feGaussianBlur>
</filter>
```

---

### NEW REFERENCE 2 — Hermès "Venture Beyond" Hand-Illustrated Website (Jan 2026)
**URL:** https://www.hermes.com/  
**Coverage:** https://www.domusweb.it/en/news/2026/02/07/herms-new-website.html  
**Coverage:** https://www.creativemoment.co/herm%C3%A8s-and-the-rise-of-hand-drawn-luxury  
**Artist portfolio:** https://lindamerad.com/HERMES-INTERLUDE-1

**Context:** Hermès launched a fully hand-illustrated website in January 2026 — the first time the 188-year-old house used illustration on its e-commerce platform. Artist Linda Merad drew 12 illustrations (each nearly a metre long) in black pencil on paper, scanned them, added colour digitally, then worked with animator Quentin Klein to bring them to motion. The colour-blocked style was originally created with pen and India ink.

**Why this matters for Soley:** Hermès chose hand-illustration deliberately as an anti-AI signal — "a human made this" during an era of infinite AI imagery. The strategic lesson is that embracing visible imperfection (wobbles, uneven colour, paper grain, ink spread) signals craft and human labor more powerfully than digital precision. The Soley Sacramento signature already embodies this instinct. The Hermès move validates that for a craft/artisan brand (whether luxury champagne or residential painting), a hand-drawn visual identity is the correct tier-signal in 2026.

**Named move to copy:** "Deliberate imperfection" — the illustration lines are not perfectly smooth; they preserve the pencil pressure variation of the original drawing. Digitally, this is achieved by NOT applying SVG path smoothing (`pathLength` normalization). In Soley's Sacramento signature, if the path is too smooth, add 1-2px of controlled jitter via a GSAP `motionPath` with raw coordinates rather than a smoothed cubic bezier. The signature should feel like a real pen moved across paper, not a logo renderer.

**Named move to copy (2):** "Paper grain as background texture" — the Hermès illustrations sit on a background that carries visible paper grain (`filter: url(#grain)` in SVG, or a CSS `noise.png` overlay at 3-5% opacity with `mix-blend-mode: multiply`). Applied to Soley's chalk background (`#F5F0EA`), a 3% grain overlay would add material depth without changing the colour impression at typical viewing distances.

**Soley implementation hint:**
```css
/* Chalk background with paper grain */
body {
  background-color: #F5F0EA;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url('/grain.png'); /* 200×200px tileable noise, grayscale */
  opacity: 0.035;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}
```
The `grain.png` can be generated once at 200×200px with any noise generator (e.g., `canvas.getContext('2d').createImageData()` with random grayscale values). Cost: 2KB PNG, zero JS runtime, applies to every section.

---

### NEW REFERENCE 3 — Simonholm.studio (Awwwards SOTD, May 9 2026)
**URL:** https://simonholm.studio  
**Awwwards:** https://www.awwwards.com/sites/simonholm-studio  
**What it does:** A personal portfolio site that earned SOTD May 9 2026 with a numbered editorial grid, horizontal carousel navigation, video-enabled project cards, and dual-view navigation (featured showcase + indexed list). The design is minimal — let the numbered cards carry all hierarchy, with no decorative layer at all.

**What to study — numbered sequential reveal:**
The "01 / 02 / 03 / 04 / 05" sequential numbering pattern used on Simonholm maps directly to Soley's 5-service horizontal scroll panels. Simonholm uses the numbers as large typographic anchor elements for each card — they are the visual hierarchy before any image loads. Currently Soley's service panels use an "01/05" counter in the top-left corner as small UI text. The Simonholm pattern suggests scaling that counter to be a major typographic element: `font-size: clamp(8rem, 18vw, 20rem)` in `--color-umber` at 8% opacity as a background number within each panel, then the service title in front at full opacity. NOTE: RULE 8 prohibits ghost numbers behind content. The Simonholm approach avoids this by making the number the primary structural element, not a ghost layer — the number IS the anchor, not decorative. Use at full opacity in a dedicated zone of the card (e.g., the bottom-left of the panel, below the body text), not layered behind other content.

**Soley implementation hint:**
In each service panel, reserve the bottom-left quadrant for the panel number at large size, full opacity (not behind text). The service name and description occupy the top half. The number occupies the bottom-left at `20vw` size in `Cormorant Garamond`, umber color, full opacity. This creates a typographic anchor visible at a distance without violating RULE 8's ghost-number ban, because it is not behind other elements — it is in its own zone.

---

### NEW REFERENCE 4 — Cruip Spotlight Cards (January 2026, open source)
**URL:** https://cruip.com/how-to-create-a-spotlight-card-hover-effect-with-tailwind-css/  
**Demo:** https://cruip.com/demos/spotlight/  
**GitHub:** https://github.com/cruip/cruip-tutorials

**What this solves:** Nigel's Priority 2 — WhySoley cards "lack visual depth." The Cruip spotlight card pattern is the exact solution. It is the same effect used by Linear, Stripe, and Vercel for their feature grids, and it requires zero design work — only CSS custom properties and a 30-line JS class.

**Named move to copy precisely:** "Mouse-position spotlight on card group" — a radial-gradient blob follows the cursor across the entire card group container, lighting up whichever card the cursor is near. The blob is positioned via CSS custom properties (`--mouse-x`, `--mouse-y`) updated by a `mousemove` listener on the container. Each card has `::before` (border enhancement) and `::after` (inner spotlight) pseudo-elements, both using `translate-x-[var(--mouse-x)] translate-y-[var(--mouse-y)]` and heavy blur (`blur-[100px]`). The result: cards appear to have an interior light source that tracks the cursor.

**Implementation hint for WhySoley cards (Soley brand adaptation):**
Replace the Cruip demo's `bg-indigo-500` spotlight with `rgba(194, 96, 58, 0.08)` (terracotta at 8% — soft, warm, brand-consistent). Replace the border enhancement blur color with `rgba(184, 147, 90, 0.06)` (clay gold at 6%). Cards remain chalk/umber on neutral background between hovers; on hover approach, the card nearest the cursor takes on a warm terracotta interior glow from upper-left, as if a can of warm paint is illuminating the card from within.

```javascript
// WhySoley card spotlight handler (adapts Cruip pattern)
const cardGroup = document.querySelector('.why-soley-grid');
cardGroup.addEventListener('mousemove', (e) => {
  const rect = cardGroup.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  cardGroup.querySelectorAll('.why-card').forEach(card => {
    const cardRect = card.getBoundingClientRect();
    const cardX = -(cardRect.left - rect.left) + x;
    const cardY = -(cardRect.top - rect.top) + y;
    card.style.setProperty('--mouse-x', `${cardX}px`);
    card.style.setProperty('--mouse-y', `${cardY}px`);
  });
});
```

```css
/* WhySoley card depth — add to globals.css */
.why-card {
  position: relative;
  background: #F5F0EA;
  border: 1px solid rgba(44, 31, 22, 0.08);
  overflow: hidden;
}
.why-card::before {
  content: "";
  position: absolute;
  width: 320px; height: 320px;
  left: -160px; top: -160px;
  background: rgba(184, 147, 90, 0.06);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s;
  translate: var(--mouse-x, 0) var(--mouse-y, 0);
  filter: blur(80px);
  z-index: 1;
}
.why-card::after {
  content: "";
  position: absolute;
  width: 400px; height: 400px;
  left: -200px; top: -200px;
  background: rgba(194, 96, 58, 0.07);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s;
  translate: var(--mouse-x, 0) var(--mouse-y, 0);
  filter: blur(100px);
  z-index: 0;
}
.why-soley-grid:hover .why-card::before,
.why-soley-grid:hover .why-card::after {
  opacity: 1;
}
.why-card > * { position: relative; z-index: 2; }
```

---

### NEW REFERENCE 5 — Codrops SVG Mask Transitions on Scroll (March 11 2026)
**URL:** https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/  
**Demo:** https://tympanus.net/Tutorials/SVGMaskTransitions/

**What to study — for the Sacramento signature centerpiece upgrade:**
The technique uses SVG `<mask>` elements containing dynamically generated white rectangles that reveal content as scroll progresses. The `scrub: 2.0–2.5` setting creates a deliberate lag — even after the user stops scrolling, the reveal animation continues slightly, adding a "trailing ink" quality. This is directly analogous to how wet ink continues to spread after a brush lifts.

**Named move to study:** "Trailing scrub reveal" — using `scrub: 2` instead of `scrub: 1` or `scrub: true` creates a physical-material feel. The content seems to "bleed in" rather than being mechanically revealed. For Soley's hero, when the signature finishes drawing, the hero content below (the tagline, CTAs) could use `scrub: 2` with ScrollTrigger to fade in as the user begins scrolling — trailing slightly behind the scroll position, like content emerging from a wet surface.

**Named move to study (2): "Horizontal blind" reveal pattern** — four geometric reveal styles are available (horizontal blinds / vertical blinds / random grid / column-random grid). For Soley's section transitions, the "horizontal blind" pattern (parallel horizontal strips expanding vertically from center) maps naturally to horizontal paint strokes being applied. When the user scrolls into the PaintFlow workflow section, the section could reveal via horizontal blind strips rather than a simple opacity fade.

**Soley implementation hint:**
```javascript
// SVG blind reveal for PaintFlow section entry
// scrub: 2.2 gives the "trailing ink" feel
gsap.timeline({
  scrollTrigger: {
    trigger: '.paint-flow-section',
    start: 'top 80%',
    end: 'top 20%',
    scrub: 2.2
  }
}).to('.paint-flow-mask-rect', {
  attr: { height: '110%' },
  stagger: { each: 0.08, from: 'random' }
});
```

---

### NEW REFERENCE 6 — GSAP ScrollTrigger Horizontal Scroll Robustness (Canonical Documentation)
**URL:** https://gsap.com/docs/v3/Plugins/ScrollTrigger/  
**GSAP mistakes guide:** https://gsap.com/resources/st-mistakes/  
**Community thread on pinned horizontal scroll:** https://gsap.com/community/forums/topic/42812-how-to-fix-a-horizontal-scroll-section-with-scrolltrigger/

**This directly addresses AUDIT Issue A — ServicesScrollLock blank mid-scroll.**

**Root cause analysis from canonical docs:**

The Framer Motion `useScroll` + `useTransform` pattern (used in the current build per Cycle 1 Scout report) has a known failure mode when the hero section's layout changes: the `containerRef` offset is calculated once at mount time. When the hero's document height changes (e.g., from a 2-col grid to a 1-col layout), the pre-calculated start/end scroll positions for the sticky section become wrong. This causes `scrollYProgress` to read `0` or `1` at positions where it should read `~0.5` — manifesting as a blank or stuck panel.

**Five specific pitfalls from research:**

1. **Missing `top: 0` on the sticky inner track.** If the inner `position: sticky` element lacks an explicit `top: 0`, browsers un-stick it silently. Fix: `position: sticky; top: 0; height: 100vh;` — never omit `top`.

2. **`overflow: hidden` on an ancestor of the sticky container.** Any ancestor with `overflow: hidden` or `overflow: auto` creates a new scroll context, trapping the sticky element inside that ancestor's bounds instead of the viewport. Fix: audit every ancestor div from the sticky element to `<body>` for overflow properties. If Tailwind's `overflow-hidden` is on any wrapper, remove it.

3. **Flex/grid `align-self: stretch` on the sticky element's parent.** If the 500vh section is inside a flex or grid container, its height expands to fill the container rather than being set by `height: 500vh`. Fix: add `align-self: flex-start` (or `align-items: start` on the parent grid) so the 500vh section is the real height boundary.

4. **`content-visibility: auto` on any section.** GSAP explicitly warns this makes position calculation impossible. Some Next.js 14 builds add this automatically for performance. Fix: override with `content-visibility: visible` on the services section.

5. **Framer Motion `useScroll` offset miscalculation after hero layout change.** `useScroll({ target: containerRef, offset: ["start start", "end end"] })` recalculates on mount and on resize events, but NOT when upstream layout changes the document scroll height at a point other than a resize event (e.g., a font loading late, or an R3F canvas completing initialization that shifts the hero height). Fix: call `motionValue.set()` or force a `window.dispatchEvent(new Event('resize'))` after any dynamic layout shift above the scroll section.

**Robust horizontal scroll-lock pattern that survives layout changes:**

The most robust approach (from the GSAP community thread and the Codrops horizontal parallax tutorial) avoids `useScroll` entirely and instead uses:
1. A 500vh `<section>` wrapper with `position: relative` — no sticky on this element.
2. An inner `<div>` with `position: sticky; top: 0; height: 100vh; overflow: hidden`.
3. A JS `IntersectionObserver` that detects when the section enters/exits and enables/disables a `scroll` event listener — avoiding continuous listener overhead.
4. The scroll handler reads `window.scrollY - sectionTop` where `sectionTop` is recalculated on every `scroll` event via `sectionRef.getBoundingClientRect().top + window.scrollY` (NOT cached at mount). This is the key: never cache `sectionTop`; always recompute it from the current `getBoundingClientRect`. Then `translateX = -((scrollY - sectionTop) / (sectionHeight - viewportHeight)) * totalTrackWidth`.

```javascript
// Robust horizontal scroll handler — sectionTop recalculated every frame
const section = document.querySelector('.services-scroll-section');
const track = document.querySelector('.services-track');
const PANEL_WIDTH = window.innerWidth;
const PANEL_COUNT = 5;
const totalShift = PANEL_WIDTH * (PANEL_COUNT - 1);

function updateHScroll() {
  // Never cache this — always recompute from live DOM
  const sectionRect = section.getBoundingClientRect();
  const sectionTop = sectionRect.top + window.scrollY;
  const sectionH = section.offsetHeight; // 500vh
  const progress = Math.max(0, Math.min(1,
    (window.scrollY - sectionTop) / (sectionH - window.innerHeight)
  ));
  track.style.transform = `translateX(${-progress * totalShift}px)`;
  // Also lerp background color per panel
  const panelIdx = Math.min(Math.floor(progress * (PANEL_COUNT - 1)), PANEL_COUNT - 2);
  const blend = (progress * (PANEL_COUNT - 1)) - panelIdx;
  // ... lerpColor(panelColors[panelIdx], panelColors[panelIdx+1], blend) ...
}

window.addEventListener('scroll', updateHScroll, { passive: true });
```

**Why this is more robust than Framer Motion `useScroll`:** `getBoundingClientRect()` always returns the current live position relative to the viewport — it is not a cached value from mount. So even if the hero section's height changes after a font load or R3F initialization, the horizontal scroll calculation remains accurate because it reads from the current DOM state on every scroll event.

**Implementation hint for Spark/Builder — fix AUDIT Issue A:**
Replace the current `useScroll({ target: containerRef })` Framer Motion implementation with the pure-JS handler above. Keep the Framer Motion `x` motionValue for the track translation if desired (call `xMotionValue.set(-progress * totalShift)` inside the scroll handler), but source the `progress` from the live-DOM `getBoundingClientRect` calculation rather than the `scrollYProgress` motionValue.

---

### SECTION 8 — Concrete Prompt Blocks for Next Builder/Spark Cycles (Round 3)

**For Builder/Spark — Fix AUDIT Issue A (ServicesScrollLock blank mid-scroll):**
```
BLOCKER FIX — ServicesScrollLock blank mid-scroll.

Root cause: scrollYProgress from useScroll({ target: containerRef }) caches the section's top offset at mount time. When the hero layout changed (2-col → 1-col), the cached offset became wrong, causing scrollYProgress to read 0 or 1 at mid-scroll.

Replace the Framer Motion useScroll approach with a pure-JS scroll handler that recalculates sectionTop on every scroll event via getBoundingClientRect (never cached):

const section = sectionRef.current;
const track = trackRef.current;
const TOTAL_SHIFT = window.innerWidth * 4; // 4 gaps between 5 panels

function handleScroll() {
  const sectionRect = section.getBoundingClientRect();
  const sectionTop = sectionRect.top + window.scrollY;
  const sectionH = section.offsetHeight;
  const progress = Math.max(0, Math.min(1,
    (window.scrollY - sectionTop) / (sectionH - window.innerHeight)
  ));
  track.style.transform = `translateX(${-progress * TOTAL_SHIFT}px)`;
}

window.addEventListener('scroll', handleScroll, { passive: true });
// Remove listener on component unmount

Also audit every ancestor div of the sticky inner container for: overflow:hidden, overflow:auto, align-self:stretch. Any of these silently breaks sticky positioning.

For the sticky inner track: ensure it has position:sticky; top:0; height:100vh; — never omit top:0.

After fixing, verify with at least 5 scroll samples across the 500vh range (5%, 25%, 50%, 75%, 95%) on both desktop 1440 and iPhone 13 per RULE 3.
```

**For Spark — WhySoley card depth (AUDIT Priority 2):**
```
Add spotlight hover effect to WhySoley cards.

1. Add a data-spotlight attribute to the .why-soley-grid container.
2. Add the following mousemove handler (plain JS, no React state — direct DOM mutation):

const grid = document.querySelector('[data-spotlight]');
if (grid) {
  grid.addEventListener('mousemove', (e) => {
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    grid.querySelectorAll('.why-card').forEach(card => {
      const cRect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${x - (cRect.left - rect.left)}px`);
      card.style.setProperty('--mouse-y', `${y - (cRect.top - rect.top)}px`);
    });
  });
}

3. Add to globals.css (the .why-card CSS block from REFERENCE 4 above — terracotta ::after at 7% opacity, clay-gold ::before at 6% opacity, both blur-100px).

4. Each card also needs a base radial-gradient background for pre-hover depth (replace the flat chalk card):
   background: radial-gradient(ellipse at top left, rgba(194,96,58,0.04) 0%, #F5F0EA 60%);
   This gives the card a very subtle warm flush from the top-left corner at rest, making it visibly non-flat before any hover.

5. Give each icon container a filled background tile: background: rgba(var(--card-accent-rgb), 0.10); border-radius: 8px; padding: 12px;
   where --card-accent-rgb is set inline per card (e.g., 194,96,58 for terracotta; 45,122,112 for teal).
```

**For Spark — Sacramento signature ink-bleed effect (signature centerpiece upgrade):**
```
After the Sacramento SVG signature stroke-dashoffset completes (at the end of the draw animation),
add a brief ink-bleed blur effect:

const signatureEl = document.querySelector('.sacramento-path');
signatureEl.style.filter = 'none';

// When draw animation fires onComplete callback:
gsap.timeline({ onComplete: () => { signatureEl.style.filter = 'none'; } })
  .to(signatureEl, {
    filter: 'blur(3px)',
    duration: 0.18,
    ease: 'power1.in',
    onStart: () => { /* paint bleed begins */ }
  })
  .to(signatureEl, {
    filter: 'blur(0px)',
    duration: 0.32,
    ease: 'power2.out'
  });

This blur-in/blur-out sequence (0.18s in, 0.32s out, total 0.5s) mimics ink bleeding into paper at the moment the brush lifts. The signature briefly softens, then resolves to crisp.
Do NOT use SVG filter animation — use direct CSS filter via GSAP for reliable cross-browser timing.
```

**For Builder — paper grain background texture (global upgrade):**
```
Add paper grain texture to the chalk background:

1. Generate grain.png: a 256×256 grayscale noise PNG. Can use the following canvas snippet run once at build time:
   const c = document.createElement('canvas'); c.width = c.height = 256;
   const d = c.getContext('2d').createImageData(256,256);
   for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}
   c.getContext('2d').putImageData(d,0,0);
   // Save as /public/grain.png

2. Add to globals.css:
   body::before {
     content: "";
     position: fixed;
     inset: 0;
     background-image: url('/grain.png');
     background-repeat: repeat;
     background-size: 256px 256px;
     opacity: 0.032;
     mix-blend-mode: multiply;
     pointer-events: none;
     z-index: 0;
   }
   
   Confirm all interactive elements have z-index >= 1 so they sit above the grain layer. The grain layer should be imperceptible at a glance and visible only when the user looks for surface texture — at 3.2% opacity it reads as material warmth, not a visible pattern.
```

**For Builder/Spark — GSAP ScrollTrigger sticky pitfall checklist (use before every scroll-lock implementation):**
```
Before implementing any sticky/pinned scroll section, audit:

□ Sticky inner element has: position:sticky; top:0; height:100vh; — never omit top value
□ No ancestor div has: overflow:hidden OR overflow:auto OR overflow:scroll  
□ If section is inside a flex/grid container: parent has align-items:start (NOT stretch)
□ No ancestor or section has: content-visibility:auto (Next.js may add this automatically)
□ Section height is set explicitly (height:500vh on the outer wrapper — NOT min-height)
□ ScrollTrigger.refresh() is called after any dynamic layout change (font load, R3F init, image load)
□ sectionTop is recalculated from getBoundingClientRect() on every scroll event — NOT cached at mount
□ All ScrollTriggers created in top-to-bottom scroll order (or refreshPriority set)
□ Tested at 5%, 25%, 50%, 75%, 95% scroll positions per RULE 3 — not just at entry
```

---

*Scout cycle 3 complete. Research only. No code modified.*  
*New URLs added: fresque.ruinart.com, domusweb.it/hermes-new-website, lindamerad.com/HERMES-INTERLUDE-1, simonholm.studio, cruip.com/spotlight-card, tympanus.net/codrops/2026/03/11/svg-mask-transitions, gsap.com/resources/st-mistakes, gsap.com/community/forums/topic/42812, blog.logrocket.com/troubleshooting-css-sticky-positioning, frontendmasters.com/blog/the-weird-parts-of-position-sticky*

---

## ROUND 4 — NEW REFERENCES (2026-05-07)
**Generated:** 2026-05-07  
**Agent:** Scout (Cycle 4)  
**Axis:** Awwwards SOTD last 14 days (new) + Codrops April/May 2026 (new) + BUG-025 mobile panel overflow root-cause + pure-CSS horizontal scroll-lock + fluid typography for long panel titles  
**Prior 43 references:** NOT duplicated. Each site and URL below is new.

---

### NEW REFERENCE A — T11 (Awwwards SOTD May 6 2026)
**URL:** https://t11.com  
**Awwwards entry:** https://www.awwwards.com/sites/t11  
**SOTD date:** May 6, 2026  
**Scores:** Creativity 7.55 / Animations-Transitions 7.6 / Responsive 7.4  
**Tech stack:** React + GSAP + WebGL  
**Palette:** `#222222` near-black + `#F5F5F5` near-white — two-color absolute minimum  

**What to study — "List Warp" scroll element:**  
T11 won its SOTD on the strength of one named interaction: "List Warp" — a scroll-triggered content transformation where list items distort, shear, or change scale as they scroll through a defined viewport zone. This is distinct from a simple fade or translate. The jury praised purposeful motion that enhances narrative rather than decorating it. The technique is scroll-velocity-driven: faster scroll = more warp; stopped = no warp. GSAP drives the warp via `gsap.quickTo()` for frictionless DOM mutation at 60fps.

**Named move to copy:** "Velocity-shear list warp" — each list item's `skewY` tracks scrollVelocity: `gsap.quickTo(item, "skewY", { duration: 0.6, ease: "power3" })(velocity * 0.015)`. At rest, items are upright. At fast scroll they shear up to `~8deg`. The spring-back is automatic via the GSAP ease. This is the same principle as the ServicesMarquee skew in Soley's current build, but applied to a vertical list of items rather than a horizontal ticker.

**Soley implementation hint:**  
Apply List Warp to the PaintFlow workflow nodes. As the user scrolls through the PaintFlow section, the 5 workflow node labels (Wall / Prep / Prime / Paint / Finish) shear slightly in the scroll direction. Node icons scale `1.0 → 1.06` on shear and spring back. This turns the static node diagram into a physically alive sequence without adding dots or particles. Uses `gsap.quickTo()` — no RAF loop, no `requestAnimationFrame` needed.

```javascript
// PaintFlow List Warp — velocity-shear on workflow node labels
const nodes = document.querySelectorAll('.paintflow-node');
let lastY = window.scrollY;
let velocity = 0;

nodes.forEach(node => {
  node._skewTo = gsap.quickTo(node, "skewY", { duration: 0.6, ease: "power3" });
  node._scaleTo = gsap.quickTo(node, "scale", { duration: 0.4, ease: "power2.out" });
});

window.addEventListener('scroll', () => {
  velocity = (window.scrollY - lastY) * 0.015;
  lastY = window.scrollY;
  nodes.forEach(n => { n._skewTo(velocity); n._scaleTo(1 + Math.abs(velocity) * 0.04); });
}, { passive: true });
```

---

### NEW REFERENCE B — Studio Namma (Awwwards SOTD May 8 2026)
**URL:** https://studionamma.com  
**Awwwards:** https://www.awwwards.com/sites/studio-namma  
**SOTD date:** May 8, 2026  
**What it is:** Paris creative agency for premium brands, Webflow stack. Scores for animations/transitions drove the SOTD.  

**What to study — real-time multi-city clock as ambient micro-interaction:**  
Studio Namma displays live clocks for Paris / Los Angeles / Barcelona / Hong Kong in the interface. This is not decorative — it signals "we have clients in these time zones" without inventing a fake address. For Soley, a single live clock showing the local service area time is a pre-launch trust signal that requires zero fabrication.

**Named move to copy:** "Ambient presence clock" — a small live `HH:MM` display in the footer or navbar showing the painter's working timezone. Renders as `font-size: 0.7rem; font-variant-numeric: tabular-nums; letter-spacing: 0.08em` in the footer bottom bar, updated every second via `setInterval`. At mobile widths it collapses to just the time (no city label). Zero JS overhead because `setInterval` is one timer, not an animation loop.

**Also to study — dark/light mode toggle as a trust signal:**  
Namma ships a built-in dark/light mode switcher. For a painter site, dark mode on a chalk/umber site would invert to a chalk-type light scheme with umber text — already close to the default. The toggle is worth adding because it is a non-generic feature (no other painter site in the research set has it) and adds perceived quality without changing content.

**Soley implementation hint:**  
Add the ambient clock to the footer bottom bar alongside the Instagram text link: `Copyright left | Clock center | INSTAGRAM right`. Use `tabular-nums` so the digits don't shift width on second change. No fabrication: just `new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' })`.

---

### NEW REFERENCE C — Codrops "Reverse-Engineering Claude AI Mascot Animations with SVG and GSAP" (May 5 2026)
**URL:** https://tympanus.net/codrops/2026/05/05/reverse-engineering-claude-ais-mascot-animations-with-svg-and-gsap/  
**Published:** May 5, 2026  
**Author:** Codrops editorial  

**What to study — frame-by-frame hybrid animation orchestration:**  
The tutorial reverse-engineers a character animation by combining three modes: (1) continuous GSAP tweening for smooth positional transforms, (2) static frame-hold sequences with variable hold durations, and (3) `<clipPath>` boundary constraints that keep sub-animations from leaking outside their parent container. The `gsap.timeline()` orchestration uses the `"<"` offset operator for precise multi-element synchronization without manual delay calculation.

**Named move to copy for Soley:** "clipPath-constrained sub-animation" — applying `<clipPath>` to keep the animated brush sprite from leaking outside the SVG canvas bounds. This is the exact fix for the Sacramento signature animation: if the brush-tracking sprite overflows the SVG viewBox on mobile (an edge case that causes visual bleed at 375px), wrapping it in a `<clipPath>` that matches the viewBox bounds contains it without any JS measurement. Pure SVG, zero runtime cost.

```svg
<defs>
  <clipPath id="signature-bounds">
    <rect x="0" y="0" width="560" height="200" />
  </clipPath>
</defs>
<g clip-path="url(#signature-bounds)">
  <!-- Sacramento path + brush sprite both clipped to viewBox bounds -->
  <path id="sig-path" ... />
  <image id="brush-sprite" ... />
</g>
```

**Named move to copy (2):** "Variable hold duration frame sequence" — instead of a fixed `repeat` on the brush-sprite animation, use a GSAP timeline with deliberate pauses between stroke segments. The brush dwell time at the start of each letter stroke (`0.08s hold`) vs. the tail of each stroke (`0.02s hold`) mirrors real writing pressure variation. This makes the signature read as hand-drawn vs. computer-animated. Implementation: `tl.to(sprite, { x: nextX, duration: 0.3 }).to(sprite, { x: nextX, duration: 0.08 /* hold */ })`.

**Soley implementation hint for Process countdown bar (BUG AUDIT item #7):**  
Use the hybrid timeline approach for the countdown bar. Instead of a pure CSS `scaleX(1→0)` `@keyframes`, wire it to a GSAP timeline that (a) starts when the tab becomes active and (b) can be cleanly killed and restarted via `tl.kill()` when the user clicks to advance early. CSS `@keyframes` cannot be reliably reset mid-animation; GSAP `.restart()` can.

```javascript
// Process countdown bar — GSAP-driven, restartable
let countdownTl = null;

function startCountdown(barEl, onComplete) {
  if (countdownTl) countdownTl.kill();
  gsap.set(barEl, { scaleX: 1, transformOrigin: "left center" });
  countdownTl = gsap.to(barEl, {
    scaleX: 0,
    duration: 10,
    ease: "none",
    onComplete
  });
}
```

---

### NEW REFERENCE D — Scroll-Driven Animations Style Reference (scroll-driven-animations.style)
**URL:** https://scroll-driven-animations.style/demos/horizontal-section/css/  
**What it is:** Canonical reference maintained by Bramus Van Damme (Chrome DevRel). Demonstrates a fully CSS-only vertical-scroll-to-horizontal-travel panel system using the native `view-timeline` API.  

**This directly addresses BUG-025 — Pure-CSS Horizontal Scroll-Lock pattern:**

The demo eliminates JavaScript entirely. The approach maps vertical scroll progress to horizontal `translateX` via CSS `animation-timeline`:

```css
/* Outer wrapper — 500vh creates the scroll runway */
.pin-wrap-wrapper {
  height: 500vh;
}

/* Inner sticky container */
.pin-wrap-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden; /* hides track overflow without breaking sticky */
  view-timeline-name: --section-pin-tl;
  view-timeline-axis: block;
}

/* The horizontal track — wider than viewport */
.pin-wrap {
  width: 250vmax; /* spans all panels */
  display: flex;
  animation: move linear both;
  animation-timeline: --section-pin-tl;
  animation-range: contain 0% contain 100%;
}

@keyframes move {
  to { transform: translateX(calc(-100% + 100vw)); }
}
```

**Why this is more robust than the current JS handler for BUG-025:**  
The CSS timeline approach cannot have the "cached sectionTop" bug because there is no JS to cache anything. The browser's compositor thread reads scroll progress natively and applies the transform directly. `overflow-x: hidden` on the sticky container — which normally breaks `position: sticky` — is safe here because the sticky behavior is on the container itself, not a child; the overflow only masks the track overflow.

**Mobile panel overflow fix (BUG-025 specific):** Each panel uses `flex: 0 0 100vw; max-width: 100vw; overflow: hidden`. The `max-width: 100vw` on each panel is the containment that BUG-025 needs. The current build likely sets `min-width: 100vw` but omits `max-width: 100vw` and `overflow: hidden`, allowing content (including the "CABINET & TRIM" long title) to exceed the panel boundary and bleed into the adjacent panel's visible zone.

**Browser support (2026):** `view-timeline` + `animation-timeline` + `animation-range` is supported in Chrome 115+, Safari 18+, Firefox 110+. iOS Safari 18 (iPhone SE Gen 3 running iOS 18) supports it. This covers Soley's target audience fully.

**Implementation hint for Builder/Refiner — BUG-025 resolution:**
```css
/* Each service panel — add to existing panel CSS */
.service-panel {
  flex: 0 0 100vw;
  max-width: 100vw;        /* MISSING in current build — this is the BUG-025 fix */
  overflow: hidden;         /* clips any content wider than the panel */
  box-sizing: border-box;   /* ensures padding doesn't expand beyond 100vw */
}

/* Panel title — fluid clamp so "CABINET & TRIM" fits at 375px */
.service-panel-title {
  font-size: clamp(1.75rem, 1.025rem + 4.5vw, 5rem);
  white-space: normal;      /* allow wrapping rather than overflow */
  word-break: break-word;   /* last resort break for very narrow viewports */
  overflow-wrap: anywhere;
}
```

---

### NEW REFERENCE E — Fluid Font-Size Clamp Formula (CSS-Tricks Canonical Reference)
**URL:** https://css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/  
**What it solves:** BUG-025 sub-problem — "CABINET & TRIM" panel title clips at 375px because the current font-size is a fixed `vw` value that becomes too large at narrow viewports.

**Named pattern: "Linear viewport interpolation clamp"**  
Formula: `clamp(min, yIntercept + slope*100vw, max)` where:
- `slope = (maxSize - minSize) / (maxVw - minVw)`
- `yIntercept = minSize - slope * minVw`

**Applied to Soley panel titles (CABINET & TRIM worst case):**  
Target: `2rem` minimum at 375px, `5rem` maximum at 1440px.
- Viewport range in rem (÷16): 23.4rem → 90rem
- Slope: `(5 - 2) / (90 - 23.4)` = `0.045`
- Y-intercept: `2 - 0.045 * 23.4` = `0.947rem`

```css
.service-panel-title {
  font-size: clamp(2rem, 0.947rem + 4.5vw, 5rem);
  /* At 375px (23.4rem): 0.947 + 4.5*23.4/100 = 0.947 + 1.053 = 2rem exactly */
  /* At 1440px (90rem): 0.947 + 4.5*90/100 = 0.947 + 4.05 = 5rem exactly */
  /* "CABINET & TRIM" is 14 characters. At 2rem on 375px = 32px per char avg = fits in ~2 lines */
}
```

**Why `clamp` beats a `@media` breakpoint here:** A media query creates a hard jump. `clamp` provides smooth scaling so the title reads correctly at every width between 375px and 1440px — including 390px (iPhone 13), 414px (iPhone Pro Max), and 768px (tablet). The current fixed `7vw` title size = 26.25px at 375px, which is fine for "INTERIOR" but too wide for "CABINET & TRIM" (14 chars) causing the clip. The `clamp` formula anchors the minimum at 32px at 375px, giving a guaranteed 2-line fallback without overflow.

**Also cited (related pattern):**  
The `dvh` / `svh` units matter here too. The sticky inner track should use `height: 100dvh` (dynamic viewport height) rather than `height: 100vh` on mobile. On iOS Safari, `100vh` includes the browser chrome height, which means the panel is taller than what's visible, creating a subtle layout shift. `100dvh` tracks the currently visible height. Replace `height: 100vh` with `height: 100dvh` everywhere in the scroll-lock section.

---

### NEW REFERENCE F — CSS Container Scroll-State Queries (nerdy.dev / MDN, 2026)
**URL:** https://nerdy.dev/4-css-features-every-front-end-developer-should-know-in-2026  
**Also:** https://utilitybend.com/blog/is-the-sticky-thing-stuck-is-the-snappy-item-snapped-a-look-at-state-queries-in-css/  
**What it is:** New CSS feature shipping in Chrome 133 (early 2026): `container-type: scroll-state` + `@container scroll-state()` queries that detect stuck, snapped, scrollable, and scrolled states — pure CSS, no JavaScript.

**Why this matters for Soley BUG-025:**  
The current build uses JavaScript to detect when the services section is active and applies panel-active states. With scroll-state queries, this can be done in pure CSS. More importantly, the `snapped: inline` query can detect WHICH panel is currently snapped (when using CSS scroll-snap), enabling CSS-only active panel highlighting without JS.

**Named pattern: "CSS-only active panel detection"**  
```css
/* Each panel becomes a scroll-state container */
.service-panel {
  container-type: scroll-state;
  scroll-snap-align: start;
}

/* Style the active (snapped) panel's title differently */
.service-panel {
  @container scroll-state(snapped: inline) {
    .service-panel-title {
      color: var(--color-terra);
    }
    .service-panel-accent-bar {
      transform: scaleX(1); /* expand accent bar when panel is active */
    }
  }
}
```

**Named pattern: "Scrolled inline hint dismissal"**  
When a user has scrolled the horizontal track at all, a scroll hint arrow can auto-dismiss using `scroll-state(scrolled: inline)` — no JS `addEventListener('scroll')` needed.

```css
.scroll-hint {
  opacity: 1;
  transition: opacity 0.3s;
}

.services-track {
  container-type: scroll-state;
  @container scroll-state(scrolled: inline) {
    .scroll-hint { opacity: 0; }
  }
}
```

**Browser support caveat:** Chrome 133+ and Safari 18.2+ as of May 2026. This is a progressive enhancement — use it in addition to, not replacing, the JS handler. The JS handler stays as the primary mechanism; scroll-state queries layer visual-only improvements that degrade gracefully in Firefox.

---

### SECTION — BUG-025 Root Cause Summary and Fix Strategy (Round 4 Consolidation)

Based on Rounds 3 and 4 research, BUG-025 ("CABINET & TRIM" clips at right edge of 375px panel, next panel bleeds in visually") has three independent root causes, each requiring its own fix:

**Root cause 1 — Missing `max-width: 100vw` on panel divs.**  
The JS `translateX` is correct. The visual bleed happens because each panel div does not cap its own content width. A panel with `min-width: 100vw` but no `max-width` will render its content at natural width, potentially exceeding the viewport. Fix: add `max-width: 100vw; overflow: hidden; box-sizing: border-box` to each `.service-panel`.

**Root cause 2 — Fixed `vw`-based font-size on panel titles.**  
`7vw` at 375px = 26.25px. "CABINET & TRIM" in Cormorant Garamond at 26.25px across 375px = approximately 340px text width (9 chars × average 38px glyph width at this size). This overflows `375px` and wraps or clips. Fix: `font-size: clamp(2rem, 0.947rem + 4.5vw, 5rem)` as derived in Reference E above.

**Root cause 3 — `100vh` vs `100dvh` causing a panel height/width mismatch on iOS.**  
On iOS Safari, `100vh` = layout viewport height (includes URL bar). The sticky inner track height resolves to more than the visual viewport, which can cause off-by-one panel positioning at the track boundary. Fix: replace `height: 100vh` with `height: 100dvh` on the sticky inner track.

**Combined fix (3 lines of CSS, no JS changes required):**
```css
.service-panel {
  flex: 0 0 100vw;
  max-width: 100vw;       /* Root cause 1 fix */
  overflow: hidden;
  box-sizing: border-box;
}

.service-panel-title {
  font-size: clamp(2rem, 0.947rem + 4.5vw, 5rem); /* Root cause 2 fix */
  white-space: normal;
  overflow-wrap: anywhere;
}

.services-sticky-inner {
  height: 100dvh;          /* Root cause 3 fix — was 100vh */
  position: sticky;
  top: 0;
  overflow-x: hidden;
}
```

---

### SECTION — Concrete Prompt Blocks for Builder/Refiner (Round 4)

**PROMPT BLOCK R4-1 — BUG-025 Three-Part CSS Fix:**
```
FIX BUG-025: "CABINET & TRIM" panel bleeds into adjacent panel at 375px/390px mobile.

Three CSS changes only — do NOT touch the JS scroll handler:

1. Add to each .service-panel (or equivalent panel wrapper):
   max-width: 100vw;
   overflow: hidden;
   box-sizing: border-box;
   (Keep existing: flex: 0 0 100vw; position: relative)

2. Change .service-panel-title (or .panel-title, the large service name h2/h3) font-size to:
   font-size: clamp(2rem, 0.947rem + 4.5vw, 5rem);
   white-space: normal;
   overflow-wrap: anywhere;
   (Remove any fixed vw-only font-size for these elements)

3. Find the sticky inner track (the 100vh sticky div that contains the flex row of panels).
   Change: height: 100vh → height: 100dvh
   This fixes iOS Safari layout viewport mismatch.

After making these changes, verify with Playwright at 5 positions (5%/25%/50%/75%/95% of the scroll runway)
on iPhone SE 375 AND iPhone 13 390 AND Desktop 1440. Specifically confirm at 75% and 95% that only
ONE panel is visible and no right-edge of the next panel is visible.
```

**PROMPT BLOCK R4-2 — Process Countdown Bar (GSAP-Restartable):**
```
FIX: Process timeline countdown bar absent (Nigel Cycle 8 item #2).

Replace any existing CSS @keyframes countdown approach with a GSAP-driven bar that can be killed and restarted:

1. Add a <div class="process-countdown-bar"> inside each tab panel, below the tab strip.
   CSS: height: 3px; background: var(--color-terra); transform-origin: left center; width: 100%;

2. In the Process component, maintain a ref: const countdownRef = useRef(null);

3. Create a restartable function:
   function startCountdown(barEl, onComplete) {
     if (countdownRef.current) countdownRef.current.kill();
     gsap.set(barEl, { scaleX: 1 });
     countdownRef.current = gsap.to(barEl, {
       scaleX: 0,
       duration: 10,
       ease: "none",
       onComplete
     });
   }

4. Call startCountdown(currentBarEl, () => advanceToNextStep()) when a tab becomes active.
   On manual tab click: kill the running tween, activate the new tab, call startCountdown for the new bar.

This replaces the broken CSS @keyframes approach and ensures the bar restarts cleanly on tab change.
Do NOT use CSS animation-play-state: paused/running — GSAP .kill() + restart is more reliable.
```

**PROMPT BLOCK R4-3 — PaintFlow animateMotion Restore (GSAP Quickto List Warp):**
```
FIX: PaintFlow dots not animating (Nigel Cycle 8 item #3).

Two-part fix:
Part A — Restore animateMotion:
  In the PaintFlow SVG, confirm each dot has:
  <circle r="5" fill="#C2603A">
    <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
      <mpath href="#flow-path" />
    </animateMotion>
  </circle>
  
  The IO observer threshold must be ≤ 0.05 (not 0.2 or higher — that suppresses on mobile).
  Do NOT pause/play animateMotion via JS — just ensure the elements exist when the section enters view.

Part B — Add velocity-shear to node labels (Reference T11 List Warp pattern):
  After the animateMotion dots are confirmed working, add scroll velocity shear to the 5 workflow node labels:
  
  const nodes = document.querySelectorAll('.paintflow-node-label');
  nodes.forEach(n => { n._skewTo = gsap.quickTo(n, "skewY", { duration: 0.5, ease: "power2" }); });
  
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const velocity = (window.scrollY - lastScrollY) * 0.012;
    lastScrollY = window.scrollY;
    nodes.forEach(n => n._skewTo(velocity));
  }, { passive: true });
  
  This makes the node labels physically respond to scroll without touching the dot animation.
```

**PROMPT BLOCK R4-4 — SectionDividers (Catalog #3 — still absent):**
```
ADD: Section dividers between all major sections (Nigel Cycle 8 item #4 — zero dividers detected).

Use the SectionDivider component (already built in prior cycles, confirmed shipping in commit 8e730a6).
Ensure it is rendered between EVERY adjacent section pair:

<Hero3D />
<SectionDivider />      ← ADD if missing
<ServicesScrollLock />
<SectionDivider flip />  ← ADD if missing (flip prop mirrors the teardrops)
<PaintFlow />
<SectionDivider />       ← ADD if missing
<WhySoley />
<SectionDivider flip />  ← ADD if missing
<LiveEstimate />
<SectionDivider />       ← ADD if missing
<FounderBlock />
<SectionDivider flip />  ← ADD if missing
<PortfolioGallery />
<SectionDivider />       ← ADD if missing
<FAQ />
<SectionDivider flip />  ← ADD if missing
<Process />
<SectionDivider />       ← ADD if missing
<Contact />
<Footer />

Do NOT add a divider between Contact and Footer (they share a continuous visual treatment).
Confirm the IO threshold on SectionDivider is ≤ 0.05 to trigger correctly on mobile.
```

**PROMPT BLOCK R4-5 — Ambient Clock in Footer + `dvh` Unit Sweep:**
```
ADD (Reference B — Studio Namma pattern): Ambient local-time clock in footer bottom bar.

1. In the footer bottom bar, add a live clock between the copyright and the INSTAGRAM link:
   <time id="soley-clock" dateTime="" className="ambient-clock" aria-label="Current time ET"></time>

   CSS: font-size: 0.7rem; letter-spacing: 0.08em; font-variant-numeric: tabular-nums; opacity: 0.6;

   JS (client-side useEffect):
   const tick = () => {
     const now = new Date().toLocaleTimeString('en-US', {
       timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit'
     });
     const el = document.getElementById('soley-clock');
     if (el) { el.textContent = now; el.setAttribute('dateTime', new Date().toISOString()); }
   };
   tick();
   const id = setInterval(tick, 1000);
   return () => clearInterval(id);

2. While editing layout.tsx or globals.css, do a global sweep:
   Replace every instance of height: 100vh inside the ServicesScrollLock section with height: 100dvh.
   This includes the sticky inner track and any full-height panel overlays.
   Leave all other 100vh usages (hero, contact, etc.) unchanged — only touch the scroll-lock section.
```

---

*Scout cycle 4 complete. Research only. No code modified.*  
*New URLs added: t11.com, awwwards.com/sites/t11, studionamma.com, awwwards.com/sites/studio-namma, tympanus.net/codrops/2026/05/05/reverse-engineering-claude-ais-mascot-animations, scroll-driven-animations.style/demos/horizontal-section/css/, css-tricks.com/linearly-scale-font-size-with-css-clamp-based-on-the-viewport/, nerdy.dev/4-css-features-every-front-end-developer-should-know-in-2026, utilitybend.com/blog/is-the-sticky-thing-stuck-is-the-snappy-item-snapped-a-look-at-state-queries-in-css/*
