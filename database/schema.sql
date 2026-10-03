-- =====================================================================
-- SleepGeneMap Relational Database DDL Schema
-- Database Management System: MySQL 8.0+
-- Database Name: sleepgenemap
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS sleepgenemap 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE sleepgenemap;

-- Table 1: Sleep Disorders Catalog
CREATE TABLE IF NOT EXISTS disorders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    synonyms VARCHAR(255),
    icd11_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Human Genes Catalog
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

-- Table 3: Biological Markers Catalog
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

-- Table 4: Primary Scientific Literature References
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

-- Table 5: Gene - Disorder Association (Many-to-Many Junction Table)
CREATE TABLE IF NOT EXISTS gene_disorder (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gene_id BIGINT NOT NULL,
    disorder_id BIGINT NOT NULL,
    evidence TEXT,
    evidence_type VARCHAR(100) DEFAULT 'Literature Association',
    source_database VARCHAR(100) DEFAULT 'PubMed',
    pmid VARCHAR(50),
    doi VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gene_id) REFERENCES genes(id) ON DELETE CASCADE,
    FOREIGN KEY (disorder_id) REFERENCES disorders(id) ON DELETE CASCADE,
    UNIQUE KEY uq_gene_disorder (gene_id, disorder_id)
);

-- Table 6: Gene - Biomarker Signaling Axis (Many-to-Many Junction Table)
CREATE TABLE IF NOT EXISTS gene_biomarker (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gene_id BIGINT NOT NULL,
    biomarker_id BIGINT NOT NULL,
    relationship VARCHAR(255),
    evidence TEXT,
    evidence_type VARCHAR(100) DEFAULT 'Literature Association',
    source_database VARCHAR(100) DEFAULT 'PubMed',
    pmid VARCHAR(50),
    doi VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gene_id) REFERENCES genes(id) ON DELETE CASCADE,
    FOREIGN KEY (biomarker_id) REFERENCES biomarkers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_gene_biomarker (gene_id, biomarker_id)
);

-- Table 7: Disorder - Biomarker Association (Many-to-Many Junction Table)
CREATE TABLE IF NOT EXISTS disorder_biomarker (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disorder_id BIGINT NOT NULL,
    biomarker_id BIGINT NOT NULL,
    evidence TEXT,
    evidence_type VARCHAR(100) DEFAULT 'Clinical Study',
    source_database VARCHAR(100) DEFAULT 'PubMed',
    pmid VARCHAR(50),
    doi VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (disorder_id) REFERENCES disorders(id) ON DELETE CASCADE,
    FOREIGN KEY (biomarker_id) REFERENCES biomarkers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_disorder_biomarker (disorder_id, biomarker_id)
);

-- B-Tree Performance Indexes for Fast Searching
CREATE INDEX idx_genes_symbol ON genes(symbol);
CREATE INDEX idx_genes_ncbi ON genes(ncbi_id);
CREATE INDEX idx_biomarkers_name ON biomarkers(name);
CREATE INDEX idx_biomarkers_type ON biomarkers(type);
CREATE INDEX idx_disorders_category ON disorders(category);
