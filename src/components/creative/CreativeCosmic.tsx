import { RevealText } from '@/components/ui/RevealText'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'

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

export function CreativeCosmic() {
  return (
    <div className="space-y-8">
      <RevealText className="max-w-3xl text-sm text-[var(--global-text-muted)]">
        Outside of engineering, I make music mashups — it's the same instinct. Find patterns, combine systems, make
        something that flows.
      </RevealText>
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
            <div className="relative h-full overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/80">
        <div className="aspect-video w-full bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]">
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
            </div>
          </BorderTrace>
        </TiltCard>
      </div>
    </div>
  )
}
