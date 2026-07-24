import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/services/stats.service'
import { queryKeys } from '@/lib/queryKeys'
import { usePollingControl } from '@/hooks/usePollingControl'
import type { TimeseriesParams } from '@/types/filters'

/** Live-polling event timeseries for the trend chart. */
export function useTimeseries(params: TimeseriesParams, enabled = true) {
  const { refetchInterval } = usePollingControl()
  return useQuery({
    queryKey: queryKeys.timeseries(params),
    queryFn: ({ signal }) => statsService.getTimeseries(params, signal),
    refetchInterval,
    enabled: enabled && Boolean(params.from && params.to),
  })
}
