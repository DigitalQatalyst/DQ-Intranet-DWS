import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { MainLayout } from '@/communities/components/layout/MainLayout';
import { Button } from '@/communities/components/ui/button';
import { AlertCircle, Plus, Settings, Home, ChevronRight, X, Pencil, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { MemberList } from '@/communities/components/communities/MemberList';
import { InlineComposer } from '@/communities/components/post/InlineComposer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/communities/components/ui/dialog';
import { Label } from '@/communities/components/ui/label';
import { Input } from '@/communities/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/communities/components/ui/select';
import { format } from 'date-fns';
import { PostCard } from '@/communities/components/posts/PostCard';
import { Skeleton } from '@/communities/components/ui/skeleton';
import { FeedSidebar } from '@/communities/components/feed/FeedSidebar';
// Import PageLayout components
import {
  PageLayout,
  PageSection,
  SectionHeader,
  SectionContent,
  Breadcrumbs,
  BreadcrumbItem,
} from "../components/PageLayout/index";
import { cn } from '@/communities/lib/utils';
import { useAuthorization } from '@/hooks/useAbility';
import { HeroActionIcons } from '@/communities/components/hero/HeroActionIcons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/communities/components/ui/tooltip';

interface Community {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  imageurl?: string | null;
  category?: string | null;
  isprivate?: boolean;
  isVerified?: boolean;
  metadata?: {
    isVerified?: boolean;
  };
}
interface Post {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  created_at: string;
  created_by: string;
  community_id: string;
  community_name: string;
  author_username: string;
  author_avatar?: string;
  helpful_count?: number;
  insightful_count?: number;
  comment_count?: number;
  tags?: string[];
  post_type?: "text" | "media" | "poll" | "event" | "article" | "announcement";
  metadata?: any;
  event_date?: string;
  event_location?: string;
}
export default function Community() {
  const { id } = useParams<{
    id: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userContext } = useAuthorization();
  const [community, setCommunity] = useState<Community | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [updateImageLoading, setUpdateImageLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'recent-activity' | 'recent-posts'>('recent-activity');
  const [filterBy, setFilterBy] = useState<'all' | 'new' | 'questions' | 'unanswered' | 'unreplied'>('all');
  const location = useLocation();
  const pathname = location.pathname;

  const baseCommunityPath = `/community/${id}`;
  const tabs = [
    { key: "conversations", label: "Conversations", path: baseCommunityPath },
    { key: "about", label: "About", path: `${baseCommunityPath}/about` },
    { key: "files", label: "Files", path: `${baseCommunityPath}/files` },
    { key: "events", label: "Events", path: `${baseCommunityPath}/events` },
  ] as const;

  const activeTab = React.useMemo(() => {
    if (pathname.endsWith("/about")) return "about";
    if (pathname.endsWith("/files")) return "files";
    if (pathname.endsWith("/events")) return "events";
    return "conversations";
  }, [pathname]);
  // SignInModal removed - users are already authenticated via main app
  useEffect(() => {
    if (id) {
      fetchCommunity();
      // fetchPosts and checkMembership will be called after community is loaded
      // to avoid unnecessary queries for non-existent communities
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not user - user changes handled inside fetchCommunity
  useEffect(() => {
    if (id) {
      fetchPosts();
    }
  }, [refreshKey]);

  const fetchCommunity = async () => {
    if (!id) {
      setError("Community ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {

    // First, try to fetch from the view
    let data: any = null;
    let err: any = null;
    
    const viewQuery = supabase
      .from("communities_with_counts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    
    [data, err] = await safeFetch(viewQuery);

    // If view query fails, fallback to direct communities table query
    if (err || !data) {
      console.log("View query failed, trying direct communities table query...", err);
      
      const directQuery = supabase
        .from("communities")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      const [directData, directErr] = await safeFetch(directQuery);
      
      if (directErr || !directData) {
        // Check if it's a "not found" error
        const isNotFound = 
          directErr?.code === "PGRST116" || 
          directErr?.code === "PGRST301" ||
          directErr?.status === 401 ||
          directErr?.status === 404 ||
          directErr?.message?.includes("No rows") ||
          directErr?.message?.includes("not found") ||
          directErr?.message?.includes("Unauthorized");
        
        if (isNotFound) {
          setError("Community not found");
        } else {
          console.error("Error fetching community from direct table:", directErr);
          setError("Failed to load community");
        }
        setLoading(false);
        return;
      }
      
      // Use direct query data and fetch member count separately
      data = directData;
      
      // Fetch member count separately
      try {
        const { count } = await supabase
          .from("memberships")
          .select("*", { count: "exact", head: true })
          .eq("community_id" as any, id);
        
        data.member_count = count || 0;
      } catch (countError) {
        console.warn("Error fetching member count:", countError);
        data.member_count = 0;
      }
    }

    // Set community data
    if (data) {
      setCommunity({
        id: data.id,
        name: data.name,
        description: data.description,
        created_at: data.created_at,
        imageurl: data.imageurl || null,
        category: data.category || "Community",
        isprivate: data.isprivate || false,
      });
      setMemberCount(data.member_count || 0);
      
      // Fetch the community's creator to check ownership
      if (user) {
        const ownerQuery = supabase
          .from("communities")
          .select("created_by")
          .eq("id", id)
          .maybeSingle();
        const [ownerData] = await safeFetch(ownerQuery);
        const isUserOwner = ownerData?.created_by === user.id;
        setIsOwner(isUserOwner);
        // Check if user is admin (platform or community)
        const isPlatformAdmin = userContext?.progressiveRole === 'admin' || 
                               userContext?.responsibilityRoles.includes('community_moderator');
        if (!isUserOwner && (user.role === "admin" || isPlatformAdmin)) {
          setIsAdmin(true);
        } else if (!isUserOwner) {
          const roleQuery = supabase
            .from("community_roles")
            .select("role")
            .eq("community_id", id)
            .eq("user_id", user.id)
            .maybeSingle();
          const [roleData] = await safeFetch(roleQuery);
          setIsAdmin(roleData?.role === "admin");
        }
      }
      // Only fetch posts and check membership after community is successfully loaded
      // Don't await these - let them run in background to avoid blocking
      fetchPosts().catch(err => console.error("Error fetching posts:", err));
      checkMembership().catch(err => console.error("Error checking membership:", err));
    } else {
      setError("Community not found");
    }
    } catch (err) {
      console.error("Unexpected error in fetchCommunity:", err);
      setError("Failed to load community");
    } finally {
      setLoading(false);
    }
  };
  const checkMembership = async () => {
    if (!id || !user) {
      setIsMember(false);
      return;
    }
    
    // Get user ID from Azure AD authentication
    const userId = user?.id;
    
    if (!userId) {
      setIsMember(false);
      return;
    }
    
    const query = supabase.from('memberships').select('id').eq('user_id', userId).eq('community_id', id).maybeSingle();
    const [data] = await safeFetch(query);

    setIsMember(!!data);
  };
  const handleJoinLeave = async () => {
    if (!id) return;
    
    // User should be authenticated via Azure AD at app level (ProtectedRoute)
    // If user is null, it's likely still loading
    if (!user) {
      toast.error('Please wait for authentication to complete');
      return;
    }
    
    setJoinLoading(true);
    
    // Get user ID from Azure AD authentication
    const userId = user?.id;
    
    if (!userId) {
      toast.error('Unable to verify authentication. Please refresh the page.');
      setJoinLoading(false);
      return;
    }
    
    // Validate community exists
    const { data: communityData } = await supabase
      .from('communities')
      .select('id')
      .eq('id', id)
      .single();
    
    if (!communityData) {
      toast.error('Community not found');
      setJoinLoading(false);
      return;
    }
    
    // Check if already a member
    const { data: existingMembership } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('community_id', id)
      .maybeSingle();
    
    if (isMember || existingMembership) {
      // Leave community
      const query = supabase.from('memberships').delete().match({
        user_id: userId,
        community_id: id
      });
      const [, error] = await safeFetch(query);
      if (error) {
        toast.error('Failed to leave community');
      } else {
        toast.success('Left community');
        setIsMember(false);
        setMemberCount(prev => Math.max(0, prev - 1));
      }
    } else {
      // Join community
      const query = supabase.from('memberships').insert({
        user_id: userId,
        community_id: id
      });
      const [, error] = await safeFetch(query);
      if (error) {
        if (error.code === '23505') {
          // Duplicate key error - user is already a member
          toast.error('You are already a member of this community');
          setIsMember(true);
        } else if (error.code === '23503') {
          // Foreign key violation
          toast.error('Invalid community or user');
        } else {
          toast.error('Failed to join community');
        }
      } else {
        toast.success('Joined community!');
        setIsMember(true);
        setMemberCount(prev => prev + 1);
      }
    }
    setJoinLoading(false);
  };
  const fetchPosts = async () => {
    if (!id) return;
    setPostsLoading(true);
    setPostsError(null);

    try {
      // Query posts_v2 table (simplified schema)
      let query = supabase
        .from("posts_v2")
        .select("*")
        .eq("community_id", id)
        .order("created_at", {
          ascending: false,
        });

      const [data, err] = await safeFetch(query);
      
      if (err) {
        console.error("Error fetching posts from posts_v2:", err);
        setPostsError("Failed to load posts");
        setPostsLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setPosts([]);
        setPostsLoading(false);
        return;
      }

      // Fetch community and user data for each post
      const postsWithMetadata = await Promise.all(
        data.map(async (post: any) => {
          // Fetch community name
          const [communityData] = await safeFetch(
            supabase
              .from("communities")
              .select("name")
              .eq("id", post.community_id)
              .maybeSingle()
          );
          
          // Fetch user data from users_local (user_id in posts_v2 may map to users_local.id)
          let userData = null;
          if (post.user_id) {
            const [userResult] = await safeFetch(
              supabase
                .from("users_local")
                .select("username, avatar_url")
                .eq("id", post.user_id)
                .maybeSingle()
            );
            userData = userResult;
          }

          // Check if post has media to determine post_type
          // Primary check: look for media HTML in content (since posts_v2 stores media in content)
          // Also check if it's a poll by checking poll_options table
          let postType = "text";
          
          // Check if it's a poll first
          const [pollOptionsCheck] = await safeFetch(
            supabase
              .from("poll_options")
              .select("id")
              .eq("post_id", post.id)
              .limit(1)
          );
          
          if (pollOptionsCheck && pollOptionsCheck.length > 0) {
            postType = "poll";
          }
          
          // Check for media in content (can be media post or poll with media)
          if (post.content) {
            const hasMedia = post.content.includes('<div class="media-content">') || 
                            post.content.includes('<img') ||
                            post.content.match(/<img[^>]+src=["']([^"']+)["']/i);
            
            if (hasMedia && postType !== "poll") {
              postType = "media";
            }
          }
          
          // Fallback: check media_files table (though this may not work due to foreign key constraint)
          if (postType === "text") {
            const [mediaFiles] = await safeFetch(
              supabase
                .from("media_files")
                .select("id")
                .eq("post_id", post.id)
                .limit(1)
            );
            
            if (mediaFiles && mediaFiles.length > 0) {
              postType = "media";
            }
          }
          
          return {
            ...post,
            created_by: post.user_id, // Map user_id to created_by for compatibility
            communities: communityData ? { name: communityData.name } : null,
            users_local: userData || null,
            community_name: communityData?.name || "Unknown Community",
            author_username: userData?.username || "Unknown User",
            author_avatar: userData?.avatar_url || null,
            // Add default values for fields not in posts_v2
            status: "active", // posts_v2 doesn't have status, default to active
            post_type: postType, // Detect post type from media_files or content
            tags: [], // posts_v2 doesn't have tags
            content_html: null, // posts_v2 doesn't have content_html
            metadata: {},
            event_date: null,
            event_location: null,
          };
        })
      );
      
      // Fetch reaction and comment counts from the new tables for posts_v2
      const postIds = postsWithMetadata.map((p: any) => p.id);

      // Fetch from community_post_reactions_new (for posts_v2)
      const { data: reactions } = await supabase
        .from("community_post_reactions_new")
        .select("post_id, reaction_type")
        .in("post_id", postIds);

      // Fetch from community_post_comments_new (for posts_v2)
      const { data: comments } = await supabase
        .from("community_post_comments_new")
        .select("post_id")
        .in("post_id", postIds);

      // Count reactions and comments
      const reactionCounts =
        reactions?.reduce((acc: any, r: any) => {
          if (!acc[r.post_id]) acc[r.post_id] = { helpful: 0, insightful: 0 };
          if (r.reaction_type === "helpful") acc[r.post_id].helpful++;
          if (r.reaction_type === "insightful") acc[r.post_id].insightful++;
          return acc;
        }, {}) || {};

      const commentCounts =
        comments?.reduce((acc: any, c: any) => {
          acc[c.post_id] = (acc[c.post_id] || 0) + 1;
          return acc;
        }, {}) || {};

      const posts = postsWithMetadata.map((p: any) => ({
        ...p,
        helpful_count: reactionCounts[p.id]?.helpful || 0,
        insightful_count: reactionCounts[p.id]?.insightful || 0,
        comment_count: commentCounts[p.id] || 0,
      }));

      setPosts(posts);
    } catch (error) {
      console.error("Unexpected error in fetchPosts:", error);
      setPostsError("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };
  const handlePostCreated = () => {
    // Refresh posts immediately after creation
    fetchPosts().catch(err => console.error("Error refreshing posts:", err));
    setRefreshKey((prev) => prev + 1);
  };

  const handleTagFilter = (tag: string) => {
    // Navigate to feed with tag filter
    navigate(`/feed?tag=${tag}`);
  };
  const handleUpdateImage = async () => {
    if (!id || !user) return;
    if (!newImageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }
    setUpdateImageLoading(true);
    const updateData = {
      imageurl: newImageUrl.trim(),
    };
    const query = supabase.from("communities").update(updateData).eq("id", id);
    const [, error] = await safeFetch(query);
    if (error) {
      toast.error("Failed to update community image");
      console.error("Image update error:", error);
    } else {
      toast.success("Community image updated successfully");
      setCommunity((prev) =>
        prev
          ? {
              ...prev,
              imageurl: newImageUrl.trim(),
            }
          : null
      );
      setImageDialogOpen(false);
      setNewImageUrl("");
    }
    setUpdateImageLoading(false);
  };

  // Generate breadcrumbs for the community page
  const breadcrumbItems: BreadcrumbItem[] = community
    ? [
        {
          label: "Home",
          href: "/",
          icon: Home,
        },
        {
          label: "Communities",
          href: "/communities",
        },
        {
          label: community.name,
          current: true,
        },
      ]
    : [];
  if (loading) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout>
          <div className="flex justify-center items-center min-h-[60vh] bg-white">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-t-dq-navy border-gray-200 animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading community...</p>
            </div>
          </div>
        </PageLayout>
      </MainLayout>
    );
  }
  if (error || !community) {
    return (
      <MainLayout hidePageLayout>
        <PageLayout>
          <PageSection>
            <SectionContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || "Community not found"}
                </h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  We couldn't find the community you're looking for. It may have
                  been removed or you may have followed an incorrect link.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={fetchCommunity}>
                    Try Again
                  </Button>
                  <Button as={Link} to="/communities" variant="default">
                    Browse Communities
                  </Button>
                </div>
              </div>
            </SectionContent>
          </PageSection>
        </PageLayout>
      </MainLayout>
    );
  }
  // Fallback image URL if community image is missing
  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80";

  // Community-specific hero images mapping
  // TODO: Replace placeholder URLs with actual image URLs for:
  // - Agile: Agile development illustration
  // - Culture: Culture/community collaboration illustration  
  // - GHC - Persona: User profile/community illustration
  // - DTMF: Project management/analytics illustration
  const getCommunityHeroImage = (communityName: string | null | undefined): string | null => {
    if (!communityName) return null;
    const name = communityName.toLowerCase();
    
    // Map community names to their specific images
    // Add your image URLs here (can be local paths like /images/agile-hero.jpg or hosted URLs)
    const imageMap: Record<string, string> = {
      'agile': '/images/communities/agile-hero.jpg', // Replace with actual Agile illustration URL
      'culture': '/images/communities/culture-hero.jpg', // Replace with actual Culture illustration URL
      'ghc - persona': '/images/communities/ghc-persona-hero.jpg', // Replace with actual GHC Persona illustration URL
      'ghc persona': '/images/communities/ghc-persona-hero.jpg',
      'dtmf': '/images/communities/dtmf-hero.jpg', // Replace with actual DTMF illustration URL
    };

    // Check for exact match or partial match
    for (const [key, url] of Object.entries(imageMap)) {
      if (name.includes(key.toLowerCase())) {
        return url;
      }
    }
    
    return null;
  };

  // Get hero image for this community
  const heroImage = community?.imageurl || getCommunityHeroImage(community?.name) || fallbackImageUrl;
  const sidebarCardImage = getCommunityHeroImage(community?.name) || community?.imageurl || null;

  return (
    <MainLayout hidePageLayout fullWidth>
      <div className="bg-gray-50">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <nav
            className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 py-2"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center text-sm md:text-base transition-colors"
                  aria-label="Navigate to Home"
                >
                  <Home size={16} className="mr-1" aria-hidden="true" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                  <Link
                    to="/communities"
                    className="text-gray-600 hover:text-gray-900 text-sm md:text-base font-medium transition-colors"
                    aria-label="Navigate to DQ Work Communities"
                  >
                    DQ Work Communities
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center min-w-[80px]">
                  <ChevronRight size={16} className="text-gray-400 mx-1 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-500 text-sm md:text-base font-medium whitespace-nowrap">
                    {community.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Hero Section - Guidelines-style dimensions */}
        {community && (
          <header
            className="relative overflow-hidden text-white h-[500px] w-full"
            aria-labelledby="community-title"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={heroImage} 
                alt={`${community.name} community background`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImageUrl;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#030F35]/90 via-[#061649]/85 to-[#030F35]/90" />
            </div>
            {/* Subtle bottom fade into page background */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-gray-50/40 z-10" />

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-12">
              {/* Hero Action Icons - Top-right Overlay (Viva Engage Style) */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-10">
                <HeroActionIcons
                  communityId={community.id}
                  communityName={community.name}
                  onLike={() => {
                    // Handle community like/favorite
                    console.log('Community liked');
                  }}
                  onInsights={() => {
                    // Handle insights/analytics
                    console.log('Insights clicked');
                  }}
                />
              </div>

              <div className="space-y-4">
                {/* Eyebrow, title, description, metadata */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-200/70">
                    {community.category || "DQ Work Community"}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1
                      id="community-title"
                      className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
                    >
                      {community.name}
                    </h1>
                    {/* Verified Badge - Viva Engage Style */}
                    {(community.isVerified || community.metadata?.isVerified) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex items-center ml-2">
                              <CheckCircle2 
                                className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-blue-400 flex-shrink-0" 
                                aria-label="Verified community"
                                fill="currentColor"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified community</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  {(community.description || community.category) && (
                    <p className="text-sm md:text-base font-normal text-indigo-100/80 max-w-2xl leading-relaxed">
                      {community.description || community.category}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm md:text-base text-indigo-100/90">
                    <span>{community.category || "Community"}</span>
                    {community.created_at && (
                      <>
                        <span className="text-indigo-200/70">•</span>
                        <span>
                          {format(
                            new Date(community.created_at),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </>
                    )}
                    <span className="text-indigo-200/70">•</span>
                    <span>
                      {memberCount}{" "}
                      {memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                </div>

                {/* Primary action row removed per user request */}

                {/* Owner/admin actions row below hero text */}
                {(isOwner ||
                  isAdmin ||
                  (user &&
                    (user.role === "admin" ||
                      user.role === "moderator"))) && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-indigo-100/90">
                    <Button
                      onClick={() => setImageDialogOpen(true)}
                      variant="outline"
                      size="sm"
                      className="border-white/25 bg-white/5 text-white hover:bg-white hover:text-[#030F35]"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit Image
                    </Button>
                    <Button
                      as={Link}
                      to={`/community/${id}/settings`}
                      variant="outline"
                      size="sm"
                      className="border-white/25 bg-white/5 text-white hover:bg-white hover:text-[#030F35]"
                    >
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      Settings
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Section selector removed per latest requirements */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          {/* Main Content */}
          {activeTab === "conversations" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Posts Feed */}
            <div className="lg:col-span-2 space-y-6">
              <PageSection>
                <SectionHeader
                  title="Community Posts"
                  description="Latest discussions and updates"
                />
                {/* Inline Composer - Only for members */}
                {user && isMember && (
                  <SectionContent className="pb-0 border-b border-gray-200">
                    <InlineComposer
                      communityId={id}
                      onPostCreated={handlePostCreated}
                    />
                  </SectionContent>
                )}
                {/* Sort & Filter Controls - Viva Engage Style (Sticky) */}
                {!postsLoading && posts.length > 0 && (
                  <SectionContent className="sticky top-[64px] z-10 bg-white py-3 border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">Sort:</span>
                        <Select value={sortBy} onValueChange={(value: 'recent-activity' | 'recent-posts') => setSortBy(value)}>
                          <SelectTrigger className="h-8 w-[160px] text-xs border-gray-200 rounded-full px-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recent-activity">Recent activity</SelectItem>
                            <SelectItem value="recent-posts">Recent posts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">Filter:</span>
                        <Select value={filterBy} onValueChange={(value: 'all' | 'new' | 'questions' | 'unanswered' | 'unreplied') => setFilterBy(value)}>
                          <SelectTrigger className="h-8 w-[200px] text-xs border-gray-200 rounded-full px-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All conversations</SelectItem>
                            <SelectItem value="new">
                              New conversations ({posts.filter(p => {
                                const postDate = new Date(p.created_at);
                                const oneDayAgo = new Date();
                                oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                                return postDate > oneDayAgo;
                              }).length})
                            </SelectItem>
                            <SelectItem value="questions">
                              All questions ({posts.filter(p => {
                                const title = (p.title || '').trim();
                                return title.endsWith('?') || title.includes('?');
                              }).length})
                            </SelectItem>
                            <SelectItem value="unanswered">
                              Questions with no marked answer ({posts.filter(p => {
                                const title = (p.title || '').trim();
                                const isQuestion = title.endsWith('?') || title.includes('?');
                                return isQuestion && (p.comment_count || 0) === 0;
                              }).length})
                            </SelectItem>
                            <SelectItem value="unreplied">
                              Questions with no replies ({posts.filter(p => {
                                const title = (p.title || '').trim();
                                const isQuestion = title.endsWith('?') || title.includes('?');
                                return isQuestion && (p.comment_count || 0) === 0;
                              }).length})
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </SectionContent>
                )}
                {/* Posts List */}
                <SectionContent className={user && isMember ? "pt-4" : ""}>
                  {postsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-4">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : postsError ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                      <p>{postsError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchPosts}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-4">
                          <AlertCircle className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No posts yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Be the first to start a conversation in this community
                        </p>
                        {/* Inline composer above feed is now the primary way to post */}
                        {!user && (
                          <p className="text-gray-400 text-sm">
                            Join this community to start posting
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(() => {
                        // Helper to check if post is a question
                        const isQuestion = (post: Post) => {
                          const title = (post.title || '').trim();
                          return title.endsWith('?') || title.includes('?');
                        };

                        // Apply filters
                        let filteredPosts = posts;
                        
                        // Filter by type
                        if (filterBy === 'new') {
                          const oneDayAgo = new Date();
                          oneDayAgo.setDate(oneDayAgo.getDate() - 1);
                          filteredPosts = filteredPosts.filter(p => new Date(p.created_at) > oneDayAgo);
                        } else if (filterBy === 'questions') {
                          filteredPosts = filteredPosts.filter(isQuestion);
                        } else if (filterBy === 'unanswered' || filterBy === 'unreplied') {
                          filteredPosts = filteredPosts.filter(p => isQuestion(p) && (p.comment_count || 0) === 0);
                        }

                        // Apply search query
                        const searchTerm = searchQuery.trim().toLowerCase();
                        if (searchTerm) {
                          filteredPosts = filteredPosts.filter((post) => {
                            const titleMatch = post.title?.toLowerCase().includes(searchTerm) || false;
                            const contentMatch = post.content?.toLowerCase().includes(searchTerm) || false;
                            return titleMatch || contentMatch;
                          });
                        }

                        // Apply sorting
                        const sortedPosts = [...filteredPosts].sort((a, b) => {
                          if (sortBy === 'recent-activity') {
                            // Sort by most recent activity (comments/reactions update this)
                            // For now, use created_at + comment_count as proxy
                            const aScore = new Date(a.created_at).getTime() + ((a.comment_count || 0) * 1000);
                            const bScore = new Date(b.created_at).getTime() + ((b.comment_count || 0) * 1000);
                            return bScore - aScore;
                          } else {
                            // Sort by most recent posts
                            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                          }
                        });

                        if (searchTerm && sortedPosts.length === 0) {
                          return (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="bg-gray-100 p-3 rounded-full mb-4">
                                  <AlertCircle className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  No posts found
                                </h3>
                                <p className="text-gray-500">
                                  No posts match your search for "{searchQuery}"
                                </p>
                              </div>
                            </div>
                          );
                        }

                        if (filterBy !== 'all' && sortedPosts.length === 0) {
                          return (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="bg-gray-100 p-3 rounded-full mb-4">
                                  <AlertCircle className="h-6 w-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                  No posts match this filter
                                </h3>
                                <p className="text-gray-500">
                                  Try adjusting your filter or sort options
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return sortedPosts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onActionComplete={handlePostCreated}
                          />
                        ));
                      })()}
                    </div>
                  )}
                </SectionContent>
              </PageSection>
            </div>
            {/* Sidebar Column */}
            {/* Main content container with vertical spacing - Sticky sidebar */}
            <div className="space-y-6 mb-10 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
              {/* Community Information Section */}
              <PageSection>
                <SectionHeader title="About this Community" />
                <SectionContent>
                  {/* Community Image Card */}
                  {sidebarCardImage && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                      <img 
                        src={sidebarCardImage} 
                        alt={`${community.name} community`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    {/* Community Category */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Category
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {community.category}
                      </p>
                    </div>
                    {/* Community Creation Date */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {format(new Date(community.created_at), "MMMM d, yyyy")}
                      </p>
                    </div>
                    {/* Member Count */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Members
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {memberCount} members
                      </p>
                    </div>
                    {/* Admin/owner only settings button */}
                    {(isOwner || isAdmin) && (
                      <div className="pt-4 border-t border-gray-200">
                        <Button
                          as={Link}
                          to={`/community/${id}/settings`}
                          variant="outline"
                          className="w-full justify-center"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Community
                        </Button>
                      </div>
                    )}
                  </div>
                </SectionContent>
              </PageSection>

              {/* Feed Sidebar - Trending Topics and Top Communities */}
              <FeedSidebar onTagClick={handleTagFilter} />

              {/* Member List Section */}
              <PageSection>
                {/* Section header with title and 'View All' button */}
                <SectionHeader
                  title="Community Members"
                  actions={
                    <Button
                      as={Link}
                      to={`/community/${id}/members`}
                      variant="outline"
                      size="sm"
                    >
                      View All
                    </Button>
                  }
                />
                {/* Member list with independent scrolling */}
                <SectionContent className="p-0">
                  {/* Display first 5 members, hides the section header */}
                  <MemberList communityId={id!} limit={5} hideHeader={true} />
                </SectionContent>
              </PageSection>
            </div>
          </div>
          )}

          {activeTab === "about" && (
            <div className="mt-8 space-y-6 pb-10">
              <PageSection>
                <SectionHeader
                  title="About this Community"
                  description="Learn more about the purpose and makeup of this community."
                />
                <SectionContent>
                  <div className="space-y-4">
                    {/* Community Description */}
                    {community.description && (
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {community.description}
                        </p>
                      </div>
                    )}
                    {/* Category */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Category
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {community.category}
                      </p>
                    </div>
                    {/* Created Date */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {format(new Date(community.created_at), "MMMM d, yyyy")}
                      </p>
                    </div>
                    {/* Member Count */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Members
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {memberCount} members
                      </p>
                    </div>
                  </div>
                </SectionContent>
              </PageSection>

              <PageSection>
                <SectionHeader
                  title="Community Members"
                  actions={
                    <Button
                      as={Link}
                      to={`/community/${id}/members`}
                      variant="outline"
                      size="sm"
                    >
                      View All
                    </Button>
                  }
                />
                <SectionContent className="p-0">
                  <MemberList communityId={id!} limit={10} hideHeader={true} />
                </SectionContent>
              </PageSection>
            </div>
          )}

          {activeTab === "files" && (
            <div className="mt-8 pb-10">
              <PageSection>
                <SectionHeader
                  title="Files"
                  description="Shared files and resources for this community."
                />
                <SectionContent>
                  <p className="text-sm text-gray-600">
                    File sharing for this community will appear here.
                  </p>
                </SectionContent>
              </PageSection>
            </div>
          )}

          {activeTab === "events" && (
            <div className="mt-8 pb-10">
              <PageSection>
                <SectionHeader
                  title="Events"
                  description="Upcoming and past events for this community."
                />
                <SectionContent>
                  <p className="text-sm text-gray-600">
                    Events for this community will appear here.
                  </p>
                </SectionContent>
              </PageSection>
            </div>
          )}
        </div>
        {/* Floating Create Post Button removed - InlineComposer is the single entry point */}

        {/* SignInModal removed - users are already authenticated via main app */}

        {/* Image Update Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Community Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="focus:ring-2 focus:ring-dq-navy focus:border-dq-navy"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL for the community background image
                </p>
              </div>
              {/* Preview */}
              {newImageUrl && (
                <div className="relative h-32 w-full overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImageUrl;
                    }}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImageDialogOpen(false);
                    setNewImageUrl("");
                  }}
                  disabled={updateImageLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateImage}
                  disabled={updateImageLoading}
                  className="bg-dq-navy hover:bg-[#13285A] text-white"
                >
                  {updateImageLoading ? "Updating..." : "Update Image"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
