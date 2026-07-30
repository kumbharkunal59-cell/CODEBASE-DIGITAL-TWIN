export type NodeType = "service" | "api" | "database";
export type Criticality = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  owner: string;
  criticality: Criticality;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: "CALLS" | "USES" | "DEPENDS_ON" | "DEPLOYS_TO";
}

export interface ArchitectureGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface RiskScore {
  serviceId: string;
  criticalityScore: number;
  busFactorScore: number;
  coverageScore: number;
  changeFailureScore: number;
  overallScore: number;
  computedAt: string;
}

export interface OwnershipInfo {
  serviceId: string;
  owner: string;
  contributors: string[];
  changeFrequencyLast90Days: number;
  busFactor: number;
}

export interface SimulationResult {
  targetServiceId: string;
  affectedServiceIds: string[];
  affectedApiCount: number;
  criticality: Criticality;
  revenueImpact: "NONE" | "LOW" | "MODERATE" | "SEVERE";
  cascadePath: string[];
}

export interface ChatResponse {
  answer: string;
  relevantSubgraph: ArchitectureGraph;
}
