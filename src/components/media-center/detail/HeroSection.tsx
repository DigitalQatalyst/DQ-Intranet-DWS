import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, Share2, BookmarkIcon } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { generateTitle, getNewsTypeDisplay, formatDate } from '@/utils/newsUtils';

interface HeroSectionProps {
  article: NewsItem;
  location: { search: string };
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  article, 
  location, 
  isBookmarked, 
  onBookmarkToggle 
}) => {
  const announcementDate = article.date ? formatDate(article.date) : '';
  const mediaCenterUrl = (() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab ? `/marketplace/opportunities?tab=${tab}` : '/marketplace/opportunities';
  })();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {});
    }
  };

  return (
    <section className="relative min-h-[320px] md:min-h-[400px] flex flex-col" aria-labelledby="article-title">
      {/* Gradient Background - dark colors cover most of hero, white starts at very bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #192D6C 0%, #051139 55%, #051139 92%, #ffffff 100%)',
        }}
      />
      
      {/* Mesh Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(59_130_246_/_0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(34_197_94_/_0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(251_146_60_/_0.1),_transparent_50%)]" />
      </div>
      
      <div className="relative z-10 w-full pt-4">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Link to="/" className="hover:text-white hover:underline transition-colors">
                Home
              </Link>
              <ChevronRightIcon size={16} />
              <Link to={mediaCenterUrl} className="hover:text-white hover:underline transition-colors">
                DQ Media Center
              </Link>
              <ChevronRightIcon size={16} />
              <span className="text-white font-medium">{generateTitle(article)}</span>
            </div>
            <div className="flex gap-2 text-sm">
              <button 
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Share article"
              >
                <Share2 size={16} />
                Share
              </button>
              <button 
                type="button"
                onClick={onBookmarkToggle}
                className={`inline-flex items-center gap-1 rounded-lg border border-white/30 backdrop-blur-sm px-3 py-2 transition-colors cursor-pointer ${
                  isBookmarked 
                    ? 'bg-white/20 text-white border-white/40' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Save article'}
              >
                <BookmarkIcon size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mx-auto px-6 sm:px-8 lg:px-12 py-4 md:py-6 w-full flex-1 flex items-center">
        <div className="w-full">
          {/* Title Section - spans full width with small margins */}
          <div className="bg-black/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                {getNewsTypeDisplay(article).label}
              </span>
            </div>

            {/* Title */}
            <h1 id="article-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 break-words">
              {generateTitle(article)}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/90 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Metadata Chips */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black/5 border border-white/10">
                <span className="text-xs font-medium text-white/70">Date:</span>
                <span className="text-xs text-white ml-1">{announcementDate}</span>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black/5 border border-white/10">
                <span className="text-xs font-medium text-white/70">Author:</span>
                <span className="text-xs text-white ml-1">{article.author}</span>
              </div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black/5 border border-white/10">
                <span className="text-xs font-medium text-white/70">Reading:</span>
                <span className="text-xs text-white ml-1">{article.readingTime || '5–10'} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
