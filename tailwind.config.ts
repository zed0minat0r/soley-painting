import type { Config } from 'tailwindcss'

// Soley Painting — Forest, Bone, Copper palette
// --color-rust   #244238  Forest  — primary brand (deep hunter green)
// --color-linen  #F2EBD9  Bone    — main background
// --color-stone  #EEE4D0  Warm Bone — alt background
// --color-umber  #14241D  Deep Forest — text/dark sections
// --color-ochre  #B87333  Copper  — accent
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary tokens — Forest / Bone / Copper
        rust: {
          DEFAULT: '#244238',  // forest primary
          light: '#3A5C50',
          dark: '#173028',
        },
        linen: {
          DEFAULT: '#F2EBD9',  // bone
          dark: '#EEE4D0',
        },
        stone: {
          DEFAULT: '#EEE4D0',
          dark: '#DCCFB2',
        },
        ochre: {
          DEFAULT: '#B87333',  // copper
          light: '#D08F4C',
          dark: '#8E5824',
        },
        umber: {
          DEFAULT: '#14241D',  // deep forest
          mid: '#2C443A',
          light: '#4A6256',
        },
        // Backward-compat aliases
        terra: {
          DEFAULT: '#244238',
          light: '#3A5C50',
          dark: '#173028',
        },
        chalk: {
          DEFAULT: '#F2EBD9',
          dark: '#EEE4D0',
        },
        gold: {
          DEFAULT: '#B87333',
          light: '#D08F4C',
          dark: '#8E5824',
        },
        // Legacy primary scale — recoloured to a green ramp
        primary: {
          50: '#F0F4F2',
          100: '#D7E1DB',
          200: '#B6CABE',
          300: '#8FAFA0',
          400: '#5F8C7A',
          500: '#244238',
          600: '#1C3329',
          700: '#142822',
          800: '#0E1F1B',
          900: '#091612',
        },
        // accent — copper scale
        accent: {
          400: '#D08F4C',
          500: '#B87333',
          600: '#8E5824',
        },
        dark: {
          100: '#F4EDDE',
          200: '#EAE0CB',
          300: '#5C7068',
          400: '#3F564B',
          500: '#2A3F35',
          600: '#1F3028',
          700: '#152420',
          800: '#0F1A17',
          900: '#0A1310',
          925: '#070D0B',
          950: '#040806',
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
