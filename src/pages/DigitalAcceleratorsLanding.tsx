import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import { FadeInUpOnScroll } from '../components/AnimationUtils';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

interface AcceleratorSection {
  id: string;
  number: string;
  subtitle: string;
  title: string;
  question: string;
  supportingLines: string[];
  imageSrc?: string;
  imageAlt?: string;
  primaryCtaText?: string;
  primaryRoute?: string;
}

const acceleratorSections: AcceleratorSection[] = [
  {
    id: 'overview',
    number: '01',
    subtitle: 'Products',
    title: 'DTMP (Digital Transformation Management Platform)',
    question: 'What makes transformation execution repeatable  not chaotic?',
    supportingLines: [
      'DTMP is DQ’s central platform for managing, monitoring, and accelerating digital transformation across the organisation.',
      'It brings strategy, data, delivery, and governance into one connected system with real-time visibility and clear ownership.',
      'By standardising planning, tracking, and delivery, DTMP turns complex transformation into measurable, repeatable outcomes.',
    ],
    imageSrc: 'https://i.ibb.co/m5MnzXQ7/8d76d1b2-6bba-4eab-ac4c-bb3aa8c39f07.png',
    imageAlt: 'DTMP overview visual',
    primaryCtaText: 'View Products',
    primaryRoute: '/marketplace/directory/products',
  },
  {
    id: 'portfolio',
    number: '02',
    subtitle: 'Products',
    title: 'TMaaS (Transformation Management as a Service)',
    question: 'How can transformation stay flexible, fast, and execution-focused?',
    supportingLines: [
      'TMaaS is DQ’s on-demand model for delivering digital transformation as modular, execution-ready services.',
      'It removes rigid programs by enabling organisations to start small, adapt continuously, and scale only when needed.',
      'By shifting transformation to a service-based approach, TMaaS improves speed, lowers risk, and increases delivery success.',
    ],
    imageSrc: 'https://i.ibb.co/398L9Zfq/f135c3d3-96bd-4fc4-8785-b1c06452747c.png',
    imageAlt: 'Accelerator portfolio visual',
    primaryCtaText: 'View Products',
    primaryRoute: '/marketplace/directory/products',
  },
  {
    id: 'delivery-flow',
    number: '03',
    subtitle: 'Products',
    title: 'Plant4.0 (Industrial Operations & Performance Platform)',
    question: 'How can industrial plants operate as connected, intelligent systems?',
    supportingLines: [
      'Plant4.0 is a unified platform for managing industrial assets, processes, energy, performance, and OT cybersecurity.',
      'It connects OT and IT data into one structured workspace across plants, sites, and vendors.',
      'By standardising industrial data and workflows, Plant4.0 enables safer, more efficient, continuously improving operations.',
    ],
    imageSrc: 'https://i.ibb.co/GQT006bF/7dfa801b-5e41-44c9-9c9a-3d8c65875680.png',
    imageAlt: 'Plant4.0 delivery flow visual',
    primaryCtaText: 'Explore Digital Accelerators',
    primaryRoute: '/knowledge-center/products/digital-accelerators',
  },
  {
    id: 'alignment',
    number: '04',
    subtitle: 'Products',
    title: 'DTMB (Digital Transformation Management Books)',
    question: 'How can digital transformation knowledge become practical, clear, and repeatable?',
    supportingLines: [
      'DTMB is DQ\'s structured portfolio of publications that make digital transformation understandable and actionable.',
      'It translates complex transformation concepts into clear frameworks, real-world use cases, and applied guidance.',
      'By organising insight through the D6 Framework, DTMB connects strategy to execution with practical decision support.',
    ],
    imageSrc: 'https://i.ibb.co/M5grg9P9/9405b249-558c-445d-abc3-5ce577338df6.png',
    imageAlt: 'DTMB visual',
    primaryCtaText: 'View Products',
    primaryRoute: '/marketplace/directory/products',
  },
  {
    id: 'automation',
    number: '05',
    subtitle: 'Products',
    title: 'DTMA (Digital Transformation Management Academy)',
    question: 'How do professionals learn and apply digital transformation effectively?',
    supportingLines: [
      'DTMA is DQ\'s structured learning platform for understanding digital transformation and AI in real organisational contexts.',
      'It combines curated courses, practical tools, and guided learning to support confident planning and execution.',
      'By linking learning directly to practice, DTMA helps professionals apply knowledge to real transformation initiatives.',
    ],
    imageSrc: 'https://i.ibb.co/BVC7d2KP/1edc4860-4810-4d1d-8533-95ddd6d1d212.png',
    imageAlt: 'DTMA visual',
    primaryCtaText: 'View Products',
    primaryRoute: '/marketplace/directory/products',
  },
  {
    id: 'dws',
    number: '06',
    subtitle: 'Products',
    title: 'Digital Working Studios (DWS)',
    question: 'How do digital workers collaborate effectively with AI in Economy 4.0?',
    supportingLines: [
      'Digital Working Studios (DWS) are DQ\'s purpose-built environments for AI-augmented work and collaboration.',
      'They provide the physical and digital infrastructure where professionals combine human intelligence with machine intelligence to deliver outcomes faster and smarter.',
      'Starting in Nairobi (Babadogo) and expanding globally, DWS enables the next generation of digital workers to thrive.',
    ],
    imageSrc: 'https://i.ibb.co/YrMFv7w/photo-1497366216548-37526070297c.jpg',
    imageAlt: 'Digital Working Studios visual',
    primaryCtaText: 'Join Waitlist',
    primaryRoute: '/dws/waitlist',
  },
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

export function DigitalAcceleratorsLanding() {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <style>{`
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
        @keyframes accelerate {
          0% { transform: translateX(-200px) translateY(0) scale(0.8); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200px) translateY(0) scale(1.2); opacity: 0; }
        }
        @keyframes speedLine {
          0% { transform: translateX(-100px) scaleX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100px) scaleX(1); opacity: 0; }
        }
        @keyframes platformPulse {
          0%, 100% { opacity: 0.3; transform: scale(1) translateY(0); }
          50% { opacity: 0.6; transform: scale(1.1) translateY(-10px); }
        }
        @keyframes deliveryFlow {
          0% { transform: translateY(-100px) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px) translateX(0); opacity: 0; }
        }
        @keyframes velocityStreak {
          0% { transform: translateX(-150px) skewX(-20deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(150px) skewX(-20deg); opacity: 0; }
        }
        @keyframes productModule {
          0%, 100% { opacity: 0.4; transform: scale(1) translateY(0); }
          50% { opacity: 0.7; transform: scale(1.05) translateY(-5px); }
        }
        @keyframes dataStream {
          0% { transform: translateX(-100px) translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100px) translateY(0); opacity: 0; }
        }
        @keyframes serviceFlow {
          0% { stroke-dashoffset: 0; opacity: 0.3; }
          50% { stroke-dashoffset: -30; opacity: 0.6; }
          100% { stroke-dashoffset: -60; opacity: 0.3; }
        }
        @keyframes toolPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>

      <Header />

      <main className="flex-grow">
        {/* SECTION 1 — HERO: Digital Accelerators */}
        <section className="relative w-full overflow-hidden flex flex-col isolate h-auto md:h-[600px] lg:h-[700px] pt-24 pb-20 md:pt-24 md:pb-20">
          {/* Animated DWS Gradient Base */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, #030F35 0%, #1A2E6E 30%, #030F35 60%, #1A2E6E 90%, #030F35 100%)',
              backgroundSize: '300% 300%',
              animation: 'gradientDrift 16s ease infinite'
            }}
          />

          {/* Digital Accelerators Products - Platform & Tool Visualizations */}
          <div className="absolute inset-0 z-[2] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="productGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1A2E6E" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="productGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1A2E6E" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="serviceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FB5535" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FB5535" stopOpacity="0" />
                </linearGradient>
                <filter id="productGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Product Platform Modules - Representing DTMP, TMaaS, Plant4.0 */}
              <g opacity="0.5">
                {/* DTMP Platform Module */}
                <g transform="translate(300, 350)">
                  <rect x="0" y="0" width="200" height="80" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 6s ease-in-out infinite' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="200" height="80" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Internal panel lines */}
                  <line x1="20" y1="25" x2="180" y2="25" stroke="url(#productGradient2)" strokeWidth="1.5" opacity="0.4" />
                  <line x1="20" y1="45" x2="140" y2="45" stroke="url(#productGradient2)" strokeWidth="1.5" opacity="0.4" />
                  <line x1="20" y1="65" x2="160" y2="65" stroke="url(#productGradient2)" strokeWidth="1.5" opacity="0.4" />
                </g>
                
                {/* TMaaS Service Module */}
                <g transform="translate(700, 450)">
                  <rect x="0" y="0" width="220" height="90" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 6.5s ease-in-out infinite', animationDelay: '1s' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="220" height="90" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Service flow indicators */}
                  <circle cx="30" cy="30" r="8" fill="url(#productGradient2)" opacity="0.5" style={{ animation: 'toolPulse 3s ease-in-out infinite' }} />
                  <circle cx="30" cy="60" r="8" fill="url(#productGradient2)" opacity="0.5" style={{ animation: 'toolPulse 3.5s ease-in-out infinite', animationDelay: '0.5s' }} />
                  <path d="M 50 30 L 190 30" stroke="url(#serviceGradient)" strokeWidth="2" opacity="0.4" strokeDasharray="4,4" style={{ animation: 'serviceFlow 4s ease-in-out infinite' }} />
                  <path d="M 50 60 L 190 60" stroke="url(#serviceGradient)" strokeWidth="2" opacity="0.4" strokeDasharray="4,4" style={{ animation: 'serviceFlow 4.5s ease-in-out infinite', animationDelay: '0.5s' }} />
                </g>
                
                {/* Plant4.0 Industrial Module */}
                <g transform="translate(1200, 500)">
                  <rect x="0" y="0" width="240" height="100" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 7s ease-in-out infinite', animationDelay: '2s' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="240" height="100" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Industrial connection nodes */}
                  <circle cx="40" cy="30" r="6" fill="#FB5535" opacity="0.6" style={{ animation: 'toolPulse 2.5s ease-in-out infinite' }} />
                  <circle cx="40" cy="50" r="6" fill="#FB5535" opacity="0.6" style={{ animation: 'toolPulse 2.8s ease-in-out infinite', animationDelay: '0.3s' }} />
                  <circle cx="40" cy="70" r="6" fill="#FB5535" opacity="0.6" style={{ animation: 'toolPulse 3s ease-in-out infinite', animationDelay: '0.6s' }} />
                  <line x1="55" y1="30" x2="200" y2="30" stroke="url(#productGradient2)" strokeWidth="2" opacity="0.4" />
                  <line x1="55" y1="50" x2="200" y2="50" stroke="url(#productGradient2)" strokeWidth="2" opacity="0.4" />
                  <line x1="55" y1="70" x2="200" y2="70" stroke="url(#productGradient2)" strokeWidth="2" opacity="0.4" />
                </g>
                
                {/* DTMA Learning Module */}
                <g transform="translate(500, 700)">
                  <rect x="0" y="0" width="180" height="70" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 6.8s ease-in-out infinite', animationDelay: '3s' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="180" height="70" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Learning progress indicators */}
                  <rect x="20" y="20" width="140" height="8" rx="4" fill="url(#productGradient2)" opacity="0.3" />
                  <rect x="20" y="20" width="100" height="8" rx="4" fill="#FB5535" opacity="0.6" style={{ animation: 'serviceFlow 5s ease-in-out infinite' }} />
                  <rect x="20" y="35" width="140" height="8" rx="4" fill="url(#productGradient2)" opacity="0.3" />
                  <rect x="20" y="35" width="80" height="8" rx="4" fill="#FB5535" opacity="0.6" style={{ animation: 'serviceFlow 5.5s ease-in-out infinite', animationDelay: '0.5s' }} />
                </g>
              </g>
              
              {/* Service Delivery Flows - TMaaS Service Connections */}
              <g stroke="url(#serviceGradient)" strokeWidth="2.5" fill="none" opacity="0.5" strokeDasharray="10,5">
                <path
                  d="M 400 390 L 700 495"
                  style={{
                    animation: 'serviceFlow 8s ease-in-out infinite'
                  }}
                />
                <path
                  d="M 920 495 L 1200 550"
                  style={{
                    animation: 'serviceFlow 8.5s ease-in-out infinite',
                    animationDelay: '1s'
                  }}
                />
                <path
                  d="M 680 540 L 500 735"
                  style={{
                    animation: 'serviceFlow 9s ease-in-out infinite',
                    animationDelay: '2s'
                  }}
                />
                <path
                  d="M 1440 550 L 1200 600"
                  style={{
                    animation: 'serviceFlow 9.5s ease-in-out infinite',
                    animationDelay: '3s'
                  }}
                />
              </g>
              
              {/* Data Streams - Platform Data Flow */}
              <g opacity="0.6">
                {[...Array(10)].map((_, i) => (
                  <circle
                    key={`data-${i}`}
                    cx={250 + (i * 150)}
                    cy={400 + (i % 4) * 120}
                    r="4"
                    fill="#FB5535"
                    style={{
                      animation: `dataStream ${4 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.4}s`
                    }}
                    filter="url(#productGlow)"
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={`data2-${i}`}
                    cx={300 + (i * 180)}
                    cy={500 + (i % 3) * 100}
                    r="3"
                    fill="#1A2E6E"
                    style={{
                      animation: `dataStream ${5 + i * 0.3}s ease-in-out infinite reverse`,
                      animationDelay: `${i * 0.5}s`
                    }}
                    filter="url(#productGlow)"
                  />
                ))}
              </g>
              
              {/* Tool Icons - Representing Product Tools */}
              <g opacity="0.4">
                {/* Tool 1 - Management Tool */}
                <g transform="translate(150, 250)" style={{ animation: 'toolPulse 4s ease-in-out infinite' }}>
                  <rect x="0" y="0" width="40" height="40" rx="4" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <line x1="10" y1="10" x2="30" y2="10" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                  <line x1="10" y1="20" x2="25" y2="20" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                  <line x1="10" y1="30" x2="30" y2="30" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                </g>
                
                {/* Tool 2 - Service Tool */}
                <g transform="translate(1600, 300)" style={{ animation: 'toolPulse 4.5s ease-in-out infinite', animationDelay: '1s' }}>
                  <circle cx="20" cy="20" r="18" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <path d="M 20 8 L 20 32 M 8 20 L 32 20" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.6" />
                </g>
                
                {/* Tool 3 - Industrial Tool */}
                <g transform="translate(200, 750)" style={{ animation: 'toolPulse 5s ease-in-out infinite', animationDelay: '2s' }}>
                  <polygon points="20,5 35,15 30,35 10,35 5,15" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <circle cx="20" cy="20" r="3" fill="#FFFFFF" opacity="0.6" />
                </g>
                
                {/* Tool 4 - Learning Tool */}
                <g transform="translate(1500, 750)" style={{ animation: 'toolPulse 4.8s ease-in-out infinite', animationDelay: '3s' }}>
                  <rect x="5" y="5" width="30" height="30" rx="2" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <path d="M 15 15 L 25 20 L 15 25 Z" fill="#FFFFFF" opacity="0.6" />
                </g>
              </g>
              
              {/* Acceleration Indicators - Speed Lines */}
              {[...Array(6)].map((_, i) => (
                <line
                  key={`accel-${i}`}
                  x1={300 + i * 250}
                  y1={250 + (i % 2) * 150}
                  x2={500 + i * 250}
                  y2={250 + (i % 2) * 150}
                  stroke="url(#serviceGradient)"
                  strokeWidth="2"
                  opacity="0.4"
                  style={{
                    animation: `velocityStreak ${3 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.6}s`
                  }}
                  filter="url(#productGlow)"
                />
              ))}
            </svg>
          </div>

          {/* Animated Platform Grid */}
          <div className="absolute inset-0 opacity-[0.12] z-[1]">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#1A2E6E" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Platform Grid Lines */}
              <g stroke="url(#gridGradient)" strokeWidth="0.8">
                {[...Array(10)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 192}
                    y1="0"
                    x2={i * 192}
                    y2="1080"
                    opacity="0.3"
                    style={{
                      animation: `pulse ${7 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 135}
                    x2="1920"
                    y2={i * 135}
                    opacity="0.3"
                    style={{
                      animation: `pulse ${9 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Pulsing Acceleration Glows */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <div
              className="absolute rounded-full"
              style={{
                width: '600px',
                height: '600px',
                left: '25%',
                top: '30%',
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.25) 0%, transparent 70%)',
                filter: 'blur(80px)',
                animation: 'pulse 7s ease-in-out infinite'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '700px',
                height: '700px',
                right: '20%',
                bottom: '25%',
                background: 'radial-gradient(circle, rgba(26, 46, 110, 0.3) 0%, transparent 70%)',
                filter: 'blur(90px)',
                animation: 'pulse 9s ease-in-out infinite',
                animationDelay: '3s'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '550px',
                height: '550px',
                left: '60%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.2) 0%, transparent 65%)',
                filter: 'blur(70px)',
                animation: 'pulse 8s ease-in-out infinite',
                animationDelay: '5s'
              }}
            />
          </div>

          {/* Animated Light Sweeps - Speed Effect */}
          <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(20deg, transparent 20%, rgba(251, 85, 53, 0.1) 50%, transparent 80%)',
                animation: 'rotate 22s linear infinite',
                transformOrigin: 'center center',
                opacity: 0.7
              }}
            />
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(-20deg, transparent 20%, rgba(26, 46, 110, 0.1) 50%, transparent 80%)',
                animation: 'rotate 26s linear infinite reverse',
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

          <div className="w-full flex items-center relative z-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
              <div className="max-w-3xl">
                <FadeInUpOnScroll>
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-white/80 mb-5">
                    06 · PRODUCTS
                  </p>
                  <h1
                    className="text-[48px] md:text-[56px] lg:text-[72px] xl:text-[80px] text-white mb-6 text-left font-sans"
                    style={{ fontWeight: 700, lineHeight: 1.1 }}
                  >
                    Accelerate Digital Transformation
                  </h1>
                  <p
                    className="text-lg md:text-xl text-white/95 mb-10 font-normal leading-relaxed text-left max-w-2xl"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Explore our products - tailored solutions designed to drive efficiency across your digital transformation initiatives.
                  </p>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>

          {/* Scroll-down arrow */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('da-sections');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="absolute bottom-6 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/80 hover:shadow-lg"
            aria-label="Scroll to Digital Accelerators sections"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </section>

        {/* SECTIONS — Products-focused capability chapters */}
        {acceleratorSections.map((section, index) => {
          const isEven = index % 2 === 0;

          return (
            <section
              key={section.id}
              id={index === 0 ? 'da-sections' : undefined}
              className={`py-16 md:py-24 ${isEven ? 'bg-white' : 'bg-[#F7FAFF]'}`}
            >
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <FadeInUpOnScroll>
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start ${
                        !isEven ? 'lg:flex-row-reverse' : ''
                      }`}
                    >
                      <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                        <SectionImage src={section.imageSrc} alt={section.imageAlt} />
                      </div>

                      <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center max-w-2xl`}>
                        <div className="mb-6">
                          <span className="text-sm font-bold tracking-wider text-[#FB5535] uppercase mb-4 block">
                            {section.number} · {section.subtitle.toUpperCase()}
                          </span>
                          <h2 className="text-[36px] font-bold text-[#030F35] mb-6 leading-tight">
                            {section.title}
                          </h2>
                        </div>

                        <div className="mb-10 space-y-4">
                          <div className="border-l-4 border-[#FB5535] pl-4 mb-6">
                            <p className="text-xl md:text-2xl font-semibold text-[#030F35] max-w-2xl">
                              {section.question}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {section.supportingLines.map((line) => (
                              <p key={line} className="text-[18px] leading-relaxed text-gray-700 max-w-2xl">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>

                        {section.primaryRoute ? (
                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              type="button"
                              onClick={() => handleNavigate(section.primaryRoute ?? '/marketplace/directory/products')}
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FB5535] text-white font-semibold rounded-lg hover:bg-[#E95139] transition-all duration-200 group shadow-md"
                            >
                              <span>{section.primaryCtaText ?? 'View Products'}</span>
                            </button>
                          </div>
                        ) : null}
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

export default DigitalAcceleratorsLanding;
