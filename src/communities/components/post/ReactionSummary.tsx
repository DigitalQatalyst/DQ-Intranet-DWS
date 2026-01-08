import React from 'react';

interface ReactionSummaryProps {
  topReaction?: {
    emoji?: string | null;
    userName?: string | null;
    count?: number | null;
  } | null;
}

export const ReactionSummary: React.FC<ReactionSummaryProps> = ({ topReaction }) => {
  // Optional-safe: never crash on missing data
  if (!topReaction || !topReaction.emoji || (topReaction.count ?? 0) === 0) {
    return null;
  }

  const emoji = topReaction.emoji ?? '';
  const count = topReaction.count ?? 0;
  const userName = topReaction.userName ?? null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-600">
      <span className="text-base">{emoji}</span>
      <span>
        {count === 1 && userName
          ? userName
          : count}
      </span>
    </div>
  );
};

