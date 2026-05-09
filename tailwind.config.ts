import type { Config } from 'tailwindcss'

// Soley Painting — Drop Cloth & Rust palette (Scout Round 5, commit 40979ad)
// --color-rust   #BF5B38  Rust    — primary brand (was terracotta #C2603A)
// --color-linen  #F4EDE3  Linen   — main background (was chalk #F5F0EA)
// --color-stone  #EAE0D4  Stone   — alt warm background (new)
// --color-umber  #221810  Umber   — text/footer (was #2C1F16)
// --color-ochre  #B8884A  Ochre   — hover/accent (max 5% pixels; was gold #B8935A)
// Teal #2D7A70 DELETED from palette.
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary tokens — new names
        rust: {
          DEFAULT: '#BF5B38',
          light: '#D4775A',
          dark: '#A34E2D',
        },
        linen: {
          DEFAULT: '#F4EDE3',
          dark: '#EAE0D4',
        },
        stone: {
          DEFAULT: '#EAE0D4',
          dark: '#D8CCB8',
        },
        ochre: {
          DEFAULT: '#B8884A',
          light: '#CDA96D',
          dark: '#9A7A45',
        },
        umber: {
          DEFAULT: '#221810',
          mid: '#4A3527',
          light: '#6B4E3B',
        },
        // Backward-compat aliases (old names → new values)
        terra: {
          DEFAULT: '#BF5B38',
          light: '#D4775A',
          dark: '#A34E2D',
        },
        chalk: {
          DEFAULT: '#F4EDE3',
          dark: '#EAE0D4',
        },
        gold: {
          DEFAULT: '#B8884A',
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
          500: '#BF5B38',
          600: '#A34E2D',
          700: '#8a3420',
          800: '#702517',
          900: '#5a1d12',
        },
        // accent tokens — ochre replaces teal
        accent: {
          400: '#CDA96D',
          500: '#B8884A',
          600: '#9A7A45',
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
