'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Catalog item #6 — Live auto-typing estimate form ───────────────────
   A fixed-height mock "Get a Quote" card that auto-types into its fields:
   project type selects "Interior / 3 rooms", address types character by
   character ("123 Maple Street"), message fills phrase, then shows a
   terracotta checkmark "Sent" state. Loops after 8s pause.
   NO fake phone, NO fake price, NO fake response quote.
   Ref: Scout catalog row #6 — Penn Tech iMessage → painter estimate form. */

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
  'Looking to repaint before spring — light neutrals throughout. Available for a walkthrough anytime.'

/* Type a string character by character, calling cb with each step */
async function typeString(
  target: string,
  delay: number,
  setter: (s: string) => void,
  cancelRef: React.MutableRefObject<boolean>
) {
  for (let i = 1; i <= target.length; i++) {
    if (cancelRef.current) return
    setter(target.slice(0, i))
    await new Promise((r) => setTimeout(r, delay))
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

  /* Run the typing sequence */
  async function runSequence() {
    cancelRef.current = false

    // Reset
    setTypeValue('')
    setAddressValue('')
    setMessageValue('')
    setPhase('typing-type')
    setCursorField('type')

    await new Promise((r) => setTimeout(r, 400))
    await typeString(PROJECT_TYPE, 42, setTypeValue, cancelRef)
    if (cancelRef.current) return

    await new Promise((r) => setTimeout(r, 600))
    setPhase('typing-address')
    setCursorField('address')

    await typeString(PLACEHOLDER_ADDRESS, 55, setAddressValue, cancelRef)
    if (cancelRef.current) return

    await new Promise((r) => setTimeout(r, 600))
    setPhase('typing-message')
    setCursorField('message')

    await typeString(PLACEHOLDER_MESSAGE, 28, setMessageValue, cancelRef)
    if (cancelRef.current) return

    await new Promise((r) => setTimeout(r, 800))
    setCursorField(null)
    setPhase('sent')

    // Pause at "sent" state
    await new Promise((r) => setTimeout(r, 8000))
    if (cancelRef.current) return

    setPhase('pausing')
    await new Promise((r) => setTimeout(r, 1200))
    if (cancelRef.current) return

    runSequence() // loop
  }

  /* Start when in view */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 'idle') {
          runSequence()
        }
      },
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isSent = phase === 'sent'

  return (
    <div
      ref={sectionRef}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(245,240,234,0.12)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        /* Fixed height so layout never jumps */
        minHeight: '420px',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: isSent ? 'var(--color-terra)' : 'rgba(245,240,234,0.45)',
          marginBottom: '1.5rem',
          transition: 'color 0.4s ease',
        }}
      >
        {isSent ? 'Estimate request sent' : 'Get a free estimate'}
      </p>

      {/* Form fields — auto-typed, not real inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Project type */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.5)',
              marginBottom: '0.4rem',
            }}
          >
            Project type
          </label>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(245,240,234,0.05)',
              border: `1px solid ${cursorField === 'type' ? 'var(--color-terra)' : 'rgba(245,240,234,0.15)'}`,
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--color-chalk)',
              minHeight: '46px',
              transition: 'border-color 0.2s ease',
              position: 'relative',
            }}
          >
            {typeValue}
            {cursorField === 'type' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: 'var(--color-terra)',
                  marginLeft: '1px',
                  verticalAlign: 'middle',
                  animation: 'blink-cursor 0.8s step-end infinite',
                }}
              />
            )}
            {!typeValue && phase === 'idle' && (
              <span style={{ color: 'rgba(245,240,234,0.3)' }}>Interior, exterior, commercial…</span>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.5)',
              marginBottom: '0.4rem',
            }}
          >
            Property address
          </label>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(245,240,234,0.05)',
              border: `1px solid ${cursorField === 'address' ? 'var(--color-terra)' : 'rgba(245,240,234,0.15)'}`,
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--color-chalk)',
              minHeight: '46px',
              transition: 'border-color 0.2s ease',
            }}
          >
            {addressValue}
            {cursorField === 'address' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: 'var(--color-terra)',
                  marginLeft: '1px',
                  verticalAlign: 'middle',
                  animation: 'blink-cursor 0.8s step-end infinite',
                }}
              />
            )}
            {!addressValue && phase === 'idle' && (
              <span style={{ color: 'rgba(245,240,234,0.3)' }}>Street address…</span>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.5)',
              marginBottom: '0.4rem',
            }}
          >
            Project details
          </label>
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(245,240,234,0.05)',
              border: `1px solid ${cursorField === 'message' ? 'var(--color-terra)' : 'rgba(245,240,234,0.15)'}`,
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              color: 'var(--color-chalk)',
              minHeight: '80px',
              lineHeight: 1.6,
              transition: 'border-color 0.2s ease',
            }}
          >
            {messageValue}
            {cursorField === 'message' && (
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: 'var(--color-terra)',
                  marginLeft: '1px',
                  verticalAlign: 'middle',
                  animation: 'blink-cursor 0.8s step-end infinite',
                }}
              />
            )}
            {!messageValue && phase === 'idle' && (
              <span style={{ color: 'rgba(245,240,234,0.3)' }}>Tell us about your project…</span>
            )}
          </div>
        </div>

        {/* Send button / Sent state */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            marginTop: '0.25rem',
            transition: 'opacity 0.4s ease',
          }}
        >
          {isSent ? (
            /* Sent state — terracotta checkmark */
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
            /* Inactive submit button */
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                background: phase === 'idle' ? 'transparent' : 'rgba(194,96,58,0.35)',
                border: '1px solid rgba(194,96,58,0.4)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(245,240,234,0.6)',
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
  )
}
