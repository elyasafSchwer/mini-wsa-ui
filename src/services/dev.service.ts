import { apiRequest, toQuery } from '@/lib/apiClient'
import type { GenerateResponse, ClearResponse } from '@/types/api'
import type { GenerateParams } from '@/types/filters'

/**
 * Dev-only endpoints (POST /api/dev/*). Return 404 unless the backend runs
 * with the `dev` profile. Used by the in-app DevDataPanel.
 */
export const devService = {
  generate(params: GenerateParams = {}, signal?: AbortSignal): Promise<GenerateResponse> {
    const query = toQuery({
      count: params.count,
      seed: params.seed,
      waveRatio: params.waveRatio,
    })
    return apiRequest<GenerateResponse>(`/api/dev/generate${query}`, { method: 'POST', signal })
  },

  /** Delete every document from the security-events index. */
  clear(signal?: AbortSignal): Promise<ClearResponse> {
    return apiRequest<ClearResponse>('/api/dev/clear', { method: 'POST', signal })
  },

  /** Upload a JSON or CSV file and ingest its events (format auto-detected). */
  upload(file: File, signal?: AbortSignal): Promise<GenerateResponse> {
    const form = new FormData()
    form.append('file', file)
    return apiRequest<GenerateResponse>('/api/dev/upload', { method: 'POST', body: form, signal })
  },
}
