import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon, BookOpen, PlayCircle, Eye, Clock } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from '../shared/HeroSection'
import { GuidelineSection } from '../shared/GuidelineSection'
import MarkdownRenderer from '../../../components/guides/MarkdownRenderer'

function GuidelinePage() {
  const currentSlug = 'dq-agile-tms'
  const displayTitle = 'GHC 4 - Agile TMS (Task Management System)'
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'storybook' | 'course'>('overview')

  // Get just the first paragraph
  const getFirstParagraph = (text: string) => {
    if (!text) return ''
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)
    return paragraphs[0] || ''
  }

  const agileTmsIntroBody = "Effective task management is the backbone of agile delivery. At DQ, our Task Management System (TMS) isn't just about tracking work—it's about enabling flow, removing bottlenecks, and creating visibility across the entire value stream.\n\nThe Agile TMS competency articulates how we manage work from discovery to delivery. It answers the fundamental question: \"How do we ensure the right work gets to the right people at the right time?\""

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
        
        if (fetchError) throw fetchError
        
        if (!cancelled) {
          if (data) {
            if (data.slug?.toLowerCase() !== currentSlug.toLowerCase()) {
              console.error(`Slug mismatch! Expected: ${currentSlug}, Got: ${data.slug}`)
              setError(`Data integrity error: Guide slug mismatch. Expected '${currentSlug}' but got '${data.slug}'`)
              setLoading(false)
              return
            }
            setGuide(data)
            console.log('✅ [DQ-AGILE-TMS] Guide loaded:', {
              id: data.id,
              slug: data.slug,
              title: data.title,
              bodyLength: data.body?.length || 0,
              expectedSlug: currentSlug,
              match: data.slug?.toLowerCase() === currentSlug.toLowerCase()
            })
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
        <div className="px-4 py-12">
          {/* Tab Content - Full Width */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Main Content - Left Side (3 columns) */}
                <div className="lg:col-span-3">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px justify-center">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
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
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
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
                        className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
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

                  {/* Tab Content - Centered */}
                  <div className="p-8 md:p-12">
                    {activeTab === 'overview' && (
                      <div>
                        {/* Combined Overview Card */}
                        <div className="bg-white rounded-lg p-6">
                          {/* Description */}
                          <div className="prose prose-sm max-w-none">
                            <MarkdownRenderer body={agileTmsIntroBody} />
                          </div>

                          {/* Key Points */}
                          <div className="pt-4">
                            <h6 className="text-sm font-semibold text-gray-900 mb-3">Key Points</h6>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: 'var(--guidelines-primary-solid, #030E31)' }}
                                >
                                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-700">Flow-based task management</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: 'var(--guidelines-primary-solid, #030E31)' }}
                                >
                                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-700">Bottleneck elimination</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: 'var(--guidelines-primary-solid, #030E31)' }}
                                >
                                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-sm text-gray-700">End-to-end visibility</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* GHC Link Button - Only show on Overview tab */}
                        <div className="mt-12 text-right">
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
                        <div className="text-center py-12">
                          <BookOpen size={64} className="mx-auto text-blue-500 mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">Agile TMS Story Book</h3>
                          <p className="text-gray-600 mb-8">
                            Explore the interactive story book that brings the DQ Agile TMS framework to life through engaging narratives and visual storytelling.
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
                      <GuidelineSection id="course" title="Course - Video Learning">
                        <div className="space-y-8">
                          <div className="text-center">
                            <PlayCircle size={64} className="mx-auto text-blue-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Agile TMS Video Course</h3>
                            <p className="text-gray-600 mb-8">
                              Deepen your understanding of the DQ Agile TMS framework through our comprehensive video learning modules.
                            </p>
                          </div>
                          
                          {/* Course Button Section */}
                          <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">DQ Agile TMS Course</h4>
                                <p className="text-sm text-gray-600">Complete learning module</p>
                              </div>
                              <a
                                href="https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/e0c7d0c1-d726-45f9-80fe-16e5a4e5bc66"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <PlayCircle size={16} />
                                <span>Start</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </GuidelineSection>
                    )}
                  </div>
                </div>

                {/* Course summary sidebar removed per request */}
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

