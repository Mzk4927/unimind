import React from 'react'
import { motion } from 'framer-motion'
import { TbX } from 'react-icons/tb'
import { GlassPanel } from './GlassPanel'

interface Props {
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export const OverlayShell: React.FC<Props> = ({ title, subtitle, onClose, children, width = 'w-[420px]' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <GlassPanel className={`${width} max-h-[80vh] p-6 flex flex-col`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="display text-lg tracking-wider text-neon-soft text-glow">{title}</h2>
              {subtitle && <p className="mono text-[10px] text-white/40 mt-1 tracking-wide">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
              <TbX size={20} />
            </button>
          </div>
          <div className="hairline mb-4" />
          <div className="overflow-y-auto pr-1">{children}</div>
        </GlassPanel>
      </div>
    </motion.div>
  )
}
