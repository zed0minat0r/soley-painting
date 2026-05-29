'use client'

import { useEffect, useState } from 'react'

/* ── Soley Painting — Liquid Paint Pour Hero
   Technique: A continuous viscous stream of paint pours from the top of the
   canvas, falls under gravity, and pools at the bottom. The stream cycles
   through the brand palette (rust → ochre → stone → umber). SVG turbulence
   + feDisplacementMap give the stream its organic wobble. Pool ripples and
   falling droplets are SMIL-animated. No new deps, no WebGL.
*/

// ── Ambient drifting particles (background atmosphere) ────────────────────
type Particle = { id: number; x: number; y: number; r: number; color: string; opacity: number; dur: number; delay: number }
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

// ── Paint pour palette cycle ──────────────────────────────────────────────
const PAINT_COLORS = ['#BF5B38', '#B8884A', '#5C4838', '#3D2A1E']
const COLOR_NAMES  = ['Rust', 'Ochre', 'Stone', 'Umber']
const SECONDS_PER_COLOR = 4
const TOTAL_CYCLE_SECONDS = SECONDS_PER_COLOR * PAINT_COLORS.length

// Build a values string for SMIL stop-color cycling, looping back to the first
const colorCycleValues = [...PAINT_COLORS, PAINT_COLORS[0]].join('; ')
// Pool color lags slightly behind the stream — start one slot delayed
const poolColorValues = [...PAINT_COLORS.slice(-1), ...PAINT_COLORS].join('; ')

