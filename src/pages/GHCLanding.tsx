import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  RefreshCw,
  Layers,
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
}

const COMPETENCY_CARDS: CompetencyCard[] = [
  {
    id: 'purpose',
    number: 1,
    category: 'Purpose/Vision',
    title: 'Vision',
    story:
      'Work drifts when pressure hits. Vision keeps your direction stable so daily decisions line up with purpose.',
    problem: 'Teams drift when pressure hits.',
    response: 'Vision keeps direction stable so your daily decisions stay aligned.',
    route: '/marketplace/guides/dq-vision',
    icon: Target,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]',
    accent: '#f0f6ff',
  },
  {
    id: 'culture',
    number: 2,
    category: 'Culture / House of Values',
    title: 'House of Values',
    story:
      'Misaligned incentives slow decisions. Values give your team a shared rulebook so speed and trust hold under pressure.',
    problem: 'Decisions slow when incentives split.',
    response: 'Values give a shared rulebook so teams move fast with trust.',
    route: '/marketplace/guides/dq-hov',
    icon: Heart,
    gradient: 'bg-gradient-to-br from-[#1b2553] via-[#243a75] to-[#e1513b]',
    accent: '#f0f6ff',
  },
  {
    id: 'identity',
    number: 3,
    category: 'Identity/Persona',
    title: 'Persona',
    story:
      'Roles change weekly. Persona clarifies the value you promise every squad so your impact stays consistent.',
    problem: 'Roles shift; titles lose meaning.',
    response: 'Persona makes your contribution clear in any team.',
    route: '/marketplace/guides/dq-persona',
    icon: User,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#30478a] to-[#f0f6ff]',
    accent: '#f0f6ff',
  },
  {
    id: 'execution',
    number: 4,
    category: 'Execution / Agile TMS',
    title: 'Agile TMS',
    story:
      'Strategy shifts faster than backlogs. Agile TMS turns direction into adaptive missions so teams can adjust without losing control.',
    problem: 'Strategy changes faster than plans.',
    response: 'Agile TMS turns direction into adaptive missions and cadence.',
    route: '/marketplace/guides/dq-agile-tms',
    icon: Zap,
    gradient: 'bg-gradient-to-br from-[#1f2c63] via-[#2d3f80] to-[#e1513b]',
    accent: '#f0f6ff',
  },
  {
    id: 'governance',
    number: 5,
    category: 'Governance / Agile SoS',
    title: 'Agile SoS',
    story:
      'Traditional governance slows high-speed teams. Agile SoS installs light guardrails, quality signals, and risk rhythms so confidence rises with speed instead of fighting it.',
    problem: 'Heavy governance stalls speed.',
    response: 'Agile SoS uses light guardrails and signals so you ship fast with quality.',
    route: '/marketplace/guides/dq-agile-sos',
    icon: Shield,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1b2553] to-[#e1513b]',
    accent: '#f0f6ff',
  },
  {
    id: 'flow',
    number: 6,
    category: 'Flow / Agile Flows',
    title: 'Agile Flows',
    story:
      'Value evaporates in handoffs. Agile Flows connects intent to outcomes end-to-end so feedback outruns blockers.',
    problem: 'Work breaks in handoffs.',
    response: 'Agile Flows connects intent to outcomes so feedback moves faster than blockers.',
    route: '/marketplace/guides/dq-agile-flows',
    icon: GitBranch,
    gradient: 'bg-gradient-to-br from-[#1b2553] via-[#30478a] to-[#e1513b]',
    accent: '#f0f6ff',
  },
  {
    id: 'transform',
    number: 7,
    category: 'Transform / Agile 6xD',
    title: 'Agile 6xD',
    story:
      'Transformations stall after pilots. Agile 6xD makes change repeatable—diagnose, design, deliver, deploy, drive, defend—so evolution becomes normal work.',
    problem: 'Pilots succeed but change stalls.',
    response: '6xD makes transformation repeatable—diagnose, design, deliver, deploy, drive, defend.',
    route: '/marketplace/guides/dq-agile-6xd',
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1f2c63] to-[#e1513b]',
    accent: '#f0f6ff',
  },
];

