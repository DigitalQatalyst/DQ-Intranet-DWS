import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { VDS_SERVICE_CARDS } from '@/data/vdsServiceCards';
import MarkdownRenderer from '../../components/guides/MarkdownRenderer';
import { SummaryTable } from '../../pages/guidelines/wfh-guidelines/SummaryTable';
import { FullTableModal } from '../../pages/guidelines/wfh-guidelines/FullTableModal';

export default function VDSServiceDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const card = VDS_SERVICE_CARDS.find(c => c.id === cardId);

  const [tableModalOpen, setTableModalOpen] = useState<{ [key: string]: boolean }>({});
  const [activeSection, setActiveSection] = useState<string>('overview');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const navSections =
    card?.content.subsections?.filter((s) => /^\d+$/.test(s.id) || s.id === 'who' || s.id === 'problem') || [];

  const openTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: true }));
  };

  const closeTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: false }));
  };

  useEffect(() => {
    if (navSections.length > 0) {
      setActiveSection(navSections[0].id);
    }
  }, [card, navSections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      let currentId = navSections[0]?.id || activeSection;

      for (let i = 0; i < navSections.length; i++) {
        const subsection = navSections[i];
        const element = sectionRefs.current[subsection.id];
        if (element && element.offsetTop <= scrollPosition) {
          currentId = subsection.id;
        } else {
          break;
        }
      }

      if (currentId !== activeSection) {
        setActiveSection(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [card, navSections]);

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">V.DS Service Card Not Found</h1>
          <p className="text-gray-600 mb-8">The requested V.DS service card could not be found.</p>
          <Link
            to="/marketplace/design-system?tab=vds"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to V.DS Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 flex items-center">
            <HomeIcon className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <Link to="/marketplace" className="hover:text-gray-900">Marketplace</Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <Link
            to="/marketplace/design-system?tab=vds"
            className="hover:text-gray-900"
          >
            Design System
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">V.DS</span>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{card.title}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/content.PNG)',
          }}
        />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white bg-[#030E31]/60">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4 text-white">
              V.DS
            </span>

            <div className="text-sm text-white/90 mb-6 font-inter">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-inter text-white">
              {card.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-white/90 font-inter">
              <span>DQ Design · Digital Qatalyst</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 p-8">
              {/* Overview Section */}
              {card.content.overview && (
                <div
                  ref={(el) => (sectionRefs.current['overview'] = el)}
                  className="mb-12"
                >
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pl-6 font-inter tracking-tight">
                      Overview
                    </h2>
                  </div>
                  <div className="pl-6 prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <MarkdownRenderer body={card.content.overview} />
                  </div>
                </div>
              )}

              {/* Subsections */}
              {card.content.subsections?.map((subsection, index) => (
                <div
                  key={subsection.id}
                  id={subsection.id}
                  ref={(el) => (sectionRefs.current[subsection.id] = el)}
                  className={`mb-12 ${index === 0 && !card.content.overview ? 'mt-0' : ''}`}
                >
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pl-6 font-inter tracking-tight">
                      {subsection.title}
                    </h2>
                  </div>
                  <div className="pl-6 prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <MarkdownRenderer body={subsection.content} />
                  </div>

                  {/* Table Data */}
                  {subsection.tableData && (
                    <div className="mt-6 pl-6">
                      <SummaryTable
                        data={subsection.tableData.data}
                        columns={subsection.tableData.columns}
                        onViewFullTable={() => openTableModal(subsection.id)}
                      />
                      <FullTableModal
                        isOpen={tableModalOpen[subsection.id] || false}
                        onClose={() => closeTableModal(subsection.id)}
                        title={subsection.title}
                        data={subsection.tableData.data}
                        columns={subsection.tableData.columns}
                      />
                    </div>
                  )}

                  {/* Content After Table */}
                  {subsection.contentAfterTable && (
                    <div className="mt-6 pl-6 prose max-w-none">
                      <MarkdownRenderer body={subsection.contentAfterTable} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Navigation */}
            <div className="lg:w-64">
              <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-gray-50 border-l border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Contents
                  </h2>
                  <div className="space-y-2">
                    {navSections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => scrollToSection(subsection.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeSection === subsection.id
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                        }`}
                      >
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
