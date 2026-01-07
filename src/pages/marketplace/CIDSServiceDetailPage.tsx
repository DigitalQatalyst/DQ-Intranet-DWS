import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { CIDS_SERVICE_CARDS } from '@/data/cidsServiceCards';
import MarkdownRenderer from '../../components/guides/MarkdownRenderer';
import { SummaryTable } from '../../pages/guidelines/wfh-guidelines/SummaryTable';
import { FullTableModal } from '../../pages/guidelines/wfh-guidelines/FullTableModal';

export default function CIDSServiceDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  
  const card = CIDS_SERVICE_CARDS.find(c => c.id === cardId);
  
  // Modal state management for tables
  const [tableModalOpen, setTableModalOpen] = useState<{ [key: string]: boolean }>({});
  
  const openTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: true }));
  };
  
  const closeTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: false }));
  };

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Card Not Found</h1>
            <p className="text-gray-600 mb-6">The requested CI.DS service card could not be found.</p>
            <Link
              to="/marketplace/design-system?tab=cids"
              className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--guidelines-primary-solid)] text-white text-sm font-semibold hover:bg-[var(--guidelines-primary-solid-hover)] transition-colors"
            >
              Back to CI.DS Services
            </Link>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumbs - Above Hero Section */}
      <div className="container mx-auto px-4 pt-4 max-w-7xl">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/design-system?tab=cids" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">
                  Design System Marketplace
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/design-system?tab=cids" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">
                  CI.DS
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-700 md:ml-2">{card.title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : 'url(/images/guidelines.PNG)',
          }}
        >
          <div className="absolute inset-0 bg-[#030E31] bg-opacity-80"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
              CI.DS Service
            </span>

            <div className="text-sm text-white/90 mb-2 font-inter">
              {card.section}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-inter">
              {card.title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-4">
              {card.description}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Overview Section */}
              {card.content.overview && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pl-4 relative">
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] to-transparent"></span>
                      Overview
                    </h2>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                      <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                        <MarkdownRenderer body={card.content.overview} />
                      </React.Suspense>
                    </div>
                  </div>
                </div>
              )}

              {/* Subsections */}
              {card.content.subsections && card.content.subsections.length > 0 && (
                <div className="space-y-6">
                  {card.content.subsections.map((subsection) => (
                    <div key={subsection.id} className="bg-white rounded-xl shadow-sm border border-gray-200" style={{ backgroundColor: '#F8FAFC' }}>
                      <div className="p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 pl-4 relative">
                          <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] to-transparent"></span>
                          {subsection.id} {subsection.title}
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
                          {subsection.tableData ? (
                            <>
                              <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                                <MarkdownRenderer body={subsection.content} />
                              </React.Suspense>
                              <SummaryTable
                                title=""
                                columns={subsection.tableData.columns}
                                data={subsection.tableData.data}
                                onViewFull={() => openTableModal(subsection.id)}
                              />
                              <FullTableModal
                                isOpen={tableModalOpen[subsection.id] || false}
                                onClose={() => closeTableModal(subsection.id)}
                                title={`${subsection.id} ${subsection.title}`}
                                columns={subsection.tableData.columns}
                                data={subsection.tableData.data}
                              />
                            </>
                          ) : (
                            <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                              <MarkdownRenderer body={subsection.content} />
                            </React.Suspense>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <nav className="space-y-2">
                  {card.content.overview && (
                    <a
                      href="#overview"
                      className="block text-sm text-gray-600 hover:text-[var(--guidelines-primary)] transition-colors"
                    >
                      Overview
                    </a>
                  )}
                  {card.content.subsections?.map((subsection) => (
                    <a
                      key={subsection.id}
                      href={`#${subsection.id.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-')}`}
                      className="block text-sm text-gray-600 hover:text-[var(--guidelines-primary)] transition-colors"
                    >
                      {subsection.id} {subsection.title}
                    </a>
                  ))}
                </nav>

                {card.tags && card.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--guidelines-primary-surface)',
                            color: 'var(--guidelines-primary)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}

