import { useCallback, useMemo } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { ProjectId } from '@/config/project.types'
import {
  SKILL_EDGES,
  layoutSkillNodes,
  type SkillNode,
} from '@/components/skills/skills.data'
import { cn } from '@/components/ui/cn'

function SkillNodeView(props: NodeProps) {
  const data = props.data as SkillNode
  return (
    <div
      data-cursor="hover"
      className={cn(
        'relative min-w-[120px] rounded-lg border px-2 py-1.5 text-[11px] shadow-md transition-colors',
        props.selected
          ? 'border-[var(--accent-primary)] bg-[color:color-mix(in_oklab,var(--accent-primary)_22%,var(--global-surface))] text-[var(--global-text)]'
          : 'border-[var(--global-border)] bg-[var(--global-surface)] text-[var(--global-text-muted)]',
      )}
    >
      <Handle type="target" position={Position.Top} className="!h-2 !w-2 !border-[var(--global-border)] !bg-[var(--global-surface)]" />
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2 !border-[var(--global-border)] !bg-[var(--global-surface)]" />
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="font-semibold text-[var(--global-text)]">{data.label}</div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              className="z-50 rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-2 py-1 text-[10px]"
            >
              <div>{data.category}</div>
              <div>Linked: {data.projectIds.join(', ')}</div>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-[var(--global-text-muted)]">
        {data.category}
      </div>
    </div>
  )
}

const nodeTypes = { skill: SkillNodeView }

export function SkillsGraph({
  onSelectProject,
}: {
  onSelectProject?: (id: ProjectId) => void
}) {
  const initialNodes: Node[] = useMemo(
    () =>
      layoutSkillNodes().map((n) => ({
        id: n.id,
        position: n.position,
        type: 'skill',
        data: n.data,
      })),
    [],
  )

  const initialEdges: Edge[] = useMemo(
    () =>
      SKILL_EDGES.map((e, i) => ({
        id: `${e.source}-${e.target}-${i}`,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: 'color-mix(in oklab, var(--accent-primary) 45%, transparent)', strokeWidth: 1 },
      })),
    [],
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

  return (
    <div
      data-cursor="drag"
      className="w-full overflow-hidden rounded-[var(--radius-project)] border border-[var(--global-border)] bg-[var(--global-surface)]/40"
    >
      <div className="h-[360px] min-h-[360px] w-full min-w-0 p-4 sm:h-[380px] sm:min-h-[380px] sm:p-5 md:h-[420px] md:min-h-[420px] md:p-6">
        <ReactFlow
          className="h-full w-full"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          onNodeClick={onNodeClick}
          proOptions={{ hideAttribution: true }}
          minZoom={0.6}
          maxZoom={1.4}
        >
          <Background gap={20} color="rgba(148,163,184,0.12)" />
          <MiniMap
            maskColor="rgba(10,15,30,0.85)"
            nodeStrokeColor="var(--accent-primary)"
            className="!bg-[var(--global-surface)]"
          />
          <Controls className="!bg-[var(--global-surface)] !border-[var(--global-border)] !shadow-lg" />
        </ReactFlow>
      </div>
      <p className="border-t border-[var(--global-border)] px-4 py-3 text-[11px] text-[var(--global-text-muted)]">
        Hover relationships via edges; click a node to jump to a representative project module.
      </p>
    </div>
  )
}
