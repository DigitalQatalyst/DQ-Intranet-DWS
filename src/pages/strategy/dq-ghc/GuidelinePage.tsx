import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, ExternalLink } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'
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
  const currentSlug = 'dq-ghc'
  
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
            .ilike('domain', '%strategy%')
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
                  <Link to="/marketplace/guides?tab=strategy" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Strategy
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">DQ GHC</span>
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
              {/* Introduction */}
              <GuidelineSection id="introduction" title="Introduction">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    Welcome to DigitalQatalyst (DQ)! 🎉
                  </p>
                </div>
                <p className="mb-6">
                  Starting at a new company can feel overwhelming. But here's the secret at DQ: everything has a system, a clear guide that shows you how we think, work, and create value. That system is the <strong>Golden Honeycomb of Competencies (GHC)</strong>.
                </p>
                <p className="mb-6">
                  Think of it as your map, compass, and toolkit all in one. It's designed to help you:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>Work together seamlessly with your team</li>
                  <li>Make decisions that actually move the needle</li>
                  <li>Solve problems creatively and confidently</li>
                  <li>Deliver real, measurable value to our clients</li>
                </ul>
                <p className="mb-6">
                  In short, the GHC is your guide to thriving as a Qatalyst, understanding how DQ operates, and why it matters.
                </p>
              </GuidelineSection>

              {/* Why the GHC Exists */}
              <GuidelineSection id="why-ghc-exists" title="Why the GHC Exists">
                <p className="mb-6">
                  DQ tackles complex digital challenges across industries. Without alignment, things can get messy fast. The GHC exists to make everything coherent, purposeful, and impactful:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>Everyone knows why we do what we do</li>
                  <li>Teams can collaborate effortlessly</li>
                  <li>Work moves forward with clarity and intention</li>
                  <li>Learning and improvement are built into every task</li>
                </ul>
                <p className="mb-6">
                  Put simply, the GHC is the reason DQ feels cohesive, agile, and unstoppable, even in fast-changing environments.
                </p>
              </GuidelineSection>

              {/* How the GHC Shapes You */}
              <GuidelineSection id="how-ghc-shapes-you" title="How the GHC Shapes You">
                <p className="mb-6">
                  The GHC isn't just theory — it shapes your daily work, your choices, and your impact. Here's how:
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1️⃣ Grow Yourself Every Day</h3>
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    <li>Embrace learning and feedback — every experience is an opportunity to improve</li>
                    <li>Stay calm, present, and accountable under pressure</li>
                    <li>Turn challenges into moments of growth</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2️⃣ Work Smart and Lean</h3>
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    <li>Focus on what truly matters — eliminate distractions</li>
                    <li>Take initiative — don't wait to be told</li>
                    <li>Sweat the small details — they often make the biggest difference</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3️⃣ Create Value with Others</h3>
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    <li>Collaborate openly — intelligence scales when we work together</li>
                    <li>Design solutions with empathy for clients</li>
                    <li>Build trust through honesty, clarity, and consistency</li>
                  </ul>
                </div>

                <p className="mb-6">
                  Think of these as practical superpowers you can start using from day one.
                </p>
              </GuidelineSection>

              {/* How Work Flows at DQ */}
              <GuidelineSection id="how-work-flows" title="How Work Flows at DQ">
                <p className="mb-6">
                  At DQ, work doesn't happen in silos. Everything moves through connected value streams, from ideas to delivery to lasting impact.
                </p>
                <p className="mb-6">
                  Here's what that means for you:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li><strong>Agile task management</strong> – know exactly what to do, who owns it, and why it matters</li>
                  <li><strong>Guided governance</strong> – direction and quality without slowing down</li>
                  <li><strong>End-to-end collaboration</strong> – your work links directly to client outcomes</li>
                </ul>
                <p className="mb-6">
                  By understanding these flows, you'll see how your contribution fits into the bigger picture, making your role meaningful every day.
                </p>
              </GuidelineSection>

              {/* Your Role as a Qatalyst */}
              <GuidelineSection id="your-role-as-qatalyst" title="Your Role as a Qatalyst">
                <p className="mb-6">
                  You don't need to master everything at once. Start small, and keep the Honeycomb in mind:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                  <li>Ask yourself: "Does this task create real value?"</li>
                  <li>Look for opportunities to collaborate and help others</li>
                  <li>Apply GHC principles to make confident decisions</li>
                  <li>Notice how your work connects to larger projects and outcomes</li>
                </ul>
                <p className="mb-6">
                  The GHC is called a Honeycomb for a reason — every part is connected, and every Qatalyst strengthens the whole. The more you live it, the more impactful, confident, and strategic you'll become.
                </p>
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Pro Tip:
                  </p>
                  <p className="text-gray-700">
                    Keep this Honeycomb in mind as you start your journey. Whether it's a sprint, a client call, or a problem-solving session, your choices, actions, and mindset shape the DQ mission — transaction by transaction, life by life, organisation by organisation.
                  </p>
                </div>
              </GuidelineSection>
            </div>

            <aside className="lg:col-span-1">
              <SideNav />
            </aside>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

