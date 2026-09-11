import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers,
  Lock,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Store,
  Coffee,
  Apple,
  Scissors,
  Shirt,
  Sparkles,
  RefreshCw,
  FileCheck,
} from 'lucide-react'
import { Section } from '@/components/shell/Section'
import { useTextScramble } from '@/hooks/useTextScramble'
import { RevealText } from '@/components/ui/RevealText'
import { KineticCounter } from '@/components/ui/KineticCounter'
import { TiltCard } from '@/components/ui/TiltCard'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { Panel } from '@/components/ui/Panel'
import { useThemeAccent } from '@/app/providers/useThemeAccent'
import { projectById } from '@/config/projects.registry'
import { cn } from '@/components/ui/cn'

const project = projectById('purch_io')!

const VERTICALS = [
  {
    name: 'Boutique Café & Bakery',
    icon: Coffee,
    pricingType: 'combo + modifiers',
    badge: 'Food & Beverage',
    example: 'Specialty Pour-Over + Oat Milk Swap + Almond Croissant Bundle',
    detail: 'Meal builder slots, optional barista modifiers, and live kitchen claim numbers.',
  },
  {
    name: 'Fresh Produce & Grocery',
    icon: Apple,
    pricingType: 'weight_volume',
    badge: 'Fractional Billing',
    example: 'Cavendish Bananas @ ₱85/kg × 1.425 kg = ₱121.13',
    detail: 'Digital scale barcode parsing, fractional pricing, and tare weight deduction.',
  },
  {
    name: 'Apparel & Footwear',
    icon: Shirt,
    pricingType: 'variant_matrix',
    badge: 'Multi-SKU Retail',
    example: 'Linen Chore Jacket (Sizes XS–XXL × 4 Colorways)',
    detail: 'Multi-dimensional variant matrices with barcode lookup and per-variant stock tracking.',
  },
  {
    name: 'Salon, Spa & Repair',
    icon: Scissors,
    pricingType: 'service',
    badge: 'Time & Labor',
    example: 'Hair Treatment + Styling (60-min slot with assigned stylist)',
    detail: 'Service duration pricing, staff commission tracking, and scheduled booking slots.',
  },
  {
    name: 'Neighborhood Sari-Sari / Convenience',
    icon: Store,
    pricingType: 'bundle + credit',
    badge: 'Micro-Retail',
    example: '3-for-₱100 Canned Goods Promo + Customer Credit ("Utang") Ledger',
    detail: 'Tiered volume discounts, quick-key cash inputs, and offline credit ledger tracking.',
  },
]

const PRICING_TYPES = [
  { type: 'unit', label: 'Unit Pricing', desc: 'Standard item price × integer quantity for packaged retail goods.' },
  { type: 'weight_volume', label: 'Weight / Volume', desc: 'Fractional decimal quantities with digital scale tare deduction.' },
  { type: 'bundle', label: 'Bundle & Tiered', desc: 'Mix-and-match thresholds (e.g. 3 for ₱100, buy 2 get 10% off).' },
  { type: 'service', label: 'Service Duration', desc: 'Time-block billing with staff assignment and tip tracking.' },
  { type: 'combo', label: 'Combo / Meal Builder', desc: 'Base dish with customizable modifier slots and add-on surcharges.' },
  { type: 'variant_matrix', label: 'Variant Matrix', desc: '2D matrix grid (Size × Color) mapping to unique SKU barcodes.' },
]

const BUILD_PHASES = [
  {
    phase: 'Phase 0',
    title: 'Monorepo & API Scaffold',
    scope: 'ASP.NET Core Minimal API bootstrap, layered architecture (Domain, Application, Infrastructure, Api), and monorepo structure.',
  },
  {
    phase: 'Phase 1',
    title: 'Domain, Auth & Drift Local DB',
    scope: 'Multi-tenant domain model, tenant_id isolation, JWT claims, device PIN pairing, global exception handling, and offline Drift SQLite schema.',
  },
  {
    phase: 'Phase 2',
    title: 'Onboarding & Full Audit Log',
    scope: 'Staff, branch, and device pairing management; tenant settings; immutable audit log for voids, refunds, discounts, and overrides.',
  },
  {
    phase: 'Phase 3',
    title: 'Catalog & Polymorphic Engine',
    scope: 'The core pricing_type engine, modifier groups, bundle rules, variant matrices, combo builder, and barcode scanner integration.',
  },
  {
    phase: 'Phase 4',
    title: 'Checkout & Regulatory Compliance',
    scope: 'Cart engine, Senior/PWD 20% discount math, multi-tender payment tabs, and sequential BIR-compliant receipt numbering.',
  },
]

