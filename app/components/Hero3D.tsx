'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Soley Painting — Signature Reveal Hero
   Technique: SVG clipPath rect (grows left→right) reveals solid filled
   Sacramento text. No stroke-dashoffset — browser computes dasharray
   per glyph and letters can pop before the brush. ClipPath is
   browser-reliable and ensures zero pixels of the word are visible
   until the brush leading-edge has passed that x position.

   Brush tracking: JS rAF loop measures text bounding box once (font
   loaded) and maps progress → x = bbox.x + progress * bbox.w.
   The clipPath rect width == progress * bbox.w, so brush tip and
   clip leading edge are always identical.

   After the word fully paints: hold 2 s → fade 0.8 s → next color.
   Brand colors cycle: terracotta → deep teal → clay gold → repeat.

   No R3F. No blob accumulation. Clean, legible, cinematic.
   Frame A: studio environment around the signature — drop-cloth corner,
   brush rest, paint drips, ambient goboes, constant-velocity particles.
   ref: Scout Round 3 finding 2 (Hermès illustrated lessons — visible
   imperfection signals craft).
*/

// ── Constant-velocity particle drift data ─────────────────────────────────
// Each particle has a fixed (dx, dy) per-second rate — NO sin, NO lerp.
// dx/dy in % of section width/height per second.
type Particle = {
  id: number
  x: number   // start % of section width
  y: number   // start % of section height
  r: number   // radius px
  color: string
  opacity: number
  dx: number  // % of width per second (constant)
  dy: number  // % of height per second (constant, negative = upward)
  dur: number // seconds to cross full height (derived, for CSS animation)
  delay: number // animation-delay s
}

const PARTICLES: Particle[] = [
  { id:0, x:8,  y:90, r:3.5, color:'#C2603A', opacity:0.18, dx:0.02, dy:-0.55, dur:16, delay:0 },
  { id:1, x:18, y:75, r:2.5, color:'#2D7A70', opacity:0.14, dx:0.015,dy:-0.48, dur:18, delay:2.4 },
  { id:2, x:32, y:85, r:4,   color:'#B8935A', opacity:0.16, dx:0.025,dy:-0.62, dur:14, delay:1.1 },
  { id:3, x:52, y:95, r:2,   color:'#C2603A', opacity:0.12, dx:0.018,dy:-0.44, dur:20, delay:3.7 },
  { id:4, x:65, y:80, r:3,   color:'#2D7A70', opacity:0.15, dx:0.022,dy:-0.58, dur:15, delay:5.2 },
  { id:5, x:78, y:88, r:2.5, color:'#B8935A', opacity:0.13, dx:0.012,dy:-0.5,  dur:17, delay:0.8 },
  { id:6, x:88, y:70, r:3.5, color:'#C2603A', opacity:0.17, dx:0.019,dy:-0.53, dur:16, delay:6.3 },
  { id:7, x:45, y:92, r:2,   color:'#2D7A70', opacity:0.11, dx:0.021,dy:-0.46, dur:19, delay:4.1 },
  { id:8, x:24, y:60, r:3,   color:'#B8935A', opacity:0.14, dx:0.014,dy:-0.6,  dur:14, delay:7.5 },
  { id:9, x:70, y:55, r:2.5, color:'#C2603A', opacity:0.16, dx:0.023,dy:-0.52, dur:17, delay:2.0 },
]

const BRAND_COLORS = [
  '#C2603A',  // terracotta
  '#2D7A70',  // deep teal
  '#B8935A',  // clay gold
]

const STROKE_DURATION_MS = 3500  // ms for the reveal
const HOLD_DURATION_MS   = 2000  // ms hold after complete
const FADE_DURATION_MS   = 800   // ms fade out

type Phase = 'painting' | 'holding' | 'fading' | 'idle'

