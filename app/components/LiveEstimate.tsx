'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Catalog item #6 — Live auto-typing estimate form ───────────────────
   Fixed-height card (420px desktop / 380px mobile) — no layout jump.
   Natural typing rhythm: 50–80ms/char with ±10ms random variation.
   Blink cursor on active field's last character.
   "Send" → terracotta checkmark + "We respond within 24 hours."
   8s loop: type → settle → send → checkmark → fade → restart.
   NO fake names, NO fake prices, NO fake phone numbers.
   Ref: Scout catalog row #6 — Penn Tech iMessage → painter estimate form.
   Frame B: Clarity & Whitespace — editorial two-col layout, generous gutter. */

type Phase =
  | 'idle'
  | 'typing-type'
  | 'typing-address'
  | 'typing-message'
  | 'sent'
  | 'pausing'

const PROJECT_TYPE = 'Interior — 3 rooms'
const PLACEHOLDER_ADDRESS = '123 Maple Street'
const PLACEHOLDER_MESSAGE =
  'Repaint primary bedroom + en-suite, ~280 sq ft. Want low-VOC throughout and clean lines on the trim. Flexible on timing — can do a walkthrough any weekday morning.'

/* Natural typing: base delay + random jitter (±10ms) */
async function typeString(
  target: string,
  baseDelay: number,
  setter: (s: string) => void,
  cancelRef: React.MutableRefObject<boolean>
) {
  for (let i = 1; i <= target.length; i++) {
    if (cancelRef.current) return
    setter(target.slice(0, i))
    const jitter = Math.random() * 20 - 10 // ±10ms
    await new Promise((r) => setTimeout(r, Math.max(20, baseDelay + jitter)))
  }
}

