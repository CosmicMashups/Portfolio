import type { LucideIcon } from 'lucide-react'
import {
  Terminal,
  Code2,
  Database,
  Layers,
  CheckCircle2,
  GitPullRequest,
  CloudUpload,
  Activity,
  Wrench,
} from 'lucide-react'
import { ENGINEERING_LIFECYCLE_STEPS as ENGINEERING_LIFECYCLE_STEPS_BY_INDEX } from './lifecycleSteps.data'

/** One icon per lifecycle stage id — shared by the carousel and the scroll rail. */
export const STEP_ICONS: Record<string, LucideIcon> = {
  requirements: Terminal,
  analysis: Layers,
  architecture: Code2,
  'database-design': Database,
  implementation: Layers,
  testing: CheckCircle2,
  'code-review': GitPullRequest,
  deployment: CloudUpload,
  monitoring: Activity,
  maintenance: Wrench,
}

/** Amber-family tint accents, varied by intensity per lifecycle category — shared by
 * the carousel and the scroll rail so the two never drift apart in color choices. */
export const CARD_THEMES: Record<string, { bg: string; border: string; badge: string; accent: string }> = {
  strategy: {
    bg: 'from-[var(--color-bg-elevated)]/90 to-[var(--color-bg-surface)]/90',
    border: 'border-[#ff6b1a]/20 hover:border-[#ff6b1a]/40',
    badge: 'bg-[#ff6b1a]/10 text-[#ff6b1a] border-[#ff6b1a]/20',
    accent: '#ff6b1a',
  },
  architecture: {
    bg: 'from-[var(--color-bg-elevated)]/90 to-[var(--color-bg-surface)]/90',
    border: 'border-[#ffa64d]/20 hover:border-[#ffa64d]/40',
    badge: 'bg-[#ffa64d]/10 text-[#ffa64d] border-[#ffa64d]/20',
    accent: '#ffa64d',
  },
  execution: {
    bg: 'from-[var(--color-bg-elevated)]/90 to-[var(--color-bg-surface)]/90',
    border: 'border-[#ffd199]/20 hover:border-[#ffd199]/40',
    badge: 'bg-[#ffd199]/10 text-[#ffd199] border-[#ffd199]/20',
    accent: '#ffd199',
  },
  reliability: {
    bg: 'from-[var(--color-bg-elevated)]/90 to-[var(--color-bg-surface)]/90',
    border: 'border-[#c9560f]/20 hover:border-[#c9560f]/40',
    badge: 'bg-[#c9560f]/10 text-[#ffb27a] border-[#c9560f]/20',
    accent: '#ffb27a',
  },
}

/** Auto-discovers images the user drops into src/assets/workflow/ — no code change
 * needed later. Matches ManifestoSection's CASUAL_IMAGES convention, except each file
 * can be named either by step id (e.g. `requirements.jpg`) or, more simply, by its
 * 1-based stage number (e.g. `1.jpg` for stage 01, `10.jpg` for stage 10). */
const WORKFLOW_MODULES = import.meta.glob<{ default: string }>(
  '/src/assets/workflow/*.{jpg,jpeg,png,webp}',
  { eager: true },
)

const WORKFLOW_IMAGES: Record<string, string> = {}
for (const [path, mod] of Object.entries(WORKFLOW_MODULES)) {
  const stem = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  if (/^\d+$/.test(stem)) {
    const stepIndex = Number.parseInt(stem, 10) - 1
    const step = ENGINEERING_LIFECYCLE_STEPS_BY_INDEX[stepIndex]
    if (step) WORKFLOW_IMAGES[step.id] = mod.default
  } else {
    WORKFLOW_IMAGES[stem] = mod.default
  }
}

export function workflowImageFor(stepId: string): string | undefined {
  return WORKFLOW_IMAGES[stepId]
}
