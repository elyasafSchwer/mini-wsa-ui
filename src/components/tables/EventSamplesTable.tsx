import type { EventSample } from '@/types/api'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  CategoryBadge,
  ActionBadge,
  SeverityBadge,
  Badge,
  RepeatOffenderBadge,
} from '@/components/ui/Badge'
import { formatTimestamp } from '@/lib/format'
import { cn } from '@/lib/cn'

/** Color the HTTP status by class (2xx green, 4xx amber, 5xx red). */
function statusColor(code: number): string {
  if (code >= 500) return 'text-action-deny'
  if (code >= 400) return 'text-sev-medium'
  return 'text-sev-low'
}

const COLS = 10

export function EventSamplesTable({
  events,
  isLoading,
  onFilterIp,
}: {
  events?: EventSample[]
  isLoading: boolean
  /** Optional: clicking a client IP filters the table by it. */
  onFilterIp?: (ip: string) => void
}) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Time</TH>
          <TH>Client IP</TH>
          <TH>Repeat</TH>
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
                {onFilterIp ? (
                  <button
                    type="button"
                    onClick={() => onFilterIp(e.clientIp)}
                    className="text-fg underline-offset-2 hover:text-accent hover:underline"
                    title={`Filter by ${e.clientIp}`}
                  >
                    {e.clientIp}
                  </button>
                ) : (
                  e.clientIp
                )}
                {e.geoCountry && <span className="ml-1.5 text-[10px] text-muted">{e.geoCountry}</span>}
              </TD>
              <TD>
                <RepeatOffenderBadge value={e.repeatOffender} />
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
