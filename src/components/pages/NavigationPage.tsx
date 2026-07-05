import React from 'react'
import { motion } from 'framer-motion'
import { useRover } from '../../store/roverStore'
import { OverlayShell } from '../hud/OverlayShell'

export const NavigationPage: React.FC = () => {
  const { state, closeOverlay } = useRover()
  const active = state.mode === 'navigating' || state.mode === 'returning'

  return (
    <OverlayShell title="Navigation" subtitle="GLOBAL & LOCAL PATH PLANNING" onClose={closeOverlay} width="w-[440px]">
      <div className="relative w-full aspect-video rounded-xl glass overflow-hidden mb-4">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <line x1="20" y1="60" x2="180" y2="60" stroke="#3fd0ff" strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 4" />
          <motion.circle
            cy="60"
            r="4"
            fill="#3fd0ff"
            animate={{ cx: active ? [20, 180, 20] : 20 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="20" cy="60" r="5" fill="none" stroke="#8fe8ff" strokeWidth={1.5} />
          <circle cx="180" cy="60" r="6" fill="none" stroke="#3dffb0" strokeWidth={1.5} />
          <text x="10" y="78" fill="#8fe8ff" fontSize="7" fontFamily="monospace">ROBOT</text>
          <text x="164" y="78" fill="#3dffb0" fontSize="7" fontFamily="monospace">GOAL</text>
          {[70, 110, 150].map((x, i) => (
            <motion.rect
              key={i}
              x={x}
              y="35"
              width="6"
              height="6"
              fill="#ff4d5e"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </svg>
      </div>

      <div className="space-y-2 mono text-[11px] text-white/65">
        <div className="flex justify-between glass rounded-lg px-3 py-2">
          <span>GLOBAL PLANNER</span>
          <span className="text-neon-green">{active ? 'COMPUTING' : 'IDLE'}</span>
        </div>
        <div className="flex justify-between glass rounded-lg px-3 py-2">
          <span>LOCAL PLANNER</span>
          <span className="text-neon-green">{active ? 'ACTIVE' : 'IDLE'}</span>
        </div>
        <div className="flex justify-between glass rounded-lg px-3 py-2">
          <span>ROBOT POSITION</span>
          <span className="text-neon-soft">{state.destination ? 'IN TRANSIT' : 'HOME (0,0)'}</span>
        </div>
        <div className="flex justify-between glass rounded-lg px-3 py-2">
          <span>GOAL POSITION</span>
          <span className="text-neon-soft">{state.destination ? state.destination.label.toUpperCase() : '—'}</span>
        </div>
        <div className="flex justify-between glass rounded-lg px-3 py-2">
          <span>OBSTACLE AVOIDANCE</span>
          <span className="text-neon-green">{active ? 'MONITORING' : 'STANDBY'}</span>
        </div>
      </div>
    </OverlayShell>
  )
}
