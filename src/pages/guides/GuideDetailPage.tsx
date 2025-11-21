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
import { ChevronRightIcon, HomeIcon, CheckCircle, Download, AlertTriangle, ExternalLink } from 'lucide-react'
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
  subDomain?: string | null
  unit?: string | null
  location?: string | null
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
  const [activeContentTab, setActiveContentTab] = useState<string>('overview')

  const backQuery = (location?.state && location.state.fromQuery) ? String(location.state.fromQuery) : ''
  const initialBackHref = `/marketplace/guides${backQuery ? `?${backQuery}` : ''}`
  const activeTabFromState = (location?.state && location.state.activeTab) ? String(location.state.activeTab) : undefined
  type GuideTabKey = 'guidelines' | 'strategy' | 'blueprints' | 'testimonials'
const TAB_LABELS: Record<GuideTabKey, string> = {
  guidelines: 'Guidelines',
  strategy: 'Strategy',
  blueprints: 'Blueprints',
  testimonials: 'Testimonials'
}
  const normalizedStateTab = (activeTabFromState || '').toLowerCase()
  const stateTab: GuideTabKey | undefined =
    normalizedStateTab === 'strategy' || normalizedStateTab === 'blueprints'
      ? normalizedStateTab as GuideTabKey
      : undefined
