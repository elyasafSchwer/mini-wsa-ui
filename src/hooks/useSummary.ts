import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/services/stats.service'
import { queryKeys } from '@/lib/queryKeys'
import { usePollingControl } from '@/hooks/usePollingControl'
import type { StatsFilters } from '@/types/filters'

/** Live-polling summary stats (KPIs, category/action breakdown, top tables). */
export function useSummary(filters: StatsFilters) {
  const { refetchInterval } = usePollingControl()
  return useQuery({
    queryKey: queryKeys.summary(filters),
    queryFn: ({ signal }) => statsService.getSummary(filters, signal),
    refetchInterval,
  })
}
