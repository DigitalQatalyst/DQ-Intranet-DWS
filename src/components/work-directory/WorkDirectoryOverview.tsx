import React from 'react'

type OverviewContent = {
  title: string
  description: string
}

type Props = {
  content: OverviewContent
}

// Simple pill to mimic the Media Center "Tab overview"
const TabOverviewPill: React.FC = () => (
  <button className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#030F35] hover:bg-blue-100 transition">
    Tab overview
  </button>
)

export const WorkDirectoryOverview: React.FC<Props> = ({ content }) => {
  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="space-y-1">
        <div className="text-[11px] font-semibold tracking-[0.08em] text-gray-500 uppercase">
          Current Focus
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{content.title}</h2>
        <p className="text-sm text-gray-700">{content.description}</p>
      </div>
      <div className="flex-shrink-0">
        <TabOverviewPill />
      </div>
    </div>
  )
}

export default WorkDirectoryOverview
