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
  const currentSlug = 'dq-agenda-scheduling-guidelines'
  
  // Modal state management for each table
  const [keyCharacteristicsModalOpen, setKeyCharacteristicsModalOpen] = useState(false)
  const [schedulingPracticesModalOpen, setSchedulingPracticesModalOpen] = useState(false)
  const [rolesModalOpen, setRolesModalOpen] = useState(false)
  const [agendaContextModalOpen, setAgendaContextModalOpen] = useState(false)
  const [agendaPurposeModalOpen, setAgendaPurposeModalOpen] = useState(false)
  const [agendaStructureModalOpen, setAgendaStructureModalOpen] = useState(false)
  const [relatedMaterialsModalOpen, setRelatedMaterialsModalOpen] = useState(false)
  
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Agenda & Scheduling Guidelines</span>
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
                  Effective agenda planning and scheduling ensure DQ operates with discipline, alignment, and efficiency.
                </p>
                <p>
                  These guidelines standardize how agendas are built and sessions are scheduled to maximize productivity and create clarity for all participants.
                </p>
              </GuidelineSection>

              {/* Definition Section */}
              <GuidelineSection id="definition" title="Definition">
                <p>
                  Agenda and scheduling practices define the structured approach for planning, organizing, and executing meetings, workshops, and sessions. This includes setting clear objectives, sharing preparatory material in advance, aligning schedules to participant availability, and ensuring each session is purposeful, time-bound, and outcome-oriented.
                </p>
              </GuidelineSection>

              {/* Purpose Section */}
              <GuidelineSection id="purpose" title="Purpose">
                <p>
                  Bring order, clarity, and predictability to DQ&apos;s working rhythm. Ensure time is respected, objectives are achieved, and every session contributes to progress.
                </p>
              </GuidelineSection>

              {/* Key Characteristics Section */}
              <GuidelineSection id="key-characteristics" title="Key Characteristics">
                <p className="mb-6">
                  The following key characteristics define how agendas and schedules are structured and managed across DQ to ensure consistency, alignment, and value delivery.
                </p>
                <SummaryTable
                  title="Key Characteristics"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Clear and Purposeful',
                      description: 'Agendas are drafted with well-defined context, purpose, and logical flow.',
                    },
                    {
                      number: '02',
                      item: 'Transparent and Accessible',
                      description: 'Agendas and schedules are shared in advance, ensuring participants can prepare.',
                    },
                  ]}
                  onViewFull={() => setKeyCharacteristicsModalOpen(true)}
                />
                <FullTableModal
                  isOpen={keyCharacteristicsModalOpen}
                  onClose={() => setKeyCharacteristicsModalOpen(false)}
                  title="Key Characteristics"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Item', accessor: 'item' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      item: 'Clear and Purposeful',
                      description: 'Agendas are drafted with well-defined context, purpose, and logical flow.',
                    },
                    {
                      number: '02',
                      item: 'Transparent and Accessible',
                      description: 'Agendas and schedules are shared in advance, ensuring participants can prepare.',
                    },
                    {
                      number: '03',
                      item: 'Time-Disciplined',
                      description: 'Sessions are scheduled within reasonable timeframes and strictly managed against overruns.',
                    },
                    {
                      number: '04',
                      item: 'Inclusive and Aligned',
                      description: 'Scheduling ensures all relevant participants can join, using tools like Teams scheduling assistant.',
                    },
                    {
                      number: '05',
                      item: 'Documented and Traceable',
                      description: 'Agendas, schedules, and related updates are recorded for future reference and accountability.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Types of Scheduling Practices Section */}
              <GuidelineSection id="scheduling-practices" title="Types of Scheduling Practices">
                <p className="mb-6">
                  Different scheduling practices serve specific purposes to maximize efficiency and ensure proper coordination.
                </p>
                <SummaryTable
                  title="Types of Scheduling Practices"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Standard Meeting Booking',
                      action: 'Schedule at least 24 hours in advance with a structured agenda in the invite.',
                    },
                    {
                      number: '02',
                      guideline: 'Urgent Session Setup',
                      action: 'Allow for flexibility in scheduling urgent sessions (exception to the 24-hour rule).',
                    },
                  ]}
                  onViewFull={() => setSchedulingPracticesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={schedulingPracticesModalOpen}
                  onClose={() => setSchedulingPracticesModalOpen(false)}
                  title="Types of Scheduling Practices"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Standard Meeting Booking',
                      action: 'Schedule at least 24 hours in advance with a structured agenda in the invite.',
                    },
                    {
                      number: '02',
                      guideline: 'Urgent Session Setup',
                      action: 'Allow for flexibility in scheduling urgent sessions (exception to the 24-hour rule).',
                    },
                    {
                      number: '03',
                      guideline: 'Recurring Meetings',
                      action: 'Establish recurring schedules for regular Forums (e.g., Scrums, Retros) to reduce ad-hoc bookings.',
                    },
                    {
                      number: '04',
                      guideline: 'Time-Zone Sensitivity',
                      action: 'Account for global time differences when inviting associates from multiple regions.',
                    },
                    {
                      number: '05',
                      guideline: 'Conflict Management',
                      action: 'Use scheduling tools to identify and resolve calendar conflicts proactively.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Roles & Responsibilities Section */}
              <GuidelineSection id="roles" title="Roles & Responsibilities">
                <p className="mb-6">
                  Clear definition of roles ensures effective coordination and accountability during agenda planning and session execution.
                </p>
                <SummaryTable
                  title="Roles & Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      role: 'Facilitator',
                      action: 'Owns the agenda, drives structured discussion, manages time, and ensures objectives are achieved.',
                    },
                    {
                      number: '02',
                      role: 'Note-taker',
                      action: 'Captures key points, decisions, and action items in real time and ensures proper documentation.',
                    },
                  ]}
                  onViewFull={() => setRolesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={rolesModalOpen}
                  onClose={() => setRolesModalOpen(false)}
                  title="Roles & Responsibilities"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Role', accessor: 'role' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      role: 'Facilitator',
                      action: 'Owns the agenda, drives structured discussion, manages time, and ensures objectives are achieved.',
                    },
                    {
                      number: '02',
                      role: 'Note-taker',
                      action: 'Captures key points, decisions, and action items in real time and ensures proper documentation.',
                    },
                    {
                      number: '03',
                      role: 'Organizer',
                      action: 'Sends invites, checks availability, shares preparatory material, and manages scheduling logistics.',
                    },
                    {
                      number: '04',
                      role: 'Participants',
                      action: 'Prepare in advance, actively engage during the session, and respect agenda and time boundaries.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Agenda Design Guidelines Section */}
              <GuidelineSection id="agenda-design" title="Agenda Design Guidelines">
                <p className="mb-6">
                  Effective agenda design ensures sessions are purposeful, well-structured, and outcome-oriented.
                </p>

                {/* Context Subsection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Context</h3>
                  <SummaryTable
                    title="Context Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'State Organizational Context',
                        action: 'Briefly outline the current situation or challenges (e.g., growth spurt, governance gaps).',
                      },
                      {
                        number: '02',
                        guideline: 'Link to Strategic Objectives',
                        action: 'Clearly connect the agenda to broader organizational goals (e.g., visibility, governance, delivery performance).',
                      },
                    ]}
                    onViewFull={() => setAgendaContextModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={agendaContextModalOpen}
                    onClose={() => setAgendaContextModalOpen(false)}
                    title="Context Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'State Organizational Context',
                        action: 'Briefly outline the current situation or challenges (e.g., growth spurt, governance gaps).',
                      },
                      {
                        number: '02',
                        guideline: 'Link to Strategic Objectives',
                        action: 'Clearly connect the agenda to broader organizational goals (e.g., visibility, governance, delivery performance).',
                      },
                      {
                        number: '03',
                        guideline: 'Define the Forum',
                        action: 'Specify why the session exists and how it contributes to ongoing governance or operational improvement.',
                      },
                    ]}
                  />
                </div>

                {/* Purpose Subsection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Purpose</h3>
                  <SummaryTable
                    title="Purpose Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'State the Why (Intended Impact)',
                        action: 'Explain why the session exists and the value it must create (e.g., "Align governance to sustain growth").',
                      },
                      {
                        number: '02',
                        guideline: 'Make Outcomes Explicit',
                        action: 'Name the concrete outcomes/decisions expected (approve plan, confirm KPIs, assign owners & dates) rather than "discuss."',
                      },
                    ]}
                    onViewFull={() => setAgendaPurposeModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={agendaPurposeModalOpen}
                    onClose={() => setAgendaPurposeModalOpen(false)}
                    title="Purpose Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'State the Why (Intended Impact)',
                        action: 'Explain why the session exists and the value it must create (e.g., "Align governance to sustain growth").',
                      },
                      {
                        number: '02',
                        guideline: 'Make Outcomes Explicit',
                        action: 'Name the concrete outcomes/decisions expected (approve plan, confirm KPIs, assign owners & dates) rather than "discuss."',
                      },
                      {
                        number: '03',
                        guideline: 'Keep Purpose Concise & Action-Led',
                        action: 'Use 1–3 verb-led bullets that directly shape agenda sequencing and time-boxing.',
                      },
                    ]}
                  />
                </div>

                {/* Agenda Structure Subsection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Agenda Structure</h3>
                  <SummaryTable
                    title="Agenda Structure Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'Focus on Core Priorities',
                        action: 'Include items that align with the forum\'s main mandate.',
                      },
                      {
                        number: '02',
                        guideline: 'Sequence Logically',
                        action: 'Group items by related themes to ensure structured discussion.',
                      },
                    ]}
                    onViewFull={() => setAgendaStructureModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={agendaStructureModalOpen}
                    onClose={() => setAgendaStructureModalOpen(false)}
                    title="Agenda Structure Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'Focus on Core Priorities',
                        action: 'Include items that align with the forum\'s main mandate.',
                      },
                      {
                        number: '02',
                        guideline: 'Sequence Logically',
                        action: 'Group items by related themes to ensure structured discussion.',
                      },
                      {
                        number: '03',
                        guideline: 'Allow for Open Items',
                        action: 'Include AoB (Any other Business) to capture additional, non-planned topics.',
                      },
                      {
                        number: '04',
                        guideline: 'Keep Agenda Time-Boxed',
                        action: 'Allocate time for each section to prevent overruns and ensure coverage of all topics.',
                      },
                    ]}
                  />
                </div>

                {/* Related Materials Subsection */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Related Materials</h3>
                  <SummaryTable
                    title="Related Materials Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'Attach Relevant Documents',
                        action: 'Link supporting materials (e.g., trackers, governance decks) directly in the invite or agenda.',
                      },
                      {
                        number: '02',
                        guideline: 'Keep Materials Updated',
                        action: 'Ensure related documents are refreshed before each session to avoid outdated or conflicting information.',
                      },
                    ]}
                    onViewFull={() => setRelatedMaterialsModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={relatedMaterialsModalOpen}
                    onClose={() => setRelatedMaterialsModalOpen(false)}
                    title="Related Materials Guidelines"
                    columns={[
                      { header: '#', accessor: 'number' },
                      { header: 'Guideline', accessor: 'guideline' },
                      { header: 'Action Point', accessor: 'action' },
                    ]}
                    data={[
                      {
                        number: '01',
                        guideline: 'Attach Relevant Documents',
                        action: 'Link supporting materials (e.g., trackers, governance decks) directly in the invite or agenda.',
                      },
                      {
                        number: '02',
                        guideline: 'Keep Materials Updated',
                        action: 'Ensure related documents are refreshed before each session to avoid outdated or conflicting information.',
                      },
                      {
                        number: '03',
                        guideline: 'Capture Outcomes in Same Space',
                        action: 'Store meeting notes, updated trackers, and decisions in the same repository to create a single source of truth.',
                      },
                    ]}
                  />
                </div>
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

