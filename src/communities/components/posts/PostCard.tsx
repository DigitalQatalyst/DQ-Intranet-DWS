import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Calendar, MapPin } from 'lucide-react';
import { CommunityReactions } from '@/communities/components/post/CommunityReactions';
import { CommunityComments, CommunityCommentsRef } from '@/communities/components/post/CommunityComments';
import { ReactionSummary } from '@/communities/components/post/ReactionSummary';
import { useReactionSummary } from '@/communities/hooks/useReactionSummary';
import { usePostViews } from '@/communities/hooks/usePostViews';
import { ShareDropdown } from '@/communities/components/post/ShareDropdown';
import { PostCardMedia } from './PostCard/PostCardMedia';
import { cn } from '@/communities/lib/utils';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/communities/components/ui/dropdown-menu';

interface Post {
  id: string;
  title?: string | null;
  content?: string | null;
  created_at: string;
  created_by?: string | null;
  community_id?: string | null;
  community_name?: string | null;
  author_username?: string | null;
  author_avatar?: string | null;
  helpful_count?: number | null;
  insightful_count?: number | null;
  comment_count?: number | null;
  view_count?: number | null;
  tags?: string[] | null;
  post_type?: 'text' | 'media' | 'poll' | 'event' | 'article' | 'announcement' | null;
  metadata?: Record<string, any> | null;
  event_date?: string | null;
  event_location?: string | null;
}

interface PostCardProps {
  post: Post;
  onActionComplete?: () => void;
  isMember?: boolean;
}

type DisplayPostType =
  | 'question'
  | 'discussion'
  | 'praise'
  | 'poll'
  | 'event'
  | 'media'
  | 'article'
  | 'announcement';

