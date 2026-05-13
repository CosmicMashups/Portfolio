import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type TabKey = 'latency' | 'nlp' | 'charts'

type CounterItem = {
  target: number
  suffix?: string
  decimals?: number
  label: string
}

type CandlePoint = {
  date: string
  avg: number
  high: number
  low: number
  open: number
  close: number
}

const tickerCommodities = [
  'Rice (Well-Milled)',
  'Pork Kasim',
  'Chicken Legs',
  'Galunggong',
  'Tomato',
  'Garlic',
  'Eggplant',
  'Cabbage',
  'Lakatan Banana',
  'Monggo',
  'Calamansi',
  'Beef Brisket',
  'Tilapia',
  'Milkfish',
  'Ampalaya',
] as const

const counters: CounterItem[] = [
  { target: 110, suffix: 'M+', label: 'Filipinos impacted by food price volatility' },
  { target: 20, label: 'Commodities tracked and forecasted' },
  { target: 0.388, decimals: 3, label: 'MAE for Well-Milled Rice (best performer)' },
  { target: 4, label: 'User groups served: Consumers, Retailers, Farmers, Policymakers' },
]

const historicalBase = [
  { date: 'Oct 1', avg: 51.2, high: 51.8, low: 50.6 },
  { date: 'Oct 2', avg: 51.5, high: 52.1, low: 51.0 },
  { date: 'Oct 3', avg: 51.3, high: 51.9, low: 50.8 },
  { date: 'Oct 4', avg: 51.8, high: 52.4, low: 51.2 },
  { date: 'Oct 5', avg: 52.0, high: 52.6, low: 51.5 },
  { date: 'Oct 6', avg: 51.7, high: 52.3, low: 51.2 },
  { date: 'Oct 7', avg: 52.1, high: 52.8, low: 51.6 },
] as const

const forecastedBase = [
  { date: 'Oct 8', avg: 52.3, high: 53.0, low: 51.8 },
  { date: 'Oct 9', avg: 52.5, high: 53.2, low: 52.0 },
  { date: 'Oct 10', avg: 52.4, high: 53.1, low: 51.9 },
  { date: 'Oct 11', avg: 52.7, high: 53.4, low: 52.2 },
  { date: 'Oct 12', avg: 52.9, high: 53.6, low: 52.4 },
  { date: 'Oct 13', avg: 53.1, high: 53.8, low: 52.6 },
  { date: 'Oct 14', avg: 52.8, high: 53.5, low: 52.3 },
] as const

const features = [
  {
    icon: '[CHART]',
    title: 'Real-Time Price Dashboard',
    description:
      'Interactive OHLC candlestick charts powered by Chart.js for 20+ commodities. Users can toggle between historical trends and AI-generated forecasts, with crosshair tooltips showing precise date-to-price data at any point.',
  },
  {
    icon: '[NLP]',
    title: 'AI Sentiment Classification',
    description:
      'Contact form feedback is automatically classified as positive or negative using a Scikit-learn NLP model. The UI dynamically adapts its response dialog inside a live ML-integrated PHP form workflow.',
  },
  {
    icon: '[FAST]',
    title: 'Zero-Latency Forecasting',
    description:
      'ARIMA models are trained offline and serialized to JSON. The frontend reads predictions as static assets, achieving sub-100ms chart loads regardless of model complexity.',
  },
  {
    icon: '[UI]',
    title: 'Command Center UI',
    description:
      'Bloomberg-inspired dark interface with monospaced financial typography, bullish and bearish semantic colors, and a particle-style animated background for data-dense display.',
  },
  {
    icon: '[SAFE]',
    title: 'Security-First Backend',
    description:
      'PHP backend applies four layers of protection: htmlspecialchars() for XSS, filter_var() for validation, escapeshellarg() for shell injection prevention, and MySQLi prepared statements for SQL injection defense.',
  },
  {
    icon: '[MOD]',
    title: 'Modular JS Architecture',
    description:
      'Frontend JavaScript is split into domain files (top_prices.js, gdp.js, collapsible-list.js) rather than a monolith, reducing parse cost and improving maintainability.',
  },
] as const

const stakeholders = [
  {
    icon: '[BUYERS]',
    name: 'Consumers',
    value:
      'Budget more accurately by knowing whether rice or meat prices are expected to rise next week before going to the market.',
  },
  {
    icon: '[SHOPS]',
    name: 'Retailers',
    value:
      'Optimize inventory and pricing decisions by anticipating commodity cost changes 1-2 weeks in advance, reducing overstocking risk.',
  },
  {
    icon: '[FARMS]',
    name: 'Farmers',
    value:
      'Time harvests and sales strategically by forecasting when prices for produce are expected to peak in Metro Manila markets.',
  },
  {
    icon: '[POLICY]',
    name: 'Policymakers',
    value:
      'Monitor market stability trends and identify commodities with unusual volatility for early regulatory intervention.',
  },
] as const

