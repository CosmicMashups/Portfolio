import { useMemo, useState } from 'react'

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

const WHEEL_SIZE = 360
const RADIUS = 130
const NODE_R = 22

interface NodePos {
  x: number
  y: number
  label: string
  idx: number
}

function semitoneDistance(a: number, b: number): number {
  const raw = Math.abs(a - b)
  return Math.min(raw, 12 - raw)
}

function membershipFor(dist: number): number {
  if (dist === 0) return 1
  return Math.max(0, 1 - dist / 6)
}

function colorForMu(mu: number): string {
  if (mu >= 0.85) return '#4da6ff'
  if (mu >= 0.65) return '#8b5cf6'
  if (mu >= 0.4) return '#06ffa5'
  if (mu >= 0.15) return '#f4be5c'
  return '#f48787'
}

export function KeyCompatibilityWheel() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const focusIdx = hoverIdx ?? selectedIdx

  const nodes = useMemo<NodePos[]>(() => {
    return CHROMATIC.map((label, idx) => {
      const angle = (idx / 12) * Math.PI * 2 - Math.PI / 2
      return {
        x: WHEEL_SIZE / 2 + Math.cos(angle) * RADIUS,
        y: WHEEL_SIZE / 2 + Math.sin(angle) * RADIUS,
        label,
        idx,
      }
    })
  }, [])

  const handleKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIdx((prev) => ((prev ?? 0) + 1) % 12)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIdx((prev) => ((prev ?? 0) + 11) % 12)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setSelectedIdx(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setSelectedIdx(11)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setSelectedIdx(null)
    }
  }

  const compatibilityList = useMemo(() => {
    if (focusIdx == null) return []
    return CHROMATIC.map((label, idx) => {
      const dist = semitoneDistance(focusIdx, idx)
      const mu = membershipFor(dist)
      return { label, idx, dist, mu }
    }).sort((a, b) => b.mu - a.mu)
  }, [focusIdx])

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div
        className="mh-focus-ring relative inline-block"
        tabIndex={0}
        role="group"
        aria-label="Key compatibility wheel. Use arrow keys to walk the chromatic ring."
        onKeyDown={handleKey}
      >
        <svg
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          className="h-[320px] w-[320px] sm:h-[360px] sm:w-[360px]"
          role="img"
          aria-describedby="mashhub-wheel-desc"
        >
          <desc id="mashhub-wheel-desc">
            A circular chromatic key wheel with 12 nodes. Hover or click a key to color all others by semitone
            compatibility. The tritone (6 semitones away) is highlighted in red as incompatible.
          </desc>

          <defs>
            <radialGradient id="wheel-bg-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(77, 166, 255, 0.18)" />
              <stop offset="100%" stopColor="rgba(77, 166, 255, 0)" />
            </radialGradient>
          </defs>

          <circle cx={WHEEL_SIZE / 2} cy={WHEEL_SIZE / 2} r={RADIUS + 30} fill="url(#wheel-bg-grad)" />
          <circle
            cx={WHEEL_SIZE / 2}
            cy={WHEEL_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(77, 166, 255, 0.18)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />

          {focusIdx != null
            ? nodes.map((node) => {
                if (node.idx === focusIdx) return null
                const dist = semitoneDistance(focusIdx, node.idx)
                const mu = membershipFor(dist)
                const focusNode = nodes[focusIdx]
                if (!focusNode) return null
                return (
                  <line
                    key={`chord-${node.idx}`}
                    x1={focusNode.x}
                    y1={focusNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke={colorForMu(mu)}
                    strokeOpacity={0.15 + mu * 0.65}
                    strokeWidth={1 + mu * 1.8}
                  />
                )
              })
            : null}

          {nodes.map((node) => {
            const isFocus = node.idx === focusIdx
            const isSelected = node.idx === selectedIdx
            const dist = focusIdx != null ? semitoneDistance(focusIdx, node.idx) : null
            const mu = dist != null ? membershipFor(dist) : 0
            const fill = isFocus ? '#4da6ff' : focusIdx != null ? colorForMu(mu) : 'rgba(77, 166, 255, 0.18)'
            const fillOpacity = isFocus ? 1 : focusIdx != null ? 0.12 + mu * 0.55 : 0.6
            return (
              <g key={node.label} transform={`translate(${node.x} ${node.y})`}>
                <circle
                  r={NODE_R + 4}
                  fill="none"
                  stroke={isSelected ? '#4da6ff' : 'transparent'}
                  strokeWidth={2}
                  strokeDasharray={isSelected ? undefined : '3 3'}
                  opacity={isSelected ? 0.6 : 0}
                />
                <circle
                  r={NODE_R}
                  fill={fill}
                  fillOpacity={fillOpacity}
                  stroke={isFocus ? '#e8f0ff' : 'rgba(77, 166, 255, 0.5)'}
                  strokeWidth={isFocus ? 2 : 1}
                  style={{
                    cursor: 'pointer',
                    transition: 'fill 200ms, fill-opacity 200ms, stroke 200ms',
                    filter: isFocus ? 'drop-shadow(0 0 12px rgba(77, 166, 255, 0.7))' : undefined,
                  }}
                  onClick={() => setSelectedIdx(node.idx)}
                  onMouseEnter={() => setHoverIdx(node.idx)}
                  onMouseLeave={() => setHoverIdx((curr) => (curr === node.idx ? null : curr))}
                  tabIndex={-1}
                  aria-label={`Key ${node.label}${focusIdx != null ? `, ${dist ?? 0} semitones from focus, membership ${mu.toFixed(2)}` : ''}`}
                />
                <text
                  x={0}
                  y={4}
                  textAnchor="middle"
                  className="mh-mono"
                  fontSize={12}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={600}
                  fill={isFocus ? '#000b26' : '#e8f0ff'}
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            )
          })}

          {focusIdx != null
            ? (() => {
                const focus = nodes[focusIdx]
                if (!focus) return null
                return (
                  <text
                    x={WHEEL_SIZE / 2}
                    y={WHEEL_SIZE / 2 - 6}
                    textAnchor="middle"
                    className="mh-mono"
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                    fill="#93a3c4"
                  >
                    FOCUS
                  </text>
                )
              })()
            : null}
          {focusIdx != null
            ? (
                <text
                  x={WHEEL_SIZE / 2}
                  y={WHEEL_SIZE / 2 + 14}
                  textAnchor="middle"
                  fontSize={28}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={700}
                  fill="#4da6ff"
                >
                  {CHROMATIC[focusIdx]}
                </text>
              )
            : null}
        </svg>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="mh-mono text-[11px] uppercase tracking-[0.22em] text-[var(--mashhub-text-dim)]">
            {focusIdx != null ? `Compatibility from ${CHROMATIC[focusIdx]}` : 'Hover or click a key'}
          </p>
          {selectedIdx != null ? (
            <button
              type="button"
              onClick={() => setSelectedIdx(null)}
              className="mh-mono mh-focus-ring text-[11px] text-[var(--mashhub-text-dim)] hover:text-[var(--mashhub-accent)]"
            >
              clear
            </button>
          ) : null}
        </div>

        <ul className="mh-scrollbar grid max-h-[280px] grid-cols-2 gap-1.5 overflow-y-auto pr-1" role="list">
          {compatibilityList.map((entry) => (
            <li
              key={entry.label}
              className="flex items-center justify-between rounded-md border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)] px-2.5 py-1.5"
            >
              <span className="mh-mono flex items-center gap-2 text-xs">
                <span
                  className="block h-2 w-2 rounded-full"
                  style={{ backgroundColor: colorForMu(entry.mu) }}
                  aria-hidden
                />
                <span className="text-[var(--mashhub-text)]">{entry.label}</span>
                <span className="text-[var(--mashhub-text-dim)]">·</span>
                <span className="text-[var(--mashhub-text-muted)]">{entry.dist} st</span>
              </span>
              <span className="mh-mono text-xs font-semibold" style={{ color: colorForMu(entry.mu) }}>
                {entry.mu.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <p className="mh-mono text-xs text-[var(--mashhub-text-muted)]">
          Circular semitone distance. The tritone is the only true incompatibility.
        </p>
      </div>
    </div>
  )
}
