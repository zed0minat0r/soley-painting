'use client'

import { useEffect, useRef, useState } from 'react'

/* Catalog item #3 — Paint-drop dividers with parallax hairlines
   Frame A: Visual Drama — gloss-highlight teardrops, high-contrast traveling pulses,
   dual-hairline parallax (top line drifts right, bottom line drifts left at constant speed).
   Ref: Scout Site E (Paint Denver) warm→neutral section rhythm + Codrops SVG mask depth.
   IntersectionObserver-gated for perf. */

const DROPS = [
  { color: '#BF5B38', highlight: '#E8906A', delay: 0 },     // rust
  { color: '#B8884A', highlight: '#D4B07A', delay: 0.15 },  // ochre (replaced teal)
  { color: '#B8884A', highlight: '#CFA96A', delay: 0.3 },   // ochre warm
]

export default function SectionDivider({ flip = false }: { flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [lineOffset, setLineOffset] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Constant-velocity parallax for the hairlines — no sin/lerp.
     Top line drifts right at 18px/s, bottom at -18px/s.
     We track a single offset; top line uses +offset, bottom uses -offset,
     capped at ±24px so they never disappear off screen center. */
  useEffect(() => {
    if (!active) return
    const SPEED = 18 // px per second

    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts
      const elapsed = (ts - startRef.current) / 1000
      // Oscillate between -24 and +24 by bouncing at constant velocity
      const period = 48 / SPEED // seconds for one full cycle
      const pos = (elapsed % period) * SPEED
      // 0→24: moving right; 24→48: moving left (bounce via triangle wave)
      const half = 24
      const raw = pos <= half ? pos : 2 * half - pos
      setLineOffset(raw - half / 2) // centers around 0 → range ≈ -12 to +12
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  const bg = flip ? 'var(--color-umber)' : 'var(--color-chalk)'
  const hairlineOpacity = flip ? 'rgba(245,240,234,0.18)' : 'rgba(44,31,22,0.12)'

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height: '96px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: bg,
      }}
    >
      {/* Top hairline — drifts right at constant velocity */}
      <div
        style={{
          position: 'absolute',
          left: `calc(-6% + ${lineOffset}px)`,
          right: `calc(-6% - ${lineOffset}px)`,
          top: '28%',
          height: '1px',
          background: `linear-gradient(to right, transparent 0%, ${hairlineOpacity} 25%, var(--color-terra) 50%, ${hairlineOpacity} 75%, transparent 100%)`,
          opacity: active ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Bottom hairline — drifts left (mirror of top) */}
      <div
        style={{
          position: 'absolute',
          left: `calc(-6% + ${-lineOffset}px)`,
          right: `calc(-6% - ${-lineOffset}px)`,
          top: '72%',
          height: '1px',
          background: `linear-gradient(to right, transparent 0%, ${hairlineOpacity} 25%, var(--color-ochre) 50%, ${hairlineOpacity} 75%, transparent 100%)`,
          opacity: active ? 1 : 0,
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Traveling pulse — left side, higher contrast */}
      {active && (
        <div
          style={{
            position: 'absolute',
            left: '0%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-terra)',
            boxShadow: '0 0 8px 3px rgba(194,96,58,0.55), 0 0 18px 6px rgba(194,96,58,0.25)',
            '--travel-w': '40%',
            animation: 'pulse-travel-right 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite',
          } as React.CSSProperties}
        />
      )}

      {/* Center teardrop drops with gloss highlight + drip elongation */}
      <div style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 2 }}>
        {DROPS.map(({ color, highlight, delay }, i) => (
          <svg
            key={i}
            width="20"
            height="32"
            viewBox="0 0 20 32"
            fill="none"
            style={{
              animation: active
                ? `drop-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s infinite`
                : 'none',
              filter: `drop-shadow(0 0 5px ${color}90) drop-shadow(0 3px 8px ${color}50)`,
            }}
          >
            {/* Main teardrop body with drip elongation at bottom */}
            <path
              d="M10 0 C10 0 20 11 20 18 A10 10 0 0 1 0 18 C0 11 10 0 10 0 Z"
              fill={color}
            />
            {/* Drip elongation — narrow teardrop tail */}
            <path
              d="M10 26 C10 26 7 28 8 30 C8.5 31.5 11.5 31.5 12 30 C13 28 10 26 10 26 Z"
              fill={color}
              opacity="0.7"
            />
            {/* Gloss highlight — bright ellipse upper-left of drop */}
            <ellipse
              cx="7.5"
              cy="10"
              rx="2.5"
              ry="4"
              fill={highlight}
              opacity="0.55"
              transform="rotate(-18 7.5 10)"
            />
            {/* Specular pinpoint */}
            <ellipse
              cx="6.5"
              cy="8"
              rx="1"
              ry="1.5"
              fill="rgba(255,255,255,0.7)"
              transform="rotate(-18 6.5 8)"
            />
          </svg>
        ))}
      </div>

      {/* Traveling pulse — right side, higher contrast */}
      {active && (
        <div
          style={{
            position: 'absolute',
            right: '0%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--color-ochre)',
            boxShadow: '0 0 8px 3px rgba(184,136,74,0.55), 0 0 18px 6px rgba(184,136,74,0.25)',
            '--travel-w': '40%',
            animation: 'pulse-travel-left 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s infinite',
          } as React.CSSProperties}
        />
      )}
    </div>
  )
}
