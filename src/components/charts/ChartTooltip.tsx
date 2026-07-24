import type { ReactNode } from 'react'

interface TooltipRow {
  label: string
  value: ReactNode
  color?: string
}

/** Shared themed tooltip body for Recharts custom tooltips. */
export function ChartTooltip({ title, rows }: { title?: string; rows: TooltipRow[] }) {
  return (
    <div className="rounded-lg border border-border-default bg-surface px-3 py-2 text-xs shadow-md">
      {title && <div className="mb-1 font-medium text-fg">{title}</div>}
      <div className="flex flex-col gap-0.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted">
              {r.color && (
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: r.color }}
                />
              )}
              {r.label}
            </span>
            <span className="font-medium text-fg">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
