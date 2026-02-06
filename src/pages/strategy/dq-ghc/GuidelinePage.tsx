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
import { GUIDE_CONTENT } from '../../../constants/guideContent'

function GuidelinePage() {
  const { user } = useAuth()
  const currentSlug = 'dq-ghc'
  const contentKey = 'ghc' // Key for GUIDE_CONTENT
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'storybook' | 'course'>('overview')

  // Get content from constants using contentKey
  const content = GUIDE_CONTENT[contentKey]
  const displayTitle = content?.title || guide?.title || ''

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
            if (data.slug?.toLowerCase() !== currentSlug.toLowerCase()) {
              console.error(`Slug mismatch! Expected: ${currentSlug}, Got: ${data.slug}`)
              setError(`Data integrity error: Guide slug mismatch. Expected '${currentSlug}' but got '${data.slug}'`)
              setLoading(false)
              return
            }
            setGuide(data)
          } else {
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
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
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
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
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
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors focus:outline-none ${
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
                  <div className="max-w-5xl mx-auto space-y-10">
                    {/* Main Description */}
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>{content.shortOverview}</p>
                    </div>

                    {/* Course Highlights Section */}
                    <div className="space-y-5">
                      <h3 className="text-xl font-semibold text-gray-900">Course Highlights</h3>
                      <div className="space-y-4">
                        {content.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="text-right pt-4">
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
                  </div>
                )}

                {activeTab === 'storybook' && (
                  <GuidelineSection id="storybook" title="Explore Story Book">
                    <div className="max-w-5xl mx-auto space-y-10">
                      {/* Storybook Description */}
                      <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                        <p>{content.storybookIntro}</p>
                      </div>

                      {/* What You Will Learn Section - Moved to Storybook Tab */}
                      <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">What You'll Learn</h3>
                        </div>
                        <div className="space-y-5">
                          {content.whatYouWillLearn.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1.5">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              </div>
                              <p className="text-gray-700 text-base leading-relaxed">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Open Storybook Button */}
                      <div className="text-center py-8">
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

