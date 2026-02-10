import GHCLanding from "./SixXDLandingLayout";
import type { LucideIcon } from "lucide-react";
import { Target, Brain, Layers, GitBranch, Users, BookOpen, Briefcase, GraduationCap } from "lucide-react";

const SIXXD_CARDS = [
  {
    id: "dtmp",
    number: 1,
    category: "Digital Transformation Management Platform",
    title: "DTMP",
    executionQuestion: "Transformation work gets tracked after the fact instead of steered in real time.",
    executionLens:
      "Delivery Product: For leaders and portfolio owners, DTMP gives real-time steering across initiatives so fragmentation is removed before it starts.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: Target as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]",
    accent: "#f0f6ff",
    image:
      "https://image2url.com/r2/default/images/1770711361142-16232790-309d-46f7-b393-824cc3263275.png",
    ctaLabel: "Read capability overview",
  },
  {
    id: "dtma",
    number: 2,
    category: "Digital Transformation Management Academy",
    title: "DTMA",
    executionQuestion: "Teams are asked to transform without a shared practice.",
    executionLens:
      "Insight Product: For leaders and delivery teams, DTMA builds shared practice through applied learning so execution stays aligned in real work.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: GraduationCap as LucideIcon,
    gradient: "bg-gradient-to-br from-[#1b2553] via-[#243a75] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770354661040-ec3eb531-5010-4f68-8897-a5501623bfc3.jpg",
    ctaLabel: "Read capability overview",
  },
  {
    id: "dtmaas",
    number: 3,
    category: "Digital Transformation as a Service",
    title: "DTMaaS",
    executionQuestion: "Launching initiatives is slow and inconsistent across teams.",
    executionLens:
      "Delivery Product (TMaaS): For transformation leads, provides ready-to-run motions so delivery starts fast, consistent with 6xD.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: Briefcase as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#30478a] to-[#f0f6ff]",
    accent: "#f0f6ff",
    image:
      "https://image2url.com/r2/default/images/1770711252171-5234c11d-afc2-44ba-a4f6-30269cd2bd3b.png",
    ctaLabel: "Read capability overview",
  },
  {
    id: "dtmi",
    number: 4,
    category: "Digital Transformation Management Insights",
    title: "DTMI",
    executionQuestion: "Transformation knowledge is scattered across documents and teams.",
    executionLens:
      "Insight Product: For decision makers and practitioners, DTMI curates live insights so decisions and alignment stay grounded in evidence.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: Brain as LucideIcon,
    gradient: "bg-gradient-to-br from-[#1b2553] via-[#3f528e] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770354705237-110f4c43-ac71-49be-b8a9-1a676146ecb6.jpg",
    ctaLabel: "Read capability overview",
  },
  {
    id: "dto4t",
    number: 5,
    category: "Digital Twin of Organisation for Transformation",
    title: "DTO4T",
    executionQuestion: "Maturity and next steps are guessed instead of diagnosed.",
    executionLens:
      "Delivery Product: For transformation teams, DTO4T diagnoses maturity, prescribes actions, and reduces risk before scaling.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: GitBranch as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770354729820-f4815c42-e9e5-4926-9d71-eb92bcc2b057.jpg",
    ctaLabel: "Read capability overview",
  },
  {
    id: "dtmb",
    number: 6,
    category: "Digital Transformation Management Book",
    title: "DTMB",
    executionQuestion: "Transformation guidance varies by team and gets interpreted differently.",
    executionLens:
      "Insight Product: For leaders and practitioners, DTMB codifies models and plays so guidance stays consistent through the lifecycle.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: BookOpen as LucideIcon,
    gradient: "bg-gradient-to-br from-[#1b2553] via-[#243a75] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770354752481-f1a62033-22f9-483a-ba44-f24b95c2a535.jpg",
    ctaLabel: "Read capability overview",
  },
  {
    id: "plant-4-0",
    number: 7,
    category: "Digital Cognitive Plant Platform",
    title: "Plant 4.0",
    executionQuestion: "Industrial execution is fragmented across assets, systems, and sites.",
    executionLens:
      "Transaction Platform: For industrial operators and engineers, connects assets and operations so plant execution runs as one system.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: Layers as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#30478a] to-[#f0f6ff]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770711252171-5234c11d-afc2-44ba-a4f6-30269cd2bd3b.png",
    ctaLabel: "Read capability overview",
  },
  {
    id: "dws",
    number: 8,
    category: "Digital Work Solution",
    title: "DWS",
    executionQuestion: "Execution slows when tools, services, and workflows live in different places.",
    executionLens:
      "Transaction Platform: For associates and delivery teams, unifies work, collaboration, and automation so daily execution flows without friction.",
    story: "",
    problem: "",
    response: "",
    route: "/marketplace/guides/dq-agile-6xd",
    icon: Users as LucideIcon,
    gradient: "bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]",
    accent: "#f0f6ff",
    image: "https://image2url.com/r2/default/images/1770354729820-f4815c42-e9e5-4926-9d71-eb92bcc2b057.jpg",
    ctaLabel: "Read capability overview",
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
    icon: GraduationCap,
    badge: "Start here",
    description: "New joiners and operators: build delivery habits fast through missions that mirror DQ execution.",
    tags: ["Practice", "Missions", "Feedback"],
    cta: "Start in Learning Center",
    path: "/lms?category=6xd",
    bg: "bg-[#e6ebff]",
    accent: "text-white",
    badgeColor: "text-white",
    iconColor: "#f0f6ff",
    variant: "primary",
  },
  {
    title: "Capability overview",
    icon: Layers,
    badge: "Understand",
    description: "Leaders and planners: understand the system behind every product before you act.",
    tags: ["Storybook", "Execution", "Context"],
    cta: "Read the Agile 6xD storybook",
    path: "/marketplace/guides/dq-6xd",
    bg: "bg-[#f0f6ff]",
    accent: "text-[#131e42]",
    badgeColor: "text-[#131e42]",
    iconColor: "#e1513b",
    variant: "secondary",
  },
  {
    title: "Product platforms",
    icon: BookOpen,
    badge: "Access",
    description: "Teams ready to deploy: move straight into the live platforms used in delivery.",
    tags: ["DTMP", "DWS", "Plant 4.0"],
    cta: "Go to product platform ↗",
    path: "/marketplace/directory/products",
    bg: "bg-[#fde6de]",
    accent: "text-[#e1513b]",
    badgeColor: "text-[#e1513b]",
    iconColor: "#e1513b",
    variant: "secondary",
  },
];