const deriveTabKey = (g?: GuideRecord | null): GuideTabKey => {
  const domain = (g?.domain || '').toLowerCase()
  const guideType = (g?.guideType || '').toLowerCase()
  if (domain.includes('blueprint') || guideType.includes('blueprint')) return 'blueprints'
  if (domain.includes('strategy') || guideType.includes('strategy')) return 'strategy'
  if (domain.includes('testimonial') || guideType.includes('testimonial')) return 'testimonials'
  return 'guidelines'
}

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
            subDomain: row.sub_domain ?? row.subDomain ?? null,
            unit: row.unit ?? null,
            location: row.location ?? null,
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

  // Parse guide body into sections for tabs (for Guidelines, Strategy, Testimonials, and Blueprints)
  const guideSections = useMemo(() => {
    if (!guide?.body) return null
    // Apply tab navigation to all guides that have sections
    const hasValidDomain = ['Guidelines', 'Strategy', 'Testimonials', 'Testimonial', 'Blueprint'].includes(guide.domain || '')
    if (!hasValidDomain) return null
    
    const body = guide.body
    const sections: Array<{ id: string; title: string; content: string }> = []
    
    // Extract Description and Key Highlights for Overview tab (if they exist)
    // Handle both single and double newlines, and Key Highlights with or without colon
    const descMatch = body.match(/## Description\s*\n+([\s\S]*?)(?=\n##|\n#|$)/)
    const highlightsMatch = body.match(/## Key Highlights:?\s*\n+([\s\S]*?)(?=\n##|\n#|$)/)
    
    if (descMatch || highlightsMatch) {
      let overviewContent = ''
      if (descMatch) overviewContent += descMatch[1].trim() + '\n\n'
      if (highlightsMatch) overviewContent += '## Key Highlights\n\n' + highlightsMatch[1].trim()
      sections.push({ id: 'overview', title: 'Overview', content: overviewContent })
    } else {
      // For guides without Description/Key Highlights, use first paragraph as Overview
      const firstSectionMatch = body.match(/^# [^\n]+\n\n([\s\S]*?)(?=\n##|\n#|$)/)
      if (firstSectionMatch && firstSectionMatch[1].trim()) {
        const firstContent = firstSectionMatch[1].trim()
        // Only create Overview if there are multiple sections
        const sectionCount = (body.match(/^## /gm) || []).length
        if (sectionCount > 1) {
          sections.push({ id: 'overview', title: 'Overview', content: firstContent })
        }
      }
    }
    
    // Split body by section headers (## Title or ## **Title**)
    // This approach handles both single and double newlines after headers
    const lines = body.split('\n')
    const processedSections = new Set<string>(['overview', 'description', 'key-highlights'])
    let currentSection: { id: string; title: string; content: string[] } | null = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      // Match only H2 headers (##), not H3 (###)
      const trimmed = line.trim()
      if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        // Save previous section
        if (currentSection && currentSection.content.length > 0) {
          const content = currentSection.content.join('\n').trim()
          if (content.length > 0 && !processedSections.has(currentSection.id)) {
            processedSections.add(currentSection.id)
            sections.push({
              id: currentSection.id,
              title: currentSection.title,
              content
            })
          }
        }
        
        // Extract title by removing ## and any bold markers
        let title = line.replace(/^##\s+/, '').trim()
        title = title.replace(/\*\*/g, '').trim()
        
        // Skip Description and Key Highlights (already in Overview if they exist)
        // But only skip if Overview was created
        const hasOverview = sections.some(s => s.id === 'overview')
        if (hasOverview && (title === 'Description' || title === 'Key Highlights')) {
          currentSection = null
        } else {
          const sectionId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          currentSection = {
            id: sectionId,
            title,
            content: []
          }
        }
      } else if (currentSection) {
        // Add line to current section content
        currentSection.content.push(line)
      }
    }
    
    // Save last section
    if (currentSection && currentSection.content.length > 0) {
      const content = currentSection.content.join('\n').trim()
      if (content.length > 0 && !processedSections.has(currentSection.id)) {
        sections.push({
          id: currentSection.id,
          title: currentSection.title,
          content
        })
      }
    }
    
    return sections.length > 0 ? sections : null
  }, [guide?.body, guide?.domain])

  // Two-tier layout: Overview on top, other sections as tabs below (applies to all guides with Overview section)
  const overviewSection = useMemo(() => {
    if (!guideSections) return null
    return (guideSections || [])?.find((s: any) => s.id === 'overview') || null
  }, [guideSections])
  const sectionsForTabs = useMemo(() => {
    if (!guideSections) return null
    // If there's an Overview section, show it separately and put other sections in tabs
    // Otherwise, show all sections as tabs
    return overviewSection ? guideSections.filter((s: any) => s.id !== 'overview') : guideSections
  }, [guideSections, overviewSection])
  const hasTabsEffective = !!(sectionsForTabs && sectionsForTabs.length > 0)
  const hasOverviewSection = !!overviewSection

  // If Overview is separated and active tab is overview, default to first remaining section
  useEffect(() => {
    if (!hasOverviewSection) return
    if (activeContentTab !== 'overview') return
    if (sectionsForTabs && sectionsForTabs.length > 0) {
      setActiveContentTab(sectionsForTabs[0].id)
    }
  }, [hasOverviewSection, sectionsForTabs, activeContentTab])
  
  // For "View" buttons - check domain
  const isBlueprintDomain = deriveTabKey(guide) === 'blueprints'
  const isGuidelinesDomain = deriveTabKey(guide) === 'guidelines'
  const isStrategyDomain = deriveTabKey(guide) === 'strategy'
  const isTestimonialsDomain = deriveTabKey(guide) === 'testimonials'

  // Formatting helpers: Title-case labels and ensure bullet points for highlight items
  const toTitleCaseLabel = (s: string): string => (s || '').split(/\s+/).map(w => w ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(' ')
  const stripLeadingEmoji = (s: string): string => {
    // Remove leading emojis/symbols commonly used as icons
    // Unicode ranges cover misc symbols & pictographs
    return s.replace(/^[\u200d\ufe0f\uFE0F\u2060\s]*[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}]+\s*/u, '')
  }
  const ensureBulletedTitleCaseLine = (raw: string): string => {
    const line = stripLeadingEmoji(raw.trim())
    if (!line || line.startsWith('##')) return raw
    // - **Label**: text
    const m1 = line.match(/^\-\s*\*\*([^*]+)\*\*\s*:\s*(.*)$/)
    if (m1) return `- **${toTitleCaseLabel(stripLeadingEmoji(m1[1]))}**: ${m1[2]}`
    // **Label**: text
    const m2 = line.match(/^\*\*([^*]+)\*\*\s*:\s*(.*)$/)
    if (m2) return `- **${toTitleCaseLabel(stripLeadingEmoji(m2[1]))}**: ${m2[2]}`
    // - Label: text
    const m3 = line.match(/^\-\s*([^:]+)\s*:\s*(.*)$/)
    if (m3) return `- **${toTitleCaseLabel(stripLeadingEmoji(m3[1]))}**: ${m3[2]}`
    // Label: text (leading letter, avoid headers/lists)
    const m4 = line.match(/^[A-Za-z][^:]*:\s*.*$/)
    if (m4) {
      const idx = line.indexOf(':')
      const label = stripLeadingEmoji(line.slice(0, idx))
      const rest = line.slice(idx + 1).trim()
      return `- **${toTitleCaseLabel(label)}**: ${rest}`
    }
    return raw
  }
  const transformKeyHighlightsInOverview = (md: string): string => {
    const lines = (md || '').split('\n')
    let inKH = false
    const out: string[] = []
    for (const raw of lines) {
      const t = raw.trim()
      if (t.startsWith('## ')) {
        const title = t.replace(/^##\s+/, '').replace(/\*\*/g, '').trim().toLowerCase()
        inKH = title === 'key highlights'
        out.push(raw)
        continue
      }
      out.push(inKH ? ensureBulletedTitleCaseLine(raw) : raw)
    }
    return out.join('\n')
  }
  const formatSectionContent = (section: any): string => {
    const title = String(section?.title || '').trim().toLowerCase()
    if (title === 'key highlights') {
      const lines = (section.content || '').split('\n').map(ensureBulletedTitleCaseLine)
      return lines.join('\n')
    }
    return section.content || ''
  }

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
    track('Guides.CTA', { category: 'policy_open_clicked', policyId: guide?.slug || guide?.id, title: guide?.title })
    window.open(documentUrl, '_blank', 'noopener')
  }
  // Print removed per new design
  
  // (Removed) header guideline navigation now replaced by direct document link "View Blueprint"

  const type = (guide?.guideType || '').toLowerCase()
  const stepsCount = guide?.steps?.length ?? 0
  const hasSteps = stepsCount > 0
  const showSteps = hasSteps
  const showTemplates = (guide?.templates && guide.templates.length > 0) || type === 'template'
  const showAttachments = (guide?.attachments && guide.attachments.length > 0)
  const isPractitionerType = ['best practice', 'best-practice', 'process', 'sop', 'procedure'].includes(type)
  const showFallbackModule = isPractitionerType && !showTemplates && !showAttachments
  const lastUpdated = guide?.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null
  const isApproved = ((guide?.status) || 'Approved') === 'Approved'
  const documentUrl = (guide?.documentUrl || '').trim()
  const hasDocument = documentUrl.length > 0
  const primaryDocUrl = useMemo(() => {
    const t = (Array.isArray(guide?.templates) && guide!.templates.length > 0) ? (guide!.templates[0].url || '') : ''
    const a = (Array.isArray(guide?.attachments) && guide!.attachments.length > 0) ? (guide!.attachments[0].url || '') : ''
    return (documentUrl || '').trim() || t || a || ''
  }, [documentUrl, guide?.templates, guide?.attachments])
  const isPolicy = type === 'policy'
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
        <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl"><div className="bg-white rounded shadow p-8 text-center text-gray-500">Loading…</div></main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (error || !guide) {
    const breadcrumbLabel = TAB_LABELS[stateTab || 'guidelines']
    const fallbackHref = stateTab && stateTab !== 'guidelines' ? `/marketplace/guides?tab=${stateTab}` : '/marketplace/guides'
    const backHref = backQuery ? initialBackHref : fallbackHref
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 guidelines-theme">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
              <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to={backHref} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">{breadcrumbLabel}</Link></div></li>
              <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">Details</span></div></li>
            </ol>
          </nav>
          <div className="bg-white rounded shadow p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">{error || 'Not Found'}</h2>
            <Link to={backHref} className="text-[var(--guidelines-primary)]">Back to {breadcrumbLabel}</Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  const activeTabKey = stateTab || deriveTabKey(guide)
  const breadcrumbLabel = TAB_LABELS[activeTabKey]
  const fallbackHref = activeTabKey !== 'guidelines' ? `/marketplace/guides?tab=${activeTabKey}` : '/marketplace/guides'
  const backHref = backQuery ? initialBackHref : fallbackHref

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow guide-detail max-w-7xl" role="main">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
            <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to={backHref} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">{breadcrumbLabel}</Link></div></li>
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

        {/* Header - Course-style format */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            {/* Title with icon + top-right CTA */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">G</span>
                </div>
                <h1 id="guide-title" className="text-2xl md:text-3xl font-bold text-gray-900">
                  {guide.title}
                </h1>
              </div>
              {isBlueprintDomain && (
                <a
                  href={primaryDocUrl || '#templates'}
                  target={primaryDocUrl ? '_blank' : undefined}
                  rel={primaryDocUrl ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full self-start text-sm font-semibold text-white bg-[var(--guidelines-primary-solid)] hover:bg-[var(--guidelines-primary-solid-hover)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
                >
                  <span>View Blueprint</span>
                  <ExternalLink size={16} className="opacity-90" />
                </a>
              )}
              {isGuidelinesDomain && (
                <a
                  href={primaryDocUrl || '#'}
                  target={primaryDocUrl && primaryDocUrl !== '#' ? '_blank' : undefined}
                  rel={primaryDocUrl && primaryDocUrl !== '#' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full self-start text-sm font-semibold text-white bg-[var(--guidelines-primary-solid)] hover:bg-[var(--guidelines-primary-solid-hover)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
                >
                  <span>View Guideline</span>
                  <ExternalLink size={16} className="opacity-90" />
                </a>
              )}
              {isStrategyDomain && (
                <a
                  href={primaryDocUrl || '#'}
                  target={primaryDocUrl && primaryDocUrl !== '#' ? '_blank' : undefined}
                  rel={primaryDocUrl && primaryDocUrl !== '#' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full self-start text-sm font-semibold text-white bg-[var(--guidelines-primary-solid)] hover:bg-[var(--guidelines-primary-solid-hover)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
                >
                  <span>View Strategy</span>
                  <ExternalLink size={16} className="opacity-90" />
                </a>
              )}
              {isTestimonialsDomain && (
                <a
                  href={primaryDocUrl || '#'}
                  target={primaryDocUrl && primaryDocUrl !== '#' ? '_blank' : undefined}
                  rel={primaryDocUrl && primaryDocUrl !== '#' ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full self-start text-sm font-semibold text-white bg-[var(--guidelines-primary-solid)] hover:bg-[var(--guidelines-primary-solid-hover)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
                >
                  <span>View Testimonial</span>
                  <ExternalLink size={16} className="opacity-90" />
                </a>
              )}
            </div>
            
            {/* Tags + View Blueprint (Blueprints) */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {guide.domain && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {guide.domain}
                  </span>
                )}
                {guide.guideType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                    {guide.guideType}
                  </span>
                )}
                {guide.functionArea && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                    {guide.functionArea}
                  </span>
                )}
                {guide.complexityLevel && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-100">
                    {guide.complexityLevel}
                  </span>
                )}
                {isTestimonialsDomain && guide.unit && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-100">
                    {guide.unit}
                  </span>
                )}
                {isTestimonialsDomain && guide.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-50 text-pink-700 border border-pink-100">
                    {guide.location}
                  </span>
                )}
              </div>
            </div>
            
            
            {/* Description */}
            {guide.summary && (
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                {guide.summary}
              </p>
            )}
          </div>
        </div>

        {/* Overview block (shown separately when present) */}
        {hasOverviewSection && overviewSection && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <article
                ref={articleRef}
                className="markdown-body"
                dir={typeof document !== 'undefined' ? (document.documentElement.getAttribute('dir') || 'ltr') : 'ltr'}
              >
                <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                  <Markdown body={transformKeyHighlightsInOverview(overviewSection.content)} />
                </React.Suspense>
              </article>
            </div>
          </div>
        )}

        {/* Tab Navigation for content sections */}
        {hasTabsEffective && sectionsForTabs && (
          <div className="bg-white rounded-lg shadow mb-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Content tabs">
                {sectionsForTabs.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveContentTab(section.id)}
                    className={`px-0 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeContentTab === section.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    aria-selected={activeContentTab === section.id}
                    role="tab"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-8">
              {sectionsForTabs.map((section) => (
                <div
                  key={section.id}
                  className={activeContentTab === section.id ? '' : 'hidden'}
                  role="tabpanel"
                  aria-labelledby={`tab-${section.id}`}
                >
                  <article
                    ref={articleRef}
                    className="markdown-body"
                    dir={typeof document !== 'undefined' ? (document.documentElement.getAttribute('dir') || 'ltr') : 'ltr'}
                  >
                    <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                      <Markdown body={formatSectionContent(section)} />
                    </React.Suspense>
                  </article>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* CODEx: Document preview placed before summary */}
            {(isPolicy && isPreviewableDocument && !previewUnavailable && hasDocument) && (
              <DocumentPreview
                documentUrl={guide.documentUrl}
                title={guide.title}
                onOpen={() => {
                  track('Guides.CTA', { category: 'policy_preview_open_clicked', policyId: guide.slug || guide.id, title: guide.title })
                  openMainDocument()
                }}
                onUnavailable={() => setPreviewUnavailable(true)}
              />
            )}

            {/* CODEx: Concise Summary card for policy pages only - hidden when tabs are present */}
            {isPolicy && (derivedSummary || guide.summary) && !hasTabsEffective && (
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

            {/* CODEx: For policy pages, long body behind a toggle; for others, show as usual */}
            {type !== 'template' && guide.body && !hasTabsEffective && (
              <article
                id={isPolicy ? 'full-details' : undefined}
                ref={articleRef}
                className={`bg-white rounded-lg shadow p-6 markdown-body ${isPolicy && !showFullDetails ? 'hidden' : ''}`}
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

          {/* Sidebar: Related Guides */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24" aria-label="Secondary">
            {related && related.length > 0 && (
              <section aria-labelledby="related-title" className="bg-white rounded-lg shadow p-6" id="related">
                <h2 id="related-title" className="text-xl font-semibold mb-4">Related Guides</h2>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug || r.id}
                      to={`/marketplace/guides/${encodeURIComponent(r.slug || r.id)}`}
                      className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
                      onClick={() => track('Guides.RelatedClick', { from: guide.slug || guide.id, to: r.slug || r.id })}
                    >
                      <div className="flex gap-3">
                        <img
                          src={getGuideImageUrl({ heroImageUrl: r.heroImageUrl || undefined, domain: r.domain || undefined, guideType: r.guideType || undefined })}
                          alt={r.title}
                          className="w-20 h-20 object-cover rounded"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate" title={r.title}>{r.title}</div>
                          {r.summary && <div className="text-sm text-gray-600 line-clamp-2">{r.summary}</div>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </section>

        <div className="mt-6 text-right">
          <Link to={backHref} className="text-[var(--guidelines-primary)]">Back to {breadcrumbLabel}</Link>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuideDetailPage
