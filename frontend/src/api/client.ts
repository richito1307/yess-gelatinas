const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:8080/api'

function getCredentials(): string | null {
  const auth = localStorage.getItem('yess_auth')
  if (!auth) return null
  const { username, password } = JSON.parse(auth)
  return btoa(`${username}:${password}`)
}

export class ApiError extends Error {
  status: number
  errores?: Record<string, string>
  constructor(status: number, message: string, errores?: Record<string, string>) {
    super(message)
    this.status = status
    this.errores = errores
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const credentials = getCredentials()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  if (credentials) {
    headers['Authorization'] = `Basic ${credentials}`
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ mensaje: `Error ${res.status}` }))
    throw new ApiError(res.status, body.mensaje || `Error ${res.status}`, body.errores)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export async function testCredentials(username: string, password: string): Promise<boolean> {
  const creds = btoa(`${username}:${password}`)
  try {
    const res = await fetch(`${API_BASE}/productos`, {
      headers: { Authorization: `Basic ${creds}` },
    })
    return res.ok
  } catch {
    return false
  }
}
