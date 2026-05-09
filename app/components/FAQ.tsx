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
    id: 'prep-timeline',
    question: 'How does prep work factor into the timeline?',
    answer:
      'Prep is typically the longest part of any paint job. Patching holes, sanding surfaces, caulking trim gaps, and applying primer — these steps take as long as (or longer than) the actual painting. We build realistic timelines based on your wall conditions after the walkthrough, not a flat rate per room.',
    accent: 'var(--color-terra)',
  },
  {
    id: 'furniture-floors',
    question: 'Will you protect my floors and furniture?',
    answer:
      'Yes. We lay drop cloths on every floor in the work area and cover furniture that cannot be moved. We use low-tack painter\'s tape on trim, hardware, and outlets before any coating goes on. Our daily routine ends with covering every surface so we pick up clean the next morning.',
    accent: 'var(--color-teal)',
  },
  {
    id: 'pets-kids',
    question: 'How do you handle pets and kids during the job?',
    answer:
      'We use low-VOC or zero-VOC paint on every interior job by default — not as an add-on. We do ask that pets stay out of the active work area while coatings are wet, which is typically a few hours per coat. We can schedule early morning starts so rooms are dry and ventilated before your household routine kicks in.',
    accent: 'var(--color-gold)',
  },
  {
    id: 'guarantee',
    question: 'What guarantee do you offer on the work?',
    answer:
      'We are finalizing our written workmanship terms before our first jobs this season — you will have them in writing before any work starts. What will not change: if a finish lifts, peels, or shows a defect tied to our application within the warranty period, we come back and make it right at no charge. The paint manufacturer\'s own product warranty also applies to every job.',
    accent: 'var(--color-terra)',
  },
  {
    id: 'estimate',
    question: 'How does the estimate process work?',
    answer:
      'Fill out the contact form or send us a message with your room details and we\'ll schedule a walkthrough. We measure every surface, note the condition, and put together a line-by-line written quote — each surface, square footage, and product listed separately. You see exactly what you\'re paying for before we agree to anything.',
    accent: 'var(--color-teal)',
  },
  {
    id: 'paint-brands',
    question: 'What paint brands do you use?',
    answer:
      'We work with professional-grade lines from Benjamin Moore and Sherwin-Williams — the same products sold to trade contractors, not the consumer-shelf versions. Within those lines, we match the product to the surface: high-traffic areas get a harder enamel finish, ceilings get a dedicated flat, and cabinets get an alkyd hybrid for durability. We\'ll walk you through the options at the estimate.',
    accent: 'var(--color-gold)',
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
        borderBottom: '1px solid rgba(245,240,234,0.12)',
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
            transition: 'opacity 0.3s ease',
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
            color: isOpen ? 'var(--color-chalk)' : 'rgba(245,240,234,0.75)',
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
            color: 'rgba(245,240,234,0.65)',
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
        padding: '7rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle terracotta accent bar — top edge */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, var(--color-terra) 25%, var(--color-teal) 75%, transparent)',
        }}
      />

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
                fontSize: '0.75rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-terra)',
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
              <em style={{ color: 'var(--color-terra)' }}>before they book.</em>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.72,
                color: 'rgba(245,240,234,0.55)',
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

      {/* Bottom edge accent */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, var(--color-teal) 40%, var(--color-gold) 60%, transparent)',
        }}
      />
    </section>
  )
}
