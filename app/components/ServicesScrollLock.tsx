'use client'

import { useRef, useEffect, useState } from 'react'

/* ── Brand accent bar colors — Drop Cloth & Rust palette ─────────────────── */
// Rotation: rust / stone / ochre / linen / rust (teal removed)
const PANEL_BAR_COLORS = ['#BF5B38', '#EAE0D4', '#B8884A', '#F4EDE3', '#BF5B38']

/* ── Service SVG icons — painter-trade visual language, matches SectionDivider/PaintFlow ── */
// Each returns a 28x28 SVG with stroke in the panel accent color
function IconInterior({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* House outline: walls + roof */}
      <path d="M4 14 L14 5 L24 14" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M6 13 L6 24 L22 24 L22 13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Door — centered at base */}
      <rect x="11" y="17" width="6" height="7" rx="0.5" stroke={color} strokeWidth="1.4" fill="none" />
      {/* Paintbrush stroke inside wall — signals painting */}
      <path d="M9 10 Q9 9.5 9.5 9.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}
function IconExterior({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* House with chimney — exterior signal */}
      <path d="M4 14 L14 4 L24 14" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M6 13 L6 24 L22 24 L22 13" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Chimney */}
      <rect x="17" y="5" width="4" height="6" rx="0.5" stroke={color} strokeWidth="1.4" fill="none" />
      {/* Siding lines — exterior clapboard signal */}
      <line x1="6" y1="17" x2="22" y2="17" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="20" x2="22" y2="20" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  )
}
function IconCommercial({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Office building — flat top, uniform windows */}
      <rect x="5" y="8" width="18" height="16" rx="0.5" stroke={color} strokeWidth="1.6" fill="none" />
      {/* Roof line */}
      <line x1="5" y1="8" x2="23" y2="8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {/* Window grid 2x3 */}
      <rect x="8" y="11" width="4" height="3" rx="0.3" stroke={color} strokeWidth="1.1" fill="none" opacity="0.7" />
      <rect x="16" y="11" width="4" height="3" rx="0.3" stroke={color} strokeWidth="1.1" fill="none" opacity="0.7" />
      <rect x="8" y="16" width="4" height="3" rx="0.3" stroke={color} strokeWidth="1.1" fill="none" opacity="0.7" />
      <rect x="16" y="16" width="4" height="3" rx="0.3" stroke={color} strokeWidth="1.1" fill="none" opacity="0.7" />
      {/* Entry door */}
      <rect x="11.5" y="19" width="5" height="5" rx="0.3" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  )
}
function IconCabinet({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Cabinet face — two upper doors + two lower drawers */}
      <rect x="4" y="5" width="20" height="11" rx="0.5" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Center divider (upper) */}
      <line x1="14" y1="5" x2="14" y2="16" stroke={color} strokeWidth="1" opacity="0.6" />
      {/* Upper door handles */}
      <circle cx="11" cy="11" r="1.2" stroke={color} strokeWidth="1.1" fill="none" opacity="0.7" />
      <circle cx="17" cy="11" r="1.2" stroke={color} strokeWidth="1.1" fill="none" opacity="0.7" />
      {/* Lower drawers */}
      <rect x="4" y="18" width="20" height="5" rx="0.5" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Drawer handle */}
      <line x1="12" y1="20.5" x2="16" y2="20.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function IconSpecialty({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Paint roller — specialty coatings signal */}
      {/* Roller handle */}
      <line x1="20" y1="5" x2="20" y2="13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {/* Horizontal bar */}
      <line x1="10" y1="13" x2="20" y2="13" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {/* Roller drum */}
      <rect x="6" y="13" width="10" height="6" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Texture drips beneath — specialty finish signal */}
      <path d="M8 19 Q8 22 8 23" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M11 19 Q11 23 11 24" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <path d="M14 19 Q14 22 14 23" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

