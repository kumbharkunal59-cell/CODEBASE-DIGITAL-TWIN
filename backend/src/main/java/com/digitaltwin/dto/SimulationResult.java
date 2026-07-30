package com.digitaltwin.dto;

import java.util.List;

public class SimulationResult {
    private String targetServiceId;
    private List<String> affectedServiceIds;
    private int affectedApiCount;
    private String criticality;      // LOW | MEDIUM | HIGH | CRITICAL
    private String revenueImpact;    // NONE | LOW | MODERATE | SEVERE
    private List<String> cascadePath;

    public SimulationResult() {}

    public SimulationResult(String targetServiceId, List<String> affectedServiceIds, int affectedApiCount,
                             String criticality, String revenueImpact, List<String> cascadePath) {
        this.targetServiceId = targetServiceId;
        this.affectedServiceIds = affectedServiceIds;
        this.affectedApiCount = affectedApiCount;
        this.criticality = criticality;
        this.revenueImpact = revenueImpact;
        this.cascadePath = cascadePath;
    }

    public String getTargetServiceId() { return targetServiceId; }
    public List<String> getAffectedServiceIds() { return affectedServiceIds; }
    public int getAffectedApiCount() { return affectedApiCount; }
    public String getCriticality() { return criticality; }
    public String getRevenueImpact() { return revenueImpact; }
    public List<String> getCascadePath() { return cascadePath; }
}
