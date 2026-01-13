// Product detail data for Product Details pages
// Each product includes comprehensive information for the detail view

export interface ProductDetail {
  slug: string
  name: string
  tagline: string
  description: string
  productType: string
  productStage: string
  whatItIs: string
  whyItMatters: string
  includes: string[]
  usedIn: string[]
  imageUrl?: string
  documentSections?: Array<{
    id: string
    title: string
    body: string[]
  }>
  // Enhanced content sections
  overview?: string
  purposeAndValue?: string
  scopeAndCapabilities?: string[]
  howItsUsed?: {
    internal?: string[]
    delivery?: string[]
    client?: string[]
  }
  governanceAndOwnership?: string
  relatedAssets?: Array<{
    type: 'guideline' | 'knowledge' | 'platform' | 'learning'
    title: string
    url: string
  }>
}

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  'tmaas-transformation-management-as-a-service': {
    slug: 'tmaas-transformation-management-as-a-service',
    name: 'TMaaS - Transformation Management as a Service',
    tagline: 'Start transformation with a single, low-risk step and scale as results prove value.',
    description: 'A self-service platform that lets organizations design, launch, and scale digital transformation through modular, on-demand initiatives.',
    productType: 'TMaaS',
    productStage: 'MVP',
    whatItIs: 'A self-service platform that allows organizations to execute digital transformation as an on-demand capability.',
    whyItMatters: 'It removes the need for large, inflexible programs by letting organizations start small, prove value quickly, and expand transformation only when results are real.',
    includes: [
      'Transformation leadership',
      'Governance and oversight',
      'Execution support',
      'Platform access',
      'Continuous improvement'
    ],
    usedIn: [
      'Client transformation services',
      'Managed transformation programs',
      'Ongoing transformation support',
      'Platform-as-a-service offerings'
    ],
    imageUrl: '/images/tmaas.jpg',
    documentSections: [
      {
        id: 'story-of-tmaas',
        title: 'The story of TMaaS',
        body: [
          'Imagine an organization that knows it must transform but cannot afford to get it wrong.',
          'Leadership agrees on the need for digital transformation, but not on the scope. Some teams want to modernize platforms. Others want better data. Budgets are limited. Priorities keep shifting. Every option on the table feels expensive, slow, and irreversible.',
          'This is where most transformation efforts stall. TMaaS was built for this exact moment.',
          'Instead of forcing organizations into a single, all-or-nothing program, TMaaS allows transformation to begin with a single, focused step and then evolve as results become visible.'
        ]
      },
      {
        id: 'what-is-this-product',
        title: 'What is this product?',
        body: [
          'TMaaS is a self-service platform that allows organizations to execute digital transformation as an on-demand capability.',
          'Organizations use TMaaS to select, design, and deploy transformation initiatives when they need them, rather than committing upfront to large, multi-year programs. Each initiative is delivered through ready-to-use packages that can be adopted individually or combined as priorities change.',
          'Transformation becomes actionable, selectable, and repeatable - not a long-term gamble.'
        ]
      },
      {
        id: 'why-does-this-exist',
        title: 'Why does this product exist?',
        body: [
          'Organizations no longer operate in fixed cycles. Strategy shifts. Markets evolve. Technology moves fast.',
          'Yet transformation is still delivered through rigid plans that assume stability. By the time results appear, the original assumptions are already outdated, leading to cost overruns, slow progress, and disappointing outcomes. TMaaS exists to align transformation with how organizations actually operate today. It enables transformation to move incrementally, continuously, and adaptively, while remaining structured and architecture-led.'
        ]
      },
      {
        id: 'what-problem-does-it-solve',
        title: 'What problem does it solve?',
        body: [
          'Without TMaaS, organizations face a painful choice.',
          'They either commit to a large, high-risk transformation program and hope it delivers, or delay transformation altogether because the risk feels too high and the path forward unclear.',
          'TMaaS removes this choice entirely. By breaking transformation into modular initiatives, organizations can start small, focus on immediate priorities, and adjust as they learn. Progress becomes visible early. Risk is reduced. Transformation stops being an all-or-nothing decision.'
        ]
      },
      {
        id: 'what-value-does-it-create',
        title: 'What value does it create?',
        body: [
          'TMaaS changes how transformation is experienced and funded.',
          'Organizations begin with a low commercial commitment, scaling only when value is proven. Focused initiatives deliver outcomes in weeks rather than years. As priorities change, execution adapts - increasing success rates and reducing waste.',
          'Transformation becomes a controlled, progressive investment, not a single high-stakes bet.'
        ]
      },
      {
        id: 'what-exactly-does-it-offer',
        title: 'What exactly does this product offer?',
        body: [
          'TMaaS provides a structured marketplace of transformation services, designed to be used when and where they are needed.',
          'Organizations gain access to strategy, transformation, digital, and management office services through clearly defined initiative packages. These packages are organized across domains, initiatives, and use cases, making selection and customization straightforward.',
          'AI-supported guidance helps organizations choose the right initiatives and refine them over time. A single platform supports design, deployment, and tracking - keeping transformation execution visible, measurable, and manageable.',
          'Rather than promising transformation in theory, TMaaS delivers practical building blocks that organizations can deploy immediately.'
        ]
      },
      {
        id: 'tmaas-in-one-sentence',
        title: 'TMaaS in one clear sentence',
        body: [
          'TMaaS enables organizations to start digital transformation with confidence, execute it incrementally, and scale it only when results are real.'
        ]
      }
    ]
  }
}

// Helper function to get product by slug
export function getProductBySlug(slug: string): ProductDetail | null {
  return PRODUCT_DETAILS[slug] || null
}

// Get all product slugs
export function getAllProductSlugs(): string[] {
  return Object.keys(PRODUCT_DETAILS)
}
