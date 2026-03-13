import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

const getSectionId = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export default function CIDSServiceDetailPage() {
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
      content: `This section introduces the CI.DS (Content Item Design System) as the formal replacement of the CI.PF (Content Item Production Framework), signalling a shift from a static set of production rules to a dynamic, modular, and quality-driven content system.

The CI.DS is designed to embed greater intentionality, traceability, and performance assurance into the way content is envisioned, created, reviewed, and delivered across all DQ platforms.

By anchoring the CI.DS within DQ's wider ecosystem - including DTMB (Books), DTMI (Insights), DTMP (Platform), TMaaS (Deliverables), and DTMA (Academy) - this introduction highlights how content is no longer a support function, but a strategic driver of thought leadership, brand credibility, and organizational learning.`
    },
    {
      id: 'who-is-this-for',
      title: '1.05 Who is this for?',
      content: `Across DQ, content is created by many hands and for many purposes - books that define transformation thinking, insights that shape market conversations, learning material that builds capability, proposals that win trust, and deliverables that guide real-world execution.

CI.DS is for all of these contributors. It is for the writer shaping an argument, the designer translating complexity into clarity, the subject-matter expert validating accuracy, the marketer preparing content for distribution, and the executive ensuring the message reflects DQ's vision.

No matter the format or platform, if someone is responsible for turning ideas into content that represents DQ, CI.DS is the system that supports them.`
    },
    {
      id: 'problem-solving',
      title: '1.06 What problem does it solve?',
      content: `Before CI.DS, content often evolved in isolation. Each unit worked with its own assumptions, formats, and review practices. Valuable ideas were expressed inconsistently, quality depended on individual effort, and teams spent time fixing structure and alignment instead of strengthening the message.

CI.DS changes this experience. It provides a shared, end-to-end system that brings order to the entire content lifecycle - from intent and planning to creation, review, and publication.

By introducing common standards, roles, and checkpoints, CI.DS removes ambiguity, reduces rework, and makes quality repeatable rather than accidental. As a result, teams spend less time correcting and coordinating, and more time creating content that is clear, credible, and impactful.`
    },
    {
      id: 'content-mandate',
      title: '1.1 Content Mandate (DQ Units)',
      content: `Multiple units across DQ are tasked with producing content that delivers strategic impact - content designed to influence decisions, spark engagement, and drive targeted actions across diverse scenarios.

These content-producing units include:

• DTMB (Digital Transformation Management Books) – Develops long-form publications and whitepapers that articulate strategic frameworks, transformation logic, and thought leadership.

• DTMI (Digital Transformation Management Insights) – Publishes analytical insights, trend overviews, and high-frequency thought leadership pieces aligned to market and sector dynamics.

• DTMA (Digital Transformation Management Academy) – Produces structured learning content, training modules, and course materials to support digital capability building.

• DQ Designs – Generates architecture diagrams, strategic blueprints, and design specifications for products, platforms, and organizational constructs.

• DQ Deploys – Delivers implementation-focused content such as guides, manuals, technical documents, and use-case playbooks.

• DQ Deals – Crafts strategic proposals, bid responses, capability decks, and customized engagement presentations.

• DQ Content – Leads multimedia, editorial, and campaign-driven content across digital channels, including social posts, scripts, videos, and creative assets.`
    },
    {
      id: 'relevant-ecosystem',
      title: '1.2 Relevant Ecosystem',
      content: `The CI.DS guidelines apply universally across the DQ content ecosystem and must be upheld to maintain consistency, quality, and brand alignment in every content output.

This includes all formats, platforms, and touchpoints where DQ content is created or shared:

• Within internal DQ documentation and communications
• In DTMB Papers and formal publications
• In DTMA Course Materials and Learning Assets
• Across DTMI Insights and all social media channels
• Within BD proposals, sales decks, and outreach content
• In client-facing deliverables, reports, and strategic outputs`
    },
    {
      id: 'purpose',
      title: '1.3 CI.DS | Purpose',
      content: `The CI.DS is defined as a strategic, end-to-end system that ensures all content items are intentionally planned, professionally produced, and strategically promoted.

It provides a unified framework that brings structure, precision, and purpose to the entire content lifecycle.

By applying CI.DS, DQ ensures that every output - whether a whitepaper, insight, visual asset, or course material - is clear in its message, consistent with the brand, and optimized for measurable performance.

This leads to stronger engagement, greater trust from audiences, streamlined production processes, and higher content ROI across all platforms and channels.`
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
          <div className="max-w-4xl">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-6">
              FRAMEWORK
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Content Intelligence Design System (CI.DS)
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-2xl">
              CI.DS is DQ's intelligent system for turning ideas into consistent, high-impact content at scale. 
              It provides unified guidelines, components, and tools for professional content production.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">2-3hrs</span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm">71+ Sections</span>
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