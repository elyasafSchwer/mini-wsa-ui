import type { RuleCategory, RuleAction, RuleSeverity } from '@/types/domain'
import {
  CATEGORY_LABELS,
  CATEGORY_PALETTE,
  ACTION_COLORS,
  SEVERITY_COLORS,
} from '@/config/constants'
import { cn } from '@/lib/cn'

/** Colored pill built from a hex/CSS color, using a tinted background. */
function Pill({ color, label, className }: { color: string; label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        className,
      )}
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
    >
      {label}
    </span>
  )
}

export function CategoryBadge({ category }: { category: RuleCategory }) {
  return <Pill color={CATEGORY_PALETTE[category]} label={CATEGORY_LABELS[category]} />
}

export function ActionBadge({ action }: { action: RuleAction }) {
  return <Pill color={ACTION_COLORS[action]} label={action} />
}

export function SeverityBadge({ severity }: { severity: RuleSeverity }) {
  return <Pill color={SEVERITY_COLORS[severity]} label={severity} />
}

/** Neutral generic badge for arbitrary text (e.g. HTTP method). */
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
