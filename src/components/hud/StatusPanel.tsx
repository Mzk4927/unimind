import React from 'react'
import { motion } from 'framer-motion'
import { useRover } from '../../store/roverStore'
import { OverlayShell } from './OverlayShell'

const Row: React.FC<{ label: string; value: string | number; good?: boolean }> = ({ label, value, good = true }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
    <span className="mono text-[11px] text-white/50 tracking-wide">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${good ? 'bg-neon-green' : 'bg-neon-amber'} animate-pulseGlow`} />
      <span className="mono text-[12px] text-white/90 font-medium">{value}</span>
    </div>
  </div>
)

export const StatusPanel: React.FC = () => {
  const { state, closeOverlay } = useRover()
  const t = state.telemetry

  return (
    <OverlayShell title="Robot Status" subtitle="LIVE TELEMETRY FEED" onClose={closeOverlay}>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-4">
          <p className="mono text-[10px] text-white/40 mb-1">BATTERY</p>
          <p className="display text-2xl text-neon-soft text-glow">{t.battery.toFixed(0)}%</p>
          <div className="h-1 w-full rounded-full bg-white/10 mt-2 overflow-hidden">
            <motion.div className="h-full bg-neon" animate={{ width: `${t.battery}%` }} />
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="mono text-[10px] text-white/40 mb-1">SPEED</p>
          <p className="display text-2xl text-neon-soft text-glow">{t.speed.toFixed(2)} <span className="text-xs">m/s</span></p>
        </div>
      </div>
      <Row label="LOCALIZATION" value={t.localization} good={t.localization === 'ACTIVE'} />
      <Row label="SLAM" value={t.slam} good={t.slam === 'RUNNING'} />
      <Row label="NAVIGATION" value={t.navigation} good={t.navigation === 'ACTIVE'} />
      <Row label="LIDAR" value={t.lidar} good={t.lidar === 'CONNECTED'} />
      <Row label="DEPTH CAMERA" value={t.depthCamera} good={t.depthCamera === 'CONNECTED'} />
      <Row label="JETSON NANO" value={t.jetson} good={t.jetson === 'ONLINE'} />
      <Row label="ROS2" value={t.ros2} good={t.ros2 === 'CONNECTED'} />
    </OverlayShell>
  )
}
