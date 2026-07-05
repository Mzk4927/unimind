import React from 'react'
import { motion } from 'framer-motion'
import { TbCircleCheck } from 'react-icons/tb'
import { useRover } from '../../store/roverStore'

export const ReachedOverlay: React.FC = () => {
  const { state } = useRover()
  if (state.mode !== 'reached' || !state.destination) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-3xl px-14 py-12 flex flex-col items-center text-center shadow-neon-strong"
      >
        <div className="relative mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border border-neon-green/40"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <div className="w-24 h-24 rounded-full bg-neon-green/10 border border-neon-green/50 flex items-center justify-center">
            <TbCircleCheck size={52} className="text-neon-green" />
          </div>
        </div>
        <p className="display text-2xl tracking-wide text-neon-green mb-2">Destination Reached</p>
        <p className="text-lg text-white/85 mb-1">Welcome to {state.destination.label}</p>
        <p className="mono text-[11px] tracking-[0.2em] text-white/40">NAVIGATION COMPLETED SUCCESSFULLY</p>
        <p className="mono text-[10px] tracking-[0.15em] text-white/30 mt-6">RETURNING TO BASE SHORTLY...</p>
      </motion.div>
    </motion.div>
  )
}
