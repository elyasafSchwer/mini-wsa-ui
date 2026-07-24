import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { formatScore } from '@/lib/format'

/**
 * Radial gauge for the average threat score (0–100). Color shifts with
 * severity bands so a high score reads as red at a glance.
 */
function scoreColor(score: number): string {
  if (score >= 75) return 'var(--color-sev-critical)'
  if (score >= 50) return 'var(--color-sev-high)'
  if (score >= 25) return 'var(--color-sev-medium)'
  return 'var(--color-sev-low)'
}

export function ThreatScoreGauge({ score, max = 100 }: { score: number; max?: number }) {
  const clamped = Math.max(0, Math.min(score, max))
  const color = scoreColor(clamped)
  const data = [
    { name: 'score', value: clamped, fill: color },
    { name: 'rest', value: max - clamped, fill: 'var(--color-surface-2)' },
  ]

  return (
    <div className="relative h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={210}
            endAngle={-30}
            innerRadius="66%"
            outerRadius="90%"
            stroke="none"
            cornerRadius={6}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-fg" style={{ color }}>
          {formatScore(clamped)}
        </span>
        <span className="text-xs text-muted">avg threat / {max}</span>
      </div>
    </div>
  )
}
