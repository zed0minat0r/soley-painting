'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Soley Painting — Rotating 3D Paintbrush
   Ported technique from Penn Tech's Rubik's cube. The hero centerpiece is a
   real WebGL paintbrush: dark wood handle → polished brass ferrule → tan
   bristles → paint-loaded tip. The whole brush rotates continuously around
   its long axis so the viewer sees the full silhouette. The paint on the
   bristle tip cycles through the brand palette.
*/

const PAINT_COLORS = ['#BF5B38', '#B8884A', '#5C4838', '#3D2A1E']
const SECONDS_PER_COLOR = 3.5

// Cubic ease-in-out for smooth color transitions
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerpHex(a: string, b: string, t: number): THREE.Color {
  const ca = new THREE.Color(a)
  const cb = new THREE.Color(b)
  return ca.lerp(cb, t)
}

function Paintbrush() {
  const groupRef = useRef<THREE.Group>(null!)
  const paintEdgeRef = useRef<THREE.MeshStandardMaterial>(null!)
  const paintBaseRef = useRef<THREE.MeshStandardMaterial>(null!)
  const paintDripRef = useRef<THREE.MeshStandardMaterial>(null!)

  // Bristle tuft profile — big house-painter's brush. Wide at the base (matches
  // ferrule) and splays even wider at the tip. Coordinates: x = flat-face
  // width, y = height along the brush.
  const bristleShape = useMemo(() => {
    const shape = new THREE.Shape()
    const baseHalf = 0.72   // half-width where bristles enter the ferrule
    const tipHalf  = 0.85   // half-width at the chisel tip (splayed)
    const height   = 1.05
    // Slightly rounded shoulders at the tip corners
    shape.moveTo(-baseHalf, 0)
    shape.lineTo(baseHalf, 0)
    shape.lineTo(tipHalf, height - 0.10)
    shape.quadraticCurveTo(tipHalf, height, tipHalf - 0.07, height)
    shape.lineTo(-tipHalf + 0.07, height)
    shape.quadraticCurveTo(-tipHalf, height, -tipHalf, height - 0.10)
    shape.closePath()
    return shape
  }, [])

  // Paint strip along the chisel edge — slightly wider than the bristles
  // (paint creeps over the edges), thick wet bead.
  const paintEdgeShape = useMemo(() => {
    const shape = new THREE.Shape()
    const halfW = 0.92
    const height = 0.16
    shape.moveTo(-halfW + 0.05, 0)
    shape.quadraticCurveTo(-halfW, 0, -halfW, 0.05)
    shape.lineTo(-halfW, height - 0.05)
    shape.quadraticCurveTo(-halfW, height, -halfW + 0.05, height)
    shape.lineTo(halfW - 0.05, height)
    shape.quadraticCurveTo(halfW, height, halfW, height - 0.05)
    shape.lineTo(halfW, 0.05)
    shape.quadraticCurveTo(halfW, 0, halfW - 0.05, 0)
    shape.closePath()
    return shape
  }, [])


  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Slow rotation around the long axis (Y). The flat-face / edge-view
    // alternation IS the visual interest — like the cube's face turns.
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.45
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.05 - 0.45
      groupRef.current.rotation.x = -0.06
    }

    // Color cycling: hold for first 70%, then cross-fade
    const cycle = t / SECONDS_PER_COLOR
    const idx = Math.floor(cycle) % PAINT_COLORS.length
    const nextIdx = (idx + 1) % PAINT_COLORS.length
    const local = cycle - Math.floor(cycle)
    const fadeT = local < 0.7 ? 0 : easeInOutCubic((local - 0.7) / 0.3)
    const blended = lerpHex(PAINT_COLORS[idx], PAINT_COLORS[nextIdx], fadeT)
    for (const m of [paintEdgeRef.current, paintBaseRef.current, paintDripRef.current]) {
      if (m) {
        m.color.copy(blended)
        m.emissive.copy(blended)
      }
    }
  })

  // Y coordinates (wall brush, bristles UP, oversized for the wide-flat form):
  //  Butt knob:    y = -1.30
  //  Handle:       y = -1.25 .. 0.20  (chunky, slight beavertail taper)
  //  Ferrule:      y =  0.20 .. 0.65  (large oval clamp)
  //  Bristle tuft: y =  0.65 .. 1.70  (wide flat splayed wedge — the dominant element)
  //  Paint base:   y =  0.65 .. 0.85  (paint wicked into bristle base)
  //  Paint edge:   y =  1.65 .. 1.81  (fresh thick paint strip on chisel edge)
  return (
    <group ref={groupRef} position={[0, -0.32, 0]} scale={0.95}>
      {/* ── HANDLE — chunky beavertail / oval grip in dark stained wood ──
          A house-painter's handle is fat and shaped — slightly wider at the
          neck (toward the ferrule) and tapering through a wide grip area to
          a rounded knob at the butt. We scale the cylinder slightly oval. */}
      <mesh position={[0, -0.525, 0]} scale={[1, 1, 0.85]}>
        <cylinderGeometry args={[0.34, 0.28, 1.45, 40]} />
        <meshStandardMaterial color="#2A1810" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Neck flare — the handle widens slightly just before the ferrule */}
      <mesh position={[0, 0.12, 0]} scale={[1, 1, 0.85]}>
        <cylinderGeometry args={[0.38, 0.34, 0.18, 40]} />
        <meshStandardMaterial color="#241208" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Ochre branded ring — Soley accent near the butt */}
      <mesh position={[0, -1.12, 0]} scale={[1, 1, 0.85]}>
        <cylinderGeometry args={[0.29, 0.29, 0.08, 40]} />
        <meshStandardMaterial color="#B8884A" roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Butt knob — round bulb at the end (classic Purdy / Wooster shape) */}
      <mesh position={[0, -1.30, 0]} scale={[1, 0.85, 0.85]}>
        <sphereGeometry args={[0.30, 28, 20]} />
        <meshStandardMaterial color="#1F120A" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Hang hole — small dark notch in the butt knob (small ring) */}
      <mesh position={[0, -1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.014, 12, 24]} />
        <meshStandardMaterial color="#0F0700" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* ── FERRULE — wide oval polished stainless / brass band that clamps
          the bristle tuft. Significantly wider on X than the round handle to
          accommodate the flat bristle pack. ── */}
      <mesh position={[0, 0.42, 0]} scale={[2.7, 1, 0.55]}>
        <cylinderGeometry args={[0.30, 0.28, 0.46, 40]} />
        <meshStandardMaterial color="#C8A368" roughness={0.20} metalness={0.95} />
      </mesh>
      {/* Top crimp ridge */}
      <mesh position={[0, 0.62, 0]} scale={[2.7, 1, 0.55]}>
        <torusGeometry args={[0.295, 0.018, 14, 48]} />
        <meshStandardMaterial color="#876B40" roughness={0.28} metalness={0.9} />
      </mesh>
      {/* Bottom crimp ridge */}
      <mesh position={[0, 0.24, 0]} scale={[2.7, 1, 0.55]}>
        <torusGeometry args={[0.295, 0.018, 14, 48]} />
        <meshStandardMaterial color="#876B40" roughness={0.28} metalness={0.9} />
      </mesh>
      {/* Middle stamped band — a thin darker line across the middle of the
          ferrule, where a brand name would be embossed */}
      <mesh position={[0, 0.42, 0]} scale={[2.7, 1, 0.55]}>
        <torusGeometry args={[0.295, 0.005, 8, 48]} />
        <meshStandardMaterial color="#5C4838" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* ── BRISTLE TUFT — built from many individual vertical slats packed
          side-by-side. The tiny gaps between slats give the brush its
          line-by-line bristle look from every rotation angle (lines are
          intrinsic to the geometry, not overlays). ── */}
      {Array.from({ length: 42 }).map((_, i) => {
        const tx = i / 41 - 0.5   // -0.5 .. 0.5
        const xCenter = tx * 1.50  // total slat span at center: 1.50
        // Slight stagger of slat heights and starts so the chisel edge has
        // micro-variation rather than a perfect line, like real bristles
        const heightJitter = ((i * 7) % 5) * 0.012 - 0.024
        const baseY = 0.65
        const slatHeight = 1.06 + heightJitter
        const cy = baseY + slatHeight / 2
        // Width of each slat — pitch is 1.50/41 ≈ 0.0366, leave a small gap
        const slatWidth = 0.030
        const slatDepth = 0.26
        // Shade variation so the pack reads as individual bristles
        const shades = ['#D4C29A', '#C8B58B', '#BFAA7E', '#D8C7A2', '#CDBA8D', '#C4AE7A']
        const color = shades[(i * 3) % shades.length]
        // Slats near the edges (|tx| close to 0.5) splay outward slightly —
        // we tilt them around Z so the tip-end is further from center
        const splayDx = tx * 0.18  // additional offset at the tip
        const angle = Math.atan2(splayDx, slatHeight)
        return (
          <mesh key={`slat-${i}`} position={[xCenter, cy, 0]} rotation={[0, 0, -angle]}>
            <boxGeometry args={[slatWidth, slatHeight, slatDepth]} />
            <meshStandardMaterial color={color} roughness={0.92} metalness={0.0} />
          </mesh>
        )
      })}


      {/* ── PAINT-SOAKED BRISTLE BASE — translucent layer at the base where
          paint has wicked up from the load ── */}
      <mesh position={[0, 0.65, -0.13]}>
        <extrudeGeometry
          args={[
            bristleShape,
            {
              depth: 0.26,
              bevelEnabled: false,
              curveSegments: 14,
            },
          ]}
        />
        <meshStandardMaterial
          ref={paintBaseRef}
          color="#BF5B38"
          emissive="#BF5B38"
          emissiveIntensity={0.18}
          roughness={0.5}
          metalness={0.05}
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>

      {/* ── PAINT EDGE — fresh thick wet bead across the full chisel tip ── */}
      <mesh position={[0, 1.68, -0.14]}>
        <extrudeGeometry
          args={[
            paintEdgeShape,
            {
              depth: 0.28,
              bevelEnabled: true,
              bevelThickness: 0.03,
              bevelSize: 0.03,
              bevelSegments: 4,
              curveSegments: 14,
            },
          ]}
        />
        <meshStandardMaterial
          ref={paintEdgeRef}
          color="#BF5B38"
          emissive="#BF5B38"
          emissiveIntensity={0.35}
          roughness={0.28}
          metalness={0.15}
        />
      </mesh>

      {/* Paint drip — heavy bead off one corner of the loaded edge */}
      <mesh position={[0.66, 1.58, 0]}>
        <sphereGeometry args={[0.10, 20, 16]} />
        <meshStandardMaterial
          ref={paintDripRef}
          color="#BF5B38"
          emissive="#BF5B38"
          emissiveIntensity={0.35}
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>
    </group>
  )
}

