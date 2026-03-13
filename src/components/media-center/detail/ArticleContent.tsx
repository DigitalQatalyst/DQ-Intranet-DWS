import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { formatDateShort, getNewsTypeDisplay } from '@/utils/newsUtils';
import { parseBold } from '@/utils/contentParsing';
import { AudioPlayer } from '@/components/media-center/shared/AudioPlayer';
import { generateAnnouncementHeading, buildOverview, generateBlogSummary } from './contentHelpers';

interface ArticleContentProps {
  article: NewsItem;
  related: NewsItem[];
  shouldUseNewLayout: boolean;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  article,
  related,
  shouldUseNewLayout,
}) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'details' | 'updates'>('details');
  const isPodcast = article.format === 'Podcast' || article.tags?.some(tag => tag.toLowerCase().includes('podcast'));
  const hasAudio = isPodcast && article.audioUrl;
  const overview = buildOverview(article);

  if (shouldUseNewLayout) {
    return (
      <>
        {hasAudio && article.audioUrl && <AudioPlayer audioUrl={article.audioUrl} />}
        
        {/* Tab Bar */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('updates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'updates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Updates
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6 space-y-6">
          {activeTab === 'details' ? (
            <div>
            {/* Heading with Accent Bar */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 relative pl-4">
              <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-blue-500" />
              Article Overview
            </h2>

            {/* Paragraph */}
            <p className="text-gray-700 leading-relaxed">
              This comprehensive article provides detailed insights into the latest developments and trends in the industry. 
              Learn about key concepts, best practices, and practical applications that you can implement immediately.
            </p>

            {/* Checklist */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Key Takeaways</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Understanding fundamental concepts and principles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Practical implementation strategies and techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Real-world case studies and examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Future trends and emerging opportunities</span>
                </li>
              </ul>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Another Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 relative pl-4">
              <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-emerald-500" />
              Detailed Analysis
            </h2>

            <div className="space-y-4">
              {generateBlogSummary(article).map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            </div>
          ) : (
            <section aria-label="Latest Updates" className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 relative pl-4">
                <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-orange-500" />
                Latest Updates
              </h2>
              <p className="text-gray-700 leading-relaxed">
                No new updates have been posted for this announcement yet. Check back soon for rescheduled event details and the associate poll results.
              </p>
            </section>
          )}
        </div>

        {/* Related Articles Section - outside tab content to span full width */}
        {related && related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200 mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 relative pl-4">
              <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-blue-500" />
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.slice(0, 6).map((item) => {
                const relatedDate = formatDateShort(item.date);
                const newsTypeDisplay = getNewsTypeDisplay(item);
                return (
                  <a
                    key={item.id}
                    href={`/marketplace/news/${item.id}${location.search || ''}`}
                    className="block rounded-lg p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                  >
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700">
                        {newsTypeDisplay?.color && (
                          <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: newsTypeDisplay.color }} />
                        )}
                        <span>{newsTypeDisplay?.label || 'Article'}</span>
                      </span>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                        {item.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-gray-500">{relatedDate}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

      </>
    );
  }

  return (
    <>
      {/* Tab Bar */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Article sections">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'details'
                ? 'border-[#1A2E6E] text-[#1A2E6E]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('updates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'updates'
                ? 'border-[#1A2E6E] text-[#1A2E6E]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Updates
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'details' ? (
          <article className="space-y-4">
            {(() => {
              const headingText = generateAnnouncementHeading(article);
              const isNumberedHeading = /^(\*\*)?\d+\.\s/.test(headingText.trim());
              return (
                <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isNumberedHeading ? 'pl-0' : 'pl-4 relative'}`}>
                  {!isNumberedHeading && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent" />
                  )}
                  {headingText}
                </h2>
              );
            })()}
            {overview.map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              const boldText = parseBold(trimmed);
              return (
                <p key={index} className="text-gray-700 text-sm leading-normal mb-2">
                  {boldText}
                </p>
              );
            })}
          </article>
        ) : (
          <section aria-label="Latest Updates" className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 pl-4 relative">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent" />
              Latest Updates
            </h2>
            <p className="text-gray-600 text-sm leading-normal">
              No new updates have been posted for this announcement yet. Check back soon for rescheduled event details and the associate poll results.
            </p>
          </section>
        )}
      </div>

      {/* Related Articles Section */}
      {related && related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 relative pl-4">
            <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-blue-500" />
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.slice(0, 6).map((item) => {
              const relatedDate = formatDateShort(item.date);
              const newsTypeDisplay = getNewsTypeDisplay(item);
              return (
                <a
                  key={item.id}
                  href={`/marketplace/news/${item.id}${location.search || ''}`}
                  className="block rounded-lg p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700">
                      {newsTypeDisplay?.color && (
                        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: newsTypeDisplay.color }} />
                      )}
                      <span>{newsTypeDisplay?.label || 'Article'}</span>
                    </span>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                      {item.title || 'Untitled'}
                    </h3>
                    <p className="text-xs text-gray-500">{relatedDate}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};
