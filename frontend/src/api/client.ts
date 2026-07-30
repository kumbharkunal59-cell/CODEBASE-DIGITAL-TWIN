import { ArchitectureGraph, ChatResponse, OwnershipInfo, RiskScore, SimulationResult } from "../types";
import { MOCK_GRAPH, MOCK_OWNERSHIP, mockRisk, mockSimulate } from "../mock/graph";

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8080/api";

async function safeFetch<T>(path: string, fallback: () => T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, init);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as T;
  } catch {
    // Backend not reachable yet (e.g. running the UI standalone) — fall
    // back to mock data so the interface is still fully explorable.
    return fallback();
  }
}

export const api = {
  getGraph: () => safeFetch<ArchitectureGraph>("/graph", () => MOCK_GRAPH),

  getCircularDependencies: () =>
    safeFetch<string[][]>("/graph/circular-dependencies", () => []),

  getRisk: (serviceId: string) =>
    safeFetch<RiskScore>(`/risk/${serviceId}`, () => mockRisk(serviceId)),

  getOwnership: () =>
    safeFetch<OwnershipInfo[]>("/ownership", () => MOCK_OWNERSHIP),

  simulate: (serviceId: string) =>
    safeFetch<SimulationResult>(`/simulate/${serviceId}`, () => mockSimulate(serviceId)),

  ask: (question: string) =>
    safeFetch<ChatResponse>(
      "/assistant/ask",
      () => ({
        answer:
          "The backend isn't reachable right now, so I can't run a real query. Once it's up, " +
          "ask things like \"what happens if payment-service fails\" or \"explain the login flow\".",
        relevantSubgraph: MOCK_GRAPH,
      }),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      }
    ),
};
