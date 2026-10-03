package com.sleepgenemap.service;

import com.sleepgenemap.dto.AnalysisRequest;
import com.sleepgenemap.dto.AnalysisResponse;
import com.sleepgenemap.model.*;
import com.sleepgenemap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeneRepository geneRepository;
    private final BiomarkerRepository biomarkerRepository;
    private final GeneDisorderRepository geneDisorderRepository;
    private final GeneBiomarkerRepository geneBiomarkerRepository;
    private final DisorderBiomarkerRepository disorderBiomarkerRepository;

    public static final String DISCLAIMER = 
        "SleepGeneMap is an educational bioinformatics exploration tool. The results are based " +
        "on relationships stored in the application's research database and should not be used " +
        "to diagnose, treat, or rule out a medical condition. Consult a qualified healthcare professional.";

    @Transactional(readOnly = true)
    public AnalysisResponse analyzeSample(AnalysisRequest request) {
        String geneQuery = request.getGene() != null ? request.getGene().trim() : "";
        String biomarkerQuery = request.getBiomarker() != null ? request.getBiomarker().trim() : "";

        Optional<Gene> geneOpt = geneQuery.isEmpty() ? Optional.empty() : geneRepository.findBySymbolIgnoreCase(geneQuery);
        Optional<Biomarker> biomarkerOpt = biomarkerQuery.isEmpty() ? Optional.empty() : biomarkerRepository.findByNameIgnoreCase(biomarkerQuery);

        boolean geneFound = geneOpt.isPresent();
        boolean biomarkerFound = biomarkerOpt.isPresent();

        Set<String> disorderNames = new LinkedHashSet<>();
        List<String> pmids = new ArrayList<>();
        String relationshipDesc = null;

        // Process Gene Associations
        if (geneFound) {
            Gene gene = geneOpt.get();
            List<GeneDisorder> gdList = geneDisorderRepository.findByGeneId(gene.getId());
            for (GeneDisorder gd : gdList) {
                disorderNames.add(gd.getDisorder().getName());
                if (gd.getPmid() != null && !pmids.contains(gd.getPmid())) {
                    pmids.add(gd.getPmid());
                }
            }

            // Direct Gene-Biomarker relationship
            if (biomarkerFound) {
                Biomarker biomarker = biomarkerOpt.get();
                Optional<GeneBiomarker> gbOpt = geneBiomarkerRepository.findByGeneIdAndBiomarkerId(gene.getId(), biomarker.getId());
                if (gbOpt.isPresent()) {
                    relationshipDesc = gbOpt.get().getRelationship();
                    if (gbOpt.get().getPmid() != null && !pmids.contains(gbOpt.get().getPmid())) {
                        pmids.add(gbOpt.get().getPmid());
                    }
                }
            }
        }

        // Process Biomarker Associations
        if (biomarkerFound) {
            Biomarker biomarker = biomarkerOpt.get();
            List<DisorderBiomarker> dbList = disorderBiomarkerRepository.findByBiomarkerId(biomarker.getId());
            for (DisorderBiomarker db : dbList) {
                disorderNames.add(db.getDisorder().getName());
                if (db.getPmid() != null && !pmids.contains(db.getPmid())) {
                    pmids.add(db.getPmid());
                }
            }
        }

        // Generate Structured Interpretation complying with safety requirements
        String interpretation;
        if (geneFound && biomarkerFound) {
            interpretation = "The entered gene (" + geneOpt.get().getSymbol() + ") and biomarker (" + 
                             biomarkerOpt.get().getName() + ") have documented research associations stored in the database.";
        } else if (geneFound) {
            interpretation = "The entered gene (" + geneOpt.get().getSymbol() + ") is associated in the database with: " +
                             (disorderNames.isEmpty() ? "circadian regulation" : String.join(", ", disorderNames)) + ".";
        } else if (biomarkerFound) {
            interpretation = "The entered biomarker (" + biomarkerOpt.get().getName() + ") matches a biomarker recorded in the database.";
        } else {
            interpretation = "No matching sleep-disorder association was found in the current SleepGeneMap database. " +
                             "This does not mean that the person does not have a sleep disorder.";
        }

        return AnalysisResponse.builder()
            .sampleId(request.getSampleId() != null && !request.getSampleId().isBlank() ? request.getSampleId() : "SAMPLE001")
            .geneFound(geneFound)
            .biomarkerFound(biomarkerFound)
            .matchedGeneSymbol(geneFound ? geneOpt.get().getSymbol() : null)
            .matchedBiomarkerName(biomarkerFound ? biomarkerOpt.get().getName() : null)
            .associatedDisorders(new ArrayList<>(disorderNames))
            .geneBiomarkerRelationship(relationshipDesc)
            .supportingPmids(pmids)
            .interpretation(interpretation)
            .medicalDisclaimer(DISCLAIMER)
            .build();
    }
}
