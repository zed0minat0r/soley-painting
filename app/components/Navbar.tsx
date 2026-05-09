'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Navbar — Spark cycle 5 Frame B ──────────────────────────────────────
   Paint-stroke underline accent: a narrow terracotta line grows from 0→100%
   width under each link on hover, anchored at the bottom of the link.
   Uses CSS custom properties + inline scaleX so it stays server-safe.
   Replaces: bare color-change only hover with no brand character.
   Ref: Scout Site B (Edina) whitespace/typography rhythm.               */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 48)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 0.35s ease, backdrop-filter 0.35s ease',
        background: scrolled ? 'rgba(44, 31, 22, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(194, 96, 58, 0.18)' : 'none',
      }}
    >
      {/* Logo — BUG-004: min-height 44px via nav-logo class */}
      <a
        href="#top"
        className="nav-logo"
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.375rem',
          color: 'var(--color-chalk)',
          textDecoration: 'none',
          letterSpacing: '0.01em',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Soley<span style={{ color: 'var(--color-terra)' }}> Painting</span>
      </a>

      {/* Links — hidden on mobile, visible on desktop */}
      <div className="nav-links" style={{ display: 'flex', gap: '2.25rem', alignItems: 'center' }}>
        {[
          { label: 'Services', href: '#services' },
          { label: 'Process',  href: '#process' },
          { label: 'Contact',  href: '#contact' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="nav-link-stroke"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.875rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(245, 240, 234, 0.78)',
              textDecoration: 'none',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              position: 'relative',
              paddingBottom: '2px',
            }}
          >
            {label}
            {/* Paint-stroke underline — grows left→right on hover, held by CSS */}
            <span
              className="nav-stroke-line"
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '1.5px',
                background: 'var(--color-terra)',
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
                transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'none',
              }}
            />
          </a>
        ))}
        <a
          href="#contact"
          className="btn-primary"
          style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', minHeight: '44px' }}
        >
          Get a Quote
        </a>
      </div>

      {/* Mobile CTA — only shown when nav-links are hidden */}
      <a
        href="#contact"
        className="btn-primary nav-mobile-cta"
        style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', minHeight: '44px', alignItems: 'center' }}
      >
        Get a Quote
      </a>
    </nav>
  )
}
