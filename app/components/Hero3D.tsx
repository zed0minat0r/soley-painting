'use client'

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ── Stroke-the-Wall Hero (Option B: CanvasTexture)
   Layout:
   - Wall plane (background) with live CanvasTexture receives paint blobs
   - Horizontal paintbrush in foreground (handle right, bristles left)
   - Brush sweeps a lemniscate (figure-8) path, rotating to follow tangent
   - Each frame: paint blob drawn at bristle tip's projected XY position on wall
   - After ~6s: stroke fades, next brand color begins
   Brand colors: terracotta → deep teal → clay gold (cycling)
   No postprocessing, no bloom.                                               */

const BRAND_COLORS = [
  { r: 194, g: 96,  b: 58  }, // #C2603A terracotta
  { r: 45,  g: 122, b: 112 }, // #2D7A70 deep teal
  { r: 184, g: 147, b: 90  }, // #B8935A clay gold
]

// Lemniscate of Gerono: x = a·cos(t), y = b·sin(2t)/2
// Range: x ∈ [-a, a], y ∈ [-b/2, b/2]
function lemniscate(t: number): [number, number] {
  const a = 1.3
  const b = 0.7
  return [a * Math.cos(t), b * Math.sin(2 * t) * 0.5]
}

const TEX_W = 1024
const TEX_H = 768

// Wall spans ±WALL_HW in X, ±WALL_HH in Y (world units)
const WALL_HW = 2.2
const WALL_HH = 1.65

