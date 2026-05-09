'use client'

import { useEffect, useRef } from 'react'

/* ── Human-signal block (Option B) ──────────────────────────────────────
   No portrait placeholder — that was promising something we can't deliver.
   Instead: a full-width centered pull-quote block with honest operational
   copy. The painter behind Soley gets a real voice without a fake face.  */

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
      {/* Terracotta wash top-left */}
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
      {/* Ochre warm wash bottom-right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,136,74,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-width">

        {/* Eyebrow + heading */}
        <div
          className="scroll-reveal"
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 3.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-terra)',
              marginBottom: '1.25rem',
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
              lineHeight: 1.72,
              color: 'rgba(245,240,234,0.6)',
            }}
          >
            Soley Painting is owner-operated. Every estimate, every walkthrough, and every
            punch-list item is handled by the same person who answers the phone. No handoffs,
            no middlemen — the owner takes calls before 8pm and shows up on day one with the
            same crew that finishes the job.
          </p>
        </div>

        {/* Pull-quote — centered, full-width */}
        <blockquote
          className="scroll-reveal"
          style={{
            maxWidth: '660px',
            margin: '0 auto 3.5rem',
            borderLeft: '4px solid var(--color-terra)',
            paddingLeft: '2rem',
            position: 'relative',
          }}
        >
          {/* Large open-quote mark — foreground, full opacity (not a ghost number) */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: '-0.75rem',
              left: '1.75rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '3.5rem',
              lineHeight: 1,
              color: 'var(--color-terra)',
              opacity: 0.55,
              userSelect: 'none',
            }}
          >
            &ldquo;
          </span>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.3rem, 2.2vw, 1.65rem)',
              color: 'var(--color-chalk)',
              lineHeight: 1.45,
              marginBottom: '0.875rem',
              paddingTop: '1.5rem',
            }}
          >
            I&rsquo;d rather walk every project myself than hand it off
            to someone who hasn&rsquo;t read the spec sheet.
          </p>
          <cite
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontSize: '0.875rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.38)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ display: 'inline-block', width: '18px', height: '1px', background: 'var(--color-terra)', opacity: 0.6 }} />
            The painter behind Soley
          </cite>
        </blockquote>

        {/* Honest signals row — distinct data-pill treatment */}
        <div
          className="scroll-reveal"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          {[
            { label: 'Team size', value: 'Small, by design', accent: 'var(--color-rust)' },
            { label: 'First projects', value: 'Starting this season', accent: 'var(--color-ochre)' },
            { label: 'Owner on every job', value: 'Start to finish', accent: 'var(--color-terra)' },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              style={{
                borderLeft: `3px solid ${accent}`,
                paddingLeft: '0.875rem',
                paddingTop: '0.375rem',
                paddingBottom: '0.375rem',
                background: 'rgba(245,240,234,0.03)',
                flex: '1 1 180px',
                minWidth: 0,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: accent,
                  marginBottom: '0.2rem',
                  opacity: 0.75,
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                  color: 'rgba(245,240,234,0.7)',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
