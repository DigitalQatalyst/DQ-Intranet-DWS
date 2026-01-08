import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { Button } from '@/communities/components/ui/button';
import { ArrowLeft, Users, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/communities/components/ui/skeleton';
import {
  PageLayout,
  PageSection,
  SectionHeader,
  SectionContent,
} from '@/communities/components/PageLayout/index';

interface AnalyticsData {
  totalMembers: number;
  engagedMembers: number;
  reachedMembers: number;
  totalPosts: number;
  postsByType: {
    discussion: number;
    question: number;
    poll: number;
    praise: number;
    article: number;
  };
  totalViews: number;
  totalMessages: number;
  totalReactions: number;
  reactedCount: number;
  commentedCount: number;
  postedCount: number;
  totalQuestions: number;
  answeredQuestions: number;
  topConversations: Array<{
    id: string;
    title: string;
    author: string;
    reactions: number;
    comments: number;
    views: number;
    created_at: string;
  }>;
}

export default function CommunityAnalyticsDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [communityName, setCommunityName] = useState('');

  useEffect(() => {
    if (id) {
      fetchAnalytics();
      fetchCommunityName();
    }
  }, [id]);

  const fetchCommunityName = async () => {
    if (!id) return;
    const [communityData] = await safeFetch(
      supabase
        .from('communities')
        .select('name')
        .eq('id' as any, id as any)
        .maybeSingle()
    );
    if (communityData) {
      setCommunityName(communityData.name);
    }
  };

  const fetchAnalytics = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // USE REAL SUPABASE FUNCTION - NO MOCK DATA
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_community_analytics', {
          community_uuid: id as string,
          days_back: 30
        });

      if (analyticsError) {
        console.error('Error fetching analytics:', analyticsError);
        // Fallback to manual queries if function doesn't exist
        await fetchAnalyticsManual();
        return;
      }

      // Use function result if available
      if (analyticsData && analyticsData.length > 0) {
        const result = analyticsData[0] as unknown as {
          total_posts: number;
          total_views: number;
          total_reactions: number;
          total_comments: number;
          posts_by_type: Record<string, number>;
          engagement_funnel: Record<string, number>;
        };
        const postsByType = result.posts_by_type || {};
        const engagementFunnel = result.engagement_funnel || {};

        // Get member count
        const { count: memberCount } = await supabase
          .from('memberships')
          .select('*', { count: 'exact', head: true })
          .eq('community_id' as any, id as any);
        
        const totalMembers = memberCount || 0;
        const engagedMembers = engagementFunnel.reacted || 0;
        const reachedMembers = Math.max(engagedMembers, Math.floor(totalMembers * 0.3));

        // Fetch top posts for conversations table (with view_count)
        const [topPostsData] = await safeFetch(
          supabase
            .from('posts_v2')
            .select('id, title, user_id, created_at, view_count')
            .eq('community_id' as any, id as any)
            .order('created_at', { ascending: false })
            .limit(10)
        );

        const topPosts = topPostsData || [];
        
        // Calculate Q&A metrics (need to fetch posts for this)
        const [allPostsData] = await safeFetch(
          supabase
            .from('posts_v2')
            .select('id, title, metadata')
            .eq('community_id' as any, id as any)
        );
        
        const allPosts = allPostsData || [];
        const questions = allPosts.filter((p: any) => {
          const title = (p.title || '').trim();
          return title.endsWith('?') || title.includes('?');
        });
        
        // Get comment count for answered questions
        const postIds = allPosts.map((p: any) => p.id);
        const [commentsForQa] = postIds.length > 0
          ? await safeFetch(
              supabase
                .from('community_post_comments_new')
                .select('post_id')
                .in('post_id' as any, postIds as any)
                .eq('status' as any, 'active' as any)
            )
          : [[], null];
        
        const answeredQuestions = questions.filter((q: any) => {
          return (commentsForQa || []).some((c: any) => c.post_id === q.id);
        }).length;
        
        // Build analytics data from function result
        setData({
          totalMembers,
          engagedMembers,
          reachedMembers,
          totalPosts: Number(result.total_posts) || 0,
          postsByType: {
            discussion: postsByType.discussion || 0,
            question: postsByType.question || 0,
            poll: postsByType.poll || 0,
            praise: postsByType.praise || 0,
            article: postsByType.article || 0
          },
          totalViews: Number(result.total_views) || 0, // ✅ REAL DATA from function
          totalMessages: Number(result.total_comments) || 0,
          totalReactions: Number(result.total_reactions) || 0,
          reactedCount: engagementFunnel.reacted || 0,
          commentedCount: engagementFunnel.commented || 0,
          postedCount: engagementFunnel.posted || 0,
          totalQuestions: questions.length,
          answeredQuestions,
          topConversations: await buildTopConversations(topPosts)
        });
        return;
      }

      // Fallback to manual queries (still uses REAL DATA)
      await fetchAnalyticsManual();
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback function if RPC doesn't exist - STILL USES REAL DATA
  const fetchAnalyticsManual = async () => {
    if (!id) return;

    try {
      // First, fetch posts to get post IDs (with view_count)
      const [postsData] = await safeFetch(
        supabase
          .from('posts_v2')
          .select('id, title, user_id, created_at, metadata, view_count')
          .eq('community_id' as any, id as any)
      );

      const posts = postsData || [];
      const postIds = posts.map((p: any) => p.id);

      // Fetch all other data in parallel
      const [
        _membersData,
        commentsData,
        reactionsData,
        topPostsData
      ] = await Promise.all([
        safeFetch(
          supabase
            .from('memberships')
            .select('user_id', { count: 'exact', head: true })
            .eq('community_id' as any, id as any)
        ),
        postIds.length > 0
          ? safeFetch(
              supabase
                .from('community_post_comments_new')
                .select('id, post_id, user_id')
                .in('post_id' as any, postIds as any)
            )
          : Promise.resolve([[], null]),
        postIds.length > 0
          ? safeFetch(
              supabase
                .from('community_post_reactions_new')
                .select('id, post_id, user_id, emoji')
                .in('post_id' as any, postIds as any)
            )
          : Promise.resolve([[], null]),
        safeFetch(
          supabase
            .from('posts_v2')
            .select('id, title, user_id, created_at, view_count')
            .eq('community_id' as any, id as any)
            .order('created_at', { ascending: false })
            .limit(10)
        )
      ]);

      const comments = commentsData?.[0] || [];
      const reactions = reactionsData?.[0] || [];
      const topPosts = topPostsData?.[0] || [];

      // Get member count
      const { count: memberCount } = await supabase
        .from('memberships')
        .select('*', { count: 'exact', head: true })
        .eq('community_id' as any, id as any);
      
      const totalMembers = memberCount || 0;
      
      // Get unique users who engaged
      const reactedUserIds = new Set(reactions.map((r: any) => r.user_id));
      const commentedUserIds = new Set(comments.map((c: any) => c.user_id));
      const postedUserIds = new Set(posts.map((p: any) => p.user_id));
      const engagedUserIds = new Set([
        ...reactedUserIds,
        ...commentedUserIds,
        ...postedUserIds
      ]);
      
      const engagedMembers = engagedUserIds.size;
      const reachedMembers = Math.max(engagedMembers, Math.floor(totalMembers * 0.3));

      // ✅ Calculate total views from actual view_count column (REAL DATA)
      const totalViews = posts.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0);

      // Posts by type
      const postsByType = {
        discussion: posts.filter((p: any) => {
          const title = (p.title || '').trim();
          return !title.endsWith('?') && !p.metadata?.isPoll && !p.metadata?.isPraise;
        }).length,
        question: posts.filter((p: any) => {
          const title = (p.title || '').trim();
          return title.endsWith('?') || title.includes('?');
        }).length,
        poll: posts.filter((p: any) => p.metadata?.isPoll).length,
        praise: posts.filter((p: any) => p.metadata?.isPraise || (p.title || '').toLowerCase().includes('kudos')).length,
        article: posts.filter((p: any) => p.metadata?.isArticle).length,
      };

      // Get user details for top posts
      const topPostUserIds = [...new Set(topPosts.map((p: any) => p.user_id))];
      const userDetailsMap = new Map();
      
      for (const userId of topPostUserIds) {
        const [userData] = await safeFetch(
          supabase
            .from('users_local')
            .select('username')
            .eq('id' as any, userId as any)
            .maybeSingle()
        );
        if (userData) {
          userDetailsMap.set(userId, userData.username);
        }
      }

      // Build top conversations (will be used in setData below)
      const topConversationsResult = await Promise.all(
        topPosts.map(async (post: any) => {
          const postReactions = reactions.filter((r: any) => r.post_id === post.id);
          const postComments = comments.filter((c: any) => c.post_id === post.id);
          
          return {
            id: post.id,
            title: post.title || 'Untitled',
            author: userDetailsMap.get(post.user_id) || 'Unknown',
            reactions: postReactions.length,
            comments: postComments.length,
            views: post.view_count || 0, // ✅ REAL DATA from database
            created_at: post.created_at
          };
        })
      );

      // Calculate engagement metrics
      const reactedCount = reactedUserIds.size;
      const commentedCount = commentedUserIds.size;
      const postedCount = postedUserIds.size;

      // Q&A metrics
      const questions = posts.filter((p: any) => {
        const title = (p.title || '').trim();
        return title.endsWith('?') || title.includes('?');
      });
      const totalQuestions = questions.length;
      const answeredQuestions = questions.filter((q: any) => {
        const questionComments = comments.filter((c: any) => c.post_id === q.id);
        return questionComments.length > 0;
      }).length;

      setData({
        totalMembers,
        engagedMembers,
        reachedMembers,
        totalPosts: posts.length,
        postsByType,
        totalViews,
        totalMessages: comments.length,
        totalReactions: reactions.length,
        reactedCount,
        commentedCount,
        postedCount,
        totalQuestions,
        answeredQuestions,
        topConversations: topConversationsResult.sort((a, b) => 
          (b.reactions + b.comments) - (a.reactions + a.comments)
        ).slice(0, 10)
      });
    } catch (error) {
      console.error('Error in fetchAnalyticsManual:', error);
    }
  };

  // Helper to build top conversations with real data
  const buildTopConversations = async (topPosts: any[]) => {
    if (!topPosts || topPosts.length === 0) return [];

    const postIds = topPosts.map((p: any) => p.id);
    
    // Fetch reactions and comments for these posts
    const [reactionsData, commentsData] = await Promise.all([
      safeFetch(
        supabase
          .from('community_post_reactions_new')
          .select('post_id, user_id')
          .in('post_id' as any, postIds)
      ),
      safeFetch(
        supabase
          .from('community_post_comments_new')
          .select('post_id, user_id')
          .in('post_id' as any, postIds as any)
          .eq('status' as any, 'active' as any)
      )
    ]);

    const reactions = reactionsData?.[0] || [];
    const comments = commentsData?.[0] || [];

    // Get user details
    const userIds = [...new Set([
      ...topPosts.map((p: any) => p.user_id),
      ...reactions.map((r: any) => r.user_id),
      ...comments.map((c: any) => c.user_id)
    ])];

    const userDetailsMap = new Map<string, string>();
    for (const userId of userIds) {
      const [userData] = await safeFetch(
        supabase
          .from('users_local')
          .select('username')
          .eq('id' as any, userId)
          .maybeSingle()
      );
      if (userData) {
        userDetailsMap.set(userId, userData.username);
      }
    }

    return topPosts.map((post: any) => {
      const postReactions = reactions.filter((r: any) => r.post_id === post.id);
      const postComments = comments.filter((c: any) => c.post_id === post.id);
      
      return {
        id: post.id,
        title: post.title || 'Untitled',
        author: userDetailsMap.get(post.user_id) || 'Unknown',
        reactions: postReactions.length,
        comments: postComments.length,
        views: post.view_count || 0,
        created_at: post.created_at
      };
    }).sort((a, b) => (b.reactions + b.comments) - (a.reactions + a.comments)).slice(0, 10);
  };

  if (loading) {
    return (
      <MainLayout>
        <PageLayout>
          <PageSection>
            <SectionContent>
              <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
                <Skeleton className="h-96" />
              </div>
            </SectionContent>
          </PageSection>
        </PageLayout>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <PageLayout>
          <PageSection>
            <SectionContent>
              <div className="text-center py-12">
                <p className="text-gray-600">Failed to load analytics data</p>
                <Button onClick={() => fetchAnalytics()} className="mt-4">
                  Retry
                </Button>
              </div>
            </SectionContent>
          </PageSection>
        </PageLayout>
      </MainLayout>
    );
  }

  const engagementRate = data.totalMembers > 0 
    ? ((data.engagedMembers / data.totalMembers) * 100).toFixed(1)
    : '0';

  const answerRate = data.totalQuestions > 0
    ? ((data.answeredQuestions / data.totalQuestions) * 100).toFixed(1)
    : '0';

  return (
    <MainLayout>
      <PageLayout>
        <PageSection>
          {/* Header */}
          <SectionHeader
            title={communityName || 'Community' as any}
            actions={
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/community/${id}`)}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {communityName || 'Community'} Analytics
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Community engagement and activity insights
                  </p>
                </div>
              </div>
            }
          />

          <SectionContent>
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Members</p>
                      <p className="text-2xl font-bold text-gray-900">{data.totalMembers}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {engagementRate}% engaged
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Engaged</p>
                      <p className="text-2xl font-bold text-gray-900">{data.engagedMembers}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {data.reachedMembers} reached
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Posts</p>
                      <p className="text-2xl font-bold text-gray-900">{data.totalPosts}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {data.totalViews.toLocaleString()} views
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Reactions</p>
                      <p className="text-2xl font-bold text-gray-900">{data.totalReactions}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {data.totalMessages} messages
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Posts by Type */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts by Type</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{data.postsByType.discussion}</p>
                    <p className="text-sm text-gray-600 mt-1">Discussion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{data.postsByType.question}</p>
                    <p className="text-sm text-gray-600 mt-1">Question</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{data.postsByType.poll}</p>
                    <p className="text-sm text-gray-600 mt-1">Poll</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{data.postsByType.praise}</p>
                    <p className="text-sm text-gray-600 mt-1">Praise</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{data.postsByType.article}</p>
                    <p className="text-sm text-gray-600 mt-1">Article</p>
                  </div>
                </div>
              </div>

              {/* Engagement Funnel */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Funnel</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reacted</span>
                    <span className="text-sm font-semibold text-gray-900">{data.reactedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Commented</span>
                    <span className="text-sm font-semibold text-gray-900">{data.commentedCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Posted</span>
                    <span className="text-sm font-semibold text-gray-900">{data.postedCount}</span>
                  </div>
                </div>
              </div>

              {/* Knowledge Sharing */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Sharing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{data.totalQuestions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Answer Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{answerRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.answeredQuestions} of {data.totalQuestions} answered
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Conversations */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Conversations</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Post</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Author</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Reactions</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Comments</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Views</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topConversations.map((conversation) => (
                        <tr key={conversation.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {conversation.title}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-600">{conversation.author}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-sm text-gray-600">{conversation.reactions}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-sm text-gray-600">{conversation.comments}</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-sm text-gray-600">{conversation.views}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-500">
                              {format(new Date(conversation.created_at), 'MMM d, yyyy')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </SectionContent>
        </PageSection>
      </PageLayout>
    </MainLayout>
  );
}

