package com.digitaltwin.service;

import com.digitaltwin.dto.GraphNode;
import com.digitaltwin.model.RiskScore;
import com.digitaltwin.repository.RiskScoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Risk Engine: computes Criticality, Bus Factor, Test Coverage Risk, and
 * Change Failure Risk into a single 0-100 score per the brief's example
 * (Payment Service: 92/100).
 *
 * TODO (roadmap Phase 3): wire coverageScore to real JaCoCo/Istanbul reports
 * and changeFailureScore to real CI failure history instead of the mock
 * inputs below.
 */
@Service
public class RiskEngineService {

    private final GraphDataStore graphStore;
    private final RiskScoreRepository riskScoreRepository;
    private final OwnershipService ownershipService;

    // mock coverage % per service until a real coverage integration exists
    private static final Map<String, Integer> MOCK_COVERAGE = Map.of(
        "payment-service", 41,
        "order-service", 68,
        "auth-service", 74,
        "user-service", 80,
        "notification-service", 55,
        "api-gateway", 60,
        "frontend", 50
    );

    public RiskEngineService(GraphDataStore graphStore, RiskScoreRepository riskScoreRepository,
                              OwnershipService ownershipService) {
        this.graphStore = graphStore;
        this.riskScoreRepository = riskScoreRepository;
        this.ownershipService = ownershipService;
    }

    public RiskScore computeRisk(String serviceId) {
        GraphNode node = graphStore.getNodes().stream()
            .filter(n -> n.getId().equals(serviceId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown service: " + serviceId));

        int criticalityScore = switch (node.getCriticality()) {
            case "CRITICAL" -> 95;
            case "HIGH" -> 75;
            case "MEDIUM" -> 50;
            default -> 25;
        };

        int busFactor = ownershipService.getOwnership(serviceId).getBusFactor();
        int busFactorScore = Math.max(0, 100 - (busFactor * 30)); // fewer owners => higher risk

        int coverage = MOCK_COVERAGE.getOrDefault(serviceId, 60);
        int coverageScore = 100 - coverage; // lower coverage => higher risk

        int changeFailureScore = 30; // TODO: derive from real CI/CD failure history

        int overall = (int) Math.round(
            criticalityScore * 0.4 + busFactorScore * 0.2 + coverageScore * 0.25 + changeFailureScore * 0.15
        );

        RiskScore score = new RiskScore(serviceId, criticalityScore, busFactorScore, coverageScore,
            changeFailureScore, overall);
        return riskScoreRepository.save(score);
    }

    public List<RiskScore> getHistory(String serviceId) {
        return riskScoreRepository.findByServiceId(serviceId);
    }
}
