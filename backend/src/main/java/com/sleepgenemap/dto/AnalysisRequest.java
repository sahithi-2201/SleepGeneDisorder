package com.sleepgenemap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Data Transfer Object capturing incoming sample analysis parameters.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisRequest {

    private String sampleId;

    @NotBlank(message = "Gene symbol or identifier is required for analysis")
    private String gene;

    private String biomarker;

    private String result; // e.g., "Detected", "Variant Identified", "Wild Type"

    private Double biomarkerValue;

    private String biomarkerUnit;
}
