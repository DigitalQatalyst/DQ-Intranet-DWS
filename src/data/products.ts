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
  },
  'dtmp-digital-transformation-management-platform': {
    slug: 'dtmp-digital-transformation-management-platform',
    name: 'DTMP - Digital Transformation Management Platform',
    tagline: 'Centralize transformation data, processes, and analytics in one governed platform.',
    description: 'Creates a seamless digital ecosystem with a centralized platform to manage data, processes, and analytics.',
    productType: 'DTMP',
    productStage: 'MVP',
    whatItIs: 'A single platform that unifies data storage, workflow orchestration, and analytics for transformation programs.',
    whyItMatters: 'It provides one source of truth, improves governance, and reduces the cost of fragmented tooling during transformation.',
    includes: [
      'Robust data storage',
      'Process orchestration and automation',
      'Analytics and dashboards',
      'Governed data access'
    ],
    usedIn: [
      'Program governance and reporting',
      'Digital operations and runbooks',
      'Data-driven decision support'
    ],
    imageUrl: '/images/DTMP.jpg',
    overview: 'DTMP creates a seamless digital ecosystem with a centralized platform to manage data, processes, and analytics.',
    purposeAndValue: 'It keeps leadership aligned on outcomes, accelerates decision-making, and standardizes execution across teams.',
    scopeAndCapabilities: [
      'Centralized data storage to keep organizational data secure and accessible.',
      'AI-backed analytics to generate insights and track outcomes.',
      'Workflow automation and orchestration for transformation workstreams.',
      'Dashboards that provide real-time visibility into KPIs and risks.'
    ],
    howItsUsed: {
      internal: [
        'Run transformation portfolio governance from a single control center.',
        'Standardize delivery playbooks across squads and functions.'
      ],
      delivery: [
        'Deploy program templates and dashboards on new client engagements.',
        'Automate reporting to reduce manual status work.'
      ],
      client: [
        'Offer the platform as a managed environment for client transformation offices.',
        'Provide real-time visibility to client sponsors through secure dashboards.'
      ]
    }
  },
  'dto4t-digital-twin-of-organization-for-transformation': {
    slug: 'dto4t-digital-twin-of-organization-for-transformation',
    name: 'DTO4T - Digital Twin of Organization for Transformation',
    tagline: 'Use digital twins and AI simulations to accelerate transformation choices.',
    description: 'An AI-driven platform for accelerating digital transformation by creating digital twins of organizations.',
    productType: 'DTO4T',
    productStage: 'Pilot',
    whatItIs: 'A digital twin environment that models the organization, tests scenarios, and guides change sequencing.',
    whyItMatters: 'It lets teams experiment safely, reduce risk, and choose the fastest path before committing to delivery.',
    includes: [
      'AI-driven acceleration and simulation',
      'Agile transformation approach',
      'Digital blueprint library'
    ],
    usedIn: [
      'Scenario planning and prioritization',
      'Operating model and process redesign',
      'Risk simulation before delivery'
    ],
    imageUrl: '/images/DTO4T.jpg',
    overview: 'DTO4T is an AI-driven platform for accelerating digital transformation by creating digital twins of organizations.',
    purposeAndValue: 'It shortens decision cycles and helps leadership pick the highest-value paths with evidence.',
    scopeAndCapabilities: [
      'AI-driven acceleration that automates exploration of transformation options.',
      'Agile playbooks that let teams scale or pivot as results come in.',
      'Digital blueprints that provide a clear roadmap for transformation.'
    ],
    howItsUsed: {
      internal: [
        'Model current-state processes and pain points without disrupting live operations.',
        'Test transformation packages virtually before funding them.'
      ],
      delivery: [
        'Co-design transformation with clients using shared simulations.',
        'Validate scale-up plans using digital twin experiments.'
      ],
      client: [
        'Show clients outcome projections with data-backed scenarios.',
        'Provide an interactive roadmap that adapts as assumptions change.'
      ]
    }
  },
  'dtma-digital-transformation-management-academy': {
    slug: 'dtma-digital-transformation-management-academy',
    name: 'DTMA - Digital Transformation Management Academy',
    tagline: 'Upskill teams with tailored training to become digital leaders.',
    description: 'An academy that upskills teams with tailored training, certifications, and innovative tools.',
    productType: 'DTMA',
    productStage: 'Live',
    whatItIs: 'A training academy offering role-based paths, labs, and certifications for transformation practitioners.',
    whyItMatters: 'It builds internal capacity so transformation sticks beyond initial delivery.',
    includes: [
      'Specialized training for every level',
      'AI-enabled learning tools',
      'Certification and coaching tracks'
    ],
    usedIn: [
      'Internal capability building',
      'Client enablement and onboarding',
      'Partner and delivery readiness'
    ],
    imageUrl: '/images/DTMA.jpg',
    overview: 'DTMA is designed to upskill teams with tailored training to become digital leaders with expertise, certifications, and innovative tools.',
    purposeAndValue: 'Teams learn consistent methods, tools, and mindsets, reducing delivery risk and improving adoption.',
    scopeAndCapabilities: [
      'Role-based learning paths and credentials.',
      'Hands-on labs with AI-assisted exercises.',
      'Coaching and playbooks aligned to DQ products.'
    ],
    howItsUsed: {
      internal: [
        'Onboard new practitioners onto DT2.0 and TMaaS methods.',
        'Keep squads current on tools and delivery standards.'
      ],
      delivery: [
        'Bundle training with platform rollouts to accelerate adoption.',
        'Provide client teams with certification-led change enablement.'
      ],
      client: [
        'Offer curated curricula for client sponsors and delivery teams.',
        'Provide ongoing coaching hours tied to transformation milestones.'
      ]
    }
  },
  'dtmb': {
    slug: 'dtmb',
    name: 'DTMB',
    tagline: 'Digital Transformation Management Books and resources.',
    description: 'A resource line supporting digital transformation management with curated materials.',
    productType: 'DTMB',
    productStage: 'Preview',
    whatItIs: 'A set of resources that complement DTMA/DTMP with reference material.',
    whyItMatters: 'Provides supporting material for teams adopting transformation practices.',
    includes: ['Reference guides', 'Templates', 'Reading lists'],
    usedIn: ['Training', 'Enablement', 'Self-paced learning'],
    imageUrl: '/images/DTMB.jpg'
  },
  'dtmcc': {
    slug: 'dtmcc',
    name: 'DTMCC',
    tagline: 'Digital Transformation Management capability component.',
    description: 'An emerging capability within the Digital Transformation Management suite.',
    productType: 'DTMCC',
    productStage: 'Preview',
    whatItIs: 'A capability module aligned to the DT2.0 product family.',
    whyItMatters: 'Extends the product line with specialized functionality.',
    includes: ['Capability definitions', 'Operating guidance'],
    usedIn: ['Capability rollout', 'Internal enablement'],
    imageUrl: '/images/DTMCC.jpg'
  },
  'dtmi': {
    slug: 'dtmi',
    name: 'DTMI',
    tagline: 'Digital Transformation Management initiative.',
    description: 'An initiative within the DT product line; details to follow.',
    productType: 'DTMI',
    productStage: 'Preview',
    whatItIs: 'A DT management initiative under development.',
    whyItMatters: 'Expands coverage of transformation execution patterns.',
    includes: ['Initial playbooks', 'Guiding principles'],
    usedIn: ['Pilot programs', 'Internal adoption'],
    imageUrl: '/images/DTMI.jpg'
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
