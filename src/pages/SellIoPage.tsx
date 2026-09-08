import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers,
  Lock,
  Radio,
  Receipt,
  ShieldCheck,
  Database,
  CheckCircle2,
  Clock,
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

const project = projectById('sell_io')!

const COMPARISON_ROWS = [
  {
    dimension: 'SKU Data Model',
    generic: 'Flat 1:1 table rows; each variant treated as unrelated SKU',
    sellio: 'Matrix-aware aggregate: Style → Size × Color × Design Code',
  },
  {
    dimension: 'Stock Concurrency',
    generic: 'Pessimistic table locks on database rows, causing deadlocks',
    sellio: 'Two-phase in-memory TTL locks (5 min) via IStockReservationStore',
  },
  {
    dimension: 'Terminal Sync',
    generic: 'Polling or manual page refresh; high ghost-inventory risk',
    sellio: 'Sub-100ms SignalR StockHub scoped to branch connection groups',
  },
  {
    dimension: 'Offline Strategy',
    generic: 'Hard stop; checkout completely freezes when internet drops',
    sellio: 'Edge SQLite local database with client-timestamp deterministic replay',
  },
  {
    dimension: 'Inventory Auditing',
    generic: 'Direct UPDATE mutations that drift over time with no trace',
    sellio: 'Strict append-only StockMovement ledger as immutable source of truth',
  },
]

