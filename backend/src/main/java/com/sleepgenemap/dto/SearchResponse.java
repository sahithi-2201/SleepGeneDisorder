package com.sleepgenemap.dto;

import com.sleepgenemap.model.Biomarker;
import com.sleepgenemap.model.Disorder;
import com.sleepgenemap.model.Gene;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchResponse {
    private String query;
    private List<Disorder> disorders;
    private List<Gene> genes;
    private List<Biomarker> biomarkers;
}
