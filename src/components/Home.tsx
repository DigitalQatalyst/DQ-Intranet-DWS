import React, { useEffect, useState, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Users,
  Newspaper,
  Lightbulb,
  Briefcase as JobIcon,
  Globe,
  Calendar,
  Book as BookIcon,
  MessageCircle,
  Clock,
  Compass,
  HeartHandshake,
  Building,
  Lock,
  GraduationCap,
  BarChart,
  CircleDot,
  ClipboardList,
  ScrollText,
  Wand2,
  Bot,
} from 'lucide-react';
import {
  AnimatedCounter,
  FadeInUpOnScroll,
  useInView,
} from './AnimationUtils';
import ServiceCarousel from './marketplace/ServiceCarousel';
import { fetchServicesByCategory } from '../services/homeContentService';
import type { ServiceCard as ServiceCardRecord } from '../services/homeContentService';


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
    "bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white",
  headingClass: "text-white",
  descriptionClass: "text-white/90",
  iconClass: "text-white",
  buttonClasses:
    "text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent",
  hoverOverlayClass: "bg-white/10",
  iconWrapperClass: "w-10 h-10",
  disabledCardClasses:
    "bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed",
};

/* ---------------------------- Service Card --------------------------- */
const ServiceCard = ({
  service,
  onClick,
  isComingSoon = false,
  sectionStyle = defaultSectionStyle,
}: {
  service: any;
  onClick: () => void;
  isComingSoon?: boolean;
  sectionStyle?: SectionStyle;
}) => {
  const activeCardClasses = `${sectionStyle.cardClasses} hover:shadow-md hover:-translate-y-0.5 cursor-pointer`;
  const disabledClasses =
    sectionStyle.disabledCardClasses ??
    "bg-dqsec-tint text-white/70 opacity-70 cursor-not-allowed border border-transparent";

  const baseLayoutClasses =
    "rounded-2xl p-6 flex flex-col justify-between min-h-[260px] shadow-sm overflow-hidden transition-all duration-300 transform backdrop-blur-sm";
  const baseButtonClasses =
    "mt-auto h-9 px-4 rounded-md font-medium w-full flex items-center justify-center";
  const disabledButtonClasses = `${baseButtonClasses} bg-white/70 text-gray-600 cursor-not-allowed transition-all duration-200`;

  const iconColorClass = isComingSoon
    ? "text-gray-500"
    : sectionStyle.iconClass ?? "text-[#1A2E6E]";
  const iconWrapperClasses = sectionStyle.iconWrapperClass ?? "w-12 h-12";
  const descriptionClasses = `text-sm text-gray-600 leading-snug text-balance line-clamp-2 mt-3 mb-4 ${
    isComingSoon ? "text-white/70" : sectionStyle.descriptionClass
  }`;

  const iconNode = service.icon ? (
    service.icon
  ) : (
    <CircleDot aria-hidden="true" />
  );
  const iconElement = cloneElement(iconNode, {
    size: 20,
    "aria-hidden": true,
    className: `${iconColorClass} ${iconNode.props?.className ?? ""}`.trim(),
  });

  const wrapperClasses = `${
    isComingSoon ? disabledClasses : activeCardClasses
  } ${baseLayoutClasses}`;
  const titleClass = `${
    isComingSoon ? "text-white/80" : sectionStyle.headingClass
  } text-base font-semibold text-white mb-1 truncate`;

  return (
    <div
      className={wrapperClasses}
      onClick={isComingSoon ? undefined : onClick}
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
        <div
          className={`${iconWrapperClasses} rounded-full bg-white border border-white/40 shadow-sm flex items-center justify-center mb-3`}
        >
          {iconElement}
        </div>
        <h2 className={titleClass}>{service.title}</h2>
      </div>

      <p className={descriptionClasses}>{service.description}</p>

      <button
        className={isComingSoon ? disabledButtonClasses : "cta-dq"}
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
            <span className="chev">›</span>
          </>
        )}
      </button>
    </div>
  );
};

