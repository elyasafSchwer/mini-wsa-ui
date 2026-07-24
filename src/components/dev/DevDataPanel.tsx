import { useState } from 'react'
import { useGenerateData } from '@/hooks/useGenerateData'
import { ApiError } from '@/lib/apiClient'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { formatNumber } from '@/lib/format'

/**
 * In-app wrapper for POST /api/dev/generate (dev profile only). Lets you seed
 * data and watch the dashboard react without curl. Handles the 404 that the
 * backend returns when not running the dev profile.
 */
export function DevDataPanel() {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(5000)
  const [waveRatio, setWaveRatio] = useState(0.3)
  const [seed, setSeed] = useState('')

  const generate = useGenerateData()

  const notDevProfile = generate.error instanceof ApiError && generate.error.status === 404

  const onGenerate = () => {
    generate.mutate({
      count,
      waveRatio,
      seed: seed ? Number(seed) : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <span className="rounded bg-sev-medium/15 px-1.5 py-0.5 text-[10px] font-semibold text-sev-medium uppercase">
              Dev
            </span>
            Data Generator
          </span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </CardHeader>

      {open && (
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted">Count</span>
              <Input
                type="number"
                min={1}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted">Wave ratio (0–1)</span>
              <Input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={waveRatio}
                onChange={(e) => setWaveRatio(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted">Seed (optional)</span>
              <Input
                type="number"
                placeholder="random"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={onGenerate} disabled={generate.isPending}>
              {generate.isPending && <Spinner />}
              {generate.isPending ? 'Generating…' : 'Generate & Ingest'}
            </Button>

            {generate.isSuccess && !generate.isPending && (
              <span className="text-xs text-sev-low">
                Ingested {formatNumber(generate.data.feed.accepted)} events
                {generate.data.feed.batchesFailed > 0 &&
                  ` · ${generate.data.feed.batchesFailed} batch(es) failed`}
              </span>
            )}

            {generate.isError && (
              <span className="text-xs text-action-deny">
                {notDevProfile
                  ? 'Backend is not running the "dev" profile — generator unavailable.'
                  : generate.error.message}
              </span>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}
