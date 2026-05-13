import { useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { NAV_SECTIONS } from '@/config/navigation'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/components/ui/cn'
import { SkipLink } from '@/components/ui/SkipLink'
import { ToggleTechnical } from '@/components/ui/ToggleTechnical'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { MeshGradient } from '@/components/ui/MeshGradient'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { PageTransition } from '@/components/ui/PageTransition'
import { useState } from 'react'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function CursorGlow() {
  const reduce = usePrefersReducedMotion()

  if (reduce) return null

  return (
    <div
      id="cursor-glow"
      className="pointer-events-none fixed -left-1/2 -top-1/2 h-[42vmin] w-[42vmin] rounded-full opacity-0 blur-3xl"
      style={{
        background:
          'radial-gradient(circle at center, color-mix(in oklab, var(--accent-primary) 35%, transparent), transparent 60%)',
      }}
      aria-hidden
    />
  )
}

function GridBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[var(--z-noise)] opacity-[0.14]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
      aria-hidden
    />
  )
}

export function AppShell() {
  const location = useLocation()
  const activeSection = useActiveSection()
  const isHome = location.pathname === '/'
  const dots = useMemo(() => NAV_SECTIONS, [])
  const [navSolid, setNavSolid] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (value) => setNavSolid(value > 60))

  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <SkipLink />
      <ToggleTechnical />
      <MeshGradient />
      <ScrollProgressBar />
      <CustomCursor />
      <GridBackdrop />
      <CursorGlow />
      <FlowLines />
      <header
        className="fixed inset-x-0 top-0 z-[var(--z-nav)] transition-all duration-400"
        style={{
          background: navSolid ? 'rgba(7, 7, 15, 0.8)' : 'transparent',
          backdropFilter: navSolid ? 'blur(20px) saturate(180%)' : 'blur(0px)',
          borderBottom: navSolid ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-[var(--shell-content-max-width)] items-center justify-between px-[var(--shell-gutter-sm)] sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]">
          <NavLink to="/" className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text-primary)]">
            YB
          </NavLink>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink to="/" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              Home
            </NavLink>
            <NavLink
              to="/#projects"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Projects
            </NavLink>
            <NavLink
              to="/thoughts"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Thoughts
            </NavLink>
          </nav>
          <a href="#" className="rounded-full border border-[var(--color-border-default)] px-3 py-1.5 text-xs">
            Resume
          </a>
        </div>
      </header>
      <div className="relative z-[var(--z-content)] mx-auto max-w-[var(--shell-content-max-width)] px-[var(--shell-gutter-sm)] pb-28 pt-[calc(var(--shell-header-height)+2.5rem)] sm:px-[var(--shell-gutter-md)] sm:pb-32 sm:pt-[calc(var(--shell-header-height)+3rem)] lg:px-[var(--shell-gutter-lg)]">
        <div>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
      {isHome ? (
        <nav
          className="pointer-events-auto fixed bottom-10 right-6 top-1/2 z-[var(--z-floating)] hidden -translate-y-1/2 flex-col gap-3 xl:flex"
          aria-label="Section map"
        >
          {dots.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              title={s.label}
              className={cn(
                'group relative flex h-8 w-8 items-center justify-center rounded-full border border-[var(--global-border)] bg-[var(--global-surface)]/80 text-[10px] text-[var(--global-text-muted)] backdrop-blur transition-colors hover:border-[var(--accent-primary)]',
                activeSection === s.id && 'border-[var(--accent-primary)] text-[var(--accent-primary)]',
              )}
            >
              <span className="sr-only">{s.label}</span>
              <span aria-hidden>{s.short}</span>
              {activeSection === s.id ? (
                <motion.span
                  className="absolute inset-0 rounded-full border border-[var(--color-accent-primary)]"
                  animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
              ) : null}
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  )
}

function FlowLines() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[var(--z-noise)] opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="fl" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 120 Q 400 80 900 140 T 1800 100" stroke="url(#fl)" fill="none" strokeWidth="1" />
      <path d="M0 420 Q 500 360 1100 400 T 2200 380" stroke="url(#fl)" fill="none" strokeWidth="1" />
    </svg>
  )
}
