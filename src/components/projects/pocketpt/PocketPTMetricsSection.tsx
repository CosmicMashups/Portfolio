import { lazy, Suspense, Fragment } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { motion } from 'framer-motion'
import { KineticCounter } from '@/components/ui/KineticCounter'
import {
  CONFUSION_MATRIX,
  JOINT_ANKLE_PCT,
  JOINT_HIP_PCT,
  JOINT_SHOULDER_PCT,
  JOINT_WRIST_PCT,
  LSTM_ANGLE_ERROR_REDUCTION,
  LSTM_TEMPORAL_CONSISTENCY,
  POSE_CNN_ACCURACY,
  POSE_CNN_MAP50,
  PAIN_CNN_F1,
  PAIN_CNN_WEIGHTED_ACCURACY,
  PAIN_SEVERE_RECALL,
} from '@/components/projects/pocketpt/pocketptConstants'

const PocketPTIsoRadar = lazy(() => import('@/components/projects/pocketpt/PocketPTIsoRadar'))

const EASE = [0.16, 1, 0.3, 1] as const

const COLORS = {
  strong: 'var(--pkt-accent)',
  amber: '#D4A017',
  orange: '#E07B39',
  muted: '#7A4040',
} as const

type HeatJoint = {
  label: string
  cx: number
  cy: number
  r?: number
  color: keyof typeof COLORS
  tooltip: string
}

const HEAT_JOINTS: HeatJoint[] = [
  {
    label: 'Nose',
    cx: 60,
    cy: 34,
    color: 'amber',
    tooltip: 'Nose — mid-range keypoint band (70–78%) in thesis evaluation grouping.',
  },
  {
    label: 'L eye',
    cx: 56,
    cy: 28,
    color: 'amber',
    tooltip: 'Left eye — mid-range keypoint band (70–78%).',
  },
  {
    label: 'R eye',
    cx: 64,
    cy: 28,
    color: 'amber',
    tooltip: 'Right eye — mid-range keypoint band (70–78%).',
  },
  {
    label: 'L ear',
    cx: 52,
    cy: 32,
    color: 'orange',
    tooltip: 'Left ear — mid-to-lower band (60–69%) per thesis keypoint grouping.',
  },
  {
    label: 'R ear',
    cx: 68,
    cy: 32,
    color: 'orange',
    tooltip: 'Right ear — mid-to-lower band (60–69%) per thesis keypoint grouping.',
  },
  {
    label: 'L shoulder',
    cx: 46,
    cy: 56,
    color: 'strong',
    tooltip: `Left shoulder — ${JOINT_SHOULDER_PCT}% (strong detection).`,
  },
  {
    label: 'R shoulder',
    cx: 74,
    cy: 56,
    color: 'strong',
    tooltip: `Right shoulder — ${JOINT_SHOULDER_PCT}% (strong detection).`,
  },
  {
    label: 'L elbow',
    cx: 42,
    cy: 78,
    color: 'orange',
    tooltip: 'Left elbow — mid-to-lower band (60–69%) per thesis keypoint grouping.',
  },
  {
    label: 'R elbow',
    cx: 78,
    cy: 78,
    color: 'orange',
    tooltip: 'Right elbow — mid-to-lower band (60–69%) per thesis keypoint grouping.',
  },
  {
    label: 'L wrist',
    cx: 38,
    cy: 104,
    color: 'muted',
    tooltip: `Left wrist — ${JOINT_WRIST_PCT}% (extremity tracking challenge; mitigated by LSTM smoothing).`,
  },
  {
    label: 'R wrist',
    cx: 82,
    cy: 104,
    color: 'muted',
    tooltip: `Right wrist — ${JOINT_WRIST_PCT}% (extremity tracking challenge; mitigated by LSTM smoothing).`,
  },
  {
    label: 'L hip',
    cx: 52,
    cy: 88,
    color: 'amber',
    tooltip: `Left hip — ${JOINT_HIP_PCT}% (upper mid-range).`,
  },
  {
    label: 'R hip',
    cx: 68,
    cy: 88,
    color: 'amber',
    tooltip: `Right hip — ${JOINT_HIP_PCT}% (upper mid-range).`,
  },
  {
    label: 'L knee',
    cx: 50,
    cy: 118,
    color: 'amber',
    tooltip: 'Left knee — mid-range keypoint band (70–78%) in thesis evaluation grouping.',
  },
  {
    label: 'R knee',
    cx: 70,
    cy: 118,
    color: 'amber',
    tooltip: 'Right knee — mid-range keypoint band (70–78%) in thesis evaluation grouping.',
  },
  {
    label: 'L ankle',
    cx: 48,
    cy: 156,
    color: 'muted',
    tooltip: `Left ankle — ${JOINT_ANKLE_PCT}% (distal extremity; LSTM temporal consistency helps).`,
  },
  {
    label: 'R ankle',
    cx: 72,
    cy: 156,
    color: 'muted',
    tooltip: `Right ankle — ${JOINT_ANKLE_PCT}% (distal extremity; LSTM temporal consistency helps).`,
  },
]

