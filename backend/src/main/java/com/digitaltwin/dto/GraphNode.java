package com.digitaltwin.dto;

public class GraphNode {
    private String id;
    private String label;
    private String type;        // service | api | database
    private String owner;
    private String criticality; // LOW | MEDIUM | HIGH | CRITICAL

    public GraphNode() {}

    public GraphNode(String id, String label, String type, String owner, String criticality) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.owner = owner;
        this.criticality = criticality;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getCriticality() { return criticality; }
    public void setCriticality(String criticality) { this.criticality = criticality; }
}
