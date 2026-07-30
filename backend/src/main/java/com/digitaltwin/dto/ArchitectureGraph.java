package com.digitaltwin.dto;

import java.util.List;

public class ArchitectureGraph {
    private List<GraphNode> nodes;
    private List<GraphEdge> edges;

    public ArchitectureGraph() {}

    public ArchitectureGraph(List<GraphNode> nodes, List<GraphEdge> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public List<GraphNode> getNodes() { return nodes; }
    public List<GraphEdge> getEdges() { return edges; }
}
