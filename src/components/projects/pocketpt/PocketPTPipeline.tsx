import { useRef } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/components/ui/cn'

const EASE = [0.16, 1, 0.3, 1] as const

const NODES: {
  id: string
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  tip: string
}[] = [
  {
    id: 'cam',
    x: 24,
    y: 28,
    w: 132,
    h: 76,
    lines: ['Camera', 'Feed'],
    tip: 'Live frames captured on-device with no cloud round-trip for pose assessment.',
  },
  {
    id: 'yolo',
    x: 176,
    y: 28,
    w: 148,
    h: 76,
    lines: ['CNN Spatial', '(YOLO11s)', 'Pose Est.'],
    tip: 'YOLO11s-pose estimates 17 body keypoints with ImageNet pretraining for mobile efficiency.',
  },
  {
    id: 'lstm',
    x: 340,
    y: 28,
    w: 148,
    h: 76,
    lines: ['LSTM Temporal', 'Smoother', '16-frame win.'],
    tip: 'A 16-frame temporal window (~0.5s) stabilizes joint angles before clinical rules consume them.',
  },
  {
    id: 'rules',
    x: 504,
    y: 28,
    w: 168,
    h: 76,
    lines: ['Rule-Based', 'Decision Tree', 'Rehab Plan Gen'],
    tip: 'Deterministic rules translate assessments into CSV-backed exercise and treatment selections.',
  },
  {
    id: 'fer',
    x: 24,
    y: 168,
    w: 148,
    h: 76,
    lines: ['ResNet-18', '(KD CNN)', 'FER Model'],
    tip: 'Distilled ResNet-18 reads facial pain cues from the camera stream in parallel with pose.',
  },
  {
    id: 'pain',
    x: 192,
    y: 168,
    w: 168,
    h: 76,
    lines: ['Pain Level', 'Classifier', 'Low · Mod · Severe'],
    tip: 'Three-class pain output gates exercise intensity and safety constraints in the planner.',
  },
  {
    id: 'plan',
    x: 176,
    y: 288,
    w: 496,
    h: 92,
    lines: ['Personalized Rehab Plan', '(Week-by-Week)'],
    tip: 'Merged pose, pain, and intake fields produce an auditable week-by-week rehabilitation plan.',
  },
]

const EDGES: { id: string; d: string; delay: number }[] = [
  { id: 'e1', d: 'M 156 66 L 176 66', delay: 0.35 },
  { id: 'e2', d: 'M 324 66 L 340 66', delay: 0.42 },
  { id: 'e3', d: 'M 488 66 L 504 66', delay: 0.49 },
  { id: 'e4', d: 'M 90 104 L 90 168', delay: 0.56 },
  { id: 'e5', d: 'M 172 206 L 192 206', delay: 0.63 },
  { id: 'e6', d: 'M 276 244 L 424 288', delay: 0.7 },
  { id: 'e7', d: 'M 588 104 L 588 260 L 670 288', delay: 0.77 },
]

function NodeBox({
  node,
  index,
  reduce,
  drawn,
}: {
  node: (typeof NODES)[number]
  index: number
  reduce: boolean
  drawn: boolean
}) {
  const pad = 8
  const lineHeight = 12
  const startY = node.y + pad + 10

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={drawn || reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.45, delay: index * 0.1, ease: EASE }}
          style={{
            cursor: 'default',
            transformOrigin: `${node.x + node.w / 2}px ${node.y + node.h / 2}px`,
          }}
          whileHover={reduce ? undefined : { scale: 1.02 }}
        >
          <rect
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx={10}
            className="fill-[var(--pkt-surface)] stroke-[var(--pkt-border)]"
            strokeWidth={1}
            style={{ filter: 'drop-shadow(0 0 14px var(--pkt-accent-glow))' }}
          />
          {node.lines.map((line, i) => (
            <text
              key={line}
              x={node.x + pad}
              y={startY + i * lineHeight}
              className="fill-[var(--pkt-mono)]"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9 }}
            >
              {line}
            </text>
          ))}
        </motion.g>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className={cn(
            'z-50 max-w-[220px] rounded-md border px-2.5 py-2 text-xs shadow-lg',
            'border-[var(--pkt-border)] bg-[var(--pkt-surface)] text-[var(--pkt-text)]',
          )}
        >
          {node.tip}
          <Tooltip.Arrow className="fill-[var(--pkt-surface)]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

export function PocketPTPipeline({ reduce }: { reduce: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const drawn = useInView(wrapRef, { once: true, margin: '-10% 0px' })

  return (
    <Tooltip.Provider delayDuration={120}>
      <div ref={wrapRef} className="w-full overflow-x-auto">
        <svg
          className="mx-auto block h-auto w-full min-w-[300px] max-w-[760px]"
          viewBox="0 0 720 400"
          role="img"
          aria-label="PocketPT on-device AI pipeline from camera through CNN pose estimation, LSTM temporal smoothing, parallel facial pain classification, rule engine, to personalized rehabilitation plan output."
        >
          <defs>
            <filter id="pkt-pipe-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {EDGES.map((e) => (
            <motion.path
              key={e.id}
              d={e.d}
              fill="none"
              stroke="var(--pkt-accent-dim)"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#pkt-pipe-glow)"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              animate={drawn || reduce ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.1, delay: e.delay, ease: EASE }}
            />
          ))}
          {NODES.map((node, index) => (
            <NodeBox key={node.id} node={node} index={index} reduce={reduce} drawn={drawn} />
          ))}
        </svg>
      </div>
    </Tooltip.Provider>
  )
}
