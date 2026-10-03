import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Brain, 
  Dna, 
  Filter, 
  ChevronRight, 
  Layers 
} from 'lucide-react';
import { Biomarker, BiomarkerType, Disorder, Gene } from '../types/bioinformatics';

interface BiomarkerExplorerProps {
  biomarkers: Biomarker[];
  disorders?: Disorder[];
  genes?: Gene[];
  onSelectBiomarker: (biomarker: Biomarker) => void;
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectGene: (gene: Gene) => void;
}

export const BiomarkerExplorer: React.FC<BiomarkerExplorerProps> = ({
  biomarkers,
  disorders = [],
  genes = [],
  onSelectBiomarker,
  onSelectDisorder,
  onSelectGene
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const biomarkerTypes = [
    'All',
    'Hormone',
    'Neuropeptide',
    'Cytokine',
    'Purine Nucleoside',
    'Protein',
    'Neurotransmitter',
    'Physiological Index'
  ];

  const filteredBiomarkers = useMemo(() => {
    return biomarkers.filter(b => {
      const matchesType = selectedType === 'All' || b.type === selectedType;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        b.name.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q) ||
        b.sampleType.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [biomarkers, selectedType, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <span>Biochemical & Physiological Profiling</span>
            <span aria-hidden="true">·</span>
            <span>{biomarkers.length} Validated Sleep Biomarkers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Biomarker Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Explore endocrine hormones, neurochemical peptides, inflammatory cytokines, and sleep study physiological indices.
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
              placeholder="Search biomarker (Melatonin, Orexin, Cortisol, IL-6), matrix (CSF, Saliva)..."
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

        {/* Biomarker Type Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 pr-1 font-mono shrink-0">
            <Filter className="w-3 h-3" />
            Type:
          </span>
          {biomarkerTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedType === type
                  ? 'bg-amber-700 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Biomarkers */}
      {filteredBiomarkers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-2">
          <Activity className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-sm">No biomarkers found</h3>
          <p className="text-xs text-slate-500">
            No biomarker entry matches your current query "{searchQuery}".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedType('All'); }}
            className="mt-2 px-3 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBiomarkers.map((biomarker) => {
            const associatedDisorders = disorders.filter(d => biomarker.associatedDisorderIds.includes(d.id));
            const associatedGenes = genes.filter(g => biomarker.associatedGeneIds.includes(g.id));

            return (
              <div
                key={biomarker.id}
                onClick={() => onSelectBiomarker(biomarker)}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-5 cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span className="font-semibold text-amber-700">{biomarker.type}</span>
                    <span className="truncate max-w-[150px]">{biomarker.sampleType}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors mb-1.5">
                    {biomarker.name}
                  </h3>

                  <div className="text-xs text-slate-500 font-mono mb-2">
                    Unit: <span className="font-bold text-slate-700">{biomarker.standardUnit}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {biomarker.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-1 shrink-0">
                      <Brain className="w-3.5 h-3.5 text-indigo-600" />
                      Disorders:
                    </span>
                    <div className="text-right text-[11px] font-medium text-slate-800 line-clamp-1">
                      {associatedDisorders.map(d => d.name).join(', ') || 'Physiological'}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-1 shrink-0">
                      <Dna className="w-3.5 h-3.5 text-teal-600" />
                      Genes:
                    </span>
                    <div className="text-right text-[11px] font-mono font-medium text-teal-700 line-clamp-1">
                      {associatedGenes.map(g => g.symbol).join(', ') || 'Multigenic'}
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <span className="text-amber-700 text-xs font-semibold group-hover:underline inline-flex items-center gap-0.5">
                      Explore Profile <ChevronRight className="w-3.5 h-3.5" />
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
