import type { StatsFilters, SampleFilters, TimeseriesParams } from '@/types/filters'

/**
 * Centralized, typed query-key factory. Using one source of truth for keys
 * prevents cache-invalidation typos and makes bulk invalidation trivial
 * (e.g. invalidate `queryKeys.all` after generating dev data).
 */
export const queryKeys = {
  all: ['wsa'] as const,

  summary: (filters: StatsFilters) => [...queryKeys.all, 'summary', filters] as const,

  timeseries: (params: TimeseriesParams) => [...queryKeys.all, 'timeseries', params] as const,

  samples: (filters: SampleFilters) => [...queryKeys.all, 'samples', filters] as const,
}
