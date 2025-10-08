import React, { useMemo, useState, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Users,
  Newspaper,
  Lightbulb,
  TrendingUp,
  Briefcase as JobIcon,
  Globe,
  Calendar,
  Book as BookIcon,
  Award,
  MessageCircle,
  X,
  Clock,
  Compass,
  HeartHandshake,
  Building,
  Lock,
  GraduationCap,
  BarChart,
  CircleDot
} from 'lucide-react';
import { AnimatedCounter, FadeInUpOnScroll, useInView } from './AnimationUtils';

/* ----------------------------- AI Chatbot ----------------------------- */
const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[image:var(--dq-cta-gradient)] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-pulse hover:animate-none hover:brightness-105"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fade-in-up">
          <div className="bg-[image:var(--dq-cta-gradient)] p-4 text-white flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close AI Assistant"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4 h-80 overflow-y-auto bg-gray-50">
            <div className="bg-dq-navy/10 p-3 rounded-lg rounded-tl-none inline-block max-w-[85%] animate-fade-in">
              <p className="text-gray-800">
                Hi there! How can I help you navigate the Abu Dhabi Enterprise
                Journey Platform?
              </p>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type your question here..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dq-coral/40 transition-all duration-300"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ------------------------- Types & Defaults -------------------------- */
interface SectionStyle {
  cardClasses: string;
  headingClass: string;
  descriptionClass: string;
  iconClass: string;
  buttonClasses: string;
  hoverOverlayClass?: string;
  iconWrapperClass?: string;
}

const defaultSectionStyle: SectionStyle = {
  // not used directly; each row overrides
  cardClasses:
    'bg-[#FB5535] bg-[linear-gradient(90deg,rgba(251,85,53,0.84)0%,rgba(230,231,238,1)100%)] border border-[rgba(255,255,255,0.18)] text-white',
  headingClass: 'text-white',
  descriptionClass: 'text-[rgba(255,255,255,0.85)]',
  iconClass: 'text-[rgba(255,255,255,0.92)]',
  buttonClasses:
    'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.22)] focus:ring-[#FB5535] focus:ring-offset-2 focus:ring-offset-transparent',
  hoverOverlayClass: 'bg-white/10',
  iconWrapperClass: 'w-10 h-10'
};

