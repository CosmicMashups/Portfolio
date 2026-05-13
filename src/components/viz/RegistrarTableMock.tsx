import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChartShell } from '@/components/viz/ChartShell'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { cn } from '@/components/ui/cn'

type RequestFilter = 'ALL' | 'PROCESSING' | 'READY'
type RowStatus = 'PROCESSING' | 'INVALID' | 'READY' | 'CLAIM'

type Row = {
  id: string
  req: number
  doc: string
  requestor: string
  dateFiled: string
  status: RowStatus
  /** INVALID rows do not participate in the demo lifecycle. */
  locked?: boolean
}

const INITIAL_ROWS: Row[] = [
  {
    id: 'r1',
    req: 42,
    doc: 'Form 137',
    requestor: 'Santos, Maria C.',
    dateFiled: '2018-08-14',
    status: 'PROCESSING',
  },
  {
    id: 'r2',
    req: 43,
    doc: 'Form 138',
    requestor: 'Reyes, Andrei L.',
    dateFiled: '2018-11-02',
    status: 'READY',
  },
  {
    id: 'r3',
    req: 44,
    doc: 'Good Moral Certificate',
    requestor: 'Dela Cruz, Juan P.',
    dateFiled: '2019-01-09',
    status: 'CLAIM',
  },
  {
    id: 'r4',
    req: 45,
    doc: 'ESC Certification',
    requestor: 'Bautista, Liza M.',
    dateFiled: '2019-02-18',
    status: 'PROCESSING',
  },
  {
    id: 'r5',
    req: 46,
    doc: 'Enrollment Certificate',
    requestor: 'Garcia, Paolo R.',
    dateFiled: '2019-03-04',
    status: 'INVALID',
    locked: true,
  },
  {
    id: 'r6',
    req: 47,
    doc: 'Graduation Certificate',
    requestor: 'Torres, Ana Sofia D.',
    dateFiled: '2019-03-21',
    status: 'READY',
  },
  {
    id: 'r7',
    req: 48,
    doc: 'ID Replacement',
    requestor: 'Mendoza, Carlo T.',
    dateFiled: '2019-04-02',
    status: 'PROCESSING',
  },
  {
    id: 'r8',
    req: 49,
    doc: 'Form 137',
    requestor: 'Villanueva, Katrina O.',
    dateFiled: '2019-04-15',
    status: 'CLAIM',
  },
]

const LIFECYCLE_STEPS = ['SUBMIT REQUEST', 'PROCESSING', 'READY', 'CLAIM'] as const

function nextDemoStatus(s: RowStatus): RowStatus {
  if (s === 'PROCESSING') return 'READY'
  if (s === 'READY') return 'CLAIM'
  return 'PROCESSING'
}

function statusChipClass(status: RowStatus): string {
  switch (status) {
    case 'PROCESSING':
      return 'border-[color:color-mix(in_oklab,var(--color-warning)_45%,transparent)] bg-[color:color-mix(in_oklab,var(--color-warning)_18%,var(--global-surface))] text-[var(--color-warning)]'
    case 'INVALID':
      return 'border-[color:color-mix(in_oklab,var(--color-error)_45%,transparent)] bg-[color:color-mix(in_oklab,var(--color-error)_15%,var(--global-surface))] text-[var(--color-error)]'
    case 'READY':
      return 'border-[color:color-mix(in_oklab,var(--accent-primary)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--accent-primary)_14%,var(--global-surface))] text-[var(--accent-primary)]'
    case 'CLAIM':
      return 'border-[color:color-mix(in_oklab,var(--accent-secondary)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--accent-secondary)_14%,var(--global-surface))] text-[var(--accent-secondary)]'
    default:
      return ''
  }
}

