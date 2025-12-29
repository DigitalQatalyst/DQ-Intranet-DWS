import { Link } from 'react-router-dom';
import { Radio, Clock, Calendar, Play, Plus } from 'lucide-react';

interface PodcastSeriesCardProps {
  href?: string;
}

export function PodcastSeriesCard({ href }: PodcastSeriesCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Abstract wave-like shapes on the right */}
        <div className="absolute right-0 top-0 h-full w-2/3">
          {/* Flowing wave shapes */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 160" preserveAspectRatio="none">
            <path
              d="M 0 80 Q 50 40, 100 60 T 200 50 L 200 160 L 0 160 Z"
              fill="rgba(249, 115, 22, 0.4)"
              className="blur-sm"
            />
            <path
              d="M 0 100 Q 60 60, 120 80 T 200 70 L 200 160 L 0 160 Z"
              fill="rgba(239, 68, 68, 0.35)"
              className="blur-sm"
            />
            <path
              d="M 0 120 Q 70 80, 140 100 T 200 90 L 200 160 L 0 160 Z"
              fill="rgba(251, 146, 60, 0.3)"
              className="blur-sm"
            />
          </svg>
        </div>
        
        {/* PODCAST overlay - centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="rounded bg-gray-200/90 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-semibold text-gray-800 tracking-wide">PODCAST</span>
          </div>
        </div>
        
        {/* Series Label */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-full bg-teal-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Action-Solver Series
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900">
            Action-Solver Podcast
          </h3>
          
          {/* Tagline */}
          <p className="mt-1 text-sm text-gray-600">
            Short conversations that solve real work problems at DQ
          </p>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Radio size={14} />
              <span>8 episodes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>~13 min avg</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Weekly</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              Ghc
            </span>
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
              Execution
            </span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              Leadership
            </span>
          </div>

          {/* Hosted By */}
          <div className="mt-3 text-xs text-gray-500">
            Hosted by Sarah Chen, Marcus Johnson
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 space-y-2">
          {href ? (
            <Link
              to={href}
              className="flex h-9 items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Play size={16} />
              <span>Play Latest Episode</span>
            </Link>
          ) : (
            <button className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600">
              <Play size={16} />
              <span>Play Latest Episode</span>
            </button>
          )}
          
          <button className="flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-gray-50 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
            <Plus size={16} />
            <span>Follow</span>
          </button>
        </div>
      </div>
    </article>
  );
}

