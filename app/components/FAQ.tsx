'use client'

import { useState } from 'react'

/* ── FAQ — Common Painter Questions ─────────────────────────────────────
   Honest answers to what a homeowner actually asks before booking.
   Accordion pattern mirrors WhySoley mobile: aria-expanded + aria-controls
   + chevron rotation + max-height CSS transition.
   prefers-reduced-motion: snaps to open state, no transition.
   Section bg: umber — breaks visual rhythm from PortfolioGallery chalk.   */

const ITEMS = [
  {
    id: 'estimate',
    question: 'How does the estimate process work?',
    answer:
      "Call Sean at (484) 948-5573 or send the contact form — we'll schedule a walkthrough at your place. We measure every surface and follow up with a written quote, line by line. No ballpark ranges.",
    accent: 'var(--color-terra)',
  },
  {
    id: 'furniture-floors',
    question: 'Will you protect my floors and furniture?',
    answer:
      "Yes. Drop cloths on every floor in the work area, covers on furniture that can't be moved, low-tack painter's tape on trim and outlets. We cover everything at the end of each day so we pick up clean in the morning.",
    accent: 'var(--color-ochre)',
  },
  {
    id: 'guarantee',
    question: 'What guarantee do you offer on the work?',
    answer:
      "Fully insured on every job. If a finish lifts, peels, or shows a defect tied to our application, we come back and make it right at no charge. The paint manufacturer's own product warranty also applies.",
    accent: 'var(--color-gold)',
  },
  {
    id: 'paint-brands',
    question: 'What paint brands do you use?',
    answer:
      "Professional-grade Benjamin Moore and Sherwin-Williams — the trade lines, not consumer shelves. We match the product to the surface: harder enamels for high-traffic areas, dedicated ceiling flats, alkyd hybrids for cabinets.",
    accent: 'var(--color-rust)',
  },
  {
    id: 'drywall-repair',
    question: 'Do you handle drywall repairs?',
    answer:
      "Nail holes, dings, hairline cracks, and re-caulking trim — all in scope. Cutting out and replacing sections of drywall or structural patching needs a dedicated drywall contractor; we'll flag anything like that at the walkthrough before quoting.",
    accent: 'var(--color-terra)',
  },
]

function FAQItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof ITEMS)[0]
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const panelId = `faq-panel-${item.id}`
  const triggerId = `faq-trigger-${item.id}`

  return (
    <div
      className="scroll-reveal"
      style={{
        borderBottom: '1px solid rgba(244,237,222,0.12)',
        transitionDelay: `${index * 0.07}s`,
      }}
    >
      {/* Question row — accordion trigger */}
      <button
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.625rem 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          minHeight: '44px',
          color: 'var(--color-chalk)',
        }}
      >
        {/* Accent dot */}
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: item.accent,
            opacity: isOpen ? 1 : 0.4,
            transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Question text */}
        <span
          style={{
            flex: 1,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: isOpen ? 'var(--color-chalk)' : 'rgba(244,237,222,0.75)',
            transition: 'color 0.3s ease',
          }}
        >
          {item.question}
        </span>

        {/* Chevron */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          style={{
            flexShrink: 0,
            color: item.accent,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Answer panel — max-height collapse/expand */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        style={{
          maxHeight: isOpen ? '320px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            lineHeight: 1.72,
            color: 'rgba(244,237,222,0.65)',
            paddingBottom: '1.625rem',
            paddingLeft: '1.375rem',
            margin: 0,
          }}
        >
          {item.answer}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('prep-timeline')

  return (
    <section
      id="faq"
      style={{
        background: 'var(--color-umber)',
        padding: 'clamp(3.5rem, 7vw, 5rem) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Section-top accent bar removed — read as a hairline at the bottom
          of the SmoothEdge gradient above. */}

      <div className="container-width">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
            gap: '4rem 5rem',
            alignItems: 'start',
          }}
          className="faq-grid"
        >
          {/* Left column — section header */}
          <div className="scroll-reveal faq-header">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-ochre)',
                marginBottom: '0.875rem',
              }}
            >
              Common Questions
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'clamp(2.25rem, 3.5vw, 3.25rem)',
                color: 'var(--color-chalk)',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              What people ask
              <br />
              <em style={{ color: 'var(--color-ochre)' }}>before they book.</em>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.72,
                color: 'rgba(244,237,222,0.55)',
                maxWidth: '32ch',
              }}
            >
              Honest answers to the questions that actually matter before letting
              someone into your home.
            </p>
          </div>

          {/* Right column — accordion list */}
          <div>
            {ITEMS.map((item, i) => (
              <FAQItem
                key={item.id}
                item={item}
                index={i}
                isOpen={openId === item.id}
                onToggle={() =>
                  setOpenId(openId === item.id ? null : item.id)
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Section-bottom accent strip removed — read as a hairline at the
          top of the SmoothEdge bridge below this section. */}
    </section>
  )
}
