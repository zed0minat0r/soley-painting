'use client'

import { useEffect, useRef, useState } from 'react'

/* ── "The Process" timeline — 5-stage paint workflow.
   Auto-advances through each stage. Active station gets intense glow,
   scaled numeral, color-shifted label, fully visible sub-label, and a
   pulsing color-swatch. A traveling spotlight on the connector tracks the
   active station. Cycle: 2.8s per step → 14s full loop. */

const NODE_SWATCHES = ['#244238', '#C9A876', '#F2EBD9', '#C9A876', '#244238']
const STEP_MS = 4800

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
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % NODES.length)
    }, STEP_MS)
    return () => clearInterval(id)
  }, [])

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

        {/* Timeline row — desktop: horizontal, mobile: vertical (CSS handles).
            data-active drives the spotlight position via a CSS variable. */}
        <div
          className="paintflow-row"
          style={
            {
              ['--active' as string]: active,
              ['--count' as string]: NODES.length,
            } as React.CSSProperties
          }
        >
          {/* Connector track — gradient base */}
          <div aria-hidden className="paintflow-track" />
          {/* Spotlight on the connector — translates to the active station's
              center. Width-bound by --count so it sits exactly under each
              station. CSS transitions the transform smoothly. */}
          <div aria-hidden className="paintflow-spotlight" />

          {NODES.map((node, i) => {
            const isActive = i === active
            return (
              <div
                key={node.id}
                className={`paintflow-station${isActive ? ' is-active' : ''}`}
                style={{ ['--swatch' as string]: NODE_SWATCHES[i] } as React.CSSProperties}
                onMouseEnter={() => setActive(i)}
              >
                <span className="paintflow-numeral">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span aria-hidden className="paintflow-halo" />

                <span className="paintflow-disc">
                  <span className="paintflow-disc-inner">
                    {node.icon}
                  </span>
                  {/* Active-state ring burst — scales outward when active */}
                  <span aria-hidden className="paintflow-burst" />
                </span>

                <span className="paintflow-label">{node.label}</span>
                <span className="paintflow-sub">{node.sub}</span>

                <span
                  aria-hidden
                  className="paintflow-swatch"
                  style={{ background: NODE_SWATCHES[i] }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
