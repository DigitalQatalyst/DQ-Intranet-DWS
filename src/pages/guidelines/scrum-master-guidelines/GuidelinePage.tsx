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
  const currentSlug = 'dq-scrum-master-guidelines'
  
  // Modal state management for each table
  const [positionVsRoleModalOpen, setPositionVsRoleModalOpen] = useState(false)
  const [smCoeModalOpen, setSmCoeModalOpen] = useState(false)
  const [smSectorModalOpen, setSmSectorModalOpen] = useState(false)
  const [smFactoryModalOpen, setSmFactoryModalOpen] = useState(false)
  const [smTowerModalOpen, setSmTowerModalOpen] = useState(false)
  const [smWorkingRoomModalOpen, setSmWorkingRoomModalOpen] = useState(false)
  const [smDeliveryModalOpen, setSmDeliveryModalOpen] = useState(false)
  const [smAtpModalOpen, setSmAtpModalOpen] = useState(false)
  
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Scrum Master Guidelines</span>
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
              {/* Overview Section */}
              <GuidelineSection id="overview" title="Overview">
                <p className="mb-4">
                  Digital Qatalyst is implementing a comprehensive Scrum Master Framework that empowers every associate to function as a Scrum Master, with responsibilities tailored to their organizational level and role.
                </p>
                <p>
                  This innovative approach replaces traditional hierarchical structures—including Sector Leads, Factory Leads, Tower Leads, and conventional Scrum Masters—with a streamlined, five-tier Scrum Master model designed to enhance organizational agility, strategic alignment, accountability, and delivery velocity across all business units.
                </p>
              </GuidelineSection>

              {/* Framework Purpose Section */}
              <GuidelineSection id="framework-purpose" title="Framework Purpose">
                <p className="mb-4">
                  This framework establishes clear guidelines that define the organizational structure, role definitions, responsibility matrices, and governance expectations for the new Scrum Master Framework. These guidelines ensure:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Standardization</strong>: Consistent application across all organizational units</li>
                  <li><strong>Clarity</strong>: Well-defined responsibilities and expectations</li>
                  <li><strong>Alignment</strong>: Integration with DQ&apos;s core values of execution excellence, transparency, and accountability</li>
                </ul>
              </GuidelineSection>

              {/* Position vs. Role Section */}
              <GuidelineSection id="position-vs-role" title="Position vs. Role: Key Distinctions">
                <p className="mb-6">
                  Understanding the difference between Position Scrum Masters and Role Scrum Masters is fundamental to the framework&apos;s implementation.
                </p>
                <SummaryTable
                  title="Position vs. Role: Key Distinctions"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      category: 'Position SM',
                      description: 'A formal organizational role located within the Center of Excellence (EVMO)',
                    },
                    {
                      category: 'Position Examples',
                      description: 'SM (CoE), SM (Unit), SM (Delivery)',
                    },
                  ]}
                  onViewFull={() => setPositionVsRoleModalOpen(true)}
                />
                <FullTableModal
                  isOpen={positionVsRoleModalOpen}
                  onClose={() => setPositionVsRoleModalOpen(false)}
                  title="Position vs. Role: Key Distinctions"
                  columns={[
                    { header: 'Category', accessor: 'category' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      category: 'Position SM',
                      description: 'A formal organizational role located within the Center of Excellence (EVMO)',
                    },
                    {
                      category: 'Position Examples',
                      description: 'SM (CoE), SM (Unit), SM (Delivery)',
                    },
                    {
                      category: 'Multi-role Capability',
                      description: 'Position SMs may assume additional functional roles, such as SM (Working Room), as operational needs require',
                    },
                    {
                      category: 'Role SM',
                      description: 'A functional responsibility assigned and executed on an as-needed basis',
                    },
                    {
                      category: 'Role Examples',
                      description: 'SM (Working Room), SM (ATP)',
                    },
                    {
                      category: 'Universal Application',
                      description: 'SM (ATP) applies to all associates regardless of position or level',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (CoE) Section */}
              <GuidelineSection id="sm-coe" title="SM (CoE) - Center of Excellence Position">
                <p className="mb-6">
                  The Center of Excellence Scrum Master serves as the governance and compliance anchor for the framework across the organization.
                </p>
                <SummaryTable
                  title="SM (CoE) Responsibilities"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Organizational Location',
                      description: 'Positioned within the CoE (EVMO) unit, serving as the central governance hub',
                    },
                    {
                      area: 'Primary Function',
                      description: 'Oversee governance, ensure compliance, and maintain adherence to DQ\'s L24 Working Room guidelines',
                    },
                  ]}
                  onViewFull={() => setSmCoeModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smCoeModalOpen}
                  onClose={() => setSmCoeModalOpen(false)}
                  title="SM (CoE) - Center of Excellence Position"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Organizational Location',
                      description: 'Positioned within the CoE (EVMO) unit, serving as the central governance hub',
                    },
                    {
                      area: 'Primary Function',
                      description: 'Oversee governance, ensure compliance, and maintain adherence to DQ\'s L24 Working Room guidelines',
                    },
                    {
                      area: 'Deployment Leadership',
                      description: 'Actively participate in initial deployment phases, onboarding SM (Working Room) personnel and activating each Working Room',
                    },
                    {
                      area: 'Operational Monitoring',
                      description: 'Conduct comprehensive assessments across all Working Rooms post-deployment to verify guideline adherence and preserve Working Room operational integrity',
                    },
                    {
                      area: 'Performance Management',
                      description: 'Identify performance gaps, compliance issues, and operational deficiencies, ensuring corrective actions through Unit/Factory/Tower SMs',
                    },
                    {
                      area: 'Standards Development',
                      description: 'Create, maintain, and evolve Working Room guidelines covering structure, workflow, and performance expectations',
                    },
                    {
                      area: 'Compliance Oversight',
                      description: 'Guarantee guideline deployment and associate compliance across all organizational units',
                    },
                    {
                      area: 'Continuous Improvement',
                      description: 'Weekly optimization of guidelines based on operational observations, Working Room performance metrics, and stakeholder feedback',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (Unit) Section */}
              <GuidelineSection id="sm-unit" title="SM (Unit) - Organizational Unit Position">
                <p className="mb-6">
                  Unit Scrum Masters operate at three distinct organizational levels—Sector, Factory, and Tower—ensuring cohesive operations within their respective units.
                </p>

                {/* SM (Sector) Subsection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">SM (Sector) - Sector Level</h3>
                  <p className="mb-4">
                    Sector Scrum Masters oversee multiple factories and ensure sector-wide operational excellence.
                  </p>
                  <SummaryTable
                    title="SM (Sector) Responsibilities"
                    columns={[
                      { header: 'Responsibility Area', accessor: 'area' },
                      { header: 'Detailed Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        area: 'Operational Scope',
                        description: 'DCO Operations, DBP Platform, and DBP Delivery sectors',
                      },
                      {
                        area: 'Working Room Support',
                        description: 'Provide SM (Working Room) services when operational requirements demand',
                      },
                    ]}
                    onViewFull={() => setSmSectorModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={smSectorModalOpen}
                    onClose={() => setSmSectorModalOpen(false)}
                    title="SM (Sector) - Sector Level"
                    columns={[
                      { header: 'Responsibility Area', accessor: 'area' },
                      { header: 'Detailed Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        area: 'Operational Scope',
                        description: 'DCO Operations, DBP Platform, and DBP Delivery sectors',
                      },
                      {
                        area: 'Working Room Support',
                        description: 'Provide SM (Working Room) services when operational requirements demand',
                      },
                      {
                        area: 'Factory Governance',
                        description: 'Ensure factories within the sector operate at optimal efficiency and alignment',
                      },
                      {
                        area: 'Performance Visibility',
                        description: 'Maintain comprehensive visibility into sector-level performance metrics and organizational health',
                      },
                      {
                        area: 'Data Integrity',
                        description: 'Ensure sector functional trackers are accurate, current, and reflective of actual performance',
                      },
                      {
                        area: 'Issue Management',
                        description: 'Identify operational gaps, escalate to Factory SMs, and drive resolution to completion',
                      },
                    ]}
                  />
                </div>

                {/* SM (Factory) Subsection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">SM (Factory) - Factory Level</h3>
                  <p className="mb-4">
                    Factory Scrum Masters manage tower operations and ensure factory-level execution excellence.
                  </p>
                  <SummaryTable
                    title="SM (Factory) Responsibilities"
                    columns={[
                      { header: 'Responsibility Area', accessor: 'area' },
                      { header: 'Detailed Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        area: 'Operational Scope',
                        description: 'Examples include Finance Factory, Deals Factory, Solution Factory, and other factory-level units',
                      },
                      {
                        area: 'Working Room Support',
                        description: 'Provide SM (Working Room) services when operational needs arise',
                      },
                    ]}
                    onViewFull={() => setSmFactoryModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={smFactoryModalOpen}
                    onClose={() => setSmFactoryModalOpen(false)}
                    title="SM (Factory) - Factory Level"
                    columns={[
                      { header: 'Responsibility Area', accessor: 'area' },
                      { header: 'Detailed Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        area: 'Operational Scope',
                        description: 'Examples include Finance Factory, Deals Factory, Solution Factory, and other factory-level units',
                      },
                      {
                        area: 'Working Room Support',
                        description: 'Provide SM (Working Room) services when operational needs arise',
                      },
                      {
                        area: 'Tower Oversight',
                        description: 'Ensure all towers within the factory operate effectively and meet performance standards',
                      },
                      {
                        area: 'Strategic Planning',
                        description: 'Establish clear, actionable plans at monthly, weekly, and daily intervals for each tower',
                      },
                      {
                        area: 'Progress Monitoring',
                        description: 'Track execution progress against established plans and maintain accurate factory-level performance trackers',
                      },
                      {
                        area: 'ATP Validation',
                        description: 'Review and validate Associate Task Plans (ATPs) for all factory associates',
                      },
                      {
                        area: 'Blockage Resolution',
                        description: 'Proactively identify and resolve operational blockers before they impact delivery',
                      },
                    ]}
                  />
                </div>

                {/* SM (Tower) Subsection */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">SM (Tower) - Tower Level</h3>
                  <p className="mb-4">
                    Tower Scrum Masters focus on tactical execution and day-to-day operational management.
                  </p>
                  <SummaryTable
                    title="SM (Tower) Responsibilities"
                    columns={[
                      { header: 'Responsibility Area', accessor: 'area' },
                      { header: 'Detailed Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        area: 'Operational Scope',
                        description: 'Examples include GPRC, Payables & Receivables, and other tower-level units',
                      },
                      {
                        area: 'Target Establishment',
                        description: 'Set clear, measurable targets at monthly, weekly, and daily intervals',
                      },
                    ]}
                    onViewFull={() => setSmTowerModalOpen(true)}
                  />
                  <FullTableModal
                    isOpen={smTowerModalOpen}
                    onClose={() => setSmTowerModalOpen(false)}
                    title="SM (Tower) - Tower Level"
                    columns={[
                      { header: 'Responsibility Area', accessor: 'area' },
                      { header: 'Detailed Description', accessor: 'description' },
                    ]}
                    data={[
                      {
                        area: 'Operational Scope',
                        description: 'Examples include GPRC, Payables & Receivables, and other tower-level units',
                      },
                      {
                        area: 'Target Establishment',
                        description: 'Set clear, measurable targets at monthly, weekly, and daily intervals',
                      },
                      {
                        area: 'Task Specification',
                        description: 'Ensure all tower tasks have detailed specifications and deadlines that align with monthly and weekly target objectives',
                      },
                      {
                        area: 'Performance Tracking',
                        description: 'Monitor progress against plans and maintain accurate tower-level performance trackers',
                      },
                      {
                        area: 'Blockage Management',
                        description: 'Resolve operational blockers independently or escalate when resolution requires higher-level intervention',
                      },
                      {
                        area: 'Communication',
                        description: 'Maintain transparent communication of plans, progress, and blockers through appropriate team channels',
                      },
                    ]}
                  />
                </div>
              </GuidelineSection>

              {/* SM (Working Room) Section */}
              <GuidelineSection id="sm-working-room" title="SM (Working Room) - Functional Role">
                <p className="mb-6">
                  Working Room Scrum Masters facilitate daily operational sessions and ensure focused execution.
                </p>
                <SummaryTable
                  title="SM (Working Room) Responsibilities"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Session Facilitation',
                      description: 'Lead Daily Working Room sessions with clear structure and purpose',
                    },
                    {
                      area: 'Focus Management',
                      description: 'Maintain session focus on execution and measurable outcomes, minimizing distractions',
                    },
                  ]}
                  onViewFull={() => setSmWorkingRoomModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smWorkingRoomModalOpen}
                  onClose={() => setSmWorkingRoomModalOpen(false)}
                  title="SM (Working Room) - Functional Role"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Session Facilitation',
                      description: 'Lead Daily Working Room sessions with clear structure and purpose',
                    },
                    {
                      area: 'Focus Management',
                      description: 'Maintain session focus on execution and measurable outcomes, minimizing distractions',
                    },
                    {
                      area: 'Engagement Monitoring',
                      description: 'Track participant attendance, engagement levels, and task progress throughout sessions',
                    },
                    {
                      area: 'Real-time Support',
                      description: 'Mobilize resources and support in real-time to resolve blockers as they arise',
                    },
                    {
                      area: 'Routine Execution',
                      description: 'Conduct Collaborative Working Sessions (CWS) and Retrospectives according to weekly agenda',
                    },
                    {
                      area: 'Cultural Alignment',
                      description: 'Uphold DQ\'s core cultural values: accountability, collaboration, and delivery momentum',
                    },
                    {
                      area: 'Progress Reporting',
                      description: 'Post daily progress updates and unresolved items on relevant communication channels',
                    },
                    {
                      area: 'Context Enablement',
                      description: 'Ensure associates understand the broader context and purpose of tasks, enabling meaningful progress that delivers tangible value',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (Delivery) Section */}
              <GuidelineSection id="sm-delivery" title="SM (Delivery) - Project-Specific Position">
                <p className="mb-6">
                  Delivery Scrum Masters provide dedicated support for specific projects, ensuring cross-functional coordination.
                </p>
                <SummaryTable
                  title="SM (Delivery) Responsibilities"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Project Scope',
                      description: 'Serve as dedicated Scrum Master for assigned projects',
                    },
                    {
                      area: 'Cross-functional Participation',
                      description: 'Operate across all Working Rooms where the project is active (e.g., DFSA Project spans WR/Breakout rooms for DevOps and WR/Breakout rooms for Solution)',
                    },
                  ]}
                  onViewFull={() => setSmDeliveryModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smDeliveryModalOpen}
                  onClose={() => setSmDeliveryModalOpen(false)}
                  title="SM (Delivery) - Project-Specific Position"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Project Scope',
                      description: 'Serve as dedicated Scrum Master for assigned projects',
                    },
                    {
                      area: 'Cross-functional Participation',
                      description: 'Operate across all Working Rooms where the project is active (e.g., DFSA Project spans WR/Breakout rooms for DevOps and WR/Breakout rooms for Solution)',
                    },
                    {
                      area: 'Delivery Coordination',
                      description: 'Ensure project tasks progress smoothly across all organizational units',
                    },
                    {
                      area: 'Control Tower Management',
                      description: 'Conduct weekly Control Tower sessions for respective projects',
                    },
                    {
                      area: 'Visibility Maintenance',
                      description: 'Maintain comprehensive visibility and alignment across all Working Rooms connected to the project',
                    },
                    {
                      area: 'Risk Management',
                      description: 'Proactively identify, escalate, and ensure resolution of risks, delays, and blockers',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* SM (ATP) Section */}
              <GuidelineSection id="sm-atp" title="SM (ATP - Associate) - Universal Role">
                <p className="mb-6">
                  Every associate functions as their own Scrum Master, taking personal ownership of their work and delivery.
                </p>
                <SummaryTable
                  title="SM (ATP - Associate) Responsibilities"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Universal Application',
                      description: 'Every associate acts as their own Scrum Master, regardless of position or level',
                    },
                    {
                      area: 'Planning Discipline',
                      description: 'Ensure each ATP task is linked to Planner with comprehensive context, clear purpose, defined approach, and specified Command Line Interfaces (CLIs)',
                    },
                  ]}
                  onViewFull={() => setSmAtpModalOpen(true)}
                />
                <FullTableModal
                  isOpen={smAtpModalOpen}
                  onClose={() => setSmAtpModalOpen(false)}
                  title="SM (ATP - Associate) - Universal Role"
                  columns={[
                    { header: 'Responsibility Area', accessor: 'area' },
                    { header: 'Detailed Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      area: 'Universal Application',
                      description: 'Every associate acts as their own Scrum Master, regardless of position or level',
                    },
                    {
                      area: 'Planning Discipline',
                      description: 'Ensure each ATP task is linked to Planner with comprehensive context, clear purpose, defined approach, and specified Command Line Interfaces (CLIs)',
                    },
                    {
                      area: 'Specification Excellence',
                      description: 'Define detailed specifications and realistic deadlines for each assigned task',
                    },
                    {
                      area: 'Progress Transparency',
                      description: 'Maintain daily and weekly visibility on personal progress and task completion',
                    },
                    {
                      area: 'Self-management',
                      description: 'Independently manage blockers and escalate only when resolution requires additional support or resources',
                    },
                    {
                      area: 'Accountability Standards',
                      description: 'Uphold personal accountability and meet delivery expectations consistently',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Implementation Benefits Section */}
              <GuidelineSection id="implementation-benefits" title="Implementation Benefits">
                <p className="mb-4">
                  This framework delivers significant organizational advantages:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Enhanced Agility</strong>: Faster response to changing business needs</li>
                  <li><strong>Improved Alignment</strong>: Better coordination across organizational levels</li>
                  <li><strong>Increased Accountability</strong>: Clear ownership and responsibility at every level</li>
                  <li><strong>Accelerated Delivery</strong>: Streamlined processes that reduce friction and increase velocity</li>
                  <li><strong>Cultural Consistency</strong>: Unified approach to execution across all units</li>
                </ul>
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

