import { useEffect } from 'react'
import { useThemeAccent } from '@/app/providers/useThemeAccent'

/** Clears stale project accent when leaving the projects section viewport. */
export function ProjectsAccentGuard() {
  const { setActiveProjectId } = useThemeAccent()

  useEffect(() => {
    const el = document.getElementById('projects')
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) setActiveProjectId(null)
      },
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [setActiveProjectId])

  return null
}
