import { useCallback, useMemo, useRef, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

const BPM_MIN = 0
const BPM_MAX = 25

function bpmMembership(diff: number): number {
  const d = Math.max(0, Math.min(BPM_MAX, diff))
  if (d <= 10) return Math.max(0, 1 - d * 0.02)
  return Math.max(0, 0.7 - (d - 11) * (0.7 / 9))
}

const CURVE_DATA = Array.from({ length: BPM_MAX * 4 + 1 }).map((_, idx) => {
  const bpm = idx / 4
  return { bpm, mu: bpmMembership(bpm) }
})

const ANCHOR_POINTS = [
  { bpm: 0, mu: 1.0 },
  { bpm: 5, mu: 0.9 },
  { bpm: 10, mu: 0.8 },
  { bpm: 11, mu: 0.7 },
  { bpm: 20, mu: 0.0 },
]

export function BpmCurveChart() {
  const [cursorBpm, setCursorBpm] = useState(7)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const handlePointer = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const rect = wrapper.getBoundingClientRect()

    const leftPad = 44
    const rightPad = 16
    const usableWidth = rect.width - leftPad - rightPad
    if (usableWidth <= 0) return

    const localX = event.clientX - rect.left - leftPad
    const ratio = Math.max(0, Math.min(1, localX / usableWidth))
    const bpm = BPM_MIN + ratio * (BPM_MAX - BPM_MIN)
    setCursorBpm(Number(bpm.toFixed(1)))
  }, [])

  const handleKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setCursorBpm((prev) => Math.max(BPM_MIN, Number((prev - 0.5).toFixed(1))))
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      setCursorBpm((prev) => Math.min(BPM_MAX, Number((prev + 0.5).toFixed(1))))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setCursorBpm(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setCursorBpm(BPM_MAX)
    }
  }, [])

  const cursorMu = useMemo(() => bpmMembership(cursorBpm), [cursorBpm])

  const calloutLeftPct = useMemo(() => {
    const ratio = (cursorBpm - BPM_MIN) / (BPM_MAX - BPM_MIN)
    return Math.max(4, Math.min(96, ratio * 100))
  }, [cursorBpm])

  return (
    <div className="space-y-4">
      <div
        ref={wrapperRef}
        className="mh-focus-ring relative h-[280px] w-full cursor-crosshair select-none rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)]/70 p-2"
        role="img"
        aria-label={`BPM compatibility curve. Cursor at ${cursorBpm.toFixed(1)} BPM difference shows membership ${cursorMu.toFixed(3)}.`}
        tabIndex={0}
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        onKeyDown={handleKey}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CURVE_DATA} margin={{ top: 16, right: 16, left: 4, bottom: 8 }}>
            <defs>
              <linearGradient id="bpm-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06ffa5" />
                <stop offset="50%" stopColor="#4da6ff" />
                <stop offset="100%" stopColor="#f48787" />
              </linearGradient>
              <linearGradient id="bpm-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4da6ff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#4da6ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(77, 166, 255, 0.12)" strokeDasharray="3 4" />
            <XAxis
              dataKey="bpm"
              type="number"
              domain={[BPM_MIN, BPM_MAX]}
              ticks={[0, 5, 10, 15, 20, 25]}
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fill: '#93a3c4' }}
              stroke="rgba(77, 166, 255, 0.3)"
              label={{
                value: 'BPM difference',
                position: 'insideBottom',
                offset: -2,
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                fill: '#93a3c4',
              }}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fill: '#93a3c4' }}
              stroke="rgba(77, 166, 255, 0.3)"
              label={{
                value: 'μ',
                angle: -90,
                position: 'insideLeft',
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                fill: '#4da6ff',
              }}
            />
            <ReferenceLine
              y={0.7}
              stroke="rgba(6, 255, 165, 0.35)"
              strokeDasharray="3 4"
              label={{
                value: 'HIGH',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                fill: '#06ffa5',
                position: 'right',
              }}
            />
            <ReferenceLine
              y={0.4}
              stroke="rgba(244, 190, 92, 0.35)"
              strokeDasharray="3 4"
              label={{
                value: 'MED',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
                fill: '#f4be5c',
                position: 'right',
              }}
            />
            <Line
              type="monotone"
              dataKey="mu"
              stroke="#4da6ff"
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
              isAnimationActive
              animationDuration={900}
            />
            <ReferenceLine
              x={cursorBpm}
              stroke="#8b5cf6"
              strokeWidth={1.5}
              strokeDasharray="2 3"
              ifOverflow="extendDomain"
            />
            <ReferenceDot
              x={cursorBpm}
              y={cursorMu}
              r={6}
              fill="#4da6ff"
              stroke="#e8f0ff"
              strokeWidth={2}
              ifOverflow="extendDomain"
            />
          </LineChart>
        </ResponsiveContainer>

        <div
          className="pointer-events-none absolute top-3 z-10 -translate-x-1/2 rounded-md border border-[color:var(--mashhub-border-strong)] bg-[color:var(--mashhub-bg)] px-3 py-2 shadow-[0_0_18px_rgba(77,166,255,0.4)]"
          style={{ left: `${calloutLeftPct}%` }}
        >
          <p className="mh-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mashhub-text-dim)]">cursor</p>
          <p className="mh-mono text-sm font-semibold text-[var(--mashhub-text)]">
            Δbpm = {cursorBpm.toFixed(1)}
          </p>
          <p className="mh-mono text-base font-bold text-[var(--mashhub-accent)]">
            μ = {cursorMu.toFixed(3)}
          </p>
        </div>
      </div>

      <p className="mh-mono text-xs text-[var(--mashhub-text-muted)]">
        Not a hard cutoff — a gradient. Songs at 12 BPM apart still score 0.68. Drag the cursor (or use arrow keys) to
        sweep the curve.
      </p>

      <div className="flex flex-wrap gap-2">
        {ANCHOR_POINTS.map((anchor) => (
          <button
            key={anchor.bpm}
            type="button"
            onClick={() => setCursorBpm(anchor.bpm)}
            className="mh-mono mh-focus-ring rounded-full border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)] px-3 py-1 text-[11px] text-[var(--mashhub-text-muted)] transition-colors hover:border-[color:var(--mashhub-border-strong)] hover:text-[var(--mashhub-accent)]"
            aria-label={`Set cursor to ${anchor.bpm} BPM difference, membership ${anchor.mu.toFixed(2)}`}
          >
            <span className="text-[var(--mashhub-accent)]">Δ{anchor.bpm}</span>
            <span className="ml-1.5 text-[var(--mashhub-text-dim)]">→ μ {anchor.mu.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
