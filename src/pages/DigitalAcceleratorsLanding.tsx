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
      'DTMA is DQ’s structured learning platform for understanding digital transformation and AI in real organisational contexts.',
      'It combines curated courses, practical tools, and guided learning to support confident planning and execution.',
      'By linking learning directly to practice, DTMA helps professionals apply knowledge to real transformation initiatives.',
    ],
    imageSrc: 'https://i.ibb.co/BVC7d2KP/1edc4860-4810-4d1d-8533-95ddd6d1d212.png',
    imageAlt: 'DTMA visual',
    primaryCtaText: 'View Products',
    primaryRoute: '/marketplace/directory/products',
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
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(15px); }
        }
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <Header />

      <main className="flex-grow">
        {/* SECTION 1 — HERO: Digital Accelerators */}
        <section className="relative w-full overflow-hidden flex flex-col isolate h-auto md:h-[600px] lg:h-[700px] pt-24 pb-20 md:pt-24 md:pb-20">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                'url("https://i.ibb.co/0HVQCQg/ai-images.jpg"), linear-gradient(135deg, #030F35 0%, #1A2E6E 35%, #3A2C7A 65%, #FB5535 100%)',
              backgroundSize: 'cover, 120% 120%',
              backgroundPosition: 'center, center',
              backgroundRepeat: 'no-repeat, no-repeat',
              backgroundColor: '#030F35',
            }}
          />
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(3, 15, 53, 0.4) 0%, rgba(26, 46, 110, 0.28) 35%, rgba(3, 15, 53, 0.32) 70%, rgba(251, 85, 53, 0.18) 100%)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Subtle animated geometry (low contrast) */}
          <div className="absolute inset-0 opacity-[0.03] z-[2]">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="daGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.35" />
                  <stop offset="55%" stopColor="#1A2E6E" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="daGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#FB5535" stopOpacity="0.12" />
                </linearGradient>
              </defs>

              <g opacity="0.35">
                {[...Array(8)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 240}
                    y1="0"
                    x2={i * 240}
                    y2="1080"
                    stroke="url(#daGrad1)"
                    strokeWidth="1"
                    style={{
                      animation: 'pulse 9s ease-in-out infinite',
                      animationDelay: `${i * 0.6}s`,
                      opacity: 0.25,
                    }}
                  />
                ))}
                {[...Array(6)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 180}
                    x2="1920"
                    y2={i * 180}
                    stroke="url(#daGrad2)"
                    strokeWidth="1"
                    style={{
                      animation: 'pulse 11s ease-in-out infinite',
                      animationDelay: `${i * 0.75}s`,
                      opacity: 0.2,
                    }}
                  />
                ))}
              </g>

              <g transform="translate(1450, 280)" style={{ animation: 'rotateSlow 36s linear infinite' }}>
                <polygon
                  points="0,-64 55,-32 55,32 0,64 -55,32 -55,-32"
                  fill="none"
                  stroke="url(#daGrad1)"
                  strokeWidth="1.5"
                  opacity="0.35"
                />
              </g>

              <g transform="translate(520, 760)" style={{ animation: 'rotateSlow 44s linear infinite reverse' }}>
                <polygon
                  points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22"
                  fill="none"
                  stroke="url(#daGrad2)"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
              </g>
            </svg>
          </div>

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
