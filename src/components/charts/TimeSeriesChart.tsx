import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'
import type { TimeseriesBucket } from '@/types/api'
import type { Interval } from '@/types/domain'
import { formatAxisTime, formatCompact, formatNumber, formatTimestamp } from '@/lib/format'
import { ChartTooltip } from '@/components/charts/ChartTooltip'

const AXIS_STYLE = { fontSize: 11, fill: 'var(--color-muted)' }

function CustomTooltip({ active, payload }: Partial<TooltipContentProps>) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload as TimeseriesBucket
  return (
    <ChartTooltip
      title={formatTimestamp(point.timestamp)}
      rows={[{ label: 'Events', value: formatNumber(point.count), color: 'var(--color-accent)' }]}
    />
  )
}

export function TimeSeriesChart({
  data,
  interval,
}: {
  data: TimeseriesBucket[]
  interval: Interval
}) {
  const withDate = interval === '1h'
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="tsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v: string) => formatAxisTime(v, withDate)}
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
          minTickGap={40}
        />
        <YAxis
          tickFormatter={(v: number) => formatCompact(v)}
          tick={AXIS_STYLE}
          axisLine={false}
          tickLine={false}
          width={44}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--color-accent)"
          strokeWidth={2}
          fill="url(#tsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
