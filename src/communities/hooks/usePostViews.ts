import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { safeFetch } from '@/communities/utils/safeFetch';

interface PostViewData {
  viewCount: number;
  viewedByCurrentUser: boolean;
  recentViewers: Array<{
    id: string;
    username: string;
    avatar_url?: string;
  }>;
}

export function usePostViews(postId: string | undefined) {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<PostViewData>({
    viewCount: 0,
    viewedByCurrentUser: false,
    recentViewers: []
  });
  const [loading, setLoading] = useState(true);

  // Track view when post is viewed
  const trackView = async () => {
    if (!postId || !isAuthenticated || !user) return;

    try {
      // Use the database function to track view
      const { error } = await supabase.rpc('track_post_view', {
        post_uuid: postId
      });

      if (error) {
        console.error('Error tracking post view:', error);
      } else {
        // Refresh view data after tracking
        fetchViews();
      }
    } catch (error) {
      console.error('Error tracking post view:', error);
    }
  };

  // Fetch view data
  const fetchViews = async () => {
    if (!postId) {
      setLoading(false);
      return;
    }

    try {
      // Get total view count
      const [viewsData] = await safeFetch(
        supabase
          .from('post_views')
          .select('user_id')
          .eq('post_id', postId)
      );

      const views = viewsData || [];
      const viewCount = views.length;
      const userId = user?.id;
      const viewedByCurrentUser = userId ? views.some((v: any) => v.user_id === userId) : false;

      // Get recent viewers (last 5) with user details
      const recentViewerIds = [...new Set(views.map((v: any) => v.user_id))].slice(0, 5);
      
      let recentViewers: Array<{ id: string; username: string; avatar_url?: string }> = [];
      
      if (recentViewerIds.length > 0) {
        const [usersData] = await safeFetch(
          supabase
            .from('users_local')
            .select('id, username, avatar_url')
            .in('id', recentViewerIds)
        );

        recentViewers = (usersData || []).map((u: any) => ({
          id: u.id,
          username: u.username || 'Unknown',
          avatar_url: u.avatar_url
        }));
      }

      setData({
        viewCount,
        viewedByCurrentUser,
        recentViewers
      });
    } catch (error) {
      console.error('Error fetching post views:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViews();
  }, [postId, user?.id]);

  // Debounced view tracking - only track once per post per session
  useEffect(() => {
    if (!isAuthenticated || !postId || !user) return;

    // Check if we've already tracked this view in this session
    const sessionKey = `viewed_${postId}_${user.id}`;
    if (sessionStorage.getItem(sessionKey)) {
      return; // Already tracked in this session
    }

    // Debounce: wait 1.5 seconds before tracking (ensures user actually viewed the post)
    const timer = setTimeout(() => {
      trackView();
      // Mark as tracked in session storage
      sessionStorage.setItem(sessionKey, 'true');
    }, 1500);

    return () => clearTimeout(timer);
  }, [postId, isAuthenticated, user?.id]);

  return {
    ...data,
    loading,
    trackView,
    refetch: fetchViews
  };
}

