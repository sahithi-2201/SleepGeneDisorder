package com.sleepgenemap.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * JPA Entity mapping to the "scientific_references" table.
 * Catalogs primary PubMed literature substantiating sleep gene/biomarker associations.
 */
@Entity
@Table(name = "scientific_references")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScientificReference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String authors;

    @Column(length = 150)
    private String journal;

    @Column(name = "publication_year")
    private Integer year;

    @Column(length = 50, unique = true)
    private String pmid;

    @Column(length = 100)
    private String doi;

    @Column(length = 100)
    private String source;
}
