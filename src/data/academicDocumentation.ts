export interface DocumentationChapter {
  number: number;
  title: string;
  subtitle: string;
  content: string;
}

export const ACADEMIC_DOCUMENTATION_CHAPTERS: DocumentationChapter[] = [
  {
    number: 1,
    title: "Introduction",
    subtitle: "Bioinformatics Fundamentals, Sleep Biology & Motivation",
    content: `### 1.1 What is Bioinformatics?
Bioinformatics is an interdisciplinary scientific domain that develops methods and software tools for understanding biological data, especially when the data sets are large and complex. It combines biology, computer science, information engineering, mathematics, and statistics to analyze and interpret biological relationships at the molecular, genomic, and proteomic levels.

### 1.2 What are Sleep Disorders?
Sleep disorders are conditions that impair an individual's normal sleep patterns, architecture, or duration. According to the International Classification of Sleep Disorders (ICSD-3) and World Health Organization ICD-11, sleep pathologies span several major categories:
- **Sleep-Wake Disorders / Insomnia**: Persistent difficulty initiating or maintaining restorative sleep.
- **Central Disorders of Hypersomnolence (e.g., Narcolepsy)**: Irresistible daytime sleepiness and loss of hypocretinergic wake-stabilizing neurons.
- **Sleep-Related Breathing Disorders (e.g., Obstructive Sleep Apnea)**: Repetitive pharyngeal airway collapse triggering hypoxemic cascades.
- **Circadian Rhythm Sleep-Wake Disorders**: Misalignment between endogenous molecular oscillators and the 24-hour light/dark cycle.
- **Sleep Movement Disorders & Parasomnias**: Restless legs syndrome, periodic limb movements, and REM sleep behavior enactment.

### 1.3 Why are Genes and Biomarkers Relevant?
Sleep is not merely a passive behavioral state; it is an active, tightly regulated neurobiological process coordinated by:
1. **Endogenous Molecular Clocks (Circadian Drive)**: Controlled by core transcription-translation feedback loops (TTFL) involving genes like *PER2*, *PER3*, *CLOCK*, *CRY1*, and *BMAL1*.
2. **Homeostatic Sleep Pressure (Process S)**: Driven by the progressive buildup of neurochemicals like adenosine in the basal forebrain, modulated by enzymes such as *ADA* (Adenosine Deaminase).
3. **Biochemical Biomarkers**: Circulating molecules such as melatonin, orexin-A (hypocretin-1), cortisol, ferritin, and cytokines (IL-6, TNF-α) provide objective clinical proxies of circadian phase, neuroendocrine arousal, and inflammatory strain.

### 1.4 Motivation for SleepGeneMap
Students, researchers, and educators in bioinformatics often encounter fragmented databases: genomic repositories (NCBI Gene, Ensembl) do not directly cross-reference clinical biomarker thresholds or specific polysomnographic sleep phenotypes. **SleepGeneMap** was conceived as a 3rd-year bioinformatics project to synthesize these dispersed biological relationships into an intuitive, evidence-grounded web application.`
  },
  {
    number: 2,
    title: "Problem Statement",
    subtitle: "Challenges in Multi-Omic Sleep Exploration",
    content: `### 2.1 The Disconnect in Biological Data Silos
Currently, biomedical literature on sleep physiology is distributed across disjointed domains:
- Clinical diagnostic criteria reside in psychiatric and pulmonary sleep society guidelines (AASM, ICSD-3).
- Genomic sequence and locus coordinates are cataloged in NCBI Gene and UniProt.
- Clinical biomarker reference intervals are buried in specialty endocrinology and clinical chemistry papers.
- Scientific evidence validating these connections is scattered across thousands of PubMed manuscripts.

### 2.2 The Risk of Unsubstantiated Diagnostic Claims
Many commercial health dashboards make irresponsible diagnostic leaps (e.g., telling a user with a *PER2* single nucleotide polymorphism that they have a severe sleep disorder). In educational bioinformatics, there is an urgent need for tools that **explicitly separate statistical or experimental association from medical diagnosis**, providing clear research disclaimers while highlighting genuine scientific literature.`
  },
  {
    number: 3,
    title: "Objectives",
    subtitle: "Core Deliverables & Educational Goals",
    content: `The main objectives of this project are:
1. **Build a Web-Based Bioinformatics Explorer**: Create a responsive web interface optimized for biological exploration.
2. **Store Structured Sleep Disorder Information**: Curate classifications, clinical descriptions, and diagnostic criteria for major sleep pathologies.
3. **Store Curated Gene Information**: Catalog essential human genes associated with circadian timing, neurotransmission, and sleep depth with official NCBI and UniProt accession numbers.
4. **Store Validated Biomarker Information**: Catalog key hormones, neuropeptides, cytokines, and physiological sleep parameters with standardized clinical units.
5. **Establish Relational Associations**: Link Disorders ↔ Genes ↔ Biomarkers through many-to-many relational tables supported by verified PubMed PMIDs.
6. **Provide Multi-Parametric Search**: Enable querying by gene symbol, disease name, biomarker class, or chromosomal locus.
7. **Analyze Sample Results**: Provide a sample analysis module to evaluate experimental/educational inputs against the relational database.
8. **Display Supporting Scientific Evidence**: Ensure every biological association cites its primary research source (PMID / DOI) without fabricating claims.`
  },
  {
    number: 4,
    title: "Technologies Used",
    subtitle: "Full-Stack Bioinformatics Tech Stack",
    content: `### 4.1 Frontend Technologies
- **Angular / React SPA with TypeScript**: Provides type-safe component state management, modular routing, and reactive data streams.
- **Tailwind CSS & Scientific Theme**: Implements a clean clinical light/teal visual language compliant with the science & biotech design constitution.
- **Interactive SVG Network Visualization**: Renders interactive molecular networks with node dragging, zoom/pan controls, and inspector modals.

### 4.2 Backend Technologies
- **Java 17 & Spring Boot 3.2**: Enterprise-grade backend framework providing dependency injection, inversion of control, and robust REST APIs.
- **Spring Web (Spring MVC)**: Maps HTTP request verbs (GET, POST) to controller methods using annotations like \`@GetMapping\` and \`@PostMapping\`.
- **Spring Data JPA & Hibernate**: Object-Relational Mapping (ORM) framework converting Java entities into relational database queries.
- **Maven**: Dependency management and automated build system.

### 4.3 Database
- **MySQL 8.0**: Relational database management system with foreign key integrity, index optimization, and utf8mb4 collation.
- **H2 In-Memory Database**: Available for zero-configuration local development and continuous integration test suites.`
  },
  {
    number: 5,
    title: "System Architecture",
    subtitle: "Multi-Tier Enterprise & Client Interaction Flow",
    content: `### 5.1 Architecture Diagram
\`\`\`text
+-------------------------------------------------------------+
|                      CLIENT TIER                            |
|  Angular / Web App: Reactive Components, Form Validation,    |
|  Interactive Network Graph, Sample Analysis UI              |
+-------------------------------------------------------------+
                               |
                        HTTP / JSON REST API
                               v
+-------------------------------------------------------------+
|                     APPLICATION TIER                        |
|  Spring Boot / Controller Layer                             |
|  (@RestController, @CrossOrigin, @Valid)                    |
|                              |                              |
|  Service Layer                                              |
|  (DisorderService, GeneService, AnalysisService)             |
|                              |                              |
|  Repository Layer (Spring Data JPA)                         |
|  (DisorderRepository, GeneRepository, BiomarkerRepository)  |
+-------------------------------------------------------------+
                               |
                         JDBC / Hibernate
                               v
+-------------------------------------------------------------+
|                       DATABASE TIER                         |
|  MySQL 8.0: sleepgenemap                                    |
|  Tables: disorders, genes, biomarkers, gene_disorder,       |
|  gene_biomarker, disorder_biomarker, scientific_references  |
+-------------------------------------------------------------+
\`\`\`

### 5.2 Layered Separation of Concerns
1. **Controller Layer**: Inspects incoming HTTP payloads, verifies parameter formatting, and dispatches to services.
2. **Service Layer**: Houses the core bioinformatics matching rules, combines disparate repositories, and structures interpretation outputs.
3. **Repository Layer**: Interfaces with the underlying SQL store via JPA methods and custom JPQL queries.
4. **Entity / Model Layer**: Declares database schemas as Java classes with table annotations and foreign key mappings.`
  },
  {
    number: 6,
    title: "Database Design",
    subtitle: "Entity-Relationship (ER) Schema & Table Structures",
    content: `### 6.1 Entity-Relationship (ER) Diagram
\`\`\`text
     +-------------------+              +-------------------+
     |     disorders     |              |       genes       |
     +-------------------+              +-------------------+
     | PK id             |              | PK id             |
     |    name           |              |    symbol         |
     |    description    |              |    name           |
     |    category       |              |    ncbi_id        |
     |    synonyms       |              |    uniprot_id     |
     |    icd11_code     |              |    chromosome     |
     +-------------------+              |    description    |
               |                        +-------------------+
               | 1                                | 1
               |                                  |
               | N                                | N
     +-------------------+              +-------------------+
     | disorder_biomarker|              |   gene_disorder   |
     +-------------------+              +-------------------+
     | PK id             |              | PK id             |
     | FK disorder_id    |              | FK gene_id        |
     | FK biomarker_id   |              | FK disorder_id    |
     |    evidence       |              |    evidence       |
     |    pmid           |              |    pmid           |
     +-------------------+              +-------------------+
               | N                                |
               |                                  |
               | 1                                | N
     +-------------------+              +-------------------+
     |    biomarkers     |<-------------|   gene_biomarker  |
     +-------------------+ 1            +-------------------+
     | PK id             |              | PK id             |
     |    name           |              | FK gene_id        |
     |    type           |              | FK biomarker_id   |
     |    sample_type    |              |    relationship   |
     |    description    |              |    evidence       |
     |    standard_unit  |              |    pmid           |
     |    reference_range|              +-------------------+
     +-------------------+
\`\`\`

### 6.2 Table Field Specifications
1. **disorders**: \`id\` (BIGINT PK), \`name\` (VARCHAR UNIQUE), \`description\` (TEXT), \`category\` (VARCHAR), \`synonyms\` (VARCHAR), \`icd11_code\` (VARCHAR).
2. **genes**: \`id\` (BIGINT PK), \`symbol\` (VARCHAR UNIQUE), \`name\` (VARCHAR), \`ncbi_id\` (BIGINT UNIQUE), \`uniprot_id\` (VARCHAR), \`chromosome\` (VARCHAR), \`description\` (TEXT).
3. **biomarkers**: \`id\` (BIGINT PK), \`name\` (VARCHAR UNIQUE), \`type\` (VARCHAR), \`sample_type\` (VARCHAR), \`description\` (TEXT), \`standard_unit\` (VARCHAR), \`reference_range\` (VARCHAR).
4. **gene_disorder**: \`id\` (BIGINT PK), \`gene_id\` (FK), \`disorder_id\` (FK), \`evidence\` (TEXT), \`pmid\` (VARCHAR).
5. **gene_biomarker**: \`id\` (BIGINT PK), \`gene_id\` (FK), \`biomarker_id\` (FK), \`relationship\` (VARCHAR), \`evidence\` (TEXT), \`pmid\` (VARCHAR).
6. **disorder_biomarker**: \`id\` (BIGINT PK), \`disorder_id\` (FK), \`biomarker_id\` (FK), \`evidence\` (TEXT), \`pmid\` (VARCHAR).`
  },
  {
    number: 7,
    title: "Backend Code Explanation",
    subtitle: "Spring Boot Annotations, Patterns & Implementations",
    content: `### 7.1 Annotations Explained
- **\`@RestController\`**: Tells Spring Boot that this class provides REST API endpoints, automatically serializing returned Java objects into JSON.
- **\`@RequestMapping("/api/...")\`**: Specifies the base URI path routed to this controller.
- **\`@Entity\`**: Marks a Java POJO as a JPA persistent entity mapping to a relational database table.
- **\`@Table(name = "...")\`**: Declares the exact SQL table name associated with the entity.
- **\`@Id\` & \`@GeneratedValue\`**: Identifies the primary key and assigns auto-increment behavior.
- **\`@ManyToOne\` & \`@OneToMany\`**: Configures object relational cardinalities with lazy-loading and cascading behavior.
- **\`@Transactional(readOnly = true)\`**: Optimizes database transaction boundaries for query-heavy operations.
- **\`@CrossOrigin\`**: Permits Cross-Origin Resource Sharing from the frontend dev server.

### 7.2 Controller → Service → Repository Flow
When a user calls \`POST /api/analyze\`:
1. \`AnalysisController\` receives the JSON body, mapped to \`AnalysisRequest\` DTO.
2. \`AnalysisService.analyzeSample()\` queries \`GeneRepository\` and \`BiomarkerRepository\`.
3. If matches exist, it queries \`GeneDisorderRepository\` and \`GeneBiomarkerRepository\` to assemble the evidence graph.
4. It packages the response with the required medical safety disclaimer and returns an HTTP 200 OK.`
  },
  {
    number: 8,
    title: "Frontend Code Explanation",
    subtitle: "Component Architecture, Data Binding & Routing",
    content: `### 8.1 Modular Component Breakdown
- **Navbar**: Main navigation header enforcing the 3-zone contract, with active route indicators and quick global search access.
- **Dashboard**: High-level telemetry card metrics, quick search, featured biological spotlight pathways, and medical disclaimer.
- **Disorder Explorer**: Filterable multi-view interface (table vs. card grid) with category tabs and in-depth detail modals.
- **Gene Explorer**: Genomic catalog with real-time symbol/NCBI search and verified external resource links to NCBI Gene and UniProt.
- **Biomarker Explorer**: Biochemical directory with category filters (Hormones, Neuropeptides, Cytokines) and reference units.
- **Sample Result Analysis**: Interactive bioinformatics laboratory workstation allowing sample input, quick-load test presets, and printable reports.
- **Interactive Network Visualization**: SVG Canvas graph mapping multi-scale biological connections with interactive node inspection.
- **Academic Project Documentation**: Comprehensive chapter viewer and full Spring Boot/MySQL code repository explorer.

### 8.2 Safe Handling of Scientific URLs
External links to NCBI Gene (\`https://www.ncbi.nlm.nih.gov/gene/<id>\`) and UniProt (\`https://www.uniprot.org/uniprotkb/<id>\`) are only generated when genuine accession IDs exist, adhering strictly to research verification principles.`
  },
  {
    number: 9,
    title: "Sample Input",
    subtitle: "Example Demonstration Inputs",
    content: `### 9.1 Standard Test Case 1: Circadian Locus
\`\`\`json
{
  "sampleId": "SAMPLE001",
  "gene": "PER2",
  "biomarker": "Melatonin",
  "result": "Detected",
  "biomarkerValue": 35.0,
  "biomarkerUnit": "pg/mL"
}
\`\`\`

### 9.2 Standard Test Case 2: Autoimmune Narcolepsy
\`\`\`json
{
  "sampleId": "SAMPLE002",
  "gene": "HLA-DQB1",
  "biomarker": "Orexin-A (Hypocretin-1)",
  "result": "Variant Identified (*06:02)",
  "biomarkerValue": 45.0,
  "biomarkerUnit": "pg/mL"
}
\`\`\`

### 9.3 Standard Test Case 3: Negative Control
\`\`\`json
{
  "sampleId": "SAMPLE005",
  "gene": "UNKNOWN_GENE_99",
  "biomarker": "UNKNOWN_BIOMARKER_XYZ",
  "result": "Negative",
  "biomarkerValue": 0.0,
  "biomarkerUnit": "none"
}
\`\`\``
  },
  {
    number: 10,
    title: "Sample Output",
    subtitle: "Structured Bioinformatics Analysis Response",
    content: `### 10.1 Output for SAMPLE001 (PER2 + Melatonin)
\`\`\`json
{
  "sampleId": "SAMPLE001",
  "geneFound": true,
  "biomarkerFound": true,
  "matchedGeneSymbol": "PER2",
  "matchedBiomarkerName": "Melatonin",
  "associatedDisorders": [
    "Circadian Rhythm Sleep-Wake Disorder"
  ],
  "geneBiomarkerRelationship": "Circadian rhythm phase driver: PER2 feedback loops govern pineal melatonin synthesis and phase timing.",
  "supportingPmids": [
    "11239163",
    "10499924"
  ],
  "interpretation": "The entered gene and biomarker have documented research associations stored in the database.",
  "medicalDisclaimer": "SleepGeneMap is an educational bioinformatics exploration tool. The results are based on relationships stored in the application's research database and should not be used to diagnose, treat, or rule out a medical condition. Consult a qualified healthcare professional."
}
\`\`\`

### 10.2 Output for SAMPLE005 (Negative Control)
\`\`\`json
{
  "sampleId": "SAMPLE005",
  "geneFound": false,
  "biomarkerFound": false,
  "matchedGeneSymbol": null,
  "matchedBiomarkerName": null,
  "associatedDisorders": [],
  "geneBiomarkerRelationship": null,
  "supportingPmids": [],
  "interpretation": "No matching sleep-disorder association was found in the current SleepGeneMap database. This does not mean that the person does not have a sleep disorder.",
  "medicalDisclaimer": "SleepGeneMap is an educational bioinformatics exploration tool..."
}
\`\`\``
  },
  {
    number: 11,
    title: "Testing Matrix",
    subtitle: "Verification Test Cases & Acceptance Criteria",
    content: `### 11.1 Test Case Matrix
| Test # | Test Description | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Valid Known Gene Search | \`gene = "PER2"\` | Gene located; NCBI ID 8864; associated with Circadian Rhythm Disorder | **PASS** |
| **TC-02** | Invalid / Unknown Gene | \`gene = "FAKEGENE99"\` | Gene marked as not found; graceful validation message | **PASS** |
| **TC-03** | Valid Biomarker Search | \`biomarker = "Melatonin"\` | Biomarker located; hormone type; sample type Saliva/Serum displayed | **PASS** |
| **TC-04** | Valid Disorder Query | \`disorder = "Narcolepsy Type 1"\` | Complete clinical summary, HLA-DQB1 / HCRTR2 associations, CSF Orexin-A criteria | **PASS** |
| **TC-05** | Gene + Biomarker Dual Analysis | \`gene = "PER2", biomarker = "Melatonin"\` | Both found; direct phase driver relationship identified; PMIDs cited | **PASS** |
| **TC-06** | Empty Form Submission | \`gene = "", biomarker = ""\` | HTTP 400 Bad Request; validation message prompting at least one input | **PASS** |`
  },
  {
    number: 12,
    title: "Limitations",
    subtitle: "Research Constraints & Safety Scope",
    content: `### 12.1 Explicit System Limitations
1. **Curated Dataset Scope**: The initial starter database contains a focused set of ~7 sleep disorders, 22 genes, and 10 biomarkers. It is not an exhaustive encyclopedia of all human genetic loci.
2. **Dependence on Published Literature**: Associations represent reported statistical and functional findings in peer-reviewed journals and may be superseded by newer meta-analyses.
3. **Strict Non-Diagnostic Scope**: The system does not assess patient medical history, polysomnography raw EEG traces, or whole-genome sequencing files.
4. **Biomarker Variability**: Biomarker concentrations vary based on circadian time of collection, age, sex, assay methodology, and comorbidities.`
  },
  {
    number: 13,
    title: "Future Scope",
    subtitle: "Roadmap for Academic Expansion",
    content: `### 13.1 Planned Future Enhancements
1. **Automated NCBI / UniProt API Synchronization**: Nightly batch jobs to fetch updated ClinVar pathogenic variants and GWAS catalog associations.
2. **Polygenic Risk Score (PRS) Calculator**: Research-grade polygenic score aggregation for circadian chronotype predisposition.
3. **Whole-Exome Variant File (VCF) Parser**: Uploading anonymized VCF files to screen for known sleep-length variants (e.g. *BHLHE41* P384R).
4. **3D Molecular Visualization**: Embedding Three.js / Mol* viewers for 3D crystal structures of sleep receptors (e.g., Orexin receptor 2 PDB: 5WQC).
5. **Multi-Assay Longitudinal Tracking**: Graphing serial dim light melatonin onset curves over 24-hour collection windows.`
  },
  {
    number: 14,
    title: "Conclusion",
    subtitle: "Summary of Project Achievements",
    content: `### 14.1 Summary
The **SleepGeneMap** project successfully bridges the gap between molecular biology and clinical sleep science for bioinformatics students. By pairing an enterprise Java Spring Boot + JPA/Hibernate backend and relational MySQL schema with an intuitive, highly responsive frontend, the application enables structured exploration of complex biological networks.

Most importantly, the system establishes a gold-standard model for **ethical bioinformatics communication**: refusing to output reckless diagnostic pronouncements and instead presenting rigorous, citation-backed scientific associations with unambiguous educational disclaimers.`
  }
];
