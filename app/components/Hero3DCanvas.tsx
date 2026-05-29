'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
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
  const paintTipRef = useRef<THREE.MeshStandardMaterial>(null!)
  const paintCollarRef = useRef<THREE.MeshStandardMaterial>(null!)
  const paintDripRef = useRef<THREE.MeshStandardMaterial>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Continuous rotation around the long axis (Y) so the whole brush is seen
    // from every angle, plus a strong diagonal tilt on Z so the silhouette
    // reads across the frame.
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.42
      groupRef.current.rotation.z = Math.sin(t * 0.45) * 0.06 - 0.55
      groupRef.current.rotation.x = -0.04
    }

    // Color cycling: hold for first 70% of slot, then cross-fade to next color
    const cycle = t / SECONDS_PER_COLOR
    const idx = Math.floor(cycle) % PAINT_COLORS.length
    const nextIdx = (idx + 1) % PAINT_COLORS.length
    const local = cycle - Math.floor(cycle)
    const fadeT = local < 0.7 ? 0 : easeInOutCubic((local - 0.7) / 0.3)
    const blended = lerpHex(PAINT_COLORS[idx], PAINT_COLORS[nextIdx], fadeT)
    if (paintTipRef.current) {
      paintTipRef.current.color.copy(blended)
      paintTipRef.current.emissive.copy(blended)
    }
    if (paintCollarRef.current) {
      paintCollarRef.current.color.copy(blended)
      paintCollarRef.current.emissive.copy(blended)
    }
    if (paintDripRef.current) {
      paintDripRef.current.color.copy(blended)
      paintDripRef.current.emissive.copy(blended)
    }
  })

  // Y coordinates (brush oriented along Y axis, bristles UP):
  //  Butt cap:        y = -1.10
  //  Handle:          y = -1.05 .. 0.30
  //  Ferrule:         y =  0.30 .. 0.62
  //  Bristle tuft:    y =  0.62 .. 1.55  (visible tan body)
  //  Paint collar:    y =  0.62 .. 0.80  (where paint soaks into bristles)
  //  Paint cap (tip): y =  1.45 .. 1.62
  return (
    <group ref={groupRef} position={[0, -0.1, 0]} scale={1.0}>
      {/* ── HANDLE — tapered dark-stained wood ── */}
      <mesh position={[0, -0.375, 0]}>
        <cylinderGeometry args={[0.26, 0.20, 1.35, 36]} />
        <meshStandardMaterial color="#2A1810" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Ochre branded ring — Soley accent near the butt */}
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.215, 0.215, 0.06, 36]} />
        <meshStandardMaterial color="#B8884A" roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Butt cap — rounded end */}
      <mesh position={[0, -1.10, 0]}>
        <sphereGeometry args={[0.20, 24, 16]} />
        <meshStandardMaterial color="#1F120A" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* ── FERRULE — polished brass band that clamps the bristles ── */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.32, 0.30, 0.32, 36]} />
        <meshStandardMaterial color="#C8A368" roughness={0.18} metalness={0.95} />
      </mesh>
      {/* Ferrule crimp ridges */}
      <mesh position={[0, 0.36, 0]}>
        <torusGeometry args={[0.315, 0.014, 12, 36]} />
        <meshStandardMaterial color="#876B40" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <torusGeometry args={[0.315, 0.014, 12, 36]} />
        <meshStandardMaterial color="#876B40" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* ── BRISTLE TUFT — a solid tapered cone that widens slightly toward the tip
          (matches how a flat brush splays). Simple, large, instantly readable.
          We then add subtle vertical "groove" rings to suggest bristle texture. */}
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.36, 0.30, 0.92, 40]} />
        <meshStandardMaterial color="#D4C29A" roughness={0.92} metalness={0.0} />
        <Edges color="#7A6A4A" threshold={20} />
      </mesh>
      {/* Bristle groove rings — three subtle dark bands so the tuft reads as bristly */}
      {[0.78, 1.05, 1.30].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.32 + i * 0.012, 0.008, 8, 40]} />
          <meshStandardMaterial color="#9F8A60" roughness={0.85} metalness={0.05} />
        </mesh>
      ))}

      {/* ── PAINT COLLAR — paint has soaked into the bottom of the bristles
          (where they meet the ferrule), so this ring of color sits at the base */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.305, 0.302, 0.18, 40]} />
        <meshStandardMaterial
          ref={paintCollarRef}
          color="#BF5B38"
          emissive="#BF5B38"
          emissiveIntensity={0.2}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      {/* ── PAINT CAP — fat blob of fresh paint loaded onto the tip ── */}
      {/* Big rounded cap covering the top end of the bristles */}
      <mesh position={[0, 1.52, 0]} scale={[1, 0.55, 1]}>
        <sphereGeometry args={[0.38, 36, 24]} />
        <meshStandardMaterial
          ref={paintTipRef}
          color="#BF5B38"
          emissive="#BF5B38"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.18}
        />
      </mesh>

      {/* Paint drip — a small bead off the front edge of the cap */}
      <mesh position={[0.32, 1.42, 0]}>
        <sphereGeometry args={[0.08, 18, 14]} />
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
