import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, MessageCircle, BookOpen, Users as UsersIcon, Compass, Layers, Building2 } from 'lucide-react';
import { FadeInUpOnScroll } from '../components/AnimationUtils';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SupportCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

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

export function OnboardingLanding() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStartOnboarding = () => {
    navigate('/onboarding/start');
  };

  const handleExploreOrganization = () => {
    navigate('/discover-dq');
  };

  const handleExploreGHC = () => {
    navigate('/marketplace/guides/dq-ghc');
  };

  const handleExplore6XD = () => {
    navigate('/lms?category=6xd');
  };

  const handleViewRole = () => {
    navigate('/marketplace/work-directory?tab=positions');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen} 
      />
      
      <main className="flex-grow">
        {/* SECTION 1 — HERO: Start Your Onboarding Journey */}
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

          <div className="container mx-auto px-4 md:px-6 lg:px-8 flex-grow flex flex-col justify-center relative z-10">
            <div className="max-w-4xl">
              <FadeInUpOnScroll>
                <h1 
                  className="text-[40px] md:text-[48px] lg:text-[64px] xl:text-[72px] text-white mb-6 text-left"
                  style={{
                    fontFamily: 'Palatino, serif',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: '#FFFFFF'
                  }}
                >
                  Start Your Onboarding Journey
                </h1>
                <div className="text-xl md:text-2xl text-white/95 mb-10 font-normal leading-relaxed text-left max-w-3xl space-y-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  <p>Your guided onboarding journey — everything you need to start strong at DQ.</p>
                  <p>Onboarding at DQ is more than setup.</p>
                  <p>It's how you understand our culture, our ways of working, and how you create impact from day one.</p>
                </div>
              </FadeInUpOnScroll>

              <FadeInUpOnScroll delay={0.15}>
                <button
                  onClick={handleStartOnboarding}
                  className="px-8 py-3.5 bg-white text-[#030F35] font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-white/95 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Start My Onboarding Journey
                  <ArrowRight size={18} color="#e95139" />
                </button>
              </FadeInUpOnScroll>
            </div>
          </div>
        </section>

        {/* SECTION 2 — The DQ Organization */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeInUpOnScroll>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-6">
                      The DQ Organization
                </h2>
                    <div className="text-lg text-gray-700 leading-relaxed mb-8 space-y-2">
                      <p>DigitalQatalyst is a purpose-driven organization built on intentional frameworks.</p>
                      <p>We operate with two core frameworks: the Golden Honeycomb of Competence (GHC) and 6X Digitals (6XD).</p>
                      <p>These frameworks shape how we think, decide, and deliver impact together.</p>
              </div>
                    <button
                      onClick={handleExploreOrganization}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#030F35] text-white font-semibold rounded-lg hover:bg-[#0B1C3F] transition-all duration-200"
                    >
                      Explore the DQ Organization
                      <ArrowRight size={18} />
                    </button>
                </div>
              </FadeInUpOnScroll>
                <FadeInUpOnScroll delay={0.1}>
                  <div className="h-64 md:h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <Building2 size={64} className="text-slate-400" />
                        </div>
                      </FadeInUpOnScroll>
                </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Golden Honeycomb of Competence (GHC) */}
        <section className="py-20 md:py-28 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <FadeInUpOnScroll delay={0.1}>
                  <div className="h-64 md:h-80 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg flex items-center justify-center p-3 md:p-4 overflow-hidden order-2 md:order-1">
                    <img 
                      src="/images/knowledge/ghc.png" 
                      alt="Golden Honeycomb of Competence Framework"
                      className="w-full h-full object-contain object-center"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('.png')) {
                          target.src = '/images/knowledge/ghc.svg';
                        }
                      }}
                    />
                  </div>
                </FadeInUpOnScroll>
                <FadeInUpOnScroll className="order-1 md:order-2">
                        <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-6">
                      Golden Honeycomb of Competence
                    </h2>
                    <div className="text-lg text-gray-700 leading-relaxed mb-8 space-y-2">
                      <p>The GHC is how capability and standards are built at DQ.</p>
                      <p>It defines our purpose, principles, and decision-making foundations.</p>
                      <p>Understanding the GHC shapes how you interpret work, make decisions, and create impact.</p>
                    </div>
                    <button
                      onClick={handleExploreGHC}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#030F35] text-white font-semibold rounded-lg hover:bg-[#0B1C3F] transition-all duration-200"
                    >
                      Explore the GHC Framework
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — 6X Digitals (6XD) */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeInUpOnScroll>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-6">
                      6X Digitals
                </h2>
                    <div className="text-lg text-gray-700 leading-relaxed mb-8 space-y-2">
                      <p>6XD represents how the DQ vision is lived.</p>
                      <p>It's a lived, operational system that links to Agile TMS and ATP.</p>
                      <p>Every associate contributes to DQ products through participation and contribution.</p>
                    </div>
                    <button
                      onClick={handleExplore6XD}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#030F35] text-white font-semibold rounded-lg hover:bg-[#0B1C3F] transition-all duration-200"
                    >
                      Explore 6XD Learning & Papers
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </FadeInUpOnScroll>
                <FadeInUpOnScroll delay={0.1}>
                  <div className="h-64 md:h-80 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg flex items-center justify-center p-3 md:p-4 overflow-hidden">
                    <img 
                      src="/images/knowledge/6xd.png" 
                      alt="D6 Digital Accelerators Framework - 6X Digitals"
                      className="w-full h-full object-contain object-center"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('.png')) {
                          target.src = '/images/knowledge/6xd.svg';
                        }
                      }}
                    />
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Your Position at DQ */}
        <section className="py-20 md:py-28 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
            <FadeInUpOnScroll>
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#030F35] mb-6">
                    Your Position at DQ
                </h2>
                  <div className="text-lg text-gray-700 leading-relaxed mb-8 space-y-2">
                    <p>Every role at DQ is intentionally designed.</p>
                    <p>Your position is a carefully crafted set of responsibilities, expectations, and contribution paths.</p>
                    <p>Contribution and accountability matter — understanding your role means understanding how you create impact.</p>
                  </div>
                <button
                    onClick={handleViewRole}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#030F35] text-white font-semibold rounded-lg hover:bg-[#0B1C3F] transition-all duration-200"
                >
                    View My Role & Responsibilities
                    <ArrowRight size={18} />
                </button>
              </div>
            </FadeInUpOnScroll>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Need Help Along the Way */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
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

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((support, index) => (
                <FadeInUpOnScroll key={index} delay={index * 0.08}>
                  <button
                    type="button"
                    onClick={() => navigate(support.href)}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[160px] flex flex-col items-center justify-start p-6 text-center transition-all duration-200 hover:shadow-md hover:border-gray-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#030F35]"
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
