import type { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'

interface ChartContainerProps {
  title: string
  action?: ReactNode
  isLoading?: boolean
  isError?: boolean
  isEmpty?: boolean
  error?: Error | null
  onRetry?: () => void
  height?: number
  children: ReactNode
}

/**
 * Wraps any chart with consistent title, loading/error/empty handling, and a
 * fixed height so ResponsiveContainer has a bounded parent.
 */
export function ChartContainer({
  title,
  action,
  isLoading,
  isError,
  isEmpty,
  error,
  onRetry,
  height = 260,
  children,
}: ChartContainerProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardBody>
        <div style={{ height }}>
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : isError ? (
            <ErrorState message={error?.message} onRetry={onRetry} />
          ) : isEmpty ? (
            <EmptyState message="No events match the current filters." />
          ) : (
            children
          )}
        </div>
      </CardBody>
    </Card>
  )
}
