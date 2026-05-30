/* ── SmoothEdge — a vertical gradient band that bridges two adjacent
   sections of different colors. No graphic, no decoration, no wordmark
   — just a linear-gradient that morphs one color into the next over a
   tall enough run to read as a smooth transition rather than a hard cut.
*/

type Variant = 'dark-to-light' | 'light-to-dark'

const DARK = '#14241D'  // var(--color-umber)
const BONE = '#F2EBD9'  // var(--color-linen)

export default function SmoothEdge({ variant }: { variant: Variant }) {
  const from = variant === 'dark-to-light' ? DARK : BONE
  const to = variant === 'dark-to-light' ? BONE : DARK

  return (
    <div
      aria-hidden
      style={{
        width: '100%',
        height: 'clamp(120px, 14vw, 200px)',
        background: `linear-gradient(to bottom, ${from} 0%, ${to} 100%)`,
      }}
    />
  )
}
