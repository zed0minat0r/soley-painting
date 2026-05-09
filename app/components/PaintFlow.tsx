'use client'

import { useEffect, useRef, useState } from 'react'

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

const NODE_SWATCHES = ['#C2603A', '#B8935A', '#F5F0EA', '#2D7A70', '#B8935A']
const NODE_SWATCH_LABELS = ['Terra', 'Gold', 'Chalk', 'Teal', 'Finish']

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
const PATH_LEN = 1

const STRIP_COUNT = 6

/* Splatter burst — 7 micro-dots fan out from node on arrival */
const SPLATTER_ANGLES = [0, 51, 103, 154, 205, 257, 308]
const SPLATTER_RADIUS = 4.5

/* Ghost trail — 5 copies at decreasing opacity behind the lead dot */
const GHOST_OFFSETS = [0.018, 0.035, 0.052, 0.068, 0.082]
const GHOST_OPACITIES = [0.5, 0.35, 0.22, 0.13, 0.06]

export default function PaintFlow() {
  const sectionRef = useRef<HTMLElement>(null)
  const [drawn, setDrawn] = useState(false)
  const [blindsOpen, setBlindsOpen] = useState(false)
  const [pulsingNode, setPulsingNode] = useState<number>(-1)
  const [dotPos, setDotPos] = useState(0)
  const [borderDrawn, setBorderDrawn] = useState(false)

  /* IntersectionObserver */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlindsOpen(true)
          setTimeout(() => setDrawn(true), 100)
          setTimeout(() => setBorderDrawn(true), 250)
        }
      },
      { threshold: 0.05, rootMargin: '-20px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Dot animation — rAF loop when drawn */
  useEffect(() => {
    if (!drawn) return
    let start: number | null = null
    const duration = 3200
    let raf: number

    function tick(ts: number) {
      if (start === null) start = ts
      const elapsed = (ts - start) % (duration + 1600)
      const progress = Math.min(elapsed / duration, 1)
      setDotPos(progress)

      const nodeIdx = Math.round(progress * (NODE_X.length - 1))
      setPulsingNode(nodeIdx)

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [drawn])

  function dotXY(t: number) {
    const segment = t * (NODE_X.length - 1)
    const i = Math.min(Math.floor(segment), NODE_X.length - 2)
    const frac = segment - i
    const x = NODE_X[i] + (NODE_X[i + 1] - NODE_X[i]) * frac
    return { x, y: NODE_Y }
  }

  const dot1 = dotXY(dotPos)

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
        background: 'rgba(245,240,234,0.18)',
        transformOrigin: 'left center',
        transform: borderDrawn ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 0s',
        pointerEvents: 'none',
      }} />
      {/* Right border stroke */}
      <div style={{
        position: 'absolute', top: '6px', right: '6px', bottom: '6px', width: '2px',
        background: 'rgba(245,240,234,0.18)',
        transformOrigin: 'top center',
        transform: borderDrawn ? 'scaleY(1)' : 'scaleY(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.55s',
        pointerEvents: 'none',
      }} />
      {/* Bottom border stroke */}
      <div style={{
        position: 'absolute', bottom: '6px', left: '6px', right: '6px', height: '2px',
        background: 'rgba(245,240,234,0.18)',
        transformOrigin: 'right center',
        transform: borderDrawn ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1) 1.0s',
        pointerEvents: 'none',
      }} />
      {/* Left border stroke */}
      <div style={{
        position: 'absolute', top: '6px', left: '6px', bottom: '6px', width: '2px',
        background: 'rgba(245,240,234,0.18)',
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
          background: 'linear-gradient(90deg, var(--color-terra), var(--color-teal))',
        }}
      />

      {/* Horizontal blind reveal strips — Codrops pattern */}
      {Array.from({ length: STRIP_COUNT }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: `${(i / STRIP_COUNT) * 100}%`,
            left: 0,
            right: 0,
            height: `${100 / STRIP_COUNT}%`,
            background: 'var(--color-chalk)',
            transformOrigin: 'center',
            transform: blindsOpen ? 'scaleY(0)' : 'scaleY(1)',
            transition: `transform 0.55s cubic-bezier(0.77,0,0.18,1) ${i * 0.07}s`,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      ))}

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
            transition: 'opacity 0.4s ease 0.1s',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-terra)',
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
              <em style={{ color: 'var(--color-terra)' }}>nothing skipped.</em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.72,
              color: 'rgba(245,240,234,0.55)',
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
            transition: 'opacity 0.4s ease 0.15s',
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
                <stop offset="0%" stopColor="#C2603A" />
                <stop offset="100%" stopColor="#2D7A70" />
              </linearGradient>
            </defs>

            {/* Track path — subtle dark line */}
            <path
              d={PATH_D}
              stroke="rgba(245,240,234,0.1)"
              strokeWidth="0.5"
              fill="none"
            />

            {/* Animated draw-in overlay */}
            <path
              d={PATH_D}
              stroke="url(#flow-gradient-dark)"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              pathLength={PATH_LEN}
              style={{
                strokeDasharray: PATH_LEN,
                strokeDashoffset: drawn ? 0 : PATH_LEN,
                transition: drawn ? 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)' : 'none',
              }}
            />

            {/* Ghost trail — 5 translucent copies trailing behind lead dot */}
            {drawn && GHOST_OFFSETS.map((offset, gi) => {
              const ghostT = Math.max(0, dotPos - offset)
              const ghostPos = dotXY(ghostT)
              const ghostRadius = 0.85 * (1 - gi * 0.12)
              return (
                <circle
                  key={`ghost-${gi}`}
                  cx={ghostPos.x}
                  cy={ghostPos.y}
                  r={ghostRadius}
                  fill="#C2603A"
                  opacity={GHOST_OPACITIES[gi]}
                />
              )
            })}

            {/* Lead dot — terracotta, no bloom filter (replaced by ghost trail + splatter) */}
            {drawn && (
              <>
                {/* Warm glow ring */}
                <circle
                  cx={dot1.x}
                  cy={dot1.y}
                  r="2.0"
                  fill="rgba(194,96,58,0.20)"
                />
                {/* Core dot */}
                <circle
                  cx={dot1.x}
                  cy={dot1.y}
                  r="0.85"
                  fill="#C2603A"
                />
              </>
            )}

            {/* Nodes */}
            {NODE_X.map((nx, i) => {
              const isPulsing = pulsingNode === i && drawn
              return (
                <g key={i}>
                  {/* Splatter burst — 7 micro-dots radiate outward on node pulse */}
                  {isPulsing && SPLATTER_ANGLES.map((angle, si) => {
                    const rad = (angle * Math.PI) / 180
                    const dx = Math.cos(rad) * SPLATTER_RADIUS
                    const dy = Math.sin(rad) * SPLATTER_RADIUS
                    const splatterR = 0.25 + (si % 3) * 0.1
                    return (
                      <circle
                        key={`splat-${si}`}
                        cx={nx + dx}
                        cy={NODE_Y + dy}
                        r={splatterR}
                        fill="#C2603A"
                        opacity={0.55}
                      />
                    )
                  })}
                  {/* Node ring */}
                  <circle
                    cx={nx}
                    cy={NODE_Y}
                    r={isPulsing ? 2.9 : 2.3}
                    fill="var(--color-umber)"
                    stroke={isPulsing ? '#C2603A' : 'rgba(245,240,234,0.25)'}
                    strokeWidth={isPulsing ? 0.55 : 0.4}
                    style={{
                      transition: 'r 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease',
                    }}
                  />
                  {/* Node center */}
                  <circle
                    cx={nx}
                    cy={NODE_Y}
                    r={isPulsing ? 1.0 : 0.65}
                    fill={isPulsing ? '#C2603A' : 'rgba(245,240,234,0.4)'}
                    style={{ transition: 'r 0.25s ease, fill 0.25s ease' }}
                  />
                </g>
              )
            })}
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
              const isPulsing = pulsingNode === i && drawn
              return (
                <div
                  key={node.id}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.3s ease',
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
                      transition: 'opacity 0.3s ease',
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
                      background: isPulsing ? 'rgba(194,96,58,0.16)' : 'rgba(245,240,234,0.06)',
                      border: isPulsing ? '1px solid rgba(194,96,58,0.55)' : '1px solid rgba(245,240,234,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isPulsing ? '#C2603A' : 'rgba(245,240,234,0.65)',
                      transition: 'all 0.3s ease',
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
                      color: isPulsing ? '#C2603A' : 'rgba(245,240,234,0.8)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {node.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8125rem',
                      color: 'rgba(245,240,234,0.4)',
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
