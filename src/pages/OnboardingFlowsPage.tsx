import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  LifeBuoy,
  MessageCircle,
  MessageCircleQuestion,
  Sparkles,
  Target,
  User,
  UserCog,
  Users,
} from "lucide-react";

type StepKey = "welcome" | "profile" | "tools" | "firstTask";
type ChecklistKey = "watch" | "profile" | "join" | "lms" | "ship";

// --- Toggle this to match EJP strictly (no pre-footer) ---
const SHOW_MOMENTUM = false;

interface OnboardingProgress {
  steps: Record<StepKey, boolean>;
  checklist: Record<ChecklistKey, boolean>;
  selected_template: string | null;
  percent: number;
}

interface StepCard {
  key: StepKey;
  stepNumber: string;
  title: string;
  description: string;
  bullets: string[];
  ctaPath: string;
  icon: React.ElementType;
}

interface TeamCard {
  title: string;
  description: string;
  ctaLabel: string;
  icon: React.ElementType;
  action: () => void;
}

interface FirstTaskOption {
  id: string;
  title: string;
  description: string;
  ctaPath: string;
  icon: React.ElementType;
}

interface SectionHeaderProps {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
}

const STORAGE_KEY = "dq_onboarding_progress";

const defaultProgress: OnboardingProgress = {
  steps: { welcome: false, profile: false, tools: false, firstTask: false },
  checklist: { watch: false, profile: false, join: false, lms: false, ship: false },
  selected_template: null,
  percent: 0,
};

const calculatePercent = (data: OnboardingProgress) => {
  const completedSteps = Object.values(data.steps).filter(Boolean).length;
  const completedChecklist = Object.values(data.checklist).filter(Boolean).length;
  const totalItems = Object.keys(data.steps).length + Object.keys(data.checklist).length;
  return totalItems === 0 ? 0 : Math.round(((completedSteps + completedChecklist) / totalItems) * 100);
};

const loadStoredProgress = (): OnboardingProgress => {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    const parsed = JSON.parse(stored) as Partial<OnboardingProgress>;
    const merged: OnboardingProgress = {
      steps: { ...defaultProgress.steps, ...(parsed.steps || {}) },
      checklist: { ...defaultProgress.checklist, ...(parsed.checklist || {}) },
      selected_template: parsed.selected_template ?? defaultProgress.selected_template,
      percent: typeof parsed.percent === "number" ? parsed.percent : defaultProgress.percent,
    };
    merged.percent = calculatePercent(merged);
    return merged;
  } catch {
    return defaultProgress;
  }
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ id, title, description, eyebrow }) => (
  <div className="space-y-2">
    {eyebrow ? (
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A2E6E]">{eyebrow}</p>
    ) : null}
    <h2 id={id} className="text-2xl md:text-3xl font-semibold tracking-tight text-[#030F35]">
      {title}
    </h2>
    <p className="text-base leading-relaxed text-slate-600">{description}</p>
  </div>
);

const stepCards: StepCard[] = [
  {
    key: "welcome",
    stepNumber: "Step 1",
    title: "Welcome to DQ",
    description: "Get oriented with DQ’s purpose, values, and the teams you’ll collaborate with.",
    bullets: ['Watch the 2-min "Why DQ" intro', "Meet your Chapter & Squad", 'Explore the "How We Deliver" guide'],
    ctaPath: "/onboarding/welcome",
    icon: Sparkles,
  },
  {
    key: "profile",
    stepNumber: "Step 2",
    title: "Set Up Your Profile",
    description: "Make it easy for teammates to find and collaborate with you.",
    bullets: ["Add your role & skills", "Choose notifications", "Link GitHub, SharePoint, or Email"],
    ctaPath: "/onboarding/profile",
    icon: UserCog,
  },
  {
    key: "tools",
    stepNumber: "Step 3",
    title: "Explore Tools & Marketplaces",
    description: "Access all the essentials that power your daily work — from learning to requests.",
    bullets: ["Services & Requests", "DQ LMS Learning", "Communities & Surveys"],
    ctaPath: "/onboarding/tools",
    icon: Compass,
  },
  {
    key: "firstTask",
    stepNumber: "Step 4",
    title: "Complete Your First Task",
    description: "Jump into a guided task that helps you create early value with confidence.",
    bullets: ["Pick a template", "Follow 3 simple steps", "Share your outcome"],
    ctaPath: "/onboarding/first-task",
    icon: CheckCircle2,
  },
];

