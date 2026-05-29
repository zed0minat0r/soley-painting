'use client'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-umber)',
        color: 'var(--color-chalk)',
      }}
    >
      {/* Main footer body — condensed single-row layout */}
      <div
        className="container-width footer-condensed"
        style={{
          paddingTop: '3rem',
          paddingBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        {/* Brand + tagline */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.375rem',
              color: 'var(--color-chalk)',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            Soley&rsquo;s<span style={{ color: 'var(--color-ochre)' }}> Painting</span>
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'rgba(244,237,222,0.55)',
              maxWidth: '34ch',
            }}
          >
            15+ years · South Eastern PA · Fully insured · Owner Sean Soley
          </p>
        </div>

        {/* Contact CTAs */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.5rem',
          }}
        >
          <a
            href="tel:+14849485573"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-ochre)',
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            (484) 948-5573
          </a>
          <a
            href="#contact"
            className="btn-primary"
            style={{ padding: '0.625rem 1.25rem', fontSize: '0.8125rem' }}
          >
            Get a Free Estimate
          </a>
        </div>
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
