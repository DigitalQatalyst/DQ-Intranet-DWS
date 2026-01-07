export interface SummaryTableColumn {
  header: string;
  accessor: string;
}

export interface TableData {
  columns: SummaryTableColumn[];
  data: Record<string, string | number>[];
}

export interface CIDSServiceCard {
  id: string;
  title: string;
  description: string;
  section: string;
  content: {
    overview?: string;
    subsections?: {
      id: string;
      title: string;
      content: string;
      tableData?: TableData;
    }[];
  };
  tags?: string[];
  imageUrl?: string;
}

export const CIDS_SERVICE_CARDS: CIDSServiceCard[] = [
  {
    id: 'cids-introduction',
    title: 'Introduction',
    description: 'This section introduces the CI.DS (Content Item Design System) as the formal replacement of the CI.PF (Content Item Production Framework), signalling a shift from a static set of production rules to a dynamic, modular, and quality-driven content system.',
    section: '1. Introduction',
    content: {
      overview: 'This section introduces the CI.DS (Content Item Design System) as the formal replacement of the CI.PF (Content Item Production Framework), signalling a shift from a static set of production rules to a dynamic, modular, and quality-driven content system. The CI.DS is designed to embed greater intentionality, traceability, and performance assurance into the way content is envisioned, created, reviewed, and delivered across all DQ platforms.\n\nBy anchoring the CI.DS within DQ\'s wider ecosystem—including DTMB (Books), DTMI (Insights), DTMP (Platform), TMaaS (Deliverables), and DTMA (Academy)—this introduction highlights how content is no longer a support function, but a strategic driver of thought leadership, brand credibility, and organizational learning. It sets the tone for the system\'s multi-staged structure and positions it as an operational backbone for delivering impactful, mission-aligned content consistently and at scale.',
      subsections: [
        {
          id: '1.1',
          title: 'Content Mandate (DQ Units)',
          content: 'Multiple units across DQ are tasked with producing content that delivers strategic impact—content designed to influence decisions, spark engagement, and drive targeted actions across diverse scenarios. Each unit contributes a distinct content type aligned to its function within the broader DQ transformation methodology.\n\nThese content-producing units include:\n\n• DTMB (Digital Transformation Management Books) – Develops long-form publications and whitepapers that articulate strategic frameworks, transformation logic, and thought leadership.\n\n• DTMI (Digital Transformation Management Insights) – Publishes analytical insights, trend overviews, and high-frequency thought leadership pieces aligned to market and sector dynamics.\n\n• DTMA (Digital Transformation Management Academy) – Produces structured learning content, training modules, and course materials to support digital capability building.\n\n• DQ Designs – Generates architecture diagrams, strategic blueprints, and design specifications for products, platforms, and organizational constructs.\n\n• DQ Deploys – Delivers implementation-focused content such as guides, manuals, technical documents, and use-case playbooks.\n\n• DQ Deals – Crafts strategic proposals, bid responses, capability decks, and customized engagement presentations.\n\n• DQ Content – Leads on multimedia, editorial, and campaign-driven content across digital channels, including social posts, scripts, videos, and creative assets.'
        },
        {
          id: '1.2',
          title: 'Relevant Ecosystem',
          content: 'The CI.DS guidelines apply universally across the DQ content ecosystem and must be upheld to maintain consistency, quality, and brand alignment in every content output. This includes all formats, platforms, and touchpoints where DQ content is created or shared.\n\nSpecifically, CI.DS must be followed:\n\n• Within internal DQ documentation and communications\n• In DTMB Papers and formal publications\n• In DTMA Course Materials and Learning Assets\n• Across DTMI Insights and all social media channels\n• Within BD proposals, sales decks, and outreach content\n• In client-facing deliverables, reports, and strategic outputs'
        },
        {
          id: '1.3',
          title: 'CI.DS | Purpose',
          content: 'The CI.DS is defined as a strategic, end-to-end system that ensures all content items are intentionally planned, professionally produced, and strategically promoted. It provides a unified framework that brings structure, precision, and purpose to the entire content lifecycle.\n\nBy applying CI.DS, DQ ensures that every output—whether a whitepaper, insight, visual asset, or course material—is clear in its message, consistent with the brand, and optimized for measurable performance. This leads to stronger engagement, greater trust from audiences, streamlined production processes, and higher content ROI across all platforms and channels.'
        },
        {
          id: '1.4',
          title: 'CI.DS | Key Stakeholders',
          content: 'The success of the CI.DS relies on clear role definition and collaboration across a range of key stakeholders. Each participant in the content lifecycle plays a unique role in ensuring that content meets its intended purpose with clarity, quality, and strategic alignment.\n\n• Writers are responsible for shaping narratives that align with DQ\'s tone, logic, and frameworks, grounding every piece in clarity and purpose.\n\n• Editors refine the structure, tone, and coherence of written content, ensuring it meets CI.DS quality standards.\n\n• Designers translate ideas into visuals, applying the brand\'s visual language and layout logic to enhance clarity, engagement, and comprehension.\n\n• Reviewers—often subject matter experts—validate technical accuracy, conceptual integrity, and narrative strength.\n\n• Marketers ensure content visibility and impact by planning distribution strategies, tagging for SEO, and coordinating promotional campaigns.\n\n• Executive Approvers provide final validation, ensuring that each content item supports DQ\'s strategic vision, brand standards, and ecosystem positioning.\n\nTogether, these stakeholders uphold a shared commitment to quality and coherence, using CI.DS as the central system that guides planning, creation, validation, and publication.'
        }
      ]
    },
    tags: ['Introduction', 'CI.DS', 'Content System'],
    imageUrl: '/images/services/design-automation.jpg'
  },
  {
    id: 'cids-stage-00',
    title: 'Stage 00',
    description: 'Stage 00 defines the strategic lens through which all content items are shaped. It ensures that content is not created in isolation but instead anchored in DQ\'s narrative, frameworks, product positioning, and distribution strategy.',
    section: '2. Stage 00',
    content: {
      overview: 'Stage 00 defines the strategic lens through which all content items are shaped. It ensures that content is not created in isolation but instead anchored in DQ\'s narrative, frameworks, product positioning, and distribution strategy. This stage provides the foundational logic that ensures content serves a clear business and branding purpose across the organization.',
      subsections: [
        {
          id: '2.1',
          title: 'DQ Stories | Frameworks',
          content: 'Every piece of content produced under CI.DS must be grounded in DQ\'s core narrative: the transformation journey toward Digital Cognitive Organizations (DCOs). This overarching story is more than a backdrop—it is the strategic compass that connects DQ\'s thought leadership, product philosophy, and transformation agenda.\n\nBy embedding the DCO story within content, creators ensure consistency of purpose, relevance to the target audience, and alignment with DQ\'s global positioning. This storytelling framework provides coherence across diverse content formats and strengthens the organization\'s intellectual footprint in the digital transformation space.'
        },
        {
          id: '2.4',
          title: 'DQ Stories | Content Artefact Class (CAC)',
          content: 'DQ content is generally organized into five Content Artefact Classes (CAC), each representing a strategic category aligned with the intent, audience, and business value of the content produced. These classes provide a high-level framework to ensure that content outputs are not just diverse in format but coherent in purpose.\n\nThe five CACs include:\n\n**Thought Leadership Artefacts** – Designed to shape industry perspectives and establish DQ\'s intellectual position. Examples include whitepapers, research briefs, anchor papers, and insight decks.\n\n**Product & Service Artefacts** – Focused on describing, promoting, or enabling adoption of DQ\'s offerings. This includes solution overviews, proposal decks, use-case templates, and service blueprints.\n\n**Brand Identity & Culture Artefacts** – These reinforce internal values and external image. Artefacts include culture books, onboarding kits, tone-of-voice guidelines, and brand design manuals.\n\n**Education & Enablement Artefacts** – Created to build digital capabilities for clients, partners, or internal teams. Includes LMS modules, learning guides, how-to scripts, and certification assessments.\n\n**Community & Ecosystem Artefacts** – Aimed at engaging the broader market and partner ecosystem. Includes event highlights, partnership announcements, social campaigns, and ecosystem visualizations.\n\nThese five CACs act as the backbone of the CI.DS structure and provide direction for the development, review, and strategic use of content across the organization.'
        },
        {
          id: '2.5',
          title: 'Content Items | Content Artefact Type (CAT)',
          content: 'Each Content Artefact Class (CAC) comprises a diverse set of Content Artefact Types (CATs), each tailored to specific formats, audience needs, and strategic intents. These artefact types ensure content is delivered with structure, relevance, and consistency across the organization. Examples include:\n\n• **Whitepapers / Anchor Papers** – In-depth strategic explorations grounded in research and frameworks\n\n• **Articles / Blogs** – Shorter-form narrative thought pieces that are highly relatable and aligned to campaigns or trends.\n\n• **Storyboards** – Visual story plans used in script development or motion content\n\n• **Scripts** – Written dialogue or guidance for videos, LMS courses, or explainers\n\n• **Templates** – Pre-designed formats for consistent content creation and reuse\n\n• **Case Studies** – Real-world examples of impact showcasing transformation success\n\n• **Visual Reports** – Graphically rich documents that synthesize insights and outcomes\n\n• **Learning Modules** – Structured course units part of educational programs\n\n• **Social Media Posts** – Bite-sized, high-impact content optimized for engagement\n\n• **Proposal Decks** – Commercial documents presenting DQ\'s capabilities and solutions\n\nEach artefact type has its own production methodology, review process, and outcome expectations, all governed under the CI.DS system to ensure cross-functional alignment and content excellence.'
        },
        {
          id: '2.6',
          title: 'Content Items | Content Types vs Channels',
          content: 'This section details the primary platforms and media through which DQ content is distributed. Mapping content artefact types to their most appropriate channels ensures clarity in formatting, boosts audience relevance, and strengthens campaign impact.',
          tableData: {
            columns: [
              { header: 'Content Artefact Type', accessor: 'type' },
              { header: 'Primary Channels', accessor: 'channels' }
            ],
            data: [
              {
                type: 'Whitepapers, Anchor Papers',
                channels: 'DQ Website, DTMI Platform, Email Submissions'
              },
              {
                type: 'Strategic Blogs, Co-Branded Insights',
                channels: 'DTMI Platform, LinkedIn'
              },
              {
                type: 'Proposal Decks, Commercial Offers',
                channels: 'Email Submissions, Deliverables Portal (DTMP), Notion Internal Portals'
              },
              {
                type: 'Brand Tone Guides, Culture Decks',
                channels: 'Notion, Internal Portals'
              },
              {
                type: 'Course Modules, How-to Guides',
                channels: 'DTMA LMS, Partner Platforms, DQ Website'
              },
              {
                type: 'Event Highlights, Social Templates',
                channels: 'LinkedIn, Social Media, DTMI Platform'
              },
              {
                type: 'Research Briefs, Frameworks',
                channels: 'DTMI Platform, DQ Website'
              },
              {
                type: 'Ecosystem Maps, Partner Posts',
                channels: 'LinkedIn, Email Submissions, DTMI Platform'
              },
              {
                type: 'Service Blueprints, Use-Case Templates',
                channels: 'Deliverables Portal (DTMP), Notion, Email'
              }
            ]
          }
        },
        {
          id: '2.7',
          title: 'Content Items | Content Development Lifecycle (CDL)',
          content: 'The Content Development Lifecycle (CDL) outlines the full journey of a content item—divided into two core stages: **Production** and **Dissemination**. This structured lifecycle embeds quality, alignment, and performance at each step of the process, ensuring every content asset is purposeful and impactful.\n\n**Production Stage**\nFocuses on transforming strategic ideas into high-quality, brand-aligned content:\n\n• **Ideation & Validation** – Define the strategic intent of the content, align it with relevant DQ frameworks, and validate with key stakeholders.\n\n• **Briefing & Planning** – Document objectives, contributors, and milestones in the CI Brief and CI Tracker.\n\n• **Drafting & Editing** – Create content using approved templates, applying tone, structure, and referencing standards.\n\n• **Design & Formatting** – Shape the content visually with compliant layouts, branded visuals, and multimedia.\n\n• **Review & Approvals** – Conduct structured reviews with SMEs and leaders to finalize content for publishing.\n\n**Dissemination Stage**\nFocuses on delivering the content with maximum reach, visibility, and feedback:\n\n• **Publication & SEO Tagging** – Distribute content to the right channels with proper metadata, SEO, and publishing standards.\n\n• **Promotion & Feedback Loop** – Activate content through campaigns, track performance metrics, and gather insights for future refinement.\n\nThis lifecycle ensures traceability, role clarity, and continuous improvement across all CI.DS-driven content activities.'
        },
        {
          id: '2.8',
          title: 'CI.CDL | Content Roles RACI',
          content: 'Maps role responsibilities across the content lifecycle using the RACI model to ensure clarity, accountability, and efficient collaboration:\n\n• **Responsible**: Writers and Designers are tasked with content creation, ensuring adherence to tone, structure, and visual standards.\n\n• **Accountable**: Product Owners and Project Managers ensure final delivery quality, strategic fit, and that timelines are met.\n\n• **Consulted**: Reviewers and Subject Matter Experts provide critical input, validation, and subject-specific refinement.\n\n• **Informed**: Marketing and Executive Sponsors are kept updated on progress, publication timing, and campaign alignment.\n\nThis RACI framework supports a well-orchestrated content development process, reducing ambiguity and enabling cross-functional teamwork.'
        },
        {
          id: '2.9',
          title: 'CI.CDL | AI Working Tools',
          content: 'A curated suite of AI-powered tools is embedded across each stage of the content lifecycle to enhance speed, consistency, and strategic quality in CI.DS operations:\n\n• **Content Drafting Support**: Tools such as ChatGPT, Gamma AI, and Canva accelerate ideation and drafting—providing structure, voice alignment, and conceptual clarity from the outset.\n\n• **Design Assistance**: Canva and Midjourney streamline the production of compelling visuals, infographics, and branded layouts, supporting rapid prototyping and iteration.\n\n• **Review Automation**: Grammarly, SEO Surfer, and similar assistants reinforce tone, clarity, grammar, and keyword alignment—enhancing editorial accuracy while reducing manual overhead.\n\n• **Publishing & Tagging**: Tools like Power Automate and Notion enable seamless automation of metadata tagging, SEO embedding, platform distribution, and version control.\n\nTogether, these tools form an intelligent augmentation layer across the content lifecycle—supporting CI.DS contributors in delivering professional, high-impact outputs faster and more reliably.'
        }
      ]
    },
    tags: ['Stage 00', 'CI.DS', 'Strategy', 'Content Development'],
    imageUrl: '/images/services/strategy-advisor.jpg'
  }
];

