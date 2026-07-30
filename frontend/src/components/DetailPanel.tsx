import { useState } from "react";
import { GraphNode } from "../types";
import RiskPanel from "./RiskPanel";
import OwnershipPanel from "./OwnershipPanel";
import SimulationPanel from "./SimulationPanel";

type Tab = "risk" | "ownership" | "simulate";

const TABS: { id: Tab; label: string }[] = [
  { id: "risk", label: "Risk" },
  { id: "ownership", label: "Ownership" },
  { id: "simulate", label: "Simulate" },
];

export default function DetailPanel({ node, onClose }: { node: GraphNode; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("risk");

  return (
    <aside className="flex h-full w-80 flex-col border-l border-line bg-panel p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted">{node.type}</div>
          <div className="font-mono text-lg font-semibold text-slate-100">{node.label}</div>
        </div>
        <button onClick={onClose} className="text-muted hover:text-slate-200">
          ✕
        </button>
      </div>

      <div className="mt-4 flex gap-1 rounded-md border border-line bg-ink p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded px-2 py-1.5 text-xs font-medium transition-colors ${
              tab === t.id ? "bg-signal/15 text-signal" : "text-muted hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        {tab === "risk" && <RiskPanel serviceId={node.id} />}
        {tab === "ownership" && <OwnershipPanel serviceId={node.id} />}
        {tab === "simulate" && <SimulationPanel serviceId={node.id} label={node.label} />}
      </div>
    </aside>
  );
}
