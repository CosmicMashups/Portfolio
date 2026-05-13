import { useCallback, useMemo, useState } from 'react'
import {
  Background,
  BaseEdge,
  Controls,
  EdgeLabelRenderer,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  getBezierPath,
  useEdgesState,
  useNodesState,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { ProjectId } from '@/config/project.types'
import { projectById } from '@/config/projects.registry'
import {
  SKILL_EDGES,
  SKILL_NODES,
  layoutSkillNodes,
  type SkillCategory,
  type SkillNode,
} from '@/components/skills/skills.data'
import { cn } from '@/components/ui/cn'
import { BorderTrace } from '@/components/ui/BorderTrace'
import { useTechnicalView } from '@/app/providers/useTechnicalView'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'

const CAT_COLOR: Record<SkillCategory, string> = {
  ai: 'var(--chart-a)',
  frontend: 'var(--chart-b)',
  backend: 'var(--chart-c)',
  tools: 'var(--chart-d)',
}

const LEGEND: { category: SkillCategory; label: string }[] = [
  { category: 'frontend', label: 'Frontend' },
  { category: 'backend', label: 'Backend' },
  { category: 'ai', label: 'AI / ML' },
  { category: 'tools', label: 'Other' },
]

function projectTitles(ids: ProjectId[]) {
  return ids
    .map((id) => projectById(id)?.title ?? id)
    .filter(Boolean)
    .join(', ')
}

function edgeSharedProjects(source: string, target: string): ProjectId[] {
  const a = SKILL_NODES.find((n) => n.id === source)
  const b = SKILL_NODES.find((n) => n.id === target)
  if (!a || !b) return []
  return a.projectIds.filter((p) => b.projectIds.includes(p))
}

function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const { technical } = useTechnicalView()
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const label = (data as { label?: string } | undefined)?.label

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {technical && label ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none max-w-[140px] rounded border border-[var(--global-border)] bg-[var(--global-surface)] px-1.5 py-0.5 text-center font-[var(--font-mono)] text-[8px] leading-tight text-[var(--global-text-muted)]"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  )
}

const edgeTypes = { labeled: LabeledEdge }

function SkillNodeView(props: NodeProps) {
  const data = props.data as SkillNode & { accent?: string }
  const accent = data.accent ?? 'var(--accent-primary)'
  return (
    <div
      data-cursor="hover"
      className={cn(
        'relative min-w-[120px] rounded-lg border px-2 py-1.5 text-[11px] shadow-md transition-colors',
        props.selected
          ? 'border-[var(--accent-primary)] bg-[color:color-mix(in_oklab,var(--accent-primary)_22%,var(--global-surface))] text-[var(--global-text)]'
          : 'bg-[var(--global-surface)] text-[var(--global-text-muted)]',
      )}
      style={{
        borderColor: props.selected ? undefined : `color-mix(in oklab, ${accent} 55%, var(--global-border))`,
      }}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-[var(--global-border)] !bg-[var(--global-surface)]" />
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border-[var(--global-border)] !bg-[var(--global-surface)]" />
      <div className="font-semibold text-[var(--global-text)]">{data.label}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-[var(--global-text-muted)]">{data.category}</div>
    </div>
  )
}

const nodeTypes = { skill: SkillNodeView }

export function SkillsGraph({
  onSelectProject,
}: {
  onSelectProject?: (id: ProjectId) => void
}) {
  const reduce = usePrefersReducedMotion()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const initialNodes: Node[] = useMemo(
    () =>
      layoutSkillNodes().map((n) => ({
        id: n.id,
        position: n.position,
        type: 'skill',
        data: { ...n.data, accent: CAT_COLOR[n.data.category] },
      })),
    [],
  )

  const initialEdges: Edge[] = useMemo(
    () =>
      SKILL_EDGES.map((e, i) => {
        const shared = edgeSharedProjects(e.source, e.target)
        const label =
          shared.length > 0
            ? `Used in: ${shared.map((id) => projectById(id)?.title ?? id).join(', ')}`
            : undefined
        return {
          id: `${e.source}-${e.target}-${i}`,
          source: e.source,
          target: e.target,
          type: 'labeled',
          animated: !reduce,
          data: { label },
          style: { stroke: 'color-mix(in oklab, var(--accent-primary) 45%, transparent)', strokeWidth: 1 },
        }
      }),
    [reduce],
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      const d = node.data as SkillNode
      const first = d.projectIds?.[0]
      if (first) onSelectProject?.(first)
    },
    [onSelectProject],
  )

  const hovered = hoveredId ? nodes.find((n) => n.id === hoveredId) : null
  const hoveredData = hovered?.data as (SkillNode & { accent?: string }) | undefined

  return (
    <div
      data-cursor="drag"
      className="relative w-full overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/50"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklab, var(--global-text-muted) 4%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--global-text-muted) 4%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div className="relative z-[1] h-[360px] min-h-[360px] w-full min-w-0 p-4 sm:h-[380px] sm:min-h-[380px] sm:p-5 md:h-[420px] md:min-h-[420px] md:p-6">
        <ReactFlow
          className="h-full w-full"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          onNodeClick={onNodeClick}
          onNodeMouseEnter={(_, n) => setHoveredId(n.id)}
          onNodeMouseLeave={() => setHoveredId(null)}
          proOptions={{ hideAttribution: true }}
          minZoom={0.6}
          maxZoom={1.4}
        >
          <Background gap={24} color="rgba(148,163,184,0.06)" />
          <MiniMap
            maskColor="rgba(10,15,30,0.85)"
            nodeStrokeColor="var(--accent-primary)"
            className="!bg-[var(--global-surface)]"
          />
          <Controls className="!bg-[var(--global-surface)] !border-[var(--global-border)] !shadow-lg" />
        </ReactFlow>
      </div>

      {hoveredData ? (
        <div className="relative z-[2] border-t border-[var(--global-border)] bg-[color:color-mix(in_oklab,var(--global-surface)_92%,transparent)] px-4 py-3 md:absolute md:bottom-14 md:left-4 md:right-auto md:max-w-xs md:rounded-lg md:border md:shadow-lg">
          <BorderTrace className="rounded-lg md:rounded-lg">
            <div className="rounded-lg border border-[var(--global-border)] p-3">
              <p className="font-[var(--font-display)] text-sm font-semibold text-[var(--global-text)]">{hoveredData.label}</p>
              <p className="mt-1 font-[var(--font-mono)] text-[10px] text-[var(--global-text-muted)]">{hoveredData.category}</p>
              <p className="mt-2 text-[11px] leading-relaxed text-[var(--global-text-muted)]">
                Used materially in: {projectTitles(hoveredData.projectIds)}.
              </p>
            </div>
          </BorderTrace>
        </div>
      ) : null}

      <div className="relative z-[1] flex flex-wrap gap-2 border-t border-[var(--global-border)] px-4 py-3">
        {LEGEND.map((L) => (
          <span
            key={L.category}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--global-border)] px-2 py-1 font-[var(--font-mono)] text-[9px] uppercase tracking-wide text-[var(--global-text-muted)]"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: CAT_COLOR[L.category] }} aria-hidden />
            {L.label}
          </span>
        ))}
      </div>

      <p className="border-t border-[var(--global-border)] px-4 py-3 text-[11px] text-[var(--global-text-muted)]">
        Drag the canvas; hover nodes for project context; click to jump to a module. Toggle Technical View for edge
        collaboration hints.
      </p>
    </div>
  )
}
