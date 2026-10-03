package com.sleepgenemap.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * JPA Join Entity mapping a Sleep Disorder to a Biomarker with clinical evidence.
 */
@Entity
@Table(name = "disorder_biomarker", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"disorder_id", "biomarker_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisorderBiomarker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disorder_id", nullable = false)
    @JsonIgnoreProperties({"geneAssociations", "biomarkerAssociations"})
    private Disorder disorder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "biomarker_id", nullable = false)
    @JsonIgnoreProperties({"geneAssociations", "disorderAssociations"})
    private Biomarker biomarker;

    @Column(columnDefinition = "TEXT")
    private String evidence;

    @Column(length = 50)
    private String pmid;
}
