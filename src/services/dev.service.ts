import { apiRequest, toQuery } from '@/lib/apiClient'
import type { GenerateResponse } from '@/types/api'
import type { GenerateParams } from '@/types/filters'

/**
 * Dev-only data generator (POST /api/dev/generate). Returns 404 unless the
 * backend runs with the `dev` profile. Used by the in-app DevDataPanel.
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
}
