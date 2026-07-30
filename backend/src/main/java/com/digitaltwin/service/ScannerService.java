package com.digitaltwin.service;

import com.digitaltwin.dto.GraphNode;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Repository Scanner: detects services, controllers, APIs, dependencies and
 * config files from a codebase.
 *
 * TODO (roadmap Phase 1): implement real scanning —
 *   - clone/pull the repo with JGit (already in pom.xml)
 *   - for Spring Boot: parse @RestController / @RequestMapping via a Java
 *     parser (e.g. JavaParser) to extract services + APIs
 *   - for Node/Express: parse package.json + route files
 *   - write discovered Service/API nodes into Neo4j and services/apis tables
 */
@Service
public class ScannerService {

    public ScanResult scanRepository(String gitUrl) {
        // Mock output shaped like a real scan result, so the frontend/API
        // contract doesn't change once real scanning is implemented.
        List<GraphNode> discovered = List.of(
            new GraphNode("scanned-service-1", "Detected Service", "service", "unknown", "MEDIUM")
        );
        return new ScanResult(gitUrl, discovered.size(), discovered, "COMPLETED");
    }

    public record ScanResult(String gitUrl, int servicesFound, List<GraphNode> nodes, String status) {}
}
