package com.sleepgenemap.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * JPA Join Entity mapping a Gene to a Sleep Disorder with PubMed evidence citations.
 */
@Entity
@Table(name = "gene_disorder", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"gene_id", "disorder_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneDisorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gene_id", nullable = false)
    @JsonIgnoreProperties({"disorderAssociations", "biomarkerAssociations"})
    private Gene gene;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disorder_id", nullable = false)
    @JsonIgnoreProperties({"geneAssociations", "biomarkerAssociations"})
    private Disorder disorder;

    @Column(columnDefinition = "TEXT")
    private String evidence;

    @Column(length = 50)
    private String pmid;
}
