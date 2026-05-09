'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const STEPS = [
  {
    id: 1,
    title: 'Free Walkthrough',
    description:
      'We visit the site, measure every surface, and assess conditions — adhesion, existing coatings, moisture, and prep requirements.',
    bullets: [
      'We come to you — no showroom required',
      'Written quote delivered within 48 hours',
      'Zero-ballpark-range pricing — every line item explained',
    ],
  },
  {
    id: 2,
    title: 'Color Consultation',
    description:
      'Sample boards applied directly to your walls in natural and artificial light. No guessing from paint chips under fluorescents.',
    bullets: [
      'Sample boards in actual paint — not swatches',
      'Tested in day, evening, and lamp light',
      'Revision until it\'s right — before a single drop is ordered',
    ],
  },
  {
    id: 3,
    title: 'Surface Prep',
    description:
      'The coat you don\'t see is what makes the one you do last. Every surface cleaned, sanded, primed, and caulked before application.',
    bullets: [
      'Floor-to-ceiling drop-cloth protection on every project',
      'All trim gaps caulked before primer',
      'Bare drywall gets a full prime coat — no shortcuts',
    ],
  },
  {
    id: 4,
    title: 'Application',
    description:
      'Two full coats applied to specification. We stay until the edges are right — no rushing the dry time to hit the next job.',
    bullets: [
      'Two-coat minimum on all surfaces',
      'Wet-edge maintained on every wall run',
      'Mid-job walkthrough with homeowner if requested',
    ],
  },
  {
    id: 5,
    title: 'Final Walkthrough & Touch-Up',
    description:
      'We walk every room with you before we call it done. Punch list completed same day — not scheduled for a follow-up visit.',
    bullets: [
      'Room-by-room inspection with the client',
      'Touch-ups before the final invoice',
      'Arrival window confirmed the night before — every time',
    ],
  },
]

const STEP_DURATION = 10000 // 10s per step

export default function Process() {
  const [activeStep, setActiveStep] = useState(0)
  const [key, setKey] = useState(0) // forces countdown bar re-render
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const advance = useCallback(() => {
    setActiveStep(prev => (prev + 1) % STEPS.length)
    setKey(prev => prev + 1)
  }, [])

  // IntersectionObserver — start auto-advance when section is in view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (visible) {
      intervalRef.current = setInterval(advance, STEP_DURATION)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [visible, advance])

  const step = STEPS[activeStep]

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{
        background: 'var(--color-umber)',
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-width">
        {/* Header */}
        <div
          className="scroll-reveal"
          style={{ marginBottom: '3.5rem', maxWidth: '38ch' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-terra)',
              marginBottom: '1rem',
            }}
          >
            How we work
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
              color: 'var(--color-chalk)',
              lineHeight: 1.1,
            }}
          >
            Five steps.<br />
            <em>Zero surprises.</em>
          </h2>
        </div>

        <div
          className="process-grid"
          style={{
            alignItems: 'start',
          }}
        >
          {/* Step nav tabs */}
          <div className="process-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === activeStep}
                onClick={() => {
                  setActiveStep(i)
                  setKey(prev => prev + 1)
                  if (intervalRef.current) clearInterval(intervalRef.current)
                  if (visible) {
                    intervalRef.current = setInterval(advance, STEP_DURATION)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: i === activeStep ? 'rgba(194,96,58,0.12)' : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${i === activeStep ? 'var(--color-terra)' : 'rgba(245,240,234,0.08)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  minHeight: '44px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    color: i === activeStep ? 'var(--color-terra)' : 'rgba(245,240,234,0.3)',
                    minWidth: '1.5rem',
                  }}
                >
                  0{s.id}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: i === activeStep ? 'var(--color-chalk)' : 'rgba(245,240,234,0.45)',
                  }}
                >
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Step content */}
          <div key={activeStep} style={{ paddingTop: '0.5rem' }}>
            {/* Countdown bar */}
            <div
              style={{
                height: '2px',
                background: 'rgba(245,240,234,0.1)',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                key={key}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--color-terra)',
                  transformOrigin: 'left center',
                  animation: visible
                    ? `countdown ${STEP_DURATION}ms linear forwards`
                    : 'none',
                }}
              />
            </div>

            {/* Title with char stagger */}
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: 'var(--color-chalk)',
                marginBottom: '1.25rem',
                lineHeight: 1.1,
              }}
            >
              {step.title.split('').map((char, ci) => (
                <span
                  key={`${activeStep}-${ci}`}
                  style={{
                    display: 'inline-block',
                    animation: `char-in 0.4s cubic-bezier(0.16,1,0.3,1) ${ci * 0.03}s both`,
                  }}
                >
                  {char === ' ' ? ' ' : char}
                </span>
              ))}
            </h3>

            {/* Description with word stagger */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.75,
                color: 'rgba(245,240,234,0.7)',
                marginBottom: '2rem',
                maxWidth: '54ch',
              }}
            >
              {step.description.split(' ').map((word, wi) => (
                <span
                  key={`${activeStep}-w${wi}`}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.28em',
                    animation: `char-in 0.4s cubic-bezier(0.16,1,0.3,1) ${wi * 0.04 + 0.2}s both`,
                  }}
                >
                  {word}
                </span>
              ))}
            </p>

            {/* Bullets — staggered pop */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {step.bullets.map((bullet, bi) => (
                <li
                  key={`${activeStep}-b${bi}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.875rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    color: 'rgba(245,240,234,0.8)',
                    marginBottom: '0.875rem',
                    animation: `char-in 0.45s cubic-bezier(0.16,1,0.3,1) ${bi * 0.12 + 0.6}s both`,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(194,96,58,0.2)',
                      border: '1px solid rgba(194,96,58,0.4)',
                      flexShrink: 0,
                      marginTop: '0.1em',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--color-terra)',
                      }}
                    />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
