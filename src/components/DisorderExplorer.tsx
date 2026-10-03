import React, { useState, useMemo } from 'react';
import { 
  Brain, 
  Search, 
  Dna, 
  Activity, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Disorder, DisorderCategory, Gene, Biomarker } from '../types/bioinformatics';

interface DisorderExplorerProps {
  disorders: Disorder[];
  genes?: Gene[];
  biomarkers?: Biomarker[];
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectGene: (gene: Gene) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
}

export const DisorderExplorer: React.FC<DisorderExplorerProps> = ({
  disorders,
  genes = [],
  biomarkers = [],
  onSelectDisorder,
  onSelectGene,
  onSelectBiomarker
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const categories = [
    'All',
    'Sleep-Wake Disorder',
    'Sleep-Related Breathing Disorder',
    'Movement Disorder',
    'Circadian Rhythm Sleep-Wake Disorder',
    'Parasomnia'
  ];

  const filteredDisorders = useMemo(() => {
    return disorders.filter(disorder => {
      const matchesCategory = selectedCategory === 'All' || disorder.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        disorder.name.toLowerCase().includes(q) ||
        disorder.description.toLowerCase().includes(q) ||
        disorder.synonyms.toLowerCase().includes(q) ||
        (disorder.icd11Code && disorder.icd11Code.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [disorders, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <span>Clinical Pathology Catalog</span>
            <span aria-hidden="true">·</span>
            <span>{disorders.length} Sleep Disorders Stored</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Sleep Disorders Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Explore sleep pathologies with their associated human genes, clinical biomarkers, and diagnostic literature.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card Grid</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search disorder name, synonyms, or ICD-11 code..."
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

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 pr-1 font-mono shrink-0">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Presentation */}
      {filteredDisorders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-2">
          <Brain className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-800 text-sm">No sleep disorders found</h3>
          <p className="text-xs text-slate-500">
            No disorder matched your search "{searchQuery}" under the category "{selectedCategory}".
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-2 px-3 py-1.5 text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Disorder & Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Associated Genes</th>
                  <th className="py-3 px-4 text-center">Biomarkers</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDisorders.map((disorder) => {
                  const geneSymbols = genes.filter(g => disorder.associatedGeneIds.includes(g.id));
                  const biomarkerItems = biomarkers.filter(b => disorder.associatedBiomarkerIds.includes(b.id));

                  return (
                    <tr 
                      key={disorder.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectDisorder(disorder)}
                    >
                      {/* Name & Synonyms */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {disorder.name}
                        </div>
                        {disorder.synonyms && (
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {disorder.synonyms}
                          </div>
                        )}
                        {disorder.icd11Code && (
                          <span className="font-mono text-[10px] text-slate-400">
                            ICD-11: {disorder.icd11Code}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        {disorder.category}
                      </td>

                      {/* Genes */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-mono font-bold text-teal-700">
                          <Dna className="w-3.5 h-3.5 text-teal-600" />
                          <span>{disorder.associatedGeneIds.length}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-[180px] mx-auto">
                          {geneSymbols.slice(0, 3).map(g => (
                            <span 
                              key={g.id} 
                              onClick={(e) => { e.stopPropagation(); onSelectGene(g); }}
                              className="text-[10px] font-mono text-slate-600 hover:text-teal-800 bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer"
                            >
                              {g.symbol}
                            </span>
                          ))}
                          {geneSymbols.length > 3 && (
                            <span className="text-[10px] text-slate-400">
                              +{geneSymbols.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Biomarkers */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-mono font-bold text-amber-700">
                          <Activity className="w-3.5 h-3.5 text-amber-600" />
                          <span>{disorder.associatedBiomarkerIds.length}</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-1 mt-1 max-w-[180px] mx-auto">
                          {biomarkerItems.slice(0, 2).map(b => (
                            <span 
                              key={b.id} 
                              onClick={(e) => { e.stopPropagation(); onSelectBiomarker(b); }}
                              className="text-[10px] text-slate-600 hover:text-amber-800 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[100px] cursor-pointer"
                              title={b.name}
                            >
                              {b.name}
                            </span>
                          ))}
                          {biomarkerItems.length > 2 && (
                            <span className="text-[10px] text-slate-400">
                              +{biomarkerItems.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectDisorder(disorder); }}
                          className="px-3 py-1 text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <span>Explore Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDisorders.map((disorder) => {
            const geneSymbols = genes.filter(g => disorder.associatedGeneIds.includes(g.id));
            const biomarkerItems = biomarkers.filter(b => disorder.associatedBiomarkerIds.includes(b.id));

            return (
              <div
                key={disorder.id}
                onClick={() => onSelectDisorder(disorder)}
                className="p-5 bg-white border border-slate-200 hover:border-teal-400 rounded-xl cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                    <span>{disorder.category}</span>
                    <span>{disorder.icd11Code || ''}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">
                    {disorder.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {disorder.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Dna className="w-3.5 h-3.5 text-teal-600" />
                      Associated Genes ({geneSymbols.length}):
                    </span>
                    <div className="flex gap-1 font-mono text-[11px] font-semibold text-teal-700">
                      {geneSymbols.slice(0, 3).map(g => g.symbol).join(', ')}
                      {geneSymbols.length > 3 ? '...' : ''}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-amber-600" />
                      Biomarkers ({biomarkerItems.length}):
                    </span>
                    <div className="flex gap-1 text-[11px] text-slate-700 truncate max-w-[150px]">
                      {biomarkerItems.slice(0, 2).map(b => b.name).join(', ')}
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <span className="text-teal-700 text-xs font-semibold group-hover:underline flex items-center gap-1">
                      View Clinical Profile <ChevronRight className="w-3 h-3" />
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
