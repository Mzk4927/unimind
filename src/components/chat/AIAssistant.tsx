import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TbSend2, TbRobot } from 'react-icons/tb'
import { ChatMessage } from '../../types'
import { OverlayShell } from '../hud/OverlayShell'
import { useRover } from '../../store/roverStore'
import { DESTINATIONS } from '../../data/destinations'

const SUGGESTIONS = ['Where is Class 503?', 'Guide me to CEN Department.', 'Where is NUTech Media?']

function craftReply(text: string): string {
  const lower = text.toLowerCase()
  const found = DESTINATIONS.find((d) => lower.includes(d.label.toLowerCase()) || lower.includes(d.department.toLowerCase()))
  if (found) {
    return `${found.label} is located in the ${found.department} wing. Say the word and I can begin autonomous navigation there now.`
  }
  if (lower.includes('battery')) return 'Current battery reserves are healthy and sufficient for continued indoor operation.'
  if (lower.includes('hello') || lower.includes('hi')) return 'Hello. I am the onboard assistant for this Autonomous Indoor Intelligent Rover. How can I help you navigate NUTECH today?'
  return 'I can help you locate any room across the CS Department, CEN Department, or NUTech Media. Try asking me where a specific destination is.'
}

export const AIAssistant: React.FC = () => {
  const { closeOverlay, selectDestination } = useRover()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'rover', text: 'Onboard assistant online. Ask me to guide you anywhere in NUTECH.' }
  ])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    window.setTimeout(() => {
      const reply: ChatMessage = { id: crypto.randomUUID(), role: 'rover', text: craftReply(text) }
      setMessages((m) => [...m, reply])
      window.setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }, 650)
  }

  return (
    <OverlayShell title="AI Assistant" subtitle="ONBOARD NATURAL LANGUAGE GUIDE" onClose={closeOverlay} width="w-[420px]">
      <div className="flex flex-col h-[420px]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user' ? 'bg-neon/20 text-white border border-neon/30' : 'glass text-white/85'
                  }`}
                >
                  {m.role === 'rover' && (
                    <div className="flex items-center gap-1.5 mb-1 text-neon-soft/70">
                      <TbRobot size={13} />
                      <span className="mono text-[9px] tracking-widest">A.R.I.S.</span>
                    </div>
                  )}
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2 my-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="mono text-[10px] tracking-wide text-neon-soft/80 border border-neon/25 rounded-full px-3 py-1.5 hover:bg-neon/10 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex items-center gap-2 glass rounded-full px-4 py-2 border-neon/20"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the rover anything..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
          />
          <button type="submit" className="text-neon-soft hover:text-neon transition-colors">
            <TbSend2 size={18} />
          </button>
        </form>
      </div>
    </OverlayShell>
  )
}