export default function Hero3D() {
  const [colorIdx, setColorIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIdx(prev => (prev + 1) % PAINT_COLORS.length)
    }, SECONDS_PER_COLOR * 1000)
    return () => clearInterval(interval)
  }, [])

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

      {/* ── LIQUID PAINT POUR CENTERPIECE ── */}
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
          viewBox="0 0 560 245"
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
          style={{
            display: 'block',
            position: 'relative',
            zIndex: 2,
          }}
          aria-label="Liquid paint pouring through the Soley brand palette"
        >
          <defs>
            {/* Viscous distortion — gives the stream organic wobble */}
            <filter id="viscous" x="-15%" y="-5%" width="130%" height="115%">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.025" numOctaves="2" seed="3">
                <animate attributeName="baseFrequency"
                         values="0.008 0.025; 0.011 0.03; 0.007 0.022; 0.009 0.028; 0.008 0.025"
                         dur="10s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="3.5" />
            </filter>

            {/* Pool sheen — white highlight on top of pool */}
            <linearGradient id="pool-sheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Pool inner-shadow rim */}
            <radialGradient id="pool-rim" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#000000" stopOpacity="0" />
              <stop offset="85%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </radialGradient>

            {/* Stream highlight band — lighter centerline */}
            <linearGradient id="stream-highlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Background subtle vignette to lift the pour visually */}
            <radialGradient id="canvas-vignette" cx="50%" cy="50%" r="65%">
              <stop offset="0%"  stopColor="#F4EDE3" stopOpacity="0" />
              <stop offset="100%" stopColor="#1A0F08" stopOpacity="0.10" />
            </radialGradient>
          </defs>

          {/* Subtle horizontal grain — suggests a flat wall surface */}
          {[30, 60, 90, 120, 150, 180, 205].map((y, i) => (
            <line key={i} x1="0" y1={y} x2="560" y2={y} stroke="#E0D5C5" strokeWidth="0.4" opacity={0.32} />
          ))}

          {/* Canvas vignette */}
          <rect x="0" y="0" width="560" height="245" fill="url(#canvas-vignette)" />

          {/* ── PAINT STREAM (with viscous distortion filter) ── */}
          <g filter="url(#viscous)">
            {/* Stream body — thicker, taller, widens into the pool */}
            <path
              d="M 264 0 L 261 40 L 258 80 L 261 120 L 258 160 L 256 200 L 254 222 L 306 222 L 304 200 L 302 160 L 299 120 L 302 80 L 299 40 L 296 0 Z"
            >
              <animate
                attributeName="fill"
                values={colorCycleValues}
                dur={`${TOTAL_CYCLE_SECONDS}s`}
                repeatCount="indefinite"
              />
            </path>

            {/* Centerline highlight (wet sheen down the middle) */}
            <path
              d="M 273 0 L 272 70 L 273 140 L 274 210 L 286 210 L 287 140 L 286 70 L 287 0 Z"
              fill="url(#stream-highlight)"
            />

            {/* Falling droplets — staggered, repeating */}
            {[0, 0.6, 1.3, 2.1, 2.9].map((delay, i) => (
              <circle key={i} cx={278 + (i % 2 === 0 ? -3 : 3)} cy="0" r={1.8 + (i % 2) * 0.7}>
                <animate
                  attributeName="cy"
                  from="-10" to="225"
                  dur="2.6s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0; 0.75; 0.75; 0"
                  keyTimes="0; 0.1; 0.85; 1"
                  dur="2.6s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill"
                  values={colorCycleValues}
                  dur={`${TOTAL_CYCLE_SECONDS}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>

          {/* ── PAINT POOL — outside the viscous filter for a steadier rim ── */}
          <g>
            {/* Pool shadow on linen — soft darkness underneath */}
            <ellipse cx="280" cy="232" rx="200" ry="11" fill="#1A0F08" opacity="0.10" />

            {/* Pool body — larger and more present */}
            <ellipse cx="280" cy="222" rx="200" ry="16">
              <animate
                attributeName="fill"
                values={poolColorValues}
                dur={`${TOTAL_CYCLE_SECONDS}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="196; 204; 198; 202; 196"
                dur="6s"
                repeatCount="indefinite"
              />
            </ellipse>

            {/* Pool rim shadow */}
            <ellipse cx="280" cy="222" rx="200" ry="16" fill="url(#pool-rim)" />

            {/* Ripples — three staggered concentric ripples emanating from impact */}
            {[0, 1.2, 2.4].map((delay, i) => (
              <ellipse key={i} cx="280" cy="218" fill="none" strokeWidth="1.4">
                <animate attributeName="rx" from="12" to="160" dur="3.6s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="ry" from="2" to="12"   dur="3.6s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6; 0.5; 0" keyTimes="0; 0.4; 1" dur="3.6s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="stroke" values={poolColorValues} dur={`${TOTAL_CYCLE_SECONDS}s`} repeatCount="indefinite" />
              </ellipse>
            ))}

            {/* Pool sheen — white highlight on top */}
            <ellipse cx="280" cy="216" rx="194" ry="6" fill="url(#pool-sheen)" />

            {/* Impact splash spots — tiny droplet beads around the impact point */}
            <circle cx="244" cy="216" r="1.6" opacity="0.55">
              <animate attributeName="fill" values={poolColorValues} dur={`${TOTAL_CYCLE_SECONDS}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="314" cy="215" r="2.0" opacity="0.55">
              <animate attributeName="fill" values={poolColorValues} dur={`${TOTAL_CYCLE_SECONDS}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="222" cy="220" r="1.2" opacity="0.45">
              <animate attributeName="fill" values={poolColorValues} dur={`${TOTAL_CYCLE_SECONDS}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="336" cy="222" r="1.6" opacity="0.50">
              <animate attributeName="fill" values={poolColorValues} dur={`${TOTAL_CYCLE_SECONDS}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="224" r="0.9" opacity="0.40">
              <animate attributeName="fill" values={poolColorValues} dur={`${TOTAL_CYCLE_SECONDS}s`} repeatCount="indefinite" />
            </circle>
            <circle cx="360" cy="226" r="1.1" opacity="0.42">
              <animate attributeName="fill" values={poolColorValues} dur={`${TOTAL_CYCLE_SECONDS}s`} repeatCount="indefinite" />
            </circle>
          </g>

          {/* Color name label — bottom right */}
          <text
            x={552}
            y={238}
            textAnchor="end"
            fontFamily="var(--font-body), sans-serif"
            fontSize="10"
            letterSpacing="2"
            fill="rgba(34,24,16,0.32)"
            style={{ textTransform: 'uppercase' }}
          >
            {COLOR_NAMES[colorIdx]}  {colorIdx + 1}/{PAINT_COLORS.length}
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
