import { useFilters } from '@/hooks/useFilters'
import type { RuleCategory, RuleAction } from '@/types/domain'
import { CATEGORIES, ACTIONS, CATEGORY_LABELS } from '@/config/constants'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

/**
 * Filter controls. The `scope` prop reflects the backend contract:
 *  - 'overview': summary/timeseries honor only configId + time.
 *  - 'explorer': samples additionally honor category + action.
 * We never render a control the target endpoint would silently ignore.
 */
export function FilterBar({ scope }: { scope: 'overview' | 'explorer' }) {
  const { filters, setFilter, clearFilters, activeCount } = useFilters()

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border-default bg-surface p-4">
      <Field label="Config ID">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="All configs"
          value={filters.configId ?? ''}
          onChange={(e) => setFilter({ configId: e.target.value ? Number(e.target.value) : undefined })}
          className="w-36"
        />
      </Field>

      <Field label="From">
        <Input
          type="datetime-local"
          value={toLocalInput(filters.from)}
          onChange={(e) => setFilter({ from: fromLocalInput(e.target.value) })}
          className="w-52"
        />
      </Field>

      <Field label="To">
        <Input
          type="datetime-local"
          value={toLocalInput(filters.to)}
          onChange={(e) => setFilter({ to: fromLocalInput(e.target.value) })}
          className="w-52"
        />
      </Field>

      {scope === 'explorer' && (
        <>
          <Field label="Category">
            <Select
              placeholder="All categories"
              value={filters.category ?? ''}
              onChange={(e) => setFilter({ category: (e.target.value || undefined) as RuleCategory | undefined })}
              options={CATEGORIES.map((c) => ({ label: CATEGORY_LABELS[c], value: c }))}
              className="w-44"
            />
          </Field>

          <Field label="Action">
            <Select
              placeholder="All actions"
              value={filters.action ?? ''}
              onChange={(e) => setFilter({ action: (e.target.value || undefined) as RuleAction | undefined })}
              options={ACTIONS.map((a) => ({ label: a, value: a }))}
              className="w-36"
            />
          </Field>

          <Field label="Client IP">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 3.89.35.54"
              value={filters.clientIp ?? ''}
              onChange={(e) => setFilter({ clientIp: e.target.value.trim() || undefined })}
              className="w-44"
            />
          </Field>

          <Field label="Repeat Offender">
            <Select
              value={filters.repeatOffender === undefined ? '' : String(filters.repeatOffender)}
              onChange={(e) =>
                setFilter({
                  repeatOffender: e.target.value === '' ? undefined : e.target.value === 'true',
                })
              }
              options={[
                { label: 'All', value: '' },
                { label: 'Repeat offenders', value: 'true' },
                { label: 'First-time only', value: 'false' },
              ]}
              className="w-40"
            />
          </Field>
        </>
      )}

      <div className="ml-auto flex items-end">
        <Button variant="ghost" size="sm" onClick={clearFilters} disabled={activeCount === 0}>
          Clear{activeCount > 0 ? ` (${activeCount})` : ''}
        </Button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  )
}

/** ISO (UTC) -> value for <input type="datetime-local"> (local time). */
function toLocalInput(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** datetime-local value (local time) -> ISO (UTC) for the API. */
function fromLocalInput(value: string): string | undefined {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().replace(/\.\d{3}Z$/, 'Z')
}
