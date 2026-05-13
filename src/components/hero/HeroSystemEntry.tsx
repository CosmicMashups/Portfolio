import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import profilePhoto from '@/assets/profile.png'
import cosmicLogo from '@/assets/cosmicmashups.jpg'
import { ScrollHint } from '@/components/shell/ScrollHint'
import { DomainMarquee } from '@/components/hero/DomainMarquee'
import { fadeInUp, motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { useTextScramble } from '@/hooks/useTextScramble'
import { RevealText } from '@/components/ui/RevealText'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { TiltCard } from '@/components/ui/TiltCard'
import { MeshGradient } from '@/components/ui/MeshGradient'
import { PROJECTS } from '@/config/projects.registry'
import { cn } from '@/components/ui/cn'

const HERO_NAME = 'Yuri Brown'

export function HeroSystemEntry() {
  const reduce = usePrefersReducedMotion()
  const nameScramble = useTextScramble({ targetText: HERO_NAME, durationMs: 1200 })
  const viewWork = useMagneticEffect({ strength: 0.35 })
  const thoughtsBtn = useMagneticEffect({ strength: 0.35 })

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      id="hero"
      className="relative isolate flex min-h-svh flex-col justify-center gap-12 overflow-hidden pt-4 md:min-h-[86svh] md:flex-row md:items-center md:gap-14 md:pt-0"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.85]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklab, var(--global-text-muted) 4%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--global-text-muted) 4%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <MeshGradient variant="hero" />

      <DomainMarquee />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[min(92vw,430px)] shrink-0 md:mx-0 md:w-[min(48%,520px)] md:max-w-[520px]"
        initial={reduce ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: motionEase }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ boxShadow: '0 0 60px var(--color-accent-primary-glow)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[5] aspect-square w-[min(68vw,300px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-[color:color-mix(in_oklab,var(--accent-primary)_28%,transparent)] shadow-[0_0_48px_color-mix(in_oklab,var(--color-accent-primary-glow)_45%,transparent)] sm:w-[min(64vw,340px)] md:w-[min(52vw,360px)]"
          aria-hidden
        >
          <img
            src={cosmicLogo}
            width={512}
            height={512}
            alt=""
            className="h-full w-full object-cover opacity-[0.92]"
          />
        </div>
        <TiltCard
          className="relative z-10 mx-auto max-w-fit border-transparent bg-transparent shadow-none md:mx-0"
          glareEnabled={false}
          maxTilt={8}
          noShadow
          noBackdrop
        >
          <div className="hero-portrait-scanline relative z-10 mx-auto rounded-2xl">
            <img
              src={profilePhoto}
              width={1260}
              height={2000}
              alt="Yuri Brown"
              className="relative z-[1] mx-auto h-auto w-auto max-h-[min(58vh,520px)] object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:mx-0 md:max-h-[min(76svh,660px)]"
            />
          </div>
        </TiltCard>
      </motion.div>

      <div className="relative z-20 max-w-2xl min-w-0 flex-1 space-y-8 text-left md:max-w-[min(52%,640px)] md:space-y-10 lg:max-w-[620px]">
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="space-y-3"
        >
          <p className="font-[var(--font-mono)] text-xs tracking-[0.2em] text-[var(--color-accent-primary)]">
            // AI · ML · FULL-STACK
          </p>
          <h1
            ref={nameScramble.ref}
            className="text-3xl font-semibold tracking-tight text-[var(--global-text)] md:text-4xl lg:text-5xl"
            aria-label={HERO_NAME}
          >
            {nameScramble.displayText}
          </h1>
          <RevealText delay={reduce ? 0 : 0.18} className="text-2xl font-semibold leading-tight md:text-4xl">
            I build systems for the problems I&apos;ve lived through myself.
          </RevealText>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial={reduce ? false : 'hidden'}
          animate="show"
          className="flex flex-wrap items-center gap-4 pt-2 sm:gap-5"
        >
          <button
            ref={viewWork.ref as never}
            type="button"
            onClick={scrollToProjects}
            className="w-full rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-primary-dim)] px-5 py-2 text-sm text-[var(--color-text-primary)] sm:w-auto"
          >
            View Work
          </button>
          <Link
            ref={thoughtsBtn.ref as never}
            to="/thoughts"
            className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border-default)] px-5 py-2 text-sm text-[var(--color-text-primary)] sm:w-auto"
          >
            Read Thoughts
          </Link>
          <a
            href="#"
            className="font-[var(--font-mono)] text-xs text-[var(--global-text-muted)] underline-offset-4 hover:text-[var(--accent-primary)] hover:underline"
          >
            View résumé ↗
          </a>
        </motion.div>

        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, margin: '-8% 0px' }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4"
        >
          <StatCard label="Projects shipped">
            <KineticCounter value={PROJECTS.length} className="text-lg md:text-xl" />
          </StatCard>
          <StatCard label="Languages">
            <KineticCounter value={5} suffix="+" className="text-lg md:text-xl" />
          </StatCard>
          <StatCard label="ML models trained">
            <KineticCounter value={3} className="text-lg md:text-xl" />
          </StatCard>
          <StatCard label="Platforms">
            <KineticCounter value={4} className="text-lg md:text-xl" />
          </StatCard>
          <StatCard label="Published thesis" className="col-span-2 sm:col-span-1">
            <KineticCounter value={1} className="text-lg md:text-xl" />
          </StatCard>
        </motion.div>

        <div className="hidden md:block">
          <ScrollHint />
        </div>
      </div>
    </header>
  )
}

function StatCard({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={fadeInUp} className={cn('min-w-0', className)}>
      <BorderTrace className="rounded-xl">
        <div className="rounded-xl border border-[color:color-mix(in_oklab,var(--accent-primary)_22%,var(--global-border))] bg-[var(--global-surface)]/55 px-3 py-3 md:px-4 md:py-3.5">
          <div className="tabular-nums">{children}</div>
          <p className="mt-1 text-[10px] leading-snug text-[var(--global-text-muted)] md:text-[11px]">{label}</p>
        </div>
      </BorderTrace>
    </motion.div>
  )
}
