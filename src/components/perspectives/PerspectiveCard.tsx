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
    <article className="rounded-3xl bg-white border border-[#e5e9f5] shadow-sm overflow-hidden h-full">
      {/* Illustration */}
      <div className="relative px-6 pt-6 pb-2 bg-gradient-to-br from-[hsl(var(--accent)/0.12)] via-white to-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[hsl(var(--accent)/0.10)] blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#131e42]/[0.04] blur-2xl" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <h3 className="ghc-font-display text-2xl md:text-3xl font-semibold text-[#131e42] leading-tight">
            {perspective.title}
          </h3>
          <span className="shrink-0 rounded-full border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--accent)/0.12)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[hsl(var(--accent))]">
            {perspective.tag}
          </span>
        </div>

        <div className="relative mt-3 flex items-center gap-2 text-sm text-[#6b7390]">
          <Hexagon className="h-4 w-4 text-[hsl(var(--accent))]" />
          <span>{perspective.subtitle}</span>
        </div>

        <GeometricIllustration type={perspective.illustration} className="relative mt-4 w-full h-[160px]" />
      </div>

      {/* Copy */}
      <div className="px-6 pb-7 pt-4 flex flex-col gap-3">
        <p className="ghc-font-display text-lg md:text-xl font-semibold text-[#131e42] leading-snug min-h-[52px]">
          {perspective.question}
        </p>
        <p className="text-[#4a5678] text-sm md:text-base leading-relaxed line-clamp-2 min-h-[44px]">
          {perspective.description}
        </p>

        <button
          type="button"
          onClick={onExplore}
          className="mt-1 text-[hsl(var(--accent))] font-semibold inline-flex items-center gap-1 hover:underline self-start"
        >
          Explore in Knowledge Center →
        </button>
      </div>
    </article>
  );
}
