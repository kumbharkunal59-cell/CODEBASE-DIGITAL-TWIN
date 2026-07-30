# Architecture

## Layers

1. **Frontend** (React + TypeScript + React Flow + Tailwind) — renders the architecture graph,
   risk board, ownership map, and AI assistant. Talks to the backend over REST; falls back to
   in-memory mock data (`src/mock/graph.ts`) if the backend isn't reachable, so the UI is always
   demoable.

2. **Backend** (Spring Boot) — exposes REST endpoints under `/api/*`:

   | Endpoint | Purpose |
   |---|---|
   | `GET /api/graph` | Full architecture graph (nodes + edges) |
   | `GET /api/graph/circular-dependencies` | Cycles detected in the dependency graph |
   | `GET /api/graph/coupling/{id}` | Fan-in + fan-out coupling score for a service |
   | `GET /api/risk/{id}` | Computed risk score for a service |
   | `GET /api/risk/{id}/history` | Historical risk scores (persisted in Postgres) |
   | `GET /api/ownership` | Ownership info for every service |
   | `GET /api/ownership/{id}` | Ownership info for one service |
   | `GET /api/simulate/{id}` | Failure simulation: cascade + revenue impact |
   | `POST /api/scanner/scan?gitUrl=` | Trigger a repository scan (stubbed) |
   | `POST /api/assistant/ask` | Ask the AI architecture assistant a question |

3. **Data stores**:
   - **PostgreSQL** — relational data: users, projects, repositories, services, apis,
     deployments, incidents, risk_scores (see `backend/src/main/resources/schema.sql`).
   - **Neo4j** — the graph itself: `Service`, `API`, `Database`, `Repository`, `Developer` nodes
     connected by `CALLS`, `USES`, `OWNS`, `DEPENDS_ON`, `DEPLOYS_TO` relationships (see
     `neo4j/init.cypher` for a seed script matching the mock graph).
   - **Redis** — session/cache layer (wired in `docker-compose.yml`, not yet used by any endpoint —
     a natural place to cache computed risk scores and simulation results).

## Why the graph is in-memory in this scaffold

`GraphDataStore` currently holds the graph in memory rather than reading from Neo4j, so the whole
stack is runnable and demoable without writing a scanner first. Once `ScannerService` does real
parsing (Phase 1 of the roadmap), swap `GraphDataStore` for a `Neo4jGraphRepository` using Spring
Data Neo4j — the DTO shapes (`GraphNode`, `GraphEdge`, `ArchitectureGraph`) are already what the
frontend expects, so no frontend changes are needed when you make that swap.

## Extending the AI Assistant into real RAG

`AIAssistantService` currently stuffs the entire graph into the prompt as context — fine for tens
of nodes, but it won't scale. Phase 5 of the roadmap calls for a real RAG pipeline:

1. Embed each node/edge (or a natural-language description of it) with a vector embedding model.
2. Store embeddings in a vector store (pgvector on the existing Postgres instance is the path of
   least resistance).
3. On each question, embed the question, retrieve the top-k relevant nodes/edges, and use only
   those as context instead of the whole graph.
