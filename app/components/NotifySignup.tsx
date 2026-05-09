'use client'

import { useState, useRef } from 'react'

// Pre-launch email capture — honest framing, no fabricated counts or URLs.
// Form posts to /api/notify (stub route, real backend wired later).

export default function NotifySignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      inputRef.current?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      setStatus(data.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      aria-labelledby="notify-heading"
      style={{
        background: 'var(--color-stone)',
        borderTop: '1px solid rgba(34,24,16,0.08)',
        borderBottom: '1px solid rgba(34,24,16,0.08)',
        padding: '5rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.8125rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-rust)',
            marginBottom: '1rem',
          }}
        >
          Coming soon
        </p>

        {/* Heading */}
        <h2
          id="notify-heading"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: 'var(--color-umber)',
            marginBottom: '1.25rem',
          }}
        >
          Be the first to book.
        </h2>

        {/* Body copy — honest pre-launch */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.72,
            color: 'var(--color-umber)',
            opacity: 0.78,
            marginBottom: '2.5rem',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          First projects starting this season. Drop your email and we&apos;ll reach out the moment the calendar opens — no spam, no sharing your address.
        </p>

        {/* Form or success state */}
        {status === 'done' ? (
          <div
            role="status"
            aria-live="polite"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: 'var(--color-umber)',
              borderRadius: '4px',
            }}
          >
            {/* Checkmark */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="9" fill="var(--color-rust)" />
              <path d="M5 9.5 L7.8 12 L13 6.5" stroke="#F4EDE3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '1rem',
                color: 'var(--color-linen)',
                letterSpacing: '0.02em',
              }}
            >
              Thanks — we&apos;ll be in touch.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Email notification signup"
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <label htmlFor="notify-email" style={{ display: 'none' }}>
              Email address
            </label>
            <input
              id="notify-email"
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'sending'}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                padding: '0.875rem 1.25rem',
                border: '1.5px solid rgba(34,24,16,0.2)',
                borderRadius: '4px',
                background: 'var(--color-linen)',
                color: 'var(--color-umber)',
                outline: 'none',
                flex: '1 1 240px',
                minWidth: '0',
                maxWidth: '320px',
                transition: 'border-color 0.18s',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-rust)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(34,24,16,0.2)')}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary"
              style={{
                flexShrink: 0,
                minHeight: '44px',
                cursor: status === 'sending' ? 'wait' : 'pointer',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Notify me'}
            </button>
          </form>
        )}

        {/* Error fallback */}
        {status === 'error' && (
          <p
            role="alert"
            style={{
              marginTop: '1rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-rust)',
            }}
          >
            Something went wrong — try again in a moment.
          </p>
        )}
      </div>
    </section>
  )
}
