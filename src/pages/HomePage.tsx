import { Suspense, lazy } from 'react'
import { HeroPinnedSection } from '@/components/hero/HeroPinnedSection'
import { Panel } from '@/components/ui/Panel'

const HomePageBelowFold = lazy(() => import('@/components/home/HomePageBelowFold'))

function BelowFoldFallback() {
  return (
    <div className="py-16" aria-busy="true" aria-label="Loading page sections">
      <Panel className="mx-auto max-w-lg text-center text-sm text-[var(--global-text-muted)]">
        Loading sections…
      </Panel>
    </div>
  )
}

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="text-left outline-none">
      <HeroPinnedSection />
      <Suspense fallback={<BelowFoldFallback />}>
        <HomePageBelowFold />
      </Suspense>
    </main>
  )
}
