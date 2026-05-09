'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ── Category type ──────────────────────────────────────────────────────── */
type Category = 'ALL' | 'INTERIOR' | 'EXTERIOR' | 'COMMERCIAL' | 'CABINET & TRIM' | 'SPECIALTY'

const CHIPS: Category[] = ['ALL', 'INTERIOR', 'EXTERIOR', 'COMMERCIAL', 'CABINET & TRIM', 'SPECIALTY']

/* ── Swatch colors per category (brand tokens) ──────────────────────────── */
const SWATCH: Record<Exclude<Category, 'ALL'>, string> = {
  INTERIOR:         '#BF5B38', // rust
  EXTERIOR:         '#B8884A', // ochre
  COMMERCIAL:       '#B8884A', // ochre
  'CABINET & TRIM': '#EAE0D4', // stone
  SPECIALTY:        '#8C4A2F', // dark terra
}

/* ── Border accent per category (used for hover left-rail) ─────────────── */
const ACCENT: Record<Exclude<Category, 'ALL'>, string> = {
  INTERIOR:         '#BF5B38',
  EXTERIOR:         '#B8884A',
  COMMERCIAL:       '#B8884A',
  'CABINET & TRIM': '#8C7B72',
  SPECIALTY:        '#8C4A2F',
}

/* ── SVG painted swatches per category ─────────────────────────────────── */
const SWATCH_SVG: Record<Exclude<Category, 'ALL'>, string> = {
  INTERIOR: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#3D2B1F"/>
      <ellipse cx="200" cy="150" rx="160" ry="80" fill="#BF5B38" fill-opacity="0.32" transform="rotate(-8 200 150)"/>
      <rect x="80" y="80" width="240" height="10" rx="5" fill="#BF5B38" fill-opacity="0.22" transform="rotate(4 200 85)"/>
      <rect x="100" y="110" width="180" height="7" rx="3" fill="#F4EDE3" fill-opacity="0.10"/>
      <ellipse cx="200" cy="160" rx="90" ry="28" fill="#BF5B38" fill-opacity="0.18" transform="rotate(5 200 160)"/>
      <rect x="40" y="200" width="320" height="6" rx="3" fill="#B8884A" fill-opacity="0.14" transform="rotate(-3 200 203)"/>
    </svg>`,
  EXTERIOR: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#3D2B1F"/>
      <ellipse cx="200" cy="140" rx="170" ry="60" fill="#B8884A" fill-opacity="0.30" transform="rotate(6 200 140)"/>
      <rect x="60" y="90" width="280" height="9" rx="4" fill="#B8884A" fill-opacity="0.20" transform="rotate(-5 200 94)"/>
      <ellipse cx="160" cy="180" rx="120" ry="35" fill="#BF5B38" fill-opacity="0.22" transform="rotate(10 160 180)"/>
      <rect x="30" y="220" width="340" height="7" rx="3" fill="#F4EDE3" fill-opacity="0.08"/>
      <ellipse cx="240" cy="110" rx="70" ry="20" fill="#B8884A" fill-opacity="0.15"/>
    </svg>`,
  COMMERCIAL: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#3D2B1F"/>
      <rect x="50" y="70" width="300" height="14" rx="7" fill="#B8884A" fill-opacity="0.28" transform="rotate(2 200 77)"/>
      <rect x="80" y="100" width="240" height="9" rx="4" fill="#B8884A" fill-opacity="0.20" transform="rotate(-3 200 104)"/>
      <ellipse cx="200" cy="165" rx="150" ry="55" fill="#BF5B38" fill-opacity="0.14" transform="rotate(8 200 165)"/>
      <rect x="30" y="190" width="340" height="7" rx="3" fill="#B8884A" fill-opacity="0.18" transform="rotate(-2 200 193)"/>
      <rect x="100" y="220" width="200" height="6" rx="3" fill="#F4EDE3" fill-opacity="0.07"/>
    </svg>`,
  'CABINET & TRIM': `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#3D2B1F"/>
      <rect x="30" y="60" width="340" height="12" rx="6" fill="#EAE0D4" fill-opacity="0.35" transform="rotate(1 200 66)"/>
      <rect x="60" y="90" width="280" height="8" rx="4" fill="#B8884A" fill-opacity="0.22"/>
      <rect x="90" y="115" width="220" height="6" rx="3" fill="#B8884A" fill-opacity="0.18" transform="rotate(-2 200 118)"/>
      <ellipse cx="200" cy="175" rx="130" ry="40" fill="#EAE0D4" fill-opacity="0.20" transform="rotate(4 200 175)"/>
      <rect x="50" y="220" width="300" height="7" rx="3" fill="#F4EDE3" fill-opacity="0.08"/>
    </svg>`,
  SPECIALTY: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#3D2B1F"/>
      <ellipse cx="200" cy="130" rx="155" ry="65" fill="#8C4A2F" fill-opacity="0.30" transform="rotate(-10 200 130)"/>
      <rect x="70" y="80" width="260" height="10" rx="5" fill="#8C4A2F" fill-opacity="0.24" transform="rotate(6 200 85)"/>
      <ellipse cx="200" cy="180" rx="100" ry="32" fill="#BF5B38" fill-opacity="0.16" transform="rotate(-5 200 180)"/>
      <rect x="40" y="210" width="320" height="8" rx="4" fill="#8C4A2F" fill-opacity="0.20" transform="rotate(2 200 214)"/>
      <rect x="110" y="240" width="180" height="5" rx="2" fill="#F4EDE3" fill-opacity="0.07"/>
    </svg>`,
}

