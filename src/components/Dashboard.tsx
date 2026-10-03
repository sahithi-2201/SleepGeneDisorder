import React, { useState } from 'react';
import { 
  Brain, 
  Dna, 
  Activity, 
  Network, 
  ArrowRight, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  GitBranch, 
  BookOpen, 
  FileCheck2 
} from 'lucide-react';
import { DatabaseStatistics, Disorder, Gene, Biomarker, MEDICAL_DISCLAIMER_TEXT } from '../types/bioinformatics';
import { NavTab } from './Navbar';

interface DashboardProps {
  statistics: DatabaseStatistics;
  onNavigate: (tab: NavTab) => void;
  onQuickSearch: (query: string) => void;
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectGene: (gene: Gene) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  disorders: Disorder[];
  genes: Gene[];
  biomarkers: Biomarker[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  statistics,
  onNavigate,
  onQuickSearch,
  onSelectDisorder,
  onSelectGene,
  onSelectBiomarker,
  disorders,
  genes,
  biomarkers
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onQuickSearch(searchInput.trim());
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-teal-400 uppercase mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>3rd-Year Bioinformatics Mini Project</span>
            <span aria-hidden="true">·</span>
            <span>Web Technologies for Bioinformatics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            SleepGeneMap
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-teal-300 mb-4">
            Sleep Disorder Gene & Biomarker Explorer
          </p>
          <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">
            Explore biological relationships between sleep disorders, human genes, molecular biomarkers, and supporting peer-reviewed evidence using a structured bioinformatics database.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mb-6">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by gene (PER2, HCRTR2), biomarker (Melatonin, Cortisol), or disorder (Insomnia, Narcolepsy)..."
                className="w-full pl-12 pr-28 py-3.5 bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Direct CTA action row */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
            <span>Popular Queries:</span>
            {['PER2', 'Melatonin', 'HLA-DQB1', 'Orexin-A', 'Insomnia', 'Sleep Apnea'].map((term) => (
              <button
                key={term}
                onClick={() => onQuickSearch(term)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-md border border-slate-700/80 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Statistics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Database Catalog Statistics
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Relational MySQL / Spring Data JPA Schema
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Card 1: Disorders */}
          <div 
            onClick={() => onNavigate('disorders')}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-600">Disorders</span>
              <Brain className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {statistics.totalDisorders}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>ICSD-3 / ICD-11</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Genes */}
          <div 
            onClick={() => onNavigate('genes')}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 group-hover:text-teal-600">Genes</span>
              <Dna className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {statistics.totalGenes}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>NCBI & UniProt</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Biomarkers */}
          <div 
            onClick={() => onNavigate('biomarkers')}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 group-hover:text-amber-600">Biomarkers</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {statistics.totalBiomarkers}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Hormones & Indices</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Gene-Disorder Associations */}
          <div 
            onClick={() => onNavigate('network')}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 group-hover:text-emerald-600">Gene-Disorder</span>
              <GitBranch className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {statistics.geneDisorderAssociations}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Verified Links</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Gene-Biomarker Associations */}
          <div 
            onClick={() => onNavigate('network')}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-cyan-400 hover:shadow-xs transition-all cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 group-hover:text-cyan-600">Gene-Biomarker</span>
              <Network className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {statistics.geneBiomarkerAssociations}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Signaling Axes</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Feature Banner: Sample Result Analysis */}
      <section className="bg-gradient-to-r from-teal-50 via-teal-50/50 to-white border border-teal-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Interactive Student Laboratory Module</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sample Result Analysis & Molecular Matching
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Input sample IDs (e.g. <span className="font-mono text-teal-800 font-medium">SAMPLE001</span>), test genes, and biomarker metrics to cross-reference biological records, inspect shared disease associations, and generate a citation-backed bioinformatics report.
          </p>
        </div>
        <button
          onClick={() => onNavigate('analysis')}
          className="shrink-0 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all hover:shadow flex items-center gap-2"
        >
          <span>Launch Analysis Module</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Featured Biological Pathways & Spotlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Curated Biological Pathways
            </h2>
            <p className="text-xs text-slate-500">
              Key molecular axes represented across sleep medicine and chronobiology
            </p>
          </div>
          <button
            onClick={() => onNavigate('network')}
            className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
          >
            <span>View Full Network Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Spotlight 1: Circadian Core */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>PATHWAY 01</span>
                <span className="text-teal-700 font-semibold">Circadian TTFL</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">
                PER2 / CLOCK ↔ Melatonin
              </h3>
              <p className="text-xs text-slate-600 mb-3 line-clamp-3">
                Core transcription-translation feedback loop modulating pineal melatonin secretion and dim-light melatonin onset (DLMO) timing in advanced or delayed sleep phase syndrome.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">PMID: 11232563</span>
              <button 
                onClick={() => {
                  const d = disorders.find(item => item.id === 1);
                  if (d) onSelectDisorder(d);
                }}
                className="text-teal-700 font-medium hover:underline"
              >
                Inspect
              </button>
            </div>
          </div>

