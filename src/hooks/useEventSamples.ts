import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { eventsService } from '@/services/events.service'
import { queryKeys } from '@/lib/queryKeys'
import type { SampleFilters } from '@/types/filters'

/**
 * Paginated event samples for the Explorer. Uses keepPreviousData so the
 * table doesn't flash empty while paging or changing filters.
 * Not polled by default — the Explorer is an investigative view.
 */
export function useEventSamples(filters: SampleFilters) {
  return useQuery({
    queryKey: queryKeys.samples(filters),
    queryFn: ({ signal }) => eventsService.getSamples(filters, signal),
    placeholderData: keepPreviousData,
  })
}
