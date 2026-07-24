import type { RuleCategory, RuleAction, RuleSeverity, Interval } from '@/types/domain'

/**
 * Static domain enums. These mirror the exact values present in the backend
 * (verified against the live `security-events` index), so they're safe to
 * hardcode for dropdowns, color maps, and chart ordering.
 */

export const CATEGORIES: readonly RuleCategory[] = [
  'DOS',
  'BOT',
  'DATA_LEAKAGE',
  'INJECTION',
  'XSS',
  'RATE_LIMIT',
  'PROTOCOL_VIOLATION',
]

export const ACTIONS: readonly RuleAction[] = ['MONITOR', 'ALERT', 'DENY']

export const SEVERITIES: readonly RuleSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export const INTERVALS: readonly Interval[] = ['1m', '5m', '1h']

/** Human-friendly labels for categories (enum values are SCREAMING_SNAKE). */
export const CATEGORY_LABELS: Record<RuleCategory, string> = {
  DOS: 'DoS',
  BOT: 'Bot',
  DATA_LEAKAGE: 'Data Leakage',
  INJECTION: 'Injection',
  XSS: 'XSS',
  RATE_LIMIT: 'Rate Limit',
  PROTOCOL_VIOLATION: 'Protocol Violation',
}

/** Tailwind-token colors keyed by action, for badges and the action donut. */
export const ACTION_COLORS: Record<RuleAction, string> = {
  MONITOR: 'var(--color-action-monitor)',
  ALERT: 'var(--color-action-alert)',
  DENY: 'var(--color-action-deny)',
}

/** Colors keyed by severity, for badges and threat visuals. */
export const SEVERITY_COLORS: Record<RuleSeverity, string> = {
  LOW: 'var(--color-sev-low)',
  MEDIUM: 'var(--color-sev-medium)',
  HIGH: 'var(--color-sev-high)',
  CRITICAL: 'var(--color-sev-critical)',
}

/** Distinct palette for category charts (order matches CATEGORIES). */
export const CATEGORY_PALETTE: Record<RuleCategory, string> = {
  DOS: '#ef4444',
  BOT: '#f59e0b',
  DATA_LEAKAGE: '#8b5cf6',
  INJECTION: '#ec4899',
  XSS: '#06b6d4',
  RATE_LIMIT: '#3b82f6',
  PROTOCOL_VIOLATION: '#10b981',
}

/** Selectable polling cadences shown in the header live controls. */
export const POLL_OPTIONS = [
  { label: '5s', value: 5_000 },
  { label: '10s', value: 10_000 },
  { label: '30s', value: 30_000 },
  { label: '1m', value: 60_000 },
] as const
