import React from 'react'
import { motion } from 'framer-motion'
import { TbMapPinSearch, TbRadar2, TbRoute2, TbMessageChatbot, TbActivityHeartbeat, TbAlertTriangleFilled } from 'react-icons/tb'
import { useRover } from '../../store/roverStore'

interface ButtonSpec {
  key: string
  label: string
  icon: React.ReactNode
  style: React.CSSProperties
  danger?: boolean
  onClick: () => void
  disabled?: boolean
}

export const HomeButtons: React.FC = () => {
  const { state, openOverlay, toggleEmergency } = useRover()

  const buttons: ButtonSpec[] = [
    {
      key: 'destination',
      label: 'Destination',
      icon: <TbMapPinSearch size={22} />,
      style: { top: '20%', left: '10%' },
      disabled: state.mode !== 'idle',
      onClick: () => openOverlay('destination')
    },
    {
      key: 'slam',
      label: 'SLAM',
      icon: <TbRadar2 size={22} />,
      style: { top: '20%', right: '10%' },
      onClick: () => openOverlay('slam')
    },
    {
      key: 'navigation',
      label: 'Navigation',
      icon: <TbRoute2 size={22} />,
      style: { bottom: '16%', left: '8%' },
      onClick: () => openOverlay('navigation')
    },
    {
      key: 'chat',
      label: 'AI Assistant',
      icon: <TbMessageChatbot size={22} />,
      style: { bottom: '16%', right: '8%' },
      onClick: () => openOverlay('chat')
    },
    {
      key: 'status',
      label: 'Robot Status',
      icon: <TbActivityHeartbeat size={22} />,
      style: { top: '46%', left: '4%' },
      onClick: () => openOverlay('status')
    },
    {
      key: 'emergency',
      label: 'Emergency Stop',
      icon: <TbAlertTriangleFilled size={22} />,
      style: { top: '46%', right: '4%' },
      danger: true,
      onClick: () => toggleEmergency(true)
    }
  ]

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {buttons.map((b, i) => (
        <motion.button
          key={b.key}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: b.disabled ? 0.35 : 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { delay: 0.6 + i * 0.08, duration: 0.5 },
            scale: { delay: 0.6 + i * 0.08, duration: 0.5 },
            y: { duration: 3.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }
          }}
          whileHover={b.disabled ? {} : { scale: 1.1 }}
          whileTap={b.disabled ? {} : { scale: 0.95 }}
          disabled={b.disabled}
          onClick={(e) => {
            e.stopPropagation()
            b.onClick()
          }}
          style={b.style}
          className={`pointer-events-auto absolute glass rounded-2xl px-4 py-3 flex flex-col items-center gap-1.5 group
            ${b.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-neon-strong'}
            ${b.danger ? 'border-neon-red/50 hover:bg-neon-red/10' : 'border-neon/30'}`}
        >
          <span className={b.danger ? 'text-neon-red' : 'text-neon-soft'}>{b.icon}</span>
          <span className="mono text-[10px] tracking-[0.15em] text-white/80 whitespace-nowrap">{b.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
