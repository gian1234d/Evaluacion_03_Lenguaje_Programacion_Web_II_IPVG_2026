export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface ApiError {
  message?: string | string[]
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  const token = localStorage.getItem('token')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message
    throw new Error(message ?? `Error ${response.status}`)
  }
  if (response.status === 204 || response.headers.get('content-length') === '0') return undefined as T
  return response.json() as Promise<T>
}

export function usuarioActual(): { id: number; rol: string } | null {
  if (!localStorage.getItem('token')) return null
  try {
    return JSON.parse(localStorage.getItem('usuario') ?? 'null')
  } catch {
    return null
  }
}
