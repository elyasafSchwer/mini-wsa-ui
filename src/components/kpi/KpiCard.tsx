import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

interface KpiCardProps {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  accent?: string
  isLoading?: boolean
}

export function KpiCard({ label, value, hint, icon, accent, isLoading }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-1 truncate text-2xl font-semibold text-fg" style={accent ? { color: accent } : undefined}>
              {value}
            </p>
          )}
          {hint && !isLoading && <p className="mt-1 text-xs text-muted">{hint}</p>}
        </div>
        {icon && (
          <div
            className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2')}
            style={accent ? { color: accent } : undefined}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
