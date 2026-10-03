package com.sleepgenemap.controller;

import com.sleepgenemap.dto.SearchResponse;
import com.sleepgenemap.service.BiomarkerService;
import com.sleepgenemap.service.DisorderService;
import com.sleepgenemap.service.GeneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {

    private final DisorderService disorderService;
    private final GeneService geneService;
    private final BiomarkerService biomarkerService;

    @GetMapping
    public ResponseEntity<SearchResponse> globalSearch(@RequestParam(name = "query") String query) {
        SearchResponse response = SearchResponse.builder()
                .query(query)
                .disorders(disorderService.searchDisorders(query))
                .genes(geneService.searchGenes(query))
                .biomarkers(biomarkerService.searchBiomarkers(query))
                .build();
        return ResponseEntity.ok(response);
    }
}
