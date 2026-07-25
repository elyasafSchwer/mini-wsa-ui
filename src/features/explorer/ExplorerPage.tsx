import { useSearchParams } from 'react-router-dom'
import { useFilters } from '@/hooks/useFilters'
import { useEventSamples } from '@/hooks/useEventSamples'
import { FilterBar } from '@/components/filters/FilterBar'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { EventSamplesTable } from '@/components/tables/EventSamplesTable'
import { Pagination } from '@/components/tables/Pagination'
import { ErrorState } from '@/components/ui/ErrorState'
import { formatNumber } from '@/lib/format'

const PAGE_SIZE = 25

export function ExplorerPage() {
  const { filters, setFilter } = useFilters()
  const [searchParams, setSearchParams] = useSearchParams()
  const offset = Number(searchParams.get('offset') ?? 0)

  const query = useEventSamples({ ...filters, limit: PAGE_SIZE, offset })

  const setOffset = (next: number) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev)
        if (next <= 0) p.delete('offset')
        else p.set('offset', String(next))
        return p
      },
      { replace: true },
    )
  }

  return (
    <div className="space-y-6">
      {/* Explorer honors the full filter set including category + action */}
      <FilterBar scope="explorer" />

      <Card>
        <CardHeader>
          <CardTitle>Event Samples</CardTitle>
          {query.data && (
            <span className="text-xs text-muted">
              {formatNumber(query.data.total)} matching events
            </span>
          )}
        </CardHeader>
        <CardBody className="pt-0">
          {query.isError ? (
            <ErrorState message={query.error.message} onRetry={() => query.refetch()} />
          ) : (
            <>
              <EventSamplesTable
                events={query.data?.items}
                isLoading={query.isLoading}
                onFilterIp={(ip) => setFilter({ clientIp: ip })}
              />
              {query.data && query.data.total > 0 && (
                <Pagination
                  offset={offset}
                  limit={PAGE_SIZE}
                  total={query.data.total}
                  onChange={setOffset}
                />
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