const HEAT_EDGES: [number, number, number, number][] = [
  [60, 34, 56, 28],
  [60, 34, 64, 28],
  [56, 28, 52, 32],
  [64, 28, 68, 32],
  [60, 34, 46, 56],
  [60, 34, 74, 56],
  [46, 56, 42, 78],
  [74, 56, 78, 78],
  [42, 78, 38, 104],
  [78, 78, 82, 104],
  [46, 56, 52, 88],
  [74, 56, 68, 88],
  [52, 88, 50, 118],
  [68, 88, 70, 118],
  [50, 118, 48, 156],
  [70, 118, 72, 156],
]

function BodyHeatmap() {
  return (
    <Tooltip.Provider delayDuration={80}>
      <div>
        <p className="pkt-mono text-xs uppercase tracking-wider text-[var(--pkt-text-dim)]">
          Per-joint detection (thesis)
        </p>
        <svg
          className="mx-auto mt-4 h-auto w-full max-w-[200px]"
          viewBox="0 0 120 180"
          role="img"
          aria-label="Stick figure heatmap of pose model keypoint reliability with tooltips on hover."
        >
          {HEAT_EDGES.map(([x1, y1, x2, y2], i) => (
            <line
              key={`he-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(232,227,220,0.2)"
              strokeWidth={1.2}
              strokeLinecap="round"
            />
          ))}
          {HEAT_JOINTS.map((j) => (
            <Tooltip.Root key={j.label}>
              <Tooltip.Trigger asChild>
                <circle
                  cx={j.cx}
                  cy={j.cy}
                  r={j.r ?? 4}
                  fill={COLORS[j.color]}
                  className="cursor-default stroke-[var(--pkt-border)] stroke-[0.5] transition-[filter] hover:brightness-110"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(192,57,43,0.25))' }}
                />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  className="z-50 max-w-[240px] rounded-md border border-[var(--pkt-border)] bg-[var(--pkt-surface)] px-2 py-1.5 text-[11px] text-[var(--pkt-text)]"
                >
                  {j.tooltip}
                  <Tooltip.Arrow className="fill-[var(--pkt-surface)]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </svg>
      </div>
    </Tooltip.Provider>
  )
}

function ConfusionMatrix() {
  const max = Math.max(...CONFUSION_MATRIX.flat())
  const labels = ['Low', 'Mod', 'Sev']
  const rows = ['Low', 'Mod', 'Sev'] as const
  return (
    <div>
      <p className="pkt-mono text-xs uppercase tracking-wider text-[var(--pkt-text-dim)]">
        Pain classifier confusion (counts)
      </p>
      <div className="mt-4 overflow-x-auto">
        <div className="inline-grid min-w-[280px] grid-cols-4 gap-px rounded-lg border border-[var(--pkt-border)] bg-[var(--pkt-border)] p-px">
          <div className="bg-[var(--pkt-surface)] p-2" />
          {labels.map((l) => (
            <div
              key={l}
              className="pkt-mono bg-[var(--pkt-surface)] p-2 text-center text-[10px] text-[var(--pkt-text-dim)]"
            >
              {l}
            </div>
          ))}
          {rows.map((row, ri) => (
            <Fragment key={row}>
              <div className="pkt-mono flex items-center bg-[var(--pkt-surface)] p-2 text-[10px] text-[var(--pkt-text-dim)]">
                {row}
              </div>
              {CONFUSION_MATRIX[ri]?.map((cell, ci) => {
                const isDiag = ri === ci
                const opacity = isDiag ? 1 : 0.12 + (cell / max) * 0.45
                return (
                  <div
                    key={`c-${ri}-${ci}`}
                    className="pkt-mono flex items-center justify-center bg-[var(--pkt-surface)] p-3 text-sm text-[var(--pkt-text)]"
                    style={{
                      backgroundColor: isDiag
                        ? 'color-mix(in oklab, var(--pkt-accent) 85%, var(--pkt-surface))'
                        : `color-mix(in oklab, var(--pkt-accent) ${Math.round(opacity * 100)}%, var(--pkt-surface))`,
                    }}
                  >
                    {cell}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
        <p className="pkt-mono mt-2 text-[10px] text-[var(--pkt-text-dim)]">Predicted →</p>
      </div>
    </div>
  )
}

export function PocketPTMetricsSection({ reduce }: { reduce: boolean }) {
  return (
    <section
      id="pocketpt-metrics"
      className="scroll-mt-[calc(var(--shell-header-height)+2rem)] border-b border-[var(--pkt-border)] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="pkt-mono text-xs uppercase tracking-[0.2em] text-[var(--pkt-accent)]">04 / METRICS</p>
        <h2 className="pkt-display mt-2 text-3xl text-[var(--pkt-text)] sm:text-4xl">Model performance dashboard</h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Pose CNN accuracy',
              value: POSE_CNN_ACCURACY,
              decimals: 1,
              suffix: '%',
              sub: `mAP@0.5: ${POSE_CNN_MAP50}%`,
              tertiary: 'Standalone CNN vs hybrid',
            },
            {
              title: 'Pain CNN accuracy',
              value: PAIN_CNN_WEIGHTED_ACCURACY,
              decimals: 2,
              suffix: '%',
              sub: `F1: ${PAIN_CNN_F1}%`,
              tertiary: 'Weighted validation',
            },
            {
              title: 'Severe pain recall',
              value: PAIN_SEVERE_RECALL,
              decimals: 0,
              suffix: '%',
              sub: 'Zero misses on severe',
              tertiary: 'Clinical safety priority',
            },
            {
              title: 'LSTM angle error reduction',
              value: LSTM_ANGLE_ERROR_REDUCTION,
              decimals: 0,
              prefix: '-',
              suffix: '%',
              sub: `${LSTM_TEMPORAL_CONSISTENCY}% temporal consistency`,
              tertiary: '16-frame window (~0.5s)',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE }}
              className="border-t-2 border-[var(--pkt-accent)] bg-[var(--pkt-surface)] p-5 shadow-[0_0_24px_var(--pkt-accent-glow)]"
            >
              <p className="text-xs font-medium text-[var(--pkt-text-dim)]">{card.title}</p>
              <div className="pkt-display mt-2 text-4xl text-[var(--pkt-text)]">
                <KineticCounter
                  value={card.value}
                  prefix={card.prefix}
                  suffix={card.suffix}
                  decimals={card.decimals}
                  className="!font-['DM_Serif_Display',Georgia,serif] !text-[var(--pkt-text)] !text-4xl"
                />
              </div>
              <p className="pkt-mono mt-1 text-xs text-[var(--pkt-mono)]">{card.sub}</p>
              <p className="mt-2 text-xs text-[var(--pkt-text-dim)]">{card.tertiary}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            className="rounded-xl border border-[var(--pkt-border)] bg-[color:color-mix(in_oklab,var(--pkt-surface)_88%,black)] p-6"
          >
            <BodyHeatmap />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            className="rounded-xl border border-[var(--pkt-border)] bg-[color:color-mix(in_oklab,var(--pkt-surface)_88%,black)] p-6"
          >
            <ConfusionMatrix />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          className="mt-10 rounded-xl border border-[var(--pkt-border)] bg-[var(--pkt-surface)] p-6"
        >
          <p className="pkt-mono text-xs uppercase tracking-wider text-[var(--pkt-text-dim)]">
            ISO/IEC 25010 quality radar
          </p>
          <Suspense
            fallback={
              <div className="pkt-mono mt-4 h-[280px] animate-pulse rounded-lg bg-[#0d1014] text-xs text-[var(--pkt-text-dim)]">
                Loading chart…
              </div>
            }
          >
            <PocketPTIsoRadar reduce={reduce} />
          </Suspense>
        </motion.div>
      </div>
    </section>
  )
}
