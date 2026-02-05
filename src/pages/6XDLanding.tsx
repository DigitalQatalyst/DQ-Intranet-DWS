import GHCLanding from "./GHCLanding";
import type { LucideIcon } from "lucide-react";
import { Target, Brain, Layers, GitBranch, Users, Zap, BookOpen, Briefcase, GraduationCap } from "lucide-react";

const SIXXD_CARDS = [
  {
    id: "de",
    number: 1,
    category: "Digital Economy",
    title: "Digital Economy",
    executionQuestion: "Why does change become unavoidable?",
    executionLens:
      "Grounds transformation in real market forces, customer behaviour, and value shifts — so execution is driven by reality, not assumptions.",
    story: "",
    problem: "",
    response: "",
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
    title: "Digital Cognitive Organisation",
    executionQuestion: "What must organisations become to execute continuously?",
    executionLens:
      "Defines the adaptive enterprise — able to sense, decide, and respond across people, systems, and decisions.",
    story: "",
    problem: "",
    response: "",
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
    title: "Digital Business Platforms",
    executionQuestion: "What must be built so delivery doesn’t slow down?",
    executionLens:
      "Creates modular, integrated foundations that make execution scalable, resilient, and repeatable.",
    story: "",
    problem: "",
    response: "",
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
    title: "Digital Transformation 2.0",
    executionQuestion: "How should change be designed and governed?",
    executionLens:
      "Turns transformation into a discipline — aligning governance, orchestration, and delivery beyond pilots.",
    story: "",
    problem: "",
    response: "",
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
    title: "Digital Worker & Workspace",
    executionQuestion: "Who delivers change — and how do they work daily?",
    executionLens:
      "Redesigns roles, skills, and environments so execution becomes normal work, not extra effort.",
    story: "",
    problem: "",
    response: "",
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
    title: "Digital Accelerators",
    executionQuestion: "When does value actually show up?",
    executionLens:
      "Compresses time-to-value and converts execution momentum into measurable outcomes.",
    story: "",
    problem: "",
    response: "",
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
    icon: GraduationCap,
    badge: "Start here",
    description: "Guided Agile 6xD missions with rituals, checklists, and feedback so you can execute while you learn.",
    tags: ["Practice", "Missions", "Feedback"],
    cta: "Start in Learning Center",
    path: "/lms?category=6xd",
    bg: "bg-gradient-to-br from-[#131e42] via-[#1f2c63] to-[#e1513b]",
    accent: "text-white",
    badgeColor: "text-white",
    iconColor: "#f0f6ff",
    variant: "primary",
  },
  {
    title: "Knowledge Center",
    icon: Layers,
    badge: "Deepen",
    description: "Plays, perspectives, and templates to help you design and deliver with Agile 6xD.",
    tags: ["Plays", "Templates", "Perspectives"],
    cta: "Go to Knowledge Center",
    path: "/marketplace/guides/dq-6xd",
    bg: "bg-[#f0f6ff]",
    accent: "text-[#131e42]",
    badgeColor: "text-[#131e42]",
    iconColor: "#e1513b",
    variant: "secondary",
  },
  {
    title: "Storybook",
    icon: BookOpen,
    badge: "Observe",
    description: "Transformation stories showing Agile 6xD pacing, decisions, and outcomes.",
    tags: ["Context", "Decisions", "Outcomes"],
    cta: "Read the Agile 6xD Storybook",
    path: "/marketplace/guides/dq-6xd",
    bg: "bg-[#fde6de]",
    accent: "text-[#e1513b]",
    badgeColor: "text-[#e1513b]",
    iconColor: "#e1513b",
    variant: "secondary",
  },
];

export default function SixXDLanding() {
  return (
    <GHCLanding
      badgeLabel="The Agile 6xD"
      overrides={{
        heroHeadline: "Digital transformation fails when it stays theoretical.",
        heroHeadlineHighlightWord: "theoretical",
        heroSupporting:
          "Agile 6xD is how DQ turns digital transformation into execution, designed, delivered, and sustained through real work.",
        heroCTA: "Read the Agile 6xD Storybook →",
        heroCTALink: "/marketplace/guides/dq-6xd",
        heroFootnote: "6 perspectives • execution at scale • continuous change",
        foundationTitle: "What is Agile 6xD?",
        foundationSubtitle:
          "Agile 6xD is DQ’s execution system for digital transformation. It helps teams make sense of digital and AI first — then turn that clarity into real execution through work.",
        foundationTitleFontSize: "30px",
        foundationSubtitleFontSize: "16px",
        foundationCards: [
          {
            title: "Making Sense",
            description:
              "A structured way to understand what digital and AI really mean for organisations — cutting through noise, trends, and assumptions.",
            icon: Target,
          },
          {
            title: "Practical Execution",
            description:
              "A hands-on execution system that turns understanding into action — delivering transformation through real work, not slides or side initiatives.",
            icon: Layers,
          },
        ],
        foundationCTA: "Read the full Agile 6xD storybook →",
        foundationCTATo: "/marketplace/guides/dq-6xd",
        foundationFootnote: "Together, these form the foundation for how Agile 6xD executes transformation in practice.",
        responsesTitle: "Six Perspectives. One Execution System.",
        responsesIntro:
          "Each perspective removes a specific execution blocker so transformation works in real conditions.",
        responsesTitleFontSize: "30px",
        responsesIntroFontSize: "16px",
        responsesSequential: true,
        responseTags: [
          "Digital Economy",
          "Digital Cognitive Organisation",
          "Digital Business Platforms",
          "Digital Transformation 2.0",
          "Digital Worker & Workspace",
          "Digital Accelerators",
        ],
        responseCards: SIXXD_CARDS,
        bottomCTA: "",
        actionCards: SIXXD_ACTIONS,
        finalHeadline: "Agile 6xD runs inside DQ first — then becomes products you can deploy.",
        finalSubtitle:
          "We execute Agile 6xD in the Digital Workspace to learn, harden, and scale it. Then we package that proven system into Agile 6xD Products so teams can deliver real outcomes faster.",
        finalCTALabel: "Read the Agile 6xD Storybook",
        finalCTATo: "/marketplace/guides/dq-6xd",
        finalCTASecondaryLabel: "Explore Agile 6xD Products",
        finalCTASecondaryTo: "/marketplace/guides/dq-agile-6xd",
        finalHeadlineFontSize: "36px",
        takeActionTitleFontSize: "30px",
        takeActionSubtitleFontSize: "16px",
        takeActionTitle: "Bring it to life",
        takeActionSubtitle: "Understanding is the start. Agile 6xD becomes real through application, practice, and lived experience.",
      }}
    />
  );
}
