import React from 'react';
import { X, Activity, Dna, Brain, ShieldAlert, BookOpen, ExternalLink } from 'lucide-react';
import { Biomarker, Disorder, Gene, ScientificReference } from '../types/bioinformatics';

interface BiomarkerDetailModalProps {
  biomarker: Biomarker | null;
  onClose: () => void;
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectGene: (gene: Gene) => void;
  disorders?: Disorder[];
  genes?: Gene[];
  references?: ScientificReference[];
  relations?: {
    geneDisorders?: any[];
    disorderBiomarkers?: any[];
    geneBiomarkers?: any[];
  };
}

export const BiomarkerDetailModal: React.FC<BiomarkerDetailModalProps> = ({
  biomarker,
  onClose,
  onSelectDisorder,
  onSelectGene,
  disorders = [],
  genes = [],
  references = [],
  relations
}) => {
  if (!biomarker) return null;

  const associatedDisorders = disorders.filter(d => biomarker.associatedDisorderIds.includes(d.id));
  const associatedGenes = genes.filter(g => biomarker.associatedGeneIds.includes(g.id));
  const biomarkerRefs = references.filter(r => biomarker.referenceIds.includes(r.id));
  const disorderBiomarkers = relations?.disorderBiomarkers || [];
  const geneBiomarkers = relations?.geneBiomarkers || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
              <span>BIOMARKER #{biomarker.id}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-amber-700">{biomarker.type}</span>
              <span aria-hidden="true">·</span>
              <span>Sample: {biomarker.sampleType}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{biomarker.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Functional Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Biological Significance & Clinical Role
            </h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/70">
              {biomarker.description}
            </p>
          </div>

          {/* Reference Interval / Standard Units */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-400 uppercase font-mono block">Standard Measurement Unit</span>
              <span className="text-lg font-mono font-bold text-slate-900">{biomarker.standardUnit}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-xs text-slate-400 uppercase font-mono block">Reference / Threshold Benchmark</span>
              <span className="text-xs font-mono font-medium text-slate-700 block mt-1">
                {biomarker.referenceRange || 'Assay-dependent threshold'}
              </span>
            </div>
          </div>

          {/* Associated Sleep Disorders */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              Associated Sleep Disorders ({associatedDisorders.length})
            </h3>
            <div className="space-y-2">
              {associatedDisorders.map(disorder => {
                const relation = disorderBiomarkers.find(
                  r => (r.disorderId || r.disorder_id) === disorder.id && (r.biomarkerId || r.biomarker_id) === biomarker.id
                );
                return (
                  <div
                    key={disorder.id}
                    onClick={() => { onClose(); onSelectDisorder(disorder); }}
                    className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-lg cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-700">
                        {disorder.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {disorder.category}
                      </span>
                    </div>
                    {relation && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 mt-1.5">
                        {relation.evidence}
                        {relation.pmid && (
                          <span className="block mt-1 font-mono text-[11px] text-teal-700 not-italic">
                            Evidence PMID: {relation.pmid}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Associated Genes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5 text-teal-600" />
              Connected Genes ({associatedGenes.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {associatedGenes.map(gene => {
                const relation = geneBiomarkers.find(
                  r => (r.geneId || r.gene_id) === gene.id && (r.biomarkerId || r.biomarker_id) === biomarker.id
                );
                return (
                  <div
                    key={gene.id}
                    onClick={() => { onClose(); onSelectGene(gene); }}
                    className="p-3 bg-white border border-slate-200 hover:border-teal-400 rounded-lg cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-teal-700 font-mono group-hover:text-teal-900">
                        {gene.symbol}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Chr {gene.chromosome}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-1 mb-1">
                      {gene.name}
                    </div>
                    {relation && (
                      <div className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100">
                        <span className="font-medium text-slate-700">{relation.relationship}:</span> {relation.evidence}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Literature References */}
          {biomarkerRefs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                Scientific References
              </h3>
              <div className="space-y-2">
                {biomarkerRefs.map(ref => (
                  <div key={ref.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="font-medium text-slate-900">{ref.title}</div>
                    <div className="text-slate-500">{ref.authors} ({ref.year})</div>
                    <div className="flex items-center gap-3 pt-0.5">
                      <span className="font-mono text-slate-600">PMID: {ref.pmid}</span>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 hover:underline"
                      >
                        <span>PubMed</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Disclaimer */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Educational Caution:</strong> Laboratory biomarker measurements fluctuate with circadian timing, posture, collection matrix, and non-sleep medical variables. Do not interpret for personal clinical diagnosis.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
