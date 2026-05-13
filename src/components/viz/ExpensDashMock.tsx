import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TooltipContentProps } from 'recharts/types/component/Tooltip'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { Lightbulb, Sparkles, ShieldCheck } from 'lucide-react'
import { ChartShell } from '@/components/viz/ChartShell'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { useTechnicalView } from '@/app/providers/useTechnicalView'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { motionEase } from '@/lib/motion/presets'
import { cn } from '@/components/ui/cn'

interface CategoryDatum {
  name: string
  value: number
  amount: number
  color: string
}

const CATEGORIES: CategoryDatum[] = [
  { name: 'Food & Dining', value: 38, amount: 2371, color: 'var(--color-accent-tertiary)' },
  { name: 'Transport', value: 22, amount: 1373, color: 'var(--accent-secondary)' },
  { name: 'Utilities', value: 18, amount: 1123, color: 'var(--color-text-secondary)' },
  { name: 'Entertainment', value: 12, amount: 749, color: 'var(--color-error)' },
  { name: 'Other', value: 10, amount: 624, color: 'var(--color-text-muted)' },
]

interface WeeklyDatum {
  day: string
  amount: number
  tx: number
}

const WEEKLY: WeeklyDatum[] = [
  { day: 'Mon', amount: 820, tx: 3 },
  { day: 'Tue', amount: 1450, tx: 5 },
  { day: 'Wed', amount: 1120, tx: 4 },
  { day: 'Thu', amount: 980, tx: 4 },
  { day: 'Fri', amount: 2640, tx: 7 },
  { day: 'Sat', amount: 3180, tx: 9 },
  { day: 'Sun', amount: 1840, tx: 5 },
]

const INSIGHTS: { icon: typeof Lightbulb; text: string }[] = [
  { icon: Lightbulb, text: 'Dining spend peaked Tuesday — consider meal prepping' },
  { icon: Sparkles, text: 'Transport costs up 18% vs last week' },
  { icon: ShieldCheck, text: 'You stayed under budget 5 of 7 days' },
]

const SCORE = 73
const BALANCE = 24830.5
const BUDGET = 10000
const SPENT = 6240

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const panelVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: motionEase } },
}

