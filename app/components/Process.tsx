'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ── Soley Painting — Process Timeline (cinematic upgrade)
   Frame A: cross-fade panel transition (slide-left-out → slide-left-in),
   char-stagger title, word-stagger description (translateX entry),
   bullet pop sequence, foreground step numeral, prefers-reduced-motion.
   ref: Penn Tech catalog #7 char/word-stagger + Scout Round 3 Hermès
   illustrated lessons (visible craft imperfection).
*/

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
      'We apply sample boards directly to your walls and test them in natural and lamp light. No color decisions from a 1-inch chip held up under a fluorescent bulb.',
    bullets: [
      'Sample boards in actual paint — not 1-inch chips',
      'Tested in day, evening, and lamp light on your actual walls',
      'We revise until it\'s right — before a single gallon is ordered',
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
const EXIT_MS = 320         // ms for slide-left-out transition before entry

export default function Process() {
  const [activeStep, setActiveStep]     = useState(0)
  const [displayStep, setDisplayStep]   = useState(0)  // what's actually rendered
  const [panelState, setPanelState]     = useState<'entering' | 'visible' | 'exiting'>('visible')
  const [key, setKey]                   = useState(0)  // countdown bar reset
  const intervalRef                     = useRef<ReturnType<typeof setInterval> | null>(null)
  const sectionRef                      = useRef<HTMLElement>(null)
  const [visible, setVisible]           = useState(false)
  const nextStepRef                     = useRef<number>(0)
  const transitioningRef                = useRef(false)

  // Transition to a new step: exit → update content → enter
  const transitionTo = useCallback((next: number) => {
    if (transitioningRef.current) return
    transitioningRef.current = true

    // Check prefers-reduced-motion
    const reducedMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      // Static fade — no slide
      setDisplayStep(next)
      setActiveStep(next)
      setKey(k => k + 1)
      nextStepRef.current = next
      transitioningRef.current = false
      return
    }

    // 1. Start exit animation
    setPanelState('exiting')

    setTimeout(() => {
      // 2. Swap content while invisible
      setDisplayStep(next)
      setPanelState('entering')
      setActiveStep(next)
      setKey(k => k + 1)
      // 3. A frame later, let the enter animation run
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPanelState('visible')
          // Update ref AFTER transition completes so advance() reads correct current step
          nextStepRef.current = next
          transitioningRef.current = false
        })
      })
    }, EXIT_MS)
  }, [])

  const advance = useCallback(() => {
    // nextStepRef tracks the CURRENTLY DISPLAYED step (updated by transitionTo).
    // advance always moves +1 from the current displayed step.
    const next = (nextStepRef.current + 1) % STEPS.length
    transitionTo(next)
  }, [transitionTo])

  // IntersectionObserver — start auto-advance when section is in view.
  // threshold: 0.05 (not 0.3) so even a small sliver of the section entering
  // the viewport triggers the interval. 0.3 required 30% (≈239px) in view
  // before firing — programmatic scrolls and fast-scroll users missed it.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '0px' }
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

  const step = STEPS[displayStep]

  // Panel style based on state
  const panelStyle: React.CSSProperties = {
    paddingTop: '0.5rem',
    transition: panelState === 'exiting'
      ? `opacity ${EXIT_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${EXIT_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
      : panelState === 'entering'
      ? 'none'
      : `opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)`,
    opacity: panelState === 'exiting' ? 0 : panelState === 'entering' ? 0 : 1,
    transform: panelState === 'exiting'
      ? 'translateX(-16px)'
      : panelState === 'entering'
      ? 'translateX(16px)'
      : 'translateX(0)',
  }

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
              letterSpacing: '0.3em',
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
          style={{ alignItems: 'start' }}
        >
          {/* Step nav tabs — BUG-038: full ARIA tablist pattern */}
          <div
            className="process-tabs"
            role="tablist"
            aria-label="Process steps"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
            onKeyDown={(e) => {
              // Arrow-key roving tabindex for keyboard navigation
              const tabs = sectionRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
              if (!tabs) return
              const currentIdx = Array.from(tabs).findIndex(t => t === document.activeElement)
              if (currentIdx === -1) return
              let next = currentIdx
              if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault()
                next = (currentIdx + 1) % STEPS.length
              } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault()
                next = (currentIdx - 1 + STEPS.length) % STEPS.length
              } else if (e.key === 'Home') {
                e.preventDefault()
                next = 0
              } else if (e.key === 'End') {
                e.preventDefault()
                next = STEPS.length - 1
              } else {
                return
              }
              tabs[next].focus()
              if (intervalRef.current) clearInterval(intervalRef.current)
              nextStepRef.current = next
              transitionTo(next)
              if (visible) {
                setTimeout(() => {
                  intervalRef.current = setInterval(advance, STEP_DURATION)
                }, EXIT_MS + 60)
              }
            }}
          >
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                id={`process-tab-${i}`}
                role="tab"
                aria-selected={i === activeStep}
                aria-controls={`process-panel-${i}`}
                tabIndex={i === activeStep ? 0 : -1}
                onClick={() => {
                  if (intervalRef.current) clearInterval(intervalRef.current)
                  nextStepRef.current = i
                  transitionTo(i)
                  if (visible) {
                    setTimeout(() => {
                      intervalRef.current = setInterval(advance, STEP_DURATION)
                    }, EXIT_MS + 60)
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
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
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

          {/* Step content panel — cross-fade + slide transition */}
          {/* BUG-038: role=tabpanel with id + aria-labelledby matching the active tab */}
          <div
            role="tabpanel"
            id={`process-panel-${activeStep}`}
            aria-labelledby={`process-tab-${activeStep}`}
            tabIndex={0}
            style={panelStyle}
          >
            {/* Foreground step numeral — full opacity (RULE 8 compliant: NOT ghost) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
                  lineHeight: 1,
                  color: 'var(--color-terra)',
                  opacity: 1,  // full opacity — not a ghost
                  letterSpacing: '-0.02em',
                }}
              >
                0{step.id}
              </span>
              {/* Countdown bar sits beside the step numeral */}
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: 'rgba(245,240,234,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  alignSelf: 'center',
                }}
              >
                <div
                  key={`${key}-${visible ? 'v' : 'h'}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--color-terra)',
                    transformOrigin: 'left center',
                    /* BUG-032 fix: key includes visible state so the element
                       re-mounts (restarting the CSS animation) when the section
                       enters view. Previously key only changed on step advance,
                       so the countdown never started on first entry. */
                    animation: visible
                      ? `countdown ${STEP_DURATION}ms linear forwards`
                      : 'none',
                  }}
                />
              </div>
            </div>

            {/* Title — char stagger (re-triggers each step via key in span) */}
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
                  key={`${displayStep}-c${ci}`}
                  style={{
                    display: 'inline-block',
                    animation: `char-in 0.42s cubic-bezier(0.16,1,0.3,1) ${ci * 0.035}s both`,
                  }}
                >
                  {char === ' ' ? ' ' : char}
                </span>
              ))}
            </h3>

            {/* Description — word stagger with translateX entry (spec: -6px) */}
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
                  key={`${displayStep}-w${wi}`}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.28em',
                    animation: `word-in 0.42s cubic-bezier(0.16,1,0.3,1) ${wi * 0.045 + 0.18}s both`,
                  }}
                >
                  {word}
                </span>
              ))}
            </p>

            {/* Bullets — scale pop in sequence after description settles */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {step.bullets.map((bullet, bi) => (
                <li
                  key={`${displayStep}-b${bi}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.875rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    color: 'rgba(245,240,234,0.8)',
                    marginBottom: '0.875rem',
                    animation: `bullet-pop 0.45s cubic-bezier(0.16,1,0.3,1) ${bi * 0.13 + 0.55}s both`,
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
