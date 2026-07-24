import { apiRequest, toQuery } from '@/lib/apiClient'
import type { SamplesResponse } from '@/types/api'
import type { SampleFilters } from '@/types/filters'

/**
 * Events resource. `samples` honors the full filter set (config, time,
 * category, action) plus pagination; results are newest-first.
 */
export const eventsService = {
  getSamples(filters: SampleFilters = {}, signal?: AbortSignal): Promise<SamplesResponse> {
    const query = toQuery({
      configId: filters.configId,
      from: filters.from,
      to: filters.to,
      category: filters.category,
      action: filters.action,
      limit: filters.limit,
      offset: filters.offset,
    })
    return apiRequest<SamplesResponse>(`/v1/events/samples${query}`, { signal })
  },
}
