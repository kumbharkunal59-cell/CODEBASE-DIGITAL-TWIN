-- Codebase Digital Twin — PostgreSQL schema
-- Mirrors the tables listed in the project brief. Hibernate ddl-auto=update will
-- also manage these once entities are added; this file lets `docker compose up`
-- seed a usable schema on first boot even before the JPA layer runs.

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    display_name  VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    owner_id      UUID REFERENCES users(id),
    created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS repositories (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id    UUID REFERENCES projects(id),
    name          VARCHAR(255) NOT NULL,
    git_url       VARCHAR(512) NOT NULL,
    language      VARCHAR(64),
    last_scanned  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id                VARCHAR(64) PRIMARY KEY,
    repository_id     UUID REFERENCES repositories(id),
    name              VARCHAR(255) NOT NULL,
    type              VARCHAR(64),     -- e.g. spring-boot, node-express
    owner             VARCHAR(255),
    criticality       VARCHAR(32),     -- LOW / MEDIUM / HIGH / CRITICAL
    created_at        TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS apis (
    id            VARCHAR(64) PRIMARY KEY,
    service_id    VARCHAR(64) REFERENCES services(id),
    path          VARCHAR(512) NOT NULL,
    method        VARCHAR(16) NOT NULL,
    description   TEXT
);

CREATE TABLE IF NOT EXISTS deployments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id    VARCHAR(64) REFERENCES services(id),
    environment   VARCHAR(64),
    deployed_at   TIMESTAMP NOT NULL DEFAULT now(),
    status        VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS incidents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id    VARCHAR(64) REFERENCES services(id),
    title         VARCHAR(255) NOT NULL,
    severity      VARCHAR(32),
    occurred_at   TIMESTAMP NOT NULL DEFAULT now(),
    resolved_at   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id          VARCHAR(64) REFERENCES services(id),
    criticality_score   INTEGER,
    bus_factor_score    INTEGER,
    coverage_score      INTEGER,
    change_failure_score INTEGER,
    overall_score       INTEGER,
    computed_at         TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_apis_service ON apis(service_id);
CREATE INDEX IF NOT EXISTS idx_risk_service ON risk_scores(service_id);
