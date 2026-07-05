export interface Destination {
  id: string
  label: string
  department: string
  position: [number, number, number]
  waypoints: [number, number, number][]
}

export type RoverMode =
  | 'idle'
  | 'navigating'
  | 'holding'
  | 'reached'
  | 'returning'

export interface RoverTelemetry {
  battery: number
  speed: number
  localization: 'ACTIVE' | 'IDLE'
  slam: 'RUNNING' | 'IDLE'
  navigation: 'ACTIVE' | 'IDLE'
  lidar: 'CONNECTED' | 'STANDBY'
  depthCamera: 'CONNECTED' | 'STANDBY'
  jetson: 'ONLINE' | 'STANDBY'
  ros2: 'CONNECTED' | 'STANDBY'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'rover'
  text: string
}

export type OverlayKey =
  | 'destination'
  | 'slam'
  | 'navigation'
  | 'chat'
  | 'status'
  | null
