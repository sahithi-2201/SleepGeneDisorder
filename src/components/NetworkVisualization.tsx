import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  Search, 
  Brain, 
  Dna, 
  Activity, 
  X, 
  ExternalLink,
  Info
} from 'lucide-react';
import { NetworkData, NetworkNode, NetworkLink, Disorder, Gene, Biomarker } from '../types/bioinformatics';
import { api } from '../services/api';

interface NetworkVisualizationProps {
  onSelectDisorder: (disorder: Disorder) => void;
  onSelectGene: (gene: Gene) => void;
  onSelectBiomarker: (biomarker: Biomarker) => void;
  disorders: Disorder[];
  genes: Gene[];
  biomarkers: Biomarker[];
}

export const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  onSelectDisorder,
  onSelectGene,
  onSelectBiomarker,
  disorders,
  genes,
  biomarkers
}) => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [showDisorders, setShowDisorders] = useState(true);
  const [showGenes, setShowGenes] = useState(true);
  const [showBiomarkers, setShowBiomarkers] = useState(true);
  const [searchNodeQuery, setSearchNodeQuery] = useState('');

  // Selected node for inspector drawer
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // Canvas Viewport transform
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    api.getNetworkData().then(data => {
      // Calculate circular clustered positions for clean, deterministic layout
      const width = 950;
      const height = 650;
      const centerX = width / 2;
      const centerY = height / 2;

      // Group by types
      const disorderNodes = data.nodes.filter(n => n.type === 'disorder');
      const geneNodes = data.nodes.filter(n => n.type === 'gene');
      const biomarkerNodes = data.nodes.filter(n => n.type === 'biomarker');

      // Disorders in central ring (radius ~ 140)
      disorderNodes.forEach((node, i) => {
        const angle = (i / disorderNodes.length) * 2 * Math.PI;
        node.x = centerX + 140 * Math.cos(angle);
        node.y = centerY + 140 * Math.sin(angle);
      });

      // Genes on left semi-arc / outer orbit (radius ~ 280)
      geneNodes.forEach((node, i) => {
        const angle = Math.PI * 0.5 + (i / geneNodes.length) * Math.PI * 1.5;
        node.x = centerX + 280 * Math.cos(angle);
        node.y = centerY + 250 * Math.sin(angle);
      });

      // Biomarkers on right semi-arc (radius ~ 280)
      biomarkerNodes.forEach((node, i) => {
        const angle = -Math.PI * 0.5 + (i / biomarkerNodes.length) * Math.PI * 1.2;
        node.x = centerX + 290 * Math.cos(angle);
        node.y = centerY + 240 * Math.sin(angle);
      });

      setNetworkData(data);
      setLoading(false);
    });
  }, []);

  const visibleNodes = useMemo(() => {
    if (!networkData) return [];
    return networkData.nodes.filter(n => {
      if (n.type === 'disorder' && !showDisorders) return false;
      if (n.type === 'gene' && !showGenes) return false;
      if (n.type === 'biomarker' && !showBiomarkers) return false;
      return true;
    });
  }, [networkData, showDisorders, showGenes, showBiomarkers]);

  const visibleNodeIds = useMemo(() => {
    return new Set(visibleNodes.map(n => n.id));
  }, [visibleNodes]);

  const visibleLinks = useMemo(() => {
    if (!networkData) return [];
    return networkData.links.filter(l => {
      return visibleNodeIds.has(l.source) && visibleNodeIds.has(l.target);
    });
  }, [networkData, visibleNodeIds]);

  const highlightedNodeIds = useMemo(() => {
    if (!searchNodeQuery.trim()) return null;
    const q = searchNodeQuery.toLowerCase().trim();
    const matches = new Set<string>();
    visibleNodes.forEach(n => {
      if (n.label.toLowerCase().includes(q) || (n.category && n.category.toLowerCase().includes(q))) {
        matches.add(n.id);
      }
    });
    return matches;
  }, [visibleNodes, searchNodeQuery]);

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Node Inspector Details
  const nodeConnections = useMemo(() => {
    if (!selectedNode || !networkData) return [];
    return networkData.links.filter(
      l => l.source === selectedNode.id || l.target === selectedNode.id
    );
  }, [selectedNode, networkData]);

  const handleOpenEntityDetail = (node: NetworkNode) => {
    if (node.type === 'disorder') {
      const d = disorders.find(item => item.id === node.originalId);
      if (d) onSelectDisorder(d);
    } else if (node.type === 'gene') {
      const g = genes.find(item => item.id === node.originalId);
      if (g) onSelectGene(g);
    } else if (node.type === 'biomarker') {
      const b = biomarkers.find(item => item.id === node.originalId);
      if (b) onSelectBiomarker(b);
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <span>Systems Biology Visualizer</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Gene ↔ Disorder ↔ Biomarker Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Network Graph Explorer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Explore interactive molecular interactions. Click any node to inspect connected biological entities, pathways, and PubMed PMIDs.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs self-start sm:self-auto font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
            <span className="text-slate-700">Disorder</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
            <span className="text-slate-700">Gene</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="text-slate-700">Biomarker</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Zoom */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Visibility Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] uppercase mr-1">Toggles:</span>
          <button
            onClick={() => setShowDisorders(!showDisorders)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              showDisorders ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold' : 'bg-slate-100 text-slate-400 line-through'
            }`}
          >
            Disorders
          </button>
          <button
            onClick={() => setShowGenes(!showGenes)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              showGenes ? 'bg-teal-50 text-teal-700 border border-teal-200 font-semibold' : 'bg-slate-100 text-slate-400 line-through'
            }`}
          >
            Genes
          </button>
          <button
            onClick={() => setShowBiomarkers(!showBiomarkers)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              showBiomarkers ? 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold' : 'bg-slate-100 text-slate-400 line-through'
            }`}
          >
            Biomarkers
          </button>
        </div>

        {/* Node Search in Canvas */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchNodeQuery}
            onChange={(e) => setSearchNodeQuery(e.target.value)}
            placeholder="Highlight node..."
            className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport & Inspector Side Drawer */}
      <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden h-[600px] shadow-inner select-none cursor-grab active:cursor-grabbing">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-teal-400">
            Assembling molecular interaction graph...
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Background grid */}
            <defs>
              <pattern id="netgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#netgrid)" />

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges / Links */}
              {visibleLinks.map((link, idx) => {
                const sourceNode = networkData?.nodes.find(n => n.id === link.source);
                const targetNode = networkData?.nodes.find(n => n.id === link.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToSelected = selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);

                let strokeColor = '#334155';
                if (isConnectedToSelected) {
                  strokeColor = '#38bdf8';
                } else if (link.relationType === 'gene-disorder') {
                  strokeColor = '#0d9488';
                } else if (link.relationType === 'gene-biomarker') {
                  strokeColor = '#d97706';
                } else {
                  strokeColor = '#6366f1';
                }

                return (
                  <line
                    key={idx}
                    x1={sourceNode.x || 0}
                    y1={sourceNode.y || 0}
                    x2={targetNode.x || 0}
                    y2={targetNode.y || 0}
                    stroke={strokeColor}
                    strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                    strokeOpacity={isConnectedToSelected ? 0.9 : 0.35}
                  />
                );
              })}

              {/* Nodes */}
              {visibleNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isHighlighted = highlightedNodeIds && highlightedNodeIds.has(node.id);

                let fillColor = '#6366f1';
                let strokeColor = '#818cf8';
                let radius = 14;

                if (node.type === 'disorder') {
                  fillColor = '#4f46e5';
                  strokeColor = '#818cf8';
                  radius = 18;
                } else if (node.type === 'gene') {
                  fillColor = '#0d9488';
                  strokeColor = '#2dd4bf';
                  radius = 14;
                } else if (node.type === 'biomarker') {
                  fillColor = '#d97706';
                  strokeColor = '#fbbf24';
                  radius = 13;
                }

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x || 0}, ${node.y || 0})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Highlight Ring */}
                    {(isSelected || isHighlighted) && (
                      <circle
                        r={radius + 6}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeDasharray={isHighlighted ? "4 2" : "none"}
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Body */}
                    <circle
                      r={radius}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-110"
                    />

                    {/* Node Text Label */}
                    <text
                      dy={radius + 12}
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize={node.type === 'disorder' ? "10.5" : "9.5"}
                      fontWeight={node.type === 'disorder' ? "600" : "500"}
                      className="font-sans pointer-events-none drop-shadow-md select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* Selected Node Inspector Drawer (Floating HUD) */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 max-h-[550px] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 text-white shadow-2xl overflow-y-auto space-y-4 animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase">
                  {selectedNode.type} Node #{selectedNode.originalId}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedNode.label}</h3>
                {selectedNode.category && (
                  <span className="text-xs text-slate-400 font-mono">{selectedNode.category}</span>
                )}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Connections */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase font-mono block mb-2">
                Connected Nodes ({nodeConnections.length}):
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {nodeConnections.map((conn, idx) => {
                  const otherNodeId = conn.source === selectedNode.id ? conn.target : conn.source;
                  const otherNode = networkData?.nodes.find(n => n.id === otherNodeId);
                  if (!otherNode) return null;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedNode(otherNode)}
                      className="p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-teal-300">{otherNode.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono capitalize">{otherNode.type}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {conn.label}
                      </div>
                      {conn.pmid && (
                        <span className="text-[10px] font-mono text-teal-400 block mt-0.5">
                          PMID: {conn.pmid}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Entity Full Details Button */}
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleOpenEntityDetail(selectedNode)}
                className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open Full Clinical/Genomic Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Viewport hint */}
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 font-mono pointer-events-none flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Click & drag to pan · Scroll/buttons to zoom · Click node to inspect</span>
        </div>
      </div>
    </div>
  );
};