function Scene() {
  // Warm-toned light rig to match Soley's earth-tone palette.
  return (
    <>
      <ambientLight intensity={0.55} />
      {/* Warm key light from upper right */}
      <directionalLight position={[5, 7, 5]} intensity={1.6} color="#FFE4C8" />
      {/* Cool fill from back-left so the brush isn't a flat silhouette */}
      <directionalLight position={[-4, 2, -3]} intensity={0.45} color="#A8C8E0" />
      {/* Rust rim from the right — brand accent picking out the silhouette */}
      <directionalLight position={[7, 0.5, 1]} intensity={1.1} color="#BF5B38" />
      {/* Ochre rim from the left */}
      <directionalLight position={[-7, 0.5, 2]} intensity={0.9} color="#B8884A" />
      {/* Soft underlight to lift the bristles */}
      <pointLight position={[0, -1, 3]} intensity={0.6} color="#F4EDE3" />
      <Paintbrush />
    </>
  )
}

export default function Hero3DCanvas() {
  // Two-RAF fade-in: lets the WebGL canvas mount and render a frame before the
  // opacity transition fires, so the brush appears already in motion.
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 12px, 0)',
        transition:
          'opacity 1100ms cubic-bezier(0.16, 1, 0.3, 1), transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 5.4], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
