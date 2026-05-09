'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ── Paintbrush Geometry ─────────────────────────────────────────────────
   Handle:  CylinderGeometry (tapered, walnut brown)
   Ferrule: CylinderGeometry (short, steel chrome)
   Bristle bundle: 12 InstancedMesh cylinders with terracotta emissive
   Rotation: constant Y-axis 0.004 rad/frame (catalog item #12)           */

function Paintbrush({ spinVelocity }: { spinVelocity: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!)

  // Fixed X tilt — set once, never animated
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = -0.28
    }
  }, [])

  useFrame((_state, delta) => {
    if (!groupRef.current) return
    // Constant rotation + velocity from scroll (inertia-decays)
    groupRef.current.rotation.y += 0.004 + spinVelocity.current
    spinVelocity.current *= Math.pow(0.92, delta * 60)
  })

  return (
    <group ref={groupRef}>
      {/* Handle — tapered cylinder, walnut brown */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.055, 0.075, 1.4, 20]} />
        <meshStandardMaterial
          color="#3D2314"
          roughness={0.72}
          metalness={0.0}
        />
      </mesh>

      {/* Ferrule — short cylinder, steel chrome */}
      <mesh position={[0, -0.23, 0]}>
        <cylinderGeometry args={[0.078, 0.078, 0.14, 20]} />
        <meshPhysicalMaterial
          color="#C0B49A"
          metalness={0.92}
          roughness={0.08}
          clearcoat={0.65}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Bristle bundle — 12 thin cylinders, terracotta emissive */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const r = 0.025 + (i % 3) * 0.012
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        const len = 0.28 + (i % 4) * 0.04
        return (
          <mesh key={i} position={[x, -0.38 - len / 2, z]}>
            <cylinderGeometry args={[0.006, 0.002, len, 6]} />
            <meshPhysicalMaterial
              color="#C2603A"
              emissive="#C2603A"
              emissiveIntensity={0.22}
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        )
      })}

      {/* Bristle tip highlight — wet paint glow */}
      <mesh position={[0, -0.72, 0]}>
        <sphereGeometry args={[0.048, 12, 8]} />
        <meshPhysicalMaterial
          color="#D4775A"
          emissive="#C2603A"
          emissiveIntensity={0.45}
          roughness={0.95}
          metalness={0.0}
          transparent
          opacity={0.82}
        />
      </mesh>
    </group>
  )
}

function Scene({ spinVelocity }: { spinVelocity: React.MutableRefObject<number> }) {
  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.4} />
      <Paintbrush spinVelocity={spinVelocity} />
    </>
  )
}

export default function Hero3D() {
  const spinVelocity = useRef(0)

  // Accumulate scroll velocity into the rotation
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      spinVelocity.current += e.deltaY * 0.00018
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

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
      {/* Subtle radial glow behind the canvas */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(194,96,58,0.18) 0%, rgba(45,122,112,0.09) 55%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container-width hero-grid"
        style={{
          width: '100%',
          paddingTop: '96px',
          paddingBottom: '4rem',
        }}
      >
        {/* Left — Text column */}
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
            <a href="#contact" className="btn-primary">
              Request a Free Estimate
            </a>
            <a href="#services" className="btn-secondary">
              Our Services
            </a>
          </div>

          {/* Honest pre-launch trust signals */}
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

        {/* Right — R3F Canvas */}
        <div
          className="hero-canvas-wrap"
          style={{
            position: 'relative',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 3.2], fov: 38 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <Scene spinVelocity={spinVelocity} />
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
