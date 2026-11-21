export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'admin',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Error ${response.status}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
