import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'

function GuidelinePage() {
  const { user } = useAuth()
  const [guideTitle, setGuideTitle] = useState<string>('DQ Associate Owned Asset Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('Version 1.8 • December 19, 2025')
  const [guideHtml, setGuideHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data, error } = await supabaseClient
          .from('guides')
          .select('title, last_updated_at, body')
          .eq('slug', 'dq-associate-owned-asset-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Associate Owned Asset Guidelines')
          if (data.last_updated_at) {
            const date = new Date(data.last_updated_at)
            setLastUpdated(`Version 1.8 • ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`)
          }
          
          // Store HTML directly (no JSON parsing)
          if (data.body) {
            console.log('✅ [DATABASE] Loaded HTML content from database')
            console.log(`📄 [DATABASE] Content length: ${data.body.length} characters`)
            setGuideHtml(data.body)
          }
        }
      } catch (error) {
        console.error('Error fetching guide:', error)
        if (!cancelled) {
          setError('Failed to load guide')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
        <Footer isLoggedIn={!!user} />
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
                  <Link to="/marketplace/guides?tab=guidelines" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Guidelines
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{guideTitle}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection title={guideTitle} date={lastUpdated} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* HTML Rendering indicator */}
              <div className="mb-6 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">HTML Rendering Mode</span>
                <span className="text-blue-500">•</span>
                <span className="text-xs text-blue-600">Content rendered directly from database</span>
              </div>
              
              {/* HTML Content */}
              <div 
                className="prose prose-lg max-w-none
                           prose-headings:font-bold prose-headings:text-gray-900
                           prose-h1:text-3xl prose-h1:mb-4
                           prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                           prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                           prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                           prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
                           prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                           prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                           prose-li:mb-2
                           prose-strong:font-semibold prose-strong:text-gray-900
                           prose-table:border-collapse prose-table:w-full prose-table:my-6
                           prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                           prose-td:border prose-td:border-gray-300 prose-td:p-3
                           prose-tr:even:bg-gray-50"
                dangerouslySetInnerHTML={{ __html: guideHtml }}
              />
            </div>

            {/* Right Column - Sidebar Navigation */}
            <div className="lg:col-span-1">
              <SideNav />
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage
