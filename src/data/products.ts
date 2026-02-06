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
    description: 'An automated, architecture-led, data-driven platform that centralizes and accelerates digital transformation initiatives.',
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
    },
    documentSections: [
      {
        id: 'introduction-why-transformation-struggles',
        title: 'Introduction: Why Digital Transformation Struggles to Deliver',
        body: [
          'Organizations are investing heavily in digital transformation. Budgets continue to grow, initiatives multiply across business units, and expectations for measurable impact are higher than ever.',
          '',
          'Yet outcomes remain inconsistent.',
          '',
          'Despite significant effort, many transformation programs fail to deliver sustained value. This is not due to a lack of ambition or technology, but because transformation is often executed without a unifying management backbone.',
          '',
          'PROBLEM:Common challenges include:',
          'LIST_START',
          'Disconnected tools, teams, and delivery models',
          'No single source of truth for transformation data',
          'Limited visibility into progress, dependencies, and impact',
          'Inability to adapt when priorities inevitably change',
          'Long timelines before tangible value is realized',
          'LIST_END',
          '',
          'CONSEQUENCE:As a result, organizations experience a familiar pattern:',
          '',
          'HIGHLIGHT:High investment. Low visibility. Limited return.',
          '',
          'This is not a strategy problem. It is a transformation management problem.'
        ]
      },
      {
        id: 'market-gap-dtmp-addresses',
        title: 'The Market Gap DTMP Addresses',
        body: [
          'Digital transformation priorities are no longer static. Market conditions shift rapidly, regulatory environments evolve, technologies mature at speed, and business strategies are continuously refined.',
          '',
          'However, most organizations still manage transformation using approaches designed for static, linear programs.',
          '',
          'PROBLEM:Transformation efforts are commonly supported by:',
          'LIST_START',
          'Spreadsheets and static documents',
          'Disconnected enterprise architecture repositories',
          'Standalone analytics and reporting tools',
          'Manual governance, reviews, and status reporting',
          'LIST_END',
          '',
          'These tools were never designed to manage transformation as a living, evolving system.',
          '',
          'What is missing is a dedicated, end-to-end platform that enables organizations to:',
          'LIST_START',
          'Design transformation with architectural discipline',
          'Execute initiatives with data-driven control',
          'Monitor progress and impact in real time',
          'Adapt continuously as priorities change',
          'LIST_END',
          '',
          'KEY_INSIGHT:DTMP exists to close this gap.'
        ]
      },
      {
        id: 'what-is-dtmp',
        title: 'What Is DTMP?',
        body: [
          'HIGHLIGHT:DTMP (Digital Transformation Management Platform) is an automated, architecture-led, data-driven platform that centralizes and accelerates digital transformation initiatives.',
          '',
          'DTMP brings together transformation design, execution, monitoring, and governance into a single, unified environment. It replaces fragmented tools and manual coordination with a structured, intelligent platform purpose-built for transformation management.',
          '',
          'DTMP is not a project management tool. It is not a document repository. It is not a reporting add-on.',
          '',
          'KEY_INSIGHT:DTMP is a dedicated platform for managing digital transformation as a continuous organizational capability.'
        ]
      },
      {
        id: 'dtmp-value-proposition',
        title: 'The DTMP Value Proposition',
        body: [
          'DTMP is built around three foundational principles that directly address the root causes of transformation failure.',
          '',
          'HIGHLIGHT:Architecture-Led',
          'Transformation initiatives are grounded in enterprise architecture, ensuring that change is intentional, structured, and scalable.',
          '',
          'This enables organizations to:',
          'LIST_START',
          'Maintain alignment between strategy, business, and technology',
          'Understand dependencies and impacts before execution',
          'Avoid fragmented or conflicting initiatives',
          'LIST_END',
          '',
          'HIGHLIGHT:Data-Driven',
          'DTMP places data at the center of transformation decision-making.',
          '',
          'Through real-time analytics and dashboards, organizations can:',
          'LIST_START',
          'Track progress across initiatives and domains',
          'Measure value realization and performance',
          'Identify risks, delays, and bottlenecks early',
          'LIST_END',
          '',
          'Decisions are driven by evidence, not assumptions.',
          '',
          'HIGHLIGHT:Best-Practice-Based',
          'DTMP embeds proven frameworks, methods, and transformation patterns.',
          '',
          'This reduces reliance on ad-hoc approaches and enables:',
          'LIST_START',
          'Faster initiation of initiatives',
          'More consistent execution',
          'Reduced delivery risk',
          'LIST_END',
          '',
          'KEY_INSIGHT:Together, these principles provide clarity, control, and confidence across the transformation lifecycle.'
        ]
      },
      {
        id: 'what-dtmp-delivers',
        title: 'What DTMP Delivers',
        body: [
          'DTMP enables organizations to move from fragmented execution to coordinated transformation.',
          '',
          'FEATURES:Key outcomes include:',
          'LIST_START',
          'A single source of truth for all transformation data and artefacts',
          'Unified visibility across initiatives, domains, and stakeholders',
          'Faster time to value through focused, structured execution',
          'Built-in adaptability as priorities, scope, or demand change',
          'Reduced cost and complexity compared to traditional transformation programs',
          'LIST_END',
          '',
          'KEY_INSIGHT:Transformation becomes measurable, manageable, and scalable—not opaque and reactive.'
        ]
      },
      {
        id: 'core-platform-components',
        title: 'Core Platform Components',
        body: [
          'DTMP is composed of tightly integrated core components, supported by extensible capabilities that evolve with organizational needs.',
          '',
          'HIGHLIGHT:Central Transformation Repository',
          'A unified repository (Ardoq, ABACUS, Orbus, Neo4J) that stores transformation frameworks, architectures, artefacts, and relationships.',
          '',
          'This repository:',
          'LIST_START',
          'Acts as the authoritative source of transformation truth',
          'Enables reuse and consistency across initiatives',
          'Supports impact analysis and traceability',
          'LIST_END',
          '',
          'HIGHLIGHT:Transformation Portal',
          'A centralized portal (SharePoint / React-based) that provides a single access point to transformation assets and activities.',
          '',
          'The portal enables:',
          'LIST_START',
          'Stakeholder access and collaboration',
          'Structured workflows and service requests',
          'Consistent user experience across transformation efforts',
          'LIST_END',
          '',
          'HIGHLIGHT:Transformation Analytics',
          'Power BI–driven dashboards deliver real-time insight into transformation performance.',
          '',
          'Analytics support:',
          'LIST_START',
          'Progress and milestone tracking',
          'KPI and outcome measurement',
          'Risk, dependency, and impact visibility',
          'LIST_END',
          '',
          'HIGHLIGHT:DocWriter',
          'Automated, architecture-driven document generation using Power BI Report Builder and AI.',
          '',
          'DocWriter enables:',
          'LIST_START',
          'Automated production of specifications and reports',
          'Consistent, up-to-date documentation',
          'Reduced manual effort and rework',
          'LIST_END',
          '',
          'HIGHLIGHT:Extensions & Integrations',
          'DTMP integrates with existing enterprise tools, including:',
          'LIST_START',
          'Collaboration (Microsoft Teams)',
          'Lifecycle management (Azure DevOps)',
          'Compliance and assurance tools',
          'Surveys and feedback mechanisms',
          'AI-powered extensions',
          'LIST_END'
        ]
      },
      {
        id: 'practical-business-impact',
        title: 'Practical Business Impact',
        body: [
          'DTMP is designed to deliver practical, observable impact, not theoretical maturity models.',
          '',
          'FEATURES:Organizations using DTMP achieve:',
          'LIST_START',
          'Lower transformation costs through productized, tiered access',
          'Reduced time to value, with results visible in as little as two months',
          'Higher success rates, driven by continuous, data-driven governance',
          'Greater adaptability, allowing initiatives to evolve without restarting',
          'LIST_END',
          '',
          'KEY_INSIGHT:Transformation moves faster, with less risk and greater confidence.'
        ]
      },
      {
        id: 'ai-at-core-of-dtmp',
        title: 'AI at the Core of DTMP',
        body: [
          'AI enhances DTMP\'s ability to manage transformation intelligently and proactively.',
          '',
          'FEATURES:AI-powered capabilities include:',
          'LIST_START',
          'Performance analytics and anomaly detection',
          'Recommendation engines for informed decision-making',
          'Automated compliance and risk monitoring',
          'Intelligent, data-driven document generation',
          'LIST_END',
          '',
          'KEY_INSIGHT:AI turns transformation data into actionable insight, enabling organizations to anticipate issues rather than react to them.'
        ]
      },
      {
        id: 'start-managing-transformation-differently',
        title: 'Start Managing Transformation Differently',
        body: [
          'DTMP changes the question from: "How do we manage all these transformation initiatives?" to "How do we make transformation measurable, adaptive, and repeatable?"',
          '',
          'Whether launching new initiatives, consolidating fragmented efforts, or scaling transformation across the organization, DTMP provides the structure, intelligence, and automation required to succeed in the digital economy.',
          '',
          'Centralize transformation.',
          'See clearly.',
          'Execute with confidence.',
          '',
          'KEY_INSIGHT:Transform how you transform.'
        ]
      }
    ]
  },
  'dtma-digital-transformation-management-academy': {
    slug: 'dtma-digital-transformation-management-academy',
    name: 'DTMA - Digital Transformation Management Academy',
    tagline: 'Structured learning for digital transformation leadership',
    description: 'A comprehensive academy designed to build digital transformation capabilities across organizations through structured learning paths and practical application.',
    productType: 'DTMA',
    productStage: 'Live',
    whatItIs: 'A curated learning platform that helps professionals and leaders understand digital transformation in organizational context.',
    whyItMatters: 'It closes the sense-making and translation gap between digital exposure and real organizational impact.',
    includes: [
      'Context-first learning approach',
      'Structured sense-making frameworks',
      'Application-oriented courses'
    ],
    usedIn: [
      'Professional development programs',
      'Leadership transformation initiatives',
      'Organizational change management'
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
    },
    documentSections: [
      {
        id: 'introduction-real-challenge',
        title: 'Introduction: The Real Challenge of Digital Transformation',
        body: [
          'Digital technologies and artificial intelligence are now embedded in almost every organization. Companies are investing heavily in platforms, data, automation, and AI. At the same time, professionals are constantly exposed to new tools, trends, and training programs.',
          '',
          'Yet despite all this activity, many digital transformation efforts underdeliver.',
          '',
          'PROBLEM:Common symptoms:',
          'LIST_START',
          'Teams struggle to align on priorities',
          'Leaders struggle to explain what "being digital" truly means',
          'Professionals feel busy, but not necessarily clearer',
          'LIST_END',
          '',
          'This problem is not caused by a lack of technology. It is caused by a lack of shared understanding.',
          '',
          'Most organizations and professionals do not primarily suffer from a skills gap. They suffer from a **sense making gap**.',
          '',
          'People are exposed to technology, but they often lack clarity about:',
          'LIST_START',
          'Where digital change is heading',
          'What a digital organization looks like',
          'What changes for workers',
          'How everyday decisions connect to the bigger picture',
          'LIST_END',
          '',
          'KEY_INSIGHT:DTMA exists to close this gap.'
        ]
      },
      {
        id: 'core-idea-behind-dtma',
        title: 'The Core Idea Behind DTMA',
        body: [
          'DTMA starts from a simple belief:',
          '',
          'HIGHLIGHT:Before people can transform organizations, they must first understand the environment they are operating in.',
          '',
          'This means DTMA prioritizes:',
          'LIST_START',
          'Understanding before skills',
          'Context before tools',
          'Meaning before methods',
          'LIST_END',
          '',
          'Only once people can make sense of digital and AI in context does it become valuable to discuss tools, techniques, and execution.'
        ]
      },
      {
        id: 'what-is-dtma',
        title: 'What Is DTMA?',
        body: [
          'HIGHLIGHT:The Digital Transformation Management Academy (DTMA) is a curated learning platform that helps professionals and leaders:',
          '',
          'LIST_START',
          'Understand what digital and AI mean in an organizational context',
          'Build a shared mental model of the digital economy',
          'Develop a shared language across teams',
          'Translate understanding into practical decisions and actions',
          'LIST_END',
          '',
          'DTMA is not a library of random courses.',
          '',
          'It is a guided learning environment designed to move people through a clear progression:',
          '',
          'HIGHLIGHT:Exposure → Understanding → Application',
          '',
          'So that learning leads to real organizational impact.'
        ]
      },
      {
        id: 'problem-dtma-solves',
        title: 'The Problem DTMA Solves',
        body: [
          'Today, digital and AI content is abundant. Frameworks are plentiful. Tools evolve rapidly.',
          '',
          'However:',
          'LIST_START',
          'Understanding is fragmented',
          'Learning is often theoretical',
          'Application is inconsistent',
          'LIST_END',
          '',
          'CONSEQUENCE:As a result:',
          'LIST_START',
          'Professionals struggle to identify what truly matters',
          'Leaders struggle to align teams around a common direction',
          'Knowledge remains abstract instead of operational',
          'Digital initiatives become tool driven rather than purpose driven',
          'LIST_END',
          '',
          'This is not mainly a training problem. It is a **sense making and translation problem**.',
          '',
          'KEY_INSIGHT:DTMA addresses this by providing structured, context first learning that connects understanding directly to real work.'
        ]
      },
      {
        id: 'what-makes-dtma-different',
        title: 'What Makes DTMA Different',
        body: [
          'DTMA is built on three foundational principles:',
          '',
          'HIGHLIGHT:Context Before Tools',
          'Learners first understand the environment they are operating in the digital economy, changing organizational models, and evolving work patterns before engaging with specific technologies.',
          '',
          'HIGHLIGHT:Structured Sense Making',
          'Learning is organized as coherent paths that progressively build understanding, rather than isolated standalone topics.',
          '',
          'HIGHLIGHT:Application Oriented Learning',
          'Every concept is connected to real organizational situations, practical decisions, and everyday work.',
          '',
          'KEY_INSIGHT:DTMA helps people think clearly, so they can act effectively.'
        ]
      },
      {
        id: 'what-does-6xd-mean',
        title: 'What Does 6XD Mean?',
        body: [
          '6XD stands for Six Dimensions of Digital Transformation.',
          '',
          'It expresses a simple idea:',
          '',
          'HIGHLIGHT:Digital transformation is not one change. It is a set of connected changes happening across multiple dimensions of an organization at the same time.',
          '',
          'Most discussions about digital transformation focus mainly on technology. DTMA takes a broader view.',
          '',
          'DTMA recognizes that successful digital transformation requires coordinated change across:',
          'LIST_START',
          'The economic environment organizations operate in',
          'How organizations are structured',
          'How value is created and delivered',
          'How change is managed',
          'How people work',
          'How technology enables all of the above',
          'LIST_END',
          '',
          'KEY_INSIGHT:The "6" refers to six dimensions. The "X" represents transformation. The "D" represents digital.',
          '',
          'Rather than treating 6XD as something to memorize, DTMA uses it as a thinking structure that helps learners see the full picture.'
        ]
      },
      {
        id: 'how-dtma-structures-understanding',
        title: 'How DTMA Structures Understanding: The 6XD Perspective',
        body: [
          'DTMA structures learning around six connected perspectives. These perspectives act as orientation lenses that help learners understand how organizations actually change in a digital economy.',
          '',
          'Together, they help answer:',
          'LIST_START',
          'What is happening around organizations?',
          'What must organizations become?',
          'How do they move there?',
          'What changes for workers?',
          'What role does technology play?',
          'LIST_END',
          '',
          'HIGHLIGHT:XD 1: Digital Economy 4.0',
          'Focuses on understanding the broader economic environment shaped by data, platforms, ecosystems, and AI.',
          'Learners explore how value is created today, why traditional business models are under pressure, and how competition is changing.',
          'KEY_INSIGHT:Answers: What world are organizations operating in?',
          '',
          'HIGHLIGHT:XD 2: Digital Cognitive Organizations (DCO)',
          'Focuses on how organizations must be re-imagined to operate effectively in a digital economy.',
          'Learners explore organizational models, decision making structures, and operating principles.',
          'KEY_INSIGHT:Answers: What does a digital organization look like?',
          '',
          'HIGHLIGHT:XD 3: Digital Business Platforms (DBP)',
          'Focuses on how organizations deliver value through digital platforms.',
          'Learners explore platform based operating models and how platforms integrate processes, data, and services.',
          'KEY_INSIGHT:Answers: How is value delivered digitally?',
          '',
          'HIGHLIGHT:XD 4: Digital Transformation 2.0 (DT2.0)',
          'Focuses on how organizations move from today\'s state toward future digital states.',
          'Learners explore transformation journeys, change dynamics, and prioritization.',
          'KEY_INSIGHT:Answers: How do we move from here to there?',
          '',
          'HIGHLIGHT:XD 5: Digital Workers & Digital Workspaces',
          'Focuses on how roles, skills, collaboration, and ways of working evolve.',
          'Learners explore new expectations of workers, human-AI collaboration, and digital collaboration environments.',
          'KEY_INSIGHT:Answers: What changes for people?',
          '',
          'HIGHLIGHT:XD 6: Digital Accelerators (Tools)',
          'Focuses on how technologies support all other dimensions.',
          'Learners explore AI, data, cloud, and automation as enablers of organizational change not as ends in themselves.',
          'KEY_INSIGHT:Answers: How does technology enable transformation?'
        ]
      },
      {
        id: 'how-courses-fit',
        title: 'How Courses Fit Into This Structure',
        body: [
          'Every DTMA course clearly anchors itself within one or more of these perspectives.',
          '',
          'This ensures learners always understand:',
          'LIST_START',
          'Where they are in the bigger picture',
          'Why a course matters',
          'How it connects to other learning',
          'LIST_END',
          '',
          'KEY_INSIGHT:Learning becomes cumulative, not fragmented.'
        ]
      },
      {
        id: 'dtma-learning-experience',
        title: 'DTMA\'s Learning Experience',
        body: [
          'DTMA combines structure with flexibility.',
          '',
          'Learners follow guided learning paths, engage with modular courses, and work through practical, applied content.',
          '',
          'HIGHLIGHT:The goal is not awareness. The goal is capability building.'
        ]
      },
      {
        id: 'who-dtma-is-for',
        title: 'Who DTMA Is For',
        body: [
          'DTMA supports:',
          '',
          'LIST_START',
          'Digital Workers',
          'Digital Leaders and Executives',
          'Transformation Practitioners and Architects',
          'LIST_END',
          '',
          'All share one need: to make sense of digital change and act with clarity.'
        ]
      },
      {
        id: 'benefits',
        title: 'Benefits',
        body: [
          'HIGHLIGHT:For individuals: DTMA builds understanding, confidence, and career resilience.',
          '',
          'HIGHLIGHT:For organizations: DTMA creates shared language, stronger alignment, and better execution.'
        ]
      },
      {
        id: 'dtma-role-in-transformation',
        title: 'DTMA\'s Role in Digital Transformation',
        body: [
          'DTMA does not replace transformation programs. DTMA strengthens them.',
          '',
          'By improving how people understand digital change, DTMA improves:',
          'LIST_START',
          'How strategies are interpreted',
          'How initiatives are designed',
          'How technologies are adopted',
          'How people collaborate',
          'LIST_END',
          '',
          'KEY_INSIGHT:Better understanding leads to better transformation.'
        ]
      },
      {
        id: 'why-dtma-exists',
        title: 'Why DTMA Exists',
        body: [
          'DTMA exists to answer two fundamental questions:',
          '',
          'HIGHLIGHT:What does it mean to be a digital organization?',
          '',
          'HIGHLIGHT:What does it mean to be a digital worker?',
          '',
          'Everything inside DTMA is built around helping people find clear, practical answers to these questions.'
        ]
      },
      {
        id: 'start-learning-journey',
        title: 'Start Your Learning Journey Today',
        body: [
          'DTMA changes the question from:',
          '',
          '"What course should I take next?" to "How do I truly understand digital and AI, and apply it at work?"',
          '',
          'Whether you are navigating change in your role, leading teams through uncertainty, or supporting organizational transformation, DTMA gives you the clarity, structure, and context needed to act with confidence in the digital economy.',
          '',
          'You don\'t need more fragmented content. You need a way to make sense of what matters and translate it into real decisions and outcomes.',
          '',
          'Start with understanding.',
          'Build shared ways of thinking.',
          'Apply learning where it counts.',
          '',
          'KEY_INSIGHT:Learn with clarity. Apply with confidence. Transform with purpose.'
        ]
      }
    ]
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
  },
  'plant-4-0': {
    slug: 'plant-4-0',
    name: 'Plant 4.0',
    tagline: 'Revolutionizing industrial operations with real-time data, smart automation, and unmatched efficiency!',
    description: 'The next-generation industrial operations and performance platform designed to create smarter, more connected, and autonomous plants.',
    productType: 'Plant 4.0',
    productStage: 'Live',
    whatItIs: 'A unified industrial operations platform that integrates OT and IT while driving efficiency, safety, and sustainability.',
    whyItMatters: 'It transforms fragmented industrial systems into a single, integrated, data-driven operations platform.',
    includes: [
      'Unified Industrial Workspace',
      'Asset & IoT Management',
      'Process Automation & Control',
      'Asset Performance Management (APM)',
      'Operational Excellence & Lean Execution',
      'Energy Management & Sustainability',
      'Cybersecurity for OT/IoT Environments'
    ],
    usedIn: [
      'Manufacturing operations',
      'Oil & gas facilities',
      'Mining operations',
      'Utilities and water management'
    ],
    imageUrl: '/images/plant4.0.png',
    overview: 'Plant4.0 unifies industrial assets, processes, energy management, performance tracking, and cybersecurity in a centralized workspace.',
    purposeAndValue: 'It provides real-time decision support, scalable digital transformation, and simplified operations across industrial environments.',
    scopeAndCapabilities: [
      'Comprehensive asset visibility and 360° insights',
      'Event-driven automation with governance and compliance',
      'Proactive maintenance through continuous monitoring',
      'Real-time performance monitoring and continuous improvement',
      'Energy tracking and sustainability metrics',
      'Comprehensive OT/IoT cybersecurity'
    ],
    howItsUsed: {
      internal: [
        'Centralize operations across multiple plants and sites',
        'Monitor asset health and performance in real-time',
        'Optimize energy consumption and reduce waste'
      ],
      delivery: [
        'Deploy predictive maintenance solutions',
        'Implement process automation and control systems',
        'Establish cybersecurity frameworks for industrial environments'
      ],
      client: [
        'Provide unified operational visibility',
        'Enable data-driven decision making',
        'Support sustainability and compliance goals'
      ]
    },
    documentSections: [
      {
        id: 'introduction-to-plant40',
        title: 'Introduction',
        body: [
          'In today\'s rapidly evolving industrial landscape, organizations need a robust solution to seamlessly integrate operational technology (OT) and information technology (IT) while driving efficiency, safety, and sustainability. Plant4.0 is the next-generation industrial operations and performance platform designed to meet these needs, creating smarter, more connected, and autonomous plants.',
          '',
          'Plant4.0 unifies industrial assets, processes, energy management, performance tracking, and cybersecurity in a centralized workspace. By connecting and optimizing operations, Plant4.0 helps organizations transform from fragmented systems to a single, integrated, and data-driven operations platform. Whether you\'re managing assets, improving process efficiency, or securing your infrastructure, Plant4.0 is your go-to solution.'
        ]
      },
      {
        id: 'why-plant40-matters',
        title: 'Why Plant4.0 Matters',
        body: [
          'The primary purpose of Plant4.0 is to provide a unified, data-driven environment where operators, engineers, and leaders can access critical insights, make informed decisions, and improve plant performance. Here\'s how it achieves this:',
          '',
          'HIGHLIGHT:Real-Time Decision Support',
          'Plant4.0 converts raw telemetry data from IoT devices and assets into actionable insights, helping teams make faster, better decisions.',
          '',
          'HIGHLIGHT:Scalable, Long-Term Digital Transformation',
          'As organizations evolve towards fully digital, cognitive plants, Plant4.0 serves as a scalable foundation to continuously improve safety, reliability, and operational efficiency.',
          '',
          'HIGHLIGHT:Simplified Operations',
          'With Plant4.0, teams no longer need to deal with siloed systems. It centralizes operations, providing clear visibility and seamless workflows across different departments and teams.'
        ]
      },
      {
        id: 'core-features',
        title: 'Core Features of Plant4.0',
        body: [
          'FEATURES:1. Unified Industrial Workspace',
          'LIST_START',
          'Streamlined Access: One role-aware workspace provides consistent navigation across multiple modules such as Assets & IoT, Process Automation, Asset Performance Management (APM), Energy Management, and Cybersecurity',
          'Multi-Tenant & Multi-Site Support: Whether you\'re managing multiple plants or sectors, Plant4.0 ensures clear data separation across sites and organizational units, facilitating smooth operations across diverse environments',
          'LIST_END',
          '',
          'FEATURES:2. Asset & IoT Management',
          'LIST_START',
          'Comprehensive Asset Visibility: Create a contextual portfolio of fixed, mobile, and networked assets. Easily manage data from IoT sensors, telemetry, and maintenance records',
          '360° Asset Insights: Plant4.0 provides detailed insights into asset health, performance, location, and ownership, creating a comprehensive asset management system that supports informed decision-making',
          'LIST_END',
          '',
          'FEATURES:3. Process Automation & Control',
          'LIST_START',
          'Event-Driven Automation: Set up triggers and alarms based on predefined conditions to automatically respond to operational changes. This allows teams to quickly detect and correct deviations',
          'Governance and Compliance: Plant4.0 ensures safe and compliant operations through versioning, approval workflows, and audit trails for changes in automation logic and control rules',
          'LIST_END',
          '',
          'FEATURES:4. Asset Performance Management (APM)',
          'LIST_START',
          'Proactive Maintenance: Plant4.0 continuously monitors asset performance, leveraging real-time and historical data to predict and prevent failures before they occur',
          'Optimize Operations: It helps organizations prioritize asset maintenance, identify areas for improvement, and allocate resources effectively, ensuring that critical assets receive the attention they need',
          'LIST_END',
          '',
          'FEATURES:5. Operational Excellence & Lean Execution',
          'LIST_START',
          'Real-Time Performance Monitoring: Gain visibility into key metrics like OEE (Overall Equipment Effectiveness), SAIDI, SAIFI, and losses, all in real time. Plant4.0 helps identify bottlenecks, optimize workflows, and improve productivity',
          'Continuous Improvement (CI): Plant4.0 turns performance deviations into actionable improvement projects, helping teams close the loop on issues and track savings from lean initiatives',
          'LIST_END',
          '',
          'FEATURES:6. Energy Management & Sustainability',
          'LIST_START',
          'Track and Optimize Energy Consumption: Plant4.0 tracks energy usage at every level—from individual assets to entire plants—helping organizations detect inefficiencies and minimize waste',
          'Sustainability Goals: Convert energy data into actionable sustainability metrics to report on emissions, energy consumption, and compliance with industry regulations',
          'LIST_END',
          '',
          'FEATURES:7. Cybersecurity for OT/IoT Environments',
          'LIST_START',
          'Comprehensive Security: Plant4.0 provides an overview of security risks across your OT and IoT devices, helping identify threats and vulnerabilities',
          'Advanced Threat Monitoring: It supports real-time monitoring, incident response, and audit logging, ensuring robust protection against cyber threats that could disrupt industrial operations',
          'LIST_END'
        ]
      },
      {
        id: 'benefits',
        title: 'How Plant4.0 Benefits Your Operations',
        body: [
          'HIGHLIGHT:Transformative Impact Across Key Areas',
          '',
          'DELIVERS:Centralized Operations',
          'Break down silos across systems and departments. With Plant4.0, everything from asset management to energy optimization and process automation is integrated into a single platform. This seamless connection reduces friction and drives operational efficiency.',
          '',
          'DELIVERS:Data-Driven Decision Making',
          'With Plant4.0, data is your most valuable asset. The platform turns raw data into actionable insights that support operational decision-making in real time, empowering teams at all levels to act faster and more accurately.',
          '',
          'DELIVERS:Increased Efficiency and Reliability',
          'Plant4.0 continuously monitors the health and performance of industrial assets, reducing unplanned downtime and preventing unnecessary maintenance costs. Its predictive maintenance capabilities ensure optimal performance with minimal disruptions.',
          '',
          'DELIVERS:Cost Savings and Sustainability',
          'By optimizing energy use, reducing waste, and improving operational efficiency, Plant4.0 delivers substantial cost savings. It also helps organizations meet sustainability goals by tracking and managing energy consumption and carbon emissions.',
          '',
          'DELIVERS:Faster, Smarter Response to Issues',
          'Automated triggers, alarms, and workflows ensure that issues are detected early, escalated to the right teams, and resolved quickly, improving both operational uptime and overall plant performance.'
        ]
      },
      {
        id: 'who-benefits',
        title: 'Who Can Benefit from Plant4.0?',
        body: [
          'Plant4.0 is ideal for organizations in complex industrial sectors, including manufacturing, oil & gas, mining, utilities, and water. The following roles can gain substantial benefits from the platform:',
          '',
          'LIST_START',
          'Plant Managers & Operations Leaders: Gain a holistic view of operations, performance, and risk across your plant\'s assets, improving decision-making and efficiency',
          'Engineering & Maintenance Teams: Optimize asset performance, streamline maintenance workflows, and reduce unplanned downtime with predictive analytics and real-time monitoring',
          'Energy & Sustainability Teams: Improve energy usage, reduce emissions, and meet regulatory standards with real-time energy management and reporting',
          'Cybersecurity Professionals: Secure OT and IoT devices, identify vulnerabilities, and ensure robust cybersecurity compliance across your entire industrial environment',
          'LIST_END'
        ]
      },
      {
        id: 'future-of-operations',
        title: 'The Future of Industrial Operations with Plant4.0',
        body: [
          'With Plant4.0, the future of industrial operations is about more than just automation—it\'s about turning data into actionable insights that drive smarter decision-making, enhance operational efficiency, and ensure long-term sustainability. The platform empowers plants to transform into connected, data-driven, and autonomous environments where operational excellence is not just a goal but a continuous journey.',
          '',
          'As you step into the world of Plant4.0, you\'re not just learning a tool—you\'re becoming part of a new era of industrial operations that\'s faster, smarter, and more efficient. Let\'s take the next step in your journey to a digital, sustainable, and optimized industrial future.',
          '',
          'KEY_INSIGHT:Transform your industrial operations. Centralize. Optimize. Secure.'
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
