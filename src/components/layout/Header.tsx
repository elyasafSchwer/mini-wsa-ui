import { usePollingControl } from '@/hooks/usePollingControl'
import { POLL_OPTIONS } from '@/config/constants'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/cn'

export function Header({ title }: { title: string }) {
  const { live, toggleLive, intervalMs, setIntervalMs } = usePollingControl()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-default bg-surface px-6">
      <h1 className="text-lg font-semibold text-fg">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Live status pill */}
        <span
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            live ? 'bg-sev-low/15 text-sev-low' : 'bg-surface-2 text-muted',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              live ? 'animate-pulse bg-sev-low' : 'bg-muted',
            )}
          />
          {live ? 'Live' : 'Paused'}
        </span>

        <Select
          aria-label="Refresh interval"
          value={String(intervalMs)}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          disabled={!live}
          className="h-8 text-xs"
          options={POLL_OPTIONS.map((o) => ({ label: `Every ${o.label}`, value: String(o.value) }))}
        />

        <Button size="sm" variant={live ? 'secondary' : 'primary'} onClick={toggleLive}>
          {live ? 'Pause' : 'Resume'}
        </Button>

        <ThemeToggle />
      </div>
    </header>
  )
}
