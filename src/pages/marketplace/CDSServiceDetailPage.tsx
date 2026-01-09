import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { CDS_SERVICE_CARDS } from '@/data/cdsServiceCards';
import MarkdownRenderer from '../../components/guides/MarkdownRenderer';
import { SummaryTable } from '../../pages/guidelines/wfh-guidelines/SummaryTable';
import { FullTableModal } from '../../pages/guidelines/wfh-guidelines/FullTableModal';

export default function CDSServiceDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();

  const card = CDS_SERVICE_CARDS.find(c => c.id === cardId);

  const [tableModalOpen, setTableModalOpen] = useState<{ [key: string]: boolean }>({});
  const [activeSection, setActiveSection] = useState<string>('overview');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const introSection = card?.content.subsections?.find(s => s.id === '1');
  const defaultVersion = '1.0.1';
  const defaultDate = '23.10.2025';
  const heroMeta = (() => {
    if (!introSection?.content) return { date: '', version: '' };
    const versionMatch = introSection.content.match(/Version\s*([^|\n]+)/i);
    const dateMatch = introSection.content.match(/Date:\s*([^\n]+)/i);
    return {
      version: versionMatch ? versionMatch[1].trim() : defaultVersion,
      date: dateMatch ? dateMatch[1].trim() : defaultDate
    };
  })();

  const navSections =
    card?.content.subsections?.filter((s) => /^\d+$/.test(s.id) || s.id === 'who' || s.id === 'problem') || [];

  const openTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: true }));
  };

  const closeTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: false }));
  };

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (navSections.length > 0) {
      setActiveSection(navSections[0].id);
    }
  }, [card, navSections]);

  // Use IntersectionObserver for more reliable section detection
  useEffect(() => {
    if (!card || navSections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -70% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Don't update if we're in the middle of a programmatic scroll
      if (isScrolling) return;

      const visibleEntries = entries
        .filter(entry => {
          const rect = entry.boundingClientRect;
          // Consider an entry visible if it's in the viewport with some margin
          return entry.isIntersecting && 
                 rect.top < window.innerHeight * 0.3 && 
                 rect.bottom > 0;
        })
        .sort((a, b) => {
          // Prioritize entries with higher intersection ratio
          if (Math.abs(b.intersectionRatio - a.intersectionRatio) > 0.15) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          // If ratios are similar, prioritize the one closer to the top of the viewport
          const aTop = Math.abs(a.boundingClientRect.top - 120);
          const bTop = Math.abs(b.boundingClientRect.top - 120);
          return aTop - bTop;
        });

      if (visibleEntries.length > 0) {
        const currentEntry = visibleEntries[0];
        const currentId = currentEntry.target.id || currentEntry.target.getAttribute('id');
        // Only update if it's a valid navigation section and it's different from current
        if (currentId && navSections.some(s => s.id === currentId) && activeSection !== currentId) {
          setActiveSection(currentId);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all navigation sections
    navSections.forEach((subsection) => {
      const element = sectionRefs.current[subsection.id];
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [card, navSections, isScrolling, activeSection]);

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">CDS Service Card Not Found</h1>
          <p className="text-gray-600 mb-8">The requested CDS service card could not be found.</p>
          <Link
            to="/marketplace/design-system?tab=cds"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to CDS Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      setIsScrolling(true);
      setActiveSection(sectionId);
      
      const offset = 120; // Account for sticky header
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top + window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate target scroll position
      let targetScroll = elementTop - offset;
      
      // Check if section is near the bottom of the document
      const elementBottom = elementTop + elementRect.height;
      const maxScroll = documentHeight - viewportHeight;
      
      // If scrolling to this position would push the section out of view at the bottom,
      // adjust to keep it visible
      if (targetScroll + viewportHeight > documentHeight) {
        // Ensure at least some of the section is visible
        targetScroll = Math.max(0, documentHeight - viewportHeight);
      }
      
      // Ensure we don't scroll past the maximum
      targetScroll = Math.min(targetScroll, maxScroll);
      targetScroll = Math.max(0, targetScroll);

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });

      // Reset scrolling flag and verify visibility after scroll completes
      setTimeout(() => {
        setIsScrolling(false);
        // Double-check the section is visible
        const finalRect = element.getBoundingClientRect();
        if (finalRect.top < offset) {
          // Section is too high, scroll down a bit
          window.scrollBy({
            top: offset - finalRect.top + 10,
            behavior: 'smooth'
          });
        } else if (finalRect.bottom > viewportHeight - 20) {
          // Section extends below viewport, but that's okay for bottom sections
          // Just ensure the top is visible
          if (finalRect.top > viewportHeight * 0.5) {
            window.scrollBy({
              top: finalRect.top - offset,
              behavior: 'smooth'
            });
          }
        }
      }, 1000);
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
            to="/marketplace/design-system?tab=cds"
            className="hover:text-gray-900"
          >
            Design System
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">CDS</span>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{card.title}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden mb-8 bg-[#030E31]">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 35%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.06), transparent 35%)' }}></div>
        <div className="relative z-10 px-6 md:px-12 lg:px-24 py-12 md:py-16 text-white">
          <div className="max-w-5xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1 rounded-full bg-white/15 text-sm font-semibold uppercase tracking-wide">
                {card.system || 'CDS'}
              </span>
            </div>
            {(heroMeta.date || heroMeta.version) && (
              <p className="text-sm md:text-base text-white/80">
                {`Version ${heroMeta.version || ''}`.trim()} {heroMeta.version && heroMeta.date ? '|' : ''} {heroMeta.date || ''}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{card.title}</h1>
            <p className="text-base md:text-lg text-white/80">DQ Design · Digital Qatalyst</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-start">
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
                  className={`mb-12 scroll-mt-32 ${index === 0 && !card.content.overview ? 'mt-0' : ''}`}
                  style={{ scrollMarginTop: '120px' }}
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

                  {subsection.contentAfterTable && (
                    <div className="mt-6 pl-6 prose max-w-none">
                      <MarkdownRenderer body={subsection.contentAfterTable} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Navigation (right) */}
            <div className="lg:w-64">
              <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-gray-50 border-l border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Contents
                  </h2>
                  <div className="space-y-2">
                    {navSections.map((subsection) => {
                      const isActive = activeSection === subsection.id;
                      return (
                        <button
                          key={subsection.id}
                          onClick={() => scrollToSection(subsection.id)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-100 text-blue-900 font-medium'
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                          }`}
                        >
                          {subsection.title}
                        </button>
                      );
                    })}
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
