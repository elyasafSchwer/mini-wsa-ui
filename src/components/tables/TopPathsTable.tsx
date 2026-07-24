import type { TargetedPathStat } from '@/types/api'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatNumber } from '@/lib/format'

export function TopPathsTable({
  paths,
  isLoading,
}: {
  paths?: TargetedPathStat[]
  isLoading: boolean
}) {
  const max = paths?.reduce((m, p) => Math.max(m, p.count), 0) ?? 0
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Targeted Paths</CardTitle>
        <span className="text-xs text-muted">by hits</span>
      </CardHeader>
      <CardBody className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : !paths?.length ? (
          <EmptyState message="No path data." />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Path</TH>
                <TH className="text-right">Hits</TH>
              </TR>
            </THead>
            <TBody>
              {paths.map((p) => (
                <TR key={p.path}>
                  <TD className="relative">
                    {/* Inline volume bar behind the path text */}
                    <div
                      className="absolute inset-y-1 left-0 rounded bg-accent/10"
                      style={{ width: max ? `${(p.count / max) * 100}%` : '0%' }}
                    />
                    <span className="relative font-mono text-xs">{p.path}</span>
                  </TD>
                  <TD className="text-right tabular-nums">{formatNumber(p.count)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardBody>
    </Card>
  )
}