/* ── Tile data ──────────────────────────────────────────────────────────── */
interface Tile {
  id: number
  category: Exclude<Category, 'ALL'>
  line1: string
  line2: string
}

const TILES: Tile[] = [
  { id: 1, category: 'INTERIOR',         line1: 'Two-story living room + stairwell',  line2: 'Open-plan full repaint' },
  { id: 2, category: 'EXTERIOR',         line1: 'Single-family Cape Cod exterior',    line2: 'Full exterior repaint cycle' },
  { id: 3, category: 'CABINET & TRIM',   line1: 'Kitchen cabinet refinish',           line2: '32 doors + drawer fronts' },
  { id: 4, category: 'COMMERCIAL',       line1: 'Office suite build-out',             line2: 'Primer + two-coat finish' },
  { id: 5, category: 'INTERIOR',         line1: 'Primary bedroom + en-suite',         line2: 'Accent wall treatment' },
  { id: 6, category: 'EXTERIOR',         line1: 'Colonial revival facade',            line2: 'Trim detail + shutters' },
  { id: 7, category: 'SPECIALTY',        line1: 'Garage floor epoxy coating',         line2: 'Two-part system application' },
  { id: 8, category: 'COMMERCIAL',       line1: 'Retail space repaint',               line2: '3,200 sq ft open floor plan' },
  { id: 9, category: 'CABINET & TRIM',   line1: 'Built-in bookcase + crown molding',  line2: 'Full refinish' },
]

/* ── Filter animation phases ────────────────────────────────────────────── */
type Phase = 'idle' | 'exiting' | 'entering'

/* ── Painted swatch tile ────────────────────────────────────────────────── */
function PaintedSwatch({ category }: { category: Exclude<Category, 'ALL'> }) {
  const svgStr = SWATCH_SVG[category]
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`
  return (
    <div
      className="portfolio-swatch"
      style={{ backgroundImage: `url("${dataUri}")` }}
      aria-hidden="true"
    />
  )
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function PortfolioGallery() {
  const [active, setActive]       = useState<Category>('ALL')
  const [displayed, setDisplayed] = useState<Category>('ALL')
  const [phase, setPhase]         = useState<Phase>('idle')
  const pendingRef                = useRef<Category | null>(null)
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChipClick = useCallback((chip: Category) => {
    if (chip === active && phase === 'idle') return

    // cancel any in-flight transition
    if (timerRef.current) clearTimeout(timerRef.current)
    pendingRef.current = chip

    setPhase('exiting')
    // exit takes 200ms — then swap content and enter
    timerRef.current = setTimeout(() => {
      setActive(pendingRef.current!)
      setDisplayed(pendingRef.current!)
      setPhase('entering')
      // entering phase drives per-tile stagger; mark idle after all tiles finish
      timerRef.current = setTimeout(() => setPhase('idle'), 600)
    }, 200)
  }, [active, phase])

  // clean up on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const visible = displayed === 'ALL'
    ? TILES
    : TILES.filter(t => t.category === displayed)

  /* derive CSS class for the grid wrapper */
  const gridClass = [
    'portfolio-grid',
    'scroll-reveal',
    phase === 'exiting'  ? 'portfolio-grid--exit'   : '',
    phase === 'entering' ? 'portfolio-grid--enter'  : '',
  ].filter(Boolean).join(' ')

  return (
    <section id="portfolio" className="portfolio-section">
      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="portfolio-header scroll-reveal">
        <p className="portfolio-eyebrow">Recent Work</p>
        <h2 className="portfolio-headline">The work categories — photos coming with the first jobs.</h2>
        <p className="portfolio-sub">
          Real project photography lands as soon as the first set of jobs wraps.
          Each category below shows the scope we take on.
        </p>
      </div>

      {/* ── Filter chips ───────────────────────────────────────────────── */}
      <div className="portfolio-chips scroll-reveal" role="group" aria-label="Filter projects by category">
        {CHIPS.map(chip => (
          <button
            key={chip}
            className={`portfolio-chip${active === chip ? ' portfolio-chip--active' : ''}`}
            onClick={() => handleChipClick(chip)}
            aria-pressed={active === chip}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ── Tile grid or empty state ────────────────────────────────────── */}
      {visible.length === 0 ? (
        <div className="portfolio-empty scroll-reveal">
          <p>More {active.charAt(0) + active.slice(1).toLowerCase()} work coming soon.</p>
        </div>
      ) : (
        <div className={gridClass}>
          {visible.map((tile, i) => (
            <article
              key={`${tile.id}-${displayed}`}
              className="portfolio-tile"
              style={
                {
                  '--tile-accent': ACCENT[tile.category],
                  ...(phase === 'entering' ? { '--tile-delay': `${i * 0.07}s` } : {}),
                } as React.CSSProperties
              }
            >
              {/* painted swatch fills the 4:3 area */}
              <div className="portfolio-tile-img">
                <PaintedSwatch category={tile.category} />
                {/* category accent stripe at top */}
                <div
                  className="portfolio-tile-stripe"
                  style={{ background: SWATCH[tile.category] }}
                  aria-hidden="true"
                />
                {/* forthcoming overlay */}
                <div className="portfolio-tile-overlay" aria-hidden="true">
                  <span className="portfolio-forthcoming">Photography forthcoming</span>
                </div>
                {/* category badge */}
                <span
                  className="portfolio-tile-badge"
                  style={{ background: SWATCH[tile.category] }}
                >
                  {tile.category}
                </span>
              </div>
              {/* metadata row */}
              <div className="portfolio-tile-meta">
                <span className="portfolio-tile-line1">{tile.line1}</span>
                <span className="portfolio-tile-line2">{tile.line2}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
