import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { samplePath } from '../../utils/path'
import { HOME_POSITION } from '../../data/destinations'
import { useRover } from '../../store/roverStore'

interface Props {
  navRef: React.MutableRefObject<{ position: [number, number, number]; heading: number }>
}

const TRAVERSE_SECONDS = 10
const RETURN_SECONDS = 7

export const Mover: React.FC<Props> = ({ navRef }) => {
  const { state, dispatch } = useRover()
  const progress = useRef(0)
  const returnedFired = useRef(false)

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    if (state.emergency) return

    const waypoints = state.destination ? state.destination.waypoints : [HOME_POSITION, HOME_POSITION]

    if (state.mode === 'navigating') {
      returnedFired.current = false
      if (progress.current < 1) {
        progress.current = Math.min(1, progress.current + delta / TRAVERSE_SECONDS)
      }
      const sample = samplePath(waypoints, progress.current)
      let [px, py, pz] = sample.position
      if (progress.current >= 1) {
        // gentle loiter once arrived, while still "processing" indefinitely
        const t = performance.now() / 1000
        px += Math.sin(t * 0.8) * 0.15
        pz += Math.cos(t * 0.6) * 0.15
      }
      navRef.current.position = [px, py, pz]
      navRef.current.heading = sample.heading
    } else if (state.mode === 'holding' || state.mode === 'reached') {
      const sample = samplePath(waypoints, 1)
      navRef.current.position = sample.position
      navRef.current.heading = sample.heading
    } else if (state.mode === 'returning') {
      progress.current = Math.max(0, progress.current - delta / RETURN_SECONDS)
      const sample = samplePath(waypoints, progress.current)
      navRef.current.position = sample.position
      navRef.current.heading = sample.heading + Math.PI
      if (progress.current <= 0 && !returnedFired.current) {
        returnedFired.current = true
        dispatch({ type: 'RESET_HOME' })
      }
    } else {
      // idle
      progress.current = 0
      navRef.current.position = HOME_POSITION
      navRef.current.heading = 0
    }
  })

  return null
}
