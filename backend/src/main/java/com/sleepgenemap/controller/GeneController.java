package com.sleepgenemap.controller;

import com.sleepgenemap.model.Gene;
import com.sleepgenemap.service.GeneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing endpoints for human genes associated with sleep biology.
 */
@RestController
@RequestMapping("/api/genes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeneController {

    private final GeneService geneService;

    @GetMapping
    public ResponseEntity<List<Gene>> getAllGenes() {
        return ResponseEntity.ok(geneService.getAllGenes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gene> getGeneById(@PathVariable Long id) {
        return geneService.getGeneById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Gene>> searchGenes(@RequestParam(name = "query") String query) {
        return ResponseEntity.ok(geneService.searchGenes(query));
    }
}
