import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon, ExternalLink } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'
const Markdown = React.lazy(() => import('../../../components/guides/MarkdownRenderer'))

function GuidelinePage() {
  const { user } = useAuth()
  const currentSlug = 'dq-products'
  
  const [currentGuide, setCurrentGuide] = useState<{ domain?: string | null; guideType?: string | null; body?: string | null } | null>(null)

  // Fetch current guide data
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data: guideData, error } = await supabaseClient
          .from('guides')
          .select('domain, guide_type, body')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled) {
          if (guideData) {
            setCurrentGuide({
              domain: guideData.domain,
              guideType: guideData.guide_type,
              body: guideData.body
            })
          } else {
            setCurrentGuide({ domain: null, guideType: null, body: null })
          }
        }
      } catch (error) {
        console.error('Error fetching current guide:', error)
        if (!cancelled) {
          setCurrentGuide({ domain: null, guideType: null, body: null })
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentSlug])

  // Parse body into sections
  const parseSections = (body: string) => {
    const sections: Array<{ id: string; title: string; content: string }> = []
    const lines = body.split('\n')
    let currentSection: { id: string; title: string; content: string } | null = null

    for (const line of lines) {
      // Check for H2 headers (## Title)
      const h2Regex = /^##\s+(.+)$/;
      const h2Match = h2Regex.exec(line);
      if (h2Match) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection)
        }
        // Start new section
        const title = h2Match[1].trim()
        // Use safer regex patterns to prevent ReDoS - using replace with /g flag for security
        const id = title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')  // NOSONAR: replace with /g is safer than replaceAll for ReDoS prevention
          .replace(/^-+/, '')            // Remove leading dashes
          .replace(/-+$/, '');           // Remove trailing dashes
        currentSection = { id, title, content: '' }
      } else if (currentSection) {
        currentSection.content += line + '\n'
      }
    }

    // Add last section
    if (currentSection) {
      sections.push(currentSection)
    }

    // If no sections found, create an overview section
    if (sections.length === 0 && body.trim()) {
      sections.push({
        id: 'overview',
        title: 'Overview',
        content: body
      })
    }

    return sections
  }

  const sections = useMemo(() => {
    if (!currentGuide?.body) return []
    return parseSections(currentGuide.body)
  }, [currentGuide?.body])

  const sideNavSections = useMemo(() => {
    return sections.map(section => ({
      id: section.id,
      label: section.title
    }))
  }, [sections])



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => undefined} sidebarOpen={false} />
      
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
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Products</span>
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
              {/* Render sections */}
              {sections.length > 0 ? (
                sections.map((section) => {
                  const isTMAaaS = section.id === 'tmaas' || section.title.toLowerCase().includes('tmaas')
                  return (
                    <div key={section.id}>
                      <GuidelineSection id={section.id} title={section.title}>
                        <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                          <Markdown body={section.content} />
                        </React.Suspense>
                        {/* TMaaS Link - Positioned on right like table buttons */}
                        {isTMAaaS && (
                          <div className="mt-6 text-right">
                            <a
                              href="https://arqitek.sharepoint.com/:p:/s/DELSPL.DBAAServicescopy/IQAFxKfXanpVS66niAVjPL_gAUBu4T8Q5LJJDNIruw7v0RQ?e=ppo1AB"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                              style={{ 
                                backgroundColor: '#030E31'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#020A28'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#030E31'
                              }}
                            >
                              <span>View TMaaS Strategy Deck</span>
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        )}
                      </GuidelineSection>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading content...</p>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1">
              <SideNav sections={sideNavSections} />
            </aside>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

