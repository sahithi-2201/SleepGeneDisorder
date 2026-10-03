import React, { useState, useEffect } from 'react';
import { 
  Database, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Filter, 
  Search, 
  ShieldCheck, 
  FileText, 
  Dna, 
  Activity, 
  ArrowRight,
  GitBranch,
  Layers,
  HelpCircle
} from 'lucide-react';
import { DatabaseStatistics, EvidenceAuditRecord } from '../types/bioinformatics';
import { api } from '../services/api';

interface DataSourcesAndEvidenceProps {
  statistics?: DatabaseStatistics;
}

export const DataSourcesAndEvidence: React.FC<DataSourcesAndEvidenceProps> = ({ statistics }) => {
  const [activeSubTab, setActiveSubTab] = useState<'sources' | 'methodology' | 'audit' | 'limitations' | 'protocol'>('sources');
  const [auditRecords, setAuditRecords] = useState<EvidenceAuditRecord[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loadingAudit, setLoadingAudit] = useState(true);

  // Filters for Audit Table
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Load live audit records and markdown protocol from backend
    api.getEvidenceAudit().then(data => {
      setAuditRecords(data || []);
      setLoadingAudit(false);
    }).catch(() => setLoadingAudit(false));

    api.getDataSourcesMarkdown().then(text => {
      setMarkdownContent(text || '');
    }).catch(() => {});
  }, []);

  const filteredAuditRecords = auditRecords.filter(r => {
    if (statusFilter !== 'All' && r.evidenceStatus !== statusFilter) return false;
    if (typeFilter !== 'All' && r.relationshipType !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        r.gene.toLowerCase().includes(q) ||
        r.disorder.toLowerCase().includes(q) ||
        r.biomarker.toLowerCase().includes(q) ||
        r.pmid.includes(q) ||
        r.paperTitle.toLowerCase().includes(q) ||
        r.verificationNotes.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const verifiedCount = auditRecords.filter(r => r.evidenceStatus === 'VERIFIED').length;
  const removedCount = auditRecords.filter(r => r.evidenceStatus === 'REMOVED' || r.evidenceStatus === 'INCORRECT').length;
  const partialCount = auditRecords.filter(r => r.evidenceStatus === 'PARTIALLY_SUPPORTED').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-700 font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Academic Curation Protocol & Evidence Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Data Sources & Scientific Evidence
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            SleepGeneMap enforces a strict scientific curation protocol: <strong>no synthetic data, no speculative assumptions, no fabricated identifiers, and 100% traceable PubMed/NCBI provenance</strong>.
          </p>
        </div>

        {/* Download CSV / Protocol */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="/api/audit/csv"
            download="evidence_audit.csv"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>evidence_audit.csv</span>
          </a>
        </div>
      </div>

      {/* Dataset Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Sleep Disorders</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{statistics?.totalDisorders || 7}</span>
          <span className="text-[10px] text-teal-700 font-mono">ICD-11 Aligned</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Curated Genes</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{statistics?.totalGenes || 18}</span>
          <span className="text-[10px] text-teal-700 font-mono">NCBI / UniProt</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Biomarkers</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{statistics?.totalBiomarkers || 9}</span>
          <span className="text-[10px] text-teal-700 font-mono">Real Benchmarks</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Gene-Disorder</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{statistics?.geneDisorderAssociations || 18}</span>
          <span className="text-[10px] text-emerald-600 font-mono">100% Verified</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Gene-Biomarker</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{statistics?.geneBiomarkerAssociations || 9}</span>
          <span className="text-[10px] text-emerald-600 font-mono">Functional Axes</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Disorder-Biomarker</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{statistics?.disorderBiomarkerAssociations || 8}</span>
          <span className="text-[10px] text-emerald-600 font-mono">Clinical Evidence</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-center">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Verified PMIDs</span>
          <span className="text-xl font-bold text-slate-900 mt-0.5 block">{statistics?.totalReferences || 24}</span>
          <span className="text-[10px] text-teal-700 font-mono">Primary Literature</span>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('sources')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'sources'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Curated Sources & Databases</span>
        </button>

        <button
          onClick={() => setActiveSubTab('methodology')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'methodology'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Data Curation Methodology (8 Steps)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'audit'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence Audit Explorer ({auditRecords.length} records)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('limitations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'limitations'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Data Scope & Academic Boundaries</span>
        </button>

        <button
          onClick={() => setActiveSubTab('protocol')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'protocol'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>DATA_SOURCES.md Protocol</span>
        </button>
      </div>

      {/* SUBTAB 1: CURATED SOURCES (Requirement 18) */}
      {activeSubTab === 'sources' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Publicly Available Authoritative Biomedical Data Sources
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              In accordance with academic standards for bioinformatics, SleepGeneMap does not use synthetic records, blog posts, or unverifiable secondary sources. All entities and associations are anchored in official identifiers from international biomedical repositories:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source 1: PubMed */}
              <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      PM
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">PubMed / MEDLINE</h3>
                      <span className="text-[11px] text-slate-500">National Library of Medicine (NIH)</span>
                    </div>
                  </div>
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-700 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Purpose:</strong> Primary literature verification and bibliographic indexing of peer-reviewed biomedical evidence.
                  </div>
                  <div>
                    <strong className="text-slate-800">Identifiers Used:</strong> PubMed Unique Identifier (PMID), Digital Object Identifier (DOI).
                  </div>
                  <div>
                    <strong className="text-slate-800">How Information Was Incorporated:</strong> Every biological association (Gene-Disorder, Gene-Biomarker, Disorder-Biomarker) has been verified against the actual title, abstract, and findings of the cited PMID. Incorrect or mismatched PMIDs from starter scripts were audited and replaced.
                  </div>
                </div>
              </div>

              {/* Source 2: NCBI Gene */}
              <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      NCBI
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">NCBI Gene</h3>
                      <span className="text-[11px] text-slate-500">National Center for Biotechnology Information</span>
                    </div>
                  </div>
                  <a
                    href="https://www.ncbi.nlm.nih.gov/gene"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-700 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Purpose:</strong> Authoritative human gene nomenclature, genomic coordinates, and locus summaries.
                  </div>
                  <div>
                    <strong className="text-slate-800">Identifiers Used:</strong> Official HGNC Gene Symbol, NCBI Entrez Gene ID (e.g., PER2: 8864, HLA-DQB1: 3119).
                  </div>
                  <div>
                    <strong className="text-slate-800">How Information Was Incorporated:</strong> Canonical chromosome locations (e.g., 2q37.3, 6p21.32) and official gene names were retrieved to ensure no pseudogenes or fabricated symbols exist in the catalog.
                  </div>
                </div>
              </div>

              {/* Source 3: UniProtKB */}
              <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                      UP
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">UniProtKB</h3>
                      <span className="text-[11px] text-slate-500">EMBL-EBI / SIB / PIR</span>
                    </div>
                  </div>
                  <a
                    href="https://www.uniprot.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-700 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Purpose:</strong> Protein sequence accessions, molecular functional annotations, and post-translational modification sites.
                  </div>
                  <div>
                    <strong className="text-slate-800">Identifiers Used:</strong> UniProt Accession Number (e.g., O15055, P01920, O43612).
                  </div>
                  <div>
                    <strong className="text-slate-800">How Information Was Incorporated:</strong> Used to confirm protein products, cellular localization, and functional consequences of missense mutations (such as Ser662Gly in PER2 and P385R in DEC2/BHLHE41).
                  </div>
                </div>
              </div>

              {/* Source 4: GWAS Catalog */}
              <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      GW
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">NHGRI-EBI GWAS Catalog</h3>
                      <span className="text-[11px] text-slate-500">National Human Genome Research Institute</span>
                    </div>
                  </div>
                  <a
                    href="https://www.ebi.ac.uk/gwas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Purpose:</strong> Validated genome-wide statistical associations for polygenic sleep disorders and traits.
                  </div>
                  <div>
                    <strong className="text-slate-800">Identifiers Used:</strong> dbSNP rsID (e.g., rs2300478 for MEIS1, rs9296265 for BTBD9).
                  </div>
                  <div>
                    <strong className="text-slate-800">How Information Was Incorporated:</strong> Applied to distinguish unbiased genome-wide significant associations (p &lt; 5×10⁻⁸) from candidate-gene claims, ensuring that only robustly replicated variants are cataloged.
                  </div>
                </div>
              </div>
            </div>

            {/* Supplementary Source: ICSD-3 & ICD-11 */}
            <div className="mt-4 p-4 bg-teal-50/50 border border-teal-200 rounded-xl flex items-start gap-3 text-xs text-slate-700">
              <BookOpen className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Clinical Diagnostic Standards (ICSD-3 / ICD-11):</strong>
                <p className="mt-1 text-slate-600">
                  Sleep disorder classifications and diagnostic thresholds (e.g., CSF Orexin-A &le; 110 pg/mL for Narcolepsy Type 1; AHI &ge; 15 for Obstructive Sleep Apnea) follow the American Academy of Sleep Medicine (AASM) <em>International Classification of Sleep Disorders (ICSD-3)</em> and the World Health Organization <em>ICD-11 Chapter 07 (Sleep-Wake Disorders)</em>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DATA CURATION METHODOLOGY (Requirement 19) */}
      {activeSubTab === 'methodology' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Data Curation Methodology (8-Step Academic Pipeline)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                To guarantee scientific validity for academic evaluation, every record in SleepGeneMap is processed through the following eight-stage curation protocol:
              </p>
            </div>

            {/* Visual 8-Step Pipeline */}
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: 'Identify Sleep Disorder',
                  desc: 'Classify disorder under official ICSD-3 / ICD-11 categories (Circadian, Hypersomnolence, Insomnia, Breathing, Movement, Parasomnia) and map to international ICD-11 codes.',
                  tag: 'ICD-11 / ICSD-3'
                },
                {
                  step: 2,
                  title: 'Search Authoritative Databases & Literature',
                  desc: 'Formulate structured Boolean queries in PubMed and NCBI Entrez: ("Gene"[Gene] OR "NCBI ID") AND ("Disorder" OR "Synonym") AND ("polymorphism" OR "mutation" OR "GWAS").',
                  tag: 'PubMed / Entrez'
                },
                {
                  step: 3,
                  title: 'Identify Associated Gene / Biomarker Locus',
                  desc: 'Extract reported candidate loci or biological markers that were directly tested in case-control cohorts, Mendelian pedigrees, or clinical sleep laboratories.',
                  tag: 'Candidate Extraction'
                },
                {
                  step: 4,
                  title: 'Retrieve Authoritative Source Identifiers',
                  desc: 'Obtain real, verifiable identifiers: official HGNC gene symbol, NCBI Gene ID, UniProtKB accession number, PubMed PMID, and publisher DOI.',
                  tag: 'Identifier Verification'
                },
                {
                  step: 5,
                  title: 'Verify Scientific Evidence & Replicate',
                  desc: 'Confirm the manuscript actually demonstrates the claimed association. Eliminate speculative inferences (e.g., do not infer that a gene controls a biomarker just because both relate to sleep).',
                  tag: 'Negative Filtration'
                },
                {
                  step: 6,
                  title: 'Record Structured Biological Relationship',
                  desc: 'Document the relationship in the schema with concise functional mechanisms (e.g., "Ser662Gly accelerates CK1 phosphorylation in FASPS").',
                  tag: 'Database Staging'
                },
                {
                  step: 7,
                  title: 'Add Provenance & Evidence Classification',
                  desc: 'Classify evidence type (GWAS, Genetic Association Study, Functional / Family Study, Clinical Diagnostic Study, Meta-Analysis) and tag source database (PubMed).',
                  tag: 'Evidence Tagging'
                },
                {
                  step: 8,
                  title: 'Include Only Verified Relationships in Production SQL',
                  desc: 'Audit each record into evidence_audit.csv with VERIFIED status. Exclude unverified or non-replicated records from database/data_verified.sql.',
                  tag: 'Production Ingestion'
                }
              ].map(item => (
                <div 
                  key={item.step} 
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                      <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Evaluation Callout */}
            <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1.5">
              <span className="font-bold text-indigo-950 block">Academic Integrity Statement:</span>
              <p>
                In bioinformatics research and educational software, scientific traceability is paramount. Synthetic associations degrade predictive accuracy and undermine research value. By enforcing steps 1 through 8, SleepGeneMap guarantees that every edge in its network graph is traceable to a real peer-reviewed publication.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: EVIDENCE AUDIT EXPLORER (Requirement 5) */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Comprehensive Evidence Audit Table (<code className="font-mono text-xs">evidence_audit.csv</code>)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete ledger of audited records. Shows status, corrected PMIDs, verified biological relationships, and reasons for removal.
                </p>
              </div>

              {/* Status summary badges */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                  {verifiedCount} Verified
                </span>
                <span className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                  {partialCount} Partial
                </span>
                <span className="px-2 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded">
                  {removedCount} Removed
                </span>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by gene, disorder, biomarker, PMID, or notes..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="All">All Statuses ({auditRecords.length})</option>
                  <option value="VERIFIED">VERIFIED ({verifiedCount})</option>
                  <option value="PARTIALLY_SUPPORTED">PARTIALLY_SUPPORTED ({partialCount})</option>
                  <option value="REMOVED">REMOVED ({auditRecords.filter(r => r.evidenceStatus === 'REMOVED').length})</option>
                  <option value="UNVERIFIED">UNVERIFIED ({auditRecords.filter(r => r.evidenceStatus === 'UNVERIFIED').length})</option>
                </select>
              </div>

              {/* Relationship Type Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="gene-disorder">Gene-Disorder</option>
                  <option value="gene-biomarker">Gene-Biomarker</option>
                  <option value="disorder-biomarker">Disorder-Biomarker</option>
                </select>
              </div>
            </div>

            {/* Interactive Audit Table */}
            {loadingAudit ? (
              <div className="p-12 text-center text-slate-400 font-mono text-xs">
                Loading evidence audit records...
              </div>
            ) : filteredAuditRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No audit records matched your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Entities</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">PMID & Paper Title</th>
                      <th className="py-2.5 px-3">Source</th>
                      <th className="py-2.5 px-3 min-w-[280px]">Verification & Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditRecords.map((r, idx) => {
                      let statusBadge = (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          {r.evidenceStatus}
                        </span>
                      );
                      if (r.evidenceStatus === 'VERIFIED') {
                        statusBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            VERIFIED
                          </span>
                        );
                      } else if (r.evidenceStatus === 'PARTIALLY_SUPPORTED') {
                        statusBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-max">
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                            PARTIAL
                          </span>
                        );
                      } else if (r.evidenceStatus === 'REMOVED' || r.evidenceStatus === 'INCORRECT') {
                        statusBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1 w-max">
                            <XCircle className="w-2.5 h-2.5 text-rose-600" />
                            REMOVED
                          </span>
                        );
                      }

                      return (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            {r.relationshipType}
                          </td>

                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {r.gene && <span className="font-mono text-teal-700 font-bold mr-1">{r.gene}</span>}
                            {r.disorder && <span className="text-slate-800 mr-1">↔ {r.disorder}</span>}
                            {r.biomarker && <span className="text-amber-800 font-medium">↔ {r.biomarker}</span>}
                          </td>

                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {statusBadge}
                          </td>

                          <td className="py-2.5 px-3 max-w-[260px]">
                            {r.pmid ? (
                              <a
                                href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-teal-700 hover:text-teal-900 font-bold inline-flex items-center gap-1 hover:underline"
                              >
                                <span>PMID: {r.pmid}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-slate-400 font-mono text-[11px]">N/A</span>
                            )}
                            <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5" title={r.paperTitle}>
                              {r.paperTitle}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                            {r.source}
                          </td>

                          <td className="py-2.5 px-3 text-[11px] text-slate-600 leading-relaxed">
                            {r.verificationNotes}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: DATA SCOPE & ACADEMIC BOUNDARIES (Requirement 22 & 11) */}
      {activeSubTab === 'limitations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Data Scope, Scientific Boundaries & Non-Diagnostic Model
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                SleepGeneMap strictly separates biological evidence exploration from clinical diagnosis. The following parameters govern application behavior:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Boundary 1: No Diagnostic Claims */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-teal-800">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Non-Diagnostic Language Policy
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The application <strong>NEVER</strong> outputs: <em>"This person has a sleep disorder."</em>
                </p>
                <p className="text-xs text-slate-700 bg-teal-50 p-2.5 rounded border border-teal-200 font-mono">
                  Standard Phrasing: "The entered gene/biomarker has an association with this sleep disorder in the curated research database."
                </p>
              </div>

              {/* Boundary 2: No 100% Completeness Claim */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-indigo-800">
                  <Database className="w-4 h-4 text-indigo-600" />
                  Curated Research Scope (No Claim of Completeness)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  SleepGeneMap does not index the entire human genome or every sleep study ever published. It represents a <strong>rigorously curated collection of validated associations</strong> with full literature provenance.
                </p>
              </div>

              {/* Boundary 3: No Fabricated Patient Values */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-amber-800">
                  <Activity className="w-4 h-4 text-amber-600" />
                  No Fabricated Patient Measurements
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The database contains published physiological benchmarks and laboratory thresholds (e.g., CSF Orexin-A &le; 110 pg/mL), never fabricated patient records or invented clinical numbers.
                </p>
              </div>

              {/* Boundary 4: Demo Sample Separation */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-slate-800">
                  <Layers className="w-4 h-4 text-slate-600" />
                  Three-Tier Data Separation
                </h3>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li><strong>Curated Scientific Data:</strong> Ground truth in relational database.</li>
                  <li><strong>Demo/Sample Input:</strong> Explicitly marked <em>"Demo Sample — Not Clinical Data"</em>.</li>
                  <li><strong>Application-Generated Results:</strong> Database query matches, strictly non-diagnostic.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: DATA_SOURCES.md VIEWER (Requirement 20) */}
      {activeSubTab === 'protocol' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Official Dataset Protocol (<code className="font-mono text-xs">database/DATA_SOURCES.md</code>)
              </h2>
              <p className="text-xs text-slate-500">
                Direct view of the inclusion/exclusion criteria, search strategies, and audit results stored in the repository.
              </p>
            </div>
            <a
              href="/api/data-sources-markdown"
              download="DATA_SOURCES.md"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MD</span>
            </a>
          </div>

          <pre className="p-5 bg-slate-950 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto max-h-[600px] leading-relaxed">
            <code>{markdownContent || '# Loading DATA_SOURCES.md...'}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
