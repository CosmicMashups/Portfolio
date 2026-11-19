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

type Width = 'lg' | 'md' | 'sm'
type Aspect = 'portrait' | 'landscape' | 'square'

interface GalleryPhoto {
  src: string
  eyebrow: string
  caption: string
  width: Width
  aspect: Aspect
}

const WIDTH_CLASS: Record<Width, string> = {
  lg: 'sm:w-[66%]',
  md: 'sm:w-[54%]',
  sm: 'sm:w-[42%]',
}

const ASPECT_CLASS: Record<Aspect, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
  square: 'aspect-[4/4]',
}

const INTERNSHIP_PHOTOS: GalleryPhoto[] = [
  { src: intern1, eyebrow: 'Manila, 2024', caption: 'Onboarding week', width: 'lg', aspect: 'landscape' },
  { src: intern2, eyebrow: 'On-site, 02', caption: 'Standups and whiteboards', width: 'sm', aspect: 'portrait' },
  { src: intern3, eyebrow: 'On-site, 03', caption: 'Deployment day', width: 'md', aspect: 'square' },
  { src: intern4, eyebrow: 'On-site, 04', caption: 'Shipping under deadline', width: 'sm', aspect: 'portrait' },
  { src: intern5, eyebrow: 'On-site, 05', caption: 'Team retro', width: 'lg', aspect: 'landscape' },
  { src: intern6, eyebrow: 'On-site, 06', caption: 'Closing the sprint', width: 'md', aspect: 'portrait' },
]

const CLIENT_PHOTOS: GalleryPhoto[] = [
  { src: client1, eyebrow: 'Engagement, 01', caption: 'Discovery session', width: 'md', aspect: 'portrait' },
  { src: client2, eyebrow: 'Engagement, 02', caption: 'Walking the requirements', width: 'lg', aspect: 'landscape' },
  { src: client3, eyebrow: 'Engagement, 03', caption: 'Live demo', width: 'sm', aspect: 'square' },
  { src: client4, eyebrow: 'Engagement, 04', caption: 'Sign-off', width: 'md', aspect: 'portrait' },
  { src: client5, eyebrow: 'Engagement, 05', caption: 'Handover', width: 'lg', aspect: 'landscape' },
]

function PhotoRow({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const alignRight = index % 2 === 1
  return (
    <div className={cn('essay-frame flex flex-col gap-3', alignRight ? 'items-end text-right' : 'items-start')}>
      <div className="flex flex-col gap-0.5">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)]">
          {photo.eyebrow}
        </span>
        <span className="font-[var(--font-display)] text-2xl uppercase leading-[0.95] tracking-[-0.01em] text-[var(--global-text)] sm:text-4xl">
          {photo.caption}
        </span>
      </div>
      <div className={cn('w-full overflow-hidden rounded-[var(--radius-project)]', WIDTH_CLASS[photo.width])}>
        <img
          src={photo.src}
          alt={photo.caption}
          loading="lazy"
          className={cn(
            'w-full object-cover transition-transform duration-500 hover:scale-[1.03]',
            ASPECT_CLASS[photo.aspect],
          )}
        />
      </div>
    </div>
  )
}

/**
 * Beyond Code — asymmetric, alternating-alignment photo layout with heavy editorial
 * captions above each image and mixed portrait/landscape/square aspect ratios,
 * matching landonorris.com's actual off-track gallery (checked directly at
 * landonorris.com/off-track) rather than a uniform grid with overlay labels.
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
