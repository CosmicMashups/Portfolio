import type { ReactNode } from 'react'
import { cn } from '@/components/ui/cn'
import { Panel } from '@/components/ui/Panel'

const defaultContentClass =
  'h-[220px] min-h-[220px] w-full min-w-0 text-[11px] [&_.recharts-cartesian-axis-tick-value]:fill-[var(--global-text-muted)] [&_.recharts-legend-item-text]:text-[var(--global-text-muted)]'

export function ChartShell({
  title,
  description,
  technical,
  children,
  contentClassName,
}: {
  title: string
  description?: string
  technical?: ReactNode
  children: ReactNode
  /** Override the default fixed chart height (e.g. tall dashboard mocks). */
  contentClassName?: string
}) {
  return (
    <Panel className="space-y-3">
      <div>
        <h5 className="text-sm font-semibold text-[var(--global-text)]">{title}</h5>
        {description ? (
          <p className="mt-1 text-xs text-[var(--global-text-muted)]">{description}</p>
        ) : null}
      </div>
      <div className={cn(defaultContentClass, contentClassName)}>
        {children}
      </div>
      {technical ? <div className="text-[11px] text-[var(--global-text-muted)]">{technical}</div> : null}
    </Panel>
  )
}
