import { useState, useEffect } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { getAnonymousUserId } from '@/communities/utils/anonymousUser';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';

/**
 * Hook to check if the current user (authenticated or anonymous) is a member of a community
 */
export function useCommunityMembership(communityId: string | undefined) {
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    checkMembership();
  }, [communityId, user]);

  const checkMembership = async () => {
    if (!communityId) {
      setLoading(false);
      return;
    }

    // Get user ID (authenticated user or anonymous user)
    const userId = user?.id || getAnonymousUserId();

    // Check community_members table first, fallback to memberships for compatibility
    const query = supabase
      .from('community_members')
      .select('id')
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .maybeSingle();

    const [data] = await safeFetch(query);

    // If not found in community_members, check memberships table
    if (!data) {
      const query2 = supabase
        .from('memberships')
        .select('id')
        .eq('user_id', userId)
        .eq('community_id', communityId)
        .maybeSingle();
      
      const [data2] = await safeFetch(query2);
      setIsMember(!!data2);
    } else {
      setIsMember(!!data);
    }

    setLoading(false);
  };

  return { isMember, loading, refetch: checkMembership };
}

