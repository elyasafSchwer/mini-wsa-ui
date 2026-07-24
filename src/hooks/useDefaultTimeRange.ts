import { useMemo } from 'react'
import type { Interval } from '@/types/domain'
import { toApiIso } from '@/lib/format'

/**
 * Default timeseries window for the Overview when the user hasn't set an
 * explicit range. Timeseries REQUIRES from/to (unlike summary), so we need a
 * sensible default that covers the data.
 *
 * We look back a fixed span from "now". If the user has set from/to via
 * filters, those win. Interval is chosen to keep the bucket count reasonable.
 */
export function useDefaultTimeRange(
  from: string | undefined,
  to: string | undefined,
  lookbackHours = 48,
): { from: string; to: string; interval: Interval } {
  return useMemo(() => {
    // Deliberately compute against wall-clock now; the user can narrow via filters.
    const end = to ? new Date(to) : new Date()
    const start = from ? new Date(from) : new Date(end.getTime() - lookbackHours * 3_600_000)
    const spanHours = (end.getTime() - start.getTime()) / 3_600_000

    // Keep buckets in a readable range regardless of span.
    const interval: Interval = spanHours > 12 ? '1h' : spanHours > 2 ? '5m' : '1m'

    return { from: toApiIso(start), to: toApiIso(end), interval }
  }, [from, to, lookbackHours])
}
