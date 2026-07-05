import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRover } from '../../store/roverStore'
import { OverlayShell } from '../hud/OverlayShell'

const GRID = 14

export const SlamPage: React.FC = () => {
  const { closeOverlay } = useRover()
  const [cells, setCells] = useState<number[]>(() => Array(GRID * GRID).fill(0))

  useEffect(() => {
    const id = window.setInterval(() => {
      setCells((prev) => {
        const next = [...prev]
        for (let k = 0; k < 6; k++) {
          const idx = Math.floor(Math.random() * next.length)
          next[idx] = Math.random() > 0.4 ? 1 : 0
        }
        return next
      })
    }, 220)
    return () => window.clearInterval(id)
  }, [])

  return (
    <OverlayShell title="SLAM" subtitle="SIMULTANEOUS LOCALIZATION & MAPPING" onClose={closeOverlay} width="w-[440px]">
      <div className="relative aspect-square w-full rounded-xl overflow-hidden glass mb-4">
        {/* occupancy grid */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}>
          {cells.map((c, i) => (
            <motion.div
              key={i}
              animate={{ opacity: c ? [0.15, 0.55] : 0.05 }}
              transition={{ duration: 0.4 }}
              className="border border-white/5"
              style={{ background: c ? '#3fd0ff' : 'transparent' }}
            />
          ))}
        </div>
        {/* radar sweep */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg, rgba(63,208,255,0.35), transparent 40%)'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* robot center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 rounded-full bg-neon shadow-neon-strong" />
          <motion.div
            className="absolute inset-0 rounded-full border border-neon/50"
            animate={{ scale: [1, 4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mono text-[11px] text-white/60">
        <div className="glass rounded-lg px-3 py-2">MAP CONFIDENCE <span className="text-neon-soft float-right">94%</span></div>
        <div className="glass rounded-lg px-3 py-2">LOOP CLOSURE <span className="text-neon-green float-right">OK</span></div>
        <div className="glass rounded-lg px-3 py-2">POINT CLOUD <span className="text-neon-soft float-right">LIVE</span></div>
        <div className="glass rounded-lg px-3 py-2">DRIFT <span className="text-neon-green float-right">0.02m</span></div>
      </div>
    </OverlayShell>
  )
}
