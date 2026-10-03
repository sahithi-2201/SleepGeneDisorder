import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  Disorder, 
  Gene, 
  Biomarker, 
  DatabaseStatistics, 
  SampleAnalysisRequest, 
  SampleAnalysisResponse,
  NetworkData,
  ScientificReference
} from '../src/types/bioinformatics';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MEDICAL_DISCLAIMER_TEXT = 
  "SleepGeneMap is an educational bioinformatics exploration tool. The results are based on relationships stored in the application's research database and should not be used to diagnose, treat, or rule out a medical condition. Consult a qualified healthcare professional for medical interpretation.";

class SleepGeneDatabase {
  private db: SqlJsDatabase | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized && this.db) return;

    const SQL = await initSqlJs();
    this.db = new SQL.Database();

    const rootDir = path.resolve(__dirname, '..');
    const schemaPath = path.join(rootDir, 'database', 'schema.sql');
    const dataPath = path.join(rootDir, 'database', 'data.sql');

    if (!fs.existsSync(schemaPath) || !fs.existsSync(dataPath)) {
      throw new Error(`Database SQL files missing at ${schemaPath} or ${dataPath}`);
    }

    const rawSchema = fs.readFileSync(schemaPath, 'utf8');
    const cleanSchema = rawSchema
      .replace(/--.*$/gm, '')
      .replace(/CREATE DATABASE[^;]+;/gi, '')
      .replace(/USE [^;]+;/gi, '')
      .replace(/BIGINT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
      .replace(/UNIQUE KEY \w+ \(([^)]+)\)/gi, (_m, p1) => `UNIQUE (${p1})`);

    this.db.exec(cleanSchema);

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const insertStatements = rawData
      .split(/(?=INSERT INTO )/g)
      .map(s => s.replace(/--.*$/gm, '').replace(/\bUSE\s+\w+;\s*/gi, '').trim())
      .filter(s => s.startsWith('INSERT INTO'));

    for (const stmt of insertStatements) {
      this.db.exec(stmt);
    }

    this.initialized = true;
    console.log('[SleepGeneMap Database] Relational database initialized from database/*.sql');
  }

  private ensureDb(): SqlJsDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  getStatistics(): DatabaseStatistics {
    const db = this.ensureDb();
    const q = (sql: string): number => {
      const res = db.exec(sql);
      return res.length > 0 && res[0].values.length > 0 ? Number(res[0].values[0][0]) : 0;
    };

    return {
      totalDisorders: q('SELECT count(*) FROM disorders'),
      totalGenes: q('SELECT count(*) FROM genes'),
      totalBiomarkers: q('SELECT count(*) FROM biomarkers'),
      geneDisorderAssociations: q('SELECT count(*) FROM gene_disorder'),
      geneBiomarkerAssociations: q('SELECT count(*) FROM gene_biomarker'),
      disorderBiomarkerAssociations: q('SELECT count(*) FROM disorder_biomarker'),
      totalReferences: q('SELECT count(*) FROM scientific_references')
    };
  }

  getDisorders(category?: string): Disorder[] {
    const db = this.ensureDb();
    let sql = 'SELECT id, name, description, category, synonyms, icd11_code FROM disorders';
    const params: any[] = [];
    if (category && category !== 'All') {
      sql += ' WHERE LOWER(category) = LOWER(?)';
      params.push(category);
    }
    sql += ' ORDER BY id ASC';

    const stmt = db.prepare(sql);
    if (params.length > 0) stmt.bind(params);

    const disorders: Disorder[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      const disorderId = Number(row.id);

      // Query associated gene IDs
      const gStmt = db.prepare('SELECT gene_id FROM gene_disorder WHERE disorder_id = ?');
      gStmt.bind([disorderId]);
      const associatedGeneIds: number[] = [];
      while (gStmt.step()) {
        associatedGeneIds.push(Number(gStmt.getAsObject().gene_id));
      }
      gStmt.free();

      // Query associated biomarker IDs
      const bStmt = db.prepare('SELECT biomarker_id FROM disorder_biomarker WHERE disorder_id = ?');
      bStmt.bind([disorderId]);
      const associatedBiomarkerIds: number[] = [];
      while (bStmt.step()) {
        associatedBiomarkerIds.push(Number(bStmt.getAsObject().biomarker_id));
      }
      bStmt.free();

      // Query reference IDs via PMID join
      const rStmt = db.prepare(`
        SELECT r.id FROM scientific_references r 
        WHERE r.pmid IN (
          SELECT pmid FROM gene_disorder WHERE disorder_id = ?
          UNION
          SELECT pmid FROM disorder_biomarker WHERE disorder_id = ?
        )
      `);
      rStmt.bind([disorderId, disorderId]);
      const referenceIds: number[] = [];
      while (rStmt.step()) {
        referenceIds.push(Number(rStmt.getAsObject().id));
      }
      rStmt.free();

      disorders.push({
        id: disorderId,
        name: row.name,
        description: row.description,
        category: row.category,
        synonyms: row.synonyms || '',
        icd11Code: row.icd11_code || '',
        associatedGeneIds,
        associatedBiomarkerIds,
        referenceIds
      });
    }
    stmt.free();
    return disorders;
  }

  getDisorderById(id: number): Disorder | undefined {
    const list = this.getDisorders();
    return list.find(d => d.id === id);
  }

  getGenes(): Gene[] {
    const db = this.ensureDb();
    const stmt = db.prepare('SELECT id, symbol, name, ncbi_id, uniprot_id, chromosome, description FROM genes ORDER BY id ASC');
    const genes: Gene[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      const geneId = Number(row.id);

      // Associated disorders
      const dStmt = db.prepare('SELECT disorder_id FROM gene_disorder WHERE gene_id = ?');
      dStmt.bind([geneId]);
      const associatedDisorderIds: number[] = [];
      while (dStmt.step()) {
        associatedDisorderIds.push(Number(dStmt.getAsObject().disorder_id));
      }
      dStmt.free();

      // Associated biomarkers
      const bStmt = db.prepare('SELECT biomarker_id FROM gene_biomarker WHERE gene_id = ?');
      bStmt.bind([geneId]);
      const associatedBiomarkerIds: number[] = [];
      while (bStmt.step()) {
        associatedBiomarkerIds.push(Number(bStmt.getAsObject().biomarker_id));
      }
      bStmt.free();

      // References
      const rStmt = db.prepare(`
        SELECT r.id FROM scientific_references r 
        WHERE r.pmid IN (
          SELECT pmid FROM gene_disorder WHERE gene_id = ?
          UNION
          SELECT pmid FROM gene_biomarker WHERE gene_id = ?
        )
      `);
      rStmt.bind([geneId, geneId]);
      const referenceIds: number[] = [];
      while (rStmt.step()) {
        referenceIds.push(Number(rStmt.getAsObject().id));
      }
      rStmt.free();

      genes.push({
        id: geneId,
        symbol: row.symbol,
        name: row.name,
        ncbiId: Number(row.ncbi_id),
        uniprotId: row.uniprot_id || '',
        chromosome: row.chromosome || '',
        description: row.description || '',
        associatedDisorderIds,
        associatedBiomarkerIds,
        referenceIds
      });
    }
    stmt.free();
    return genes;
  }

  getGeneById(id: number): Gene | undefined {
    return this.getGenes().find(g => g.id === id);
  }

  searchGenes(query: string): Gene[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.getGenes().filter(g => 
      g.symbol.toLowerCase().includes(q) ||
      g.name.toLowerCase().includes(q) ||
      g.ncbiId.toString().includes(q) ||
      g.uniprotId.toLowerCase().includes(q) ||
      g.chromosome.toLowerCase().includes(q)
    );
  }

  getBiomarkers(type?: string): Biomarker[] {
    const db = this.ensureDb();
    let sql = 'SELECT id, name, type, sample_type, description, standard_unit, reference_range FROM biomarkers';
    const params: any[] = [];
    if (type && type !== 'All') {
      sql += ' WHERE LOWER(type) = LOWER(?)';
      params.push(type);
    }
    sql += ' ORDER BY id ASC';

    const stmt = db.prepare(sql);
    if (params.length > 0) stmt.bind(params);

    const biomarkers: Biomarker[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      const biomarkerId = Number(row.id);

      // Associated genes
      const gStmt = db.prepare('SELECT gene_id FROM gene_biomarker WHERE biomarker_id = ?');
      gStmt.bind([biomarkerId]);
      const associatedGeneIds: number[] = [];
      while (gStmt.step()) {
        associatedGeneIds.push(Number(gStmt.getAsObject().gene_id));
      }
      gStmt.free();

      // Associated disorders
      const dStmt = db.prepare('SELECT disorder_id FROM disorder_biomarker WHERE biomarker_id = ?');
      dStmt.bind([biomarkerId]);
      const associatedDisorderIds: number[] = [];
      while (dStmt.step()) {
        associatedDisorderIds.push(Number(dStmt.getAsObject().disorder_id));
      }
      dStmt.free();

      // References
      const rStmt = db.prepare(`
        SELECT r.id FROM scientific_references r 
        WHERE r.pmid IN (
          SELECT pmid FROM gene_biomarker WHERE biomarker_id = ?
          UNION
          SELECT pmid FROM disorder_biomarker WHERE biomarker_id = ?
        )
      `);
      rStmt.bind([biomarkerId, biomarkerId]);
      const referenceIds: number[] = [];
      while (rStmt.step()) {
        referenceIds.push(Number(rStmt.getAsObject().id));
      }
      rStmt.free();

      biomarkers.push({
        id: biomarkerId,
        name: row.name,
        type: row.type as any,
        sampleType: row.sample_type || '',
        description: row.description || '',
        standardUnit: row.standard_unit || '',
        referenceRange: row.reference_range || '',
        associatedGeneIds,
        associatedDisorderIds,
        referenceIds
      });
    }
    stmt.free();
    return biomarkers;
  }

  getBiomarkerById(id: number): Biomarker | undefined {
    return this.getBiomarkers().find(b => b.id === id);
  }

  searchBiomarkers(query: string): Biomarker[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.getBiomarkers().filter(b => 
      b.name.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q) ||
      b.sampleType.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    );
  }

  searchAll(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { disorders: [], genes: [], biomarkers: [] };
    }
    return {
      disorders: this.getDisorders().filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.synonyms.toLowerCase().includes(q) ||
        (d.icd11Code && d.icd11Code.toLowerCase().includes(q))
      ),
      genes: this.searchGenes(q),
      biomarkers: this.searchBiomarkers(q)
    };
  }

  analyzeSample(request: SampleAnalysisRequest): SampleAnalysisResponse {
    const db = this.ensureDb();
    const cleanGeneQuery = (request.gene || '').trim().toUpperCase();
    const cleanBiomarkerQuery = (request.biomarker || '').trim().toLowerCase();

    // Search Gene in database
    const allGenes = this.getGenes();
    const matchedGene: Gene | undefined = allGenes.find(g => 
      g.symbol.toUpperCase() === cleanGeneQuery ||
      g.name.toUpperCase() === cleanGeneQuery ||
      g.ncbiId.toString() === cleanGeneQuery ||
      cleanGeneQuery.includes(g.symbol.toUpperCase())
    );

    // Search Biomarker in database
    const allBiomarkers = this.getBiomarkers();
    const matchedBiomarker: Biomarker | undefined = allBiomarkers.find(b => 
      b.name.toLowerCase() === cleanBiomarkerQuery ||
      cleanBiomarkerQuery.includes(b.name.toLowerCase()) ||
      b.name.toLowerCase().includes(cleanBiomarkerQuery)
    );

    const geneFound = !!matchedGene;
    const biomarkerFound = !!matchedBiomarker;

    const allDisorders = this.getDisorders();
    const disorderMap = new Map<number, {
      disorder: Disorder;
      viaGene: boolean;
      viaBiomarker: boolean;
      evidenceNotes: string[];
      pmids: string[];
    }>();

    // Query gene_disorder directly from database table
    if (matchedGene) {
      const gdStmt = db.prepare('SELECT disorder_id, evidence, pmid FROM gene_disorder WHERE gene_id = ?');
      gdStmt.bind([matchedGene.id]);
      while (gdStmt.step()) {
        const row = gdStmt.getAsObject() as any;
        const dId = Number(row.disorder_id);
        const disorder = allDisorders.find(d => d.id === dId);
        if (disorder) {
          if (!disorderMap.has(dId)) {
            disorderMap.set(dId, {
              disorder,
              viaGene: true,
              viaBiomarker: false,
              evidenceNotes: [`Gene association (${matchedGene.symbol}): ${row.evidence}`],
              pmids: row.pmid ? [row.pmid] : []
            });
          } else {
            const entry = disorderMap.get(dId)!;
            entry.viaGene = true;
            entry.evidenceNotes.push(`Gene association (${matchedGene.symbol}): ${row.evidence}`);
            if (row.pmid && !entry.pmids.includes(row.pmid)) entry.pmids.push(row.pmid);
          }
        }
      }
      gdStmt.free();
    }

    // Query disorder_biomarker directly from database table
    if (matchedBiomarker) {
      const dbStmt = db.prepare('SELECT disorder_id, evidence, pmid FROM disorder_biomarker WHERE biomarker_id = ?');
      dbStmt.bind([matchedBiomarker.id]);
      while (dbStmt.step()) {
        const row = dbStmt.getAsObject() as any;
        const dId = Number(row.disorder_id);
        const disorder = allDisorders.find(d => d.id === dId);
        if (disorder) {
          if (!disorderMap.has(dId)) {
            disorderMap.set(dId, {
              disorder,
              viaGene: false,
              viaBiomarker: true,
              evidenceNotes: [`Biomarker association (${matchedBiomarker.name}): ${row.evidence}`],
              pmids: row.pmid ? [row.pmid] : []
            });
          } else {
            const entry = disorderMap.get(dId)!;
            entry.viaBiomarker = true;
            entry.evidenceNotes.push(`Biomarker association (${matchedBiomarker.name}): ${row.evidence}`);
            if (row.pmid && !entry.pmids.includes(row.pmid)) entry.pmids.push(row.pmid);
          }
        }
      }
      dbStmt.free();
    }

    // Query gene_biomarker directly from database table
    let geneBiomarkerRelationship: { relationship: string; evidence: string; pmid: string; } | undefined;
    if (matchedGene && matchedBiomarker) {
      const gbStmt = db.prepare('SELECT relationship, evidence, pmid FROM gene_biomarker WHERE gene_id = ? AND biomarker_id = ?');
      gbStmt.bind([matchedGene.id, matchedBiomarker.id]);
      if (gbStmt.step()) {
        const row = gbStmt.getAsObject() as any;
        geneBiomarkerRelationship = {
          relationship: row.relationship,
          evidence: row.evidence,
          pmid: row.pmid
        };
      }
      gbStmt.free();
    }

    let associationStatus: 'BOTH_ASSOCIATED' | 'GENE_ONLY' | 'BIOMARKER_ONLY' | 'NO_ASSOCIATION' = 'NO_ASSOCIATION';
    let interpretation = '';

    if (geneFound && biomarkerFound) {
      associationStatus = 'BOTH_ASSOCIATED';
      const disorderNames = Array.from(disorderMap.values()).map(e => e.disorder.name).join(', ');
      interpretation = disorderNames
        ? `The entered gene (${matchedGene.symbol}) and biomarker (${matchedBiomarker.name}) match records in the database with documented associations to: ${disorderNames}.`
        : `The entered gene (${matchedGene.symbol}) and biomarker (${matchedBiomarker.name}) are indexed in the SleepGeneMap database, with distinct homeostatic biological pathways.`;
    } else if (geneFound) {
      associationStatus = 'GENE_ONLY';
      const disorderNames = Array.from(disorderMap.values()).map(e => e.disorder.name).join(', ');
      interpretation = `The entered gene (${matchedGene.symbol}) is associated in the database with: ${disorderNames || 'circadian regulation'}. The biomarker was not matched in the current repository.`;
    } else if (biomarkerFound) {
      associationStatus = 'BIOMARKER_ONLY';
      const disorderNames = Array.from(disorderMap.values()).map(e => e.disorder.name).join(', ');
      interpretation = `The entered biomarker (${matchedBiomarker.name}) matches a biomarker recorded in the database, with documented links to: ${disorderNames || 'sleep physiological pathways'}. The gene symbol was not located in the current database.`;
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

  getNetworkGraph(): NetworkData {
    const db = this.ensureDb();
    const disorders = this.getDisorders();
    const genes = this.getGenes();
    const biomarkers = this.getBiomarkers();

    const nodes: NetworkData['nodes'] = [
      ...disorders.map(d => ({
        id: `disorder-${d.id}`,
        label: d.name,
        type: 'disorder' as const,
        originalId: d.id,
        category: d.category
      })),
      ...genes.map(g => ({
        id: `gene-${g.id}`,
        label: g.symbol,
        type: 'gene' as const,
        originalId: g.id,
        category: g.chromosome
      })),
      ...biomarkers.map(b => ({
        id: `biomarker-${b.id}`,
        label: b.name,
        type: 'biomarker' as const,
        originalId: b.id,
        category: b.type
      }))
    ];

    const links: NetworkData['links'] = [];

    // Query gene_disorder table
    const gdStmt = db.prepare('SELECT gd.gene_id, gd.disorder_id, gd.pmid, g.symbol, d.name FROM gene_disorder gd JOIN genes g ON gd.gene_id = g.id JOIN disorders d ON gd.disorder_id = d.id');
    while (gdStmt.step()) {
      const r = gdStmt.getAsObject() as any;
      links.push({
        source: `gene-${r.gene_id}`,
        target: `disorder-${r.disorder_id}`,
        relationType: 'gene-disorder',
        label: `${r.symbol} → ${r.name}`,
        pmid: r.pmid || ''
      });
    }
    gdStmt.free();

    // Query gene_biomarker table
    const gbStmt = db.prepare('SELECT gene_id, biomarker_id, relationship, pmid FROM gene_biomarker');
    while (gbStmt.step()) {
      const r = gbStmt.getAsObject() as any;
      links.push({
        source: `gene-${r.gene_id}`,
        target: `biomarker-${r.biomarker_id}`,
        relationType: 'gene-biomarker',
        label: r.relationship || '',
        pmid: r.pmid || ''
      });
    }
    gbStmt.free();

    // Query disorder_biomarker table
    const dbStmt = db.prepare('SELECT db.disorder_id, db.biomarker_id, db.pmid, d.name as dname, b.name as bname FROM disorder_biomarker db JOIN disorders d ON db.disorder_id = d.id JOIN biomarkers b ON db.biomarker_id = b.id');
    while (dbStmt.step()) {
      const r = dbStmt.getAsObject() as any;
      links.push({
        source: `disorder-${r.disorder_id}`,
        target: `biomarker-${r.biomarker_id}`,
        relationType: 'disorder-biomarker',
        label: `${r.dname} ↔ ${r.bname}`,
        pmid: r.pmid || ''
      });
    }
    dbStmt.free();

    return { nodes, links };
  }

  getAllReferences(): ScientificReference[] {
    const db = this.ensureDb();
    const stmt = db.prepare('SELECT id, title, authors, journal, publication_year, pmid, doi, source FROM scientific_references ORDER BY id ASC');
    const refs: ScientificReference[] = [];
    while (stmt.step()) {
      const r = stmt.getAsObject() as any;
      refs.push({
        id: Number(r.id),
        title: r.title,
        authors: r.authors,
        journal: r.journal || '',
        year: Number(r.publication_year),
        pmid: r.pmid || '',
        doi: r.doi || '',
        source: r.source || ''
      });
    }
    stmt.free();
    return refs;
  }

  getRelations(): {
    geneDisorders: any[];
    geneBiomarkers: any[];
    disorderBiomarkers: any[];
  } {
    const db = this.ensureDb();

    const gdStmt = db.prepare('SELECT id, gene_id as geneId, disorder_id as disorderId, evidence, pmid, source FROM gene_disorder');
    const geneDisorders: any[] = [];
    while (gdStmt.step()) {
      geneDisorders.push(gdStmt.getAsObject());
    }
    gdStmt.free();

    const gbStmt = db.prepare('SELECT id, gene_id as geneId, biomarker_id as biomarkerId, relationship, evidence, pmid, source FROM gene_biomarker');
    const geneBiomarkers: any[] = [];
    while (gbStmt.step()) {
      geneBiomarkers.push(gbStmt.getAsObject());
    }
    gbStmt.free();

    const dbStmt = db.prepare('SELECT id, disorder_id as disorderId, biomarker_id as biomarkerId, evidence, pmid, source FROM disorder_biomarker');
    const disorderBiomarkers: any[] = [];
    while (dbStmt.step()) {
      disorderBiomarkers.push(dbStmt.getAsObject());
    }
    dbStmt.free();

    return { geneDisorders, geneBiomarkers, disorderBiomarkers };
  }

  getReferencesForIds(ids: number[]): ScientificReference[] {
    if (!ids || ids.length === 0) return [];
    const db = this.ensureDb();
    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`SELECT id, title, authors, journal, publication_year, pmid, doi, source FROM scientific_references WHERE id IN (${placeholders})`);
    stmt.bind(ids);

    const refs: ScientificReference[] = [];
    while (stmt.step()) {
      const r = stmt.getAsObject() as any;
      refs.push({
        id: Number(r.id),
        title: r.title,
        authors: r.authors,
        journal: r.journal || '',
        year: Number(r.publication_year),
        pmid: r.pmid || '',
        doi: r.doi || '',
        source: r.source || ''
      });
    }
    stmt.free();
    return refs;
  }
}

export const database = new SleepGeneDatabase();
