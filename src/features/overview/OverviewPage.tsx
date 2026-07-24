import { useFilters } from '@/hooks/useFilters'
import { useSummary } from '@/hooks/useSummary'
import { useTimeseries } from '@/hooks/useTimeseries'
import { useDefaultTimeRange } from '@/hooks/useDefaultTimeRange'
import { FilterBar } from '@/components/filters/FilterBar'
import { KpiGrid } from '@/components/kpi/KpiGrid'
import { ChartContainer } from '@/components/charts/ChartContainer'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { CategoryBarChart } from '@/components/charts/CategoryBarChart'
import { ActionDonutChart } from '@/components/charts/ActionDonutChart'
import { ThreatScoreGauge } from '@/components/charts/ThreatScoreGauge'
import { TopAttackersTable } from '@/components/tables/TopAttackersTable'
import { TopPathsTable } from '@/components/tables/TopPathsTable'
import { DevDataPanel } from '@/components/dev/DevDataPanel'

export function OverviewPage() {
  const { statsFilters } = useFilters()
  const summary = useSummary(statsFilters)

  const range = useDefaultTimeRange(statsFilters.from, statsFilters.to)
  const timeseries = useTimeseries({ ...range, configId: statsFilters.configId })

  const summaryEmpty = !summary.isLoading && (summary.data?.totalEvents ?? 0) === 0
  const tsBuckets = timeseries.data?.buckets ?? []
  const tsEmpty = !timeseries.isLoading && tsBuckets.every((b) => b.count === 0)

  return (
    <div className="space-y-6">
      {/* Overview honors only configId + time (summary ignores category/action) */}
      <FilterBar scope="overview" />

      <KpiGrid summary={summary.data} isLoading={summary.isLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Events Over Time"
            action={<span className="text-xs text-muted">interval {range.interval}</span>}
            isLoading={timeseries.isLoading}
            isError={timeseries.isError}
            error={timeseries.error}
            isEmpty={tsEmpty}
            onRetry={() => timeseries.refetch()}
            height={280}
          >
            <TimeSeriesChart data={tsBuckets} interval={range.interval} />
          </ChartContainer>
        </div>

        <ChartContainer
          title="Avg Threat Score"
          isLoading={summary.isLoading}
          isError={summary.isError}
          error={summary.error}
          isEmpty={summaryEmpty}
          onRetry={() => summary.refetch()}
          height={280}
        >
          <ThreatScoreGauge score={summary.data?.avgThreatScore ?? 0} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartContainer
          title="Events by Category"
          isLoading={summary.isLoading}
          isError={summary.isError}
          error={summary.error}
          isEmpty={summaryEmpty}
          onRetry={() => summary.refetch()}
        >
          <CategoryBarChart byCategory={summary.data?.byCategory ?? {}} />
        </ChartContainer>

        <ChartContainer
          title="Enforcement Actions"
          isLoading={summary.isLoading}
          isError={summary.isError}
          error={summary.error}
          isEmpty={summaryEmpty}
          onRetry={() => summary.refetch()}
        >
          <ActionDonutChart byAction={summary.data?.byAction ?? {}} />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopAttackersTable attackers={summary.data?.topAttackers} isLoading={summary.isLoading} />
        <TopPathsTable paths={summary.data?.topTargetedPaths} isLoading={summary.isLoading} />
      </div>

      <DevDataPanel />
    </div>
  )
}