export function PurchIoPage() {
  const { setActiveProjectId } = useThemeAccent()
  const { displayText: titleText, ref: inViewRef } = useTextScramble({ targetText: 'Purch.io', durationMs: 1000 })
  const [selectedVertical, setSelectedVertical] = useState(VERTICALS[0])

  useEffect(() => {
    setActiveProjectId('purch_io')
    return () => setActiveProjectId(null)
  }, [setActiveProjectId])

  return (
    <main id="main-content" tabIndex={-1} className="space-y-12 pt-6 outline-none sm:space-y-16 sm:pt-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-6 sm:p-10">
        <div className="relative grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-start lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Multi-Vertical SME POS · Config-Driven Architecture
              </p>
              <span className="rounded-md bg-[color:color-mix(in_oklab,var(--accent-primary)_15%,transparent)] px-2 py-0.5 font-[var(--font-mono)] text-[10px] font-semibold text-[var(--accent-primary)]">
                Aug–Sep 2026
              </span>
            </div>

            <p
              ref={inViewRef}
              className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl"
            >
              {titleText}
            </p>

            <div className="mt-3 max-w-xl text-lg text-[var(--color-text-secondary)] sm:text-xl">
              <RevealText delay={0.2}>{project.tagline}</RevealText>
            </div>

            <hr className="mt-6 w-28 border-0 border-t-2 border-[var(--accent-secondary)]" />

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
              {project.personalHook}
            </p>
          </div>

          <Panel className="space-y-4 !border-solid !bg-[var(--color-bg-elevated)]">
            <h3 className="text-sm font-semibold text-[var(--global-text)]">System credentials</h3>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              {project.metrics?.map((m) => (
                <div
                  key={m.label}
                  className="flex items-baseline justify-between gap-3 border-b border-[var(--global-border)] pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--global-text-muted)]">
                    {m.label}
                  </dt>
                  <dd className="font-[var(--font-mono)] text-[var(--global-text)]">
                    <KineticCounter value={m.value} suffix={m.suffix} decimals={0} />
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </section>

      {/* Problem & Opportunity */}
      <Section id="purch-problem" kicker="// PROBLEM & CORE ARCHITECTURAL BET" title="One codebase, six distinct SME business verticals">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-[var(--global-text-muted)]">
            <p>{project.problem}</p>
            <p>
              When an off-the-shelf POS claims to support both retail and food service, it usually means maintaining two completely
              forked frontends and schemas. When connectivity drops in rainy Philippine weather, cloud-only systems freeze entirely.
            </p>
          </div>
          <div className="space-y-4 text-[var(--global-text-muted)]">
            <p>{project.solution}</p>
            <p>
              In Purch.io, a single discriminator field — <code className="font-[var(--font-mono)] text-xs text-[var(--accent-primary)]">pricing_type</code> —
              determines which item-editor UI renders and which cart pricing logic executes. Accompanied by merchant-level{' '}
              <code className="font-[var(--font-mono)] text-xs text-[var(--accent-primary)]">feature_flags</code>, supporting a café,
              produce grocer, or hair salon is purely a configuration choice rather than a code fork.
            </p>
          </div>
        </div>

        {/* Pricing Type Breakdown Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING_TYPES.map((pt) => (
            <div key={pt.type} className="rounded-xl border border-[var(--global-border)] bg-[var(--color-bg-surface)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--global-text)]">{pt.label}</p>
                <code className="rounded bg-[var(--color-bg-elevated)] px-2 py-0.5 font-[var(--font-mono)] text-[10px] text-[var(--accent-primary)]">
                  {pt.type}
                </code>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">{pt.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Interactive Vertical Explorer */}
      <Section id="purch-verticals" kicker="// ADAPTIVE WORKFLOWS" title="Interactive vertical preview: configuration over code forks">
        <div className="flex flex-wrap gap-2 border-b border-[var(--global-border)] pb-4">
          {VERTICALS.map((v) => {
            const Icon = v.icon
            const isSelected = selectedVertical.name === v.name
            return (
              <button
                key={v.name}
                type="button"
                onClick={() => setSelectedVertical(v)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all',
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'border border-[var(--global-border)] bg-[var(--color-bg-surface)] text-[var(--global-text-muted)] hover:text-[var(--global-text)]',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{v.name}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--global-border)] bg-[var(--color-bg-surface)] p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-[color:color-mix(in_oklab,var(--accent-primary)_15%,transparent)] px-2.5 py-1 font-[var(--font-mono)] text-[11px] font-bold text-[var(--accent-primary)]">
                  {selectedVertical.badge}
                </span>
                <span className="font-[var(--font-mono)] text-xs text-[var(--global-text-muted)]">
                  Active pricing_type: {selectedVertical.pricingType}
                </span>
              </div>

              <h4 className="text-2xl font-bold tracking-tight text-[var(--global-text)]">
                {selectedVertical.name}
              </h4>

              <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">
                {selectedVertical.detail}
              </p>

              <div className="rounded-xl border border-[var(--global-border)] bg-[var(--color-bg-elevated)] p-4 font-[var(--font-mono)] text-xs">
                <p className="text-[10px] uppercase tracking-wider text-[var(--global-text-muted)]">
                  Simulated Transaction Cart Item
                </p>
                <p className="mt-1 font-semibold text-[var(--global-text)]">
                  {selectedVertical.example}
                </p>
              </div>
            </div>

            <TiltCard>
              <BorderTrace>
                <div className="flex h-full flex-col justify-between rounded-xl border border-[var(--global-border)] bg-[var(--color-bg-elevated)] p-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                      <Sparkles className="h-5 w-5 text-[var(--accent-primary)]" />
                      Protected Core Invariant
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-[var(--global-text-muted)]">
                      The design principle of Purch.io is to strictly protect <code className="font-[var(--font-mono)] text-[10px] text-[var(--accent-primary)]">pricing_type</code>.
                      Vertical-specific logic branches off this polymorphism rather than special-casing around it.
                      No per-client repository forks; the same Flutter APK and backend binary serves every merchant.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--global-border)] pt-4 text-xs font-[var(--font-mono)] text-[var(--global-text-muted)]">
                    <span>Engine: PolymorphicCart</span>
                    <span className="text-emerald-500 font-semibold">Zero Code Forks</span>
                  </div>
                </div>
              </BorderTrace>
            </TiltCard>
          </div>
        </div>
      </Section>

      {/* Offline Sync & Conflict Resolution */}
      <Section id="purch-offline" kicker="// RESILIENCE ARCHITECTURE" title="Drift SQLite offline queue with auditable conflict resolution">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 text-[var(--global-text-muted)]">
            <p>
              Philippine retail cannot tolerate POS terminals that stop when the internet drops. Purch.io implements an
              offline-first architecture using <strong>Drift (SQLite)</strong> on the Flutter client.
            </p>
            <p>
              Every transaction written offline is assigned a unique client GUID, stored in encrypted SQLite, and flagged as{' '}
              <code className="font-[var(--font-mono)] text-xs text-[var(--accent-primary)]">pending_sync</code>. When the connection
              restores, transactions are batched to the backend <code className="font-[var(--font-mono)] text-xs text-[var(--accent-primary)]">/sync</code> endpoint.
            </p>
            <div className="rounded-xl border border-[var(--global-border)] bg-[var(--color-bg-surface)] p-4 text-xs">
              <p className="font-semibold text-[var(--global-text)]">Conflict Resolution Rule:</p>
              <p className="mt-1 text-[var(--global-text-muted)]">
                Later timestamp wins. The losing transaction is <strong>auto-cancelled and flagged for manager review</strong> —
                never silently dropped. Silent data loss at a cash register is completely unacceptable.
              </p>
            </div>
          </div>

          <TiltCard>
            <BorderTrace>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--global-border)] bg-[var(--color-bg-elevated)] p-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                    <RefreshCw className="h-5 w-5 text-[var(--accent-primary)]" />
                    Offline-to-Cloud Sync Protocol
                  </div>
                  <ol className="mt-4 list-none space-y-3 font-[var(--font-mono)] text-xs text-[var(--global-text)]">
                    <li className="flex gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">01.</span>
                      <span>Cashier logs sale offline → Committed to local Drift SQLite (flag: pending_sync).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">02.</span>
                      <span>Terminal prints physical thermal receipt with local sequential offline token.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">03.</span>
                      <span>Connectivity returns → Batch push queued transactions to ASP.NET Core /sync.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">04.</span>
                      <span>Backend verifies client timestamp sequence; reconciles inventory deltas.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">05.</span>
                      <span>Confirmed state pushes back to terminal; pending_sync cleared locally.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </BorderTrace>
          </TiltCard>
        </div>
      </Section>

      {/* 5-Phase Build Sequence */}
      <Section id="purch-phases" kicker="// DELIVERY MILESTONES" title="Phased build sequence: gated behind working integration tests">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BUILD_PHASES.map((p) => (
            <div
              key={p.phase}
              className="flex flex-col justify-between rounded-xl border border-[var(--global-border)] bg-[var(--color-bg-surface)] p-5"
            >
              <div>
                <span className="rounded bg-[color:color-mix(in_oklab,var(--accent-primary)_15%,transparent)] px-2 py-0.5 font-[var(--font-mono)] text-[10px] font-bold text-[var(--accent-primary)]">
                  {p.phase}
                </span>
                <h4 className="mt-2 text-sm font-bold text-[var(--global-text)]">{p.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">{p.scope}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-[var(--font-mono)] text-emerald-500 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified &amp; Tested</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Regulatory & Retail Compliance */}
      <Section id="purch-compliance" kicker="// REGULATORY COMPLIANCE" title="BIR receipts, Senior/PWD discounts & Philippine retail norms">
        <div className="grid gap-5 md:grid-cols-3">
          <TiltCard>
            <div className="h-full p-6">
              <Receipt className="h-5 w-5 text-[var(--accent-primary)]" />
              <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">BIR Sequential Receipting</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">
                Server-generated, gap-auditable invoice sequence numbering. Schema accommodates X/Z end-of-day reading
                aggregates and cash drawer audit reconciliations from day one.
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full p-6">
              <ShieldCheck className="h-5 w-5 text-[var(--accent-secondary)]" />
              <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">Senior / PWD 20% Math</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">
                Automated 20% statutory discount calculation with Philippine VAT exemption (net of 12% VAT).
                Tracks ID number and name in the transaction record for tax compliance reporting.
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="h-full p-6">
              <FileCheck className="h-5 w-5 text-[var(--accent-primary)]" />
              <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">Neighborhood "Utang" Ledger</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">
                Built-in customer credit ledger for traditional Philippine retail relationships, enabling merchants to
                record credit tabs, partial repayments, and balance statements without loose paper notebooks.
              </p>
            </div>
          </TiltCard>
        </div>
      </Section>

      {/* Engineering Decisions & ADRs */}
      <Section id="purch-decisions" kicker="// ARCHITECTURE DECISION RECORDS" title="Explicit tradeoffs documented via ADRs">
        <div className="grid gap-5 md:grid-cols-3">
          {project.decisions.map((d) => (
            <TiltCard key={d.title}>
              <div className="h-full p-6">
                <Lock className="h-5 w-5 text-[var(--accent-primary)]" />
                <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">{d.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">{d.detail}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Tech Stack */}
      <Section id="purch-stack" kicker="// STACK SPECIFICATION" title="Cross-platform Flutter client with ASP.NET Core backend">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.stack.map((s) => (
            <div key={s.name} className="rounded-xl border border-[var(--global-border)] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                <Layers className="h-4 w-4 text-[var(--accent-primary)]" />
                {s.name}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">{s.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Lessons Learned */}
      <Section id="purch-lessons" kicker="// LESSONS" title="What building a multi-vertical POS taught">
        <ul className="space-y-3 text-[var(--global-text-muted)]">
          {project.lessonsLearned.map((lesson) => (
            <li key={lesson} className="flex gap-2">
              <span className="text-[var(--accent-primary)] font-bold">—</span>
              <span>{lesson}</span>
            </li>
          ))}
        </ul>

        {/* Next project navigation */}
        <div className="mt-12 flex justify-end border-t border-[var(--global-border)] pt-6">
          <Link
            to="/projects/schedul-io"
            className="inline-flex items-baseline gap-2 text-sm font-medium text-[var(--accent-primary)]"
          >
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--global-text-muted)]">
              Next project
            </span>
            <DrawUnderline color="var(--accent-primary)">Schedul.io: Clinic Access Platform</DrawUnderline>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Section>
    </main>
  )
}
