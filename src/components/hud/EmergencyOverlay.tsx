import React from 'react'
import { motion } from 'framer-motion'
import { TbAlertTriangleFilled, TbPlayerPlayFilled } from 'react-icons/tb'
import { useRover } from '../../store/roverStore'

export const EmergencyOverlay: React.FC = () => {
  const { state, toggleEmergency } = useRover()
  if (!state.emergency) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neon-red/5 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-3xl px-14 py-12 flex flex-col items-center text-center border-neon-red/40"
        style={{ boxShadow: '0 0 40px rgba(255,77,94,0.35)' }}
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-neon-red/10 border border-neon-red/60 flex items-center justify-center mb-6"
        >
          <TbAlertTriangleFilled size={40} className="text-neon-red" />
        </motion.div>
        <p className="display text-2xl tracking-wide text-neon-red mb-2">Emergency Stop Activated</p>
        <p className="mono text-[11px] tracking-[0.2em] text-white/50 mb-8">ALL MOTION HALTED · SYSTEMS FROZEN</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleEmergency(false)}
          className="glass rounded-full px-8 py-3 flex items-center gap-2 border-neon-green/40 hover:shadow-neon-strong"
        >
          <TbPlayerPlayFilled className="text-neon-green" size={18} />
          <span className="mono text-sm tracking-wide text-white/90">Resume</span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
