import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, PlayCircle, Eye, BookOpen } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from '../shared/HeroSection'
import { SideNav } from '../shared/SideNav'
import { GuidelineSection } from '../shared/GuidelineSection'
import MarkdownRenderer from '../../../components/guides/MarkdownRenderer'

function GuidelinePage() {
  const { user } = useAuth()
  const currentSlug = 'dq-ghc'
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatGhcTitle = (title: string) => {
    const t = (title || '').trim()
    const m1 = /^GHC\s*(?:Competency\s*)?(\d+)\s*:\s*(.+)$/i.exec(t)
    if (m1) return `GHC ${m1[1]} - ${m1[2].trim()}`
    const m2 = /^GHC\s*(\d+)\s*[-:]\s*(.+)$/i.exec(t)
    if (m2) return `GHC ${m2[1]} - ${m2[2].trim()}`
    return t
  }

  const displayTitle = formatGhcTitle(guide?.title || '') || guide?.title || ''
  const [activeTab, setActiveTab] = useState<'overview' | 'storybook' | 'course'>('overview')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabaseClient
          .from('guides')
          .select('*')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (fetchError) {
          console.error('❌ [DQ-GHC] Fetch error:', fetchError)
          throw fetchError
        }
        
        if (!cancelled) {
          if (data) {
            // Validate that the fetched guide matches the expected slug
            if (data.slug?.toLowerCase() !== currentSlug.toLowerCase()) {
              console.error(`Slug mismatch! Expected: ${currentSlug}, Got: ${data.slug}`)
              setError(`Data integrity error: Guide slug mismatch. Expected '${currentSlug}' but got '${data.slug}'`)
              setLoading(false)
              return
            }
            setGuide(data)
            console.log('✅ [DQ-GHC] Guide loaded:', {
              id: data.id,
              slug: data.slug,
              title: data.title,
              bodyLength: data.body?.length || 0,
              bodyPreview: data.body ? data.body.substring(0, 100).replace(/\n/g, ' ') : 'EMPTY',
              expectedSlug: currentSlug,
              match: data.slug?.toLowerCase() === currentSlug.toLowerCase()
            })
          } else {
            console.error('Guide not found for slug:', currentSlug)
            setError('Guide not found')
          }
          setLoading(false)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load guide')
          setLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentSlug])

  // Parse markdown body into sections
  const parseSections = (body: string) => {
    const sections: { id: string; title: string; content: string }[] = []
    if (!body) return sections
    
    const lines = body.split('\n')
    let currentSection: { id: string; title: string; content: string } | null = null
    
    for (const line of lines) {
      // Check for level 1 or level 2 headings
      if (line.startsWith('# ') || line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection)
        }
        const title = line.replace(/^#+\s+/, '').trim()
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        currentSection = { id, title, content: '' }
      } else if (currentSection) {
        currentSection.content += line + '\n'
      } else {
        // If we have content before any heading, create a default section
        if (!currentSection) {
          currentSection = { id: 'overview', title: 'Overview', content: '' }
        }
        currentSection.content += line + '\n'
      }
    }
    
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return sections
  }

  const sections = guide?.body ? parseSections(guide.body) : []
  const displaySections = sections.length ? [sections[0]] : []
  const introContent = displaySections[0]?.content?.trim() || guide?.body || ''
  const videoLinks = [
    { id: 'dq-vision', label: 'GHC 1 - Vision (Purpose)', url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/60912d69-547e-4e26-8f7b-59ac8aa845fc' },
    { id: 'dq-hov', label: 'GHC 2 - House of Values (HoV)', url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/f930b2a4-b107-4e7b-af01-c820773e00bb' },
    { id: 'dq-persona', label: 'GHC 3 - Personas', url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/0e9c3154-d3d5-44ee-a02b-2842265ccfca' },
    { id: 'dq-agile-tms', label: 'GHC 4 - Agile TMS', url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/e0c7d0c1-d726-45f9-80fe-16e5a4e5bc66' },
    { id: 'dq-agile-sos', label: 'GHC 5 - Agile SoS', url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/828f2848-3489-4ee9-8169-7ba3d2c8c17a' },
    { id: 'dq-agile-flows', label: 'GHC 6 - Agile Flows', url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/f237a74a-48fe-4388-ae47-aa8c3dbd3a0a' },
    { id: 'dq-agile-6xd', label: 'GHC 7 - Agile 6xD (Products)', url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/19d3cddd-870c-4754-bc12-35fa92807d23' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Guide not found'}</div>
      </div>
    )
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
                  <Link
                    to="/marketplace/guides?tab=strategy"
                    className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                  >
                    GHC
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{displayTitle}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection 
        title={displayTitle}
        subtitle="DQ Leadership - Digital Qatalyst"
        imageUrl="/images/guidelines-content.PNG"
        badge="Strategy Framework"
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200 px-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    Overview
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('storybook')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'storybook'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    Explore Story Book
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('course')}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'course'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle size={16} />
                    Course
                  </div>
                </button>
              </nav>
            </div>

            <div className="grid grid-cols-1 gap-8 px-6 py-10">
              <div className="lg:col-span-3">
                {activeTab === 'overview' && (
                  <>
                    {introContent ? (
                      <div className="prose prose-sm max-w-none">
                        <MarkdownRenderer body={introContent} />
                      </div>
                    ) : (
                      <div className="text-gray-600">No content available.</div>
                    )}
                    <div className="mt-8 text-right">
                      <Link
                        to={`/marketplace/guides/${currentSlug}/details`}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                        style={{ backgroundColor: '#030E31' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#020A28' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#030E31' }}
                      >
                        <span>View Details</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}

                {activeTab === 'storybook' && (
                  <GuidelineSection id="storybook" title="Explore Story Book">
                    <div className="text-center py-12">
                      <BookOpen size={64} className="mx-auto text-blue-500 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">GHC Story Book</h3>
                      <p className="text-gray-600 mb-8">
                        Explore the Golden Honeycomb story in an interactive format.
                      </p>
                      <button
                        onClick={() => window.open('https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html', '_blank')}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#030E31' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#020A28' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#030E31' }}
                      >
                        <BookOpen size={16} />
                        Open Story Book
                      </button>
                    </div>
                  </GuidelineSection>
                )}

                {activeTab === 'course' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">GHC Course & Videos</h3>
                    <p className="text-sm text-gray-600">
                      Watch all GHC element videos from one place. Each link opens the respective course module.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {videoLinks.map(video => (
                        <div key={video.id} className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{video.label}</h4>
                            <p className="text-xs text-gray-600 mt-1">Course lesson</p>
                          </div>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <PlayCircle size={14} />
                            <span>Open</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default GuidelinePage

