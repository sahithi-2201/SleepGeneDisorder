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

export interface GlobalSearchResult {
  disorders: Disorder[];
  genes: Gene[];
  biomarkers: Biomarker[];
}

export const api = {
  async getStatistics(): Promise<DatabaseStatistics> {
    const res = await fetch('/api/statistics');
    if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch database statistics`);
    return await res.json();
  },

  async getDisorders(category?: string): Promise<Disorder[]> {
    const url = category && category !== 'All' 
      ? `/api/disorders?category=${encodeURIComponent(category)}`
      : '/api/disorders';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch disorders from database`);
    return await res.json();
  },

  async getDisorderById(id: number): Promise<Disorder | undefined> {
    const res = await fetch(`/api/disorders/${id}`);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch disorder ${id}`);
    return await res.json();
  },

  async getGenes(): Promise<Gene[]> {
    const res = await fetch('/api/genes');
    if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch genes from database`);
    return await res.json();
  },

  async getGeneById(id: number): Promise<Gene | undefined> {
    const res = await fetch(`/api/genes/${id}`);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch gene ${id}`);
    return await res.json();
  },

  async searchGenes(query: string): Promise<Gene[]> {
    const res = await fetch(`/api/genes/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getBiomarkers(type?: string): Promise<Biomarker[]> {
    const url = type && type !== 'All' 
      ? `/api/biomarkers?type=${encodeURIComponent(type)}`
      : '/api/biomarkers';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch biomarkers from database`);
    return await res.json();
  },

  async getBiomarkerById(id: number): Promise<Biomarker | undefined> {
    const res = await fetch(`/api/biomarkers/${id}`);
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch biomarker ${id}`);
    return await res.json();
  },

  async searchBiomarkers(query: string): Promise<Biomarker[]> {
    const res = await fetch(`/api/biomarkers/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async search(query: string): Promise<GlobalSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return { disorders: [], genes: [], biomarkers: [] };
    }
    const res = await fetch(`/api/search?query=${encodeURIComponent(trimmed)}`);
    if (!res.ok) throw new Error(`Search failed: HTTP ${res.status}`);
    const data = await res.json();
    return {
      disorders: data.disorders || [],
      genes: data.genes || [],
      biomarkers: data.biomarkers || []
    };
  },

  async analyzeSample(payload: SampleAnalysisRequest): Promise<SampleAnalysisResponse> {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Analysis request failed with HTTP ${res.status}`);
    }
    return await res.json();
  },

  async getNetworkData(): Promise<NetworkData> {
    const res = await fetch('/api/graph');
    if (!res.ok) throw new Error(`Failed to load network graph from database: HTTP ${res.status}`);
    return await res.json();
  },

  async getReferences(ids?: number[]): Promise<ScientificReference[]> {
    const url = ids && ids.length > 0
      ? `/api/references?ids=${ids.join(',')}`
      : '/api/references';
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  },

  async getRelations(): Promise<{
    geneDisorders: any[];
    geneBiomarkers: any[];
    disorderBiomarkers: any[];
  }> {
    const res = await fetch('/api/relations');
    if (!res.ok) return { geneDisorders: [], geneBiomarkers: [], disorderBiomarkers: [] };
    return await res.json();
  },

  async getProjectFiles() {
    try {
      const res = await fetch('/api/project-files');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async getEvidenceAudit(): Promise<any[]> {
    try {
      const res = await fetch('/api/audit');
      if (res.ok) return await res.json();
    } catch (e) {
      console.error('Failed to fetch evidence audit:', e);
    }
    return [];
  },

  async getDataSourcesMarkdown(): Promise<string> {
    try {
      const res = await fetch('/api/data-sources-markdown');
      if (res.ok) return await res.text();
    } catch (e) {
      console.error('Failed to fetch data sources markdown:', e);
    }
    return '';
  }
};
