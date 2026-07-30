package com.digitaltwin.controller;

import com.digitaltwin.dto.OwnershipInfo;
import com.digitaltwin.service.OwnershipService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ownership")
public class OwnershipController {

    private final OwnershipService ownershipService;

    public OwnershipController(OwnershipService ownershipService) {
        this.ownershipService = ownershipService;
    }

    @GetMapping
    public List<OwnershipInfo> getAll() {
        return ownershipService.getAll();
    }

    @GetMapping("/{serviceId}")
    public OwnershipInfo getOwnership(@PathVariable String serviceId) {
        return ownershipService.getOwnership(serviceId);
    }
}
