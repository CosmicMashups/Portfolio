import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import rules from '@/data/viz/mashhub.rules.json'
import { ChartShell } from '@/components/viz/ChartShell'
import { useTechnicalView } from '@/app/providers/useTechnicalView'

export function MashHubViz() {
  const { technical } = useTechnicalView()
  const [weights, setWeights] = useState(() =>
    Object.fromEntries(rules.weights.map((w) => [w.id, w.value])),
  )

  const weightBars = useMemo(
    () =>
      rules.weights.map((w) => ({
        id: w.label,
        v: weights[w.id] ?? w.value,
      })),
    [weights],
  )

  const blended = useMemo(() => {
    const sum = rules.weights.reduce((acc, w) => acc + (weights[w.id] ?? w.value), 0)
    return Math.max(0.15, Math.min(1, sum / rules.weights.length))
  }, [weights])

  const bpmAdjusted = useMemo(
    () =>
      rules.bpmMembership.map((p) => ({
        bpm: p.bpm,
        mu: Math.min(1, p.mu * (0.85 + blended * 0.35)),
      })),
    [blended],
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-xs">
        <p className="font-semibold text-[var(--global-text)]">Matching rule weights</p>
        {rules.weights.map((w) => (
          <label key={w.id} className="flex items-center gap-3">
            <span className="w-36 text-[var(--global-text-muted)]">{w.label}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={weights[w.id] ?? w.value}
              onChange={(e) =>
                setWeights((prev) => ({ ...prev, [w.id]: Number(e.target.value) }))
              }
              className="flex-1 accent-[var(--accent-primary)]"
            />
            <span className="font-mono text-[var(--global-text)] w-10">
              {(weights[w.id] ?? w.value).toFixed(2)}
            </span>
          </label>
        ))}
        {technical ? (
          <p className="text-[11px] text-[var(--global-text-muted)]">
            Blend factor adjusts downstream fuzzy membership curves — mirrors live rule engine behavior at a high
            level.
          </p>
        ) : null}
      </div>

      <ChartShell
        title="Rule weights snapshot"
        description="Interactive weighting drives downstream BPM/key compatibility scoring."
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weightBars}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="id" tick={{ fontSize: 9 }} interval={0} angle={-12} textAnchor="end" height={48} />
            <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: 'var(--global-surface)',
                border: '1px solid var(--global-border)',
                fontSize: 11,
              }}
            />
            <Bar dataKey="v" fill="var(--chart-c)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartShell title="BPM membership (weighted)" description="Key and BPM fuzzy envelopes — illustrative.">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={bpmAdjusted}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="bpm" type="number" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--global-surface)',
                  border: '1px solid var(--global-border)',
                  fontSize: 11,
                }}
              />
              <Line type="monotone" dataKey="mu" stroke="var(--chart-a)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
        <ChartShell title="Key distance membership" description="Semitone distance vs fuzzy gain.">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rules.keyMembership}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="semitones" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--global-surface)',
                  border: '1px solid var(--global-border)',
                  fontSize: 11,
                }}
              />
              <Line type="monotone" dataKey="mu" stroke="var(--chart-d)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>
    </div>
  )
}
