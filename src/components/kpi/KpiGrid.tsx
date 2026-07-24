import type { SummaryResponse } from '@/types/api'
import { KpiCard } from '@/components/kpi/KpiCard'
import { formatNumber, formatPercent, formatScore } from '@/lib/format'

const icons = {
  events: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  threat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  deny: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
    </svg>
  ),
  attackers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
}

/**
 * Row of headline metrics derived from the summary response.
 * "Deny rate" and "unique top attackers" are computed client-side from the
 * summary payload — the API doesn't return them directly.
 */
export function KpiGrid({ summary, isLoading }: { summary?: SummaryResponse; isLoading: boolean }) {
  const total = summary?.totalEvents ?? 0
  const denyCount = summary?.byAction?.DENY ?? 0
  const denyRate = total ? denyCount / total : 0
  const topAttackerCount = summary?.topAttackers?.length ?? 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total Events"
        value={formatNumber(total)}
        icon={icons.events}
        accent="var(--color-accent)"
        isLoading={isLoading}
      />
      <KpiCard
        label="Avg Threat Score"
        value={formatScore(summary?.avgThreatScore ?? 0)}
        hint="0–100 scale"
        icon={icons.threat}
        accent="var(--color-sev-high)"
        isLoading={isLoading}
      />
      <KpiCard
        label="Deny Rate"
        value={formatPercent(denyRate)}
        hint={`${formatNumber(denyCount)} denied`}
        icon={icons.deny}
        accent="var(--color-action-deny)"
        isLoading={isLoading}
      />
      <KpiCard
        label="Top Attackers"
        value={formatNumber(topAttackerCount)}
        hint="high-volume source IPs"
        icon={icons.attackers}
        accent="var(--color-sev-critical)"
        isLoading={isLoading}
      />
    </div>
  )
}
