import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import { FadeInUpOnScroll } from '../components/AnimationUtils';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface GHCElement {
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
}

const ghcElements: GHCElement[] = [
  {
    id: 'dq-vision',
    number: '01',
    title: 'The DQ Vision (Purpose)',
    subtitle: 'Purpose',
    question: '',
    narrative: '',
    highlight: 'Our purpose is to perfect life\'s transactions.',
    supportingLines: [
      'At DigitalQatalyst, Vision is the guiding star that connects every decision, project, and innovation across our fast-moving digital ecosystem.',
      'We believe progress happens when human needs and digital systems are designed to work together intelligently and consistently.',
      'This shared vision gives direction, aligns our people, and grounds the Golden Honeycomb as the foundation of how DQ operates.',
    ],
    imageSrc: 'https://image2url.com/r2/default/images/1768463115775-0daa0af5-bc58-4ea6-a1d4-0f9d34c8d04a.webp',
    imageAlt: 'Digital globe representing connected systems',
    storybookUrl: 'https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html',
    route: '/marketplace/guides/dq-vision'
  },
  {
    id: 'hov',
    number: '02',
    title: 'HoV (Culture)',
    subtitle: 'Culture',
    question: '',
    narrative: '',
    highlight: 'Our culture is something we deliberately build and live.',
    supportingLines: [
      'At DigitalQatalyst, culture defines how we behave, decide, and collaborate — especially when work is complex or pressure is high.',
      'The House of Values provides a shared behavioural system that keeps teams aligned, resilient, and effective across DQ.',
      'Through self-development, lean working, and value co-creation, we sustain trust, clarity, and performance as one organisation.',
    ],
    imageSrc: 'https://image2url.com/r2/default/images/1768466070607-5e1f2ca9-d498-4bb5-afc2-1032992433d1.png',
    imageAlt: 'House of Values culture visual',
    storybookUrl: 'https://digital-qatalyst.shorthandstories.com/ad30db59-9684-4331-921d-2e564f9dfe58/index.html',
    route: '/marketplace/guides/dq-hov'
  },
  {
    id: 'persona',
    number: '03',
    title: 'Persona (Identity)',
    subtitle: 'Identity',
    question: '',
    narrative: '',
    highlight: 'Who we are and how we show up at DQ.',
    supportingLines: [
      'At DigitalQatalyst, Persona defines the shared identity of every Qatalyst and the behaviours that consistently drive impact.',
      'It reflects how we think, act, and collaborate across roles by being purpose-driven, perceptive, proactive, persevering, and precise.',
      'This common identity creates alignment, strengthens trust, and ensures we deliver value with clarity and consistency.',
    ],
    imageSrc: 'https://image2url.com/r2/default/images/1768465956957-738b44df-0d0b-490d-a0f8-1a42fb51784e.png',
    imageAlt: 'Shared identity and team personas visual',
    storybookUrl: 'https://digital-qatalyst.shorthandstories.com/30d7e598-4e7c-4492-b070-8001649b4ee4/index.html',
    route: '/marketplace/guides/dq-persona'
  },
  {
    id: 'agile-tms',
    number: '04',
    title: 'Agile TMS (Task Management System)',
    subtitle: 'Tasks',
    question: '',
    narrative: '',
    highlight: 'How we turn strategy into daily execution.',
    supportingLines: [
      'At DigitalQatalyst, Agile TMS structures how ideas, priorities, and plans become clear, actionable work every day.',
      'It provides rhythm through sprints, check-ins, and reviews, ensuring focus, alignment, and momentum across teams.',
      'By treating tasks as signals for learning and outcomes, Agile TMS keeps work purposeful, adaptive, and value-driven.',
    ],
    imageSrc: 'https://image2url.com/r2/default/images/1768468914162-67cf0162-662c-4e20-a446-07555ee3e728.png',
    imageAlt: 'Task planning and execution visual',
    storybookUrl: 'https://digital-qatalyst.shorthandstories.com/30d7e598-4e7c-4492-b070-8001649b4ee4/index.html',
    route: '/marketplace/guides/dq-agile-tms'
  },
  {
    id: 'agile-sos',
    number: '05',
    title: 'Agile SoS (Governance)',
    subtitle: 'Governance',
    question: '',
    narrative: '',
    highlight: 'How we stay aligned while moving fast.',
    supportingLines: [
      'At DigitalQatalyst, Agile SoS ensures governance enables progress by keeping strategy, quality, and outcomes connected.',
      'It provides a coordinated system that allows teams to act quickly while maintaining alignment, discipline, and accountability.',
      'Through governance, quality, value, and discipline systems, Agile SoS keeps delivery coherent, scalable, and impact-focused.',
    ],
    imageSrc: 'https://image2url.com/r2/default/images/1768469269842-aa6b9f6f-fe20-4e0a-ad22-0883c281134b.png',
    imageAlt: 'Governance and alignment visual',
    storybookUrl: 'https://digital-qatalyst.shorthandstories.com/cde3e47f-33f6-47c6-8633-3825276d17dd/index.html',
    route: '/marketplace/guides/dq-agile-sos'
  },
  {
    id: 'agile-flows',
    number: '06',
    title: 'Agile Flows (Value Streams)',
    subtitle: 'Value Streams',
    question: '',
    narrative: '',
    highlight: 'How work moves from ideas to impact.',
    supportingLines: [
      'At DigitalQatalyst, Agile Flows structures how work travels end-to-end across teams, tools, and delivery stages.',
      'It connects initiatives from market insight through delivery and outcomes, ensuring visibility, coordination, and shared ownership.',
      'By organising work as value streams, Agile Flows reduces friction, prevents silos, and enables consistent, timely delivery.',
    ],
    imageSrc: 'https://i.ibb.co/6RNRpDR2/Untitled-design9.jpg',
    imageAlt: 'Agile Flows value streams visual',
    storybookUrl: 'https://digital-qatalyst.shorthandstories.com/1201a61d-9475-48a1-a228-5342a75e094c/index.html',
    route: '/marketplace/guides/dq-agile-flows'
  },
  {
    id: 'agile-6xd',
    number: '07',
    title: 'Agile 6xD (Digital Accelerators - Tools)',
    subtitle: 'Products',
    question: '',
    narrative: '',
    highlight: 'How we design and deliver digital transformation.',
    supportingLines: [
      'At DigitalQatalyst, Agile 6xD is the framework that structures how transformation is designed, built, and scaled.',
      'It brings together six essential digital perspectives that guide what to change, how to deliver, and where value is created.',
      'By using Agile 6xD, DQ ensures transformation is repeatable, measurable, and continuously evolving across products and initiatives.',
    ],
    imageSrc: 'https://i.ibb.co/Ldz3kGy0/Untitled-design.jpg',
    imageAlt: 'Agile 6xD products and capabilities visual',
    route: '/marketplace/guides/dq-agile-6xd'
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

export function GHCLanding() {
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
        @keyframes gradientDrift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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
        @keyframes hexagonFloat {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-25px) translateX(20px) rotate(60deg); }
          66% { transform: translateY(15px) translateX(-15px) rotate(-60deg); }
        }
        @keyframes honeycombPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes waveFlow {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(20px) translateY(-10px); }
          50% { transform: translateX(0) translateY(-20px); }
          75% { transform: translateX(-20px) translateY(-10px); }
          100% { transform: translateX(0) translateY(0); }
        }
      `}</style>
      <Header />

      <main className="flex-grow">
        {/* HERO — Light Abstract with Honeycomb Language */}
        <section className="relative w-full overflow-hidden flex flex-col isolate h-auto md:h-[600px] lg:h-[700px] pt-24 pb-20 md:pt-24 md:pb-20">
          {/* Animated DWS Gradient Base */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, #030F35 0%, #1A2E6E 25%, #030F35 50%, #1A2E6E 75%, #030F35 100%)',
              backgroundSize: '300% 300%',
              animation: 'gradientDrift 20s ease infinite'
            }}
          />

          {/* Animated Honeycomb Pattern Grid */}
          <div className="absolute inset-0 opacity-[0.15] z-[1]">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="honeycombGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#1A2E6E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="honeycombGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1A2E6E" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FB5535" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              
              {/* Animated Hexagonal Grid */}
              <g stroke="url(#honeycombGradient1)" strokeWidth="1.5" fill="none" opacity="0.5">
                {[...Array(8)].map((_, i) => (
                  [...Array(6)].map((_, j) => {
                    const x = 200 + i * 240;
                    const y = 150 + j * 180;
                    const size = 60;
                    const points = [
                      `${x},${y - size}`,
                      `${x + size * 0.866},${y - size * 0.5}`,
                      `${x + size * 0.866},${y + size * 0.5}`,
                      `${x},${y + size}`,
                      `${x - size * 0.866},${y + size * 0.5}`,
                      `${x - size * 0.866},${y - size * 0.5}`
                    ].join(' ');
                    return (
                      <polygon
                        key={`hex-${i}-${j}`}
                        points={points}
                        style={{
                          animation: `honeycombPulse ${8 + (i + j) * 0.5}s ease-in-out infinite`,
                          animationDelay: `${(i + j) * 0.3}s`
                        }}
                      />
                    );
                  })
                ))}
              </g>
            </svg>
          </div>

          {/* Animated Hexagonal Shapes */}
          <div className="absolute inset-0 z-[2] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="hexGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#1A2E6E" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="hexGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1A2E6E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.2" />
                </linearGradient>
                <filter id="hexGlow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Large Floating Hexagons */}
              <g transform="translate(400, 300)" style={{ animation: 'hexagonFloat 18s ease-in-out infinite' }} filter="url(#hexGlow)">
                <polygon
                  points="0,-100 87,-50 87,50 0,100 -87,50 -87,-50"
                  fill="url(#hexGradient1)"
                  opacity="0.4"
                />
                <polygon
                  points="0,-70 61,-35 61,35 0,70 -61,35 -61,-35"
                  fill="none"
                  stroke="url(#hexGradient2)"
                  strokeWidth="2"
                  opacity="0.5"
                />
              </g>
              
              <g transform="translate(1400, 500)" style={{ animation: 'hexagonFloat 22s ease-in-out infinite reverse', animationDelay: '3s' }} filter="url(#hexGlow)">
                <polygon
                  points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60"
                  fill="url(#hexGradient2)"
                  opacity="0.35"
                />
                <polygon
                  points="0,-85 74,-42.5 74,42.5 0,85 -74,42.5 -74,-42.5"
                  fill="none"
                  stroke="url(#hexGradient1)"
                  strokeWidth="2"
                  opacity="0.45"
                />
              </g>
              
              <g transform="translate(900, 700)" style={{ animation: 'hexagonFloat 20s ease-in-out infinite', animationDelay: '5s' }} filter="url(#hexGlow)">
                <polygon
                  points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45"
                  fill="url(#hexGradient1)"
                  opacity="0.3"
                />
              </g>
              
              {/* Rotating Hexagon Rings */}
              <g transform="translate(1200, 250)" style={{ animation: 'rotateSlow 35s linear infinite' }} filter="url(#hexGlow)">
                <polygon
                  points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40"
                  fill="none"
                  stroke="url(#hexGradient1)"
                  strokeWidth="2.5"
                  opacity="0.4"
                />
                <polygon
                  points="0,-55 48,-27.5 48,27.5 0,55 -48,27.5 -48,-27.5"
                  fill="none"
                  stroke="url(#hexGradient2)"
                  strokeWidth="2"
                  opacity="0.5"
                />
              </g>
            </svg>
          </div>

          {/* Animated Connecting Lines (Honeycomb Network) */}
          <div className="absolute inset-0 z-[2] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#1A2E6E" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FB5535" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Network Connection Lines */}
              <g stroke="url(#lineGradient)" strokeWidth="2" fill="none" opacity="0.4">
                <path
                  d="M 400 300 L 600 400 L 800 350 L 1000 450 L 1200 400"
                  style={{
                    animation: 'waveFlow 25s ease-in-out infinite',
                    strokeDasharray: '8,8'
                  }}
                />
                <path
                  d="M 500 500 L 700 600 L 900 550 L 1100 650 L 1300 600"
                  style={{
                    animation: 'waveFlow 28s ease-in-out infinite reverse',
                    animationDelay: '2s',
                    strokeDasharray: '10,10'
                  }}
                />
                <path
                  d="M 300 600 L 500 700 L 700 650 L 900 750 L 1100 700"
                  style={{
                    animation: 'waveFlow 30s ease-in-out infinite',
                    animationDelay: '4s',
                    strokeDasharray: '12,12'
                  }}
                />
              </g>
              
              {/* Connection Nodes */}
              <g opacity="0.5">
                <circle cx="400" cy="300" r="6" fill="#FB5535" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
                <circle cx="600" cy="400" r="6" fill="#1A2E6E" style={{ animation: 'pulse 3.5s ease-in-out infinite', animationDelay: '0.5s' }} />
                <circle cx="800" cy="350" r="6" fill="#FB5535" style={{ animation: 'pulse 4s ease-in-out infinite', animationDelay: '1s' }} />
                <circle cx="1000" cy="450" r="6" fill="#1A2E6E" style={{ animation: 'pulse 3.2s ease-in-out infinite', animationDelay: '1.5s' }} />
                <circle cx="1200" cy="400" r="6" fill="#FB5535" style={{ animation: 'pulse 3.8s ease-in-out infinite', animationDelay: '2s' }} />
              </g>
            </svg>
          </div>

          {/* Animated Floating Particles (Honeycomb-inspired) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: `${40 + (i % 3) * 15}px`,
                  height: `${40 + (i % 3) * 15}px`,
                  left: `${3 + (i * 6.5)}%`,
                  top: `${8 + (i % 6) * 15}%`,
                  background: i % 4 === 0 
                    ? 'radial-gradient(circle, rgba(251, 85, 53, 0.5) 0%, rgba(251, 85, 53, 0.2) 50%, transparent 80%)' 
                    : 'radial-gradient(circle, rgba(26, 46, 110, 0.4) 0%, rgba(26, 46, 110, 0.15) 50%, transparent 80%)',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  animation: `floatSlow ${14 + i * 1.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                  filter: 'blur(15px)',
                  boxShadow: i % 4 === 0 
                    ? '0 0 50px rgba(251, 85, 53, 0.4)' 
                    : '0 0 50px rgba(26, 46, 110, 0.3)',
                }}
              />
            ))}
                </div>

          {/* Pulsing Radial Glows */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <div
              className="absolute rounded-full"
              style={{
                width: '800px',
                height: '800px',
                left: '15%',
                top: '25%',
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.25) 0%, transparent 70%)',
                filter: 'blur(100px)',
                animation: 'pulse 9s ease-in-out infinite'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '750px',
                height: '750px',
                right: '20%',
                bottom: '20%',
                background: 'radial-gradient(circle, rgba(26, 46, 110, 0.3) 0%, transparent 70%)',
                filter: 'blur(90px)',
                animation: 'pulse 11s ease-in-out infinite',
                animationDelay: '3s'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '600px',
                height: '600px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.15) 0%, transparent 65%)',
                filter: 'blur(80px)',
                animation: 'pulse 10s ease-in-out infinite',
                animationDelay: '5s'
              }}
            />
              </div>

          {/* Animated Light Sweeps */}
          <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(60deg, transparent 20%, rgba(251, 85, 53, 0.1) 50%, transparent 80%)',
                animation: 'rotate 30s linear infinite',
                transformOrigin: 'center center',
                opacity: 0.7
              }}
            />
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(-60deg, transparent 20%, rgba(26, 46, 110, 0.1) 50%, transparent 80%)',
                animation: 'rotate 35s linear infinite reverse',
                transformOrigin: 'center center',
                opacity: 0.6,
                animationDelay: '2s'
              }}
            />
            </div>

          {/* High Contrast Area on Left for Text Readability */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: 'radial-gradient(ellipse 1000px 130% at 0% 50%, rgba(3, 15, 53, 0.7) 0%, rgba(3, 15, 53, 0.35) 50%, transparent 80%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex-1 flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 items-center">
                <FadeInUpOnScroll>
                    <div className="w-full max-w-4xl">
                      <h1
                        className="text-[76px] text-white mb-8 md:mb-10 text-left font-sans"
                        style={{ 
                          fontWeight: 700, 
                          lineHeight: 1.15,
                          letterSpacing: '-0.01em'
                        }}
                      >
                        DQ Golden Honeycomb of Competencies (GHC)
                  </h1>

                      <div className="mb-12 max-w-4xl">
                        <p 
                          className="text-xl md:text-2xl text-white/90 leading-[2.2] text-left font-light"
                          style={{
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                          }}
                        >
                          The DQ Golden Honeycomb of Competencies (GHC) is a master framework a Framework of Frameworks that articulates the complete DNA of DigitalQatalyst.
                        </p>
                      </div>
                    </div>
                </FadeInUpOnScroll>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll-down arrow */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('ghc-elements');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="absolute bottom-6 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/80 hover:shadow-lg"
            aria-label="Scroll to GHC elements"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </section>

        {/* ELEMENTS — Storytelling Chapters with Alternating Layout */}
        {ghcElements.map((element, index) => {
          const isEven = index % 2 === 0;

          return (
            <section
              key={element.id}
              id={index === 0 ? 'ghc-elements' : undefined}
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
                          <h2 className="text-[36px] font-bold text-[#030F35] mb-6 leading-tight">
                            {element.title}
                          </h2>
                          {element.question ? (
                          <p className="text-2xl md:text-3xl font-semibold text-[#FB5535] mb-8 leading-tight">
                            {element.question}
                          </p>
                          ) : null}
                        </div>

                        <div className="mb-10 space-y-4">
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
                            <span>Explore Course</span>
                          </button>
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

export default GHCLanding;
