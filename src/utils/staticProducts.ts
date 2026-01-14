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
    id: 'static-product-dto4t',
    title: 'DTO4T - Digital Twin of Organization for Transformation',
    summary: 'An AI-driven digital twin that accelerates transformation through simulated journeys and blueprinting.',
    domain: 'Product',
    guideType: 'Marketplace',
    heroImageUrl: '/images/DTO4T.jpg',
    lastUpdatedAt: new Date().toISOString(),
    authorName: null,
    authorOrg: null,
    isEditorsPick: true,
    downloadCount: 0,
    status: 'Approved',
    slug: 'dto4t-digital-twin-of-organization-for-transformation',
    productType: 'DTO4T',
    productStage: 'Pilot'
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
    title: 'DTMB',
    summary: 'A Digital Transformation Management resource line. Detailed description to follow.',
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
