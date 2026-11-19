import { Section } from '@/components/shell/Section'
import { LifecycleCarousel } from '@/components/system-overview/LifecycleCarousel'
import { Cpu, ShieldCheck, Zap } from 'lucide-react'

/**
 * Capability Architecture Section:
 * Transformed into a Phantom-style horizontal carousel showcasing Yuri's
 * 10-step engineering lifecycle.
 * Carefully proportioned to fit cleanly within a 16:9 viewport height,
 * with dedicated right-hand staging preserving full visibility of the 3D phone model.
 */
export function HeroRevealSection() {
  return (
    <Section
      id="system-overview"
      tone="dark"
      hideHeader
      bleed={false}
      paintBackground={false}
      className="relative z-10 min-h-svh flex flex-col justify-center"
    >
      <div className="flex w-full flex-col justify-center gap-6 py-10 sm:gap-8 sm:py-14 lg:py-16">
        {/* Header Strip */}
        <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[#ff6b1a]">
              02 // How I Build
            </span>
            <h2 className="mt-1 font-[var(--font-display)] text-3xl uppercase leading-tight tracking-[-0.01em] text-[#f5f5f0] sm:text-4xl md:text-5xl">
              The Engineering Lifecycle
            </h2>
          </div>

          <p className="max-w-md text-xs leading-relaxed text-[#f5f5f0]/75 sm:text-sm md:text-right">
            Every system—whether an edge neural net, distributed backend, or cross-platform client—advances through 10 disciplined phases from problem formulation to production maintenance.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left is the Carousel, Right keeps clear line-of-sight to the 3D phone */}
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column (8 cols): Horizontal Carousel Track styled after Phantom.com with 16:9 vertical fit */}
          <div className="min-w-0 lg:col-span-8 xl:col-span-7">
            <LifecycleCarousel />
          </div>

          {/* Right Column (4 cols): Dedicated spatial channel for the 3D Smartphone + subtle runtime badge */}
          <div className="hidden flex-col justify-between self-stretch lg:col-span-4 lg:flex xl:col-span-5">
            {/* Upper viewport channel kept open so the 3D device model remains visible */}
            <div className="min-h-[160px] xl:min-h-[200px]" aria-hidden="true" />

            {/* Hardware Layer Badge anchored at bottom */}
            <div className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-[#121212]/50 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-[#ff6b1a]">
                <span className="inline-flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Hardware Runtime</span>
                </span>
                <span className="rounded-full border border-[#ff6b1a]/30 bg-[#ff6b1a]/10 px-2 py-0.5 text-[8.5px] text-[#ff6b1a]">
                  Live Stage
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-[#f5f5f0]/70">
                The 3D smartphone model in this viewport represents physical deployment: executing on-device TFLite quantization, background sync queues, and zero-cloud edge resilience.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-0.5 font-[var(--font-mono)] text-[9.5px] text-[#f5f5f0]/60">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#ff6b1a]" />
                  <span>Zero-Cloud Dependency</span>
                </span>
                <span className="text-white/20">·</span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3 w-3 text-[#ff6b1a]" />
                  <span>Sub-40ms Inference</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
