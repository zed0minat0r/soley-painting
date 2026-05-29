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

  // Bristle tuft profile — a trapezoid wider at the tip (top) than at the
  // ferrule (bottom), matching how flat painter brushes splay outward.
  // Coordinates: x = flat-face width, y = height along the brush.
  const bristleShape = useMemo(() => {
    const shape = new THREE.Shape()
    const baseHalf = 0.32   // half-width where bristles enter the ferrule
    const tipHalf  = 0.46   // half-width at the chisel tip (splayed)
    const height   = 0.95
    // Slightly rounded shoulders at the tip corners for a softer chisel edge
    shape.moveTo(-baseHalf, 0)
    shape.lineTo(baseHalf, 0)
    shape.lineTo(tipHalf, height - 0.08)
    shape.quadraticCurveTo(tipHalf, height, tipHalf - 0.05, height)
    shape.lineTo(-tipHalf + 0.05, height)
    shape.quadraticCurveTo(-tipHalf, height, -tipHalf, height - 0.08)
    shape.closePath()
    return shape
  }, [])

  // Paint strip along the chisel edge — slightly wider than the bristles
  // (paint creeps over the edges), short height.
  const paintEdgeShape = useMemo(() => {
    const shape = new THREE.Shape()
    const halfW = 0.50
    const height = 0.13
    shape.moveTo(-halfW + 0.04, 0)
    shape.quadraticCurveTo(-halfW, 0, -halfW, 0.04)
    shape.lineTo(-halfW, height - 0.04)
    shape.quadraticCurveTo(-halfW, height, -halfW + 0.04, height)
    shape.lineTo(halfW - 0.04, height)
    shape.quadraticCurveTo(halfW, height, halfW, height - 0.04)
    shape.lineTo(halfW, 0.04)
    shape.quadraticCurveTo(halfW, 0, halfW - 0.04, 0)
    shape.closePath()
    return shape
  }, [])

  // Visible bristle "lines" — vertical thin strips drawn on the broad face of
  // the tuft, just to communicate "this is made of bristles" when seen face-on.
  const bristleLines = useMemo(() => {
    const lines: { x: number; height: number }[] = []
    const N = 11
    for (let i = 0; i < N; i++) {
      const tx = i / (N - 1) - 0.5
      // Lines splay outward toward the tip — base width 0.55, tip width 0.85
      lines.push({ x: tx * 0.55, height: 0.90 })
    }
    return lines
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

  // Y coordinates (brush oriented bristles UP along Y axis):
  //  Butt cap:        y = -1.10
  //  Handle:          y = -1.05 .. 0.30
  //  Ferrule (oval):  y =  0.30 .. 0.62
  //  Bristle tuft:    y =  0.62 .. 1.57 (flat splayed wedge)
  //  Paint at base:   y =  0.62 .. 0.78 (paint that soaked into bristle base)
  //  Paint edge:      y =  1.52 .. 1.65 (fresh paint strip on chisel edge)
  return (
    <group ref={groupRef} position={[0, -0.18, 0]} scale={1.0}>
      {/* ── HANDLE — tapered dark-stained wood (stays round so it reads as a grip) ── */}
      <mesh position={[0, -0.375, 0]}>
        <cylinderGeometry args={[0.22, 0.17, 1.35, 36]} />
        <meshStandardMaterial color="#2A1810" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Ochre branded ring — Soley accent near the butt */}
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.185, 0.185, 0.06, 36]} />
        <meshStandardMaterial color="#B8884A" roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Butt cap — rounded end */}
      <mesh position={[0, -1.10, 0]}>
        <sphereGeometry args={[0.18, 24, 16]} />
        <meshStandardMaterial color="#1F120A" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* ── FERRULE — flattened oval (matches the flat-brush form factor) ── */}
      <mesh position={[0, 0.46, 0]} scale={[1.5, 1, 0.5]}>
        <cylinderGeometry args={[0.24, 0.22, 0.32, 36]} />
        <meshStandardMaterial color="#C8A368" roughness={0.18} metalness={0.95} />
      </mesh>
      {/* Ferrule crimp ridges */}
      <mesh position={[0, 0.34, 0]} scale={[1.5, 1, 0.5]}>
        <torusGeometry args={[0.235, 0.012, 12, 36]} />
        <meshStandardMaterial color="#876B40" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.58, 0]} scale={[1.5, 1, 0.5]}>
        <torusGeometry args={[0.235, 0.012, 12, 36]} />
        <meshStandardMaterial color="#876B40" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* ── BRISTLE TUFT — flat splayed trapezoid ── */}
      <mesh position={[0, 0.62, -0.075]}>
        <extrudeGeometry
          args={[
            bristleShape,
            {
              depth: 0.15,
              bevelEnabled: true,
              bevelThickness: 0.015,
              bevelSize: 0.018,
              bevelSegments: 3,
              curveSegments: 12,
            },
          ]}
        />
        <meshStandardMaterial color="#D4C29A" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* Vertical bristle striations — thin darker lines on the front broad face */}
      {bristleLines.map((line, i) => (
        <mesh key={`b-front-${i}`} position={[line.x, 1.09, 0.08]}>
          <boxGeometry args={[0.012, line.height, 0.002]} />
          <meshStandardMaterial color="#A89070" roughness={0.95} metalness={0} />
        </mesh>
      ))}
      {/* Same striations on the back broad face */}
      {bristleLines.map((line, i) => (
        <mesh key={`b-back-${i}`} position={[line.x, 1.09, -0.08]}>
          <boxGeometry args={[0.012, line.height, 0.002]} />
          <meshStandardMaterial color="#A89070" roughness={0.95} metalness={0} />
        </mesh>
      ))}

      {/* ── PAINT-SOAKED BRISTLE BASE — color creeps up from where the bristles
          meet the ferrule (where paint first wicks in) ── */}
      <mesh position={[0, 0.62, -0.08]}>
        <extrudeGeometry
          args={[
            bristleShape,
            {
              depth: 0.16,
              bevelEnabled: false,
              curveSegments: 12,
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

      {/* ── PAINT EDGE — fresh thick strip of paint along the chisel tip ── */}
      <mesh position={[0, 1.55, -0.09]}>
        <extrudeGeometry
          args={[
            paintEdgeShape,
            {
              depth: 0.18,
              bevelEnabled: true,
              bevelThickness: 0.025,
              bevelSize: 0.025,
              bevelSegments: 4,
              curveSegments: 12,
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

      {/* Paint drip — small bead clinging to the front edge of the paint strip */}
      <mesh position={[0.36, 1.48, 0]}>
        <sphereGeometry args={[0.07, 18, 14]} />
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
        camera={{ position: [0, 0.1, 4.6], fov: 38 }}
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
