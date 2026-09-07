import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useThemeAccent } from '@/app/providers/useThemeAccent'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { TiltCard } from '@/components/ui/TiltCard'
import { PocketPTHero } from '@/components/projects/pocketpt/PocketPTHero'
import { PocketPTMetricsSection } from '@/components/projects/pocketpt/PocketPTMetricsSection'
import { PocketPTPipeline } from '@/components/projects/pocketpt/PocketPTPipeline'
import {
  CNN_LSTM_HYBRID_ACCURACY,
  CNN_LSTM_IMPROVEMENT_PCT,
  DATASET_LOW_PAIN,
  DATASET_MOD_PAIN,
  DATASET_SEV_PAIN,
  ISO_OVERALL_MEAN,
  PHILIPPINE_POPULATION_M,
  PHILIPPINE_PTS,
  POSE_CNN_ACCURACY,
  POSE_CNN_MAP50,
  POSE_CONFIDENCE_THRESHOLD,
  PAIN_CNN_WEIGHTED_ACCURACY,
  PAIN_SEVERE_RECALL,
  RESNET18_PARAMS_M,
  RESPONDENTS_PT,
  RESPONDENTS_TOTAL,
  SPORTS_INJURIES_US_2022_M,
  THERAPIST_PATIENT_RATIO,
  THESIS_URL,
} from '@/components/projects/pocketpt/pocketptConstants'
import { POCKETPT_THEME_CSS } from '@/components/projects/pocketpt/pocketptThemeCss'
import { cn } from '@/components/ui/cn'
import { projectById } from '@/config/projects.registry'
import { researchPaperUrl } from '@/config/researchPapers'

const EASE = [0.16, 1, 0.3, 1] as const

