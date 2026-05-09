# BUGS.md — Soley Painting QA Audit
## QA cycle: 2026-05-07, Playwright, 4 viewports

---

## BLOCKERS

### BUG-001 — ServicesScrollLock: translateX massively over-shoots, panels fly off-screen mid-runway [ALL VIEWPORTS]

**Severity: BLOCKER**
**Viewports: iPhone SE 375, iPhone 13 390, iPhone Pro Max 414, Desktop 1440**

Framer Motion's `useScroll({ target: containerRef })` caches the section's scroll offset at mount, before the page has fully settled. As a result `scrollYProgress` reaches 1.0 much earlier than the physical end of the runway, and the `useTransform(scrollYProgress, [0,1], ['0%', '-400%'])` drives `translateX` far past the 5-panel track's total width.

Measured on desktop 1440 (section top=1096px, height=4500px, runway ends at 5596px):
- Runway 25% (scrollY=2221): trackX = -8832px (should be ~-1800px for panel 2 of 5)
- Runway 50% (scrollY=3346): trackX = -17416px (should be ~-3600px)
- Runway 75% (scrollY=4471): trackX = -26496px (should be ~-5400px)
- Runway 95% (scrollY=5371): trackX = -28800px (= exactly -400% of 7200px = fully scrolled, but still 225px from actual runway end)

All 5 panel titles (Interior, Exterior, Commercial, Cabinet & Trim, Specialty) are visible via DOM — the track exists and has content — but the X translation is ~4–5x too aggressive, so panels 2–5 never appear in the viewport at their correct scroll positions. The user experiences a fast blur past panel 1 and then just panel 5 (or off-screen blank) for the majority of the scroll.

**Root cause (confirmed by Scout):** Framer Motion's `useScroll` with `target` ref reads `getBoundingClientRect()` once at mount. If any upstream element (Hero, SectionDivider, ServicesMarquee) shifts in height after mount (fonts loading, image decode, SVG measurement), the cached offset is wrong. The scroll progress math runs against a stale top value.

**Fix path:** Replace `useScroll` with a pure-JS scroll handler that calls `getBoundingClientRect()` live on every scroll event (or on a `resize` observer) and computes progress from the current rect, not a cached one. Scout identified this in cycle 3 (af0c076).

---

### BUG-002 — Footer: 5-column grid renders in a single compressed row on iPhone SE 375 (overflow confirmed)

**Severity: BLOCKER (layout-breaking)**
**Viewports: iPhone SE 375, iPhone 13 390, iPhone Pro Max 414**

The footer uses `grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr` with `gap: 3rem` as an inline style with no responsive override. On iPhone SE (375px viewport), all 5 columns render at pixel widths of: 115px, 78px, 82px, 50px, 64px = 389px total, plus 4×48px gap = 581px in a 375px container. `overflow: true` confirmed by scrollWidth measurement. Content is cramped and illegible on mobile.

**Fix path:** Media query or responsive Tailwind class to stack to 2-column or single-column on mobile. The inline style must get a mobile override or be switched to Tailwind utility classes.

---

## HIGH

### BUG-003 — Font size violations: 11.2px–12.8px across all viewports including desktop [ALL VIEWPORTS]

**Severity: HIGH**
**Viewports: all four**

Multiple text nodes below the 13px minimum, present on every viewport including desktop 1440:

| Element | Font size | Content |
|---------|-----------|---------|
| P | 12.8px | "Soley Painting" (marquee label inside service panels) |
| SPAN | 11.2px | "Scroll" (hero scroll indicator) |
| SPAN | 12px | "Scroll to explore" (ServicesScrollLock label) |
| SPAN | 11.2px | "Soley Painting" (repeated in service panel swatch labels) ×5 |
| P | 11.2px | "The process" (section eyebrow) |
| SPAN | 11.2px | Step labels: "Surface assessment", "Sand, caulk, prime", "Full coverage primer", "Two full coats", "Walkthrough & touch-up" |
| SPAN | 12px | Step numbers "01", "02", "03", "04" ×2 sets |

Minimum legible size is 13px per QA rules. All of the above are below threshold.

---

### BUG-004 — Tap target violations: Navbar logo and marquee-panel CTAs below 44px minimum [Mobile viewports]

**Severity: HIGH**
**Viewports: iPhone SE 375, iPhone 13 390, iPhone Pro Max 414**

