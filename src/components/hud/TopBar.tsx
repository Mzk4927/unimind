import React from 'react'
import { motion } from 'framer-motion'
import { useRover } from '../../store/roverStore'

const MODE_LABEL: Record<string, string> = {
  idle: 'STANDBY',
  navigating: 'AUTONOMOUS NAVIGATION',
  holding: 'STOPPING',
  reached: 'DESTINATION REACHED',
  returning: 'RETURNING TO BASE'
}

export const TopBar: React.FC = () => {
  const { state } = useRover()
  return (
    <div className="pointer-events-none absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-30">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-neon shadow-neon animate-pulseGlow" />
        <div>
          <p className="display text-sm tracking-[0.35em] text-neon-soft text-glow">A.R.I.S.</p>
          <p className="mono text-[10px] tracking-[0.25em] text-white/40">AUTONOMOUS INDOOR INTELLIGENT ROVER · NUTECH</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass rounded-full px-5 py-2 flex items-center gap-2"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${state.emergency ? 'bg-neon-red' : 'bg-neon-green'} animate-pulseGlow`} />
        <span className="mono text-[11px] tracking-[0.2em] text-white/80">
          {state.emergency ? 'EMERGENCY STOP' : MODE_LABEL[state.mode]}
        </span>
      </motion.div>
    </div>
  )
}
