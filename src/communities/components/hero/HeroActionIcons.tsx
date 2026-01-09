import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, BarChart3, Link2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/communities/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/communities/components/ui/tooltip';

interface HeroActionIconsProps {
  communityId: string;
  communityName: string;
  onLike?: () => void;
  onInsights?: () => void;
}

const FAVORITES_STORAGE_KEY = 'dq_community_favorites';

const getFavorites = (): Set<string> => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveFavorites = (favorites: Set<string>) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

export const HeroActionIcons: React.FC<HeroActionIconsProps> = ({
  communityId,
  communityName,
  onLike,
  onInsights
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Load favorite status on mount
  useEffect(() => {
    const favorites = getFavorites();
    setIsLiked(favorites.has(communityId));
  }, [communityId]);

  const handleLike = () => {
    const favorites = getFavorites();
    const newIsLiked = !isLiked;
    
    if (newIsLiked) {
      favorites.add(communityId);
      toast.success('Added to favorites');
    } else {
      favorites.delete(communityId);
      toast.success('Removed from favorites');
    }
    
    saveFavorites(favorites);
    setIsLiked(newIsLiked);
    onLike?.();
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/community/${communityId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Community link copied to clipboard');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleInsights = () => {
    onInsights?.();
    // Navigate to analytics dashboard
    navigate(`/community/${communityId}/analytics`);
  };

  const iconButtonClass = "h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent";

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Like / Reaction */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleLike}
              className={iconButtonClass}
              aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-white' : ''}`} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLiked ? 'Remove from favorites' : 'Add to favorites'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Insights / Analytics */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleInsights}
              className={iconButtonClass}
              aria-label="View insights"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View insights</p>
          </TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopyLink}
              className={iconButtonClass}
              aria-label="Copy link"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy link</p>
          </TooltipContent>
        </Tooltip>

        {/* More Options */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  className={iconButtonClass}
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More options</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleCopyLink}>
              <Link2 className="h-4 w-4 mr-2" />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInsights}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View insights
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLike}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              {isLiked ? 'Remove from favorites' : 'Add to favorites'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
};

