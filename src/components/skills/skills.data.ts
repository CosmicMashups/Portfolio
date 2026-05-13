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
  { id: 'ts', label: 'TypeScript', category: 'frontend', projectIds: ['arimarket', 'mashhub'] },
  { id: 'react', label: 'React', category: 'frontend', projectIds: ['arimarket', 'mashhub'] },
  { id: 'tailwind', label: 'Tailwind', category: 'frontend', projectIds: ['arimarket', 'mashhub'] },
  { id: 'flutter', label: 'Flutter', category: 'frontend', projectIds: ['pocketpt', 'expens_io'] },
  { id: 'php', label: 'PHP / LAMP', category: 'backend', projectIds: ['registrar'] },
  { id: 'mysql', label: 'MySQL', category: 'backend', projectIds: ['registrar'] },
  { id: 'sqlite', label: 'SQLite', category: 'backend', projectIds: ['pocketpt'] },
  { id: 'firebase', label: 'Firebase', category: 'backend', projectIds: ['expens_io'] },
  { id: 'javascript', label: 'JavaScript', category: 'frontend', projectIds: ['registrar'] },
  { id: 'html-css', label: 'HTML · CSS', category: 'frontend', projectIds: ['registrar'] },
  { id: 'vite', label: 'Vite', category: 'tools', projectIds: ['arimarket', 'mashhub'] },
  { id: 'git', label: 'Git / CI', category: 'tools', projectIds: ['arimarket', 'pocketpt', 'mashhub', 'expens_io', 'registrar'] },
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
]

const CAT_POS: Record<SkillCategory, { x: number; y: number }> = {
  ai: { x: 80, y: 40 },
  frontend: { x: 320, y: 40 },
  backend: { x: 560, y: 40 },
  tools: { x: 400, y: 200 },
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
        position: { x: origin.x + col * 140, y: origin.y + row * 70 },
        data: node,
      })
    })
  }

  return out
}
