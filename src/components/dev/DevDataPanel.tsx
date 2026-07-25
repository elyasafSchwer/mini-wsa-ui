import { useRef, useState } from 'react'
import { useGenerateData, useClearData, useUploadData } from '@/hooks/useGenerateData'
import { ApiError } from '@/lib/apiClient'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { formatNumber } from '@/lib/format'

/** True when a dev endpoint 404s because the backend isn't on the dev profile. */
function isNotDevProfile(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

const NOT_DEV_MESSAGE = 'Backend is not running the "dev" profile — this action is unavailable.'

/** Feedback line summarizing a generate/upload result (same response shape). */
function IngestResult({ accepted, failed }: { accepted: number; failed: number }) {
  return (
    <span className="text-xs text-sev-low">
      Ingested {formatNumber(accepted)} events
      {failed > 0 && ` · ${failed} batch(es) failed`}
    </span>
  )
}

/**
 * In-app wrapper for the dev-only endpoints (dev profile only):
 *  - POST /api/dev/generate — synthesize + ingest attack data
 *  - POST /api/dev/upload   — ingest a JSON/CSV file
 *  - POST /api/dev/clear    — delete all events (guarded with a confirm step)
 *
 * All actions gracefully report the 404 returned when the backend isn't on
 * the dev profile.
 */
export function DevDataPanel() {
  const [open, setOpen] = useState(false)

  // Generate state
  const [count, setCount] = useState(5000)
  const [waveRatio, setWaveRatio] = useState(0.3)
  const [seed, setSeed] = useState('')

  // Clear confirm state (two-click guard)
  const [confirmClear, setConfirmClear] = useState(false)

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const generate = useGenerateData()
  const clear = useClearData()
  const upload = useUploadData()

  const onGenerate = () => {
    generate.mutate({ count, waveRatio, seed: seed ? Number(seed) : undefined })
  }

  const onClear = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    setConfirmClear(false)
    clear.mutate()
  }

  const onUpload = () => {
    if (selectedFile) upload.mutate(selectedFile)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <span className="rounded bg-sev-medium/15 px-1.5 py-0.5 text-[10px] font-semibold text-sev-medium uppercase">
              Dev
            </span>
            Data Tools
          </span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </CardHeader>

      {open && (
        <CardBody className="space-y-6">
          {/* ---------------- Generate ---------------- */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wide text-muted uppercase">Generate</h4>
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
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={onGenerate} disabled={generate.isPending}>
                {generate.isPending && <Spinner />}
                {generate.isPending ? 'Generating…' : 'Generate & Ingest'}
              </Button>
              {generate.isSuccess && !generate.isPending && (
                <IngestResult
                  accepted={generate.data.feed.accepted}
                  failed={generate.data.feed.batchesFailed}
                />
              )}
              {generate.isError && (
                <span className="text-xs text-action-deny">
                  {isNotDevProfile(generate.error) ? NOT_DEV_MESSAGE : generate.error.message}
                </span>
              )}
            </div>
          </section>

          <div className="h-px bg-border-default" />

          {/* ---------------- Upload ---------------- */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wide text-muted uppercase">
              Upload file
            </h4>
            <p className="text-xs text-muted">
              Ingest a <code className="font-mono">.json</code> or{' '}
              <code className="font-mono">.csv</code> file. Format is auto-detected from the
              extension.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,application/json,text/csv"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Choose file
              </Button>
              <span className="text-xs text-muted">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </span>
              <Button
                variant="primary"
                onClick={onUpload}
                disabled={!selectedFile || upload.isPending}
              >
                {upload.isPending && <Spinner />}
                {upload.isPending ? 'Uploading…' : 'Upload & Ingest'}
              </Button>
              {upload.isSuccess && !upload.isPending && (
                <IngestResult
                  accepted={upload.data.feed.accepted}
                  failed={upload.data.feed.batchesFailed}
                />
              )}
              {upload.isError && (
                <span className="text-xs text-action-deny">
                  {isNotDevProfile(upload.error) ? NOT_DEV_MESSAGE : upload.error.message}
                </span>
              )}
            </div>
          </section>

          <div className="h-px bg-border-default" />

          {/* ---------------- Danger zone: clear ---------------- */}
          <section className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wide text-action-deny uppercase">
              Danger zone
            </h4>
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-action-deny/30 bg-action-deny/5 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">Clear all events</p>
                <p className="text-xs text-muted">
                  Permanently deletes every document from the <code className="font-mono">security-events</code>{' '}
                  index. This cannot be undone.
                </p>
              </div>
              {confirmClear && (
                <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
              )}
              <Button variant="danger" onClick={onClear} disabled={clear.isPending}>
                {clear.isPending && <Spinner />}
                {clear.isPending
                  ? 'Clearing…'
                  : confirmClear
                    ? 'Click again to confirm'
                    : 'Clear index'}
              </Button>
            </div>
            {clear.isSuccess && !clear.isPending && (
              <span className="text-xs text-sev-low">
                Deleted {formatNumber(clear.data.deleted)} events.
              </span>
            )}
            {clear.isError && (
              <span className="text-xs text-action-deny">
                {isNotDevProfile(clear.error) ? NOT_DEV_MESSAGE : clear.error.message}
              </span>
            )}
          </section>
        </CardBody>
      )}
    </Card>
  )
}
