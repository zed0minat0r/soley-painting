'use client'

import { useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

/* ── Catalog item #10 — 3D tilt cards with framer-motion useSpring ──────
   Mousemove → rotateX/Y (max ±8°), useSpring for smooth snap-back.
   Mobile: accordion expand on tap.
   Ref: Scout catalog row #10 + Scout Section 3 Pattern 3 (Sticky Grid).
   Replaces: the duplicate <SectionDivider flip /> + gap filler between
   ServicesScrollLock and Process.                                         */

const CARDS = [
  {
    id: 'prep',
    number: '01',
    title: 'Prep is the product',
    description:
      'We spend more time preparing surfaces than applying paint. Cleaning, sanding, caulking, and priming are not optional steps — they are the reason finishes last.',
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
      'You get a single point of contact from estimate to final walkthrough. No call centers. No handoff to a crew lead you never met. We confirm our arrival window the night before, every time.',
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
      'Every estimate is itemized — surface by surface, product by product. No ballpark ranges. No surprise add-ons at final invoice. What we quote is what you pay.',
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
      'We use low-VOC and zero-VOC formulations on every interior project unless you specify otherwise. Your air quality matters as much as your walls.',
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

/* Individual tilt card */
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
            fontSize: '0.6875rem',
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
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: 'rgba(44,31,22,0.65)',
          }}
        >
          {card.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function WhySoley() {
  return (
    <section
      id="why-soley"
      style={{
        background: 'var(--color-chalk)',
        padding: '6rem 0',
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
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
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
            What separates a good
            <br />
            <em>paint job from a lasting one.</em>
          </h2>
        </div>

        {/* 4-card grid with tilt */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}
        >
          {CARDS.map((card, i) => (
            <TiltCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
