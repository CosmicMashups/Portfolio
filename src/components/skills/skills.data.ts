import type { ProjectId } from '@/config/project.types'

export type SkillCategory = 'ai' | 'frontend' | 'backend' | 'tools'

export interface SkillNode extends Record<string, unknown> {
  id: string
  label: string
  category: SkillCategory
  projectIds: ProjectId[]
}

export interface SkillEdge {
  source: string
  target: string
}

/** Graph content: skills link to the projects where they materially appear. */
export const SKILL_NODES: SkillNode[] = [
  { id: 'python-ml', label: 'Python · ML', category: 'ai', projectIds: ['arimarket', 'pocketpt', 'mashhub'] },
  { id: 'pytorch', label: 'PyTorch / TFLite', category: 'ai', projectIds: ['pocketpt'] },
  { id: 'eval', label: 'Evaluation', category: 'ai', projectIds: ['arimarket', 'pocketpt'] },
  { id: 'ts', label: 'TypeScript', category: 'frontend', projectIds: ['mashhub', 'expens_io_business'] },
  { id: 'react', label: 'React', category: 'frontend', projectIds: ['mashhub', 'expens_io_business'] },
  { id: 'tailwind', label: 'Tailwind', category: 'frontend', projectIds: ['mashhub', 'expens_io_business'] },
  { id: 'flutter', label: 'Flutter', category: 'frontend', projectIds: ['pocketpt', 'expens_io'] },
  { id: 'php', label: 'PHP / LAMP', category: 'backend', projectIds: ['registrar', 'arimarket'] },
  { id: 'mysql', label: 'MySQL', category: 'backend', projectIds: ['registrar', 'arimarket'] },
  { id: 'sqlite', label: 'SQLite', category: 'backend', projectIds: ['pocketpt', 'sell_io'] },
  { id: 'firebase', label: 'Firebase', category: 'backend', projectIds: ['expens_io'] },
  { id: 'javascript', label: 'JavaScript', category: 'frontend', projectIds: ['registrar', 'arimarket'] },
  { id: 'html-css', label: 'HTML · CSS', category: 'frontend', projectIds: ['registrar', 'arimarket'] },
  { id: 'vite', label: 'Vite', category: 'tools', projectIds: ['mashhub', 'expens_io_business'] },
  {
    id: 'git',
    label: 'Git / CI',
    category: 'tools',
    projectIds: ['arimarket', 'pocketpt', 'mashhub', 'expens_io', 'registrar', 'expens_io_business', 'schedul_io', 'sell_io'],
  },
  { id: 'java-spring', label: 'Java / Spring Boot', category: 'backend', projectIds: ['schedul_io'] },
  { id: 'postgresql', label: 'PostgreSQL', category: 'backend', projectIds: ['schedul_io', 'expens_io_business'] },
  { id: 'supabase', label: 'Supabase', category: 'backend', projectIds: ['expens_io_business'] },
  { id: 'csharp-dotnet', label: 'C# / .NET 8', category: 'backend', projectIds: ['sell_io'] },
]

export const SKILL_EDGES: SkillEdge[] = [
  { source: 'python-ml', target: 'eval' },
  { source: 'python-ml', target: 'pytorch' },
  { source: 'ts', target: 'react' },
  { source: 'react', target: 'vite' },
  { source: 'react', target: 'tailwind' },
  { source: 'flutter', target: 'sqlite' },
  { source: 'flutter', target: 'firebase' },
  { source: 'php', target: 'mysql' },
  { source: 'php', target: 'javascript' },
  { source: 'javascript', target: 'html-css' },
  { source: 'php', target: 'git' },
  { source: 'vite', target: 'git' },
  { source: 'java-spring', target: 'postgresql' },
  { source: 'supabase', target: 'postgresql' },
  { source: 'react', target: 'supabase' },
  { source: 'csharp-dotnet', target: 'sqlite' },
]

/** Every graph card uses this size so layout and React Flow bounds stay aligned. */
export const SKILL_NODE_SIZE = { w: 170, h: 86 } as const

const GAP_X = 16
const GAP_Y = 12

const COL_STEP = SKILL_NODE_SIZE.w + GAP_X
const ROW_STEP = SKILL_NODE_SIZE.h + GAP_Y

/** Two columns per band: left column + `COL_STEP` + node width to right edge. */
const BAND_W = COL_STEP + SKILL_NODE_SIZE.w
const CLUSTER_GAP = 32

const ORIGIN_X = 20
const ORIGIN_Y = 16

const CAT_POS: Record<SkillCategory, { x: number; y: number }> = {
  ai: { x: ORIGIN_X, y: ORIGIN_Y },
  frontend: { x: ORIGIN_X + BAND_W + CLUSTER_GAP, y: ORIGIN_Y },
  backend: { x: ORIGIN_X + 2 * (BAND_W + CLUSTER_GAP), y: ORIGIN_Y },
  /** Second row under frontend column (six frontend nodes use three rows). */
  tools: { x: ORIGIN_X + BAND_W + CLUSTER_GAP, y: ORIGIN_Y + 3 * ROW_STEP + 16 },
}

export function layoutSkillNodes(): { id: string; position: { x: number; y: number }; data: SkillNode }[] {
  const byCat = new Map<SkillCategory, SkillNode[]>()
  for (const n of SKILL_NODES) {
    const list = byCat.get(n.category) ?? []
    list.push(n)
    byCat.set(n.category, list)
  }

  const out: { id: string; position: { x: number; y: number }; data: SkillNode }[] = []

  for (const [cat, nodes] of byCat) {
    const origin = CAT_POS[cat]
    nodes.forEach((node, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      out.push({
        id: node.id,
        position: { x: origin.x + col * COL_STEP, y: origin.y + row * ROW_STEP },
        data: node,
      })
    })
  }

  return out
}
