import { Link } from 'react-router-dom'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'

function Waveform() {
  const bars = [12, 28, 18, 40, 22, 32, 16, 36, 20, 44, 18, 30]
  return (
    <div className="flex h-14 items-end justify-center gap-0.5 opacity-80" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-sm bg-[color:color-mix(in_oklab,var(--accent-primary)_55%,transparent)]"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

const PRINCIPLES = [
  {
    title: 'Density with Clarity',
    body: 'Dark-first shells and monospaced numerics keep dashboards legible under load — the same discipline as AriMarket and MashHub.',
  },
  {
    title: 'Motion with Purpose',
    body: 'Scroll-entry choreography and counters answer “what changed?” — never ornamental loops that fight reading order.',
  },
  {
    title: 'Systems over Surfaces',
    body: 'Typography pairs Space Grotesk with JetBrains Mono so headlines and data read as one system, not a template swap.',
  },
] as const

export function CreativeCosmic() {
  const mashhub = useMagneticEffect({ strength: 0.28 })

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-[var(--global-text-muted)]">
        <p>
          I default to dark, data-dense interfaces because financial and clinical tools fail when they hide uncertainty
          behind white cards. Syne and JetBrains Mono are deliberate: display type carries narrative weight while mono
          keeps metrics aligned and comparable across modules.
        </p>
        <p>
          Mashups are the same muscle as engineering — pattern matching under noise — which is why MashHub exists as a
          serious creative tool, not a side gimmick.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <TiltCard key={p.title} maxTilt={5}>
            <BorderTrace className="h-full rounded-[var(--radius-project)]">
              <div className="flex h-full flex-col rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--surface-tint)] p-5">
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                  {p.title}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--global-text-muted)]">{p.body}</p>
              </div>
            </BorderTrace>
          </TiltCard>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <TiltCard>
          <BorderTrace>
            <div className="h-full rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--surface-tint)] p-7 sm:p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                CosmicMashups
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--global-text)]">Creative signal, same rigor</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">
                Mashups share the same narrative: controlled composition under noisy inputs. This panel stays minimal — a
                waveform motif and a direct link — so the engineering story stays primary.
              </p>
              <a
                href="https://www.youtube.com/@CosmicMashups"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-sm font-medium text-[var(--accent-primary)] hover:underline"
                data-cursor="link"
              >
                Open YouTube channel
              </a>
              <div className="mt-6">
                <Waveform />
              </div>
            </div>
          </BorderTrace>
        </TiltCard>

        <TiltCard>
          <BorderTrace>
            <div className="flex h-full flex-col justify-between rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/80 p-7 sm:p-8">
              <div>
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                  MashHub
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[var(--global-text)]">Also a mashup creator</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">
                  MashHub started as my own workflow fix: harmonic distance, BPM flow, and honest weight sliders so the
                  matcher never feels like a black box.
                </p>
              </div>
              <Link
                ref={mashhub.ref as never}
                to="/projects/mashhub"
                data-cursor="link"
                className="mt-6 inline-flex w-fit rounded-full border border-[var(--color-border-accent)] bg-[color:color-mix(in_oklab,var(--accent-primary)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--global-text)]"
              >
                Open MashHub case study
              </Link>
            </div>
          </BorderTrace>
        </TiltCard>
      </div>

      <TiltCard maxTilt={4}>
        <BorderTrace>
          <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--global-surface)_90%,transparent)]">
            <div className="flex h-full flex-col items-center justify-center gap-5 p-7 text-center sm:p-8">
              <p className="text-sm font-medium text-[var(--global-text)]">Embedded media</p>
              <p className="max-w-sm text-xs text-[var(--global-text-muted)]">
                Drop a playlist or highlight embed URL here. Until then, this frame reserves the aspect ratio without
                loading third-party scripts on initial paint.
              </p>
              <a
                href="https://www.youtube.com/@CosmicMashups"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--global-border)] px-4 py-2 text-xs font-semibold text-[var(--global-text)] hover:border-[var(--accent-primary)]"
                data-cursor="link"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </BorderTrace>
      </TiltCard>
    </div>
  )
}
