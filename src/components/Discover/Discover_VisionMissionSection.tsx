import React from 'react';
import { DiscoverSectionTitle } from './DiscoverSectionTitle';

export const Discover_VisionMissionSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24" id="vision-mission" aria-labelledby="vm-heading">
      <div className="mx-auto px-6 md:px-8" style={{ maxWidth: '1120px' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <DiscoverSectionTitle id="vm-heading">
            Vision &amp; Mission
          </DiscoverSectionTitle>
          <p
            className="text-base md:text-lg max-w-[780px] mx-auto leading-relaxed clamp-2"
            style={{ color: 'var(--dws-text-dim)' }}
          >
            The foundation that drives every associate's purpose, growth, and contribution to the DQ ecosystem.
          </p>
        </div>

        {/* Cards Container - Centered with explicit gap */}
        <div 
          className="flex flex-col md:flex-row items-center justify-center"
          style={{ gap: '32px' }}
        >
          {/* Vision Card */}
          <div
            className="vision-mission-card bg-white flex flex-col"
            style={{
              width: '500px',
              maxWidth: '500px',
              height: '406px',
              minHeight: '406px',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <h3
              className="vision-mission-title"
              style={{
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.35,
                maxWidth: '90%',
                color: '#030F35',
                margin: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              DQ Vision – Perfecting Life's Transactions
            </h3>

            <p
              className="vision-mission-body"
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#4B5563',
                maxWidth: '95%',
                marginTop: '16px',
                marginBottom: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              We empower associates to turn innovation into impact through seamless, dependable workflows that make
              collaboration effortless and progress meaningful.
            </p>
          </div>

          {/* Mission Card */}
          <div
            className="vision-mission-card bg-white flex flex-col"
            style={{
              width: '500px',
              maxWidth: '500px',
              height: '406px',
              minHeight: '406px',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <h3
              className="vision-mission-title"
              style={{
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.35,
                maxWidth: '90%',
                color: '#030F35',
                margin: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              DQ Mission – Building a Smarter, Connected Future
            </h3>

            <p
              className="vision-mission-body"
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#4B5563',
                maxWidth: '95%',
                marginTop: '16px',
                marginBottom: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              We connect people, processes, and platforms to enable smarter work—helping every Qatalyst learn faster,
              collaborate better, and lead with purpose.
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1023px) {
          .vision-mission-card {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
          }
        }
        
        @media (max-width: 767px) {
          .vision-mission-card {
            padding: 24px !important;
          }
          
          .vision-mission-title {
            font-size: 20px !important;
          }
          
          .vision-mission-body {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Discover_VisionMissionSection;