/* -------------------------- Category Header -------------------------- */
interface CategoryHeaderProps {
  icon: React.ReactNode;
  title: string;
  count?: number | null;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  icon,
  title,
  count = null,
}) => {
  const [ref] = useInView({ threshold: 0.1 });
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="mb-6" ref={ref}>
      <div className="flex items-center mb-2">
        <div
          className={`w-10 h-10 rounded-full bg-dq-navy/10 flex items-center justify-center mr-3 text-dq-navy transition-all duration-300 ${
            isHovered ? "scale-110 bg-dq-navy/15" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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

  const fallbackSections = {
    // 1. Learning & Knowledge - "I want to understand DQ or learn something"
    learningKnowledge: [
      {
        id: 'knowledge-library',
        title: 'Library',
        description: 'Browse glossaries, FAQs, playbooks, and reference resources for everyday work.',
        icon: <BookIcon />,
        path: '/marketplace/guides?tab=glossary',
        isActive: true
      },
      {
        id: 'courses-curricula',
        title: 'Courses & Curricula',
        description: 'Explore core and advanced LMS curricula across GHC, 6xD, DWS, DXP, and key tools.',
        icon: <GraduationCap />,
        path: '/learning/courses',
        isActive: false
      },
      {
        id: 'learning-tracks',
        title: 'Learning Tracks',
        description: 'Follow guided learning paths tailored to roles, journeys, and competencies.',
        icon: <GraduationCap />,
        path: '/learning/courses',
        isActive: false
      },
      {
        id: 'learning-reviews',
        title: 'Reviews',
        description: 'Capture feedback and reviews on courses, bootcamps, and learning experiences.',
        icon: <BarChart />,
        path: '/learning/courses',
        isActive: false
      },
      {
        id: 'blueprints-library',
        title: 'Knowledge Centre',
        description: 'Apply delivery blueprints for 6xD design, DevOps, DBP, DXP, and DWS execution.',
        icon: <Compass />,
        path: '/marketplace/guides?tab=blueprints',
        isActive: true
      },
      {
        id: 'dq-guidelines',
        title: 'Guidelines',
        description: 'Official standards, governance models, and ways of working that guide execution across DQ.',
        icon: <ScrollText />,
        path: '/marketplace/guides?tab=guidelines',
        isActive: true
      },
      {
        id: 'work-guide-strategy',
        title: 'Strategy',
        description: "Understand DQ's journey, strategy, 6xD, initiatives, clients, and operating models.",
        icon: <BarChart />,
        path: '/marketplace/guides?tab=strategy',
        isActive: true
      },
      {
        id: 'prompt-library',
        title: 'Prompt Library',
        description: 'Curated, reusable AI prompts and patterns to accelerate delivery and decision-making.',
        icon: <Wand2 />,
        path: '/marketplace/services-center?tab=prompt_library',
        isActive: true
      }
    ],
    // 2. Services & Enablement - "I need access, tools, or support"
    servicesEnablement: [
      {
        id: 'services-center-technology',
        title: 'Technology Services',
        description: 'Request environments, access, support, and tooling for DQ technology platforms.',
        icon: <Globe />,
        path: '/marketplace/services-center?tab=technology',
        isActive: true
      },
      {
        id: 'services-center-business',
        title: 'Employee Services',
        description: 'Submit finance, HR, and admin requests through a single, trackable console.',
        icon: <Briefcase />,
        path: '/marketplace/services-center?tab=business',
        isActive: true
      },
      {
        id: 'digital-worker-tools',
        title: 'Digital Worker Services',
        description: 'Use Doc Writers, prompting kits, AI tools, agents, and BPM helpers to speed up delivery.',
        icon: <Lightbulb />,
        path: '/marketplace/services-center?tab=digital_worker',
        isActive: true
      },
      {
        id: 'ai-tools',
        title: 'AI Tools',
        description: 'AI-powered tools and copilots that support execution, automation, and delivery across DQ.',
        icon: <Bot />,
        path: '/marketplace/services-center?tab=ai_tools',
        isActive: true
      }
    ],
    // 3. Work Execution - "I'm doing the work"
    workExecution: [
      {
        id: 'activities-sessions',
        title: 'Work Sessions',
        description: 'Plan and run daily and weekly work sessions, reviews, retros, and check-ins.',
        icon: <Calendar />,
        path: '/activities/sessions',
        isActive: false
      },
      {
        id: 'activities-projects-tasks',
        title: 'Projects & Tasks',
        description: 'Organize projects, tasks, and boards so work stays visible and on track.',
        icon: <ClipboardList />,
        path: '/activities/projects',
        isActive: false
      },
      {
        id: 'activities-trackers',
        title: 'Trackers',
        description: 'Follow statuses, categories, and live updates across activities and workflows.',
        icon: <BarChart />,
        path: '/activities/trackers',
        isActive: false
      }
    ],
    // 4. Collaboration & Communities - "I need alignment, feedback, or discussion"
    collaborationCommunities: [
      {
        id: 'communities-discussion',
        title: 'Discussions',
        description: 'Open discussion spaces for DNA practices, learnings, Q&A, and team topics.',
        icon: <MessageCircle />,
        path: '/communities/discussion',
        isActive: false
      },
      {
        id: 'communities-pulse',
        title: 'Pulse',
        description: 'Use quick polls and surveys to capture team sentiment and feedback.',
        icon: <HeartHandshake />,
        path: '/communities/pulse',
        isActive: false
      },
      {
        id: 'events',
        title: 'Working Events',
        description: 'Discover upcoming events, townhalls, and experience sessions across DQ.',
        icon: <Calendar />,
        path: '/communities/events',
        isActive: false
      }
    ],
    // 5. Updates & Culture - "What's happening at DQ?"
    updatesCulture: [
      {
        id: 'news-announcements',
        title: 'News & Announcements',
        description: 'View official DQ news, platform releases, and important organizational updates.',
        icon: <Newspaper />,
        path: '/marketplace/opportunities?tab=announcements',
        isActive: true
      },
      {
        id: 'blogs',
        title: 'Blogs & Stories',
        description: 'Read stories, updates, and perspectives from teams and leaders across DQ.',
        icon: <BookIcon />,
        path: '/marketplace/opportunities?tab=insights',
        isActive: true
      },
      {
        id: 'jobs-openings',
        title: 'Job Openings',
        description: 'Browse open roles and internal opportunities across DQ.',
        icon: <JobIcon />,
        path: '/marketplace/opportunities?tab=opportunities',
        isActive: true
      }
    ],
    // 6. People & Organization - "Who does what here?"
    peopleOrganization: [
      {
        id: 'directory-units',
        title: 'Units',
        description: 'Explore sectors, units, mandates, priorities, and performance metrics.',
        icon: <Building />,
        path: '/marketplace/work-directory?tab=units',
        isActive: false
      },
      {
        id: 'directory-positions',
        title: 'Positions',
        description: 'Browse DQ positions, role descriptions, and key responsibilities.',
        icon: <Briefcase />,
        path: '/marketplace/work-directory?tab=positions',
        isActive: false
      },
      {
        id: 'directory-associates',
        title: 'Associates',
        description: 'View associate profiles, contacts, skills, and performance details.',
        icon: <Users />,
        path: '/marketplace/work-directory?tab=associates',
        isActive: false
      }
    ]
  };

  const [homeSections, setHomeSections] = useState(fallbackSections);

  useEffect(() => {
    const mapServiceToCard = (service: ServiceCardRecord) => ({
      id: service.id,
      title: service.title,
      description: service.description ?? '',
      icon: <CircleDot />,
      path: service.path ?? '#',
      isActive: service.is_active ?? true
    });

    async function loadSections() {
      try {
        const [
          learning,
          services,
          work,
          collaboration,
          updates,
          people
        ] = await Promise.all([
          fetchServicesByCategory('Learning & Knowledge'),
          fetchServicesByCategory('Services & Enablement'),
          fetchServicesByCategory('Work Execution'),
          fetchServicesByCategory('Collaboration & Communities'),
          fetchServicesByCategory('Updates & Culture'),
          fetchServicesByCategory('People & Organization')
        ]);

        setHomeSections(prev => ({
          learningKnowledge: learning.length ? learning.map(mapServiceToCard) : prev.learningKnowledge,
          servicesEnablement: services.length ? services.map(mapServiceToCard) : prev.servicesEnablement,
          workExecution: work.length ? work.map(mapServiceToCard) : prev.workExecution,
          collaborationCommunities: collaboration.length ? collaboration.map(mapServiceToCard) : prev.collaborationCommunities,
          updatesCulture: updates.length ? updates.map(mapServiceToCard) : prev.updatesCulture,
          peopleOrganization: people.length ? people.map(mapServiceToCard) : prev.peopleOrganization
        }));
      } catch (err) {
        console.error('Failed to load home sections from Supabase', err);
      }
    }

    loadSections();
  }, []);

  /* --------- ROW COLORS + DQ BUTTON/ICON TREATMENT (UPDATED) --------- */
  const sectionStyles: Record<string, SectionStyle> = {
    // 1. Learning & Knowledge
    'Learning & Knowledge': {
      cardClasses:
        "bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white",
      headingClass: "text-white",
      descriptionClass: "text-white/90",
      iconClass: "text-[#030F35]",
      buttonClasses:
        "text-white bg-[#030F35] hover:bg-[#13285A] " +
        "border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200",
      hoverOverlayClass: "bg-white/10",
      iconWrapperClass: "w-10 h-10",
      disabledCardClasses:
        "bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed",
    },

    // 2. Services & Enablement
    'Services & Enablement': {
      cardClasses:
        "bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white",
      headingClass: "text-white",
      descriptionClass: "text-white/90",
      iconClass: "text-[#030F35]",
      buttonClasses:
        "text-white bg-[#030F35] hover:bg-[#13285A] " +
        "border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200",
      hoverOverlayClass: "bg-white/10",
      iconWrapperClass: "w-10 h-10",
      disabledCardClasses:
        "bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed",
    },

    // 3. Work Execution
    'Work Execution': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        "text-white bg-[#030F35] hover:bg-[#13285A] " +
        "border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200",
      hoverOverlayClass: "bg-white/10",
      iconWrapperClass: "w-10 h-10",
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    },

    // 4. Collaboration & Communities
    'Collaboration & Communities': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        'text-white bg-[#030F35] hover:bg-[#13285A] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    },

    // 5. Updates & Culture
    'Updates & Culture': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        'text-white bg-[#030F35] hover:bg-[#13285A] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    },

    // 6. People & Organization
    'People & Organization': {
      cardClasses:
        "bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white",
      headingClass: "text-white",
      descriptionClass: "text-white/90",
      iconClass: "text-[#030F35]",
      buttonClasses:
        "text-white bg-[#030F35] hover:bg-[#13285A] " +
        "border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200",
      hoverOverlayClass: "bg-white/10",
      iconWrapperClass: "w-10 h-10",
      disabledCardClasses:
        "bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed",
    },
  };

  const handleServiceClick = (path: string) => navigate(path);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Marketplaces by Category */}
        <div className="mb-16">
          <FadeInUpOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
              Services & Marketplaces
            </h2>
            <div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto clamp-2">
                Everything you need to get started, work smarter, and unlock real progress at DQ all from one digital workspace.
              </p>
            </div>
          </FadeInUpOnScroll>

          {/* 1. Learning & Knowledge */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<BookOpen size={24} />}
                title="Learning & Knowledge"
                count={homeSections.learningKnowledge.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.learningKnowledge}
              renderCard={service => {
                const index = homeSections.learningKnowledge.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Learning & Knowledge']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 2. Services & Enablement */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Briefcase size={24} />}
                title="Services & Enablement"
                count={homeSections.servicesEnablement.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.servicesEnablement}
              renderCard={service => {
                const index = homeSections.servicesEnablement.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Services & Enablement']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 3. Work Execution */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<ClipboardList size={24} />}
                title="Work Execution"
                count={homeSections.workExecution.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.workExecution}
              renderCard={service => {
                const index = homeSections.workExecution.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Work Execution']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 4. Collaboration & Communities */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<MessageCircle size={24} />}
                title="Collaboration & Communities"
                count={homeSections.collaborationCommunities.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.collaborationCommunities}
              renderCard={service => {
                const index = homeSections.collaborationCommunities.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Collaboration & Communities']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 5. Updates & Culture */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Newspaper size={24} />}
                title="Updates & Culture"
                count={homeSections.updatesCulture.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.updatesCulture}
              renderCard={service => {
                const index = homeSections.updatesCulture.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Updates & Culture']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 6. People & Organization */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Users size={24} />}
                title="People & Organization"
                count={homeSections.peopleOrganization.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.peopleOrganization}
              renderCard={service => {
                const index = homeSections.peopleOrganization.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['People & Organization']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

        </div>
      </div>

      {/* animations + DQ CTA styles */}
      <style>{`
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

        /* ---------- DQ-style CTA (dark translucent -> white on hover) ---------- */
        .cta-dq {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 14px 20px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 14.5px;
          color: white;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          backdrop-filter: saturate(140%) blur(4px);
          -webkit-backdrop-filter: saturate(140%) blur(4px);
          transition: all 0.3s ease;
        }
        .cta-dq:hover {
          color: #1a2e6e;
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }
        .cta-dq .chev {
          transition: transform 0.3s ease;
        }
        .cta-dq:hover .chev {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
