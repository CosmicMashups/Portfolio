import { useState } from 'react'
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

const CREATIVE_PLAYLIST_ID = 'PLBEulYRpIfe5M75Bvhdi8x0GDT8-IHoCW'
const CREATIVE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${CREATIVE_PLAYLIST_ID}`

/** First items in #PersonalBest (playlist PL…); extend when the playlist grows. */
const CREATIVE_PLAYLIST_PREVIEW_IDS = [
  'zf8hXUUkVOs',
  'SJPHaJFeZhY',
  'ON8xpczPZAU',
  'sAbzXPOGtNY',
] as const

function creativePlaylistEmbedSrc(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?list=${CREATIVE_PLAYLIST_ID}`
}

function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function CreativeCosmic() {
  const { ref: mashhubRef } = useMagneticEffect<HTMLAnchorElement>({ strength: 0.28 })
  const [loadedVideos, setLoadedVideos] = useState<Record<string, boolean>>({})

  const loadVideo = (videoId: string) => {
    setLoadedVideos((prev) => ({ ...prev, [videoId]: true }))
  }

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
                ref={mashhubRef}
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

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              Embedded media
            </p>
            <p className="mt-1 max-w-xl text-sm text-[var(--global-text-muted)]">
              Each card is a different track from the #PersonalBest playlist, still in full playlist context on YouTube.
            </p>
          </div>
          <a
            href={CREATIVE_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-[var(--global-border)] px-4 py-2 text-xs font-semibold text-[var(--global-text)] hover:border-[var(--accent-primary)]"
            data-cursor="link"
          >
            Open full playlist
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CREATIVE_PLAYLIST_PREVIEW_IDS.map((id, index) => (
            <TiltCard key={id} maxTilt={4}>
              <BorderTrace>
                <div className="overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--global-surface)_90%,transparent)]">
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--global-border)] px-4 py-2.5 sm:px-5">
                    <p className="text-xs font-medium text-[var(--global-text)]">#PersonalBest · Part {index + 1}</p>
                  </div>
                  <div className="relative aspect-video w-full">
                    {loadedVideos[id] ? (
                      <iframe
                        title={`CosmicMashups #PersonalBest — video ${index + 1} (playlist context)`}
                        src={creativePlaylistEmbedSrc(id)}
                        className="absolute inset-0 h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => loadVideo(id)}
                        className="group absolute inset-0 block h-full w-full overflow-hidden"
                        aria-label={`Load embedded YouTube player for PersonalBest part ${index + 1}`}
                      >
                        <img
                          src={youtubeThumbnail(id)}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
                        <span className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/55 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white">
                          Load video
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="border-t border-[var(--global-border)] px-4 py-2.5 sm:px-5">
                    <a
                      href={`https://www.youtube.com/watch?v=${id}&list=${CREATIVE_PLAYLIST_ID}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[var(--accent-primary)] hover:underline"
                      data-cursor="link"
                    >
                      Open this video on YouTube
                    </a>
                  </div>
                </div>
              </BorderTrace>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  )
}