| Element | Height | Width | Text |
|---------|--------|-------|------|
| Navbar logo (`<a>`) | 33px | 128px | "Soley Painting" |
| Service panel CTA links | 42px | 52–83px | "Interior Painting", "Exterior Painting", etc. |
| "Application" link | 18px | 74px | "Application" |

The logo link is the most critical: 33px height fails the 44px minimum on all mobile viewports. The "Application" CTA at 18px is the worst offender.

---

### BUG-005 — Hero SVG overflows viewport horizontally on iPhone SE and iPhone 13 [Mobile]

**Severity: HIGH**
**Viewports: iPhone SE 375, iPhone 13 390**

The Hero SVG has `viewBox="0 0 640 280"` and renders at 640px wide on desktop. On iPhone SE (375px), the SVG overflows the viewport: measured `right: 445px` vs `vw: 375px` = 70px overflow. On iPhone 13: `right: 415px` vs `vw: 390px` = 25px overflow. The SVG appears to lack a responsive width constraint (no `width: 100%` or `max-width: 100vw`).

This causes a horizontal scroll bar to appear on mobile, which is a significant UX failure for a hero centerpiece.

**Desktop:** Hero SVG renders at 640×280px, text element is 344px wide at 172px font-size. Proportions are fine at 1440px.

---

### BUG-006 — WhySoley cards: no `h3` visible in the viewport at desktop scroll positions 45–65% [Desktop]

**Severity: HIGH**
**Viewport: Desktop 1440**

At desktop scroll positions 45%/55%/65% (scrollY: 4100–5923), zero H3 elements are visible in the viewport despite the WhySoley section being at top=6658px (within that range at 65%). The section exists in DOM with 4 cards ("Prep is the product", "One person, start to finish", "Written quotes, line by line", "Low-VOC by default") but they don't become visible until past 65% page scroll. This is likely the section requiring user to scroll further but the scroll-reveal observer is too conservative, or the section has an unexpectedly large top offset pushing content below the fold.

---

### BUG-007 — Process section: no active tab state detected, tab buttons have no `aria-selected` [All viewports]

**Severity: HIGH**
**Viewports: All**

The Process section (`id="process"`) was built with auto-advancing tabs, but querying for `[aria-selected="true"]`, `[data-active="true"]`, or `.active` returns null. The tab buttons ("01Free Walkthrough", "02Color Consultation", etc.) exist with 55–77px height, but no active state is detectable via DOM attributes. This suggests either: (a) the auto-advance animation relies purely on CSS class toggling not reflected in ARIA attributes (accessibility gap), or (b) the Intersection Observer that triggers the tabs hasn't fired because the section was never in view during the check.

---

## MEDIUM

### BUG-008 — SectionDivider: not detectable by class selector on any viewport [All viewports]

**Severity: MEDIUM**
**Viewports: All**

The `SectionDivider` component (teardrop SVG + traveling pulses, committed as catalog item between Hero and ServicesScrollLock) returns `found: false` across all 4 viewports when queried via `[class*="divider"]` or `[class*="Divider"]`. It may render without a class, or it may have been removed during a prior commit. The Hero section is at top=0 height=945px and ServicesScrollLock is at top=1096px — there is a 151px gap which could be where the divider lives, but it's not discoverable by class query.

**Note:** Gap of 151px between sections at desktop could be intentional margin/padding. Needs visual confirmation via screenshot.

---

### BUG-009 — PaintFlow component: not found by class selector [All viewports]

**Severity: MEDIUM**
**Viewports: All**

The `PaintFlow` SVG animateMotion component is listed in `/app/components/PaintFlow.tsx` and appears in the page section structure at `id="workflow"` (top=5596, height=1062 on desktop), but is not discoverable via `[class*="paintflow"]` or `[class*="PaintFlow"]`. The section renders ("The process / Wall to finish — nothing skipped.") but the SVG animation is undetectable by class. May render without the expected class attribute.

---

### BUG-010 — LiveEstimate component: not found / no typing cursor detected [All viewports]

**Severity: MEDIUM**
**Viewports: All**

