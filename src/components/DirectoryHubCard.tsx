import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Briefcase, Users } from 'lucide-react';

interface DirectoryHubCardProps {
  sectionStyle?: {
    cardClasses: string;
    headingClass: string;
    descriptionClass: string;
    iconClass: string;
    buttonClasses: string;
    hoverOverlayClass?: string;
    iconWrapperClass?: string;
  };
}

type TabKey = 'units' | 'positions' | 'associates';

const tabs: Array<{ id: TabKey; label: string; icon: React.ReactNode; description: string }> = [
  {
    id: 'units',
    label: 'Units',
    icon: <Building size={20} />,
    description: 'Explore sectors, units, mandates, priorities, and performance data.',
  },
  {
    id: 'positions',
    label: 'Positions',
    icon: <Briefcase size={20} />,
    description: 'Browse DQ positions, role descriptions, and key responsibilities.',
  },
  {
    id: 'associates',
    label: 'Associates',
    icon: <Users size={20} />,
    description: 'View associate profiles, contacts, skills, and performance details.',
  },
];

export function DirectoryHubCard({ sectionStyle }: DirectoryHubCardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('units');
  const [isHovered, setIsHovered] = useState(false);

  const defaultStyle = {
    cardClasses:
      'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
    headingClass: 'text-white',
    descriptionClass: 'text-white/90',
    iconClass: 'text-[#030F35]',
    buttonClasses:
      'text-white bg-[#030F35] hover:bg-[#13285A] border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200',
    hoverOverlayClass: 'bg-white/10',
    iconWrapperClass: 'w-10 h-10',
  };

  const style = sectionStyle || defaultStyle;

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const handleCardClick = () => {
    navigate(`/marketplace/work-directory?tab=${activeTab}`);
  };

  const handleTabClick = (e: React.MouseEvent, tabId: TabKey) => {
    e.stopPropagation();
    setActiveTab(tabId);
  };

  return (
    <div
      className={`${style.cardClasses} rounded-2xl p-6 flex flex-col justify-between min-h-[340px] shadow-sm overflow-hidden transition-all duration-300 transform backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
    >
      {/* Header with icon and title */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`${style.iconWrapperClass} rounded-full bg-white border border-white/40 shadow-sm flex items-center justify-center`}
        >
          <Building size={20} className={style.iconClass} />
        </div>
        <div className="flex-1">
          <h2 className={`${style.headingClass} text-base font-semibold text-white mb-1`}>
            Work Directory Hub
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="border-b border-white/20">
          <nav className="-mb-px flex space-x-6" aria-label="Directory Tabs">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={(e) => handleTabClick(e, tab.id)}
                  className={`
                    whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                    ${
                      isActive
                        ? 'border-white text-white'
                        : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                    }
                    transition-colors
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active tab content */}
      <div className="flex-1 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-white/90">{activeTabData.icon}</div>
          <h3 className={`${style.headingClass} text-sm font-semibold`}>
            {activeTabData.label} Directory
          </h3>
        </div>
        <p className={`${style.descriptionClass} text-sm leading-relaxed`}>
          {activeTabData.description}
        </p>
      </div>

      {/* CTA Button */}
      <button
        className={`${style.buttonClasses} mt-auto h-9 px-4 rounded-md font-medium w-full flex items-center justify-center`}
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
      >
        Explore {activeTabData.label} Directory
        <span className="ml-2">›</span>
      </button>

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 ${style.hoverOverlayClass} opacity-0 transition-opacity duration-500 rounded-2xl pointer-events-none`}
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </div>
  );
}
