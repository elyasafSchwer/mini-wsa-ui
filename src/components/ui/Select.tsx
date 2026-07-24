import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  placeholder?: string
}

export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-9 rounded-lg border border-border-default bg-surface px-3 text-sm text-fg',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
