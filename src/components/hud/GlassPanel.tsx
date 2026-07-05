import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  corners?: boolean
}

export const GlassPanel: React.FC<Props> = ({ children, className = '', corners = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`glass rounded-2xl shadow-neon relative ${corners ? 'hud-corner' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
