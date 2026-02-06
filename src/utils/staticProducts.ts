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
    id: 'static-product-dtmp',
    title: 'DTMP - Digital Transformation Management Platform',
    summary: 'A centralized platform to manage transformation data, processes, and analytics in one governed system.',
    domain: 'Product',
    guideType: 'Marketplace',
    heroImageUrl: '/images/DTMP.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtmp-digital-transformation-management-platform',
    productType: 'DTMP',
    productStage: 'MVP'
  },
  {
    id: 'static-product-plant40',
    title: 'Plant 4.0',
    summary: 'Revolutionizing industrial operations with real-time data, smart automation, and unmatched efficiency!',
    domain: 'Product',
    guideType: 'Marketplace',
    heroImageUrl: '/images/plant4.0.png',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'plant-4-0',
    productType: 'Plant 4.0',
    productStage: 'Live'
  },
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
  },
  {
    id: 'static-product-dtma',
    title: 'DTMA - Digital Transformation Management Academy',
    summary: 'An academy that upskills teams with tailored training, certifications, and AI-enabled learning paths.',
    domain: 'Product',
    guideType: 'Marketplace',
    heroImageUrl: '/images/DTMA.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtma-digital-transformation-management-academy',
    productType: 'DTMA',
    productStage: 'Live'
  },
  {
    id: 'static-product-dtmb',
    title: 'DTMB - Digital Transformation Management Boost',
    summary: 'A resource line of boosts, playbooks, and reference material to accelerate DT management.',
    domain: 'Product',
    guideType: 'Marketplace',
    heroImageUrl: '/images/DTMB.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: false,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtmb',
    productType: 'DTMB',
    productStage: 'Preview'
  },
  {
    id: 'static-product-dtmi',
    title: 'DTMI',
    summary: 'A Digital Transformation Management initiative. Detailed description to follow.',
    domain: 'Product',
    guideType: 'Marketplace',
    heroImageUrl: '/images/DTMI.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: false,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dtmi',
    productType: 'DTMI',
    productStage: 'Preview'
  }
]
