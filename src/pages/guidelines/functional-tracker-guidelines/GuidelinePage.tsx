import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'
import { SummaryTable } from './SummaryTable'
import { FullTableModal } from './FullTableModal'
import { GuideCard } from '../../../components/guides/GuideCard'

interface RelatedGuide {
  id: string
  slug?: string
  title: string
  summary?: string
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null
  lastUpdatedAt?: string | null
  downloadCount?: number | null
  isEditorsPick?: boolean | null
  estimatedTimeMin?: number | null
}

function GuidelinePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const currentSlug = 'dq-functional-tracker-guidelines'
  
  // Modal state management for each table
  const [trackerStructureModalOpen, setTrackerStructureModalOpen] = useState(false)
  const [taskStructureModalOpen, setTaskStructureModalOpen] = useState(false)
  
  // Related guides state
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([])
  const [relatedGuidesLoading, setRelatedGuidesLoading] = useState(true)
  const [currentGuide, setCurrentGuide] = useState<{ domain?: string | null; guideType?: string | null } | null>(null)

  // Fetch current guide data
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: guideData, error } = await supabaseClient
          .from('guides')
          .select('domain, guide_type')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled) {
          if (guideData) {
            setCurrentGuide({
              domain: guideData.domain,
              guideType: guideData.guide_type
            })
          } else {
            setCurrentGuide({ domain: null, guideType: null })
          }
        }
      } catch (error) {
        console.error('Error fetching current guide:', error)
        if (!cancelled) {
          setCurrentGuide({ domain: null, guideType: null })
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentSlug])

  // Fetch related guides
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (currentGuide === null) return
      
      setRelatedGuidesLoading(true)
      try {
        const selectCols = 'id,slug,title,summary,hero_image_url,guide_type,domain,last_updated_at,download_count,is_editors_pick,estimated_time_min'
        let first: any[] = []
        
        if (currentGuide.domain) {
          const { data: rows } = await supabaseClient
            .from('guides')
            .select(selectCols)
            .eq('domain', currentGuide.domain)
            .neq('slug', currentSlug)
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          first = rows || []
        }
        
        let results = first
        
        if ((results?.length || 0) < 6 && currentGuide.guideType) {
          const { data: rows2 } = await supabaseClient
            .from('guides')
            .select(selectCols)
            .eq('guide_type', currentGuide.guideType)
            .neq('slug', currentSlug)
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          
          const map = new Map<string, any>()
          for (const r of (first || [])) map.set(r.slug || r.id, r)
          for (const r of (rows2 || [])) {
            const k = r.slug || r.id
            if (!map.has(k)) map.set(k, r)
          }
          results = Array.from(map.values()).slice(0, 6)
        }
        
        if ((results?.length || 0) < 6 && !currentGuide.domain && !currentGuide.guideType) {
          const { data: rows3 } = await supabaseClient
            .from('guides')
            .select(selectCols)
            .ilike('domain', '%guideline%')
            .neq('slug', currentSlug)
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          
          const map = new Map<string, any>()
          for (const r of (results || [])) map.set(r.slug || r.id, r)
          for (const r of (rows3 || [])) {
            const k = r.slug || r.id
            if (!map.has(k)) map.set(k, r)
          }
          results = Array.from(map.values()).slice(0, 6)
        }
        
        if (!cancelled) {
          setRelatedGuides((results || []).map((r: any) => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            summary: r.summary,
            heroImageUrl: r.hero_image_url,
            domain: r.domain,
            guideType: r.guide_type,
            lastUpdatedAt: r.last_updated_at,
            downloadCount: r.download_count,
            isEditorsPick: r.is_editors_pick,
            estimatedTimeMin: r.estimated_time_min,
          })))
          setRelatedGuidesLoading(false)
        }
      } catch (error) {
        console.error('Error fetching related guides:', error)
        if (!cancelled) {
          setRelatedGuides([])
          setRelatedGuidesLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentGuide, currentSlug])

  const handleGuideClick = (guide: RelatedGuide) => {
    const slug = guide.slug || guide.id
    navigate(`/marketplace/guides/${encodeURIComponent(slug)}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
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
                  <Link to="/marketplace/guides?tab=guidelines" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Guidelines
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Functional Tracker Guidelines</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Context Section */}
              <GuidelineSection id="context" title="Context">
                <p className="mb-4">
                  The Functional Tracker has been established across all Digital Qatalyst (DQ) factories (Business Units) as a unified system to monitor and manage all associate tasks.
                </p>
                <p className="mb-4">
                  It consolidates information from multiple workstreams into a single tracker, allowing real-time visibility into progress, performance, and task health across the organization.
                </p>
                <p>
                  By standardizing how tasks are created, maintained, and reviewed, the Functional Tracker ensures consistency in reporting, strengthens accountability, and supports proactive identification of issues or inefficiencies within each factory. These guidelines ensure the tracker is used effectively and consistently across all units, maintaining its role as a reliable management and decision-support tool.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p className="mb-4">
                  The Functional Tracker serves as the single source of truth for tracking all work items (tasks) across each DQ Factory (Business Unit). It provides visibility on:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Task progress and status by associates</li>
                  <li>Overall factory health and performance</li>
                  <li>Gaps and bottlenecks that impact delivery</li>
                </ul>
                <p>
                  It enables Scrum Masters, Factory Leads, and Associates to maintain transparency, accountability, and alignment across all active workstreams.
                </p>
              </GuidelineSection>

              {/* Functional Tracker Structure Section */}
              <GuidelineSection id="tracker-structure" title="Functional Tracker Structure">
                <p className="mb-6">
                  Each Factory&apos;s Functional Tracker is structured with the following elements:
                </p>
                <SummaryTable
                  title="Functional Tracker Structure"
                  columns={[
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      item: '01. WI Areas',
                      description: 'Defines the key work item clusters or areas of focus.',
                    },
                    {
                      item: '02. Purpose',
                      description: 'Clarifies the goal or intent of each work item area.',
                    },
                  ]}
                  onViewFull={() => setTrackerStructureModalOpen(true)}
                />
                <FullTableModal
                  isOpen={trackerStructureModalOpen}
                  onClose={() => setTrackerStructureModalOpen(false)}
                  title="Functional Tracker Structure"
                  columns={[
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      item: '01. WI Areas',
                      description: 'Defines the key work item clusters or areas of focus.',
                    },
                    {
                      item: '02. Purpose',
                      description: 'Clarifies the goal or intent of each work item area.',
                    },
                    {
                      item: '03. Tower',
                      description: 'Represents the sub-units or focus areas under each factory.',
                    },
                    {
                      item: '04. Customer',
                      description: 'Indicates the end customer or stakeholder benefiting from the task.',
                    },
                    {
                      item: '05. Priority (Level)',
                      description: 'Reflects the urgency or importance of the task.',
                    },
                    {
                      item: '06. Priority (Scope)',
                      description: 'Captures the task\'s impact or scope of influence.',
                    },
                    {
                      item: '07. Assignments',
                      description: 'Lists all tasks and links them to their relevant Work Item Areas.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Task Structure Section */}
              <GuidelineSection id="task-structure" title="Task Structure (Planner)">
                <p className="mb-6">
                  Each task linked to the tracker (via Planner) must include:
                </p>
                <SummaryTable
                  title="Task Structure (Planner)"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: '01. Context',
                      action: 'A clear description of the task background or what it is addressing.',
                    },
                    {
                      guideline: '02. Purpose',
                      action: 'Why does the task exist (value, impact, or problem it solves).',
                    },
                  ]}
                  onViewFull={() => setTaskStructureModalOpen(true)}
                />
                <FullTableModal
                  isOpen={taskStructureModalOpen}
                  onClose={() => setTaskStructureModalOpen(false)}
                  title="Task Structure (Planner)"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: '01. Context',
                      action: 'A clear description of the task background or what it is addressing.',
                    },
                    {
                      guideline: '02. Purpose',
                      action: 'Why does the task exist (value, impact, or problem it solves).',
                    },
                    {
                      guideline: '03. Approach',
                      action: 'The method or steps to achieve the task.',
                    },
                    {
                      guideline: '04. Outcome',
                      action: 'The tangible, measurable deliverable expected.',
                    },
                    {
                      guideline: '05. Relevant Links',
                      action: 'References to supporting materials or outputs.',
                    },
                    {
                      guideline: '06. Checklist Items (CLIs)',
                      action: 'Actionable subtasks with clear completion dates.',
                    },
                  ]}
                />
              </GuidelineSection>
            </div>

            {/* Right Column - Sticky Side Navigation */}
            <aside className="lg:col-span-1">
              <SideNav />
            </aside>
          </div>
        </div>
      </main>

      {/* Related Guides Section */}
      <section className="bg-white border-t border-gray-200 py-16 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0A1A3B' }}>
              Related Guidelines
            </h2>
            <p className="text-gray-600">
              Explore other guides that might be helpful
            </p>
          </div>
          
          {relatedGuidesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : relatedGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGuides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onClick={() => handleGuideClick(guide)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No related guides found at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Need Help Section */}
      <section className="bg-white border-t border-gray-200 py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left side - Title */}
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0A1A3B' }}>
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm">
                Contact the team for assistance
              </p>
            </div>

            {/* Right side - Contacts */}
            <div className="flex flex-wrap gap-4">
              {/* Contact 1 - Sreya Lakshmi */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">SL</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sreya Lakshmi</p>
                  <p className="text-xs text-gray-600">CoE Analyst</p>
                </div>
              </div>

              {/* Contact 2 - Fadil Alli */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">FA</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fadil Alli</p>
                  <p className="text-xs text-gray-600">CoE Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

