import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import { safeFetch } from '@/communities/utils/safeFetch';
import { Button } from '@/communities/components/ui/button';
import { Textarea } from '@/communities/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/communities/components/ui/avatar';
import { GradientAvatar } from '@/communities/components/ui/gradient-avatar';
import { ChevronDown, ChevronUp, Send, Reply, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { SignInModal } from '@/communities/components/auth/SignInModal';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string | null;
  content: string;
  content_html?: string;
  created_at: string;
  updated_at: string;
  status: string;
  author_username?: string;
  author_avatar?: string;
  replies?: Comment[];
}

interface CommunityCommentsProps {
  postId: string;
  communityId: string;
  isMember: boolean;
  onCommentAdded?: () => void;
}

export interface CommunityCommentsRef {
  focusInput: () => void;
}

const CommunityCommentsComponent = (props: CommunityCommentsProps, ref: React.ForwardedRef<CommunityCommentsRef>) => {
  const { postId, communityId, isMember, onCommentAdded } = props;
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true); // Always expanded by default
  const [isReplying, setIsReplying] = useState(false); // Viva Engage: reply editor closed by default
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const replyBarRef = useRef<HTMLDivElement>(null);

  // Expose focusInput method to parent - scrolls to replies and opens editor
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      setIsReplying(true);
      // Scroll to reply bar and focus after a brief delay
      setTimeout(() => {
        replyBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        replyInputRef.current?.focus();
      }, 100);
    }
  }));

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // Fetch all comments from new table (including parent_id for threading)
      const query = supabase
        .from('community_post_comments_new')
        .select('id, post_id, user_id, parent_id, content, created_at, updated_at, status')
        .eq('post_id' as any, postId)
        .eq('status', 'active')
        .order('created_at', { ascending: true });

      const [data, error] = await safeFetch(query);

      if (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
        setLoading(false);
        return;
      }

      if (data && Array.isArray(data)) {
        // Fetch user details for each comment
        const userIds = [...new Set(data.map((c: any) => c.user_id))];
        const userDetailsMap = new Map();
        
        // Fetch user details from users_local table
        // Note: users_local.id references auth.users.id, so they should match
        for (const userId of userIds) {
          const [userData] = await safeFetch(
            supabase
              .from('users_local')
              .select('id, username, avatar_url')
              .eq('id', userId)
              .maybeSingle()
          );
          
          if (userData) {
            userDetailsMap.set(userId, userData);
          } else {
            // Fallback: create a basic user object if not found in users_local
            // This can happen if the user was created directly in auth.users
            userDetailsMap.set(userId, {
              id: userId,
              username: 'User',
              avatar_url: null
            });
          }
        }

        // Build threaded structure: separate top-level comments from replies
        const commentsWithUsers = data.map((comment: any) => ({
          ...comment,
          author_username: userDetailsMap.get(comment.user_id)?.username || 'Unknown',
          author_avatar: userDetailsMap.get(comment.user_id)?.avatar_url
        }));

        const topLevelComments = commentsWithUsers.filter((c: Comment) => !c.parent_id);
        const replies = commentsWithUsers.filter((c: Comment) => c.parent_id);
        
        // Attach replies to their parent comments
        const threadedComments = topLevelComments.map((comment: Comment) => ({
          ...comment,
          replies: replies
            .filter((r: Comment) => r.parent_id === comment.id)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        })).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        setComments(threadedComments);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: string | null = null) => {
    console.log('handleSubmitReply called:', { parentId, replyContent: replyContent.trim(), isAuthenticated, isMember });
    
    if (!replyContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    // User should be authenticated via Azure AD at app level
    if (!user) {
      toast.error('Please wait for authentication to complete');
      return;
    }

    // Check if user is a member of the community (warn but don't block - RLS will enforce)
    if (!isMember) {
      console.warn('⚠️ User may not be a member, but attempting comment anyway (RLS will enforce)');
    }

    console.log('🔄 Starting comment submission...');
    setSubmitting(true);
    try {
      // Get user ID from Azure AD authentication
      if (!user.id) {
        console.error('❌ User ID not available');
        toast.error('Unable to verify authentication. Please refresh the page.');
        setSubmitting(false);
        return;
      }
      
      const authUserId = user.id;
      console.log('✅ User ID from session:', authUserId);
      console.log('✅ Submitting comment:', { postId, userId: authUserId, contentLength: replyContent.trim().length });
      
      // Verify post exists in posts_v2 (required by foreign key)
      const { data: postCheck } = await supabase
        .from('posts_v2')
        .select('id')
        .eq('id' as any, postId)
        .single();
      
      if (!postCheck) {
        console.error('❌ Post not found in posts_v2 table. Post ID:', postId);
        toast.error('Post not found. Please refresh the page.');
        setSubmitting(false);
        return;
      }
      console.log('✅ Post verified in posts_v2');

      // Insert into new comments table using user_id (must match auth.uid())
      // Include parent_id if this is a reply to another comment
      const commentData = {
        post_id: postId,
        user_id: authUserId,
        content: replyContent.trim(),
        status: 'active',
        ...(parentId ? { parent_id: parentId } : {})
      };
      
      console.log('🔄 Attempting to insert comment...', commentData);
      console.log('🔍 Verifying user_id format:', {
        userId: authUserId,
        userIdType: typeof authUserId,
        userIdLength: authUserId?.length,
        isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(authUserId || '')
      });

      const query = supabase
        .from('community_post_comments_new')
        .insert(commentData as any)
        .select()
        .single();

      const [data, error] = await safeFetch(query);
      console.log('📥 Insert response:', { 
        data, 
        error,
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint
      });

      if (error) {
        console.error('❌ Comment insert error:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          commentData
        });
        throw error;
      }

      console.log('✅ Comment created successfully:', data);
      toast.success('Comment added');
      setReplyContent('');
      setReplyingTo(null);
      setIsReplying(false); // Collapse reply editor after submitting
      fetchComments();
      onCommentAdded?.();
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      const errorMessage = err.message || err.details || 'Unknown error occurred';
      toast.error(`Failed to add comment: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const ReplyCard: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => {
    const [expanded, setExpanded] = useState(false);
    const [isReplyingToThis, setIsReplyingToThis] = useState(false);
    const contentText = comment.content?.replace(/<[^>]*>/g, '') || comment.content || '';
    const hasLongContent = contentText.length > 200;
    const displayContent = expanded || !hasLongContent 
      ? contentText 
      : contentText.substring(0, 200) + '...';

    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 mb-2 ml-2">
        <div className="flex gap-2.5">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.author_avatar || undefined} />
            <AvatarFallback className="relative overflow-hidden bg-dq-navy/15">
              <GradientAvatar seed={comment.user_id} className="absolute inset-0" />
              <span className="relative z-10 text-white font-semibold text-xs">
                {comment.author_username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {/* Author name + timestamp */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-gray-900">
                {comment.author_username}
              </span>
              <span className="text-[10px] text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            
            {/* Reply body with "see more" */}
            <div className="text-xs text-gray-700 leading-relaxed mb-2.5">
              {comment.content_html && !hasLongContent ? (
                <div dangerouslySetInnerHTML={{ __html: comment.content_html }} />
              ) : (
                <p className="whitespace-pre-wrap">{displayContent}</p>
              )}
              {hasLongContent && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-1.5 text-xs text-dq-navy hover:text-[#13285A] font-medium"
                >
                  {expanded ? 'See less' : 'See more'}
                </button>
              )}
            </div>
            
            {/* Actions: Like, Reply, Share */}
            <div className="flex items-center gap-4 pt-1.5 border-t border-gray-200">
              <button className="text-xs text-gray-600 hover:text-dq-navy transition-colors font-medium">
                Like
              </button>
              <button 
                onClick={() => {
                  setIsReplying(true);
                  setReplyingTo(comment.id);
                  setTimeout(() => {
                    replyInputRef.current?.focus();
                  }, 100);
                }}
                className="text-xs text-gray-600 hover:text-dq-navy transition-colors font-medium"
              >
                Reply
              </button>
              <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComment = (comment: Comment) => {
    return (
      <div key={comment.id}>
        <ReplyCard comment={comment} />
        {/* Render nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-6 mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <ReplyCard key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const commentCount = comments.length;
  const shouldCollapse = commentCount >= 5; // Only collapse if 5+ replies
  const showCollapseToggle = shouldCollapse && comments.length > 0;

  return (
    <div className="mt-3">
      {/* Reply count header - only show collapse toggle for long threads */}
      {showCollapseToggle && (
        <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-dq-navy transition-colors"
        >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            <span>{commentCount} {commentCount === 1 ? 'reply' : 'replies'}</span>
        </button>
      </div>
      )}

      {/* Comments List - Show by default, collapse only for long threads */}
      {loading ? (
        <div className="text-center py-6 text-gray-500 text-xs">Loading replies...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-xs">
          No replies yet. Be the first to reply!
        </div>
      ) : (
        <div className="space-y-2">
          {(expanded || !shouldCollapse) ? (
            <>
              {comments.map(comment => renderComment(comment))}
            </>
          ) : (
            <div className="text-center py-3">
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-dq-navy hover:text-[#13285A] font-medium"
              >
                Show {commentCount} {commentCount === 1 ? 'reply' : 'replies'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Viva Engage-style Reply Bar - Always visible at bottom */}
      <div ref={replyBarRef} className="mt-4">
        {!isReplying ? (
          /* Compact Reply Bar (Default State) */
          <button
            type="button"
            onClick={() => {
              setIsReplying(true);
              setTimeout(() => {
                replyInputRef.current?.focus();
              }, 100);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              {isAuthenticated && user ? (
                <AvatarFallback className="relative overflow-hidden bg-dq-navy/15">
                  <GradientAvatar seed={user.id || 'default'} className="absolute inset-0" />
                  <span className="relative z-10 text-white font-semibold text-xs">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </AvatarFallback>
              ) : (
                <AvatarFallback className="bg-gray-200">
                  <span className="text-gray-500 text-xs">U</span>
                </AvatarFallback>
              )}
            </Avatar>
            <span className="flex-1 text-sm text-gray-500">
              Write a comment
            </span>
          </button>
        ) : (
          /* Expanded Reply Editor (On Click) */
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex gap-2.5">
                <Avatar className="h-8 w-8 flex-shrink-0">
                {isAuthenticated && user ? (
                  <AvatarFallback className="relative overflow-hidden bg-dq-navy/15">
                    <GradientAvatar seed={user.id || 'default'} className="absolute inset-0" />
                    <span className="relative z-10 text-white font-semibold text-xs">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-gray-200">
                    <span className="text-gray-500 text-xs">U</span>
                  </AvatarFallback>
                )}
                </Avatar>
                <div className="flex-1">
                  <Textarea
                  ref={replyInputRef}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply…"
                  className="min-h-[80px] text-sm mb-2 resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyContent('');
                      setReplyingTo(null);
                    }}
                    className="h-8 px-3 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(replyingTo)}
                    disabled={submitting || !replyContent.trim()}
                    className="bg-dq-navy hover:bg-[#13285A] text-white h-8 px-3 text-sm"
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    {submitting ? 'Posting...' : 'Reply'}
                  </Button>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
    </div>
  );
};

export const CommunityComments = forwardRef<CommunityCommentsRef, CommunityCommentsProps>(CommunityCommentsComponent);

CommunityComments.displayName = 'CommunityComments';

