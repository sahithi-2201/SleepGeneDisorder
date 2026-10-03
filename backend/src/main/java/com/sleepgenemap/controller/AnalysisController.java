package com.sleepgenemap.controller;

import com.sleepgenemap.dto.AnalysisRequest;
import com.sleepgenemap.dto.AnalysisResponse;
import com.sleepgenemap.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Sample Result Analysis.
 * Receives sample assays and coordinates relational database matching.
 */
@RestController
@RequestMapping("/api/analyze")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<AnalysisResponse> analyzeSample(@Valid @RequestBody AnalysisRequest request) {
        AnalysisResponse response = analysisService.analyzeSample(request);
        return ResponseEntity.ok(response);
    }
}
