import React from 'react';

interface WorkDirectoryOverviewProps {
  activeTab: 'units' | 'positions' | 'associates';
}

export function WorkDirectoryOverview({ activeTab }: WorkDirectoryOverviewProps) {
  const content = {
    units: {
      title: "Units Directory",
      description:
        "A structured catalogue of DQ sectors and work units, including mandates, priorities, and performance focus.",
    },
    positions: {
      title: "Positions Directory",
      description:
        "A role-level directory showing position title, role summary, key responsibilities, and seniority.",
    },
    associates: {
      title: "Associates Directory",
      description:
        "A searchable associate profile hub containing skills, contact details, and role information.",
    },
  };

  const { title, description } = content[activeTab];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        CURRENT FOCUS
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        <button className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex-shrink-0">
          Tab overview
        </button>
      </div>
    </div>
  );
}
