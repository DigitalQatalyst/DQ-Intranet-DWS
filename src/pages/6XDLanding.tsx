import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import { FadeInUpOnScroll } from '../components/AnimationUtils';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SixXDElement {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  question: string;
  narrative: string;
  highlight?: string;
  supportingLines?: string[];
  imageSrc?: string;
  imageAlt?: string;
  storybookUrl?: string;
  route: string;
  ctaText?: string;
  secondaryCtaText?: string;
  secondaryRoute?: string;
}

const sixXDElements: SixXDElement[] = [
  {
    id: 'digital-economy',
    number: '01',
    title: 'Digital Economy (DE)',
    subtitle: 'Products',
    question: 'Why should organisations change?',
    narrative: '',
    highlight: '',
    supportingLines: [
      'The Digital Economy perspective helps leaders understand shifts in market dynamics, customer expectations, and value creation models.',
      'It reveals why transformation is no longer optional, identifying the forces reshaping industries and defining new competitive realities.',
      'Outcome: Clear rationale for change grounded in economic, market, and customer realities.',
    ],
    imageSrc: 'https://i.ibb.co/4gMJwcMn/fcda747f-9134-4bc3-b99b-c6fa93e7f4a2.png',
    imageAlt: 'Digital Economy visual',
    route: '/marketplace/guides/digital-economy',
    ctaText: 'View Courses'
  },
  {
    id: 'digital-cognitive-organisation',
    number: '02',
    title: 'Digital Cognitive Organisation (DCO)',
    subtitle: 'Products',
    question: 'Where are organisations headed?',
    narrative: '',
    highlight: '',
    supportingLines: [
      'DCO defines the future enterprise—intelligent, adaptive, and orchestrated.',
      'It focuses on organisations that can sense, learn, decide, and respond across people, systems, and data—continuously improving performance and resilience.',
      'Outcome: A clear vision of what a modern, intelligent organisation must become.',
    ],
    imageSrc: 'https://i.ibb.co/B5B8MB7q/2.png',
    imageAlt: 'Digital Cognitive Organisation visual',
    route: '/marketplace/guides/digital-cognitive-organisation',
    ctaText: 'View Courses'
  },
  {
    id: 'digital-business-platforms',
    number: '03',
    title: 'Digital Business Platforms (DBP)',
    subtitle: 'Products',
    question: 'What must be built to enable transformation?',
    narrative: '',
    highlight: '',
    supportingLines: [
      'DBP focuses on the modular, integrated, and data-driven platforms that unify operations and make transformation scalable.',
      'It replaces fragmented systems with architectures designed for agility, interoperability, and long-term resilience.',
      'Outcome: A strong, scalable digital foundation that supports continuous change.',
    ],
    imageSrc: 'https://i.ibb.co/vxj7WPbT/00e1db1f-22ae-48be-b65d-a50a65f3df62.png',
    imageAlt: 'Digital Business Platforms visual',
    route: '/marketplace/guides/digital-business-platforms',
    ctaText: 'View Courses'
  },
  {
    id: 'digital-transformation-2',
    number: '04',
    title: 'Digital Transformation 2.0 (DT2.0)',
    subtitle: 'Products',
    question: 'How should transformation be designed and deployed?',
    narrative: '',
    highlight: '',
    supportingLines: [
      'DT2.0 reframes transformation as a design and orchestration discipline, not a collection of disconnected projects.',
      'It introduces the methods, flows, and governance needed to make transformation repeatable, measurable, and outcome-driven.',
      'Outcome: Transformation becomes intentional, structured, and sustainable.',
    ],
    imageSrc: 'https://i.ibb.co/9HnKK9wv/abfa33bc-933f-4770-9a25-11cbe7112dd5.png',
    imageAlt: 'Digital Transformation 2.0 visual',
    route: '/marketplace/guides/digital-transformation-2',
    ctaText: 'View Courses'
  },
  {
    id: 'digital-worker-workspace',
    number: '05',
    title: 'Digital Worker & Workspace (DW:WS)',
    subtitle: 'Products',
    question: 'Who delivers the change, and how do they work?',
    narrative: '',
    highlight: '',
    supportingLines: [
      'DW:WS centers on people—their roles, skills, and digital environments.',
      'It ensures teams are empowered with the capabilities, tools, and workspaces needed to deliver and sustain transformation effectively.',
      'Outcome: Digitally enabled teams capable of executing and evolving transformation.',
    ],
    imageSrc: 'https://i.ibb.co/BHT9XcYz/9bc86c42-a859-40c8-b8b1-10d61d8f65cd.png',
    imageAlt: 'Digital Worker & Workspace visual',
    route: '/marketplace/guides/digital-worker-workspace',
    ctaText: 'View Courses'
  },
  {
    id: 'digital-accelerators',
    number: '06',
    title: 'Digital Accelerators (Tools)',
    subtitle: 'Products',
    question: 'When is value realised — and how fast?',
    narrative: '',
    highlight: '',
    supportingLines: [
      'Digital Accelerators are DQ-owned products and tools that remove friction from delivery and compress time-to-value.',
      'They create repeatable execution strength: clearer alignment, faster decision cycles, and consistent delivery quality across teams and markets.',
      'This is where strategy turns into shipped outcomes through practical systems that make progress measurable and momentum sustainable.',
    ],
    imageSrc: 'https://i.ibb.co/XxzLrf63/ef651d21-87a7-4980-be29-dd04b00e6d32.png',
    imageAlt: 'Digital Accelerators visual',
    route: '/knowledge-center/products/digital-accelerators',
    ctaText: 'Explore Digital Accelerators',
    secondaryCtaText: 'View Products',
    secondaryRoute: '/marketplace/directory/products'
  }
];

function SectionImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) {
  return (
      <div className="w-full max-w-full lg:w-[736px] h-[416px] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm" />
    );
  }

  return (
    <div className="w-full max-w-full lg:w-[736px] h-[416px] overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg">
      <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

export function SixXDLanding() {
  const navigate = useNavigate();
  const handleExploreElement = (route: string) => {
    navigate(route);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes honeycombDrift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 60%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(15px) rotate(5deg); }
          50% { transform: translateY(-15px) translateX(-15px) rotate(-5deg); }
          75% { transform: translateY(15px) translateX(10px) rotate(3deg); }
        }
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes gradientDrift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes perspectivePulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        @keyframes dataFlow {
          0% { transform: translateX(-100px) translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100px) translateY(0); opacity: 0; }
        }
        @keyframes nodeConnect {
          0%, 100% { stroke-dashoffset: 0; opacity: 0.3; }
          50% { stroke-dashoffset: -20; opacity: 0.6; }
        }
        @keyframes radialExpand {
          0% { transform: scale(0.8); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(0.8); opacity: 0.2; }
        }
      `}</style>
      <Header />

      <main className="flex-grow">
        {/* SECTION 1 — HERO: Agile 6xD Learning & Papers */}
        <section 
          className="relative w-full overflow-hidden flex flex-col isolate h-auto md:h-[600px] lg:h-[700px] pt-24 pb-20 md:pt-24 md:pb-20"
        >
          {/* Animated DWS Gradient Base */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, #030F35 0%, #1A2E6E 25%, #030F35 50%, #1A2E6E 75%, #030F35 100%)',
              backgroundSize: '300% 300%',
              animation: 'gradientDrift 18s ease infinite'
            }}
          />

          {/* 6XD Framework: Six Perspective Nodes */}
          <div className="absolute inset-0 z-[2] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="perspectiveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1A2E6E" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="perspectiveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1A2E6E" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.25" />
                </linearGradient>
                <radialGradient id="nodeGlow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#1A2E6E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0" />
                </radialGradient>
                <filter id="perspectiveGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Six Perspective Nodes - Arranged in Framework Pattern */}
              {/* Node 1 - Top Left */}
              <g>
                <circle cx="400" cy="250" r="80" fill="url(#nodeGlow)" opacity="0.4" style={{ animation: 'perspectivePulse 4s ease-in-out infinite' }} filter="url(#perspectiveGlow)" />
                <circle cx="400" cy="250" r="50" fill="none" stroke="url(#perspectiveGradient1)" strokeWidth="2.5" opacity="0.5" style={{ animation: 'perspectivePulse 4s ease-in-out infinite', animationDelay: '0.5s' }} />
                {/* Radial lines from node */}
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`radial-1-${i}`}
                    x1="400"
                    y1="250"
                    x2={400 + Math.cos((i * 60) * Math.PI / 180) * 120}
                    y2={250 + Math.sin((i * 60) * Math.PI / 180) * 120}
                    stroke="url(#perspectiveGradient1)"
                    strokeWidth="1.5"
                    opacity="0.3"
                    style={{
                      animation: `radialExpand ${3 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </g>
              
              {/* Node 2 - Top Right */}
              <g>
                <circle cx="1520" cy="280" r="75" fill="url(#nodeGlow)" opacity="0.4" style={{ animation: 'perspectivePulse 4.5s ease-in-out infinite', animationDelay: '0.7s' }} filter="url(#perspectiveGlow)" />
                <circle cx="1520" cy="280" r="48" fill="none" stroke="url(#perspectiveGradient2)" strokeWidth="2.5" opacity="0.5" style={{ animation: 'perspectivePulse 4.5s ease-in-out infinite', animationDelay: '1.2s' }} />
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`radial-2-${i}`}
                    x1="1520"
                    y1="280"
                    x2={1520 + Math.cos((i * 60) * Math.PI / 180) * 110}
                    y2={280 + Math.sin((i * 60) * Math.PI / 180) * 110}
                    stroke="url(#perspectiveGradient2)"
                    strokeWidth="1.5"
                    opacity="0.3"
                    style={{
                      animation: `radialExpand ${3.5 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${0.7 + i * 0.2}s`
                    }}
                  />
                ))}
              </g>
              
              {/* Node 3 - Middle Left */}
              <g>
                <circle cx="350" cy="540" r="70" fill="url(#nodeGlow)" opacity="0.4" style={{ animation: 'perspectivePulse 5s ease-in-out infinite', animationDelay: '1.4s' }} filter="url(#perspectiveGlow)" />
                <circle cx="350" cy="540" r="45" fill="none" stroke="url(#perspectiveGradient1)" strokeWidth="2.5" opacity="0.5" style={{ animation: 'perspectivePulse 5s ease-in-out infinite', animationDelay: '1.9s' }} />
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`radial-3-${i}`}
                    x1="350"
                    y1="540"
                    x2={350 + Math.cos((i * 60) * Math.PI / 180) * 100}
                    y2={540 + Math.sin((i * 60) * Math.PI / 180) * 100}
                    stroke="url(#perspectiveGradient1)"
                    strokeWidth="1.5"
                    opacity="0.3"
                    style={{
                      animation: `radialExpand ${4 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${1.4 + i * 0.2}s`
                    }}
                  />
                ))}
              </g>
              
              {/* Node 4 - Center */}
              <g>
                <circle cx="960" cy="540" r="90" fill="url(#nodeGlow)" opacity="0.45" style={{ animation: 'perspectivePulse 3.5s ease-in-out infinite' }} filter="url(#perspectiveGlow)" />
                <circle cx="960" cy="540" r="60" fill="none" stroke="url(#perspectiveGradient1)" strokeWidth="3" opacity="0.6" style={{ animation: 'perspectivePulse 3.5s ease-in-out infinite', animationDelay: '0.3s' }} />
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`radial-4-${i}`}
                    x1="960"
                    y1="540"
                    x2={960 + Math.cos((i * 60) * Math.PI / 180) * 140}
                    y2={540 + Math.sin((i * 60) * Math.PI / 180) * 140}
                    stroke="url(#perspectiveGradient1)"
                    strokeWidth="2"
                    opacity="0.35"
                    style={{
                      animation: `radialExpand ${2.5 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`
                    }}
                  />
                ))}
              </g>
              
              {/* Node 5 - Middle Right */}
              <g>
                <circle cx="1570" cy="540" r="70" fill="url(#nodeGlow)" opacity="0.4" style={{ animation: 'perspectivePulse 4.8s ease-in-out infinite', animationDelay: '2.1s' }} filter="url(#perspectiveGlow)" />
                <circle cx="1570" cy="540" r="45" fill="none" stroke="url(#perspectiveGradient2)" strokeWidth="2.5" opacity="0.5" style={{ animation: 'perspectivePulse 4.8s ease-in-out infinite', animationDelay: '2.6s' }} />
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`radial-5-${i}`}
                    x1="1570"
                    y1="540"
                    x2={1570 + Math.cos((i * 60) * Math.PI / 180) * 100}
                    y2={540 + Math.sin((i * 60) * Math.PI / 180) * 100}
                    stroke="url(#perspectiveGradient2)"
                    strokeWidth="1.5"
                    opacity="0.3"
                    style={{
                      animation: `radialExpand ${4.2 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${2.1 + i * 0.2}s`
                    }}
                  />
                ))}
              </g>
              
              {/* Node 6 - Bottom Center */}
              <g>
                <circle cx="960" cy="830" r="75" fill="url(#nodeGlow)" opacity="0.4" style={{ animation: 'perspectivePulse 5.2s ease-in-out infinite', animationDelay: '2.8s' }} filter="url(#perspectiveGlow)" />
                <circle cx="960" cy="830" r="48" fill="none" stroke="url(#perspectiveGradient2)" strokeWidth="2.5" opacity="0.5" style={{ animation: 'perspectivePulse 5.2s ease-in-out infinite', animationDelay: '3.3s' }} />
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`radial-6-${i}`}
                    x1="960"
                    y1="830"
                    x2={960 + Math.cos((i * 60) * Math.PI / 180) * 110}
                    y2={830 + Math.sin((i * 60) * Math.PI / 180) * 110}
                    stroke="url(#perspectiveGradient2)"
                    strokeWidth="1.5"
                    opacity="0.3"
                    style={{
                      animation: `radialExpand ${4.5 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${2.8 + i * 0.2}s`
                    }}
                  />
                ))}
              </g>
              
              {/* Framework Connection Lines - Connecting the 6 Perspectives */}
              <g stroke="url(#perspectiveGradient1)" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="6,4">
                {/* Connections from center node to others */}
                <path
                  d="M 960 540 L 400 250"
                  style={{
                    animation: 'nodeConnect 8s ease-in-out infinite'
                  }}
                />
                <path
                  d="M 960 540 L 1520 280"
                  style={{
                    animation: 'nodeConnect 8s ease-in-out infinite',
                    animationDelay: '1s'
                  }}
                />
                <path
                  d="M 960 540 L 350 540"
                  style={{
                    animation: 'nodeConnect 8s ease-in-out infinite',
                    animationDelay: '2s'
                  }}
                />
                <path
                  d="M 960 540 L 1570 540"
                  style={{
                    animation: 'nodeConnect 8s ease-in-out infinite',
                    animationDelay: '3s'
                  }}
                />
                <path
                  d="M 960 540 L 960 830"
                  style={{
                    animation: 'nodeConnect 8s ease-in-out infinite',
                    animationDelay: '4s'
                  }}
                />
                {/* Additional connections */}
                <path
                  d="M 400 250 L 1520 280"
                  style={{
                    animation: 'nodeConnect 10s ease-in-out infinite',
                    animationDelay: '5s'
                  }}
                />
                <path
                  d="M 350 540 L 1570 540"
                  style={{
                    animation: 'nodeConnect 10s ease-in-out infinite',
                    animationDelay: '6s'
                  }}
                />
              </g>
              
              {/* Flowing Data Streams */}
              <g opacity="0.5">
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={`data-${i}`}
                    cx={300 + i * 200}
                    cy={400 + (i % 3) * 100}
                    r="4"
                    fill="#FB5535"
                    style={{
                      animation: `dataFlow ${6 + i * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.8}s`
                    }}
                  />
                ))}
                {[...Array(6)].map((_, i) => (
                  <circle
                    key={`data2-${i}`}
                    cx={500 + i * 150}
                    cy={600 + (i % 2) * 80}
                    r="3"
                    fill="#1A2E6E"
                    style={{
                      animation: `dataFlow ${7 + i * 0.5}s ease-in-out infinite reverse`,
                      animationDelay: `${i * 1.2}s`
                    }}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Animated Framework Grid */}
          <div className="absolute inset-0 opacity-[0.1] z-[1]">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#1A2E6E" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Framework Grid Lines */}
              <g stroke="url(#gridGradient)" strokeWidth="0.8">
                {[...Array(12)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 160}
                    y1="0"
                    x2={i * 160}
                    y2="1080"
                    opacity="0.3"
                    style={{
                      animation: `pulse ${8 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
                {[...Array(9)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 120}
                    x2="1920"
                    y2={i * 120}
                    opacity="0.3"
                    style={{
                      animation: `pulse ${10 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Pulsing Radial Glows at Each Node */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            {/* Glow for each of the 6 nodes */}
            {[
              { x: '20.8%', y: '23.1%', delay: '0s' },
              { x: '79.2%', y: '25.9%', delay: '0.7s' },
              { x: '18.2%', y: '50%', delay: '1.4s' },
              { x: '50%', y: '50%', delay: '0s' },
              { x: '81.8%', y: '50%', delay: '2.1s' },
              { x: '50%', y: '76.9%', delay: '2.8s' }
            ].map((node, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: '200px',
                  height: '200px',
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)',
                  background: i % 2 === 0 
                    ? 'radial-gradient(circle, rgba(251, 85, 53, 0.2) 0%, transparent 70%)' 
                    : 'radial-gradient(circle, rgba(26, 46, 110, 0.25) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                  animation: 'pulse 6s ease-in-out infinite',
                  animationDelay: node.delay
                }}
              />
            ))}
          </div>

          {/* Animated Light Sweeps */}
          <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(30deg, transparent 25%, rgba(251, 85, 53, 0.08) 50%, transparent 75%)',
                animation: 'rotate 28s linear infinite',
                transformOrigin: 'center center',
                opacity: 0.6
              }}
            />
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(-30deg, transparent 25%, rgba(26, 46, 110, 0.08) 50%, transparent 75%)',
                animation: 'rotate 32s linear infinite reverse',
                transformOrigin: 'center center',
                opacity: 0.5,
                animationDelay: '2s'
              }}
            />
          </div>

          {/* High Contrast Area on Left for Text Readability */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: 'radial-gradient(ellipse 1000px 130% at 0% 50%, rgba(3, 15, 53, 0.65) 0%, rgba(3, 15, 53, 0.3) 50%, transparent 80%)',
            }}
          />

          <div className="w-full flex items-center relative z-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
              <div className="max-w-5xl">
              <FadeInUpOnScroll>
                <h1 
                  className="text-[48px] md:text-[56px] lg:text-[72px] xl:text-[80px] text-white mb-6 text-left font-sans"
                  style={{
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: '#FFFFFF'
                  }}
                >
                  Agile 6xD Framework
                </h1>
                <p className="text-lg md:text-xl text-white/95 mb-8 font-normal leading-relaxed text-left max-w-3xl" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Agile 6xD is how DQ designs and delivers digital transformation.
                  <br />
                  It brings six essential digital perspectives together to help organisations design, execute, and scale change with clarity and speed.
                </p>
              </FadeInUpOnScroll>

              </div>
            </div>
          </div>

          {/* Scroll-down arrow */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('sixxd-sections');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="absolute bottom-6 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/80 hover:shadow-lg"
            aria-label="Scroll to Agile 6xD sections"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </section>

        {/* ELEMENTS — Storytelling Chapters with Alternating Layout */}
        {sixXDElements.map((element, index) => {
          const isEven = index % 2 === 0;

          return (
            <section
              key={element.id}
              id={index === 0 ? 'sixxd-sections' : undefined}
              className={`py-16 md:py-24 ${isEven ? 'bg-white' : 'bg-[#F7FAFF]'}`}
            >
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <FadeInUpOnScroll>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                      <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                        <SectionImage src={element.imageSrc} alt={element.imageAlt} />
                      </div>

                      <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center max-w-2xl`}>
                        <div className="mb-6">
                          <span className="text-sm font-bold tracking-wider text-[#FB5535] uppercase mb-4 block">
                            {element.number} · {element.subtitle.toUpperCase()}
                          </span>
                          <h2 className="text-[36px] font-bold text-[#030F35] mb-6 leading-tight">
                            {element.title}
                          </h2>
                        </div>

                        <div className="mb-10 space-y-4">
                          {element.question ? (
                            <div className="border-l-4 border-[#FB5535] pl-4">
                              <p className="text-xl md:text-2xl font-semibold text-[#030F35] max-w-2xl">
                                {element.question}
                              </p>
                            </div>
                          ) : null}
                          {element.highlight ? (
                            <div className="border-l-4 border-[#FB5535] pl-4">
                              <p className="text-xl md:text-2xl font-semibold text-[#030F35] max-w-2xl">
                                {element.highlight}
                              </p>
                            </div>
                          ) : null}
                          {element.supportingLines ? (
                            <div className="space-y-2">
                              {element.supportingLines.map((line) => (
                                <p key={line} className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl">
                                  {line}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl">
                              {element.narrative}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={() => handleExploreElement(element.route)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FB5535] text-white font-semibold rounded-lg hover:bg-[#E95139] transition-all duration-200 group shadow-md"
                          >
                            <span>{element.ctaText || 'View Courses'}</span>
                          </button>
                          {element.id === 'digital-accelerators' ? (
                            element.secondaryRoute ? (
                              <button
                                type="button"
                                onClick={() => handleExploreElement(element.secondaryRoute ?? '/knowledge-center/products')}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#030F35] text-[#030F35] font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                              >
                                <span>{element.secondaryCtaText ?? 'View Products'}</span>
                              </button>
                            ) : null
                          ) : (
                            <>
                              {element.storybookUrl ? (
                                <a
                                  href={element.storybookUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#030F35] text-[#030F35] font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                                >
                                  <span>Read Storybook</span>
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title="Storybook coming soon"
                                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#030F35]/40 text-[#030F35]/50 font-semibold rounded-lg cursor-not-allowed"
                                >
                                  <span>Read Storybook</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </FadeInUpOnScroll>
                </div>
              </div>
            </section>
          );
        })}

      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}

export default SixXDLanding;
