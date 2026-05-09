'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Soley Painting — Signature Reveal Hero
   Technique: SVG <text> (Sacramento calligraphic font) with
   stroke-dashoffset animation.  The word "Soley" reveals itself
   via a CSS custom-property-driven dashoffset transition.

   Brush tracking: because SVGTextElement doesn't implement
   getPointAtLength we use a JS-driven rAF loop that measures the
   text element's bounding box once (font loaded) and maps the
   current drawn-fraction to an approximate leading-edge position
   by linearly interpolating across the word's horizontal span.
   This gives a brush that travels left→right at constant apparent
   speed, which is accurate for a left-to-right script word.

   After the word fully paints: hold 2 s → fade 0.8 s → next color.
   Brand colors cycle: terracotta → deep teal → clay gold → repeat.

   No R3F. No blob accumulation. Clean, legible, cinematic.
   Frame B: chalk panel centerpiece, generous white space,
   Sacramento at 160 px — restraint IS the statement.
   ref: Scout Section 5 SVG stroke-draw + Site B (Edina) whitespace rhythm.
*/

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
  const dashLenRef   = useRef(0)

  // Reactive state
  const [color, setColor]       = useState(BRAND_COLORS[0])
  const [svgOpacity, setSvgOpacity] = useState(1)
  const [brushX, setBrushX]    = useState(-100)
  const [brushY, setBrushY]    = useState(200)
  const [brushAngle, setBrushAngle] = useState(15)

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

    const el = textRef.current
    if (!el) return

    // Apply color
    el.style.stroke = col
    el.style.fill   = 'none'
    el.style.strokeWidth = '5'

    // Measure bounding box (font must be loaded)
    measureText()

    // Estimate path length from bbox: for a script word spanning bbox.w,
    // the actual stroke path is roughly 2.4× the width (ascenders/descenders)
    const bbox = bboxRef.current
    const estimatedLen = bbox ? bbox.w * 2.4 : 1400
    dashLenRef.current = estimatedLen

    el.style.strokeDasharray  = `${estimatedLen}`
    el.style.strokeDashoffset = `${estimatedLen}`

    startTimeRef.current = performance.now()

    const paintLoop = (now: number) => {
      if (phaseRef.current !== 'painting') return
      const elapsed  = now - startTimeRef.current
      const progress = Math.min(elapsed / STROKE_DURATION_MS, 1)

      // Stroke-dashoffset: linear easing for constant velocity
      const offset = estimatedLen * (1 - progress)
      el.style.strokeDashoffset = `${offset}`

      // Brush position: map progress to horizontal span
      if (bbox) {
        // Approximate x: script words read L→R almost linearly
        const bx = bbox.x + bbox.w * progress

        // Approximate y: slight sine wave to mimic baseline undulation of script
        // amplitude ≈ 20% of bbox height, centered at midY
        const bboxHeight = bbox.midY - bbox.y
        const by = bbox.midY + Math.sin(progress * Math.PI * 2.5) * bboxHeight * 0.2

        // Angle: derivative of y w.r.t. x (rough tangent)
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
        // Word complete — fill in solid color, park brush off-right
        el.style.fill  = col
        el.style.stroke = col
        el.style.strokeWidth = '2'
        if (bbox) setBrushX(bbox.x + bbox.w + 40)
        phaseRef.current = 'holding'

        timeoutRef.current = setTimeout(() => {
          // Fade out phase
          phaseRef.current = 'fading'
          const fadeStart = performance.now()

          const fadeLoop = (now: number) => {
            const t = Math.min((now - fadeStart) / FADE_DURATION_MS, 1)
            setSvgOpacity(1 - t)
            if (t < 1) {
              rafRef.current = requestAnimationFrame(fadeLoop)
            } else {
              // Reset text, cycle color
              setSvgOpacity(0)
              el.style.fill  = 'none'
              el.style.strokeWidth = '5'
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
      {/* Ambient radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
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
          fontSize: '0.8rem',
          letterSpacing: '0.28em',
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
        Watch the brush paint it out.
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
          }}
          aria-label="Soley — painted in script"
        >
          {/*
            Sacramento text — stroke-dashoffset animates from
            full length → 0, revealing each letterform as painted.
            The fill is initially 'none' so only the stroke stroke is visible.
            After painting completes, fill matches stroke for solidity.
          */}
          <text
            ref={textRef}
            x="320"
            y="210"
            textAnchor="middle"
            style={{
              fontFamily: '"Sacramento", cursive',
              fontSize: '172px',
              stroke: color,
              strokeWidth: '5',
              fill: 'none',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              paintOrder: 'stroke fill',
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
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
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
