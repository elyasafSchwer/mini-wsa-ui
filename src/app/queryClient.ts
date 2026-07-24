import { QueryClient } from '@tanstack/react-query'

/**
 * Shared QueryClient. Sensible defaults for a live analytics dashboard:
 * short staleTime, no refetch-on-focus storms, capped retries.
 * Per-query polling (refetchInterval) is set at the hook level.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
