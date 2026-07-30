package com.digitaltwin.controller;

import com.digitaltwin.service.ScannerService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scanner")
public class ScannerController {

    private final ScannerService scannerService;

    public ScannerController(ScannerService scannerService) {
        this.scannerService = scannerService;
    }

    @PostMapping("/scan")
    public ScannerService.ScanResult scan(@org.springframework.web.bind.annotation.RequestParam String gitUrl) {
        return scannerService.scanRepository(gitUrl);
    }
}
