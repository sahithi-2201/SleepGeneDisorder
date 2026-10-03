-- =====================================================================
-- SleepGeneMap Relational Database DDL Schema
-- Database Management System: MySQL 8.0+
-- Database Name: sleepgenemap
-- =====================================================================

CREATE DATABASE IF NOT EXISTS sleepgenemap 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE sleepgenemap;

CREATE TABLE IF NOT EXISTS disorders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    synonyms VARCHAR(255),
    icd11_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS gene_disorder (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gene_id BIGINT NOT NULL,
    disorder_id BIGINT NOT NULL,
    evidence TEXT,
    pmid VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gene_id) REFERENCES genes(id) ON DELETE CASCADE,
    FOREIGN KEY (disorder_id) REFERENCES disorders(id) ON DELETE CASCADE,
    UNIQUE KEY uq_gene_disorder (gene_id, disorder_id)
);

CREATE TABLE IF NOT EXISTS gene_biomarker (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    gene_id BIGINT NOT NULL,
    biomarker_id BIGINT NOT NULL,
    relationship VARCHAR(255),
    evidence TEXT,
    pmid VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (gene_id) REFERENCES genes(id) ON DELETE CASCADE,
    FOREIGN KEY (biomarker_id) REFERENCES biomarkers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_gene_biomarker (gene_id, biomarker_id)
);

CREATE TABLE IF NOT EXISTS disorder_biomarker (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disorder_id BIGINT NOT NULL,
    biomarker_id BIGINT NOT NULL,
    evidence TEXT,
    pmid VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (disorder_id) REFERENCES disorders(id) ON DELETE CASCADE,
    FOREIGN KEY (biomarker_id) REFERENCES biomarkers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_disorder_biomarker (disorder_id, biomarker_id)
);

CREATE INDEX idx_genes_symbol ON genes(symbol);
CREATE INDEX idx_genes_ncbi ON genes(ncbi_id);
CREATE INDEX idx_biomarkers_name ON biomarkers(name);
CREATE INDEX idx_biomarkers_type ON biomarkers(type);
CREATE INDEX idx_disorders_category ON disorders(category);
