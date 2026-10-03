import React, { useState, useMemo } from 'react';
import { 
  Dna, 
  Search, 
  Brain, 
  Activity, 
  ExternalLink, 
  ChevronRight, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { Gene, Disorder, Biomarker } from '../types/bioinformatics';

interface GeneExplorerProps {
  genes: Gene[];
  disorders?: Disorder[];
  biomarkers?: Biomarker[];
  onSelectGene: (gene: Gene) => void;
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
}

export const GeneExplorer: React.FC<GeneExplorerProps> = ({
  genes,
  disorders = [],
  biomarkers = [],
  onSelectGene,
  onSelectDisorder,
  onSelectBiomarker
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chromosomeFilter, setChromosomeFilter] = useState('All');

  // Chromosome list
  const chromosomes = useMemo(() => {
    const set = new Set<string>();
    genes.forEach(g => {
      const chrNumber = g.chromosome.split(/[pq]/)[0];
      if (chrNumber) set.add(chrNumber);
    });
    return ['All', ...Array.from(set).sort((a, b) => parseInt(a) - parseInt(b))];
  }, [genes]);

  const filteredGenes = useMemo(() => {
    return genes.filter(gene => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        gene.symbol.toLowerCase().includes(q) ||
        gene.name.toLowerCase().includes(q) ||
        gene.ncbiId.toString().includes(q) ||
        gene.uniprotId.toLowerCase().includes(q) ||
        gene.description.toLowerCase().includes(q);

      const chrNumber = gene.chromosome.split(/[pq]/)[0];
      const matchesChr = chromosomeFilter === 'All' || chrNumber === chromosomeFilter;

      return matchesSearch && matchesChr;
    });
  }, [genes, searchQuery, chromosomeFilter]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <span>Human Genomics Repository</span>
            <span aria-hidden="true">·</span>
            <span>{genes.length} Curated Sleep Genes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Gene Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Search sleep-related genetic loci by HGNC gene symbol, NCBI Gene ID, UniProt accession, or chromosomal region.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gene symbol (PER2, HCRTR2), NCBI ID (8864), UniProt ID, or function..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 self-center"
            >
              Clear
            </button>
          )}
        </div>

        {/* Chromosome Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 pr-1 font-mono shrink-0">
            <Layers className="w-3 h-3" />
            Chromosome:
          </span>
          {chromosomes.map((chr) => (
            <button
              key={chr}
              onClick={() => setChromosomeFilter(chr)}
              className={`px-2.5 py-1 rounded-md font-mono transition-colors whitespace-nowrap ${
                chromosomeFilter === chr
                  ? 'bg-teal-700 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {chr === 'All' ? 'All Chr' : `Chr ${chr}`}
            </button>
          ))}
        </div>
      </div>

      {/* Gene Grid */}
      {filteredGenes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-2">
          <Dna className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-sm">No genes found</h3>
          <p className="text-xs text-slate-500">
            No gene entry matches your current query "{searchQuery}".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setChromosomeFilter('All'); }}
            className="mt-2 px-3 py-1.5 text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGenes.map((gene) => {
            const associatedDisorders = disorders.filter(d => gene.associatedDisorderIds.includes(d.id));
            const associatedBiomarkers = biomarkers.filter(b => gene.associatedBiomarkerIds.includes(b.id));

            return (
              <div
                key={gene.id}
                onClick={() => onSelectGene(gene)}
                className="bg-white border border-slate-200 hover:border-teal-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  {/* Top line metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span className="font-semibold text-teal-700">Chr {gene.chromosome}</span>
                    <span>NCBI: {gene.ncbiId}</span>
                  </div>

                  {/* Gene Symbol & Name */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold font-mono text-teal-700 group-hover:text-teal-900 transition-colors">
                      {gene.symbol}
                    </h3>
                    <div className="text-xs font-medium text-slate-700 line-clamp-1">
                      {gene.name}
                    </div>
                  </div>

                  {/* Function summary */}
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {gene.description}
                  </p>
                </div>

                {/* Associations and links */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  {/* Associated Disorders */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-1 shrink-0">
                      <Brain className="w-3.5 h-3.5 text-indigo-600" />
                      Disorders:
                    </span>
                    <div className="text-right text-[11px] font-medium text-slate-800 line-clamp-1">
                      {associatedDisorders.map(d => d.name).join(', ') || 'Homeostatic'}
                    </div>
                  </div>

                  {/* Associated Biomarkers */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-1 shrink-0">
                      <Activity className="w-3.5 h-3.5 text-amber-600" />
                      Biomarkers:
                    </span>
                    <div className="text-right text-[11px] font-medium text-slate-800 line-clamp-1">
                      {associatedBiomarkers.map(b => b.name).join(', ') || 'Cellular'}
                    </div>
                  </div>

                  {/* External Resource Bar */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/gene/${gene.ncbiId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono rounded inline-flex items-center gap-0.5"
                        title="View on NCBI Gene"
                      >
                        NCBI
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>
                      <a
                        href={`https://www.uniprot.org/uniprotkb/${gene.uniprotId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono rounded inline-flex items-center gap-0.5"
                        title="View on UniProtKB"
                      >
                        UniProt
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>
                    </div>

                    <span className="text-teal-700 text-xs font-semibold group-hover:underline inline-flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
