import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import type { NewsItem } from '@/data/media/news';
import type { FiltersValue } from './types';
import { PodcastSeriesCard } from './cards/PodcastSeriesCard';
import { BlogCard } from './cards/BlogCard';

interface GridProps {
  query: {
    tab: string;
    q?: string;
    filters?: FiltersValue;
  };
  items: NewsItem[];
}

export default function PodcastsGrid({ query, items }: GridProps) {
  const location = useLocation();

  const search = query.q?.trim().toLowerCase() ?? '';

  const filteredPodcasts = useMemo(
    () =>
      !search
        ? []
        : items
            .filter(
              (item) =>
                item.format === 'Podcast' ||
                item.tags?.some((tag) => tag.toLowerCase().includes('podcast'))
            )
            .filter((item) => item.title?.toLowerCase().includes(search)),
    [items, search]
  );

  if (query.tab !== 'podcasts') {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items (1)</h3>
        <span>Podcasts updated regularly</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <PodcastSeriesCard
          href={`/marketplace/news/action-solver-podcast${location.search}`}
        />
      </div>

      {search && (
        <>
          {filteredPodcasts.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No podcasts found matching that title.
            </div>
          ) : (
            <div className="grid gap-6 pt-2 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPodcasts.map((item) => (
                <BlogCard
                  key={item.id}
                  item={item}
                  href={`/marketplace/news/${item.id}${location.search}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

