import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { database } from './server/database.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Initialize relational SQL database directly from database/schema.sql and database/data.sql
  await database.init();

  app.use(express.json());

  // REST API Endpoints fetching directly from the relational database
  app.get('/api/statistics', (_req, res) => {
    res.json(database.getStatistics());
  });

  app.get('/api/disorders', (req, res) => {
    const category = req.query.category as string | undefined;
    res.json(database.getDisorders(category));
  });

  app.get('/api/disorders/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const disorder = database.getDisorderById(id);
    if (!disorder) {
      return res.status(404).json({ error: 'Disorder not found', message: `No disorder found with ID ${id}` });
    }
    res.json(disorder);
  });

  app.get('/api/genes/search', (req, res) => {
    const query = (req.query.query as string || '').toLowerCase().trim();
    res.json(database.searchGenes(query));
  });

  app.get('/api/genes', (_req, res) => {
    res.json(database.getGenes());
  });

  app.get('/api/genes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const gene = database.getGeneById(id);
    if (!gene) {
      return res.status(404).json({ error: 'Gene not found', message: `No gene found with ID ${id}` });
    }
    res.json(gene);
  });

  app.get('/api/biomarkers/search', (req, res) => {
    const query = (req.query.query as string || '').toLowerCase().trim();
    res.json(database.searchBiomarkers(query));
  });

  app.get('/api/biomarkers', (req, res) => {
    const type = req.query.type as string | undefined;
    res.json(database.getBiomarkers(type));
  });

  app.get('/api/biomarkers/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const biomarker = database.getBiomarkerById(id);
    if (!biomarker) {
      return res.status(404).json({ error: 'Biomarker not found', message: `No biomarker found with ID ${id}` });
    }
    res.json(biomarker);
  });

  app.get('/api/search', (req, res) => {
    const query = (req.query.query as string || '').toLowerCase().trim();
    res.json(database.searchAll(query));
  });

  app.post('/api/analyze', (req, res) => {
    const { sampleId, gene, biomarker } = req.body;
    if (!gene && !biomarker) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'At least one of gene or biomarker must be provided for analysis.' 
      });
    }

    const result = database.analyzeSample(req.body);
    res.json(result);
  });

  app.get('/api/graph', (_req, res) => {
    res.json(database.getNetworkGraph());
  });

  app.get('/api/references', (req, res) => {
    const idsParam = req.query.ids as string | undefined;
    if (idsParam) {
      const ids = idsParam.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
      return res.json(database.getReferencesForIds(ids));
    }
    res.json(database.getAllReferences());
  });

  app.get('/api/relations', (_req, res) => {
    res.json(database.getRelations());
  });

  // Dynamic file loader endpoint for inspecting the real physical backend and database folders
  app.get('/api/project-files', (_req, res) => {
    try {
      const results: Array<{
        path: string;
        name: string;
        category: string;
        language: string;
        content: string;
        explanation: string;
      }> = [];

      function scanDir(dir: string, baseDir: string) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

          if (entry.isDirectory()) {
            scanDir(fullPath, baseDir);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            let language = 'markdown';
            if (ext === '.java') language = 'java';
            else if (ext === '.xml') language = 'xml';
            else if (ext === '.sql') language = 'sql';
            else if (ext === '.properties') language = 'properties';

            let category = 'Source Code';
            if (relPath.includes('/model/')) category = 'Model / Entity';
            else if (relPath.includes('/repository/')) category = 'Repository';
            else if (relPath.includes('/service/')) category = 'Service';
            else if (relPath.includes('/controller/')) category = 'Controller';
            else if (relPath.includes('/dto/')) category = 'DTO';
            else if (relPath.endsWith('.sql')) category = 'Database SQL';
            else if (relPath.endsWith('.properties') || relPath.endsWith('pom.xml')) category = 'Configuration';
            else if (relPath.endsWith('.md')) category = 'Documentation';

            const content = fs.readFileSync(fullPath, 'utf-8');
            let explanation = `Direct physical file located on disk at ${relPath}.`;
            if (relPath.includes('pom.xml')) {
              explanation = 'Maven POM configuration defining Spring Boot starter web, JPA, MySQL driver, and H2 testing dependencies.';
            } else if (relPath.includes('Disorder.java')) {
              explanation = 'JPA persistent entity for sleep disorders mapping to the "disorders" table.';
            } else if (relPath.includes('Gene.java')) {
              explanation = 'JPA entity mapping human genes with official HGNC symbols, NCBI Gene IDs, and UniProt accessions.';
            } else if (relPath.includes('Biomarker.java')) {
              explanation = 'JPA entity for biomarkers cataloging hormones, cytokines, neuropeptides, and polysomnographic indices.';
            } else if (relPath.includes('AnalysisService.java')) {
              explanation = 'Core business logic correlating sample genes and biomarkers against relational database tables.';
            } else if (relPath.includes('AnalysisController.java')) {
              explanation = 'Spring REST controller handling POST /api/analyze requests from the frontend.';
            } else if (relPath.includes('schema.sql')) {
              explanation = 'Relational MySQL DDL script with foreign keys, junction tables, and performance indexes.';
            } else if (relPath.includes('data.sql')) {
              explanation = 'Curated biological starter dataset with verified PubMed PMIDs and NCBI accessions.';
            }

            results.push({
              path: relPath,
              name: entry.name,
              category,
              language,
              content,
              explanation
            });
          }
        }
      }

      scanDir(path.resolve(__dirname, 'backend'), __dirname);
      scanDir(path.resolve(__dirname, 'database'), __dirname);

      res.json(results);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to read project files', message: err.message });
    }
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