const checklistItems: { key: ChecklistKey; label: string }[] = [
  { key: "watch", label: 'Watch "Why DQ" orientation' },
  { key: "profile", label: "Complete your profile & notifications" },
  { key: "join", label: "Join your Chapter & Squad channels" },
  { key: "lms", label: "Enroll in your first LMS learning path" },
  { key: "ship", label: 'Ship a "First Task" and share your progress' },
];

const firstTaskOptions: FirstTaskOption[] = [
  {
    id: "tools",
    title: "Set up your working tools",
    description: "Get access to email, repositories, and daily essentials so you can collaborate fast.",
    ctaPath: "/onboarding/first-task?template=tools",
    icon: Target,
  },
  {
    id: "improve-page",
    title: "Improve one page",
    description: "Refine copy, spacing, or layout on a Digital Workspace surface to make it clearer.",
    ctaPath: "/onboarding/first-task?template=page",
    icon: FileText,
  },
  {
    id: "micro-guide",
    title: "Create a micro-guide",
    description: "Capture a 1-pager that helps others ramp up faster on a shared tool or workflow.",
    ctaPath: "/onboarding/first-task?template=guide",
    icon: MessageCircle,
  },
];

const completionActions = [
  { label: "Open DQ Workspace", path: "/workspace" },
  { label: "Plan Next 30 Days", path: "/dashboard" },
  { label: "Browse LMS Paths", path: "/marketplace/courses" },
];

const OnboardingFlowsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState<OnboardingProgress>(() => loadStoredProgress());
  const [displayedPercent, setDisplayedPercent] = useState(progress.percent);
  const navigate = useNavigate();
  const stepsSectionRef = useRef<HTMLElement | null>(null);
  const faqSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setDisplayedPercent(progress.percent);
  }, [progress.percent]);

  const isComplete = progress.percent >= 100;

  const handleStartJourney = () => {
    // EJP behavior: remain on page and smooth scroll (no route change)
    stepsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStepNavigate = (stepKey: StepKey, path: string) => {
    setProgress((prev) => {
      const updated: OnboardingProgress = { ...prev, steps: { ...prev.steps, [stepKey]: true } };
      updated.percent = calculatePercent(updated);
      return updated;
    });
    navigate(path);
  };

  const handleChecklistToggle = (itemKey: ChecklistKey) => {
    setProgress((prev) => {
      const updated: OnboardingProgress = {
        ...prev,
        checklist: { ...prev.checklist, [itemKey]: !prev.checklist[itemKey] },
      };
      updated.percent = calculatePercent(updated);
      return updated;
    });
  };

  const handleMarkAllDone = () => {
    setProgress((prev) => ({
      steps: { welcome: true, profile: true, tools: true, firstTask: true },
      checklist: { watch: true, profile: true, join: true, lms: true, ship: true },
      selected_template: prev.selected_template,
      percent: 100,
    }));
  };

  const handleTemplateSelect = (option: FirstTaskOption) => {
    setProgress((prev) => {
      const updated: OnboardingProgress = {
        ...prev,
        steps: { ...prev.steps, firstTask: true },
        selected_template: option.id,
      };
      updated.percent = calculatePercent(updated);
      return updated;
    });
    navigate(option.ctaPath);
  };

  const handleSupportNavigation = (path: string) => navigate(path);

  const resetProgress = () => setProgress(defaultProgress);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className="flex-1" aria-labelledby="hero-heading">
        {/* EJP compact header */}
        <section className="bg-[#F8FAFC] border-b border-slate-200/70 py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="rounded-md px-1 py-0.5 text-slate-500 transition hover:text-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  >
                    Home
                  </button>
                </li>
                <li className="text-slate-400">/</li>
                <li className="text-slate-700 font-medium">Onboarding</li>
              </ol>
            </nav>

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3 md:max-w-3xl">
                <h1 id="hero-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#030F35]">
                  DQ Onboarding Flows
                </h1>
                <p className="text-base leading-relaxed text-slate-600">
                  Follow guided steps to connect with DQ’s culture, set up your essentials, and deliver your first wins with confidence.
                </p>

                {isComplete ? (
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-[#030F35]">
                      🎉 Onboarding complete — great start! What will you improve next?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {completionActions.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={() => navigate(action.path)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#030F35] transition hover:border-[#FB5535]/60 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                        >
                          {action.label}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleStartJourney}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FB5535] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  aria-label="Start my onboarding journey"
                >
                  Start My Journey
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2) Progress band */}
        <section aria-labelledby="progress-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900" id="progress-heading">
                    {displayedPercent}% complete
                  </p>
                  <p className="text-xs text-slate-500">Progress saves automatically to this device.</p>
                </div>
                <button
                  type="button"
                  onClick={resetProgress}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#FB5535] transition hover:text-[#d9442a] focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                  aria-label="Reset onboarding progress"
                >
                  Reset Progress
                </button>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#FB5535] transition-all duration-500 ease-out"
                  style={{ width: `${displayedPercent}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3) Story strip */}
        <section aria-labelledby="story-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader
              id="story-heading"
              title="Arrive. Set up. Explore. Win."
              description="Every DQ associate begins here — discovering purpose, tools, and confidence to deliver their first impact."
            />
          </div>
        </section>

        {/* 4) Step grid */}
        <section aria-labelledby="steps-heading" className="py-10 md:py-12" ref={stepsSectionRef} id="steps">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader
              id="steps-heading"
              eyebrow="Journey"
              title="Four Core Onboarding Stages"
              description="Move through each stage to get oriented, personalize your space, master the tools, and deliver your first win."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {stepCards.map((step) => {
                const Icon = step.icon;
                const isDone = progress.steps[step.key];
                return (
                  <div key={step.key} className="flex min-h-[240px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{step.stepNumber}</span>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FB5535]">
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            Saved
                          </span>
                        ) : null}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#030F35]/10 text-[#030F35]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">{step.title}</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-600">{step.description}</p>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {step.bullets.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-[#FB5535]" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => handleStepNavigate(step.key, step.ctaPath)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FB5535] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                        aria-label={`Continue to ${step.title}`}
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5) Meet your team */}
        <section aria-labelledby="team-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader
              id="team-heading"
              eyebrow="Support Network"
              title="Meet Your Team"
              description="Know who to lean on — your manager, your chapter, and your squad."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {[
                {
                  title: "Your Manager",
                  description: "Understand expectations, priorities, and how success is measured.",
                  ctaLabel: "View Profile",
                  icon: User,
                  action: () => handleSupportNavigation("/profile/manager"),
                },
                {
                  title: "Your Chapter",
                  description: "Connect with peers who share your discipline and craft.",
                  ctaLabel: "Open Channel",
                  icon: Users,
                  action: () => handleSupportNavigation("/communities"),
                },
                {
                  title: "Your Squad",
                  description: "Stay aligned with the team you deliver alongside every day.",
                  ctaLabel: "See Board",
                  icon: Target,
                  action: () => handleSupportNavigation("/squads/board"),
                },
                {
                  title: "Mentor / Coach",
                  description: "Lean on a guide who accelerates your learning curve.",
                  ctaLabel: "Request Intro",
                  icon: LifeBuoy,
                  action: () => handleSupportNavigation("/mentorship/request"),
                },
              ].map((card: TeamCard) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#030F35]/10 text-[#030F35]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">{card.title}</h3>
                      <p className="text-sm md:text-base leading-relaxed text-slate-600">{card.description}</p>
                    </div>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={card.action}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#030F35] transition hover:border-[#FB5535]/60 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                        aria-label={card.ctaLabel}
                      >
                        {card.ctaLabel}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6) First-week checklist */}
        <section aria-labelledby="checklist-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <SectionHeader
                id="checklist-heading"
                eyebrow="Week One"
                title="First Week Checklist"
                description="Complete these essentials to finish onboarding and get ready for your first impact."
              />
              <button
                type="button"
                onClick={handleMarkAllDone}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#030F35] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
              >
                Mark All Done
              </button>
            </div>
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <label
                  key={item.key}
                  htmlFor={`checklist-${item.key}`}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-[#FB5535]/50 md:px-6"
                >
                  <input
                    id={`checklist-${item.key}`}
                    type="checkbox"
                    checked={progress.checklist[item.key]}
                    onChange={() => handleChecklistToggle(item.key)}
                    className="h-5 w-5 rounded-md border-slate-300 text-[#FB5535] focus:ring-[#FB5535]/40"
                    aria-label={item.label}
                  />
                  <span className="flex-1 text-sm md:text-base font-medium text-[#030F35]">{item.label}</span>
                  {progress.checklist[item.key] ? <CheckCircle2 className="h-5 w-5 text-[#FB5535]" aria-hidden="true" /> : null}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 7) Guided first task */}
        <section aria-labelledby="templates-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader id="templates-heading" eyebrow="Deliver" title="Ship a Small Win" description="Start small. Deliver something visible in your first week." />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {firstTaskOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = progress.selected_template === option.id;
                return (
                  <div key={option.id} className={`flex min-h-[240px] flex-col rounded-2xl border p-6 shadow-lg ${isSelected ? "border-[#FB5535]" : "border-slate-200"}`}>
                    <div className="space-y-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#030F35]/10 text-[#030F35]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">{option.title}</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-600">{option.description}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => handleTemplateSelect(option)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FB5535] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                        aria-label={`Use template: ${option.title}`}
                      >
                        Choose Template
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8) Help & support */}
        <section aria-labelledby="support-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader id="support-heading" eyebrow="Need Assistance" title="Stuck? Get Help Fast" description="Reach the right teams and communities instantly so momentum never slows down." />
            <div className="flex flex-wrap justify-start gap-3 md:justify-between">
              {[
                { label: "Request Support", icon: LifeBuoy, action: () => handleSupportNavigation("/requests/new") },
                { label: "Ask in Communities", icon: MessageCircle, action: () => handleSupportNavigation("/communities") },
                { label: "Message Your Manager", icon: User, action: () => handleSupportNavigation("/profile/manager") },
                { label: "Onboarding FAQ", icon: MessageCircleQuestion, action: () => faqSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#030F35] transition hover:border-[#FB5535]/60 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  >
                    <Icon className="h-5 w-5 text-[#FB5535]" aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9) FAQ */}
        <section aria-labelledby="faq-heading" className="py-10 md:py-12" ref={faqSectionRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader id="faq-heading" eyebrow="Answers" title="Onboarding FAQ" description="Quick guidance for the most common questions during your first week." />
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">How long does onboarding take?</h3>
                <p className="text-base leading-relaxed text-slate-600">Most associates complete core steps in one day; the checklist runs through week one.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">Where do I track progress?</h3>
                <p className="text-base leading-relaxed text-slate-600">Use the progress bar above or visit your profile timeline.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">Who approves my access?</h3>
                <p className="text-base leading-relaxed text-slate-600">Your manager and Services &amp; Requests team handle it automatically once submitted.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10) Momentum (pre-footer) — optional to match EJP */}
        {SHOW_MOMENTUM && (
          <section aria-labelledby="momentum-heading" className="bg-[#030F35] py-16 md:py-20 text-white border-t border-[#1A2E6E]/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Keep Momentum</p>
                <h2 id="momentum-heading" className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Continue Building Impact
                </h2>
                <p className="text-base leading-relaxed text-white/80">
                  Keep your journey going with these guides and feedback loops.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {[
                  { label: "DQ Governance & Guidelines", path: "/governance" },
                  { label: "Security & Privacy Basics", path: "/security" },
                  { label: "Performance & Feedback", path: "/performance" },
                  { label: "Submit Improvement Idea", path: "/improvements/new" },
                ].map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="inline-flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-left text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default OnboardingFlowsPage;
