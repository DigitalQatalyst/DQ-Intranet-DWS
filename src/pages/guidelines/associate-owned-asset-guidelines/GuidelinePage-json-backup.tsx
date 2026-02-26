import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

interface TableData {
  title: string
  columns: Array<{ header: string; accessor: string }>
  data: Array<Record<string, string>>
}

interface Section {
  id: string
  title: string
  order: number
  type: 'text' | 'table'
  content?: string
  description?: string
  table?: TableData
}

interface GuidelineContent {
  sections: Section[]
}

function GuidelinePage() {
  const { user } = useAuth()
  const [guideTitle, setGuideTitle] = useState<string>('DQ Associate Owned Asset Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('Version 1.8 • December 19, 2025')
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [modalStates, setModalStates] = useState<Record<string, boolean>>({})
  
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
          
          // Parse the body JSON to get sections
          if (data.body) {
            try {
              const content: GuidelineContent = JSON.parse(data.body)
              console.log('✅ [DATABASE] Loaded guideline content from database')
              console.log(`📊 [DATABASE] Total sections: ${content.sections?.length || 0}`)
              console.log(`📝 [DATABASE] Text sections: ${content.sections?.filter(s => s.type === 'text').length || 0}`)
              console.log(`📋 [DATABASE] Table sections: ${content.sections?.filter(s => s.type === 'table').length || 0}`)
              console.log('🔍 [DATABASE] First section:', content.sections?.[0])
              setSections(content.sections || [])
            } catch (e) {
              console.error('Error parsing guideline content:', e)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching guide:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])
  
  const openModal = (sectionId: string) => {
    setModalStates(prev => ({ ...prev, [sectionId]: true }))
  }
  
  const closeModal = (sectionId: string) => {
    setModalStates(prev => ({ ...prev, [sectionId]: false }))
  }

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
              {/* Database-driven indicator */}
              <div className="mb-6 flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
                </svg>
                <span className="font-medium">Database-Driven Content</span>
                <span className="text-green-500">•</span>
                <span className="text-xs text-green-600">{sections.length} sections loaded from database</span>
              </div>
              
              {sections.map((section) => (
                <div key={section.id}>
                  <GuidelineSection id={section.id} title={section.title}>
                    {section.type === 'text' && (
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content || '' }}
                      />
                    )}
                    
                    {section.type === 'table' && section.table && (
                      <>
                        {section.description && <p className="mb-6">{section.description}</p>}
                        <SummaryTable
                          title={section.table.title}
                          columns={section.table.columns}
                          data={section.table.data}
                          onViewFull={() => openModal(section.id)}
                        />
                        <FullTableModal
                          isOpen={modalStates[section.id] || false}
                          onClose={() => closeModal(section.id)}
                          title={section.table.title}
                          columns={section.table.columns}
                          data={section.table.data}
                        />
                      </>
                    )}
                  </GuidelineSection>
                </div>
              ))}
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
