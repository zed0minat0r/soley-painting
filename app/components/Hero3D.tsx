'use client'

import Hero3DCanvas from './Hero3DCanvas'

/* ── Soley Painting — Rotating 3D Paintbrush Hero
   Centerpiece: a real WebGL paintbrush (handle, ferrule, bristles, paint-loaded
   tip) rotating continuously on its long axis. The paint on the bristle tip
   cycles through the brand palette. Ported from Penn Tech's R3F cube technique.
*/

// ── Ambient drifting particles (background atmosphere) ────────────────────
type Particle = { id: number; x: number; y: number; r: number; color: string; opacity: number; dur: number; delay: number }
const PARTICLES: Particle[] = [
  { id:0, x:8,  y:90, r:3.5, color:'#244238', opacity:0.18, dur:16, delay:0 },
  { id:1, x:18, y:75, r:2.5, color:'#C9A876', opacity:0.14, dur:18, delay:2.4 },
  { id:2, x:32, y:85, r:4,   color:'#C9A876', opacity:0.16, dur:14, delay:1.1 },
  { id:3, x:52, y:95, r:2,   color:'#244238', opacity:0.12, dur:20, delay:3.7 },
  { id:4, x:65, y:80, r:3,   color:'#C9A876', opacity:0.15, dur:15, delay:5.2 },
  { id:5, x:78, y:88, r:2.5, color:'#C9A876', opacity:0.13, dur:17, delay:0.8 },
  { id:6, x:88, y:70, r:3.5, color:'#244238', opacity:0.17, dur:16, delay:6.3 },
  { id:7, x:45, y:92, r:2,   color:'#C9A876', opacity:0.11, dur:19, delay:4.1 },
  { id:8, x:24, y:60, r:3,   color:'#C9A876', opacity:0.14, dur:14, delay:7.5 },
  { id:9, x:70, y:55, r:2.5, color:'#244238', opacity:0.16, dur:17, delay:2.0 },
]

export default function Hero3D() {
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
            <stop offset="0%" stopColor="#244238" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#244238" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gobo-ochre" cx="18%" cy="82%" r="40%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A876" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#C9A876" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gobo-warm)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#gobo-ochre)" />
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

      {/* Ambient spotlight — centered on the brush's visual mass (bristles +
          paint, which sit in the upper portion of the canvas-wrap, not on the
          mathematical brush center which would put the glow too low). */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '46%',
          transform: 'translate(-50%, -50%)',
          width: 'min(560px, 90vw)',
          height: 'min(560px, 90vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,168,118,0.16) 0%, rgba(36,66,56,0.08) 45%, transparent 75%)',
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
          color: 'var(--color-ochre)',
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
            '0 0 1px #fff, 0 0 10px rgba(36,66,56,0.75), 0 0 28px rgba(201,168,118,0.35)',
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
          color: 'rgba(242, 235, 217, 0.6)',
          letterSpacing: '0.04em',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '36ch',
        }}
      >
        Owner-operated. Same crew start to finish. Free walkthrough, written quote in 24 hours.
      </p>

      {/* ── 3D PAINTBRUSH CENTERPIECE ── */}
      <div
        className="hero-canvas-wrap"
        style={{
          width: 'min(620px, 92vw)',
          aspectRatio: '1 / 1',
          maxHeight: '62vh',
          position: 'relative',
        }}
      >
        {/* Backlight glow — tight spotlight centered on the brush bristles
            (upper portion of the canvas-wrap, where the visual mass sits). */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 50% 42%, rgba(201,168,118,0.22) 0%, rgba(36,66,56,0.12) 40%, rgba(20,36,29,0) 70%)',
            filter: 'blur(6px)',
          }}
        />
        <Hero3DCanvas />
      </div>

      {/* Body copy */}
      <p
        className="glow-sub"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(242, 235, 217, 0.72)',
          maxWidth: '46ch',
          marginTop: '2.5rem',
          textAlign: 'center',
          textShadow:
            '0 0 1px rgba(255,255,255,0.5), 0 0 8px rgba(201,168,118,0.55), 0 0 20px rgba(36,66,56,0.25)',
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
        className="hero-trust-signals"
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          borderTop: '1px solid rgba(244, 237, 237, 0.12)',
          display: 'flex',
          gap: '2.5rem',
          rowGap: '1.5rem',
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
                color: 'rgba(242, 235, 217, 0.5)',
              }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}
