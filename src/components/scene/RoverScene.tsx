import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { ContactShadows } from '@react-three/drei'
import { RoverModel } from './RoverModel'
import { Environment } from './Environment'
import { Particles } from './Particles'
import { NavPath } from './NavPath'
import { CameraRig } from './CameraRig'
import { Mover } from './Mover'
import { HOME_POSITION } from '../../data/destinations'
import { useRover } from '../../store/roverStore'

export const RoverScene: React.FC = () => {
  const { state } = useRover()
  const navRef = useRef<{ position: [number, number, number]; heading: number }>({
    position: HOME_POSITION,
    heading: 0
  })

  const pathVisible = state.mode === 'navigating' || state.mode === 'holding' || state.mode === 'returning'

  return (
    <Canvas shadows camera={{ position: [0, 3.4, 9], fov: 45 }} dpr={[1, 1.8]}>
      <color attach="background" args={['#05070c']} />
      <fog attach="fog" args={['#05070c', 14, 42]} />

      <ambientLight intensity={0.25} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-6, 4, -4]} color="#3fd0ff" intensity={0.6} />
      <pointLight position={[6, 4, -8]} color="#3fd0ff" intensity={0.5} />

      <Environment />
      <Particles />
      <RoverModel navRef={navRef} />
      <NavPath destination={state.destination} visible={pathVisible} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={20} blur={2.4} far={4} />

      <Mover navRef={navRef} />
      <CameraRig navRef={navRef} mode={state.mode} booted={state.booted} />

      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  )
}
