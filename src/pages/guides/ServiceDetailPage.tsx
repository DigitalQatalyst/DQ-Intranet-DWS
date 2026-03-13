import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { supabaseClient } from '../../lib/supabaseClient';
import { CheckCircle2, ArrowRight, Home, ChevronRight, Bookmark } from 'lucide-react';

/* ─────────────────────────────── Types ─────────────────────────────────── */

interface GuideRecord {
  id: string;
  slug?: string;
  title: string;
  summary?: string;
  heroImageUrl?: string | null;
  domain?: string | null;
  guideType?: string | null;
  functionArea?: string | null;
  subDomain?: string | null;
  unit?: string | null;
  location?: string | null;
  status?: string | null;
  complexityLevel?: string | null;
  skillLevel?: string | null;
  estimatedTimeMin?: number | null;
  lastUpdatedAt?: string | null;
  authorName?: string | null;
  authorOrg?: string | null;
  downloadCount?: number | null;
  documentUrl?: string | null;
  body?: string | null;
}

type TabId = 'overview' | 'other-materials';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',        label: 'Overview' },
  { id: 'other-materials', label: 'Other Materials' },
];

/* ─────────────────────────────── Sub-components ────────────────────────── */

/** Heading block with left coloured accent bar — exact Lovable pattern */
const Heading = ({ text }: { text: string }) => (
  <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900">
    <span className="h-6 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'hsl(var(--cta))' }} />
    {text}
  </h2>
);

/** Green check-circle checklist — exact Lovable pattern */
const Checklist = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <CheckCircle2
          className="mt-0.5 h-5 w-5 flex-shrink-0"
          style={{ color: 'hsl(var(--success))' }}
        />
        <span className="text-gray-800 leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

/* ─────────────────────────────── Main Page ─────────────────────────────── */

