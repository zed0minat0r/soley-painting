'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Soley Painting — Roller Stripe Hero
   Technique: A paint roller sweeps left→right at constant velocity, leaving
   a horizontal stripe of fresh paint in the current brand color. After the
   stripe completes, it holds, then fades, then the roller cycles to the next
   brand color and re-enters from the left.

   Phase machine: sweeping → holding → fading → (next color)
   4 brand colors: rust → ochre → stone-deeper → umber-lighter → back to rust

   Constant velocity via rollerX = elapsed / SWEEP_DURATION_MS (no ease, no lerp).
   ref: Site A (Arch Painting) — cinematic, physical-craft motion as brand statement
*/

// ── Constant-velocity particle drift data ─────────────────────────────────
type Particle = {
  id: number
  x: number
  y: number
  r: number
  color: string
  opacity: number
  dur: number
  delay: number
}

const PARTICLES: Particle[] = [
  { id:0, x:8,  y:90, r:3.5, color:'#BF5B38', opacity:0.18, dur:16, delay:0 },
  { id:1, x:18, y:75, r:2.5, color:'#B8884A', opacity:0.14, dur:18, delay:2.4 },
  { id:2, x:32, y:85, r:4,   color:'#B8884A', opacity:0.16, dur:14, delay:1.1 },
  { id:3, x:52, y:95, r:2,   color:'#BF5B38', opacity:0.12, dur:20, delay:3.7 },
  { id:4, x:65, y:80, r:3,   color:'#B8884A', opacity:0.15, dur:15, delay:5.2 },
  { id:5, x:78, y:88, r:2.5, color:'#B8884A', opacity:0.13, dur:17, delay:0.8 },
  { id:6, x:88, y:70, r:3.5, color:'#BF5B38', opacity:0.17, dur:16, delay:6.3 },
  { id:7, x:45, y:92, r:2,   color:'#B8884A', opacity:0.11, dur:19, delay:4.1 },
  { id:8, x:24, y:60, r:3,   color:'#B8884A', opacity:0.14, dur:14, delay:7.5 },
  { id:9, x:70, y:55, r:2.5, color:'#BF5B38', opacity:0.16, dur:17, delay:2.0 },
]

// ── Brand color cycle: rust → ochre → stone-deeper → umber-lighter ────────
const STRIPE_COLORS = [
  { hex: '#BF5B38', name: 'rust' },
  { hex: '#B8884A', name: 'ochre' },
  { hex: '#5C4838', name: 'stone' },
  { hex: '#3D2A1E', name: 'umber' },
]

// ── ViewBox constants — matches current 16:7 aspect canvas ────────────────
const VB_W = 560   // viewBox width
const VB_H = 200   // viewBox height

// Stripe geometry
const STRIPE_Y    = 84    // top of stripe band
const STRIPE_H    = 32    // height of stripe band (roller kiss-line center = STRIPE_Y + STRIPE_H/2)
const STRIPE_CX   = STRIPE_Y + STRIPE_H / 2  // y-center of stripe = 100

// Roller geometry (in viewBox units)
const ROLLER_W    = 80    // cylinder body width
const ROLLER_H    = 26    // cylinder body height
const ROLLER_CY   = STRIPE_CX  // roller rides on stripe center line

// Roller handle — rises up-right from cylinder center
// Yoke attaches at right center of cylinder
const YOKE_X_OFF  = ROLLER_W / 2   // x offset from roller center to yoke attach
const YOKE_Y_OFF  = 0               // at cylinder center
const HANDLE_DX   = 28              // handle extends dx to the right
const HANDLE_DY   = -54             // and dy upward
const GRIP_W      = 28              // grip rectangle width
const GRIP_H      = 7               // grip rectangle height

// Timing
const SWEEP_DURATION_MS = 4000   // roller crosses full canvas
const HOLD_DURATION_MS  = 2200   // stripe holds after roller exits
const FADE_DURATION_MS  = 500    // fade out

