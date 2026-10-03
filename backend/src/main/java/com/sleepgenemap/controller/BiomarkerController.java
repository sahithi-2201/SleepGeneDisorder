package com.sleepgenemap.controller;

import com.sleepgenemap.model.Biomarker;
import com.sleepgenemap.service.BiomarkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing endpoints for endocrine, neuropeptide, and cytokine biomarkers.
 */
@RestController
@RequestMapping("/api/biomarkers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BiomarkerController {

    private final BiomarkerService biomarkerService;

    @GetMapping
    public ResponseEntity<List<Biomarker>> getAllBiomarkers(
            @RequestParam(required = false) String type) {
        if (type != null && !type.isBlank()) {
            return ResponseEntity.ok(biomarkerService.getBiomarkersByType(type));
        }
        return ResponseEntity.ok(biomarkerService.getAllBiomarkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Biomarker> getBiomarkerById(@PathVariable Long id) {
        return biomarkerService.getBiomarkerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Biomarker>> searchBiomarkers(@RequestParam(name = "query") String query) {
        return ResponseEntity.ok(biomarkerService.searchBiomarkers(query));
    }
}
