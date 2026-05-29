'use client'

import { useRef } from 'react'

/* ── Catalog item #5 — Wall→Prep→Prime→Paint→Finish animated workflow ──
   Dark-slate background so terracotta dots bloom against it.
   Codrops "horizontal blind" reveal strips — expand from center on entry.
   SVG path draws in on IntersectionObserver entry.
   Dots travel path with rAF, nodes pulse terracotta on arrival.
   Frame A additions:
   (1) Animated paint-stroke border around the panel — chalk border draws itself in on entry
   (2) Node-pulse splatter burst — radial dots fanning out when lead dot arrives
   (3) Lead-dot motion-blur ghost trail — translucent copies at decreasing opacity
   (4) Distinct swatch tile per node — each shows which brand color applies at that step
   Ref: Codrops SVG mask transitions + horizontal blind entry (Scout Round 3 finding 6)
       + Scout Site C (Mills) dark premium panel with warm accent rhythm.
   Replaced: simple feGaussianBlur bloom ring on lead dot (was outer glow ring, now splatter) */

const NODE_SWATCHES = ['#244238', '#C9A876', '#F2EBD9', '#C9A876', '#244238']
const NODE_SWATCH_LABELS = ['Rust', 'Ochre', 'Linen', 'Ochre', 'Finish']

const NODES = [
  {
    id: 'wall',
    label: 'Wall',
    sub: 'Surface assessment',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
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
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="16" width="20" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="9" y="19" width="10" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M6 16 Q6 10 14 8 Q22 10 22 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    ),
  },
  {
    id: 'prime',
    label: 'Prime',
    sub: 'Full coverage primer',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="9" y="4" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="11" y="22" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="14" y1="4" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="12" y="7" width="4" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'paint',
    label: 'Paint',
    sub: 'Two full coats',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 20 Q6 8 14 6 Q22 8 23 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 20 Q9 12 14 10 Q19 12 20 20" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
        <line x1="14" y1="20" x2="14" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="14" cy="25" rx="3" ry="1.5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'finish',
    label: 'Finish',
    sub: 'Walkthrough & touch-up',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14 L11 20 L22 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
      </svg>
    ),
  },
]

const NODE_X = [8, 24, 40, 56, 72]
const NODE_Y = 20

