import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'
import { Destination, OverlayKey, RoverMode, RoverTelemetry } from '../types'

interface State {
  booted: boolean
  mode: RoverMode
  destination: Destination | null
  overlay: OverlayKey
  emergency: boolean
  logIndex: number
  telemetry: RoverTelemetry
  runId: number
}

type Action =
  | { type: 'BOOT_DONE' }
  | { type: 'OPEN_OVERLAY'; key: OverlayKey }
  | { type: 'CLOSE_OVERLAY' }
  | { type: 'SELECT_DESTINATION'; destination: Destination }
  | { type: 'ADVANCE_LOG' }
  | { type: 'ARRIVE_CLICK' }
  | { type: 'SHOW_REACHED' }
  | { type: 'START_RETURN' }
  | { type: 'RESET_HOME' }
  | { type: 'TOGGLE_EMERGENCY'; value: boolean }
  | { type: 'TICK_TELEMETRY' }

const initialTelemetry: RoverTelemetry = {
  battery: 98,
  speed: 0,
  localization: 'IDLE',
  slam: 'IDLE',
  navigation: 'IDLE',
  lidar: 'STANDBY',
  depthCamera: 'STANDBY',
  jetson: 'ONLINE',
  ros2: 'STANDBY'
}

const initialState: State = {
  booted: false,
  mode: 'idle',
  destination: null,
  overlay: null,
  emergency: false,
  logIndex: 0,
  telemetry: initialTelemetry,
  runId: 0
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BOOT_DONE':
      return { ...state, booted: true }
    case 'OPEN_OVERLAY':
      return { ...state, overlay: action.key }
    case 'CLOSE_OVERLAY':
      return { ...state, overlay: null }
    case 'SELECT_DESTINATION':
      return {
        ...state,
        destination: action.destination,
        mode: 'navigating',
        overlay: null,
        logIndex: 0,
        runId: state.runId + 1,
        telemetry: {
          ...state.telemetry,
          localization: 'ACTIVE',
          slam: 'RUNNING',
          navigation: 'ACTIVE',
          lidar: 'CONNECTED',
          depthCamera: 'CONNECTED',
          ros2: 'CONNECTED',
          speed: 0.6
        }
      }
    case 'ADVANCE_LOG':
      return { ...state, logIndex: state.logIndex + 1 }
    case 'ARRIVE_CLICK':
      if (state.mode !== 'navigating') return state
      return { ...state, mode: 'holding', telemetry: { ...state.telemetry, speed: 0 } }
    case 'SHOW_REACHED':
      return { ...state, mode: 'reached' }
    case 'START_RETURN':
      return {
        ...state,
        mode: 'returning',
        telemetry: { ...state.telemetry, speed: 0.5, navigation: 'ACTIVE' }
      }
    case 'RESET_HOME':
      return {
        ...state,
        mode: 'idle',
        destination: null,
        logIndex: 0,
        telemetry: initialTelemetry
      }
    case 'TOGGLE_EMERGENCY':
      return { ...state, emergency: action.value }
    case 'TICK_TELEMETRY': {
      if (state.mode !== 'navigating' && state.mode !== 'returning') return state
      const jitter = (Math.random() - 0.5) * 0.15
      const nextBattery = Math.max(41, state.telemetry.battery - Math.random() * 0.15)
      return {
        ...state,
        telemetry: {
          ...state.telemetry,
          battery: Math.round(nextBattery * 10) / 10,
          speed: Math.round(Math.max(0.15, 0.6 + jitter) * 100) / 100
        }
      }
    }
    default:
      return state
  }
}

interface Ctx {
  state: State
  dispatch: React.Dispatch<Action>
  selectDestination: (d: Destination) => void
  arriveClick: () => void
  toggleEmergency: (v: boolean) => void
  openOverlay: (k: OverlayKey) => void
  closeOverlay: () => void
}

const RoverContext = createContext<Ctx | null>(null)

export const RoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const reachedTimer = useRef<number | null>(null)

  // Telemetry heartbeat
  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: 'TICK_TELEMETRY' }), 1200)
    return () => window.clearInterval(id)
  }, [])

  // When rover physically stops (mode = holding) -> brief pause -> reached
  useEffect(() => {
    if (state.mode === 'holding') {
      const t = window.setTimeout(() => dispatch({ type: 'SHOW_REACHED' }), 1100)
      return () => window.clearTimeout(t)
    }
  }, [state.mode])

  // After reached, wait 3s then auto-return
  useEffect(() => {
    if (state.mode === 'reached') {
      reachedTimer.current = window.setTimeout(() => dispatch({ type: 'START_RETURN' }), 3000)
      return () => {
        if (reachedTimer.current) window.clearTimeout(reachedTimer.current)
      }
    }
  }, [state.mode])

  const selectDestination = useCallback((d: Destination) => dispatch({ type: 'SELECT_DESTINATION', destination: d }), [])
  const arriveClick = useCallback(() => dispatch({ type: 'ARRIVE_CLICK' }), [])
  const toggleEmergency = useCallback((v: boolean) => dispatch({ type: 'TOGGLE_EMERGENCY', value: v }), [])
  const openOverlay = useCallback((k: OverlayKey) => dispatch({ type: 'OPEN_OVERLAY', key: k }), [])
  const closeOverlay = useCallback(() => dispatch({ type: 'CLOSE_OVERLAY' }), [])

  return (
    <RoverContext.Provider value={{ state, dispatch, selectDestination, arriveClick, toggleEmergency, openOverlay, closeOverlay }}>
      {children}
    </RoverContext.Provider>
  )
}

export function useRover() {
  const ctx = useContext(RoverContext)
  if (!ctx) throw new Error('useRover must be used within RoverProvider')
  return ctx
}
