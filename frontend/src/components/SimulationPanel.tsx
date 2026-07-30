import { useState } from "react";
import { SimulationResult } from "../types";
import { api } from "../api/client";

const IMPACT_COLOR: Record<string, string> = {
  SEVERE: "#FF6B6B",
  MODERATE: "#F5B942",
  LOW: "#5EE6C6",
  NONE: "#3E4A61",
};

export default function SimulationPanel({ serviceId, label }: { serviceId: string; label: string }) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const r = await api.simulate(serviceId);
    setResult(r);
    setRunning(false);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={run}
        disabled={running}
        className="w-full rounded-md border border-alert/40 bg-alert/10 px-3 py-2 text-sm font-medium text-alert transition-colors hover:bg-alert/20 disabled:opacity-50"
      >
        {running ? "Simulating cascade…" : `Simulate: ${label} goes down`}
      </button>

      {result && (
        <div className="space-y-3 rounded-md border border-line bg-ink p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-muted">Revenue impact</span>
            <span className="font-mono text-sm font-semibold" style={{ color: IMPACT_COLOR[result.revenueImpact] }}>
              {result.revenueImpact}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted">Affected services</div>
              <div className="font-mono text-2xl">{result.affectedServiceIds.length}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted">Affected APIs</div>
              <div className="font-mono text-2xl">{result.affectedApiCount}</div>
            </div>
          </div>
          <div>
            <div className="mb-1 text-[11px] uppercase tracking-wider text-muted">Cascade path</div>
            <div className="flex flex-wrap items-center gap-1 font-mono text-xs text-slate-300">
              {result.cascadePath.map((id, i) => (
                <span key={id} className="flex items-center gap-1">
                  <span className="rounded border border-line bg-panel px-1.5 py-0.5">{id}</span>
                  {i < result.cascadePath.length - 1 && <span className="text-muted">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
