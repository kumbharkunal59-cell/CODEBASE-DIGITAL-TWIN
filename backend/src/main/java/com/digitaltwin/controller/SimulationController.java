package com.digitaltwin.controller;

import com.digitaltwin.dto.SimulationResult;
import com.digitaltwin.service.SimulationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulate")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @GetMapping("/{serviceId}")
    public SimulationResult simulate(@PathVariable String serviceId) {
        return simulationService.simulateFailure(serviceId);
    }
}
