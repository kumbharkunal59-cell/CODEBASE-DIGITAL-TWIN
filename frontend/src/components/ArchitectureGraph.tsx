import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MarkerType,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { ArchitectureGraph as GraphData } from "../types";
import ServiceNode from "./ServiceNode";

const nodeTypes = { service: ServiceNode };

function layoutNodes(graph: GraphData): Node[] {
  // Simple layered (BFS-depth) layout — good enough for the scaffold's graph
  // sizes; swap for dagre/elk once real scans produce hundreds of nodes.
  const depth: Record<string, number> = {};
  const adjacency: Record<string, string[]> = {};
  graph.edges.forEach((e) => {
    adjacency[e.source] = [...(adjacency[e.source] ?? []), e.target];
  });

  const roots = graph.nodes
    .map((n) => n.id)
    .filter((id) => !graph.edges.some((e) => e.target === id));

  const queue: string[] = roots.length ? [...roots] : [graph.nodes[0]?.id].filter(Boolean);
  queue.forEach((id) => (depth[id] = 0));

  while (queue.length) {
    const current = queue.shift()!;
    for (const next of adjacency[current] ?? []) {
      const nextDepth = depth[current] + 1;
      if (depth[next] === undefined || nextDepth > depth[next]) {
        depth[next] = nextDepth;
        queue.push(next);
      }
    }
  }

  const byDepth: Record<number, string[]> = {};
  graph.nodes.forEach((n) => {
    const d = depth[n.id] ?? 0;
    byDepth[d] = [...(byDepth[d] ?? []), n.id];
  });

  return graph.nodes.map((n) => {
    const d = depth[n.id] ?? 0;
    const col = byDepth[d].indexOf(n.id);
    const rowWidth = byDepth[d].length;
    return {
      id: n.id,
      type: "service",
      position: { x: col * 220 - (rowWidth * 220) / 2 + 400, y: d * 140 },
      data: { id: n.id, label: n.label, type: n.type, owner: n.owner, criticality: n.criticality },
    };
  });
}

const RELATIONSHIP_STYLE: Record<string, { stroke: string; dashed?: boolean }> = {
  CALLS: { stroke: "#5EE6C6" },
  USES: { stroke: "#7C8AA5" },
  DEPENDS_ON: { stroke: "#F5B942", dashed: true },
  DEPLOYS_TO: { stroke: "#3E4A61", dashed: true },
};

interface Props {
  graph: GraphData;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export default function ArchitectureGraph({ graph, selectedId, onSelect }: Props) {
  const nodes = useMemo<Node[]>(() => {
    const laidOut = layoutNodes(graph);
    return laidOut.map((n) => ({
      ...n,
      data: { ...n.data, onSelect, selected: n.id === selectedId },
    }));
  }, [graph, selectedId, onSelect]);

  const edges = useMemo<Edge[]>(
    () =>
      graph.edges.map((e) => {
        const style = RELATIONSHIP_STYLE[e.relationship] ?? { stroke: "#7C8AA5" };
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.relationship,
          animated: e.relationship === "CALLS",
          style: { stroke: style.stroke, strokeWidth: 1.5, strokeDasharray: style.dashed ? "4 3" : undefined },
          labelStyle: { fill: "#7C8AA5", fontSize: 9, fontFamily: "monospace" },
          labelBgStyle: { fill: "#0B0E14" },
          markerEnd: { type: MarkerType.ArrowClosed, color: style.stroke, width: 14, height: 14 },
        };
      }),
    [graph]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#232B3A" />
        <Controls className="!bg-panel !border-line [&>button]:!bg-panel [&>button]:!border-line [&>button]:!text-slate-300" />
      </ReactFlow>
    </div>
  );
}
