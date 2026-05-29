'use client'

export default function Footer() {
  const COLUMNS = [
    {
      heading: 'Services',
      links: [
        { label: 'Interior Painting', href: '#services' },
        { label: 'Exterior Painting', href: '#services' },
        { label: 'Commercial Painting', href: '#services' },
        { label: 'Cabinet & Trim', href: '#services' },
        { label: 'Specialty Coatings', href: '#services' },
      ],
    },
    {
      heading: 'Our Process',
      links: [
        { label: 'Free Walkthrough', href: '#process' },
        { label: 'Color Consultation', href: '#process' },
        { label: "Surface Prep", href: "#process" },
        { label: "Application", href: "#process" },
        { label: "Final Walkthrough", href: "#process" },
      ],
    },
    {
      heading: "Why Soley's",
      links: [
        { label: 'Written quotes — no ranges', href: '#contact' },
        { label: 'Low-VOC options', href: '#contact' },
        { label: 'Single point of contact', href: '#contact' },
        { label: 'Night-before arrival confirm', href: '#contact' },
      ],
    },
    {
      heading: 'Contact',
      links: [
        { label: 'Request a Free Estimate', href: '#contact' },
        { label: '(484) 948-5573', href: 'tel:+14849485573' },
        { label: 'South Eastern PA', href: '#contact' },
      ],
    },
  ]

  return (
    <footer
      style={{
        background: 'var(--color-umber)',
        color: 'var(--color-chalk)',
      }}
    >
      {/* Main footer body */}
      <div
        className="container-width"
        style={{
          paddingTop: '5rem',
          paddingBottom: '4rem',
        }}
      >
        {/* Brand block + columns — BUG-002: responsive via .footer-grid */}
        <div className="footer-grid">
          {/* Brand block */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: "1.625rem",
                color: "var(--color-chalk)",
                marginBottom: "1rem",
                lineHeight: 1.1,
              }}
            >
              Soley&rsquo;s<br />
              <span style={{ color: 'var(--color-ochre)' }}>Painting</span>
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                color: 'rgba(244,237,222,0.5)',
                maxWidth: '28ch',
                marginBottom: '1.75rem',
              }}
            >
              Soley&rsquo;s Painting &amp; Home Improvements. Locally owned,
              fully insured, 15+ years serving South Eastern PA. Owner Sean
              Soley on every job, start to finish.
            </p>
            <a
              href="#contact"
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem' }}
            >
              Get a Free Estimate
            </a>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.heading}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(244,237,222,0.35)',
                  marginBottom: '1.25rem',
                }}
              >
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map(link => (
                  <li key={link.label} style={{ marginBottom: '0.75rem' }}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        color: 'rgba(244,237,222,0.58)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        minHeight: '44px',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-terra)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(244,237,222,0.58)')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(244,237,222,0.1)',
        }}
      >
        <div
          className="container-width"
          style={{
            paddingTop: '1.25rem',
            paddingBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "rgba(244,237,222,0.3)",
            }}
          >
            &copy; {new Date().getFullYear()} Soley&rsquo;s Painting. All rights reserved.
          </p>

          {/* Catalog item #11 — social text link in bottom bar, no fake handle */}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem', /* Pixel cycle 8: bumped from 0.7rem (11.2px) → 13px floor */
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(244,237,222,0.28)',
            }}
          >
            Social channels coming soon
          </span>
        </div>
      </div>
    </footer>
  )
}
