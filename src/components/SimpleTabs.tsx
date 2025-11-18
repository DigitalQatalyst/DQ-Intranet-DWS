import React from 'react'

export type SimpleTab = {
  id: string
  label: string
}

export type SimpleTabsProps = {
  tabs: SimpleTab[]
  activeTabId: string
  onTabChange: (id: string) => void
  className?: string
}

// Simple horizontal tabs styled to match the Media Center tabs
export const SimpleTabs: React.FC<SimpleTabsProps> = ({ tabs, activeTabId, onTabChange, className }) => {
  return (
    <div className={className}>
      <div className="flex space-x-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                isActive ? 'text-[#030F35]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-[#030F35] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SimpleTabs
