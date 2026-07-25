import { env } from '@/config/env'
import type { ApiErrorBody } from '@/types/api'

/** Error thrown by the API client with the HTTP status and server message. */
export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type QueryValue = string | number | boolean | undefined | null

/** Build a query string, skipping undefined/null/empty values. */
export function toQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

async function parseError(res: Response): Promise<never> {
  let message = `${res.status} ${res.statusText}`
  try {
    const body = (await res.json()) as ApiErrorBody
    if (body?.message) message = body.message
  } catch {
    // Non-JSON error body; fall back to status text.
  }
  throw new ApiError(res.status, message)
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  signal?: AbortSignal
}

/**
 * Thin fetch wrapper: prefixes the base URL, sends/parses JSON (or multipart
 * FormData), and normalizes errors into ApiError. All services go through this.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options
  const isFormData = body instanceof FormData

  // For FormData, let the browser set Content-Type (with the multipart
  // boundary). For plain objects, send JSON.
  const headers =
    body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : undefined
  const payload =
    body === undefined ? undefined : isFormData ? body : JSON.stringify(body)

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    signal,
    headers,
    body: payload,
  })

  if (!res.ok) return parseError(res)

  // 204 / empty body guard.
  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}
