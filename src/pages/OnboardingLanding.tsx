import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  AtSign, 
  Users, 
  Wrench, 
  Building2, 
  GraduationCap,
  Target,
  Layers,
  TrendingUp,
  Eye,
  User,
  MessageCircle,
  BookOpen,
  Users as UsersIcon,
  Compass,
  Hexagon,
  Lightbulb,
  MapPin,
  Shield
} from 'lucide-react';
import { FadeInUpOnScroll, StaggeredFadeIn } from '../components/AnimationUtils';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface OnboardingStep {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  experience: string;
}

interface SupportCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

interface FrameworkCard {
  icon: React.ReactNode;
  label: string;
  title: string;
  definition: string;
  showsUpIn: string[];
  linkText: string;
  href: string;
}

interface JourneyPillar {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    number: 1,
    icon: <AtSign size={24} color="#e95139" />,
    title: 'Discover DigitalQatalyst',
    description: "Learn DQ's vision, mission, DNA, and why we exist.",
    linkText: 'Start Here',
    href: '/discover',
  },
  {
    number: 2,
    icon: <Users size={24} color="#e95139" />,
    title: 'How Work Happens at DQ',
    description: 'Understand how teams collaborate, deliver, and make decisions.',
    linkText: 'View Ways of Working →',
    href: '/ways-of-working',
  },
  {
    number: 3,
    icon: <Wrench size={24} color="#e95139" />,
    title: 'Access Your Tools & Platforms',
    description: 'Get access to DWS, communication tools, and core systems.',
    linkText: 'Set Up My Tools →',
    href: '/onboarding/tools',
  },
  {
    number: 4,
    icon: <Building2 size={24} color="#e95139" />,
    title: 'Your Role & Team',
    description: 'Understand your role, responsibilities, and how you contribute.',
    linkText: 'View My Role & Team →',
    href: '/onboarding/profile',
  },
  {
    number: 5,
    icon: <GraduationCap size={24} color="#e95139" />,
    title: 'Learning & Growth at DQ',
    description: 'Explore learning tracks, competencies, and growth paths.',
    linkText: 'Start Learning →',
    href: '/learning',
  },
];

const whyDQFeatures: FeatureCard[] = [
  {
    icon: <Target size={24} strokeWidth={1.5} color="#e95139" />,
    title: 'Outcome-driven, not task-driven',
    description: 'We start with the outcome and design work around the impact we need to create.',
    experience: "You'll be asked \"why does this matter?\" more often than \"did you finish the task?\"",
  },
  {
    icon: <Users size={24} strokeWidth={1.5} color="#e95139" />,
    title: 'Clear ownership and accountability',
    description: 'Decisions, responsibilities, and follow-through are clearly owned, not diffused.',
    experience: "You'll always know what you own — and who to go to for decisions.",
  },
  {
    icon: <Layers size={24} strokeWidth={1.5} color="#e95139" />,
    title: 'Platforms over disconnected tools',
    description: 'We build shared platforms so teams can reuse, connect, and scale how work happens.',
    experience: "You won't need to manage work across dozens of disconnected tools.",
  },
  {
    icon: <TrendingUp size={24} strokeWidth={1.5} color="#e95139" />,
    title: 'Continuous learning and growth',
    description: 'We treat every engagement as a chance to learn, improve, and strengthen our capabilities.',
    experience: 'Learning is part of delivery — not something you do after hours.',
  },
  {
    icon: <Eye size={24} strokeWidth={1.5} color="#e95139" />,
    title: 'Transparency in how work flows',
    description: 'Work, priorities, and decisions are visible so people understand context and direction.',
    experience: 'You can see progress, priorities, and blockers without needing permission.',
  },
];

