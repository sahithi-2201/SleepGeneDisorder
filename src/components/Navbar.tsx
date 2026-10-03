import React from 'react';
import { 
  Dna, 
  Search, 
  Activity, 
  Brain, 
  Sparkles, 
  Network, 
  BookOpen, 
  Layers 
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'disorders' 
  | 'genes' 
  | 'biomarkers' 
  | 'analysis' 
  | 'network' 
  | 'datasources'
  | 'academic';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onSelectTab, 
  onOpenSearch 
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  SleepGeneMap
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-mono text-slate-400">
                  v1.0-bioinf
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onSelectTab('disorders')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'disorders'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Disorders
            </button>

            <button
              onClick={() => onSelectTab('genes')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'genes'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Genes
            </button>

            <button
              onClick={() => onSelectTab('biomarkers')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'biomarkers'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Biomarkers
            </button>

            <button
              onClick={() => onSelectTab('analysis')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'analysis'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <span>Sample Analysis</span>
            </button>

            <button
              onClick={() => onSelectTab('network')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'network'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Network Graph
            </button>

            <button
              onClick={() => onSelectTab('datasources')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'datasources'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Data Sources & Evidence
            </button>

            <button
              onClick={() => onSelectTab('academic')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'academic'
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Project Docs & Code
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 rounded-lg transition-colors"
              title="Search database"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-sans">Quick Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-500 border border-slate-200 rounded shadow-2xs">
                /
              </kbd>
            </button>

            <button
              onClick={() => onSelectTab('analysis')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              Run Sample
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 bg-slate-50/90 py-1.5 px-2 text-xs">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 rounded ${activeTab === 'dashboard' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('disorders')}
          className={`px-2 py-1 rounded ${activeTab === 'disorders' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
        >
          Disorders
        </button>
        <button
          onClick={() => onSelectTab('genes')}
          className={`px-2 py-1 rounded ${activeTab === 'genes' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
        >
          Genes
        </button>
        <button
          onClick={() => onSelectTab('biomarkers')}
          className={`px-2 py-1 rounded ${activeTab === 'biomarkers' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
        >
          Biomarkers
        </button>
        <button
          onClick={() => onSelectTab('analysis')}
          className={`px-2 py-1 rounded ${activeTab === 'analysis' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
        >
          Analysis
        </button>
        <button
          onClick={() => onSelectTab('datasources')}
          className={`px-2 py-1 rounded ${activeTab === 'datasources' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
        >
          Evidence
        </button>
        <button
          onClick={() => onSelectTab('academic')}
          className={`px-2 py-1 rounded ${activeTab === 'academic' ? 'text-teal-700 font-semibold' : 'text-slate-600'}`}
        >
          Docs
        </button>
      </div>
    </header>
  );
};
