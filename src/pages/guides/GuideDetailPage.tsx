// CODEx: Changes Made
// - Added actionable banner controls: Open Document + Download
// - Inserted new DocumentPreview section above content summary
// - Replaced always-on long body with concise Summary card and an "Expand full details" toggle
// - Telemetry hooks for open/download/preview clicks
// - Guarded for missing/invalid documentUrl (hides controls/preview)
// - Added accessibility attributes and improved button styling per spec

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ChevronRightIcon, HomeIcon, CheckCircle, Share2, Download, AlertTriangle, ExternalLink, Calendar, User, Building2, Heart, MessageCircle, BookmarkIcon, FileText } from 'lucide-react'
import { supabaseClient } from '../../lib/supabaseClient'
import { getGuideImageUrl } from '../../utils/guideImageMap'
import { track } from '../../utils/analytics'
import { useAuth } from '../../components/Header/context/AuthContext'
// CODEx: import new preview component
import { DocumentPreview } from '../../components/guides/DocumentPreview'

const Markdown = React.lazy(() => import('../../components/guides/MarkdownRenderer'))

interface GuideRecord {
  id: string
  slug?: string
  title: string
  summary?: string
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null
  functionArea?: string | null
  status?: string | null
  complexityLevel?: string | null
  skillLevel?: string | null
  estimatedTimeMin?: number | null
  lastUpdatedAt?: string | null
  authorName?: string | null
  authorOrg?: string | null
  isEditorsPick?: boolean | null
  downloadCount?: number | null
  documentUrl?: string | null
  body?: string | null
  steps?: Array<{ id?: string; position?: number; title?: string; content?: string }>
  attachments?: Array<{ id?: string; type?: string; title?: string; url?: string; size?: string }>
  templates?: Array<{ id?: string; title?: string; url?: string; size?: string }>
}

