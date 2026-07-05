import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRover } from '../../store/roverStore'

interface Props {
  navRef: React.MutableRefObject<{ position: [number, number, number]; heading: number }>
}

const NEON = '#3fd0ff'

export const RoverModel: React.FC<Props> = ({ navRef }) => {
  const group = useRef<THREE.Group>(null)
  const screen = useRef<THREE.MeshStandardMaterial>(null)
  const wheelFL = useRef<THREE.Mesh>(null)
  const wheelFR = useRef<THREE.Mesh>(null)
  const wheelBL = useRef<THREE.Mesh>(null)
  const wheelBR = useRef<THREE.Mesh>(null)
  const body = useRef<THREE.Group>(null)
  const { state } = useRover()

  useFrame((_, delta) => {
    if (!group.current) return
    const [x, y, z] = navRef.current.position
    group.current.position.set(x, y, z)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, navRef.current.heading, 0.08)

    const moving = state.mode === 'navigating' || state.mode === 'returning'
    const wheelSpeed = moving ? state.telemetry.speed * 6 : 0
    ;[wheelFL, wheelFR, wheelBL, wheelBR].forEach((w) => {
      if (w.current) w.current.rotation.x += wheelSpeed * delta
    })

    // breathing suspension
    if (body.current) {
      const t = performance.now() / 1000
      const breathe = Math.sin(t * (moving ? 3.2 : 1.2)) * (moving ? 0.02 : 0.045)
      body.current.position.y = 0.62 + breathe
    }

    if (screen.current) {
      const t = performance.now() / 1000
      let color = new THREE.Color(NEON)
      let intensity = 1.4 + Math.sin(t * 2) * 0.4
      if (state.mode === 'reached') {
        color = new THREE.Color('#3dffb0')
        intensity = 2.2
      }
      if (state.emergency) {
        color = new THREE.Color('#ff4d5e')
        intensity = 2.6 + Math.sin(t * 10) * 1
      }
      screen.current.emissive = color
      screen.current.emissiveIntensity = intensity
    }
  })

  return (
    <group ref={group}>
      {/* body */}
      <group ref={body}>
        {/* chassis base */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.62, 0.32, 24]} />
          <meshStandardMaterial color="#0d141c" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* chassis ring light */}
        <mesh position={[0, -0.02, 0]}>
          <torusGeometry args={[0.58, 0.015, 16, 48]} />
          <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
        {/* torso */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.36, 0.46, 0.7, 20]} />
          <meshStandardMaterial color="#111a24" metalness={0.75} roughness={0.3} />
        </mesh>
        {/* head / screen mount */}
        <mesh castShadow position={[0, 1.02, 0.02]}>
          <boxGeometry args={[0.5, 0.34, 0.28]} />
          <meshStandardMaterial color="#0b1119" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* screen face */}
        <mesh position={[0, 1.03, 0.17]}>
          <planeGeometry args={[0.4, 0.22]} />
          <meshStandardMaterial
            ref={screen}
            color="#000000"
            emissive={NEON}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
        {/* shoulder sensor pods */}
        {[-0.42, 0.42].map((sx) => (
          <mesh key={sx} position={[sx, 0.78, 0]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
        ))}
        {/* lidar puck */}
        <mesh position={[0, 1.28, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 24]} />
          <meshStandardMaterial color="#182634" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.33, 0]}>
          <torusGeometry args={[0.14, 0.008, 8, 32]} />
          <meshStandardMaterial color={NEON} emissive={NEON} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>

      {/* wheels */}
      {[
        { ref: wheelFL, pos: [-0.5, 0.16, 0.4] as const },
        { ref: wheelFR, pos: [0.5, 0.16, 0.4] as const },
        { ref: wheelBL, pos: [-0.5, 0.16, -0.4] as const },
        { ref: wheelBR, pos: [0.5, 0.16, -0.4] as const }
      ].map((w, i) => (
        <mesh key={i} ref={w.ref} position={w.pos} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 20]} />
          <meshStandardMaterial color="#05070c" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* ground contact glow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.4, 48]} />
        <meshBasicMaterial color={NEON} transparent opacity={0.12} />
      </mesh>

      <pointLight position={[0, 1.1, 0.3]} color={NEON} intensity={1.2} distance={3} />
    </group>
  )
}
