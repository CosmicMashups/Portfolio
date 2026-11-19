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
type Offset = 'none' | 'sm' | 'lg'

interface GalleryPhoto {
  src: string
  label: string
  width: Width
  aspect: Aspect
  offset: Offset
}

const WIDTH_CLASS: Record<Width, string> = {
  lg: 'sm:w-[60%]',
  md: 'sm:w-[42%]',
  sm: 'sm:w-[30%]',
}

const ASPECT_CLASS: Record<Aspect, string> = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[3/2]',
  square: 'aspect-[4/4]',
}

const OFFSET_CLASS: Record<Offset, string> = {
  none: 'sm:mt-0',
  sm: 'sm:mt-10',
  lg: 'sm:mt-24',
}

interface GalleryStory {
  eyebrow: string
  title: string
  quote: string
  photos: GalleryPhoto[]
}

const STORIES: GalleryStory[] = [
  {
    eyebrow: '2024 — Present',
    title: 'On Site, Internship',
    quote: 'Showing up in person is still how most of the trust gets built.',
    photos: [
      { src: intern1, label: 'Manila, 2024', width: 'lg', aspect: 'landscape', offset: 'none' },
      { src: intern2, label: 'Manila, 2024', width: 'sm', aspect: 'portrait', offset: 'lg' },
      { src: intern3, label: 'Manila, 2024', width: 'md', aspect: 'square', offset: 'sm' },
      { src: intern4, label: 'Manila, 2024', width: 'sm', aspect: 'portrait', offset: 'none' },
      { src: intern5, label: 'Manila, 2024', width: 'lg', aspect: 'landscape', offset: 'lg' },
      { src: intern6, label: 'Manila, 2024', width: 'md', aspect: 'portrait', offset: 'sm' },
    ],
  },
  {
    eyebrow: '2024 — Present',
    title: 'In Front of Clients',
    quote: 'Engineering is also a people problem — explaining the trade-off is half the job.',
    photos: [
      { src: client1, label: 'Client site, 2024', width: 'md', aspect: 'portrait', offset: 'sm' },
      { src: client2, label: 'Client site, 2024', width: 'lg', aspect: 'landscape', offset: 'none' },
      { src: client3, label: 'Client site, 2024', width: 'sm', aspect: 'square', offset: 'lg' },
      { src: client4, label: 'Client site, 2024', width: 'md', aspect: 'portrait', offset: 'none' },
      { src: client5, label: 'Client site, 2024', width: 'lg', aspect: 'landscape', offset: 'sm' },
    ],
  },
]

function PhotoTile({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const alignRight = index % 2 === 1
  return (
    <div
      className={cn(
        'essay-frame flex flex-col gap-2',
        alignRight ? 'items-end text-right' : 'items-start',
        OFFSET_CLASS[photo.offset],
      )}
    >
      <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {photo.label}
      </span>
      <div className={cn('w-full overflow-hidden rounded-[var(--radius-project)]', WIDTH_CLASS[photo.width])}>
        <img
          src={photo.src}
          alt={photo.label}
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

function Story({ story }: { story: GalleryStory }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="essay-frame flex flex-col gap-3 sm:max-w-md">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)]">
          {story.eyebrow}
        </span>
        <h3 className="font-[Playfair_Display,serif] text-4xl italic leading-[1.05] text-[var(--global-text)] sm:text-5xl">
          {story.title}
        </h3>
        <p className="font-[Playfair_Display,serif] text-lg italic leading-snug text-[var(--global-text-muted)]">
          "{story.quote}"
        </p>
      </div>

      <div className="flex flex-col gap-8 sm:gap-2">
        {story.photos.map((photo, i) => (
          <PhotoTile key={photo.src} photo={photo} index={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Beyond Code — one big editorial (serif) heading + a short quote per story, then
 * photos scattered around it at staggered offsets with simple location/year labels,
 * matching landonorris.com's actual pattern (e.g. "MASTERING THE GREEN" / "2006 —
 * CURRENT" + scattered "AUSTRALIA 2024" photos) — not a giant display headline
 * repeated over every single photo.
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
        start: 'top 92%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out', overwrite: true },
          ),
        once: true,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={rootRef} className="flex flex-col gap-24">
      {STORIES.map((story) => (
        <Story key={story.title} story={story} />
      ))}
    </div>
  )
}
