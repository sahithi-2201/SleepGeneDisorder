import React from 'react';
import { X, Dna, Activity, BookOpen, ExternalLink, ShieldAlert } from 'lucide-react';
import { Disorder, Gene, Biomarker, ScientificReference } from '../types/bioinformatics';
import { GENES, BIOMARKERS, SCIENTIFIC_REFERENCES, GENE_DISORDER_RELATIONS, DISORDER_BIOMARKER_RELATIONS } from '../data/bioData';

interface DisorderDetailModalProps {
  disorder: Disorder | null;
  onClose: () => void;
  onSelectGene: (gene: Gene) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
}

export const DisorderDetailModal: React.FC<DisorderDetailModalProps> = ({
  disorder,
  onClose,
  onSelectGene,
  onSelectBiomarker
}) => {
  if (!disorder) return null;

  const associatedGenes = GENES.filter(g => disorder.associatedGeneIds.includes(g.id));
  const associatedBiomarkers = BIOMARKERS.filter(b => disorder.associatedBiomarkerIds.includes(b.id));
  const references = SCIENTIFIC_REFERENCES.filter(r => disorder.referenceIds.includes(r.id));

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
              <span>DISORDER RECORD #{disorder.id}</span>
              <span aria-hidden="true">·</span>
              <span>ICD-11: {disorder.icd11Code || 'Unassigned'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700 font-semibold">{disorder.category}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{disorder.name}</h2>
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
          {/* Clinical Overview */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Clinical & Phenotypic Description
            </h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/70">
              {disorder.description}
            </p>
            {disorder.synonyms && (
              <div className="mt-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Synonyms / Clinical Classifications:</span> {disorder.synonyms}
              </div>
            )}
          </div>

          {/* Associated Genes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-teal-600" />
                Associated Genes ({associatedGenes.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {associatedGenes.map(gene => {
                const relation = GENE_DISORDER_RELATIONS.find(
                  r => r.geneId === gene.id && r.disorderId === disorder.id
                );
                return (
                  <div 
                    key={gene.id}
                    onClick={() => { onClose(); onSelectGene(gene); }}
                    className="p-3 bg-white border border-slate-200 hover:border-teal-400 rounded-lg cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-teal-700 group-hover:text-teal-900 font-mono">
                        {gene.symbol}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        NCBI: {gene.ncbiId}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-1 mb-1.5">
                      {gene.name}
                    </div>
                    {relation && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                        {relation.evidence}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Associated Biomarkers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                Associated Biomarkers ({associatedBiomarkers.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {associatedBiomarkers.map(biomarker => {
                const relation = DISORDER_BIOMARKER_RELATIONS.find(
                  r => r.biomarkerId === biomarker.id && r.disorderId === disorder.id
                );
                return (
                  <div 
                    key={biomarker.id}
                    onClick={() => { onClose(); onSelectBiomarker(biomarker); }}
                    className="p-3 bg-white border border-slate-200 hover:border-amber-400 rounded-lg cursor-pointer transition-all hover:shadow-xs group"
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-slate-900 group-hover:text-amber-800">
                        {biomarker.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {biomarker.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mb-1.5">
                      Matrix: {biomarker.sampleType}
                    </div>
                    {relation && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                        {relation.evidence}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scientific Evidence */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Scientific Evidence & Literature
            </h3>
            <div className="space-y-2">
              {references.map(ref => (
                <div key={ref.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="font-medium text-slate-900">{ref.title}</div>
                  <div className="text-slate-500">{ref.authors} ({ref.year}) - <span className="italic">{ref.journal}</span></div>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="font-mono text-slate-600">PMID: {ref.pmid}</span>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium hover:underline"
                    >
                      <span>View on PubMed</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Disclaimer */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Educational Research Disclaimer:</strong> Genetic and biomarker associations presented here reflect published biological and epidemiological research. They do not constitute diagnostic criteria.
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
