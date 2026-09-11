import { HeroPinnedSection } from '@/components/hero/HeroPinnedSection'
import HomePageBelowFold from '@/components/home/HomePageBelowFold'

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="text-left outline-none">
      <HeroPinnedSection />
      <HomePageBelowFold />
    </main>
  )
}
