import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Soley Painting — Every wall done right.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Fetch a font from Google Fonts and return its ArrayBuffer
async function fetchFont(family: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`
  const css = await fetch(url, {
    headers: {
      // Request woff2 compatible subset
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  }).then((r) => r.text())

  const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)/)?.[1]
  if (!fontUrl) throw new Error(`Could not parse font URL from Google Fonts CSS for ${family}:${weight}`)

  return fetch(fontUrl).then((r) => r.arrayBuffer())
}

export default async function OgImage() {
  // Load fonts — Cormorant Garamond 700 for wordmark, DM Sans 600 for eyebrow
  const [cormorantData, dmSansData] = await Promise.all([
    fetchFont('Cormorant Garamond', 700),
    fetchFont('DM Sans', 600),
  ])

  // Brand tokens
  const UMBER = '#221810'
  const LINEN = '#F4EDE3'
  const RUST = '#BF5B38'
  const OCHRE = '#B8884A'
  const STONE = '#8C7B6B'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: UMBER,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: '"DM Sans"',
          overflow: 'hidden',
        }}
      >
        {/* Warm gradient wash — top-left origin, gives depth without photography */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '600px',
            height: '630px',
            background: `radial-gradient(ellipse at 0% 0%, rgba(191,91,56,0.18) 0%, transparent 65%)`,
            display: 'flex',
          }}
        />

        {/* Bottom-right warm glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '500px',
            height: '400px',
            background: `radial-gradient(ellipse at 100% 100%, rgba(184,136,74,0.12) 0%, transparent 65%)`,
            display: 'flex',
          }}
        />

        {/* Top-left corner rust accent block — drop-cloth corner echo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '180px',
            background: RUST,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '180px',
            height: '6px',
            background: RUST,
            display: 'flex',
          }}
        />

        {/* Bottom-right corner rust accent block */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '6px',
            height: '180px',
            background: RUST,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '180px',
            height: '6px',
            background: RUST,
            display: 'flex',
          }}
        />

        {/* Paintbrush SVG silhouette — bottom-right anchor, large, low opacity */}
        <svg
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            opacity: 0.22,
          }}
          width="120"
          height="260"
          viewBox="-20 -20 80 300"
          fill="none"
        >
          {/* Handle */}
          <rect x="22" y="0" width="16" height="160" rx="4" fill={RUST} />
          {/* Ferrule band */}
          <rect x="18" y="155" width="24" height="14" rx="2" fill={OCHRE} />
          {/* Bristle body */}
          <path
            d="M 14 169 Q 10 190 12 210 Q 20 240 30 245 Q 40 240 48 210 Q 50 190 46 169 Z"
            fill={RUST}
          />
          {/* Bristle tip point */}
          <path
            d="M 24 240 Q 30 258 30 265 Q 30 258 36 240 Z"
            fill={OCHRE}
          />
        </svg>

        {/* Main content column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: '"DM Sans"',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '0.22em',
              color: RUST,
              textTransform: 'uppercase',
              marginBottom: '36px',
            }}
          >
            RESIDENTIAL &amp; COMMERCIAL PAINTING
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontFamily: '"Cormorant Garamond"',
              fontWeight: 700,
              fontSize: '96px',
              color: LINEN,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              marginBottom: '28px',
            }}
          >
            Soley Painting
          </div>

          {/* Rust accent rule */}
          <div
            style={{
              width: '120px',
              height: '4px',
              background: RUST,
              marginBottom: '28px',
              borderRadius: '2px',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontFamily: '"DM Sans"',
              fontWeight: 600,
              fontSize: '36px',
              color: OCHRE,
              letterSpacing: '-0.01em',
              marginBottom: '20px',
            }}
          >
            Every wall done right.
          </div>

          {/* Sub-line */}
          <div
            style={{
              fontFamily: '"DM Sans"',
              fontWeight: 400,
              fontSize: '22px',
              color: STONE,
              letterSpacing: '0.02em',
            }}
          >
            Owner-operated · Written quote · Primer + two coats
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Cormorant Garamond',
          data: cormorantData,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'DM Sans',
          data: dmSansData,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
}
