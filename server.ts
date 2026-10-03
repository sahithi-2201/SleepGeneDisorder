import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  DISORDERS, 
  GENES, 
  BIOMARKERS, 
  SCIENTIFIC_REFERENCES, 
  DATABASE_STATISTICS, 
  GENE_DISORDER_RELATIONS, 
  GENE_BIOMARKER_RELATIONS, 
  DISORDER_BIOMARKER_RELATIONS 
} from './src/data/bioData';
import { runSampleAnalysis } from './src/services/analysisEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // REST API Endpoints matching Spring Boot specification
  app.get('/api/statistics', (_req, res) => {
    res.json(DATABASE_STATISTICS);
  });

  app.get('/api/disorders', (_req, res) => {
    res.json(DISORDERS);
  });

  app.get('/api/disorders/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const disorder = DISORDERS.find(d => d.id === id);
    if (!disorder) {
      return res.status(404).json({ error: 'Disorder not found', message: `No disorder found with ID ${id}` });
    }
    res.json(disorder);
  });

  app.get('/api/genes/search', (req, res) => {
    const query = (req.query.query as string || '').toLowerCase().trim();
    if (!query) {
      return res.json([]);
    }
    const results = GENES.filter(g => 
      g.symbol.toLowerCase().includes(query) ||
      g.name.toLowerCase().includes(query) ||
      g.ncbiId.toString().includes(query) ||
      g.uniprotId.toLowerCase().includes(query)
    );
    res.json(results);
  });

  app.get('/api/genes', (_req, res) => {
    res.json(GENES);
  });

  app.get('/api/genes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const gene = GENES.find(g => g.id === id);
    if (!gene) {
      return res.status(404).json({ error: 'Gene not found', message: `No gene found with ID ${id}` });
    }
    res.json(gene);
  });

  app.get('/api/biomarkers/search', (req, res) => {
    const query = (req.query.query as string || '').toLowerCase().trim();
    if (!query) {
      return res.json([]);
    }
    const results = BIOMARKERS.filter(b => 
      b.name.toLowerCase().includes(query) ||
      b.type.toLowerCase().includes(query) ||
      b.sampleType.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query)
    );
    res.json(results);
  });

  app.get('/api/biomarkers', (_req, res) => {
    res.json(BIOMARKERS);
  });

  app.get('/api/biomarkers/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const biomarker = BIOMARKERS.find(b => b.id === id);
    if (!biomarker) {
      return res.status(404).json({ error: 'Biomarker not found', message: `No biomarker found with ID ${id}` });
    }
    res.json(biomarker);
  });

  app.get('/api/search', (req, res) => {
    const query = (req.query.query as string || '').toLowerCase().trim();
    if (!query) {
      return res.json({ disorders: [], genes: [], biomarkers: [] });
    }

    const matchedDisorders = DISORDERS.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.description.toLowerCase().includes(query) || 
      d.category.toLowerCase().includes(query) || 
      d.synonyms.toLowerCase().includes(query)
    );

    const matchedGenes = GENES.filter(g => 
      g.symbol.toLowerCase().includes(query) || 
      g.name.toLowerCase().includes(query) || 
      g.ncbiId.toString().includes(query) || 
      g.uniprotId.toLowerCase().includes(query) ||
      g.chromosome.toLowerCase().includes(query)
    );

    const matchedBiomarkers = BIOMARKERS.filter(b => 
      b.name.toLowerCase().includes(query) || 
      b.type.toLowerCase().includes(query) || 
      b.sampleType.toLowerCase().includes(query) || 
      b.description.toLowerCase().includes(query)
    );

    res.json({
      query,
      disorders: matchedDisorders,
      genes: matchedGenes,
      biomarkers: matchedBiomarkers
    });
  });

  app.post('/api/analyze', (req, res) => {
    const { sampleId, gene, biomarker, geneResult, biomarkerValue, biomarkerUnit } = req.body;
    if (!gene && !biomarker) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'At least one of gene or biomarker must be provided for analysis.' 
      });
    }

    const result = runSampleAnalysis({
      sampleId: sampleId || 'SAMPLE_UNSPECIFIED',
      gene: gene || '',
      biomarker: biomarker || '',
      geneResult,
      biomarkerValue,
      biomarkerUnit
    });

    res.json(result);
  });

  app.get('/api/graph', (_req, res) => {
    const nodes = [
      ...DISORDERS.map(d => ({
        id: `disorder-${d.id}`,
        label: d.name,
        type: 'disorder',
        originalId: d.id,
        category: d.category
      })),
      ...GENES.map(g => ({
        id: `gene-${g.id}`,
        label: g.symbol,
        type: 'gene',
        originalId: g.id,
        category: g.chromosome
      })),
      ...BIOMARKERS.map(b => ({
        id: `biomarker-${b.id}`,
        label: b.name,
        type: 'biomarker',
        originalId: b.id,
        category: b.type
      }))
    ];

    const links = [
      ...GENE_DISORDER_RELATIONS.map(r => {
        const g = GENES.find(gene => gene.id === r.geneId);
        const d = DISORDERS.find(disorder => disorder.id === r.disorderId);
        return {
          source: `gene-${r.geneId}`,
          target: `disorder-${r.disorderId}`,
          relationType: 'gene-disorder',
          label: `${g?.symbol || ''} → ${d?.name || ''}`,
          pmid: r.pmid
        };
      }),
      ...GENE_BIOMARKER_RELATIONS.map(r => ({
        source: `gene-${r.geneId}`,
        target: `biomarker-${r.biomarkerId}`,
        relationType: 'gene-biomarker',
        label: r.relationship,
        pmid: r.pmid
      })),
      ...DISORDER_BIOMARKER_RELATIONS.map(r => {
        const d = DISORDERS.find(disorder => disorder.id === r.disorderId);
        const b = BIOMARKERS.find(biomarker => biomarker.id === r.biomarkerId);
        return {
          source: `disorder-${r.disorderId}`,
          target: `biomarker-${r.biomarkerId}`,
          relationType: 'disorder-biomarker',
          label: `${d?.name || ''} ↔ ${b?.name || ''}`,
          pmid: r.pmid
        };
      })
    ];

    res.json({ nodes, links });
  });

  // Vite middleware in dev or static files in production
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SleepGeneMap] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
