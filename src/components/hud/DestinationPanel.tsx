import React from 'react'
import { motion } from 'framer-motion'
import { TbDoorEnter } from 'react-icons/tb'
import { DEPARTMENT_GROUPS, DESTINATIONS } from '../../data/destinations'
import { useRover } from '../../store/roverStore'
import { OverlayShell } from './OverlayShell'

export const DestinationPanel: React.FC = () => {
  const { selectDestination, closeOverlay } = useRover()

  return (
    <OverlayShell title="Select Destination" subtitle="NUTECH UNIVERSITY · INDOOR MAP" onClose={closeOverlay}>
      <div className="space-y-5">
        {DEPARTMENT_GROUPS.map((group) => (
          <div key={group.name}>
            <p className="mono text-[10px] tracking-[0.25em] text-neon/70 mb-2">{group.name.toUpperCase()}</p>
            <div className="grid grid-cols-2 gap-2">
              {group.ids.map((id) => {
                const dest = DESTINATIONS.find((d) => d.id === id)!
                return (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectDestination(dest)}
                    className="glass rounded-xl px-3 py-3 flex items-center gap-2 border-neon/20 hover:shadow-neon text-left"
                  >
                    <TbDoorEnter className="text-neon-soft shrink-0" size={16} />
                    <span className="text-sm font-medium text-white/90">{dest.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </OverlayShell>
  )
}
