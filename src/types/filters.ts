import type { RuleCategory, RuleAction, Interval } from '@/types/domain'

/**
 * Request-side filter types shared by services, hooks, and the filter UI.
 *
 * The backend splits filter support by endpoint:
 *  - summary/timeseries honor only configId + time range.
 *  - samples honors the full set (adds category + action).
 * We model that split explicitly so the UI never offers a control the
 * target endpoint would silently ignore.
 */

/** Filters honored by summary & timeseries (Overview scope). */
export interface StatsFilters {
  configId?: number
  from?: string
  to?: string
}

/** Filters honored by samples (Explorer scope): stats + category/action. */
export interface SampleFilters extends StatsFilters {
  category?: RuleCategory
  action?: RuleAction
  /** Exact client IP to match. */
  clientIp?: string
  /** true = only repeat offenders, false = only first-time, undefined = all. */
  repeatOffender?: boolean
  limit?: number
  offset?: number
}

export interface TimeseriesParams extends StatsFilters {
  from: string
  to: string
  interval: Interval
}

export interface GenerateParams {
  count?: number
  seed?: number
  waveRatio?: number
}