export function RegistrarTableMock() {
  const reduce = usePrefersReducedMotion()
  const [filter, setFilter] = useState<RequestFilter>('ALL')
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS)
  const [lifecycleIdx, setLifecycleIdx] = useState(0)

  const visibleRows = useMemo(() => {
    if (filter === 'ALL') return rows
    if (filter === 'PROCESSING') return rows.filter((r) => r.status === 'PROCESSING')
    return rows.filter((r) => r.status === 'READY')
  }, [filter, rows])

  const bumpStatus = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id || r.locked) return r
        return { ...r, status: nextDemoStatus(r.status) }
      }),
    )
  }, [])

  useEffect(() => {
    if (reduce) return
    const t = window.setInterval(() => {
      setLifecycleIdx((i) => (i + 1) % LIFECYCLE_STEPS.length)
    }, 2000)
    return () => window.clearInterval(t)
  }, [reduce])

  const motionInstant = reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }
  const rowInitial = reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }
  const rowAnimate = { opacity: 1, x: 0 }

  const activeLifecycleIndex = reduce ? LIFECYCLE_STEPS.length - 1 : lifecycleIdx

  return (
    <ChartShell
      title="Live admin queue (simulated)"
      description="Modeled after the registrar request.php dashboard — filters, status chips, and lifecycle transitions for portfolio demonstration only."
      contentClassName="h-auto min-h-[28rem] w-full min-w-0 text-[11px] md:min-h-[30rem]"
    >
      <div className="flex h-full min-h-0 flex-col gap-4 md:flex-row md:gap-5">
        {/* Request queue */}
        <div className="flex min-h-0 min-w-0 flex-[1.5] flex-col rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--surface-tint)_8%,var(--global-surface))]">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[var(--global-border)] px-3 py-2.5 sm:px-4">
            <div className="min-w-0">
              <p className="font-[var(--font-mono)] text-[10px] font-semibold uppercase tracking-wide text-[var(--global-text)] sm:text-[11px]">
                IIST HS REGISTRAR // REQUEST QUEUE
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  className={cn(
                    'relative inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--accent-primary)]',
                    !reduce && 'animate-pulse',
                  )}
                  aria-hidden
                />
                <span className="font-[var(--font-mono)] text-[10px] font-medium uppercase text-[var(--accent-primary)]">
                  Live demo
                </span>
              </div>
              <p className="mt-1 max-w-[20rem] text-[9px] leading-snug text-[var(--global-text-muted)]">
                Simulated data for portfolio demonstration
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 border-b border-[var(--global-border)] px-3 py-2 sm:px-4">
            {(['ALL', 'PROCESSING', 'READY'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  'rounded-full border px-2.5 py-1 font-[var(--font-mono)] text-[9px] font-medium uppercase tracking-wide transition-colors',
                  filter === key
                    ? 'border-[var(--accent-primary)] bg-[color:color-mix(in_oklab,var(--accent-primary)_12%,var(--global-surface))] text-[var(--global-text)]'
                    : 'border-[var(--global-border)] text-[var(--global-text-muted)] hover:border-[color:color-mix(in_oklab,var(--accent-primary)_35%,transparent)] hover:text-[var(--global-text)]',
                )}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto px-1 pb-2 sm:px-2">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--global-border)] text-[9px] uppercase text-[var(--global-text-muted)] sm:text-[10px]">
                  <th className="px-2 py-2 font-medium">Req #</th>
                  <th className="px-2 py-2 font-medium">Document type</th>
                  <th className="px-2 py-2 font-medium">Requestor</th>
                  <th className="px-2 py-2 font-medium">Date filed</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false} mode="popLayout">
                  {visibleRows.map((row, i) => (
                    <motion.tr
                      key={`${filter}-${row.id}`}
                      initial={rowInitial}
                      animate={rowAnimate}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, x: 8 }}
                      transition={{
                        ...motionInstant,
                        delay: reduce ? 0 : i * 0.06,
                      }}
                      className="group border-b border-[var(--global-border)] text-[var(--global-text)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--accent-primary)_6%,var(--global-surface))]"
                    >
                      <td className="border-l-2 border-transparent px-2 py-2 font-[var(--font-mono)] text-[10px] tabular-nums group-hover:border-[var(--accent-primary)] sm:text-[11px]">
                        #{String(row.req).padStart(5, '0')}
                      </td>
                      <td className="px-2 py-2 text-[10px] sm:text-[11px]">{row.doc}</td>
                      <td className="px-2 py-2 text-[10px] sm:text-[11px]">{row.requestor}</td>
                      <td className="px-2 py-2 font-[var(--font-mono)] text-[10px] text-[var(--global-text-muted)] sm:text-[11px]">
                        {row.dateFiled}
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={cn(
                            'inline-block rounded border px-1.5 py-0.5 font-[var(--font-mono)] text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]',
                            statusChipClass(row.status),
                            row.status === 'READY' && !reduce && 'animate-pulse',
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          disabled={row.locked}
                          onClick={() => bumpStatus(row.id)}
                          className={cn(
                            'group/update relative inline-flex items-center overflow-hidden rounded-md border border-[color:color-mix(in_oklab,var(--accent-secondary)_45%,transparent)] bg-[var(--accent-secondary)] px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--global-text)] transition-[padding,gap] duration-300 ease-out sm:text-[10px]',
                            'hover:gap-1 hover:pl-2 hover:pr-2',
                            row.locked && 'cursor-not-allowed opacity-40',
                          )}
                        >
                          <span>Update</span>
                          <span className="inline-block max-w-0 translate-x-1 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover/update:max-w-[2ch] group-hover/update:translate-x-0 group-hover/update:opacity-100">
                            »
                          </span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats + lifecycle */}
        <div className="flex w-full shrink-0 flex-col gap-4 md:w-[38%] md:max-w-sm">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            <StatCard value={7} suffix="" label="Document types supported" sublabel="Form 137 to ID replacement" />
            <StatCard value={4} suffix="" label="Request statuses" sublabel="Processing → Invalid → Ready → Claim" />
            <StatCard value={2} suffix="" label="Role portals" sublabel="Admin + Client, fully isolated" />
            <StatCard value={100} suffix="%" label="Input sanitized" sublabel="MySQLi prepared statements + XSS prevention" />
          </div>

          <div>
            <p className="mb-2 font-[var(--font-mono)] text-[9px] font-semibold uppercase tracking-wide text-[var(--global-text-muted)]">
              Document lifecycle
            </p>
            <div className="flex flex-wrap items-center gap-y-2 sm:gap-x-1">
              {LIFECYCLE_STEPS.map((label, idx) => {
                const active = idx === activeLifecycleIndex
                return (
                  <span key={label} className="inline-flex items-center gap-1 sm:gap-1.5">
                    <div
                      className={cn(
                        'min-w-0 flex-1 rounded-[var(--radius-project)] border px-2 py-1.5 text-center font-[var(--font-mono)] text-[8px] font-semibold uppercase leading-tight tracking-wide sm:flex-none sm:px-2 sm:text-[9px]',
                        active
                          ? 'border-[var(--accent-primary)] bg-[color:color-mix(in_oklab,var(--accent-primary)_12%,var(--global-surface))] text-[var(--global-text)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-primary)_35%,transparent)]'
                          : 'border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--surface-tint)_6%,var(--global-surface))] text-[var(--global-text-muted)]',
                      )}
                    >
                      {label.replace(' ', '\u00A0')}
                    </div>
                    {idx < LIFECYCLE_STEPS.length - 1 ? (
                      <span className="shrink-0 text-[var(--global-text-muted)]" aria-hidden>
                        →
                      </span>
                    ) : null}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </ChartShell>
  )
}

function StatCard({
  value,
  suffix,
  label,
  sublabel,
}: {
  value: number
  suffix: string
  label: string
  sublabel: string
}) {
  return (
    <div className="rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--surface-tint)_10%,var(--global-surface))] p-3">
      <KineticCounter
        value={value}
        suffix={suffix}
        decimals={0}
        className="text-xl leading-none text-[var(--accent-primary)] sm:text-2xl"
      />
      <p className="mt-1 text-[10px] font-medium text-[var(--global-text)]">{label}</p>
      <p className="mt-0.5 text-[9px] leading-snug text-[var(--global-text-muted)]">{sublabel}</p>
    </div>
  )
}
