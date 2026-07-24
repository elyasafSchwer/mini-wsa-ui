import type { AttackerStat } from '@/types/api'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatNumber, formatScore } from '@/lib/format'

/** Small colored bar reflecting threat score 0–100. */
function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(score, 100))
  const color = pct >= 60 ? 'var(--color-sev-critical)' : pct >= 40 ? 'var(--color-sev-high)' : 'var(--color-sev-medium)'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="tabular-nums text-xs text-muted">{formatScore(score)}</span>
    </div>
  )
}

export function TopAttackersTable({
  attackers,
  isLoading,
}: {
  attackers?: AttackerStat[]
  isLoading: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Attackers</CardTitle>
        <span className="text-xs text-muted">by event count</span>
      </CardHeader>
      <CardBody className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : !attackers?.length ? (
          <EmptyState message="No attacker data." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Client IP</TH>
                <TH className="text-right">Events</TH>
                <TH>Avg Threat</TH>
              </TR>
            </THead>
            <TBody>
              {attackers.map((a) => (
                <TR key={a.clientIp}>
                  <TD className="font-mono text-xs">{a.clientIp}</TD>
                  <TD className="text-right tabular-nums">{formatNumber(a.count)}</TD>
                  <TD>
                    <ScoreBar score={a.avgThreatScore} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardBody>
    </Card>
  )
}
