import React, { useCallback, useState } from 'react'
import { TbSend2 } from 'react-icons/tb'

type Props = {
  onSend: (text: string) => void
  disabled?: boolean
}

export const ChatInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [text, setText] = useState('')

  const submit = useCallback(() => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }, [onSend, text])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="flex items-center gap-2 glass rounded-full px-4 py-2 border-neon/20"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask UniMind anything..."
        className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/30 resize-none h-10 max-h-28"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
      />

      <button type="submit" disabled={disabled} className="text-neon-soft hover:text-neon transition-colors">
        <TbSend2 size={18} />
      </button>
    </form>
  )
}

export default ChatInput
