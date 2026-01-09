import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Button } from '@/communities/components/ui/button';
import { SignInModal } from '@/communities/components/auth/SignInModal';
import { useCommunityMembership } from '@/communities/hooks/useCommunityMembership';
import { toast } from 'sonner';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import {
  ReactionType,
  REACTION_CONFIG,
  EMOJI_TO_TYPE,
  REACTION_TO_DB_TYPE,
  QUICK_REACTIONS,
  getReactionEmoji,
  getReactionLabel,
  getReactionTypeFromEmoji
} from '@/communities/types/reactions';

interface CommunityReactionsProps {
  postId?: string;
  commentId?: string;
  communityId?: string;
  isMember?: boolean;
  onReactionChange?: () => void;
  showSummary?: boolean; // If false, only show Like button (for action row)
}

export const CommunityReactions: React.FC<CommunityReactionsProps> = ({
  postId,
  commentId,
  communityId,
  isMember: isMemberProp,
  onReactionChange,
  showSummary = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const { isMember: isMemberFromHook } = useCommunityMembership(communityId);
  // Use prop if provided, otherwise fall back to hook
  const isMember = isMemberProp !== undefined ? isMemberProp : isMemberFromHook;
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    like: 0,
    love: 0,
    celebrate: 0,
    applause: 0,
    clap: 0,
    wow: 0,
    surprised: 0,
    sad: 0,
    helpful: 0,
    insightful: 0
  });
  const [userReactions, setUserReactions] = useState<Set<ReactionType>>(new Set());
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(null); // Currently selected reaction
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null); // Custom emoji from full picker
  const [showReactions, setShowReactions] = useState(false); // Hover popup state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Full emoji picker state
  const [loading, setLoading] = useState(true);
  const likeWrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchReactions();
  }, [postId, commentId]);

  const fetchReactions = async () => {
    // New table only supports posts, skip if commentId only
    if (!postId) return;

    setLoading(true);
    try {
      // Use new reactions table (posts only) - include emoji column
      const query = supabase
        .from('community_post_reactions_new')
        .select('id, user_id, reaction_type, emoji')
        .eq('post_id' as any, postId);

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching reactions:', error);
        setLoading(false);
        return;
      }

      if (data && Array.isArray(data)) {
        const counts: Record<ReactionType, number> = {
          like: 0,
          love: 0,
          celebrate: 0,
          applause: 0,
          clap: 0,
          wow: 0,
          surprised: 0,
          sad: 0,
          helpful: 0,
          insightful: 0
        };
        const userReactionSet = new Set<ReactionType>();
        let userSelectedReaction: ReactionType | null = null;
        let userSelectedEmoji: string | null = null;

        if (isAuthenticated && user) {
          // Get user ID from Azure AD authentication
          const userId = user?.id;
          
          // Try to restore emoji from localStorage
          const storageKey = `reaction_emoji_${postId}_${userId}`;
          const storedEmoji = localStorage.getItem(storageKey);
          
          data.forEach((reaction: any) => {
            const dbType = reaction.reaction_type as 'like' | 'helpful' | 'insightful';
            const storedEmoji = reaction.emoji; // Get emoji from database
            
            // Infer reaction type from emoji if available, otherwise use DB type
            let reactionType: ReactionType = 'like';
            if (storedEmoji && EMOJI_TO_TYPE[storedEmoji]) {
              reactionType = EMOJI_TO_TYPE[storedEmoji];
            } else {
              // Map DB type to reaction type
              if (dbType === 'like') reactionType = 'like';
              else if (dbType === 'helpful') reactionType = 'celebrate'; // Default helpful to celebrate
              else if (dbType === 'insightful') reactionType = 'wow'; // Default insightful to wow
            }
            
            // Count reactions by inferred type
            counts[reactionType] = (counts[reactionType] || 0) + 1;
            
            if (userId && reaction.user_id === userId) {
              // Restore user's reaction type and emoji from database
              userReactionSet.add(reactionType);
              userSelectedReaction = reactionType;
              userSelectedEmoji = storedEmoji || getReactionEmoji(reactionType);
              
              // Also store in localStorage for backward compatibility
              if (postId && userId && storedEmoji) {
                const storageKey = `reaction_emoji_${postId}_${userId}`;
                localStorage.setItem(storageKey, storedEmoji);
              }
            }
          });
        } else {
          // Just count reactions, don't track user reactions
          data.forEach((reaction: any) => {
            const dbType = reaction.reaction_type as 'like' | 'helpful' | 'insightful';
            if (dbType === 'like') {
              counts.like++;
            } else if (dbType === 'helpful') {
              counts.helpful++;
            } else if (dbType === 'insightful') {
              counts.insightful++;
            }
          });
        }

        setReactions(counts);
        setUserReactions(userReactionSet);
        setSelectedReaction(userSelectedReaction);
        setSelectedEmoji(userSelectedEmoji);
      }
    } catch (err) {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  };

  // Handle emoji selection from full picker
  const handleEmojiSelect = (emoji: string) => {
    // Determine reaction type from emoji
    const reactionType = getReactionTypeFromEmoji(emoji);
    if (!reactionType) {
      console.warn('REACTION SELECTED: Unknown emoji, cannot determine type', emoji);
      setShowEmojiPicker(false);
      setShowReactions(false);
      toast.error('This emoji is not supported as a reaction');
      return;
    }
    
    console.log('REACTION SELECTED:', reactionType, 'emoji:', emoji);
    const previousReaction = selectedReaction;
    const previousEmoji = selectedEmoji;
    
    // Optimistic UI update
    setSelectedEmoji(emoji);
    setSelectedReaction(reactionType);
    setShowEmojiPicker(false);
    setShowReactions(false);
    
    // Update counts optimistically
    setReactions(prev => {
      const updated = { ...prev };
      if (previousReaction) {
        updated[previousReaction] = Math.max(0, updated[previousReaction] - 1);
      }
      updated[reactionType] = (updated[reactionType] || 0) + 1;
      return updated;
    });
    setUserReactions(prev => {
      const newSet = new Set(prev);
      if (previousReaction) newSet.delete(previousReaction);
      newSet.add(reactionType);
      return newSet;
    });
    
    // Store emoji in localStorage for persistence
    if (postId && user?.id) {
      const storageKey = `reaction_emoji_${postId}_${user.id}`;
      localStorage.setItem(storageKey, emoji);
    }
    
    // Submit to backend async
    handleReactionSubmit(reactionType, emoji, previousReaction, previousEmoji);
  };

  // Submit reaction to backend (separate from UI update)
  const handleReactionSubmit = async (
    type: ReactionType, 
    customEmoji?: string, 
    previousReaction?: ReactionType | null,
    previousEmoji?: string | null
  ) => {
    if (!postId || !user?.id) return;
    
    try {
      // Remove old reaction if exists
      if (previousReaction) {
        const oldDbType = REACTION_TO_DB_TYPE[previousReaction];
        await supabase
          .from('community_post_reactions_new')
          .delete()
          .eq('user_id' as any, user.id)
          .eq('post_id' as any, postId)
          .eq('reaction_type' as any, oldDbType);
      }

      const dbReactionType = REACTION_TO_DB_TYPE[type];
      const emojiToStore = customEmoji || getReactionEmoji(type);
      
      const reactionData = {
        post_id: postId,
        user_id: user.id,
        reaction_type: dbReactionType,
        emoji: emojiToStore
      };

      // Use upsert to handle unique constraint (one reaction per user per post)
      await supabase
        .from('community_post_reactions_new')
        .upsert(reactionData as any, {
          onConflict: 'user_id,post_id'
        });
      
      // Store emoji in localStorage for persistence
      if (customEmoji && postId && user.id) {
        const storageKey = `reaction_emoji_${postId}_${user.id}`;
        localStorage.setItem(storageKey, customEmoji);
      }
      
      onReactionChange?.();
    } catch (err: any) {
      console.error('Error submitting reaction:', err);
      // Rollback on error
      setSelectedEmoji(previousEmoji || null);
      setSelectedReaction(previousReaction || null);
      setReactions(prev => {
        const updated = { ...prev };
        // Determine which type was being added (from customEmoji or type)
        const attemptedType = customEmoji ? (getReactionTypeFromEmoji(customEmoji) || type) : type;
        updated[attemptedType] = Math.max(0, (updated[attemptedType] || 0) - 1);
        if (previousReaction) {
          updated[previousReaction] = (updated[previousReaction] || 0) + 1;
        }
        return updated;
      });
      setUserReactions(prev => {
        const newSet = new Set(prev);
        const attemptedType = customEmoji ? (getReactionTypeFromEmoji(customEmoji) || type) : type;
        newSet.delete(attemptedType);
        if (previousReaction) newSet.add(previousReaction);
        return newSet;
      });
      toast.error('Failed to add reaction');
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !likeWrapperRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showEmojiPicker]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleReaction = async (type: ReactionType) => {
    console.log('REACTION SELECTED:', type);
    console.log('🔵 CommunityReactions handleReaction called:', { type, postId, commentId });
    
    // New table only supports posts
    if (!postId) {
      console.warn('CommunityReactions: postId required for new reactions table');
      return;
    }

    // User should be authenticated via Azure AD at app level
    if (!user) {
      toast.error('Please wait for authentication to complete');
      return;
    }

    // Get user ID from Azure AD authentication
    if (!user.id) {
      console.error('❌ User ID not available');
      toast.error('Unable to verify authentication. Please refresh the page.');
      return;
    }
    
    const userId = user.id;
    const previousReaction = selectedReaction;
    const previousEmoji = selectedEmoji;
    const dbReactionType = REACTION_TO_DB_TYPE[type];
    const isRemoving = selectedReaction === type;

    // OPTIMISTIC UI UPDATE - Update immediately
    if (isRemoving) {
      // Remove reaction optimistically
      setSelectedReaction(null);
      setSelectedEmoji(null); // Clear custom emoji if removing
      setUserReactions(prev => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
      setReactions(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1)
      }));
      setShowReactions(false);
    } else {
      // Add reaction optimistically - IMPORTANT: Set both type AND emoji
      const oldReaction = selectedReaction;
      const emojiForType = getReactionEmoji(type);
      setSelectedReaction(type);
      setSelectedEmoji(emojiForType); // Set emoji from type
      setUserReactions(prev => new Set(prev).add(type));
      
      // Store emoji in localStorage
      if (postId && userId && emojiForType) {
        const storageKey = `reaction_emoji_${postId}_${userId}`;
        localStorage.setItem(storageKey, emojiForType);
      }
      
      // Update counts optimistically
      setReactions(prev => {
        const updated = { ...prev };
        if (oldReaction) {
          updated[oldReaction] = Math.max(0, updated[oldReaction] - 1);
        }
        updated[type] = (updated[type] || 0) + 1;
        return updated;
      });
      setShowReactions(false);
    }

    // Send to backend async (don't block UI)
    try {
    // Verify post exists in posts_v2 (required by foreign key)
    const { data: postCheck } = await supabase
      .from('posts_v2')
      .select('id')
      .eq('id' as any, postId)
      .single();
    
    if (!postCheck) {
        throw new Error('Post not found');
      }

      if (isRemoving) {
        // Remove reaction from database
        const query = supabase
          .from('community_post_reactions_new')
          .delete()
          .eq('user_id' as any, userId)
          .eq('post_id' as any, postId)
          .eq('reaction_type' as any, dbReactionType);

        const [data, error] = await safeFetch(query);

        if (error) {
          console.error('❌ Error removing reaction:', error);
          // Rollback optimistic update
          setSelectedReaction(previousReaction);
          setSelectedEmoji(previousEmoji);
          setUserReactions(prev => {
            const newSet = new Set(prev);
            if (previousReaction) {
              newSet.add(previousReaction);
              // Restore emoji for previous reaction
              const previousEmojiForType = getReactionEmoji(previousReaction);
              if (previousEmojiForType && postId && userId) {
                const storageKey = `reaction_emoji_${postId}_${userId}`;
                localStorage.setItem(storageKey, previousEmojiForType);
              }
            }
            return newSet;
          });
          setReactions(prev => ({
            ...prev,
            [type]: (prev[type] || 0) + 1
          }));
          toast.error('Failed to remove reaction: ' + (error.message || 'Unknown error'));
          return;
        }
        
        // Clear emoji from localStorage on removal
        const storageKey = `reaction_emoji_${postId}_${userId}`;
        localStorage.removeItem(storageKey);
      } else {
        // Remove old reaction if exists
        if (previousReaction) {
          const oldDbType = REACTION_TO_DB_TYPE[previousReaction];
          await supabase
            .from('community_post_reactions_new')
            .delete()
            .eq('user_id' as any, userId)
            .eq('post_id' as any, postId)
            .eq('reaction_type' as any, oldDbType);
        }

        // Add new reaction
        const reactionData = {
          post_id: postId,
          user_id: userId,
          reaction_type: dbReactionType
        };

        const query = supabase
          .from('community_post_reactions_new')
          .insert(reactionData as any);

        const [data, error] = await safeFetch(query);

        if (error) {
          console.error('❌ Error adding reaction:', error);
          // Rollback optimistic update
          setSelectedReaction(previousReaction);
          setSelectedEmoji(previousEmoji); // Restore previous emoji
          setUserReactions(prev => {
            const newSet = new Set(prev);
            newSet.delete(type);
            if (previousReaction) {
              newSet.add(previousReaction);
              // Restore emoji for previous reaction
              const previousEmojiForType = previousEmoji || getReactionEmoji(previousReaction);
              if (previousEmojiForType && postId && userId) {
                const storageKey = `reaction_emoji_${postId}_${userId}`;
                localStorage.setItem(storageKey, previousEmojiForType);
              }
            }
            return newSet;
          });
          setReactions(prev => {
            const updated = { ...prev };
            updated[type] = Math.max(0, (updated[type] || 0) - 1);
            if (previousReaction) {
              updated[previousReaction] = (updated[previousReaction] || 0) + 1;
            }
            return updated;
          });
          
          if (error.code === '23505') {
            // User already reacted, refresh to get correct state
            fetchReactions();
            return;
          }
          toast.error('Failed to add reaction: ' + (error.message || 'Unknown error'));
          return;
        }
        
        // Store emoji in localStorage after successful add
        const emojiForType = getReactionEmoji(type);
        if (emojiForType && postId && userId) {
          const storageKey = `reaction_emoji_${postId}_${userId}`;
          localStorage.setItem(storageKey, emojiForType);
        }
      }

      onReactionChange?.();
    } catch (err: any) {
      console.error('Error in handleReaction:', err);
      // Rollback on error
      setSelectedReaction(previousReaction);
      setSelectedEmoji(previousEmoji); // Restore previous emoji
      // Restore emoji in localStorage if previous reaction existed
      if (previousReaction && postId && userId) {
        const previousEmojiForType = previousEmoji || getReactionEmoji(previousReaction);
        if (previousEmojiForType) {
          const storageKey = `reaction_emoji_${postId}_${userId}`;
          localStorage.setItem(storageKey, previousEmojiForType);
        }
      }
      fetchReactions(); // Refresh to get correct state
      toast.error('Failed to update reaction: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  // Get total reaction count (sum of all Viva reactions)
  const getTotalReactionCount = () => {
    return Object.values(reactions).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Viva Engage-style Like Button with Hover Popup */}
      <div
        ref={likeWrapperRef}
        className="relative"
        onMouseEnter={() => {
          // Add 300ms delay before showing reactions (Viva Engage style)
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
          }
          hoverTimeoutRef.current = setTimeout(() => {
            setShowReactions(true);
          }, 300);
        }}
        onMouseLeave={() => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
          }
          setShowReactions(false);
        }}
      >
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
            // If already reacted, remove reaction; otherwise do nothing (hover to select)
            if (selectedReaction) {
              console.log('REACTION SELECTED: Removing', selectedReaction);
              handleReaction(selectedReaction);
            } else if (selectedEmoji) {
              // If we have an emoji but no reaction type, infer it
              const inferredType = getReactionTypeFromEmoji(selectedEmoji);
              if (inferredType) {
                console.log('REACTION SELECTED: Removing (inferred)', inferredType);
                handleReaction(inferredType);
              }
            }
        }}
        disabled={!isAuthenticated}
        className={`h-8 px-3 text-xs transition-all ${
            selectedReaction || selectedEmoji
            ? 'bg-[#FB5535]/10 text-[#FB5535] hover:bg-[#FB5535]/20'
            : 'text-[#030F35]/60 hover:text-[#030F35] hover:bg-[#030F35]/10'
        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
          <span className="mr-1.5 text-base">
            {selectedEmoji 
              ? selectedEmoji 
              : selectedReaction 
                ? getReactionEmoji(selectedReaction)
                : QUICK_REACTIONS[0].emoji}
          </span>
          <span>
            {selectedEmoji 
              ? (() => {
                  const type = getReactionTypeFromEmoji(selectedEmoji);
                  return type ? getReactionLabel(type) : 'Reacted';
                })()
              : selectedReaction 
                ? getReactionLabel(selectedReaction)
                : QUICK_REACTIONS[0].label}
          </span>
      </Button>

        {/* Floating Reaction Popup */}
        {showReactions && isAuthenticated && !showEmojiPicker && (
          <div
            ref={popupRef}
            className="absolute bottom-[36px] left-0 z-50 flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-lg border border-gray-100"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
            style={{
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
            }}
          >
            {QUICK_REACTIONS.map((reaction) => (
              <button
                key={reaction.type}
                type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
                  handleReaction(reaction.type);
        }}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:scale-110 transition-transform duration-150 hover:bg-gray-100 text-lg"
                title={reaction.label}
      >
                {reaction.emoji}
              </button>
            ))}
            {/* More reactions button */}
            <button
              type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
                setShowEmojiPicker(true);
                setShowReactions(false);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:scale-110 transition-transform duration-150 hover:bg-gray-100 text-lg font-semibold"
              title="More reactions"
            >
              ➕
            </button>
          </div>
        )}

        {/* Full Emoji Picker */}
        {showEmojiPicker && isAuthenticated && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-[48px] left-0 z-[1000] bg-white rounded-2xl shadow-xl border border-gray-200 p-2"
            style={{
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)'
            }}
          >
            <EmojiPicker
              theme="light"
              emojiStyle="apple"
              searchDisabled={false}
              skinTonesDisabled={true}
              width={350}
              height={400}
              previewConfig={{ showPreview: false }}
              onEmojiClick={(emojiData: EmojiClickData) => {
                handleEmojiSelect(emojiData.emoji);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};


