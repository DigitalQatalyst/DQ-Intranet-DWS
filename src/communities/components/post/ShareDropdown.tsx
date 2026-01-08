import React, { useState, useRef, useEffect } from 'react';
import { Share2, Link2, MessageSquare, Users, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/communities/components/ui/dropdown-menu';

interface ShareDropdownProps {
  postId: string;
  postTitle: string;
  postContent: string;
  communityName: string;
  authorName: string;
  postUrl?: string;
}

export const ShareDropdown: React.FC<ShareDropdownProps> = ({
  postId,
  postTitle,
  postContent,
  communityName,
  authorName,
  postUrl
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    try {
      const url = postUrl || `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
      setOpen(false);
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleShareToStoryline = () => {
    // Navigate to storyline/share page with post data
    navigate(`/storyline/share?postId=${postId}`);
    setOpen(false);
  };

  const handleShareToCommunity = () => {
    // Navigate to community selector with post data
    navigate(`/share/community?postId=${postId}`);
    setOpen(false);
  };

  const handleShareToPrivateMessage = () => {
    // Navigate to PM composer with post data
    navigate(`/messages/compose?sharePostId=${postId}`);
    setOpen(false);
  };

  const handleNativeShare = async () => {
    try {
      const url = postUrl || `${window.location.origin}/post/${postId}`;
      const text = `${postTitle}\n\n${postContent.substring(0, 200)}...`;
      
      if (navigator.share) {
        await navigator.share({
          title: postTitle,
          text: text,
          url: url
        });
        setOpen(false);
      } else {
        // Fallback to copy link
        handleCopyLink();
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback to copy link
        handleCopyLink();
      }
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Share2 className="h-4 w-4" />
          <span className="font-medium">Share</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNativeShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share via...
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareToStoryline}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Share to storyline
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareToCommunity}>
          <Users className="h-4 w-4 mr-2" />
          Share to community
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareToPrivateMessage}>
          <Send className="h-4 w-4 mr-2" />
          Share to private message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

