import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  BookOpen, 
  Dna, 
  Activity, 
  Brain,
  FileText
} from 'lucide-react';
import { SampleAnalysisRequest, SampleAnalysisResponse, Disorder, Gene, Biomarker } from '../types/bioinformatics';
import { api } from '../services/api';
import { GENES, BIOMARKERS } from '../data/bioData';

interface SampleAnalysisProps {
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectGene: (gene: Gene) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
}

export const SampleAnalysis: React.FC<SampleAnalysisProps> = ({
  onSelectDisorder,
  onSelectGene,
  onSelectBiomarker
}) => {
  const [sampleId, setSampleId] = useState('SAMPLE001');
  const [gene, setGene] = useState('PER2');
  const [biomarker, setBiomarker] = useState('Melatonin');
  const [geneResult, setGeneResult] = useState<'Detected' | 'Not Detected' | 'Variant Identified' | 'Wild Type'>('Detected');
  const [biomarkerValue, setBiomarkerValue] = useState<string>('35');
  const [biomarkerUnit, setBiomarkerUnit] = useState('pg/mL');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SampleAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // 5 Preset Scenarios for instant demonstration
  const presets = [
    {
      id: 'p1',
      label: 'Preset 1: Circadian Locus',
      desc: 'PER2 + Melatonin (Circadian Rhythm Sleep-Wake Disorder)',
      sampleId: 'SAMPLE001',
      gene: 'PER2',
      biomarker: 'Melatonin',
      geneResult: 'Detected' as const,
      biomarkerValue: '35',
      biomarkerUnit: 'pg/mL'
    },
    {
      id: 'p2',
      label: 'Preset 2: Narcolepsy Autoimmunity',
      desc: 'HLA-DQB1 + Orexin-A (Narcolepsy Type 1)',
      sampleId: 'SAMPLE002',
      gene: 'HLA-DQB1',
      biomarker: 'Orexin-A (Hypocretin-1)',
      geneResult: 'Variant Identified' as const,
      biomarkerValue: '45',
      biomarkerUnit: 'pg/mL'
    },
    {
      id: 'p3',
      label: 'Preset 3: Insomnia Hyperarousal',
      desc: 'SLC6A4 + Cortisol (Chronic Insomnia Disorder)',
      sampleId: 'SAMPLE003',
      gene: 'SLC6A4',
      biomarker: 'Cortisol',
      geneResult: 'Detected' as const,
      biomarkerValue: '18.5',
      biomarkerUnit: 'μg/dL'
    },
    {
      id: 'p4',
      label: 'Preset 4: Sleep Apnea Inflammation',
      desc: 'TNFRSF1A + IL-6 (Obstructive Sleep Apnea)',
      sampleId: 'SAMPLE004',
      gene: 'TNFRSF1A',
      biomarker: 'Interleukin-6 (IL-6)',
      geneResult: 'Detected' as const,
      biomarkerValue: '12.4',
      biomarkerUnit: 'pg/mL'
    },
    {
      id: 'p5',
      label: 'Preset 5: Negative Control',
      desc: 'Non-matching novel candidate loci',
      sampleId: 'SAMPLE005',
      gene: 'OR4F5',
      biomarker: 'Troponin-T',
      geneResult: 'Not Detected' as const,
      biomarkerValue: '0.01',
      biomarkerUnit: 'ng/mL'
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setSampleId(preset.sampleId);
    setGene(preset.gene);
    setBiomarker(preset.biomarker);
    setGeneResult(preset.geneResult);
    setBiomarkerValue(preset.biomarkerValue);
    setBiomarkerUnit(preset.biomarkerUnit);
    setErrorMessage(null);
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gene.trim() && !biomarker.trim()) {
      setErrorMessage('Please enter at least one Gene symbol or Biomarker to analyze.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const payload: SampleAnalysisRequest = {
        sampleId: sampleId.trim() || 'SAMPLE_UNSPECIFIED',
        gene: gene.trim(),
        biomarker: biomarker.trim(),
        geneResult,
        biomarkerValue: biomarkerValue ? parseFloat(biomarkerValue) : undefined,
        biomarkerUnit
      };

      const res = await api.analyzeSample(payload);
      setResult(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to the analysis engine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSampleId('SAMPLE001');
    setGene('');
    setBiomarker('');
    setBiomarkerValue('');
    setResult(null);
    setErrorMessage(null);
  };

  const copyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
          <span>Bioinformatics Analysis Pipeline</span>
          <span aria-hidden="true">·</span>
          <span>REST API Endpoint POST /api/analyze</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Sample Result Analysis
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Enter experimental or educational patient test results. The analysis engine queries relational database entities to correlate genes and biomarkers with documented sleep disorders and primary research citations.
        </p>
      </div>

      {/* Preset Quick Load Row */}
      <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Quick-Load Demonstration Presets
          </span>
          <span className="text-[11px] text-slate-500">Click a preset to populate input parameters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="text-left p-2.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg transition-all text-xs group"
            >
              <div className="font-bold text-slate-900 group-hover:text-teal-800 font-mono">
                {p.sampleId}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {p.gene} + {p.biomarker}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Form & Controls */}
      <form onSubmit={handleAnalyze} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>Sample Parameters</span>
          <span className="text-xs font-mono text-slate-400 font-normal">HTTP POST /api/analyze</span>
        </h2>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sample ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase font-mono">
              Sample Identifier <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={sampleId}
              onChange={(e) => setSampleId(e.target.value)}
              placeholder="e.g. SAMPLE001"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Patient / laboratory tracking ID</span>
          </div>

          {/* Gene Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase font-mono">
              Gene Symbol / Identifier <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={gene}
                onChange={(e) => setGene(e.target.value)}
                placeholder="e.g. PER2, HLA-DQB1, CLOCK"
                list="genes-datalist"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <datalist id="genes-datalist">
                {GENES.map(g => (
                  <option key={g.id} value={g.symbol}>{g.name}</option>
                ))}
              </datalist>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Official HGNC symbol or NCBI ID</span>
          </div>

          {/* Biomarker Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase font-mono">
              Biomarker Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={biomarker}
                onChange={(e) => setBiomarker(e.target.value)}
                placeholder="e.g. Melatonin, Cortisol, Orexin-A"
                list="biomarkers-datalist"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <datalist id="biomarkers-datalist">
                {BIOMARKERS.map(b => (
                  <option key={b.id} value={b.name}>{b.type}</option>
                ))}
              </datalist>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Hormone, neuropeptide, cytokine, or index</span>
          </div>

          {/* Gene Result Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase font-mono">
              Optional Gene Assay Result
            </label>
            <select
              value={geneResult}
              onChange={(e: any) => setGeneResult(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Detected">Detected / Positive</option>
              <option value="Variant Identified">Variant Identified</option>
              <option value="Wild Type">Wild Type (Normal)</option>
              <option value="Not Detected">Not Detected / Negative</option>
            </select>
          </div>

          {/* Biomarker Value */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase font-mono">
              Quantitative Biomarker Value
            </label>
            <input
              type="text"
              value={biomarkerValue}
              onChange={(e) => setBiomarkerValue(e.target.value)}
              placeholder="e.g. 35"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Biomarker Unit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase font-mono">
              Measurement Unit
            </label>
            <input
              type="text"
              value={biomarkerUnit}
              onChange={(e) => setBiomarkerUnit(e.target.value)}
              placeholder="e.g. pg/mL, events/hr"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-all"
          >
            {loading ? (
              <span>Querying Database...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analyze Sample</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ANALYSIS RESULT SECTION */}
      {result && (
        <section className="bg-white border-2 border-teal-600/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                <span>ANALYSIS RESULT</span>
                <span aria-hidden="true">·</span>
                <span>SAMPLE ID: {result.sampleId}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Molecular Association Profile
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedJson ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Report</span>
              </button>
            </div>
          </div>

          {/* Match Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gene Match Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-teal-600" />
                  Target Gene: <strong className="text-slate-700">{result.inputGene}</strong>
                </span>
                {result.geneFound ? (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    FOUND IN DATABASE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                    <XCircle className="w-3.5 h-3.5" />
                    NOT INDEXED
                  </span>
                )}
              </div>

              {result.matchedGene ? (
                <div className="text-xs space-y-1 pt-1">
                  <div className="font-bold text-slate-900 text-sm">
                    {result.matchedGene.symbol} – {result.matchedGene.name}
                  </div>
                  <div className="text-slate-500 font-mono">
                    NCBI Gene ID: {result.matchedGene.ncbiId} · Chromosome: {result.matchedGene.chromosome}
                  </div>
                  <p className="text-slate-600 pt-1 line-clamp-2">
                    {result.matchedGene.description}
                  </p>
                  <button
                    onClick={() => onSelectGene(result.matchedGene!)}
                    className="text-teal-700 font-semibold hover:underline text-xs inline-flex items-center gap-0.5 pt-1"
                  >
                    View Gene Profile →
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pt-1">
                  The symbol "{result.inputGene}" does not match known sleep disorder loci currently stored in the SleepGeneMap database.
                </p>
              )}
            </div>

            {/* Biomarker Match Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-600" />
                  Biomarker: <strong className="text-slate-700">{result.inputBiomarker || 'Not specified'}</strong>
                </span>
                {result.biomarkerFound ? (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    FOUND IN DATABASE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                    <XCircle className="w-3.5 h-3.5" />
                    NOT INDEXED
                  </span>
                )}
              </div>

              {result.matchedBiomarker ? (
                <div className="text-xs space-y-1 pt-1">
                  <div className="font-bold text-slate-900 text-sm">
                    {result.matchedBiomarker.name}
                  </div>
                  <div className="text-slate-500 font-mono">
                    Type: {result.matchedBiomarker.type} · Matrix: {result.matchedBiomarker.sampleType}
                  </div>
                  <div className="text-slate-600 font-mono text-[11px]">
                    Reference Interval: {result.matchedBiomarker.referenceRange || 'Assay benchmark'}
                  </div>
                  <button
                    onClick={() => onSelectBiomarker(result.matchedBiomarker!)}
                    className="text-amber-800 font-semibold hover:underline text-xs inline-flex items-center gap-0.5 pt-1"
                  >
                    View Biomarker Profile →
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pt-1">
                  {result.inputBiomarker
                    ? `The biomarker "${result.inputBiomarker}" was not located in the current database repository.`
                    : 'No biomarker parameter was specified in the request.'}
                </p>
              )}
            </div>
          </div>

          {/* Associated Sleep Disorders Breakdown */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
              <Brain className="w-4 h-4 text-indigo-600" />
              Associated Sleep Disorders in Database ({result.associatedDisorders.length})
            </h3>

            {result.associatedDisorders.length > 0 ? (
              <div className="space-y-3">
                {result.associatedDisorders.map(({ disorder, viaGene, viaBiomarker, evidenceNotes, pmids }) => (
                  <div
                    key={disorder.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{disorder.name}</span>
                        <span className="text-xs font-mono text-slate-500">({disorder.category})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        {viaGene && <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">Gene Link</span>}
                        {viaBiomarker && <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">Biomarker Link</span>}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {disorder.description}
                    </p>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                      <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] font-mono block">
                        Scientific Evidence & Pathophysiological Mechanism:
                      </span>
                      {evidenceNotes.map((note, idx) => (
                        <div key={idx} className="text-slate-600 italic">
                          • {note}
                        </div>
                      ))}

                      {pmids.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                          <span className="font-mono text-slate-500">PubMed References:</span>
                          {pmids.map(pmid => (
                            <a
                              key={pmid}
                              href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-700 hover:text-teal-900 hover:underline font-mono inline-flex items-center gap-0.5"
                            >
                              PMID:{pmid}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                No matching sleep-disorder association was found in the current database for the provided parameters.
              </div>
            )}
          </div>

          {/* Gene-Biomarker Direct Relationship if any */}
          {result.geneBiomarkerRelationship && (
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-1">
              <span className="font-mono font-bold text-teal-900 uppercase text-[11px] block">
                Direct Gene ↔ Biomarker Relationship:
              </span>
              <div className="font-semibold text-teal-800">
                {result.geneBiomarkerRelationship.relationship}
              </div>
              <p className="text-slate-700 leading-relaxed">
                {result.geneBiomarkerRelationship.evidence}
              </p>
              {result.geneBiomarkerRelationship.pmid && (
                <div className="pt-1">
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${result.geneBiomarkerRelationship.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline font-mono inline-flex items-center gap-1"
                  >
                    <span>PMID: {result.geneBiomarkerRelationship.pmid}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Structured Interpretation Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <span className="text-xs font-mono uppercase text-teal-400 tracking-wider font-bold block">
              Bioinformatics Interpretation
            </span>
            <p className="text-sm font-medium leading-relaxed text-slate-200">
              {result.interpretation}
            </p>
          </div>

          {/* Mandatory Medical Safety Disclaimer */}
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-1">
              <span className="font-bold uppercase tracking-wider font-mono text-amber-900 block">
                Mandatory Ethical & Medical Safety Disclaimer
              </span>
              <p className="leading-relaxed">
                {result.medicalDisclaimer}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
