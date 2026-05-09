'use client'

import { useRef, Suspense, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ── "SOLEY" Brush Painting Hero
   Layout — single-column centerpiece (Penn Tech pattern):
   Canvas is the dominant focal element, centered, large.
   The paintbrush sweeps along the letterforms of "SOLEY"
   in a hand-painted script, cycling through brand colors.

   Path approach: hand-crafted cubic Béziers tracing each letter
   of "SOLEY" in a connected painter's script style.
   We use a hidden SVG path element + getPointAtLength to
   walk the brush at constant speed along the letterforms.

   After the word is fully painted: hold 2s, fade canvas,
   then repaint in the next brand color. Endless cycle.
   No bloom, no halo, no postprocessing.                          */

const BRAND_COLORS = [
  { r: 194, g: 96,  b: 58  }, // #C2603A terracotta
  { r: 45,  g: 122, b: 112 }, // #2D7A70 deep teal
  { r: 184, g: 147, b: 90  }, // #B8935A clay gold
]

/* ── SOLEY script path (hand-crafted Béziers)
   Coordinate space: 1024 × 768 canvas.
   Letters span roughly x: 80–944, y-baseline ~500, cap-height ~200.
   Connected script: each letter flows into the next.

   Letter design (painter's casual script):
   S  — two counter-curve loops (top curve right, bottom curve left)
   O  — oval clockwise
   L  — descend and wide flat base
   E  — three horizontal strokes with a spine
   Y  — two angled strokes meeting at a waist, descender below

   The path is ONE continuous M...C...C... string so the brush
   travels the entire word without lifting.
*/
const SOLEY_PATH =
  // ── S ──
  // Start at top-right of S, sweep top curve, cross, sweep bottom curve
  'M 192,228 ' +
  'C 192,208 168,192 140,196 ' +   // top arc left
  'C 112,200 100,220 108,244 ' +   // curve down to middle
  'C 116,264 148,272 160,284 ' +   // cross the S
  'C 176,300 180,320 168,340 ' +   // lower arc start
  'C 156,360 128,368 104,356 ' +   // bottom arc end
  'C 88,348 80,332 84,316 ' +      // tail end

  // connector from S bottom tail to O start
  'C 92,308 120,304 152,308 ' +

  // ── O ──
  // Oval clockwise: start at top, go right, down, left, back up
  'C 200,308 244,296 268,280 ' +   // lead-in to O top
  'C 292,264 304,240 304,216 ' +   // right side of O going up
  'C 304,188 284,168 256,168 ' +   // top arc
  'C 228,168 208,184 204,208 ' +   // left side up
  'C 200,228 208,256 224,272 ' +   // left side down
  'C 240,288 264,296 284,292 ' +   // bottom of O
  'C 304,288 316,276 316,264 ' +   // re-enter right side

  // connector from O to L
  'C 320,268 328,272 340,280 ' +

  // ── L ──
  // Down stroke then flat base
  'M 340,180 ' +
  'C 340,180 338,240 336,310 ' +   // descend
  'C 336,340 340,360 348,368 ' +   // approach base
  'C 360,376 380,376 420,368 ' +   // base stroke right
  'C 452,360 472,352 480,348 ' +   // base taper out

  // connector from L to E
  'C 488,344 500,340 516,340 ' +

  // ── E ──
  // Spine down, then three horizontal bars
  'M 516,196 ' +
  'C 560,196 600,196 616,196 ' +   // top bar →
  'C 616,196 612,200 608,208 ' +
  'M 560,196 ' +
  'C 560,220 558,260 556,300 ' +   // spine down
  'C 556,320 556,340 556,368 ' +
  'M 556,280 ' +
  'C 572,280 600,276 616,272 ' +   // mid bar →
  'M 556,368 ' +
  'C 572,368 604,368 632,364 ' +   // base bar →
  'C 648,360 656,352 652,344 ' +

  // connector from E to Y
  'C 660,340 672,336 692,336 ' +

  // ── Y ──
  // Left arm down-right to waist, then right arm down-left to waist, then descender
  'M 692,196 ' +
  'C 700,216 716,248 740,284 ' +   // left arm to waist
  'M 820,196 ' +
  'C 808,216 792,248 764,284 ' +   // right arm to waist (drawn separate then merged)
  'M 764,284 ' +
  'C 756,300 748,316 744,340 ' +   // descender
  'C 740,360 740,376 744,392 '     // tail of Y

const TEX_W = 1024
const TEX_H = 768
const WALL_HW = 2.2
const WALL_HH = 1.65

// Build the SVG path element once (outside React, browser-side)
let gSvgPath: SVGPathElement | null = null
let gPathLength = 0

function getSoleyPath(): { path: SVGPathElement; length: number } {
  if (!gSvgPath) {
    const ns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(ns, 'svg') as SVGSVGElement
    svg.setAttribute('width', `${TEX_W}`)
    svg.setAttribute('height', `${TEX_H}`)
    svg.style.position = 'absolute'
    svg.style.opacity = '0'
    svg.style.pointerEvents = 'none'
    document.body.appendChild(svg)
    const p = document.createElementNS(ns, 'path') as SVGPathElement
    p.setAttribute('d', SOLEY_PATH)
    svg.appendChild(p)
    gSvgPath = p
    gPathLength = p.getTotalLength()
  }
  return { path: gSvgPath, length: gPathLength }
}

function PaintScene() {
  const paintCanvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = TEX_W
    c.height = TEX_H
    return c
  }, [])

  const paintCtx = useMemo(() => {
    const ctx = paintCanvas.getContext('2d')!
    ctx.fillStyle = '#F5F0EA'
    ctx.fillRect(0, 0, TEX_W, TEX_H)
    return ctx
  }, [paintCanvas])

  const paintTexture = useMemo(() => {
    const t = new THREE.CanvasTexture(paintCanvas)
    t.needsUpdate = true
    return t
  }, [paintCanvas])

  const brushGroupRef = useRef<THREE.Group>(null!)
  const tipHelperRef = useRef<THREE.Object3D>(null!)
  const wallRef = useRef<THREE.Mesh>(null!)

  // Animation state
  const distanceTraveled = useRef(0)   // distance along path so far
  const colorIdx = useRef(0)
  const phase = useRef<'painting' | 'holding' | 'fading'>('painting')
  const phaseClock = useRef(0)

  const PAINT_SPEED = 140      // px/s along the path — constant perceived speed
  const HOLD_DURATION = 2.0    // seconds to hold the word visible
  const FADE_DURATION = 1.2    // seconds to fade canvas

  const tipWorldPos = useRef(new THREE.Vector3())
  const svgPathRef = useRef<{ path: SVGPathElement; length: number } | null>(null)

  useEffect(() => {
    svgPathRef.current = getSoleyPath()
    return () => {
      // cleanup svg on unmount
    }
  }, [])

  useFrame((_state, delta) => {
    if (!brushGroupRef.current || !tipHelperRef.current) return
    if (!svgPathRef.current) return

    const { path: svgPath, length: pathLength } = svgPathRef.current

    phaseClock.current += delta

    // ── Phase machine ────────────────────────────────────────────────────
    if (phase.current === 'painting') {
      // Advance distance at constant speed
      distanceTraveled.current = Math.min(
        distanceTraveled.current + PAINT_SPEED * delta,
        pathLength
      )

      // Sample current point + a tiny step ahead for tangent
      const pt = svgPath.getPointAtLength(distanceTraveled.current)
      const ptAhead = svgPath.getPointAtLength(
        Math.min(distanceTraveled.current + 2, pathLength)
      )

      // Map SVG coords (0–1024, 0–768) → world coords (±WALL_HW, ±WALL_HH)
      const wx = ((pt.x / TEX_W) * 2 - 1) * WALL_HW
      const wy = (1 - (pt.y / TEX_H) * 2) * WALL_HH   // flip Y

      brushGroupRef.current.position.set(wx, wy, 0.25)

      // Tangent angle (in world space — flip Y matches)
      const dx = ptAhead.x - pt.x
      const dy = -(ptAhead.y - pt.y)   // flip Y
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        brushGroupRef.current.rotation.z = Math.atan2(dy, dx)
      }

      // Paint blob at bristle tip
      tipHelperRef.current.getWorldPosition(tipWorldPos.current)
      const twx = tipWorldPos.current.x
      const twy = tipWorldPos.current.y

      const u = (twx + WALL_HW) / (WALL_HW * 2)
      const v = 1 - (twy + WALL_HH) / (WALL_HH * 2)

      if (u >= 0.01 && u <= 0.99 && v >= 0.01 && v <= 0.99) {
        const px = u * TEX_W
        const py = v * TEX_H
        const col = BRAND_COLORS[colorIdx.current]
        const tangAngle = brushGroupRef.current.rotation.z

        // Thick paint stroke — larger blob for legible letterforms
        const blobR = 22 + Math.sin(distanceTraveled.current * 0.08) * 4

        const grad = paintCtx.createRadialGradient(px, py, 0, px, py, blobR)
        grad.addColorStop(0,   `rgba(${col.r},${col.g},${col.b},0.98)`)
        grad.addColorStop(0.5, `rgba(${col.r},${col.g},${col.b},0.75)`)
        grad.addColorStop(1,   `rgba(${col.r},${col.g},${col.b},0)`)
        paintCtx.beginPath()
        paintCtx.arc(px, py, blobR, 0, Math.PI * 2)
        paintCtx.fillStyle = grad
        paintCtx.fill()

        // 3 bristle streaks behind tip
        const backAngle = tangAngle + Math.PI
        for (let i = 0; i < 3; i++) {
          const offset = (i - 1) * 6
          const ox = Math.cos(tangAngle + Math.PI / 2) * offset
          const oy = Math.sin(tangAngle + Math.PI / 2) * offset
          const streakLen = 10 + Math.random() * 8
          paintCtx.beginPath()
          paintCtx.moveTo(px + ox, py + oy)
          paintCtx.lineTo(
            px + ox + Math.cos(backAngle) * streakLen,
            py + oy + Math.sin(backAngle) * streakLen
          )
          paintCtx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${0.32 - i * 0.08})`
          paintCtx.lineWidth = 2
          paintCtx.stroke()
        }

        paintTexture.needsUpdate = true
      }

      // Switch to hold when word is fully painted
      if (distanceTraveled.current >= pathLength) {
        phase.current = 'holding'
        phaseClock.current = 0
      }

    } else if (phase.current === 'holding') {
      // Park the brush off-screen during hold
      brushGroupRef.current.position.set(0, -4, 0.25)

      if (phaseClock.current >= HOLD_DURATION) {
        phase.current = 'fading'
        phaseClock.current = 0
      }

    } else if (phase.current === 'fading') {
      // Overlay semi-transparent chalk to erase
      paintCtx.fillStyle = 'rgba(245,240,234,0.08)'
      paintCtx.fillRect(0, 0, TEX_W, TEX_H)
      paintTexture.needsUpdate = true

      if (phaseClock.current >= FADE_DURATION) {
        // Hard reset
        paintCtx.fillStyle = '#F5F0EA'
        paintCtx.fillRect(0, 0, TEX_W, TEX_H)
        colorIdx.current = (colorIdx.current + 1) % BRAND_COLORS.length
        distanceTraveled.current = 0
        phaseClock.current = 0
        phase.current = 'painting'
        paintTexture.needsUpdate = true
      }
    }
  })

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: paintTexture,
    roughness: 0.92,
    metalness: 0,
  }), [paintTexture])

  const BRISTLE_TIP_X = -1.05

  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 3, 5]} intensity={0.75} color="#F5E6D0" />
      <directionalLight position={[-3, 1, 2]} intensity={0.4} color="#A8D4CF" />

      {/* Wall frame border */}
      <mesh position={[0, 0, -0.35]}>
        <planeGeometry args={[4.65, 3.52]} />
        <meshStandardMaterial color="#2C1F16" roughness={1} metalness={0} />
      </mesh>

      {/* Wall surface — receives the paint strokes */}
      <mesh ref={wallRef} position={[0, 0, -0.32]}>
        <planeGeometry args={[4.4, 3.3]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* ── Horizontal Paintbrush ─────────────────────────────────────── */}
      <group ref={brushGroupRef}>
        {/* Invisible bristle tip marker — child of group at tip position */}
        <object3D ref={tipHelperRef} position={[BRISTLE_TIP_X, 0, 0]} />

        {/* Bristle bundle: 14 tapered cylinders */}
        {Array.from({ length: 14 }).map((_, i) => {
          const t_i = i / 13
          const ySpread = (t_i - 0.5) * 0.16
          const zSpread = ((i % 3) - 1) * 0.035
          const bristleLen = 0.44 + (i % 5) * 0.022
          const cx = -0.28 - bristleLen / 2
          return (
            <mesh key={i} position={[cx, ySpread, zSpread]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.002, bristleLen, 5]} />
              <meshPhysicalMaterial
                color="#C2603A"
                emissive="#C2603A"
                emissiveIntensity={0.22}
                roughness={0.88}
                metalness={0}
              />
            </mesh>
          )
        })}

        {/* Ferrule */}
        <mesh position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.096, 0.096, 0.18, 20]} />
          <meshPhysicalMaterial
            color="#C0B49A"
            metalness={0.92}
            roughness={0.08}
            clearcoat={0.65}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Handle body */}
        <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.088, 1.8, 20]} />
          <meshStandardMaterial color="#3D2314" roughness={0.72} metalness={0} />
        </mesh>

        {/* End cap */}
        <mesh position={[1.53, 0, 0]}>
          <sphereGeometry args={[0.068, 14, 10]} />
          <meshStandardMaterial color="#3D2314" roughness={0.72} metalness={0} />
        </mesh>

        {/* Wet paint glow at bristle tip */}
        <mesh position={[BRISTLE_TIP_X, 0, 0.015]}>
          <sphereGeometry args={[0.062, 12, 8]} />
          <meshPhysicalMaterial
            color="#D4775A"
            emissive="#C2603A"
            emissiveIntensity={0.6}
            roughness={0.92}
            metalness={0}
            transparent
            opacity={0.82}
          />
        </mesh>
      </group>
    </>
  )
}

/* ── Hero section — single-column centerpiece (Penn Tech pattern) ──────── */
export default function Hero3D() {
  return (
    <section
      id="top"
      style={{
        minHeight: '100vh',
        background: 'var(--color-umber)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '88px',
        paddingBottom: '4rem',
      }}
    >
      {/* Radial glow behind canvas */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(194,96,58,0.12) 0%, rgba(45,122,112,0.06) 55%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* 1. Eyebrow */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '0.8rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--color-terra)',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        Soley Painting
      </p>

      {/* 2. H1 headline */}
      <h1
        className="glow-hero"
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 'clamp(2.75rem, 7vw, 6.5rem)',
          lineHeight: 1.05,
          letterSpacing: '0.01em',
          color: 'var(--color-chalk)',
          marginBottom: '0.875rem',
          textAlign: 'center',
          maxWidth: '20ch',
        }}
      >
        Every wall{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>done right.</em>
      </h1>

      {/* 3. Tagline — primes the centerpiece */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'rgba(245, 240, 234, 0.6)',
          letterSpacing: '0.04em',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '36ch',
        }}
      >
        Watch the brush paint it out.
      </p>

      {/* 4. PAINTBRUSH + WALL CENTERPIECE — dominant, focal */}
      <div
        className="hero-canvas-wrap"
        style={{
          width: 'min(640px, 92vw)',
          aspectRatio: '4/3',
          position: 'relative',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 42 }}
          gl={{ alpha: false, antialias: true }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <Suspense fallback={null}>
            <PaintScene />
          </Suspense>
        </Canvas>
      </div>

      {/* 5. Body paragraph */}
      <p
        className="glow-sub"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(245, 240, 234, 0.72)',
          maxWidth: '46ch',
          marginTop: '2.5rem',
          textAlign: 'center',
        }}
      >
        Meticulous surface prep. Durable finishes. One point of contact
        from estimate to final walkthrough — no call centers, no surprises.
      </p>

      {/* 6. CTAs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '2rem',
        }}
      >
        <a href="#contact" className="btn-primary">Request a Free Estimate</a>
        <a href="#services" className="btn-secondary">Our Services</a>
      </div>

      {/* Honest trust signals */}
      <div
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(245, 240, 234, 0.12)',
          display: 'flex',
          gap: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '760px',
        }}
      >
        {[
          { label: 'Free in-home consultation', sub: 'Written quote, no ballpark ranges' },
          { label: 'Low-VOC options available', sub: 'On request, any project' },
          { label: 'Single point of contact', sub: 'Estimate through final walkthrough' },
        ].map(({ label, sub }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'var(--color-chalk)',
                marginBottom: '0.2rem',
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'rgba(245, 240, 234, 0.5)',
              }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        aria-label="Scroll down"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245, 240, 234, 0.35)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '36px',
            background: 'linear-gradient(to bottom, rgba(194,96,58,0.6), transparent)',
          }}
          className="animate-bounce-x"
        />
      </div>
    </section>
  )
}
