import { useNavigate } from 'react-router-dom';

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
      'At DQ, we believe progress happens when human needs and digital systems work together intelligently.',
      'Through Digital Blueprints, we help organisations evolve into Digital Cognitive Organisations (DCOs).',
      'This purpose guides how we work, what we build, and how we create impact every day.',
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
    highlight: 'Our culture is how we behave when it matters most.',
    supportingLines: [
      'The House of Values (HoV) is the system that guides how we collaborate, communicate, and make decisions at DQ.',
      'It brings our expectations into everyday behaviours — especially under pressure, ambiguity, and high stakes.',
      'This is how we stay aligned, trusted, and consistent as one organisation.',
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
    highlight: 'Our Personas describe who thrives at DQ.',
    supportingLines: [
      'They are our shared identity — the traits and mindsets we expect in how we show up and work together.',
      'This helps create alignment across teams, roles, and moments of pressure or ambiguity.',
      'It guides how we hire, develop, collaborate, and build a strong culture over time.',
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
    highlight: 'Agile TMS is how work gets done at DQ.',
    supportingLines: [
      'It provides a clear structure for planning, prioritising, and executing work with shared visibility.',
      'It helps teams stay aligned through ownership, progress tracking, and regular feedback.',
      'This keeps delivery consistent, focused, and connected to real outcomes.',
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
    highlight: 'Agile SoS is how DQ governs with agility.',
    supportingLines: [
      'It provides clear alignment across teams so decisions and priorities stay connected to outcomes.',
      'It reinforces quality and consistency as we scale, without slowing delivery down.',
      'This enables teams to move fast with confidence, discipline, and shared direction.',
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
    highlight: 'Agile Flows is how DQ orchestrates value end-to-end.',
    supportingLines: [
      'It connects teams around shared value streams so work moves smoothly from intent to delivery.',
      'It creates clarity on handoffs, ownership, and how different parts of the organisation align.',
      'This reduces fragmentation and helps us deliver impact as one coordinated system.',
    ],
    imageSrc: 'https://i.ibb.co/6RNRpDR2/Untitled-design9.jpg',
    imageAlt: 'Agile Flows value streams visual',
    storybookUrl: 'https://digital-qatalyst.shorthandstories.com/1201a61d-9475-48a1-a228-5342a75e094c/index.html',
    route: '/marketplace/guides/dq-agile-flows'
  },
  {
    id: 'agile-6xd',
    number: '07',
    title: 'Agile 6xD',
    subtitle: 'Products',
    question: '',
    narrative: '',
    highlight: 'We turn digital expertise into real, measurable outcomes.',
    supportingLines: [
      'Agile 6xD is how DQ packages its capabilities into six clear perspectives that guide transformation.',
      'It ensures everything we build delivers value, impact, and results that matter.',
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
      `}</style>
      <Header />

      <main className="flex-grow">
        {/* HERO — Light Abstract with Honeycomb Language */}
        <section className="relative w-full min-h-[80vh] flex flex-col overflow-hidden">
          {/* Base background (premium gradient + soft radial accents) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: '#030F35',
              backgroundImage: `
                radial-gradient(900px circle at 20% 30%, rgba(255, 255, 255, 0.10) 0%, transparent 60%),
                radial-gradient(700px circle at 85% 70%, rgba(251, 85, 53, 0.22) 0%, transparent 55%),
                linear-gradient(135deg, #FB5535 0%, #1A2E6E 50%, #030F35 100%)
              `,
            }}
          />

          {/* Honeycomb outlines (image-based, no SVG nodes in DOM) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.18]"
            style={{
              backgroundImage: 'url("/images/ghc/honeycomb-outline.svg")',
              backgroundRepeat: 'repeat',
              backgroundSize: '520px',
              backgroundPosition: '0% 0%',
              mixBlendMode: 'overlay',
              animation: 'honeycombDrift 40s ease-in-out infinite',
            }}
          />

          {/* Readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030F35]/70 via-[#030F35]/35 to-[#030F35]/70" />

          {/* Content */}
          <div className="relative z-10 flex-1 flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 items-center">
                  <FadeInUpOnScroll>
                    <div className="w-full max-w-4xl">
                      <h1
                        className="text-[72px] text-white mb-8 md:mb-10 text-left font-sans"
                        style={{ 
                          fontWeight: 700, 
                          lineHeight: 1.15,
                          letterSpacing: '-0.01em'
                        }}
                      >
                        GHC: The Organisational DNA of DigitalQatalyst
                      </h1>

                      <div className="mb-12 max-w-4xl">
                        <p 
                          className="text-xl md:text-2xl text-white/90 leading-[2.2] text-left font-light"
                          style={{
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                          }}
                        >
                          The GHC is DQ&apos;s shared DNA—bringing together purpose, ways of working, collaboration, and seven core elements that guide every associate to create value, grow with confidence, and contribute consistently to our digital mission.
                        </p>
                      </div>
                    </div>
                  </FadeInUpOnScroll>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ELEMENTS — Storytelling Chapters with Alternating Layout */}
        {ghcElements.map((element, index) => {
          const isEven = index % 2 === 0;

          return (
            <section
              key={element.id}
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
                          <h2 className="text-4xl md:text-5xl font-bold text-[#030F35] mb-6 leading-tight">
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
