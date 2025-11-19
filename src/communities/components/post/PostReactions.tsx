import React, { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from '@/communities/contexts/AuthProvider';
import { getAnonymousUserId } from '@/communities/utils/anonymousUser';
import { safeFetch } from '@/communities/utils/safeFetch';
import { ThumbsUp, Lightbulb, Share2 } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
import { toast } from 'sonner';
interface PostReactionsProps {
  postId: string;
  communityId?: string;
  isMember?: boolean;
  helpfulCount: number;
  insightfulCount: number;
}
export function PostReactions({
  postId,
  communityId,
  isMember = false,
  helpfulCount: initialHelpfulCount,
  insightfulCount: initialInsightfulCount
}: PostReactionsProps) {
  const {
    user
  } = useAuth();
  const [hasReactedHelpful, setHasReactedHelpful] = useState(false);
  const [hasReactedInsightful, setHasReactedInsightful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount);
  const [insightfulCount, setInsightfulCount] = useState(initialInsightfulCount);
  const [isReacting, setIsReacting] = useState(false);
  
  useEffect(() => {
    checkUserReactions();
    fetchReactionCounts();
  }, [postId]);
  
  useEffect(() => {
    // Update counts when props change
    setHelpfulCount(initialHelpfulCount);
    setInsightfulCount(initialInsightfulCount);
  }, [initialHelpfulCount, initialInsightfulCount]);
  
  const fetchReactionCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_reactions')
        .select('reaction_type')
        .eq('post_id', postId);
      
      if (error) {
        console.error('Error fetching reaction counts:', error);
        return;
      }
      
      if (data) {
        const helpful = data.filter(r => r.reaction_type === 'helpful').length;
        const insightful = data.filter(r => r.reaction_type === 'insightful').length;
        setHelpfulCount(helpful);
        setInsightfulCount(insightful);
      }
    } catch (err) {
      console.error('Error in fetchReactionCounts:', err);
    }
  };
  
  const checkUserReactions = async () => {
    const userId = user?.id || getAnonymousUserId();
    const query = supabase
      .from('community_reactions')
      .select('reaction_type')
      .eq('post_id', postId)
      .eq('user_id', userId);
    const [data, error] = await safeFetch(query);
    if (error) {
      console.error('Error checking reactions:', error);
      return;
    }
    if (data) {
      setHasReactedHelpful(data.some(r => r.reaction_type === 'helpful'));
      setHasReactedInsightful(data.some(r => r.reaction_type === 'insightful'));
    }
  };
  const handleReaction = async (type: 'helpful' | 'insightful') => {
    if (isReacting) return; // Prevent double-clicks
    
    setIsReacting(true);
    
    try {
      // Check membership if communityId is provided
      if (communityId) {
        const userId = user?.id || getAnonymousUserId();
        const membershipQuery = supabase
          .from('community_members')
          .select('id')
          .eq('user_id', userId)
          .eq('community_id', communityId)
          .maybeSingle();
        const [membershipData, membershipError] = await safeFetch(membershipQuery);
        
        if (membershipError) {
          console.error('Error checking membership:', membershipError);
        }
        
        let isCommunityMember = !!membershipData;
        if (!isCommunityMember) {
          const membershipQuery2 = supabase
            .from('memberships')
            .select('id')
            .eq('user_id', userId)
            .eq('community_id', communityId)
            .maybeSingle();
          const [membershipData2, membershipError2] = await safeFetch(membershipQuery2);
          if (membershipError2) {
            console.error('Error checking membership (fallback):', membershipError2);
          }
          isCommunityMember = !!membershipData2;
        }
        
        if (!isCommunityMember) {
          toast.error('You must be a member of this community to react');
          setIsReacting(false);
          return;
        }
      }
      
      const userId = user?.id || getAnonymousUserId();
      if (!userId) {
        toast.error('Please sign in to react');
        setIsReacting(false);
        return;
      }
      
      const hasReacted = type === 'helpful' ? hasReactedHelpful : hasReactedInsightful;
      
      if (hasReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('community_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
          .eq('reaction_type', type);
        
        if (error) {
          console.error('Error removing reaction:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          toast.error('Failed to remove reaction: ' + (error.message || 'Unknown error'));
          setIsReacting(false);
          return;
        }
        
        // Update local state optimistically
        if (type === 'helpful') {
          setHelpfulCount(prev => Math.max(0, prev - 1));
          setHasReactedHelpful(false);
        } else {
          setInsightfulCount(prev => Math.max(0, prev - 1));
          setHasReactedInsightful(false);
        }
        
        // Refresh counts from database to ensure accuracy
        await fetchReactionCounts();
      } else {
        // Add reaction
        const { error } = await supabase
          .from('community_reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: type
          });
        
        if (error) {
          console.error('Error adding reaction:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          toast.error('Failed to add reaction: ' + (error.message || 'Unknown error'));
          setIsReacting(false);
          return;
        }
        
        // Update local state optimistically
        if (type === 'helpful') {
          setHelpfulCount(prev => prev + 1);
          setHasReactedHelpful(true);
        } else {
          setInsightfulCount(prev => prev + 1);
          setHasReactedInsightful(true);
        }
        
        // Refresh counts from database to ensure accuracy
        await fetchReactionCounts();
      }
    } catch (err) {
      console.error('Unexpected error in handleReaction:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsReacting(false);
    }
  };
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Post link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  return <div className="flex flex-wrap items-center gap-3">
      <Button 
        variant="outline" 
        size="sm" 
        disabled={isReacting}
        className={`h-9 px-4 gap-2 rounded-full transition-all ${hasReactedHelpful ? 'bg-dq-navy text-white border-dq-navy hover:bg-[#13285A] hover:border-[#13285A]' : 'hover:bg-dq-navy/10 hover:text-dq-navy hover:border-dq-navy/30'} ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`} 
        onClick={() => handleReaction('helpful')}
      >
        <ThumbsUp className={`h-4 w-4 ${hasReactedHelpful ? 'fill-white' : ''}`} />
        <span className="font-medium">{helpfulCount}</span>
        <span>Helpful</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        disabled={isReacting}
        className={`h-9 px-4 gap-2 rounded-full transition-all ${hasReactedInsightful ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600' : 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'} ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`} 
        onClick={() => handleReaction('insightful')}
      >
        <Lightbulb className={`h-4 w-4 ${hasReactedInsightful ? 'fill-white' : ''}`} />
        <span className="font-medium">{insightfulCount}</span>
        <span>Insightful</span>
      </Button>
      <Button variant="outline" size="sm" className="h-9 px-4 gap-2 rounded-full ml-auto hover:bg-gray-50" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
    </div>;
}