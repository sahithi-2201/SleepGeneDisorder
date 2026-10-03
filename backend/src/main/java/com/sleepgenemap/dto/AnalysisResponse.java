package com.sleepgenemap.dto;

import lombok.*;
import java.util.List;

/**
 * Data Transfer Object returning the structured bioinformatics analysis result.
 * Enforces mandatory non-diagnostic medical disclaimer.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResponse {

    private String sampleId;
    private boolean geneFound;
    private boolean biomarkerFound;
    private String matchedGeneSymbol;
    private String matchedBiomarkerName;
    private List<String> associatedDisorders;
    private String geneBiomarkerRelationship;
    private List<String> supportingPmids;
    private String interpretation;
    private String medicalDisclaimer;
}