// The roller starts at x = -(ROLLER_W/2) - 20 (off-screen left)
// and ends at x = VB_W + ROLLER_W/2 + 20 (off-screen right)
const ROLLER_START_X = -(ROLLER_W / 2) - 20
const ROLLER_END_X   = VB_W + ROLLER_W / 2 + 20
const ROLLER_TRAVEL  = ROLLER_END_X - ROLLER_START_X

type Phase = 'sweeping' | 'holding' | 'fading' | 'idle'

export default function Hero3D() {
  const rafRef      = useRef<number>(0)
  const timeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phaseRef    = useRef<Phase>('idle')
  const startRef    = useRef<number>(0)
  const colorIdxRef = useRef<number>(0)

  // Animated state
  const [colorIdx, setColorIdx]     = useState(0)
  const [rollerX, setRollerX]       = useState(ROLLER_START_X)
  const [stripeWidth, setStripeWidth] = useState(0)
  const [canvasOpacity, setCanvasOpacity] = useState(1)

  // Derived
  const color = STRIPE_COLORS[colorIdx].hex

  const startCycle = useCallback((idx: number) => {
    const normIdx = idx % STRIPE_COLORS.length
    colorIdxRef.current = normIdx
    phaseRef.current = 'sweeping'
    setColorIdx(normIdx)
    setRollerX(ROLLER_START_X)
    setStripeWidth(0)
    setCanvasOpacity(1)
    startRef.current = performance.now()

    const sweep = (now: number) => {
      if (phaseRef.current !== 'sweeping') return
      const elapsed  = now - startRef.current
      const progress = Math.min(elapsed / SWEEP_DURATION_MS, 1)

      // Constant velocity: rollerX grows linearly
      const rx = ROLLER_START_X + progress * ROLLER_TRAVEL
      setRollerX(rx)

      // Stripe width: grows from left edge (x=0) to wherever the roller
      // center currently is, clamped to VB_W
      const leftEdge  = 0
      const stripeEnd = Math.max(0, rx - ROLLER_W / 2)  // stripe trails the roller's left face
      const sw = Math.min(Math.max(stripeEnd - leftEdge, 0), VB_W)
      setStripeWidth(sw)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(sweep)
      } else {
        // Roller has exited — ensure stripe is full width
        setStripeWidth(VB_W)
        phaseRef.current = 'holding'
        timeoutRef.current = setTimeout(() => {
          phaseRef.current = 'fading'
          const fadeStart = performance.now()
          const fade = (n: number) => {
            const t = Math.min((n - fadeStart) / FADE_DURATION_MS, 1)
            setCanvasOpacity(1 - t)
            if (t < 1) {
              rafRef.current = requestAnimationFrame(fade)
            } else {
              setCanvasOpacity(0)
              phaseRef.current = 'idle'
              timeoutRef.current = setTimeout(() => {
                startCycle(normIdx + 1)
              }, 120)
            }
          }
          rafRef.current = requestAnimationFrame(fade)
        }, HOLD_DURATION_MS)
      }
    }

    rafRef.current = requestAnimationFrame(sweep)
  }, [])

  // Boot
  useEffect(() => {
    const t = setTimeout(() => startCycle(0), 400)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [startCycle])

  // Roller center X in viewBox coords
  const rx = rollerX

  // Roller body rect coords
  const rollerLeft  = rx - ROLLER_W / 2
  const rollerTop   = ROLLER_CY - ROLLER_H / 2

  // Yoke attach point (right side of cylinder center)
  const yokeX = rx + YOKE_X_OFF
  const yokeY = ROLLER_CY + YOKE_Y_OFF

  // Handle tip
  const handleTipX = yokeX + HANDLE_DX
  const handleTipY = yokeY + HANDLE_DY

  // Grip center
  const gripCX = handleTipX
  const gripCY = handleTipY

  // Subtle imperfect stripe edges: very small wave via SVG path instead of plain rect
  // Top edge: slight saw-tooth. Bottom edge: slight opposite wave.
  // Implemented as a clipPath + full-width rect.
  const stripeTopWave = (sw: number) => {
    if (sw <= 0) return ''
    // Simple: flat top with tiny step variation
    const steps = Math.floor(sw / 14)
    let d = `M 0 ${STRIPE_Y}`
    for (let i = 0; i <= steps; i++) {
      const x = Math.min(i * 14, sw)
      const jitter = (i % 2 === 0) ? -0.8 : 0.8
      d += ` L ${x} ${STRIPE_Y + jitter}`
    }
    d += ` L ${sw} ${STRIPE_Y + STRIPE_H}`
    d += ` L 0 ${STRIPE_Y + STRIPE_H}`
    d += ' Z'
    return d
  }

  return (
    <section
      id="top"
      className="hero-section-mobile"
      style={{
        minHeight: '100vh',
        background: 'var(--color-umber)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '88px',
        paddingBottom: '4rem',
      }}
    >
      {/* ── STUDIO ENVIRONMENT — ambient layers ───────────────────────────── */}
      <svg
        aria-hidden
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      >
        <defs>
          <radialGradient id="gobo-warm" cx="78%" cy="18%" r="42%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BF5B38" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#BF5B38" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gobo-ochre" cx="18%" cy="82%" r="40%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B8884A" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#B8884A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gobo-warm)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gobo-ochre)" />
      </svg>

      {/* Drop-cloth corner — bottom-left */}
      <svg
        aria-hidden
        viewBox="0 0 220 180"
        style={{ position:'absolute', bottom:0, left:0, width:'min(220px,28vw)', height:'auto', pointerEvents:'none', zIndex:1, opacity:0.55 }}
      >
        <path d="M0,180 L0,60 Q18,50 30,72 Q45,40 62,68 Q80,35 95,65 Q112,28 128,62 Q145,38 158,66 Q172,45 185,70 L220,180 Z"
              fill="#D4C9B8" opacity="0.6" />
        <path d="M0,180 L0,85 Q12,78 22,90 Q35,65 50,88 Q65,58 78,85 Q92,55 105,82 L95,180 Z"
              fill="#C8BC9E" opacity="0.5" />
        <line x1="28" y1="72" x2="20" y2="180" stroke="#A8987C" strokeWidth="0.8" opacity="0.35" />
        <line x1="65" y1="68" x2="55" y2="180" stroke="#A8987C" strokeWidth="0.8" opacity="0.35" />
        <line x1="96" y1="65" x2="88" y2="180" stroke="#A8987C" strokeWidth="0.8" opacity="0.3" />
        <ellipse cx="38" cy="140" rx="12" ry="7" fill="#BF5B38" opacity="0.22" transform="rotate(-8,38,140)" />
        <ellipse cx="75" cy="160" rx="8" ry="5" fill="#B8884A" opacity="0.18" transform="rotate(5,75,160)" />
      </svg>

      {/* Brush rest ledge — right side */}
      <svg
        aria-hidden
        viewBox="0 0 140 60"
        style={{ position:'absolute', right:'4%', bottom:'18%', width:'min(140px,18vw)', height:'auto', pointerEvents:'none', zIndex:1, opacity:0.6 }}
      >
        <rect x="0" y="38" width="140" height="8" rx="2" fill="#C8B89A" />
        <rect x="0" y="44" width="140" height="4" rx="1" fill="#A89070" opacity="0.6" />
        <rect x="10" y="24" width="88" height="14" rx="7" fill="#3D2314" />
        <rect x="96" y="26" width="18" height="10" rx="5" fill="#5C3420" />
        <rect x="9" y="26" width="10" height="10" rx="2" fill="#C8B8A2" stroke="#A8947E" strokeWidth="0.5" />
        <path d="M9,29 Q2,26 0,31 Q2,36 9,33" fill="#BF5B38" opacity="0.9" />
        <path d="M9,31 Q3,28 1,31 Q3,34 9,32" fill="#B8884A" opacity="0.7" />
        <ellipse cx="4" cy="43" rx="6" ry="2.5" fill="#BF5B38" opacity="0.3" />
        <rect x="18" y="28" width="72" height="10" rx="5" fill="#4A2D1A" opacity="0.7" />
        <rect x="17" y="29" width="8" height="8" rx="1.5" fill="#C8B8A2" stroke="#A8947E" strokeWidth="0.4" />
        <path d="M17,31 Q11,29 9,32 Q11,35 17,33" fill="#B8884A" opacity="0.85" />
      </svg>

      {/* Paint drips — rust/ochre/ochre/rust */}
      <svg
        aria-hidden
        viewBox="0 0 700 60"
        preserveAspectRatio="none"
        style={{ position:'absolute', bottom:0, left:0, right:0, width:'100%', height:'min(60px,8vh)', pointerEvents:'none', zIndex:1 }}
      >
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,4; 0,0" dur="10s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="115" cy="0" rx="5" ry="3" fill="#BF5B38" opacity="0.7" />
          <path d="M110,0 Q112,28 115,42 Q118,28 120,0 Z" fill="#BF5B38" opacity="0.65" />
          <ellipse cx="115" cy="44" rx="5" ry="6" fill="#BF5B38" opacity="0.6" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,6; 0,0" dur="13s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="255" cy="0" rx="4" ry="2.5" fill="#B8884A" opacity="0.65" />
          <path d="M251,0 Q253,22 255,34 Q257,22 259,0 Z" fill="#B8884A" opacity="0.6" />
          <ellipse cx="255" cy="36" rx="4" ry="5" fill="#B8884A" opacity="0.55" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,5; 0,0" dur="11.5s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="420" cy="0" rx="3.5" ry="2" fill="#B8884A" opacity="0.6" />
          <path d="M416.5,0 Q418,18 420,28 Q422,18 423.5,0 Z" fill="#B8884A" opacity="0.55" />
          <ellipse cx="420" cy="30" rx="3.5" ry="4.5" fill="#B8884A" opacity="0.5" />
        </g>
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,3; 0,0" dur="9s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="575" cy="0" rx="4.5" ry="2.5" fill="#BF5B38" opacity="0.55" />
          <path d="M570.5,0 Q572.5,20 575,32 Q577.5,20 579.5,0 Z" fill="#BF5B38" opacity="0.5" />
          <ellipse cx="575" cy="33" rx="4.5" ry="5.5" fill="#BF5B38" opacity="0.45" />
        </g>
      </svg>

      {/* Constant-velocity drifting paint particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          aria-hidden
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: `${100 - p.y}%`,
            width: `${p.r * 2}px`,
            height: `${p.r * 2}px`,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            pointerEvents: 'none',
            zIndex: 1,
            animation: `particle-drift-${p.id} ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: 'min(700px, 100vw)',
          height: 'min(700px, 100vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(191,91,56,0.10) 0%, rgba(184,136,74,0.05) 55%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Eyebrow */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '0.875rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-rust)',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        Soley Painting
      </p>

      {/* H1 */}
      <h1
        className="glow-hero"
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 'clamp(2.75rem, 7vw, 6.5rem)',
          lineHeight: 1.05,
          letterSpacing: '0.01em',
          color: 'var(--color-linen)',
          marginBottom: '0.875rem',
          textAlign: 'center',
          maxWidth: '20ch',
          textShadow:
            '0 0 1px #fff, 0 0 10px rgba(191,91,56,0.75), 0 0 28px rgba(184,136,74,0.35)',
        }}
      >
        Every wall{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--color-ochre)' }}>done right.</em>
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'rgba(244, 237, 227, 0.6)',
          letterSpacing: '0.04em',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '36ch',
        }}
      >
        Owner-operated. Same crew start to finish. Free walkthrough, written quote in 24 hours.
      </p>

      {/* ── ROLLER STRIPE CENTERPIECE ── */}
      <div
        className="hero-canvas-wrap"
        style={{
          width: 'min(640px, 92vw)',
          aspectRatio: '16/7',
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
          background: '#F4EDE3',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Linen wall surface texture wash */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 15% 25%, rgba(191,91,56,0.04) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 75%, rgba(184,136,74,0.03) 0%, transparent 55%)
            `,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
          style={{
            display: 'block',
            position: 'relative',
            zIndex: 2,
            opacity: canvasOpacity,
          }}
          aria-label="Paint roller applying a stripe of color"
        >
          <defs>
            {/* Stripe gradient — slightly darker at edges, lighter center (wet paint look) */}
            <linearGradient id="stripe-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity="0.82" />
              <stop offset="30%"  stopColor={color} stopOpacity="0.97" />
              <stop offset="60%"  stopColor={color} stopOpacity="1.0"  />
              <stop offset="85%"  stopColor={color} stopOpacity="0.93" />
              <stop offset="100%" stopColor={color} stopOpacity="0.75" />
            </linearGradient>

            {/* Wet sheen on top surface of stripe */}
            <linearGradient id="stripe-sheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Roller cylinder gradient — dry painter-tan surface with paint saturation on leading edge */}
            <linearGradient id="roller-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#C8B89A" stopOpacity="0.95" />
              <stop offset="60%"  stopColor="#D4C8AE" stopOpacity="1.0"  />
              <stop offset="85%"  stopColor={color}   stopOpacity="0.65" />
              <stop offset="100%" stopColor={color}   stopOpacity="0.90" />
            </linearGradient>

            {/* Roller end caps */}
            <radialGradient id="roller-cap-l" cx="30%" cy="40%" r="70%">
              <stop offset="0%"   stopColor="#E0D4BE" />
              <stop offset="100%" stopColor="#A89A80" />
            </radialGradient>
            <radialGradient id="roller-cap-r" cx="70%" cy="40%" r="70%">
              <stop offset="0%"   stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </radialGradient>

            {/* Clip path for imperfect stripe edges */}
            <clipPath id="stripe-clip">
              {stripeWidth > 0 && (
                <path d={stripeTopWave(stripeWidth)} />
              )}
            </clipPath>
          </defs>

          {/* Linen wall — subtle horizontal grain lines to suggest surface */}
          {[30, 60, 90, 120, 150, 170].map((y, i) => (
            <line
              key={i}
              x1="0" y1={y} x2={VB_W} y2={y}
              stroke="#E0D5C5"
              strokeWidth="0.4"
              opacity={0.35}
            />
          ))}

          {/* ── PAINT STRIPE ── */}
          {stripeWidth > 0 && (
            <g clipPath="url(#stripe-clip)">
              {/* Base paint color */}
              <rect
                x={0}
                y={STRIPE_Y}
                width={stripeWidth}
                height={STRIPE_H}
                fill="url(#stripe-grad)"
              />
              {/* Wet sheen highlight on top third */}
              <rect
                x={0}
                y={STRIPE_Y}
                width={stripeWidth}
                height={STRIPE_H * 0.45}
                fill="url(#stripe-sheen)"
              />
            </g>
          )}

          {/* ── PAINT ROLLER ── */}
          <g>
            {/* Handle — the pole going from yoke up to grip */}
            <line
              x1={yokeX}
              y1={yokeY}
              x2={handleTipX}
              y2={handleTipY}
              stroke="#3D2A1E"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Yoke bracket — small L connecting handle to roller left-end */}
            {/* Yoke goes from handle base down and left to roller axle */}
            <line
              x1={yokeX}
              y1={yokeY}
              x2={rx - ROLLER_W / 2 + 6}
              y2={ROLLER_CY}
              stroke="#5C4030"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Yoke right arm to roller axle right */}
            <line
              x1={yokeX}
              y1={yokeY}
              x2={rx + ROLLER_W / 2 - 6}
              y2={ROLLER_CY}
              stroke="#5C4030"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Roller cylinder body */}
            <rect
              x={rollerLeft}
              y={rollerTop}
              width={ROLLER_W}
              height={ROLLER_H}
              rx="4"
              fill="url(#roller-body)"
            />

            {/* Roller texture lines (nap texture on the cylinder) */}
            {Array.from({ length: 6 }, (_, i) => {
              const lx = rollerLeft + 8 + i * 12
              return (
                <line
                  key={i}
                  x1={lx} y1={rollerTop + 2}
                  x2={lx} y2={rollerTop + ROLLER_H - 2}
                  stroke="#A89880"
                  strokeWidth="0.7"
                  opacity="0.4"
                />
              )
            })}

            {/* Left end cap */}
            <ellipse
              cx={rollerLeft}
              cy={ROLLER_CY}
              rx={4}
              ry={ROLLER_H / 2}
              fill="url(#roller-cap-l)"
            />

            {/* Right end cap — paint-saturated side */}
            <ellipse
              cx={rollerLeft + ROLLER_W}
              cy={ROLLER_CY}
              rx={4}
              ry={ROLLER_H / 2}
              fill="url(#roller-cap-r)"
            />

            {/* Paint bead below roller — thin film at application line */}
            {stripeWidth > 0 && (
              <ellipse
                cx={rx - ROLLER_W / 2 + 2}
                cy={STRIPE_Y + STRIPE_H - 1}
                rx={6}
                ry={1.5}
                fill={color}
                opacity={0.55}
              />
            )}

            {/* Grip — rectangular handle end with slight taper */}
            <rect
              x={gripCX - GRIP_W / 2}
              y={gripCY - GRIP_H / 2}
              width={GRIP_W}
              height={GRIP_H}
              rx={GRIP_H / 2}
              fill="#2A1A0E"
            />
            {/* Grip highlight ring */}
            <rect
              x={gripCX - GRIP_W / 2 + 4}
              y={gripCY - 1.5}
              width={8}
              height={3}
              rx={1.5}
              fill="#6A5040"
              opacity={0.6}
            />
          </g>

          {/* Color name label — bottom right */}
          <text
            x={VB_W - 8}
            y={VB_H - 8}
            textAnchor="end"
            fontFamily="var(--font-body), sans-serif"
            fontSize="10"
            letterSpacing="2"
            fill="rgba(34,24,16,0.3)"
            style={{ textTransform: 'uppercase' }}
          >
            {STRIPE_COLORS[colorIdx].name}  {colorIdx + 1}/{STRIPE_COLORS.length}
          </text>
        </svg>
      </div>

      {/* Body copy */}
      <p
        className="glow-sub"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(244, 237, 227, 0.72)',
          maxWidth: '46ch',
          marginTop: '2.5rem',
          textAlign: 'center',
          textShadow:
            '0 0 1px rgba(255,255,255,0.5), 0 0 8px rgba(184,136,74,0.55), 0 0 20px rgba(191,91,56,0.25)',
        }}
      >
        Meticulous surface prep. Durable finishes. One point of contact
        from estimate to final walkthrough — no call centers, no surprises.
      </p>

      {/* CTAs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '2rem',
        }}
      >
        <a href="#contact" className="btn-primary">Request a Free Estimate</a>
        <a href="#services" className="btn-secondary">Our Services</a>
      </div>

      {/* Trust signals */}
      <div
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(244, 237, 237, 0.12)',
          display: 'flex',
          gap: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '760px',
        }}
      >
        {[
          { label: 'Free in-home consultation', sub: 'Written quote, no ballpark ranges' },
          { label: 'Low-VOC options available', sub: 'On request, any project' },
          { label: 'Single point of contact', sub: 'Estimate through final walkthrough' },
        ].map(({ label, sub }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-linen)',
                marginBottom: '0.2rem',
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(244, 237, 227, 0.5)',
              }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        aria-label="Scroll down"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(244, 237, 227, 0.35)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, rgba(191,91,56,0.6), transparent)',
          }}
          className="animate-bounce-x"
        />
      </div>
    </section>
  )
}
