package com.digitaltwin.dto;

public class ChatResponse {
    private String answer;
    private ArchitectureGraph relevantSubgraph;

    public ChatResponse() {}

    public ChatResponse(String answer, ArchitectureGraph relevantSubgraph) {
        this.answer = answer;
        this.relevantSubgraph = relevantSubgraph;
    }

    public String getAnswer() { return answer; }
    public ArchitectureGraph getRelevantSubgraph() { return relevantSubgraph; }
}
