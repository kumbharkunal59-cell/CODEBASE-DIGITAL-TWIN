# Codebase Digital Twin

> The Google Maps of software systems — a living, queryable map of your services, APIs, databases, owners, and risk.

This repo is a runnable scaffold for the platform described in the project brief. It includes real
project structure and working code for every layer (frontend, backend, graph DB, relational DB,
cache) plus mock data so you can run the whole thing locally with one command and start wiring in
real scanners.

## What's implemented in this scaffold

| Feature (from the brief)        | Status in this scaffold                                             |
|----------------------------------|-----------------------------------------------------------------------|
| Repository Scanner                | Stub service + REST endpoint that returns mock-detected services      |
| Architecture Graph                | Full React Flow graph, fed by a Spring Boot `/api/graph` endpoint     |
| Dependency Intelligence           | Circular-dependency + coupling checks over the graph edges            |
| Team Ownership Mapping            | Ownership model + panel, mock Git-derived data                        |
| Risk Engine                       | Scoring service (criticality, bus factor, coverage, change failure)   |
| Failure Simulation Engine         | `/api/simulate/{serviceId}` endpoint that walks the dependency graph   |
| AI Architecture Assistant         | Chat panel wired to a backend endpoint you can point at any LLM API   |

Everything is real, runnable code — the "mock" parts are clearly marked `// TODO: replace with real
scanner/Git/LLM integration` so you know exactly where to plug in the real implementations from the
roadmap (Phases 1–6 in the brief).

## Architecture

```
Frontend (React + TS + React Flow + Tailwind)
        │  REST (fetch)
        ▼
API Gateway  ──►  Spring Boot backend
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
   PostgreSQL      Neo4j          Redis
   (users, risk,   (graph:        (sessions,
   incidents,      services,      cache)
   services)       APIs, deps)
```

## Repo layout

```
codebase-digital-twin/
├── docker-compose.yml        # postgres + neo4j + redis + backend + frontend
├── backend/                  # Spring Boot 3 (Java 17)
│   ├── pom.xml
│   └── src/main/java/com/digitaltwin/
│       ├── controller/       # REST endpoints
│       ├── service/          # business logic (scanner, risk, simulation, AI)
│       ├── model/            # domain entities
│       ├── repository/       # Spring Data JPA + Neo4j repos
│       └── config/           # security + DB config
├── frontend/                 # React + TypeScript + Vite
│   └── src/
│       ├── pages/            # Dashboard, Graph, Risk, Simulation, Assistant
│       ├── components/       # ArchitectureGraph, RiskDashboard, etc.
│       └── api/              # typed fetch client
├── neo4j/init.cypher         # seeds the graph DB with sample services
└── docs/
    ├── architecture.md
    └── api-contracts.md
```

## Running it locally

Requires Docker + Docker Compose.

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Neo4j browser: http://localhost:7474 (user `neo4j`, password `digitaltwin`)
- Postgres: localhost:5432 (db `digitaltwin`, user `digitaltwin`, password `digitaltwin`)

### Running frontend/backend separately (dev mode)

```bash
# backend
cd backend && ./mvnw spring-boot:run

# frontend
cd frontend && npm install && npm run dev
```

## Next steps to go from scaffold → product

1. **Repository Scanner** — replace `ScannerService` mock output with real parsing (JGit + AST
   parsing for Java/Spring, `package.json`/route parsing for Node).
2. **Ownership Engine** — replace mock contributors with real `git log --format` aggregation.
3. **Risk Engine** — wire in real test-coverage reports (JaCoCo/Istanbul) and CI failure history.
4. **AI Assistant** — point `AIAssistantService` at an OpenAI-compatible endpoint (Ollama or hosted)
   and add the RAG pipeline described in Phase 5 of the brief.
5. **Auth** — the `SecurityConfig` stub currently allows all `/api/**` traffic; wire real
   authentication before deploying anywhere multi-tenant.

## Tech stack

Frontend: React, TypeScript, React Flow, Tailwind CSS, Vite
Backend: Java, Spring Boot, Spring Security, Spring Data JPA, Spring Data Neo4j
Databases: PostgreSQL, Neo4j
Infra: Docker, Docker Compose
Messaging/cache: Redis (Kafka noted as future work per the brief)
AI: OpenAI-compatible chat completion call (swap in Ollama or any provider)
