package com.digitaltwin.controller;

import com.digitaltwin.dto.ChatRequest;
import com.digitaltwin.dto.ChatResponse;
import com.digitaltwin.service.AIAssistantService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
public class AIAssistantController {

    private final AIAssistantService aiAssistantService;

    public AIAssistantController(AIAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/ask")
    public ChatResponse ask(@RequestBody ChatRequest request) {
        return aiAssistantService.ask(request.getQuestion());
    }
}