/* Map panel id → SVG component */
const PANEL_ICONS: Record<string, React.ComponentType<{ color: string }>> = {
  interior: IconInterior,
  exterior: IconExterior,
  commercial: IconCommercial,
  cabinet: IconCabinet,
  specialty: IconSpecialty,
}

/* ── Panel data (Scout catalog item #4 + #2 palette) ─────────────────── */
const PANELS = [
  {
    id: 'interior',
    title: 'Interior',
    accent: '#F5F0EA',
    accentText: '#2C1F16',
    bg: '#2C1F16',
    headline: 'Rooms that feel new — without moving furniture.',
    descriptor:
      'Walls, ceilings, trim, and crown molding. We protect every surface with drop-cloth floor-to-ceiling coverage before the first brush touches a wall.',
    bullets: [
      'Zero-damage surface protection',
      'Low-VOC & zero-VOC formulations on request',
      'Same-day cleanup — every room left move-in ready',
    ],
  },
  {
    id: 'exterior',
    title: 'Exterior',
    accent: '#EAE0D4',
    accentText: '#221810',
    bg: '#1F1712',
    headline: 'Weather-ready from the first coat.',
    descriptor:
      'Siding, fascia, soffits, doors, and shutters. Every trim gap caulked before primer — skip prep and the best paint fails in two seasons.',
    bullets: [
      'Full caulking of all trim gaps before primer',
      'Prep includes power washing + scraping + sanding',
      'Finish guaranteed against peeling and flaking',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial',
    accent: '#C2603A',
    accentText: '#F5F0EA',
    bg: '#221812',
    headline: 'Professional finish. Minimal disruption.',
    descriptor:
      'Office buildings, retail, multi-unit residential, and HOA common areas. We schedule around your operation — nights, weekends, phased rollouts.',
    bullets: [
      'After-hours and phased scheduling available',
      'Commercial-grade coatings with extended warranties',
      'Single site supervisor — one call, one contact',
    ],
  },
  {
    id: 'cabinet',
    title: 'Cabinet & Trim',
    accent: '#B8935A',
    accentText: '#2C1F16',
    bg: '#2C1F16',
    headline: 'The highest-margin upgrade in any room.',
    descriptor:
      'Kitchen, bathroom, and built-in cabinets refinished with factory-grade finish quality. Spray-applied for a glass-smooth surface that holds color longer than brush-applied coatings.',
    bullets: [
      'Spray-applied factory-smooth finish',
      'Hardware removal and reinstallation included',
      'Color consultation at no extra charge',
    ],
  },
  {
    id: 'specialty',
    title: 'Specialty',
    accent: '#C2603A',
    accentText: '#F5F0EA',
    bg: '#1A130E',
    headline: 'Beyond standard paint.',
    descriptor:
      'Epoxy floors, deck staining, fence staining, concrete sealer, and venetian plaster. Services that set Soley apart from volume-play competitors.',
    bullets: [
      'Epoxy garage and basement floors',
      'Deck and fence staining + sealant',
      'Decorative venetian plaster on request',
    ],
  },
]

/* ── Color lerp helper ───────────────────────────────────────────────── */
function hexToRgb(hex: string): [number, number, number] {
  const rv = parseInt(hex.slice(1, 3), 16)
  const gv = parseInt(hex.slice(3, 5), 16)
  const bv = parseInt(hex.slice(5, 7), 16)
  return [rv, gv, bv]
}
function lerpHex(colorA: string, colorB: string, t: number) {
  const [r1, g1, b1] = hexToRgb(colorA)
  const [r2, g2, b2] = hexToRgb(colorB)
  const rv = Math.round(r1 + (r2 - r1) * t)
  const gv = Math.round(g1 + (g2 - g1) * t)
  const bv = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${rv},${gv},${bv})`
}

const BG_COLORS = PANELS.map(p => p.bg)

export default function ServicesScrollLock() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef    = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const [translateX, setTranslateX] = useState(0) // px offset for track
  // panelWidth in px — computed from the sticky container's clientWidth, not vw
  const [panelWidth, setPanelWidth] = useState(0)

  useEffect(() => {
    // Compute panel width from the sticky container (avoids vw-inside-overflow:hidden issues)
    const computePanelWidth = () => {
      const sticky = stickyRef.current
      if (!sticky) return
      const w = sticky.clientWidth
      setPanelWidth(w)
      // Also set track width directly to avoid stale CSS vw units
      if (trackRef.current) {
        trackRef.current.style.width = `${PANELS.length * w}px`
      }
    }

    const onScroll = () => {
      const el = containerRef.current
      const sticky = stickyRef.current
      if (!el || !sticky) return

      // Use clientWidth measured from the sticky container — never window.innerWidth
      // because vw resolves differently inside overflow:hidden parents on some browsers
      const w = sticky.clientWidth || window.innerWidth

      // getBoundingClientRect is LIVE — never stale from mount-time cache
      const rect = el.getBoundingClientRect()
      const sectionHeight = el.offsetHeight
      const runway = sectionHeight - window.innerHeight

      // -rect.top = how far we've scrolled INTO the section (0 at entry, runway at exit)
      // BUG-039 fix: entry dead zone + compressed travel window
      // - First 5% of runway: translateX stays at 0 (panel 1 fully in view, no bleed)
      // - 5%→90% of runway: linear travel from 0 → maxShift (85% window)
      // - 90%→100% of runway: clamped at maxShift (panel 5 settled, stable)
      // This ensures ZERO bleed at section entry while panel 5 fully settles before exit.
      const scrolledIn = Math.max(0, -rect.top) // 0 at entry, runway at exit
      const entryDead = runway * 0.05            // dead zone: no travel in first 5%
      const travelWindow = runway * 0.85         // compressed travel window (5%→90%)
      const raw = scrolledIn <= entryDead
        ? 0
        : Math.min(1, (scrolledIn - entryDead) / travelWindow)

      // translateX: 0 (panel 1 in view) → -(PANELS.length-1)*panelWidth (panel 5 in view)
      // Using clientWidth-derived panelWidth ensures panel width === sticky container width
      const maxShift = (PANELS.length - 1) * w
      setTranslateX(-(raw * maxShift))

      // Mood-lerp background
      const progress = raw * (PANELS.length - 1) // 0 → 4
      const idx = Math.min(Math.floor(progress), BG_COLORS.length - 2)
      const blend = progress - idx
      const color = lerpHex(BG_COLORS[idx], BG_COLORS[idx + 1], blend)
      document.documentElement.style.setProperty('--page-bg', color)
    }

    // Compute on mount
    computePanelWidth()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', () => { computePanelWidth(); onScroll() })
    // Run once immediately so initial position is correct
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', () => { computePanelWidth(); onScroll() })
      document.documentElement.style.setProperty('--page-bg', 'var(--color-chalk)')
    }
  }, [])

  // Panel width in px; falls back to 100% during SSR/first-paint
  // IMPORTANT: never use vw units inside overflow:hidden containers — vw resolves to
  // the full document width (ignoring scrollbar and parent clips), causing panels to
  // be wider than the sticky container on some browsers. Use % (relative to parent) instead.
  const panelPx = panelWidth > 0 ? `${panelWidth}px` : '100%'
  const trackWidth = panelWidth > 0 ? `${PANELS.length * panelWidth}px` : '500%'

  return (
    <section
      id="services"
      ref={containerRef}
      style={{ height: '500vh', position: 'relative' }}
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        {/* Section label */}
        <div
          style={{
            position: 'absolute',
            top: '1.75rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.5)',
            }}
          >
            Scroll to explore
          </span>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'var(--color-terra)',
            }}
          />
        </div>

        {/* Horizontal track — driven by pure-JS computed translateX.
            Width set in JS (px) via trackRef to avoid vw-resolution issues
            inside overflow:hidden sticky containers. */}
        <div
          ref={trackRef}
          style={{
            transform: `translateX(${translateX}px)`,
            willChange: 'transform',
            display: 'flex',
            width: trackWidth,
            height: '100dvh',
          }}
        >
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              style={{
                /* BUG-056 fix: explicit width + minWidth + flexShrink 0 prevents panels
                   collapsing to content width (103-141px) on SE375.
                   - panelWidth > 0: use computed px from stickyRef.clientWidth (exact)
                   - panelWidth === 0: SSR/first-paint fallback uses 100% (fills the flex
                     container's current width — safe inside overflow:hidden unlike 100vw)
                   - flexShrink: 0 alone is insufficient when width is not explicit;
                     both width AND minWidth must be set to lock the flex item size.    */
                width: panelWidth > 0 ? panelPx : '100%',
                minWidth: panelWidth > 0 ? panelPx : '100%',
                flexShrink: 0,
                flexGrow: 0,
                height: '100dvh',
                background: panel.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Accent bar — top (Nigel P4: 4px full-width brand color rotation)
                  Colors rotate: rust → stone → ochre → linen → rust
                  Each panel gets its own distinct brand color per PANEL_BAR_COLORS. */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: PANEL_BAR_COLORS[i],
                  zIndex: 3,
                }}
              />

              {/* Panel number — top right label */}
              <span
                style={{
                  position: 'absolute',
                  top: '2.5rem',
                  right: '3rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.15em',
                  color: 'rgba(245,240,234,0.25)',
                  zIndex: 2,
                }}
              >
                0{i + 1} / 0{PANELS.length}
              </span>

              {/* BUG-022 fix: Right-column panel numeral at full opacity fills the dark void.
                  Positioned in the right 50% of the panel as a foreground design element.
                  Full opacity per RULE 8 — not a ghost/faded number behind content.
                  Hidden on mobile via .panel-numeral-right in globals.css */}
              <div
                aria-hidden="true"
                className="panel-numeral-right"
                style={{
                  position: 'absolute',
                  right: '4vw',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: 'clamp(7rem, 14vw, 14rem)',
                    lineHeight: 1,
                    color: panel.accent,
                    userSelect: 'none',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: panel.accent,
                    marginTop: '0.5rem',
                  }}
                >
                  {panel.title}
                </span>
              </div>

              {/* Content */}
              <div
                style={{
                  maxWidth: '720px',
                  padding: '0 clamp(1rem, 5vw, 3rem)',
                  width: '100%',
                }}
              >
                {/* Service icon + eyebrow — SVG icon replaces plain accent swatch (P4) */}
                {(() => {
                  const PanelIcon = PANEL_ICONS[panel.id]
                  return (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          border: `1px solid ${panel.accent}55`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {PanelIcon && <PanelIcon color={panel.accent} />}
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.875rem',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'rgba(245,240,234,0.45)',
                        }}
                      >
                        Soley Painting
                      </span>
                    </div>
                  )
                })()}

                {/* Panel title — top-anchored with min-h reservation */}
                <div style={{ minHeight: '120px' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--color-chalk)',
                      lineHeight: 1,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {panel.title}
                  </h2>
                </div>

                {/* Outcome headline */}
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                    color: panel.accent,
                    marginBottom: '1.25rem',
                    maxWidth: '38ch',
                    lineHeight: 1.35,
                  }}
                >
                  {panel.headline}
                </p>

                {/* Descriptor */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'rgba(245,240,234,0.65)',
                    maxWidth: '44ch',
                    marginBottom: '1.75rem',
                  }}
                >
                  {panel.descriptor}
                </p>

                {/* Bullets */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {panel.bullets.map((bullet, bi) => (
                    <li
                      key={bi}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        color: 'rgba(245,240,234,0.78)',
                        marginBottom: '0.625rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: panel.accent,
                          marginTop: '0.45em',
                          flexShrink: 0,
                        }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '2rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: panel.accent,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${panel.accent}60`,
                    paddingBottom: '2px',
                    transition: 'border-color 0.2s ease',
                    minHeight: '44px',
                  }}
                >
                  Get a quote for this service →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
