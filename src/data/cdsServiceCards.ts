export interface SummaryTableColumn {
  header: string;
  accessor: string;
}

export interface TableData {
  columns: SummaryTableColumn[];
  data: Record<string, string | number>[];
}

export interface CDSServiceCard {
  id: string;
  title: string;
  description: string;
  section: string;
  system?: string;
  type?: string;
  content: {
    overview?: string;
    subsections?: {
      id: string;
      title: string;
      content: string;
      tableData?: TableData;
      contentAfterTable?: string;
    }[];
  };
  tags?: string[];
  imageUrl?: string;
}

export const CDS_SERVICE_CARDS: CDSServiceCard[] = [
  {
    id: 'cds-campaigns-design-system',
    title: 'Campaigns Design System (CDS)',
    description:
      "DQ Marketing’s operating system for how campaigns are conceived, planned, designed, deployed, and reviewed across channels.",
    section: '1. Introduction',
    system: 'CDS',
    type: 'framework',
      content: {
        subsections: [
        {
          id: '1',
          title: '1. Introduction',
          content: `Marketing at DigitalQatalyst is not just about brand presence-it is a structured practice of shaping the organization's narrative, educating the digital economy, and orchestrating movements across channels and stakeholders. The Marketing Campaigns Design System (CDS) offers a unified operating framework for how campaigns are conceived, planned, designed, deployed, and reviewed-anchored by DQ's five strategic Content Pillars.`
        },
          {
            id: 'who',
            title: 'Who is this for?',
            content: `Across DigitalQatalyst, campaigns are how ideas turn into movements-how insight becomes visibility, visibility becomes engagement, and engagement becomes growth. CDS is for the people responsible for making those movements happen. It serves marketing leaders setting strategic direction, campaign specialists designing narratives and journeys, designers and creators shaping visual and multimedia assets, and DevOps and WebOps teams deploying campaigns across platforms. It also supports delivery and product teams who initiate campaigns to generate demand, and data analysts who measure performance and optimize outcomes. For anyone involved in planning, executing, or scaling marketing campaigns at DQ, CDS provides the shared operating system that brings structure and alignment to collective effort.`
          },
          {
            id: 'problem',
            title: 'What problem does it solve?',
            content: `Without a unified system, campaigns often evolve as isolated efforts-planned differently by each team, executed with inconsistent standards, and measured unevenly across channels. This leads to fragmented brand expression, slower execution, and missed opportunities to build momentum across the pipeline. CDS transforms campaigns from ad-hoc activities into a disciplined, repeatable practice. It provides a common framework anchored in DQ's content pillars, shared standards, and clear roles, enabling teams to collaborate with confidence and speed. By embedding consistency, quality benchmarks, and performance thinking into every stage of campaign design and delivery, CDS reduces friction, improves effectiveness, and ensures that every campaign contributes coherently to DQ's brand, growth, and market leadership.`
          },
          {
            id: '1.1',
            title: '1.1 DQ MarCom | Mandate',
            content: `The Marketing & Communication (MarCom) Unit in DQ works along with the BD Unit to orchestrate leads, opportunities, and deals for the organisation offerings. The joint mandate of Marketing and BD is "To Accelerate Efficient DCO & DBP Deals Pipeline (Traffic | Contacts | Leads | Opportunities) in DQ". Across the organisation, success is measured in terms of contribution to (1) DQ Insight, (2) DQ Agility, (3) DQ Growth. Marketing campaigns are the primary activities undertaken to build the DQ Brand and generate followership and leads.`
          },
          {
            id: '1.2',
            title: '1.2 DQ MarCom | Ecosystem',
            content: `The DQ MarCom Unit delivers targeted promotional and lead-generation campaigns in collaboration with key units across the organization. Operating as a centralized support function, it ensures each campaign aligns with both the strategic goals of the unit it supports and the broader DQ brand and business objectives.\n\n- DQ Organisation: Branding positioning.\n- DQ Delivery Units: Leads generation (DQ Designs and Deploys).\n- DQ Products Units: Leads generation (DQ DT2.0 and DCO offerings).`
          },
          {
            id: '1.3',
            title: '1.3 DQ CDS | Purpose',
            content: `At its core, the Campaigns Design System (CDS) is a mechanism for ensuring consistency, quality, and strategic clarity across all outputs. It transforms campaign activity into a disciplined process of storytelling, brand expression, and stakeholder engagement while embedding visual and narrative standards that unify the brand experience. This ensures every campaign is impactful, aligned, repeatable, and reflective of DQ's digital leadership.\n\n- Provide a standardized, high-impact system for managing all marketing campaigns.\n- Empower teams to build campaigns that align with DQ's vision, values, and voice.\n- Accelerate production, improve consistency, and enhance campaign effectiveness.`
          },
          {
            id: '1.4',
            title: '1.4 DQ CDS | Key Stakeholders',
            content: `CDS standardizes campaign execution and enables collaboration across diverse stakeholders, providing a shared system, language, and quality benchmarks to co-create high-quality, brand-aligned campaigns.\n\n- Marketing Leadership - Strategic alignment and oversight.\n- Campaign Beneficiaries - All stakeholders across the organisation.\n- Campaign Specialists - Campaign planning, scripting, and content design.\n- Designers & Creators - Visual identity, videos, carousels.\n- DevOps / WebOps - Programming, deployment, asset integration.\n- Campaign Data Analysts - Measurement, reporting, optimization.\n- Delivery / Products Teams - Cross-functional campaign initiators.`
          },
        {
          id: '2',
          title: '2. Stage 00 - Campaigns Strategy (90%)',
          content: `This section defines the strategic foundation of DQ campaigns: the Content Pillars, target channels, overall lifecycle, and roles. It establishes the strategic layer of the CDS by clarifying how DQ’s core messages, brand presence, and offerings are structured and delivered across multiple campaigns. A unified strategy ensures that all campaigns, regardless of target audience or format, are consistent with DQ’s positioning as a leading digital transformation partner.\n\nThis consistency is achieved through integration of five clearly defined content pillars, a well-mapped channel distribution logic, a repeatable campaign lifecycle, and the active participation of cross-functional roles. Together, these strategic components enable DQ to operate with clarity, scale campaigns efficiently, and achieve maximum brand and business impact.`
        },
        {
          id: '2.1',
          title: '2.1 DQ CDS | 5 Content Pillars',
          content: `The foundation of every DQ marketing campaign is built upon five core content pillars. These pillars are strategic expressions of DQ’s value proposition and positioning.\n\n- Thought Leadership & Insight: Advance DQ as the brain trust for digital transformation.\n- Product & Service Value: Showcase the functionality and outcomes of DQ products.\n- Brand Identity & Culture: Humanize the brand through emotion and values.\n- Education & Enablement: Teach and enable audiences to take action.\n- Community & Ecosystem: Highlight DQ’s role as a movement, not just a company.\n\nStructuring campaigns around these pillars ensures consistent messaging and measurable outcomes.`
        },
        {
          id: '2.2',
          title: '2.2 DQ CDS | The DQ Story Framework',
          content: `The DQ Value Proposition and Operating Model is encapsulated in the Golden HoneyComb of Competencies (GHC). The 7th element expands into the research-driven 6xD (6 Primary Dimensions for Digital Success), defining worldview, strategic pillars, and product architecture. These frameworks act as the narrative engine behind all campaign storytelling, providing vocabulary, themes, and structural alignment so every campaign reinforces DQ’s identity and positioning.`
        },
        {
          id: '2.3',
          title: '2.3 DQ CDS | The DQ Offerings',
          content: `Campaigns develop the DQ brand and generate leads for products organized in the 6xD framework. Four product classes include:\n\nClass 01: DBP Reference Products\n- Product 11: DTMF (Digital Transformation Management Framework)\n- Product 12: Digital Canvas (Digital Cognitive Organisation Canvas)\n\nClass 02: DT2.0 Products\n- Product 21: DTMP (Digital Transformation Management Platform)\n- Product 22: DTO4T (Digital Twin of Organisation for Transformation)\n- Product 23: DTMaaS (Digital Transformation Management as a Service)\n\nClass 03: DCO Products\n- Product 31: DTMI (Digital Transformation Management Insight)\n- Product 32: DTMA (Digital Transformation Management Academy)\n- Product 33: DTMB (Digital Transformation Management Books)\n\nClass 04: Niche Products\n- Product 41: D2GPRC (Data-Driven Govern Perform Risk Comply)\n- Product 42: Others (e.g., LoanMS, PlanBPM).`
        },
        {
          id: '2.4',
          title: '2.4 DQ CDS | Roles & Responsibilities',
          content: `Effective execution relies on clearly defined roles and seamless collaboration. Roles are interdependent contributors in a unified campaign workflow, improving speed, quality, and alignment:\n\n- Campaign Owner – Strategic direction and alignment.\n- Creative Lead – Messaging, visuals, pillar fit.\n- Creative Editor – Canva, video, animation.\n- Creative Writer – Scripts, captions, CTA writing.\n- DXP Feature Dev (Platform) – Distribution, platform compliance.\n- DXP Feature Dev (Data) – Metrics tracking, insights, reporting.`
        },
        {
          id: '2.5',
          title: '2.5 DQ CDS | Target Audience',
          content: `To be refined per campaign; typical personas include:\n- Digital Organisation Executive\n- Digital Leaders (CTO, CDO)\n- Digital Architect\n- Digital Worker`
        },
        {
          id: '2.6',
          title: '2.6 DQ MarCom | Channel Strategy',
          content: `Each content pillar has a native channel fit. Mapping platform to audience and purpose ensures precision and reach across DQ’s top social and digital channels.`,
          tableData: {
            columns: [
              { header: 'Platform', accessor: 'platform' },
              { header: 'Target Audience', accessor: 'audience' },
              { header: 'Content Type(s)', accessor: 'types' },
              { header: 'Priority Tier', accessor: 'priority' }
            ],
            data: [
              { platform: 'Website', audience: 'All audiences', types: 'Core content hub, product & service pages, whitepaper archive, DTMA, DTMI access', priority: 'Tier 1' },
              { platform: 'LinkedIn', audience: 'B2B execs, decision-makers', types: 'POVs, frameworks, success stories, team features', priority: 'Tier 1' },
              { platform: 'YouTube', audience: 'Professionals, learners, clients', types: 'Explainer videos, walkthroughs, DTMA sessions, client showcases', priority: 'Tier 1' },
              { platform: 'Instagram', audience: 'Creative talent, young professionals', types: 'Brand storytelling, behind-the-scenes, reels, carousels', priority: 'Tier 1' },
              { platform: 'Email', audience: 'Existing community, prospects', types: 'Newsletters, whitepaper releases, product and course drops', priority: 'Tier 1' },
              { platform: 'WhatsApp / Telegram', audience: 'Core community, clients, partners', types: 'Micro-updates, alerts, drops, direct engagement', priority: 'Tier 2' },
              { platform: 'X (Twitter)', audience: 'Industry thinkers, fast movers', types: 'Real-time updates, insight threads, reactions to trends', priority: 'Tier 2' },
              { platform: 'Medium / Substack', audience: 'Insight-focused readers', types: 'DTMI essays, whitepaper previews, research reflections', priority: 'Tier 2' },
              { platform: 'Facebook', audience: 'General public, Africa/MENA region', types: 'Campaign promotions, community engagement, events', priority: 'Tier 2' },
              { platform: 'TikTok', audience: 'Gen Z, creative audience', types: 'Short-form explainers, cultural moments, behind-the-scenes', priority: 'Tier 2' },
              { platform: 'Pinterest', audience: 'Visual designers, researchers', types: 'Infographics, templates, storyboards', priority: 'Tier 3' },
              { platform: 'SlideShare', audience: 'Corporate audience, researchers', types: 'DQ playbooks, capability decks, strategic models', priority: 'Tier 3' },
              { platform: 'Threads', audience: 'Instagram-linked users', types: 'Micro-content, soft announcements, teaser threads', priority: 'Tier 3' }
            ]
          }
        },
        {
          id: '2.7',
          title: '2.7 DQ MarCom | Channels vs Content Pillars',
          content: `Align pillars to the best-fit channels to maximize resonance and conversion. Sample mappings include:\n- Thought Leadership & Insight: LinkedIn, Medium/Substack, YouTube, Website (support: X, Threads, SlideShare, Email, WhatsApp/Telegram).\n- Product & Service Value: Website, YouTube, LinkedIn, Email (support: Instagram Reels, WhatsApp/Telegram, Facebook, X, SlideShare).\n- Brand Identity & Culture: Instagram, YouTube, TikTok, Website (support: Threads, Facebook, Pinterest, WhatsApp/Telegram).\n- Education & Enablement: YouTube, Instagram (Carousels/Reels), Website, Email (support: Pinterest, Medium/Substack, LinkedIn, WhatsApp/Telegram).\n- Community & Ecosystem: Instagram, LinkedIn, WhatsApp/Telegram, Email, Website (support: Facebook, X, Threads).\n\nPillar-to-channel examples:\n- Thought Leadership: “Why DT2.0 Replaces Siloed Projects” on LinkedIn + Medium + Website.\n- Product Value: TMaaS demo video on YouTube + Email + LinkedIn.\n- Brand Identity: “Day in DQ: Culture Reel” on Instagram + TikTok + Threads.\n- Education: “What is a Work Unit?” carousel on Instagram + Website + Email.\n- Community: “Join the DTMA Launch Event” on LinkedIn + WhatsApp + Email.`
        },
        {
          id: '2.8',
          title: '2.8 DQ MarCom | Campaign Lifecycle',
          content: `A repeatable structure that moves from strategic intent to execution with clarity and speed. Four core stages:\n\n- Planning – Strategy, objectives, storyboarding.\n- Design – Scripts, visuals, messaging, prompts.\n- Execution – Programming, scheduling, deployment.\n- Governance – Monitoring, review, reporting, retros.`
        },
        {
          id: '3',
          title: '3. Stage 01 - Campaigns Planning',
          content: `Planning transforms ideas into structured campaigns by aligning creative intent with strategic clarity. It sets the foundation where vision meets execution and uses canvases, briefs, and resource mapping to enable faster, higher-quality launches.`
        },
        {
          id: '3.1',
          title: '3.1 DQ CDS | Campaign Canvas',
          content: `A one-pager that distills the core strategy of a campaign: title, summary, pillars, objective, audience, core message/value hook, CTA, channel strategy, success metrics, hero asset type, personas, and alignment. Ensures all contributors share the same strategic foundation before execution begins.`
        },
        {
          id: '3.2',
          title: '3.2 Campaign Brief Template',
          content: `Formal initiation of a campaign with a single source of truth. Captures strategic context, trigger, creative direction, visual tone, pillar justification, timeline and milestones, budget and resources, and review/approval sign-offs. Keeps contributors aligned and accountable from concept through launch.`
        },
        {
          id: '4',
          title: '4. Stage 02 - Campaigns Design',
          content: `Covers the full creative production process from storyboarding and scripting to asset design, message framing, and AI prompting. Standardized narrative structures, content formats, and design rules ensure a coherent brand experience across platforms.`
        },
        {
          id: '4.1',
          title: '4.1 DQ CDS | Messaging & Narrative Framework',
          content: `Use the core flow to drive clarity and engagement across all formats:\n- Hook – Capture attention.\n- Context – Frame relevance/problem.\n- Value – Deliver the key benefit or outcome.\n- CTA – Direct the next action with urgency and clarity.`
        },
        {
          id: '4.2',
          title: '4.2 DQ CDS | Content Asset Templates (by Pillar)',
          content: `Templates provide fit-for-purpose starting points:\n\n- Thought Leadership: Explainer reels, whitepaper quotes, carousels.\n- Product Value: Walkthroughs, case studies, user reviews.\n- Brand Culture: Team reels, behind-the-scenes, storytelling videos.\n- Education: Mini tutorials, toolkit downloads, how-to carousels.\n- Community: Shoutouts, partner highlights, polls, event promos.`
        },
        {
          id: '4.3',
          title: '4.3 DQ CDS | Visual & Style Guides',
          content: `Maintain consistency and recognizability with the CDS visual system:\n- Brand colors/gradients: Midnight Navy, Silver Gray, warm neutrals.\n- Typography: Cormorant Garamond for hero text, Open Sans for body.\n- Image composition: Consistent lighting, minimal backdrops, organic framing.\n- Layout: Grid-based with wide margins and content-first hierarchy.\n- Animation: Minimalist transitions and linear reveals.\n- Emotional tone: Inspirational (Thought Leadership), practical (Education), intimate (Brand Culture).`
        },
        {
          id: '4.4',
          title: '4.4 DQ CDS | AI-Powered Production Tools',
          content: `Integrated tools accelerate production without sacrificing quality:\n\n- HeyGen – Script-to-video for animated explainers.\n- MidJourney – AI-generated image mood boards and compositions.\n- ChatGPT – Captioning, CTA generation, hooks, and script writing.\n- MagicPatterns – Creative layouts and brand-fit patterns.\n- Rocket/Lovable – Smart previews, design QA, A/B prompt testing, clarity scoring.\n- Notion Campaign Tracker, Canva Template Library, AI Prompt Library, Campaign Calendar Generator, UTM Tagging and Performance Dashboard, Platform Publishing Specs.`
        },
        {
          id: '5',
          title: '5. Stage 03 - Campaigns Execution',
          content: `Execution brings strategy and storytelling to market with technical precision, platform fluency, and agility. Synchronize creative, messaging, and media for cohesive, real-time audience experiences while monitoring signals for optimization.`
        },
        {
          id: '5.1',
          title: '5.1 Compilation & Programming',
          content: `Pre-launch readiness to ensure flawless delivery across touchpoints:\n- Organize assets in versioned folders per platform.\n- Tag assets with metadata and UTMs for analytics and attribution.\n- Finalize captions, hashtags, emojis, and links for tone and platform coherence.\n- QA visuals, copy, videos, and scripts for brand and technical compliance.`
        },
        {
          id: '5.2',
          title: '5.2 Deployment Checklist',
          content: `Guide precise go-live:\n- Automated scheduling (e.g., Simplified) for timed, coordinated publishing.\n- Manual native posting for formats not supported by automation.\n- Cross-link assets to guide users across channels and journeys.\n- Compliance and verification alerts to confirm successful publication.\n- Live engagement monitoring to respond and boost signals.`
        },
        {
          id: '5.3',
          title: '5.3 Mid-Campaign Adjustments',
          content: `Optimize during the campaign window:\n- Creative refresh for low-performing hooks/CTAs.\n- Smart retargeting to high-performing segments or alternate formats.\n- Format remixing (Stories, Shorts, bite-sized Reels).\n- Audience expansion via new segments, geo-variants, or localized messaging.`
        },
        {
          id: '6',
          title: '6. Stage 04 - Campaigns Governance',
          content: `Governance turns campaigns into repeatable success models through structured performance tracking, quality assurance, and learning loops. It embeds accountability and data-driven decisions across messaging, design, and delivery.`
        },
        {
          id: '6.1',
          title: '6.1 KPI Model by Pillar',
          content: `Measure outcomes aligned to pillar intent:\n- Thought Leadership: Shares, reach, saves, reposts.\n- Product Value: CTR, conversions, engagement time.\n- Brand Culture: Reactions, comments, reposts.\n- Education: Completion rate, downloads, saves.\n- Community: RSVPs, tagging, DMs, poll responses.`
        },
        {
          id: '6.2',
          title: '6.2 Campaign Review Template',
          content: `Post-campaign review for actionable insights:\n- Results vs objectives.\n- Top-performing assets.\n- Audience feedback themes.\n- Visual and tone resonance.\n- Budget use and ROI.\n- Lessons learned and pillar impact.`
        },
        {
          id: '6.3',
          title: '6.3 Monthly Quality Review',
          content: `Cross-functional review (Head of Content, CES, Design Leads) to assess messaging, visuals, tone, and platform impact; map assets to pillars; log improvements; and evolve frameworks, prompts, and QA checklists.`
        },
        {
          id: '7',
          title: '7. Appendix | Templates and Style Guides',
          content: `Supporting tools and references: Campaign Brief Template, DQ Campaign Canvas, KPI Scorecard, Creative Request Form, Post-Campaign Review Template, Monthly Quality Review Rubric, Creative Clinic Worksheets, QA Checklists, and pillar style guides for narrative tone, emotional style, visual style, and do/don't guidance. Also includes DQ DXP integration approach for content, engagement, tracking, and analytics across the stack (Simplified.AI, React site, Headless CMS, Dynamics 365, Power Automate, GTM/UTM, Segment, Clarity, analytics dashboards).`
        }
      ]
    },
    tags: ['CDS', 'Campaigns', 'Marketing'],
    imageUrl: '/images/design service card image.PNG'
  }
];
