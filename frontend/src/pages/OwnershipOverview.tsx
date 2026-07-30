import { useEffect, useState } from "react";
import { OwnershipInfo } from "../types";
import { api } from "../api/client";

export default function OwnershipOverview({ onSelect }: { onSelect: (id: string) => void }) {
  const [ownership, setOwnership] = useState<OwnershipInfo[]>([]);

  useEffect(() => {
    api.getOwnership().then(setOwnership);
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="mb-1 font-mono text-lg font-semibold text-slate-100">Ownership Map</h2>
      <p className="mb-5 text-sm text-muted">Who owns what, and where knowledge is concentrated.</p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ownership.map((o) => (
          <button
            key={o.serviceId}
            onClick={() => onSelect(o.serviceId)}
            className="rounded-md border border-line bg-panel p-4 text-left transition-colors hover:border-muted"
          >
            <div className="font-mono text-sm text-slate-100">{o.serviceId}</div>
            <div className="mt-2 text-[11px] uppercase tracking-wider text-muted">Owner</div>
            <div className="font-mono text-signal">{o.owner}</div>
            <div className="mt-2 text-[11px] uppercase tracking-wider text-muted">Contributors</div>
            <div className="text-xs text-slate-300">{o.contributors.join(", ") || "none"}</div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted">{o.changeFrequencyLast90Days} changes / 90d</span>
              <span className={o.busFactor <= 1 ? "font-semibold text-alert" : "text-slate-300"}>
                bus factor {o.busFactor}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
