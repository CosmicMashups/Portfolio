import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ProjectsShowcaseSection } from '@/components/projects/ProjectsShowcaseSection'
import { ImpactHomeSection } from '@/components/impact/ImpactHomeSection'
import { SkillsHomeSection } from '@/components/skills/SkillsHomeSection'
import { CreativeHomeSection } from '@/components/creative/CreativeHomeSection'
import { CredibilityHomeSection } from '@/components/credibility/CredibilityHomeSection'
import { ProjectsAccentGuard } from '@/components/home/ProjectsAccentGuard'

/** Everything below the hero — lazy-loaded from HomePage to shrink the initial bundle. */
export default function HomePageBelowFold() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash !== '#projects') return
    const id = window.requestAnimationFrame(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [hash])

  return (
    <>
      <ProjectsAccentGuard />
      <ProjectsShowcaseSection />
      <ImpactHomeSection />
      <SkillsHomeSection />
      <CreativeHomeSection />
      <CredibilityHomeSection />
    </>
  )
}
