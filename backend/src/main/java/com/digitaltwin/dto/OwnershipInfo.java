package com.digitaltwin.dto;

import java.util.List;

public class OwnershipInfo {
    private String serviceId;
    private String owner;
    private List<String> contributors;
    private int changeFrequencyLast90Days;
    private int busFactor;

    public OwnershipInfo() {}

    public OwnershipInfo(String serviceId, String owner, List<String> contributors,
                          int changeFrequencyLast90Days, int busFactor) {
        this.serviceId = serviceId;
        this.owner = owner;
        this.contributors = contributors;
        this.changeFrequencyLast90Days = changeFrequencyLast90Days;
        this.busFactor = busFactor;
    }

    public String getServiceId() { return serviceId; }
    public String getOwner() { return owner; }
    public List<String> getContributors() { return contributors; }
    public int getChangeFrequencyLast90Days() { return changeFrequencyLast90Days; }
    public int getBusFactor() { return busFactor; }
}