const LEDGER_EVENTS = [
  { type: 'StockIn', qty: '+50', desc: 'Central warehouse shipment received at Shibuya Flagship', badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  { type: 'Reservation', qty: '-1', desc: '5-min TTL lock acquired at Kiosk 04 (Cart Session #9021)', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { type: 'Sale', qty: '-1', desc: 'QRPH PayMongo payment confirmed; stock committed to ledger', badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
  { type: 'Adjustment', qty: '-2', desc: 'Damaged item reconciliation by floor associate via staff PIN', badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
]

const SAMPLE_VARIANTS = [
  { size: 'XS', stock: 4, status: 'In Stock' },
  { size: 'S', stock: 12, status: 'In Stock' },
  { size: 'M', stock: 19, status: 'In Stock' },
  { size: 'L', stock: 2, status: 'Low Stock' },
  { size: 'XL', stock: 0, status: 'Sold Out' },
]

const COLORS = [
  { name: 'Off White', hex: '#F4F3EF', code: '01 OFF WHITE' },
  { name: 'Black', hex: '#1C1C1E', code: '09 BLACK' },
  { name: 'Olive Green', hex: '#4A5340', code: '57 OLIVE' },
  { name: 'Navy Blue', hex: '#212A3E', code: '69 NAVY' },
]

export function SellIoPage() {
  const { setActiveProjectId } = useThemeAccent()
  const { displayText: titleText, ref: inViewRef } = useTextScramble({ targetText: 'Sell.io', durationMs: 1000 })

  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedSize, setSelectedSize] = useState(SAMPLE_VARIANTS[2])
  const [activeTab, setActiveTab] = useState<'kiosk' | 'receipt'>('kiosk')

  useEffect(() => {
    setActiveProjectId('sell_io')
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
                Retail Kiosk Architecture · High-Volume POS
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
            <h3 className="text-sm font-semibold text-[var(--global-text)]">Architecture credentials</h3>
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
      <Section id="sell-problem" kicker="// PROBLEM & OPPORTUNITY" title="Apparel retail is not a flat SKU catalog">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 text-[var(--global-text-muted)]">
            <p>{project.problem}</p>
            <p>
              When a flash promotion triggers hundreds of shoppers tapping screens simultaneously, traditional database
              row locking deadlocks checkout lanes. If a single item in Size M is held in two physical carts, one customer
              inevitably gets an order cancellation after paying.
            </p>
          </div>
          <div className="space-y-4 text-[var(--global-text-muted)]">
            <p>{project.solution}</p>
            <p>
              Sell.io treats physical inventory with the mathematical rigor of a financial double-entry ledger: stock counts
              are transactional read caches derived from immutable event logs, with atomic in-memory TTL locks handling
              checkout spikes without touching relational tables.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--global-border)]">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--global-border)] text-[10px] uppercase tracking-wide text-[var(--global-text-muted)]">
                <th className="px-4 py-3 font-medium">Dimension</th>
                <th className="px-4 py-3 font-medium text-rose-500">Generic Retail Checkout</th>
                <th className="px-4 py-3 font-medium text-[var(--accent-primary)]">Sell.io Architecture</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.dimension} className="border-b border-[var(--global-border)] last:border-0">
                  <td className="px-4 py-3 font-[var(--font-mono)] text-xs text-[var(--global-text)]">
                    {row.dimension}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--global-text-muted)]">{row.generic}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[var(--global-text)]">{row.sellio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dual-Layer Inventory Architecture */}
      <Section id="sell-ledger" kicker="// INVENTORY ENGINE" title="Append-only ledger as the single source of truth">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <p className="text-[var(--global-text-muted)]">
              Direct <code className="font-[var(--font-mono)] text-xs text-[var(--accent-primary)]">UPDATE BranchStock SET QuantityOnHand = ...</code>{' '}
              operations inevitably drift over time due to network timeouts, refunds, and untracked stock modifications.
              In Sell.io, <code className="font-[var(--font-mono)] text-xs text-[var(--accent-primary)]">StockMovement</code> is
              the sole immutable source of truth.
            </p>
            <p className="text-[var(--global-text-muted)]">
              <code className="font-[var(--font-mono)] text-xs text-[var(--accent-primary)]">BranchStock.QuantityOnHand</code> is
              maintained as a transactional derived cache. Every single stock delta is captured in an append-only sequence
              with a timestamp, movement type, reference ID, and station attribution:
            </p>

            <div className="mt-4 space-y-2.5">
              {LEDGER_EVENTS.map((event) => (
                <div
                  key={event.type}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--global-border)] bg-[var(--color-bg-surface)] p-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('rounded px-1.5 py-0.5 font-[var(--font-mono)] text-[10px] font-bold', event.badge)}>
                      {event.type}
                    </span>
                    <span className="text-[var(--global-text-muted)]">{event.desc}</span>
                  </div>
                  <span className="font-[var(--font-mono)] font-bold text-[var(--global-text)]">{event.qty}</span>
                </div>
              ))}
            </div>
          </div>

          <TiltCard>
            <BorderTrace>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--global-border)] bg-[var(--color-bg-elevated)] p-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                    <ShieldCheck className="h-5 w-5 text-[var(--accent-primary)]" aria-hidden />
                    Deterministic Ledger Replay
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--global-text-muted)]">
                    Because stock records are strictly append-only, auditing is not an afterthought — it is an inherent property
                    of the persistence layer. Replaying the event stream reproduces the exact state of any branch at any historical
                    point in time, eliminating reconciliation friction during end-of-day register balancing.
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-[var(--global-border)] bg-[var(--color-bg-surface)] p-4 font-[var(--font-mono)] text-xs">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--global-text-muted)]">
                    Effective Availability Formula
                  </p>
                  <p className="mt-1 font-semibold text-[var(--global-text)]">
                    Available = max(0, QuantityOnHand − ActiveReservations[5m TTL])
                  </p>
                </div>
              </div>
            </BorderTrace>
          </TiltCard>
        </div>
      </Section>

      {/* Core Architectural Pillars */}
      <Section id="sell-pillars" kicker="// SYSTEM CAPABILITIES" title="Engineered for high-volume retail resilience">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TiltCard>
            <div className="flex h-full flex-col gap-3 p-6">
              <Clock className="h-6 w-6 text-[var(--accent-primary)]" aria-hidden />
              <h3 className="text-base font-semibold text-[var(--global-text)]">Two-Phase TTL Locks</h3>
              <p className="text-xs leading-relaxed text-[var(--global-text-muted)]">
                5-minute atomic in-memory reservations via <code className="font-[var(--font-mono)] text-[10px]">IStockReservationStore</code>.
                Prevents overselling during payment processing without putting row locks on relational tables.
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="flex h-full flex-col gap-3 p-6">
              <Radio className="h-6 w-6 text-[var(--accent-secondary)]" aria-hidden />
              <h3 className="text-base font-semibold text-[var(--global-text)]">Sub-100ms SignalR</h3>
              <p className="text-xs leading-relaxed text-[var(--global-text-muted)]">
                WebSocket broadcasts on <code className="font-[var(--font-mono)] text-[10px]">StockHub</code> group-partitioned by{' '}
                <code className="font-[var(--font-mono)] text-[10px]">Branch_{'{branchId}'}</code>. Instantly disables out-of-stock sizes
                across all other in-store kiosks.
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="flex h-full flex-col gap-3 p-6">
              <Database className="h-6 w-6 text-[var(--accent-primary)]" aria-hidden />
              <h3 className="text-base font-semibold text-[var(--global-text)]">Edge SQLite Queue</h3>
              <p className="text-xs leading-relaxed text-[var(--global-text-muted)]">
                Local SQLite database maintains 100% kiosk operation during branch internet outages. Automatically reconciles
                sales in strict client-timestamp sequence upon reconnection.
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="flex h-full flex-col gap-3 p-6">
              <Receipt className="h-6 w-6 text-[var(--accent-secondary)]" aria-hidden />
              <h3 className="text-base font-semibold text-[var(--global-text)]">ESC/POS Thermal Engine</h3>
              <p className="text-xs leading-relaxed text-[var(--global-text-muted)]">
                Direct hardware print spooler generating 12% Philippine VAT receipts, barcode tokens, and dual-mode fulfillment claim tickets
                (Self-Fetch vs. Staff-Assist).
              </p>
            </div>
          </TiltCard>
        </div>
      </Section>

      {/* Interactive Kiosk & Receipt Simulation */}
      <Section
        id="sell-interactive"
        kicker="// INTERFACE PARITY"
        title="Japanese Modernist touch kiosk & thermal ticket preview"
      >
        <div className="flex items-center gap-2 border-b border-[var(--global-border)] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('kiosk')}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
              activeTab === 'kiosk'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'text-[var(--global-text-muted)] hover:text-[var(--global-text)]',
            )}
          >
            Touch Kiosk Interface
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-semibold transition-colors',
              activeTab === 'receipt'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'text-[var(--global-text-muted)] hover:text-[var(--global-text)]',
            )}
          >
            ESC/POS 12% VAT Thermal Ticket
          </button>
        </div>

        {activeTab === 'kiosk' ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* Interactive Mockup */}
            <div className="overflow-hidden rounded-2xl border border-[var(--global-border)] bg-[var(--color-bg-surface)] p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--global-border)] pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#EC0000] px-2 py-0.5 font-[var(--font-display)] text-xs font-bold text-white tracking-wider">
                    SELL.IO
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--global-text-muted)] font-[var(--font-mono)]">
                    SHIBUYA FLAGSHIP · KIOSK 04
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  SignalR Online
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-widest text-[#EC0000]">
                    ITEM #452901 · AISLE 04 · RACK B
                  </p>
                  <h4 className="mt-1 text-xl font-bold tracking-tight text-[var(--global-text)]">
                    AIRism Cotton Oversized Crew Neck T-Shirt
                  </h4>
                  <p className="font-['Noto_Sans_JP',sans-serif] text-xs text-[var(--global-text-muted)]">
                    エアリズムコットンオーバーサイズTシャツ · Dual-Face AIRism Fabric
                  </p>
                  <p className="mt-2 text-2xl font-bold font-[var(--font-mono)] text-[var(--global-text)]">
                    ₱790.00
                  </p>
                </div>

                {/* Color Selector */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--global-text-muted)] font-[var(--font-mono)]">
                    Color: {selectedColor.code}
                  </p>
                  <div className="mt-2 flex gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        aria-label={`Select ${c.name}`}
                        className={cn(
                          'h-9 w-9 rounded-full border-2 transition-transform',
                          selectedColor.name === c.name
                            ? 'scale-110 border-[#EC0000] ring-2 ring-[#EC0000]/30'
                            : 'border-[var(--global-border)] hover:scale-105',
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--global-text-muted)] font-[var(--font-mono)]">
                    Size: {selectedSize.size} ({selectedSize.stock} units available)
                  </p>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {SAMPLE_VARIANTS.map((v) => {
                      const isSoldOut = v.stock === 0
                      const isSelected = selectedSize.size === v.size
                      return (
                        <button
                          key={v.size}
                          type="button"
                          disabled={isSoldOut}
                          onClick={() => setSelectedSize(v)}
                          className={cn(
                            'flex flex-col items-center rounded-xl border p-2 text-center transition-all',
                            isSoldOut
                              ? 'opacity-30 border-[var(--global-border)] bg-[var(--color-bg-elevated)] cursor-not-allowed'
                              : isSelected
                                ? 'border-[#EC0000] bg-[#EC0000]/10 text-[#EC0000] font-bold'
                                : 'border-[var(--global-border)] hover:border-[var(--global-text-muted)] text-[var(--global-text)]',
                          )}
                        >
                          <span className="text-sm font-bold font-[var(--font-mono)]">{v.size}</span>
                          <span className="text-[9px] uppercase tracking-tighter">
                            {isSoldOut ? 'Sold Out' : `${v.stock} left`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-[#EC0000] py-3.5 text-center text-sm font-bold text-white shadow-lg transition-transform active:scale-[0.98]"
                  >
                    Reserve &amp; Checkout (5m TTL)
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-[var(--global-border)] px-4 py-3.5 text-xs font-semibold text-[var(--global-text)] hover:bg-[var(--color-bg-elevated)]"
                  >
                    Rack Map
                  </button>
                </div>
              </div>
            </div>

            {/* Explanatory notes */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[var(--global-text)]">
                Tactile ergonomics for physical retail
              </h4>
              <p className="text-sm leading-relaxed text-[var(--global-text-muted)]">
                The user interface is informed by the Japanese Modernist retail design standards of Uniqlo and Muji:
                warm editorial alabaster surfaces, high-contrast functional typography, 48px+ touch targets designed for industrial
                kiosk displays, and physical retail aisle hints (`AISLE 04 • RACK B`) that bridge digital checkout with physical browsing.
              </p>
              <ul className="space-y-2 text-sm text-[var(--global-text-muted)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#EC0000]" />
                  <span>Real-time stock badges directly on size pills prevent dead clicks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#EC0000]" />
                  <span>5-minute countdown ring prevents session abandonment hoarding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#EC0000]" />
                  <span>Dynamic EMVCo QRPH code rendering for zero-contact e-wallet scan</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            {/* ESC/POS Thermal Receipt Simulation */}
            <div className="w-full max-w-sm rounded-lg border border-dashed border-[var(--global-border)] bg-[#FAFAFA] text-[#111111] p-6 shadow-2xl font-[var(--font-mono)] text-xs leading-relaxed dark:bg-[#1A1A1A] dark:text-[#EAEAEA]">
              <div className="text-center">
                <p className="text-base font-bold tracking-widest uppercase">SELL.IO APPAREL</p>
                <p className="text-[10px] text-[var(--global-text-muted)]">SHIBUYA FLAGSHIP · STORE #104</p>
                <p className="text-[10px] text-[var(--global-text-muted)]">VAT REG TIN: 009-842-113-000</p>
                <div className="my-2 border-t border-dashed border-neutral-400 dark:border-neutral-600" />
                <p className="text-lg font-black tracking-widest text-[#EC0000]">CLAIM: #A-101</p>
                <p className="text-[10px]">FULFILLMENT: STAFF-ASSIST RETRIEVAL</p>
                <div className="my-2 border-t border-dashed border-neutral-400 dark:border-neutral-600" />
              </div>

              <div className="space-y-1 py-1">
                <div className="flex justify-between text-[11px]">
                  <span>AIRism Crew Neck T-Shirt (M / Olive)</span>
                  <span className="font-bold">₱790.00</span>
                </div>
                <p className="text-[9px] text-[var(--global-text-muted)]">SKU: 452901-57-M · QTY: 1</p>
              </div>

              <div className="my-2 border-t border-dashed border-neutral-400 dark:border-neutral-600" />

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₱790.00</span>
                </div>
                <div className="flex justify-between text-[10px] text-[var(--global-text-muted)]">
                  <span>VATable Sales (Subtotal / 1.12)</span>
                  <span>₱705.36</span>
                </div>
                <div className="flex justify-between text-[10px] text-[var(--global-text-muted)]">
                  <span>12% Value Added Tax</span>
                  <span>₱84.64</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-neutral-300 dark:border-neutral-700">
                  <span>TOTAL PAID (QRPH)</span>
                  <span className="text-[#EC0000]">₱790.00</span>
                </div>
              </div>

              <div className="my-3 border-t border-dashed border-neutral-400 dark:border-neutral-600" />

              <div className="text-center space-y-1 text-[9px] text-[var(--global-text-muted)]">
                <p>REF: PM-QRPH-9021-X9A</p>
                <p>2026-09-08 14:32:09 UTC+8</p>
                <p className="pt-2 font-semibold">THANK YOU FOR SHOPPING WITH US</p>
                <p className="font-['Noto_Sans_JP',sans-serif]">お買い上げありがとうございます</p>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Engineering Decisions */}
      <Section id="sell-decisions" kicker="// ENGINEERING TRADEOFFS" title="Production decisions, verified under concurrency">
        <div className="grid gap-5 md:grid-cols-3">
          {project.decisions.map((d) => (
            <TiltCard key={d.title}>
              <div className="h-full p-6">
                <Lock className="h-5 w-5 text-[var(--accent-primary)]" aria-hidden />
                <h3 className="mt-3 text-base font-semibold text-[var(--global-text)]">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--global-text-muted)]">{d.detail}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* Tech Stack */}
      <Section id="sell-stack" kicker="// TECH STACK" title=".NET 8 LTS Clean Architecture & hardware rails">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.stack.map((s) => (
            <div key={s.name} className="rounded-xl border border-[var(--global-border)] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--global-text)]">
                <Layers className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden />
                {s.name}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--global-text-muted)]">{s.reason}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Lessons Learned */}
      <Section id="sell-lessons" kicker="// LESSONS" title="What high-concurrency apparel retail taught">
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
