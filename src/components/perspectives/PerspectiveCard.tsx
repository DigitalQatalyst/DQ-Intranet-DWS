import React from 'react';
import { Hexagon } from 'lucide-react';
import type { Perspective } from '@/data/perspectives';
import GeometricIllustration from '@/components/perspectives/GeometricIllustration';

type PerspectiveCardProps = {
  perspective: Perspective;
  onExplore?: () => void;
};

export default function PerspectiveCard({ perspective, onExplore }: PerspectiveCardProps) {
  return (
    <article className="rounded-3xl bg-white border border-[#e5e9f5] shadow-[0_18px_48px_rgba(3,15,53,0.10),0_2px_8px_rgba(3,15,53,0.06)] overflow-hidden h-full flex flex-col">
      {/* Visual zone (fixed height, stable anchor) */}
      <div className="h-[152px] md:h-[168px] px-6 pt-4 flex items-center">
        <div className="w-full max-w-[520px] h-[124px] md:h-[136px]">
          <GeometricIllustration type={perspective.illustration} className="w-full h-full opacity-[0.94]" />
        </div>
      </div>

      {/* Copy */}
      <div className="px-6 pb-6 pt-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-4 min-h-[52px]">
          <h3 className="ghc-font-display text-2xl md:text-3xl font-semibold text-[#131e42] leading-tight">
            {perspective.title}
          </h3>
          <span className="shrink-0 rounded-full border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--accent)/0.10)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[hsl(var(--accent))]">
            {perspective.tag}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#6b7390] -mt-0.5">
          <Hexagon className="h-4 w-4 text-[hsl(var(--accent))]" />
          <span>{perspective.subtitle}</span>
        </div>

        <p className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42] leading-snug min-h-[60px] mt-1">
          {perspective.question}
        </p>
        <p className="text-[#4a5678] text-sm md:text-base leading-relaxed line-clamp-2 min-h-[44px] -mt-0.5">
          {perspective.description}
        </p>

        <button
          type="button"
          onClick={onExplore}
          className="mt-auto pt-1.5 text-[hsl(var(--accent))] font-semibold inline-flex items-center gap-1 hover:underline self-start"
        >
          Explore in Knowledge Center →
        </button>
      </div>
    </article>
  );
}
