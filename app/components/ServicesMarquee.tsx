'use client'

// Scroll-velocity marquee between Hero and ServicesScrollLock (catalog #6 analog)
// Skews on fast scroll using framer-motion useVelocity → useTransform → useSpring

import { useScroll, useVelocity, useTransform, useSpring, motion } from 'framer-motion'

const ITEMS = [
  { label: 'Interior Painting', color: '#F5F0EA' },
  { label: 'Exterior Painting', color: '#2D7A70' },
  { label: 'Commercial', color: '#C2603A' },
  { label: 'Cabinet & Trim', color: '#B8935A' },
  { label: 'Specialty Coatings', color: '#C2603A' },
  { label: 'Surface Prep', color: '#F5F0EA' },
  { label: 'Color Consultation', color: '#2D7A70' },
  { label: 'Free Estimate', color: '#B8935A' },
]

// Duplicate for seamless loop
const ALL = [...ITEMS, ...ITEMS]

export default function ServicesMarquee() {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const skewX = useTransform(scrollVelocity, [-1500, 1500], [-12, 12])
  const smoothSkewX = useSpring(skewX, { damping: 50, stiffness: 400 })

  return (
    <div
      style={{
        background: 'var(--color-umber)',
        padding: '1.5rem 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(245,240,234,0.08)',
        borderBottom: '1px solid rgba(245,240,234,0.08)',
      }}
    >
      <motion.div
        className="animate-marquee"
        style={{
          display: 'flex',
          gap: '2.5rem',
          width: 'max-content',
          skewX: smoothSkewX,
        }}
      >
        {ALL.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexShrink: 0,
            }}
          >
            {/* Paint-drop motif */}
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path
                d="M5 0 C5 0 10 5.5 10 9 A5 5 0 0 1 0 9 C0 5.5 5 0 5 0 Z"
                fill={item.color}
                fillOpacity={0.7}
              />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.875rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: item.color,
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
