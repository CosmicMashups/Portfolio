import {
  useCallback,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
  type RefObject,
} from 'react'
import type { ProjectEntry } from '@/config/projects.registry'
import type { ProjectSectionKey } from '@/components/projects/ProjectSubnav'
import { ProjectSubnav } from '@/components/projects/ProjectSubnav'
import { Panel } from '@/components/ui/Panel'
import { useTechnicalView } from '@/app/providers/useTechnicalView'

const AriMarketViz = lazy(() =>
  import('@/components/viz/AriMarketViz').then((m) => ({ default: m.AriMarketViz })),
)
const PocketPTViz = lazy(() =>
  import('@/components/viz/PocketPTViz').then((m) => ({ default: m.PocketPTViz })),
)
const MashHubViz = lazy(() =>
  import('@/components/viz/MashHubViz').then((m) => ({ default: m.MashHubViz })),
)
const ExpensDashMock = lazy(() =>
  import('@/components/viz/ExpensDashMock').then((m) => ({ default: m.ExpensDashMock })),
)
const RegistrarTableMock = lazy(() =>
  import('@/components/viz/RegistrarTableMock').then((m) => ({ default: m.RegistrarTableMock })),
)
const AriMarketDeepDiveLazy = lazy(() => import('@/components/projects/ProjectDeepDive_AriMarket'))

function VizLoader() {
  return (
    <Panel className="animate-pulse text-sm text-[var(--global-text-muted)]">
      Loading visualization…
    </Panel>
  )
}

export function ProjectDeepDive({ project }: { project: ProjectEntry }) {
  const { technical } = useTechnicalView()
  const [active, setActive] = useState<ProjectSectionKey>('overview')

  if (project.id === 'arimarket') {
    return (
      <Suspense fallback={<VizLoader />}>
        <div className="-mx-1 overflow-x-hidden rounded-xl border border-[var(--global-border)] sm:-mx-2">
          <AriMarketDeepDiveLazy />
        </div>
      </Suspense>
    )
  }

  const refOverview = useRef<HTMLDivElement | null>(null)
  const refDecisions = useRef<HTMLDivElement | null>(null)
  const refArchitecture = useRef<HTMLDivElement | null>(null)
  const refStack = useRef<HTMLDivElement | null>(null)
  const refViz = useRef<HTMLDivElement | null>(null)

  const scrollTo = useCallback((k: ProjectSectionKey) => {
    setActive(k)
    const map: Record<ProjectSectionKey, RefObject<HTMLDivElement | null>> = {
      overview: refOverview,
      decisions: refDecisions,
      architecture: refArchitecture,
      stack: refStack,
      viz: refViz,
    }
    window.requestAnimationFrame(() => {
      map[k].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const showViz = project.viz !== 'none'

  const vizBlock = useMemo(() => {
    switch (project.viz) {
      case 'arimarket':
        return <AriMarketViz />
      case 'pocketpt':
        return <PocketPTViz />
      case 'mashhub':
        return <MashHubViz />
      case 'expens_dashboard':
        return <ExpensDashMock />
      case 'registrar_table':
        return <RegistrarTableMock />
      default:
        return null
    }
  }, [project.viz])

  return (
    <div className="mt-8 space-y-8">
      <ProjectSubnav active={active} onChange={scrollTo} showViz={showViz} />

      <div
        ref={refOverview}
        className="scroll-mt-[calc(var(--shell-header-height)+2.5rem)] sm:scroll-mt-[calc(var(--shell-header-height)+3rem)] space-y-4"
      >
        <h4 className="text-sm font-semibold text-[var(--global-text)]">Problem → solution</h4>
        <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">
          <span className="text-[var(--global-text)]">Problem. </span>
          {project.problem}
        </p>
        <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">
          <span className="text-[var(--global-text)]">Solution. </span>
          {project.solution}
        </p>
      </div>

      <div
        ref={refDecisions}
        className="scroll-mt-[calc(var(--shell-header-height)+2.5rem)] sm:scroll-mt-[calc(var(--shell-header-height)+3rem)] space-y-4"
      >
        <h4 className="text-sm font-semibold text-[var(--global-text)]">Key engineering decisions</h4>
        <ul className="space-y-4">
          {project.decisions.map((d) => (
            <li key={d.title}>
              <Panel className="text-sm">
                <p className="font-medium text-[var(--global-text)]">{d.title}</p>
                <p className="mt-1 text-[var(--global-text-muted)]">{d.detail}</p>
              </Panel>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={refArchitecture}
        className="scroll-mt-[calc(var(--shell-header-height)+2.5rem)] sm:scroll-mt-[calc(var(--shell-header-height)+3rem)] space-y-4"
      >
        <h4 className="text-sm font-semibold text-[var(--global-text)]">Architecture</h4>
        <Panel className="font-mono text-xs leading-relaxed text-[var(--global-text-muted)]">
          {project.architectureSummary}
        </Panel>
        {technical && project.technicalNotes ? (
          <p className="text-xs text-[var(--global-text-muted)]">{project.technicalNotes}</p>
        ) : null}
      </div>

      <div
        ref={refStack}
        className="scroll-mt-[calc(var(--shell-header-height)+2.5rem)] sm:scroll-mt-[calc(var(--shell-header-height)+3rem)] space-y-4"
      >
        <h4 className="text-sm font-semibold text-[var(--global-text)]">Stack with reasoning</h4>
        <ul className="space-y-3">
          {project.stack.map((s) => (
            <li
              key={s.name}
              className="rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--accent-primary)_8%,var(--global-surface))] px-4 py-3 text-sm"
            >
              <span className="font-medium text-[var(--global-text)]">{s.name}</span>
              <span className="text-[var(--global-text-muted)]"> — {s.reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {showViz ? (
        <div
          ref={refViz}
          className="scroll-mt-[calc(var(--shell-header-height)+2.5rem)] sm:scroll-mt-[calc(var(--shell-header-height)+3rem)] space-y-4"
        >
          <h4 className="text-sm font-semibold text-[var(--global-text)]">Semi-interactive signals</h4>
          <Suspense fallback={<VizLoader />}>{vizBlock}</Suspense>
        </div>
      ) : null}
    </div>
  )
}
