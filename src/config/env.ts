/**
 * Typed access to environment configuration.
 * Paths are relative by default so the Vite dev proxy (and a prod reverse proxy)
 * can forward /v1 and /api to the backend without CORS.
 */
export const env = {
  /** Base URL for backend calls. Empty string = same-origin (use the proxy). */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  /** Polling interval for live views, in ms. */
  pollIntervalMs: Number(import.meta.env.VITE_POLL_INTERVAL_MS ?? 10_000),
} as const
