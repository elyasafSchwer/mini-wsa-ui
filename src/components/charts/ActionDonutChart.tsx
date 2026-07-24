import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, type TooltipContentProps } from 'recharts'
import type { SummaryResponse } from '@/types/api'
import type { RuleAction } from '@/types/domain'
import { ACTION_COLORS, ACTIONS } from '@/config/constants'
import { formatNumber, formatPercent } from '@/lib/format'
import { ChartTooltip } from '@/components/charts/ChartTooltip'

interface Slice {
  action: RuleAction
  count: number
  total: number
}

function CustomTooltip({ active, payload }: Partial<TooltipContentProps>) {
  if (!active || !payload?.length) return null
  const slice = payload[0].payload as Slice
  return (
    <ChartTooltip
      title={slice.action}
      rows={[
        { label: 'Events', value: formatNumber(slice.count), color: ACTION_COLORS[slice.action] },
        { label: 'Share', value: slice.total ? formatPercent(slice.count / slice.total) : '—' },
      ]}
    />
  )
}

export function ActionDonutChart({ byAction }: { byAction: SummaryResponse['byAction'] }) {
  const raw = ACTIONS.map((action) => ({ action, count: byAction[action] ?? 0 })).filter(
    (s) => s.count > 0,
  )
  const total = raw.reduce((sum, s) => sum + s.count, 0)
  const slices: Slice[] = raw.map((s) => ({ ...s, total }))

  return (
    <div className="flex h-full items-center gap-4">
      <ResponsiveContainer width="60%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="count"
            nameKey="action"
            innerRadius="58%"
            outerRadius="85%"
            paddingAngle={2}
            stroke="none"
          >
            {slices.map((s) => (
              <Cell key={s.action} fill={ACTION_COLORS[s.action]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend with values */}
      <ul className="flex flex-1 flex-col gap-2">
        {slices.map((s) => (
          <li key={s.action} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACTION_COLORS[s.action] }} />
              {s.action}
            </span>
            <span className="font-medium text-fg">
              {formatNumber(s.count)}
              <span className="ml-1 text-xs text-muted">
                {total ? formatPercent(s.count / total) : ''}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
