'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Catalog item #5 — Wall→Prep→Prime→Paint→Finish animated workflow ──
   Dark-slate background so terracotta dots bloom against it.
   Codrops "horizontal blind" reveal strips — expand from center on entry.
   SVG path draws in on IntersectionObserver entry.
   Dots travel path with rAF, nodes pulse terracotta on arrival.
   Ref: Codrops SVG mask transitions + horizontal blind entry (Scout Round 3 finding 6).
   Frame B: Clarity & Whitespace — premium dark panel contrasts chalk sections.  */

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
/* BUG-018 fix: SVG viewBox is 80×40 user units; path spans ~64 user units.
   Using pathLength="1" normalises the path to 1 unit regardless of geometry,
   so strokeDasharray="1" + strokeDashoffset 1→0 gives a clean draw-in. */
const PATH_LEN = 1

/* 6 horizontal blind strips — each expands from scaleX(0) to scaleX(1) */
const STRIP_COUNT = 6

export default function PaintFlow() {
  const sectionRef = useRef<HTMLElement>(null)
  const [drawn, setDrawn] = useState(false)
  const [blindsOpen, setBlindsOpen] = useState(false)
  const [pulsingNode, setPulsingNode] = useState<number>(-1)
  const [dotPos, setDotPos] = useState(0)

  /* IntersectionObserver — trigger blinds + draw on enter.
     BUG-014 fix: threshold 0.05 fires when just 5% is visible (fires much
     earlier than 0.2, before iOS momentum scroll can blow past the section).
     rootMargin '-20px 0px' provides a small buffer to fire before full entry.
     Opacity transitions have 0s delay so content is visible immediately. */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlindsOpen(true)
          // Minimal delay (100ms) for blinds to start before path draws
          setTimeout(() => setDrawn(true), 100)
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
  const dot2 = dotXY(Math.max(0, dotPos - 0.08))

  return (
    <section
      id="workflow"
      ref={sectionRef}
      style={{
        background: 'var(--color-umber)',
        padding: '5rem 0 4.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3.5rem',
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
                fontSize: '0.875rem',
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
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              color: 'rgba(245,240,234,0.55)',
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
              /* Glow filter for the lead dot */
              filter: 'none',
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="flow-gradient-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C2603A" />
                <stop offset="100%" stopColor="#2D7A70" />
              </linearGradient>
              <filter id="dot-bloom" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track path — subtle dark line */}
            <path
              d={PATH_D}
              stroke="rgba(245,240,234,0.1)"
              strokeWidth="0.5"
              fill="none"
            />

            {/* Animated draw-in overlay — thicker stroke on dark bg.
                pathLength="1" normalises path to 1 unit — dasharray/dashoffset
                values of 1 and 0 map cleanly regardless of viewBox geometry. */}
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

            {/* Lead dot — terracotta with bloom filter */}
            {drawn && (
              <g filter="url(#dot-bloom)">
                {/* Outer bloom ring */}
                <circle
                  cx={dot1.x}
                  cy={dot1.y}
                  r="2.4"
                  fill="rgba(194,96,58,0.25)"
                />
                {/* Core dot */}
                <circle
                  cx={dot1.x}
                  cy={dot1.y}
                  r="0.85"
                  fill="#C2603A"
                />
              </g>
            )}

            {/* Trailing dot — teal */}
            {drawn && dotPos > 0.08 && (
              <circle
                cx={dot2.x}
                cy={dot2.y}
                r="0.48"
                fill="#2D7A70"
                opacity={0.75}
              />
            )}

            {/* Nodes */}
            {NODE_X.map((nx, i) => {
              const isPulsing = pulsingNode === i && drawn
              return (
                <g key={i}>
                  {/* Outer glow ring on pulse */}
                  {isPulsing && (
                    <circle
                      cx={nx}
                      cy={NODE_Y}
                      r="3.8"
                      fill="rgba(194,96,58,0.12)"
                    />
                  )}
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

          {/* Node labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.5rem',
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
                  {/* Icon circle */}
                  <div
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
