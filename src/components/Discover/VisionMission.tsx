import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const VisionMission: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 py-16 md:py-24" id="vision-mission" aria-labelledby="vm-heading">
      <div className="dws-container max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="vm-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--dws-text-strong)' }}
          >
            Vision &amp; Mission
          </h2>
          <p
            className="text-base md:text-lg max-w-[780px] mx-auto leading-relaxed clamp-2"
            style={{ color: 'var(--dws-text-dim)' }}
          >
            The foundation that drives every associate's purpose, growth, and contribution to the DQ ecosystem.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Vision Card */}
          <div className="dws-card bg-white flex flex-col h-full p-8 md:p-10" style={{ border: '1px solid var(--dws-line)' }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" style={{ color: 'var(--dws-text-strong)' }}>
              DQ Vision – Perfecting Life's Transactions
            </h3>
            
            <div className="flex-1 mb-6 space-y-4">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                The <strong>DQ GHC</strong> is a comprehensive framework that informs all aspects of the DigitalQatalyst Organisation—from strategy to execution. At the center of the GHC lies <strong>The DQ Vision</strong>—a powerful articulation of why we exist.
              </p>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                We begin with something simple—a <strong>transaction</strong>. These moments are the <strong>threads that hold daily life together</strong>. <strong>Our Vision:</strong> "To perfect life's transactions" — enabling a <strong>Digital Cognitive Organisation (DCO)</strong>.
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <a
                href="https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="dws-btn-primary inline-flex items-center gap-2"
                aria-label="View full DQ Vision story"
              >
                View Full Story
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <button
                onClick={() => navigate('/marketplace/guides?tab=strategy')}
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-gray-100"
                style={{ color: 'var(--dws-text-strong)' }}
                aria-label="Explore Foundation & DNA (Storybook)"
              >
                Foundation & DNA (Storybook)
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mission Card */}
          <div className="dws-card bg-white flex flex-col h-full p-8 md:p-10" style={{ border: '1px solid var(--dws-line)' }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" style={{ color: 'var(--dws-text-strong)' }}>
              DQ Mission – Our Raison D'être
            </h3>
            
            <div className="flex-1 mb-6 space-y-4">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                <strong>Our Mission:</strong> "To accelerate the realisation of Digital Business Platform, using easy to implement blueprints"
              </p>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                We equip people and organisations with the <strong>thinking, tools</strong>, and <strong>capabilities</strong> to operate effectively and quickly adapt to the dynamic of the <strong>digital economy</strong>.
              </p>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                We build <strong>Digital Business Platforms (DBP) Blueprints</strong>—modular, adaptable systems that help organisations shift not just <strong>what they do</strong>, but <strong>how they do it</strong>.
              </p>
            </div>

            <div className="mt-auto">
              <a
                href="https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="dws-btn-primary inline-flex items-center gap-2"
                aria-label="View full DQ Mission story"
              >
                View Full Story
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