function PaintScene() {
  // HTML Canvas for paint texture
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
  // Invisible helper object — child of brushGroup at bristle tip local position
  const tipHelperRef = useRef<THREE.Object3D>(null!)
  const wallRef = useRef<THREE.Mesh>(null!)

  // Animation state in refs (no React re-renders)
  const tParam = useRef(0)
  const colorIdx = useRef(0)
  const cycleClock = useRef(0)
  const fadeClock = useRef(0)
  const fading = useRef(false)
  const CYCLE_DURATION = 6.5
  const FADE_DURATION = 1.4

  // Reusable vectors to avoid per-frame allocation
  const tipWorldPos = useRef(new THREE.Vector3())

  useFrame((_state, delta) => {
    if (!brushGroupRef.current || !tipHelperRef.current) return

    cycleClock.current += delta

    // ── Color cycle + fade logic ─────────────────────────────────────────
    if (!fading.current && cycleClock.current >= CYCLE_DURATION) {
      fading.current = true
      fadeClock.current = 0
    }

    if (fading.current) {
      fadeClock.current += delta
      if (fadeClock.current >= FADE_DURATION) {
        // Hard reset to chalk, advance color
        paintCtx.fillStyle = '#F5F0EA'
        paintCtx.fillRect(0, 0, TEX_W, TEX_H)
        colorIdx.current = (colorIdx.current + 1) % BRAND_COLORS.length
        cycleClock.current = 0
        fadeClock.current = 0
        fading.current = false
      } else {
        // Soft fade: overlay a semi-transparent chalk layer each frame
        paintCtx.fillStyle = 'rgba(245,240,234,0.07)'
        paintCtx.fillRect(0, 0, TEX_W, TEX_H)
      }
      paintTexture.needsUpdate = true
    }

    // ── Advance brush along lemniscate ───────────────────────────────────
    tParam.current += 0.5 * delta // 0.5 rad/s — steady, perceptually constant

    const [bx, by] = lemniscate(tParam.current)
    brushGroupRef.current.position.set(bx, by, 0.25)

    // Tangent direction → brush rotation
    const dt = 0.012
    const [fx, fy] = lemniscate(tParam.current + dt)
    const tangAngle = Math.atan2(fy - by, fx - bx)
    brushGroupRef.current.rotation.z = tangAngle

    // ── Sample bristle tip world position ────────────────────────────────
    tipHelperRef.current.getWorldPosition(tipWorldPos.current)
    const wx = tipWorldPos.current.x
    const wy = tipWorldPos.current.y

    // ── Paint blob at tip onto the canvas texture ─────────────────────────
    if (!fading.current) {
      const u = (wx + WALL_HW) / (WALL_HW * 2)
      const v = 1 - (wy + WALL_HH) / (WALL_HH * 2)

      if (u >= 0.01 && u <= 0.99 && v >= 0.01 && v <= 0.99) {
        const px = u * TEX_W
        const py = v * TEX_H
        const col = BRAND_COLORS[colorIdx.current]

        // Pressure-varied blob radius (feels organic, not uniform)
        const blobR = 26 + Math.sin(tParam.current * 4.1) * 7

        // Radial gradient blob — thicker center, feathered edge
        const grad = paintCtx.createRadialGradient(px, py, 0, px, py, blobR)
        grad.addColorStop(0,   `rgba(${col.r},${col.g},${col.b},0.95)`)
        grad.addColorStop(0.55,`rgba(${col.r},${col.g},${col.b},0.65)`)
        grad.addColorStop(1,   `rgba(${col.r},${col.g},${col.b},0)`)
        paintCtx.beginPath()
        paintCtx.arc(px, py, blobR, 0, Math.PI * 2)
        paintCtx.fillStyle = grad
        paintCtx.fill()

        // 4 bristle streak lines behind the tip (in the direction opposite motion)
        const backAngle = tangAngle + Math.PI
        for (let i = 0; i < 4; i++) {
          const offset = (i - 1.5) * 5.5
          const ox = Math.cos(tangAngle + Math.PI / 2) * offset
          const oy = Math.sin(tangAngle + Math.PI / 2) * offset
          const streakLen = 14 + Math.random() * 10
          paintCtx.beginPath()
          paintCtx.moveTo(px + ox, py + oy)
          paintCtx.lineTo(
            px + ox + Math.cos(backAngle) * streakLen,
            py + oy + Math.sin(backAngle) * streakLen
          )
          paintCtx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${0.38 - i * 0.05})`
          paintCtx.lineWidth = 1.8
          paintCtx.stroke()
        }

        paintTexture.needsUpdate = true
      }
    }
  })

  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: paintTexture,
    roughness: 0.92,
    metalness: 0,
  }), [paintTexture])

  // ── Brush geometry constants ────────────────────────────────────────────
  // Brush is horizontal: handle at +X right, bristles at -X left
  // Bristle tip is at local x ≈ -1.05
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

        {/* Bristle bundle: 14 tapered cylinders radiating from ferrule, pointing -X */}
        {Array.from({ length: 14 }).map((_, i) => {
          const t_i = i / 13
          // Spread in Y and Z to create a fan-like bundle
          const ySpread = (t_i - 0.5) * 0.16
          const zSpread = ((i % 3) - 1) * 0.035
          const bristleLen = 0.44 + (i % 5) * 0.022
          // Position: center of bristle cylinder (half length from ferrule attachment)
          const cx = -0.28 - bristleLen / 2
          return (
            <mesh key={i} position={[cx, ySpread, zSpread]} rotation={[0, 0, Math.PI / 2]}>
              {/* rotation z=π/2 → cylinder axis along X instead of Y */}
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

        {/* Ferrule — chrome band at x=-0.28 */}
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

        {/* Handle body — walnut, tapering toward the end cap */}
        <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.088, 1.8, 20]} />
          <meshStandardMaterial color="#3D2314" roughness={0.72} metalness={0} />
        </mesh>

        {/* End cap — rounded tip at far right */}
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

export default function Hero3D() {
  return (
    <section
      id="top"
      style={{
        minHeight: '100vh',
        background: 'var(--color-umber)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow behind canvas */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '6%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(194,96,58,0.14) 0%, rgba(45,122,112,0.07) 55%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container-width hero-grid"
        style={{ width: '100%', paddingTop: '96px', paddingBottom: '4rem' }}
      >
        {/* Left — text column */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.875rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-terra)',
              marginBottom: '1.25rem',
            }}
          >
            Expert Residential &amp; Commercial Painting
          </p>

          <h1
            className="glow-hero"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 'clamp(2.75rem, 6.5vw, 6.5rem)',
              lineHeight: 1.06,
              letterSpacing: '0.01em',
              color: 'var(--color-chalk)',
              marginBottom: '1.5rem',
            }}
          >
            Every wall<br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>done right.</em>
          </h1>

          <p
            className="glow-sub"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'rgba(245, 240, 234, 0.78)',
              maxWidth: '38ch',
              marginBottom: '2.5rem',
            }}
          >
            Meticulous surface prep. Durable finishes. One point of contact
            from estimate to final walkthrough — no call centers, no surprises.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
              gap: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Free in-home consultation', sub: 'Written quote, no ballpark ranges' },
              { label: 'Low-VOC options available', sub: 'On request, any project' },
              { label: 'Single point of contact', sub: 'Estimate through final walkthrough' },
            ].map(({ label, sub }) => (
              <div key={label}>
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
        </div>

        {/* Right — R3F canvas: stroke-the-wall animation */}
        <div className="hero-canvas-wrap" style={{ position: 'relative' }}>
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 42 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <PaintScene />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-label="Scroll down"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
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
            fontSize: '0.75rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(245, 240, 234, 0.4)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(194,96,58,0.7), transparent)',
          }}
          className="animate-bounce-x"
        />
      </div>
    </section>
  )
}
