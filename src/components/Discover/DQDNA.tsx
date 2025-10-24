import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Node data structure
interface HexNode {
  id: number;
  title: string;
  subtitle: string;
  fill: 'navy' | 'white';
  x: number;
  y: number;
  details: string[];
}

// Hex positions (honeycomb layout)
const hexNodes: HexNode[] = [
  { id: 1, title: 'The Vision', subtitle: '(Purpose)', fill: 'navy', x: 0, y: 0, details: ['Defines our north star and measurable outcomes', 'Aligns teams to shared objectives', 'Drives decision-making across all initiatives'] },
  { id: 2, title: 'The HoV', subtitle: '(Culture)', fill: 'navy', x: -180, y: 156, details: ['Shapes how we behave and collaborate', 'Establishes trust and accountability', 'Creates feedback loops for continuous improvement'] },
  { id: 3, title: 'The Personas', subtitle: '(Identity)', fill: 'navy', x: 180, y: 156, details: ['Clarifies who we are in our roles', 'Defines growth paths and competencies', 'Informs design and development priorities'] },
  { id: 4, title: 'Agile TMS', subtitle: '(Tasks)', fill: 'white', x: 360, y: 0, details: ['Organizes work planning and tracking', 'Defines work item types and swimlanes', 'Establishes cadence and delivery cycles'] },
  { id: 5, title: 'Agile SOS', subtitle: '(Governance)', fill: 'white', x: 180, y: -156, details: ['Guides decision rights and change control', 'Maintains lightweight guardrails', 'Ensures risk review and compliance'] },
  { id: 6, title: 'Agile Flows', subtitle: '(Value Streams)', fill: 'white', x: -180, y: -156, details: ['Orchestrates value across intake to release', 'Optimizes flow and reduces waste', 'Enables continuous learning and adaptation'] },
  { id: 7, title: 'Agile DTMF', subtitle: '(Products)', fill: 'white', x: -360, y: 0, details: ['Shows our product and service portfolio', 'Defines roadmaps and service levels', 'Enables customer value delivery'] },
];

// Callout labels and positions
const callouts = [
  { id: 6, label: 'How we orchestrate', side: 'left', x: -480, y: -156 },
  { id: 7, label: 'What we offer', side: 'left', x: -480, y: 0 },
  { id: 2, label: 'How we behave', side: 'left', x: -480, y: 156 },
  { id: 5, label: 'How we govern', side: 'right', x: 480, y: -156 },
  { id: 4, label: 'How we work', side: 'right', x: 480, y: 0 },
  { id: 3, label: 'Who we are', side: 'right', x: 480, y: 156 },
  { id: 1, label: 'Why we exist', side: 'center', x: 0, y: 300 },
];

// Hex SVG component
const HexSVG: React.FC<{ width: number; fill: 'navy' | 'white'; id: number }> = ({ width, fill, id }) => {
  const height = width * 0.87; // Hex height ratio
  const strokeColor = fill === 'white' ? '#FB5535' : 'transparent';
  const fillColor = fill === 'navy' ? '#131E42' : '#FFFFFF';
  const textColor = fill === 'navy' ? '#FFFFFF' : '#131E42';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="drop-shadow-sm">
      <defs>
        <filter id={`softShadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15"/>
        </filter>
      </defs>
      <path
        d={`M${width/2} 4 L${width-4} ${height*0.25} L${width-4} ${height*0.75} L${width/2} ${height-4} L4 ${height*0.75} L4 ${height*0.25} Z`}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="3"
        filter={`url(#softShadow-${id})`}
      />
      {fill === 'white' && (
        <>
          {/* White tick marks on white hexes */}
          <line x1="4" y1={height*0.25} x2="4" y2={height*0.4} stroke="#FFFFFF" strokeWidth="4"/>
          <line x1={width-4} y1={height*0.25} x2={width-4} y2={height*0.4} stroke="#FFFFFF" strokeWidth="4"/>
          <line x1="4" y1={height*0.6} x2="4" y2={height*0.75} stroke="#FFFFFF" strokeWidth="4"/>
          <line x1={width-4} y1={height*0.6} x2={width-4} y2={height*0.75} stroke="#FFFFFF" strokeWidth="4"/>
        </>
      )}
    </svg>
  );
};

// Sticky note popup component
const StickyNote: React.FC<{ node: HexNode; isOpen: boolean; onClose: () => void }> = ({ node, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Sticky Note */}
          <motion.div
            className="fixed z-50 max-w-sm"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">{node.title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 text-xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{node.subtitle}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {node.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main SevenHexDiagram component
const SevenHexDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const centerX = 0;
  const centerY = 0;
  const hexWidth = 180;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      {/* SVG for connector lines and labels */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="-600 -400 1200 800">
        {/* Connector lines */}
        {callouts.map((callout) => {
          const node = hexNodes.find(n => n.id === callout.id);
          if (!node) return null;

          const nodeX = centerX + node.x;
          const nodeY = centerY + node.y;
          const lineEndX = callout.side === 'left' ? nodeX - hexWidth/2 + 20 : 
                          callout.side === 'right' ? nodeX + hexWidth/2 - 20 : nodeX;
          const lineEndY = callout.side === 'center' ? nodeY + hexWidth/2 + 20 : nodeY;

          return (
            <g key={callout.id}>
              {/* Line */}
              <line
                x1={callout.x}
                y1={callout.y}
                x2={lineEndX}
                y2={lineEndY}
                stroke="#0B2B66"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Dot */}
              <circle
                cx={callout.x}
                cy={callout.y}
                r="6"
                fill="#0B2B66"
              />
              {/* Label */}
              <text
                x={callout.x}
                y={callout.y - 16}
                textAnchor={callout.side === 'left' ? 'start' : callout.side === 'right' ? 'end' : 'middle'}
                fontSize="13"
                fontWeight="600"
                fill="#0B2B66"
                className="font-inter"
              >
                {callout.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hexagons */}
      <div className="relative flex items-center justify-center min-h-[600px]">
        {hexNodes.map((node, index) => (
          <motion.button
            key={node.id}
            className="absolute focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            style={{
              left: `calc(50% + ${node.x}px)`,
              top: `calc(50% + ${node.y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              y: isVisible ? 0 : 20 
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedNode(node.id)}
            role="button"
            aria-label={`${node.title} - ${node.subtitle}`}
          >
            <div className="relative">
              <HexSVG width={hexWidth} fill={node.fill} id={node.id} />
              
              {/* Number badge */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {node.id}
              </div>
              
              {/* Text content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <div className={`text-lg font-bold leading-tight ${node.fill === 'navy' ? 'text-white' : 'text-gray-800'}`}>
                  {node.title}
                </div>
                <div className={`text-sm font-semibold mt-1 ${node.fill === 'navy' ? 'text-white/90' : 'text-gray-600'}`}>
                  {node.subtitle}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Sticky note popup */}
      {selectedNode && (
        <StickyNote
          node={hexNodes.find(n => n.id === selectedNode)!}
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};

export const DQDNA: React.FC = () => {
  return (
    <section className="bg-white py-16 md:py-24" id="dna" aria-labelledby="dna-heading">
      <div className="dws-container max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="dna-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--dws-text-strong)' }}
          >
            Growth Dimensions
          </h2>
          <p
            className="text-base md:text-lg max-w-[780px] mx-auto leading-relaxed"
            style={{ color: 'var(--dws-text-dim)' }}
          >
            Seven connected dimensions shaping how DQ learns, collaborates, and delivers value.
          </p>
        </div>

        {/* Seven Hex Diagram */}
        <SevenHexDiagram />
      </div>
    </section>
  );
};

export default DQDNA;

