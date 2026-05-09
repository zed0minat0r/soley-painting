import type { Metadata } from 'next'
import { DM_Sans, Cormorant_Garamond } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Soley Painting | Expert Residential & Commercial Painting',
  description:
    'Meticulous surface prep, durable finishes, and one point of contact from estimate to final walkthrough. Residential and commercial painting — done right the first time.',
  openGraph: {
    title: 'Soley Painting',
    description: 'Expert residential and commercial painting.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className={dmSans.className}>
        {children}
      </body>
    </html>
  )
}
