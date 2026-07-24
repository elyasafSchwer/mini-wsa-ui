import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'
import type { SummaryResponse } from '@/types/api'
import type { RuleCategory } from '@/types/domain'
import { CATEGORY_LABELS, CATEGORY_PALETTE } from '@/config/constants'
import { formatCompact, formatNumber, formatScore } from '@/lib/format'
import { ChartTooltip } from '@/components/charts/ChartTooltip'

const AXIS_STYLE = { fontSize: 11, fill: 'var(--color-muted)' }

interface Row {
  category: RuleCategory
  label: string
  count: number
  avgThreatScore: number
}

function toRows(byCategory: SummaryResponse['byCategory']): Row[] {
  return (Object.entries(byCategory) as [RuleCategory, { count: number; avgThreatScore: number }][])
    .map(([category, stat]) => ({
      category,
      label: CATEGORY_LABELS[category],
      count: stat.count,
      avgThreatScore: stat.avgThreatScore,
    }))
    .sort((a, b) => b.count - a.count)
}

function CustomTooltip({ active, payload }: Partial<TooltipContentProps>) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload as Row
  return (
    <ChartTooltip
      title={row.label}
      rows={[
        { label: 'Events', value: formatNumber(row.count), color: CATEGORY_PALETTE[row.category] },
        { label: 'Avg threat', value: formatScore(row.avgThreatScore) },
      ]}
    />
  )
}

export function CategoryBarChart({ byCategory }: { byCategory: SummaryResponse['byCategory'] }) {
  const rows = toRows(byCategory)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_STYLE} axisLine={false} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis tickFormatter={(v: number) => formatCompact(v)} tick={AXIS_STYLE} axisLine={false} tickLine={false} width={44} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-2)' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {rows.map((r) => (
            <Cell key={r.category} fill={CATEGORY_PALETTE[r.category]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
