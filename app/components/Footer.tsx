'use client'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-umber)',
        color: 'var(--color-chalk)',
      }}
    >
      {/* Main footer body — fully centered stack */}
      <div
        className="container-width"
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'var(--color-chalk)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Soley&rsquo;s<span style={{ color: 'var(--color-ochre)' }}> Painting</span>
        </p>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'rgba(244,237,222,0.55)',
            margin: 0,
            maxWidth: '40ch',
          }}
        >
          15+ years · South Eastern PA · Fully insured · Owner Sean Soley
        </p>

        {/* Phone */}
        <a
          href="tel:+14849485573"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.625rem',
            fontWeight: 700,
            color: 'var(--color-ochre)',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            marginTop: '0.5rem',
          }}
        >
          (484) 948-5573
        </a>

        {/* Estimate CTA */}
        <a
          href="#contact"
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', marginTop: '0.5rem' }}
        >
          Get a Free Estimate
        </a>
      </div>

      {/* Bottom bar — minimal copyright */}
      <div
        style={{
          borderTop: '1px solid rgba(244,237,222,0.1)',
        }}
      >
        <div
          className="container-width"
          style={{
            paddingTop: '1rem',
            paddingBottom: '1rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'rgba(244,237,222,0.3)',
            }}
          >
            &copy; {new Date().getFullYear()} Soley&rsquo;s Painting &amp; Home Improvements. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
