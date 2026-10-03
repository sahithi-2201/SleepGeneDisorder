import { 
  Disorder, 
  Gene, 
  Biomarker, 
  DatabaseStatistics, 
  SampleAnalysisRequest, 
  SampleAnalysisResponse,
  NetworkData,
  ScientificReference
} from '../types/bioinformatics';
import { 
  DISORDERS, 
  GENES, 
  BIOMARKERS, 
  SCIENTIFIC_REFERENCES, 
  DATABASE_STATISTICS,
  GENE_DISORDER_RELATIONS,
  GENE_BIOMARKER_RELATIONS,
  DISORDER_BIOMARKER_RELATIONS
} from '../data/bioData';
import { runSampleAnalysis } from './analysisEngine';

export interface GlobalSearchResult {
  disorders: Disorder[];
  genes: Gene[];
  biomarkers: Biomarker[];
}

export const api = {
  async getStatistics(): Promise<DatabaseStatistics> {
    try {
      const res = await fetch('/api/statistics');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DATABASE_STATISTICS;
  },

  async getDisorders(): Promise<Disorder[]> {
    try {
      const res = await fetch('/api/disorders');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DISORDERS;
  },

  async getDisorderById(id: number): Promise<Disorder | undefined> {
    try {
      const res = await fetch(`/api/disorders/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return DISORDERS.find(d => d.id === id);
  },

  async getGenes(): Promise<Gene[]> {
    try {
      const res = await fetch('/api/genes');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return GENES;
  },

  async getGeneById(id: number): Promise<Gene | undefined> {
    try {
      const res = await fetch(`/api/genes/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return GENES.find(g => g.id === id);
  },

  async getBiomarkers(): Promise<Biomarker[]> {
    try {
      const res = await fetch('/api/biomarkers');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return BIOMARKERS;
  },

  async getBiomarkerById(id: number): Promise<Biomarker | undefined> {
    try {
      const res = await fetch(`/api/biomarkers/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return BIOMARKERS.find(b => b.id === id);
  },

  async search(query: string): Promise<GlobalSearchResult> {
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const q = query.toLowerCase().trim();
    if (!q) {
      return { disorders: [], genes: [], biomarkers: [] };
    }
    return {
      disorders: DISORDERS.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.description.toLowerCase().includes(q) || 
        d.category.toLowerCase().includes(q) || 
        d.synonyms.toLowerCase().includes(q)
      ),
      genes: GENES.filter(g => 
        g.symbol.toLowerCase().includes(q) || 
        g.name.toLowerCase().includes(q) || 
        g.ncbiId.toString().includes(q) || 
        g.uniprotId.toLowerCase().includes(q) ||
        g.chromosome.toLowerCase().includes(q)
      ),
      biomarkers: BIOMARKERS.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.type.toLowerCase().includes(q) || 
        b.sampleType.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q)
      )
    };
  },

  async analyzeSample(payload: SampleAnalysisRequest): Promise<SampleAnalysisResponse> {
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return runSampleAnalysis(payload);
  },

  async getNetworkData(): Promise<NetworkData> {
    try {
      const res = await fetch('/api/graph');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const nodes: NetworkData['nodes'] = [
      ...DISORDERS.map(d => ({
        id: `disorder-${d.id}`,
        label: d.name,
        type: 'disorder' as const,
        originalId: d.id,
        category: d.category
      })),
      ...GENES.map(g => ({
        id: `gene-${g.id}`,
        label: g.symbol,
        type: 'gene' as const,
        originalId: g.id,
        category: g.chromosome
      })),
      ...BIOMARKERS.map(b => ({
        id: `biomarker-${b.id}`,
        label: b.name,
        type: 'biomarker' as const,
        originalId: b.id,
        category: b.type
      }))
    ];

    const links: NetworkData['links'] = [
      ...GENE_DISORDER_RELATIONS.map(r => {
        const gene = GENES.find(g => g.id === r.geneId);
        const disorder = DISORDERS.find(d => d.id === r.disorderId);
        return {
          source: `gene-${r.geneId}`,
          target: `disorder-${r.disorderId}`,
          relationType: 'gene-disorder' as const,
          label: `${gene?.symbol || ''} → ${disorder?.name || ''}`,
          pmid: r.pmid
        };
      }),
      ...GENE_BIOMARKER_RELATIONS.map(r => {
        const gene = GENES.find(g => g.id === r.geneId);
        const biomarker = BIOMARKERS.find(b => b.id === r.biomarkerId);
        return {
          source: `gene-${r.geneId}`,
          target: `biomarker-${r.biomarkerId}`,
          relationType: 'gene-biomarker' as const,
          label: r.relationship,
          pmid: r.pmid
        };
      }),
      ...DISORDER_BIOMARKER_RELATIONS.map(r => {
        const disorder = DISORDERS.find(d => d.id === r.disorderId);
        const biomarker = BIOMARKERS.find(b => b.id === r.biomarkerId);
        return {
          source: `disorder-${r.disorderId}`,
          target: `biomarker-${r.biomarkerId}`,
          relationType: 'disorder-biomarker' as const,
          label: `${disorder?.name || ''} ↔ ${biomarker?.name || ''}`,
          pmid: r.pmid
        };
      })
    ];

    return { nodes, links };
  },

  getReferencesForIds(ids: number[]): ScientificReference[] {
    return SCIENTIFIC_REFERENCES.filter(r => ids.includes(r.id));
  }
};
