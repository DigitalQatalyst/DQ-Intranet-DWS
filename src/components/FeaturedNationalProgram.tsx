import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeInUpOnScroll } from './AnimationUtils';

interface FeaturedProgram {
  id: string;
  partnership: string;
  title: string;
  description: string;
  learnMoreHref: string;
  applyNowHref?: string;
  backgroundImage?: string;
  tags?: string[];
}

const featuredPrograms: FeaturedProgram[] = [
  {
    id: 'scrum-structure-update',
    partnership: 'DQ Operations',
    title: 'New Update | Scrum Master Structure Changes',
    description:
      'We’ve introduced updates to the Scrum Master leadership structure to improve clarity, accountability, and delivery efficiency across teams.',
    learnMoreHref: '#',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80)',
    tags: ['Corporate Announcements', 'DQ Operations', 'DWS'],
  },
  {
    id: 'dq-storybook-release',
    partnership: 'DQ Communications',
    title: 'New Release | Updated DQ Storybook Available',
    description:
      'The latest DQ Storybook is now available with refreshed links across Vision, HoV, Personas, Agile TMS/SOS/Flows, and 6xD.',
    learnMoreHref: '#',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80)',
    tags: ['Corporate Announcements', 'DQ Communications', 'GHC'],
  },
  {
    id: 'product-designer-role',
    partnership: 'Delivery — Designs',
    title: 'Now Hiring | Product Designer (Remote)',
    description:
      'A new Product Designer role is open to help shape impactful digital experiences across DQ platforms.',
    learnMoreHref: '#',
    applyNowHref: '#',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80)',
    tags: ['Delivery — Designs', 'Remote', 'Careers'],
  },
  {
    id: 'devops-engineer-role',
    partnership: 'SecDevOps',
    title: 'Now Hiring | DevOps Engineer (Tech)',
    description:
      'We’re hiring a DevOps Engineer to strengthen our cloud infrastructure, automation, and deployment pipelines.',
    learnMoreHref: '#',
    applyNowHref: '#',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80)',
    tags: ['SecDevOps', 'Tech', 'Careers'],
  },
];

export const FeaturedNationalProgram: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProgram = featuredPrograms[activeIndex];
  const hasImage = Boolean(activeProgram.backgroundImage);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredPrograms.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredPrograms.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-8 px-4">
      <FadeInUpOnScroll className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
          Featured Updates & Opportunities
        </h2>
        <div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed with DWS platform updates, announcements, releases, and key system changes.
          </p>
        </div>
      </FadeInUpOnScroll>

      <div className="relative rounded-2xl overflow-hidden shadow-lg w-full max-w-[1248px] mx-auto">
        <div 
          key={activeIndex}
          className={`h-[359px] p-8 flex flex-col justify-between relative animate-fade-in ${
            activeProgram.backgroundImage ? '' : 'bg-gradient-to-r from-green-400 via-green-300 to-yellow-300'
          }`}
          style={
            activeProgram.backgroundImage
              ? {
                  backgroundImage: `${
                    activeProgram.id === 'scrum-structure-update' || activeProgram.id === 'dq-storybook-release'
                      // Cool blue/teal gradient for update/release cards
                      ? 'linear-gradient(90deg, rgba(15,118,210,0.9) 0%, rgba(14,165,233,0.8) 45%, rgba(56,189,248,0.8) 100%)'
                      // Vibrant purple/indigo gradient for hiring cards
                      : 'linear-gradient(90deg, rgba(109,40,217,0.9) 0%, rgba(147,51,234,0.85) 45%, rgba(79,70,229,0.9) 100%)'
                  }, ${activeProgram.backgroundImage}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }
          }
        >
          <div className={`flex-1 flex flex-col justify-center ${hasImage ? 'text-white' : 'text-gray-900'}`}>
            <div className={`inline-flex items-center rounded-full px-4 py-1.5 mb-4 w-fit ${hasImage ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
              <p className="text-sm">
                {activeProgram.partnership}
              </p>
            </div>
            <h3 className={`text-3xl font-bold mb-4 ${hasImage ? 'text-white' : 'text-gray-900'}`}>
              {activeProgram.title}
            </h3>
            <p className={`text-lg max-w-2xl leading-relaxed ${hasImage ? 'text-white' : 'text-gray-800'}`}>
              {activeProgram.description}
            </p>
            {activeProgram.tags && activeProgram.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {activeProgram.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${hasImage ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <a
              href={activeProgram.learnMoreHref}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                hasImage
                  ? 'bg-white/90 text-blue-700 hover:bg-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              View Details
              <ArrowRight size={18} className={`${hasImage ? 'text-blue-700' : 'text-white'}`} />
            </a>
            {activeProgram.applyNowHref && (
              <a
                href={activeProgram.applyNowHref}
                className={`px-6 py-3 font-semibold rounded-lg border transition-colors flex items-center gap-2 ${
                  hasImage
                    ? 'border-white/80 text-white hover:bg-white/10'
                    : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                }`}
              >
                Apply
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      {featuredPrograms.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {featuredPrograms.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-orange-500 w-8 h-2' 
                  : 'bg-gray-300 w-2 h-2'
              }`}
              aria-label={`Go to program ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};



