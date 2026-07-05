import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbCircleCheckFilled, TbLoader2 } from 'react-icons/tb'
import { useRover } from '../../store/roverStore'
import { GlassPanel } from './GlassPanel'

const BOOT_LINES = [
  'Initializing Robot...',
  'Loading University Map...',
  'Loading Indoor Map...',
  'SLAM Initializing...',
  'Building Occupancy Grid...',
  'Localizing Robot...',
  'LiDAR Activated...',
  'Depth Camera Activated...',
  'Sensor Fusion Running...',
  'Obstacle Detection Running...',
  'Calculating Global Path...',
  'Calculating Local Path...',
  'Generating Safe Route...',
  'ROS2 Navigation Active...',
  'Motor Controller Ready...',
  'Jetson Nano Ready...',
  'Navigation Started...'
]

const LOOP_LINES = [
  'Processing...',
  'Scanning Environment...',
  'Updating Localization...',
  'Avoiding Obstacles...',
  'Planning Route...',
  'Moving...',
  'Sensor Fusion...',
  'Navigation Active...',
  'Robot Moving...'
]

export const ProcessingLog: React.FC = () => {
  const { state, dispatch } = useRover()
  const timer = useRef<number | null>(null)
  const active = state.mode === 'navigating' || state.mode === 'holding'
  const destLine = state.destination ? `Moving Toward ${state.destination.label}...` : ''
  const fixedLines = [...BOOT_LINES, destLine]

  useEffect(() => {
    if (!active) {
      if (timer.current) window.clearTimeout(timer.current)
      return
    }
    const delay = state.logIndex < fixedLines.length ? 420 : 1500
    timer.current = window.setTimeout(() => dispatch({ type: 'ADVANCE_LOG' }), delay)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [active, state.logIndex, fixedLines.length, dispatch])

  if (!active) return null

  const inLoop = state.logIndex >= fixedLines.length
  const visibleFixed = fixedLines.slice(0, Math.min(state.logIndex + 1, fixedLines.length))
  const loopLine = LOOP_LINES[(state.logIndex - fixedLines.length) % LOOP_LINES.length]

  return (
    <GlassPanel className="w-[340px] max-h-[62vh] p-5 overflow-hidden flex flex-col">
      <p className="mono text-[10px] tracking-[0.25em] text-neon-soft/80 mb-3">SYSTEM STATUS</p>
      <div className="hairline mb-3" />
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        <AnimatePresence initial={false}>
          {visibleFixed.map((line, i) => {
            const isDone = i < state.logIndex || inLoop
            return (
              <motion.div
                key={line + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {isDone ? (
                  <TbCircleCheckFilled className="text-neon-green shrink-0" size={15} />
                ) : (
                  <TbLoader2 className="text-neon-soft animate-spin shrink-0" size={15} />
                )}
                <span className={`mono text-[11.5px] ${isDone ? 'text-white/60' : 'text-white/95'}`}>{line}</span>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {inLoop && (
          <motion.div
            key={loopLine + state.logIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 pt-2 border-t border-white/10 mt-2"
          >
            <TbLoader2 className="text-neon animate-spin shrink-0" size={15} />
            <span className="mono text-[11.5px] text-neon-soft text-glow">{loopLine}</span>
          </motion.div>
        )}
      </div>

      <div className="mt-3">
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-deep via-neon to-neon-soft"
            animate={{ width: inLoop ? '100%' : `${((state.logIndex + 1) / fixedLines.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mono text-[9px] text-white/40 mt-1.5 tracking-wider">
          {inLoop ? 'AWAITING MANUAL CONFIRMATION · TAP SCREEN TO SIGNAL ARRIVAL' : 'RUNNING PRE-NAVIGATION SEQUENCE'}
        </p>
      </div>
    </GlassPanel>
  )
}
