import GHCLanding from "./GHCLanding";
import type { LucideIcon } from "lucide-react";
import { Target, Brain, Layers, GitBranch, Users, Zap } from "lucide-react";

const SIXXD_CARDS = [
  {
    id: "de",
    number: 1,
    category: "Digital Economy",
    title: "Digital Economy (DE)",
    story:
      "Problem: Organisations react too late to shifts in value, markets, and customer behaviour. Response: DE reframes why change is necessary by grounding decisions in economic and market reality.",
    problem: "Organisations react too late to shifts in value, markets, and customer behaviour.",
    response: "DE reframes why change is necessary by grounding decisions in economic and market reality.",
    route: "/marketplace/guides/digital-economy",
    icon: Target as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770035368667-bfe10133-4bed-44c7-aefa-c6fed9c807f5.webp",
    ctaLabel: "Explore in Knowledge Center →",
  },
  {
    id: "dco",
    number: 2,
    category: "Digital Cognitive Organisation",
    title: "Digital Cognitive Organisation (DCO)",
    story:
      "Problem: Organisations can’t sense, decide, and adapt fast enough. Response: DCO defines the intelligent enterprise — adaptive, learning, and orchestrated.",
    problem: "Organisations can’t sense, decide, and adapt fast enough.",
    response: "DCO defines the intelligent enterprise — adaptive, learning, and orchestrated.",
    route: "/marketplace/guides/digital-cognitive-organisation",
    icon: Brain as LucideIcon,
    gradient: "bg-gradient-to-br from-[#1b2553] via-[#243a75] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770021175279-eacca42a-60ed-4c4d-9d14-e724a3e76cd6.png",
    ctaLabel: "Explore in Knowledge Center →",
  },
  {
    id: "dbp",
    number: 3,
    category: "Digital Business Platforms",
    title: "Digital Business Platforms (DBP)",
    story:
      "Problem: Fragmented systems slow delivery and block scale. Response: DBP creates modular, integrated platforms that make transformation resilient.",
    problem: "Fragmented systems slow delivery and block scale.",
    response: "DBP creates modular, integrated platforms that make transformation resilient.",
    route: "/marketplace/guides/digital-business-platforms",
    icon: Layers as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#30478a] to-[#f0f6ff]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770021424913-1f4da872-0e43-488d-b842-a0e724f6c2c4.png",
    ctaLabel: "Explore in Knowledge Center →",
  },
  {
    id: "dt2",
    number: 4,
    category: "Digital Transformation 2.0",
    title: "Digital Transformation 2.0 (DT2.0)",
    story:
      "Problem: Transformation efforts remain ad-hoc and unsustainable. Response: DT2.0 introduces design, flow, and governance to make change repeatable.",
    problem: "Transformation efforts remain ad-hoc and unsustainable.",
    response: "DT2.0 introduces design, flow, and governance to make change repeatable.",
    route: "/marketplace/guides/digital-transformation-2",
    icon: GitBranch as LucideIcon,
    gradient: "bg-gradient-to-br from-[#1b2553] via-[#3f528e] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770034932697-4c5808eb-ce02-4b4f-bb98-d02e0c693303.png",
    ctaLabel: "Explore in Knowledge Center →",
  },
  {
    id: "dwws",
    number: 5,
    category: "Digital Worker & Workspace",
    title: "Digital Worker & Workspace (DW:WS)",
    story:
      "Problem: People are asked to change without the tools or environments to support it. Response: DW:WS equips teams with roles, skills, and digital workspaces to deliver change.",
    problem: "People are asked to change without the tools or environments to support it.",
    response: "DW:WS equips teams with roles, skills, and digital workspaces to deliver change.",
    route: "/marketplace/guides/digital-worker-workspace",
    icon: Users as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770021849077-fe5f09ea-4467-4e4c-b1da-a46420d40712.png",
    ctaLabel: "Explore in Knowledge Center →",
  },
  {
    id: "accelerators",
    number: 6,
    category: "Digital Accelerators",
    title: "Digital Accelerators (Tools)",
    story:
      "Problem: Value takes too long to realise after decisions are made. Response: Accelerators compress time-to-value through tools that drive execution and alignment.",
    problem: "Value takes too long to realise after decisions are made.",
    response: "Accelerators compress time-to-value through tools that drive execution and alignment.",
    route: "/knowledge-center/products/digital-accelerators",
    icon: Zap as LucideIcon,
    gradient: "bg-gradient-to-br from-[#1b2553] via-[#243a75] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770025109470-b2166816-791e-4ee2-be27-3d57e1e1de96.png",
    ctaLabel: "Explore in Knowledge Center →",
  },
];

