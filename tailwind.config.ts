import type { Config } from 'tailwindcss'

// Soley Painting 5-token palette (Scout cycle 2 final recommendation)
// --color-terra  #C2603A  Terracotta — primary brand, CTAs, hero glow mid
// --color-teal   #2D7A70  Deep Teal   — secondary, rim fill, glow ambient
// --color-chalk  #F5F0EA  Chalk       — background primary
// --color-umber  #2C1F16  Warm Umber  — headings, body text, footer bg
// --color-gold   #B8935A  Clay Gold   — ferrule, hover states, cabinet accent
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terra: {
          DEFAULT: '#C2603A',
          light: '#D4775A',
          dark: '#A34E2D',
        },
        teal: {
          DEFAULT: '#2D7A70',
          light: '#3A9688',
          dark: '#1F5850',
        },
        chalk: {
          DEFAULT: '#F5F0EA',
          dark: '#EBE4DB',
        },
        umber: {
          DEFAULT: '#2C1F16',
          mid: '#4A3527',
          light: '#6B4E3B',
        },
        gold: {
          DEFAULT: '#B8935A',
          light: '#CDA96D',
          dark: '#9A7A45',
        },
        // keep legacy primaries for any existing refs
        primary: {
          50: '#fef5f0',
          100: '#fde7da',
          200: '#fbcab0',
          300: '#f8a581',
          400: '#f47e51',
          500: '#C2603A',
          600: '#A34E2D',
          700: '#8a3420',
          800: '#702517',
          900: '#5a1d12',
        },
        accent: {
          400: '#3A9688',
          500: '#2D7A70',
          600: '#1F5850',
        },
        dark: {
          100: '#F5F0EA',
          200: '#EBE4DB',
          300: '#6B4E3B',
          400: '#4A3527',
          500: '#3A2A1E',
          600: '#2C1F16',
          700: '#221710',
          800: '#180F0A',
          900: '#100A06',
          925: '#0A0603',
          950: '#060300',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
