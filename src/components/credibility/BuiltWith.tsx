import { Card } from '@/components/ui/Card'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'

const STACK: { name: string; why: string }[] = [
  { name: 'React 19 + TypeScript', why: 'Strict UI contracts and safer refactors for a page that is mostly state + motion + data viz.' },
  { name: 'Vite', why: 'Fast feedback and sane code-splitting for lazy graph/chart chunks.' },
  { name: 'Tailwind CSS v4', why: 'Tokenized layout velocity while keeping a single dark shell.' },
  { name: 'Framer Motion', why: 'Scroll-linked reveals with an explicit reduced-motion escape hatch.' },
  { name: 'Recharts', why: 'Composable charts that inherit CSS variables from the active project accent bundle.' },
  { name: '@xyflow/react', why: 'Skills as a real graph with incident edges instead of badge soup.' },
  { name: 'Lenis', why: 'Optional smooth scrolling — disabled automatically when reduced motion is requested.' },
]

export function BuiltWith() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-[var(--global-text)]">Built with</h3>
      <ul className="mt-4 space-y-3">
        {STACK.map((s) => (
          <TiltCard key={s.name} maxTilt={6}>
            <BorderTrace>
              <li className="rounded-xl border border-[var(--global-border)] p-6 text-sm">
                <span className="font-medium text-[var(--global-text)]">{s.name}</span>
                <p className="mt-1 text-[var(--global-text-muted)]">{s.why}</p>
              </li>
            </BorderTrace>
          </TiltCard>
        ))}
      </ul>
    </Card>
  )
}
