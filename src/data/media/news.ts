export type NewsItem = {
  id: string;
  title: string;
  type: 'Announcement' | 'Guidelines' | 'Notice' | 'Thought Leadership';
  date: string;
  author: string;
  byline?: string;
  views: number;
  excerpt: string;
  image?: string;
  department?: string;
  location?: 'Dubai' | 'Nairobi' | 'Riyadh' | 'Remote';
  domain?: 'Technology' | 'Business' | 'People' | 'Operations';
  theme?: 'Leadership' | 'Delivery' | 'Culture' | 'DTMF';
  tags?: string[];
  readingTime?: '<5' | '5–10' | '10–20' | '20+';
  newsType?: 'Policy Update' | 'Upcoming Events' | 'Company News' | 'Holidays';
  newsSource?: 'DQ Leadership' | 'DQ Operations' | 'DQ Communications';
  focusArea?: 'GHC' | 'DWS' | 'Culture & People';
  content?: string; // Full article content for detail pages
  format?: 'Blog' | 'Article' | 'Research Report'; // Format type for blogs
  source?: string; // Source/provider name (e.g., DigitalQatalyst, ADGM Academy)
};

export const NEWS: NewsItem[] = [
  {
    id: 'dq-townhall-meeting-agenda',
    title: 'DQ Townhall Meeting Agenda',
    type: 'Announcement',
    date: '2025-11-21',
    author: 'Irene Musyoki',
    byline: 'DQ Operations',
    views: 0,
    excerpt:
      'Join us for the upcoming DQ Townhall meeting featuring working room guidelines, Scrum Master framework discussions, and important organizational updates.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    department: 'DQ Operations',
    location: 'Dubai',
    domain: 'Operations',
    tags: ['townhall', 'meeting', 'agenda', 'framework'],
    readingTime: '5–10',
    newsType: 'Upcoming Events',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Townhall Meeting Agenda

## Welcome & Introduction

Join us for an informative and engaging DQ Townhall meeting where we'll discuss important updates, share insights, and align on our organizational goals and practices.

## Working Room Guidelines

**Presenter: Sreya L.**

This session will cover essential guidelines for working rooms and collaborative spaces. Topics include:
- Best practices for room usage and booking
- Maintenance and cleanliness standards
- Collaboration etiquette and respect for shared spaces
- Optimizing workspace utilization for maximum productivity

## Scrum Master Framework

**Presenter: Sreya L.**

An in-depth exploration of the Scrum Master framework and its implementation within DQ:
- Core principles and values of Scrum
- Roles and responsibilities within the framework
- Sprint planning and execution best practices
- Continuous improvement and retrospective processes
- How Scrum enhances team collaboration and delivery

## Meeting Objectives

This townhall aims to:
- Align all associates on working room protocols
- Deepen understanding of Agile and Scrum methodologies
- Foster a culture of collaboration and continuous improvement
- Provide a platform for questions and discussion

## Important Notes

- Please arrive on time to ensure we can cover all agenda items
- Questions and discussions are encouraged during designated Q&A segments
- Meeting materials and recordings will be shared following the session`
  },
  {
    id: 'dq-leave-process-guideline',
    title: 'DQ Leave Process Guidelines',
    type: 'Guidelines',
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt:
      'Complete guide to the leave approval process, including required steps, notification procedures, and consequences for non-compliance.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    tags: ['leave', 'guidelines', 'policy', 'HRA'],
    readingTime: '5–10',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Leave Process Guideline

## Leave Process

### Step 1: Obtain Approval from HRA & Management
Obtain approval from HRA & Management, clearly indicating:
- **Reason for leave**: Specify the purpose of your leave
- **Leave period**: Include start and end dates
- **Associates covering critical tasks**: Identify who will cover your responsibilities during your absence

### Step 2: Submit an Approval Request
Log into the system and submit your leave request through the designated platform.

### Step 3: Notify via the HR Channel
Share a brief notification in the designated HR channel to inform relevant parties of your leave request.

### Step 4: Confirm Approval Status
**Important**: Wait for confirmation that your leave has been approved before proceeding with any leave arrangements.

### Step 5: Notify via the Leaves Channel
Once approved, post an update in the Leaves channel for broader visibility across the organization.

## Leave Non-Compliance Consequences

### Recorded Violation
Any leave taken without prior approval or proper handover is documented as a violation.

### Warnings System
- **First instance**: Formal warning issued
- **Second instance**: Formal warning issued
- **Third instance**: Final warning and escalation to HR & Management

### Termination
Three violations may result in termination of employment.

## Important Reminder
**Approval Requirement**: All leave must be approved by HRA and Management to ensure fairness and compliance with company policies.`
  },
  // Blog and Article items from screenshots
  {
    id: 'compute-nationalism-rise',
    title: 'Are We Watching the Rise of Compute Nationalism?',
    type: 'Thought Leadership',
    date: '2025-12-15',
    author: 'DigitalQatalyst',
    byline: 'DigitalQatalyst',
    views: 124,
    excerpt: 'As nations compete for AI supremacy, compute resources are becoming the new strategic battleground. What does this mean for global innovation and digital sovereignty?',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    content: `# Are We Watching the Rise of Compute Nationalism?

## The New Strategic Battleground

As artificial intelligence becomes the defining technology of our era, a new form of geopolitical competition is emerging: **compute nationalism**. Nations are increasingly viewing computational resources—the infrastructure that powers AI—as strategic assets, much like oil reserves or military capabilities.

## What is Compute Nationalism?

Compute nationalism refers to the trend where countries prioritize building, controlling, and protecting their own computational infrastructure and AI capabilities. This includes:

- **Data Centers**: Massive facilities housing AI training infrastructure
- **Semiconductor Manufacturing**: Control over chip production
- **AI Research**: National investments in AI development
- **Data Sovereignty**: Policies ensuring data stays within national borders

## The Global Landscape

### United States
The U.S. maintains dominance through companies like NVIDIA, Google, and Microsoft, but faces challenges in semiconductor manufacturing and increasing competition from China.

### China
China is investing heavily in domestic AI infrastructure, with companies like Alibaba and Tencent building massive compute clusters. The country aims for AI self-sufficiency by 2030.

### European Union
The EU is pursuing "digital sovereignty" through initiatives like the European AI Act and investments in homegrown AI capabilities, though it lags behind in compute infrastructure.

### Emerging Economies
Countries in Africa, Southeast Asia, and Latin America face the risk of being left behind, unable to afford the massive investments required for AI infrastructure.

## Implications for Innovation

### Positive Aspects
- **National Security**: Reduced dependence on foreign technology
- **Economic Development**: Job creation and technological advancement
- **Strategic Autonomy**: Ability to develop AI aligned with national values

### Challenges
- **Fragmentation**: Risk of creating isolated AI ecosystems
- **Inequality**: Widening gap between compute-rich and compute-poor nations
- **Innovation Slowdown**: Reduced collaboration across borders

## The Path Forward

The rise of compute nationalism is inevitable, but its impact depends on how nations balance competition with collaboration. The challenge is ensuring that AI development benefits humanity as a whole, not just the nations that can afford it.

## Key Takeaways

1. Compute resources are becoming as strategically important as energy resources
2. Nations are investing heavily in domestic AI infrastructure
3. This trend risks creating a "compute divide" between nations
4. International cooperation remains essential for addressing global challenges
5. Emerging economies need support to participate in the AI revolution

---

*The future of AI will be shaped not just by algorithms, but by who controls the computational infrastructure that powers them.*`
  },
  {
    id: 'dq-storybook-live',
    title: 'From Vision to Impact: The DQ Storybook Goes Live!',
    type: 'Announcement',
    date: '2024-08-14',
    author: 'Irene Musyoki',
    views: 75,
    excerpt: 'We’re excited to announce that the DQ Story is now officially published on the DQ Competencies page…',
    department: 'Products',
    location: 'Dubai',
    domain: 'Business',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'GHC'
  },
  {
    id: 'beijing-ai-superstate',
    title: "Is Beijing Building the World's First AI Superstate?",
    type: 'Thought Leadership',
    date: '2025-12-12',
    author: 'DigitalQatalyst',
    byline: 'DigitalQatalyst',
    views: 98,
    excerpt: 'China is integrating AI into every aspect of governance, from traffic management to social credit systems. Is this the future of statecraft?',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    content: `# Is Beijing Building the World's First AI Superstate?

## The Vision of AI-Integrated Governance

China is pursuing an ambitious vision: integrating artificial intelligence into every layer of government and society. From smart city infrastructure to social credit systems, Beijing is building what some call the world's first "AI superstate."

## What Makes an AI Superstate?

An AI superstate is characterized by:

- **Comprehensive Data Collection**: Sensors and systems gathering data on every aspect of life
- **AI-Driven Decision Making**: Algorithms making or influencing policy decisions
- **Predictive Governance**: Using AI to anticipate and prevent problems
- **Integrated Systems**: AI connecting all aspects of government and society

## China's AI Infrastructure

### Smart Cities
Chinese cities are deploying thousands of cameras, sensors, and AI systems to manage traffic, monitor public safety, and optimize urban services.

### Social Credit System
A controversial system that uses AI to score citizens based on behavior, affecting access to services and opportunities.

### AI in Healthcare
Massive deployment of AI for medical diagnosis, drug discovery, and public health monitoring.

### Economic Planning
AI systems analyzing economic data to guide policy decisions and resource allocation.

## The Global Response

### Concerns
- **Privacy**: Massive surveillance and data collection
- **Autonomy**: Reduced individual freedom and choice
- **Bias**: AI systems reflecting and amplifying existing biases
- **Control**: Centralized power in the hands of the state

### Opportunities
- **Efficiency**: Optimized resource allocation and service delivery
- **Innovation**: Rapid deployment of new technologies
- **Problem-Solving**: AI helping address complex societal challenges

## The Future of Governance

The question isn't whether AI will transform governance—it's how. China's experiment with AI superstate governance offers both a vision and a warning. The challenge for democracies is to harness AI's benefits while preserving individual rights and democratic values.

## Key Takeaways

1. China is integrating AI into governance at an unprecedented scale
2. This raises questions about privacy, autonomy, and democratic values
3. Other nations are watching and learning from China's approach
4. The balance between efficiency and freedom is the central challenge
5. The future of governance will be shaped by how we deploy AI

---

*The AI superstate may be coming. The question is: what kind of superstate do we want?*`
  },
  {
    id: 'traditional-business-models-doomed',
    title: "Why Traditional Business Models Are Doomed in the Age of Cognitive...",
    type: 'Thought Leadership',
    date: '2025-12-10',
    author: 'DigitalQatalyst',
    byline: 'DigitalQatalyst',
    views: 156,
    excerpt: 'As AI and cognitive technologies reshape industries, traditional business models built on linear processes and human-only decision-making are becoming obsolete.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    format: 'Article',
    source: 'DigitalQatalyst',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    content: `# Why Traditional Business Models Are Doomed in the Age of Cognitive Technologies

## The Cognitive Revolution

We're entering an era where AI and cognitive technologies are not just tools, but fundamental components of how businesses operate. Traditional business models, built for a pre-AI world, are struggling to adapt.

## What Makes Traditional Models Obsolete?

### Linear Processes
Traditional businesses rely on sequential, linear processes. AI enables parallel, adaptive workflows that can respond in real-time to changing conditions.

### Human-Only Decision Making
Decisions were made by humans based on limited information. AI systems can process vast amounts of data and identify patterns humans cannot see.

### Fixed Structures
Traditional organizations have rigid hierarchies and fixed roles. Cognitive technologies enable fluid, adaptive organizational structures.

### Reactive Operations
Businesses react to problems after they occur. AI enables predictive and proactive operations.

## The New Business Model

### Cognitive-Augmented Operations
Every process enhanced by AI, from customer service to supply chain management.

### Data-Driven Everything
Decisions based on real-time data analysis, not intuition or tradition.

### Continuous Adaptation
Organizations that learn and evolve continuously, not just during annual planning cycles.

### Human-AI Collaboration
Humans and AI working together, each doing what they do best.

## Industries at Risk

- **Retail**: Traditional stores vs. AI-powered e-commerce
- **Finance**: Human advisors vs. robo-advisors
- **Healthcare**: Doctor-only diagnosis vs. AI-assisted medicine
- **Manufacturing**: Fixed production lines vs. adaptive AI systems

## The Path Forward

Organizations must:
1. **Embrace AI**: Not as a tool, but as a core capability
2. **Rethink Processes**: Design for AI-human collaboration
3. **Cultivate Learning**: Become organizations that learn continuously
4. **Focus on Value**: Use AI to create new value, not just automate old processes

## Key Takeaways

1. Traditional business models are incompatible with cognitive technologies
2. AI requires fundamental rethinking of how businesses operate
3. The most successful organizations will be those that adapt fastest
4. Human-AI collaboration is the future, not human replacement
5. Continuous learning and adaptation are now competitive advantages

---

*The question isn't whether your business model will change—it's whether you'll lead that change or be left behind.*`
  },
  {
    id: 'digital-transformation-dead',
    title: 'Traditional Digital Transformation is Dead: Meet the Future of Business',
    type: 'Thought Leadership',
    date: '2025-12-08',
    author: 'DigitalQatalyst',
    byline: 'DigitalQatalyst',
    views: 142,
    excerpt: 'The old approach to digital transformation—digitizing existing processes—is obsolete. The future belongs to organizations that fundamentally reimagine their business models.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    format: 'Article',
    source: 'DigitalQatalyst',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    content: `# Traditional Digital Transformation is Dead: Meet the Future of Business

## The End of Digitization

For decades, "digital transformation" meant taking existing processes and making them digital. This approach is now obsolete. Simply digitizing old ways of working doesn't create competitive advantage—it creates digital versions of obsolete processes.

## Why Traditional Digital Transformation Fails

### Incremental Thinking
Traditional transformation focuses on incremental improvements to existing processes, missing opportunities for fundamental innovation.

### Technology-First Approach
Organizations invest in technology without rethinking their business model, leading to expensive systems that don't deliver value.

### Resistance to Change
Employees and processes resist new technologies because they're designed to replace, not enhance, human work.

### Siloed Implementation
Digital initiatives happen in isolation, creating disconnected systems and missed opportunities.

## The New Approach: Business Model Innovation

### Start with Value
Begin by asking: What value can we create that wasn't possible before? Not: How do we digitize what we do now?

### Reimagine Processes
Don't digitize existing processes—design new processes that leverage digital capabilities.

### Human-Centric Design
Design systems that enhance human capabilities, not replace them.

### Ecosystem Thinking
Think beyond your organization to the entire ecosystem of partners, customers, and stakeholders.

## Examples of True Transformation

### Netflix
Didn't digitize video rental—reimagined entertainment consumption entirely.

### Amazon
Didn't digitize retail—created a new model of commerce and logistics.

### Tesla
Didn't digitize car manufacturing—reimagined transportation and energy.

## The Transformation Framework

1. **Vision**: What's the future state we're creating?
2. **Value**: What unique value can we deliver?
3. **Model**: What business model enables this value?
4. **Capabilities**: What capabilities do we need?
5. **Technology**: What technology enables these capabilities?

## Key Takeaways

1. Traditional digital transformation is obsolete
2. Success requires reimagining business models, not digitizing processes
3. Start with value creation, not technology implementation
4. Design for human-AI collaboration
5. Think in ecosystems, not silos

---

*The future belongs to organizations that don't just transform digitally, but fundamentally reimagine what's possible.*`
  },
  {
    id: 'traditional-organizations-obsolete',
    title: "Why Traditional Organizations Are Obsolete in Today's Digital Economy",
    type: 'Thought Leadership',
    date: '2025-12-05',
    author: 'DigitalQatalyst',
    byline: 'DigitalQatalyst',
    views: 118,
    excerpt: 'Hierarchical, siloed organizations designed for the industrial age cannot compete in a world of rapid change, AI, and digital ecosystems.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    format: 'Article',
    source: 'DigitalQatalyst',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    content: `# Why Traditional Organizations Are Obsolete in Today's Digital Economy

## The Industrial Age Organization

Traditional organizations were designed for the industrial age: stable markets, predictable demand, and linear processes. They're hierarchical, siloed, and optimized for efficiency in a world that no longer exists.

## Why They're Obsolete

### Too Slow
Hierarchical decision-making processes can't keep up with the pace of change in digital markets.

### Too Rigid
Fixed structures and processes can't adapt to rapidly changing conditions and opportunities.

### Too Siloed
Departmental boundaries prevent the cross-functional collaboration needed for innovation.

### Too Focused on Efficiency
Optimizing for efficiency in stable conditions misses opportunities for innovation and growth.

## The New Organizational Model

### Networks, Not Hierarchies
Organizations structured as networks of teams, not top-down hierarchies.

### Adaptive, Not Fixed
Structures that can reorganize quickly in response to opportunities and challenges.

### Collaborative, Not Siloed
Cross-functional teams working together on shared goals.

### Innovation-Focused
Optimizing for learning, experimentation, and innovation, not just efficiency.

## Characteristics of Modern Organizations

### Agile and Responsive
Able to pivot quickly in response to market changes and new opportunities.

### Data-Driven
Decisions based on real-time data and insights, not just experience and intuition.

### Customer-Centric
Organized around customer needs and experiences, not internal functions.

### Learning-Oriented
Designed to learn continuously and adapt based on what they discover.

## The Transformation Challenge

Most organizations face a fundamental challenge: they need to operate like a startup (agile, innovative) while maintaining the scale and resources of an established company.

## Key Takeaways

1. Traditional organizational structures are incompatible with digital economy
2. Success requires networks, not hierarchies
3. Adaptability is more important than efficiency
4. Collaboration across boundaries is essential
5. Continuous learning is a competitive advantage

---

*The organizations that thrive in the digital economy are those that can learn, adapt, and innovate faster than their competitors.*`
  },
  {
    id: 'europe-ethical-ai-compute',
    title: "Europe Wants Ethical AI. But Without Compute, Can It Compete?",
    type: 'Thought Leadership',
    date: '2025-12-03',
    author: 'DigitalQatalyst',
    byline: 'DigitalQatalyst',
    views: 89,
    excerpt: 'The EU has positioned itself as a leader in ethical AI regulation, but faces a critical challenge: can it compete globally without the compute infrastructure of the US and China?',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    content: `# Europe Wants Ethical AI. But Without Compute, Can It Compete?

## The European AI Paradox

The European Union has positioned itself as a global leader in ethical AI regulation through initiatives like the AI Act. However, Europe faces a critical challenge: it lacks the computational infrastructure needed to compete with the United States and China in AI development.

## The Compute Gap

### United States
Dominates through companies like Google, Microsoft, and NVIDIA, with massive data centers and AI research capabilities.

### China
Investing heavily in domestic AI infrastructure, with companies like Alibaba and Tencent building world-class compute capabilities.

### Europe
Lags significantly behind in compute infrastructure, despite having strong AI research institutions and regulatory frameworks.

## The Ethical AI Vision

Europe's approach emphasizes:
- **Human Rights**: AI systems that respect fundamental rights
- **Transparency**: Explainable and accountable AI
- **Privacy**: Strong data protection (GDPR)
- **Safety**: AI systems that are safe and reliable

## The Competitive Challenge

### The Dilemma
Can Europe maintain its ethical standards while competing globally? Or will it be forced to compromise ethics for competitiveness?

### The Risk
Without competitive AI capabilities, Europe risks:
- Economic dependence on US and Chinese AI
- Loss of technological sovereignty
- Inability to shape global AI standards

## Potential Solutions

### Investment in Compute
Massive investment in European AI infrastructure and data centers.

### Strategic Partnerships
Collaboration between European companies and institutions to pool resources.

### Focus on Niche Excellence
Specializing in areas where Europe has advantages (e.g., industrial AI, healthcare).

### Regulatory Leverage
Using market size to influence global AI development through regulation.

## The Path Forward

Europe faces a critical choice: invest heavily in compute infrastructure to compete globally, or accept a secondary role in AI development while maintaining ethical leadership.

## Key Takeaways

1. Europe leads in AI ethics but lags in compute infrastructure
2. The compute gap threatens European competitiveness
3. Investment in infrastructure is essential but expensive
4. Strategic partnerships and niche specialization offer alternatives
5. The balance between ethics and competitiveness is the central challenge

---

*Europe's AI future depends on whether it can bridge the compute gap while maintaining its ethical vision.*`
  },
  {
    id: 'ai-without-compute-global-south',
    title: 'AI Without Compute: Is the Global South Being Left Out of the New Digital...',
    type: 'Thought Leadership',
    date: '2025-12-08',
    author: 'DigitalQatalyst',
    byline: 'DigitalQatalyst',
    views: 203,
    excerpt: "There's a growing fear across Africa, Southeast Asia, and parts of Latin America: Is the AI revolution leaving them behind due to lack of computational resources?",
    image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80',
    format: 'Blog',
    source: 'DigitalQatalyst',
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC',
    content: `# AI Without Compute: Is the Global South Being Left Out of the New Digital Revolution?

## The Compute Divide

As artificial intelligence becomes the defining technology of our era, a new divide is emerging: between nations that have access to massive computational resources and those that don't. This "compute divide" threatens to leave the Global South—Africa, Southeast Asia, and parts of Latin America—behind in the AI revolution.

## The Scale of the Challenge

### The Cost Barrier
Training modern AI models requires:
- **Massive Data Centers**: Facilities costing billions of dollars
- **Specialized Hardware**: GPUs and TPUs that are expensive and in short supply
- **Energy Infrastructure**: Reliable, high-capacity power grids
- **Technical Expertise**: Teams of AI researchers and engineers

### The Reality
Most countries in the Global South lack:
- Sufficient capital for infrastructure investment
- Reliable energy infrastructure
- Access to cutting-edge hardware
- Large pools of AI talent

## The Consequences

### Economic Exclusion
Without AI capabilities, countries risk:
- Missing out on economic opportunities
- Becoming dependent on foreign AI services
- Losing technological sovereignty
- Falling further behind economically

### Innovation Gap
The inability to develop AI locally means:
- Limited ability to solve local problems with AI
- Dependence on solutions designed for other contexts
- Reduced innovation and entrepreneurship
- Brain drain as talent moves to compute-rich regions

## Potential Solutions

### Cloud-Based Access
Using cloud computing services to access AI capabilities without building infrastructure.

### Regional Collaboration
Countries pooling resources to build shared AI infrastructure.

### Focus on Applications
Concentrating on AI applications rather than model development.

### International Support
Development aid and partnerships to build AI capabilities.

## The Path Forward

The Global South faces a critical challenge: how to participate in the AI revolution without the massive resources available to the US, China, and Europe. The answer may lie in creative approaches that leverage cloud computing, regional collaboration, and a focus on solving local problems.

## Key Takeaways

1. The compute divide threatens to exclude the Global South from AI
2. Infrastructure costs are prohibitive for most developing countries
3. Economic and innovation consequences are severe
4. Creative solutions are needed to bridge the gap
5. International cooperation is essential

---

*The AI revolution must be global, or it will deepen existing inequalities.*`
  },
  {
    id: 'riyadh-horizon-hub',
    title: 'Riyadh Horizon Hub Opens for Cross-Studio Delivery',
    type: 'Announcement',
    date: '2024-07-20',
    author: 'Irene Musyoki',
    views: 61,
    excerpt:
      'The new Riyadh Horizon Hub is live—bringing Delivery, Platform, and People teams together to accelerate Saudi programs.',
    department: 'Delivery — Deploys',
    location: 'Riyadh',
    domain: 'Business',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'GHC'
  },
  {
    id: 'shifts-allocation-guidelines',
    title: 'Shifts Allocation Guidelines',
    type: 'Guidelines',
    date: '2024-07-25',
    author: 'Felicia Araba',
    views: 58,
    excerpt: 'New guidelines to enhance fairness and transparency for shifts allocation across teams…',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    department: 'DCO Operations',
    location: 'Dubai',
    domain: 'People',
    tags: ['shifts', 'allocation', 'scheduling', 'guidelines'],
    readingTime: '5–10',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'DWS'
  },
  {
    id: 'islamic-new-year',
    title: 'Honoring the Islamic New Year',
    type: 'Notice',
    date: '2024-06-27',
    author: 'DQ Communications',
    views: 63,
    excerpt:
      'A reflection on Al-Hijra 1447 AH—renewal, gratitude, and the values that ground our community…',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    newsType: 'Holidays',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People'
  },
  {
    id: 'dq-website-launch',
    title: 'DQ Corporate Website Launch!',
    type: 'Announcement',
    date: '2024-06-24',
    author: 'Irene Musyoki',
    views: 84,
    excerpt:
      'Our new DQ corporate website is live—packed with what makes DQ a leader in digital delivery…',
    department: 'Products',
    location: 'Remote',
    domain: 'Technology',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'DWS'
  },
  {
    id: 'po-dev-sync-guidelines',
    title: 'Product Owner & Dev Sync Guidelines',
    type: 'Guidelines',
    date: '2024-06-19',
    author: 'Felicia Araba',
    views: 70,
    excerpt:
      'Standardizing PO–Dev syncs for clarity, cadence, and decision-making across products…',
    department: 'DBP Delivery',
    location: 'Dubai',
    domain: 'Operations',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'DWS'
  },
  {
    id: 'azure-devops-task-guidelines',
    title: 'Azure DevOps Task Guidelines',
    type: 'Guidelines',
    date: '2024-06-12',
    author: 'Felicia Araba',
    views: 77,
    excerpt:
      'New task guidelines for ADO: naming, states, and flow so teams ship with less friction…',
    department: 'SecDevOps',
    location: 'Remote',
    domain: 'Technology',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'DWS'
  },
  {
    id: 'eid-al-adha',
    title: 'Blessed Eid al-Adha!',
    type: 'Notice',
    date: '2024-06-05',
    author: 'DQ Communications',
    views: 47,
    excerpt:
      'Warmest wishes to all observing Eid al-Adha—celebrating community and gratitude…',
    department: 'HRA (People)',
    location: 'Nairobi',
    domain: 'People',
    newsType: 'Holidays',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People'
  }
  ,
  {
    id: 'company-wide-lunch-break-schedule',
    title: 'DQ CHANGES | COMPANY-WIDE LUNCH BREAK SCHEDULE',
    type: 'Announcement',
    date: '2025-11-13',
    author: 'Irene Musyoki',
    byline: 'Corporate Comms',
    views: 0,
    excerpt:
      'Unified lunch break for all associates: 2:00 PM – 3:00 PM DXB Time. Please avoid meetings within this window (except emergencies).',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    location: 'Dubai',
    tags: ['policy', 'schedule', 'collaboration'],
    readingTime: '5–10',
    newsType: 'Policy Update',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
    content: `# Enhancing Collaboration Through Unified Scheduling

## Overview
To enhance collaboration and synchronize workflows across all studios, we are implementing a unified company-wide lunch break schedule.

## New Schedule Details
**Effective immediately**, the designated lunch break for all associates will be:
- **Time**: 2:00 PM – 3:00 PM Dubai (DXB) Time
- **Applies to**: All associates across all locations
- **Goal**: Create a common window for breaks, ensuring seamless collaboration

## Implementation Guidelines

### For All Associates
- Plan to take your lunch during this designated hour
- Ensure you are back online and available from 3:00 PM DXB Time
- Use this time to recharge and connect with colleagues

### For Meeting Organizers
- **Avoid scheduling meetings** during the 2:00 PM - 3:00 PM DXB Time block
- **Exception**: Critical emergency meetings that cannot be scheduled at any other time
- Consider time zone differences when planning cross-regional meetings

## Benefits of This Initiative
- **Improved Collaboration**: Synchronized break times across all teams
- **Better Work-Life Balance**: Dedicated time for proper meal breaks
- **Enhanced Productivity**: Refreshed teams returning to work together
- **Stronger Team Bonds**: Opportunities for informal interactions

## Questions?
For any questions or concerns about this new policy, please reach out to your local HR representative or contact DQ Communications directly.

Thank you for your cooperation in helping us build a more synchronized and efficient work environment.`
  },
  {
    id: 'grading-review-program-grp',
    title: 'DQ ADP | GRADING REVIEW PROGRAM (GRP)',
    type: 'Announcement',
    date: '2025-11-13',
    author: 'Irene Musyoki',
    byline: 'Corporate Comms',
    views: 0,
    excerpt:
      'Launch of the DQ Associate Grade Review Program to align associates to the SFIA-based grading scale; initial focus group led by Araba and Mercy Kyuma.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    tags: ['SFIA', 'grading', 'capability'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'Culture & People',
    content: `# DQ Associate Grade Review Program Launch

## Program Overview
We are pleased to announce the launch of the **DQ Associate Grade Review Program (GRP)**. This comprehensive initiative aims to ensure all associates are aligned to the DQ SFIA-based grading scale, reflecting both their competence levels and scope of responsibility.

## Leadership Team
The review will be led by:
- **Araba** - Program Lead
- **Mercy Kyuma** - Co-Lead & Assessment Coordinator

## Implementation Phases

### Phase 1: Initial Focus Group
- **Participants**: Approximately 10 selected associates
- **Duration**: 2-3 weeks
- **Purpose**: Pilot testing and process refinement
- **Communication**: Direct contact with selected participants

### Phase 2: Organization-wide Rollout
- **Scope**: All DQ associates across all locations
- **Timeline**: Following successful completion of Phase 1
- **Communication**: Comprehensive updates through this channel

## Review Process Types

### Level Confirmation
- Validation of current grading alignment
- Assessment of role responsibilities vs. current grade
- Documentation of competency evidence

### Upgrade Opportunities
- Identification of associates ready for advancement
- Skills gap analysis and development planning
- Clear pathway definition for progression

### Development-Focused Adjustments
- **Rare cases**: Temporary grade adjustments for enhanced learning
- **Purpose**: Accelerated skill development and organizational growth
- **Support**: Additional mentoring and development resources

## SFIA Framework Integration
Our grading system is built on the **Skills Framework for the Information Age (SFIA)**, ensuring:
- **Industry Standards**: Alignment with global best practices
- **Clear Progression**: Defined competency levels and career paths
- **Objective Assessment**: Standardized evaluation criteria
- **Professional Growth**: Structured development opportunities

## Benefits for Associates
- **Transparent Career Progression**: Clear understanding of advancement criteria
- **Fair Compensation**: Grading aligned with market standards and responsibilities
- **Skill Development**: Targeted learning and growth opportunities
- **Professional Recognition**: Formal acknowledgment of competencies and contributions

## Next Steps
1. **Phase 1 participants** will be contacted directly within the next week
2. **All associates** will receive detailed information packets
3. **Managers** will be briefed on the assessment process and timeline
4. **Regular updates** will be shared through this communication channel

## Questions & Support
For questions about the GRP program, please contact:
- **HR Team**: Your local HR representative
- **Program Leads**: Araba or Mercy Kyuma
- **DQ Communications**: For general program information

We are committed to maintaining transparent, fair, and consistent grading standards that support both individual growth and organizational excellence.

*More details will follow as we progress through the program phases. Stay tuned for updates!*`
  },
  {
    id: 'dq-wfh-guidelines',
    title: 'DQ WFH Guidelines',
    type: 'Guidelines',
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt:
      'Work From Home (WFH) guidelines outlining purpose, roles, processes, tools, KPIs, and compliance for remote work across DQ.',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80',
    department: 'HRA (People)',
    location: 'Remote',
    domain: 'People',
    tags: ['WFH', 'guidelines', 'policy'],
    readingTime: '10–20',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Work From Home (WFH) Guidelines

## WFH Guideline Overview
The **Work From Home (WFH) Guidelines** provide a clear framework for how remote work is requested, approved, executed, and monitored across DQ. Each section below is designed to keep productivity, accountability, and culture intact while associates are working remotely.

## 1. Purpose and Scope

### Purpose
- Provide structured, standardized processes for WFH implementation, approval, and management.
- Promote accountability, productivity, and collaboration.
- Maintain operational efficiency, cultural alignment, and compliance with company standards.

### Scope
- Applies to **all DQ Associates**.
- Covers the end-to-end process of requesting, approving, monitoring, and reporting WFH arrangements.

## 2. Roles and Responsibilities

### Associate
- Submit WFH requests at least **24 hours in advance** via the HR Channel, with reason and date(s).
- Post daily action updates and relevant channel engagement links in the HR Channel.
- Remain active and visible on **DQ Live24** during working hours.

### Line Manager
- Review and provide **pre-approval** for WFH requests based on operational needs.
- Monitor deliverables and ensure accountability for remote work.
- Provide feedback and flag repeated non-compliance to HR.

### Human Resources (HR)
- Provide **final approval** for all WFH requests once Line Manager pre-approval is confirmed.
- Ensure requests align with policy and are consistent across departments.

### HR & Administration (HRA)
- Oversee overall compliance and adherence to the WFH guidelines.

## 3. Guiding Principles and Controls

- **Transparency** – All WFH activities, updates, and deliverables are visible to key stakeholders.
- **Accountability** – Associates remain responsible for deliverables, timelines, and communication.
- **Equity and Fairness** – Approvals are objective and based on role, performance, and continuity.
- **Compliance and Discipline** – Adhere to WFH policies, timelines, and workflows.
- **Collaboration and Communication** – Use approved tools and maintain active engagement.
- **Data Security and Confidentiality** – Protect company data when working remotely.

## 4. WFH Processes

1. **Submit request** – Associate submits WFH request at least 24 hours in advance via the HR Channel, including reason, dates, and expected working hours.
2. **Line Manager pre-approval** – Line Manager reviews impact on workload and coverage, then pre-approves or requests changes.
3. **HR final approval** – HR verifies compliance, records the decision, and notifies Associate and Line Manager.
4. **Post the day plan** – On the WFH day, Associate creates a thread in the HR Channel before work starts with actions for the day and engagement links.
5. **Clock-in & presence** – Associate clocks in on **DQ Shifts** and stays active on **DQ Live24**.
6. **Work execution & communication** – Follow the day plan, provide regular updates, respond promptly, and attend all calls.
7. **Record deliverables** – At end of day, Associate posts completed tasks, outstanding items, and blockers in the HR thread.
8. **Monitoring & compliance** – HRA and Line Manager monitor adherence; repeated non-compliance triggers formal review.
9. **Escalation & follow-up** – Failure to post updates or remain active on DQ Live24 may be treated as an unpaid workday and can lead to revocation of WFH privileges or performance review.

## 5. Tools and Resources

- **DQ Live24** – Visibility and communication.
- **DQ Logistics Channel** – Sharing approved WFH schedules.
- **HR Portal** – Submitting requests and tracking WFH history.

## 6. Key Performance Indicators (KPIs)

- **Timely Submission** – 100% of WFH requests submitted at least 24 hours in advance.
- **Approval Compliance** – 100% adherence to the approval workflow.
- **Visibility Compliance** – 100% of approved WFH associates post daily actions and engagement links.
- **Attendance Accuracy** – 100% of WFH attendance tracked via DQ Shifts and DQ Live24.
- **Policy Adherence** – Zero unapproved or non-compliant WFH cases per review cycle.
- **Performance Consistency** – Productivity maintained at in-office levels.

## 7. Compliance and Governance

- All WFH requests must follow the 24-hour advance notice rule with Line Manager pre-approval and HR final approval.
- Associates must post daily actions and engagement links; failure to do so may result in the day being treated as unpaid.
- WFH attendance must be logged through DQ Live24 for verification.
- HRA monitors adherence, consistency, and reports non-compliance cases.

## 8. Review and Update Schedule

- **Quarterly Review** – HR and Admin review guidelines every three months.
- **Ad-hoc Updates** – Additional updates may be made when gaps or improvements are identified.

## 9. Appendix and References

- Appendix A – WFH Request Template.
- Appendix B – DQ Shifts Attendance Guide.
- Appendix C – Remote Work Security Checklist.

## Need Help? Contact the Team

**Key Contacts**
- **Pelagie Njiki** – CoE Lead
- **Mauline Wangui** – TechOps Coordinator
- **Martin Wambugu** – Content & Marketing Analyst
`,
  },
  {
    id: 'dq-dress-code-guideline',
    title: 'DQ Dress Code Guidelines',
    type: 'Guidelines',
    date: '2025-11-18',
    author: 'Felicia Araba',
    byline: 'HRA (People)',
    views: 0,
    excerpt:
      'Dress code guideline balancing professionalism and comfort across the work week, with clear expectations, exceptions, and consequences.',
    // Image shows a professional group of 2 men and 1 woman in official black suits
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    department: 'HRA (People)',
    location: 'Dubai',
    domain: 'People',
    tags: ['dress code', 'guidelines', 'policy'],
    readingTime: '10–20',
    newsType: 'Policy Update',
    newsSource: 'DQ Operations',
    focusArea: 'Culture & People',
    content: `# DQ Dress Code Guideline (Version 1.0)

## Context
At **DigitalQatalyst (DQ)**, professional appearance shapes how our brand is perceived, supports personal confidence, and creates an environment where associates feel comfortable and productive. This guideline sets expectations for attire so we strike the right balance between professionalism and comfort.

## Purpose
These dress code guidelines ensure associates align with DQ's culture of professionalism while allowing flexibility for creativity and comfort. The standard is **business casual Monday–Thursday** with a more relaxed **Casual Friday**, adapted for the diverse nature of work at DQ.

## Key Characteristics

- **Professional Appearance** – Associates dress in a professional, decent, and clean manner; clothing should enhance DQ's image.
- **Cultural Sensitivity** – Outfits should be respectful of cultural and religious norms.
- **Personal Grooming** – Hair, nails, and hygiene are maintained to a high standard. Fragrances, jewelry, and accessories should not distract from the professional setting.

## Dress Code Details

### Monday to Thursday – Business Casual

- **Men**
  - Well-fitted button-down shirt or polo
  - Tailored trousers, khakis, or chinos
  - Closed-toe shoes such as loafers or formal shoes

- **Women**
  - Blouse or sweater with tailored pants or skirt
  - Knee-length professional skirt or dress
  - Closed-toe shoes (flats or heels)

### Friday – Casual

- **Men**
  - Polo shirts or casual button-down shirts
  - Clean, well-fitted jeans
  - Casual shoes, sneakers, or loafers

- **Women**
  - Casual blouses or t‑shirts with jeans or casual skirt/dress
  - Comfortable, casual closed shoes or sneakers

## Preparation Before Implementation

Before rolling out the dress code:

- **Communicate Dress Code** – Send formal communication via Teams explaining the guideline and effective date.
- **Provide Visuals** – Share example images of acceptable business casual and Casual Friday outfits for men and women.
- **Clarify Exceptions** – Highlight how medical or other special cases will be handled.

## Guidelines During Workdays

- Associates are expected to follow the dress code **every working day** (business casual Monday–Thursday, casual on Friday).
- **Team Leads** oversee compliance within their teams and address non-compliance promptly.
- **HRA** holds overall responsibility for monitoring and enforcing these guidelines.

### Non-Compliance and Escalation

Failure to comply with the dress code may result in:

1. **Verbal warning** – Direct message to the associate.
2. **Written warning** – Formal note placed on the associate's HR channel.
3. **Further disciplinary action** – May include suspension or other actions as deemed appropriate.

Associates and leaders are jointly responsible for ensuring the guideline is understood and consistently applied.

## Special Considerations

- **Client-Facing Meetings** – More formal business attire may be required; guidance will be communicated in advance.
- **Company Events or Presentations** – Formal business attire is required.
- **Extreme Weather** – Attire may be adjusted for comfort while staying within professional bounds.
- **Medical Exceptions** – Reasonable adjustments can be made for medical reasons; these should be discussed confidentially with HR.

## Prohibited Attire

The following are **strictly prohibited** during working days:

- Ripped jeans
- Graphic t‑shirts or overly casual tops
- Beachwear, sweatpants, gym wear, or shorts
- Flip-flops, sandals, or other overly casual footwear

## Post-Implementation Review

### Monitor Compliance
- Conduct occasional reviews to ensure the dress code is being followed across teams and locations.

### Recognition and Rewards
- **Best Dressed Award** – Recognise associates who consistently model the dress code.
- **Most Improved Award** – Appreciate associates who show clear improvement in adherence.

These recognitions help reinforce the guideline in a positive, motivating way.

### Adjust Guidelines as Needed
- Collect feedback and update the guideline where aspects prove unclear, impractical, or misaligned with DQ culture.

## Visuals and Examples

- **Business Casual** – Button-up shirt, slacks, blazer (men); blouse and pencil skirt or knee-length dress with flats or heels (women).
- **Casual Fridays** – Polo shirt and jeans with casual shoes (men); casual top with jeans and flats/sneakers (women). Always maintain neat, non-revealing, and culturally respectful outfits.

Where in doubt, associates should choose the more professional option and consult HR or their Line Manager for clarification.
`,
  },
  {
    id: 'dq-storybook-latest-links',
    title: 'DQ Storybook — Latest Version and Links',
    type: 'Announcement',
    date: '2025-11-13',
    author: 'Irene Musyoki',
    views: 0,
    excerpt:
      'Explore the latest DQ Storybook and quick links to GHC elements including Vision, HoV, Persona, Agile TMS/SoS/Flows, and 6xD.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    domain: 'Business',
    tags: ['story', 'GHC', 'references'],
    readingTime: '5–10',
    newsType: 'Company News',
    newsSource: 'DQ Communications',
    focusArea: 'GHC',
    content: `# DQ Storybook — Latest Version and Quick Reference Links

## Introduction
Here's the latest version of the **DQ Storybook** — our evolving narrative that brings the Golden Honeycomb of Competencies (GHC) to life. We're continuing to shape and refine this Storybook, so keep an eye out for new updates and deep dives in the coming weeks.

## Main Storybook Access
**[DQ Storybook: Complete Guide](https://dq-storybook.example.com)**
*Your comprehensive resource for understanding DQ's methodology, culture, and operational excellence.*

---

## Quick Reference Links

### 01. DQ Vision (Purpose)
**[Access DQ Vision →](https://dq-vision.example.com)**
- Our foundational purpose and strategic direction
- Long-term goals and organizational mission
- Vision alignment across all business units

### 02. DQ HoV (Culture)
**[Explore House of Values →](https://dq-hov.example.com)**
- Core values that guide our daily operations
- Cultural principles and behavioral expectations
- Team collaboration and ethical standards

### 03. DQ Persona (Identity)
**[Discover DQ Persona →](https://dq-persona.example.com)**
- Our unique organizational identity and brand
- Professional characteristics and market positioning
- Client interaction and service delivery standards

### 04. Agile TMS (Tasks)
**[View Task Management System →](https://dq-tms.example.com)**
- Agile task organization and workflow management
- Sprint planning and execution methodologies
- Performance tracking and delivery metrics

### 05. Agile SoS (Governance)
**[Access Scrum of Scrums →](https://dq-sos.example.com)**
- Cross-team coordination and governance structures
- Escalation procedures and decision-making frameworks
- Inter-departmental communication protocols

### 06. Agile Flows (Value Streams)
**[Explore Value Streams →](https://dq-flows.example.com)**
- End-to-end value delivery processes
- Customer journey mapping and optimization
- Continuous improvement methodologies

### 07. Agile 6xD (Products)
**[Discover 6xD Framework →](https://dq-6xd.example.com)**
*Link to be updated - Coming Soon*
- Six-dimensional product development approach
- Innovation frameworks and delivery excellence
- Product lifecycle management and optimization

---

## How to Use These Resources

### For New Team Members
1. **Start with DQ Vision** to understand our purpose
2. **Review HoV** to align with our cultural values
3. **Explore DQ Persona** to understand our identity
4. **Dive into operational frameworks** (TMS, SoS, Flows, 6xD)

### For Existing Associates
- **Regular Reference**: Bookmark these links for quick access
- **Team Meetings**: Use these resources to align discussions
- **Client Presentations**: Reference our methodologies and approaches
- **Professional Development**: Deepen your understanding of DQ excellence

### For Project Teams
- **Project Kickoffs**: Align on DQ methodologies and standards
- **Sprint Planning**: Reference TMS and Flows for optimal delivery
- **Stakeholder Communication**: Use Persona and Vision for consistent messaging

## Updates and Maintenance
- **Regular Updates**: Content is refreshed bi-weekly
- **Feedback Welcome**: Submit suggestions through DQ Communications
- **Version Control**: All changes are tracked and communicated
- **Mobile Optimization**: All links are mobile-friendly for on-the-go access

## Support and Questions
For questions about any of these resources or to request additional documentation:
- **DQ Communications Team**: [communications@dq.com](mailto:communications@dq.com)
- **Internal Slack**: #dq-storybook-support
- **Knowledge Base**: [help.dq.com](https://help.dq.com)

---

*Keep this reference handy for quick access to all DQ frameworks and methodologies. Together, we continue to build excellence through shared knowledge and consistent application of our proven approaches.*`
  },
  {
    id: 'dq-scrum-master-structure-update',
    title: 'DQ Changes: Updated Scrum Master Structure',
    type: 'Announcement',
    date: '2025-11-27',
    author: 'Felicia Araba',
    views: 0,
    excerpt:
      'As part of our organizational optimization, we are updating the Scrum Master structure to better align with our delivery framework and enhance team effectiveness.',
    department: 'Operations',
    location: 'Remote',
    domain: 'Operations',
    theme: 'Delivery',
    tags: ['Scrum Master', 'Organizational Structure', 'Leadership'],
    readingTime: '10–20',
    newsType: 'Company News',
    newsSource: 'DQ Leadership',
    focusArea: 'Culture & People',
    content: `# DQ Changes: Updated Scrum Master Structure

## Overview
As part of our organizational optimization, we are updating the Scrum Master structure to better align with our delivery framework and enhance team effectiveness.

## Key Changes
- Updated Scrum Master roles and responsibilities
- Enhanced alignment with delivery framework
- Improved team collaboration and effectiveness
- Streamlined organizational structure

## Impact
This update will help us better serve our teams and improve our overall delivery capabilities.`
  }
];
