'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Catalog item #5 — Wall→Prep→Prime→Paint→Finish animated workflow ──
   SVG path with stroke-dashoffset draw-in on IntersectionObserver entry.
   Dots travel the path with animateMotion, nodes pulse on arrival.
   Ref: Scout section 1 — Codrops pattern + Penn Tech animated workflow.  */

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

/* Node x positions as percent of SVG width (we'll use 80 wide SVG) */
const NODE_X = [8, 24, 40, 56, 72] // in SVG units out of 80
const NODE_Y = 20 // SVG height 40, nodes at center

/* Build a curved path string through all node points */
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
// Approximate path length for stroke-dashoffset animation
const PATH_LEN = 750

export default function PaintFlow() {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [drawn, setDrawn] = useState(false)
  const [pulsingNode, setPulsingNode] = useState<number>(-1)
  const [dotPos, setDotPos] = useState(0) // 0→1 along path

  /* IntersectionObserver — draw-in on enter */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true)
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Dot animation — runs in rAF loop when drawn */
  useEffect(() => {
    if (!drawn) return
    let start: number | null = null
    const duration = 3200 // ms for one full trip
    let raf: number

    function tick(ts: number) {
      if (start === null) start = ts
      const elapsed = (ts - start) % (duration + 1600) // 1.6s pause at end
      const progress = Math.min(elapsed / duration, 1)
      setDotPos(progress)

      // Pulse nodes as dot passes through
      const nodeIdx = Math.round(progress * (NODE_X.length - 1))
      setPulsingNode(nodeIdx)

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [drawn])

  /* Compute dot SVG position from progress (approximate along path) */
  function dotXY(t: number) {
    // Simple piecewise linear interpolation across node positions
    const segment = t * (NODE_X.length - 1)
    const i = Math.min(Math.floor(segment), NODE_X.length - 2)
    const frac = segment - i
    const x = NODE_X[i] + (NODE_X[i + 1] - NODE_X[i]) * frac
    const y = NODE_Y
    return { x, y }
  }

  const dot1 = dotXY(dotPos)
  const dot2 = dotXY(Math.max(0, dotPos - 0.08)) // trailing dot

  return (
    <section
      id="workflow"
      ref={sectionRef}
      style={{
        background: 'var(--color-chalk)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Warm terracotta top stripe */}
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

      <div className="container-width">
        {/* Header */}
        <div
          className="scroll-reveal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
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
                color: 'var(--color-umber)',
                lineHeight: 1.1,
              }}
            >
              Wall to finish —<br />
              <em>nothing skipped.</em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'rgba(44,31,22,0.6)',
              maxWidth: '34ch',
            }}
          >
            Every project follows the same disciplined sequence. The coat you
            don&apos;t see is what makes the one you do last.
          </p>
        </div>

        {/* SVG flow diagram */}
        <div
          style={{
            position: 'relative',
            width: '100%',
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
            {/* Track path — draws in */}
            <path
              ref={pathRef}
              d={PATH_D}
              stroke="rgba(44,31,22,0.12)"
              strokeWidth="0.4"
              fill="none"
            />
            {/* Animated draw-in overlay */}
            <path
              d={PATH_D}
              stroke="url(#flow-gradient)"
              strokeWidth="0.5"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: PATH_LEN,
                strokeDashoffset: drawn ? 0 : PATH_LEN,
                transition: drawn ? 'stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)' : 'none',
              }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-terra)" />
                <stop offset="100%" stopColor="var(--color-teal)" />
              </linearGradient>
              <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-terra)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--color-terra)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Traveling dot 1 (lead) */}
            {drawn && (
              <>
                {/* Glow halo */}
                <circle
                  cx={dot1.x}
                  cy={dot1.y}
                  r="1.8"
                  fill="url(#dot-glow)"
                />
                <circle
                  cx={dot1.x}
                  cy={dot1.y}
                  r="0.7"
                  fill="var(--color-terra)"
                />
              </>
            )}

            {/* Traveling dot 2 (trailing, teal) */}
            {drawn && dotPos > 0.08 && (
              <circle
                cx={dot2.x}
                cy={dot2.y}
                r="0.45"
                fill="var(--color-teal)"
                opacity={0.7}
              />
            )}

            {/* Nodes */}
            {NODE_X.map((nx, i) => {
              const isPulsing = pulsingNode === i && drawn
              return (
                <g key={i}>
                  {/* Node ring */}
                  <circle
                    cx={nx}
                    cy={NODE_Y}
                    r={isPulsing ? 2.6 : 2.2}
                    fill="var(--color-chalk)"
                    stroke={isPulsing ? 'var(--color-terra)' : 'rgba(44,31,22,0.2)'}
                    strokeWidth={isPulsing ? 0.5 : 0.35}
                    style={{
                      transition: 'r 0.25s ease, stroke 0.25s ease',
                    }}
                  />
                  {/* Node center dot */}
                  <circle
                    cx={nx}
                    cy={NODE_Y}
                    r={isPulsing ? 0.9 : 0.6}
                    fill={isPulsing ? 'var(--color-terra)' : 'rgba(44,31,22,0.35)'}
                    style={{ transition: 'r 0.25s ease, fill 0.25s ease' }}
                  />
                </g>
              )
            })}
          </svg>

          {/* Node labels — positioned below SVG via absolute layout */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.25rem',
              paddingLeft: '0%',
              paddingRight: '0%',
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
                    opacity: drawn ? 1 : 0.4,
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: isPulsing ? 'rgba(194,96,58,0.12)' : 'rgba(44,31,22,0.05)',
                      border: isPulsing ? '1px solid rgba(194,96,58,0.4)' : '1px solid rgba(44,31,22,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isPulsing ? 'var(--color-terra)' : 'var(--color-umber)',
                      transition: 'all 0.3s ease',
                      transform: isPulsing ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {node.icon}
                  </div>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: isPulsing ? 'var(--color-terra)' : 'var(--color-umber)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {node.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.7rem',
                      color: 'rgba(44,31,22,0.5)',
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
