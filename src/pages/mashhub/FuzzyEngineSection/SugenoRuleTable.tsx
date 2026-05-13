import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

interface Rule {
  condition: string
  variable: 'BPM' | 'KEY'
  mu: number
  weight: number
}

const RULES: Rule[] = [
  { condition: 'BPM diff = 0', variable: 'BPM', mu: 1.0, weight: 0.45 },
  { condition: 'BPM diff = 5', variable: 'BPM', mu: 0.9, weight: 0.45 },
  { condition: 'BPM diff = 10', variable: 'BPM', mu: 0.8, weight: 0.45 },
  { condition: 'Key dist = 0', variable: 'KEY', mu: 1.0, weight: 0.45 },
  { condition: 'Key dist = 1', variable: 'KEY', mu: 0.95, weight: 0.45 },
  { condition: 'Key dist = 3', variable: 'KEY', mu: 0.8, weight: 0.45 },
  { condition: 'Key dist = 6 (tritone)', variable: 'KEY', mu: 0.0, weight: 0.45 },
]

function muColor(mu: number): string {
  if (mu >= 0.85) return '#06ffa5'
  if (mu >= 0.65) return '#4da6ff'
  if (mu >= 0.4) return '#8b5cf6'
  if (mu >= 0.15) return '#f4be5c'
  return '#f48787'
}

export function SugenoRuleTable() {
  const reduce = usePrefersReducedMotion()

  return (
    <div className="overflow-hidden rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <caption className="sr-only">
            Sugeno IF-THEN rules: each condition produces a membership μ, multiplied by a weight, summing to weighted
            output z.
          </caption>
          <thead>
            <tr className="border-b border-[color:var(--mashhub-border-strong)] bg-[color:var(--mashhub-surface-elevated)]">
              <th
                scope="col"
                className="mh-mono px-4 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-[var(--mashhub-accent)]"
              >
                IF condition
              </th>
              <th
                scope="col"
                className="mh-mono px-4 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-[var(--mashhub-accent)]"
              >
                Var
              </th>
              <th
                scope="col"
                className="mh-mono px-4 py-3 text-left text-[11px] uppercase tracking-[0.18em] text-[var(--mashhub-accent)]"
              >
                Membership (μ)
              </th>
              <th
                scope="col"
                className="mh-mono px-4 py-3 text-right text-[11px] uppercase tracking-[0.18em] text-[var(--mashhub-accent)]"
              >
                Weight
              </th>
              <th
                scope="col"
                className="mh-mono px-4 py-3 text-right text-[11px] uppercase tracking-[0.18em] text-[var(--mashhub-accent)]"
              >
                THEN z
              </th>
            </tr>
          </thead>
          <tbody>
            {RULES.map((rule, idx) => {
              const z = rule.mu * rule.weight
              return (
                <motion.tr
                  key={`${rule.variable}-${rule.condition}`}
                  className="border-b border-[color:var(--mashhub-border)] last:border-b-0"
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <td className="mh-mono px-4 py-3 text-sm text-[var(--mashhub-text)]">{rule.condition}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`mh-mono inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        rule.variable === 'BPM'
                          ? 'border-[color:var(--mashhub-accent-glow)] bg-[color:var(--mashhub-accent-dim)] text-[var(--mashhub-accent)]'
                          : 'border-[color:rgba(139,92,246,0.4)] bg-[color:var(--mashhub-electric-dim)] text-[var(--mashhub-electric)]'
                      }`}
                    >
                      {rule.variable}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-[color:var(--mashhub-bg)]">
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            background: `linear-gradient(to right, ${muColor(0)}, ${muColor(rule.mu)})`,
                          }}
                          initial={reduce ? { width: `${rule.mu * 100}%` } : { width: 0 }}
                          whileInView={reduce ? undefined : { width: `${rule.mu * 100}%` }}
                          viewport={{ once: true, margin: '-10% 0px' }}
                          transition={{ duration: 0.7, delay: idx * 0.08 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <span
                        className="mh-mono w-12 text-sm font-semibold"
                        style={{ color: muColor(rule.mu) }}
                      >
                        {rule.mu.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="mh-mono px-4 py-3 text-right text-sm text-[var(--mashhub-text-muted)]">
                    ×{rule.weight.toFixed(2)}
                  </td>
                  <td className="mh-mono px-4 py-3 text-right text-sm font-semibold text-[var(--mashhub-text)]">
                    {z.toFixed(4)}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-[color:var(--mashhub-border-strong)] bg-[color:var(--mashhub-surface-elevated)]">
              <td colSpan={4} className="mh-mono px-4 py-3 text-right text-[11px] uppercase tracking-[0.18em] text-[var(--mashhub-text-dim)]">
                Defuzzified score (weighted average) ≈
              </td>
              <td className="mh-mono px-4 py-3 text-right text-base font-bold text-[var(--mashhub-accent)]">
                {(RULES.reduce((acc, r) => acc + r.mu * r.weight, 0) / RULES.reduce((acc, r) => acc + r.weight, 0)).toFixed(3)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
