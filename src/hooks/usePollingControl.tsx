import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { env } from '@/config/env'

interface PollingContextValue {
  /** Whether live polling is enabled. */
  live: boolean
  toggleLive: () => void
  setLive: (v: boolean) => void
  /** Interval in ms. */
  intervalMs: number
  setIntervalMs: (ms: number) => void
  /** Convenience for react-query: interval when live, false when paused. */
  refetchInterval: number | false
}

const PollingContext = createContext<PollingContextValue | null>(null)

export function PollingProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState(true)
  const [intervalMs, setIntervalMs] = useState(env.pollIntervalMs)

  const value = useMemo<PollingContextValue>(
    () => ({
      live,
      toggleLive: () => setLive((v) => !v),
      setLive,
      intervalMs,
      setIntervalMs,
      refetchInterval: live ? intervalMs : false,
    }),
    [live, intervalMs],
  )

  return <PollingContext value={value}>{children}</PollingContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePollingControl(): PollingContextValue {
  const ctx = useContext(PollingContext)
  if (!ctx) throw new Error('usePollingControl must be used within PollingProvider')
  return ctx
}