function buildPath(nodeXArr: number[], y: number): string {
  const pts = nodeXArr.map((x) => ({ x, y }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const midX = (pts[i - 1].x + pts[i].x) / 2
    d += ` C ${midX} ${pts[i - 1].y - 4}, ${midX} ${pts[i].y - 4}, ${pts[i].x} ${pts[i].y}`
  }
  return d
}

const PATH_D = buildPath(NODE_X, NODE_Y)

export default function PaintFlow() {
  const sectionRef = useRef<HTMLElement>(null)
  // No more intersection-gated entry animations, no rAF traveling dot, no
  // border-draw stagger. Section renders statically the first time it paints.
  const drawn = true
  const blindsOpen = true
  const borderDrawn = true

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
      {/* Animated paint-stroke border — chalk border draws itself in on entry.
          Uses 4 pseudo-border lines (top, right, bottom, left) each animating
          their scaleX/scaleY from 0→1 with staggered delays. */}
      {/* Top border stroke */}
      <div style={{
        position: 'absolute', top: '6px', left: '6px', right: '6px', height: '2px',
        background: 'rgba(244,237,222,0.18)',
        transformOrigin: 'left center',
        transform: borderDrawn ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 0s',
        pointerEvents: 'none',
      }} />
      {/* Right border stroke */}
      <div style={{
        position: 'absolute', top: '6px', right: '6px', bottom: '6px', width: '2px',
        background: 'rgba(244,237,222,0.18)',
        transformOrigin: 'top center',
        transform: borderDrawn ? 'scaleY(1)' : 'scaleY(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.55s',
        pointerEvents: 'none',
      }} />
      {/* Bottom border stroke */}
      <div style={{
        position: 'absolute', bottom: '6px', left: '6px', right: '6px', height: '2px',
        background: 'rgba(244,237,222,0.18)',
        transformOrigin: 'right center',
        transform: borderDrawn ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1) 1.0s',
        pointerEvents: 'none',
      }} />
      {/* Left border stroke */}
      <div style={{
        position: 'absolute', top: '6px', left: '6px', bottom: '6px', width: '2px',
        background: 'rgba(244,237,222,0.18)',
        transformOrigin: 'bottom center',
        transform: borderDrawn ? 'scaleY(1)' : 'scaleY(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1) 1.45s',
        pointerEvents: 'none',
      }} />

      {/* Terracotta top stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-rust), var(--color-ochre))',
        }}
      />

      {/* Horizontal blind reveal strips removed — this was the "horizontal
          blinder effect" the user reported. The entry animation overlaid
          cream strips that scaled away on intersection. Section now renders
          immediately. */}

      <div className="container-width" style={{ position: 'relative', zIndex: 3 }}>
        {/* Header */}
        <div
          className="paintflow-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            opacity: blindsOpen ? 1 : 0,
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
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

        {/* SVG flow diagram */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            opacity: blindsOpen ? 1 : 0,
            transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        >
          <svg
            viewBox="0 0 80 40"
            style={{
              width: '100%',
              height: 'auto',
              overflow: 'visible',
              display: 'block',
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="flow-gradient-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#244238" />
                <stop offset="100%" stopColor="#C9A876" />
              </linearGradient>
            </defs>

            {/* Track path — subtle dark line */}
            <path
              d={PATH_D}
              stroke="rgba(244,237,222,0.1)"
              strokeWidth="0.5"
              fill="none"
            />

            {/* Static gradient overlay — line is fully drawn, no animation */}
            <path
              d={PATH_D}
              stroke="url(#flow-gradient-dark)"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
            />

            {/* Static nodes — no traveling dot, no pulsing, no splatter */}
            {NODE_X.map((nx, i) => (
              <g key={i}>
                <circle
                  cx={nx}
                  cy={NODE_Y}
                  r={2.3}
                  fill="var(--color-umber)"
                  stroke="rgba(244,237,222,0.35)"
                  strokeWidth={0.4}
                />
                <circle
                  cx={nx}
                  cy={NODE_Y}
                  r={0.65}
                  fill="rgba(244,237,222,0.55)"
                />
              </g>
            ))}
          </svg>

          {/* Node labels + swatch tiles */}
          <div
            className="paintflow-node-labels"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {NODES.map((node, i) => {
              const isPulsing = false  // no traveling-dot pulse anymore
              return (
                <div
                  key={node.id}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: drawn ? 1 : 0.3,
                  }}
                >
                  {/* Color swatch tile — distinct per node */}
                  <div
                    style={{
                      width: '28px',
                      height: '8px',
                      borderRadius: '2px',
                      background: NODE_SWATCHES[i],
                      opacity: isPulsing ? 1 : 0.4,
                      transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      marginBottom: '2px',
                      boxShadow: isPulsing ? `0 0 10px ${NODE_SWATCHES[i]}80` : 'none',
                    }}
                    title={NODE_SWATCH_LABELS[i]}
                  />

                  {/* Icon circle */}
                  <div
                    className="paintflow-node-icon"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: isPulsing ? 'rgba(194,96,58,0.16)' : 'rgba(244,237,222,0.06)',
                      border: isPulsing ? '1px solid rgba(194,96,58,0.55)' : '1px solid rgba(244,237,222,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isPulsing ? '#2E5247' : 'rgba(244,237,222,0.65)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isPulsing ? 'scale(1.18)' : 'scale(1)',
                      boxShadow: isPulsing ? '0 0 14px rgba(194,96,58,0.35)' : 'none',
                    }}
                  >
                    {node.icon}
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: isPulsing ? '#2E5247' : 'rgba(244,237,222,0.8)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {node.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'rgba(244,237,222,0.4)',
                      textAlign: 'center',
                      lineHeight: 1.4,
                    }}
                  >
                    {node.sub}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