const supportOptions: SupportCard[] = [
  {
    icon: <User size={24} color="#e95139" />,
    title: 'Contact Your People Partner',
    description: 'HR topics, onboarding questions, and people-related support.',
    href: '/support/people-partner',
  },
  {
    icon: <MessageCircle size={24} color="#e95139" />,
    title: 'DWS Communication Center',
    description: 'Ask questions, raise requests, or get clarifications centrally.',
    href: '/support/communication-center',
  },
  {
    icon: <BookOpen size={24} color="#e95139" />,
    title: 'FAQs & Glossary',
    description: 'Self-serve answers to common DQ terms, tools, and processes.',
    href: '/support/faqs',
  },
  {
    icon: <UsersIcon size={24} color="#e95139" />,
    title: 'Unit or Delivery Lead',
    description: 'Day-to-day work priorities, expectations, and delivery guidance.',
    href: '/support/unit-or-delivery-lead',
  },
];

const journeyPillars: JourneyPillar[] = [
  {
    icon: <Lightbulb size={24} color="#e95139" strokeWidth={1.5} />,
    title: 'Understand DQ',
    description: 'Learn who we are, why we exist, and the principles that guide how we think and work.',
    tags: ['Purpose', 'Culture', 'Frameworks'],
  },
  {
    icon: <Users size={24} color="#e95139" strokeWidth={1.5} />,
    title: 'Learn How We Work',
    description: 'Understand how teams collaborate, make decisions, and deliver outcomes at DQ.',
    tags: ['Ways of Working', 'Collaboration', 'Delivery'],
  },
  {
    icon: <Shield size={24} color="#e95139" strokeWidth={1.5} />,
    title: 'Get Ready to Contribute',
    description: 'Access the tools, platforms, and resources you need to start contributing with confidence.',
    tags: ['Tools', 'Access', 'Readiness'],
  },
];

const frameworkCards: FrameworkCard[] = [
  {
    icon: <Compass size={24} strokeWidth={1.5} color="#e95139" />,
    label: 'Core Purpose Framework',
    title: 'DQ GHC',
    definition: "Defines DQ's purpose, principles, and decision-making foundations.",
    showsUpIn: ['Strategic planning', 'Decision-making', 'Team alignment'],
    linkText: 'Understand DQ GHC',
    href: '/dq-ghc',
  },
  {
    icon: <Layers size={24} strokeWidth={1.5} color="#e95139" />,
    label: 'Core Delivery Framework',
    title: 'DQ 6xD',
    definition: 'Explains how DQ approaches digital transformation holistically across six dimensions.',
    showsUpIn: ['Project design', 'Solution architecture', 'Client delivery'],
    linkText: 'Understand DQ 6xD',
    href: '/dq-6xd',
  },
];

