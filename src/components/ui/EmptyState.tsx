import type { ReactNode } from 'react'

export function EmptyState({
  title = 'No data',
  message,
  icon,
}: {
  title?: string
  message?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      {icon && <div className="text-muted/50">{icon}</div>}
      <p className="text-sm font-medium text-fg">{title}</p>
      {message && <p className="max-w-xs text-xs text-muted">{message}</p>}
    </div>
  )
}
