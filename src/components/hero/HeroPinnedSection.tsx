import { HeroSystemEntry } from '@/components/hero/HeroSystemEntry'
import { HeroRevealSection } from '@/components/hero/HeroRevealSection'

/**
 * Origin chapter: a full-bleed portrait hero (HeroSystemEntry) followed by the
 * How I Build reveal. No longer pins a sticky background visual — the portrait
 * itself is the hero's only photographic element, so there is nothing separate
 * left to hold in place while scrolling past it.
 */
export function HeroPinnedSection() {
  return (
    <>
      <HeroSystemEntry />
      <HeroRevealSection />
    </>
  )
}
