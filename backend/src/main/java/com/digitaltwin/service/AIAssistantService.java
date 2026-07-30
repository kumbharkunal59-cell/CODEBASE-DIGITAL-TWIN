package com.digitaltwin.service;

import com.digitaltwin.dto.ArchitectureGraph;
import com.digitaltwin.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * AI Architecture Assistant.
 *
 * This talks to any OpenAI-compatible chat-completions endpoint (Ollama
 * locally, or a hosted provider) using the graph as grounding context —
 * a minimal version of the RAG pipeline described in Phase 5 of the brief.
 *
 * TODO: replace the plain "stuff the whole graph in the prompt" context with
 * real vector embeddings + retrieval once the graph grows past toy size.
 */
@Service
public class AIAssistantService {

    private final GraphService graphService;
    private final RestClient restClient;
    private final String model;
    private final boolean configured;

    public AIAssistantService(
            GraphService graphService,
            @Value("${digitaltwin.ai.base-url}") String baseUrl,
            @Value("${digitaltwin.ai.api-key}") String apiKey,
            @Value("${digitaltwin.ai.model}") String model
    ) {
        this.graphService = graphService;
        this.model = model;
        this.configured = baseUrl != null && !baseUrl.isBlank();
        this.restClient = RestClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader("Authorization", "Bearer " + (apiKey == null ? "" : apiKey))
            .build();
    }

    public ChatResponse ask(String question) {
        ArchitectureGraph graph = graphService.getGraph();

        if (!configured) {
            return new ChatResponse(
                "AI provider is not configured yet. Set AI_PROVIDER_BASE_URL (e.g. an Ollama or " +
                "OpenAI-compatible endpoint) to enable real answers. For now, here's what's in the " +
                "graph: " + graph.getNodes().size() + " services/databases and " +
                graph.getEdges().size() + " relationships.",
                graph
            );
        }

        String context = buildContext(graph);

        try {
            Map<?, ?> response = restClient.post()
                .uri("/v1/chat/completions")
                .body(Map.of(
                    "model", model,
                    "messages", new Object[]{
                        Map.of("role", "system", "content",
                            "You are an assistant that explains software architecture using the " +
                            "following graph data:\n" + context),
                        Map.of("role", "user", "content", question)
                    }
                ))
                .retrieve()
                .body(Map.class);

            String answer = extractAnswer(response);
            return new ChatResponse(answer, graph);
        } catch (Exception e) {
            return new ChatResponse("AI provider call failed: " + e.getMessage(), graph);
        }
    }

    private String buildContext(ArchitectureGraph graph) {
        StringBuilder sb = new StringBuilder();
        graph.getNodes().forEach(n -> sb.append(n.getId()).append(" (").append(n.getType())
            .append(", owner=").append(n.getOwner()).append(", criticality=").append(n.getCriticality())
            .append(")\n"));
        graph.getEdges().forEach(e -> sb.append(e.getSource()).append(" -").append(e.getRelationship())
            .append("-> ").append(e.getTarget()).append("\n"));
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String extractAnswer(Map<?, ?> response) {
        try {
            var choices = (java.util.List<Map<String, Object>>) response.get("choices");
            var message = (Map<String, Object>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "Received a response I couldn't parse from the AI provider.";
        }
    }
}
