import { useLenis } from '@/app/providers/lenisContext'
import { LifecycleScrollRail } from '@/components/system-overview/LifecycleScrollRail'
import { LifecycleCarousel } from '@/components/system-overview/LifecycleCarousel'

/**
 * Picks the pinned horizontal scroll rail when the full desktop motion experience is
 * active (non-null Lenis — i.e. pointer: fine, not reduced motion, not low-tier; see
 * ScrollRoot), falling back to the existing drag/snap carousel otherwise. Mirrors how
 * useChapterSnap gates its own desktop-only behavior on the same `useLenis()` check.
 */
export function LifecycleSection() {
  const lenis = useLenis()
  return lenis ? <LifecycleScrollRail /> : <LifecycleCarousel />
}
