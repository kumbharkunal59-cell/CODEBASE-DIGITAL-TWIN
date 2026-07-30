import { ArchitectureGraph, OwnershipInfo, RiskScore, SimulationResult } from "../types";

// Used only as an offline fallback so the UI renders something meaningful
// even before `docker compose up` is running. The real data always comes
// from the backend once it's reachable (see api/client.ts).
export const MOCK_GRAPH: ArchitectureGraph = {
  nodes: [
    { id: "frontend", label: "Frontend", type: "service", owner: "Platform Team", criticality: "MEDIUM" },
    { id: "api-gateway", label: "API Gateway", type: "service", owner: "Platform Team", criticality: "HIGH" },
    { id: "auth-service", label: "Auth Service", type: "service", owner: "Kunal", criticality: "HIGH" },
    { id: "user-service", label: "User Service", type: "service", owner: "Amit", criticality: "MEDIUM" },
    { id: "order-service", label: "Order Service", type: "service", owner: "Rahul", criticality: "HIGH" },
    { id: "payment-service", label: "Payment Service", type: "service", owner: "Kunal", criticality: "CRITICAL" },
    { id: "notification-service", label: "Notification Service", type: "service", owner: "Amit", criticality: "LOW" },
    { id: "redis-session", label: "Redis Session Store", type: "database", owner: "Platform Team", criticality: "MEDIUM" },
    { id: "postgres-orders", label: "Orders DB", type: "database", owner: "Rahul", criticality: "HIGH" },
    { id: "payments-db", label: "Payments DB", type: "database", owner: "Kunal", criticality: "CRITICAL" },
  ],
  edges: [
    { id: "e1", source: "frontend", target: "api-gateway", relationship: "CALLS" },
    { id: "e2", source: "api-gateway", target: "auth-service", relationship: "CALLS" },
    { id: "e3", source: "api-gateway", target: "user-service", relationship: "CALLS" },
    { id: "e4", source: "api-gateway", target: "order-service", relationship: "CALLS" },
    { id: "e5", source: "auth-service", target: "redis-session", relationship: "USES" },
    { id: "e6", source: "auth-service", target: "user-service", relationship: "DEPENDS_ON" },
    { id: "e7", source: "order-service", target: "payment-service", relationship: "DEPENDS_ON" },
    { id: "e8", source: "order-service", target: "postgres-orders", relationship: "USES" },
    { id: "e9", source: "payment-service", target: "payments-db", relationship: "USES" },
    { id: "e10", source: "payment-service", target: "notification-service", relationship: "CALLS" },
    { id: "e11", source: "order-service", target: "notification-service", relationship: "CALLS" },
  ],
};

export const MOCK_OWNERSHIP: OwnershipInfo[] = [
  { serviceId: "payment-service", owner: "Kunal", contributors: ["Amit", "Rahul"], changeFrequencyLast90Days: 34, busFactor: 3 },
  { serviceId: "order-service", owner: "Rahul", contributors: ["Kunal"], changeFrequencyLast90Days: 21, busFactor: 2 },
  { serviceId: "auth-service", owner: "Kunal", contributors: ["Amit"], changeFrequencyLast90Days: 18, busFactor: 2 },
  { serviceId: "user-service", owner: "Amit", contributors: ["Rahul", "Kunal"], changeFrequencyLast90Days: 12, busFactor: 3 },
  { serviceId: "notification-service", owner: "Amit", contributors: [], changeFrequencyLast90Days: 6, busFactor: 1 },
  { serviceId: "api-gateway", owner: "Platform Team", contributors: ["Kunal", "Amit", "Rahul"], changeFrequencyLast90Days: 9, busFactor: 3 },
  { serviceId: "frontend", owner: "Platform Team", contributors: ["Rahul"], changeFrequencyLast90Days: 15, busFactor: 2 },
];

export function mockRisk(serviceId: string): RiskScore {
  const node = MOCK_GRAPH.nodes.find((n) => n.id === serviceId);
  const criticalityScore = node?.criticality === "CRITICAL" ? 95 : node?.criticality === "HIGH" ? 75 : node?.criticality === "MEDIUM" ? 50 : 25;
  const ownership = MOCK_OWNERSHIP.find((o) => o.serviceId === serviceId);
  const busFactorScore = Math.max(0, 100 - (ownership?.busFactor ?? 1) * 30);
  const coverageScore = serviceId === "payment-service" ? 59 : 35;
  const changeFailureScore = 30;
  const overallScore = Math.round(criticalityScore * 0.4 + busFactorScore * 0.2 + coverageScore * 0.25 + changeFailureScore * 0.15);
  return {
    serviceId,
    criticalityScore,
    busFactorScore,
    coverageScore,
    changeFailureScore,
    overallScore,
    computedAt: new Date().toISOString(),
  };
}

export function mockSimulate(serviceId: string): SimulationResult {
  const reverse: Record<string, string[]> = {};
  MOCK_GRAPH.edges.forEach((e) => {
    reverse[e.target] = [...(reverse[e.target] ?? []), e.source];
  });
  const affected = new Set<string>();
  const cascadePath = [serviceId];
  const queue = [serviceId];
  while (queue.length) {
    const current = queue.shift()!;
    for (const upstream of reverse[current] ?? []) {
      if (!affected.has(upstream)) {
        affected.add(upstream);
        cascadePath.push(upstream);
        queue.push(upstream);
      }
    }
  }
  const node = MOCK_GRAPH.nodes.find((n) => n.id === serviceId);
  const criticality = node?.criticality ?? "LOW";
  const revenueImpact = criticality === "CRITICAL" ? "SEVERE" : criticality === "HIGH" ? "MODERATE" : criticality === "MEDIUM" ? "LOW" : "NONE";
  return {
    targetServiceId: serviceId,
    affectedServiceIds: Array.from(affected),
    affectedApiCount: affected.size * 3,
    criticality,
    revenueImpact,
    cascadePath,
  };
}
