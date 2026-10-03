# SleepGeneMap — Data Sources & Scientific Curation Protocol

**Project:** SleepGeneMap – Sleep Disorder Gene & Biomarker Explorer  
**Module:** Bioinformatics Data Verification & Evidence Provenance  
**Date of Audit & Access:** 2026-10-03  
**Target Level:** 3rd-Year Undergraduate Mini Project (*Web Technologies for Bioinformatics*)  
**Academic Standard:** No synthetic data, no assumed relationships, strict literature provenance.

---

## 1. Primary Curated Data Sources

SleepGeneMap synthesizes multi-scale biological information strictly from authoritative, peer-reviewed biomedical databases and primary literature:

| Source | Organization | Purpose in SleepGeneMap | Identifiers Used |
| :--- | :--- | :--- | :--- |
| **PubMed / MEDLINE** | National Library of Medicine (NIH) | Primary literature verification and bibliographic indexing | PubMed ID (PMID), DOI |
| **NCBI Gene** | National Center for Biotechnology Information | Authoritative human gene nomenclature, genomic coordinates, and locus summaries | Official Symbol, NCBI Gene ID, Chromosome Locus |
| **UniProtKB** | Universal Protein Resource (EMBL-EBI / SIB / PIR) | Protein sequence accessions, protein function, and sub-cellular localization | UniProt Accession Number (e.g., O15055, P01920) |
| **GWAS Catalog** | NHGRI-EBI | Genome-wide statistical association verification for complex sleep traits and disorders | Published Variant rsID, Odds Ratios (OR), p-values |
| **ICSD-3 / ICD-11** | AASM / World Health Organization | Clinical sleep disorder nomenclature and diagnostic criteria | ICD-11 Code (e.g., 7A60, 7A20.0, 7A40.0) |

---

## 2. Literature Search Strategy

For each candidate biological entity (Disorder, Gene, Biomarker), a structured Boolean search query was executed in PubMed and NCBI Entrez:

1. **Gene–Disorder Search:**
   ```text
   ("{Gene Symbol}"[Gene/Protein Name] OR "{NCBI ID}") AND ("{Sleep Disorder Name}" OR "{ICSD-3 Synonym}") AND ("polymorphism" OR "mutation" OR "variant" OR "GWAS" OR "association")
   ```
2. **Disorder–Biomarker Search:**
   ```text
   ("{Sleep Disorder Name}") AND ("{Biomarker Name}") AND ("plasma" OR "serum" OR "CSF" OR "saliva" OR "diagnostic criteria" OR "concentration")
   ```
3. **Gene–Biomarker Search:**
   ```text
   ("{Gene Symbol}") AND ("{Biomarker Name}") AND ("synthesis" OR "pathway" OR "transcription" OR "clearance" OR "receptor")
   ```

---

## 3. Inclusion & Exclusion Criteria

### Inclusion Criteria:
1. **Primary Experimental or Replicated Association:** The relationship must be supported by a peer-reviewed manuscript in PubMed detailing a genetic mutation, GWAS hit ($p < 5 \times 10^{-8}$ or replicated), clinical laboratory measurement, or validated biochemical pathway.
2. **Explicit Relevance:** The cited paper must directly investigate the paired entity.
3. **Traceable Identifier:** Every recorded record must possess a real, verifiable PubMed PMID and, where available, a digital object identifier (DOI).
4. **Official Genomic Nomenclature:** All gene symbols conform to HUGO Gene Nomenclature Committee (HGNC) standards with valid NCBI Gene and UniProt identifiers.

### Exclusion Criteria:
1. **No Assumption Inferences:** Biological plausibility alone is not sufficient (e.g., assuming a general sleep gene controls a sleep biomarker without direct experimental proof).
2. **Unreplicated / Non-Significant SNPs:** Polymorphisms that failed multiple-testing corrections or lacked replication (e.g., *ARNTL* rs1026071) were excluded.
3. **Mismatched Citations:** Any record where the cited PMID addressed an unrelated paper was eliminated.
4. **Diagnostic Extrapolations:** Review articles discussing general brain mechanisms without specific locus evidence (e.g., *GABRA9* in insomnia) were excluded.
5. **Fabricated Patient Values:** Invented clinical numbers (e.g., patient-specific values) are strictly excluded.

