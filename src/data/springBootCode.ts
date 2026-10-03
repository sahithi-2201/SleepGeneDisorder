export interface CodeFile {
  path: string;
  name: string;
  category: 'Configuration' | 'Model / Entity' | 'Repository' | 'Service' | 'Controller' | 'DTO' | 'Database SQL' | 'Documentation';
  language: 'java' | 'xml' | 'sql' | 'properties' | 'markdown';
  explanation: string;
  content: string;
}

export const SPRING_BOOT_CODE_FILES: CodeFile[] = [
  {
    path: 'pom.xml',
    name: 'pom.xml',
    category: 'Configuration',
    language: 'xml',
    explanation: 'The Maven Project Object Model (POM) file. Defines Java 17, Spring Boot 3.2.x dependencies including Spring Web (REST API), Spring Data JPA (Hibernate ORM), MySQL Connector, H2 in-memory test database, and Lombok.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>
    
    <groupId>com.sleepgenemap</groupId>
    <artifactId>sleepgenemap-backend</artifactId>
    <version>1.0.0</version>
    <name>SleepGeneMap</name>
    <description>Bioinformatics Explorer for Sleep Disorder Genes and Biomarkers</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starter Web: Enables Spring MVC, Embedded Tomcat, and REST APIs -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA: Hibernate ORM for database mapping and repository abstraction -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Bean Validation: Validates incoming request payloads -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Driver for production database connectivity -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- H2 In-Memory Database for fast local testing and unit tests -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok to reduce boilerplate getter/setter/constructor code -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Test Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/resources/application.properties',
    name: 'application.properties',
    category: 'Configuration',
    language: 'properties',
    explanation: 'Application configuration declaring server port (8080), MySQL datasource settings, JPA Hibernate DDL auto behavior, and alternate H2 in-memory testing profile.',
    content: `# Server Configuration
server.port=8080
server.servlet.context-path=/

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/sleepgenemap?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Optional: To use H2 in-memory database during development, switch active profile:
# spring.profiles.active=dev
# --- H2 Dev Profile settings ---
# spring.datasource.url=jdbc:h2:mem:sleepgenemap;DB_CLOSE_DELAY=-1
# spring.datasource.driverClassName=org.h2.Driver
# spring.h2.console.enabled=true
# spring.jpa.database-platform=org.hibernate.dialect.H2Dialect`
  },
  {
    path: 'src/main/java/com/sleepgenemap/SleepGeneMapApplication.java',
    name: 'SleepGeneMapApplication.java',
    category: 'Configuration',
    language: 'java',
    explanation: 'Main entry point for the Spring Boot application annotated with @SpringBootApplication. It initiates component scanning, autoconfiguration, and boots the embedded Tomcat server.',
    content: `package com.sleepgenemap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for SleepGeneMap.
 * @SpringBootApplication encapsulates @Configuration, @EnableAutoConfiguration,
 * and @ComponentScan to bootstrap the entire Spring application context.
 */
@SpringBootApplication
public class SleepGeneMapApplication {

    public static void main(String[] args) {
        SpringApplication.run(SleepGeneMapApplication.class, args);
        System.out.println(">>> SleepGeneMap Spring Boot Backend started on http://localhost:8080");
    }
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/model/Disorder.java',
    name: 'Disorder.java',
    category: 'Model / Entity',
    language: 'java',
    explanation: 'JPA entity mapping to the "disorders" table. Encapsulates disorder name, description, category, and synonyms with @OneToMany relationships to GeneDisorder and DisorderBiomarker.',
    content: `package com.sleepgenemap.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Entity representing a sleep disorder record.
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
    @Builder.Default
    private List<GeneDisorder> geneAssociations = new ArrayList<>();

    @OneToMany(mappedBy = "disorder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DisorderBiomarker> biomarkerAssociations = new ArrayList<>();
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/model/Gene.java',
    name: 'Gene.java',
    category: 'Model / Entity',
    language: 'java',
    explanation: 'JPA entity for the "genes" table. Stores official HGNC gene symbol, NCBI Gene ID, UniProt accession, chromosomal locus, and biological function description.',
    content: `package com.sleepgenemap.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Entity representing a human gene associated with sleep biology.
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

    @Column(name = "ncbi_id", nullable = false)
    private Long ncbiId;

    @Column(name = "uniprot_id", length = 50)
    private String uniprotId;

    @Column(length = 50)
    private String chromosome;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "gene", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GeneDisorder> disorderAssociations = new ArrayList<>();

    @OneToMany(mappedBy = "gene", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GeneBiomarker> biomarkerAssociations = new ArrayList<>();
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/model/Biomarker.java',
    name: 'Biomarker.java',
    category: 'Model / Entity',
    language: 'java',
    explanation: 'JPA entity for the "biomarkers" table. Contains biomarker name, biological type (Hormone, Cytokine, Neuropeptide), sample matrix, standard unit, and reference ranges.',
    content: `package com.sleepgenemap.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Entity representing a biological marker related to sleep health.
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
    private String type; // e.g., Hormone, Cytokine, Neuropeptide

    @Column(name = "sample_type", length = 150)
    private String sampleType; // e.g., Saliva, Serum, CSF

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "standard_unit", length = 50)
    private String standardUnit; // e.g., pg/mL, events/hr

    @Column(name = "reference_range", length = 150)
    private String referenceRange;

    @OneToMany(mappedBy = "biomarker", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GeneBiomarker> geneAssociations = new ArrayList<>();

    @OneToMany(mappedBy = "biomarker", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DisorderBiomarker> disorderAssociations = new ArrayList<>();
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/model/GeneDisorder.java',
    name: 'GeneDisorder.java',
    category: 'Model / Entity',
    language: 'java',
    explanation: 'Join entity linking Gene and Disorder. Stores scientific evidence notes, mode of inheritance or association, and PubMed PMID citation.',
    content: `package com.sleepgenemap.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * JPA Join Entity mapping a Gene to a Sleep Disorder with PubMed evidence.
 */
@Entity
@Table(name = "gene_disorder")
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
    private Gene gene;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disorder_id", nullable = false)
    private Disorder disorder;

    @Column(columnDefinition = "TEXT")
    private String evidence;

    @Column(length = 50)
    private String pmid;
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/model/GeneBiomarker.java',
    name: 'GeneBiomarker.java',
    category: 'Model / Entity',
    language: 'java',
    explanation: 'Join entity mapping a Gene to a Biomarker. Documents molecular relationship (e.g., ligand-receptor, enzymatic degradation, transcriptional regulation) and PMID.',
    content: `package com.sleepgenemap.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * JPA Join Entity connecting a Gene to a Biomarker with relationship description.
 */
@Entity
@Table(name = "gene_biomarker")
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
    private Gene gene;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "biomarker_id", nullable = false)
    private Biomarker biomarker;

    @Column(length = 255)
    private String relationship;

    @Column(columnDefinition = "TEXT")
    private String evidence;

    @Column(length = 50)
    private String pmid;
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/repository/GeneRepository.java',
    name: 'GeneRepository.java',
    category: 'Repository',
    language: 'java',
    explanation: 'Spring Data JPA repository interface providing built-in CRUD operations and custom JPQL/derived query methods for symbol and NCBI search.',
    content: `package com.sleepgenemap.repository;

import com.sleepgenemap.model.Gene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GeneRepository extends JpaRepository<Gene, Long> {

    Optional<Gene> findBySymbolIgnoreCase(String symbol);

    Optional<Gene> findByNcbiId(Long ncbiId);

    @Query("SELECT g FROM Gene g WHERE LOWER(g.symbol) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(g.uniprotId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Gene> searchGenes(@Param("query") String query);
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/repository/DisorderRepository.java',
    name: 'DisorderRepository.java',
    category: 'Repository',
    language: 'java',
    explanation: 'Spring Data JPA repository for Disorder entity with category filtering and substring search across name and synonyms.',
    content: `package com.sleepgenemap.repository;

import com.sleepgenemap.model.Disorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisorderRepository extends JpaRepository<Disorder, Long> {

    Optional<Disorder> findByNameIgnoreCase(String name);

    List<Disorder> findByCategoryIgnoreCase(String category);

    @Query("SELECT d FROM Disorder d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.synonyms) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Disorder> searchDisorders(@Param("query") String query);
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/dto/AnalysisRequest.java',
    name: 'AnalysisRequest.java',
    category: 'DTO',
    language: 'java',
    explanation: 'Data Transfer Object capturing sample result inputs from the Angular frontend: Sample ID, Gene symbol, Biomarker name, qualitative result, and quantitative value.',
    content: `package com.sleepgenemap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * DTO for incoming sample analysis requests.
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

    private String result; // e.g. "Detected", "Variant Identified", "Wild Type"

    private Double biomarkerValue;

    private String biomarkerUnit;
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/dto/AnalysisResponse.java',
    name: 'AnalysisResponse.java',
    category: 'DTO',
    language: 'java',
    explanation: 'Data Transfer Object returning matching outcomes, associated sleep disorders, gene-biomarker relationships, scientific interpretation, and mandatory medical safety disclaimer.',
    content: `package com.sleepgenemap.dto;

import lombok.*;
import java.util.List;

/**
 * DTO returning the structured bioinformatics analysis result.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisResponse {

    private String sampleId;
    private boolean geneFound;
    private boolean biomarkerFound;
    private String matchedGeneSymbol;
    private String matchedBiomarkerName;
    private List<String> associatedDisorders;
    private String geneBiomarkerRelationship;
    private List<String> supportingPmids;
    private String interpretation;
    private String medicalDisclaimer;
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/service/AnalysisService.java',
    name: 'AnalysisService.java',
    category: 'Service',
    language: 'java',
    explanation: 'Core business service executing biological matching logic, finding connected disorders across relational tables, and constructing safe, non-diagnostic scientific reports.',
    content: `package com.sleepgenemap.service;

import com.sleepgenemap.dto.AnalysisRequest;
import com.sleepgenemap.dto.AnalysisResponse;
import com.sleepgenemap.model.*;
import com.sleepgenemap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeneRepository geneRepository;
    private final BiomarkerRepository biomarkerRepository;
    private final GeneDisorderRepository geneDisorderRepository;
    private final GeneBiomarkerRepository geneBiomarkerRepository;

    private static final String DISCLAIMER = 
        "SleepGeneMap is an educational bioinformatics exploration tool. The results are based " +
        "on relationships stored in the application's research database and should not be used " +
        "to diagnose, treat, or rule out a medical condition. Consult a qualified healthcare professional.";

    @Transactional(readOnly = true)
    public AnalysisResponse analyzeSample(AnalysisRequest request) {
        String geneQuery = request.getGene() != null ? request.getGene().trim() : "";
        String biomarkerQuery = request.getBiomarker() != null ? request.getBiomarker().trim() : "";

        Optional<Gene> geneOpt = geneRepository.findBySymbolIgnoreCase(geneQuery);
        Optional<Biomarker> biomarkerOpt = biomarkerQuery.isEmpty() ? 
            Optional.empty() : biomarkerRepository.findByNameIgnoreCase(biomarkerQuery);

        boolean geneFound = geneOpt.isPresent();
        boolean biomarkerFound = biomarkerOpt.isPresent();

        Set<String> disorderNames = new LinkedHashSet<>();
        List<String> pmids = new ArrayList<>();
        String relationshipDesc = null;

        if (geneFound) {
            Gene gene = geneOpt.get();
            List<GeneDisorder> gdList = geneDisorderRepository.findByGeneId(gene.getId());
            for (GeneDisorder gd : gdList) {
                disorderNames.add(gd.getDisorder().getName());
                if (gd.getPmid() != null) pmids.add(gd.getPmid());
            }

            if (biomarkerFound) {
                Biomarker biomarker = biomarkerOpt.get();
                Optional<GeneBiomarker> gbOpt = geneBiomarkerRepository
                    .findByGeneIdAndBiomarkerId(gene.getId(), biomarker.getId());
                if (gbOpt.isPresent()) {
                    relationshipDesc = gbOpt.get().getRelationship();
                    if (gbOpt.get().getPmid() != null) pmids.add(gbOpt.get().getPmid());
                }
            }
        }

        String interpretation;
        if (geneFound && biomarkerFound) {
            interpretation = "The entered gene and biomarker have documented research associations stored in the database.";
        } else if (geneFound) {
            interpretation = "The entered gene is associated in the database with the following sleep disorder(s).";
        } else if (biomarkerFound) {
            interpretation = "The entered biomarker matches a biomarker recorded in the database.";
        } else {
            interpretation = "No matching sleep-disorder association was found in the current SleepGeneMap database.";
        }

        return AnalysisResponse.builder()
            .sampleId(request.getSampleId() != null ? request.getSampleId() : "SAMPLE001")
            .geneFound(geneFound)
            .biomarkerFound(biomarkerFound)
            .matchedGeneSymbol(geneFound ? geneOpt.get().getSymbol() : null)
            .matchedBiomarkerName(biomarkerFound ? biomarkerOpt.get().getName() : null)
            .associatedDisorders(new ArrayList<>(disorderNames))
            .geneBiomarkerRelationship(relationshipDesc)
            .supportingPmids(pmids)
            .interpretation(interpretation)
            .medicalDisclaimer(DISCLAIMER)
            .build();
    }
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/controller/AnalysisController.java',
    name: 'AnalysisController.java',
    category: 'Controller',
    language: 'java',
    explanation: 'Spring REST Controller exposing POST /api/analyze. Handles input validation and delegates request processing to AnalysisService.',
    content: `package com.sleepgenemap.controller;

import com.sleepgenemap.dto.AnalysisRequest;
import com.sleepgenemap.dto.AnalysisResponse;
import com.sleepgenemap.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for Sample Result Analysis.
 * Annotated with @RestController and @CrossOrigin to permit requests from Angular.
 */
@RestController
@RequestMapping("/api/analyze")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping
    public ResponseEntity<AnalysisResponse> analyzeSample(@Valid @RequestBody AnalysisRequest request) {
        AnalysisResponse response = analysisService.analyzeSample(request);
        return ResponseEntity.ok(response);
    }
}`
  },
  {
    path: 'src/main/java/com/sleepgenemap/controller/DisorderController.java',
    name: 'DisorderController.java',
    category: 'Controller',
    language: 'java',
    explanation: 'REST controller providing GET /api/disorders and GET /api/disorders/{id} with exception handling when an unknown disorder ID is queried.',
    content: `package com.sleepgenemap.controller;

import com.sleepgenemap.model.Disorder;
import com.sleepgenemap.service.DisorderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disorders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DisorderController {

    private final DisorderService disorderService;

    @GetMapping
    public ResponseEntity<List<Disorder>> getAllDisorders() {
        return ResponseEntity.ok(disorderService.getAllDisorders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disorder> getDisorderById(@PathVariable Long id) {
        return disorderService.getDisorderById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}`
  },
  {
    path: 'src/main/resources/schema.sql',
    name: 'schema.sql',
    category: 'Database SQL',
    language: 'sql',
    explanation: 'Complete MySQL DDL defining the relational schema sleepgenemap, including foreign keys, indexes, and constraints as detailed in Chapter 6.',
    content: `-- =======================================================
-- SleepGeneMap Database Schema (MySQL 8.0+)
-- Database: sleepgenemap
-- =======================================================

CREATE DATABASE IF NOT EXISTS sleepgenemap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sleepgenemap;

-- 1. Disorders Table
CREATE TABLE IF NOT EXISTS disorders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    synonyms VARCHAR(255),
    icd11_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Genes Table
CREATE TABLE IF NOT EXISTS genes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    ncbi_id BIGINT NOT NULL UNIQUE,
    uniprot_id VARCHAR(50),
    chromosome VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Biomarkers Table
CREATE TABLE IF NOT EXISTS biomarkers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    sample_type VARCHAR(150),
    description TEXT,
    standard_unit VARCHAR(50),
    reference_range VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. References Table
CREATE TABLE IF NOT EXISTS scientific_references (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    authors TEXT NOT NULL,
    journal VARCHAR(150),
    publication_year INT,
    pmid VARCHAR(50) UNIQUE,
    doi VARCHAR(100),
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Gene-Disorder Association Table
CREATE TABLE IF NOT EXISTS gene_disorder (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gene_id BIGINT NOT NULL,
    disorder_id BIGINT NOT NULL,
    evidence TEXT,
    pmid VARCHAR(50),
    FOREIGN KEY (gene_id) REFERENCES genes(id) ON DELETE CASCADE,
    FOREIGN KEY (disorder_id) REFERENCES disorders(id) ON DELETE CASCADE,
    UNIQUE KEY uq_gene_disorder (gene_id, disorder_id)
);

-- 6. Gene-Biomarker Association Table
CREATE TABLE IF NOT EXISTS gene_biomarker (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gene_id BIGINT NOT NULL,
    biomarker_id BIGINT NOT NULL,
    relationship VARCHAR(255),
    evidence TEXT,
    pmid VARCHAR(50),
    FOREIGN KEY (gene_id) REFERENCES genes(id) ON DELETE CASCADE,
    FOREIGN KEY (biomarker_id) REFERENCES biomarkers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_gene_biomarker (gene_id, biomarker_id)
);

-- 7. Disorder-Biomarker Association Table
CREATE TABLE IF NOT EXISTS disorder_biomarker (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disorder_id BIGINT NOT NULL,
    biomarker_id BIGINT NOT NULL,
    evidence TEXT,
    pmid VARCHAR(50),
    FOREIGN KEY (disorder_id) REFERENCES disorders(id) ON DELETE CASCADE,
    FOREIGN KEY (biomarker_id) REFERENCES biomarkers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_disorder_biomarker (disorder_id, biomarker_id)
);

-- Indexes for Fast Query Retrieval
CREATE INDEX idx_gene_symbol ON genes(symbol);
CREATE INDEX idx_biomarker_name ON biomarkers(name);
CREATE INDEX idx_disorder_category ON disorders(category);`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Documentation',
    language: 'markdown',
    explanation: 'Comprehensive student project README with setup instructions, Maven build commands, Angular CLI serve guide, REST API documentation, and testing matrix.',
    content: `# SleepGeneMap – Sleep Disorder Gene & Biomarker Explorer

> **Academic Context**: Bioinformatics Mini Project for *Web Technologies for Bioinformatics* (3rd Year B.Tech / B.Sc Bioinformatics).

---

## 1. Project Overview
SleepGeneMap is an interactive bioinformatics platform mapping multi-scale biological associations between **Sleep Disorders ↔ Genes ↔ Biomarkers**, grounded in peer-reviewed scientific literature and authoritative repositories (NCBI Gene, UniProt, PubMed).

### Key Features
* **Disorder Explorer**: Searchable classification of sleep disorders with clinical summaries, genetic architectures, and biomarker profiles.
* **Gene Explorer**: Comprehensive genomic entries with NCBI Gene IDs, UniProt accession, chromosomal cytoband loci, and functional annotations.
* **Biomarker Explorer**: Quantitative and qualitative profiling across hormones, neuropeptides, cytokines, and polysomnographic physiological indices.
* **Sample Result Analysis**: Matches sample IDs and test results against known relational databases with non-diagnostic research interpretations.
* **Interactive Network Visualization**: Graphical rendering of gene-disorder-biomarker molecular interaction webs.
* **Medical Safety Guardrails**: Prominent educational disclaimers enforcing strict non-diagnostic ethics.

---

## 2. Technology Stack
* **Frontend**: Angular 17+ / TypeScript / Bootstrap & Angular Material / SVG Interactive Networks
* **Backend**: Java 17 / Spring Boot 3.2 / Spring Web REST / Spring Data JPA / Hibernate
* **Database**: MySQL 8.0 (with optional in-memory H2 profile)
* **Build Tool**: Maven

---

## 3. Getting Started

### Database Setup (MySQL)
\`\`\`bash
mysql -u root -p < src/main/resources/schema.sql
mysql -u root -p < src/main/resources/data.sql
\`\`\`

### Backend Execution (Spring Boot)
\`\`\`bash
mvn clean install
mvn spring-boot:run
\`\`\`
The backend starts at \`http://localhost:8080\`.

### Frontend Execution (Angular)
\`\`\`bash
npm install
ng serve --open
\`\`\`
The frontend opens at \`http://localhost:4200\`.

---

## 4. REST API Endpoints
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| \`GET\` | \`/api/statistics\` | Get total counts of disorders, genes, biomarkers, and associations |
| \`GET\` | \`/api/disorders\` | Retrieve all sleep disorder records |
| \`GET\` | \`/api/disorders/{id}\` | Retrieve disorder detail by primary key |
| \`GET\` | \`/api/genes\` | Retrieve all gene catalog entries |
| \`GET\` | \`/api/genes/search?query=PER2\` | Search genes by symbol or NCBI ID |
| \`GET\` | \`/api/biomarkers\` | Retrieve all indexed biomarkers |
| \`POST\` | \`/api/analyze\` | Analyze sample result against relational repository |

---

## 5. Medical Disclaimer
**SleepGeneMap is an educational bioinformatics exploration tool. The results are based on relationships stored in the application's research database and should not be used to diagnose, treat, or rule out a medical condition. Consult a qualified healthcare professional for medical interpretation.**`
  }
];
