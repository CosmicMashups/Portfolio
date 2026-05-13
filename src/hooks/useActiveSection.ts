import { useEffect, useState } from 'react'
import { NAV_SECTIONS } from '@/config/navigation'

export function useActiveSection(): string {
  const [active, setActive] = useState(NAV_SECTIONS[0]?.id ?? 'hero')

  useEffect(() => {
    const nodes = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[]

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))
        const top = visible[0]?.target
        if (top?.id) setActive(top.id)
      },
      { root: null, rootMargin: '-40% 0px -45% 0px', threshold: [0.01, 0.25, 0.5] },
    )

    for (const n of nodes) obs.observe(n)
    return () => obs.disconnect()
  }, [])

  return active
}
