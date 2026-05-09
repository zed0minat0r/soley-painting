'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Soley Painting — Cycling Icon Draw Hero
   Technique: SVG path stroke-dashoffset animation for simple line-drawing icons.
   Each icon is a simple hand-crafted path that gets "drawn" by a brush sprite.

   Brush tracks the leading edge via path.getPointAtLength(progress * totalLength).
   Constant velocity via progress = elapsed / STROKE_DURATION_MS (no ease).

   Phase machine: painting → holding → fading → (next icon)
   5 icons, painter-themed, pure line drawings:
     0. Smiley face    — 2 dot eyes + curved smile arc
     1. Paint can      — rectangle body + handle arc + drip
     2. Paintbrush     — handle line + bristle V fan
     3. Paint roller   — cylinder + handle + drip
     4. House outline  — square + triangle roof + door + window

   Brand color per cycle (rust/ochre alternate to keep warm palette only).
   ref: Scout Section 5 SVG stroke-draw + Site I (Corentin Bernadou focal centerpiece)
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

// ── Brand colors: Drop Cloth & Rust palette — NO teal ─────────────────────
const BRAND_COLORS = [
  '#BF5B38',  // rust — primary
  '#B8884A',  // ochre — accent
  '#BF5B38',  // rust — repeat
  '#B8884A',  // ochre
  '#BF5B38',  // rust
]

// ── 5 painter icons — viewBox 0 0 280 200 ──────────────────────────────────
// Redesigned for instant readability: 1-3 paths max, icon legible within 1-2s.
// Strategy: single continuous paths that read as complete silhouettes early.
// strokeWidth 4.5 for visibility on small canvas.

interface IconDef {
  label: string
  paths: string[]   // each string is one <path> d — drawn sequentially
}

const ICONS: IconDef[] = [
  {
    // 0 — Smiley face: big face circle → smile arc → left eye arc → right eye arc
    // Face circle is ONE unbroken path so silhouette reads in first second.
    label: 'smiley face',
    paths: [
      // Face circle — single full loop (legible in first 500ms = you see a circle forming)
      'M 140 58 a 62 62 0 1 0 0.01 0 Z',
      // Smile arc — generous curve in lower third
      'M 108 118 Q 140 148 172 118',
      // Left eye — small arc (fast draw, ~6px circle)
      'M 116 88 a 8 8 0 1 0 0.01 0 Z',
      // Right eye — small arc
      'M 164 88 a 8 8 0 1 0 0.01 0 Z',
    ],
  },
  {
    // 1 — House: single continuous path traces walls+roof in one stroke → instantly house-shaped
    // Door drawn second. Two paths total.
    label: 'house',
    paths: [
      // One continuous path: up-left wall → apex → down-right wall → right wall → floor →
      // left wall back → close. Reads as house silhouette by the time roof apex is reached (~30% in).
      'M 80 168 L 80 120 L 140 62 L 200 120 L 200 168 L 80 168 Z',
      // Door — centered, open-top rectangle (3 sides, bottom is floor line)
      'M 120 168 L 120 140 L 160 140 L 160 168',
    ],
  },
  {
    // 2 — Paint roller: handle L + roller cylinder in 2 paths
    label: 'paint roller',
    paths: [
      // Handle — angled L-shape, reads as roller handle immediately
      'M 90 52 L 140 98 L 140 150',
      // Roller body — wide rounded rectangle
      'M 150 98 L 205 98 Q 215 98 215 115 L 215 135 Q 215 150 205 150 L 150 150 Q 140 150 140 135 L 140 115 Q 140 98 150 98 Z',
    ],
  },
  {
    // 3 — Star: 5-pointed star drawn as single continuous path (children's art style)
    // Path: start at top tip, draw each point in sequence — instantly a star.
    label: 'star',
    paths: [
      // 5-point star, one closed path, counter-clockwise from top
      'M 140 52 L 151 85 L 188 85 L 158 106 L 169 140 L 140 119 L 111 140 L 122 106 L 92 85 L 129 85 Z',
    ],
  },
  {
    // 4 — Heart: single closed path, 2 cubic Béziers — reads as heart in first 40% of draw
    label: 'heart',
    paths: [
      // Heart: start at bottom tip, sweep up-left lobe, over top, down-right lobe, back to tip
      'M 140 165 C 80 130 68 75 100 68 C 115 65 130 75 140 92 C 150 75 165 65 180 68 C 212 75 200 130 140 165 Z',
    ],
  },
]

const STROKE_DURATION_MS = 1200  // fast constant-velocity draw (~1.2s per path)
const HOLD_DURATION_MS   = 1500  // hold after complete
const FADE_DURATION_MS   = 600   // fade out

type Phase = 'painting' | 'holding' | 'fading' | 'idle'

interface PathState {
  dashOffset: number  // current dashoffset (totalLen → 0)
  totalLen: number
}

