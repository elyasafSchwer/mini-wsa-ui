import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'

/** Compact integer with thousands separators: 10000 -> "10,000". */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

/** Abbreviated large numbers for tight spaces: 1347 -> "1.3K". */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

/** One-decimal for scores/percentages: 44.9 -> "44.9". */
export function formatScore(n: number): string {
  return n.toFixed(1)
}

/** Ratio (0..1) as a percent string: 0.325 -> "32.5%". */
export function formatPercent(ratio: number): string {
  return `${(ratio * 100).toFixed(1)}%`
}

/** Absolute timestamp for tables: "Jul 23, 23:22:15". */
export function formatTimestamp(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, HH:mm:ss')
  } catch {
    return iso
  }
}

/** Short axis/tick label from an ISO timestamp: "23:00" or "Jul 23". */
export function formatAxisTime(iso: string, withDate = false): string {
  try {
    return format(parseISO(iso), withDate ? 'MMM d HH:mm' : 'HH:mm')
  } catch {
    return iso
  }
}

/** Relative "time ago" for freshness indicators: "3m ago". */
export function formatRelative(iso: string): string {
  try {
    return `${formatDistanceToNowStrict(parseISO(iso))} ago`
  } catch {
    return iso
  }
}

/** ISO string for API params (UTC, no ms). */
export function toApiIso(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}
