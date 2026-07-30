package com.digitaltwin.dto;

public class GraphEdge {
    private String id;
    private String source;
    private String target;
    private String relationship; // CALLS | USES | DEPENDS_ON | DEPLOYS_TO

    public GraphEdge() {}

    public GraphEdge(String id, String source, String target, String relationship) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.relationship = relationship;
    }

    public String getId() { return id; }
    public String getSource() { return source; }
    public String getTarget() { return target; }
    public String getRelationship() { return relationship; }
}
