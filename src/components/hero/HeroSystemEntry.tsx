import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import profilePhoto from '@/assets/profile.png'
import cosmicLogo from '@/assets/cosmicmashups.jpg'
import { ScrollHint } from '@/components/shell/ScrollHint'
import { RoleRotator } from '@/components/hero/RoleRotator'
import { fadeInUp, motionEase } from '@/lib/motion/presets'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import { useTextScramble } from '@/hooks/useTextScramble'
import { RevealText } from '@/components/ui/RevealText'
import { useMagneticEffect } from '@/hooks/useMagneticEffect'
import { KineticCounter } from '@/components/ui/KineticCounter'

export function HeroSystemEntry() {
  const reduce = usePrefersReducedMotion()
  const nameScramble = useTextScramble({ targetText: 'Yuri Brown' })
  const viewWork = useMagneticEffect({ strength: 0.35 })
  const thoughtsBtn = useMagneticEffect({ strength: 0.35 })

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      id="hero"
      className="relative isolate flex min-h-[82svh] flex-col justify-center gap-12 overflow-visible md:min-h-[86svh] md:gap-14 md:flex-row md:items-center"
    >
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
          className="pointer-events-none absolute -inset-4 rounded-3xl opacity-40 blur-2xl md:-inset-6"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, color-mix(in oklab, var(--accent-primary) 40%, transparent), transparent 55%)',
          }}
          aria-hidden
        />
        {/* Cosmic Mashups mark — sits behind portrait; same stack as glow / radial */}
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
        <img
          src={profilePhoto}
          width={1260}
          height={2000}
          alt="Yuri Brown"
          className="relative z-10 mx-auto h-auto w-auto max-h-[min(58vh,520px)] object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:mx-0 md:max-h-[min(76svh,660px)]"
        />
      </motion.div>

      <div className="relative z-20 max-w-2xl min-w-0 flex-1 space-y-8 text-left md:max-w-[min(52%,640px)] md:space-y-10 lg:max-w-[620px]">
        <motion.div
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={fadeInUp}
          className="space-y-3"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-accent-primary)]">
            // AI · ML · FULL-STACK
          </p>
          <h1
            ref={nameScramble.ref}
            className="text-3xl font-semibold tracking-tight text-[var(--global-text)] md:text-4xl lg:text-5xl"
          >
            {nameScramble.displayText}
          </h1>
          <RoleRotator />
          <RevealText className="text-2xl font-semibold leading-tight md:text-4xl">
            I build systems for the problems I've lived through myself.
          </RevealText>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial={reduce ? false : 'hidden'}
          animate="show"
          className="flex flex-wrap items-center gap-4 pt-4 sm:gap-5"
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
        </motion.div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm sm:gap-x-7 md:grid-cols-4 md:gap-y-4">
          <div>
            <KineticCounter value={7} className="text-xl" />
            <p className="text-[var(--global-text-muted)]">Projects shipped</p>
          </div>
          <div>
            <KineticCounter value={3} className="text-xl" />
            <p className="text-[var(--global-text-muted)]">ML models deployed</p>
          </div>
          <div>
            <KineticCounter value={5} className="text-xl" />
            <p className="text-[var(--global-text-muted)]">Years building</p>
          </div>
          <div>
            <KineticCounter value={1} className="text-xl" />
            <p className="text-[var(--global-text-muted)]">Thesis defended</p>
          </div>
        </div>

        <div className="hidden md:block">
          <ScrollHint />
        </div>
      </div>
    </header>
  )
}
