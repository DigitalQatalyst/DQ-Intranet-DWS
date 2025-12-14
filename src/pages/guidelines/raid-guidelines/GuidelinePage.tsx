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
  const currentSlug = 'raid-guidelines'
  
  // Modal state management for each table
  const [valueStreamModalOpen, setValueStreamModalOpen] = useState(false)
  const [leanGovernanceModalOpen, setLeanGovernanceModalOpen] = useState(false)
  const [riskWorkflowModalOpen, setRiskWorkflowModalOpen] = useState(false)
  const [riskIdentificationModalOpen, setRiskIdentificationModalOpen] = useState(false)
  const [riskMitigationModalOpen, setRiskMitigationModalOpen] = useState(false)
  const [riskEscalationModalOpen, setRiskEscalationModalOpen] = useState(false)
  const [riskTypesModalOpen, setRiskTypesModalOpen] = useState(false)
  
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
                  <span className="ml-1 text-gray-500 md:ml-2">RAID Guidelines</span>
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
                  Across DQ projects, whether in design or deploy, delivery is often seen as the finish line—the tangible output of months of effort. But delivery is just a fraction of the broader value stream.
                </p>
                <p>
                  Real success hinges on how well we manage risk, clarify assumptions, resolve issues, and track dependencies.
                </p>
              </GuidelineSection>

              {/* Value Stream Section */}
              <GuidelineSection id="value-stream" title="Value Stream – Heartbeat of DQ Projects">
                <p className="mb-6">
                  To understand the true impact of delivery, we need to view the broader picture—the value streams. These are the end-to-end processes that ensure the project doesn&apos;t just reach completion but delivers continuous value. In DQ, value streams align with SAFe principles, guiding our efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.
                </p>
                <SummaryTable
                  title="Value Streams"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Value Streams', accessor: 'stream' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      stream: 'Client Acquisition',
                      type: 'Operational Value Stream',
                      description: 'Attract and onboard clients, resulting in signed contracts and clear needs',
                    },
                    {
                      number: '02',
                      stream: 'Solution Design & Proposal',
                      type: 'Development Value Stream',
                      description: 'Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals.',
                    },
                  ]}
                  onViewFull={() => setValueStreamModalOpen(true)}
                />
                <FullTableModal
                  isOpen={valueStreamModalOpen}
                  onClose={() => setValueStreamModalOpen(false)}
                  title="Value Streams"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Value Streams', accessor: 'stream' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      stream: 'Client Acquisition',
                      type: 'Operational Value Stream',
                      description: 'Attract and onboard clients, resulting in signed contracts and clear needs',
                    },
                    {
                      number: '02',
                      stream: 'Solution Design & Proposal',
                      type: 'Development Value Stream',
                      description: 'Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals.',
                    },
                    {
                      number: '03',
                      stream: 'Agile Delivery',
                      type: 'Development Value Stream',
                      description: 'Develop and deploy solutions in agile increments, achieving working software and PI objectives.',
                    },
                    {
                      number: '04',
                      stream: 'Client Success',
                      type: 'Operational Value Stream',
                      description: 'Drive adoption and support, ensuring client satisfaction and meeting KPIs.',
                    },
                    {
                      number: '05',
                      stream: 'Continuous Integration & Deployment',
                      type: 'Development Value Stream',
                      description: 'Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases.',
                    },
                    {
                      number: '06',
                      stream: 'Client Retention',
                      type: 'Operational Value Stream',
                      description: 'Strengthen relationships and upsell, increasing lifetime value and revenue.',
                    },
                    {
                      number: '07',
                      stream: 'Capability Development',
                      type: 'Development Value Stream',
                      description: 'Build agile teams and practices, leading to certified teams and faster delivery.',
                    },
                    {
                      number: '08',
                      stream: 'Governance & Risk',
                      type: 'Operational Value Stream',
                      description: 'Ensure alignment, compliance, and risk control, reducing risks.',
                    },
                    {
                      number: '09',
                      stream: 'Value Measurement',
                      type: 'Development Value Stream',
                      description: 'Measure value, gather feedback, and improve delivery and increase innovation.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Lean Governance Section */}
              <GuidelineSection id="lean-governance" title="Lean Governance and Risk Management">
                <p className="mb-6">
                  From the value stream, we focus on Lean Governance & Risk Management. This operational value stream ensures digital initiatives are aligned with strategic objectives, comply with regulations, and manage risks in a lean, agile manner, supporting effective and efficient delivery.
                </p>
                <SummaryTable
                  title="Lean Governance and Risk Management"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Value Stream Name',
                      detail: 'Governance and Risk',
                    },
                    {
                      number: '02',
                      element: 'Type',
                      detail: 'Operational Value Stream',
                    },
                  ]}
                  onViewFull={() => setLeanGovernanceModalOpen(true)}
                />
                <FullTableModal
                  isOpen={leanGovernanceModalOpen}
                  onClose={() => setLeanGovernanceModalOpen(false)}
                  title="Lean Governance and Risk Management"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Value Stream Name',
                      detail: 'Governance and Risk',
                    },
                    {
                      number: '02',
                      element: 'Type',
                      detail: 'Operational Value Stream',
                    },
                    {
                      number: '03',
                      element: 'Purpose',
                      detail: 'To ensure that digital initiatives are aligned with strategic objectives, comply with regulatory requirements, and manage risk in a lean, agile manner.',
                    },
                    {
                      number: '04',
                      element: 'Primary Stakeholders',
                      detail: 'Portfolio Managers, Risk & Compliance Officers, Enterprise Architects, Delivery Leaders, Finance, Legal',
                    },
                    {
                      number: '05',
                      element: 'Key Activities',
                      detail: 'Strategic alignment of digital initiatives with business goals. Lean budgeting & investment guardrails. Agile contract management. Risk identification, mitigation & escalation workflows. Regulatory & security compliance monitoring. Audit trail and traceability enablement.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Identification, Mitigation and Escalation Section */}
              <GuidelineSection id="risk-identification" title="Risk Identification, Mitigation and Escalation">
                <p className="mb-6">
                  A huge part of governance and successfully delivering a project is risk identification, mitigation, and escalation. Managing risks proactively ensures that potential obstacles are addressed before they impact the project&apos;s success, client satisfaction, or compliance.
                </p>
                <SummaryTable
                  title="Risk Identification, Mitigation and Escalation"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Objective',
                      detail: 'Proactively identify, assess, respond to, and escalate risks affecting solution delivery, compliance, client satisfaction, or reputation.',
                    },
                    {
                      number: '02',
                      element: 'Trigger Points',
                      detail: 'PI Planning, Backlog grooming, Solution Demos, Regulatory Updates, Client Escalations',
                    },
                  ]}
                  onViewFull={() => setRiskWorkflowModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskWorkflowModalOpen}
                  onClose={() => setRiskWorkflowModalOpen(false)}
                  title="Risk Identification, Mitigation and Escalation"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Element', accessor: 'element' },
                    { header: 'Detail', accessor: 'detail' },
                  ]}
                  data={[
                    {
                      number: '01',
                      element: 'Objective',
                      detail: 'Proactively identify, assess, respond to, and escalate risks affecting solution delivery, compliance, client satisfaction, or reputation.',
                    },
                    {
                      number: '02',
                      element: 'Trigger Points',
                      detail: 'PI Planning, Backlog grooming, Solution Demos, Regulatory Updates, Client Escalations',
                    },
                    {
                      number: '03',
                      element: 'Workflow Stage: Risk Identification',
                      detail: 'Conduct workshops, use checklists, dependency mapping, and monitor early warning indicators like missed milestones and quality issues.',
                    },
                    {
                      number: '04',
                      element: 'Workflow Stage: Risk Assessment',
                      detail: 'Categorize risks (e.g., delivery, technical), assess impact and urgency, and use risk matrices for evaluation.',
                    },
                    {
                      number: '05',
                      element: 'Workflow Stage: Mitigation Planning',
                      detail: 'Define response strategies (Avoid, Transfer, Mitigate, Accept), assign owners, and document actions and due dates.',
                    },
                    {
                      number: '06',
                      element: 'Workflow Stage: Execution & Monitoring',
                      detail: 'Track mitigation actions, integrate with team boards or dashboards, and update status regularly.',
                    },
                    {
                      number: '07',
                      element: 'Workflow Stage: Escalation Protocols',
                      detail: 'Define escalation thresholds (e.g., impact > threshold, client delay, regulatory exposure), and escalate based on scope.',
                    },
                    {
                      number: '08',
                      element: 'Workflow Stage: Closure & Lesson Learned',
                      detail: 'Review mitigated risks, update risk registers, and capture lessons for future planning.',
                    },
                    {
                      number: '09',
                      element: 'Enablers',
                      detail: 'Use Risk Registers (Azure DevOps), Escalation Matrices, and automated alerts for high-risk conditions.',
                    },
                    {
                      number: '10',
                      element: 'Common Risk Types',
                      detail: 'Common risks include scope creep, data privacy breaches, regulatory non-compliance, technology integration failures, and resource unavailability.',
                    },
                    {
                      number: '11',
                      element: 'KPIs / Metrics',
                      detail: 'KPIs include % of risks mitigated on time, number of escalated vs. resolved risks, resolution cycle time, and risk exposure trends.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Identification Guidelines Section */}
              <GuidelineSection id="risk-identification-guidelines" title="Risk Identification Guidelines">
                <p className="mb-6">
                  Effective risk identification is crucial for proactively addressing potential issues throughout the project lifecycle. By embedding risk identification in all phases, from scoping to closure, teams can anticipate and mitigate risks early, ensuring smoother project delivery.
                </p>
                <SummaryTable
                  title="Risk Identification Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Embed risk identification in all delivery phases',
                      action: 'Assess risks during project scoping, planning, execution, and closure.',
                    },
                    {
                      number: '02',
                      guideline: 'Use structured formats and workshops',
                      action: 'Conduct risk discovery sessions in PI planning, daily stand-ups and retros',
                    },
                  ]}
                  onViewFull={() => setRiskIdentificationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskIdentificationModalOpen}
                  onClose={() => setRiskIdentificationModalOpen(false)}
                  title="Risk Identification Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Embed risk identification in all delivery phases',
                      action: 'Assess risks during project scoping, planning, execution, and closure.',
                    },
                    {
                      number: '02',
                      guideline: 'Use structured formats and workshops',
                      action: 'Conduct risk discovery sessions in PI planning, daily stand-ups and retros',
                    },
                    {
                      number: '03',
                      guideline: 'Categorize risks by type',
                      action: 'Classify risks as Delivery, Technical, Compliance, Resourcing, Financial, or Reputational.',
                    },
                    {
                      number: '04',
                      guideline: 'Leverage past project lessons',
                      action: 'Review previous DQ project risks and integrate common risks into current planning.',
                    },
                    {
                      number: '05',
                      guideline: 'Maintain a shared risk register',
                      action: 'Use a central log (Azure DevOps) that is visible, version-controlled, and regularly updated.',
                    },
                    {
                      number: '06',
                      guideline: 'Empower all team members to raise risks',
                      action: 'Foster a no-blame culture that encourages surfacing issues early and without hesitation.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Mitigation Guidelines Section */}
              <GuidelineSection id="risk-mitigation-guidelines" title="Risk Mitigation Guidelines">
                <p className="mb-6">
                  Risk mitigation involves taking proactive steps to reduce the impact of identified risks. By assigning ownership, defining clear actions, and continuously monitoring progress, risks can be effectively managed to avoid disruption in project delivery.
                </p>
                <SummaryTable
                  title="Risk Mitigation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Assign risk owners',
                      action: 'Every open risk must have a person responsible for its mitigation.',
                    },
                    {
                      number: '02',
                      guideline: 'Define mitigation actions clearly',
                      action: 'Include specific action steps, timelines, and measurable checkpoints to track progress.',
                    },
                  ]}
                  onViewFull={() => setRiskMitigationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskMitigationModalOpen}
                  onClose={() => setRiskMitigationModalOpen(false)}
                  title="Risk Mitigation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Assign risk owners',
                      action: 'Every open risk must have a person responsible for its mitigation.',
                    },
                    {
                      number: '02',
                      guideline: 'Define mitigation actions clearly',
                      action: 'Include specific action steps, timelines, and measurable checkpoints to track progress.',
                    },
                    {
                      number: '03',
                      guideline: 'Prioritize risks by impact and probability',
                      action: 'Use a scoring model (e.g., Risk = Likelihood x Impact) to focus efforts on the most critical risks.',
                    },
                    {
                      number: '04',
                      guideline: 'Integrate risk plans into work streams',
                      action: 'Ensure mitigation actions are included in sprint or PI planning to align with the overall project timeline.',
                    },
                    {
                      number: '05',
                      guideline: 'Monitor mitigation progress continuously',
                      action: 'Review progress during weekly syncs (Control Towers), and update the RAID dashboard accordingly.',
                    },
                    {
                      number: '06',
                      guideline: 'Maintain contingency/back-up plans',
                      action: 'Have contingency plans, especially for high-impact risks (e.g., tech failure, resource gaps, data loss).',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Escalation Guidelines Section */}
              <GuidelineSection id="risk-escalation-guidelines" title="Risk Escalation Guidelines">
                <p className="mb-6">
                  Effective risk escalation ensures that high-priority risks are addressed at the right levels of governance. Escalating risks early, with clear documentation and structured communication, helps to avoid major disruptions and keeps projects on track.
                </p>
                <SummaryTable
                  title="Risk Escalation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Define escalation thresholds',
                      action: 'Such as high business impact, legal/compliance implications, or delivery timelines delay',
                    },
                    {
                      number: '02',
                      guideline: 'Use an escalation matrix',
                      action: 'Clarify who to notify (e.g., Tower Lead → Delivery Lead → COO/Client) and how quickly.',
                    },
                  ]}
                  onViewFull={() => setRiskEscalationModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskEscalationModalOpen}
                  onClose={() => setRiskEscalationModalOpen(false)}
                  title="Risk Escalation Guidelines"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      number: '01',
                      guideline: 'Define escalation thresholds',
                      action: 'Such as high business impact, legal/compliance implications, or delivery timelines delay',
                    },
                    {
                      number: '02',
                      guideline: 'Use an escalation matrix',
                      action: 'Clarify who to notify (e.g., Tower Lead → Delivery Lead → COO/Client) and how quickly.',
                    },
                    {
                      number: '03',
                      guideline: 'Escalate early, not late',
                      action: 'Don\'t wait until a risk materializes; escalate when mitigation looks unlikely or weak.',
                    },
                    {
                      number: '04',
                      guideline: 'Document escalated risks formally',
                      action: 'Log escalation details, communications, decisions, and actions taken to ensure transparency and traceability.',
                    },
                    {
                      number: '05',
                      guideline: 'Escalate via appropriate channels',
                      action: 'Use structured channels such as Governance CWS, Project Boards, Email with a clear Subject Line',
                    },
                    {
                      number: '06',
                      guideline: 'Conduct escalation reviews post-resolution',
                      action: 'Hold retros to assess what triggered the escalation and how to avoid similar situations in the future.',
                    },
                  ]}
                />
              </GuidelineSection>

              {/* Risk Types Section */}
              <GuidelineSection id="risk-types" title="Risk Types">
                <p className="mb-6">
                  Understanding different risk types is essential for effectively managing and mitigating them. Below are common categories of risks that may arise during project delivery.
                </p>
                <SummaryTable
                  title="Risk Types"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      type: 'Delivery Risk',
                      example: 'Missed milestones, incomplete stories, client dissatisfaction',
                    },
                    {
                      number: '02',
                      type: 'Technical Risk',
                      example: 'Integration failure, security vulnerability, system incompatibility',
                    },
                  ]}
                  onViewFull={() => setRiskTypesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={riskTypesModalOpen}
                  onClose={() => setRiskTypesModalOpen(false)}
                  title="Risk Types"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Example', accessor: 'example' },
                  ]}
                  data={[
                    {
                      number: '01',
                      type: 'Delivery Risk',
                      example: 'Missed milestones, incomplete stories, client dissatisfaction',
                    },
                    {
                      number: '02',
                      type: 'Technical Risk',
                      example: 'Integration failure, security vulnerability, system incompatibility',
                    },
                    {
                      number: '03',
                      type: 'Compliance Risk',
                      example: 'Data residency issues, breach of NDAs, GDPR violations',
                    },
                    {
                      number: '04',
                      type: 'Resource Risk',
                      example: 'Key team member resignation, overutilization, delayed onboarding',
                    },
                    {
                      number: '05',
                      type: 'Reputational Risk',
                      example: 'Failure to deliver on commitment, loss of client account',
                    },
                    {
                      number: '06',
                      type: 'Financial Risk',
                      example: 'Budget overruns, cost escalation, revenue impact',
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

