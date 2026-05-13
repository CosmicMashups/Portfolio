import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { PROJECTS } from '@/config/projects.registry'
import { KineticCounter } from '@/components/ui/KineticCounter'
import {
  GITHUB_PROFILE_URL,
  fetchPublicEvents,
  type GitHubEventSummary,
} from '@/lib/github/activity'

function deriveLanguageMix(): { label: string; weight: number }[] {
  let web = 0
  let mobile = 0
  let backend = 0
  let ml = 0
  for (const p of PROJECTS) {
    for (const s of p.stack) {
      const n = s.name.toLowerCase()
      if (/(react|typescript|javascript|html|css|tailwind|vite|bootstrap)/.test(n)) web += 1
      if (/(flutter|dart)/.test(n)) mobile += 1
      if (/(php|mysql|firebase|sqlite|mariadb|apache)/.test(n)) backend += 1
      if (/(python|tensorflow|tflite|pytorch|ml)/.test(n)) ml += 1
    }
  }
  const rows = [
    { label: 'Web / TS', weight: web },
    { label: 'Mobile', weight: mobile },
    { label: 'Backend / data', weight: backend },
    { label: 'ML / Python', weight: ml },
  ]
  const sum = rows.reduce((a, r) => a + r.weight, 0) || 1
  return rows.map((r) => ({ ...r, weight: Math.round((r.weight / sum) * 100) }))
}

function SyntheticHeatmap({ events }: { events: GitHubEventSummary[] }) {
  const levels = useMemo(() => {
    const seed =
      events.reduce((acc, e) => acc + (e.repo?.length ?? 0) + (e.type?.length ?? 0), 0) + events.length * 7 || 19
    return Array.from({ length: 52 * 7 }, (_, i) => {
      const n = (seed * (i + 13)) % 5
      return n as 0 | 1 | 2 | 3 | 4
    })
  }, [events])

  return (
    <div className="mt-5">
      <p className="mb-2 text-[10px] text-[var(--global-text-muted)]">
        Synthetic activity grid (intensity derived from loaded public events — not GitHub&apos;s official graph).
      </p>
      <div
        className="grid w-full max-w-full gap-px overflow-x-auto rounded-md border border-[var(--global-border)] bg-[var(--global-border)] p-px"
        style={{ gridTemplateColumns: 'repeat(52, minmax(4px, 1fr))' }}
        aria-hidden
      >
        {levels.map((lv, i) => (
          <div
            key={i}
            className="aspect-square min-h-[5px] min-w-[4px] rounded-[1px]"
            style={{
              background:
                lv === 0
                  ? 'color-mix(in oklab, var(--global-text-muted) 8%, transparent)'
                  : lv === 1
                    ? 'color-mix(in oklab, var(--accent-primary) 18%, transparent)'
                    : lv === 2
                      ? 'color-mix(in oklab, var(--accent-primary) 32%, transparent)'
                      : lv === 3
                        ? 'color-mix(in oklab, var(--accent-primary) 48%, transparent)'
                        : 'color-mix(in oklab, var(--accent-primary) 62%, transparent)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function LanguageBars() {
  const mix = useMemo(() => deriveLanguageMix(), [])
  const max = Math.max(...mix.map((m) => m.weight), 1)

  return (
    <div className="mt-6 space-y-2 border-t border-[var(--global-border)] pt-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
        Language mix (portfolio registry weighting)
      </p>
      {mix.map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          <span className="w-28 shrink-0 font-[var(--font-mono)] text-[10px] text-[var(--global-text-muted)]">
            {row.label}
          </span>
          <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--global-border)]">
            <div
              className="h-full rounded-full bg-[color:color-mix(in_oklab,var(--accent-primary)_70%,transparent)] transition-[width] duration-700"
              style={{ width: `${(row.weight / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right font-[var(--font-mono)] text-[10px] text-[var(--global-text)]">
            {row.weight}%
          </span>
        </div>
      ))}
    </div>
  )
}

export function GitHubCredibility() {
  const [events, setEvents] = useState<GitHubEventSummary[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchPublicEvents(6)
      .then((e) => {
        if (!alive) return
        setEvents(e)
        if (!e.length) setErr('Public API returned no items (rate limit or network). Link still validates activity.')
      })
      .catch(() => alive && setErr('Could not load public events.'))
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="grid gap-7 lg:grid-cols-2">
      <BorderTrace className="rounded-[var(--radius-project)]">
        <div className="rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/55 p-6 md:p-7">
          <h3 className="text-lg font-semibold text-[var(--global-text)]">GitHub</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--global-text-muted)]">
            Activity snapshot via the public events API (no token). For a full contribution calendar, mirror the README
            snake or add a CI job with a fine-grained token — never commit secrets.
          </p>
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-primary)] hover:underline"
          >
            CosmicMashups <ExternalLink className="h-4 w-4" aria-hidden />
          </a>

          {err ? <p className="mt-4 text-xs text-[var(--global-text-muted)]">{err}</p> : null}

          <SyntheticHeatmap events={events} />

          <ul className="mt-5 space-y-2.5 font-mono text-[11px] text-[var(--global-text-muted)]">
            {events.map((e) => (
              <li key={`${e.repo}-${e.createdAt}-${e.type}`} className="flex justify-between gap-4">
                <span className="text-[var(--global-text)]">{e.type}</span>
                <span className="truncate text-right">{e.repo}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--global-border)] pt-5">
            <div>
              <KineticCounter value={events.length} className="text-lg" />
              <p className="text-[10px] text-[var(--global-text-muted)]">Events loaded</p>
            </div>
            <div>
              <KineticCounter value={PROJECTS.length} className="text-lg" />
              <p className="text-[10px] text-[var(--global-text-muted)]">Projects tracked</p>
            </div>
            <div>
              <KineticCounter value={PROJECTS.filter((p) => p.complexity === 'high').length} className="text-lg" />
              <p className="text-[10px] text-[var(--global-text-muted)]">High complexity</p>
            </div>
          </div>
        </div>
      </BorderTrace>

      <BorderTrace className="rounded-[var(--radius-project)]">
        <div className="rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/55 p-6 md:p-7">
          <h3 className="text-lg font-semibold text-[var(--global-text)]">Project complexity (registry)</h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--global-text-muted)]">
            High / medium / low encodes integration surface area plus design-system coupling — not line count.
          </p>
          <LanguageBars />
          <ul className="mt-6 space-y-2.5 text-sm">
            {PROJECTS.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded border border-[var(--global-border)] px-3 py-2"
              >
                <span className="text-[var(--global-text)]">{p.title}</span>
                <span className="font-mono text-xs uppercase text-[var(--accent-primary)]">{p.complexity}</span>
              </li>
            ))}
          </ul>
        </div>
      </BorderTrace>
    </div>
  )
}
