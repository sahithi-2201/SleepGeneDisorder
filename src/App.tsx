/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { DisorderExplorer } from './components/DisorderExplorer';
import { GeneExplorer } from './components/GeneExplorer';
import { BiomarkerExplorer } from './components/BiomarkerExplorer';
import { SampleAnalysis } from './components/SampleAnalysis';
import { NetworkVisualization } from './components/NetworkVisualization';
import { AcademicProjectViewer } from './components/AcademicProjectViewer';
import { DataSourcesAndEvidence } from './components/DataSourcesAndEvidence';
import { DisorderDetailModal } from './components/DisorderDetailModal';
import { GeneDetailModal } from './components/GeneDetailModal';
import { BiomarkerDetailModal } from './components/BiomarkerDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { 
  Disorder, 
  Gene, 
  Biomarker, 
  DatabaseStatistics,
  ScientificReference,
  MEDICAL_DISCLAIMER_TEXT 
} from './types/bioinformatics';
import { api } from './services/api';
import { Dna, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  // Database-driven state fetched dynamically via REST APIs
  const [statistics, setStatistics] = useState<DatabaseStatistics>({
    totalDisorders: 0,
    totalGenes: 0,
    totalBiomarkers: 0,
    geneDisorderAssociations: 0,
    geneBiomarkerAssociations: 0,
    disorderBiomarkerAssociations: 0,
    totalReferences: 0
  });
  const [disorders, setDisorders] = useState<Disorder[]>([]);
  const [genes, setGenes] = useState<Gene[]>([]);
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [references, setReferences] = useState<ScientificReference[]>([]);
  const [relations, setRelations] = useState<{
    geneDisorders: any[];
    geneBiomarkers: any[];
    disorderBiomarkers: any[];
  }>({ geneDisorders: [], geneBiomarkers: [], disorderBiomarkers: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedDisorder, setSelectedDisorder] = useState<Disorder | null>(null);
  const [selectedGene, setSelectedGene] = useState<Gene | null>(null);
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  // Fetch all dataset tables dynamically from the relational SQL database
  const loadDatabaseData = async () => {
    setIsLoading(true);
    try {
      const [statsData, disordersData, genesData, biomarkersData, refsData, relationsData] = await Promise.all([
        api.getStatistics().catch(() => null),
        api.getDisorders().catch(() => []),
        api.getGenes().catch(() => []),
        api.getBiomarkers().catch(() => []),
        api.getReferences().catch(() => []),
        api.getRelations().catch(() => ({ geneDisorders: [], geneBiomarkers: [], disorderBiomarkers: [] }))
      ]);

      if (statsData) setStatistics(statsData);
      setDisorders(disordersData || []);
      setGenes(genesData || []);
      setBiomarkers(biomarkersData || []);
      setReferences(refsData || []);
      setRelations(relationsData);
    } catch (err) {
      console.error('Failed to load database records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, []);

  // Global hotkey: '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchInitialQuery('');
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickSearch = (query: string) => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => {
          setSearchInitialQuery('');
          setIsSearchOpen(true);
        }}
      />

      {/* Database Connection Status Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-300">
              Database: <strong className="text-white">Relational SQL Engine</strong> (/database/schema.sql & /database/data.sql)
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
              Live Tables: {disorders.length} disorders, {genes.length} genes, {biomarkers.length} biomarkers
            </span>
          </div>

          <button
            onClick={loadDatabaseData}
            disabled={isLoading}
            className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 transition-colors disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh from DB</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            statistics={statistics}
            onNavigate={setActiveTab}
            onQuickSearch={handleQuickSearch}
            onSelectDisorder={setSelectedDisorder}
            onSelectGene={setSelectedGene}
            onSelectBiomarker={setSelectedBiomarker}
            disorders={disorders}
            genes={genes}
            biomarkers={biomarkers}
          />
        )}

        {activeTab === 'disorders' && (
          <DisorderExplorer
            disorders={disorders}
            genes={genes}
            biomarkers={biomarkers}
            onSelectDisorder={setSelectedDisorder}
            onSelectGene={setSelectedGene}
            onSelectBiomarker={setSelectedBiomarker}
          />
        )}

        {activeTab === 'genes' && (
          <GeneExplorer
            genes={genes}
            disorders={disorders}
            biomarkers={biomarkers}
            onSelectGene={setSelectedGene}
            onSelectDisorder={setSelectedDisorder}
            onSelectBiomarker={setSelectedBiomarker}
          />
        )}

        {activeTab === 'biomarkers' && (
          <BiomarkerExplorer
            biomarkers={biomarkers}
            disorders={disorders}
            genes={genes}
            onSelectBiomarker={setSelectedBiomarker}
            onSelectDisorder={setSelectedDisorder}
            onSelectGene={setSelectedGene}
          />
        )}

        {activeTab === 'analysis' && (
          <SampleAnalysis
            onSelectDisorder={setSelectedDisorder}
            onSelectGene={setSelectedGene}
            onSelectBiomarker={setSelectedBiomarker}
            genes={genes}
            biomarkers={biomarkers}
          />
        )}

        {activeTab === 'network' && (
          <NetworkVisualization
            onSelectDisorder={setSelectedDisorder}
            onSelectGene={setSelectedGene}
            onSelectBiomarker={setSelectedBiomarker}
            disorders={disorders}
            genes={genes}
            biomarkers={biomarkers}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicProjectViewer />
        )}

        {activeTab === 'datasources' && (
          <DataSourcesAndEvidence statistics={statistics} />
        )}
      </main>

      {/* Modals for Deep Inspection */}
      <DisorderDetailModal
        disorder={selectedDisorder}
        onClose={() => setSelectedDisorder(null)}
        onSelectGene={(gene) => {
          setSelectedDisorder(null);
          setSelectedGene(gene);
        }}
        onSelectBiomarker={(biomarker) => {
          setSelectedDisorder(null);
          setSelectedBiomarker(biomarker);
        }}
        genes={genes}
        biomarkers={biomarkers}
        references={references}
        relations={relations}
      />

      <GeneDetailModal
        gene={selectedGene}
        onClose={() => setSelectedGene(null)}
        onSelectDisorder={(disorder) => {
          setSelectedGene(null);
          setSelectedDisorder(disorder);
        }}
        onSelectBiomarker={(biomarker) => {
          setSelectedGene(null);
          setSelectedBiomarker(biomarker);
        }}
        disorders={disorders}
        biomarkers={biomarkers}
        relations={relations}
      />

      <BiomarkerDetailModal
        biomarker={selectedBiomarker}
        onClose={() => setSelectedBiomarker(null)}
        onSelectDisorder={(disorder) => {
          setSelectedBiomarker(null);
          setSelectedDisorder(disorder);
        }}
        onSelectGene={(gene) => {
          setSelectedBiomarker(null);
          setSelectedGene(gene);
        }}
        disorders={disorders}
        genes={genes}
        references={references}
        relations={relations}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchInitialQuery}
        references={references}
        onSelectDisorder={(disorder) => {
          setIsSearchOpen(false);
          setSelectedDisorder(disorder);
        }}
        onSelectGene={(gene) => {
          setIsSearchOpen(false);
          setSelectedGene(gene);
        }}
        onSelectBiomarker={(biomarker) => {
          setIsSearchOpen(false);
          setSelectedBiomarker(biomarker);
        }}
      />

      {/* Global Academic & Research Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-teal-600 text-white flex items-center justify-center">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm">SleepGeneMap</span>
                <span className="text-slate-400 text-xs ml-2">Sleep Disorder Gene & Biomarker Explorer</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <button 
                onClick={() => setActiveTab('datasources')} 
                className="hover:text-teal-700 font-semibold text-teal-800 transition-colors"
              >
                Data Sources & Evidence
              </button>
              <button 
                onClick={() => setActiveTab('academic')} 
                className="hover:text-teal-700 transition-colors"
              >
                14-Chapter Documentation
              </button>
              <button 
                onClick={() => setActiveTab('analysis')} 
                className="hover:text-teal-700 transition-colors"
              >
                Sample Analysis
              </button>
              <button 
                onClick={() => setActiveTab('network')} 
                className="hover:text-teal-700 transition-colors"
              >
                Network Graph
              </button>
              <a 
                href="https://www.ncbi.nlm.nih.gov/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-teal-700 transition-colors"
              >
                NCBI Entrez
              </a>
              <a 
                href="https://www.uniprot.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-teal-700 transition-colors"
              >
                UniProtKB
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
            <p>
              Developed as a 3rd-year bioinformatics mini project for <em>Web Technologies for Bioinformatics</em>.
            </p>
            <p className="font-mono text-[11px]">
              Java 17 · Spring Boot 3.2 · MySQL 8.0 · Angular / React · REST API
            </p>
          </div>

          {/* Minimal Persistent Safety Disclaimer */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
            <span className="font-semibold text-slate-700">Notice: </span>
            {MEDICAL_DISCLAIMER_TEXT}
          </div>
        </div>
      </footer>
    </div>
  );
}
