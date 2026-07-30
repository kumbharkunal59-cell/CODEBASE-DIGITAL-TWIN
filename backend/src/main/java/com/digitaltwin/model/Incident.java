package com.digitaltwin.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "service_id")
    private String serviceId;

    private String title;
    private String severity;

    @Column(name = "occurred_at")
    private Instant occurredAt = Instant.now();

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    public Incident() {}

    public Incident(String serviceId, String title, String severity) {
        this.serviceId = serviceId;
        this.title = title;
        this.severity = severity;
    }

    public UUID getId() { return id; }
    public String getServiceId() { return serviceId; }
    public String getTitle() { return title; }
    public String getSeverity() { return severity; }
    public Instant getOccurredAt() { return occurredAt; }
    public Instant getResolvedAt() { return resolvedAt; }
}