export default function Hero3D() {
  const textRef      = useRef<SVGTextElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const rafRef       = useRef<number>(0)
  const timeoutRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phaseRef     = useRef<Phase>('idle')
  const colorIdxRef  = useRef(0)
  const startTimeRef = useRef(0)
  // Reactive state
  const [color, setColor]          = useState(BRAND_COLORS[0])
  const [svgOpacity, setSvgOpacity] = useState(1)
  const [brushX, setBrushX]        = useState(-100)
  const [brushY, setBrushY]        = useState(200)
  const [brushAngle, setBrushAngle] = useState(15)
  // clipWidth drives the clipPath rect: 0 → full text width
  const [clipWidth, setClipWidth]  = useState(0)
  // clipOrigin is bbox.x — set once after first measureText()
  const [clipOrigin, setClipOrigin] = useState(0)
  const [clipY, setClipY]          = useState(-60)
  const [clipH, setClipH]          = useState(340)

  // We'll derive brush Y from the text bbox midpoint
  const bboxRef = useRef<{ x: number; y: number; w: number; midY: number } | null>(null)

  const measureText = useCallback(() => {
    const el = textRef.current
    if (!el || bboxRef.current) return
    try {
      const b = el.getBBox()
      bboxRef.current = {
        x: b.x,
        y: b.y,
        w: b.width,
        midY: b.y + b.height * 0.42, // slightly above vertical center = brush contact point
      }
      // Initialise clip rect geometry: full height of svg + 40px margin each side
      setClipOrigin(b.x)
      setClipY(b.y - 50)
      setClipH(b.height + 100)
    } catch {
      // getBBox can throw before layout; will retry
    }
  }, [])

  const runPaintCycle = useCallback((colIdx: number) => {
    const col = BRAND_COLORS[colIdx % BRAND_COLORS.length]
    colorIdxRef.current = colIdx % BRAND_COLORS.length
    phaseRef.current = 'painting'
    setColor(col)
    setSvgOpacity(1)
    // Reset clip to zero — nothing visible until brush starts
    setClipWidth(0)

    // Measure bounding box (font must be loaded)
    measureText()

    const bbox = bboxRef.current
    startTimeRef.current = performance.now()

    const paintLoop = (now: number) => {
      if (phaseRef.current !== 'painting') return
      const elapsed  = now - startTimeRef.current
      const progress = Math.min(elapsed / STROKE_DURATION_MS, 1)

      // ClipPath rect width = progress fraction of full word width.
      // Nothing past this x is rendered — no letter can appear before the brush.
      const revealWidth = bbox ? bbox.w * progress : 640 * progress
      setClipWidth(revealWidth)

      // Brush position: leading edge of the clip rect
      if (bbox) {
        const bx = bbox.x + bbox.w * progress

        // Slight sine undulation along baseline for realism
        const bboxHeight = bbox.midY - bbox.y
        const by = bbox.midY + Math.sin(progress * Math.PI * 2.5) * bboxHeight * 0.2

        // Brush angle follows tangent
        const dyDx = Math.cos(progress * Math.PI * 2.5) * bboxHeight * 0.2
          * (Math.PI * 2.5 / bbox.w)
        const angle = Math.atan2(dyDx, 1) * (180 / Math.PI)

        setBrushX(bx)
        setBrushY(by)
        setBrushAngle(angle)
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(paintLoop)
      } else {
        // Word fully revealed — open clip to full width, park brush off-right
        if (bbox) {
          setClipWidth(bbox.w + 20) // slight overshoot to ensure full reveal
          setBrushX(bbox.x + bbox.w + 40)
        }
        phaseRef.current = 'holding'

        timeoutRef.current = setTimeout(() => {
          // Fade out phase
          phaseRef.current = 'fading'
          const fadeStart = performance.now()

          const fadeLoop = (nowF: number) => {
            const t = Math.min((nowF - fadeStart) / FADE_DURATION_MS, 1)
            setSvgOpacity(1 - t)
            if (t < 1) {
              rafRef.current = requestAnimationFrame(fadeLoop)
            } else {
              // Reset clip and cycle color
              setSvgOpacity(0)
              setClipWidth(0)
              timeoutRef.current = setTimeout(() => {
                runPaintCycle(colorIdxRef.current + 1)
              }, 80)
            }
          }
          rafRef.current = requestAnimationFrame(fadeLoop)
        }, HOLD_DURATION_MS)
      }
    }

    rafRef.current = requestAnimationFrame(paintLoop)
  }, [measureText])

  useEffect(() => {
    // Wait for font to be applied (Sacramento is a web font; give it 400 ms)
    const t = setTimeout(() => {
      measureText()
      runPaintCycle(0)
    }, 400)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [measureText, runPaintCycle])

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
      {/* ── STUDIO ENVIRONMENT — ambient layers, props, particles ─────────── */}
      {/* Gobo A: warm terracotta wash from upper-right */}
      <svg
        aria-hidden
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
      >
        <defs>
          <radialGradient id="gobo-warm" cx="78%" cy="18%" r="42%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C2603A" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#C2603A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gobo-cool" cx="18%" cy="82%" r="40%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2D7A70" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#2D7A70" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gobo-warm)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gobo-cool)" />
      </svg>

      {/* Drop-cloth corner — bottom-left, draped fabric silhouette */}
      <svg
        aria-hidden
        viewBox="0 0 220 180"
        style={{ position:'absolute', bottom:0, left:0, width:'min(220px,28vw)', height:'auto', pointerEvents:'none', zIndex:1, opacity:0.55 }}
      >
        {/* Fabric drape — layered cloth folds suggesting a drop cloth */}
        <path d="M0,180 L0,60 Q18,50 30,72 Q45,40 62,68 Q80,35 95,65 Q112,28 128,62 Q145,38 158,66 Q172,45 185,70 L220,180 Z"
              fill="#D4C9B8" opacity="0.6" />
        <path d="M0,180 L0,85 Q12,78 22,90 Q35,65 50,88 Q65,58 78,85 Q92,55 105,82 L95,180 Z"
              fill="#C8BC9E" opacity="0.5" />
        {/* Subtle fold lines suggesting creased canvas */}
        <line x1="28" y1="72" x2="20" y2="180" stroke="#A8987C" strokeWidth="0.8" opacity="0.35" />
        <line x1="65" y1="68" x2="55" y2="180" stroke="#A8987C" strokeWidth="0.8" opacity="0.35" />
        <line x1="96" y1="65" x2="88" y2="180" stroke="#A8987C" strokeWidth="0.8" opacity="0.3" />
        {/* Terracotta paint spot on cloth — imperfection signals craft */}
        <ellipse cx="38" cy="140" rx="12" ry="7" fill="#C2603A" opacity="0.22" transform="rotate(-8,38,140)" />
        <ellipse cx="75" cy="160" rx="8" ry="5" fill="#2D7A70" opacity="0.18" transform="rotate(5,75,160)" />
      </svg>

      {/* Brush rest + ledge — right side, below center */}
      <svg
        aria-hidden
        viewBox="0 0 140 60"
        style={{ position:'absolute', right:'4%', bottom:'18%', width:'min(140px,18vw)', height:'auto', pointerEvents:'none', zIndex:1, opacity:0.6 }}
      >
        {/* Ledge */}
        <rect x="0" y="38" width="140" height="8" rx="2" fill="#C8B89A" />
        <rect x="0" y="44" width="140" height="4" rx="1" fill="#A89070" opacity="0.6" />
        {/* Brush handle resting on ledge */}
        <rect x="10" y="24" width="88" height="14" rx="7" fill="#3D2314" />
        <rect x="96" y="26" width="18" height="10" rx="5" fill="#5C3420" />
        {/* Ferrule */}
        <rect x="9" y="26" width="10" height="10" rx="2" fill="#C8B8A2" stroke="#A8947E" strokeWidth="0.5" />
        {/* Bristles */}
        <path d="M9,29 Q2,26 0,31 Q2,36 9,33" fill="#C2603A" opacity="0.9" />
        <path d="M9,31 Q3,28 1,31 Q3,34 9,32" fill="#B8935A" opacity="0.7" />
        {/* Tiny puddle of paint under bristles */}
        <ellipse cx="4" cy="43" rx="6" ry="2.5" fill="#C2603A" opacity="0.3" />
        {/* Second smaller brush */}
        <rect x="18" y="28" width="72" height="10" rx="5" fill="#4A2D1A" opacity="0.7" />
        <rect x="17" y="29" width="8" height="8" rx="1.5" fill="#C8B8A2" stroke="#A8947E" strokeWidth="0.4" />
        <path d="M17,31 Q11,29 9,32 Q11,35 17,33" fill="#2D7A70" opacity="0.85" />
      </svg>

      {/* Paint drips — at the base of the scene */}
      <svg
        aria-hidden
        viewBox="0 0 700 60"
        preserveAspectRatio="none"
        style={{ position:'absolute', bottom:0, left:0, right:0, width:'100%', height:'min(60px,8vh)', pointerEvents:'none', zIndex:1 }}
      >
        {/* 4 drips, staggered x positions, different brand colors */}
        {/* Drip 1 — terracotta */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,4; 0,0" dur="10s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="115" cy="0" rx="5" ry="3" fill="#C2603A" opacity="0.7" />
          <path d="M110,0 Q112,28 115,42 Q118,28 120,0 Z" fill="#C2603A" opacity="0.65" />
          <ellipse cx="115" cy="44" rx="5" ry="6" fill="#C2603A" opacity="0.6" />
        </g>
        {/* Drip 2 — teal */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,6; 0,0" dur="13s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="255" cy="0" rx="4" ry="2.5" fill="#2D7A70" opacity="0.65" />
          <path d="M251,0 Q253,22 255,34 Q257,22 259,0 Z" fill="#2D7A70" opacity="0.6" />
          <ellipse cx="255" cy="36" rx="4" ry="5" fill="#2D7A70" opacity="0.55" />
        </g>
        {/* Drip 3 — clay gold */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,5; 0,0" dur="11.5s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="420" cy="0" rx="3.5" ry="2" fill="#B8935A" opacity="0.6" />
          <path d="M416.5,0 Q418,18 420,28 Q422,18 423.5,0 Z" fill="#B8935A" opacity="0.55" />
          <ellipse cx="420" cy="30" rx="3.5" ry="4.5" fill="#B8935A" opacity="0.5" />
        </g>
        {/* Drip 4 — terracotta (right side) */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,3; 0,0" dur="9s" repeatCount="indefinite" additive="sum" />
          <ellipse cx="575" cy="0" rx="4.5" ry="2.5" fill="#C2603A" opacity="0.55" />
          <path d="M570.5,0 Q572.5,20 575,32 Q577.5,20 579.5,0 Z" fill="#C2603A" opacity="0.5" />
          <ellipse cx="575" cy="33" rx="4.5" ry="5.5" fill="#C2603A" opacity="0.45" />
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
            // Constant-velocity: linear, no ease — exact per-particle rate
            animation: `particle-drift-${p.id} ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Ambient radial glow — BUG-005/BUG-011: constrained to viewport width */}
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
            'radial-gradient(circle, rgba(194,96,58,0.10) 0%, rgba(45,122,112,0.05) 55%, transparent 80%)',
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
          color: 'var(--color-terra)',
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
          color: 'var(--color-chalk)',
          marginBottom: '0.875rem',
          textAlign: 'center',
          maxWidth: '20ch',
        }}
      >
        Every wall{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>done right.</em>
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'rgba(245, 240, 234, 0.6)',
          letterSpacing: '0.04em',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '36ch',
        }}
      >
        One crew. One contact. Every wall done right.
      </p>

      {/* ── SIGNATURE REVEAL CENTERPIECE ── */}
      <div
        className="hero-canvas-wrap"
        style={{
          width: 'min(640px, 92vw)',
          aspectRatio: '16/7',
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
          background: '#F5F0EA',
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
              radial-gradient(ellipse at 15% 25%, rgba(194,96,58,0.05) 0%, transparent 55%),
              radial-gradient(ellipse at 85% 75%, rgba(45,122,112,0.04) 0%, transparent 55%)
            `,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        <svg
          ref={svgRef}
          viewBox="0 0 640 280"
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
          aria-label="Soley — painted in script"
        >
          <defs>
            {/*
              ClipPath rect grows left→right as brush moves.
              x=clipOrigin (bbox.x), width=clipWidth (0→bbox.w).
              Nothing past the leading edge is rendered — no letter
              can appear before the brush has passed it.
              y/height generously oversized so ascenders+descenders
              of Sacramento's tall script are fully covered.
            */}
            <clipPath id="soley-reveal-clip">
              <rect
                x={clipOrigin}
                y={clipY}
                width={clipWidth}
                height={clipH}
              />
            </clipPath>
          </defs>

          {/*
            Solid filled text — no stroke needed.
            Hidden entirely by clipPath until brush sweeps past each x.
            Sacramento's connected script reads as one continuous stroke
            when revealed left-to-right.
          */}
          <text
            ref={textRef}
            x="320"
            y="210"
            textAnchor="middle"
            clipPath="url(#soley-reveal-clip)"
            style={{
              fontFamily: '"Sacramento", cursive',
              fontSize: '172px',
              fill: color,
              stroke: 'none',
            }}
          >
            Soley
          </text>

          {/* ── Paintbrush sprite ── */}
          <g
            transform={`translate(${brushX}, ${brushY}) rotate(${brushAngle})`}
            style={{ pointerEvents: 'none' }}
          >
            {/* Bristles — fan behind the tip */}
            {[-6, -3.5, -1, 1.5, 4, 6.5].map((offset, i) => (
              <line
                key={i}
                x1={-3}
                y1={offset * 0.55}
                x2={-20 - (i % 3) * 2.5}
                y2={offset * 0.22}
                stroke={color}
                strokeWidth={1.4}
                strokeLinecap="round"
                opacity={0.82}
              />
            ))}
            {/* Ferrule */}
            <rect
              x={-5}
              y={-5.5}
              width={11}
              height={11}
              rx={2.5}
              fill="#C8B8A2"
              stroke="#A8947E"
              strokeWidth={0.6}
            />
            {/* Handle */}
            <rect
              x={6}
              y={-4.5}
              width={46}
              height={9}
              rx={4.5}
              fill="#3D2314"
            />
            {/* End cap */}
            <circle cx={55} cy={0} r={4.5} fill="#3D2314" />
            {/* Wet paint bead at bristle tip */}
            <circle
              cx={-20}
              cy={0}
              r={3.5}
              fill={color}
              opacity={0.92}
            />
          </g>
        </svg>
      </div>

      {/* Body copy */}
      <p
        className="glow-sub"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(245, 240, 234, 0.72)',
          maxWidth: '46ch',
          marginTop: '2.5rem',
          textAlign: 'center',
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
          borderTop: '1px solid rgba(245, 240, 234, 0.12)',
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
                color: 'var(--color-chalk)',
                marginBottom: '0.2rem',
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'rgba(245, 240, 234, 0.5)',
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
            color: 'rgba(245, 240, 234, 0.35)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, rgba(194,96,58,0.6), transparent)',
          }}
          className="animate-bounce-x"
        />
      </div>
    </section>
  )
}
