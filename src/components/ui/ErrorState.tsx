import { Button } from '@/components/ui/Button'

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-action-deny/15 text-action-deny">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className="text-sm font-medium text-fg">{title}</p>
      {message && <p className="max-w-sm text-xs text-muted">{message}</p>}
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
