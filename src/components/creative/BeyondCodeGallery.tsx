import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'
import { cn } from '@/components/ui/cn'

import intern1 from '@/assets/internship/intern_1.jpg'
import intern2 from '@/assets/internship/intern_2.jpg'
import intern3 from '@/assets/internship/intern_3.jpg'
import intern4 from '@/assets/internship/intern_4.jpg'
import intern5 from '@/assets/internship/intern_5.jpg'
import intern6 from '@/assets/internship/intern_6.jpg'
import client1 from '@/assets/client/client_1.jpg'
import client2 from '@/assets/client/client_2.jpg'
import client3 from '@/assets/client/client_3.jpg'
import client4 from '@/assets/client/client_4.jpg'
import client5 from '@/assets/client/client_5.jpg'

interface GalleryPhoto {
  src: string
  tag: string
  /** Width as a fraction of the row, matching landonorris.com's varied, non-uniform image sizing. */
  width: 'lg' | 'md' | 'sm'
}

const WIDTH_CLASS: Record<GalleryPhoto['width'], string> = {
  lg: 'sm:w-[66%]',
  md: 'sm:w-[54%]',
  sm: 'sm:w-[44%]',
}

const INTERNSHIP_PHOTOS: GalleryPhoto[] = [
  { src: intern1, tag: 'On-site, 01', width: 'lg' },
  { src: intern2, tag: 'On-site, 02', width: 'sm' },
  { src: intern3, tag: 'On-site, 03', width: 'md' },
  { src: intern4, tag: 'On-site, 04', width: 'sm' },
  { src: intern5, tag: 'On-site, 05', width: 'lg' },
  { src: intern6, tag: 'On-site, 06', width: 'md' },
]

const CLIENT_PHOTOS: GalleryPhoto[] = [
  { src: client1, tag: 'Engagement, 01', width: 'md' },
  { src: client2, tag: 'Engagement, 02', width: 'lg' },
  { src: client3, tag: 'Engagement, 03', width: 'sm' },
  { src: client4, tag: 'Engagement, 04', width: 'md' },
  { src: client5, tag: 'Engagement, 05', width: 'lg' },
]

function PhotoRow({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const alignRight = index % 2 === 1
  return (
    <div className={cn('essay-frame flex flex-col gap-2', alignRight ? 'items-end text-right' : 'items-start')}>
      <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent-primary)]">
        {photo.tag}
      </span>
      <div className={cn('w-full overflow-hidden rounded-[var(--radius-project)]', WIDTH_CLASS[photo.width])}>
        <img
          src={photo.src}
          alt={photo.tag}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-[1.03] sm:aspect-[4/3]"
        />
      </div>
    </div>
  )
}

/**
 * Beyond Code — asymmetric, alternating-alignment photo layout with captions placed
 * above each image (not overlaid), matching landonorris.com's actual off-track
 * gallery (checked directly at landonorris.com/off-track): varied image sizes,
 * alternating left/right placement, generous whitespace, grouped under small
 * sub-section labels — not a uniform centered stack with gradient-overlay captions.
 */
export function BeyondCodeGallery() {
  const reduce = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reduce || !rootRef.current) return
    const frames = rootRef.current.querySelectorAll('.essay-frame')
    if (frames.length === 0) return

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(frames, {
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', overwrite: true },
          ),
        once: true,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={rootRef} className="flex flex-col gap-16">
      <div className="flex flex-col gap-8">
        <h3 className="font-[var(--font-display)] text-2xl uppercase tracking-[-0.01em] text-[var(--global-text)] sm:text-3xl">
          On Site — Internship
        </h3>
        {INTERNSHIP_PHOTOS.map((photo, i) => (
          <PhotoRow key={photo.src} photo={photo} index={i} />
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <h3 className="font-[var(--font-display)] text-2xl uppercase tracking-[-0.01em] text-[var(--global-text)] sm:text-3xl">
          In Front of Clients
        </h3>
        {CLIENT_PHOTOS.map((photo, i) => (
          <PhotoRow key={photo.src} photo={photo} index={i} />
        ))}
      </div>
    </div>
  )
}
