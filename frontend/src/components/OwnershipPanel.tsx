import { useEffect, useState } from "react";
import { OwnershipInfo } from "../types";
import { api } from "../api/client";

export default function OwnershipPanel({ serviceId }: { serviceId: string }) {
  const [info, setInfo] = useState<OwnershipInfo | null>(null);

  useEffect(() => {
    api.getOwnership().then((all) => {
      setInfo(all.find((o) => o.serviceId === serviceId) ?? null);
    });
  }, [serviceId]);

  if (!info) return <div className="text-xs text-muted">No ownership data for this node.</div>;

  return (
    <div className="space-y-3 text-sm">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted">Owner</div>
        <div className="font-mono text-signal">{info.owner}</div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted">Contributors</div>
        {info.contributors.length ? (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {info.contributors.map((c) => (
              <span key={c} className="rounded border border-line bg-ink px-2 py-0.5 font-mono text-xs text-slate-300">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs text-muted">none on record</div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted">Changes / 90d</div>
          <div className="font-mono text-lg">{info.changeFrequencyLast90Days}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted">Bus factor</div>
          <div className={`font-mono text-lg ${info.busFactor <= 1 ? "text-alert" : "text-slate-200"}`}>
            {info.busFactor}
          </div>
        </div>
      </div>
      {info.busFactor <= 1 && (
        <div className="rounded border border-alert/30 bg-alert/10 px-2 py-1.5 text-[11px] text-alert">
          Single point of knowledge failure — only one person can safely change this service.
        </div>
      )}
    </div>
  );
}
