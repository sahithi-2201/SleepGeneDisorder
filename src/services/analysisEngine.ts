import { 
  SampleAnalysisRequest, 
  SampleAnalysisResponse,
  Gene,
  Biomarker,
  Disorder
} from '../types/bioinformatics';
import { 
  DISORDERS, 
  GENES, 
  BIOMARKERS, 
  GENE_DISORDER_RELATIONS, 
  GENE_BIOMARKER_RELATIONS, 
  DISORDER_BIOMARKER_RELATIONS,
  MEDICAL_DISCLAIMER_TEXT 
} from '../data/bioData';

export function runSampleAnalysis(request: SampleAnalysisRequest): SampleAnalysisResponse {
  const cleanGeneQuery = (request.gene || '').trim().toUpperCase();
  const cleanBiomarkerQuery = (request.biomarker || '').trim().toLowerCase();

  // Find Gene match (case insensitive symbol or name match)
  const matchedGene: Gene | undefined = GENES.find(g => 
    g.symbol.toUpperCase() === cleanGeneQuery || 
    g.name.toUpperCase() === cleanGeneQuery ||
    cleanGeneQuery.includes(g.symbol.toUpperCase()) ||
    g.ncbiId.toString() === cleanGeneQuery
  );

  // Find Biomarker match
  const matchedBiomarker: Biomarker | undefined = BIOMARKERS.find(b => 
    b.name.toLowerCase() === cleanBiomarkerQuery ||
    cleanBiomarkerQuery.includes(b.name.toLowerCase()) ||
    b.name.toLowerCase().includes(cleanBiomarkerQuery)
  );

  const geneFound = !!matchedGene;
  const biomarkerFound = !!matchedBiomarker;

  // Find associated disorders
  const disorderMap = new Map<number, {
    disorder: Disorder;
    viaGene: boolean;
    viaBiomarker: boolean;
    evidenceNotes: string[];
    pmids: string[];
  }>();

  if (matchedGene) {
    const geneRelations = GENE_DISORDER_RELATIONS.filter(r => r.geneId === matchedGene.id);
    for (const rel of geneRelations) {
      const disorder = DISORDERS.find(d => d.id === rel.disorderId);
      if (disorder) {
        if (!disorderMap.has(disorder.id)) {
          disorderMap.set(disorder.id, {
            disorder,
            viaGene: true,
            viaBiomarker: false,
            evidenceNotes: [`Gene association (${matchedGene.symbol}): ${rel.evidence}`],
            pmids: [rel.pmid]
          });
        } else {
          const entry = disorderMap.get(disorder.id)!;
          entry.viaGene = true;
          entry.evidenceNotes.push(`Gene association (${matchedGene.symbol}): ${rel.evidence}`);
          if (!entry.pmids.includes(rel.pmid)) entry.pmids.push(rel.pmid);
        }
      }
    }
  }

  if (matchedBiomarker) {
    const biomarkerRelations = DISORDER_BIOMARKER_RELATIONS.filter(r => r.biomarkerId === matchedBiomarker.id);
    for (const rel of biomarkerRelations) {
      const disorder = DISORDERS.find(d => d.id === rel.disorderId);
      if (disorder) {
        if (!disorderMap.has(disorder.id)) {
          disorderMap.set(disorder.id, {
            disorder,
            viaGene: false,
            viaBiomarker: true,
            evidenceNotes: [`Biomarker association (${matchedBiomarker.name}): ${rel.evidence}`],
            pmids: [rel.pmid]
          });
        } else {
          const entry = disorderMap.get(disorder.id)!;
          entry.viaBiomarker = true;
          entry.evidenceNotes.push(`Biomarker association (${matchedBiomarker.name}): ${rel.evidence}`);
          if (!entry.pmids.includes(rel.pmid)) entry.pmids.push(rel.pmid);
        }
      }
    }
  }

  // Find Gene-Biomarker direct relationship
  let geneBiomarkerRelationship: { relationship: string; evidence: string; pmid: string; } | undefined;
  if (matchedGene && matchedBiomarker) {
    const gbRel = GENE_BIOMARKER_RELATIONS.find(
      r => r.geneId === matchedGene.id && r.biomarkerId === matchedBiomarker.id
    );
    if (gbRel) {
      geneBiomarkerRelationship = {
        relationship: gbRel.relationship,
        evidence: gbRel.evidence,
        pmid: gbRel.pmid
      };
    }
  }

  // Determine association status and scientific interpretation
  let associationStatus: 'BOTH_ASSOCIATED' | 'GENE_ONLY' | 'BIOMARKER_ONLY' | 'NO_ASSOCIATION' = 'NO_ASSOCIATION';
  let interpretation = '';

  if (geneFound && biomarkerFound) {
    associationStatus = 'BOTH_ASSOCIATED';
    const disorderNames = Array.from(disorderMap.values()).map(e => e.disorder.name).join(', ');
    if (disorderNames) {
      interpretation = `The entered gene (${matchedGene.symbol}) and biomarker (${matchedBiomarker.name}) match records in the database with documented associations to: ${disorderNames}.`;
    } else {
      interpretation = `The entered gene (${matchedGene.symbol}) and biomarker (${matchedBiomarker.name}) are indexed in the SleepGeneMap database, but have distinct pathways or indirect biological relationships.`;
    }
  } else if (geneFound) {
    associationStatus = 'GENE_ONLY';
    const disorderNames = Array.from(disorderMap.values()).map(e => e.disorder.name).join(', ');
    interpretation = `The entered gene (${matchedGene.symbol}) is associated in the database with: ${disorderNames || 'circadian/sleep homeostasis regulation'}. The biomarker was not identified in the current repository.`;
  } else if (biomarkerFound) {
    associationStatus = 'BIOMARKER_ONLY';
    const disorderNames = Array.from(disorderMap.values()).map(e => e.disorder.name).join(', ');
    interpretation = `The entered biomarker (${matchedBiomarker.name}) matches a biomarker recorded in the database, with documented links to: ${disorderNames || 'sleep physiological pathways'}. The gene symbol was not matched in the current database.`;
  } else {
    associationStatus = 'NO_ASSOCIATION';
    interpretation = "No matching sleep-disorder association was found in the current SleepGeneMap database. This does not mean that the person does not have a sleep disorder.";
  }

  return {
    sampleId: request.sampleId || 'SAMPLE_UNSPECIFIED',
    timestamp: new Date().toISOString(),
    inputGene: request.gene,
    inputBiomarker: request.biomarker,
    geneFound,
    biomarkerFound,
    matchedGene,
    matchedBiomarker,
    associatedDisorders: Array.from(disorderMap.values()),
    geneBiomarkerRelationship,
    interpretation,
    associationStatus,
    medicalDisclaimer: MEDICAL_DISCLAIMER_TEXT
  };
}
