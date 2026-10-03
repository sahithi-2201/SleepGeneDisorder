package com.sleepgenemap.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Entity mapping to the "genes" table.
 * Stores genomic coordinates, HGNC symbols, NCBI Gene IDs, and UniProt accessions.
 */
@Entity
@Table(name = "genes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gene {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String symbol;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "ncbi_id", nullable = false, unique = true)
    private Long ncbiId;

    @Column(name = "uniprot_id", length = 50)
    private String uniprotId;

    @Column(length = 50)
    private String chromosome;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "gene", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("gene")
    @Builder.Default
    private List<GeneDisorder> disorderAssociations = new ArrayList<>();

    @OneToMany(mappedBy = "gene", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("gene")
    @Builder.Default
    private List<GeneBiomarker> biomarkerAssociations = new ArrayList<>();
}
