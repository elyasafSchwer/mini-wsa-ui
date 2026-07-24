import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { RuleCategory, RuleAction } from '@/types/domain'
import type { SampleFilters } from '@/types/filters'
import { CATEGORIES, ACTIONS } from '@/config/constants'

/**
 * Filters backed by URL search params, so every view is shareable,
 * bookmarkable, and survives refresh. This is intentionally a thin sync
 * layer over the URL rather than a global store.
 *
 * The full set (category/action included) applies to the Explorer. The
 * Overview reads only the stats-relevant subset via `statsFilters`.
 */

function parseNum(v: string | null): number | undefined {
  if (v === null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

function parseEnum<T extends string>(v: string | null, allowed: readonly T[]): T | undefined {
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<SampleFilters>(
    () => ({
      configId: parseNum(searchParams.get('configId')),
      from: searchParams.get('from') ?? undefined,
      to: searchParams.get('to') ?? undefined,
      category: parseEnum<RuleCategory>(searchParams.get('category'), CATEGORIES),
      action: parseEnum<RuleAction>(searchParams.get('action'), ACTIONS),
    }),
    [searchParams],
  )

  /** Subset honored by summary/timeseries (drops category/action). */
  const statsFilters = useMemo(
    () => ({ configId: filters.configId, from: filters.from, to: filters.to }),
    [filters.configId, filters.from, filters.to],
  )

  /** Patch one or more filters; undefined/empty clears the param. */
  const setFilter = useCallback(
    (patch: Partial<SampleFilters>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === null || value === '') next.delete(key)
            else next.set(key, String(value))
          }
          // Any filter change resets pagination.
          next.delete('offset')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  const activeCount = useMemo(
    () => Object.values(filters).filter((v) => v !== undefined).length,
    [filters],
  )

  return { filters, statsFilters, setFilter, clearFilters, activeCount }
}
