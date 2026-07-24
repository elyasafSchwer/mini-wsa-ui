import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-9 rounded-lg border border-border-default bg-surface px-3 text-sm text-fg',
        'placeholder:text-muted/60',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
      {...props}
    />
  )
}
