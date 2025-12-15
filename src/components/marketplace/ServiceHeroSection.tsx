import React from 'react';
import { MapPin } from 'lucide-react';

export interface ServiceHeroSectionProps {
  item: {
    title: string;
    category?: string;
    serviceType?: string;
    deliveryMode?: string;
    provider?: {
      name: string;
    };
    tags?: string[];
    featuredImageUrl?: string;
    lastUpdated?: string;
    location?: string;
  };
}

export function ServiceHeroSection({ 
  item
}: ServiceHeroSectionProps) {
  // Use featured image or default workplace image
  const backgroundImage = item.featuredImageUrl || '/images/services/IT-support.jpg';
  
  // Format last updated date
  const lastUpdated = item.lastUpdated || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Handle image load error with gradient fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.backgroundImage = 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';
  };

  return (
    <div 
      className="w-full relative overflow-hidden rounded-2xl mx-auto"
      style={{ 
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onError={handleImageError}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(135deg, rgba(3, 15, 53, 0.75) 0%, rgba(3, 15, 53, 0.65) 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 px-6 md:px-10 lg:px-14 py-8 md:py-10 lg:py-12">

        {/* Metadata Pills Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {item.provider?.name && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30">
              UNIT: {item.provider.name}
            </span>
          )}
          {item.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30">
              {item.category.toUpperCase()}
            </span>
          )}
          {item.serviceType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30">
              {item.serviceType}
            </span>
          )}
          {item.deliveryMode && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30">
              {item.deliveryMode}
            </span>
          )}
          {item.location && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/30">
              <MapPin size={12} className="mr-1" />
              {item.location}
            </span>
          )}
        </div>

        {/* Main Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-2.5 leading-tight max-w-4xl">
          {item.title}
        </h1>

        {/* Last Updated */}
        <p className="text-white/75 text-xs md:text-sm mb-5">
          Last updated: {lastUpdated}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-white/15 text-white backdrop-blur-sm border border-white/25 hover:bg-white/25 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

