import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { useAuth } from '../../components/Header/context/AuthContext';
import { GlossaryTerm } from '../../components/glossary/GlossaryCard';
import { supabaseClient } from '../../lib/supabaseClient';

// Fallback data - used only if Supabase fetch fails
const FALLBACK_TERMS: Record<string, GlossaryTerm> = {
  dws: {
    id: '1',
    term: 'Digital Work Solution (DWS)',
    short_definition: 'The comprehensive digital transformation framework and operating model used across DQ to deliver digital capabilities and solutions.',
    full_definition: 'At DQ, Digital Work Solution (DWS) is our core operating framework that defines how we design, build, and deliver digital transformation. In DWS, we structure our work across four key dimensions: Digital Work Space (DWS.1), Digital Work Sectors (DWS.2), Digital Working Studios (DWS.3), and supporting governance systems. DWS provides the operational language and methodology that all DQ teams use to align on delivery approaches, quality standards, and transformation outcomes.',
    category: 'frameworks-models',
    used_in: ['dws-core', 'governance'],
    related_terms: ['dws-1', 'dws-2', 'dws-3', 'dbp', 'dco'],
    status: 'Active',
    slug: 'dws',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  'dws-1': {
    id: '2',
    term: 'Digital Work Space (DWS.1)',
    short_definition: 'The digital environment and infrastructure where DQ associates collaborate, access tools, and execute digital work.',
    full_definition: 'In DWS, Digital Work Space (DWS.1) refers to the integrated digital environment that enables DQ associates to collaborate, access shared resources, and execute their work. At DQ, DWS.1 encompasses our workspace platforms, collaboration tools, knowledge repositories, and the digital infrastructure that connects teams across locations. It is the operational layer where DWS principles are applied daily, ensuring consistent access to frameworks, guidelines, and shared resources.',
    category: 'platforms-tools',
    used_in: ['dws-core', 'l24-working-rooms'],
    related_terms: ['dws', 'dws-2', 'dws-3'],
    status: 'Active',
    slug: 'dws-1',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  'dws-2': {
    id: '3',
    term: 'Digital Work Sectors (DWS.2)',
    short_definition: 'The industry-specific domains and vertical markets where DQ applies digital transformation capabilities.',
    full_definition: 'At DQ, Digital Work Sectors (DWS.2) represent the industry verticals and market domains where we apply our digital transformation expertise. In DWS, sectors such as Government 4.0, Retail 4.0, Hospitality 4.0, and others define the operational contexts where DQ teams deliver solutions. DWS.2 provides the sector-specific knowledge, frameworks, and best practices that guide how we adapt DWS principles to different industry requirements and transformation goals.',
    category: 'frameworks-models',
    used_in: ['dws-core', 'governance'],
    related_terms: ['dws', 'dws-1', 'dws-3'],
    status: 'Active',
    slug: 'dws-2',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  'dws-3': {
    id: '4',
    term: 'Digital Working Studios (DWS.3)',
    short_definition: 'The organizational units and delivery teams within DQ that execute digital transformation projects and initiatives.',
    full_definition: 'In DWS, Digital Working Studios (DWS.3) are the operational delivery units within DQ that execute digital transformation work. At DQ, studios represent specialized teams organized around capabilities, technologies, or client engagements. DWS.3 defines how studios operate within the DWS framework, including their structure, governance, quality standards, and how they collaborate across the DWS ecosystem. Studios apply DWS.1 tools and DWS.2 sector knowledge to deliver transformation outcomes.',
    category: 'roles-structures',
    used_in: ['dws-core', 'governance'],
    related_terms: ['dws', 'dws-1', 'dws-2'],
    status: 'Active',
    slug: 'dws-3',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  dbp: {
    id: '5',
    term: 'Digital Business Platform (DBP)',
    short_definition: 'The integrated platform and technology stack that enables digital business operations and transformation delivery.',
    full_definition: 'At DQ, Digital Business Platform (DBP) is the foundational technology platform that supports digital business operations and transformation delivery. In DWS, DBP provides the core infrastructure, services, and capabilities that enable studios to build and deliver digital solutions efficiently. DBP encompasses development tools, deployment pipelines, data platforms, and shared services that reduce rework and accelerate delivery across DQ projects.',
    category: 'platforms-tools',
    used_in: ['dws-core', 'governance'],
    related_terms: ['dws', 'dco'],
    status: 'Active',
    slug: 'dbp',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  dco: {
    id: '6',
    term: 'Digital Cognitive Organization (DCO)',
    short_definition: 'The organizational model and operating structure that enables DQ to operate as a learning, adaptive digital organization.',
    full_definition: 'In DWS, Digital Cognitive Organization (DCO) represents DQ\'s organizational model for operating as a continuously learning, adaptive digital organization. At DQ, DCO defines how we structure decision-making, knowledge sharing, and organizational learning to maintain agility and digital mastery. DCO encompasses governance structures, learning systems, and operational practices that enable DQ to evolve its capabilities and respond to changing digital transformation needs.',
    category: 'governance-systems',
    used_in: ['dws-core', 'governance', 'learning-center'],
    related_terms: ['dws', 'ghc', 'l24-working-rooms'],
    status: 'Active',
    slug: 'dco',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  'l24-working-rooms': {
    id: '7',
    term: 'L24 Working Rooms',
    short_definition: 'The structured collaboration spaces and working environments where DQ teams execute focused work sessions and delivery activities.',
    full_definition: 'At DQ, L24 Working Rooms are the operational collaboration spaces where teams conduct focused work sessions, planning, and delivery activities. In DWS, L24 Working Rooms provide structured environments for teams to apply DWS frameworks, access shared resources, and execute transformation work. These rooms support various work modes including design sprints, development cycles, knowledge sharing, and cross-studio collaboration, all aligned with DWS principles and quality standards.',
    category: 'ways-of-working',
    used_in: ['l24-working-rooms', 'dws-core'],
    related_terms: ['dws', 'dws-1', 'dco'],
    status: 'Active',
    slug: 'l24-working-rooms',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  'dt2-0': {
    id: '8',
    term: 'Digital Transformation 2.0 (DT2.0)',
    short_definition: 'The evolved approach to digital transformation that emphasizes continuous adaptation, platform thinking, and ecosystem integration.',
    full_definition: 'At DQ, Digital Transformation 2.0 (DT2.0) represents our evolved framework for transformation that moves beyond traditional project-based approaches. In DWS, DT2.0 emphasizes continuous adaptation, platform-based architectures, and ecosystem integration. DT2.0 guides how DQ teams approach transformation initiatives, focusing on building sustainable digital capabilities rather than one-time implementations. This framework informs DWS delivery practices and quality standards.',
    category: 'frameworks-models',
    used_in: ['dws-core', 'governance'],
    related_terms: ['dws', 'dtmf'],
    status: 'Active',
    slug: 'dt2-0',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  dtmf: {
    id: '9',
    term: 'Digital Transformation Management Framework (DTMF)',
    short_definition: 'The management and governance framework that guides how DQ plans, executes, and measures digital transformation initiatives.',
    full_definition: 'In DWS, Digital Transformation Management Framework (DTMF) provides the management structure and governance practices for planning, executing, and measuring transformation initiatives. At DQ, DTMF defines how we structure transformation programs, manage stakeholder alignment, track progress, and ensure quality outcomes. DTMF integrates with DWS operational practices, providing the management layer that enables studios to deliver transformation effectively while maintaining alignment with DQ standards and client expectations.',
    category: 'governance-systems',
    used_in: ['dws-core', 'governance'],
    related_terms: ['dws', 'dt2-0'],
    status: 'Active',
    slug: 'dtmf',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
  ghc: {
    id: '10',
    term: 'Golden Honeycomb of Competence (GHC)',
    short_definition: 'The competency framework that defines the essential skills, behaviors, and capabilities expected of DQ associates.',
    full_definition: 'At DQ, Golden Honeycomb of Competence (GHC) is the authoritative competency model that defines the skills, behaviors, and capabilities required for digital mastery. In DWS, GHC provides the operational language for associate development, performance evaluation, and career progression. GHC encompasses technical competencies, digital thinking, collaboration skills, and leadership capabilities that enable associates to contribute effectively to DQ transformation work. The framework guides learning programs, performance management, and organizational capability development.',
    category: 'frameworks-models',
    used_in: ['learning-center', 'governance', 'dws-core'],
    related_terms: ['dws', 'dco'],
    status: 'Active',
    slug: 'ghc',
    owner: 'Digital Qatalyst',
    last_updated: '2025-12-13',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  'frameworks-models': 'Frameworks & Models',
  'ways-of-working': 'Ways of Working',
  'governance-systems': 'Governance & Systems',
  'platforms-tools': 'Platforms & Tools',
  'metrics-performance': 'Metrics & Performance',
  'roles-structures': 'Roles & Structures',
};

const USED_IN_LABELS: Record<string, string> = {
  'dws-core': 'DWS Core',
  'l24-working-rooms': 'L24 Working Rooms',
  'learning-center': 'Learning Center',
  'marketplaces': 'Marketplaces',
  'governance': 'Governance',
};

// SideNav component for Glossary
interface GlossarySideNavProps {
  sections: Array<{ id: string; label: string }>;
}

function GlossarySideNav({ sections }: GlossarySideNavProps) {
  // Early return must be before hooks to follow Rules of Hooks
  if (sections.length === 0) return null;

  const [currentSection, setCurrentSection] = useState(sections[0]?.id || '');

  // Scroll spy: automatically detect which section is in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            setCurrentSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const handleClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="pr-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Contents
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function GlossaryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerm = async () => {
      if (!slug) {
        setError('Term not found');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await (supabaseClient as any)!
          .from('glossary_terms')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;

        if (data) {
          // Map Supabase data to GlossaryTerm format
          const mappedTerm: GlossaryTerm = {
            id: data.id,
            term: data.term,
            short_definition: data.short_definition,
            full_definition: data.full_definition,
            category: data.category,
            used_in: data.used_in || [],
            related_terms: data.related_terms || [],
            status: data.status as 'Active' | 'Deprecated',
            slug: data.slug,
            owner: data.owner,
            last_updated: data.updated_at ? new Date(data.updated_at).toISOString().split('T')[0] : undefined,
          };
          setTerm(mappedTerm);
        } else {
          // Fallback to sample data if not found in Supabase
          const foundTerm = FALLBACK_TERMS[slug];
          if (foundTerm) {
            setTerm(foundTerm);
          } else {
            setError('Term not found');
          }
        }
      } catch (err) {
        console.error('Error fetching glossary term:', err);
        // Fallback to sample data on error
        const foundTerm = FALLBACK_TERMS[slug];
        if (foundTerm) {
          setTerm(foundTerm);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load term');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [slug]);

  // Build sections for sidebar navigation - MUST be before early returns
  const sections = useMemo(() => {
    if (!term) return [];
    const sectionList: GlossarySideNavProps['sections'] = [];
    if (term.full_definition) {
      sectionList.push({ id: 'definition', label: 'Definition' });
    }
    sectionList.push({ id: 'metadata', label: 'Metadata' });
    if (term.related_terms && term.related_terms.length > 0) {
      sectionList.push({ id: 'related-terms', label: 'Related Terms' });
    }
    return sectionList;
  }, [term]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    );
  }

  if (error || !term) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error || 'Term not found'}</p>
              <button
                onClick={() => navigate('/knowledge-center/glossary')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Glossary
              </button>
            </div>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#030E31] to-[#0A1A3B] text-white py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-300 hover:text-white inline-flex items-center">
                  <HomeIcon size={14} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={14} className="text-gray-400" />
                  <Link
                    to="/knowledge-center/glossary"
                    className="ml-1 text-gray-300 hover:text-white md:ml-2"
                  >
                    Glossary
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={14} className="text-gray-400" />
                  <span className="ml-1 text-gray-400 md:ml-2">{term.term}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              Glossary Term
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            {term.term}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed">
            {term.short_definition}
          </p>
          {term.status === 'Deprecated' && (
            <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30">
              Deprecated
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Definition Section */}
              {term.full_definition && (
                <section id="definition" className="mb-16 scroll-mt-24">
                  <div className="relative">
                    {/* Decorative left border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pl-6 font-inter tracking-tight">
                      Definition
                    </h2>
                  </div>
                  <div className="pl-6 prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">{term.full_definition}</p>
                  </div>
                </section>
              )}

              {/* Metadata Section */}
              <section id="metadata" className="mb-16 scroll-mt-24">
                <div className="relative">
                  {/* Decorative left border */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pl-6 font-inter tracking-tight">
                    Metadata
                  </h2>
                </div>
                <div className="pl-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Category */}
                    {term.category && (
                      <div>
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Category
                        </dt>
                        <dd className="text-base text-gray-900">
                          {CATEGORY_LABELS[term.category] || term.category}
                        </dd>
                      </div>
                    )}

                    {/* Used In */}
                    {term.used_in && term.used_in.length > 0 && (
                      <div>
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Used In
                        </dt>
                        <dd className="text-base text-gray-900">
                          {term.used_in.map((usedIn, idx) => (
                            <span key={usedIn}>
                              <Link
                                to={`/knowledge-center/glossary?used_in=${usedIn}`}
                                className="text-[#0A1433] hover:underline"
                              >
                                {USED_IN_LABELS[usedIn] || usedIn}
                              </Link>
                              {idx < term.used_in.length - 1 && <span className="text-gray-400 mx-1">·</span>}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}

                    {/* Owner */}
                    {term.owner && (
                      <div>
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Owner
                        </dt>
                        <dd className="text-base text-gray-900">{term.owner}</dd>
                      </div>
                    )}

                    {/* Last Updated */}
                    {term.last_updated && (
                      <div>
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Last Updated
                        </dt>
                        <dd className="text-base text-gray-900">
                          {new Date(term.last_updated).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </dd>
                      </div>
                    )}

                    {/* Status */}
                    {term.status && (
                      <div>
                        <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Status
                        </dt>
                        <dd className="text-base text-gray-900">{term.status}</dd>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Related Terms Section */}
              {term.related_terms && term.related_terms.length > 0 && (
                <section id="related-terms" className="mb-16 scroll-mt-24">
                  <div className="relative">
                    {/* Decorative left border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pl-6 font-inter tracking-tight">
                      Related Terms
                    </h2>
                  </div>
                  <div className="pl-6">
                    <div className="flex flex-wrap gap-3">
                      {term.related_terms.map((relatedTerm) => {
                        const relatedSlug = relatedTerm.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <Link
                            key={relatedTerm}
                            to={`/knowledge-center/glossary/${relatedSlug}`}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-[#0A1433] bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            {relatedTerm}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Sticky Side Navigation */}
            <aside className="lg:col-span-1">
              <GlossarySideNav sections={sections} />
            </aside>
          </div>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  );
}

export default GlossaryDetailPage;

