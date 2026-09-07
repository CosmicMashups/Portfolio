import { useMemo, useState, type CSSProperties } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'framer-motion'
import { FileText, Menu, Moon, Sun, X } from 'lucide-react'
import { NAV_SECTIONS } from '@/config/navigation'
import { RESUME_PDF_URL } from '@/config/resume'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/components/ui/cn'
import { SkipLink } from '@/components/ui/SkipLink'
import { ToggleTechnical } from '@/components/ui/ToggleTechnical'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { PageTransition } from '@/components/ui/PageTransition'
import { useContactDialog } from '@/components/ui/ContactDialog'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { useTheme } from '@/app/providers/ThemeProvider'
import logoMark from '@/assets/cosmicmashups.jpg'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Top nav and the floating section-map dots are chrome that sits over the hero's
 * fixed dark photo backdrop on every route — pinned to dark-mode's palette
 * (matching `:root[data-theme='dark']` in design-system.css) regardless of the
 * site's own light/dark toggle, rather than following it like page content does.
 */
const PINNED_DARK_CHROME_VARS = {
  '--color-bg-base': '#1c3a13',
  '--color-bg-surface': '#1c3a13',
  '--color-bg-elevated': '#1c3a13',
  '--color-bg-glass': 'rgba(252, 252, 247, 0.04)',
  '--color-bg-glass-hover': 'rgba(252, 252, 247, 0.07)',
  '--color-text-primary': '#fcfcf7',
  '--color-text-secondary': '#fcfcf7',
  '--color-text-muted': '#c4c7c4',
  '--color-text-inverse': '#1c3a13',
  '--color-accent-primary': '#d3fa99',
  '--color-accent-primary-dim': 'rgba(211, 250, 153, 0.14)',
  '--color-border-subtle': 'rgba(252, 252, 247, 0.08)',
  '--color-border-default': '#fcfcf7',
  '--color-border-strong': 'rgba(252, 252, 247, 0.24)',
} as CSSProperties

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-primary)]"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
    </button>
  )
}

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { open, toggle: toggleContactDialog } = useContactDialog()
  const activeSection = useActiveSection()
  const isHome = location.pathname === '/'
  const dots = useMemo(() => NAV_SECTIONS, [])
  const [navSolid, setNavSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (value) => {
    const next = value > 60
    setNavSolid((prev) => (prev === next ? prev : next))
  })

  const projectsNavActive =
    (location.pathname === '/' && location.hash === '#projects') || location.pathname.startsWith('/projects/')

  const navItemClass = (active: boolean) =>
    cn(
      'rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-150',
      'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-glass-hover)] hover:text-[var(--color-text-primary)]',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-primary)]',
      active && 'bg-[var(--color-accent-primary-dim)] text-[var(--color-accent-primary)]',
    )

  return (
    <div className="relative min-h-svh overflow-x-clip bg-[var(--color-bg-base)]">
      <SkipLink />
      <ToggleTechnical />
      <ScrollProgressBar />
      <header
        className={cn('fixed inset-x-0 top-0 z-[var(--z-nav)] border-b transition-colors duration-200')}
        style={{
          ...PINNED_DARK_CHROME_VARS,
          background: navSolid
            ? 'var(--color-bg-surface)'
            : 'color-mix(in oklab, var(--color-bg-surface) 88%, transparent)',
          backdropFilter: 'blur(10px)',
          borderColor: navSolid ? 'var(--color-border-default)' : 'transparent',
        }}
      >
        <div className="relative mx-auto flex h-16 max-w-[var(--shell-content-max-width)] items-center gap-2 px-[var(--shell-gutter-sm)] sm:gap-4 sm:px-[var(--shell-gutter-md)] lg:px-[var(--shell-gutter-lg)]">
          <NavLink
            to="/"
            end
            className="group flex shrink-0 items-center gap-2 rounded-md px-1 py-1.5"
          >
            <img
              src={logoMark}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <span className="font-[var(--font-display)] text-lg font-semibold leading-none tracking-tight text-[var(--color-text-primary)] sm:text-xl">
              Yuri Brown
            </span>
            <span className="hidden h-5 w-px bg-[var(--color-border-default)] sm:block" aria-hidden />
            <span className="hidden max-w-[9rem] truncate font-[var(--font-mono)] text-[10px] uppercase leading-tight tracking-[0.14em] text-[var(--color-text-muted)] sm:block">
              Software / ML Engineer
            </span>
          </NavLink>

          <nav
            className="hidden min-w-0 flex-1 justify-center overflow-x-auto sm:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Primary"
          >
            <div className="inline-flex items-center gap-0.5">
              <NavLink to="/" end className={({ isActive }) => navItemClass(isActive)}>
                Home
              </NavLink>
              <a
                href="/#projects"
                className={navItemClass(projectsNavActive)}
                onClick={(e) => {
                  e.preventDefault()
                  if (location.pathname === '/') {
                    scrollToId('projects')
                  } else {
                    void navigate({ pathname: '/', hash: 'projects' })
                  }
                }}
              >
                Projects
              </a>
              <NavLink to="/thoughts" className={({ isActive }) => navItemClass(isActive)}>
                Thoughts
              </NavLink>
              <button
                type="button"
                onClick={() => toggleContactDialog()}
                className={navItemClass(open)}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls="contact-dialog-content"
              >
                Contact
              </button>
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-3">
            <a
              href={RESUME_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-inverse)] transition-opacity hover:opacity-90 sm:inline-flex sm:gap-2 sm:px-4 sm:py-2"
              download="Brown_Resume.pdf"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>Resume</span>
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-default)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-primary)] sm:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              id="mobile-nav-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="overflow-hidden border-t border-[var(--color-border-default)] sm:hidden"
              style={{ background: 'var(--color-bg-surface)' }}
            >
              <nav className="flex flex-col gap-1 px-[var(--shell-gutter-sm)] py-3" aria-label="Primary mobile">
                <NavLink
                  to="/"
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(navItemClass(isActive), 'w-full text-left')}
                >
                  Home
                </NavLink>
                <a
                  href="/#projects"
                  className={cn(navItemClass(projectsNavActive), 'w-full text-left')}
                  onClick={(e) => {
                    e.preventDefault()
                    setMobileMenuOpen(false)
                    if (location.pathname === '/') {
                      scrollToId('projects')
                    } else {
                      void navigate({ pathname: '/', hash: 'projects' })
                    }
                  }}
                >
                  Projects
                </a>
                <NavLink
                  to="/thoughts"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(navItemClass(isActive), 'w-full text-left')}
                >
                  Thoughts
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    toggleContactDialog()
                  }}
                  className={cn(navItemClass(open), 'w-full text-left')}
                  aria-haspopup="dialog"
                  aria-controls="contact-dialog-content"
                >
                  Contact
                </button>
                <a
                  href={RESUME_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)] px-3 py-2 text-xs font-medium text-[var(--color-text-inverse)]"
                  download="Brown_Resume.pdf"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>Resume</span>
                </a>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <div className="relative z-[var(--z-content)] mx-auto max-w-[var(--shell-content-max-width)] px-[var(--shell-gutter-sm)] pb-16 pt-[calc(var(--shell-header-height)+2.5rem)] sm:px-[var(--shell-gutter-md)] sm:pb-20 sm:pt-[calc(var(--shell-header-height)+3rem)] lg:px-[var(--shell-gutter-lg)]">
        <div>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
      <SiteFooter />
      {isHome ? (
        <nav
          className="pointer-events-auto fixed bottom-10 right-6 top-1/2 z-[var(--z-floating)] hidden -translate-y-1/2 flex-col gap-3 xl:flex"
          aria-label="Section map"
          style={PINNED_DARK_CHROME_VARS}
        >
          {dots.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              title={s.label}
              className={cn(
                'group relative flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[10px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent-primary)]',
                activeSection === s.id && 'border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]',
              )}
            >
              <span className="sr-only">{s.label}</span>
              <span aria-hidden>{s.short}</span>
            </button>
          ))}
        </nav>
      ) : null}
    </div>
  )
}
