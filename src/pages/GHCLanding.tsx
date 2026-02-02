import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Users,
  Briefcase,
  Zap,
  Target,
  Heart,
  User,
  Shield,
  GitBranch,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const IconGlyph = ({ glyph, className }: { glyph: string; className?: string }) => (
  <span className={`inline-flex items-center justify-center leading-none font-semibold ${className ?? ''}`}>
    {glyph}
  </span>
);

const IconOne = (props: { className?: string }) => <IconGlyph glyph="1" {...props} />;
const IconInfinity = (props: { className?: string }) => <IconGlyph glyph="∞" {...props} />;
const IconSeven = (props: { className?: string }) => <IconGlyph glyph="7" {...props} />;

/* -----------------------------------------
   Types & data
   ----------------------------------------- */

interface CompetencyCard {
  id: string;
  number: number;
  category: string;
  title: string;
  story: string;
  problem: string;
  response: string;
  route: string;
  icon: LucideIcon;
  gradient: string; // Tailwind gradient classes
  accent: string; // Hex or hsl string for highlights
  image: string;
}

const COMPETENCY_CARDS: CompetencyCard[] = [
  {
    id: 'purpose',
    number: 1,
    category: 'Vision',
    title: 'Vision',
    story: 'Problem: When pressure hit, priorities blurred and teams pulled in different directions. Response: Vision re-anchored daily decisions to purpose, keeping direction stable under stress.',
    problem: 'When pressure hit, priorities blurred and teams pulled in different directions.',
    response: 'Vision re-anchored daily decisions to purpose, keeping direction stable under stress.',
    situation: 'Critical launches piled up and priorities collided; teams lost the thread of purpose.',
    changes: [
      'Reframed goals into one north star statement',
      'Aligned weekly decisions to the stated purpose',
      'Stopped workstreams that did not serve the purpose',
    ],
    impact: 'Decisions converged and teams moved in one direction under pressure.',
    route: '/marketplace/guides/dq-vision',
    icon: Target,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'culture',
    number: 2,
    category: 'House of Values',
    title: 'House of Values',
    story: 'Problem: Incentives split teams and slowed decisions. Response: Shared values restored a common rulebook, allowing speed and trust to hold.',
    problem: 'Incentives split teams and slowed decisions.',
    response: 'Shared values restored a common rulebook, allowing speed and trust to hold.',
    situation: 'Sales pushed speed, delivery pushed quality, and teams argued over what “good” meant.',
    changes: [
      'Agreed three behavioural guardrails for all decisions',
      'Embedded values into approval checklists',
      'Held weekly value-based retros on tough calls',
    ],
    impact: 'Debates shortened and teams trusted decisions made against the shared rulebook.',
    route: '/marketplace/guides/dq-hov',
    icon: Heart,
    gradient: 'bg-gradient-to-br from-[#1b2553] via-[#243a75] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770021175279-eacca42a-60ed-4c4d-9d14-e724a3e76cd6.png',
  },
  {
    id: 'identity',
    number: 3,
    category: 'Structure',
    title: 'Persona',
    story:
      'Problem: Roles shifted constantly and individual impact became unclear. Response: Persona clarified the value each person contributes, regardless of role or squad.',
    problem: 'Roles shifted constantly and individual impact became unclear.',
    response: 'Persona clarified the value each person contributes, regardless of role or squad.',
    situation: 'Escalations bounced between managers because no one owned customer onboarding.',
    changes: [
      'Named a single accountable owner for onboarding',
      'Mapped DRI for every decision point',
      'Published a simple “who decides / who delivers” chart',
    ],
    impact: 'Escalations stopped and onboarding cycle time dropped because owners were clear.',
    route: '/marketplace/guides/dq-persona',
    icon: User,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#30478a] to-[#f0f6ff]',
    accent: '#f0f6ff',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'execution',
    number: 4,
    category: 'Ways of Working',
    title: 'Agile TMS',
    story:
      'Problem: Strategy changed faster than plans could adapt. Response: Agile TMS translated direction into adaptive missions and execution rhythm.',
    problem: 'Strategy changed faster than plans could adapt.',
    response: 'Agile TMS translated direction into adaptive missions and execution rhythm.',
    situation: 'Strategy changed monthly but teams were stuck on quarterly plans with mismatched cadences.',
    changes: [
      'Shifted to six-week missions with weekly checkpoints',
      'Synced rituals and demos across teams',
      'Retired stale backlog items each mission',
    ],
    impact: 'Execution cadence matched strategy shifts and handoffs became predictable.',
    route: '/marketplace/guides/dq-agile-tms',
    icon: Zap,
    gradient: 'bg-gradient-to-br from-[#1f2c63] via-[#2d3f80] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'governance',
    number: 5,
    category: 'Technology',
    title: 'Agile SoS',
    story:
      'Problem: Traditional governance slowed teams when speed mattered most. Response: Agile SoS introduced light guardrails that enabled pace without losing control.',
    problem: 'Traditional governance slowed teams when speed mattered most.',
    response: 'Agile SoS introduced light guardrails that enabled pace without losing control.',
    situation: 'Teams duplicated data across tools and couldn’t see blockers until too late.',
    changes: [
      'Standardised one delivery board per team with shared fields',
      'Integrated alerts into daily channels instead of email',
      'Trimmed tools down to a single source for status and risk',
    ],
    impact: 'Risks surfaced earlier and delivery sped up because tools matched daily flow.',
    route: '/marketplace/guides/dq-agile-sos',
    icon: Shield,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1b2553] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'flow',
    number: 6,
    category: 'Capability',
    title: 'Agile Flows',
    story:
      'Problem: Value broke down in handoffs and feedback arrived too late. Response: Agile Flows connected intent to outcomes end-to-end so feedback moved faster than blockers.',
    problem: 'Value broke down in handoffs and feedback arrived too late.',
    response: 'Agile Flows connected intent to outcomes end-to-end so feedback moved faster than blockers.',
    situation: 'Value died in handoffs and issues surfaced only after release.',
    changes: [
      'Mapped intent-to-outcome steps with owners',
      'Shortened feedback loops with shared demos',
      'Removed extra handoffs that delayed fixes',
    ],
    impact: 'Feedback arrived sooner and work flowed without stalls.',
    route: '/marketplace/guides/dq-agile-flows',
    icon: GitBranch,
    gradient: 'bg-gradient-to-br from-[#1b2553] via-[#30478a] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://images.unsplash.com/photo-1529429617124-aee0bd5d8e2a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'transform',
    number: 7,
    category: 'Leadership',
    title: 'Agile 6xD',
    story:
      'Problem: Transformation succeeded in pilots but stalled at scale. Response: Agile 6xD made change repeatable across diagnose, design, deliver, deploy, drive, and defend.',
    problem: 'Transformation succeeded in pilots but stalled at scale.',
    response: 'Agile 6xD made change repeatable across diagnose, design, deliver, deploy, drive, and defend.',
    situation: 'Every decision waited for exec sign-off, stalling rollouts.',
    changes: [
      'Defined decisions to delegate versus escalate',
      'Set clear guardrails and success measures',
      'Instituted weekly trust-but-verify reviews',
    ],
    impact: 'Teams shipped faster while leaders focused on strategic calls.',
    route: '/marketplace/guides/dq-agile-6xd',
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1f2c63] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
];

