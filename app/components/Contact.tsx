'use client'

import { useEffect, useRef, useState } from 'react'
import LiveEstimate from './LiveEstimate'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  // Scroll-reveal
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Formspree URL — wire up when available
    setSubmitted(true)
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        background: 'var(--color-chalk)',
        padding: '7rem 0',
        position: 'relative',
      }}
    >
      <div className="container-width">
        <div
          className="contact-grid"
          style={{
            alignItems: 'start',
          }}
        >
          {/* Left — info */}
          <div>
            <p
              className="scroll-reveal-left"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-terra)',
                marginBottom: '1rem',
                transitionDelay: '0s',
              }}
            >
              Get a free estimate
            </p>
            <h2
              className="scroll-reveal-left"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                color: 'var(--color-umber)',
                lineHeight: 1.1,
                marginBottom: '1.75rem',
                transitionDelay: '0.1s',
              }}
            >
              Start with a<br />
              <em style={{ color: 'var(--color-terra)' }}>free walkthrough.</em>
            </h2>

            <p
              className="scroll-reveal-left"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.72,
                color: 'rgba(44, 31, 22, 0.7)',
                maxWidth: '38ch',
                marginBottom: '2.5rem',
                transitionDelay: '0.2s',
              }}
            >
              We measure, assess surfaces, and deliver a written quote — no ballpark
              ranges, no pressure. We confirm our arrival window the night before,
              every time.
            </p>

            {/* Honest commitments list */}
            <div
              className="scroll-reveal-left"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem', transitionDelay: '0.3s' }}
            >
              {[
                'We answer every call — no voicemail runaround',
                'We show up inside our confirmed window, every time',
                'Written estimates, line by line — no ballpark ranges',
                'Floors, furniture, and trim protected on every day of the job',
                'Low-VOC formulations on every interior, by default',
                'Written warranty terms provided when scope is finalized',
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(194,96,58,0.12)',
                      border: '1px solid rgba(194,96,58,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="var(--color-terra)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: 'rgba(44, 31, 22, 0.72)',
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="scroll-reveal-left"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', transitionDelay: '0.4s' }}
            >
              {[
                {
                  label: 'Service area',
                  value: 'Details coming soon — currently serving the region by referral',
                },
                {
                  label: 'Estimate response time',
                  value: 'Written quote delivered within 48 hours of walkthrough',
                },
                {
                  label: 'Project gallery',
                  value: 'Photography forthcoming — first projects starting this season',
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--color-umber)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      lineHeight: 1.55,
                      color: 'rgba(44, 31, 22, 0.6)',
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live estimate preview + form */}
          <div className="scroll-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Live auto-typing estimate demo (catalog item #6) */}
            <div
              style={{
                background: 'var(--color-umber)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Accent corner */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '64px',
                  height: '4px',
                  background: 'var(--color-terra)',
                  zIndex: 1,
                }}
              />
              <LiveEstimate />
            </div>

            {/* Real form */}
            <div
              style={{
                background: 'var(--color-umber)',
                padding: '2rem 2rem 2.5rem',
                position: 'relative',
              }}
            >
            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(194,96,58,0.15)',
                    border: '2px solid var(--color-terra)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '1.5rem',
                  }}
                >
                  ✓
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.75rem',
                    color: 'var(--color-chalk)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Request received
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(245,240,234,0.6)',
                    fontSize: '0.9375rem',
                  }}
                >
                  We&apos;ll be in touch within 24 hours to schedule your free walkthrough.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.625rem',
                    color: 'var(--color-chalk)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Tell us about your project
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'rgba(245,240,234,0.45)',
                    marginBottom: '2rem',
                  }}
                >
                  No pressure, no pitch — just a conversation.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label
                        htmlFor="name"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.6875rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'rgba(245,240,234,0.45)',
                          display: 'block',
                          marginBottom: '0.4rem',
                        }}
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="form-field"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.6875rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'rgba(245,240,234,0.45)',
                          display: 'block',
                          marginBottom: '0.4rem',
                        }}
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="form-field"
                        placeholder="(555) 000-0000"
                        value={formState.phone}
                        onChange={e => setFormState(s => ({ ...s, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,234,0.45)',
                        display: 'block',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-field"
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.6875rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,234,0.45)',
                        display: 'block',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Tell us about the project
                    </label>
                    <textarea
                      id="message"
                      className="form-field"
                      placeholder="Interior or exterior? Rooms, square footage, any prep concerns..."
                      rows={4}
                      value={formState.message}
                      onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ marginTop: '0.5rem', justifyContent: 'center', width: '100%' }}
                  >
                    Request Free Walkthrough
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
