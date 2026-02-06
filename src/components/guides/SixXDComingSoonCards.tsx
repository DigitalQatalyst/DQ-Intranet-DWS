import React from 'react';
import { Clock } from 'lucide-react';

interface SixXDCard {
  title: string;
  subtitle: string;
  description: string;
}

const SIXD_CARDS: SixXDCard[] = [
  {
    title: "Digital Economy (DE)",
    subtitle: "Why should organisations change?",
    description: "Helps leaders understand shifts in market logic, customer behaviour, and value creation — identifying the forces that drive transformation."
  },
  {
    title: "Digital Cognitive Organisation (DCO)",
    subtitle: "Where are organisations headed?",
    description: "Defines the future enterprise — intelligent, adaptive, and orchestrated — capable of learning, responding, and coordinating seamlessly across people, systems, and decisions."
  },
  {
    title: "Digital Business Platforms (DBP)",
    subtitle: "What must be built to enable transformation?",
    description: "Focuses on the modular, integrated, and data-driven architectures that unify operations and make transformation scalable and resilient."
  },
  {
    title: "Digital Transformation 2.0 (DT2.0)",
    subtitle: "How should transformation be designed and deployed?",
    description: "Positions transformation as a discipline of design and orchestration, introducing the methods, flows, and governance needed to make change repeatable and outcome-driven."
  },
  {
    title: "Digital Worker & Workspace (DW:WS)",
    subtitle: "Who delivers the change, and how do they work?",
    description: "Centers on people and their environments — redefining roles, skills, and digitally enabled workplaces so teams can deliver and sustain transformation effectively."
  },
  {
    title: "Digital Accelerators (Tools)",
    subtitle: "When will value be realised?",
    description: "Drives execution speed and alignment through tools, systems, and strategies that compress time-to-value and scale measurable impact."
  }
];

export const SixXDComingSoonCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SIXD_CARDS.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md opacity-75 grayscale-[30%]"
          style={{ filter: 'grayscale(30%)' }}
        >
          {/* Image Placeholder */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-300 opacity-50"></div>
            <div className="relative z-10 text-center">
              <Clock size={48} className="mx-auto text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-500">Coming Soon</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-700 mb-2 line-clamp-2">
              {card.title}
            </h3>

            {/* Subtitle */}
            <p className="text-sm font-medium text-gray-500 mb-3 italic">
              {card.subtitle}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {card.description}
            </p>

            {/* Footer with Coming Soon Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Coming Soon"
              >
                <Clock size={16} />
                <span>Coming Soon</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
