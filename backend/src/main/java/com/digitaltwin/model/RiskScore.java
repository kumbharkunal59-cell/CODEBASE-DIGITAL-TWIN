package com.digitaltwin.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "risk_scores")
public class RiskScore {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "service_id")
    private String serviceId;

    @Column(name = "criticality_score")
    private int criticalityScore;

    @Column(name = "bus_factor_score")
    private int busFactorScore;

    @Column(name = "coverage_score")
    private int coverageScore;

    @Column(name = "change_failure_score")
    private int changeFailureScore;

    @Column(name = "overall_score")
    private int overallScore;

    @Column(name = "computed_at")
    private Instant computedAt = Instant.now();

    public RiskScore() {}

    public RiskScore(String serviceId, int criticalityScore, int busFactorScore,
                      int coverageScore, int changeFailureScore, int overallScore) {
        this.serviceId = serviceId;
        this.criticalityScore = criticalityScore;
        this.busFactorScore = busFactorScore;
        this.coverageScore = coverageScore;
        this.changeFailureScore = changeFailureScore;
        this.overallScore = overallScore;
    }

    public UUID getId() { return id; }
    public String getServiceId() { return serviceId; }
    public int getCriticalityScore() { return criticalityScore; }
    public int getBusFactorScore() { return busFactorScore; }
    public int getCoverageScore() { return coverageScore; }
    public int getChangeFailureScore() { return changeFailureScore; }
    public int getOverallScore() { return overallScore; }
    public Instant getComputedAt() { return computedAt; }
}
