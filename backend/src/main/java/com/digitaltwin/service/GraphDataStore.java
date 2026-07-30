package com.digitaltwin.service;

import com.digitaltwin.dto.ArchitectureGraph;
import com.digitaltwin.dto.GraphEdge;
import com.digitaltwin.dto.GraphNode;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * In-memory seed of the architecture graph so the API and frontend are fully
 * functional out of the box.
 *
 * TODO (Phase 2 in the brief): replace this with real Neo4j reads via
 * Spring Data Neo4j repositories (Service/API/Database nodes, CALLS/USES/
 * DEPENDS_ON/DEPLOYS_TO relationships) populated by the Repository Scanner.
 */
@Component
public class GraphDataStore {

    private final List<GraphNode> nodes = new CopyOnWriteArrayList<>(List.of(
        new GraphNode("frontend", "Frontend", "service", "Platform Team", "MEDIUM"),
        new GraphNode("api-gateway", "API Gateway", "service", "Platform Team", "HIGH"),
        new GraphNode("auth-service", "Auth Service", "service", "Kunal", "HIGH"),
        new GraphNode("user-service", "User Service", "service", "Amit", "MEDIUM"),
        new GraphNode("order-service", "Order Service", "service", "Rahul", "HIGH"),
        new GraphNode("payment-service", "Payment Service", "service", "Kunal", "CRITICAL"),
        new GraphNode("notification-service", "Notification Service", "service", "Amit", "LOW"),
        new GraphNode("redis-session", "Redis Session Store", "database", "Platform Team", "MEDIUM"),
        new GraphNode("postgres-orders", "Orders DB (Postgres)", "database", "Rahul", "HIGH"),
        new GraphNode("payments-db", "Payments DB (Postgres)", "database", "Kunal", "CRITICAL")
    ));

    private final List<GraphEdge> edges = new CopyOnWriteArrayList<>(List.of(
        new GraphEdge("e1", "frontend", "api-gateway", "CALLS"),
        new GraphEdge("e2", "api-gateway", "auth-service", "CALLS"),
        new GraphEdge("e3", "api-gateway", "user-service", "CALLS"),
        new GraphEdge("e4", "api-gateway", "order-service", "CALLS"),
        new GraphEdge("e5", "auth-service", "redis-session", "USES"),
        new GraphEdge("e6", "auth-service", "user-service", "DEPENDS_ON"),
        new GraphEdge("e7", "order-service", "payment-service", "DEPENDS_ON"),
        new GraphEdge("e8", "order-service", "postgres-orders", "USES"),
        new GraphEdge("e9", "payment-service", "payments-db", "USES"),
        new GraphEdge("e10", "payment-service", "notification-service", "CALLS"),
        new GraphEdge("e11", "order-service", "notification-service", "CALLS")
    ));

    public ArchitectureGraph getFullGraph() {
        return new ArchitectureGraph(nodes, edges);
    }

    public List<GraphNode> getNodes() { return nodes; }
    public List<GraphEdge> getEdges() { return edges; }
}
