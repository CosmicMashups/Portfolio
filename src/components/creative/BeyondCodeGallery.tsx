import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '@/lib/motion/gsapScroll'

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
  caption: string
  track: 'On Track' | 'Off Track'
}

const PHOTOS: GalleryPhoto[] = [
  { src: intern1, caption: 'Internship, on-site', track: 'Off Track' },
  { src: client1, caption: 'Client engagement', track: 'Off Track' },
  { src: intern2, caption: 'Internship, on-site', track: 'Off Track' },
  { src: client2, caption: 'Client engagement', track: 'Off Track' },
  { src: intern3, caption: 'Internship, on-site', track: 'Off Track' },
  { src: client3, caption: 'Client engagement', track: 'Off Track' },
  { src: intern4, caption: 'Internship, on-site', track: 'Off Track' },
  { src: client4, caption: 'Client engagement', track: 'Off Track' },
  { src: intern5, caption: 'Internship, on-site', track: 'Off Track' },
  { src: client5, caption: 'Client engagement', track: 'Off Track' },
  { src: intern6, caption: 'Internship, on-site', track: 'Off Track' },
]

/**
 * Beyond Code — one large captioned photo at a time, landonorris.com's photo-essay
 * pacing ("QATAR, 2024" style captions) rather than a grid. Engineering is the "on
 * track" story everywhere else on this page; this is the "off track" half.
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
        start: 'top 85%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', overwrite: true },
          ),
        once: true,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={rootRef} className="flex flex-col gap-10">
      <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)]">
        On track / off track
      </p>
      {PHOTOS.map((photo, i) => (
        <div
          key={photo.src}
          className="essay-frame relative mx-auto w-full max-w-3xl overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)]"
        >
          <img
            src={photo.src}
            alt={`${photo.caption} ${i + 1}`}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover sm:aspect-video"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 py-4">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-accent-primary)]">
              {photo.track}
            </span>
            <p className="mt-0.5 font-[var(--font-display)] text-lg uppercase tracking-[-0.01em] text-[#f5f5f0]">
              {photo.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
