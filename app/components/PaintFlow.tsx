'use client'

import { useRef } from 'react'

/* ── "The Process" timeline — 5-stage paint workflow.
   Each station shows: foreground numeral (01-05), large glowing icon orbit,
   color swatch puddle, label + sublabel. Connector between stations is a
   thick gradient track with a flowing ochre pulse animated across it.
   Background carries radial atmosphere pools so the row reads as illuminated
   stations on a dark studio floor, not flat dots on a line. */

const NODE_SWATCHES = ['#244238', '#C9A876', '#F2EBD9', '#C9A876', '#244238']

const NODES = [
  {
    id: 'wall',
    label: 'Wall',
    sub: 'Surface assessment',
    icon: (
      <svg width="38" height="38" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <line x1="3" y1="10" x2="25" y2="10" stroke="currentColor" strokeWidth="1.2" />
        <line x1="3" y1="17" x2="25" y2="17" stroke="currentColor" strokeWidth="1.2" />
        <line x1="14" y1="3" x2="14" y2="10" stroke="currentColor" strokeWidth="1.2" />
        <line x1="14" y1="17" x2="14" y2="25" stroke="currentColor" strokeWidth="1.2" />
        <line x1="8" y1="10" x2="8" y2="17" stroke="currentColor" strokeWidth="1.2" />
        <line x1="20" y1="10" x2="20" y2="17" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: 'prep',
    label: 'Prep',
    sub: 'Sand, caulk, prime',
    icon: (
      <svg width="38" height="38" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="16" width="20" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <rect x="9" y="19" width="10" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M6 16 Q6 10 14 8 Q22 10 22 16" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },
  {
    id: 'prime',
    label: 'Prime',
    sub: 'Full coverage primer',
    icon: (
      <svg width="38" height="38" viewBox="0 0 28 28" fill="none">
        <rect x="9" y="4" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <rect x="11" y="22" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <line x1="14" y1="4" x2="14" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="12" y="7" width="4" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'paint',
    label: 'Paint',
    sub: 'Two full coats',
    icon: (
      <svg width="38" height="38" viewBox="0 0 28 28" fill="none">
        <path d="M5 20 Q6 8 14 6 Q22 8 23 20" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M8 20 Q9 12 14 10 Q19 12 20 20" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.18" />
        <line x1="14" y1="20" x2="14" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="14" cy="25" rx="3" ry="1.5" fill="currentColor" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: 'finish',
    label: 'Finish',
    sub: 'Walkthrough & touch-up',
    icon: (
      <svg width="38" height="38" viewBox="0 0 28 28" fill="none">
        <path d="M6 14 L11 20 L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.45" />
      </svg>
    ),
  },
]

export default function PaintFlow() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="paintflow-section"
      style={{
        background: 'var(--color-umber)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric pools — large radial gradients behind the timeline row.
          These bloom warm ochre / cool forest pools so each station feels lit
          from below rather than floating on flat dark green. */}
      <div
        aria-hidden
        className="paintflow-atmosphere"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 40% 60% at 12% 78%, rgba(201,168,118,0.10) 0%, transparent 70%),' +
            'radial-gradient(ellipse 40% 60% at 50% 80%, rgba(201,168,118,0.08) 0%, transparent 70%),' +
            'radial-gradient(ellipse 40% 60% at 88% 78%, rgba(94,138,113,0.10) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      <div className="container-width" style={{ position: 'relative', zIndex: 3 }}>
        {/* Header */}
        <div className="paintflow-header">
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-ochre)',
                marginBottom: '0.75rem',
              }}
            >
              The process
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: 'var(--color-chalk)',
                lineHeight: 1.1,
              }}
            >
              Wall to finish —<br />
              <em style={{ color: 'var(--color-ochre)' }}>nothing skipped.</em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.72,
              color: 'rgba(244,237,222,0.55)',
              maxWidth: '34ch',
            }}
          >
            Every project runs this sequence — no steps cut, no order
            swapped. The coat you don&apos;t see is what makes the one you do last.
          </p>
        </div>

        {/* Timeline row */}
        <div className="paintflow-row" style={{ position: 'relative' }}>
          {/* Connector — thick gradient track with an animated ochre pulse
              flowing left → right. Layer 1: base gradient track. Layer 2:
              traveling pulse (a translucent ochre highlight at 28% width
              that animates background-position across the full row). */}
          <div
            aria-hidden
            className="paintflow-track"
            style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              top: 'var(--paintflow-track-y, 96px)',
              height: '3px',
              borderRadius: '999px',
              background:
                'linear-gradient(90deg, rgba(36,66,56,0.85) 0%, rgba(201,168,118,0.85) 50%, rgba(36,66,56,0.85) 100%)',
              boxShadow: '0 0 18px rgba(201,168,118,0.3), 0 0 4px rgba(201,168,118,0.45)',
              zIndex: 1,
            }}
          />
          <div
            aria-hidden
            className="paintflow-track-pulse"
            style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              top: 'var(--paintflow-track-y, 96px)',
              height: '3px',
              borderRadius: '999px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(242,235,217,0.85) 50%, transparent 100%)',
              backgroundSize: '28% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '-30% 0',
              animation: 'paintflow-pulse-flow 4.5s linear infinite',
              zIndex: 2,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
            }}
          />

          {NODES.map((node, i) => (
            <div key={node.id} className="paintflow-station">
              {/* Foreground numeral — large ochre serif italic, full opacity.
                  NOT a ghost number — sits above the icon as a strong visual
                  anchor for the step order. */}
              <span className="paintflow-numeral">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Glow orbit — radial halo behind the icon circle */}
              <span aria-hidden className="paintflow-halo" />

              {/* Icon disc — 80px desktop, scales down on mobile. Double ring
                  effect: a thick gradient outer ring and an inner solid disc. */}
              <span className="paintflow-disc">
                <span className="paintflow-disc-ring" />
                <span className="paintflow-disc-inner">
                  {node.icon}
                </span>
              </span>

              {/* Label block */}
              <span className="paintflow-label">{node.label}</span>
              <span className="paintflow-sub">{node.sub}</span>

              {/* Color swatch — bigger paint-drip below the sub label.
                  Shows which palette tone applies at this step. */}
              <span
                className="paintflow-swatch"
                style={{
                  background: NODE_SWATCHES[i],
                  boxShadow: `0 0 14px ${NODE_SWATCHES[i]}66, 0 2px 4px rgba(0,0,0,0.45)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
