import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SearchBar } from '../../components/SearchBar';
import { GlossaryFilters } from '../../components/glossary/GlossaryFilters';
import { GlossaryCard, GlossaryTerm } from '../../components/glossary/GlossaryCard';
import { HomeIcon, ChevronRightIcon, FilterIcon, XIcon } from 'lucide-react';
import { useAuth } from '../../components/Header/context/AuthContext';
import { parseCsv } from '../../utils/guides';
import { supabaseClient } from '../../lib/supabaseClient';

// Fallback data - used only if Supabase fetch fails
const FALLBACK_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
];

export function GlossaryMarketplacePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Initialize with default filter: Status = Active only
  const [queryParams, setQueryParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    // Default to Active status if no status filter is set
    if (!params.get('status')) {
      params.set('status', 'active');
    }
    return params;
  });
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  // Facets not needed - filters use constants directly
  const facets = {
    category: [],
    used_in: [],
    status: [],
  };

  // Sync queryParams with searchParams, maintaining default status filter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Maintain default Active status if no status filter is set
    if (!params.get('status')) {
      params.set('status', 'active');
    }
    setQueryParams(params);
  }, [searchParams]);

  // Fetch glossary terms from Supabase
  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await (supabaseClient as any)!
          .from('glossary_terms')
          .select('*')
          .order('term', { ascending: true });

        if (error) {
          console.error('Supabase query error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
          console.error('Error hint:', error.hint);
          
          // Provide helpful error messages based on error type
          if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
            throw new Error('Table "glossary_terms" does not exist. Please run the SQL scripts in sql/glossary_terms_table.sql and sql/glossary_terms_seed.sql in your Supabase SQL editor.');
          } else if (error.code === 'PGRST301' || error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('permission denied')) {
            throw new Error('Permission denied. Please check Row Level Security (RLS) policies. The table should allow public read access.');
          } else {
            throw new Error(`Database error: ${error.message || 'Unknown error'}`);
          }
        }

        // Map Supabase data to GlossaryTerm format
        const mappedTerms: GlossaryTerm[] = (data || []).map((row: any) => ({
          id: row.id,
          term: row.term,
          short_definition: row.short_definition,
          full_definition: row.full_definition,
          category: row.category,
          used_in: Array.isArray(row.used_in) ? row.used_in : [],
          related_terms: Array.isArray(row.related_terms) ? row.related_terms : [],
          status: row.status as 'Active' | 'Deprecated',
          slug: row.slug,
          owner: row.owner,
          last_updated: row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : undefined,
        }));

        // Debug logging (temporary - remove after verification)
        if (mappedTerms.length > 0) {
          console.log('Glossary sample:', mappedTerms[0]);
          console.log('Sample category:', mappedTerms[0].category, typeof mappedTerms[0].category);
          console.log('Sample used_in:', mappedTerms[0].used_in, Array.isArray(mappedTerms[0].used_in));
          console.log('Sample status:', mappedTerms[0].status, typeof mappedTerms[0].status);
        }

        if (mappedTerms.length === 0) {
          console.warn('No glossary terms found in database. Using fallback data.');
          setTerms(FALLBACK_GLOSSARY_TERMS);
        } else {
          console.log(`Successfully loaded ${mappedTerms.length} glossary terms from Supabase`);
          setTerms(mappedTerms);
        }
      } catch (err) {
        console.error('Error fetching glossary terms:', err);
        // Fallback to sample data if Supabase fails
        setTerms(FALLBACK_GLOSSARY_TERMS);
        setError(err instanceof Error ? err.message : 'Failed to load glossary terms');
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  // Filter terms based on query params
  const filteredTerms = useMemo(() => {
    let result = [...terms];

    // Search query
    const searchQuery = queryParams.get('q') || '';
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (term) =>
          term.term.toLowerCase().includes(query) ||
          term.short_definition.toLowerCase().includes(query) ||
          term.full_definition?.toLowerCase().includes(query)
      );
    }

    // Category filter (multi-select: OR within, AND across)
    const selectedCategories = parseCsv(queryParams.get('category'));
    if (selectedCategories.length > 0) {
      result = result.filter((term) => selectedCategories.includes(term.category));
    }

    // Alphabet filter (single-select)
    const selectedLetter = queryParams.get('alphabet');
    if (selectedLetter && selectedLetter !== 'all') {
      result = result.filter((term) =>
        term.term.charAt(0).toLowerCase() === selectedLetter.toLowerCase()
      );
    }

    // Used In filter (multi-select: OR within, AND across)
    // Term matches if ANY of its used_in values match ANY selected filter
    const selectedUsedIn = parseCsv(queryParams.get('used_in'));
    if (selectedUsedIn.length > 0) {
      result = result.filter((term) => {
        if (!Array.isArray(term.used_in) || term.used_in.length === 0) return false;
        return term.used_in.some((ui) => selectedUsedIn.includes(ui));
      });
    }

    // Status filter (multi-select: OR within, AND across)
    // Default to Active only if no status filter is set
    const selectedStatuses = parseCsv(queryParams.get('status'));
    if (selectedStatuses.length > 0) {
      result = result.filter((term) => {
        // Map filter IDs to database values: 'active' -> 'Active', 'deprecated' -> 'Deprecated'
        const statusMap: Record<string, string> = {
          'active': 'Active',
          'deprecated': 'Deprecated',
        };
        const termStatus = term.status;
        return selectedStatuses.some((s) => {
          const dbStatus = statusMap[s.toLowerCase()] || s;
          return termStatus === dbStatus;
        });
      });
    } else {
      // Default behavior: show only Active terms
      result = result.filter((term) => term.status === 'Active');
    }

    return result;
  }, [terms, queryParams]);

  const handleFilterChange = useCallback((next: URLSearchParams) => {
    next.delete('page');
    const qs = next.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
    setQueryParams(new URLSearchParams(next.toString()));
  }, []);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleTermClick = (term: GlossaryTerm) => {
    navigate(`/knowledge-center/glossary/${term.slug || term.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
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
                <Link
                  to="/marketplace/guides?tab=resources"
                  className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                >
                  Library
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">DQ Glossary</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DQ Glossary</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shared terminology, frameworks, and concepts used across DWS, L24, and Digital Qatalyst.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            searchQuery={queryParams.get('q') || ''}
            placeholder="Search glossary terms..."
            ariaLabel="Search glossary terms"
            setSearchQuery={(q: string) => {
              const next = new URLSearchParams(queryParams.toString());
              if (q) next.set('q', q);
              else next.delete('q');
              const qs = next.toString();
              window.history.replaceState(
                null,
                '',
                `${window.location.pathname}${qs ? '?' + qs : ''}`
              );
              setQueryParams(new URLSearchParams(next.toString()));
            }}
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Mobile filter toggle */}
          <div className="xl:hidden sticky top-16 z-20 bg-gray-50 py-2 shadow-sm">
            <div className="flex justify-between items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700 w-full justify-center"
                aria-expanded={showFilters}
                aria-controls="filter-sidebar"
              >
                <FilterIcon size={18} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Filter sidebar - mobile/tablet */}
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-30 transition-opacity duration-300 xl:hidden ${
              showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={toggleFilters}
            aria-hidden={!showFilters}
          >
            <div
              id="filter-sidebar"
              className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                showFilters ? 'translate-x-0' : '-translate-x-full'
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={toggleFilters}
                    className="p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close filters"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <GlossaryFilters
                    facets={facets}
                    query={queryParams}
                    onChange={handleFilterChange}
                    availableTerms={terms}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter sidebar - desktop */}
          <div className="hidden xl:block xl:w-1/4">
            <GlossaryFilters 
              facets={facets} 
              query={queryParams} 
              onChange={handleFilterChange}
              availableTerms={terms}
            />
          </div>

          {/* Main content - Card Grid */}
          <div className="xl:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 max-w-2xl mx-auto">
                <p className="text-red-600 mb-4 font-semibold">{error}</p>
                {error.includes('does not exist') && (
                  <div className="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm">
                    <p className="font-semibold text-yellow-800 mb-2">Setup Required:</p>
                    <ol className="list-decimal list-inside space-y-1 text-yellow-700">
                      <li>Open your Supabase SQL Editor</li>
                      <li>Run the SQL from <code className="bg-yellow-100 px-1 rounded">sql/glossary_terms_table.sql</code></li>
                      <li>Run the SQL from <code className="bg-yellow-100 px-1 rounded">sql/glossary_terms_seed.sql</code></li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                )}
                {error.includes('Permission denied') && (
                  <div className="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-sm">
                    <p className="font-semibold text-yellow-800 mb-2">RLS Policy Issue:</p>
                    <p className="text-yellow-700">The table exists but Row Level Security is blocking access. Make sure you've run the RLS policy from <code className="bg-yellow-100 px-1 rounded">sql/glossary_terms_table.sql</code></p>
                  </div>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredTerms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No glossary terms found</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Glossary Terms
                  </h2>
                  <p className="text-sm text-gray-500">
                    Showing {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {/* Reference Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTerms.map((term) => (
                    <GlossaryCard
                      key={term.id}
                      term={term}
                      onClick={handleTermClick}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  );
}

export default GlossaryMarketplacePage;

