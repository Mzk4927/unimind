export interface StartSessionResp {
  token: string
  session_id: string
}

const apiBase = (import.meta as any).env?.VITE_API_BASE ?? ''

export async function startSession(name = 'ARIS User') {
  const res = await fetch(`${apiBase}/api/student/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, dept: 'ARIS', semester: 1 })
  })
  if (!res.ok) throw new Error(`Failed to start session (${res.status})`)
  return (await res.json()) as StartSessionResp
}

export async function postChat(session_id: string, message: string) {
  const res = await fetch(`${apiBase}/api/student/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, message })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Chat request failed (${res.status})`)
  }
  return res.json()
}

export default { startSession, postChat }
