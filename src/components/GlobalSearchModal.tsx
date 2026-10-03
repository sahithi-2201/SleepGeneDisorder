import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Brain, 
  Dna, 
  Activity, 
  BookOpen, 
  ChevronRight,
  ExternalLink 
} from 'lucide-react';
import { Disorder, Gene, Biomarker, ScientificReference } from '../types/bioinformatics';
import { api, GlobalSearchResult } from '../services/api';
import { SCIENTIFIC_REFERENCES } from '../data/bioData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectGene: (gene: Gene) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDisorder,
  onSelectGene,
  onSelectBiomarker,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GlobalSearchResult>({ disorders: [], genes: [], biomarkers: [] });
  const [matchedRefs, setMatchedRefs] = useState<ScientificReference[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults({ disorders: [], genes: [], biomarkers: [] });
      setMatchedRefs([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await api.search(trimmed);
      setResults(res);

      const q = trimmed.toLowerCase();
      const refs = SCIENTIFIC_REFERENCES.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.authors.toLowerCase().includes(q) ||
        r.pmid.includes(q) ||
        (r.doi && r.doi.toLowerCase().includes(q))
      );
      setMatchedRefs(refs);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Keyboard shortcut listener: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalHits = results.disorders.length + results.genes.length + results.biomarkers.length + matchedRefs.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all sleep disorders, genes, biomarkers, PMIDs..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5 text-sm">
          {!query.trim() ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <p className="text-xs">Type a keyword, gene symbol (e.g. <code>PER2</code>, <code>HCRTR2</code>), biomarker (e.g. <code>Melatonin</code>), or sleep disorder.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2 text-xs">
                {['Insomnia', 'Narcolepsy', 'PER2', 'Melatonin', 'HLA-DQB1', 'Cortisol'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-mono"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-400">
              Querying bioinformatics index...
            </div>
          ) : totalHits === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">No results found for "{query}"</p>
              <p className="text-xs text-slate-400">Try searching official gene symbols (e.g. PER2, CLOCK) or standard disease names.</p>
            </div>
          ) : (
            <>
              {/* Disorders Section */}
              {results.disorders.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    <Brain className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sleep Disorders ({results.disorders.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.disorders.map(d => (
                      <div
                        key={d.id}
                        onClick={() => { onClose(); onSelectDisorder(d); }}
                        className="p-2.5 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-800 text-xs sm:text-sm">
                            {d.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {d.category} {d.icd11Code ? `· ICD-11: ${d.icd11Code}` : ''}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Genes Section */}
              {results.genes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    <Dna className="w-3.5 h-3.5 text-teal-600" />
                    <span>Genes ({results.genes.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.genes.map(g => (
                      <div
                        key={g.id}
                        onClick={() => { onClose(); onSelectGene(g); }}
                        className="p-2.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-teal-700 font-mono text-xs sm:text-sm">
                            {g.symbol} – <span className="font-sans font-medium text-slate-800">{g.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            NCBI: {g.ncbiId} · Chr {g.chromosome} · UniProt: {g.uniprotId}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Biomarkers Section */}
              {results.biomarkers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    <span>Biomarkers ({results.biomarkers.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.biomarkers.map(b => (
                      <div
                        key={b.id}
                        onClick={() => { onClose(); onSelectBiomarker(b); }}
                        className="p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 hover:border-amber-300 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-amber-800 text-xs sm:text-sm">
                            {b.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Type: {b.type} · Matrix: {b.sampleType}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References Section */}
              {matchedRefs.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Scientific Citations ({matchedRefs.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedRefs.map(r => (
                      <div
                        key={r.id}
                        className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1"
                      >
                        <div className="font-medium text-slate-900">{r.title}</div>
                        <div className="text-[11px] text-slate-500">{r.authors} ({r.year})</div>
                        <div className="flex items-center gap-2 pt-0.5 font-mono text-[10px]">
                          <span>PMID: {r.pmid}</span>
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-700 hover:underline inline-flex items-center gap-0.5"
                          >
                            PubMed <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Search scope: MySQL sleepgenemap catalog</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
