import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { RoverProvider, useRover } from './store/roverStore'
import { LoadingScreen } from './components/loading/LoadingScreen'
import { RoverScene } from './components/scene/RoverScene'
import { TopBar } from './components/hud/TopBar'
import { HomeButtons } from './components/hud/HomeButtons'
import { ProcessingLog } from './components/hud/ProcessingLog'
import { DestinationPanel } from './components/hud/DestinationPanel'
import { StatusPanel } from './components/hud/StatusPanel'
import { ReachedOverlay } from './components/hud/ReachedOverlay'
import { EmergencyOverlay } from './components/hud/EmergencyOverlay'
import { SlamPage } from './components/pages/SlamPage'
import { NavigationPage } from './components/pages/NavigationPage'
import UniMindButton from './components/chat/UniMindButton'
import UniMindChat from './components/chat/UniMindChat'

const Shell: React.FC = () => {
  const { state, arriveClick } = useRover()

  const handleBackgroundClick = () => {
    if (state.overlay || state.emergency) return
    if (state.mode === 'navigating') arriveClick()
  }

  return (
    <div className="relative w-screen h-screen bg-void" onClick={handleBackgroundClick}>
      <AnimatePresence>{!state.booted && <LoadingScreen />}</AnimatePresence>

      {state.booted && (
        <>
          <RoverScene />
          <TopBar />
          <HomeButtons />

          {(state.mode === 'navigating' || state.mode === 'holding') && (
            <div className="absolute bottom-8 left-8 z-20">
              <ProcessingLog />
            </div>
          )}

          <AnimatePresence>
            {state.overlay === 'destination' && <DestinationPanel />}
            {state.overlay === 'status' && <StatusPanel />}
            {state.overlay === 'slam' && <SlamPage />}
            {state.overlay === 'navigation' && <NavigationPage />}
            {state.overlay === 'chat' && <UniMindChat />}
          </AnimatePresence>

          {/* Floating UniMind button below the rover */}
          <UniMindButton />

          <AnimatePresence>
            <ReachedOverlay key="reached" />
          </AnimatePresence>
          <AnimatePresence>
            <EmergencyOverlay key="emergency" />
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

const App: React.FC = () => (
  <RoverProvider>
    <Shell />
  </RoverProvider>
)

export default App
