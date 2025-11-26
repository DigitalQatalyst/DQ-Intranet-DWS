import React from "react";
import classNames from "clsx";
import { MapPin } from "lucide-react";
import { TagChip } from "../Cards/TagChip";

type PositionHeroProps = {
  title: string;
  unitName?: string | null;
  location?: string | null;
  sfiaLevel?: string | null;
  tags?: string[];
  bannerImageUrl?: string | null;
  description?: string | null;
};

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80";

export const PositionHero: React.FC<PositionHeroProps> = ({
  title,
  unitName,
  location,
  sfiaLevel,
  tags = [],
  bannerImageUrl,
  description,
}) => {
  const pillItems = [
    unitName ? { key: "unit", label: unitName } : null,
    location ? { key: "location", label: location, icon: <MapPin size={14} className="text-blue-200" /> } : null,
    sfiaLevel ? { key: "sfia", label: sfiaLevel } : null,
  ].filter(Boolean) as { key: string; label: string; icon?: React.ReactNode }[];

  const displayTags = tags?.filter(Boolean) ?? [];
  const heroDescription =
    description ||
    "Internal reference to understand scope, responsibilities, and expectations for this position.";

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-xl">
      <div className="absolute inset-0">
        <img
          src={bannerImageUrl || DEFAULT_BANNER}
          alt={title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_BANNER;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030F35]/90 via-[#1A2E6E]/85 to-[#4B61D1]/80" />
      </div>

      <div className="relative p-6 sm:p-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {pillItems.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
              {pillItems.map((pill) => (
                <span
                  key={pill.key}
                  className="px-3 py-1 rounded-full bg-white/10 text-white inline-flex items-center gap-1"
                >
                  {pill.icon}
                  {pill.label}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm text-blue-100 uppercase tracking-wide">Role profile</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
          </div>
          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {displayTags.map((tag) => (
                <TagChip key={tag} text={tag} variant="secondary" size="sm" />
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 rounded-2xl bg-white/10 px-5 py-4 text-sm text-blue-50 space-y-1">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
            Role profile
          </span>
          <p className="leading-relaxed text-blue-50">{heroDescription}</p>
        </div>
      </div>
    </section>
  );
};