---

## 4. Evidence Classification System

To preserve scientific rigor, all relationships in SleepGeneMap are tagged with a specific `evidence_type`:

- **GWAS:** Unbiased genome-wide association study reaching statistical significance in well-powered discovery and replication cohorts (e.g., *MEIS1*, *BTBD9* in RLS).
- **Genetic Association Study:** Candidate-gene case-control or cohort genetic association study with odds ratios and confidence intervals (e.g., *SLC6A4* 5-HTTLPR in insomnia).
- **Functional / Family Study:** Mendelian pedigree linkage, whole-genome sequencing, or biochemical expression assay demonstrating loss/gain of function (e.g., *PER2* Ser662Gly in FASPS, *CRY1* exon skipping in DSPD, *BHLHE41* in natural short sleep).
- **Clinical Diagnostic Study:** Objective laboratory assay establishing clinical diagnostic thresholds (e.g., CSF Orexin-A $\le 110\text{ pg/mL}$ for Narcolepsy Type 1).
- **Meta-Analysis:** Systematic review and quantitative pooling of clinical or genetic studies (e.g., *TNF* -308G/A and circulating TNF-$\alpha$/IL-6 in OSA).
- **Physiological Study:** Laboratory circadian phase kinetics (e.g., Lewy 1980 melatonin suppression and DLMO determination).

---

## 5. Audit Results & Inventory

| Category | Initial Count | Verified Count | Corrected Records | Removed Records | Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Sleep Disorders** | 7 | 7 | 0 | 0 | 100% Curated (ICD-11 aligned) |
| **Human Genes** | 22 | 16 | 4 | 6 | Cleaned (Unverified loci removed) |
| **Biomarkers** | 10 | 9 | 1 | 1 | Cleaned (No synthetic units) |
| **Gene–Disorder Associations** | 20 | 14 | 8 | 6 | 100% Verified against PubMed |
| **Gene–Biomarker Associations** | 12 | 8 | 4 | 4 | 100% Verified against PubMed |
| **Disorder–Biomarker Associations** | 10 | 8 | 3 | 2 | 100% Verified against PubMed |
| **Scientific Literature References** | 12 | 20 | 6 corrected / 8 added | 0 invalid kept | 100% Verified PMIDs |

### Detailed Audit Summary of Removed Records:
1. **GABRA9 ↔ Chronic Insomnia Disorder:** Removed. Riemann et al. 2010 was a general review of hyperarousal; GABRA9 is an epithelial/cochlear subunit without validated primary insomnia association.
2. **TNFRSF1A ↔ Obstructive Sleep Apnea:** Removed. Original citation (PMID 23541571) was a protein meta-analysis, not a receptor genetic study. Replaced by verified *TNF* -308G/A promoter locus.
3. **ADRB2 ↔ Obstructive Sleep Apnea:** Removed. Cited paper lacked ADRB2 data; candidate gene studies lack consistent replication.
4. **ARNTL ↔ Sleep Induction:** Removed. Population cohort study lost significance upon multiple correction.
5. **MEIS1 ↔ Ferritin (direct transcriptional control):** Removed. While MEIS1 is an RLS risk gene and iron deficiency exacerbates RLS, direct transcriptional regulation was not demonstrated in the cited GWAS paper.
6. **REM Sleep Behavior Disorder ↔ Serotonin:** Removed. Original citation was an RLS GWAS paper with no serotonin measurements in iRBD.

---

## 6. Known Dataset Limitations

1. **Curated Research Subset:** SleepGeneMap represents a rigorously curated subset of validated sleep genetics and biomarkers; it does not claim to index the entire human genome or all published sleep literature.
2. **Non-Diagnostic Nature:** Statistical genetic associations (e.g., *SLC6A4* 5-HTTLPR short allele) and circadian phase markers (e.g., DLMO) confer probabilistic susceptibility or physiological timing; they are **not diagnostic of disease**.
3. **Demo Sample Clear Separation:** Demonstration presets in the application are artificial test cases and are explicitly marked **"Demo Sample — Not Clinical Data"**.
