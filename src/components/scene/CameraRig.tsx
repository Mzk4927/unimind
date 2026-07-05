import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoverMode } from '../../types'

interface Props {
  navRef: React.MutableRefObject<{ position: [number, number, number]; heading: number }>
  mode: RoverMode
  booted: boolean
}

export const CameraRig: React.FC<Props> = ({ navRef, mode, booted }) => {
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3(0, 0.7, 0))
  const desired = useRef(new THREE.Vector3(0, 3.4, 9))

  useFrame((_, delta) => {
    if (!booted) return
    const [rx, ry, rz] = navRef.current.position
    const heading = navRef.current.heading
    const t = performance.now() / 1000

    if (mode === 'idle') {
      const angle = t * 0.12
      desired.current.set(rx + Math.sin(angle) * 5.5, 2.6 + Math.sin(t * 0.3) * 0.3, rz + Math.cos(angle) * 5.5)
      lookAt.current.set(rx, ry + 0.8, rz)
    } else if (mode === 'reached') {
      desired.current.set(rx + Math.sin(t * 0.25) * 2.2, ry + 1.4, rz + 2.6)
      lookAt.current.set(rx, ry + 1.05, rz)
    } else {
      const behindX = rx - Math.sin(heading) * 4.2
      const behindZ = rz - Math.cos(heading) * 4.2
      desired.current.set(behindX, ry + 2.6, behindZ)
      lookAt.current.set(rx, ry + 0.6, rz)
    }

    camera.position.lerp(desired.current, 1 - Math.pow(0.001, delta))
    const curLook = (camera as any).__lookAt || new THREE.Vector3()
    curLook.lerp(lookAt.current, 1 - Math.pow(0.001, delta))
    ;(camera as any).__lookAt = curLook
    camera.lookAt(curLook)
  })

  return null
}
