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
  CircleDot,
  ClipboardList,
  ChevronRight
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
  disabledCardClasses?: string;
}

const defaultSectionStyle: SectionStyle = {
  // not used directly; each row overrides
  cardClasses:
    'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
  headingClass: 'text-white',
  descriptionClass: 'text-white/90',
  iconClass: 'text-white',
  buttonClasses:
    'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent',
  hoverOverlayClass: 'bg-white/10',
  iconWrapperClass: 'w-10 h-10',
  disabledCardClasses:
    'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white/75 opacity-70 cursor-not-allowed'
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

  const activeCardClasses = `${sectionStyle.cardClasses} hover:shadow-md hover:-translate-y-0.5 cursor-pointer`;
  const disabledClasses =
    sectionStyle.disabledCardClasses ??
    'bg-dqsec-tint text-white/70 opacity-70 cursor-not-allowed border border-transparent';

  const baseButtonClasses = 'mt-auto h-9 px-4 rounded-md font-medium w-full transition-all duration-200 flex items-center justify-center';
  const activeButtonClasses = `${baseButtonClasses} bg-white text-[#1A2E6E] hover:bg-white/95`;
  const disabledButtonClasses = `${baseButtonClasses} bg-white/70 text-gray-600 cursor-not-allowed`;

  const iconColorClass = isComingSoon ? 'text-gray-500' : 'text-[#1A2E6E]';
  const hoverOverlayClass = sectionStyle.hoverOverlayClass ?? 'bg-white/10';
  const iconWrapperClasses = sectionStyle.iconWrapperClass ?? 'w-12 h-12';

  const iconNode = service.icon ? service.icon : <CircleDot aria-hidden="true" />;
  const iconElement = cloneElement(iconNode, {
    size: 20,
    'aria-hidden': true,
    className: `${iconColorClass} ${iconNode.props?.className ?? ''}`.trim()
  });

  const wrapperClasses = `${isComingSoon ? disabledClasses : activeCardClasses} rounded-xl shadow-sm overflow-hidden transition-all duration-300 transform p-6 h-full min-h-[240px] flex flex-col backdrop-blur-sm`;
  const titleClass = `${isComingSoon ? 'text-white/80' : sectionStyle.headingClass} text-base font-semibold text-white mb-1 truncate`;
  const descriptionClass = `${isComingSoon ? 'text-white/70' : sectionStyle.descriptionClass} text-[13px] leading-5 text-white/90 mb-4 line-clamp-2 min-h-[40px]`;

  return (
    <div
      className={wrapperClasses}
      onClick={isComingSoon ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-disabled={isComingSoon}
    >
      {isComingSoon && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full text-gray-900 flex items-center">
          <Clock size={12} className="mr-1" />
          Coming Soon
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={`${iconWrapperClasses} rounded-full bg-white border border-white/40 shadow-sm flex items-center justify-center mb-3`}>
          {iconElement}
        </div>
        <h2 className={titleClass}>{service.title}</h2>
      </div>

      <p className={descriptionClass}>{service.description}</p>

      <button
        className={isComingSoon ? disabledButtonClasses : activeButtonClasses}
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
            <Lock size={14} className="mr-2" /> Coming Soon
          </>
        ) : (
          <>
            Explore Now
            <ChevronRight
              size={16}
              className={`ml-2 transition-transform ${isHovered ? 'translate-x-0.5' : ''}`}
            />
          </>
        )}
      </button>

      {!isComingSoon && (
        <div
          className={`absolute inset-0 ${hoverOverlayClass} opacity-0 transition-opacity duration-500 rounded-2xl`}
          style={{ opacity: isHovered ? 1 : 0 }}
        />
      )}
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
        <h2 className="text-2xl font-bold text-gray-800 clamp-1">{title}</h2>
      </div>
      {count !== null && (
        <div className="ml-13 text-gray-600 clamp-2">
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
          id: 'dq-activities',
          title: 'DQ Activities',
          description: 'Track priorities and ATP, manage tasks, and collaborate in chats to keep work moving.',
          icon: <ClipboardList />,
          path: '/marketplace/activities',
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
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-white',
      buttonClasses:
        'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white/75 opacity-70 cursor-not-allowed'
    },

    // ROW 2 — Orange gradient
    'Services & Requests': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(251,85,53,0.95)0%,rgba(251,85,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-white',
      buttonClasses:
        'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#FB5535] focus:ring-offset-2 focus:ring-offset-transparent',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(251,85,53,0.95)0%,rgba(251,85,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white/75 opacity-70 cursor-not-allowed'
    },

    // ROW 3 — Indigo gradient
    'Collaboration & Communities': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(25,25,112,0.95)0%,rgba(25,25,112,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-white',
      buttonClasses:
        'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#191970] focus:ring-offset-2 focus:ring-offset-transparent',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(25,25,112,0.95)0%,rgba(25,25,112,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white/75 opacity-70 cursor-not-allowed'
    },

    // ROW 4 — Coral gradient
    'Resources & Libraries': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(255,56,0,0.95)0%,rgba(255,56,0,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-white',
      buttonClasses:
        'text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#FF3800] focus:ring-offset-2 focus:ring-offset-transparent',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(255,56,0,0.95)0%,rgba(255,56,0,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white/75 opacity-70 cursor-not-allowed'
    }
  };

  const handleServiceClick = (path: string) => navigate(path);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Marketplaces by Category */}
        <div className="mb-16">
          <FadeInUpOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">Services & Marketplaces</h2>
            <div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto clamp-2">
                Explore the tools, spaces, and learning paths that fuel growth and collaboration inside DQ.
              </p>
            </div>
          </FadeInUpOnScroll>

          {/* Row 1 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<GraduationCap size={24} />} title="Learning & Enablement" count={4} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {allServices.finance.map((service, index) => (
                <div key={service.id} className="flex-1 min-w-0 basis-[300px] grow-0 shrink-0">
                  <FadeInUpOnScroll delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Learning & Enablement']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<Briefcase size={24} />} title="Services & Requests" count={4} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {allServices.advisory.map((service, index) => (
                <div key={service.id} className="flex-1 min-w-0 basis-[300px] grow-0 shrink-0">
                  <FadeInUpOnScroll delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Services & Requests']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<Users size={24} />} title="Collaboration & Communities" count={5} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {allServices.growth.map((service, index) => (
                <div key={service.id} className="flex-1 min-w-0 basis-[300px] grow-0 shrink-0">
                  <FadeInUpOnScroll delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Collaboration & Communities']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                </div>
              ))}
            </div>
          </div>

          {/* Row 4 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<BookOpen size={24} />} title="Resources & Libraries" count={8} />
            </FadeInUpOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {allServices.learning.map((service, index) => (
                <div key={service.id} className="flex-1 min-w-0 basis-[300px] grow-0 shrink-0">
                  <FadeInUpOnScroll delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Resources & Libraries']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                </div>
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
