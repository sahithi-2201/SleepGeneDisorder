import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Code, 
  Database, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  ExternalLink, 
  ChevronRight,
  Sparkles,
  Info,
  Folder,
  FolderOpen,
  FolderTree,
  Terminal,
  Server
} from 'lucide-react';
import { ACADEMIC_DOCUMENTATION_CHAPTERS, DocumentationChapter } from '../data/academicDocumentation';
import { ProjectFile } from '../types/bioinformatics';
import { api } from '../services/api';

export const AcademicProjectViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'folders' | 'code' | 'docs' | 'architecture'>('folders');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('backend/pom.xml');
  const [codeFiles, setCodeFiles] = useState<ProjectFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [folderFilter, setFolderFilter] = useState<'All' | 'backend' | 'database'>('All');

  // Load live files directly from disk via /api/project-files
  useEffect(() => {
    setLoadingFiles(true);
    api.getProjectFiles().then((liveFiles) => {
      if (liveFiles && liveFiles.length > 0) {
        setCodeFiles(liveFiles);
      }
      setLoadingFiles(false);
    }).catch(() => {
      setLoadingFiles(false);
    });
  }, []);

  const currentChapter = ACADEMIC_DOCUMENTATION_CHAPTERS.find(c => c.number === selectedChapterNumber) || ACADEMIC_DOCUMENTATION_CHAPTERS[0];
  const currentFile = codeFiles.find(f => f.path === selectedFilePath || f.path.endsWith(selectedFilePath)) || codeFiles[0];

  const filteredCodeFiles = codeFiles.filter(f => {
    if (folderFilter === 'backend') return f.path.startsWith('backend');
    if (folderFilter === 'database') return f.path.startsWith('database');
    return true;
  });

  const handleCopyFile = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadAll = () => {
    const textBlob = new Blob(
      [
        `# SleepGeneMap - Full Multi-Tier Project Source Files\n\n` +
        `Generated for 3rd-Year Bioinformatics Mini Project: Web Technologies for Bioinformatics.\n\n` +
        `=======================================================\n\n` +
        codeFiles.map(f => `--- FILE: ${f.path} ---\n\n${f.content}\n\n`).join('\n')
      ], 
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SleepGeneMap_Project_Files.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <span>Student Academic Portfolio & Codebase</span>
            <span aria-hidden="true">·</span>
            <span>Subject: Web Technologies for Bioinformatics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Project Architecture & Source Code
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Clean architectural separation between the <strong>Frontend UI</strong> (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">src/</code>), <strong>Spring Boot Backend</strong> (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">backend/</code>), and <strong>Relational Database</strong> (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">database/</code>).
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleDownloadAll}
          className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Source Files</span>
        </button>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('folders')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'folders'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Folder Structure & Separation</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'code'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Backend Files ({codeFiles.length} on disk)</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'docs'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>14-Chapter Project Report</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Architecture & Database ER</span>
        </button>
      </div>

      {/* TAB: FOLDER STRUCTURE & DECOUPLING */}
      {activeTab === 'folders' && (
        <div className="space-y-6">
          {/* Separation Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Folder 1: Backend */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-teal-700">
                <Server className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 font-mono text-sm">backend/</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contains the complete standalone <strong>Java 17 + Spring Boot 3</strong> application. Includes Maven <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">pom.xml</code>, JPA entities, repositories, services, controllers, DTOs, and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">application.properties</code>.
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
                <div>• mvn clean install</div>
                <div>• mvn spring-boot:run</div>
                <div>• Port: 8080 (REST API)</div>
              </div>
              <button
                onClick={() => { setActiveTab('code'); setFolderFilter('backend'); }}
                className="w-full py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <span>Browse Java Files</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Folder 2: Database */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                <Database className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 font-mono text-sm">database/</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contains dedicated <strong>MySQL 8.0 DDL & DML scripts</strong>: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">schema.sql</code> (tables, foreign keys, indexes) and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">data.sql</code> (verified biological records).
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
                <div>• mysql &lt; schema.sql</div>
                <div>• mysql &lt; data.sql</div>
                <div>• Database: sleepgenemap</div>
              </div>
              <button
                onClick={() => { 
                  setActiveTab('code'); 
                  setFolderFilter('database');
                  const dbFile = codeFiles.find(f => f.path.startsWith('database'));
                  if (dbFile) setSelectedFilePath(dbFile.path);
                }}
                className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <span>Browse SQL Scripts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Folder 3: Frontend */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-700">
                <Folder className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 font-mono text-sm">src/ (UI Layer)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated client application directory. Houses modular UI components (Dashboard, Explorers, Sample Analysis, SVG Network Visualizer), API client services, and types.
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
                <div>• npm install</div>
                <div>• npm run dev</div>
                <div>• Port: 3000 / 4200</div>
              </div>
              <div className="w-full py-1.5 px-3 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-lg text-center">
                Active Interactive UI
              </div>
            </div>
          </div>

          {/* Directory Hierarchy View */}
          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-slate-200 font-mono text-xs shadow-xl space-y-3">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-teal-400">SleepGeneMap Monorepo Directory Architecture</span>
              <span>Root Workspace</span>
            </div>
            <pre className="overflow-x-auto leading-relaxed text-slate-300">
{`sleepgenemap/
├── backend/                                   <--- Java Spring Boot Enterprise Backend
│   ├── pom.xml                                <--- Maven build & dependency descriptors
│   ├── README.md                              <--- Backend installation and run guide
│   └── src/
│       └── main/
│           ├── java/com/sleepgenemap/
│           │   ├── SleepGeneMapApplication.java<--- Application main entry point
│           │   ├── controller/                <--- Spring REST API Controllers
│           │   │   ├── DisorderController.java
│           │   │   ├── GeneController.java
│           │   │   ├── BiomarkerController.java
│           │   │   ├── AnalysisController.java
│           │   │   ├── SearchController.java
│           │   │   └── StatisticsController.java
│           │   ├── service/                   <--- Business Logic & Match Engine
│           │   │   ├── DisorderService.java
│           │   │   ├── GeneService.java
│           │   │   ├── BiomarkerService.java
│           │   │   └── AnalysisService.java
│           │   ├── repository/                <--- Spring Data JPA Repositories
│           │   │   ├── DisorderRepository.java
│           │   │   ├── GeneRepository.java
│           │   │   ├── BiomarkerRepository.java
│           │   │   ├── GeneDisorderRepository.java
│           │   │   ├── GeneBiomarkerRepository.java
│           │   │   └── DisorderBiomarkerRepository.java
│           │   ├── model/                     <--- JPA Relational Entities
│           │   │   ├── Disorder.java
│           │   │   ├── Gene.java
│           │   │   ├── Biomarker.java
│           │   │   ├── GeneDisorder.java
│           │   │   ├── GeneBiomarker.java
│           │   │   ├── DisorderBiomarker.java
│           │   │   └── ScientificReference.java
│           │   └── dto/                       <--- Request & Response DTOs
│           │       ├── AnalysisRequest.java
│           │       ├── AnalysisResponse.java
│           │       ├── SearchResponse.java
│           │       └── StatisticsResponse.java
│           └── resources/
│               ├── application.properties     <--- Datasource & Hibernate config
│               ├── schema.sql                 <--- DDL table schemas
│               └── data.sql                   <--- Biological starter records
│
├── database/                                  <--- Relational Database Directory
│   ├── schema.sql                             <--- Clean MySQL 8.0 DDL table schemas
│   └── data.sql                               <--- Verified biological dataset seed data
│
└── src/                                       <--- Frontend User Interface
    ├── components/                            <--- Dashboard, Explorers, Analysis, Graph
    ├── services/                              <--- REST API fetch client & match fallback
    ├── types/                                 <--- Strict TypeScript bioinformatics interfaces
    ├── App.tsx                                <--- Frontend Application root
    ├── main.tsx                               <--- DOM hydration
    └── index.css                              <--- Tailwind CSS styling`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB: BACKEND CODE VIEWER */}
      {activeTab === 'code' && (
        loadingFiles ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-mono text-xs">
            Reading physical backend and database files from disk via REST API...
          </div>
        ) : !currentFile ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-mono text-xs">
            No source files found on disk.
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* File Tree Sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 lg:sticky lg:top-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                Physical Files on Disk
              </span>
              <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold">
                {filteredCodeFiles.length} files
              </span>
            </div>

            {/* Folder filter buttons */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setFolderFilter('All')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  folderFilter === 'All' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFolderFilter('backend')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  folderFilter === 'backend' ? 'bg-white font-bold text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                backend/
              </button>
              <button
                onClick={() => setFolderFilter('database')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  folderFilter === 'database' ? 'bg-white font-bold text-amber-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                database/
              </button>
            </div>

            <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
              {filteredCodeFiles.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                    selectedFilePath === file.path || currentFile.path === file.path
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-mono text-[11px] block">{file.name}</span>
                    <span className="text-[10px] text-slate-400 block group-hover:text-slate-500 font-sans truncate">
                      {file.path}
                    </span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* File Code Viewer and Explanation */}
          <div className="lg:col-span-3 space-y-4">
            {/* Student Explanation Card */}
            <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-4 text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold font-mono text-teal-900 uppercase text-[11px]">
                  <Info className="w-3.5 h-3.5 text-teal-700" />
                  <span>File Details: {currentFile.name}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-semibold">
                  {currentFile.category}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {currentFile.explanation}
              </p>
              <div className="text-[11px] text-slate-500 font-mono pt-1">
                Physical file location: <strong className="text-slate-800">{currentFile.path}</strong>
              </div>
            </div>

            {/* Code Box */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{currentFile.path}</span>
                <button
                  onClick={handleCopyFile}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded transition-colors text-xs font-sans"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-5 text-slate-200 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
                <code>{currentFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
        )
      )}

      {/* TAB: 14-CHAPTER DOCUMENTATION */}
      {activeTab === 'docs' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Chapter Table of Contents Sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-1 lg:sticky lg:top-20">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-3 px-2">
              Report Table of Contents
            </span>
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {ACADEMIC_DOCUMENTATION_CHAPTERS.map(ch => (
                <button
                  key={ch.number}
                  onClick={() => setSelectedChapterNumber(ch.number)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedChapterNumber === ch.number
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">
                    Ch {ch.number}. {ch.title}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Content Pane */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider block mb-1">
                Chapter {currentChapter.number}
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentChapter.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentChapter.subtitle}
              </p>
            </div>

            {/* Markdown-style content renderer */}
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed space-y-4">
              {currentChapter.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.startsWith('```')) {
                  const cleaned = paragraph.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');
                  return (
                    <pre key={idx} className="p-4 bg-slate-900 text-teal-300 font-mono text-xs rounded-xl overflow-x-auto leading-normal">
                      <code>{cleaned}</code>
                    </pre>
                  );
                } else if (paragraph.startsWith('| ')) {
                  const lines = paragraph.trim().split('\n');
                  const headerCols = lines[0].split('|').filter(c => c.trim());
                  const dataRows = lines.slice(2);
                  return (
                    <div key={idx} className="overflow-x-auto my-3">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 font-mono uppercase text-slate-700">
                            {headerCols.map((col, cIdx) => (
                              <th key={cIdx} className="p-2.5">{col.trim()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dataRows.map((r, rIdx) => {
                            const cells = r.split('|').filter(c => c.trim());
                            return (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {cells.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2.5 font-mono">{cell.trim()}</td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                } else if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
                      {items.map((item, iIdx) => (
                        <li key={iIdx}>
                          {item.replace(/^- /, '')}
                        </li>
                      ))}
                    </ul>
                  );
                } else if (/^\d+\.\s/.test(paragraph)) {
                  const items = paragraph.split('\n');
                  return (
                    <ol key={idx} className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
                      {items.map((item, iIdx) => (
                        <li key={iIdx}>
                          {item.replace(/^\d+\.\s/, '')}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                disabled={currentChapter.number === 1}
                onClick={() => setSelectedChapterNumber(n => Math.max(1, n - 1))}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded border border-slate-200"
              >
                ← Previous Chapter
              </button>
              <span className="text-xs font-mono text-slate-400">
                Chapter {currentChapter.number} of {ACADEMIC_DOCUMENTATION_CHAPTERS.length}
              </span>
              <button
                disabled={currentChapter.number === ACADEMIC_DOCUMENTATION_CHAPTERS.length}
                onClick={() => setSelectedChapterNumber(n => Math.min(ACADEMIC_DOCUMENTATION_CHAPTERS.length, n + 1))}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded border border-slate-200"
              >
                Next Chapter →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ARCHITECTURE & DATABASE ER */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              <span>Full-Stack Application Architecture</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              SleepGeneMap implements a multi-tier enterprise architecture. The Angular frontend initiates asynchronous HTTP requests to Spring Boot REST API controllers, which utilize Spring Data JPA and Hibernate ORM to query the relational MySQL database.
            </p>

            <pre className="p-4 bg-slate-900 text-teal-300 font-mono text-xs rounded-xl overflow-x-auto leading-normal">
{`+-------------------------------------------------------------+
|                      CLIENT LAYER (src/)                    |
|  Angular / Web App: Reactive Components, Form Validation,   |
|  Interactive Network Graph, Sample Analysis UI              |
+-------------------------------------------------------------+
                               |
                        HTTP / JSON REST API
                               v
+-------------------------------------------------------------+
|                SPRING BOOT BACKEND (backend/)               |
|  Controller Layer: DisorderController, GeneController,      |
|                    BiomarkerController, AnalysisController  |
|                                                             |
|  Service Layer: DisorderService, GeneService,               |
|                 BiomarkerService, AnalysisService           |
|                                                             |
|  Repository Layer: Spring Data JPA interfaces               |
+-------------------------------------------------------------+
                               |
                         Hibernate / JDBC
                               v
+-------------------------------------------------------------+
|                 DATABASE LAYER (database/)                  |
|  MySQL 8.0: database 'sleepgenemap'                         |
|  Tables: disorders, genes, biomarkers, gene_disorder,       |
|          gene_biomarker, disorder_biomarker, references     |
+-------------------------------------------------------------+`}
            </pre>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              <span>Relational Entity-Relationship (ER) Schema</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The database establishes many-to-many associations through junction tables (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">gene_disorder</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">gene_biomarker</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">disorder_biomarker</code>), preserving primary PubMed PMID evidence strings and mechanistic descriptions.
            </p>

            <pre className="p-4 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl overflow-x-auto leading-normal">
{`     +-------------------+              +-------------------+
     |     disorders     |              |       genes       |
     +-------------------+              +-------------------+
     | PK id             |              | PK id             |
     |    name           |              |    symbol         |
     |    description    |              |    name           |
     |    category       |              |    ncbi_id        |
     |    synonyms       |              |    uniprot_id     |
     |    icd11_code     |              |    chromosome     |
     +-------------------+              |    description    |
               |                        +-------------------+
               | 1                                | 1
               |                                  |
               | N                                | N
     +-------------------+              +-------------------+
     | disorder_biomarker|              |   gene_disorder   |
     +-------------------+              +-------------------+
     | PK id             |              | PK id             |
     | FK disorder_id    |              | FK gene_id        |
     | FK biomarker_id   |              | FK disorder_id    |
     |    evidence       |              |    evidence       |
     |    pmid           |              |    pmid           |
     +-------------------+              +-------------------+
               | N                                |
               |                                  |
               | 1                                | N
     +-------------------+              +-------------------+
     |    biomarkers     |<-------------|   gene_biomarker  |
     +-------------------+ 1            +-------------------+
     | PK id             |              | PK id             |
     |    name           |              | FK gene_id        |
     |    type           |              | FK biomarker_id   |
     |    sample_type    |              |    relationship   |
     |    description    |              |    evidence       |
     |    standard_unit  |              |    pmid           |
     |    reference_range|              +-------------------+
     +-------------------+`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
