'use client'

import { useEffect, useRef } from 'react'

/* ── Honest founder / human-signal block ─────────────────────────────
   Catalog gap: zero "who are these people" signal. This block gives the
   page a human anchor without inventing anyone. No fake name, no "Est.
   YYYY", no invented credentials. Placeholder portrait + honest copy.
   Inserted between WhySoley and Process.                               */

export default function FounderBlock() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.scroll-reveal, .scroll-reveal-left').forEach(node => {
            node.classList.add('in-view')
          })
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="founder"
      style={{
        background: 'var(--color-umber)',
        padding: '7rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle terracotta wash top-left */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-120px',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(194,96,58,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Teal wash bottom-right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,122,112,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-width">
        <div className="founder-grid">

          {/* Left — portrait placeholder */}
          <div
            className="scroll-reveal-left founder-portrait-col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '1.5rem',
              transitionDelay: '0s',
            }}
          >
            {/* Portrait placeholder tile */}
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '4/5',
                background: 'rgba(245,240,234,0.04)',
                border: '1px solid rgba(245,240,234,0.12)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              {/* Chalk silhouette SVG */}
              <svg
                width="80"
                height="100"
                viewBox="0 0 80 100"
                fill="none"
                style={{ opacity: 0.18 }}
              >
                <circle cx="40" cy="28" r="18" stroke="#F5F0EA" strokeWidth="1.5" fill="none"/>
                <path
                  d="M6 96 Q6 60 40 60 Q74 60 74 96"
                  stroke="#F5F0EA"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Paint roller detail */}
                <rect x="28" y="70" width="24" height="10" rx="2" stroke="#F5F0EA" strokeWidth="1" fill="none" opacity="0.5"/>
                <line x1="40" y1="80" x2="40" y2="90" stroke="#F5F0EA" strokeWidth="1" opacity="0.4"/>
              </svg>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,234,0.3)',
                  textAlign: 'center',
                  padding: '0 1.5rem',
                }}
              >
                Founder portrait forthcoming
              </p>

              {/* Corner accent marks */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', width: '18px', height: '18px', borderTop: '1px solid var(--color-terra)', borderLeft: '1px solid var(--color-terra)' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', width: '18px', height: '18px', borderTop: '1px solid var(--color-terra)', borderRight: '1px solid var(--color-terra)' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '18px', height: '18px', borderBottom: '1px solid var(--color-terra)', borderLeft: '1px solid var(--color-terra)' }} />
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '18px', height: '18px', borderBottom: '1px solid var(--color-terra)', borderRight: '1px solid var(--color-terra)' }} />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,234,0.28)',
              }}
            >
              Real photography on the way
            </p>
          </div>

          {/* Right — copy */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '2rem',
            }}
          >
            <div
              className="scroll-reveal"
              style={{ transitionDelay: '0.1s' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-terra)',
                  marginBottom: '1rem',
                }}
              >
                Who&apos;s behind Soley
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  color: 'var(--color-chalk)',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                }}
              >
                Run by a small crew
                <br />
                <em style={{ color: 'var(--color-terra)' }}>that actually shows up.</em>
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: 'rgba(245,240,234,0.65)',
                  maxWidth: '44ch',
                }}
              >
                Soley Painting is a small, owner-operated company. Every estimate,
                every walkthrough, every final punch-list item gets handled by the
                same person who answers the phone. We are building this the right way
                — slowly, with the people whose homes and offices we paint.
              </p>
            </div>

            {/* Pull quote — attributed honestly */}
            <blockquote
              className="scroll-reveal"
              style={{
                borderLeft: '3px solid var(--color-terra)',
                paddingLeft: '1.5rem',
                margin: 0,
                transitionDelay: '0.2s',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                  color: 'var(--color-chalk)',
                  lineHeight: 1.45,
                  marginBottom: '0.875rem',
                }}
              >
                &ldquo;I&rsquo;d rather walk every project myself than hand it off
                to someone who hasn&rsquo;t read the spec sheet.&rdquo;
              </p>
              <cite
                style={{
                  fontFamily: 'var(--font-body)',
                  fontStyle: 'normal',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,234,0.4)',
                }}
              >
                — The painter behind Soley
              </cite>
            </blockquote>

            {/* Honest signals row */}
            <div
              className="scroll-reveal"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem 2rem',
                transitionDelay: '0.3s',
              }}
            >
              {[
                { label: 'Team size', value: 'Small, by design' },
                { label: 'First projects', value: 'Starting this season' },
                { label: 'Names + portraits', value: 'Coming once we launch' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(245,240,234,0.35)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'rgba(245,240,234,0.65)',
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
