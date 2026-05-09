'use client'

import { useEffect, useRef, useState } from 'react'

const DROPS = [
  { color: '#C2603A', delay: 0 },
  { color: '#2D7A70', delay: 0.15 },
  { color: '#B8935A', delay: 0.3 },
]

export default function SectionDivider({ flip = false }: { flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: flip ? 'var(--color-umber)' : 'var(--color-chalk)',
      }}
    >
      {/* Hairline gradient */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--color-terra) 20%, var(--color-teal) 80%, transparent)',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Traveling pulse — left side */}
      {active && (
        <div
          style={{
            position: 'absolute',
            left: '0%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--color-terra)',
            '--travel-w': '40%',
            animation: 'pulse-travel-right 1.8s ease-in-out infinite',
          } as React.CSSProperties}
        />
      )}

      {/* Center teardrop drops */}
      <div style={{ display: 'flex', gap: '14px', position: 'relative', zIndex: 2 }}>
        {DROPS.map(({ color, delay }, i) => (
          <svg
            key={i}
            width="18"
            height="26"
            viewBox="0 0 18 26"
            fill="none"
            style={{
              animation: active
                ? `drop-pulse 2s ease-in-out ${delay}s infinite`
                : 'none',
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          >
            {/* Teardrop: wider top, pointed bottom */}
            <path
              d="M9 0 C9 0 18 10 18 16 A9 9 0 0 1 0 16 C0 10 9 0 9 0 Z"
              fill={color}
            />
          </svg>
        ))}
      </div>

      {/* Traveling pulse — right side */}
      {active && (
        <div
          style={{
            position: 'absolute',
            right: '0%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'var(--color-teal)',
            '--travel-w': '40%',
            animation: 'pulse-travel-left 1.8s ease-in-out 0.9s infinite',
          } as React.CSSProperties}
        />
      )}
    </div>
  )
}