const FEATURE_CARDS = [
  {
    title: 'Operating DNA',
    icon: Hexagon,
    description: 'How you analyse situations, make decisions, and act with clarity when work becomes complex and unpredictable.',
  },
  {
    title: 'Built for Change',
    icon: RefreshCw,
    description: 'Designed for work that never stands still, where roles shift, priorities change, and learning happens through action.',
  },
  {
    title: 'Seven Elements',
    icon: Layers,
    description: 'Seven connected responses working together as one operating system for the reality of modern work.',
  },
];

const ACTION_CARDS = [
  {
    title: 'Learn by doing',
    icon: GraduationCap,
    badge: 'Courses',
    description: 'Built on real work. Execute inside live projects.',
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
    description: 'Real journeys and decisions. GHC through the people who use it.',
    tags: ['Case studies', 'Behind the scenes', 'Lessons learned'],
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
    description: 'Practise competencies on live challenges.',
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
    description: 'Tools, rituals, and daily work inside DQ.',
    tags: ['Templates', 'Rituals', 'Best practices'],
    cta: 'Explore Workspace',
    path: '/',
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
  const [isCarouselPaused, setCarouselPaused] = useState(false);

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

  useEffect(() => {
    if (isCarouselPaused) return;

    const id = window.setInterval(() => {
      setCarouselIndex((prev) => {
        const nextIndex = (prev + 1) % COMPETENCY_CARDS.length;
        const track = carouselRef.current;

        if (track) {
          const cardWidth = track.scrollWidth / COMPETENCY_CARDS.length;
          track.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
        }

        return nextIndex;
      });
    }, 5000);

    return () => window.clearInterval(id);
  }, [isCarouselPaused]);

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
            className="inline-flex items-center gap-2 rounded-full bg-[#f0f6ff]/20 border border-[#f0f6ff]/40 shadow-sm px-4 py-1.5 text-sm text-[#f0f6ff] mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 text-[#f0f6ff]" />
            <span>Welcome to the Golden Honeycomb of Competencies (GHC)</span>
          </motion.div>
          <div className="mx-auto w-fit text-center">
            <motion.h1
              className="ghc-font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4"
              style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                lineHeight: 1.05,
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              The world of work is{' '}
              <span className="text-[#e1513b] underline decoration-[#e1513b] decoration-4 underline-offset-8">
                broken.
              </span>
            </motion.h1>
            <motion.p
              className="text-[18px] text-white/85 mb-10 leading-relaxed"
              style={{
                fontSize: 'clamp(16px, 3vw, 20px)',
                textAlign: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              DQ built a new operating system for modern work designed for complexity, change, and impact.
            </motion.p>
          </div>
          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-10"
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
        onPause={() => setCarouselPaused(true)}
        onResume={() => setCarouselPaused(false)}
        onExploreMarketplace={() => navigate('/marketplace')}
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
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          custom={0}
        >
          <motion.p
            variants={itemVariants}
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#e1513b] mb-4"
          >
            THE FOUNDATION
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="ghc-font-display text-4xl md:text-6xl font-bold text-[#131e42] mb-5"
          >
            What is the Golden Honeycomb?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-[#4a5678] text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
          >
            Not a framework to memorise — a system you live inside, guiding how you think, decide, adapt, and create impact.
          </motion.p>

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
  carouselRef: React.RefObject<HTMLDivElement | null>;
  carouselIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onScroll: () => void;
  onDotClick: (index: number) => void;
  onPause: () => void;
  onResume: () => void;
  onExploreMarketplace: () => void;
}

function SectionCarousel({
  carouselRef,
  carouselIndex,
  onPrev,
  onNext,
  onScroll,
  onDotClick,
  onPause,
  onResume,
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
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-[#fde6de] text-[#e1513b] shadow-sm"
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
          >
            Seven responses
          </motion.h2>
          <motion.p
            className="text-[#4a5678] max-w-2xl mx-auto mt-3 text-lg md:text-xl"
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            Each exists because something in traditional work stopped working. Problem → response.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-y-10 left-0 right-0 mx-auto max-w-6xl pointer-events-none">
            <div className="h-full bg-gradient-to-r from-white via-transparent to-white opacity-90" />
          </div>

          <div className="absolute right-3 sm:right-6 -top-10 flex items-center gap-3">
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

          <div
            ref={carouselRef}
            onScroll={onScroll}
            onMouseEnter={onPause}
            onMouseLeave={onResume}
            onTouchStart={onPause}
            onTouchEnd={onResume}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-6 px-6 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {COMPETENCY_CARDS.map((card, index) => (
              <motion.div
                key={card.id}
                className="flex-shrink-0 min-w-[calc(100vw-48px)] md:min-w-[760px] lg:min-w-[900px] max-w-[900px] snap-center"
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
            Explore all 7 elements in the Marketplace
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
  const [open, setOpen] = useState(false);
  const patternId = `ghc-pattern-${card.id}`;

  return (
    <motion.article
      className={`relative overflow-hidden rounded-3xl min-h-[400px] md:min-h-[430px] w-full cursor-pointer text-white shadow-[0_18px_40px_rgba(19,30,66,0.18)] hover:shadow-[0_24px_48px_rgba(19,30,66,0.24)] transition-shadow ${card.gradient}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-12" aria-hidden>
          <defs>
            <pattern id={patternId} x="0" y="0" width="64" height="32" patternUnits="userSpaceOnUse">
              <rect x="6" y="6" width="36" height="14" rx="7" fill="white" fillOpacity="0.22" />
              <rect x="26" y="18" width="36" height="14" rx="7" fill="white" fillOpacity="0.16" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
      </div>

      <div className="absolute right-8 top-7 text-3xl font-display font-medium tracking-tight text-white/20">
        {String(card.number).padStart(2, '0')}
      </div>

      <div className="relative flex h-full flex-col justify-between gap-5 p-8 md:p-12 z-10">
        <div className="flex items-center justify-between">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 + 0.2 }}
          >
            <Icon className="h-4 w-4" />
            {card.category}
          </motion.span>
        </div>

        <div className="space-y-3 max-w-3xl">
          <h3 className="ghc-font-display text-3xl md:text-4xl font-semibold leading-tight drop-shadow-sm">
            {card.title}
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-white/90">{card.story}</p>
        </div>

        <div className="mt-auto space-y-4">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center justify-between w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium tracking-wide text-white/80 backdrop-blur transition hover:bg-white/15 hover:text-white"
            aria-expanded={open}
          >
            <span className="flex items-center gap-2">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                style={{ color: '#f0f6ff' }}
              />
              {open ? 'Hide Problem & Response' : 'View Problem & Response'}
            </span>
            <span className="text-xs font-medium text-white/80">Tap to {open ? 'collapse' : 'reveal'}</span>
          </button>

          <motion.div
            initial={false}
            animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-white/20 space-y-2 text-sm md:text-base leading-relaxed">
              <p className="text-white/90">
                <span className="font-semibold text-white">Problem: </span>
                {card.problem}
              </p>
              <p className="text-white/95">
                <span className="font-semibold text-white">Response: </span>
                {card.response}
              </p>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={() => navigate(card.route)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-transform group"
          >
            Explore in Marketplace
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
          <p className="text-xs uppercase tracking-[0.24em] font-semibold text-[#e1513b] mb-2">
            TAKE ACTION
          </p>
          <h2 className="ghc-font-display text-3xl md:text-4xl font-semibold text-[#131e42] mb-3">
            Bring it to life
          </h2>
          <p className="text-[#4a5678] max-w-2xl mx-auto text-lg">
            Understanding is the start. Real learning happens by doing.
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
            className={`group relative p-7 md:p-9 rounded-3xl ${item.bg} shadow-[0_10px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all cursor-pointer`}
            onClick={() => navigate(item.path)}
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
                      className="inline-flex items-center gap-1 rounded-full bg-white/75 text-[#131e42] px-3 py-1 text-xs font-medium shadow-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.iconColor }} />
                      {tag}
                    </span>
                  ))}
                  </div>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 text-sm font-semibold mt-6 ${item.accent} group-hover:underline`}
              >
                {item.cta}
                <ArrowRight className="h-4 w-4" />
              </span>
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
              className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Join the community
            </motion.p>
            <motion.h2
              className="ghc-font-display font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-[1.1] text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Continue the journey inside the Golden Honeycomb
            </motion.h2>
            <motion.p
              className="mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Connect with a vibrant community of Qatalysts. Share your story, access resources, and help shape the future of meaningful work.
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
              Join a Course
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/marketplace/guides/dq-ghc')}
              className="group inline-flex items-center gap-2 h-[52px] px-7 rounded-lg border-2 border-white/60 text-white font-semibold text-base transition transform hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/80"
            >
              Read the Storybook
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
