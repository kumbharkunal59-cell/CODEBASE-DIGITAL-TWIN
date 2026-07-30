import { useEffect, useState } from "react";
import { GraphNode, RiskScore } from "../types";
import { api } from "../api/client";

function scoreColor(score: number) {
  if (score >= 75) return "#FF6B6B";
  if (score >= 50) return "#F5B942";
  return "#5EE6C6";
}

export default function RiskBoard({ nodes, onSelect }: { nodes: GraphNode[]; onSelect: (id: string) => void }) {
  const [scores, setScores] = useState<Record<string, RiskScore>>({});

  useEffect(() => {
    nodes
      .filter((n) => n.type === "service")
      .forEach((n) => {
        api.getRisk(n.id).then((r) => setScores((s) => ({ ...s, [n.id]: r })));
      });
  }, [nodes]);

  const ranked = nodes
    .filter((n) => n.type === "service")
    .map((n) => ({ node: n, score: scores[n.id] }))
    .sort((a, b) => (b.score?.overallScore ?? 0) - (a.score?.overallScore ?? 0));

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="mb-1 font-mono text-lg font-semibold text-slate-100">Risk Board</h2>
      <p className="mb-5 text-sm text-muted">Services ranked by overall risk score. Click one to drill in.</p>

      <div className="space-y-2">
        {ranked.map(({ node, score }) => (
          <button
            key={node.id}
            onClick={() => onSelect(node.id)}
            className="flex w-full items-center gap-4 rounded-md border border-line bg-panel px-4 py-3 text-left transition-colors hover:border-muted"
          >
            <span
              className="font-mono text-xl font-bold"
              style={{ color: score ? scoreColor(score.overallScore) : "#7C8AA5" }}
            >
              {score ? score.overallScore : "—"}
            </span>
            <div className="flex-1">
              <div className="font-mono text-sm text-slate-100">{node.label}</div>
              <div className="text-xs text-muted">owner · {node.owner}</div>
            </div>
            <span
              className="rounded px-2 py-0.5 font-mono text-[10px] uppercase"
              style={{
                color: score ? scoreColor(score.overallScore) : "#7C8AA5",
                backgroundColor: score ? `${scoreColor(score.overallScore)}1A` : "transparent",
              }}
            >
              {node.criticality}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