const GuideDetailPage: React.FC = () => {
  const { itemId } = useParams()
  const location = useLocation() as any
  const navigate = useNavigate()
  const { user } = useAuth()

  const [guide, setGuide] = useState<GuideRecord | null>(null)
  const [related, setRelated] = useState<GuideRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({})
  const [previewUnavailable, setPreviewUnavailable] = useState(false)
  const articleRef = useRef<HTMLDivElement | null>(null)
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(47) // Mock likes count
  const [comments, setComments] = useState(12) // Mock comments count

  const backQuery = (location?.state && location.state.fromQuery) ? String(location.state.fromQuery) : ''
  const backHref = `/marketplace/guides${backQuery ? `?${backQuery}` : ''}`

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/guides/${encodeURIComponent(itemId || '')}`)
        const ct = res.headers.get('content-type') || ''
        if (res.ok && ct.includes('application/json')) {
          const data = await res.json()
          if (!cancelled) setGuide(data)
        } else {
          const key = String(itemId || '')
          let { data: row, error: err1 } = await supabaseClient.from('guides').select('*').eq('slug', key).maybeSingle()
          if (err1) throw err1
          if (!row) {
            const { data: row2, error: err2 } = await supabaseClient.from('guides').select('*').eq('id', key).maybeSingle()
            if (err2) throw err2
            row = row2 as any
          }
          if (!row) throw new Error('Not found')
          const mapped: GuideRecord = {
            id: row.id,
            slug: row.slug,
            title: row.title,
            summary: row.summary ?? undefined,
            heroImageUrl: row.hero_image_url ?? row.heroImageUrl ?? null,
            domain: row.domain ?? null,
            guideType: row.guide_type ?? row.guideType ?? null,
            functionArea: row.function_area ?? null,
            status: row.status ?? null,
            complexityLevel: row.complexity_level ?? null,
            skillLevel: row.skill_level ?? row.skillLevel ?? null,
            estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin ?? null,
            lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt ?? null,
            authorName: row.author_name ?? row.authorName ?? null,
            authorOrg: row.author_org ?? row.authorOrg ?? null,
            isEditorsPick: row.is_editors_pick ?? row.isEditorsPick ?? null,
            downloadCount: row.download_count ?? row.downloadCount ?? null,
            documentUrl: row.document_url ?? row.documentUrl ?? null,
            body: row.body ?? null,
            steps: [], attachments: [], templates: [],
          }
          if (!cancelled) setGuide(mapped)
        }
      } catch (e: any) {
        if (!cancelled) setError('Guide not found')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [itemId])

  useEffect(() => { if (guide?.slug) track('Guides.ViewDetail', { slug: guide.slug }) }, [guide?.slug])

  // Progressive body fetch
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!guide) return
      if (guide.body) return
      try {
        const res = await fetch(`/api/guides/${encodeURIComponent(guide.slug || guide.id)}?include=body`)
        const ct = res.headers.get('content-type') || ''
        if (res.ok && ct.includes('application/json')) {
          const full = await res.json()
          if (!cancelled) setGuide({ ...guide, body: full.body || null })
        }
      } catch {}
    })()
    return () => { cancelled = true }
  }, [guide?.id, guide?.slug])

  // Build ToC and track body link clicks
  useEffect(() => {
    const el = articleRef.current
    if (!el) return
    const hs = Array.from(el.querySelectorAll('h2, h3')) as HTMLElement[]
    const items = hs.map(h => ({ id: h.id, text: h.innerText.trim(), level: h.tagName === 'H2' ? 2 : 3 }))
    setToc(items.filter(i => i.id && i.text))
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const a = t.closest('a') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (href.startsWith('#')) track('Guides.CTA', { category: 'guide_heading_anchor', id: href.replace(/^#/, ''), slug: guide?.slug || guide?.id })
      else track('Guides.CTA', { category: 'guide_body_link', href, slug: guide?.slug || guide?.id })
    }
    el.addEventListener('click', onClick)
    return () => { el.removeEventListener('click', onClick) }
  }, [guide?.slug, guide?.id, guide?.body])

  // Related guides
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!guide) return
      const selectCols = 'id,slug,title,summary,hero_image_url,guide_type,domain,last_updated_at,download_count,is_editors_pick'
      let first: any[] = []
      try {
        if (guide.domain) {
          const q = supabaseClient
            .from('guides')
            .select(selectCols)
            .eq('domain', guide.domain)
            .neq('slug', guide.slug || '')
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          const { data: rows } = await q
          first = rows || []
        }
        let results = first
        if ((results?.length || 0) < 6 && guide.guideType) {
          const q2 = supabaseClient
            .from('guides')
            .select(selectCols)
            .eq('guide_type', guide.guideType)
            .neq('slug', guide.slug || '')
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          const { data: rows2 } = await q2
          const map = new Map<string, any>()
          for (const r of (first || [])) map.set(r.slug || r.id, r)
          for (const r of (rows2 || [])) { const k = r.slug || r.id; if (!map.has(k)) map.set(k, r) }
          results = Array.from(map.values()).slice(0, 6)
        }
        if (!cancelled) setRelated((results || []).map((r: any) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          summary: r.summary,
          heroImageUrl: r.hero_image_url ?? null,
          guideType: r.guide_type ?? null,
          domain: r.domain ?? null,
          lastUpdatedAt: r.last_updated_at ?? null,
          isEditorsPick: r.is_editors_pick ?? null,
          downloadCount: r.download_count ?? null,
        } as GuideRecord)))
      } catch {
        if (!cancelled) setRelated([])
      }
    })()
    return () => { cancelled = true }
  }, [guide?.id, guide?.domain, guide?.guideType, guide?.slug])

  const imageUrl = useMemo(() => getGuideImageUrl({ heroImageUrl: guide?.heroImageUrl || undefined, domain: guide?.domain || undefined, guideType: guide?.guideType || undefined }), [guide?.heroImageUrl, guide?.domain, guide?.guideType])

  // CODEx: build concise summary from provided summary or derived from body
  const derivedSummary: string | null = useMemo(() => {
    if (!guide) return null
    if (guide.summary && guide.summary.trim().length > 0) return guide.summary.trim()
    const src = guide.body || ''
    if (!src) return null
    // Strip basic Markdown/HTML for a clean snippet
    const withoutMd = src
      .replace(/```[\s\S]*?```/g, ' ') // code blocks
      .replace(/`[^`]*`/g, ' ') // inline code
      .replace(/^#+\s.*$/gm, ' ') // headings
      .replace(/\*\*|__/g, '') // bold markers
      .replace(/\*|_|~|>\s?/g, ' ') // other markers
      .replace(/<[^>]+>/g, ' ') // html tags
      .replace(/\s+/g, ' ') // collapse spaces
      .trim()
    if (!withoutMd) return null
    const max = 480
    if (withoutMd.length <= max) return withoutMd
    const slice = withoutMd.slice(0, max)
    const lastSpace = slice.lastIndexOf(' ')
    return (lastSpace > 200 ? slice.slice(0, lastSpace) : slice) + '…'
  }, [guide?.summary, guide?.body])

  // CODEx: expand/collapse for full details (markdown body)
  const [showFullDetails, setShowFullDetails] = useState(false)

  // Open/Print removed per new design
  const handleDownload = (category: 'attachment' | 'template', item: any) => {
    if (!item?.url) return
    track('Guides.Download', { slug: guide?.slug || guide?.id, category, id: item.id || item.url, title: item.title || undefined })
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }
  // CODEx: banner open/download controls for main document
  const openMainDocument = () => {
    if (!hasDocument) return
    track('policy_open_clicked', { policyId: guide?.slug || guide?.id, title: guide?.title })
    window.open(documentUrl, '_blank', 'noopener')
  }
  const downloadMainDocument = async () => {
    if (!hasDocument) return
    track('policy_download_clicked', { policyId: guide?.slug || guide?.id, title: guide?.title })
    try {
      // Prefer native download attribute; fall back to opening in new tab
      const a = document.createElement('a')
      a.href = documentUrl
      a.download = ''
      a.rel = 'noopener'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch {
      window.open(guide.documentUrl, '_blank', 'noopener')
    }
  }
  const handleShare = async () => {
    const url = window.location.href
    const title = guide?.title || 'Guide'
    try { if ((navigator as any).share) await (navigator as any).share({ title, url }); else if (navigator.clipboard) { await navigator.clipboard.writeText(url); alert('Link copied to clipboard') } }
    finally { track('Guides.Share', { slug: guide?.slug || guide?.id }) }
  }
  // Print removed per new design

  const type = (guide?.guideType || '').toLowerCase()
  const stepsCount = guide?.steps?.length ?? 0
  const hasSteps = stepsCount > 0
  const showSteps = hasSteps
  const showTemplates = (guide?.templates && guide.templates.length > 0) || type === 'template'
  const showAttachments = (guide?.attachments && guide.attachments.length > 0)
  const isPractitionerType = ['best practice', 'best-practice', 'process', 'sop', 'procedure'].includes(type)
  const showFallbackModule = isPractitionerType && !showTemplates && !showAttachments
  const lastUpdated = guide?.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
  const announcementDate = guide?.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null
  const announcementDateShort = guide?.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
  
  // Generate initials for author icon (G|CC style)
  const getAuthorInitials = () => {
    if (guide?.authorOrg) {
      const parts = guide.authorOrg.split('|').map(p => p.trim())
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}|${parts[1].substring(0, 2).toUpperCase()}`
      }
      return guide.authorOrg.substring(0, 3).toUpperCase()
    }
    if (guide?.authorName) {
      const names = guide.authorName.split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
      }
      return guide.authorName.substring(0, 2).toUpperCase()
    }
    return 'DQ'
  }
  const isApproved = ((guide?.status) || 'Approved') === 'Approved'
  const documentUrl = (guide?.documentUrl || '').trim()
  const hasDocument = documentUrl.length > 0
  const isPolicy = type === 'policy'
  const showPolicyCtas = isPolicy
  const showDocumentActions = hasDocument
  const isPreviewableDocument = isPolicy && hasDocument && (() => {
    const base = documentUrl.split('#')[0].split('?')[0].toLowerCase()
    return base.endsWith('.pdf')
  })()

  useEffect(() => {
    setPreviewUnavailable(false)
  }, [documentUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 guidelines-theme">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow"><div className="bg-white rounded shadow p-8 text-center text-gray-500">Loading…</div></main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 guidelines-theme">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
              {/* <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">Resources</span></div></li> */}
              <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to={`/marketplace/guides`} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">DQ Media Center</Link></div></li>
              <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">Details</span></div></li>
            </ol>
          </nav>
          <div className="bg-white rounded shadow p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">{error || 'Not Found'}</h2>
            <Link to={`/marketplace/guides`} className="text-[var(--guidelines-primary)]">Back to DQ Media Center</Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow guide-detail" role="main">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
            <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">Resources</span></div></li>
            <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to={backHref} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">DQ Media Center</Link></div></li>
            <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">{guide.title}</span></div></li>
          </ol>
        </nav>

        {!isApproved && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 flex items-start gap-2" role="alert">
            <AlertTriangle size={18} className="mt-0.5" />
            <div>
              <div className="font-semibold">This guide is not approved</div>
              <div className="text-sm">Status: {guide.status}</div>
            </div>
          </div>
        )}

        {/* Header card - Updated to match screenshot styling */}
        <header className="bg-white rounded-lg shadow p-6 mb-6" aria-labelledby="guide-title">
          <div className="space-y-4">
            {/* Category tag and date row */}
            <div className="flex items-center gap-4 flex-wrap">
              {guide.guideType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  {guide.guideType}
                </span>
              )}
              {announcementDateShort && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{announcementDateShort}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 id="guide-title" className="text-3xl font-bold text-gray-900">{guide.title}</h1>

            {/* Author info with circular icon */}
            {(guide.authorName || guide.authorOrg) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                  {getAuthorInitials()}
                </div>
                <div>
                  {guide.authorOrg && (
                    <div className="font-medium text-gray-900">{guide.authorOrg}</div>
                  )}
                  {guide.authorName && (
                    <div className="text-sm text-gray-600">{guide.authorName}</div>
                  )}
                </div>
              </div>
            )}

            {/* Image if available */}
            {imageUrl && (
              <img src={imageUrl} alt={guide.title} className="w-full h-60 object-cover rounded mb-4" loading="lazy" decoding="async" width={1200} height={320} />
            )}
          </div>
        </header>

        {/* Dynamic layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* CODEx: Document preview placed before summary */}
            {(isPolicy && isPreviewableDocument && !previewUnavailable && hasDocument) && (
              <DocumentPreview
                documentUrl={guide.documentUrl}
                title={guide.title}
                onOpen={() => {
                  track('policy_preview_open_clicked', { policyId: guide.slug || guide.id, title: guide.title })
                  openMainDocument()
                }}
                onUnavailable={() => setPreviewUnavailable(true)}
              />
            )}

            {/* Announcement body content */}
            {guide.body && !isPolicy && (
              <section className="bg-white rounded-lg shadow p-6" aria-label="Content">
                <div className="prose max-w-none">
                  <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                    <Markdown body={guide.body || ''} />
                  </React.Suspense>
                </div>
              </section>
            )}

            {/* CODEx: Concise Summary card for policy pages only */}
            {isPolicy && (derivedSummary || guide.summary) && (
              <section className="bg-white rounded-lg shadow p-6" aria-label="Summary">
                <h2 className="text-xl font-semibold mb-3">Summary</h2>
                <p className="text-gray-700 leading-7">{derivedSummary || guide.summary}</p>
                {guide.body && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowFullDetails(s => !s)}
                      className="text-[var(--guidelines-primary)] font-medium hover:underline focus:outline-none"
                      aria-expanded={showFullDetails}
                      aria-controls="full-details"
                    >
                      {showFullDetails ? 'Hide full details' : 'Expand full details'}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* COMPANY NEWS DETAILS Section */}
            <section className="bg-gray-50 rounded-lg p-6 border border-gray-200" aria-label="Company News Details">
              <div className="space-y-4">
                {announcementDate && (
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-500" />
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ANNOUNCEMENT DATE</div>
                      <div className="text-gray-900">{announcementDate}</div>
                    </div>
                  </div>
                )}
                {(guide.authorName || guide.authorOrg) && (
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-500" />
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">RELEVANT CONTACT</div>
                      <div className="text-gray-900">{guide.authorOrg || guide.authorName || 'N/A'}</div>
                    </div>
                  </div>
                )}
                {(guide.functionArea || guide.domain) && (
                  <div className="flex items-center gap-3">
                    <Building2 size={18} className="text-gray-500" />
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">DEPARTMENT</div>
                      <div className="text-gray-900">{guide.functionArea || guide.domain || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* NEXT STEPS Section */}
            <section className="bg-white rounded-lg shadow p-6" aria-label="Next Steps">
              <h2 className="text-xl font-semibold mb-4">NEXT STEPS</h2>
              <div className="flex flex-wrap gap-3">
                {hasDocument && (
                  <button
                    onClick={openMainDocument}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FileText size={16} /> Read Full Policy
                  </button>
                )}
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <FileText size={16} /> Complete Survey
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <Calendar size={16} /> Book Orientation
                </button>
              </div>
            </section>

            {/* Engagement Metrics and Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <Heart size={18} />
                    <span>{likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <MessageCircle size={18} />
                    <span>{comments}</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded hover:bg-gray-100 transition-colors ${isBookmarked ? 'text-blue-600' : 'text-gray-600'}`}
                    aria-label="Bookmark"
                  >
                    <BookmarkIcon size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Questions section */}
            <div className="text-sm text-gray-600 pt-4">
              <strong>Questions about this announcement?</strong> Contact {guide.authorOrg || guide.authorName || 'Human Resources'}.
            </div>

            {/* CODEx: For policy pages, long body behind a toggle; for others, show as usual */}
            {isPolicy && type !== 'template' && guide.body && (
              <article
                id="full-details"
                ref={articleRef}
                className={`bg-white rounded-lg shadow p-6 markdown-body ${!showFullDetails ? 'hidden' : ''}`}
                dir={typeof document !== 'undefined' ? (document.documentElement.getAttribute('dir') || 'ltr') : 'ltr'}
              >
                <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                  <Markdown body={guide.body || ''} />
                </React.Suspense>
              </article>
            )}
            {type !== 'template' && !guide.body && (
              <section className="bg-white rounded-lg shadow p-6 space-y-4" aria-label="Overview">
                {guide.summary && (
                  <div className="text-gray-700 leading-7 whitespace-pre-line">{guide.summary}</div>
                )}
                {guide.steps && guide.steps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Steps</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {guide.steps.map((step, idx) => (
                        <li key={step.id || idx}>
                          <span className="font-medium mr-1">{step.title || `Step ${idx + 1}`}:</span>
                          <span className="text-gray-600">{step.content}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasDocument && (
                  <p className="text-sm text-gray-500">
                    This guide links to an external document for full details.
                  </p>
                )}
              </section>
            )}

            {(showSteps) && (
              <section aria-labelledby="steps-title" className="bg-white rounded-lg shadow p-6" id="content">
                <h2 id="steps-title" className="text-xl font-semibold mb-4">{type === 'process' || type === 'sop' || type === 'procedure' ? 'Process' : type === 'checklist' ? 'Checklist' : type === 'best practice' || type === 'best-practice' ? 'Recommended Actions' : 'Steps'}</h2>
                <ol className="space-y-3">
                  {(guide.steps && guide.steps.length > 0 ? guide.steps : []).map((s, idx) => (
                    <li key={(s.id || `${idx}`) as string} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{s.title || `Step ${s.position || idx + 1}`}</div>
                        {type === 'checklist' ? (
                          <div className="mt-1 flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4" aria-label={`Mark ${s.title || `Step ${idx + 1}`} as complete`} checked={!!checklistState[String(idx)]} onChange={(e) => setChecklistState(prev => ({ ...prev, [String(idx)]: e.target.checked }))} />
                            <span className="text-sm text-gray-700 whitespace-pre-wrap">{s.content}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">{s.content}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {showFallbackModule && (
              <section aria-labelledby="guide-info" className="bg-white rounded-lg shadow p-6" id="info">
                <h2 id="guide-info" className="text-xl font-semibold mb-4">Guide Info</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guide.domain && <div><dt className="text-gray-500 text-sm">Domain</dt><dd className="text-gray-900">{guide.domain}</dd></div>}
                  {guide.functionArea && <div><dt className="text-gray-500 text-sm">Function Area</dt><dd className="text-gray-900">{guide.functionArea}</dd></div>}
                  {guide.estimatedTimeMin != null && <div><dt className="text-gray-500 text-sm">Estimated Time</dt><dd className="text-gray-900">{guide.estimatedTimeMin} min</dd></div>}
                  {lastUpdated && <div><dt className="text-gray-500 text-sm">Last Updated</dt><dd className="text-gray-900">{lastUpdated}</dd></div>}
                  {(guide.authorName || guide.authorOrg) && <div className="sm:col-span-2"><dt className="text-gray-500 text-sm">Publisher</dt><dd className="text-gray-900">{guide.authorName || ''}{guide.authorOrg ? (guide.authorName ? ' • ' : '') + guide.authorOrg : ''}</dd></div>}
                </dl>
                {!guide.body && guide.summary && (
                  <p className="text-sm text-gray-600 mt-4">{guide.summary}</p>
                )}
              </section>
            )}

            {showTemplates && (
              <section aria-labelledby="templates-title" className="bg-white rounded-lg shadow p-6" id="templates">
                <h2 id="templates-title" className="text-xl font-semibold mb-4">Templates</h2>
                {(guide.templates && guide.templates.length > 0) ? (
                  <ul className="divide-y divide-gray-100">
                    {guide.templates!.map((t, i) => (
                      <li key={t.id || i} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{t.title || t.url}</div>
                          {t.size && <div className="text-xs text-gray-500">{t.size}</div>}
                        </div>
                        <button onClick={() => handleDownload('template', t)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm">
                          <Download size={16} /> Download
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No templates provided.</p>
                )}
              </section>
            )}

            {showAttachments && (
              <section aria-labelledby="attachments-title" className="bg-white rounded-lg shadow p-6" id="attachments">
                <h2 id="attachments-title" className="text-xl font-semibold mb-4">Attachments</h2>
                {(guide.attachments && guide.attachments.length > 0) ? (
                  <ul className="divide-y divide-gray-100">
                    {guide.attachments!.map((a, i) => (
                      <li key={a.id || i} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{a.title || a.url}</div>
                          {a.size && <div className="text-xs text-gray-500">{a.size}</div>}
                        </div>
                        <button onClick={() => handleDownload('attachment', a)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm">
                          <Download size={16} /> Download
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No attachments provided.</p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar: Related Announcements - Updated to match screenshot */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24" aria-label="Secondary">
            {related && related.length > 0 && (
              <section aria-labelledby="related-title" className="bg-white rounded-lg shadow p-6" id="related">
                <h2 id="related-title" className="text-xl font-semibold mb-4">Related Announcements</h2>
                <div className="space-y-3">
                  {related.slice(0, 3).map((r) => {
                    const relatedDate = r.lastUpdatedAt ? new Date(r.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
                    const getTagColor = (type: string | null | undefined) => {
                      if (!type) return 'bg-gray-100 text-gray-700'
                      const lowerType = type.toLowerCase()
                      if (lowerType.includes('event') || lowerType.includes('upcoming')) return 'bg-orange-100 text-orange-700'
                      if (lowerType.includes('recognition') || lowerType.includes('employee')) return 'bg-green-100 text-green-700'
                      if (lowerType.includes('policy') || lowerType.includes('update')) return 'bg-purple-100 text-purple-700'
                      return 'bg-blue-100 text-blue-700'
                    }
                    return (
                      <Link
                        key={r.slug || r.id}
                        to={`/marketplace/guides/${encodeURIComponent(r.slug || r.id)}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
                        onClick={() => track('Guides.RelatedClick', { from: guide.slug || guide.id, to: r.slug || r.id })}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {r.guideType && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${getTagColor(r.guideType)}`}>
                                {r.guideType}
                              </span>
                            )}
                            {relatedDate && (
                              <div className="text-xs text-gray-500 mb-2">{relatedDate}</div>
                            )}
                            <div className="font-medium text-gray-900 line-clamp-2" title={r.title}>{r.title}</div>
                          </div>
                          <ChevronRightIcon size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </aside>
        </section>

        <div className="mt-6 text-right">
          <Link to={backHref} className="text-[var(--guidelines-primary)]">Back to DQ Media Center</Link>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuideDetailPage
