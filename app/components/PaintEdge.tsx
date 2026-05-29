/* ── PaintEdge — graphical section transition that reads as a wet
   paintbrush stroke bleeding from one section's color into the next.

   Two variants:
   - "dark-to-light": the section ABOVE is dark forest, the section
     BELOW is bone. Dark forest drips down into bone.
   - "light-to-dark": the section ABOVE is bone, the section BELOW
     is dark forest. Bone bleeds down into forest.

   The component renders a 100px-tall band that the parent layout
   places between two sections. It does NOT add extra spacing — the
   adjacent sections' own padding handles vertical rhythm.
*/

type Variant = 'dark-to-light' | 'light-to-dark'

export default function PaintEdge({ variant }: { variant: Variant }) {
  const isD2L = variant === 'dark-to-light'

  // Dark forest → bone: top half is dark (continuing the section above),
  // bottom half is bone. The torn paint edge bleeds the dark INTO the bone.
  // Light → dark: inverted.
  const topFill = isD2L ? '#14241D' : '#F2EBD9'
  const bottomFill = isD2L ? '#F2EBD9' : '#14241D'
  const accentColor = '#C9A876'

  // A rough, hand-painted "torn edge" path that runs across the full width
  // at ~y=60 of the 100-tall band. Multiple wave + drip points so it doesn't
  // look uniform. ViewBox is 1200×100; we set preserveAspectRatio="none" so
  // it stretches to any width.
  // Path is built once, used for both variants (flipped via SVG transform).
  const torn = 'M 0 50 ' +
    'L 60 52 L 95 48 L 140 56 L 180 50 L 220 58 L 260 49 L 310 60 ' +
    'L 360 47 L 410 62 L 460 52 L 520 58 L 580 46 L 640 64 L 700 51 ' +
    'L 760 60 L 820 47 L 880 64 L 940 53 L 1000 60 L 1060 48 L 1120 61 L 1180 52 L 1200 56 ' +
    'L 1200 100 L 0 100 Z'

  // Paint drips that hang BELOW the torn edge — small elongated tear shapes
  const drips = [
    { x: 105, length: 22, w: 7 },
    { x: 245, length: 14, w: 5 },
    { x: 390, length: 28, w: 8 },
    { x: 555, length: 18, w: 6 },
    { x: 710, length: 32, w: 9 },
    { x: 870, length: 20, w: 6 },
    { x: 1020, length: 15, w: 5 },
    { x: 1150, length: 26, w: 7 },
  ]

  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: '100%',
        height: '100px',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        // The container's base color matches the BOTTOM section so the drips
        // visually land in the right context.
        background: bottomFill,
      }}
    >
      <svg
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        {/* Group can flip vertically for the light→dark variant so the same
            drip-shape works from the other side. */}
        <g transform={isD2L ? undefined : 'translate(0,100) scale(1,-1)'}>
          {/* The top half is the dark section continuing down + the torn
              edge drips below it. */}
          <path d={torn} fill={topFill} />

          {/* Drips hanging below the torn edge */}
          {drips.map((d, i) => (
            <g key={i}>
              <ellipse
                cx={d.x}
                cy={55 + d.length / 2}
                rx={d.w / 2}
                ry={d.length / 2}
                fill={topFill}
              />
              {/* Small bead at the tip — gives the drip a wet, rounded end */}
              <circle
                cx={d.x}
                cy={55 + d.length}
                r={d.w / 2 + 0.5}
                fill={topFill}
              />
            </g>
          ))}

          {/* A few isolated micro-splatters scattered in the bottom half,
              same color as the dark side — reads as paint that flicked
              off the brush */}
          {[
            { x: 65, y: 80, r: 1.6 },
            { x: 175, y: 85, r: 1.0 },
            { x: 340, y: 92, r: 1.8 },
            { x: 480, y: 86, r: 1.2 },
            { x: 615, y: 90, r: 1.4 },
            { x: 770, y: 94, r: 1.0 },
            { x: 920, y: 88, r: 1.6 },
            { x: 1090, y: 90, r: 1.2 },
          ].map((s, i) => (
            <circle
              key={`splat-${i}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={topFill}
              opacity="0.55"
            />
          ))}

          {/* Thin accent line at the torn edge — picks out the boundary
              with a champagne hairline, like a wet paint highlight */}
          <path
            d={torn}
            fill="none"
            stroke={accentColor}
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>
      </svg>
    </div>
  )
}