function pesoCurrency(value: number, decimals = 0): string {
  return `₱${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

function TechBadge({ children }: { children: string }) {
  return (
    <span
      className="pointer-events-none absolute right-2 top-2 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]"
      aria-hidden
    >
      {children}
    </span>
  )
}

function PanelShell({
  children,
  className,
  techBadge,
  technical,
}: {
  children: React.ReactNode
  className?: string
  techBadge: string
  technical: boolean
}) {
  return (
    <motion.div
      variants={panelVariant}
      className={cn(
        'relative rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/70 p-4',
        className,
      )}
    >
      {technical ? <TechBadge>{techBadge}</TechBadge> : null}
      {children}
    </motion.div>
  )
}

function WalletPanel({ reduce, technical }: { reduce: boolean; technical: boolean }) {
  const ratio = SPENT / BUDGET
  return (
    <PanelShell techBadge="sqflite · SharedPreferences (Web)" technical={technical}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--global-text-muted)]">
        Wallet balance
      </p>
      <p className="mt-1.5 flex items-baseline gap-1 text-2xl font-semibold tracking-tight text-[var(--global-text)]">
        <KineticCounter
          value={BALANCE}
          prefix="₱"
          decimals={2}
          className="!font-[var(--font-display)] !text-2xl !text-[var(--global-text)]"
        />
      </p>
      <div className="mt-4 space-y-1.5">
        <div className="flex items-baseline justify-between font-mono text-[11px] text-[var(--global-text-muted)]">
          <span>This month</span>
          <span className="text-[var(--global-text)]">
            {pesoCurrency(SPENT)} <span className="text-[var(--global-text-muted)]">of {pesoCurrency(BUDGET)}</span>
          </span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent-primary)]"
            initial={reduce ? { width: `${ratio * 100}%` } : { width: 0 }}
            whileInView={{ width: `${ratio * 100}%` }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: motionEase, delay: 0.15 }}
          />
        </div>
        <p className="font-mono text-[10px] text-[var(--global-text-muted)]">
          {Math.round(ratio * 100)}% of monthly budget
        </p>
      </div>
    </PanelShell>
  )
}

function CategoryPiePanel({ reduce, technical }: { reduce: boolean; technical: boolean }) {
  const [hovered, setHovered] = useState<CategoryDatum | null>(null)
  const center = hovered ?? CATEGORIES[0]!
  return (
    <PanelShell techBadge="fl_chart (native) · recharts (mock)" technical={technical}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--global-text-muted)]">
        Category breakdown
      </p>
      <div className="relative mt-2 h-[150px] w-full">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={CATEGORIES}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={2}
              stroke="transparent"
              isAnimationActive={!reduce}
              animationDuration={reduce ? 0 : 900}
              onMouseEnter={(_, idx) => setHovered(CATEGORIES[idx] ?? null)}
              onMouseLeave={() => setHovered(null)}
            >
              {CATEGORIES.map((c) => (
                <Cell
                  key={c.name}
                  fill={c.color}
                  style={{
                    transition: 'filter 200ms var(--ease-out-expo)',
                    filter:
                      hovered?.name === c.name
                        ? 'drop-shadow(0 0 12px color-mix(in oklab, var(--accent-primary) 45%, transparent)) brightness(1.08)'
                        : 'none',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--global-text-muted)]">
            {center.name}
          </p>
          <p className="text-base font-semibold text-[var(--global-text)]">{center.value}%</p>
          <p className="font-mono text-[10px] text-[var(--global-text-muted)]">{pesoCurrency(center.amount)}</p>
        </div>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1">
        {CATEGORIES.map((c) => (
          <li key={c.name} className="flex items-center gap-1.5 text-[11px] text-[var(--global-text-muted)]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: c.color }}
              aria-hidden
            />
            <span className="truncate">{c.name}</span>
            <span className="ml-auto font-mono text-[var(--global-text)]">{c.value}%</span>
          </li>
        ))}
      </ul>
    </PanelShell>
  )
}

function BarTooltip(props: TooltipContentProps<ValueType, NameType>) {
  const { active, payload } = props
  if (!active || !payload || payload.length === 0) return null
  const datum = payload[0]?.payload as WeeklyDatum | undefined
  if (!datum) return null
  return (
    <div className="rounded border border-[var(--global-border)] bg-[var(--global-surface)] px-2 py-1.5 font-mono text-[11px] text-[var(--global-text)] shadow-[var(--shadow-glass)]">
      <p className="text-[var(--global-text)]">{pesoCurrency(datum.amount)}</p>
      <p className="text-[10px] text-[var(--global-text-muted)]">
        {datum.tx} transactions · {datum.day}
      </p>
    </div>
  )
}

function WeeklyBarPanel({ reduce, technical }: { reduce: boolean; technical: boolean }) {
  return (
    <PanelShell techBadge="fl_chart (native) · recharts (mock)" technical={technical}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--global-text-muted)]">
        This week
      </p>
      <p className="mt-1 text-sm text-[var(--global-text)]">
        <span className="font-semibold">{pesoCurrency(WEEKLY.reduce((s, w) => s + w.amount, 0))}</span>
        <span className="text-[var(--global-text-muted)]"> spent across 7 days</span>
      </p>
      <div className="mt-3 h-[150px] w-full">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={WEEKLY} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="expensBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity={0.65} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: 'var(--global-text-muted)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--global-border)' }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--global-text-muted)' }}
              tickLine={false}
              axisLine={false}
              domain={[0, 3500]}
              ticks={[0, 1000, 2000, 3500]}
              tickFormatter={(v: number) => `₱${(v / 1000).toFixed(v >= 1000 ? 1 : 0)}k`}
            />
            <Tooltip
              cursor={{ fill: 'color-mix(in oklab, var(--accent-primary) 8%, transparent)' }}
              content={BarTooltip}
            />
            <Bar
              dataKey="amount"
              radius={[4, 4, 0, 0]}
              fill="url(#expensBarGradient)"
              isAnimationActive={!reduce}
              animationDuration={reduce ? 0 : 900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PanelShell>
  )
}

function ScoreDial({ reduce }: { reduce: boolean }) {
  const size = 116
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const target = c * (1 - SCORE / 100)
  return (
    <div className="relative h-[116px] w-[116px] shrink-0">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-bg-elevated)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? { strokeDashoffset: target } : { strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: target }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.4, ease: motionEase, delay: 0.2 }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <KineticCounter
          value={SCORE}
          className="!font-[var(--font-display)] !text-3xl !text-[var(--global-text)]"
        />
        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--global-text-muted)]">
          score
        </span>
      </div>
    </div>
  )
}

function ScoreInsightsPanel({ reduce, technical }: { reduce: boolean; technical: boolean }) {
  return (
    <PanelShell techBadge="SmartInsightsService · on-device" technical={technical}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--global-text-muted)]">
        Spending score
      </p>
      <div className="mt-2 flex items-start gap-4">
        <ScoreDial reduce={reduce} />
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-[var(--accent-primary)]">Good</p>
          <p className="text-[11px] text-[var(--global-text-muted)]">
            Top 34% of tracked users this week
          </p>
          <motion.ul
            className="mt-3 space-y-1.5"
            variants={container}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
          >
            {INSIGHTS.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={panelVariant}
                className="flex items-start gap-2 rounded border border-[var(--color-border-subtle)] bg-[var(--global-surface)] px-2 py-1.5 text-[11px] text-[var(--global-text)]"
              >
                <Icon
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-primary)]"
                  aria-hidden
                />
                <span className="leading-snug">{text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </PanelShell>
  )
}

function ExpensDashMockInner() {
  const reduce = usePrefersReducedMotion()
  const { technical } = useTechnicalView()
  return (
    <ChartShell
      title="Live Dashboard"
      description="Simulated expens.io data — wallet balance, category mix, weekly spend, and on-device spending score."
      contentClassName="!h-auto !min-h-0 !text-sm"
    >
      <motion.div
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        variants={container}
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-10%' }}
      >
        <WalletPanel reduce={reduce} technical={technical} />
        <CategoryPiePanel reduce={reduce} technical={technical} />
        <WeeklyBarPanel reduce={reduce} technical={technical} />
        <ScoreInsightsPanel reduce={reduce} technical={technical} />
      </motion.div>
    </ChartShell>
  )
}

export const ExpensDashMock = memo(ExpensDashMockInner)
