import { Button } from '@/components/ui/Button'
import { formatNumber } from '@/lib/format'

interface PaginationProps {
  offset: number
  limit: number
  total: number
  onChange: (offset: number) => void
}

export function Pagination({ offset, limit, total, onChange }: PaginationProps) {
  const start = total === 0 ? 0 : offset + 1
  const end = Math.min(offset + limit, total)
  const canPrev = offset > 0
  const canNext = end < total

  return (
    <div className="flex items-center justify-between gap-4 pt-3">
      <p className="text-xs text-muted">
        {formatNumber(start)}–{formatNumber(end)} of {formatNumber(total)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={!canPrev}
          onClick={() => onChange(Math.max(0, offset - limit))}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={!canNext}
          onClick={() => onChange(offset + limit)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
