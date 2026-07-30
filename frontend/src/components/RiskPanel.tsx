import { useEffect, useState } from "react";
import { RiskScore } from "../types";
import { api } from "../api/client";

function scoreColor(score: number) {
  if (score >= 75) return "#FF6B6B";
  if (score >= 50) return "#F5B942";
  return "#5EE6C6";
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: scoreColor(value) }}
        />
      </div>
    </div>
  );
}

export default function RiskPanel({ serviceId }: { serviceId: string }) {
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getRisk(serviceId).then((r) => {
      setRisk(r);
      setLoading(false);
    });
  }, [serviceId]);

  if (loading || !risk) {
    return <div className="text-xs text-muted">Computing risk score…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <span
          className="font-mono text-3xl font-bold"
          style={{ color: scoreColor(risk.overallScore) }}
        >
          {risk.overallScore}
        </span>
        <span className="text-xs text-muted">/ 100 overall risk</span>
      </div>
      <div className="space-y-3">
        <Bar label="Criticality" value={risk.criticalityScore} />
        <Bar label="Bus factor risk" value={risk.busFactorScore} />
        <Bar label="Coverage risk" value={risk.coverageScore} />
        <Bar label="Change failure risk" value={risk.changeFailureScore} />
      </div>
    </div>
  );
}
