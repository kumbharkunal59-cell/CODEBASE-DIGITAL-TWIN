import { Handle, Position } from "reactflow";
import { Criticality, NodeType } from "../types";

const CRITICALITY_COLOR: Record<Criticality, string> = {
  CRITICAL: "#FF6B6B",
  HIGH: "#F5B942",
  MEDIUM: "#5EE6C6",
  LOW: "#3E4A61",
};

const TYPE_GLYPH: Record<NodeType, string> = {
  service: "◆",
  api: "▸",
  database: "▤",
};

export interface ServiceNodeData {
  label: string;
  type: NodeType;
  owner: string;
  criticality: Criticality;
  onSelect?: (id: string) => void;
  id: string;
  selected?: boolean;
}

export default function ServiceNode({ data }: { data: ServiceNodeData }) {
  const color = CRITICALITY_COLOR[data.criticality];
  return (
    <div
      onClick={() => data.onSelect?.(data.id)}
      className={`group cursor-pointer rounded-md border bg-panel px-3 py-2 shadow-lg transition-all
        ${data.selected ? "border-signal ring-1 ring-signal/50" : "border-line hover:border-muted"}`}
      style={{ borderLeftColor: color, borderLeftWidth: 3, minWidth: 170 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-line !border-line" />
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
        <span style={{ color }}>{TYPE_GLYPH[data.type]}</span>
        <span>{data.type}</span>
        <span className="ml-auto rounded px-1 py-0.5 text-[9px] font-mono" style={{ color, backgroundColor: `${color}1A` }}>
          {data.criticality}
        </span>
      </div>
      <div className="mt-1 font-mono text-sm font-medium text-slate-100">{data.label}</div>
      <div className="mt-0.5 text-[11px] text-muted">owner · {data.owner}</div>
      <Handle type="source" position={Position.Bottom} className="!bg-line !border-line" />
    </div>
  );
}
