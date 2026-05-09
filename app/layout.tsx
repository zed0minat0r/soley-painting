import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond, Sacramento } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
  preload: true,
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-heading',
  preload: true,
})

const sacramento = Sacramento({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-script',
  preload: true,
})

/* ── Expanded metadata (replaces thin export) ──────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL('https://soley-painting.vercel.app'),
  title: 'Soley Painting | Expert Residential & Commercial Painting',
  description:
    'Meticulous surface prep, durable finishes, and one point of contact from estimate to final walkthrough. Residential and commercial painting — done right the first time.',
  keywords: [
    'painting contractor',
    'interior painting',
    'exterior painting',
    'cabinet painting',
    'commercial painting',
    'specialty coatings',
    'residential painter',
    'low-VOC paint',
    'professional painter',
  ],
  authors: [{ name: 'Soley Painting' }],
  creator: 'Soley Painting',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Soley Painting | Expert Residential & Commercial Painting',
    description:
      'Meticulous surface prep, durable finishes, and one point of contact from estimate to final walkthrough. Residential and commercial painting — done right the first time.',
    type: 'website',
    locale: 'en_US',
    url: 'https://soley-painting.vercel.app',
    siteName: 'Soley Painting',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soley Painting | Expert Residential & Commercial Painting',
    description:
      'Meticulous surface prep, durable finishes, and one point of contact from estimate to final walkthrough. Residential and commercial painting — done right the first time.',
  },
}

/* ── JSON-LD structured data ───────────────────────────────────────────── */

/* LocalBusiness — honest pre-launch: no address, no phone, no hours, no ratings */
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Soley Painting',
  url: 'https://soley-painting.vercel.app',
  description:
    'Meticulous surface prep, durable finishes, and one point of contact from estimate to final walkthrough. Residential and commercial painting — done right the first time.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
}

/* Service — 5 panels verbatim from ServicesScrollLock PANELS data */
const serviceSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Interior Painting',
    description:
      'Walls, ceilings, trim, and crown molding. We protect every surface with drop-cloth floor-to-ceiling coverage before the first brush touches a wall.',
    provider: { '@type': 'LocalBusiness', name: 'Soley Painting' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Exterior Painting',
    description:
      'Siding, fascia, soffits, doors, and shutters. Every trim gap caulked before primer — skip prep and the best paint fails in two seasons.',
    provider: { '@type': 'LocalBusiness', name: 'Soley Painting' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Commercial Painting',
    description:
      'Office buildings, retail, multi-unit residential, and HOA common areas. We schedule around your operation — nights, weekends, phased rollouts.',
    provider: { '@type': 'LocalBusiness', name: 'Soley Painting' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Cabinet & Trim Painting',
    description:
      'Kitchen, bathroom, and built-in cabinets refinished with factory-grade finish quality. Spray-applied for a glass-smooth surface that holds color longer than brush-applied coatings.',
    provider: { '@type': 'LocalBusiness', name: 'Soley Painting' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Specialty Coatings',
    description:
      'Epoxy floors, deck staining, fence staining, concrete sealer, and venetian plaster. Services that set Soley apart from volume-play competitors.',
    provider: { '@type': 'LocalBusiness', name: 'Soley Painting' },
  },
]

/* FAQPage — 9 items verbatim from FAQ.tsx ITEMS array */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does prep work factor into the timeline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prep is typically the longest part of any paint job. Patching holes, sanding surfaces, caulking trim gaps, and applying primer — these steps take as long as (or longer than) the actual painting. We build realistic timelines based on your wall conditions after the walkthrough, not a flat rate per room.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will you protect my floors and furniture?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. We lay drop cloths on every floor in the work area and cover furniture that cannot be moved. We use low-tack painter's tape on trim, hardware, and outlets before any coating goes on. Our daily routine ends with covering every surface so we pick up clean the next morning.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do you handle pets and kids during the job?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use low-VOC or zero-VOC paint on every interior job by default — not as an add-on. We do ask that pets stay out of the active work area while coatings are wet, which is typically a few hours per coat. We can schedule early morning starts so rooms are dry and ventilated before your household routine kicks in.',
      },
    },
    {
      '@type': 'Question',
      name: 'What guarantee do you offer on the work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We are finalizing our written workmanship terms before our first jobs this season — you will have them in writing before any work starts. What will not change: if a finish lifts, peels, or shows a defect tied to our application within the warranty period, we come back and make it right at no charge. The paint manufacturer's own product warranty also applies to every job.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does the estimate process work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Fill out the contact form or send us a message with your room details and we'll schedule a walkthrough. We measure every surface, note the condition, and put together a line-by-line written quote — each surface, square footage, and product listed separately. You see exactly what you're paying for before we agree to anything.",
      },
    },
    {
      '@type': 'Question',
      name: 'What paint brands do you use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We work with professional-grade lines from Benjamin Moore and Sherwin-Williams — the same products sold to trade contractors, not the consumer-shelf versions. Within those lines, we match the product to the surface: high-traffic areas get a harder enamel finish, ceilings get a dedicated flat, and cabinets get an alkyd hybrid for durability. We'll walk you through the options at the estimate.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you handle drywall repairs, or just paint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We handle the kind of surface prep that comes up on every paint job — filling nail holes and small dings, skim-coating hairline cracks, sanding ridges smooth, and re-caulking where trim has pulled away from the wall. What falls outside our scope: cutting out and replacing sections of drywall, structural patching, or damage that needs a dedicated drywall contractor. If we spot something during the walkthrough that crosses that line, we'll flag it before quoting.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you remove existing wallpaper?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — wallpaper removal is in scope. How long it takes depends on how many layers are present, the age of the adhesive, and what surface is underneath. We assess that at the walkthrough and quote removal as a separate line item so you see the cost clearly. After removal, we skim-coat any surface damage before priming.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you match a color from an existing paint job?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Bring us a paint chip, a paint can label with the color code, or a physical sample and we'll have it matched at the store before the job starts. If you want to stay as close as possible to an existing wall without a chip, we can pull a sample and take it in for spectrophotometer matching — it's not a perfect science but it gets very close. We'll tell you what the match confidence is before any coating goes down.",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${sacramento.variable}`}>
      <body className={dmSans.className}>
        {/* LocalBusiness structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* Service structured data — 5 painting services */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemas) }}
        />
        {/* FAQPage structured data — 9 questions verbatim from FAQ component */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {children}
      </body>
    </html>
  )
}
