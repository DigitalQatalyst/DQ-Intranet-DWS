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
  const currentSlug = 'dq-rescue-shift-guidelines'
  
  // Modal state management
  const [planningModalOpen, setPlanningModalOpen] = useState(false)
  const [duringShiftModalOpen, setDuringShiftModalOpen] = useState(false)
  const [rolesModalOpen, setRolesModalOpen] = useState(false)
  
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Rescue Shift Guidelines</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              <GuidelineSection id="context" title="Context">
                <p className="mb-4">
                  Rescue shifts help complete high-volume backlog work by allowing associates to work extra hours outside normal working time.
                </p>
                <p>
                  These guidelines apply to all associates, project managers, scrum masters, line managers, and HR involved in coordinating and executing rescue shifts.
                </p>
              </GuidelineSection>

              <GuidelineSection id="purpose" title="Purpose">
                <p className="mb-4">These guidelines ensure:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Clear and consistent scheduling, tracking, and compensation</li>
                  <li>Clear task specifications and time estimates</li>
                  <li>Clear roles, responsibilities, and expectations</li>
                  <li>Smooth coordination between associates, managers, and HR</li>
                  <li>Timely completion of backlog tasks</li>
                </ul>
              </GuidelineSection>

              <GuidelineSection id="how-it-works" title="How It Works">
                <div className="mb-4">
                  <p className="font-semibold mb-2">Shift Types:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li><strong>Weekday:</strong> 4 hours after normal working hours</li>
                    <li><strong>Weekend:</strong> Hours agreed in advance</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Process Overview:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
                    <li><strong>Planning</strong> - Backlog compilation, effort estimates, approvals</li>
                    <li><strong>Execution</strong> - Associates work during rescue hours with check-ins</li>
                    <li><strong>Payroll</strong> - Payment only after task completion and manager confirmation</li>
                  </ol>
                </div>
              </GuidelineSection>

              <GuidelineSection id="planning-process" title="Planning Process">
                <p className="mb-6">
                  The planning process involves several steps to ensure proper coordination, approval, and assignment of rescue shift work.
                </p>
                <SummaryTable
                  title="Planning Process Steps"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Step', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      step: 'Backlog Compilation',
                      description: 'Project Manager/Coordinator compiles outstanding work items with:\n- Clear specifications\n- Estimated effort for each task',
                    },
                    {
                      number: '02',
                      step: 'Check Availability',
                      description: 'Project Manager/Coordinator coordinates with Scrum Master to:\n- Confirm associate availability\n- Agree on suitable timeslots',
                    },
                    {
                      number: '03',
                      step: 'Link Tasks',
                      description: 'All work items must link back to associate tasks/CLIs for tracking and visibility.',
                    },
                    {
                      number: '04',
                      step: 'Get Line Manager Approval',
                      description: 'Project Manager/Coordinator sends the proposed list (associates + tasks) to Line Manager for approval.',
                    },
                    {
                      number: '05',
                      step: 'Get HR Approval',
                      description: 'After Line Manager approval, send the list to HR for final validation.',
                    },
                    {
                      number: '06',
                      step: 'Assign Moderator',
                      description: 'Project Manager/Coordinator assigns a Moderator for each rescue shift to:\n- Oversee progress\n- Provide support when needed',
                    },
                    {
                      number: '07',
                      step: 'Confirm Timing',
                      description: '- Confirm rescue shifts at the start of the week\n- For urgent cases: confirm at least 2 days before the shift',
                    },
                    {
                      number: '08',
                      step: 'Notify Associates',
                      description: 'Officially notify associates about their scheduled shifts and tasks well in advance.',
                    },
                  ]}
                  onViewFull={() => setPlanningModalOpen(true)}
                />
                <FullTableModal
                  isOpen={planningModalOpen}
                  onClose={() => setPlanningModalOpen(false)}
                  title="Planning Process Steps"
                  columns={[
                    { header: '#', accessor: 'number' },
                    { header: 'Step', accessor: 'step' },
                    { header: 'Description', accessor: 'description' },
                  ]}
                  data={[
                    {
                      number: '01',
                      step: 'Backlog Compilation',
                      description: 'Project Manager/Coordinator compiles outstanding work items with:\n- Clear specifications\n- Estimated effort for each task',
                    },
                    {
                      number: '02',
                      step: 'Check Availability',
                      description: 'Project Manager/Coordinator coordinates with Scrum Master to:\n- Confirm associate availability\n- Agree on suitable timeslots',
                    },
                    {
                      number: '03',
                      step: 'Link Tasks',
                      description: 'All work items must link back to associate tasks/CLIs for tracking and visibility.',
                    },
                    {
                      number: '04',
                      step: 'Get Line Manager Approval',
                      description: 'Project Manager/Coordinator sends the proposed list (associates + tasks) to Line Manager for approval.',
                    },
                    {
                      number: '05',
                      step: 'Get HR Approval',
                      description: 'After Line Manager approval, send the list to HR for final validation.',
                    },
                    {
                      number: '06',
                      step: 'Assign Moderator',
                      description: 'Project Manager/Coordinator assigns a Moderator for each rescue shift to:\n- Oversee progress\n- Provide support when needed',
                    },
                    {
                      number: '07',
                      step: 'Confirm Timing',
                      description: '- Confirm rescue shifts at the start of the week\n- For urgent cases: confirm at least 2 days before the shift',
                    },
                    {
                      number: '08',
                      step: 'Notify Associates',
                      description: 'Officially notify associates about their scheduled shifts and tasks well in advance.',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="during-shift" title="During the Rescue Shift">
                <p className="mb-6">
                  Associates must follow these guidelines during their rescue shift to ensure effective execution and communication.
                </p>
                <SummaryTable
                  title="During the Rescue Shift Guidelines"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Join the Collab Call',
                      action: 'Check in on your HR channel and join the Collab Call during your rescue hours.',
                    },
                    {
                      guideline: 'Confirm Your Tasks',
                      action: 'Make sure you understand what you\'ll be working on. If unclear, ask the Moderator or your squad lead.',
                    },
                    {
                      guideline: 'Track Your Progress',
                      action: 'Keep the team updated on your progress throughout the shift.',
                    },
                    {
                      guideline: 'Attend Check-ins',
                      action: '- There are 3 check-ins per day in the Collab Call\n- You must attend at least one check-in during your shift',
                    },
                    {
                      guideline: 'Shift Cancellation',
                      action: 'If you don\'t join the rescue shift within one hour of start time, the shift will be canceled.',
                    },
                  ]}
                  onViewFull={() => setDuringShiftModalOpen(true)}
                />
                <FullTableModal
                  isOpen={duringShiftModalOpen}
                  onClose={() => setDuringShiftModalOpen(false)}
                  title="During the Rescue Shift Guidelines"
                  columns={[
                    { header: 'Guideline', accessor: 'guideline' },
                    { header: 'Action Point', accessor: 'action' },
                  ]}
                  data={[
                    {
                      guideline: 'Join the Collab Call',
                      action: 'Check in on your HR channel and join the Collab Call during your rescue hours.',
                    },
                    {
                      guideline: 'Confirm Your Tasks',
                      action: 'Make sure you understand what you\'ll be working on. If unclear, ask the Moderator or your squad lead.',
                    },
                    {
                      guideline: 'Track Your Progress',
                      action: 'Keep the team updated on your progress throughout the shift.',
                    },
                    {
                      guideline: 'Attend Check-ins',
                      action: '- There are 3 check-ins per day in the Collab Call\n- You must attend at least one check-in during your shift',
                    },
                    {
                      guideline: 'Shift Cancellation',
                      action: 'If you don\'t join the rescue shift within one hour of start time, the shift will be canceled.',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="roles-responsibilities" title="Roles & Responsibilities">
                <p className="mb-6">
                  Clear definition of roles and responsibilities ensures effective coordination and accountability during rescue shifts.
                </p>
                <SummaryTable
                  title="Roles & Responsibilities"
                  columns={[
                    { header: 'Role', accessor: 'role' },
                    { header: 'Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={[
                    {
                      role: 'Project Manager/Coordinator',
                      responsibilities: '- Compile backlog items and estimate effort\n- Coordinate with scrum masters for availability\n- Get approvals from line managers and HR\n- Notify associates about shifts\n- Appoint moderators\n- Confirm associate participation for payroll',
                    },
                    {
                      role: 'Scrum Master',
                      responsibilities: '- Confirm associate availability and timeslots\n- Ensure tasks match associate skills and availability',
                    },
                    {
                      role: 'Line Manager',
                      responsibilities: '- Review and approve rescue shift lists\n- Confirm associate participation and task progress',
                    },
                    {
                      role: 'HR',
                      responsibilities: '- Approve and validate rescue shift assignments\n- Ensure payroll compliance',
                    },
                    {
                      role: 'Associates',
                      responsibilities: '- Confirm participation in rescue shifts\n- Complete assigned tasks and report progress\n- Attend at least one check-in per shift\n- Follow up on issues with moderator or squad lead',
                    },
                  ]}
                  onViewFull={() => setRolesModalOpen(true)}
                />
                <FullTableModal
                  isOpen={rolesModalOpen}
                  onClose={() => setRolesModalOpen(false)}
                  title="Roles & Responsibilities"
                  columns={[
                    { header: 'Role', accessor: 'role' },
                    { header: 'Responsibilities', accessor: 'responsibilities' },
                  ]}
                  data={[
                    {
                      role: 'Project Manager/Coordinator',
                      responsibilities: '- Compile backlog items and estimate effort\n- Coordinate with scrum masters for availability\n- Get approvals from line managers and HR\n- Notify associates about shifts\n- Appoint moderators\n- Confirm associate participation for payroll',
                    },
                    {
                      role: 'Scrum Master',
                      responsibilities: '- Confirm associate availability and timeslots\n- Ensure tasks match associate skills and availability',
                    },
                    {
                      role: 'Line Manager',
                      responsibilities: '- Review and approve rescue shift lists\n- Confirm associate participation and task progress',
                    },
                    {
                      role: 'HR',
                      responsibilities: '- Approve and validate rescue shift assignments\n- Ensure payroll compliance',
                    },
                    {
                      role: 'Associates',
                      responsibilities: '- Confirm participation in rescue shifts\n- Complete assigned tasks and report progress\n- Attend at least one check-in per shift\n- Follow up on issues with moderator or squad lead',
                    },
                  ]}
                />
              </GuidelineSection>

              <GuidelineSection id="wfh-during-shift" title="Working from Home During Rescue Shifts">
                <p className="mb-4">
                  When associates need to work from home during rescue shifts, specific procedures must be followed.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Submit WFH Request:</strong> Project Coordinator/Manager must submit a formal WFH request together with the rescue shift approval if associates need to work from home due to logistical concerns.</li>
                  <li><strong>Confirm Operational Capability:</strong> The request must confirm that the associate can perform all required activities effectively while working remotely.</li>
                  <li><strong>Follow Guidelines:</strong> Remote-working associates must follow all rescue shift guidelines: stay responsive, deliver tasks on time, and remain available throughout the shift.</li>
                </ul>
              </GuidelineSection>

              <GuidelineSection id="payroll" title="Payroll">
                <p className="mb-4">Payment is processed based on the following requirements:</p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Payment Requirements:</p>
                    <p className="text-gray-700">Payment is processed only if:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Associate completes all assigned tasks</li>
                      <li>Project Manager or Line Manager verifies completion</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Non-Completion:</p>
                    <p className="text-gray-700">If expectations are not met, the shift will not be compensated.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Cancellation:</p>
                    <p className="text-gray-700">If an associate doesn&apos;t join within one hour of start time:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>The shift is canceled</li>
                      <li>No payment will be made</li>
                    </ul>
                  </div>
                </div>
              </GuidelineSection>
            </div>

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

