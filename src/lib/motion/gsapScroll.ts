import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

export interface SmoothScrollOptions {
  offset?: number
  duration?: number
  ease?: string
  updateHash?: boolean
  onComplete?: () => void
}

/**
 * Smoothly scrolls the window to a target element ID or HTMLElement using GSAP ScrollToPlugin.
 * Accounts for reduced motion preferences, sticky header offsets, and distance-based velocity.
 */
export function smoothScrollTo(
  target: string | HTMLElement,
  options: SmoothScrollOptions = {},
): gsap.core.Tween | null {
  if (typeof window === 'undefined') return null

  const resolveElement = (): HTMLElement | null => {
    if (typeof target !== 'string') return target
    const clean = target.replace(/^#/, '')
    return (
      document.getElementById(clean) ??
      document.querySelector<HTMLElement>(`[data-project="${clean}"]`) ??
      document.querySelector<HTMLElement>(target)
    )
  }

  const el = resolveElement()
  if (!el) {
    // Fallback if target string starts with #
    if (typeof target === 'string' && options.updateHash) {
      window.location.hash = target.startsWith('#') ? target : `#${target}`
    }
    return null
  }

  const headerHeight =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--shell-header-height')) || 64
  const offset = options.offset ?? headerHeight + 16

  const targetY = el.getBoundingClientRect().top + window.scrollY - offset
  const currentY = window.scrollY
  const distance = Math.abs(targetY - currentY)

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'instant' })
    if (options.updateHash && typeof target === 'string') {
      const cleanId = target.replace(/^#/, '')
      window.history.replaceState(null, '', '#' + cleanId)
    }
    options.onComplete?.()
    return null
  }

  // Calculate dynamic duration based on scroll distance (0.65s min, 1.25s max)
  const duration = options.duration ?? Math.min(Math.max(distance / 2200, 0.65), 1.25)
  const ease = options.ease ?? 'power3.inOut'

  return gsap.to(window, {
    scrollTo: {
      y: Math.max(0, targetY),
      autoKill: false,
    },
    duration,
    ease,
    overwrite: 'auto',
    onComplete: () => {
      if (options.updateHash && typeof target === 'string') {
        const cleanId = target.replace(/^#/, '')
        window.history.replaceState(null, '', '#' + cleanId)
      }
      options.onComplete?.()
    },
  })
}

export { gsap, ScrollTrigger, ScrollToPlugin }
