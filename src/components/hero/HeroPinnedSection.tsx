import { HeroSystemEntry } from '@/components/hero/HeroSystemEntry'

/**
 * Origin chapter: the full-bleed portrait hero. No longer pins a sticky
 * background visual — the portrait itself is the hero's only photographic
 * element, so there is nothing separate left to hold in place while scrolling
 * past it. Manifesto and How I Build are separate chapters composed directly
 * in HomePage.
 */
export function HeroPinnedSection() {
  return <HeroSystemEntry />
}
