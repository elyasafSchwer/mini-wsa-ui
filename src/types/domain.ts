/**
 * Domain enums, verified against the live backend `security-events` index.
 * Kept separate from api.ts so DTOs and pure domain vocabulary don't tangle.
 */

export type RuleCategory =
  | 'DOS'
  | 'BOT'
  | 'DATA_LEAKAGE'
  | 'INJECTION'
  | 'XSS'
  | 'RATE_LIMIT'
  | 'PROTOCOL_VIOLATION'

export type RuleAction = 'MONITOR' | 'ALERT' | 'DENY'

export type RuleSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type Interval = '1m' | '5m' | '1h'
