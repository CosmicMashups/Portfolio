import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import metrics from '@/data/viz/arimarket.metrics.json'
import { ChartShell } from '@/components/viz/ChartShell'
import { useTechnicalView } from '@/app/providers/useTechnicalView'

export function AriMarketViz() {
  const { technical } = useTechnicalView()
  const [commodity, setCommodity] = useState<string>('All')

  const series = metrics.metricsSeries

  const scatterFiltered = useMemo(() => {
    if (commodity === 'All') return metrics.scatter
    return metrics.scatter.filter((d) => d.commodity === commodity)
  }, [commodity])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[var(--global-text-muted)]">Commodity filter</span>
        <select
          className="rounded border border-[var(--global-border)] bg-[var(--global-surface)] px-2 py-1 text-[var(--global-text)]"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
        >
          {metrics.commodities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <ChartShell
        title="Error metrics by training phase"
        description="MAE, MSE, RMSE on a held-out commodity split (illustrative fixtures)."
        technical={
          technical ? (
            <span className="font-mono">
              Validation: chronological block hold-out · Huber loss in production trainer (not shown).
            </span>
          ) : null
        }
      >
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{
                background: 'var(--global-surface)',
                border: '1px solid var(--global-border)',
                fontSize: 11,
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="mae" stroke="var(--chart-a)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="mse" stroke="var(--chart-c)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="rmse" stroke="var(--chart-b)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell
        title="Prediction residual scatter"
        description="Each point is a sliding-window evaluation bucket (x: volatility proxy, y: absolute error)."
      >
        <ResponsiveContainer width="100%" height={220}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis type="number" dataKey="x" name="vol" tick={{ fontSize: 10 }} />
            <YAxis type="number" dataKey="y" name="err" tick={{ fontSize: 10 }} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'var(--global-surface)',
                border: '1px solid var(--global-border)',
                fontSize: 11,
              }}
            />
            <Scatter
              name="train"
              data={scatterFiltered.filter((d) => d.split === 'train')}
              fill="var(--chart-a)"
            />
            <Scatter
              name="val"
              data={scatterFiltered.filter((d) => d.split === 'val')}
              fill="var(--chart-b)"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  )
}
