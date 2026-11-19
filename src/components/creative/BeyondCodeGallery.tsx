import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { PeekPreview } from '@/components/ui/PeekPreview'
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
}

const INTERNSHIP_PHOTOS: GalleryPhoto[] = [
  { src: intern1, caption: 'On-site, internship' },
  { src: intern2, caption: 'On-site, internship' },
  { src: intern3, caption: 'On-site, internship' },
  { src: intern4, caption: 'On-site, internship' },
  { src: intern5, caption: 'On-site, internship' },
  { src: intern6, caption: 'On-site, internship' },
]

const CLIENT_PHOTOS: GalleryPhoto[] = [
  { src: client1, caption: 'Client engagement' },
  { src: client2, caption: 'Client engagement' },
  { src: client3, caption: 'Client engagement' },
  { src: client4, caption: 'Client engagement' },
  { src: client5, caption: 'Client engagement' },
]

function PhotoTile({ photo, index }: { photo: GalleryPhoto; index: number }) {
  return (
    <div className="gallery-tile overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)]">
      <PeekPreview
        previewContent={
          <div className="flex h-full items-end px-3 pb-2.5">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-inverse)]">
              {photo.caption}
            </span>
          </div>
        }
      >
        <img
          src={photo.src}
          alt={`${photo.caption} ${index + 1}`}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </PeekPreview>
    </div>
  )
}

/**
 * Beyond Code — an on-track/off-track-style split mirroring the chapter's role in the
 * narrative: engineering is the "on track" story everywhere else, this is the "off
 * track" half — who I am in the field and in front of clients.
 */
export function BeyondCodeGallery() {
  const reduce = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reduce || !rootRef.current) return
    const tiles = rootRef.current.querySelectorAll('.gallery-tile')
    if (tiles.length === 0) return

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(tiles, {
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', overwrite: true },
          ),
        once: true,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={rootRef} className="space-y-10">
      <div>
        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)]">
          On site — internship
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {INTERNSHIP_PHOTOS.map((photo, i) => (
            <PhotoTile key={photo.src} photo={photo} index={i} />
          ))}
        </div>
      </div>

      <div>
        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)]">
          In front of clients
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CLIENT_PHOTOS.map((photo, i) => (
            <PhotoTile key={photo.src} photo={photo} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
