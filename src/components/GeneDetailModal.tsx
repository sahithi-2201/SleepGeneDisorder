import React from 'react';
import { X, Dna, Brain, Activity, ExternalLink, ShieldAlert, Link as LinkIcon } from 'lucide-react';
import { Gene, Disorder, Biomarker } from '../types/bioinformatics';

interface GeneDetailModalProps {
  gene: Gene | null;
  onClose: () => void;
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  disorders?: Disorder[];
  biomarkers?: Biomarker[];
  relations?: {
    geneDisorders?: any[];
    geneBiomarkers?: any[];
    disorderBiomarkers?: any[];
  };
}

export const GeneDetailModal: React.FC<GeneDetailModalProps> = ({
  gene,
  onClose,
  onSelectDisorder,
  onSelectBiomarker,
  disorders = [],
  biomarkers = [],
  relations
}) => {
  if (!gene) return null;

  const associatedDisorders = disorders.filter(d => gene.associatedDisorderIds.includes(d.id));
  const associatedBiomarkers = biomarkers.filter(b => gene.associatedBiomarkerIds.includes(b.id));
  const geneDisorders = relations?.geneDisorders || [];
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
              <span>GENOMIC LOCUS</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-teal-700">Chr {gene.chromosome}</span>
              <span aria-hidden="true">·</span>
              <span>NCBI ID: {gene.ncbiId}</span>
              <span aria-hidden="true">·</span>
              <span>UniProt: {gene.uniprotId}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold font-mono text-teal-700">{gene.symbol}</h2>
              <span className="text-sm font-medium text-slate-600">{gene.name}</span>
            </div>
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
              Biological & Molecular Function
            </h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/70">
              {gene.description}
            </p>
          </div>

          {/* External Databases */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              Authoritative Biological Databases
            </h3>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={`https://www.ncbi.nlm.nih.gov/gene/${gene.ncbiId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
              >
                <span>NCBI Gene ({gene.ncbiId})</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              <a
                href={`https://www.uniprot.org/uniprotkb/${gene.uniprotId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
              >
                <span>UniProtKB ({gene.uniprotId})</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>

              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(gene.symbol + ' sleep')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-xs font-medium border border-teal-200 transition-colors"
              >
                <span>PubMed Sleep Studies</span>
                <ExternalLink className="w-3 h-3 text-teal-600" />
              </a>
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
                const relation = geneDisorders.find(
                  r => (r.geneId || r.gene_id) === gene.id && (r.disorderId || r.disorder_id) === disorder.id
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

          {/* Associated Biomarkers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              Associated Biomarkers & Pathways ({associatedBiomarkers.length})
            </h3>
            <div className="space-y-2">
              {associatedBiomarkers.map(biomarker => {
                const relation = geneBiomarkers.find(
                  r => (r.geneId || r.gene_id) === gene.id && (r.biomarkerId || r.biomarker_id) === biomarker.id
                );
                return (
                  <div
                    key={biomarker.id}
                    onClick={() => { onClose(); onSelectBiomarker(biomarker); }}
                    className="p-3 bg-white border border-slate-200 hover:border-amber-400 rounded-lg cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 group-hover:text-amber-800">
                        {biomarker.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Type: {biomarker.type}
                      </span>
                    </div>
                    {relation && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1.5 space-y-1">
                        <div>
                          <strong className="text-slate-800">Relationship:</strong> {relation.relationship}
                        </div>
                        <div className="italic text-slate-500">
                          {relation.evidence}
                        </div>
                        {relation.pmid && (
                          <span className="inline-block font-mono text-[11px] text-teal-700 not-italic">
                            PMID: {relation.pmid}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              Grounded in human molecular genetics. The presence of common variants or mutations does not guarantee phenotypic disease manifestation.
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
