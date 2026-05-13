import { HeroSystemEntry } from '@/components/hero/HeroSystemEntry'
import { SystemOverview } from '@/components/system-overview/SystemOverview'
import { ProjectsShowcaseSection } from '@/components/projects/ProjectsShowcaseSection'
import { ImpactHomeSection } from '@/components/impact/ImpactHomeSection'
import { SkillsHomeSection } from '@/components/skills/SkillsHomeSection'
import { CreativeHomeSection } from '@/components/creative/CreativeHomeSection'
import { CredibilityHomeSection } from '@/components/credibility/CredibilityHomeSection'
import { ProjectsAccentGuard } from '@/components/home/ProjectsAccentGuard'

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="text-left outline-none">
      <ProjectsAccentGuard />
      <HeroSystemEntry />
      <SystemOverview />
      <ProjectsShowcaseSection />
      <ImpactHomeSection />
      <SkillsHomeSection />
      <CreativeHomeSection />
      <CredibilityHomeSection />
    </main>
  )
}
