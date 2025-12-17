import type { NewsItem } from '@/data/media/news';

import { Link } from 'react-router-dom';

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

// Unique color for Blog tag
const BLOG_COLOR = '#14B8A6'; // Teal color for blogs

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

interface BlogCardProps {
  item: NewsItem;
  href?: string;
}

export function BlogCard({ item, href }: BlogCardProps) {
  const imageIndex = Math.abs(item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));
  const imageSrc = item.image || fallbackImages[imageIndex % fallbackImages.length];
  const authorName = item.byline || item.author || 'DQ Media Team';

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img src={imageSrc} alt={item.title} className="h-40 w-full object-cover" loading="lazy" />
        {/* Blog tag with unique color */}
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BLOG_COLOR }} />
          Blog
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col">
          <div className="text-xs text-gray-500">
            {authorName} · {formatDate(item.date)}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{item.excerpt}</p>

          <div className="mt-3 text-xs text-gray-500">
            {item.views} views
          </div>

          {item.source && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
              <span className="rounded-full bg-gray-100 px-2 py-1">{item.source}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          {href ? (
            <Link
              to={href}
              className="block h-9 rounded-xl bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90"
            >
              View Insights
            </Link>
          ) : (
            <button className="h-9 w-full rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
              View Insights
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
