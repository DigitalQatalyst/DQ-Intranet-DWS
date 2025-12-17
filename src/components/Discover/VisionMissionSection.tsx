import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const VisionMissionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="vision-mission"
      className="bg-neutral-50 py-16 md:py-24"
      aria-labelledby="vm-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="vm-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#0E1446] mb-3"
          >
            Vision &amp; Mission
          </h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-[780px] mx-auto leading-relaxed">
            The foundation that drives every associate's purpose, growth, and contribution to the DQ ecosystem.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Vision Card */}
          <div className="flex flex-col h-full rounded-2xl bg-white shadow-[0_10px_30px_rgba(14,20,70,0.08)] border border-neutral-200 p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#0E1446] mb-4 md:mb-6">
              DQ Vision – Perfecting Life's Transactions
            </h3>
            
            <div className="flex-1 space-y-4 mb-6">
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                The <strong>DQ GHC</strong> is a comprehensive framework that informs all aspects of the DigitalQatalyst Organisation—from strategy to execution. At the center of the GHC lies <strong>The DQ Vision</strong>—a powerful articulation of why we exist. It explains why we think differently, why we act boldly, and why we are unwavering in our methods.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                We begin with something simple—and almost invisible: a <strong>transaction</strong>. A person pays a bill, checks their health records, fills out a form, submits an application, or tracks a delivery. These moments are the <strong>threads that hold daily life together</strong>.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                <strong>Our Vision:</strong> "To perfect life's transactions" — enabling a new kind of organisation that learns, adapts, and delivers value with clarity and scale. An organisation that doesn't just react to change, but <strong>anticipates it</strong>. A <strong>Digital Cognitive Organisation (DCO)</strong>.
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <a
                href="https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FB5535] text-white font-semibold rounded-full px-5 py-3 transition-all duration-200 hover:brightness-95 hover:shadow-lg hover:shadow-[#FB5535]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535] focus-visible:ring-offset-2"
                aria-label="View full DQ Vision story"
              >
                View Full Story
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="/marketplace/guides?tab=strategy"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/marketplace/guides?tab=strategy');
                }}
                className="inline-flex items-center gap-2 text-[#0E1446] font-medium rounded-full px-5 py-2 transition-all duration-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1446] focus-visible:ring-offset-2"
                aria-label="Explore Foundation & DNA (Storybook)"
              >
                Foundation & DNA (Storybook)
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Mission Card */}
          <div className="flex flex-col h-full rounded-2xl bg-white shadow-[0_10px_30px_rgba(14,20,70,0.08)] border border-neutral-200 p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#0E1446] mb-4 md:mb-6">
              DQ Mission – Our Raison D'être
            </h3>
            
            <div className="flex-1 space-y-4 mb-6">
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                <strong>Our Mission:</strong> "To accelerate the realisation of Digital Business Platform, using easy to implement blueprints"
              </p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                We equip people and organisations with the <strong>thinking, tools</strong>, and <strong>capabilities</strong> to operate effectively and quickly adapt to the dynamic of the <strong>digital economy</strong>.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                We build <strong>Digital Business Platforms (DBP) Blueprints</strong>—modular, adaptable systems that help organisations shift not just <strong>what they do</strong>, but <strong>how they do it</strong>. They bring <strong>shape to change</strong>, <strong>clarity to chaos</strong>, and give leaders, teams, and clients <strong>confidence</strong> that what they're building will hold.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-neutral-700">
                These are not templates. They are <strong>thinking systems</strong>—crafted to guide transformation, but flexible enough to evolve with it.
              </p>
            </div>

            <div className="mt-auto">
              <a
                href="https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FB5535] text-white font-semibold rounded-full px-5 py-3 transition-all duration-200 hover:brightness-95 hover:shadow-lg hover:shadow-[#FB5535]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535] focus-visible:ring-offset-2"
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

export default VisionMissionSection;

