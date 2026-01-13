// Static product data for the Products tab
// These products are always displayed in the Products marketplace tab

export interface StaticProduct {
  id: string
  title: string
  summary: string
  domain: string
  guideType: string
  heroImageUrl: string | null
  lastUpdatedAt: string
  authorName: string | null
  authorOrg: string | null
  isEditorsPick: boolean
  downloadCount: number
  status: string
  slug: string
  // Product-specific metadata
  productType: string
  productStage: string
}

export const STATIC_PRODUCTS: StaticProduct[] = [
  {
    id: 'static-product-tmaas',
    title: 'TMaaS - Transformation Management as a Service',
    summary: 'A self-service platform that lets organizations design, launch, and scale digital transformation through modular, on-demand initiatives.',
    domain: 'Product',
    guideType: 'Marketplace',
    heroImageUrl: '/images/tmaas.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'tmaas-transformation-management-as-a-service',
    productType: 'TMaaS',
    productStage: 'MVP'
  }
]
