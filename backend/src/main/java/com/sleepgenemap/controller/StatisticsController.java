package com.sleepgenemap.controller;

import com.sleepgenemap.dto.StatisticsResponse;
import com.sleepgenemap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final DisorderRepository disorderRepository;
    private final GeneRepository geneRepository;
    private final BiomarkerRepository biomarkerRepository;
    private final GeneDisorderRepository geneDisorderRepository;
    private final GeneBiomarkerRepository geneBiomarkerRepository;
    private final DisorderBiomarkerRepository disorderBiomarkerRepository;

    @GetMapping
    public ResponseEntity<StatisticsResponse> getDatabaseStatistics() {
        StatisticsResponse stats = StatisticsResponse.builder()
                .totalDisorders(disorderRepository.count())
                .totalGenes(geneRepository.count())
                .totalBiomarkers(biomarkerRepository.count())
                .geneDisorderAssociations(geneDisorderRepository.count())
                .geneBiomarkerAssociations(geneBiomarkerRepository.count())
                .disorderBiomarkerAssociations(disorderBiomarkerRepository.count())
                .totalReferences(12)
                .build();
        return ResponseEntity.ok(stats);
    }
}
