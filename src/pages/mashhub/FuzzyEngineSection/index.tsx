import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { BpmCurveChart } from './BpmCurveChart'
import { KeyCompatibilityWheel } from './KeyCompatibilityWheel'
import { SugenoRuleTable } from './SugenoRuleTable'

interface SubsectionProps {
  kicker: string
  title: string
  caption: string
  children: React.ReactNode
  delay?: number
}

function Subsection({ kicker, title, caption, children, delay = 0 }: SubsectionProps) {
  const reduce = usePrefersReducedMotion()

  return (
    <motion.div
      className="rounded-[var(--radius-project)] border border-[color:var(--mashhub-border)] bg-[color:var(--mashhub-surface)]/60 p-6 sm:p-8"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 flex flex-col gap-2">
        <p className="mh-mono text-[11px] uppercase tracking-[0.3em] text-[var(--mashhub-electric)]">{kicker}</p>
        <h3 className="mh-display text-xl font-semibold text-[var(--mashhub-text)] sm:text-2xl">{title}</h3>
        <p className="max-w-2xl text-sm text-[var(--mashhub-text-muted)]">{caption}</p>
      </div>
      {children}
    </motion.div>
  )
}

export function FuzzyEngineSection() {
  return (
    <section
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
      aria-labelledby="mashhub-engine-title"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-3">
          <p className="mh-mono text-xs uppercase tracking-[0.3em] text-[var(--mashhub-accent)]">
            // matching engine
          </p>
          <h2
            id="mashhub-engine-title"
            className="mh-display max-w-3xl text-3xl font-semibold tracking-tight text-[var(--mashhub-text)] sm:text-4xl md:text-5xl"
          >
            The fuzzy logic engine, opened up
          </h2>
          <p className="max-w-3xl text-base text-[var(--mashhub-text-muted)]">
            A Sugeno-type inference engine — interpretable, deterministic, and entirely client-side. BPM proximity and
            key compatibility become smooth graded memberships, not yes/no filters.
          </p>
        </div>

        <Subsection
          kicker="3a · fuzzification — BPM"
          title="BPM membership curve"
          caption="Piecewise bell. Drag the cursor across the X-axis to see live μ values from the actual scoring function."
        >
          <BpmCurveChart />
        </Subsection>

        <Subsection
          kicker="3b · fuzzification — KEY"
          title="Key compatibility wheel"
          caption="The 12-tone chromatic ring with circular semitone distance. Click a key to compare it against the other 11."
          delay={0.08}
        >
          <KeyCompatibilityWheel />
        </Subsection>

        <Subsection
          kicker="3c · defuzzification — Sugeno"
          title="Weighted IF-THEN rule aggregation"
          caption="Each rule produces a μ, multiplied by its variable weight. The defuzzified score is the weighted average — continuous, transparent, auditable."
          delay={0.16}
        >
          <SugenoRuleTable />
        </Subsection>
      </div>
    </section>
  )
}
