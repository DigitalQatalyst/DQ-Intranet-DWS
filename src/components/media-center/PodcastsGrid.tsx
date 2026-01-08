import { useLocation } from 'react-router-dom';
import type { NewsItem } from '@/data/media/news';
import type { FiltersValue } from './types';
import { PodcastSeriesCard } from './cards/PodcastSeriesCard';

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

  if (query.tab !== 'podcasts') {
    return null;
  }

  // Only show the series card, no search results in grid (search dropdown handles results)
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
    </section>
  );
}

