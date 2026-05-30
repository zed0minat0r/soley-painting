/* ── WordmarkSeam — oversized section name straddling the seam between
   two sections (Troa.fr-style transition, light-lift wordmark divider).

   The seam is positioned exactly at the band's vertical midpoint. The
   word sits centered on the seam, half on the dark color, half on the
   bone color. Each half renders the word in the OPPOSITE section's
   color so the text stays readable across the boundary:

     Top half (above seam): word in bone color against dark bg
     Bottom half (below seam): word in dark color against bone bg

   No mix-blend-mode hacks — two clipped copies of the word, each with
   the correct color for its half. Crisp at every scale, predictable
   on every browser.
*/

type Variant = 'dark-to-light' | 'light-to-dark'

const DARK = '#14241D'  // var(--color-umber) — deep forest
const BONE = '#F2EBD9'  // var(--color-linen)

export default function WordmarkSeam({
  word,
  variant,
}: {
  word: string
  variant: Variant
}) {
  const isD2L = variant === 'dark-to-light'
  const topBg = isD2L ? DARK : BONE
  const botBg = isD2L ? BONE : DARK
  // Text color in each half = OPPOSITE section's bg so the word is
  // readable on its half AND visually previews the next/prev section.
  const topTextColor = botBg
  const botTextColor = topBg

  const wordStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: 'clamp(3.5rem, 13vw, 10rem)',
    letterSpacing: '-0.025em',
    whiteSpace: 'nowrap',
    lineHeight: 1,
    textTransform: 'uppercase',
  }

  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(120px, 16vw, 200px)',
        overflow: 'hidden',
      }}
    >
      {/* Top half — solid bg of the section ABOVE */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: topBg,
          overflow: 'hidden',
        }}
      >
        {/* Word anchored to bottom of this half — its baseline sits ON the seam,
            so the top half of the glyphs is visible here. */}
        <span
          style={{
            ...wordStyle,
            top: '100%',
            transform: 'translate(-50%, -50%)',
            color: topTextColor,
          }}
        >
          {word}
        </span>
      </div>

      {/* Bottom half — solid bg of the section BELOW */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: botBg,
          overflow: 'hidden',
        }}
      >
        {/* Word anchored to top of this half — its baseline sits ON the seam,
            so the bottom half of the glyphs is visible here. */}
        <span
          style={{
            ...wordStyle,
            top: 0,
            transform: 'translate(-50%, -50%)',
            color: botTextColor,
          }}
        >
          {word}
        </span>
      </div>
    </div>
  )
}
