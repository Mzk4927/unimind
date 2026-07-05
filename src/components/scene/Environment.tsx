import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const WallSegment: React.FC<{ position: [number, number, number]; size: [number, number, number] }> = ({
  position,
  size
}) => (
  <mesh position={position} receiveShadow castShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color="#0a121b" metalness={0.3} roughness={0.7} />
  </mesh>
)

const LightStrip: React.FC<{ position: [number, number, number]; length: number; rotationY?: number }> = ({
  position,
  length,
  rotationY = 0
}) => {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.1 + Math.sin(performance.now() / 500 + position[0]) * 0.4
    }
  })
  return (
    <mesh ref={ref} position={position} rotation={[0, rotationY, 0]}>
      <boxGeometry args={[length, 0.03, 0.03]} />
      <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={1.2} toneMapped={false} />
    </mesh>
  )
}

export const Environment: React.FC = () => {
  return (
    <group>
      {/* main reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0, -5]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#060a10" metalness={0.6} roughness={0.15} />
      </mesh>

      {/* floor grid overlay */}
      <gridHelper args={[60, 60, '#123145', '#0c1a26']} position={[-3, 0.01, -5]} />

      {/* hallway walls - CS wing */}
      <WallSegment position={[-3, 1.5, -1.2]} size={[20, 3, 0.2]} />
      <WallSegment position={[-3, 1.5, -4.8]} size={[20, 3, 0.2]} />
      {/* CEN wing */}
      <WallSegment position={[6.5, 1.5, -2]} size={[0.2, 3, 8]} />
      {/* NUTech Media hallway */}
      <WallSegment position={[-1.6, 1.5, -11]} size={[0.2, 3, 14]} />
      <WallSegment position={[1.6, 1.5, -11]} size={[0.2, 3, 14]} />

      {/* animated ceiling light strips */}
      <LightStrip position={[-3, 2.9, -3]} length={18} />
      <LightStrip position={[3, 2.9, -8]} length={12} rotationY={Math.PI / 2} />
      <LightStrip position={[0, 2.9, -11]} length={14} rotationY={Math.PI / 2} />

      {/* atrium accent ring at hub */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 1]}>
        <ringGeometry args={[2.4, 2.55, 64]} />
        <meshStandardMaterial color="#3fd0ff" emissive="#3fd0ff" emissiveIntensity={1} toneMapped={false} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}
