import { lazy, Suspense, type ReactNode } from 'react'
import type { VizKind } from '@/config/project.types'
import { cn } from '@/components/ui/cn'

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

function VizFrame({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none h-full max-h-[120px] min-h-[100px] w-full overflow-hidden opacity-95">
      <div className="origin-top scale-[0.72] transform-gpu">{children}</div>
    </div>
  )
}

export function ProjectVizPeek({ viz }: { viz: VizKind }) {
  let inner: ReactNode = null
  if (viz === 'arimarket') {
    inner = <AriMarketViz />
  } else if (viz === 'pocketpt') {
    inner = <PocketPTViz />
  } else if (viz === 'mashhub') {
    inner = <MashHubViz />
  } else if (viz === 'expens_dashboard') {
    inner = <ExpensDashMock />
  } else if (viz === 'registrar_table') {
    inner = <RegistrarTableMock />
  }

  if (!inner) {
    return (
      <div className="flex h-full min-h-[72px] items-center px-4 text-[10px] text-[var(--global-text-muted)]">
        Preview unavailable
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="h-16 animate-pulse rounded-md bg-[color:color-mix(in_oklab,var(--accent-primary)_12%,transparent)]" />
      }
    >
      <VizFrame>{inner}</VizFrame>
    </Suspense>
  )
}

export function ProjectVizPeekCaption({ className }: { className?: string }) {
  return (
    <p className={cn('text-[10px] text-[var(--global-text-muted)]', className)}>
      Live preview (scaled); open case study for full interaction.
    </p>
  )
}
