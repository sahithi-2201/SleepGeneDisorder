import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { ACADEMIC_DOCUMENTATION_CHAPTERS, DocumentationChapter } from '../data/academicDocumentation';
import { SPRING_BOOT_CODE_FILES, CodeFile } from '../data/springBootCode';

export const AcademicProjectViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'code' | 'architecture'>('docs');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('pom.xml');
  const [copiedCode, setCopiedCode] = useState(false);

  const currentChapter = ACADEMIC_DOCUMENTATION_CHAPTERS.find(c => c.number === selectedChapterNumber) || ACADEMIC_DOCUMENTATION_CHAPTERS[0];
  const currentFile = SPRING_BOOT_CODE_FILES.find(f => f.path === selectedFilePath) || SPRING_BOOT_CODE_FILES[0];

  const handleCopyFile = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadAll = () => {
    const textBlob = new Blob(
      [
        `# SleepGeneMap - Academic Project Archive\n\n` +
        `Generated for 3rd-Year Bioinformatics Mini Project: Web Technologies for Bioinformatics.\n\n` +
        `=======================================================\n\n` +
        SPRING_BOOT_CODE_FILES.map(f => `--- FILE: ${f.path} ---\n\n${f.content}\n\n`).join('\n')
      ], 
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(textBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SleepGeneMap_SpringBoot_Project_Files.txt';
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
            Project Documentation & Backend Code Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Complete academic project documentation across 14 chapters, system architecture ER diagrams, and full production-ready Java Spring Boot & MySQL source code files.
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
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'docs'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>14-Chapter Project Report</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'code'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Spring Boot Source Files ({SPRING_BOOT_CODE_FILES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'architecture'
              ? 'bg-teal-700 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Architecture & Database ER</span>
        </button>
      </div>

      {/* TAB 1: 14-CHAPTER DOCUMENTATION VIEWER */}
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

      {/* TAB 2: SPRING BOOT SOURCE FILES EXPLORER */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* File Tree Sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 lg:sticky lg:top-20">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block px-2">
              Source File Tree
            </span>
            <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
              {SPRING_BOOT_CODE_FILES.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                    selectedFilePath === file.path
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-mono text-[11px] block">{file.name}</span>
                    <span className="text-[10px] text-slate-400 block group-hover:text-slate-500 font-sans">{file.category}</span>
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
              <div className="flex items-center gap-1.5 font-bold font-mono text-teal-900 uppercase text-[11px]">
                <Info className="w-3.5 h-3.5 text-teal-700" />
                <span>3rd-Year Student Code Explanation: {currentFile.name}</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {currentFile.explanation}
              </p>
            </div>

            {/* Code Box */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{currentFile.path}</span>
                <button
                  onClick={handleCopyFile}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded transition-colors text-xs"
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
      )}

      {/* TAB 3: ARCHITECTURE & DATABASE ER */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Architecture Card */}
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
|                      CLIENT LAYER                           |
|  Angular 17+ (TypeScript, HTML, CSS, Responsive UI)         |
|  Components: Dashboard, Disorders, Genes, Biomarkers,       |
|              Sample Analysis, Network Graph                 |
+-------------------------------------------------------------+
                               |
                        HTTP / JSON REST API
                               v
+-------------------------------------------------------------+
|                   SPRING BOOT BACKEND                       |
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
|                     DATABASE LAYER                          |
|  MySQL 8.0: database 'sleepgenemap'                         |
|  Tables: disorders, genes, biomarkers, gene_disorder,       |
|          gene_biomarker, disorder_biomarker, references     |
+-------------------------------------------------------------+`}
            </pre>
          </div>

          {/* Database ER Schema */}
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
