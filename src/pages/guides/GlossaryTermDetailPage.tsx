import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useAuth } from '../../components/Header/context/AuthContext'
import { glossaryTerms } from './glossaryData'
import { StandardizedGlossaryDetailPage } from './StandardizedGlossaryDetailPage'

export function GlossaryTermDetailPage() {
  const { termId } = useParams<{ termId: string }>()
  const { user } = useAuth()

  const term = useMemo(() => {
    return glossaryTerms.find(t => t.id === termId || t.id === termId?.replace(/^glossary-/, ''))
  }, [termId])

  if (!term) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Term Not Found</h1>
            <p className="text-gray-600 mb-6">The glossary term you're looking for doesn't exist.</p>
            <Link
              to="/marketplace/guides?tab=glossary"
              className="px-4 py-2 bg-[var(--guidelines-primary)] text-white rounded-lg hover:bg-[var(--guidelines-primary-dark)] transition-colors inline-block"
            >
              Back to Glossary
            </Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  return <StandardizedGlossaryDetailPage term={term} />

  // Get badge labels
  const knowledgeSystemLabel = term.knowledgeSystem === 'ghc' ? 'GHC' : term.knowledgeSystem === '6xd' ? '6xD' : null
  const dimensionLabel = term.knowledgeSystem === 'ghc' && term.ghcDimension
    ? GHC_DIMENSIONS.find(d => d.id === term.ghcDimension)?.name
    : term.knowledgeSystem === '6xd' && term.sixXdDimension
    ? SIX_XD_DIMENSIONS.find(d => d.id === term.sixXdDimension)?.name
    : null
  const termOriginLabel = term.termOrigin
    ? TERM_ORIGINS.find(o => o.id === term.termOrigin)?.name
    : null

  // Find related terms
  const relatedTermsList = useMemo(() => {
    if (!term.relatedTerms || term.relatedTerms.length === 0) return []
    return glossaryTerms.filter(t => term.relatedTerms?.includes(t.id))
  }, [term.relatedTerms])

  // Format who uses it labels
  const whoUsesItLabels: Record<string, string> = {
    'leadership': 'Leadership',
    'delivery': 'Delivery',
    'agile-transformation': 'Agile / Transformation',
    'engineering': 'Engineering',
    'operations': 'Operations',
    'new-joiners': 'New Joiners'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
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
                <Link to="/marketplace/guides?tab=glossary" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Glossary
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">{term.term}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace/guides?tab=glossary')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Glossary</span>
        </button>

        {/* Term Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-wrap gap-2 items-center mb-4">
            {knowledgeSystemLabel && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                term.knowledgeSystem === 'ghc' 
                  ? 'bg-purple-100 text-purple-700 border-purple-200' 
                  : 'bg-blue-100 text-blue-700 border-blue-200'
              }`}>
                {knowledgeSystemLabel}
              </span>
            )}
            {dimensionLabel && (
              <span className="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {dimensionLabel}
              </span>
            )}
            {termOriginLabel && (
              <span className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                {termOriginLabel}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{term.term}</h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* 1. Story / Introduction */}
          {term.shortIntro && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Story</h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {term.shortIntro}
              </p>
            </section>
          )}

          {/* 2. DQ Definition */}
          {term.explanation && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">DQ Definition</h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {term.explanation}
              </p>
            </section>
          )}

          {/* 3. Market / Standard Definition */}
          {term.marketDefinition && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Market / Standard Definition</h2>
              <p className="text-gray-700 leading-relaxed text-base">
                {term.marketDefinition}
              </p>
            </section>
          )}

          {/* 4. Examples / Use Cases */}
          {(term.examples && term.examples.length > 0) || (term.useCases && term.useCases.length > 0) ? (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Examples / Use Cases</h2>
              <ul className="space-y-3">
                {(term.examples || term.useCases || []).map((example, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">•</span>
                    <span className="text-gray-700 leading-relaxed flex-1">{example}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* 5. Department / Who Uses It */}
          {term.whoUsesIt && term.whoUsesIt.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Who Uses It</h2>
              <div className="flex flex-wrap gap-2">
                {term.whoUsesIt.map((who, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {whoUsesItLabels[who] || who}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 6. Related Terms */}
          {relatedTermsList.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTermsList.map((relatedTerm) => (
                  <Link
                    key={relatedTerm.id}
                    to={`/marketplace/guides/glossary/${relatedTerm.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[var(--guidelines-primary)] text-white hover:bg-[var(--guidelines-primary-dark)] transition-colors"
                  >
                    {relatedTerm.term}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Back to Glossary Link */}
        <div className="mt-8 text-center">
          <Link
            to="/marketplace/guides?tab=glossary"
            className="inline-flex items-center gap-2 text-[var(--guidelines-primary)] hover:text-[var(--guidelines-primary-dark)] font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Glossary</span>
          </Link>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GlossaryTermDetailPage

