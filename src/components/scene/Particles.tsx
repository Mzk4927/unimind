import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const Particles: React.FC<{ count?: number }> = ({ count = 260 }) => {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = Math.random() * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40 - 8
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * 0.01
    const arr = points.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.08
      if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = 0
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8fe8ff" size={0.035} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}
