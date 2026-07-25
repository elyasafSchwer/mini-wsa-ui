import { useMutation, useQueryClient } from '@tanstack/react-query'
import { devService } from '@/services/dev.service'
import { queryKeys } from '@/lib/queryKeys'
import type { GenerateParams } from '@/types/filters'
import type { GenerateResponse, ClearResponse } from '@/types/api'

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

/**
 * Clear-index mutation. Deletes all events, then invalidates every WSA query
 * so the dashboard reflects the now-empty index.
 */
export function useClearData() {
  const qc = useQueryClient()
  return useMutation<ClearResponse, Error, void>({
    mutationFn: () => devService.clear(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.all })
    },
  })
}

/**
 * File-upload mutation (JSON/CSV). On success, invalidates every WSA query so
 * the dashboard reflects the newly ingested events.
 */
export function useUploadData() {
  const qc = useQueryClient()
  return useMutation<GenerateResponse, Error, File>({
    mutationFn: (file) => devService.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.all })
    },
  })
}
