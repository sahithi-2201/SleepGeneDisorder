export type DisorderCategory = 
  | 'Sleep-Wake Disorder'
  | 'Sleep-Related Breathing Disorder'
  | 'Movement Disorder'
  | 'Circadian Rhythm Sleep-Wake Disorder'
  | 'Parasomnia';

export type BiomarkerType = 
  | 'Hormone'
  | 'Neuropeptide'
  | 'Cytokine'
  | 'Purine Nucleoside'
  | 'Protein'
  | 'Neurotransmitter'
  | 'Physiological Index';

export interface ScientificReference {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid: string;
  doi?: string;
  source: string;
}

export interface Disorder {
  id: number;
  name: string;
  description: string;
  category: DisorderCategory;
  synonyms: string;
  icd11Code?: string;
  associatedGeneIds: number[];
  associatedBiomarkerIds: number[];
  referenceIds: number[];
}

export interface Gene {
  id: number;
  symbol: string;
  name: string;
  ncbiId: number;
  uniprotId: string;
  chromosome: string;
  description: string;
  associatedDisorderIds: number[];
  associatedBiomarkerIds: number[];
  referenceIds: number[];
}

export interface Biomarker {
  id: number;
  name: string;
  type: BiomarkerType;
  sampleType: string;
  description: string;
  standardUnit: string;
  referenceRange?: string;
  associatedGeneIds: number[];
  associatedDisorderIds: number[];
  referenceIds: number[];
}

export interface GeneDisorderRelation {
  id: number;
  geneId: number;
  disorderId: number;
  evidence: string;
  pmid: string;
}

export interface GeneBiomarkerRelation {
  id: number;
  geneId: number;
  biomarkerId: number;
  relationship: string;
  evidence: string;
  pmid: string;
}

export interface DisorderBiomarkerRelation {
  id: number;
  disorderId: number;
  biomarkerId: number;
  evidence: string;
  pmid: string;
}

export interface DatabaseStatistics {
  totalDisorders: number;
  totalGenes: number;
  totalBiomarkers: number;
  geneDisorderAssociations: number;
  geneBiomarkerAssociations: number;
  disorderBiomarkerAssociations: number;
  totalReferences: number;
}

export interface SampleAnalysisRequest {
  sampleId: string;
  gene: string;
  biomarker: string;
  geneResult?: 'Detected' | 'Not Detected' | 'Variant Identified' | 'Wild Type';
  biomarkerValue?: number | string;
  biomarkerUnit?: string;
}

export interface SampleAnalysisResponse {
  sampleId: string;
  timestamp: string;
  inputGene: string;
  inputBiomarker: string;
  geneFound: boolean;
  biomarkerFound: boolean;
  matchedGene?: Gene;
  matchedBiomarker?: Biomarker;
  associatedDisorders: {
    disorder: Disorder;
    viaGene: boolean;
    viaBiomarker: boolean;
    evidenceNotes: string[];
    pmids: string[];
  }[];
  geneBiomarkerRelationship?: {
    relationship: string;
    evidence: string;
    pmid: string;
  };
  interpretation: string;
  associationStatus: 'BOTH_ASSOCIATED' | 'GENE_ONLY' | 'BIOMARKER_ONLY' | 'NO_ASSOCIATION';
  medicalDisclaimer: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'disorder' | 'gene' | 'biomarker';
  originalId: number;
  category?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  relationType: 'gene-disorder' | 'gene-biomarker' | 'disorder-biomarker';
  label: string;
  pmid: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}