/* ---------------------------- Service Card --------------------------- */
const ServiceCard = ({
  service,
  onClick,
  isComingSoon = false,
  sectionStyle = defaultSectionStyle
}: {
  service: any;
  onClick: () => void;
  isComingSoon?: boolean;
  sectionStyle?: SectionStyle;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses =
    'rounded-xl shadow-md overflow-hidden transition-all duration-500 transform p-6 h-full';
  const activeCardClasses = `${sectionStyle.cardClasses} hover:shadow-lg hover:-translate-y-1 hover:scale-102 cursor-pointer`;
  const disabledClasses =
    'bg-dqsec-tint text-dq-navy/50 opacity-80 cursor-not-allowed border border-transparent';

  // EJP pill style preserved; toggled by row (dark/light)
  const buttonBaseClasses =
    'w-full inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold px-4 py-2 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const activeButtonClasses = `${buttonBaseClasses} ${sectionStyle.buttonClasses}`;
  const disabledButtonClasses =
    'w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/50 text-[#030F35]/40 text-sm font-semibold px-4 py-2 shadow-sm cursor-not-allowed';

  const iconColorClass = isComingSoon ? 'text-gray-500' : sectionStyle.iconClass;
  const hoverOverlayClass = sectionStyle.hoverOverlayClass ?? 'bg-white/5';
  const iconWrapperClasses = sectionStyle.iconWrapperClass ?? 'w-10 h-10';

  const titleRowClasses = `flex items-center gap-2.5 mb-3 transition-transform duration-300 ${
    isHovered ? '-translate-y-1' : ''
  }`;

  // Ensure icon always renders (fallback + consistent size/contrast)
  const iconNode = service.icon ? service.icon : <CircleDot aria-hidden="true" />;
  const iconElement = cloneElement(iconNode, {
    size: 24,
    'aria-hidden': true,
    className: `${iconColorClass} ${iconNode.props?.className ?? ''}`.trim()
  });

  return (
    <div
      className={`${baseClasses} ${isComingSoon ? disabledClasses : activeCardClasses}`}
      onClick={isComingSoon ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-disabled={isComingSoon}
    >
      <div className="flex flex-col h-full relative">
        {isComingSoon && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-gray-800 flex items-center animate-pulse">
            <Clock size={12} className="mr-1" />
            Coming Soon
          </div>
        )}

        <div className={titleRowClasses}>
          <div className={`${iconWrapperClasses} flex-shrink-0 flex items-center justify-center`}>
            {iconElement}
          </div>
          <h2 className={`text-lg font-semibold leading-snug ${isComingSoon ? '' : sectionStyle.headingClass}`}>
            {service.title}
          </h2>
        </div>

        <p className={`text-sm mb-4 flex-grow ${isComingSoon ? '' : sectionStyle.descriptionClass}`}>
          {service.description}
        </p>

        <button
          className={`${isComingSoon ? disabledButtonClasses : activeButtonClasses} mt-auto`}
          disabled={isComingSoon}
          onClick={(e) => {
            if (!isComingSoon) {
              e.stopPropagation();
              onClick();
            }
          }}
        >
          {isComingSoon ? (
            <>
              <Lock size={14} className="mr-2" />
              Coming Soon
            </>
          ) : (
            <>Explore Now →</>
          )}
        </button>

        {/* Background animation on hover */}
        {!isComingSoon && (
          <div
            className={`absolute inset-0 ${hoverOverlayClass} opacity-0 transition-opacity duration-500`}
            style={{ opacity: isHovered ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  );
};

/* -------------------------- Category Header -------------------------- */
interface CategoryHeaderProps {
  icon: React.ReactNode;
  title: string;
  count?: number | null;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ icon, title, count = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useInView({ threshold: 0.1 });

  return (
    <div className="mb-6" ref={ref} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-dq-navy/10 flex items-center justify-center mr-3 text-dq-navy">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {count !== null && (
        <div className="ml-13 text-gray-600">
          <span className="font-semibold mr-1">
            <AnimatedCounter value={count} />+
          </span>
          services available in this category
        </div>
      )}
    </div>
  );
};

/* ------------------------------ HomePage ----------------------------- */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Services (unchanged)
  const allServices = useMemo(() => {
    return {
      finance: [
        {
          id: 'dq-lms-courses',
          title: 'DQ LMS Courses',
          description: 'Step into the DQ Learning Hub, where every course connects to your growth journey. Master our Golden Honeycomb Competences (GHC) and elevate your digital, human, and organizational skills through guided learning paths.',
          icon: <GraduationCap />,
          path: '/marketplace/courses',
          isActive: true
        },
        {
          id: 'dq-onboarding-flows',
          title: 'DQ Onboarding Flows',
          description: 'Your first days at DQ made simple. Navigate onboarding flows that connect you with your team, your tools, and the purpose behind your role.',
          icon: <Compass />,
          path: '#',
          isActive: true
        },
        {
          id: 'dq-guideline-center',
          title: 'DQ Guideline Center',
          description: 'Find clarity in how DQ works. Access our policies, workflows, and frameworks that turn everyday work into governed excellence.',
          icon: <BookIcon />,
          path: '#',
          isActive: true
        },
        {
          id: 'dq-faqs',
          title: 'DQ FAQs',
          description: 'Have questions? We have gathered real DQ experiences and answers in one place, from joining a project to requesting resources.',
          icon: <MessageCircle />,
          path: '#',
          isActive: true
        }
      ],
      advisory: [
        {
          id: 'dq-services-requests',
          title: 'DQ Services & Requests',
          description: 'Your one-stop access to IT, HR, Finance, and Facility services. Log a request, track progress, and get support that keeps work moving.',
          icon: <Briefcase />,
          path: '#',
          isActive: true
        },
        {
          id: 'self-service-center',
          title: 'Self-Service Center',
          description: 'Access tools, templates, and dashboards built for autonomy. Get what you need, when you need it with no waiting.',
          icon: <Globe />,
          path: '#',
          isActive: true
        },
        {
          id: 'self-service-tools',
          title: 'Self-Service Tools',
          description: 'A growing library of productivity shortcuts and digital assistants designed to make everyday work smoother.',
          icon: <Lightbulb />,
          path: '#',
          isActive: false
        },
        {
          id: 'service-integrations',
          title: 'Service Integrations',
          description: 'Where everything connects. Soon, you will be able to sync your favorite DQ apps and workflows into one seamless experience.',
          icon: <TrendingUp />,
          path: '#',
          isActive: false
        }
      ],
      growth: [
        {
          id: 'units-directory',
          title: 'Units & Associates Directory',
          description: 'Meet your peers. Explore DQ\'s people and units, connect with colleagues across projects, and discover what each team drives.',
          icon: <Users />,
          path: '#',
          isActive: true
        },
        {
          id: 'communities-surveys',
          title: 'Communities & Surveys',
          description: 'Join conversations that shape DQ\'s culture. Share your voice, participate in pulse surveys, and help us grow together.',
          icon: <HeartHandshake />,
          path: '#',
          isActive: true
        },
        {
          id: 'events-calendars',
          title: 'Events & Calendars',
          description: 'Stay in sync with everything DQ, from weekly huddles to major townhalls and cultural moments that unite us.',
          icon: <Calendar />,
          path: '#',
          isActive: true
        },
        {
          id: 'news-announcements',
          title: 'News & Announcements',
          description: 'Your daily feed of DQ highlights: updates, success stories, and initiatives that showcase our shared progress.',
          icon: <Newspaper />,
          path: '#',
          isActive: true
        }
      ],
      learning: [
        {
          id: 'asset-library',
          title: 'Asset Library',
          description: 'The creative heart of DQ. Access logos, templates, icons, and infographics so you can communicate the brand with clarity every time.',
          icon: <Building />,
          path: '#',
          isActive: true
        },
        {
          id: 'blueprint-library',
          title: 'Blueprint Library',
          description: 'Dive into the core of DQ delivery. Explore blueprints that connect Discern, Design, Deploy, and Drive into scalable excellence.',
          icon: <Compass />,
          path: '#',
          isActive: true
        },
        {
          id: 'strategy-center',
          title: 'Strategy Center',
          description: 'Understand the bigger picture. See how every DQ initiative ties back to our purpose, DNA, and vision of digital excellence.',
          icon: <BarChart />,
          path: '#',
          isActive: true
        },
        {
          id: 'job-center',
          title: 'Job Center',
          description: 'Shape your future within DQ. Find internal roles, mobility programs, and career paths that match your growth story.',
          icon: <JobIcon />,
          path: '#',
          isActive: true
        },
        {
          id: 'glossary',
          title: 'Glossary',
          description: 'Decode DQ language. A growing list of terms and definitions from across our ecosystem.',
          icon: <BookOpen />,
          path: '#',
          isActive: false
        },
        {
          id: 'knowledge-base',
          title: 'Knowledge Base',
          description: 'Step-by-step guidance for every DQ process, from tech troubleshooting to governance updates.',
          icon: <BookIcon />,
          path: '#',
          isActive: false
        },
        {
          id: 'research-hub',
          title: 'Research Hub',
          description: 'Discover insights, data, and reports driving DQ\'s continuous transformation.',
          icon: <Lightbulb />,
          path: '#',
          isActive: false
        },
        {
          id: 'template-library',
          title: 'Template Library',
          description: 'Ready-made templates and slides to help you tell your DQ story quickly and professionally.',
          icon: <Award />,
          path: '#',
          isActive: false
        }
      ]
    };
  }, []);

  /* --------- ROW COLORS + EJP BUTTON/ICON TREATMENT (UPDATED) --------- */
  const sectionStyles: Record<string, SectionStyle> = {
    // ROW 1 — Blue gradient
    'Learning & Enablement': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(28,39,73,0.96)0%,rgba(28,39,73,0.82)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-[rgba(255,255,255,0.85)]',
      iconClass: 'text-[rgba(255,255,255,0.9)]',
      buttonClasses:
        'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#1C2749] focus:ring-offset-2 focus:ring-offset-transparent',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10'
    },

    // ROW 2 — Orange gradient
    'Services & Requests': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(255,125,26,0.92)0%,rgba(255,125,26,0.78)100%)] border border-[rgba(3,15,53,0.18)] text-[#030F35]',
      headingClass: 'text-[#030F35]',
      descriptionClass: 'text-[rgba(3,15,53,0.85)]',
      iconClass: 'text-[rgba(3,15,53,0.9)]',
      buttonClasses:
        'text-[#030F35] bg-[rgba(3,15,53,0.10)] hover:bg-[rgba(3,15,53,0.14)] ' +
        'border border-[rgba(3,15,53,0.18)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-[rgba(255,125,26,0.15)]',
      hoverOverlayClass: 'bg-[#030F35]/5',
      iconWrapperClass: 'w-10 h-10'
    },

    // ROW 3 — Indigo gradient
    'Collaboration & Communities': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(26,26,141,0.95)0%,rgba(26,26,141,0.82)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-[rgba(255,255,255,0.85)]',
      iconClass: 'text-[rgba(255,255,255,0.9)]',
      buttonClasses:
        'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#1A1A8D] focus:ring-offset-2 focus:ring-offset-transparent',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10'
    },

    // ROW 4 — Coral gradient
    'Resources & Libraries': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(251,102,73,0.92)0%,rgba(251,102,73,0.78)100%)] border border-[rgba(3,15,53,0.18)] text-[#030F35]',
      headingClass: 'text-[#030F35]',
      descriptionClass: 'text-[rgba(3,15,53,0.85)]',
      iconClass: 'text-[rgba(3,15,53,0.9)]',
      buttonClasses:
        'text-[#030F35] bg-[rgba(3,15,53,0.10)] hover:bg-[rgba(3,15,53,0.14)] ' +
        'border border-[rgba(3,15,53,0.18)] focus:ring-[#FB6649] focus:ring-offset-2 focus:ring-offset-[rgba(251,102,73,0.12)]',
      hoverOverlayClass: 'bg-[#030F35]/5',
      iconWrapperClass: 'w-10 h-10'
    }
  };

  const handleServiceClick = (path: string) => navigate(path);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Marketplaces by Category */}
        <div className="mb-16">
          <FadeInUpOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Services & Marketplaces</h2>
            <div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Every associate's journey begins here. Explore the tools, spaces, and learning paths that shape your daily growth at DQ.
              </p>
            </div>
          </FadeInUpOnScroll>

          {/* Row 1 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<GraduationCap size={24} />} title="Learning & Enablement" count={4} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.finance.map((service, index) => (
                <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard
                    service={service}
                    sectionStyle={sectionStyles['Learning & Enablement']}
                    onClick={() => handleServiceClick(service.path)}
                    isComingSoon={!service.isActive}
                  />
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<Briefcase size={24} />} title="Services & Requests" count={4} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.advisory.map((service, index) => (
                <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard
                    service={service}
                    sectionStyle={sectionStyles['Services & Requests']}
                    onClick={() => handleServiceClick(service.path)}
                    isComingSoon={!service.isActive}
                  />
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<Users size={24} />} title="Collaboration & Communities" count={4} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.growth.map((service, index) => (
                <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard
                    service={service}
                    sectionStyle={sectionStyles['Collaboration & Communities']}
                    onClick={() => handleServiceClick(service.path)}
                    isComingSoon={!service.isActive}
                  />
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>

          {/* Row 4 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<BookOpen size={24} />} title="Resources & Libraries" count={8} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allServices.learning.map((service, index) => (
                <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                  <ServiceCard
                    service={service}
                    sectionStyle={sectionStyles['Resources & Libraries']}
                    onClick={() => handleServiceClick(service.path)}
                    isComingSoon={!service.isActive}
                  />
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