The `LiveEstimate` auto-typing estimate form with blink cursor (Spark catalog item #6) is not discoverable via `[class*="estimate"]`, `[class*="LiveEstimate"]`, or `[id*="estimate"]` on any viewport. No typing element (`[class*="typing"]`, `[class*="cursor"]`, `[class*="blink"]`) is found. The Contact section at id="contact" exists with 4 form inputs, but the distinct LiveEstimate sub-feature appears absent or detached.

---

### BUG-011 — WhySoley: not detectable by class selector [All viewports]

**Severity: MEDIUM (informational)**
**Viewports: All**

The WhySoley section is present at `id="why-soley"` (verified via section ID query) with 4 cards found via `[style*="perspective"]`. However, the class-based query `[class*="WhySoley"]` or `[class*="why"]` returns nothing, meaning the section uses only ID-based anchoring with no class attribute. This is not a functional bug but means class-based QA selectors need to use `#why-soley` instead.

**Cards verified:** "Prep is the product", "One person, start to finish", "Written quotes, line by line", "Low-VOC by default" — all present in DOM.

---

### BUG-012 — Overflow on desktop: ServicesScrollLock SVG paths and spans extend past 1440px [Desktop]

**Severity: MEDIUM**
**Viewport: Desktop 1440**

Multiple elements extend right to 1504–1911px on a 1440px desktop viewport (overflow check). These include: animated-marquee container (expected/clipped), unnamed DIV at 1504px, SVG elements at 1554–1783px. The marquee overflow is intentional (overflow:hidden on parent), but the unnamed DIVs and SVG path overflowing beyond the viewport suggest the Hero SVG or WhySoley card content extends past screen edge on desktop.

---

## LOW

### BUG-013 — Console errors: none detected [All viewports]

**Severity: INFO**

Zero console errors or page errors on all four viewports. Hydration is clean.

---

### BUG-014 — Navbar: logo doesn't wrap on iPhone SE 375 [PASS]

**Severity: INFO — No Bug**

Navbar logo "Soley Painting" renders at 33px height, 128px width. Text does not wrap. Height is below 44px tap target (see BUG-004) but the text itself is not wrapped.

---

## Viewport coverage matrix

| Component | iPhone SE 375 | iPhone 13 390 | iPhone Pro Max 414 | Desktop 1440 |
|-----------|:---:|:---:|:---:|:---:|
| Hero SVG reveal | present, OVERFLOW | present, slight overflow | present | present, correct size |
| SectionDivider | undetectable | undetectable | undetectable | undetectable |
| ServicesMarquee | animating | animating | animating | animating |
| ServicesScrollLock | BLOCKER (over-translate) | BLOCKER | BLOCKER | BLOCKER (over-translate, measured) |
| PaintFlow / Workflow | present by ID | present by ID | present by ID | present by ID |
| Process tabs | present, ARIA gap | present, ARIA gap | present, ARIA gap | present, ARIA gap |
| WhySoley cards | present by ID | present by ID | present by ID | present by ID |
| LiveEstimate | NOT FOUND | NOT FOUND | NOT FOUND | NOT FOUND |
| Contact form | 4 inputs, no overflow | 4 inputs, ok | 4 inputs, ok | 4 inputs, ok |
| Footer | 5-col OVERFLOW | 5-col OVERFLOW | 5-col OVERFLOW | ok |
| Navbar | logo 33px tap fail | logo 33px tap fail | logo 33px tap fail | ok |

---

## Screenshot index

All screenshots: `/tmp/soley-qa-screenshots/`

- `iphone-se-overview.png` — full-page iPhone SE
- `iphone-13-overview.png` — full-page iPhone 13
- `iphone-pro-max-overview.png` — full-page iPhone Pro Max
- `desktop-runway-5pct.png` through `desktop-runway-95pct.png` — ServicesScrollLock runway samples
- `iphonese-runway-5pct.png` through `iphonese-runway-95pct.png` — iPhone SE runway samples
- `desktop-hero-check.png` — Hero SVG at desktop
- `desktop-process.png` — Process section desktop
- `desktop-why-soley.png` — WhySoley cards desktop
- `desktop-contact.png` — Contact / LiveEstimate desktop
- `iphonese-contact.png` — Contact mobile
- `iphonese-footer.png` — Footer mobile
- `desktop-mid-45pct.png`, `desktop-mid-55pct.png`, `desktop-mid-65pct.png` — mid-page desktop

---

*QA audit by QA agent, 2026-05-07. 4 viewports, 5 runway samples per viewport, 20 total scroll positions sampled.*
