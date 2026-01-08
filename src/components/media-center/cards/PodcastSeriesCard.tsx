import { Link } from 'react-router-dom';
import { Radio, Clock, Calendar, Play, Plus, Mic } from 'lucide-react';

const PODCAST_IMAGE = '/podcasts.jpg';

interface PodcastSeriesCardProps {
  href?: string;
}

export function PodcastSeriesCard({ href }: PodcastSeriesCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-900">
        {/* Abstract wave-like shapes on the right */}
        <img
          src={PODCAST_IMAGE}
          alt="Action-Solver Podcast cover art"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Flowing wave shapes */}
        
        {/* PODCAST overlay - centered */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="flex flex-col items-center rounded-lg bg-black/40 px-4 py-3 backdrop-blur-sm">
            <Mic size={28} className="mb-1 text-white" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white">Podcast Series</span>
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
              GHC
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              Execution
            </span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              Leadership
            </span>
          </div>

          {/* Hosted By */}
          
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 space-y-2">
          {href ? (
            <Link
              to={href}
              className="flex h-9 items-center justify-center gap-2 rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Play size={16} />
              <span>Play Series</span>
            </Link>
          ) : (
            <button className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
              <Play size={16} />
              <span>Play Series</span>
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

