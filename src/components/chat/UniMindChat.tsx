import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRover } from '../../store/roverStore'
import useChat from '../../hooks/useChat'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { TbX } from 'react-icons/tb'

export const UniMindChat: React.FC = () => {
  const { closeOverlay } = useRover()
  const { messages, send, loading } = useChat()
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed right-0 top-0 h-screen z-40"
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div className="h-full glass-backdrop bg-black/40 backdrop-blur-sm border-l border-neon/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neon/10">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-lg">🤖</div>
                <div>
                  <div className="font-semibold">UniMind AI</div>
                  <div className="text-xs text-white/60">Online</div>
                </div>
              </div>
            </div>
            <button onClick={closeOverlay} className="p-2 rounded hover:bg-neon/6">
              <TbX size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id}>
                <ChatMessage m={m} />
              </div>
            ))}
            {loading && (
              <div className="text-white/50">UniMind is typing...</div>
            )}
            <div ref={endRef} />
          </div>

          <div className="px-4 py-3">
            <ChatInput onSend={send} disabled={loading} />
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}

export default UniMindChat
