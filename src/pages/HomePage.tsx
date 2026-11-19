import { HeroPinnedSection } from '@/components/hero/HeroPinnedSection'
import HomePageBelowFold from '@/components/home/HomePageBelowFold'
import { useChapterSnap } from '@/hooks/useChapterSnap'

export function HomePage() {
  useChapterSnap()

  return (
    <main id="main-content" tabIndex={-1} className="text-left outline-none">
      <HeroPinnedSection />
      <HomePageBelowFold />
    </main>
  )
}
