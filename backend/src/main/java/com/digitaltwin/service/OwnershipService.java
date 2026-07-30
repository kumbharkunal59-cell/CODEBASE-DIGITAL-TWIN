package com.digitaltwin.service;

import com.digitaltwin.dto.OwnershipInfo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Team Ownership Mapping, per the brief's example:
 *   Payment Service — Owner: Kunal, Contributors: Amit, Rahul
 *
 * TODO (roadmap Phase 3): replace MOCK_OWNERSHIP with real aggregation over
 * `git log --format="%an" -- <path>` per service directory, using JGit
 * (already a dependency in pom.xml) against each cloned repository.
 */
@Service
public class OwnershipService {

    private static final Map<String, OwnershipInfo> MOCK_OWNERSHIP = Map.of(
        "payment-service", new OwnershipInfo("payment-service", "Kunal", List.of("Amit", "Rahul"), 34, 3),
        "order-service", new OwnershipInfo("order-service", "Rahul", List.of("Kunal"), 21, 2),
        "auth-service", new OwnershipInfo("auth-service", "Kunal", List.of("Amit"), 18, 2),
        "user-service", new OwnershipInfo("user-service", "Amit", List.of("Rahul", "Kunal"), 12, 3),
        "notification-service", new OwnershipInfo("notification-service", "Amit", List.of(), 6, 1),
        "api-gateway", new OwnershipInfo("api-gateway", "Platform Team", List.of("Kunal", "Amit", "Rahul"), 9, 3),
        "frontend", new OwnershipInfo("frontend", "Platform Team", List.of("Rahul"), 15, 2)
    );

    public OwnershipInfo getOwnership(String serviceId) {
        return MOCK_OWNERSHIP.getOrDefault(
            serviceId,
            new OwnershipInfo(serviceId, "Unassigned", List.of(), 0, 1)
        );
    }

    public List<OwnershipInfo> getAll() {
        return MOCK_OWNERSHIP.values().stream().toList();
    }
}
