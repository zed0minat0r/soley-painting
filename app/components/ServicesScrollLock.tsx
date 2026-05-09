'use client'

import { useRef, useEffect, useState } from 'react'

/* ── Brand accent bar colors (Nigel P4 — one per panel, rotating palette) ─── */
// Rotation: terracotta / teal / clay-gold / chalk / terracotta
const PANEL_BAR_COLORS = ['#C2603A', '#2D7A70', '#B8935A', '#F5F0EA', '#C2603A']

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
    icon: '🏠',
  },
  {
    id: 'exterior',
    title: 'Exterior',
    accent: '#2D7A70',
    accentText: '#F5F0EA',
    bg: '#1F1712',
    headline: 'Weather-ready from the first coat.',
    descriptor:
      'Siding, fascia, soffits, doors, and shutters. Every trim gap caulked before primer — skip prep and the best paint fails in two seasons.',
    bullets: [
      'Full caulking of all trim gaps before primer',
      'Prep includes power washing + scraping + sanding',
      'Finish guaranteed against peeling and flaking',
    ],
    icon: '🏡',
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
    icon: '🏢',
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
    icon: '🪵',
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
    icon: '✨',
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
      // Clamp to reach 1.0 at 90% of runway so panel 5 is fully settled before the
      // section exits. The last 10% of the runway is a stable settled view of panel 5.
      // BUG-025 fix (Option B): was dividing by full runway → panel 5 only reached ~95%
      // at the 95% position, causing CABINET & TRIM "04" numeral to bleed into viewport.
      const raw = Math.max(0, Math.min(1, -rect.top / (runway * 0.9)))

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

  // Panel width in px; falls back to 100vw string during SSR/first-paint
  const panelPx = panelWidth > 0 ? `${panelWidth}px` : '100vw'
  const trackWidth = panelWidth > 0 ? `${PANELS.length * panelWidth}px` : `${PANELS.length * 100}vw`

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
          height: '100vh',
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
              fontSize: '0.75rem',
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
            height: '100vh',
          }}
        >
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              style={{
                width: panelPx,
                height: '100vh',
                background: panel.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* Accent bar — top (Nigel P4: 4px full-width brand color rotation)
                  Colors rotate: terracotta → teal → clay-gold → chalk → terracotta
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
                    fontSize: '0.75rem',
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
                {/* Swatch accent tile */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: panel.accent,
                      flexShrink: 0,
                    }}
                  />
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