          {/* Spotlight 2: Narcolepsy Autoimmunity */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>PATHWAY 02</span>
                <span className="text-indigo-700 font-semibold">Hypocretin Axis</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">
                HLA-DQB1 ↔ Orexin-A
              </h3>
              <p className="text-xs text-slate-600 mb-3 line-clamp-3">
                Autoimmune degradation of lateral hypothalamic hypocretin/orexin neurons presenting via HLA-DQB1*06:02, resulting in undetectable CSF orexin levels and sudden cataplexy.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">PMID: 11179016</span>
              <button 
                onClick={() => {
                  const d = disorders.find(item => item.id === 2);
                  if (d) onSelectDisorder(d);
                }}
                className="text-teal-700 font-medium hover:underline"
              >
                Inspect
              </button>
            </div>
          </div>

          {/* Spotlight 3: Insomnia Hyperarousal */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>PATHWAY 03</span>
                <span className="text-amber-700 font-semibold">Stress & Serotonin</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">
                SLC6A4 / BDNF ↔ Cortisol
              </h3>
              <p className="text-xs text-slate-600 mb-3 line-clamp-3">
                Altered monoaminergic neurotransmission and hypothalamic-pituitary-adrenal (HPA) axis overdrive sustaining nocturnal hyperarousal and elevated evening cortisol in primary insomnia.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">PMID: 20337192</span>
              <button 
                onClick={() => {
                  const d = disorders.find(item => item.id === 3);
                  if (d) onSelectDisorder(d);
                }}
                className="text-teal-700 font-medium hover:underline"
              >
                Inspect
              </button>
            </div>
          </div>

          {/* Spotlight 4: Hypoxia & Cytokines */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>PATHWAY 04</span>
                <span className="text-rose-700 font-semibold">Hypoxic Cytokines</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">
                TNF / IL6 ↔ AHI
              </h3>
              <p className="text-xs text-slate-600 mb-3 line-clamp-3">
                Repetitive pharyngeal obstruction causing nocturnal desaturation cycles, driving systemic secretion of somnogenic cytokines (IL-6, TNF-α) proportional to the Apnea-Hypopnea Index.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">PMID: 22176251</span>
              <button 
                onClick={() => {
                  const d = disorders.find(item => item.id === 4);
                  if (d) onSelectDisorder(d);
                }}
                className="text-teal-700 font-medium hover:underline"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Data Curation & Evidence Integrity Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider font-mono mb-1">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <span>Academic Scientific Integrity & Verification</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Data Sources, Methodology & Evidence Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Strict bioinformatics curation: zero synthetic associations, verified PubMed PMIDs, official HGNC/NCBI gene loci, and an 8-stage data extraction protocol.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('datasources')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Data Sources & Methodology</span>
            </button>
            <a
              href="/api/audit/csv"
              download="evidence_audit.csv"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <span>Download evidence_audit.csv</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">1. Traceable Provenance</span>
            <p>Every relationship links to an official PubMed PMID, DOI, and evidence classification (GWAS, Functional, Clinical Study).</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">2. Non-Diagnostic Guardrails</span>
            <p>Non-diagnostic language: associations reflect curated research, not patient clinical diagnoses.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">3. Audited Production Dataset</span>
            <p>Seeded directly from <code className="font-mono text-teal-800">/database/data_verified.sql</code> with unverified loci eliminated.</p>
          </div>
        </div>
      </section>

      {/* Mandatory Medical Safety Disclaimer */}
      <section className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <span className="font-bold uppercase tracking-wider text-amber-900 block font-mono">
            Mandatory Bioinformatics Research Disclaimer
          </span>
          <p className="leading-relaxed">
            {MEDICAL_DISCLAIMER_TEXT}
          </p>
        </div>
      </section>
    </div>
  );
};
