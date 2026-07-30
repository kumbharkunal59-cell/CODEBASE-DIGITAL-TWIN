package com.digitaltwin.controller;

import com.digitaltwin.model.RiskScore;
import com.digitaltwin.service.RiskEngineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/risk")
public class RiskController {

    private final RiskEngineService riskEngineService;

    public RiskController(RiskEngineService riskEngineService) {
        this.riskEngineService = riskEngineService;
    }

    @GetMapping("/{serviceId}")
    public RiskScore getRisk(@PathVariable String serviceId) {
        return riskEngineService.computeRisk(serviceId);
    }

    @GetMapping("/{serviceId}/history")
    public List<RiskScore> getHistory(@PathVariable String serviceId) {
        return riskEngineService.getHistory(serviceId);
    }
}
