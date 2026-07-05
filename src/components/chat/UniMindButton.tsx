import React from 'react'
import { motion } from 'framer-motion'
import { useRover } from '../../store/roverStore'

export const UniMindButton: React.FC = () => {
  const { openOverlay } = useRover()

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 z-30 bottom-24 pointer-events-auto">
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => openOverlay('chat')}
        className="relative flex flex-col items-center gap-1 w-20 h-20 rounded-full glass border border-neon/25 shadow-neon/40 p-2"
        aria-label="Open UniMind AI"
      >
        <span className="absolute -inset-1 rounded-full opacity-60 blur-xl bg-gradient-to-br from-cyan-400/30 to-cyan-600/10" />

        <motion.div
          className="flex items-center justify-center w-full h-full rounded-full bg-neon/6 backdrop-blur-sm"
          initial={{ boxShadow: '0 0 0 0 rgba(63,208,255,0.12)' }}
          animate={{ boxShadow: ['0 0 0 0 rgba(63,208,255,0.06)', '0 0 18px 8px rgba(63,208,255,0.08)'] }}
          transition={{ repeat: Infinity, repeatType: 'mirror', duration: 2 }}
        >
          {/* Brain / circuit SVG (from lucide style) */}
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v2" stroke="#8EF3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 4v2" stroke="#8EF3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 4v2" stroke="#8EF3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10c0-4 3-7 6-7s6 3 6 7v1" stroke="#8EF3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 10c0-4-3-7-6-7s-6 3-6 7v1" stroke="#8EF3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 13v7" stroke="#8EF3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        <div className="flex flex-col items-center mt-1">
          <div className="mono text-[11px] tracking-wider text-neon-soft">UniMind AI</div>
          <div className="text-[10px] text-white/50">Tap to Ask</div>
        </div>
      </motion.button>
    </div>
  )
}

export default UniMindButton
