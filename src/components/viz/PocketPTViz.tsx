import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ml from "@/data/viz/pocketpt.ml.json";

import { ChartShell } from "@/components/viz/ChartShell";

import { useTechnicalView } from "@/app/providers/useTechnicalView";

export function PocketPTViz() {
  const { technical } = useTechnicalView();

  const { poseTrainVal, confusion, labels, trainVal, classificationReport } =
    ml;

  return (
    <div className="space-y-4">
      <ChartShell
        title="Pose estimation: train vs validation (OKS)"
        description="Illustrative OKS-style curves for the on-device pose head — exports align with the case-study metrics."
        technical={
          technical ? (
            <span>
              Checkpoint picked on val OKS; cosine LR schedule with early stop
              on val plateau.
            </span>
          ) : null
        }
      >
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={poseTrainVal}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.2)"
            />

            <XAxis dataKey="epoch" tick={{ fontSize: 10 }} />

            <YAxis domain={[0.6, 0.95]} tick={{ fontSize: 10 }} />

            <Tooltip
              contentStyle={{
                background: "var(--global-surface)",

                border: "1px solid var(--global-border)",

                fontSize: 11,
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="train"
              stroke="var(--chart-a)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="val"
              stroke="var(--chart-d)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      {technical ? (
        <>
          <div className="overflow-x-auto">
            <p className="mb-2 text-xs font-semibold text-[var(--global-text)]">
              Auxiliary classifier — confusion matrix
            </p>

            <table className="w-full min-w-[240px] border-collapse text-center text-xs">
              <thead>
                <tr>
                  <th className="border border-[var(--global-border)] p-1" />

                  {labels.map((l) => (
                    <th
                      key={l}
                      className="border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--accent-primary)_12%,transparent)] p-1 font-medium text-[var(--global-text)]"
                    >
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {confusion.map((row, i) => (
                  <tr key={labels[i]}>
                    <th className="border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--accent-primary)_12%,transparent)] p-1 text-[var(--global-text)]">
                      {labels[i]}
                    </th>

                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border border-[var(--global-border)] p-1 font-mono text-[var(--global-text-muted)]"
                        style={{
                          background: `color-mix(in oklab, var(--chart-c) ${Math.min(85, cell)}%, transparent)`,
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ChartShell
            title="Auxiliary classifier: train vs validation accuracy"
            description="Separate head from the pose stack — illustrative curves; real exports surface in Technical View footnotes."
            technical={
              <span>
                Epoch scheduling: cosine decay · early stop on macro-F1 (val).
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trainVal}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.2)"
                />

                <XAxis dataKey="epoch" tick={{ fontSize: 10 }} />

                <YAxis domain={[0.5, 1]} tick={{ fontSize: 10 }} />

                <Tooltip
                  contentStyle={{
                    background: "var(--global-surface)",

                    border: "1px solid var(--global-border)",

                    fontSize: 11,
                  }}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="train"
                  stroke="var(--chart-a)"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="val"
                  stroke="var(--chart-d)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartShell>

          <ChartShell
            title="Classification report (macro view)"
            description="Per-class precision / recall / F1."
          >
            <div className="font-mono text-[10px] leading-relaxed text-[var(--global-text-muted)]">
              <div className="grid grid-cols-3 gap-2 border-b border-[var(--global-border)] pb-1 text-[var(--global-text)]">
                <span>precision</span>

                <span>recall</span>

                <span>f1</span>
              </div>

              {labels.map((l, i) => (
                <div
                  key={l}
                  className="grid grid-cols-3 gap-2 border-b border-[var(--global-border)] py-1"
                >
                  <span className="text-[var(--global-text)]">{l}</span>

                  <span>{classificationReport.precision[i]?.toFixed(2)}</span>

                  <span>{classificationReport.recall[i]?.toFixed(2)}</span>

                  <span className="col-span-3 text-[var(--global-text-muted)]">
                    f1 {classificationReport.f1[i]?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </ChartShell>
        </>
      ) : null}
    </div>
  );
}
