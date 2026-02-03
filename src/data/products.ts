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
    name: 'TMaaS: The Smarter Way to Execute Digital Transformation',
    tagline: 'AI-powered, self-service marketplace that turns transformation into an on-demand, architecture-led capability.',
    description: 'TMaaS makes transformation faster, lower cost, and adaptive - helping organizations succeed in a world where change never stops.',
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
        id: 'introduction-why-transformations-fail',
        title: 'Introduction: Why Most Digital Transformations Fail Before They Begin',
        body: [
          'HIGHLIGHT:The Challenge: Digital transformation is accelerating faster than most organizations can adapt. Customer expectations evolve in months, technology cycles shift in weeks, and business priorities change overnight.',
          '',
          'PROBLEM:The Problem: Most transformation programs are still delivered through slow, rigid, and expensive models - built for a world that no longer exists. Organizations invest millions in initiatives that:',
          'LIST_START',
          'Take years to deliver measurable value',
          'Lock teams into fixed scopes and inflexible timelines',
          'Stall when priorities inevitably change',
          'Struggle under complexity and governance overhead',
          'LIST_END',
          '',
          'CONSEQUENCE:The Consequence: A growing gap between what needs to change and how quickly it can happen - leading to wasted investment, frustrated teams, and missed opportunities.',
          '',
          'KEY_INSIGHT:Key Insight: This is not just a technology challenge. It\'s a transformation management problem. Organizations need a smarter, faster, and adaptive way to transform. One that is modular, AI-powered, low-risk, and designed for continuous evolution. That solution is TMaaS.'
        ]
      },
      {
        id: 'tmaas-transformation-reimagined',
        title: 'TMaaS: Transformation Reimagined as a Service',
        body: [
          'HIGHLIGHT:Why TMaaS? TMaaS is a self-service, AI-powered marketplace where organizations can design, deploy, and manage digital transformation initiatives on demand. TMaaS isn\'t consulting repackaged - it is transformation productized.',
          '',
          'FEATURES:Features:',
          'LIST_START',
          'Modular and Flexible: Deploy only what your organization needs',
          'Architecture-led: Ensures transformation is structured and scalable',
          'AI-powered: Provides guidance, recommendations, and insights throughout the journey',
          'LIST_END',
          '',
          'TMaaS makes transformation accessible, low-risk, and scalable.'
        ]
      },
      {
        id: 'strategy-to-execution-marketplace',
        title: 'From Strategy to Execution - All in One Marketplace',
        body: [
          'CAPABILITIES:Marketplace Capabilities:',
          'LIST_START',
          'Explore and select transformation services',
          'Customize and deploy initiatives without heavy contracts',
          'Monitor progress and track impact in real time',
          'LIST_END',
          '',
          'DELIVERS:What the Marketplace Delivers:',
          'LIST_START',
          'Architecture-led transformation services',
          'Data-driven, best-practice-based initiatives',
          'Strategy, Digital, Transformation, and Management Office services',
          'Ready-to-launch services that accelerate time to value',
          'LIST_END',
          '',
          'TMaaS transforms a complex, multi-step process into a streamlined, user-friendly experience.'
        ]
      },
      {
        id: 'structured-service-architecture',
        title: 'Structured for Clarity: TMaaS Service Architecture',
        body: [
          'ARCHITECTURE:TMaaS organizes services hierarchically to provide precision and choice:',
          'LIST_START',
          'Canvas Domains (12): High-level areas covering the full scope of digital transformation',
          'Master Initiatives (56): Strategic initiatives translating ambition into actionable plans',
          'Initiative Packages (267): Ready-to-launch solutions made up of 950+ use cases',
          'LIST_END',
          '',
          'USAGE:How Organizations Can Use It:',
          'LIST_START',
          'Buy complete packages',
          'Customize individual use cases',
          'Combine initiatives as priorities evolve',
          'LIST_END',
          '',
          'This structure removes ambiguity, replaces guesswork with control, and allows transformation at any scale.'
        ]
      },
      {
        id: 'ai-guidance-and-execution',
        title: 'AI That Guides, Advises, and Executes',
        body: [
          'AI_PERSONAS:Three AI Advisory Personas:',
          'LIST_START',
          'Functional Advisory Coach: Expert guidance tailored to your organization\'s transformation needs',
          'Ready Guiding Concierge: Contextual recommendations for precise decision-making',
          'Transacting Personal Assistant: Streamlines service selection, purchasing, and deployment',
          'LIST_END',
          '',
          'KEY_INSIGHT:Intelligent Service Curation: AI continuously analyzes requirements documents, business priorities, and organizational context. It recommends optimized transformation packages and continuously refines them as needs evolve.'
        ]
      },
      {
        id: 'flexible-engagement-models',
        title: 'Flexible Engagement Models',
        body: [
          'MODELS:Choose the engagement model that fits your needs:',
          'LIST_START',
          'Freemium: Low-risk entry with guided assessments and learning resources',
          'Per-Project: Scoped initiatives with defined outcomes and timelines',
          'Framework Agreement (Pay-as-you-go): Multi-year flexibility with on-demand access',
          'LIST_END',
          '',
          'Organizations can start small, scale as priorities grow, and only pay for what they need.'
        ]
      },
      {
        id: 'designed-for-impact',
        title: 'Designed for Impact: Faster Results, Lower Risk',
        body: [
          'RESULTS:TMaaS delivers measurable outcomes:',
          'LIST_START',
          'Low-cost entry points: Services starting from ~$30K',
          'Time to value: See results in as little as 2 months',
          'Higher success rates: Through focused execution and governance',
          'Adaptability: Shift initiatives as priorities evolve',
          'LIST_END',
          '',
          'KEY_INSIGHT:TMaaS makes transformation a continuous, repeatable capability, not a one-off program.'
        ]
      },
      {
        id: 'why-tmaas-is-different',
        title: 'Why TMaaS Is Different',
        body: [
          'DIFFERENTIATORS:TMaaS stands apart from traditional approaches:',
          'LIST_START',
          'Productizes transformation into modular, scalable services',
          'Combines architecture, AI, and execution discipline',
          'Replaces rigid programs with adaptive delivery',
          'Enables organizations to transform at their own pace',
          'LIST_END',
          '',
          'KEY_INSIGHT:TMaaS is not just a platform - it is a new operating model for digital transformation.'
        ]
      },
      {
        id: 'start-transformation-today',
        title: 'Start Your Transformation Today',
        body: [
          'QUESTION:TMaaS changes the question from: "Can we afford to transform?" to "Why wouldn\'t we?"',
          '',
          'Whether initiating transformation, accelerating stalled programs, or adapting to evolving priorities, TMaaS gives organizations the structure, intelligence, and flexibility to succeed in Digital Economy 4.0.',
          '',
          'CTA:Start small. Scale confidently. Transform intelligently.'
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
    name: 'DTMB - Digital Transformation Management Boost',
    tagline: 'Boost kits, references, and playbooks for DT management.',
    description: 'A resource line of boosts, playbooks, and reference material to accelerate digital transformation management.',
    productType: 'DTMB',
    productStage: 'Preview',
    whatItIs: 'A set of resources that complement DTMA/DTMP with reference material.',
    whyItMatters: 'Provides supporting material for teams adopting transformation practices.',
    includes: ['Reference guides', 'Templates', 'Reading lists'],
    usedIn: ['Training', 'Enablement', 'Self-paced learning'],
    imageUrl: '/images/DTMB.jpg'
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