const techStack = {
  dataScience: [
    ['Python', 'ARIMA modeling & NLP classification'],
    ['Jupyter', 'Model training environment'],
    ['Pandas', 'Data wrangling & time-series preprocessing'],
    ['Statsmodels', 'ARIMA implementation'],
    ['Scikit-learn', 'Sentiment classifier'],
    ['NLTK', 'Text tokenization & stop-word removal'],
    ['Joblib', 'Model serialization'],
  ],
  backend: [
    ['PHP 8.x', 'Server-side logic & form handling'],
    ['MySQL', 'Relational data storage'],
    ['Apache/XAMPP', 'Local development server'],
  ],
  frontend: [
    ['Vanilla JavaScript', 'SPA interaction logic'],
    ['Chart.js', 'Financial chart rendering'],
    ['Particles.js', 'Animated background'],
    ['HTML5 / CSS3', 'Structure & styling'],
    ['FontAwesome', 'Iconography'],
  ],
} as const

const arimaRows = [
  { commodity: 'Well-Milled Rice', p: 2, d: 1, q: 1, mae: 0.388, notes: 'Most stable' },
  { commodity: 'Beef Brisket', p: 3, d: 1, q: 2, mae: 1.24, notes: 'Moderate volatility' },
  { commodity: 'Tomato', p: 4, d: 1, q: 3, mae: 3.87, notes: 'Highly volatile' },
  { commodity: 'Garlic', p: 3, d: 2, q: 2, mae: 4.12, notes: 'Seasonal spikes' },
  { commodity: 'Lakatan Banana', p: 2, d: 1, q: 1, mae: 0.94, notes: 'Consistent' },
] as const

const sectionClass =
  'ari-reveal mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 xl:px-10 xl:py-20'

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t)
}

function useCountUp(target: number, duration = 1500, decimals = 0) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const startTime = performance.now()

        const tick = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          setCount(target * easeOutExpo(progress))
          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [duration, target])

  return {
    ref,
    text: count.toFixed(decimals),
  }
}

function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.classList.add('visible')
        observer.disconnect()
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}

function withOpenClose(values: ReadonlyArray<{ date: string; avg: number; high: number; low: number }>): CandlePoint[] {
  return values.map((d, idx) => {
    const open = Number((d.avg + (idx % 2 === 0 ? -0.18 : 0.12)).toFixed(2))
    const close = Number((d.avg + (idx % 2 === 0 ? 0.16 : -0.14)).toFixed(2))
    return { ...d, open, close }
  })
}

function CandlestickShape(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: CandlePoint
  value?: number
}) {
  const x = props.x ?? 0
  const y = props.y ?? 0
  const width = props.width ?? 0
  const height = props.height ?? 0
  const payload = props.payload
  if (!payload) return null

  const bullish = payload.close >= payload.open
  const bodyColor = bullish ? '#10B981' : '#F43F5E'
  const centerX = x + width / 2
  const bodyWidth = Math.max(8, width * 0.55)
  const bodyX = centerX - bodyWidth / 2
  const bodyHeight = Math.max(6, height * 0.22)
  const bodyY = y + height * 0.35

  return (
    <g>
      <line x1={centerX} y1={y + 2} x2={centerX} y2={y + height - 2} stroke={bodyColor} strokeWidth={1.5} opacity={0.9} />
      <rect x={bodyX} y={bodyY} width={bodyWidth} height={bodyHeight} fill={bodyColor} rx={1.5} />
    </g>
  )
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: CandlePoint }>
}) {
  const point = payload?.[0]?.payload as CandlePoint | undefined
  if (!active || !point) return null
  return (
    <div className="rounded border border-[#1E2D45] bg-[#0F1520] p-3 text-xs shadow-lg">
      <p className="ari-mono text-[#D0E0F0]">{point.date}</p>
      <p className="ari-mono text-[#9BB0CC]">Avg: {point.avg.toFixed(2)}</p>
      <p className="ari-mono text-[#9BB0CC]">High: {point.high.toFixed(2)}</p>
      <p className="ari-mono text-[#9BB0CC]">Low: {point.low.toFixed(2)}</p>
    </div>
  )
}

function RevealSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRevealOnScroll<HTMLElement>()
  return (
    <section ref={ref} className={`${sectionClass} ${className}`}>
      {children}
    </section>
  )
}

