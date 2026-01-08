import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { REACTION_CONFIG, REACTION_TO_DB_TYPE, getReactionEmoji, getReactionTypeFromEmoji } from '@/communities/types/reactions';
import type { ReactionType } from '@/communities/types/reactions';

interface ReactionSummaryData {
  emoji: string;
  userName?: string;
  count: number;
}

export const useReactionSummary = (postId?: string) => {
  const [summary, setSummary] = useState<ReactionSummaryData | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    fetchSummary();
  }, [postId]);

  const fetchSummary = async () => {
    if (!postId) return;

    setLoading(true);
    try {
      // Fetch all reactions for this post (including emoji column)
      const query = supabase
        .from('community_post_reactions_new')
        .select('reaction_type, user_id, emoji')
        .eq('post_id' as any, postId);

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching reaction summary:', error);
        setLoading(false);
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        // Group reactions by actual emoji (from localStorage or inferred from type)
        const emojiGroups: Map<string, { count: number; userIds: Set<string> }> = new Map();
        const userIds = new Set<string>();

        // Process each reaction
        for (const reaction of data) {
          const userId = reaction.user_id;
          const dbType = reaction.reaction_type as 'like' | 'helpful' | 'insightful';
          userIds.add(userId);

          // Get emoji from database first (most reliable)
          let emoji: string | null = reaction.emoji ?? null;

          // If no emoji in database, try localStorage (backward compatibility)
          if (!emoji) {
            try {
              const storageKey = `reaction_emoji_${postId}_${userId}`;
              emoji = localStorage.getItem(storageKey);
            } catch (e) {
              // localStorage might not be available
            }
          }

          // If still no emoji, infer from database type (fallback)
          if (!emoji) {
            // Find which ReactionType maps to this dbType
            const possibleTypes: ReactionType[] = [];
            for (const [reactionType, mappedDbType] of Object.entries(REACTION_TO_DB_TYPE)) {
              if (mappedDbType === dbType) {
                possibleTypes.push(reactionType as ReactionType);
              }
            }
            // Use the first matching type's emoji (most common case)
            if (possibleTypes.length > 0) {
              emoji = getReactionEmoji(possibleTypes[0]);
            } else {
              // Fallback to default for dbType
              emoji = getReactionEmoji(dbType === 'helpful' ? 'helpful' : dbType === 'insightful' ? 'insightful' : 'like');
            }
          }

          // Group by emoji
          if (!emojiGroups.has(emoji)) {
            emojiGroups.set(emoji, { count: 0, userIds: new Set() });
          }
          const group = emojiGroups.get(emoji)!;
          group.count++;
          group.userIds.add(userId);
        }

        // Determine which emoji(s) to show (Viva Engage style: show top 3 emojis)
        const emojiEntries = Array.from(emojiGroups.entries())
          .sort((a, b) => b[1].count - a[1].count); // Sort by count descending

        if (emojiEntries.length === 0) {
          setSummary(undefined);
          return;
        }

        // Show top 3 emojis (Viva Engage style: "👍 ❤️ 😂 3")
        const topEmojis = emojiEntries.slice(0, 3).map(([emoji]) => emoji);
        const displayEmoji = topEmojis.join(' '); // Space-separated emojis
        const totalCount = data.length;

        // If only one reaction, try to get the user's name
        let userName: string | undefined;
        if (totalCount === 1 && userIds.size === 1) {
          const userId = Array.from(userIds)[0];
          const [userData] = await safeFetch(
            supabase
              .from('users_local')
              .select('username')
              .eq('id', userId)
              .maybeSingle()
          );
          userName = userData?.username ?? undefined;
        }

        setSummary({
          emoji: displayEmoji,
          userName,
          count: totalCount
        });
      } else {
        setSummary(undefined);
      }
    } catch (err) {
      console.error('Error fetching reaction summary:', err);
      setSummary(undefined);
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, refetch: fetchSummary };
};