const FEATURE_CARDS = [
  {
    title: 'Operating DNA',
    icon: IconOne,
    description: 'How GHC guides you to think, decide, and act with clarity when work is complex and unpredictable.',
  },
  {
    title: 'Built for Change',
    icon: IconInfinity,
    description: 'Designed for environments where work never stands still, and roles, priorities, and learning shift in real time.',
  },
  {
    title: 'Seven elements',
    icon: IconSeven,
    description: 'Connected competency areas working together as one operating system for modern work.',
  },
];

const RESPONSE_TAGS = [
  'Vision',
  'House of Values',
  'Structure',
  'Ways of Working',
  'Technology',
  'Capability',
  'Leadership',
];

const ACTION_CARDS = [
  {
    title: 'Learn by doing',
    icon: GraduationCap,
    badge: 'Courses',
    description: 'Learn Golden Honeycomb competencies by applying them directly inside real situations, decisions, and work scenarios.',
    tags: ['Self-paced', 'Real projects', 'Mentorship'],
    cta: 'Explore Courses',
    path: '/lms',
    bg: 'bg-[#f0f6ff]',
    accent: 'text-[#131e42]',
    badgeColor: 'text-[#131e42]',
    iconColor: '#e1513b',
  },
  {
    title: 'See the stories',
    icon: BookOpen,
    badge: 'Storybooks',
    description: 'The complete Golden Honeycomb story — why it exists, how it works, and how the competencies connect as one system.',
    tags: ['System overview', 'Design logic', 'Competency relationships'],
    cta: 'Read Storybooks',
    path: '/marketplace/guides/dq-ghc',
    bg: 'bg-[#fde6de]',
    accent: 'text-[#e1513b]',
    badgeColor: 'text-[#e1513b]',
    iconColor: '#e1513b',
  },
  {
    title: 'Join the work',
    icon: Users,
    badge: 'Programs',
    description: 'Practise Golden Honeycomb competencies through guided programs built around real challenges and collective problem-solving.',
    tags: ['Cohort-based', 'Live challenges', 'Community'],
    cta: 'Join a Program',
    path: '/marketplace',
    bg: 'bg-[#e6ebff]',
    accent: 'text-[#131e42]',
    badgeColor: 'text-[#131e42]',
    iconColor: '#131e42',
  },
  {
    title: 'See it in action',
    icon: Briefcase,
    badge: 'Workspace',
    description: 'Explore practical examples of how Golden Honeycomb competencies appear in tools, rituals, templates, and working patterns.',
    tags: ['Templates', 'Rituals', 'Best practices'],
    cta: 'Explore Workspace',
    path: '/marketplace/guides',
    bg: 'bg-white',
    accent: 'text-[#131e42]',
    badgeColor: 'text-[#131e42]',
    iconColor: '#e1513b',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: i * 0.05 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/* -----------------------------------------
   Honeycomb SVG background
   ----------------------------------------- */

function HoneycombPattern() {
  const rows = 6;
  const cols = 10;
  const size = 48;
  const width = size * Math.sqrt(3);
  const height = size * 2;
  const offsetX = width / 2;
  const offsetY = height / 2;

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.4]"
      viewBox={`0 0 ${cols * width + offsetX} ${rows * height + offsetY}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="ghc-hex-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0,0%,70%)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="hsl(0,0%,70%)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="ghc-hex-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0,0%,60%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(0,0%,60%)" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <g fill="url(#ghc-hex-fill)" stroke="url(#ghc-hex-stroke)" strokeWidth="1">
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const x = col * width + (row % 2) * (width / 2) + offsetX;
            const y = row * (height * 0.75) + offsetY;
            const points = [
              [x, y - size],
              [x + (size * Math.sqrt(3)) / 2, y - size / 2],
              [x + (size * Math.sqrt(3)) / 2, y + size / 2],
              [x, y + size],
              [x - (size * Math.sqrt(3)) / 2, y + size / 2],
              [x - (size * Math.sqrt(3)) / 2, y - size / 2],
            ]
              .map(([px, py]) => `${px},${py}`)
              .join(' ');
            return <polygon key={`${row}-${col}`} points={points} />;
          })
        )}
      </g>
    </svg>
  );
}

/* -----------------------------------------
   Floating orbs (framer-motion)
   ----------------------------------------- */

function FloatingOrbs() {
  const orbs = [
    { size: 60, x: '12%', y: '18%', delay: 0, duration: 8 },
    { size: 45, x: '85%', y: '22%', delay: 1, duration: 10 },
    { size: 55, x: '72%', y: '58%', delay: 2, duration: 9 },
    { size: 40, x: '22%', y: '68%', delay: 0.5, duration: 11 },
    { size: 50, x: '48%', y: '38%', delay: 1.5, duration: 7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#d4a574] opacity-[0.15]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -18, 12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

/* -----------------------------------------
   Main component
   ----------------------------------------- */

export function GHCLanding() {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleEnterHoneycomb = useCallback(() => {
    navigate('/marketplace/guides/dq-ghc');
  }, [navigate]);

  const handleReadStorybook = useCallback(() => {
    const el = document.getElementById('ghc-what');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToCarousel = useCallback(() => {
    document.getElementById('ghc-carousel')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToNext = useCallback(() => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.scrollWidth / COMPETENCY_CARDS.length;
    const nextIndex = Math.min(carouselIndex + 1, COMPETENCY_CARDS.length - 1);
    carouselRef.current.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
    setCarouselIndex(nextIndex);
  }, [carouselIndex]);

  const scrollToPrev = useCallback(() => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.scrollWidth / COMPETENCY_CARDS.length;
    const nextIndex = Math.max(carouselIndex - 1, 0);
    carouselRef.current.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
    setCarouselIndex(nextIndex);
  }, [carouselIndex]);

  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const cardWidth = scrollWidth / COMPETENCY_CARDS.length;
    const index = Math.round(scrollLeft / cardWidth);
    setCarouselIndex(Math.min(index, COMPETENCY_CARDS.length - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.scrollWidth / COMPETENCY_CARDS.length;
    carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    setCarouselIndex(index);
  }, []);

  return (
    <div className="ghc-page flex min-h-screen flex-col bg-[hsl(var(--ghc-background))]">
      <Header />

      {/* -----------------------------------------
          1. HERO SECTION — match reference hero UI
          ----------------------------------------- */}
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
        style={{
          background: 'linear-gradient(135deg, #131e42 0%, #1b2553 45%, #e1513b 100%)',
        }}
      >
        <div className="absolute inset-0 z-0">
          <HoneycombPattern />
        </div>
        <FloatingOrbs />

        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center max-w-4xl">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-[#f0f6ff]/20 border border-[#e1513b]/50 shadow-sm px-4 py-1.5 text-sm text-[#e1513b] backdrop-blur mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 text-[#e1513b]" />
            <span>The Golden Honeycomb of Competencies (GHC)</span>
          </motion.div>
          <motion.div
            className="mx-auto flex flex-col items-center justify-center text-center gap-4"
            style={{ maxWidth: '100%' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="ghc-font-display font-bold text-white"
              style={{
                fontSize: 'clamp(40px, 5vw, 72px)',
                lineHeight: 1.05,
                whiteSpace: 'nowrap',
              }}
            >
              The world of work is{' '}
              <span className="text-[#e1513b] underline decoration-[#e1513b] decoration-4 underline-offset-8">
                broken.
              </span>
            </span>
            <span
              className="text-white/85"
              style={{
                fontSize: 'clamp(16px, 2.6vw, 20px)',
                lineHeight: 1.1,
                maxWidth: '100%',
                whiteSpace: 'normal',
              }}
            >
              DQ built a new operating system for modern work designed for complexity, change, and impact.
            </span>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-4 justify-center mt-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="button"
              onClick={handleReadStorybook}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border border-[#f0f6ff]/50 text-[#f0f6ff] bg-white/10 hover:bg-white/15 transition-colors shadow-sm"
            >
              <BookOpen className="h-5 w-5 text-white" />
              Read the Storybook
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-8 text-sm text-white/80 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-white font-semibold text-lg">7</span>
              <span>Competencies</span>
            </div>
            <span className="h-5 w-px bg-white/40" aria-hidden />
            <div className="flex items-baseline gap-2">
              <span className="text-white font-semibold text-lg">1</span>
              <span>System</span>
            </div>
            <span className="h-5 w-px bg-white/40" aria-hidden />
            <div className="flex items-baseline gap-2">
              <span className="text-white font-semibold text-lg">∞</span>
              <span>Impact</span>
            </div>
          </motion.div>
        </div>

        <motion.button
          type="button"
          onClick={scrollToCarousel}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#b0b0b0] hover:text-[#2c2c2c] transition-colors"
          aria-label="Scroll to next section"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] font-medium">DISCOVER</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.button>
      </section>

      {/* -----------------------------------------
          2. WHAT IS GHC SECTION
          ----------------------------------------- */}
      <SectionWhatIsGHC onReadStorybook={handleEnterHoneycomb} />

      {/* -----------------------------------------
          3. SEVEN RESPONSES CAROUSEL
          ----------------------------------------- */}
      <SectionCarousel
        carouselRef={carouselRef}
        carouselIndex={carouselIndex}
        onPrev={scrollToPrev}
        onNext={scrollToNext}
        onScroll={handleCarouselScroll}
        onDotClick={goToSlide}
        onExploreMarketplace={() => navigate('/marketplace/guides')}
      />

      {/* -----------------------------------------
          4. TAKE ACTION SECTION
          ----------------------------------------- */}
      <SectionTakeAction navigate={navigate} />

      {/* -----------------------------------------
          5. FINAL CTA SECTION
          ----------------------------------------- */}
      <SectionFinalCTA navigate={navigate} />

      <Footer isLoggedIn={false} />
    </div>
  );
}

/* -----------------------------------------
   Section: What is GHC
   ----------------------------------------- */

interface SectionWhatIsGHCProps {
  onReadStorybook: () => void;
}

function SectionWhatIsGHC({ onReadStorybook }: SectionWhatIsGHCProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="ghc-what" ref={ref} className="py-20 md:py-28 bg-[#f0f6ff]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-6xl mx-auto"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          custom={0}
        >
          <motion.p
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-[#f0f6ff]/20 border border-[#e1513b]/50 shadow-sm px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#e1513b] backdrop-blur mb-4"
          >
            THE FOUNDATION
          </motion.p>
          <div className="mx-auto w-fit text-center space-y-3">
            <motion.h2
              variants={itemVariants}
              className="ghc-font-display text-4xl md:text-6xl font-bold text-[#131e42]"
              style={{
                whiteSpace: 'nowrap',
                fontSize: 'clamp(32px, 5vw, 56px)',
                lineHeight: 1.05,
              }}
            >
              What is the Golden Honeycomb?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-[#4a5678] text-base md:text-lg leading-relaxed"
              style={{
                whiteSpace: 'nowrap',
                fontSize: 'clamp(15px, 2.6vw, 20px)',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Not a framework to memorise — an operating system for modern work that guides how you think, decide, adapt, and create impact.
            </motion.p>
          </div>

        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-6xl mx-auto"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          custom={1}
        >
          {FEATURE_CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white border border-[#e0e7ff] shadow-sm hover:shadow-md transition-shadow text-center px-10 py-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ffe7e0] flex items-center justify-center mx-auto mb-6">
                <card.icon className="h-6 w-6 text-[#e1513b]" />
              </div>
              <h3 className="ghc-font-display text-2xl font-semibold text-[#131e42] mb-4">
                {card.title}
              </h3>
              <p className="text-[#4a5678] text-sm leading-relaxed max-w-[22rem] mx-auto">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex justify-center max-w-6xl mx-auto px-2"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <button
            type="button"
            onClick={onReadStorybook}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold border border-[#d9e3ff] text-[#131e42] bg-white hover:bg-[#e8eefc] transition-colors shadow-sm"
          >
            <BookOpen className="h-5 w-5" />
            Read the full GHC storybook
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* -----------------------------------------
   Section: Seven Responses Carousel
   ----------------------------------------- */

interface SectionCarouselProps {
  carouselRef: React.RefObject<HTMLDivElement>;
  carouselIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onScroll: () => void;
  onDotClick: (index: number) => void;
  onExploreMarketplace: () => void;
}

function SectionCarousel({
  carouselRef,
  carouselIndex,
  onPrev,
  onNext,
  onScroll,
  onDotClick,
  onExploreMarketplace,
}: SectionCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      id="ghc-carousel"
      ref={ref}
      className="relative py-24 bg-white"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <motion.div className="mb-8 relative" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-[#f0f6ff]/20 border border-[#e1513b]/50 text-[#e1513b] shadow-sm backdrop-blur"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35 }}
            >
              THE FRAMEWORK
            </motion.span>
            <motion.h2
              className="ghc-font-display text-4xl md:text-5xl font-semibold text-[#131e42] mt-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 }}
              style={{
                whiteSpace: 'nowrap',
                fontSize: 'clamp(32px, 4.2vw, 56px)',
                lineHeight: 1.05,
              }}
            >
              Seven Responses in Action
            </motion.h2>
            <motion.p
              className="text-[#4a5678] max-w-2xl mx-auto mt-3 text-lg md:text-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 }}
              style={{
                whiteSpace: 'nowrap',
                fontSize: 'clamp(15px, 2.2vw, 20px)',
                lineHeight: 1.2,
              }}
            >
              Each response exists because traditional work broke down, and DQ realigned it with clarity and action.
            </motion.p>
            </div>
            <div className="flex items-center gap-3 self-end">
            <button
              type="button"
              onClick={onPrev}
              className="w-11 h-11 rounded-full bg-white/95 backdrop-blur border border-[#dce5ff] shadow-lg flex items-center justify-center text-[#131e42] hover:bg-[#f0f6ff] hover:text-[#e1513b] transition-colors"
              aria-label="Previous competency"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="w-11 h-11 rounded-full bg-white/95 backdrop-blur border border-[#dce5ff] shadow-lg flex items-center justify-center text-[#131e42] hover:bg-[#f0f6ff] hover:text-[#e1513b] transition-colors"
              aria-label="Next competency"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {RESPONSE_TAGS.map((tag, i) => (
            <span
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                i === 0 ? 'bg-[#131e42] text-white shadow-md' : 'bg-[#f0f6ff] text-[#131e42]'
              } cursor-default`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-6 left-0 w-16 bg-gradient-to-r from-white via-white/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-6 right-0 w-16 bg-gradient-to-l from-white via-white/60 to-transparent" />

          <div
            ref={carouselRef}
            onScroll={onScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 md:px-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {COMPETENCY_CARDS.map((card, index) => (
              <motion.div
                key={card.id}
                className="flex-shrink-0 min-w-[320px] max-w-[380px] md:min-w-[360px] md:max-w-[420px] lg:min-w-[420px] lg:max-w-[460px] snap-start"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.08 + 0.08 }}
              >
                <CompetencyCard card={card} index={index} />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-10">
            {COMPETENCY_CARDS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onDotClick(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === carouselIndex
                    ? 'w-6 h-2 bg-[#e1513b]'
                    : 'w-2 h-2 bg-[#131e42]/50 hover:bg-[#131e42]/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
        >
          <button
            type="button"
            onClick={onExploreMarketplace}
            className="px-7 py-3.5 rounded-full font-semibold border border-[#dce5ff] bg-white text-[#131e42] hover:bg-[#f0f6ff] hover:text-[#e1513b] transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            View all Seven Responses in the Knowledge Center
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

interface CompetencyCardProps {
  card: CompetencyCard;
  index: number;
}

function CompetencyCard({ card, index }: CompetencyCardProps) {
  const navigate = useNavigate();
  const Icon = card.icon;

  return (
    <motion.article
      className="relative overflow-hidden rounded-3xl bg-white border border-[#e5e9f5] shadow-sm hover:shadow-lg transition-all flex flex-col min-h-[480px]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="h-52 w-full overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex items-start justify-between">
          <h3 className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42] max-w-[80%]">
            {card.title}
          </h3>
          <span className="bg-[#f0f6ff] text-[#1f2d5c] text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
            {card.category}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#6b7390]">
          <Hexagon className="h-4 w-4" />
          <span>DQ Workspace • Real scenario</span>
        </div>

        <div className="space-y-1">
          <p className="text-[#4a5678] text-sm leading-relaxed">
            <span className="font-semibold text-[#131e42]">Problem: </span>
            {card.problem}
          </p>
          <p className="text-[#4a5678] text-sm leading-relaxed">
            <span className="font-semibold text-[#131e42]">Response: </span>
            {card.response}
          </p>
        </div>

        <div className="mt-auto">
          <button
            type="button"
            onClick={() => navigate(card.route)}
            className="text-[#e1513b] font-semibold inline-flex items-center gap-1 hover:underline"
          >
            Explore in Knowledge Center
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* -----------------------------------------
   Section: Take Action
   ----------------------------------------- */

function SectionTakeAction({ navigate }: { navigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="py-20 md:py-24"
      style={{
        background: 'linear-gradient(180deg, #f0f6ff 0%, #ffffff 55%, #f0f6ff 100%)',
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-[#f0f6ff]/20 border border-[#e1513b]/50 text-[#e1513b] shadow-sm backdrop-blur mx-auto mb-2">
            TAKE ACTION
          </p>
          <h2 className="ghc-font-display text-3xl md:text-4xl font-semibold text-[#131e42] mb-3">
            Bring it to life
          </h2>
          <p className="text-[#4a5678] max-w-2xl mx-auto text-lg">
            Understanding is the start. GHC becomes real through application, practice, and lived experience.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          custom={0}
        >
          {ACTION_CARDS.map((item, i) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
            className={`group relative p-7 md:p-9 rounded-3xl ${item.bg} shadow-[0_10px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all`}
          >
            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-center">
                <item.icon className="h-6 w-6" style={{ color: item.iconColor }} />
              </div>
              <div className="flex-1 space-y-1">
                <p className={`text-xs font-semibold tracking-[0.18em] uppercase ${item.badgeColor}`}>
                  {item.badge}
                </p>
                <h3 className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42]">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-[#4a5678]">{item.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-white/75 text-[#131e42] px-3 py-1 text-xs font-medium shadow-sm cursor-default"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.iconColor }} />
                      {tag}
                    </span>
                  ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(item.path)}
                className={`inline-flex items-center gap-1 text-sm font-semibold mt-6 ${item.accent} group-hover:underline`}
              >
                {item.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -----------------------------------------
   Section: Final CTA
   ----------------------------------------- */

function SectionFinalCTA({ navigate }: { navigate: (path: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(240,246,255,0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(225,81,59,0.25), transparent 45%), linear-gradient(115deg, #131e42 0%, #1f2d5c 60%, #e1513b 100%)',
      }}
    >
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="relative min-h-[420px] lg:min-h-[520px] flex items-center">
          {/* Animated background orbs */}
          <motion.div
            className="absolute w-[420px] h-[420px] rounded-full blur-3xl"
            style={{ left: '-10%', top: '10%', backgroundColor: 'rgba(240,246,255,0.28)' }}
            animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[360px] h-[360px] rounded-full blur-3xl"
            style={{ right: '5%', bottom: '-5%', backgroundColor: 'rgba(225,81,59,0.28)' }}
            animate={{ x: [0, -25, 15, 0], y: [0, 18, -12, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="relative z-10 max-w-3xl py-16 md:py-20 px-2 sm:px-4 md:px-0 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
          <motion.p
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-white/15 border border-[#e1513b]/50 text-[#e1513b] backdrop-blur mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            DQ Digital Workspace
          </motion.p>
            <motion.h2
              className="ghc-font-display font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-[1.1] text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Work aligned inside the Golden Honeycomb
            </motion.h2>
            <motion.p
              className="mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              The Golden Honeycomb comes to life inside the DQ Digital Workspace, guiding tools, decisions, and daily work.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
            <button
              type="button"
              onClick={() => navigate('/lms')}
              className="inline-flex items-center gap-2.5 h-[52px] px-7 rounded-lg bg-white text-[#131e42] font-semibold text-base shadow-xl shadow-black/12 transition transform hover:-translate-y-0.5 hover:bg-white/95"
            >
              Start working in DWS
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/marketplace/guides/dq-ghc')}
              className="group inline-flex items-center gap-2 h-[52px] px-7 rounded-lg border-2 border-white/60 text-white font-semibold text-base transition transform hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/80"
            >
              Explore the Digital Workspace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
        </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default GHCLanding;
