import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';

interface PostData {
  id: string;
  title: string | null;
  content: string | null;
  view_count: number;
  created_at: string;
  community_id: string;
  user_id: string;
  comment_count: number;
  reaction_count: number;
  author_username?: string | null;
  community_name?: string | null;
}

/**
 * Hook to fetch post data with view_count and aggregated analytics
 * FIXES: viewCount is not defined error by ensuring view_count is always in the query
 */
export function usePostData(postId: string | undefined) {
  const [data, setData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      // CRITICAL FIX: Always select view_count from posts_v2
      // Use the posts_with_analytics view which includes all aggregated data
      const query = supabase
        .from('posts_with_analytics')
        .select(`
          id,
          title,
          content,
          view_count,
          created_at,
          community_id,
          author_id,
          comment_count,
          total_reactions as reaction_count
        `)
        .eq('id' as any, postId as any)
        .maybeSingle();

      const [postData, queryError] = await safeFetch(query);

      if (queryError) {
        console.error('Error fetching post data:', queryError);
        setError(new Error('Failed to load post data'));
        setData(null);
        return;
      }

      if (!postData) {
        setData(null);
        return;
      }

      // Fetch author and community names separately
        const [authorData] = await safeFetch(
          supabase
            .from('users_local')
            .select('username')
            .eq('id' as any, postData.author_id as any)
            .maybeSingle()
        );

        const [communityData] = await safeFetch(
          supabase
            .from('communities')
            .select('name')
            .eq('id' as any, postData.community_id as any)
            .maybeSingle()
        );

      setData({
        id: postData.id,
        title: postData.title ?? null,
        content: postData.content ?? null,
        view_count: postData.view_count ?? 0, // SAFE DEFAULT
        created_at: postData.created_at,
        community_id: postData.community_id,
        user_id: postData.author_id,
        comment_count: postData.comment_count ?? 0, // SAFE DEFAULT
        reaction_count: postData.reaction_count ?? 0, // SAFE DEFAULT
        author_username: authorData?.username ?? null,
        community_name: communityData?.name ?? null
      });
    } catch (err) {
      console.error('Error in fetchPostData:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchPostData
  };
}

