import type { Config } from 'tailwindcss'

// Painter-friendly palette — warm earth tones (terracotta + clay) paired with
// fresh teal accents. Neutrals for the dark-mode base. Agents adapt as needed.
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5f0',
          100: '#fde7da',
          200: '#fbcab0',
          300: '#f8a581',
          400: '#f47e51',
          500: '#ea5d2b', // terracotta — anchor brand orange
          600: '#d04519',
          700: '#ad3416',
          800: '#8a2b18',
          900: '#702517',
        },
        accent: {
          400: '#5eead4', // teal — secondary accent
          500: '#14b8a6',
          600: '#0d9488',
        },
        dark: {
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#0a1120',
          925: '#070d1a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