export const ServiceDetailPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const [guide, setGuide] = useState<GuideRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const key = String(itemId || '');
        let { data: row, error: err1 } = await supabaseClient
          .from('guides').select('*').eq('slug', key).maybeSingle();

        if (err1 || !row) {
          const { data: row2, error: err2 } = await supabaseClient
            .from('guides').select('*').eq('id', key).maybeSingle();
          if (err2) throw err2;
          row = row2 as any;
        }
        if (!row) throw new Error('Not found');

        const mapped: GuideRecord = {
          id: row.id, slug: row.slug, title: row.title,
          summary: row.summary ?? undefined,
          heroImageUrl: row.hero_image_url ?? row.heroImageUrl ?? null,
          domain: row.domain ?? null,
          guideType: row.guide_type ?? row.guideType ?? null,
          functionArea: row.function_area ?? null,
          subDomain: row.sub_domain ?? row.subDomain ?? null,
          unit: row.unit ?? null, location: row.location ?? null,
          status: row.status ?? null,
          complexityLevel: row.complexity_level ?? row.complexityLevel ?? null,
          skillLevel: row.skill_level ?? row.skillLevel ?? null,
          estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin ?? null,
          lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt ?? null,
          authorName: row.author_name ?? row.authorName ?? null,
          authorOrg: row.author_org ?? row.authorOrg ?? null,
          downloadCount: row.download_count ?? row.downloadCount ?? null,
          documentUrl: row.document_url ?? row.documentUrl ?? null,
          body: row.body ?? null,
        };
        if (!cancelled) setGuide(mapped);
      } catch {
        if (!cancelled) setError('Service Guideline not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [itemId]);

  /* ── Loading / Error states ── */
  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(p => !p)} sidebarOpen={sidebarOpen} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading service details…</p>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );

  if (error || !guide) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(p => !p)} sidebarOpen={sidebarOpen} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't locate that service guideline.</p>
          <button
            onClick={() => navigate('/marketplace/guides')}
            className="px-5 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: 'hsl(var(--hero))' }}
          >Back to Marketplace</button>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );

  /* ── Derived content ── */
  const fullGuidePath = `/marketplace/guides/${guide.slug || guide.id}`;



  const formattedDate = guide.lastUpdatedAt 
    ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : 'Unknown';

  const summaryRows: { label: string; value: string }[] = [
    { label: 'Date Uploaded',    value: formattedDate },
    { label: 'Created By',       value: guide.authorName || 'DQ Admin' },
    { label: 'Functional Area',  value: guide.functionArea || 'General' },
    { label: 'Unit',             value: guide.unit || 'All Units' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header toggleSidebar={() => setSidebarOpen(p => !p)} sidebarOpen={sidebarOpen} />

      <main className="flex-1">
        {/* ── Hero Banner — glassmorphism, radial gradient mesh ── */}
        <div
          className="relative overflow-hidden pt-4 pb-20 px-6"
          style={{
            background: `linear-gradient(to right, #192D6C, #051139)`,
          }}
        >
          {/* Floating orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, hsl(var(--cta) / 0.6), transparent 70%)' }} />
            <div className="absolute top-[30%] right-[10%] w-64 h-64 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(260 70% 60% / 0.5), transparent 70%)' }} />
            <div className="absolute bottom-[5%] left-[40%] w-56 h-56 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, hsl(200 80% 60% / 0.5), transparent 70%)' }} />
          </div>

          {/* Fade-to-white gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, white, transparent)' }} />

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* ── Breadcrumbs row — Lovable HeroBanner pattern ── */}
            <nav className="flex items-center justify-between pb-6">
              <ol className="flex items-center gap-1 text-sm">
                <li className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }} />
                  <Link
                    to="/"
                    className="transition-colors hover:opacity-80"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }}
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1" style={{ color: 'hsl(var(--hero-foreground) / 0.3)' }}>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link
                    to="/marketplace/guides"
                    className="transition-colors hover:opacity-80"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }}
                  >
                    Guides
                  </Link>
                </li>
                <li className="flex items-center gap-1" style={{ color: 'hsl(var(--hero-foreground) / 0.3)' }}>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span
                    className="font-medium max-w-[220px] truncate"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.85)' }}
                  >
                    {guide.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Glassmorphism content panel */}
            <div
              className="rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(210,220,255,0.07)',
                border: '1px solid rgba(210,220,255,0.12)',
              }}
            >
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                  style={{ color: 'hsl(var(--hero-foreground))' }}>
                  {guide.title}
                </h1>

                <p className="max-w-2xl text-base md:text-lg leading-relaxed"
                  style={{ color: 'hsl(var(--hero-muted))' }}>
                  Guidelines for transitioning to an associate-owned device model at DQ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar — bottom-line indicator style ── */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex gap-0 overflow-x-auto scrollbar-none">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative whitespace-nowrap px-5 py-4 text-sm font-medium transition-colors focus:outline-none"
                  style={{
                    color: activeTab === tab.id ? '#111827' : '#6B7280',
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main 2-col layout ── */}
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left — Tab content (2 cols) */}
            <div className="lg:col-span-2 space-y-8">

              {activeTab === 'overview' && (
                <>
                  <Heading text="Overview" />
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, 
                      reducing asset management costs, and improving the accountability of devices used for company work. 
                      As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate 
                      the risk of asset theft by departing associates, while ensuring secure management and compliance 
                      with company standards.
                    </p>
                    <p>
                      The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for 
                      transitioning to an associate-owned device model at DQ. This initiative aims to:
                    </p>
                    <div className="pt-2">
                      <Checklist items={[
                        "Mitigate Asset Theft.",
                        "Promote Accountability.",
                        "Support Seamless Transitions.",
                        "Optimize Operational Efficiency."
                      ]} />
                    </div>
                  </div>

                </>
              )}

              {activeTab === 'other-materials' && (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <Heading text="Other Materials" />
                  <p className="mt-2 text-gray-500 max-w-sm">
                    Supplementary resources and templates for this guideline will be coming soon.
                  </p>
                </div>
              )}
            </div>

            {/* Right — Sticky metadata sidebar (1 col) */}
            <aside className="order-first lg:order-last">
              <div className="sticky top-6 space-y-4">
                {/* Summary card */}
                <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
                  {/* card header */}
                  <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">Guideline summary</h3>
                  </div>
                  {/* key-value rows */}
                  <div className="px-5 py-4 space-y-3">
                    {summaryRows.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  {/* CTAs */}
                  <div className="px-5 pb-5 space-y-2.5">
                    <button
                      onClick={() => navigate(fullGuidePath)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'hsl(var(--cta))' }}
                    >
                      More Detail <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>


              </div>
            </aside>
          </div>
        </div>

        {/* ── Related Services section ── */}
        <section className="border-t border-gray-100 bg-gray-50 px-6 py-12">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Related Services</h2>
              <Link
                to="/marketplace/guides"
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Browse all guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Placeholder cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white h-40 shadow-sm flex items-center justify-center"
                >
                  <span className="text-gray-400 text-sm font-medium">Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default ServiceDetailPage;
