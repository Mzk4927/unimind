import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useRover } from '../../store/roverStore'

const BOOT_LOG = [
  'Powering core systems...',
  'Calibrating sensor array...',
  'Initializing LiDAR & depth vision...',
  'Loading NUTECH campus map...',
  'Synchronizing Jetson Nano runtime...',
  'A.R.I.S. online.'
]

export const LoadingScreen: React.FC = () => {
  const { dispatch } = useRover()
  const [progress, setProgress] = useState(0)
  const [line, setLine] = useState(0)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    if (ringRef.current) {
      tl.fromTo(ringRef.current, { scale: 0.6, opacity: 0, rotate: -30 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.6, ease: 'power3.out' })
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.9, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 100 / (BOOT_LOG.length * 12))
        return next
      })
    }, 90)
    const lineInterval = window.setInterval(() => {
      setLine((l) => Math.min(BOOT_LOG.length - 1, l + 1))
    }, 620)
    const done = window.setTimeout(() => dispatch({ type: 'BOOT_DONE' }), 4300)
    return () => {
      window.clearInterval(interval)
      window.clearInterval(lineInterval)
      window.clearTimeout(done)
    }
  }, [dispatch])

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center overflow-hidden"
    >
      {/* holographic grid backdrop */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(63,208,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(63,208,255,0.15) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          transform: 'perspective(500px) rotateX(60deg) scale(2)',
          transformOrigin: 'center bottom'
        }}
      />

      {/* scanning laser line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-[2px] bg-neon shadow-neon-strong animate-scanline" />
      </div>

      {/* ambient glow */}
      <div
        ref={glowRef}
        className="absolute w-[520px] h-[520px] rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(63,208,255,0.25), transparent 70%)' }}
      />

      {/* central hologram ring representing the rover materializing */}
      <div ref={ringRef} className="relative flex items-center justify-center mb-10">
        <div className="w-40 h-40 rounded-full border border-neon/40 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border border-neon-soft/50 animate-pulseGlow flex items-center justify-center">
            <div className="w-14 h-14 rounded-xl bg-neon/20 border border-neon shadow-neon-strong" />
          </div>
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border border-neon/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </div>

      <p className="display text-2xl tracking-[0.4em] text-neon-soft text-glow mb-2">A.R.I.S.</p>
      <p className="mono text-[10px] tracking-[0.3em] text-white/40 mb-10">AUTONOMOUS INDOOR INTELLIGENT ROVER</p>

      <div className="w-72">
        <p className="mono text-[11px] text-white/70 h-5 mb-2 text-center">{BOOT_LOG[line]}</p>
        <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-neon-deep via-neon to-neon-soft" style={{ width: `${progress}%` }} />
        </div>
        <p className="mono text-[9px] text-white/30 text-center mt-2">{Math.floor(progress)}%</p>
      </div>
    </motion.div>
  )
}
