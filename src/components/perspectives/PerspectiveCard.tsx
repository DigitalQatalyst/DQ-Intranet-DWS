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
      <div className="relative h-[168px] md:h-[184px] bg-[#f9fbff] border-b border-[#e5e9f5]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-[2px] bg-[hsl(var(--accent)/0.25)]" />
        </div>
        <div className="absolute right-5 top-4 h-[140px] w-[220px] max-w-[75%] flex items-center justify-end">
          <GeometricIllustration type={perspective.illustration} className="w-full h-full opacity-[0.92]" />
        </div>
      </div>

      {/* Copy */}
      <div className="px-6 pb-7 pt-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-4 min-h-[56px]">
          <h3 className="ghc-font-display text-2xl md:text-3xl font-semibold text-[#131e42] leading-tight">
            {perspective.title}
          </h3>
          <span className="shrink-0 rounded-full border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--accent)/0.10)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[hsl(var(--accent))]">
            {perspective.tag}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#6b7390]">
          <Hexagon className="h-4 w-4 text-[hsl(var(--accent))]" />
          <span>{perspective.subtitle}</span>
        </div>

        <p className="ghc-font-display text-lg md:text-xl font-semibold text-[#131e42] leading-snug min-h-[52px] mt-1">
          {perspective.question}
        </p>
        <p className="text-[#4a5678] text-sm md:text-base leading-relaxed line-clamp-2 min-h-[44px]">
          {perspective.description}
        </p>

        <button
          type="button"
          onClick={onExplore}
          className="mt-auto pt-2 text-[hsl(var(--accent))] font-semibold inline-flex items-center gap-1 hover:underline self-start"
        >
          Explore in Knowledge Center →
        </button>
      </div>
    </article>
  );
}
