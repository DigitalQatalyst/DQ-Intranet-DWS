import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { safeFetch } from '@/communities/utils/safeFetch';
import { REACTION_TO_DB_TYPE, getReactionTypeFromEmoji } from '@/communities/types/reactions';
import type { ReactionType } from '@/communities/types/reactions';
import { toast } from 'sonner';

interface ReactionData {
  id: string;
  user_id: string;
  emoji: string | null;
  reaction_type: 'like' | 'helpful' | 'insightful';
}

interface UserReaction {
  emoji: string;
  type: ReactionType;
}

/**
 * Hook to manage post reactions with proper emoji storage
 * FIXES: Emoji always falling back to 👍 by storing emoji in database
 */
export function usePostReactions(postId: string | undefined) {
  const { user, isAuthenticated } = useAuth();
  const [reactions, setReactions] = useState<ReactionData[]>([]);
  const [userReaction, setUserReaction] = useState<UserReaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchReactions();
    }
  }, [postId, user?.id]);

  const fetchReactions = async () => {
    if (!postId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const query = supabase
        .from('community_post_reactions_new')
        .select('id, user_id, emoji, reaction_type')
        .eq('post_id' as any, postId as any);

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching reactions:', error);
        setReactions([]);
        setUserReaction(null);
        return;
      }

      const reactionsList = (data || []) as ReactionData[];
      setReactions(reactionsList);

      // Find current user's reaction
      if (user?.id) {
        const userReact = reactionsList.find(r => r.user_id === user.id);
        if (userReact) {
          // CRITICAL FIX: Use emoji from database, not localStorage
          const emoji = userReact.emoji || '👍'; // Fallback only if null
          const type = getReactionTypeFromEmoji(emoji) || 'like';
          setUserReaction({ emoji, type });
        } else {
          setUserReaction(null);
        }
      }
    } catch (err) {
      console.error('Error in fetchReactions:', err);
      setReactions([]);
      setUserReaction(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add or update reaction
   * FIXES: Always stores emoji in database, not just reaction_type
   */
  const addReaction = async (emoji: string) => {
    if (!postId || !user?.id || !isAuthenticated) {
      toast.error('Please sign in to react');
      return;
    }

    // Infer reaction type from emoji
    const reactionType = getReactionTypeFromEmoji(emoji) || 'like';
    const dbReactionType = REACTION_TO_DB_TYPE[reactionType];

    // Optimistic update
    const previousReaction = userReaction;
    setUserReaction({ emoji, type: reactionType });

    try {
      // CRITICAL FIX: Use upsert to update existing reaction with new emoji
      const { error } = await supabase
        .from('community_post_reactions_new')
        .upsert({
          post_id: postId as string,
          user_id: user.id as string,
          reaction_type: dbReactionType,
          emoji: emoji // STORE EMOJI IN DATABASE
        } as any, {
          onConflict: 'user_id,post_id'
        });

      if (error) {
        console.error('Error adding reaction:', error);
        // Rollback optimistic update
        setUserReaction(previousReaction);
        toast.error('Failed to add reaction');
        return;
      }

      // Refresh reactions list
      await fetchReactions();
      toast.success('Reaction added');
    } catch (err) {
      console.error('Error in addReaction:', err);
      setUserReaction(previousReaction);
      toast.error('Failed to add reaction');
    }
  };

  /**
   * Remove reaction
   */
  const removeReaction = async () => {
    if (!postId || !user?.id) return;

    const previousReaction = userReaction;
    setUserReaction(null);

    try {
      const { error } = await supabase
        .from('community_post_reactions_new')
        .delete()
        .eq('post_id' as any, postId as any)
        .eq('user_id' as any, user.id as any);

      if (error) {
        console.error('Error removing reaction:', error);
        setUserReaction(previousReaction);
        toast.error('Failed to remove reaction');
        return;
      }

      await fetchReactions();
    } catch (err) {
      console.error('Error in removeReaction:', err);
      setUserReaction(previousReaction);
    }
  };

  /**
   * Get aggregated reactions for display
   * Returns: { emoji: count } map
   */
  const getAggregatedReactions = () => {
    const aggregated: Record<string, number> = {};
    
    reactions.forEach(reaction => {
      // CRITICAL FIX: Use emoji from database, not inferred
      const emoji = reaction.emoji || '👍';
      aggregated[emoji] = (aggregated[emoji] || 0) + 1;
    });

    return aggregated;
  };

  return {
    reactions,
    userReaction,
    loading,
    addReaction,
    removeReaction,
    getAggregatedReactions,
    refetch: fetchReactions
  };
}

