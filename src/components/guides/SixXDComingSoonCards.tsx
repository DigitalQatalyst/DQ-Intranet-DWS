import React from 'react';
import { Clock } from 'lucide-react';

interface SixXDCard {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const SIXD_CARDS: SixXDCard[] = [
  {
    title: "Digital Economy (DE)",
    subtitle: "Why should organisations change?",
    description: "Understand shifts in market logic, customer behaviour, and value creation that drive transformation.",
    imageUrl: "/images/services/digital-economy.jpg"
  },
  {
    title: "Digital Cognitive Organisation (DCO)",
    subtitle: "Where are organisations headed?",
    description: "The future enterprise: intelligent, adaptive, and orchestrated for seamless coordination.",
    imageUrl: "/images/services/digital-cognitive-organisation.jpg"
  },
  {
    title: "Digital Business Platforms (DBP)",
    subtitle: "What must be built to enable transformation?",
    description: "Modular, integrated architectures that unify operations and enable scalable transformation.",
    imageUrl: "/images/services/digital-business-platforms.png"
  },
  {
    title: "Digital Transformation 2.0 (DT2.0)",
    subtitle: "How should transformation be designed and deployed?",
    description: "Methods, flows, and governance frameworks that make change repeatable and outcome-driven.",
    imageUrl: "/images/services/digital-transformation-2.jpg"
  },
  {
    title: "Digital Worker & Workspace (DW:WS)",
    subtitle: "Who delivers the change, and how do they work?",
    description: "Redefining roles, skills, and digitally enabled workplaces for effective transformation delivery.",
    imageUrl: "/images/services/digital-worker-workspace.jpg"
  },
  {
    title: "Digital Accelerators (Tools)",
    subtitle: "When will value be realised?",
    description: "Tools, systems, and strategies that compress time-to-value and scale measurable impact.",
    imageUrl: "/images/services/digital-accelerators..jpg"
  }
];

export const SixXDComingSoonCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SIXD_CARDS.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 flex flex-col"
        >
          {/* Image */}
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Card Content */}
          <div className="p-6 flex flex-col flex-1">
            {/* Title - Fixed height for alignment */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 h-14 flex items-start">
              {card.title}
            </h3>

            {/* Subtitle - Fixed height for alignment */}
            <p className="text-sm font-medium text-gray-500 mb-3 italic h-10 flex items-start">
              {card.subtitle}
            </p>

            {/* Description - Fixed height for alignment */}
            <p className="text-sm text-gray-600 mb-4 h-16 flex items-start">
              {card.description}
            </p>

            {/* Footer with Coming Soon Button */}
            <div className="pt-4 border-t border-gray-200 mt-auto">
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
