package com.sleepgenemap.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * JPA Join Entity mapping a Gene to a Biomarker with relationship description and PMID.
 */
@Entity
@Table(name = "gene_biomarker", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"gene_id", "biomarker_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneBiomarker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gene_id", nullable = false)
    @JsonIgnoreProperties({"disorderAssociations", "biomarkerAssociations"})
    private Gene gene;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "biomarker_id", nullable = false)
    @JsonIgnoreProperties({"geneAssociations", "disorderAssociations"})
    private Biomarker biomarker;

    @Column(length = 255)
    private String relationship;

    @Column(columnDefinition = "TEXT")
    private String evidence;

    @Column(length = 50)
    private String pmid;
}
