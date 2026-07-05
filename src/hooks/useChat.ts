import { useCallback, useEffect, useRef, useState } from 'react'
import * as chatService from '../services/chatService'
import { ChatMessage } from '../types'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sessionRef = useRef<string | null>(null)

  useEffect(() => {
    // Rehydrate or create a session
    const sid = localStorage.getItem('unimind_session')
    if (sid) sessionRef.current = sid
    else {
      chatService
        .startSession()
        .then((res) => {
          sessionRef.current = res.session_id
          localStorage.setItem('unimind_session', res.session_id)
        })
        .catch((e) => console.error('Session start failed', e))
    }
  }, [])

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return
    setError(null)
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((m) => [...m, userMsg])

    if (!sessionRef.current) {
      try {
        const res = await chatService.startSession()
        sessionRef.current = res.session_id
        localStorage.setItem('unimind_session', res.session_id)
      } catch (e: any) {
        setError(e.message)
        return
      }
    }

    setLoading(true)
    try {
      const res = await chatService.postChat(sessionRef.current as string, text)
      // If backend returns full history, map that to local messages
      if (res.history && Array.isArray(res.history)) {
        const mapped = res.history.map((h: any) => ({
          id: h.id ? String(h.id) : crypto.randomUUID(),
          role: h.sender === 'ai' ? 'rover' : 'user',
          text: h.text || ''
        })) as ChatMessage[]
        setMessages(mapped)
      } else {
        const aiText = res.response || 'No response.'
        const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'rover', text: aiText }
        setMessages((m) => [...m, aiMsg])
      }
    } catch (e: any) {
      setError(e.message || 'Network error')
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'rover', text: "I'm having trouble connecting to the AI service." }
      setMessages((m) => [...m, aiMsg])
    } finally {
      setLoading(false)
    }
  }, [])

  return { messages, send, loading, error }
}

export default useChat