export function OnboardingLanding() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStartOnboarding = () => {
    navigate('/onboarding/start');
  };

  const handleExploreCulture = () => {
    navigate('/discover');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen} 
      />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="relative w-full min-h-[85vh] md:min-h-[100vh] overflow-hidden flex flex-col">
          {/* DWS gradient background */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #0B1C3F 0%, #0E2A5A 50%, #123A6F 100%)'
            }}
          />
          
          {/* Background image overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("https://www.ceotodaymagazine.com/CEO-Today/wp-content/uploads/2024/07/iStock-1473446455.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              mixBlendMode: 'soft-light'
            }}
          />
          
          {/* Subtle teal accent glow */}
          <div 
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(47, 214, 197, 0.3) 0%, transparent 70%)'
            }}
          />
          
          {/* Subtle grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* Mountain silhouette at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 opacity-[0.12]">
            <svg
              viewBox="0 0 1200 200"
              className="w-full h-full"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,200 L0,180 L150,120 L300,140 L450,100 L600,130 L750,90 L900,110 L1050,80 L1200,100 L1200,200 Z"
                fill="#0B1C3F"
              />
              <path
                d="M0,200 L0,190 L200,150 L400,170 L600,130 L800,150 L1000,120 L1200,140 L1200,200 Z"
                fill="#0E2A5A"
                opacity="0.7"
              />
            </svg>
          </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 flex-grow flex flex-col justify-center items-center relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <FadeInUpOnScroll>
                <h1 
                  className="text-[40px] md:text-[48px] lg:text-[64px] xl:text-[72px] text-white mb-6"
                  style={{
                    fontFamily: 'Palatino, serif',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: '#FFFFFF'
                  }}
                >
                  Welcome to DigitalQatalyst
                </h1>
                <p className="text-xl md:text-2xl text-white/95 mb-5 font-normal leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Your guided onboarding journey — everything you need to start strong at DQ.
                </p>
                <p className="text-base md:text-lg text-white/80 mb-10 font-normal leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Onboarding at DQ is more than setup. It's how you understand our culture, our ways of working, and how you create impact from day one.
                </p>
              </FadeInUpOnScroll>

              <StaggeredFadeIn
                staggerDelay={0.15}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={handleStartOnboarding}
                  className="px-8 py-3.5 bg-white text-[#030F35] font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-white/95 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Start My Onboarding Journey
                  <ArrowRight size={18} color="#e95139" />
                </button>
                <button
                  onClick={handleExploreCulture}
                  className="px-8 py-3.5 bg-transparent text-white border-2 border-white/30 font-semibold rounded-lg hover:border-white/50 hover:bg-white/10 transition-all duration-200"
                >
                  Explore DQ Culture
                </button>
              </StaggeredFadeIn>
            </div>
          </div>
        </section>

        {/* Your DQ Onboarding Journey Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <FadeInUpOnScroll>
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-4">
                    Your Onboarding Journey at DQ
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    Before you begin, here's how your onboarding experience is structured — so you always know where you are and what comes next.
                  </p>
                </div>

                {/* Three Cards - Growth Areas Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {journeyPillars.map((pillar, index) => (
                    <FadeInUpOnScroll key={index} delay={index * 0.1}>
                      <article className="group relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 flex flex-col min-h-[240px]">
                        <div className="flex flex-col flex-1 p-6">
                          <div className="flex items-start mb-4">
                            <div className="bg-gray-50 p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110">
                              {pillar.icon}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-[#0E1446] mb-3 leading-tight">{pillar.title}</h3>
                          <p className="text-sm text-neutral-600 leading-relaxed mb-4 flex-1">{pillar.description}</p>
                          <div className="mt-auto pt-3 border-t border-neutral-100">
                            <div className="flex flex-wrap gap-2">
                              {pillar.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    </FadeInUpOnScroll>
                  ))}
                </div>
              </div>
            </FadeInUpOnScroll>
          </div>
        </section>

        {/* Your Onboarding Path Section */}
        <section className="py-16 md:py-20 bg-[#F8FAFC]">
          <div className="container mx-auto px-4">
            <FadeInUpOnScroll>
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-3">
                  Your Onboarding Path
                </h2>
                <p className="text-lg text-gray-600">
                  Follow these steps to build your foundation at DQ.
                </p>
              </div>
            </FadeInUpOnScroll>

            <div className="relative max-w-4xl mx-auto pl-6 sm:pl-10">
              {/* Vertical progress line */}
              <div
                className="absolute left-2 sm:left-3 top-0 bottom-0 w-px bg-slate-200"
                aria-hidden="true"
              />

              {/* Phase 1: Getting Oriented */}
              <FadeInUpOnScroll>
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                    Getting Oriented
                  </h3>
                  <div className="space-y-4">
                    {onboardingSteps.slice(0, 2).map((step, index) => (
                      <FadeInUpOnScroll key={step.number} delay={index * 0.08}>
                        <div className="relative pl-6 sm:pl-8">
                          {/* Step node on progress line */}
                          <div
                            className="absolute left-0 top-7 w-4 h-4 rounded-full border-2 bg-white"
                            style={{
                              borderColor:
                                step.number === 1 ? 'rgba(59,79,228,0.35)' : '#CBD5E1',
                            }}
                            aria-hidden="true"
                          />
                          <div
                            className="bg-white rounded-xl border transition-all duration-200 p-5 sm:p-6 flex flex-col gap-3 shadow-sm hover:shadow-md"
                            style={
                              step.number === 1
                                ? {
                                    background:
                                      'linear-gradient(135deg, rgba(31,42,107,0.06), rgba(59,79,228,0.04))',
                                    borderColor: 'rgba(59,79,228,0.35)',
                                  }
                                : { borderColor: '#E2E8F0' }
                            }
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                      step.number === 1
                                        ? 'bg-[#1F2A6B] text-white'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    Step {step.number}
                                  </span>
                                  {step.number === 1 && (
                                    <span className="text-xs font-semibold text-[#1F2A6B] bg-[#E0E7FF] px-2.5 py-1 rounded-full">
                                      Recommended starting point
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-[#0B1C2D]">
                                  {step.title}
                                </h3>
                              </div>
                              <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-50 items-center justify-center text-[#1E3A8A]">
                                {step.icon}
                              </div>
                            </div>
                            <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                              {step.description}
                            </p>
                            <div className="mt-1">
                              {step.number === 1 ? (
                                <a
                                  href={step.href}
                                  className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold bg-[#1E3A8A] text-white hover:bg-[#2563EB] transition-colors"
                                >
                                  Start Here
                                  <ArrowRight size={14} color="#e95139" className="ml-1" />
                                </a>
                              ) : (
                                <a
                                  href={step.href}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-sm font-semibold text-[#0B1C2D] bg-transparent hover:bg-slate-50 transition-colors"
                                >
                                  {step.linkText}
                                  <ArrowRight size={14} color="#e95139" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </FadeInUpOnScroll>
                    ))}
                  </div>
                </div>
              </FadeInUpOnScroll>

              {/* Phase 2: Getting Ready */}
              <FadeInUpOnScroll>
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                    Getting Ready
                  </h3>
                  <div className="space-y-4">
                    {onboardingSteps.slice(2, 4).map((step, index) => (
                      <FadeInUpOnScroll key={step.number} delay={index * 0.08}>
                        <div className="relative pl-6 sm:pl-8">
                          {/* Step node on progress line */}
                          <div
                            className="absolute left-0 top-7 w-4 h-4 rounded-full border-2 bg-white border-slate-300"
                            aria-hidden="true"
                          />
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 mb-2">
                                  Step {step.number}
                                </span>
                                <h3 className="text-lg md:text-xl font-semibold text-[#0B1C2D]">
                                  {step.title}
                                </h3>
                              </div>
                              <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-50 items-center justify-center text-[#1E3A8A]">
                                {step.icon}
                              </div>
                            </div>
                            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                              {step.description}
                            </p>
                            <div className="mt-1">
                              <a
                                href={step.href}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-sm font-semibold text-[#0B1C2D] bg-transparent hover:bg-slate-50 transition-colors"
                              >
                                {step.linkText}
                                <ArrowRight size={14} color="#e95139" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </FadeInUpOnScroll>
                    ))}
                  </div>
                </div>
              </FadeInUpOnScroll>

              {/* Phase 3: Growing at DQ */}
              <FadeInUpOnScroll>
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                    Growing at DQ
                  </h3>
                  <div className="space-y-4">
                    {onboardingSteps.slice(4, 5).map((step, index) => (
                      <FadeInUpOnScroll key={step.number} delay={index * 0.08}>
                        <div className="relative pl-6 sm:pl-8">
                          {/* Step node on progress line */}
                          <div
                            className="absolute left-0 top-7 w-4 h-4 rounded-full border-2 bg-white border-slate-300"
                            aria-hidden="true"
                          />
                          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 mb-2">
                                  Step {step.number}
                                </span>
                                <h3 className="text-lg md:text-xl font-semibold text-[#0B1C2D]">
                                  {step.title}
                                </h3>
                              </div>
                              <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-50 items-center justify-center text-[#1E3A8A]">
                                {step.icon}
                              </div>
                            </div>
                            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                              {step.description}
                            </p>
                            <div className="mt-1">
                              <a
                                href={step.href}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 text-sm font-semibold text-[#0B1C2D] bg-transparent hover:bg-slate-50 transition-colors"
                              >
                                {step.linkText}
                                <ArrowRight size={14} color="#e95139" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </FadeInUpOnScroll>
                    ))}
                  </div>
                </div>
              </FadeInUpOnScroll>
            </div>
          </div>
        </section>

        {/* DQ Primary Frameworks Section */}
        <section className="py-20 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <FadeInUpOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <p className="text-xs font-semibold tracking-wider uppercase text-[#1E3A8A] mb-3">
                  How DQ Operates
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-2">
                  DQ Primary Frameworks
                </h2>
                <div className="w-16 h-1.5 bg-[#E95139] rounded-full mx-auto mb-4" />
                <p className="text-lg text-slate-700 leading-relaxed">
                  These frameworks define how DQ thinks, decides, and delivers. Understanding them is essential to how you interpret work, make decisions, and create impact here.
                </p>
              </div>
            </FadeInUpOnScroll>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {frameworkCards.map((framework, index) => (
                <FadeInUpOnScroll key={index} delay={index * 0.1}>
                  <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 p-8 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50/50 transition-colors">
                          {framework.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-1">
                            {framework.label}
                          </p>
                          <h3 className="text-2xl font-bold text-[#0B1C2D]">
                            {framework.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-base text-slate-700 leading-relaxed mb-6">
                        {framework.definition}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Shows up in
                      </p>
                      <ul className="space-y-2 mb-6">
                        {framework.showsUpIn.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={framework.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A] hover:text-[#2563EB] transition-colors"
                      >
                        {framework.linkText}
                        <ArrowRight size={14} color="#e95139" />
                      </a>
                    </div>
                  </div>
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Why DQ Works Differently Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <FadeInUpOnScroll>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C2D] mb-3">
                  Why DQ Works Differently
                </h2>
                <p className="text-base text-slate-600">
                  These principles shape how work actually happens at DQ — how we focus, collaborate, and deliver.
                </p>
              </div>
            </FadeInUpOnScroll>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {whyDQFeatures.map((feature, index) => (
                <FadeInUpOnScroll key={index} delay={index * 0.08}>
                  <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 p-6 flex flex-col h-full">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-[#0B1C2D] text-center mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed text-center mb-3 flex-grow">
                      {feature.description}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed text-center italic">
                      {feature.experience}
                    </p>
                  </div>
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <FadeInUpOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-4">
                  Your journey at DQ starts here
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Your onboarding is guided, self-paced, and designed to help you start with clarity and confidence.
                </p>
                <button
                  onClick={handleStartOnboarding}
                  className="px-8 py-3.5 bg-white text-[#030F35] border-2 border-[#030F35] font-semibold rounded-lg hover:bg-[#030F35] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                >
                  Begin My DQ Onboarding
                  <ArrowRight size={18} color="#e95139" />
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  Takes around 10–15 minutes. You can pause, come back, and continue whenever you need.
                </p>
              </div>
            </FadeInUpOnScroll>
          </div>
        </section>

        {/* Need Help Along the Way Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <FadeInUpOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-3">
                  Need Help Along the Way?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  You won't need help for everything — but when you do, here's where to go.
                </p>
              </div>
            </FadeInUpOnScroll>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {supportOptions.map((support, index) => (
                <FadeInUpOnScroll key={index} delay={index * 0.08}>
                  <button
                    type="button"
                    onClick={() => navigate(support.href)}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[190px] flex flex-col items-center justify-start p-6 text-center transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#030F35]"
                  >
                    <div className="mb-4">{support.icon}</div>
                    <h3 className="text-sm font-semibold text-[#030F35] mb-2">
                      {support.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {support.description}
                    </p>
                  </button>
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}

export default OnboardingLanding;