const ACADEMIC_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`

type ArchTab = 'pose' | 'pain' | 'offline'

function SectionMotion({
  children,
  className,
  reduce,
}: {
  children: ReactNode
  className?: string
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function IconArom() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-[var(--pkt-accent)]" aria-hidden>
      <rect x="6" y="10" width="36" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="20" r="2" fill="currentColor" />
      <path d="M18 24 L30 20 L30 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconPain() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-[var(--pkt-accent)]" aria-hidden>
      <circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18 22 Q24 18 30 22" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19" cy="21" r="1.2" fill="currentColor" />
      <circle cx="29" cy="21" r="1.2" fill="currentColor" />
    </svg>
  )
}

function IconOffline() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-[var(--pkt-accent)]" aria-hidden>
      <path d="M12 36 L36 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 14 L16 10 L22 14" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="26" y="22" width="12" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function IconPlan() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-[var(--pkt-accent)]" aria-hidden>
      <circle cx="14" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="34" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="24" cy="34" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M16 15 L22 30 M32 20 L26 32 M22 30 L26 32" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

function IconReport() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-[var(--pkt-accent)]" aria-hidden>
      <path d="M12 38 L12 12 L22 12 L26 16 L36 16 L36 38 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 24 L32 28" stroke="currentColor" strokeWidth="1.2" />
      <path d="M14 30 L28 33" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function SixteenFrameDemo({ reduce }: { reduce: boolean }) {
  const heights = [0.35, 0.55, 0.42, 0.7, 0.5, 0.62, 0.48, 0.58, 0.52, 0.66, 0.44, 0.6, 0.5, 0.56, 0.4, 0.53]
  return (
    <div className="mt-4 flex h-24 items-end gap-1">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm bg-[color:color-mix(in_oklab,var(--pkt-accent)_65%,transparent)]"
          initial={reduce ? { scaleY: h } : { scaleY: 0.08 }}
          whileInView={reduce ? undefined : { scaleY: h }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
          style={{ transformOrigin: 'bottom', height: '100%' }}
        />
      ))}
    </div>
  )
}

function buildFeatureDefs(reduce: boolean): {
  id: number
  title: string
  teaser: string
  icon: ReactNode
  detail: ReactNode
}[] {
  return [
  {
    id: 0,
    title: 'On-Device Range of Motion',
    teaser: 'Live pose estimation without a single cloud call.',
    icon: <IconArom />,
    detail: (
      <div className="space-y-3 text-sm leading-relaxed text-[var(--pkt-text-dim)]">
        <p>
          The assessment path pairs the device camera with Google ML Kit pose detection, then routes landmarks through
          ONNX on native platform channels so heavy inference never blocks the UI thread for long stretches.
        </p>
        <p>
          UX guardrails matter as much as the model: aggressive <span className="pkt-mono text-[var(--pkt-mono)]">imageCache</span>{' '}
          limits (for example maximum count and byte caps) reduce out-of-memory risk during sustained capture, and{' '}
          <span className="pkt-mono text-[var(--pkt-mono)]">AppScrollBehavior</span> removes overscroll glow layers that
          would otherwise trigger expensive repaints while ML runs.
        </p>
        <p className="text-[var(--pkt-text)]">
          A 16-frame LSTM window smooths keypoint confidence over time before angles feed clinical rules — visualized
          below as sixteen sequential “confidence bars.”
        </p>
        <SixteenFrameDemo reduce={reduce} />
      </div>
    ),
  },
  {
    id: 1,
    title: 'Objective Pain Detection',
    teaser: 'Micro-expressions analyzed in real-time. No subjective 1–10 scale required.',
    icon: <IconPain />,
    detail: (
      <div className="space-y-3 text-sm leading-relaxed text-[var(--pkt-text-dim)]">
        <p>
          Knowledge distillation lets a compact ResNet-18 student absorb not only the teacher’s class decisions but also
          its uncertainty structure — soft targets carry richer supervision than a single hard label per crop.
        </p>
        <p>
          The thesis reports <span className="text-[var(--pkt-text)]">{PAIN_CNN_WEIGHTED_ACCURACY}%</span> weighted
          accuracy and <span className="text-[var(--pkt-text)]">{PAIN_SEVERE_RECALL}%</span> recall on severe pain — a
          deliberate safety bias: missing severe pain is unacceptable in a rehab context.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="rounded-lg border border-[var(--pkt-border)] p-3">
            <p className="pkt-mono text-[10px] uppercase text-[var(--pkt-text-dim)]">Soft labels (KD)</p>
            <div className="mt-2 flex gap-2">
              {['Low', 'Mod', 'Sev'].map((l) => (
                <span key={l} className="rounded-full border border-[var(--pkt-accent)]/50 px-2 py-1 text-[10px] text-[var(--pkt-mono)]">
                  {l}: prob mix
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--pkt-border)] p-3">
            <p className="pkt-mono text-[10px] uppercase text-[var(--pkt-text-dim)]">Hard labels only</p>
            <div className="mt-2 flex gap-2">
              {['Low', 'Mod', 'Sev'].map((l) => (
                <span key={l} className="rounded-full border border-[var(--pkt-text-dim)] px-2 py-1 text-[10px] text-[var(--pkt-text-dim)]">
                  {l}: 0/1
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Works Without Wi-Fi',
    teaser: 'Built for rural Philippines. Your rehab plan survives a dead zone.',
    icon: <IconOffline />,
    detail: (
      <div className="space-y-3 text-sm leading-relaxed text-[var(--pkt-text-dim)]">
        <p>
          Hive is the source of truth: assessments, plans, and progress write locally first. When connectivity and auth
          allow, <span className="pkt-mono text-[var(--pkt-mono)]">DataSyncService</span> reconciles with Firebase
          Firestore in the background.
        </p>
        <p>Guest Mode bypasses Firebase entirely — useful for anonymous trials and zero-signal clinics.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--pkt-border)] p-4">
            <p className="pkt-mono text-xs text-[var(--pkt-accent)]">Offline</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              <li>Hive writes for plans and progress</li>
              <li>ON-device PDFs and charts</li>
              <li>No cloud dependency for core flows</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[var(--pkt-border)] p-4">
            <p className="pkt-mono text-xs text-[var(--pkt-accent)]">Reconnect</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              <li>Sync service detects network + auth</li>
              <li>Firestore merge after validation</li>
              <li>Web uses offline stub where needed</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Rule-Based Treatment Engine',
    teaser: '48-hour injury rule. Severe pain blocks exercise. Patient safety is a hard constraint.',
    icon: <IconPlan />,
    detail: (
      <div className="space-y-3 text-sm leading-relaxed text-[var(--pkt-text-dim)]">
        <p>
          The generator walks muscle group, pain level, pain duration, and functional goals, then looks up treatments
          and exercises from curated CSV references. Severe pain and acute (&lt;48h) injuries force passive treatments
          only — exercises stay blocked until it is clinically responsible to load tissue.
        </p>
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-2 py-1">Muscle group</span>
            <span aria-hidden className="text-[var(--pkt-accent)]">→</span>
            <span className="rounded border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-2 py-1">Pain level</span>
            <span aria-hidden className="text-[var(--pkt-accent)]">→</span>
            <span className="rounded border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-2 py-1">Duration</span>
            <span aria-hidden className="text-[var(--pkt-accent)]">→</span>
            <span className="rounded border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-2 py-1">Goal</span>
            <span aria-hidden className="text-[var(--pkt-accent)]">→</span>
            <span className="rounded border border-[var(--pkt-accent)]/40 bg-[color:color-mix(in_oklab,var(--pkt-accent)_12%,var(--pkt-surface))] px-2 py-1">CSV plan</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Clinic-Grade Progress Reports',
    teaser: 'Export your data as a PDF your physical therapist can actually use.',
    icon: <IconReport />,
    detail: (
      <div className="space-y-3 text-sm leading-relaxed text-[var(--pkt-text-dim)]">
        <p>
          In-app charts use <span className="pkt-mono text-[var(--pkt-mono)]">fl_chart</span>; exports use{' '}
          <span className="pkt-mono text-[var(--pkt-mono)]">pdf</span> and{' '}
          <span className="pkt-mono text-[var(--pkt-mono)]">printing</span> to render documents entirely on-device — no
          third-party document server receives PHI.
        </p>
        <div className="mt-4 rounded-lg border border-[var(--pkt-border)] bg-[#0d1014] p-4 font-mono text-[10px] text-[var(--pkt-mono)]">
          <p className="text-[var(--pkt-text-dim)]">PocketPT — Progress summary (anonymized)</p>
          <p className="mt-2">Patient ID: ****218</p>
          <p>Assessment date: 2025-11-02</p>
          <p>Pain trend: [sparkline placeholder]</p>
          <p>Exercise completion: 82%</p>
        </div>
      </div>
    ),
  },
]
}

export function PocketPTPage() {
  const reduce = usePrefersReducedMotion()
  const { setActiveProjectId } = useThemeAccent()
  const [activeTab, setActiveTab] = useState<ArchTab>('pose')
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const tabIds = useId()
  const featureDefs = useMemo(() => buildFeatureDefs(reduce), [reduce])
  const pocketLiveUrl = useMemo(() => projectById('pocketpt')?.liveUrl, [])
  const pocketPaperUrl = useMemo(() => researchPaperUrl('pocketpt'), [])

  useEffect(() => {
    setActiveProjectId('pocketpt')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  return (
    <div className="pocketpt-root pkt-scrollbar relative overflow-hidden rounded-[var(--radius-project)] border border-[var(--pkt-border)] shadow-[0_0_60px_rgba(0,0,0,0.45)]">
      <style>{POCKETPT_THEME_CSS}</style>
      <main id="main-content" tabIndex={-1} className="outline-none">
        <PocketPTHero reduce={reduce} />

        <section
          id="pocketpt-problem"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-14 sm:py-20"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Licensed PTs in the Philippines"
                  value={PHILIPPINE_PTS}
                  reduce={reduce}
                />
                <StatCard
                  label="Philippine population"
                  value={PHILIPPINE_POPULATION_M}
                  suffix="M"
                  reduce={reduce}
                />
                <StatCard
                  label="Therapist-to-patient ratio"
                  value={THERAPIST_PATIENT_RATIO}
                  prefix="1:"
                  reduce={reduce}
                />
                <StatCard
                  label="Annual sports injuries (US, 2022)"
                  value={SPORTS_INJURIES_US_2022_M}
                  suffix="M+"
                  decimals={1}
                  reduce={reduce}
                />
                <div className="col-span-2 rounded-lg border-t-2 border-[var(--pkt-accent)] bg-[var(--pkt-surface)] p-4 shadow-[0_0_20px_var(--pkt-accent-glow)]">
                  <p className="pkt-mono text-3xl font-semibold text-[var(--pkt-mono)]">1 in 4</p>
                  <p className="mt-1 text-xs text-[var(--pkt-text-dim)]">Adolescent athletes affected</p>
                </div>
              </div>
            </div>
            <div>
              <SectionMotion reduce={reduce}>
                <p className="pkt-mono text-xs uppercase tracking-[0.2em] text-[var(--pkt-accent)]">01 / THE PROBLEM</p>
                <h2 className="pkt-display mt-2 text-3xl text-[var(--pkt-text)] sm:text-4xl">When Access Is the Diagnosis</h2>
              </SectionMotion>
              <SectionMotion reduce={reduce} className="mt-6 space-y-4 text-base leading-relaxed text-[var(--pkt-text-dim)]">
              <p>
                The Philippines trains roughly {PHILIPPINE_PTS.toLocaleString()} licensed physical therapists for more than{' '}
                {PHILIPPINE_POPULATION_M} million people — a structural mismatch, not a personal failure of any clinic.
                Rural barangays may be hours away from the nearest licensed facility; urban queues still stretch for
                weeks.
              </p>
              <p>
                Cost and time force many patients to skip formal rehab entirely. The gap becomes a quiet public-health
                problem: people self-treat with rest, ice, and internet advice — patterns that can stall recovery or
                worsen tissue loading when the injury needed guided progression.
              </p>
              <p>
                PocketPT was motivated by that access gap: put screening-grade guidance on hardware people already
                carry, with models that run locally so privacy and connectivity are not prerequisites for help.
              </p>
            </SectionMotion>
            <blockquote className="mt-8 border-l-2 border-[var(--pkt-accent)] pl-5 text-lg italic text-[var(--pkt-accent)]">
              Many resort to ice packs and rest — often worsening the injury they can&apos;t afford to treat.
            </blockquote>
            </div>
          </div>
        </section>

        <section
          id="pocketpt-architecture"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMotion reduce={reduce}>
              <p className="pkt-mono text-xs uppercase tracking-[0.2em] text-[var(--pkt-accent)]">02 / ENGINE ROOM</p>
              <h2 className="pkt-display mt-2 text-3xl text-[var(--pkt-text)] sm:text-4xl">System architecture</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--pkt-text-dim)]">
                A live read of how camera frames fork into pose and pain pathways before deterministic rules emit a
                week-by-week plan — every box runs on-device.
              </p>
            </SectionMotion>
            <div className="pkt-grid-bg relative mt-10 rounded-xl border border-[var(--pkt-border)] bg-[color:color-mix(in_oklab,var(--pkt-surface)_90%,black)] p-4 sm:p-6">
              <PocketPTPipeline reduce={reduce} />
            </div>

            <div className="mt-10">
              <div
                role="tablist"
                aria-label="Technical deep dive"
                className="flex flex-wrap gap-2 border-b border-[var(--pkt-border)] pb-4"
              >
                {(
                  [
                    ['pose', 'Pose estimation'],
                    ['pain', 'Pain recognition'],
                    ['offline', 'Offline-first'],
                  ] as const
                ).map(([id, label]) => {
                  const tid = `${tabIds}-${id}`
                  const selected = activeTab === id
                  return (
                    <button
                      key={id}
                      id={tid}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`${tabIds}-panel-${id}`}
                      tabIndex={0}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                        selected
                          ? 'bg-[var(--pkt-accent)] text-white'
                          : 'border border-[var(--pkt-border)] bg-[var(--pkt-surface)] text-[var(--pkt-text-dim)]',
                      )}
                      onClick={() => setActiveTab(id)}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              <ArchPanel
                tabId={`${tabIds}-panel-pose`}
                labelledBy={`${tabIds}-pose`}
                hidden={activeTab !== 'pose'}
              >
                <p>
                  YOLO11s-pose (ImageNet-pretrained) outputs 17 keypoints with{' '}
                  <span className="text-[var(--pkt-text)]">{POSE_CNN_ACCURACY}%</span> accuracy and{' '}
                  <span className="text-[var(--pkt-text)]">{POSE_CNN_MAP50}%</span> mAP@0.5 in the thesis evaluation. A
                  standalone CNN beat the CNN–LSTM hybrid on this task by{' '}
                  <span className="text-[var(--pkt-text)]">{CNN_LSTM_IMPROVEMENT_PCT.toFixed(1)} points</span> (hybrid at{' '}
                  {CNN_LSTM_HYBRID_ACCURACY}%), trading marginal temporal fusion for latency and stability on mobile.
                </p>
                <p>
                  Confidence gating uses a <span className="pkt-mono">{POSE_CONFIDENCE_THRESHOLD}</span> threshold — a
                  precision-first posture so downstream clinical rules do not act on jittery frames.
                </p>
              </ArchPanel>
              <ArchPanel
                tabId={`${tabIds}-panel-pain`}
                labelledBy={`${tabIds}-pain`}
                hidden={activeTab !== 'pain'}
              >
                <p>
                  An EfficientNet-B4 teacher distilled into a ~{RESNET18_PARAMS_M}M-parameter ResNet-18 student reaches{' '}
                  <span className="text-[var(--pkt-text)]">{PAIN_CNN_WEIGHTED_ACCURACY}%</span> weighted accuracy with{' '}
                  <span className="text-[var(--pkt-text)]">{PAIN_SEVERE_RECALL}%</span> recall on severe pain — the metric
                  that mattered clinically.
                </p>
                <p>
                  Class imbalance was extreme: roughly {DATASET_LOW_PAIN.toLocaleString()} low, {DATASET_MOD_PAIN.toLocaleString()}{' '}
                  moderate, and {DATASET_SEV_PAIN} severe samples. Focal loss down-weights easy negatives; synthetic
                  oversampling with hard augmentations (rotation, color jitter, blur, downscale–upscale) kept severe
                  cases from being ignored. Distillation matches soft teacher distributions so the student learns where
                  the teacher is uncertain, not just the argmax label.
                </p>
              </ArchPanel>
              <ArchPanel
                tabId={`${tabIds}-panel-offline`}
                labelledBy={`${tabIds}-offline`}
                hidden={activeTab !== 'offline'}
              >
                <p>
                  Hive holds user assessments, rehabilitation plans, and progress as the authoritative local record.{' '}
                  <span className="pkt-mono text-[var(--pkt-mono)]">DataPersistenceService</span> writes first;{' '}
                  <span className="pkt-mono text-[var(--pkt-mono)]">DataSyncService</span> mirrors to Firestore when the
                  device is online and authenticated.
                </p>
                <p>
                  Guest Mode skips Firebase initialization entirely — critical for rural Philippine users who may lack
                  accounts or reliable data service but still need evidence-informed guidance.
                </p>
              </ArchPanel>
            </div>
          </div>
        </section>

        <PocketPTMetricsSection reduce={reduce} />

        <section
          id="pocketpt-features"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMotion reduce={reduce}>
              <p className="pkt-mono text-xs uppercase tracking-[0.2em] text-[var(--pkt-accent)]">05 / FEATURES</p>
              <h2 className="pkt-display mt-2 text-3xl text-[var(--pkt-text)] sm:text-4xl">Feature deep dive</h2>
            </SectionMotion>
            <div className="pkt-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {featureDefs.map((f) => (
                <div key={f.id} className="w-[min(100%,280px)] shrink-0 snap-start">
                  <TiltCard
                    glareEnabled={!reduce}
                    className="h-full border-[var(--pkt-border)] bg-[color:color-mix(in_oklab,var(--pkt-surface)_92%,black)] backdrop-blur-md"
                  >
                    <BorderTrace className="h-full">
                      <button
                        type="button"
                        onClick={() => setActiveFeature((cur) => (cur === f.id ? null : f.id))}
                        className="flex w-full flex-col gap-3 p-5 text-left"
                      >
                        {f.icon}
                        <span className="pkt-display text-lg text-[var(--pkt-text)]">{f.title}</span>
                        <span className="text-sm text-[var(--pkt-text-dim)]">{f.teaser}</span>
                        <span className="pkt-mono text-xs text-[var(--pkt-accent)]">
                          {activeFeature === f.id ? 'Tap to collapse' : 'Tap to expand'}
                        </span>
                      </button>
                    </BorderTrace>
                  </TiltCard>
                </div>
              ))}
            </div>
            {activeFeature !== null ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-8 rounded-xl border border-[var(--pkt-border)] bg-[var(--pkt-surface)] p-6"
              >
                {featureDefs.find((x) => x.id === activeFeature)?.detail}
              </motion.div>
            ) : null}
          </div>
        </section>

        <section
          id="pocketpt-challenges"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionMotion reduce={reduce}>
              <p className="pkt-mono text-xs uppercase tracking-[0.2em] text-[var(--pkt-accent)]">06 / CHALLENGES</p>
              <h2 className="pkt-display mt-2 text-3xl text-[var(--pkt-text)] sm:text-4xl">Engineering challenges</h2>
            </SectionMotion>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <ChallengeCard
                n="01"
                title="ML inference jank on mobile"
                challenge="Running YOLO11s-pose and ResNet-18 together threatened frame budgets — the thesis targeted sub-16ms per-frame feel for interactive capture."
                solution="Native platform channels for ONNX, aggressive imageCache limits (maximum count 200, 50MB cap), SchedulerBinding profiling during development, and AppScrollBehavior to strip overscroll glow layers that repainted during inference."
                badges={['ONNX Runtime', 'Flutter Platform Channels', 'SchedulerBinding']}
                reduce={reduce}
              />
              <ChallengeCard
                n="02"
                title="Extreme class imbalance (pain)"
                challenge={`Roughly ${DATASET_LOW_PAIN.toLocaleString()} low-pain crops versus ${DATASET_SEV_PAIN} severe — a ratio that would make any classifier ignore the tail.`}
                solution={`Knowledge distillation from EfficientNet-B4, focal loss, and synthetic oversampling with hard augmentations. Result: 100% severe-pain recall with weighted accuracy still at ${PAIN_CNN_WEIGHTED_ACCURACY}%.`}
                badges={['Knowledge Distillation', 'Focal Loss', 'SMOTE-style Augmentation']}
                reduce={reduce}
              />
              <ChallengeCard
                n="03"
                title="Offline ↔ online transitions"
                challenge="Switching guest/authenticated or online/offline modes risked corrupting rehab plans or dropping writes mid-sync."
                solution="Hive as the primary source of truth with local-first writes, DataSyncService gating Firestore on connectivity plus auth, and web_offline.dart stubs for conditional Firebase initialization on web."
                badges={['Hive', 'Firebase Firestore', 'Riverpod', 'flutter_secure_storage']}
                reduce={reduce}
              />
            </div>
          </div>
        </section>

        <section
          id="pocketpt-academic"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-16 sm:py-24"
        >
          <div
            className="relative mx-auto max-w-[680px] px-4 sm:px-6"
            style={{ backgroundImage: ACADEMIC_NOISE, backgroundSize: '128px 128px' }}
          >
            <div className="relative rounded-2xl border border-[var(--pkt-border)] bg-[color:color-mix(in_oklab,var(--pkt-surface)_85%,transparent)] px-6 py-12 sm:px-10">
              <SectionMotion reduce={reduce}>
                <p className="pkt-mono text-center text-xs uppercase tracking-[0.25em] text-[var(--pkt-accent)]">
                  Academic context
                </p>
                <h2 className="pkt-display mt-4 text-center text-3xl text-[var(--pkt-text)]">Thesis-Grade Engineering</h2>
                <div className="mt-8 space-y-5 text-center text-sm leading-relaxed text-[var(--pkt-text-dim)]">
                  <p>
                    The study was completed in partial fulfillment of BS Computer Science (Intelligent Systems) at De La
                    Salle University – Dasmariñas, with validation from licensed physical therapists and field sessions
                    in real clinical and corporate gym settings (ProBio Medcare Doctors Clinic – Parañaque; Standard
                    Insurance Corp. Technical Training Center – Naic).
                  </p>
                  <p>
                    Quality was evaluated against ISO/IEC 25010 using structured surveys — overall mean{' '}
                    <span className="text-[var(--pkt-text)]">{ISO_OVERALL_MEAN}</span> on the collected responses, with
                    dimension-level scores feeding the radar chart in the metrics section.
                  </p>
                </div>
                <hr className="mx-auto mt-10 w-24 border-0 border-t-2 border-[var(--pkt-accent)]" />
                <div className="mt-10 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
                  <StatMini label="ISO 25010 evaluation" value={`${RESPONDENTS_TOTAL} respondents`} />
                  <StatMini label="Expert validators" value={`${RESPONDENTS_PT} physical therapists`} />
                  <StatMini label="Real deployment" value="2 clinical sites" />
                  <StatMini label="Thesis submission" value="December 2025" />
                </div>
                <blockquote className="pkt-display mt-12 border border-[var(--pkt-border)] bg-[#0d1014] p-6 text-center text-lg leading-snug text-[var(--pkt-text)]">
                  The CNN model attained {POSE_CNN_ACCURACY}% key-point accuracy and {POSE_CNN_MAP50}% mAP@0.5, while the
                  pain recognition CNN achieved {PAIN_CNN_WEIGHTED_ACCURACY}% weighted accuracy — with perfect{' '}
                  {PAIN_SEVERE_RECALL}% recall for severe pain detection.
                </blockquote>
              </SectionMotion>
            </div>
          </div>
        </section>

        <section
          id="pocketpt-stack"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionMotion reduce={reduce}>
              <p className="pkt-mono text-xs uppercase tracking-[0.2em] text-[var(--pkt-accent)]">08 / STACK</p>
              <h2 className="pkt-display mt-2 text-3xl text-[var(--pkt-text)] sm:text-4xl">Technology specification</h2>
            </SectionMotion>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 48, rotate: 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE }}
              className="relative mt-10 overflow-hidden rounded-lg border border-[#c4bdb2] bg-[#F5F0E8] p-6 text-[#1A1A1A] shadow-xl"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                backgroundImage:
                  'repeating-linear-gradient(transparent 0 27px, rgba(0,0,0,0.06) 27px 28px), linear-gradient(#F5F0E8,#F5F0E8)',
              }}
            >
              <p className="text-sm font-semibold tracking-wide">Rx PocketPT — Technology Specification</p>
              <div className="mt-6 space-y-4 text-xs leading-relaxed">
                <p>
                  <span className="font-bold">FRONTEND</span> — Flutter (Dart) · Riverpod · Lottie · fl_chart
                </p>
                <p>
                  <span className="font-bold">BACKEND/CLOUD</span> — Firebase Auth · Cloud Firestore · Python
                </p>
                <p>
                  <span className="font-bold">AI / ML</span> — CNN (YOLO11s-pose) · ResNet-18 · LSTM · ONNX Runtime ·
                  Google ML Kit Pose Detection · EfficientNet-B4 (Teacher)
                </p>
                <p>
                  <span className="font-bold">LOCAL STORAGE</span> — Hive NoSQL · Flutter Secure Storage · Shared
                  Preferences
                </p>
                <p>
                  <span className="font-bold">REPORTS</span> — fl_chart · pdf · printing · csv
                </p>
                <p>
                  <span className="font-bold">DEV TOOLS</span> — Android Studio · VS Code · PyTorch · Google Colab
                </p>
                <p>
                  <span className="font-bold">METHODOLOGY</span> — Agile SDLC · ISO/IEC 25010 · Knowledge Distillation
                </p>
              </div>
              <div className="mt-8 border-t-2 border-[#C0392B] pt-3 text-[10px] text-[#555]">Signature line — thesis context</div>
              <p className="absolute right-4 top-4 rotate-[-8deg] rounded border border-[#C0392B] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#C0392B]">
                Validated by PT ✓
              </p>
            </motion.div>
          </div>
        </section>

        <section
          id="pocketpt-reflections"
          className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionMotion reduce={reduce}>
              <p className="pkt-mono text-xs uppercase tracking-[0.2em] text-[var(--pkt-accent)]">09 / REFLECTIONS</p>
              <h2 className="pkt-display mt-2 text-3xl text-[var(--pkt-text)] sm:text-4xl">Lessons learned</h2>
            </SectionMotion>
            <div className="relative mt-10 space-y-10 border-l border-[var(--pkt-border)] pl-8">
              <Lesson n="01" title="Native integrations are the performance frontier">
                Dart&apos;s Flutter layer is elegant, but the real performance unlock came from pushing ONNX inference
                through native platform channels. Crossing the language bridge is expensive — every unnecessary channel
                call adds latency. Build native where it matters, delegate to Dart for everything else.
              </Lesson>
              <Lesson n="02" title="Offline-first is a product philosophy, not a feature">
                Designing Hive as the source of truth from day one — rather than retrofitting offline support — changed
                how every data flow was architected. When the local database is the contract, cloud sync becomes a
                background optimization rather than a blocking dependency.
              </Lesson>
              <Lesson n="03" title="Medical AI demands safety theater + real safety">
                Training for {PAIN_SEVERE_RECALL}% severe pain recall wasn&apos;t just a benchmark goal — it was a
                clinical requirement. A rehabilitation app that misses severe pain is actively harmful. Every
                engineering decision (focal loss, conservative confidence gating, blocking exercises for &lt;48hr
                injuries) was a patient safety decision in disguise.
              </Lesson>
            </div>
          </div>
        </section>

        <section id="pocketpt-cta" className="scroll-mt-[calc(var(--shell-header-height)+2rem)] py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <hr className="mb-10 border-0 border-t border-[var(--pkt-accent)]" />
            <p className="pkt-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pkt-text-dim)]">
              Private repository · thesis context · 2025
            </p>
            <h2 className="pkt-display mt-4 text-4xl text-[var(--pkt-text)] sm:text-5xl">Built for the 1 in 4.</h2>
            <p className="mt-4 text-sm text-[var(--pkt-text-dim)]">
              In partial fulfillment of BS Computer Science (Intelligent Systems), De La Salle University – Dasmariñas.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/#projects"
                className="rounded-full border border-[var(--pkt-border)] px-5 py-2.5 text-sm text-[var(--pkt-text)] transition-colors hover:border-[var(--pkt-accent)]"
              >
                ← Back to Projects
              </Link>
              {pocketLiveUrl ? (
                <a
                  href={pocketLiveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-[var(--pkt-border)] px-5 py-2.5 text-sm text-[var(--pkt-text)] transition-colors hover:border-[var(--pkt-accent)]"
                >
                  Live site
                </a>
              ) : null}
              {pocketPaperUrl ? (
                <a
                  href={pocketPaperUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  download
                  className="rounded-full border border-[var(--pkt-border)] px-5 py-2.5 text-sm text-[var(--pkt-text)] transition-colors hover:border-[var(--pkt-accent)]"
                >
                  Research paper (PDF)
                </a>
              ) : null}
              <a
                href={THESIS_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-[var(--pkt-accent)] bg-[color:color-mix(in_oklab,var(--pkt-accent)_18%,transparent)] px-5 py-2.5 text-sm text-[var(--pkt-accent)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--pkt-accent)_28%,transparent)]"
              >
                Read the Full Thesis
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  reduce,
}: {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  reduce: boolean
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
      className="rounded-lg border-t-2 border-[var(--pkt-accent)] bg-[var(--pkt-surface)] p-4 shadow-[0_0_16px_var(--pkt-accent-glow)]"
    >
      <p className="pkt-mono text-2xl font-semibold text-[var(--pkt-mono)]">
        <KineticCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
          className="!font-['JetBrains_Mono',monospace] !text-[var(--pkt-mono)] !text-2xl"
        />
      </p>
      <p className="mt-2 text-xs text-[var(--pkt-text-dim)]">{label}</p>
    </motion.div>
  )
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="pkt-display text-lg text-[var(--pkt-text)]">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--pkt-text-dim)]">{label}</p>
    </div>
  )
}

function ArchPanel({
  tabId,
  labelledBy,
  hidden,
  children,
}: {
  tabId: string
  labelledBy: string
  hidden: boolean
  children: ReactNode
}) {
  return (
    <div
      id={tabId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--pkt-text-dim)]"
    >
      {children}
    </div>
  )
}

function ChallengeCard({
  n,
  title,
  challenge,
  solution,
  badges,
  reduce,
}: {
  n: string
  title: string
  challenge: string
  solution: string
  badges: string[]
  reduce: boolean
}) {
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative overflow-hidden rounded-xl border border-[var(--pkt-border)] bg-[var(--pkt-surface)] p-6 pt-10"
    >
      <span
        className="pkt-display pointer-events-none absolute -right-2 -top-4 select-none text-[120px] leading-none text-[color:color-mix(in_oklab,var(--pkt-accent)_12%,transparent)]"
        aria-hidden
      >
        {n}
      </span>
      <div className="relative">
        <h3 className="text-base font-bold text-[var(--pkt-text)]">{title}</h3>
        <p className="mt-3 text-sm text-[var(--pkt-text-dim)]">{challenge}</p>
        <hr className="my-4 border-0 border-t border-[var(--pkt-accent)]" />
        <p className="text-sm italic text-[color:color-mix(in_oklab,var(--pkt-text)_88%,white)]">{solution}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-[var(--pkt-border)] px-2 py-0.5 text-[10px] text-[var(--pkt-text-dim)]"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function Lesson({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="relative">
      <span
        className="absolute -left-8 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--pkt-accent)] ring-4 ring-[var(--pkt-bg)]"
        aria-hidden
      />
      <p className="pkt-mono text-xs text-[var(--pkt-accent)]">Lesson {n}</p>
      <h3 className="pkt-display mt-2 text-xl text-[var(--pkt-text)]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--pkt-text-dim)]">{children}</p>
    </div>
  )
}