export default function SixXDProductsLanding() {
  return (
    <GHCLanding
      badgeLabel="The Agile 6xD"
      overrides={{
        heroHeadline: "Transformation fails when execution is fragmented.",
        heroHeadlineHighlightWord: "execution",
        heroHeadlineFontSize: "70px",
        heroSupporting:
          "Execution fails when it is fragmented or guessed. DQ builds Agile 6xD Products as systems we design, prove internally, and scale.",
        heroCTA: "Read the Agile 6xD Storybook",
        heroCTALink: "/marketplace/guides/dq-6xd",
        heroFootnote: "Internal-first. Proven under real delivery pressure.",
        foundationTitle: "What are Agile 6xD Products",
        foundationSubtitle:
          "Execution systems, not standalone tools. They emerge from real DQ delivery, prevent fragmentation, work together as one spine, and only ship if they survive real work.",
        foundationTitleFontSize: "30px",
        foundationSubtitleFontSize: "16px",
        foundationCards: [
          {
            title: "Internal-first",
            description: "Runs on DQ teams under real deadlines first. If it fails here, it never ships.",
            icon: Target,
          },
          {
            title: "Built for real delivery",
            description:
              "Packaged governance, workflows, and data so teams get clarity, speed, and repeatability on day one.",
            icon: Layers,
          },
        ],
        foundationCTA: "Read the full Agile 6xD storybook",
        foundationCTATo: "/marketplace/guides/dq-6xd",
        foundationFootnote:
          "GHC shapes how we think; 6xD shapes how we execute; products are the outcome. If it doesn’t survive our delivery environments, it doesn’t ship.",
        responsesTitle: "Execution systems used at DQ",
        responsesIntro:
          "GHC → 6xD → Products. Shared competencies drive decisions, 6xD drives delivery, products are the proven systems. They map to four execution classes—Delivery Services, Delivery Products, Insight Products, and Transaction Platforms—and each removes a recurring failure like fragmentation, slow time-to-value, stalled pilots, or strategy stuck in slides.",
        responsesTitleFontSize: "30px",
        responsesIntroFontSize: "16px",
        responsesSequential: true,
        responseTags: [
          "DTMP",
          "DTMA",
          "DTMaaS",
          "DTMI",
          "DTO4T",
          "DTMB",
          "Plant 4.0",
          "DWS",
        ],
        responseCards: SIXXD_CARDS,
        bottomCTA: "",
        actionCards: SIXXD_ACTIONS,
        finalHeadline: "Execution or it doesn’t ship.",
        finalSubtitle:
          "We execute inside DQ first, release only after delivery proof, and scale what works. Execution is continuous, products are disciplined outcomes, and transformation becomes repeatable through systems.",
        finalCTALabel: "Read the Agile 6xD Storybook",
        finalCTATo: "/marketplace/guides/dq-6xd",
        finalCTASecondaryLabel: "Go to product platform ↗",
        finalCTASecondaryTo: "/marketplace/directory/products",
        finalHeadlineFontSize: "36px",
        takeActionTitleFontSize: "30px",
        takeActionSubtitleFontSize: "16px",
        takeActionTitle: "Choose your path",
        takeActionSubtitle:
          "Learn the system, understand the capabilities, or deploy the products — choose the step that moves you now.",
        takeActionLayout: "feature",
      }}
    />
  );
}