export default function LiveEstimate() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [typeValue, setTypeValue] = useState('')
  const [addressValue, setAddressValue] = useState('')
  const [messageValue, setMessageValue] = useState('')
  const [cursorField, setCursorField] = useState<'type' | 'address' | 'message' | null>(null)
  const cancelRef = useRef(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  async function runSequence() {
    cancelRef.current = false

    setTypeValue('')
    setAddressValue('')
    setMessageValue('')
    setPhase('typing-type')
    setCursorField('type')

    await new Promise((r) => setTimeout(r, 500))
    await typeString(PROJECT_TYPE, 58, setTypeValue, cancelRef)
    if (cancelRef.current) return

    await new Promise((r) => setTimeout(r, 700))
    setPhase('typing-address')
    setCursorField('address')

    await typeString(PLACEHOLDER_ADDRESS, 65, setAddressValue, cancelRef)
    if (cancelRef.current) return

    await new Promise((r) => setTimeout(r, 700))
    setPhase('typing-message')
    setCursorField('message')

    await typeString(PLACEHOLDER_MESSAGE, 32, setMessageValue, cancelRef)
    if (cancelRef.current) return

    await new Promise((r) => setTimeout(r, 900))
    setCursorField(null)
    setPhase('sent')

    await new Promise((r) => setTimeout(r, 8000))
    if (cancelRef.current) return

    setPhase('pausing')
    await new Promise((r) => setTimeout(r, 1400))
    if (cancelRef.current) return

    runSequence()
  }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          runSequence()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isSent = phase === 'sent'

  /* Shared label style */
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '0.6875rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(245,240,234,0.45)',
    marginBottom: '0.375rem',
  }

  /* Shared field box style */
  const fieldBox = (active: boolean): React.CSSProperties => ({
    padding: '0.75rem 1rem',
    background: active ? 'rgba(194,96,58,0.06)' : 'rgba(245,240,234,0.04)',
    border: `1px solid ${active ? 'rgba(194,96,58,0.7)' : 'rgba(245,240,234,0.12)'}`,
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    color: 'var(--color-chalk)',
    minHeight: '46px',
    lineHeight: 1.5,
    transition: 'border-color 0.25s ease, background 0.25s ease',
    position: 'relative' as const,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  })

  const blinkCursor = (
    <span
      style={{
        display: 'inline-block',
        width: '2px',
        height: '1em',
        background: 'var(--color-terra)',
        marginLeft: '2px',
        verticalAlign: 'middle',
        animation: 'blink-cursor 0.8s step-end infinite',
      }}
    />
  )

  return (
    <section
      id="live-estimate"
      ref={sectionRef}
      style={{
        background: 'var(--color-chalk)',
        padding: '5.5rem 0',
        position: 'relative',
      }}
    >
      {/* Teal top stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-teal), var(--color-terra))',
        }}
      />

      <div className="container-width">
        {/* Two-column layout: left = copy / right = animated card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '4rem',
            alignItems: 'center',
          }}
          className="estimate-grid"
        >
          {/* Left: editorial copy */}
          <div className="scroll-reveal">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-terra)',
                marginBottom: '1rem',
              }}
            >
              See how an estimate comes together
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(1.875rem, 3vw, 2.75rem)',
                color: 'var(--color-umber)',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              A written quote —<br />
              <em>no ballpark ranges.</em>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'rgba(44,31,22,0.65)',
                marginBottom: '2rem',
                maxWidth: '38ch',
              }}
            >
              The demo below shows what filling out a real estimate request looks like.
              We measure every surface ourselves, then send a line-item written quote
              within 24 hours — no ballpark ranges, no surprises.
            </p>

            {/* Honest commitment bullets */}
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {[
                'Free in-home walkthrough — we measure every surface ourselves',
                'Itemized written quote within 24 hours, no ballpark ranges',
                'Same person from estimate to final walkthrough — no crew-lead handoffs',
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    color: 'rgba(44,31,22,0.75)',
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(194,96,58,0.1)',
                      border: '1px solid rgba(194,96,58,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.2 7.5L8 3" stroke="#C2603A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: animated form card */}
          <div
            style={{
              background: 'var(--color-umber)',
              border: '1px solid rgba(245,240,234,0.08)',
              padding: '2rem 2rem 1.75rem',
              position: 'relative',
              /* Fixed height: no layout jump as fields fill */
              height: '420px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 24px 64px rgba(44,31,22,0.18)',
            }}
          >
            {/* Card label row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isSent ? 'var(--color-terra)' : 'rgba(245,240,234,0.4)',
                  transition: 'color 0.4s ease',
                  margin: 0,
                }}
              >
                {isSent ? 'Estimate request sent' : 'Example — how your request looks'}
              </p>
              {/* Live indicator dot */}
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isSent ? 'var(--color-terra)' : 'rgba(45,122,112,0.6)',
                  boxShadow: isSent ? '0 0 8px rgba(194,96,58,0.6)' : '0 0 6px rgba(45,122,112,0.4)',
                  transition: 'all 0.4s ease',
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
              {/* Project type */}
              <div>
                <label style={labelStyle}>Project type</label>
                <div style={fieldBox(cursorField === 'type')}>
                  {typeValue || (phase === 'idle' && <span style={{ color: 'rgba(245,240,234,0.28)' }}>Interior, exterior, commercial…</span>)}
                  {cursorField === 'type' && blinkCursor}
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={labelStyle}>Property address</label>
                <div style={fieldBox(cursorField === 'address')}>
                  {addressValue || (phase === 'idle' && <span style={{ color: 'rgba(245,240,234,0.28)' }}>Street address…</span>)}
                  {cursorField === 'address' && blinkCursor}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Project details</label>
                <div
                  style={{
                    ...fieldBox(cursorField === 'message'),
                    minHeight: '72px',
                  }}
                >
                  {messageValue || (phase === 'idle' && <span style={{ color: 'rgba(245,240,234,0.28)' }}>Tell us about your project…</span>)}
                  {cursorField === 'message' && blinkCursor}
                </div>
              </div>
            </div>

            {/* Send / Sent row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                marginTop: '1.25rem',
                minHeight: '44px',
              }}
            >
              {isSent ? (
                <>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(194,96,58,0.18)',
                      border: '1px solid var(--color-terra)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      animation: 'pop-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8 L6.5 12 L13 4"
                        stroke="var(--color-terra)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      color: 'var(--color-terra)',
                      animation: 'pop-in 0.35s cubic-bezier(0.16,1,0.3,1) 0.1s both',
                    }}
                  >
                    Request sent — we respond within 24 hours.
                  </span>
                </>
              ) : (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: phase === 'idle' ? 'transparent' : 'rgba(194,96,58,0.3)',
                    border: '1px solid rgba(194,96,58,0.35)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,240,234,0.55)',
                    transition: 'background 0.4s ease',
                    userSelect: 'none',
                  }}
                >
                  Send estimate request
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
