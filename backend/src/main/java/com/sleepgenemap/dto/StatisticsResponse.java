package com.sleepgenemap.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsResponse {
    private long totalDisorders;
    private long totalGenes;
    private long totalBiomarkers;
    private long geneDisorderAssociations;
    private long geneBiomarkerAssociations;
    private long disorderBiomarkerAssociations;
    private long totalReferences;
}
