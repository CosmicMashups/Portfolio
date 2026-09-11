import type { CSSProperties } from 'react'
import type { ProjectId } from '@/config/project.types'
import { projectLogoSrc } from '@/config/projectLogos'
import { cssVarsForProject } from '@/lib/designDoc/buildProjectThemes'
import { cn } from '@/components/ui/cn'

const SIZE_CLASS: Record<'sm' | 'md', string> = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
}

type ProjectCircleLogoProps = {
  projectId: ProjectId
  size?: 'sm' | 'md'
  /** Scope accent CSS variables to this project (for lists where global accent may be another project). */
  useProjectAccent?: boolean
  className?: string
}

export function ProjectCircleLogo({
  projectId,
  size = 'md',
  useProjectAccent = false,
  className,
}: ProjectCircleLogoProps) {
  const scopeStyle = useProjectAccent ? (cssVarsForProject(projectId) as CSSProperties) : undefined
  const src = projectLogoSrc(projectId)

  return (
    <div
      style={scopeStyle}
      className={cn(
        'shrink-0 overflow-hidden rounded-2xl border border-[color:color-mix(in_oklab,var(--accent-primary)_32%,var(--global-border))] bg-[var(--global-surface)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-primary)_12%,transparent)_inset]',
        size === 'sm' ? 'rounded-xl' : 'rounded-2xl',
        SIZE_CLASS[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={size === 'sm' ? 40 : 56}
          height={size === 'sm' ? 40 : 56}
          className="h-full w-full object-cover transition-transform"
          decoding="async"
          draggable={false}
          aria-hidden
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-[var(--font-display)] font-semibold text-[var(--accent-primary)]"
          style={{ fontSize: size === 'sm' ? 16 : 20 }}
          aria-hidden
        >
          {projectId.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  )
}
