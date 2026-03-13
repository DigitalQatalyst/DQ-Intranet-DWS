import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

const getSectionId = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export default function VDSServiceDetailPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id]');
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(element.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `This section introduces the V.DS (Video Design System) as DQ's comprehensive framework for creating consistent, high-impact video content. The V.DS represents a shift from ad-hoc video production to a systematic, quality-driven approach that ensures all video content aligns with DQ's brand standards and strategic objectives.

The V.DS is designed to embed greater intentionality, consistency, and performance optimization into the way video content is conceptualized, produced, reviewed, and distributed across all DQ platforms.

By integrating the V.DS within DQ's broader content ecosystem - including DTMB (Books), DTMI (Insights), DTMP (Platform), TMaaS (Deliverables), and DTMA (Academy) - this framework positions video content as a strategic asset for thought leadership, brand engagement, and organizational learning.`
    },
    {
      id: 'who-is-this-for',
      title: '1.05 Who is this for?',
      content: `Across DQ, video content is created by diverse teams for multiple purposes - educational content that builds capabilities, thought leadership videos that shape industry conversations, product demonstrations that showcase solutions, and internal communications that align teams.

V.DS is for all video content creators and stakeholders. It serves the videographer capturing compelling footage, the editor crafting engaging narratives, the content strategist planning video campaigns, the subject-matter expert providing insights, and the executive ensuring brand alignment.

Whether creating short social media clips, comprehensive training modules, or executive presentations, if someone is responsible for video content that represents DQ, V.DS provides the systematic support they need.`
    },
    {
      id: 'problem-solving',
      title: '1.06 What problem does it solve?',
      content: `Before V.DS, video production often lacked consistency. Different teams used varying approaches, quality standards, and brand applications. Video content quality depended heavily on individual skills, and teams spent significant time on revisions and alignment rather than creative storytelling.

V.DS transforms this experience by providing a unified system that brings structure to the entire video production lifecycle - from initial concept and storyboarding to final production and distribution.

By establishing common standards, workflows, and quality checkpoints, V.DS eliminates guesswork, reduces production time, and ensures consistent, professional output. Teams can focus on creating compelling video content that effectively communicates DQ's message and engages target audiences.`
    },
    {
      id: 'video-mandate',
      title: '1.1 Video Content Mandate (DQ Units)',
      content: `Multiple units across DQ are responsible for producing video content that delivers strategic impact - content designed to educate, engage, and influence audiences across various platforms and contexts.

These video-producing units include:

• DTMA (Digital Transformation Management Academy) – Creates educational video content, training modules, and course materials to support skill development and knowledge transfer.

• DTMI (Digital Transformation Management Insights) – Produces thought leadership videos, trend analyses, and expert interviews aligned with market dynamics.

• DQ Content – Leads video production across digital channels, including social media content, promotional videos, and brand storytelling.

• DQ Deals – Develops video presentations, capability demonstrations, and client-focused content for business development.

• DQ Designs – Creates product demonstration videos, solution walkthroughs, and technical explainer content.

• Internal Communications – Produces company updates, culture videos, and internal training content.`
    },
    {
      id: 'relevant-ecosystem',
      title: '1.2 Relevant Ecosystem',
      content: `The V.DS guidelines apply universally across the DQ video content ecosystem and must be upheld to maintain consistency, quality, and brand alignment in every video output.

This includes all video formats, platforms, and distribution channels where DQ video content is created or shared:

• Educational and training videos within DTMA platforms
• Thought leadership and insight videos on DTMI channels
• Social media video content across all DQ social platforms
• Internal communication and culture videos
• Client-facing presentations and demonstration videos
• Product and solution explainer videos
• Event recordings and webinar content`
    },
    {
      id: 'purpose',
      title: '1.3 V.DS | Purpose',
      content: `The V.DS is defined as a comprehensive system that ensures all video content is strategically planned, professionally produced, and effectively distributed to maximize audience engagement and business impact.

It provides a unified framework that brings structure, creativity, and purpose to the entire video production lifecycle.

By applying V.DS, DQ ensures that every video output - whether a training module, thought leadership piece, product demo, or social media content - maintains consistent quality, aligns with brand standards, and achieves measurable performance outcomes.

This leads to stronger audience engagement, enhanced brand recognition, streamlined production processes, and higher return on video content investment across all platforms and channels.`
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-800 to-purple-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="w-full bg-black/20 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl mx-auto" style={{ maxWidth: 'calc(100vw - 4rem)' }}>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-6">
              FRAMEWORK
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Video Design System (V.DS)
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              V.DS is DQ's comprehensive framework for creating consistent, high-impact video content at scale. 
              It provides unified guidelines, production workflows, and quality standards for professional video content.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">2-3hrs</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">40+ Components</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">Intermediate</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">Framework</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Table of Contents - Left Side */}
            <div className="w-80">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content - Right Side */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="space-y-12">
                  {sections.map((section) => (
                    <div key={section.id} id={section.id} className="scroll-mt-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {section.title}
                      </h2>
                      <div className="prose prose-gray max-w-none">
                        {section.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer isLoggedIn={false} />
    </div>
  );
}