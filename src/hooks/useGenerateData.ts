import { useMutation, useQueryClient } from '@tanstack/react-query'
import { devService } from '@/services/dev.service'
import { queryKeys } from '@/lib/queryKeys'
import type { GenerateParams } from '@/types/filters'
import type { GenerateResponse } from '@/types/api'

/**
 * Dev-data generator mutation. On success, invalidates every WSA query so
 * the dashboard immediately reflects the newly ingested events.
 */
export function useGenerateData() {
  const qc = useQueryClient()
  return useMutation<GenerateResponse, Error, GenerateParams>({
    mutationFn: (params) => devService.generate(params),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.all })
    },
  })
}
