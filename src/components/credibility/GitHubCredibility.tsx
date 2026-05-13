import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PROJECTS } from '@/config/projects.registry'
import { KineticCounter } from '@/components/ui/KineticCounter'
import {
  GITHUB_PROFILE_URL,
  fetchPublicEvents,
  type GitHubEventSummary,
} from '@/lib/github/activity'

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
      <Card>
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
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-[var(--global-text)]">Project complexity (registry)</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--global-text-muted)]">
          High / medium / low encodes integration surface area + design-system coupling — not line count.
        </p>
        <ul className="mt-5 space-y-2.5 text-sm">
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
      </Card>
    </div>
  )
}