export function PostCard({ post, onActionComplete, isMember = false }: PostCardProps) {
  const navigate = useNavigate();
  const { summary: reactionSummary, refetch: refetchReactionSummary } = useReactionSummary(post.id);
  const { viewCount = 0, recentViewers = [] } = usePostViews(post.id);
  const [expanded, setExpanded] = useState(false);
  const commentsRef = useRef<CommunityCommentsRef>(null);

  // Optional-safe defaults for all fields
  const safeTitle = post.title ?? 'Untitled Post';
  const safeContent = post.content ?? '';
  const safeAuthor = post.author_username ?? 'Unknown User';
  const safeCommunity = post.community_name ?? 'Unknown Community';
  const safeCreatedAt = post.created_at ?? new Date().toISOString();

  const deriveDisplayType = (p: Post): DisplayPostType => {
    // Explicit metadata first (future friendly) - optional-safe
    const metaType =
      p.metadata?.type ??
      p.metadata?.intent ??
      p.metadata?.kind ??
      p.metadata?.postType ??
      null;
    if (metaType === 'question') return 'question';
    if (metaType === 'praise') return 'praise';

    // Strong types from backend - optional-safe
    const postType = p.post_type;
    if (postType === 'poll') return 'poll';
    if (postType === 'event') return 'event';
    if (postType === 'media') return 'media';
    if (postType === 'article') return 'article';
    if (postType === 'announcement') return 'announcement';

    const title = (p.title ?? '').trim();
    const body = (p.content ?? '').toLowerCase();

    // Question heuristic: title ends with ? or contains '?' and not a poll
    // Since we already checked for 'poll' above, if we reach here, it's not a poll
    if (title.endsWith('?') || title.includes('?')) {
      return 'question';
    }

    // Praise heuristic: common praise language
    if (
      /kudos|thank you|thanks|shout[- ]?out|appreciat(e|ion)|praise/i.test(
        title || body
      )
    ) {
      return 'praise';
    }

    // Default discussion
    return 'discussion';
  };

  const displayType = deriveDisplayType(post);

  const getPostTypeBadge = (type: DisplayPostType) => {
    const badges: Record<DisplayPostType, string> = {
      question: 'bg-blue-50 text-blue-700 border border-blue-200',
      discussion: 'bg-gray-100 text-gray-800 border border-transparent',
      praise: 'bg-purple-50 text-purple-700 border border-purple-200',
      poll: 'bg-teal-50 text-teal-700 border border-teal-200',
      event: 'bg-green-50 text-green-700 border border-green-200',
      media: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      article: 'bg-orange-50 text-orange-700 border border-orange-200',
      announcement: 'bg-red-50 text-red-700 border border-red-200'
    };
    return badges[type] || badges.discussion;
  };

  const getWrapperClassesForType = (type: DisplayPostType) => {
    switch (type) {
      case 'question':
        return 'border-blue-200';
      case 'praise':
        return 'border-purple-200';
      case 'poll':
        return 'border-teal-200';
      case 'event':
        return 'border-green-200';
      default:
        return 'border-gray-200';
    }
  };

  const getBadgeLabel = (type: DisplayPostType) => {
    switch (type) {
      case 'question':
        return 'QUESTION';
      case 'discussion':
        return 'DISCUSSION';
      case 'praise':
        return 'PRAISE';
      case 'poll':
        return 'POLL';
      case 'event':
        return 'EVENT';
      case 'media':
        return 'MEDIA';
      case 'article':
        return 'ARTICLE';
      case 'announcement':
        return 'ANNOUNCEMENT';
      default:
        return 'POST';
    }
  };

  // Share is now handled by ShareDropdown component

  const isQuestion = displayType === 'question';

  // Optional-safe content processing
  const contentText = (post.content ?? '').replace(/<[^>]*>/g, '');
  const hasLongContent = contentText.length > 200;
  const displayContent = expanded || !hasLongContent 
    ? contentText 
    : contentText.substring(0, 200) + '...';

  return (
    <div
      className={cn(
        'bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200',
        getWrapperClassesForType(displayType)
      )}
    >
      {/* Post Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-dq-navy/15 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-dq-navy font-semibold text-sm">
              {safeAuthor.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {post.created_by ? (
                <button
                  onClick={() => navigate(`/communities/profile/${post.created_by}`)}
                  className="font-semibold text-gray-900 hover:text-dq-navy transition-colors text-sm"
                >
                  {safeAuthor}
                </button>
              ) : (
                <span className="font-semibold text-gray-900 text-sm">
                  {safeAuthor}
                </span>
              )}
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.1em]',
                  getPostTypeBadge(displayType)
                )}
              >
                {getBadgeLabel(displayType)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              {post.community_id ? (
                <button
                  onClick={() => navigate(`/communities/community/${post.community_id}`)}
                  className="hover:text-dq-navy transition-colors"
                >
                  {safeCommunity}
                </button>
              ) : (
                <span>{safeCommunity}</span>
              )}
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(safeCreatedAt), { addSuffix: true })}
              </span>
              {viewCount > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1 group relative">
                    <Eye className="h-3 w-3" />
                    <span>Seen by {viewCount}</span>
                    {recentViewers.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <div className="px-2 py-1.5 text-xs font-semibold text-gray-700 border-b">
                            Recent viewers
                          </div>
                          {recentViewers.map((viewer) => (
                            <DropdownMenuItem key={viewer.id} className="text-xs">
                              {viewer.username}
                            </DropdownMenuItem>
                          ))}
                          {viewCount > recentViewers.length && (
                            <div className="px-2 py-1.5 text-xs text-gray-500">
                              +{viewCount - recentViewers.length} more
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-5 pb-3">
        <h3
          className={cn(
            'mb-3 text-base font-bold leading-snug',
            isQuestion
              ? 'text-blue-900'
              : 'text-gray-900'
          )}
        >
          {safeTitle}
        </h3>
        
        {/* Check if content has media */}
        {(() => {
          const postType = post.post_type ?? null;
          const postContent = post.content ?? '';
          const hasMedia = postType === 'media' || 
                          (postContent && (postContent.includes('<div class="media-content">') || 
                                           postContent.includes('<img') ||
                                           postContent.match(/<img[^>]+src/i)));
          
          if (hasMedia) {
            return (
              <div className="mt-2">
                <PostCardMedia post={post as any} />
                {contentText && !postContent.includes('<div class="media-content">') && !postContent.includes('<img') && (
                  <div className="mt-3">
                    <p className="text-gray-700 leading-relaxed text-sm">{contentText}</p>
                  </div>
                )}
              </div>
            );
          } else if (contentText) {
            return (
              <div>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {displayContent}
                </p>
                {hasLongContent && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-sm text-dq-navy hover:text-[#13285A] font-medium"
                  >
                    {expanded ? 'See less' : 'See more'}
                  </button>
                )}
              </div>
            );
          }
          return null;
        })()}
        
        {/* Event specific content */}
        {post.post_type === 'event' && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-4 text-sm text-green-800">
              {post.event_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.event_date).toLocaleDateString()}</span>
                </div>
              )}
              {post.event_location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{post.event_location}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Actions - Viva Engage Layout */}
      <div className="px-5 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left: Action Buttons */}
          <div className="flex items-center gap-5">
            <CommunityReactions
              postId={post.id}
              communityId={post.community_id ?? undefined}
              isMember={isMember || false}
              onReactionChange={() => {
                onActionComplete?.();
                refetchReactionSummary();
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                commentsRef.current?.focusInput();
              }}
              className={cn(
                'flex items-center gap-1.5 transition-colors text-sm',
                isQuestion
                  ? 'text-blue-600 hover:text-blue-800'
                  : 'text-gray-600 hover:text-dq-navy'
              )}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">
                {isQuestion ? 'Answer' : 'Comment'}
              </span>
            </button>
            <ShareDropdown
              postId={post.id}
              postTitle={safeTitle}
              postContent={safeContent}
              communityName={safeCommunity}
              authorName={safeAuthor}
            />
          </div>

          {/* Right: Reaction Summary (Non-interactive) */}
          <div className="flex items-center">
            <ReactionSummary topReaction={reactionSummary} />
          </div>
        </div>
      </div>

      {/* Comments Section - Always visible */}
      <div className="px-5 pb-5 bg-gray-50/50">
        <CommunityComments
          ref={commentsRef}
          postId={post.id}
          communityId={post.community_id ?? ''}
          isMember={isMember || false}
          onCommentAdded={() => {
            onActionComplete?.();
          }}
        />
      </div>
    </div>
  );
}