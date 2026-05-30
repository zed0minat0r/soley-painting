'use client'

import { useRef, useCallback, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

/* ── Catalog item #10 — 3D tilt cards with framer-motion useSpring ──────
   Desktop: Mousemove → rotateX/Y (max ±8°), useSpring for smooth snap-back.
   Mobile (≤640px): accordion expand on tap — each card header always visible,
   description body expands/collapses via CSS max-height transition.
   aria-expanded + aria-controls for accessibility.
   All 4 cards, all content preserved (Frame B richness rule).
   Ref: Scout catalog row #10 + Scout Section 3 Pattern 3 (Sticky Grid).   */

const CARDS = [
  {
    id: 'years',
    number: '01',
    title: '15+ years in business',
    description:
      'Sean Soley has been painting homes and commercial spaces in South Eastern PA for over fifteen years. That experience shows up in surface prep, finish quality, and a written quote that matches the final invoice.',
    accent: 'var(--color-terra)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M16 8 L16 16 L21 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'quality',
    number: '02',
    title: 'Quality work, fair price',
    description:
      'Honest quotes, no upsells, no surprise line items. We spend the time on surface prep that makes the finish coat last — and we don\'t cut corners just because the budget is tight.',
    accent: 'var(--color-ochre)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 L19.2 12.3 L28 13 L21.3 18.7 L23.5 27 L16 22.5 L8.5 27 L10.7 18.7 L4 13 L12.8 12.3 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 'insured',
    number: '03',
    title: 'Fully insured, every job',
    description:
      'Liability coverage on every project, residential or commercial. Floors, furniture, and trim protected on every day of the job. You get the paperwork on request — and you never have to ask twice.',
    accent: 'var(--color-gold)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 L26 8 L26 17 Q26 24 16 28 Q6 24 6 17 L6 8 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        <path d="M11 16 L15 20 L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'local',
    number: '04',
    title: 'Locally owned & operated',
    description:
      'Sean answers the phone. Sean walks the job. Sean is on site, start to finish. No call centers, no sub-contracted crews you have never met. South Eastern PA is home — your house is right next door.',
    accent: 'var(--color-rust)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 5 L4 15 L7 15 L7 26 L13 26 L13 19 L19 19 L19 26 L25 26 L25 15 L28 15 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
]

/* ── Desktop tilt card (unchanged from prior cycle) ─────────────────── */
function TiltCard({ card, index }: { card: typeof CARDS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const rotX = useSpring(0, { damping: 25, stiffness: 300 })
  const rotY = useSpring(0, { damping: 25, stiffness: 300 })
  const scale = useSpring(1, { damping: 25, stiffness: 300 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    rotY.set(dx * 8)
    rotX.set(-dy * 8)
    scale.set(1.025)
  }

  function handleMouseLeave() {
    rotX.set(0)
    rotY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        scale,
        perspective: 800,
        transformStyle: 'preserve-3d',
        flex: '1 1 240px',
        minWidth: 0,
      }}
    >
      <div
        style={{
          background: 'var(--color-chalk)',
          border: '1px solid rgba(44,31,22,0.1)',
          padding: '2.25rem 2rem',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transitionDelay: `${index * 0.1}s`,
          cursor: 'default',
        }}
      >
        {/* Accent bar left edge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '3px',
            background: card.accent,
          }}
        />
        {/* Accent bar top edge — pairs with left bar for corner-to-corner brand presence */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${card.accent}, transparent 60%)`,
          }}
        />

        {/* Card number — commanding display size, foreground, full opacity (per RULE 8, NO ghost) */}
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: card.accent,
            lineHeight: 1,
            marginBottom: '1rem',
          }}
        >
          {card.number}
        </span>

        {/* Icon */}
        <div
          style={{
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-umber)',
            marginBottom: '1.25rem',
            background: 'rgba(44,31,22,0.07)',
            borderRadius: '4px',
          }}
        >
          {card.icon}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)',
            color: 'var(--color-umber)',
            lineHeight: 1.2,
            marginBottom: '0.875rem',
          }}
        >
          {card.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.72,
            color: 'rgba(44,31,22,0.65)',
          }}
        >
          {card.description}
        </p>
      </div>
    </motion.div>
  )
}

/* ── Mobile accordion card (≤640px) ────────────────────────────────── */
function AccordionCard({
  card,
  isOpen,
  onToggle,
}: {
  card: typeof CARDS[0]
  isOpen: boolean
  onToggle: () => void
}) {
  const descId = `why-desc-${card.id}`

  return (
    <div
      style={{
        background: 'var(--color-chalk)',
        border: '1px solid rgba(44,31,22,0.1)',
        borderLeft: `3px solid ${card.accent}`,
        overflow: 'hidden',
      }}
    >
      {/* Header — always visible, acts as tap target */}
      <button
        aria-expanded={isOpen}
        aria-controls={descId}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          padding: '1.25rem 1.25rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          minHeight: '44px',
        }}
      >
        {/* Icon tile */}
        <div
          style={{
            width: '40px',
            height: '40px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(44,31,22,0.04)',
            borderRadius: '4px',
            color: 'var(--color-umber)',
          }}
        >
          {card.icon}
        </div>

        {/* Title + number */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: card.accent,
              lineHeight: 1,
              marginBottom: '0.2rem',
            }}
          >
            {card.number}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.125rem',
              color: 'var(--color-umber)',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {card.title}
          </h3>
        </div>

        {/* Chevron */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            color: card.accent,
          }}
        >
          <path d="M4 6.5L9 11.5L14 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Body — collapses/expands via max-height */}
      <div
        id={descId}
        role="region"
        style={{
          maxHeight: isOpen ? '200px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.72,
            color: 'rgba(44,31,22,0.65)',
            padding: '0 1.25rem 1.25rem',
            margin: 0,
          }}
        >
          {card.description}
        </p>
      </div>
    </div>
  )
}

export default function WhySoley() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [openId, setOpenId] = useState<string | null>('prep') // first card open by default

  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    if (!grid) return
    const rect = grid.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    grid.style.setProperty('--spotlight-x', `${x}px`)
    grid.style.setProperty('--spotlight-y', `${y}px`)
    grid.style.setProperty('--spotlight-opacity', '1')
  }, [])

  const handleGridMouseLeave = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return
    grid.style.setProperty('--spotlight-opacity', '0')
  }, [])

  return (
    <section
      id="why-soley"
      style={{
        background: 'var(--color-chalk)',
        padding: 'clamp(3.5rem, 7vw, 5rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section-bottom accent strip removed — read as a hairline at the
          top of the SmoothEdge bridge below this section. */}

      <div className="container-width">
        {/* Section header */}
        <div
          className="scroll-reveal"
          style={{
            maxWidth: '56ch',
            marginBottom: '3.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-terra)',
              marginBottom: '0.875rem',
            }}
          >
            Why Soley&rsquo;s
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
              color: 'var(--color-umber)',
              lineHeight: 1.1,
            }}
          >
            The difference between a
            <br />
            <em>paint job and a lasting finish.</em>
          </h2>
        </div>

        {/* Desktop: 4-card grid with tilt + spotlight (hidden on ≤640px) */}
        <div
          ref={gridRef}
          onMouseMove={handleGridMouseMove}
          onMouseLeave={handleGridMouseLeave}
          className="why-soley-desktop"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            alignItems: 'stretch',
            position: 'relative',
          }}
        >
          {/* Spotlight blob — follows cursor across container */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 0,
              overflow: 'hidden',
              borderRadius: '4px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(36,66,56,0.08) 0%, transparent 70%)',
                transform: 'translate(calc(var(--spotlight-x, -9999px) - 200px), calc(var(--spotlight-y, -9999px) - 200px))',
                opacity: 'var(--spotlight-opacity, 0)' as React.CSSProperties['opacity'],
                transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
              }}
            />
          </div>
          {CARDS.map((card, i) => (
            <TiltCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Mobile: accordion stack (shown only on ≤640px) */}
        <div
          className="why-soley-accordion"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
        >
          {CARDS.map((card) => (
            <AccordionCard
              key={card.id}
              card={card}
              isOpen={openId === card.id}
              onToggle={() => setOpenId(openId === card.id ? null : card.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
