package com.sleepgenemap.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Entity mapping to the "biomarkers" table.
 * Catalogs endocrine hormones, neuropeptides, cytokines, and polysomnographic indices.
 */
@Entity
@Table(name = "biomarkers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Biomarker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(name = "sample_type", length = 150)
    private String sampleType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "standard_unit", length = 50)
    private String standardUnit;

    @Column(name = "reference_range", length = 150)
    private String referenceRange;

    @OneToMany(mappedBy = "biomarker", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("biomarker")
    @Builder.Default
    private List<GeneBiomarker> geneAssociations = new ArrayList<>();

    @OneToMany(mappedBy = "biomarker", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("biomarker")
    @Builder.Default
    private List<DisorderBiomarker> disorderAssociations = new ArrayList<>();
}
