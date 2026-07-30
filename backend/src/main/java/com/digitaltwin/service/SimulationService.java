package com.digitaltwin.service;

import com.digitaltwin.dto.GraphEdge;
import com.digitaltwin.dto.GraphNode;
import com.digitaltwin.dto.SimulationResult;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Failure Simulation Engine: "what happens if this service fails?"
 * Walks the dependency graph to find every node that would be affected
 * if the target service goes down (BFS over incoming CALLS/DEPENDS_ON/USES edges).
 */
@Service
public class SimulationService {

    private final GraphDataStore store;

    public SimulationService(GraphDataStore store) {
        this.store = store;
    }

    public SimulationResult simulateFailure(String serviceId) {
        Map<String, List<String>> reverseAdjacency = new HashMap<>();
        for (GraphEdge e : store.getEdges()) {
            reverseAdjacency.computeIfAbsent(e.getTarget(), k -> new ArrayList<>()).add(e.getSource());
        }

        List<String> cascadePath = new ArrayList<>();
        Set<String> affected = new LinkedHashSet<>();
        Deque<String> queue = new ArrayDeque<>();
        queue.add(serviceId);
        cascadePath.add(serviceId);

        while (!queue.isEmpty()) {
            String current = queue.poll();
            for (String upstream : reverseAdjacency.getOrDefault(current, List.of())) {
                if (affected.add(upstream)) {
                    queue.add(upstream);
                    cascadePath.add(upstream);
                }
            }
        }

        Map<String, GraphNode> nodesById = new HashMap<>();
        store.getNodes().forEach(n -> nodesById.put(n.getId(), n));

        int affectedApiCount = affected.size() * 3; // TODO: replace with real API-to-service mapping
        String targetCriticality = Optional.ofNullable(nodesById.get(serviceId))
            .map(GraphNode::getCriticality).orElse("LOW");

        String revenueImpact = switch (targetCriticality) {
            case "CRITICAL" -> "SEVERE";
            case "HIGH" -> "MODERATE";
            case "MEDIUM" -> "LOW";
            default -> "NONE";
        };

        return new SimulationResult(
            serviceId,
            new ArrayList<>(affected),
            affectedApiCount,
            targetCriticality,
            revenueImpact,
            cascadePath
        );
    }
}
