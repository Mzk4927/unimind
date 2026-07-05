import React from 'react'
import { ChatMessage as MsgType } from '../../types'

export const ChatMessage: React.FC<{ m: MsgType }> = ({ m }) => {
  const isUser = m.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser ? 'bg-neon/20 text-white border border-neon/30' : 'glass text-white/85'
        }`}
      >
        {!isUser && <div className="flex items-center gap-1.5 mb-1 text-neon-soft/70 text-[11px]"><span className="mono tracking-widest">UniMind</span></div>}
        {m.text}
      </div>
    </div>
  )
}

export default ChatMessage
