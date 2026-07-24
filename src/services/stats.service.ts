import { apiRequest, toQuery } from '@/lib/apiClient'
import type { SummaryResponse, TimeseriesResponse } from '@/types/api'
import type { StatsFilters, TimeseriesParams } from '@/types/filters'

/**
 * Stats resource.
 * IMPORTANT: `summary` honors only configId + time range — the backend
 * ignores category/action here (verified live), so we don't send them.
 */
export const statsService = {
  getSummary(filters: StatsFilters = {}, signal?: AbortSignal): Promise<SummaryResponse> {
    const query = toQuery({
      configId: filters.configId,
      from: filters.from,
      to: filters.to,
    })
    return apiRequest<SummaryResponse>(`/v1/stats/summary${query}`, { signal })
  },

  getTimeseries(params: TimeseriesParams, signal?: AbortSignal): Promise<TimeseriesResponse> {
    const query = toQuery({
      configId: params.configId,
      from: params.from,
      to: params.to,
      interval: params.interval,
    })
    return apiRequest<TimeseriesResponse>(`/v1/stats/timeseries${query}`, { signal })
  },
}