export default function Hero3D() {
  const pathRefs       = useRef<(SVGPathElement | null)[]>([])
  const rafRef         = useRef<number>(0)
  const timeoutRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phaseRef       = useRef<Phase>('idle')
  const iconIdxRef     = useRef(0)
  const pathIdxRef     = useRef(0)  // which path within current icon we're drawing
  const startTimeRef   = useRef(0)

  const [iconIdx, setIconIdx]       = useState(-1)
  const [pathIdx, setPathIdx]       = useState(0)      // which path is currently drawing
  const [drawnPaths, setDrawnPaths] = useState<boolean[]>([])  // paths fully drawn
  const [color, setColor]           = useState(BRAND_COLORS[0])
  const [svgOpacity, setSvgOpacity] = useState(1)
  const [brushX, setBrushX]         = useState(-100)
  const [brushY, setBrushY]         = useState(-100)
  const [brushAngle, setBrushAngle] = useState(0)
  const [pathStates, setPathStates] = useState<PathState[]>([])

  // Measure all paths and set initial dashoffset = totalLength (invisible)
  const measurePaths = useCallback((iIdx: number) => {
    const icon = ICONS[iIdx]
    const states: PathState[] = icon.paths.map((_, pi) => {
      const el = pathRefs.current[pi]
      if (!el) return { dashOffset: 1000, totalLen: 1000 }
      const len = el.getTotalLength()
      return { dashOffset: len, totalLen: len }
    })
    return states
  }, [])

  const startIconCycle = useCallback((iIdx: number) => {
    const normIdx = iIdx % ICONS.length
    iconIdxRef.current = normIdx
    pathIdxRef.current = 0
    phaseRef.current = 'painting'

    const col = BRAND_COLORS[normIdx % BRAND_COLORS.length]
    setIconIdx(normIdx)
    setPathIdx(0)
    setColor(col)
    setSvgOpacity(1)
    // Mark all paths as un-drawn
    setDrawnPaths(ICONS[normIdx].paths.map(() => false))
  }, [])

  // Draw a single path (pathIdx) within current icon
  const drawPath = useCallback((iIdx: number, pIdx: number, onComplete: () => void) => {
    const el = pathRefs.current[pIdx]
    if (!el) { onComplete(); return }

    const totalLen = el.getTotalLength()
    startTimeRef.current = performance.now()

    const loop = (now: number) => {
      if (phaseRef.current !== 'painting') return
      const elapsed  = now - startTimeRef.current
      const progress = Math.min(elapsed / STROKE_DURATION_MS, 1)

      const drawn    = progress * totalLen
      const remaining = totalLen - drawn

      // Update dashoffset for this path
      setPathStates(prev => {
        const next = [...prev]
        next[pIdx] = { dashOffset: remaining, totalLen }
        return next
      })

      // Brush position at leading edge
      try {
        const pt = el.getPointAtLength(drawn)
        // Angle: tangent from previous point
        const ptPrev = el.getPointAtLength(Math.max(drawn - 3, 0))
        const dx = pt.x - ptPrev.x
        const dy = pt.y - ptPrev.y
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        setBrushX(pt.x)
        setBrushY(pt.y)
        setBrushAngle(angle)
      } catch { /* getBBox/getPointAtLength can throw before layout */ }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(loop)
      } else {
        // Path fully drawn
        setDrawnPaths(prev => {
          const next = [...prev]
          next[pIdx] = true
          return next
        })
        onComplete()
      }
    }

    rafRef.current = requestAnimationFrame(loop)
  }, [])

  const drawNextPath = useCallback((iIdx: number, pIdx: number) => {
    const icon = ICONS[iIdx % ICONS.length]
    if (pIdx >= icon.paths.length) {
      // All paths drawn — hold then fade
      phaseRef.current = 'holding'
      timeoutRef.current = setTimeout(() => {
        phaseRef.current = 'fading'
        const fadeStart = performance.now()
        const fadeLoop = (now: number) => {
          const t = Math.min((now - fadeStart) / FADE_DURATION_MS, 1)
          setSvgOpacity(1 - t)
          if (t < 1) {
            rafRef.current = requestAnimationFrame(fadeLoop)
          } else {
            setSvgOpacity(0)
            setBrushX(-100)
            setBrushY(-100)
            timeoutRef.current = setTimeout(() => {
              startIconCycle(iIdx + 1)
            }, 80)
          }
        }
        rafRef.current = requestAnimationFrame(fadeLoop)
      }, HOLD_DURATION_MS)
      return
    }

    setPathIdx(pIdx)
    pathIdxRef.current = pIdx

    drawPath(iIdx % ICONS.length, pIdx, () => {
      drawNextPath(iIdx, pIdx + 1)
    })
  }, [drawPath, startIconCycle])

  // When iconIdx changes (after startIconCycle), kick off drawing
  // Note: phaseRef is set to 'painting' inside startIconCycle BEFORE setIconIdx,
  // so the guard is redundant — and would block the initial 0 cycle if iconIdx
  // started at 0 (React skips same-value setState). We now start at -1 so the
  // -1 → 0 transition always fires. We skip the guard and rely on iconIdx >= 0.
  useEffect(() => {
    if (iconIdx < 0) return
    // Give React a frame to mount the new paths
    const t = setTimeout(() => {
      const states = measurePaths(iconIdx)
      setPathStates(states)
      // Give DOM another frame to apply dasharray/dashoffset before animating
      requestAnimationFrame(() => {
        drawNextPath(iconIdx, 0)
      })
    }, 60)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconIdx])

  // Boot sequence
  useEffect(() => {
    const t = setTimeout(() => {
      startIconCycle(0)
    }, 400)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [startIconCycle])

  const currentIcon = iconIdx >= 0 ? ICONS[iconIdx] : ICONS[0]

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
        {/* Paint spots on cloth — rust and ochre only */}
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

      {/* Ambient glow — constrained to viewport width */}
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
          fontSize: '0.8125rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-rust)',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        Soley Painting
      </p>

      {/* H1 — BUG-055 fix: glow applied inline to guarantee it's never stripped
           by CSS bundling/purge. The .glow-hero class is kept as a hook for
           QA selectors but the text-shadow is owned by the inline style.      */}
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
        One crew. One contact. Every wall done right.
      </p>

      {/* ── ICON DRAW CENTERPIECE ── */}
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
        {/* Subtle paper texture wash */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 15% 25%, rgba(191,91,56,0.05) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 75%, rgba(184,136,74,0.04) 0%, transparent 55%)
            `,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <svg
          viewBox="0 0 280 200"
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
          style={{
            display: 'block',
            position: 'relative',
            zIndex: 2,
            opacity: svgOpacity,
            maxWidth: '100%',
            height: 'auto',
          }}
          aria-label={currentIcon.label}
        >
          {/* Previously-drawn paths (fully revealed, static) */}
          {currentIcon.paths.map((d, pi) => {
            if (pi >= pathIdx && !(drawnPaths[pi])) return null
            const state = pathStates[pi]
            if (!state) return null
            return (
              <path
                key={`static-${pi}`}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={state.totalLen}
                strokeDashoffset={drawnPaths[pi] ? 0 : state.dashOffset}
              />
            )
          })}

          {/* Active drawing paths — measured via ref */}
          {currentIcon.paths.map((d, pi) => (
            <path
              key={`live-${pi}`}
              ref={el => { pathRefs.current[pi] = el }}
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={4.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathStates[pi]?.totalLen ?? 10000}
              strokeDashoffset={pathStates[pi]?.dashOffset ?? (pathStates[pi]?.totalLen ?? 10000)}
              style={{ visibility: pi < pathIdx || drawnPaths[pi] ? 'hidden' : 'visible' }}
            />
          ))}

          {/* ── Paintbrush sprite — tracks leading edge (50% smaller than original) ── */}
          {brushX > -50 && (
            <g
              transform={`translate(${brushX}, ${brushY}) rotate(${brushAngle})`}
              style={{ pointerEvents: 'none' }}
            >
              {/* Bristles — compact fan behind tip */}
              {[-3, -1.5, 0, 1.5, 3].map((offset, i) => (
                <line
                  key={i}
                  x1={-2}
                  y1={offset * 0.5}
                  x2={-10 - (i % 3) * 1.5}
                  y2={offset * 0.2}
                  stroke={color}
                  strokeWidth={0.9}
                  strokeLinecap="round"
                  opacity={0.82}
                />
              ))}
              {/* Ferrule — narrow */}
              <rect
                x={-3}
                y={-3}
                width={6}
                height={6}
                rx={1.5}
                fill="#C8B8A2"
                stroke="#A8947E"
                strokeWidth={0.4}
              />
              {/* Handle — slender */}
              <rect
                x={3}
                y={-2.5}
                width={22}
                height={5}
                rx={2.5}
                fill="#3D2314"
              />
              {/* End cap */}
              <circle cx={26} cy={0} r={2.5} fill="#3D2314" />
              {/* Wet paint bead at bristle tip */}
              <circle
                cx={-10}
                cy={0}
                r={1.8}
                fill={color}
                opacity={0.92}
              />
            </g>
          )}
        </svg>

        {/* Icon label — small caption at bottom-right */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '0.625rem',
            right: '0.75rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(34, 24, 16, 0.35)',
            zIndex: 3,
          }}
        >
          {Math.max(iconIdx + 1, 1)} / {ICONS.length}
        </span>
      </div>

      {/* Body copy — BUG-055 fix: glow-sub also inline to match h1 treatment */}
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
          borderTop: '1px solid rgba(244, 237, 227, 0.12)',
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
                fontSize: '0.8125rem',
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
            fontSize: '0.8125rem',
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
