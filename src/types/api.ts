import type { RuleCategory, RuleAction, RuleSeverity, Interval } from '@/types/domain'

/**
 * Backend DTOs — mirror the exact shapes returned by the live API
 * (verified against localhost:8080 on 2026-07-24).
 */

/** Inclusive time bounds echoed back by stats endpoints. */
export interface TimeRange {
  from: string | null
  to: string | null
}

/* ------------------------------------------------------------------ */
/* GET /v1/stats/summary                                              */
/* NOTE: honors only `configId`, `from`, `to`. It IGNORES category /  */
/* action filters (confirmed: identical output with ?category=...).   */
/* ------------------------------------------------------------------ */

export interface CategoryStat {
  count: number
  avgThreatScore: number
}

export interface AttackerStat {
  clientIp: string
  count: number
  avgThreatScore: number
}

export interface TargetedPathStat {
  path: string
  count: number
}

export interface SummaryResponse {
  configId: number | null
  timeRange: TimeRange
  totalEvents: number
  byCategory: Partial<Record<RuleCategory, CategoryStat>>
  byAction: Partial<Record<RuleAction, number>>
  topAttackers: AttackerStat[]
  topTargetedPaths: TargetedPathStat[]
  avgThreatScore: number
}

/* ------------------------------------------------------------------ */
/* GET /v1/stats/timeseries — from/to required, interval 1m|5m|1h.    */
/* Buckets are zero-filled across the whole range.                    */
/* ------------------------------------------------------------------ */

export interface TimeseriesBucket {
  timestamp: string
  count: number
}

export interface TimeseriesResponse {
  configId: number | null
  timeRange: TimeRange
  interval: Interval
  buckets: TimeseriesBucket[]
}

/* ------------------------------------------------------------------ */
/* GET /v1/events/samples — paginated, newest-first. Honors the FULL  */
/* filter set including category & action.                            */
/* ------------------------------------------------------------------ */

export interface EventSample {
  eventId: string
  timestamp: string
  configId: number
  policyId?: string
  clientIp: string
  hostname?: string
  path: string
  method: string
  statusCode: number
  ruleCategory: RuleCategory
  ruleSeverity: RuleSeverity
  ruleAction: RuleAction
  attackType: string
  threatScore: number
  repeatOffender: boolean
  geoCountry?: string
  geoCity?: string
  receivedAt: string
}

export interface SamplesResponse {
  items: EventSample[]
  total: number
  limit: number
  offset: number
}

/* ------------------------------------------------------------------ */
/* POST /api/dev/generate (dev profile only)                          */
/* ------------------------------------------------------------------ */

export interface GenerateResponse {
  generated: number
  feed: {
    totalEvents: number
    batchesSent: number
    batchesFailed: number
    accepted: number
  }
}

/** POST /api/dev/clear (dev only) — deletes all events from the index. */
export interface ClearResponse {
  deleted: number
}

/** Normalized error shape the API returns as `{ message }` on 4xx. */
export interface ApiErrorBody {
  message?: string
}
