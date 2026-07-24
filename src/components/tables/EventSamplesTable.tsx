import type { EventSample } from '@/types/api'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { CategoryBadge, ActionBadge, SeverityBadge, Badge } from '@/components/ui/Badge'
import { formatTimestamp } from '@/lib/format'
import { cn } from '@/lib/cn'

/** Color the HTTP status by class (2xx green, 4xx amber, 5xx red). */
function statusColor(code: number): string {
  if (code >= 500) return 'text-action-deny'
  if (code >= 400) return 'text-sev-medium'
  return 'text-sev-low'
}

const COLS = 9

export function EventSamplesTable({
  events,
  isLoading,
}: {
  events?: EventSample[]
  isLoading: boolean
}) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Time</TH>
          <TH>Client IP</TH>
          <TH>Method</TH>
          <TH>Path</TH>
          <TH>Status</TH>
          <TH>Category</TH>
          <TH>Severity</TH>
          <TH>Action</TH>
          <TH className="text-right">Threat</TH>
        </TR>
      </THead>
      <TBody>
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <TR key={i}>
              <TD colSpan={COLS}>
                <Skeleton className="h-6 w-full" />
              </TD>
            </TR>
          ))
        ) : !events?.length ? (
          <TR>
            <TD colSpan={COLS}>
              <EmptyState title="No events" message="Try widening or clearing your filters." />
            </TD>
          </TR>
        ) : (
          events.map((e) => (
            <TR key={e.eventId} className="hover:bg-surface-2/50">
              <TD className="whitespace-nowrap text-xs text-muted">{formatTimestamp(e.timestamp)}</TD>
              <TD className="font-mono text-xs">
                <span className="flex items-center gap-1.5">
                  {e.clientIp}
                  {e.repeatOffender && (
                    <span
                      title="Repeat offender"
                      className="inline-block h-1.5 w-1.5 rounded-full bg-action-deny"
                    />
                  )}
                </span>
                {e.geoCountry && <span className="ml-0 text-[10px] text-muted">{e.geoCountry}</span>}
              </TD>
              <TD>
                <Badge>{e.method}</Badge>
              </TD>
              <TD className="max-w-[220px] truncate font-mono text-xs" title={e.path}>
                {e.path}
              </TD>
              <TD className={cn('tabular-nums font-medium', statusColor(e.statusCode))}>
                {e.statusCode}
              </TD>
              <TD>
                <CategoryBadge category={e.ruleCategory} />
              </TD>
              <TD>
                <SeverityBadge severity={e.ruleSeverity} />
              </TD>
              <TD>
                <ActionBadge action={e.ruleAction} />
              </TD>
              <TD className="text-right font-semibold tabular-nums">{e.threatScore}</TD>
            </TR>
          ))
        )}
      </TBody>
    </Table>
  )
}