const SIXXD_FEATURES = [
  {
    title: "Designed for Reality",
    description: "Agile 6xD was built to handle shifting priorities, complexity, and continuous change.",
    icon: Target,
  },
  {
    title: "Built to Scale",
    description: "Transformation is structured as a system — not pilots that stall.",
    icon: Layers,
  },
  {
    title: "Six Connected Perspectives",
    description: "Each perspective answers a critical question organisations must face to stay relevant.",
    icon: GitBranch,
  },
];

const SIXXD_ACTIONS = [
  {
    title: "Learn by doing",
    icon: Layers,
    badge: "Courses",
    description: "Apply 6xD through guided courses.",
    tags: ["Self-paced", "Real projects", "Mentorship"],
    cta: "Explore Courses",
    path: "/lms",
    bg: "bg-[#f0f6ff]",
    accent: "text-[#131e42]",
    badgeColor: "text-[#131e42]",
    iconColor: "#e1513b",
  },
  {
    title: "See the stories",
    icon: BookOpen,
    badge: "Storybooks",
    description: "Real transformation journeys using 6xD.",
    tags: ["System overview", "Design logic", "Competency relationships"],
    cta: "Read Storybooks",
    path: "/marketplace/guides/dq-ghc",
    bg: "bg-[#fde6de]",
    accent: "text-[#e1513b]",
    badgeColor: "text-[#e1513b]",
    iconColor: "#e1513b",
  },
  {
    title: "Join the work",
    icon: Users,
    badge: "Programs",
    description: "Practice 6xD in live programs.",
    tags: ["Cohort-based", "Live challenges", "Community"],
    cta: "Join a Program",
    path: "/marketplace",
    bg: "bg-[#e6ebff]",
    accent: "text-[#131e42]",
    badgeColor: "text-[#131e42]",
    iconColor: "#131e42",
  },
  {
    title: "See it in action",
    icon: Briefcase,
    badge: "Workspace",
    description: "Tools, rituals, and execution inside DWS.",
    tags: ["Templates", "Rituals", "Best practices"],
    cta: "Explore Workspace",
    path: "/marketplace/guides",
    bg: "bg-white",
    accent: "text-[#131e42]",
    badgeColor: "text-[#131e42]",
    iconColor: "#e1513b",
  },
];

export default function SixXDLanding() {
  return (
    <GHCLanding
      badgeLabel="The Agile 6xD"
      overrides={{
        heroHeadline: "Transformation fails when it’s treated as a project.",
        heroSupporting:
          "Agile 6xD is how DQ turns transformation into a repeatable system — designed, delivered, and sustained through real work.",
        heroCTA: "Read the Agile 6xD Storybook",
        foundationTitle: "What is Agile 6xD?",
        foundationSubtitle:
          "Not a framework to memorise. Not a one-time transformation method. A living operating system for change.",
        foundationCards: SIXXD_FEATURES,
        foundationCTA: "Read the full Agile 6xD story",
        responsesTitle: "Six Perspectives in Action",
        responsesIntro:
          "Each perspective exists because something in traditional transformation breaks. Agile 6xD responds with clarity and execution.",
        responseTags: [
          "Digital Economy",
          "Digital Cognitive Organisation",
          "Digital Business Platforms",
          "Digital Transformation 2.0",
          "Digital Worker & Workspace",
          "Digital Accelerators",
        ],
        responseCards: SIXXD_CARDS,
        bottomCTA: "Explore all six perspectives together →",
        actionCards: SIXXD_ACTIONS,
        finalHeadline: "Transformation lives in real work — not slides.",
        finalSubtitle:
          "Agile 6xD comes to life inside the DQ Digital Workspace, where strategy becomes execution and learning becomes habit.",
      }}
    />
  );
}
