import type { NewsItem } from '@/data/media/news';

import { Link } from 'react-router-dom';

interface NewsCardProps {
  item: NewsItem;
  href?: string;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

// Color and label mappings for newsType categories (matching screenshot)
const newsTypeColor: Record<NonNullable<NewsItem['newsType']>, string> = {
  'Policy Update': '#8B5CF6',        // Purple for policy/guidelines
  'Upcoming Events': '#F97316',      // Orange for events
  'Company News': '#0EA5E9',         // Blue for company news
  'Holidays': '#16A34A'              // Green for holidays/notices
};

const newsTypeLabel: Record<NonNullable<NewsItem['newsType']>, string> = {
  'Policy Update': 'Policy Update',
  'Upcoming Events': 'Upcoming Events',
  'Company News': 'Company News',
  'Holidays': 'Holidays'
};

// Fallback for items without newsType (shouldn't happen, but for safety)
const getNewsTypeDisplay = (item: NewsItem) => {
  if (item.newsType) {
    return {
      label: newsTypeLabel[item.newsType],
      color: newsTypeColor[item.newsType]
    };
  }
  // Fallback to type if newsType is missing
  const typeFallback: Record<NewsItem['type'], { label: string; color: string }> = {
    Announcement: { label: 'Company News', color: '#0EA5E9' },      // Blue
    Guidelines: { label: 'Policy Update', color: '#8B5CF6' },        // Purple
    Notice: { label: 'Holidays', color: '#16A34A' },                  // Green
    'Thought Leadership': { label: 'Blog', color: '#14B8A6' }         // Teal for blogs
  };
  return typeFallback[item.type];
};

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function NewsCard({ item, href }: NewsCardProps) {
  const imageIndex = Math.abs(item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));
  const imageSrc = item.image || fallbackImages[imageIndex % fallbackImages.length];
  
  // Generate an appropriate title for news items that don't have one
  const generateTitle = (item: NewsItem): string => {
    // If title exists and is not empty, use it
    if (item.title && item.title.trim()) {
      // Check for specific article title updates
      if (item.id === 'dq-scrum-master-structure-update' || item.title.toLowerCase().includes('scrum master structure')) {
        return 'Updated Scrum Master Structure';
      }
      if (item.id === 'dq-townhall-meeting-agenda' || item.title.toLowerCase().includes('townhall meeting agenda')) {
        return 'DQ Townhall Meeting';
      }
      if (item.id === 'company-wide-lunch-break-schedule' || item.title.toLowerCase().includes('company-wide lunch break schedule') || item.title.toLowerCase().includes('lunch break schedule')) {
        return 'Company-Wide Lunch Break Schedule';
      }
      if (item.id === 'grading-review-program-grp' || item.title.toLowerCase().includes('grading review program') || item.title.toLowerCase().includes('grp')) {
        return 'Grading Review Program (GRP)';
      }
      return item.title;
    }

    // Generate title based on available information
    const parts: string[] = [];

    // Add location prefix if available
    if (item.location) {
      const locationMap: Record<string, string> = {
        'Dubai': 'DXB',
        'Nairobi': 'NBO',
        'Riyadh': 'KSA',
        'Remote': 'Remote'
      };
      parts.push(locationMap[item.location] || item.location);
    }

    // Add type/newsType information
    if (item.newsType) {
      parts.push(item.newsType);
    } else if (item.type) {
      if (item.type === 'Thought Leadership') {
        parts.push('Blog');
      } else {
        parts.push(item.type);
      }
    }

    // Try to extract title from excerpt
    if (item.excerpt && item.excerpt.trim()) {
      const excerptWords = item.excerpt.trim().split(' ');
      if (excerptWords.length > 0) {
        // Take first 8 words and capitalize
        const titleFromExcerpt = excerptWords.slice(0, 8).join(' ');
        if (titleFromExcerpt.length > 20) {
          return parts.length > 0 ? `${parts.join(' | ')} | ${titleFromExcerpt}` : titleFromExcerpt;
        }
      }
    }

    // Try to extract from content if available
    if (item.content) {
      const firstLine = item.content.split('\n').find(line => line.trim() && !line.trim().startsWith('#'));
      if (firstLine) {
        const cleanLine = firstLine.trim().replace(/^#+\s+/, '').replace(/\*\*/g, '').substring(0, 60);
        if (cleanLine.length > 15) {
          return parts.length > 0 ? `${parts.join(' | ')} | ${cleanLine}` : cleanLine;
        }
      }
    }

    // Fallback based on ID patterns
    if (item.id) {
      const idParts = item.id.split('-');
      const meaningfulParts = idParts
        .filter(part => part.length > 2 && !['dq', 'the', 'and', 'for'].includes(part.toLowerCase()))
        .map(part => part.charAt(0).toUpperCase() + part.slice(1));
      
      if (meaningfulParts.length > 0) {
        const idTitle = meaningfulParts.join(' ');
        return parts.length > 0 ? `${parts.join(' | ')} | ${idTitle}` : idTitle;
      }
    }

    // Final fallback
    const typeLabel = item.type === 'Thought Leadership' ? 'Blog' : (item.newsType || item.type || 'Announcement');
    return parts.length > 0 ? `${parts.join(' | ')} | ${typeLabel}` : typeLabel;
  };

  // Update title for specific articles
  const getDisplayTitle = () => {
    return generateTitle(item);
  };
  
  const displayTitle = getDisplayTitle();
  const newsTypeDisplay = getNewsTypeDisplay(item);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img src={imageSrc} alt={displayTitle} className="h-40 w-full object-cover" loading="lazy" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: newsTypeDisplay.color }} />
          {newsTypeDisplay.label}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col">
          <div className="text-xs text-gray-500">
            {item.type} · {formatDate(item.date)}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">{displayTitle}</h3>
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{item.excerpt}</p>

          <div className="mt-3 text-xs text-gray-500">
            {item.views} views {item.location ? ` · ${item.location}` : ''}
          </div>

          {(item.newsType || item.focusArea || item.newsSource) && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
              {item.newsType && <span className="rounded-full bg-gray-100 px-2 py-1">{item.newsType}</span>}
              {item.newsSource && <span className="rounded-full bg-gray-100 px-2 py-1">{item.newsSource}</span>}
              {item.focusArea && <span className="rounded-full bg-gray-100 px-2 py-1">{item.focusArea}</span>}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          {href ? (
            <Link
              to={href}
              className="block h-9 rounded-xl bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90"
            >
              View Details
            </Link>
          ) : (
            <button className="h-9 w-full rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
              View Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
