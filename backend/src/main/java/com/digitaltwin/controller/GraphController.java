package com.digitaltwin.controller;

import com.digitaltwin.dto.ArchitectureGraph;
import com.digitaltwin.service.GraphService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping
    public ArchitectureGraph getGraph() {
        return graphService.getGraph();
    }

    @GetMapping("/circular-dependencies")
    public List<List<String>> getCircularDependencies() {
        return graphService.findCircularDependencies();
    }

    @GetMapping("/coupling/{serviceId}")
    public Map<String, Object> getCoupling(@PathVariable String serviceId) {
        return Map.of("serviceId", serviceId, "couplingScore", graphService.getCouplingScore(serviceId));
    }
}