export default function AriMarketDeepDive() {
  const [activeTab, setActiveTab] = useState<TabKey>('latency')
  const [windowMode, setWindowMode] = useState<'historical' | 'forecasted'>('historical')
  const [expanded, setExpanded] = useState(false)

  const tabIndex = activeTab === 'latency' ? 0 : activeTab === 'nlp' ? 1 : 2
  const chartData = useMemo(
    () => (windowMode === 'historical' ? withOpenClose(historicalBase) : withOpenClose(forecastedBase)),
    [windowMode],
  )

  const minPrice = Math.min(...chartData.map((d) => d.low)) - 0.5
  const maxPrice = Math.max(...chartData.map((d) => d.high)) + 0.5

  return (
    <div className="w-full overflow-x-clip bg-[#080C14] text-[#D0E0F0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&display=swap');
        .ari-root { --ari-black:#080C14; --ari-surface:#0F1520; --ari-card:#141C2C; --ari-border:#1E2D45; --ari-muted:#4A6080; --ari-text:#D0E0F0; --ari-bull:#10B981; --ari-bear:#F43F5E; --ari-amber:#F59E0B; --ari-blue:#3B82F6; --ari-glow:rgba(16,185,129,.15); }
        .ari-mono { font-family:'JetBrains Mono', monospace; }
        .ari-display { font-family:'Syne', sans-serif; }
        .ari-reveal { opacity:0; transform:translateY(24px); transition:opacity .5s ease, transform .5s ease; }
        .ari-reveal.visible { opacity:1; transform:translateY(0); }
        .ari-marquee { animation: ari-marquee 28s linear infinite; }
        @keyframes ari-marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        .ari-scanline { animation: ari-scan 1.8s ease-out 1; }
        @keyframes ari-scan { from { transform:translateY(-120%); opacity:0; } 25% { opacity:.55; } to { transform:translateY(120%); opacity:0; } }
        .ari-pulseline::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg, transparent, var(--ari-bull), transparent); transform:translateX(-100%); animation: ari-travel 2s linear infinite; opacity:.45; }
        @keyframes ari-travel { to { transform:translateX(100%); } }
        .ari-gridbg { background-image: linear-gradient(to right, rgba(74,96,128,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,96,128,.15) 1px, transparent 1px); background-size: 24px 24px; }
        @keyframes ari-node-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .ari-node-cascade { opacity:0; animation: ari-node-in 0.45s ease forwards; }
      `}</style>
      <div className="ari-root">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-[#1E2D45] px-4">
          <div className="pointer-events-none absolute inset-0">
            <div className="ari-scanline absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-transparent via-[#10B981]/20 to-transparent" />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <div className="ari-marquee ari-mono flex min-w-[200%] gap-8 whitespace-nowrap text-4xl uppercase tracking-widest text-white/[0.07] sm:text-6xl">
              {[...tickerCommodities, ...tickerCommodities].map((item, idx) => (
                <span key={`${item}-${idx}`}>{item} ·</span>
              ))}
            </div>
          </div>
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
            <p className="ari-mono text-xs uppercase tracking-[0.24em] text-[#10B981]">[ CASE STUDY / 2024 ]</p>
            <h1 className="ari-display mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-7xl">AriMarket</h1>
            <p className="ari-display mt-4 max-w-2xl text-base text-[#9BB0CC] sm:text-xl">
              AI-Driven Commodity Price Prediction for Metro Manila
            </p>
            <p className="ari-display mt-6 max-w-3xl text-sm leading-relaxed text-[#D0E0F0]/90 sm:text-base">
              AriMarket is a commodity price forecasting platform that uses trained ARIMA time-series models to predict
              future prices for 20+ basic commodities in Metro Manila, helping consumers, retailers, and policymakers
              make smarter financial decisions in a volatile market.
            </p>
            <p className="ari-display mx-auto mt-4 max-w-3xl text-left text-sm leading-relaxed text-[#B9C9DD] sm:text-base">
              <span className="ari-mono text-[#10B981]">Core engineering feat:</span> The ML inference layer is fully
              decoupled from the live web stack. Python ARIMA models train offline in Jupyter, predictions serialize to
              static JSON, and the frontend reads them as a static asset API for millisecond loads instead of multi-second
              live inference.
            </p>
            <p className="ari-display mx-auto mt-3 max-w-3xl text-left text-sm leading-relaxed text-[#B9C9DD] sm:text-base">
              <span className="ari-mono text-[#F59E0B]">Secondary feat:</span> A PHP backend shells out to a live Python
              NLP sentiment pipeline, classifies feedback, and adapts the UI response without standing up a microservice.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="ari-mono rounded-full border border-[#1E2D45] bg-[#141C2C]/80 px-4 py-2 text-sm text-[#10B981]">
                20+ Commodities Tracked
              </span>
              <span className="ari-mono rounded-full border border-[#1E2D45] bg-[#141C2C]/80 px-4 py-2 text-sm text-[#10B981]">
                MAE: 0.388 on Well-Milled Rice
              </span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['[ARIMA]', '[NLP / Scikit-learn]', '[Chart.js Candlestick]'].map((tag) => (
                <span key={tag} className="ari-mono rounded border border-[#1E2D45] bg-[#0F1520] px-3 py-1 text-xs text-[#D0E0F0]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="ari-display mt-8 flex items-center gap-3 text-sm">
              <a href="#" className="text-[#10B981] hover:text-[#34D399]">
                View Live Demo ↗
              </a>
              <span className="text-[#4A6080]">|</span>
              <a href="#" className="text-[#10B981] hover:text-[#34D399]">
                Read the Paper ↗
              </a>
            </div>
          </div>
        </section>

        <RevealSection>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="ari-display text-3xl font-bold text-white">The Problem & Why It Matters</h2>
              <p className="ari-display leading-relaxed text-[#B9C9DD]">
                In the Philippines, the prices of basic commodities - rice, meat, fish, and vegetables - fluctuate
                dramatically due to weather, supply chains, and seasonal demand. For households living paycheck to
                paycheck, an unexpected price spike in pork or rice is not just inconvenient - it disrupts entire
                monthly budgets.
              </p>
              <p className="ari-display leading-relaxed text-[#B9C9DD]">
                Government price monitoring exists, but it is reactive. Consumers see prices after they have already
                changed. AriMarket flips this equation: <span className="text-[#10B981]">predict before it happens.</span>
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {counters.map((item, index) => (
                <CounterCard key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection>
          <h2 className="ari-display text-3xl font-bold text-white">The Core Engineering Innovation</h2>
          <div className="mt-6 rounded-2xl border border-[#1E2D45] bg-[#0F1520] p-4 sm:p-6">
            <div className="relative border-b border-[#1E2D45]">
              <div className="relative grid grid-cols-1 sm:grid-cols-3">
                <TabButton active={activeTab === 'latency'} onClick={() => setActiveTab('latency')} label="Zero-Latency Forecasting" />
                <TabButton active={activeTab === 'nlp'} onClick={() => setActiveTab('nlp')} label="PHP x Python NLP Bridge" />
                <TabButton active={activeTab === 'charts'} onClick={() => setActiveTab('charts')} label="Candlestick Charts" />
              </div>
              <span
                className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-1/3 bg-[#10B981] transition-transform duration-200 ease-out"
                style={{ transform: `translateX(${tabIndex * 100}%)` }}
              />
            </div>
            <div className="mt-6 min-h-[480px]">
              {activeTab === 'latency' ? <LatencyTab /> : null}
              {activeTab === 'nlp' ? <NlpTab /> : null}
              {activeTab === 'charts' ? (
                <ChartsTab
                  data={chartData}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  mode={windowMode}
                  setMode={setWindowMode}
                />
              ) : null}
            </div>
          </div>
        </RevealSection>

        <RevealSection>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="ari-mono flex items-center gap-3 text-sm text-[#10B981]"
          >
            [ {expanded ? '-' : '+'} ] View Technical Methodology
          </button>
          <div
            style={{ maxHeight: expanded ? '2000px' : '0', overflow: 'hidden', transition: 'max-height 0.5s ease' }}
            className="mt-4 rounded-2xl border border-[#1E2D45] bg-[#0F1520]"
          >
            <div className="space-y-8 p-6">
              <div>
                <h3 className="ari-display text-2xl font-bold text-white">What is ARIMA?</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {[
                    ['AR (AutoRegressive)', 'Past prices predict future prices', 'p parameter'],
                    ['I (Integrated)', 'Differencing makes data stationary', 'd parameter'],
                    ['MA (Moving Average)', 'Past forecast errors refine predictions', 'q parameter'],
                  ].map(([title, desc, param]) => (
                    <div key={title} className="rounded-xl border border-[#1E2D45] bg-[#141C2C] p-4 transition hover:shadow-[0_0_0_1px_rgba(16,185,129,.35),0_0_24px_rgba(16,185,129,.12)]">
                      <p className="ari-display font-semibold text-white">{title}</p>
                      <p className="ari-display mt-2 text-sm text-[#B9C9DD]">{desc}</p>
                      <p className="ari-mono mt-3 text-xs text-[#10B981]">{param}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="ari-display text-2xl font-bold text-white">ACF/PACF Parameter Tuning</h3>
                <p className="ari-display mt-3 text-sm leading-relaxed text-[#B9C9DD]">
                  The ARIMA model requires three parameters, p, d, q, that are manually tuned per commodity. AriMarket
                  used ACF and PACF plots to identify optimal lag values across 20+ commodities.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full border-collapse ari-mono text-sm">
                    <thead>
                      <tr className="bg-[#141C2C] text-[#9BB0CC]">
                        {['Commodity', 'p', 'd', 'q', 'MAE', 'Notes'].map((h) => (
                          <th key={h} className="border border-[#1E2D45] px-3 py-2 text-left font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {arimaRows.map((row) => (
                        <tr key={row.commodity}>
                          <td className="border border-[#1E2D45] px-3 py-2">{row.commodity}</td>
                          <td className="border border-[#1E2D45] px-3 py-2">{row.p}</td>
                          <td className="border border-[#1E2D45] px-3 py-2">{row.d}</td>
                          <td className="border border-[#1E2D45] px-3 py-2">{row.q}</td>
                          <td className={`border border-[#1E2D45] px-3 py-2 ${row.mae < 1 ? 'text-[#10B981]' : row.mae <= 3 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>
                            {row.mae}
                          </td>
                          <td className="border border-[#1E2D45] px-3 py-2 text-[#9BB0CC]">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="rounded-xl border border-[#1E2D45] bg-[#141C2C] p-5">
                <p className="ari-display text-sm leading-relaxed text-[#D0E0F0]">
                  <span className="font-semibold text-[#10B981]">Why do stable commodities forecast better?</span>{' '}
                  ARIMA excels at linear trends and seasonal cycles. Rice and meat prices move in predictable arcs,
                  while tomatoes and garlic face sudden supply shocks. This points to hybrid LSTM models as the next
                  evolution.
                </p>
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="rounded-2xl border border-[#1E2D45] bg-[#0B0F19]">
          <h2 className="ari-display text-3xl font-bold text-white">System Architecture Overview</h2>
          <div className="mt-6 overflow-x-auto">
            <svg viewBox="0 0 1200 520" className="h-auto min-w-[960px] w-full">
              <defs>
                <path id="lineOne" d="M350 140 C 430 140, 520 140, 600 140" />
                <path id="lineTwo" d="M350 320 C 430 320, 520 320, 600 320" />
                <path id="lineThree" d="M750 220 C 820 220, 900 220, 970 220" />
              </defs>
              <Layer x={40} y={60} color="#F59E0B" title="Data Science Layer" lines={['Jupyter Notebooks', 'ARIMA Training Pipeline', 'ACF/PACF Analysis', '20+ Commodity Models', 'Outputs: JSON files']} />
              <Layer x={40} y={260} color="#F59E0B" title="Python NLP Engine" lines={['NLTK Tokenizer', 'Scikit-learn Classifier', 'Joblib Model Loader']} />
              <Layer x={430} y={60} color="#3B82F6" title="Backend Layer" lines={['PHP 8.x Backend', 'Form Handler', 'exec() Bridge', 'Polling Mechanism', 'MySQLi Prepared Stmts']} />
              <Layer x={430} y={260} color="#3B82F6" title="MySQL Database" lines={['contacts table', '(name, email, concern, sentiment)']} />
              <Layer x={820} y={60} color="#10B981" title="Frontend Layer" lines={['Vanilla JS / HTML', 'Fetch API to JSON files', 'Chart.js Financial', 'Particles.js BG']} />
              <Layer x={820} y={260} color="#10B981" title="UI System" lines={['Dark Mode Toggle', 'Monospace Typography', 'Bullish/Bearish Colors']} />

              <line x1="350" y1="140" x2="430" y2="140" stroke="#1E2D45" strokeWidth="2" />
              <line x1="350" y1="320" x2="430" y2="320" stroke="#1E2D45" strokeWidth="2" />
              <line x1="750" y1="220" x2="820" y2="220" stroke="#1E2D45" strokeWidth="2" />

              <circle r="5" fill="#10B981">
                <animateMotion dur="2.8s" repeatCount="indefinite">
                  <mpath xlinkHref="#lineOne" href="#lineOne" />
                </animateMotion>
              </circle>
              <circle r="5" fill="#3B82F6">
                <animateMotion dur="3.2s" begin="0.4s" repeatCount="indefinite">
                  <mpath xlinkHref="#lineTwo" href="#lineTwo" />
                </animateMotion>
              </circle>
              <circle r="5" fill="#F59E0B">
                <animateMotion dur="3s" begin="0.8s" repeatCount="indefinite">
                  <mpath xlinkHref="#lineThree" href="#lineThree" />
                </animateMotion>
              </circle>
            </svg>
          </div>
          <p className="ari-display mt-5 text-sm text-[#B9C9DD]">
            <span className="text-[#10B981]">Polyglot by necessity, elegant by design.</span> Each layer speaks its
            native language and is connected by clear contracts: JSON files, shell arguments, and HTTP forms.
          </p>
        </RevealSection>

        <RevealSection>
          <h2 className="ari-display text-3xl font-bold text-white">Features Grid</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((card, index) => (
              <article
                key={card.title}
                style={{ transitionDelay: `${index * 80}ms` }}
                className="rounded-xl border border-[#1E2D45] bg-[#141C2C]/80 p-5 transition hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(16,185,129,.45),0_8px_28px_rgba(16,185,129,.12)]"
              >
                <p className="ari-mono text-xs text-[#10B981]">{card.icon}</p>
                <h3 className="ari-display mt-2 text-lg font-semibold text-white">{card.title}</h3>
                <p className="ari-display mt-2 text-sm leading-relaxed text-[#B9C9DD]">{card.description}</p>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection>
          <h2 className="ari-display text-3xl font-bold text-white">Challenges & Engineering Decisions</h2>
          <div className="mt-6 space-y-8 border-l border-[#1E2D45] pl-6">
            <TimelineItem
              title="The Latency Problem"
              problem="Live ARIMA inference on every request caused 3-8 second loads and high server CPU."
              solution="Decoupled ML from runtime: models run offline, predictions serialize to JSON, and the web server serves static assets only."
              insight="This precompute pattern mirrors static generation architectures used in modern frontend frameworks."
            />
            <TimelineItem
              title="The Polyglot Bridge Problem"
              problem="PHP cannot natively run Python ML models, and a separate microservice was out of budget."
              solution="Used PHP exec() with sanitized arguments and a polling loop (max 10 retries x 3-second sleep) for cross-process coordination."
              insight="Pragmatic shell-based IPC can outperform over-engineered infrastructure in constrained environments."
            />
            <TimelineItem
              title="The Volatility Problem"
              problem="ARIMA performed best on stable commodities but had higher MAE on volatile produce."
              solution="Documented limitations and traced error to exogenous shocks outside historical-only time-series signals."
              insight="Next evolution is a hybrid LSTM model with weather and harvest features."
            />
          </div>
        </RevealSection>

        <RevealSection>
          <h2 className="ari-display text-3xl font-bold text-white">Impact & Stakeholder Matrix</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stakeholders.map((item, index) => (
              <article key={item.name} style={{ transitionDelay: `${index * 80}ms` }} className="rounded-xl border border-[#1E2D45] bg-[#141C2C]/80 p-5">
                <p className="ari-mono text-xs text-[#10B981]">{item.icon}</p>
                <h3 className="ari-display mt-2 text-lg font-semibold text-white">{item.name}</h3>
                <p className="ari-display mt-2 text-sm leading-relaxed text-[#B9C9DD]">{item.value}</p>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection>
          <h2 className="ari-display text-3xl font-bold text-white">Tech Stack Visual</h2>
          <div className="mt-6 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-6">
              {Object.entries(techStack).map(([layer, list]) => (
                <div key={layer} className="w-[320px] rounded-xl border border-[#1E2D45] bg-[#141C2C]/70 p-4">
                  <p className="ari-display text-sm font-semibold capitalize text-[#10B981]">{layer}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {list.map(([name, role]) => (
                      <div key={name} className="rounded border border-[#1E2D45] bg-[#0F1520] px-3 py-2">
                        <p className="ari-mono text-xs text-[#D0E0F0]">[{name}]</p>
                        <p className="ari-display mt-1 text-xs text-[#9BB0CC]">{role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="ari-gridbg rounded-2xl border border-[#1E2D45] bg-[#0B0F19] text-center">
          <h2 className="ari-display text-4xl font-bold text-white">What&apos;s Next for AriMarket</h2>
          <p className="ari-display mx-auto mt-4 max-w-4xl leading-relaxed text-[#B9C9DD]">
            AriMarket proved the concept: commodity price forecasting is practical and useful at the local level. The
            current ARIMA baseline is highly accurate for stable commodities, while volatile markets demand more
            expressive models.
          </p>
          <p className="ari-display mx-auto mt-4 max-w-4xl leading-relaxed text-[#B9C9DD]">
            The roadmap points toward LSTM hybrid models with external signals, daily automated scraping for continuously
            refreshed JSON outputs, and a RESTful FastAPI service replacing the PHP shell bridge with a clean HTTP
            contract.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#" className="ari-display rounded border border-[#10B981] px-5 py-2 text-sm text-[#10B981] hover:bg-[#10B981]/10">
              View Research Paper ↗
            </a>
            <Link
              to="/#projects"
              className="ari-display inline-flex rounded bg-[#141C2C] px-5 py-2 text-sm text-white hover:bg-[#1C2740]"
            >
              Explore More Projects →
            </Link>
          </div>
        </RevealSection>
      </div>
    </div>
  )
}

function CounterCard({ item, index }: { item: CounterItem; index: number }) {
  const { ref, text } = useCountUp(item.target, 1500, item.decimals ?? 0)
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 80}ms` }}
      className="rounded-xl border border-[#1E2D45] bg-[#141C2C] p-4"
    >
      <p className="ari-mono text-3xl font-semibold text-[#10B981]">
        {text}
        {item.suffix ?? ''}
      </p>
      <p className="ari-display mt-2 text-xs text-[#9BB0CC]">{item.label}</p>
    </div>
  )
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ari-display w-full px-1 pb-3 text-center text-sm sm:px-2 ${active ? 'text-[#10B981]' : 'text-[#9BB0CC] hover:text-[#D0E0F0]'}`}
    >
      {label}
    </button>
  )
}

function LatencyTab() {
  const nodes = [
    ['Jupyter Notebook', 'train ARIMA model'],
    ['Python ARIMA Engine', 'serialize predictions'],
    ['Static JSON Files', 'e.g. tomato.json, rice.json'],
    ['Vanilla JS Frontend', 'Fetch API'],
    ['User sees chart in <100ms', 'Chart.js render'],
  ] as const
  return (
    <div className="space-y-6">
      <p className="ari-display text-sm leading-relaxed text-[#B9C9DD]">
        Running ARIMA prediction live on every request takes 3-8 seconds per commodity and spikes CPU. AriMarket
        inverts this flow: machine learning completes before a user loads the page.
      </p>
      <div className="grid gap-3">
        {nodes.map(([name, sub], index) => (
          <div
            key={name}
            className="ari-node-cascade relative overflow-hidden rounded border border-[#1E2D45] bg-[#141C2C] p-3"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="ari-pulseline absolute inset-0" />
            <p className={`ari-mono relative z-10 text-sm ${index === nodes.length - 1 ? 'text-[#10B981]' : 'text-[#D0E0F0]'}`}>[ {name} ]</p>
            <p className="ari-display relative z-10 mt-1 text-xs text-[#9BB0CC]">{sub}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded border border-[#1E2D45]">
        <table className="min-w-full border-collapse ari-mono text-sm">
          <thead>
            <tr className="bg-[#141C2C] text-[#9BB0CC]">
              <th className="border border-[#1E2D45] px-3 py-2 text-left">Metric</th>
              <th className="border border-[#1E2D45] px-3 py-2 text-left">Live Inference</th>
              <th className="border border-[#1E2D45] px-3 py-2 text-left text-[#10B981]">AriMarket Approach</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Load time', '3-8 seconds', '< 100ms'],
              ['Server CPU during request', 'High', 'None'],
              ['Scalability', 'Limited', 'Infinite (static CDN)'],
              ['ML model complexity', 'Constrained', 'Unlimited'],
            ].map((row) => (
              <tr key={row[0]}>
                <td className="border border-[#1E2D45] px-3 py-2">{row[0]}</td>
                <td className="border border-[#1E2D45] px-3 py-2">{row[1]}</td>
                <td className="border border-[#1E2D45] px-3 py-2 text-[#10B981]">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre className="overflow-x-auto rounded border border-[#1E2D45] bg-[#0A101A] p-4 ari-mono text-xs leading-relaxed">
        <code>
          <span className="text-[#9BB0CC]">{'{'}</span>
          {'\n  '}<span className="text-[#10B981]">"commodity"</span>: <span className="text-white">"Well-Milled Rice"</span>,
          {'\n  '}<span className="text-[#10B981]">"unit"</span>: <span className="text-white">"per kg"</span>,
          {'\n  '}<span className="text-[#10B981]">"forecast"</span>: [
          {'\n    '}<span className="text-white">{'{ "date": "2024-10-14", "avg": 52.50, "high": 53.20, "low": 51.80 },'}</span>
          {'\n    '}<span className="text-white">{'{ "date": "2024-10-15", "avg": 52.75, "high": 53.50, "low": 52.10 },'}</span>
          {'\n    '}<span className="text-white">{'{ "date": "2024-10-16", "avg": 52.90, "high": 53.80, "low": 52.30 }'}</span>
          {'\n  '}] {'\n'}
          <span className="text-[#9BB0CC]">{'}'}</span>
        </code>
      </pre>
    </div>
  )
}

function NlpTab() {
  const steps = [
    ['User submits form', 'neutral'],
    ['PHP: connect.php receives POST', 'php'],
    ['PHP: sanitizes input', 'php'],
    ["PHP: exec('python sentiment.py ... > output.txt &')", 'php'],
    ['PHP: polls output.txt (max 10 retries)', 'php'],
    ['Python: NLTK tokenizes & removes stop words', 'python'],
    ["Python: model classifies sentiment", 'python'],
    ['PHP: stores sentiment in MySQL contacts', 'php'],
    ['UI: personalized dialog rendered', 'success'],
  ] as const

  const colorFor = (kind: string): string => {
    if (kind === 'php') return '#F59E0B'
    if (kind === 'python') return '#3B82F6'
    if (kind === 'success') return '#10B981'
    return '#9BB0CC'
  }

  return (
    <div className="space-y-6">
      <p className="ari-display text-sm leading-relaxed text-[#B9C9DD]">
        AriMarket uses a pragmatic bridge: PHP receives and sanitizes form input, shells out to a live Python NLP
        classifier, polls for completion, and stores sentiment in MySQL before rendering adaptive UI feedback.
      </p>
      <div className="space-y-2">
        {steps.map(([label, kind], index) => (
          <div key={label} className="relative rounded border border-[#1E2D45] bg-[#141C2C] p-3">
            {index < steps.length - 1 ? <span className="absolute -bottom-3 left-5 h-3 w-[2px] bg-[#1E2D45]" /> : null}
            <p className="ari-mono text-sm" style={{ color: colorFor(kind) }}>
              {label}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded border border-[#1E2D45] bg-[#141C2C] p-4">
        <p className="ari-display text-sm text-[#D0E0F0]">
          <span className="font-semibold text-[#10B981]">Why not a REST microservice?</span> For a single-server
          student project, shell execution keeps infrastructure cost near zero while preserving real ML classification.
          Retry-with-sleep polling is a proven IPC pattern on shared hosting.
        </p>
      </div>
      <pre className="overflow-x-auto rounded border border-[#F59E0B]/40 bg-[#1A1510] p-4 ari-mono text-xs text-[#FDE68A]">
SECURITY MEASURES APPLIED
-------------------------
✓ htmlspecialchars()     {'->'} XSS prevention
✓ filter_var(FILTER_SANITIZE_EMAIL) {'->'} input validation
✓ escapeshellarg()       {'->'} shell injection prevention
✓ mysqli prepared statements {'->'} SQL injection prevention
      </pre>
    </div>
  )
}

function ChartsTab({
  data,
  minPrice,
  maxPrice,
  mode,
  setMode,
}: {
  data: CandlePoint[]
  minPrice: number
  maxPrice: number
  mode: 'historical' | 'forecasted'
  setMode: (mode: 'historical' | 'forecasted') => void
}) {
  return (
    <div className="space-y-4">
      <p className="ari-display text-sm leading-relaxed text-[#B9C9DD]">
        AriMarket uses OHLC candlestick visuals because commodity series follow the same structure as market data:
        open, close, high, and low per day.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="ari-mono text-sm text-[#D0E0F0]">WELL-MILLED RICE / PHP per kg</p>
        <div className="rounded border border-[#1E2D45] bg-[#141C2C] p-1">
          <button
            type="button"
            onClick={() => setMode('historical')}
            className={`ari-mono rounded px-3 py-1 text-xs ${mode === 'historical' ? 'bg-[#10B981] text-[#0A101A]' : 'text-[#9BB0CC]'}`}
          >
            Historical
          </button>
          <button
            type="button"
            onClick={() => setMode('forecasted')}
            className={`ari-mono rounded px-3 py-1 text-xs ${mode === 'forecasted' ? 'bg-[#10B981] text-[#0A101A]' : 'text-[#9BB0CC]'}`}
          >
            Forecasted
          </button>
        </div>
      </div>
      <div className="h-[320px] rounded border border-[#1E2D45] bg-[#0A101A] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,96,128,0.35)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9BB0CC' }} />
            <YAxis domain={[minPrice, maxPrice]} tick={{ fontSize: 11, fill: '#9BB0CC' }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="avg" shape={<CandlestickShape />} isAnimationActive animationDuration={650} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="ari-mono text-right text-xs text-[#10B981]">MAE: 0.388 · MSE: 0.241 · RMSE: 0.491</p>
    </div>
  )
}

function Layer({
  x,
  y,
  color,
  title,
  lines,
}: {
  x: number
  y: number
  color: string
  title: string
  lines: string[]
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="310" height="180" rx="12" fill="#0F1520" stroke={color} strokeWidth="2" />
      <text x="16" y="28" fill="#D0E0F0" fontSize="14" fontFamily="'JetBrains Mono', monospace">
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={line}
          x="16"
          y={54 + index * 22}
          fill="#9BB0CC"
          fontSize="12"
          fontFamily="'JetBrains Mono', monospace"
        >
          {line}
        </text>
      ))}
    </g>
  )
}

function TimelineItem({
  title,
  problem,
  solution,
  insight,
}: {
  title: string
  problem: string
  solution: string
  insight: string
}) {
  return (
    <article className="relative">
      <span className="absolute -left-[33px] top-1 h-3 w-3 rounded-full bg-[#F43F5E]" />
      <h3 className="ari-display text-xl font-semibold text-[#F59E0B]">{title}</h3>
      <p className="ari-display mt-2 text-sm text-[#FCA5A5]">Problem: {problem}</p>
      <p className="ari-display mt-1 text-sm text-[#86EFAC]">Solution: {solution}</p>
      <p className="ari-display mt-1 text-sm text-[#B9C9DD]">Insight: {insight}</p>
    </article>
  )
}
