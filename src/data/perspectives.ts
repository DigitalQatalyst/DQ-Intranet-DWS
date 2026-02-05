export interface Perspective {
  id: number;
  title: string;
  tag: string;
  subtitle: string;
  question: string;
  description: string;
  illustration:
    | 'economy'
    | 'cognitive'
    | 'platforms'
    | 'transformation'
    | 'workspace'
    | 'accelerators';
}

export const perspectives: Perspective[] = [
  {
    id: 1,
    title: "Digital Economy",
    tag: "Digital Economy",
    subtitle: "DQ Workspace · Real scenario",
    question: "Why does change become unavoidable?",
    description:
      "Grounds transformation in real market forces, customer behaviour, and value shifts — so execution is driven by reality, not assumptions.",
    illustration: "economy"
  },
  {
    id: 2,
    title: "Digital Cognitive Organisation",
    tag: "Digital Cognitive Organisation",
    subtitle: "DQ Workspace · Real scenario",
    question: "What must organisations become to execute continuously?",
    description:
      "Defines the adaptive enterprise — able to sense, decide, and respond across people, systems, and decisions.",
    illustration: "cognitive"
  },
  {
    id: 3,
    title: "Digital Business Platforms",
    tag: "Digital Business Platforms",
    subtitle: "DQ Workspace · Real scenario",
    question: "What must be built so execution doesn’t slow down?",
    description:
      "Creates modular, integrated foundations that keep delivery scalable, resilient, and executable over time.",
    illustration: "platforms"
  },
  {
    id: 4,
    title: "Digital Transformation 2.0",
    tag: "Digital Transformation 2.0",
    subtitle: "DQ Workspace · Real scenario",
    question: "How do we stop pilots from stalling?",
    description:
      "Turns transformation into a governed execution discipline — not a one-off initiative.",
    illustration: "transformation"
  },
  {
    id: 5,
    title: "Digital Worker & Workspace",
    tag: "Digital Worker & Workspace",
    subtitle: "DQ Workspace · Real scenario",
    question: "Who delivers change — and how do they work daily?",
    description:
      "Redesigns roles, skills, and environments so execution becomes normal work, not extra effort.",
    illustration: "workspace"
  },
  {
    id: 6,
    title: "Digital Accelerators",
    tag: "Digital Accelerators",
    subtitle: "DQ Workspace · Real scenario",
    question: "When does value actually show up?",
    description:
      "Compresses time-to-value and converts execution momentum into measurable outcomes.",
    illustration: "accelerators"
  }
];

