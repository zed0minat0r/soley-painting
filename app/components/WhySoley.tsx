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
    id: 'prep',
    number: '01',
    title: 'Prep is the product',
    description:
      'We spend more time preparing surfaces than applying paint. That means two-coat primer on bare drywall, sanding between coats, and fresh caulk on every gap before a brush touches the wall. These steps are why finishes last.',
    accent: 'var(--color-terra)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="3" y="22" width="26" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 22 L8 10 Q8 6 16 6 Q24 6 24 10 L24 22" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 14 L24 14" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <path d="M10 18 L22 18" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id: 'contact',
    number: '02',
    title: 'One person, start to finish',
    description:
      'One person runs your project from estimate to punch-list. No call centers, no crew-lead handoffs. You get a confirmed arrival window the night before — not a four-hour "sometime in the morning" block.',
    accent: 'var(--color-teal)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M5 28 Q5 20 16 20 Q27 20 27 28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M21 13 L24 16 L28 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'honest',
    number: '03',
    title: 'Written quotes, line by line',
    description:
      'Every estimate breaks down each surface, square footage, and product separately. You see exactly what you are paying for before we start. The final invoice matches the quote — line for line.',
    accent: 'var(--color-gold)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="4" width="20" height="24" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M10 10 L22 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M10 14 L22 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M10 18 L18 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M14 22 L19 22 L22 25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'voc',
    number: '04',
    title: 'Low-VOC by default',
    description:
      'Every interior project uses low-VOC or zero-VOC paint — not as an upgrade, not by request. We choose cleaner formulations as the standard because your home is where you breathe.',
    accent: 'var(--color-teal)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 Q20 10 20 16 Q20 22 16 26 Q12 22 12 16 Q12 10 16 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 12 Q12 14 16 12 Q20 10 24 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <path d="M8 18 Q12 20 16 18 Q20 16 24 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
        <circle cx="16" cy="17" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6"/>
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
        className="scroll-reveal"
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

        {/* Card number — foreground, full opacity (per RULE 8, NO ghost) */}
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: card.accent,
            marginBottom: '1.25rem',
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
            background: 'rgba(44,31,22,0.04)',
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
      className="scroll-reveal"
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
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: card.accent,
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
            transition: 'transform 0.3s ease',
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
        padding: '7rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Diagonal accent strip */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-terra) 30%, var(--color-teal) 70%, transparent)',
        }}
      />

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
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-terra)',
              marginBottom: '0.875rem',
            }}
          >
            Why Soley
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
          className="why-soley-grid why-soley-desktop"
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
                background: 'radial-gradient(circle, rgba(194,96,58,0.07) 0%, transparent 70%)',
                transform: 'translate(calc(var(--spotlight-x, -9999px) - 200px), calc(var(--spotlight-y, -9999px) - 200px))',
                opacity: 'var(--spotlight-opacity, 0)' as React.CSSProperties['opacity'],
                transition: 'opacity 0.3s ease',
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
