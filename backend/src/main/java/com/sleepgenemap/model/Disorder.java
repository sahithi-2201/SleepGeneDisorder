package com.sleepgenemap.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Entity mapping to the "disorders" table.
 * Encapsulates clinical sleep disorders cataloged in the database.
 */
@Entity
@Table(name = "disorders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(length = 255)
    private String synonyms;

    @Column(name = "icd11_code", length = 50)
    private String icd11Code;

    @OneToMany(mappedBy = "disorder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("disorder")
    @Builder.Default
    private List<GeneDisorder> geneAssociations = new ArrayList<>();

    @OneToMany(mappedBy = "disorder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("disorder")
    @Builder.Default
    private List<DisorderBiomarker> biomarkerAssociations = new ArrayList<>();
}
