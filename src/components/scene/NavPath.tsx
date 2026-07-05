import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Destination } from '../../types'

interface Props {
  destination: Destination | null
  visible: boolean
}

export const NavPath: React.FC<Props> = ({ destination, visible }) => {
  const markerRef = useRef<THREE.Mesh>(null)
  const points = useMemo(
    () => (destination ? destination.waypoints.map((p) => new THREE.Vector3(...p)) : []),
    [destination]
  )

  useFrame(() => {
    if (markerRef.current) {
      const t = performance.now() / 1000
      markerRef.current.position.y = 0.15 + Math.sin(t * 2.4) * 0.08
      markerRef.current.rotation.y += 0.02
    }
  })

  if (!visible || !destination || points.length < 2) return null

  return (
    <group>
      <Line points={points} color="#3fd0ff" lineWidth={3} transparent opacity={0.85} dashed={false} />
      <Line points={points} color="#8fe8ff" lineWidth={1} transparent opacity={0.4} />
      {/* destination marker */}
      <group position={destination.position}>
        <mesh ref={markerRef} position={[0, 0.15, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#3dffb0" emissive="#3dffb0" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.55, 40]} />
          <meshBasicMaterial color="#3dffb0" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
