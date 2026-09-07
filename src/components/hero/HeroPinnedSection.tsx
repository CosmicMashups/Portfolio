import { useRef } from 'react'
import { HeroPinnedVisual } from '@/components/hero/HeroPinnedVisual'
import { HeroSystemEntry } from '@/components/hero/HeroSystemEntry'
import { HeroRevealSection } from '@/components/hero/HeroRevealSection'

/**
 * Combines the hero and the "How I ship Systems" reveal section into one
 * pinned unit: the desk photo + phone model stay fixed in the viewport (via
 * `HeroPinnedVisual`'s `position: sticky`) for the full height of this
 * wrapper, while the hero and reveal text scroll over it in the same grid
 * cell (the standard sticky-backdrop-with-overlaid-content technique — both
 * children share `grid-area: 1 / 1` so the text's real height drives the
 * wrapper's total scrollable height without pushing the sticky visual down).
 * The visual releases and scrolls away naturally once this wrapper's box
 * ends — i.e. once "Selected Work" begins right after it.
 */
export function HeroPinnedSection() {
  const pinContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={pinContainerRef}
      className="relative isolate left-1/2 right-1/2 -mx-[50vw] -mt-[calc(var(--shell-header-height)+2.5rem)] grid w-screen grid-cols-1 grid-rows-1 sm:-mt-[calc(var(--shell-header-height)+3rem)]"
    >
      <div className="col-start-1 row-start-1">
        <HeroPinnedVisual pinContainerRef={pinContainerRef} />
      </div>
      <div className="relative z-10 col-start-1 row-start-1">
        <HeroSystemEntry />
        <HeroRevealSection />
      </div>
    </div>
  )
}
