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
        { label: 'Surface Prep', href: '#process' },
        { label: 'Application', href: '#process' },
        { label: 'Final Walkthrough', href: '#process' },
      ],
    },
    {
      heading: 'Why Soley',
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
        { label: 'Service area coming soon', href: '#contact' },
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
        {/* Brand block + columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr',
            gap: '3rem',
          }}
        >
          {/* Brand block */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.625rem',
                color: 'var(--color-chalk)',
                marginBottom: '1rem',
                lineHeight: 1.1,
              }}
            >
              Soley<br />
              <span style={{ color: 'var(--color-terra)' }}>Painting</span>
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                color: 'rgba(245,240,234,0.5)',
                maxWidth: '28ch',
                marginBottom: '1.75rem',
              }}
            >
              Meticulous surface prep. Durable finishes. One point of contact
              from estimate to final walkthrough.
            </p>
            <a
              href="#contact"
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.8125rem' }}
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
                  fontSize: '0.6875rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,234,0.35)',
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
                        color: 'rgba(245,240,234,0.58)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--color-terra)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(245,240,234,0.58)')}
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
          borderTop: '1px solid rgba(245,240,234,0.1)',
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
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'rgba(245,240,234,0.3)',
            }}
          >
            &copy; {new Date().getFullYear()} Soley Painting. All rights reserved.
          </p>

          {/* Catalog item #11 — social text link in bottom bar, no fake handle */}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,234,0.28)',
            }}
          >
            Social channels coming soon
          </span>
        </div>
      </div>
    </footer>
  )
}
