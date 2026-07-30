package com.digitaltwin.service;

import com.digitaltwin.dto.ArchitectureGraph;
import com.digitaltwin.dto.GraphEdge;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GraphService {

    private final GraphDataStore store;

    public GraphService(GraphDataStore store) {
        this.store = store;
    }

    public ArchitectureGraph getGraph() {
        return store.getFullGraph();
    }

    /** Detects cycles in the DEPENDS_ON/CALLS graph — part of Dependency Intelligence. */
    public List<List<String>> findCircularDependencies() {
        Map<String, List<String>> adjacency = new HashMap<>();
        for (GraphEdge e : store.getEdges()) {
            adjacency.computeIfAbsent(e.getSource(), k -> new ArrayList<>()).add(e.getTarget());
        }

        List<List<String>> cycles = new ArrayList<>();
        Set<String> visited = new HashSet<>();

        for (String node : adjacency.keySet()) {
            List<String> path = new ArrayList<>();
            dfs(node, adjacency, visited, path, cycles);
        }
        return cycles;
    }

    private void dfs(String node, Map<String, List<String>> adjacency, Set<String> visited,
                      List<String> path, List<List<String>> cycles) {
        if (path.contains(node)) {
            int idx = path.indexOf(node);
            cycles.add(new ArrayList<>(path.subList(idx, path.size())));
            return;
        }
        if (visited.contains(node)) return;

        path.add(node);
        for (String next : adjacency.getOrDefault(node, List.of())) {
            dfs(next, adjacency, visited, path, cycles);
        }
        path.remove(path.size() - 1);
        visited.add(node);
    }

    /** Coupling = fan-in + fan-out for a given service, part of Dependency Intelligence. */
    public int getCouplingScore(String serviceId) {
        long fanOut = store.getEdges().stream().filter(e -> e.getSource().equals(serviceId)).count();
        long fanIn = store.getEdges().stream().filter(e -> e.getTarget().equals(serviceId)).count();
        return (int) (fanOut + fanIn);
    }
}
