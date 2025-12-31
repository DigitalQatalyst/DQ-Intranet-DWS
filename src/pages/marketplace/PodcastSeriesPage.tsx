import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Radio, Clock, Calendar, Play, Pause, Plus, ArrowUpDown, ChevronDown, Share2, Download, Bookmark, HomeIcon, ChevronRightIcon, BookmarkIcon } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { fetchAllNews } from '@/services/mediaCenterService';

const PODCAST_IMAGE =
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1600&q=80';

const formatDate = (input: string) => {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDuration = (readingTime?: string): string => {
  if (!readingTime) return '12 min';
  const durationMap: Record<string, string> = {
    '<5': '5 min',
    '5–10': '8 min',
    '10–20': '15 min',
    '20+': '20 min'
  };
  return durationMap[readingTime] || '12 min';
};

const formatListens = (views: number): string => {
  if (views >= 1000) {
    const kValue = (views / 1000).toFixed(1);
    // Remove trailing .0 if present
    return `${kValue.replace(/\.0$/, '')}k listens`;
  }
  return `${views} listens`;
};

export default function PodcastSeriesPage() {
  const location = useLocation();
  const [episodes, setEpisodes] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'latest' | 'most-listened'>('latest');
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Expanded episode state
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<Set<string>>(new Set());
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // Get tab parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab') || 'podcasts';

  // Load saved episodes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('podcast-saved-episodes');
    if (saved) {
      try {
        const savedIds = JSON.parse(saved);
        setSavedEpisodes(new Set(savedIds));
      } catch (e) {
        console.error('Error loading saved episodes:', e);
      }
    }
  }, []);

  // Save episodes to localStorage whenever savedEpisodes changes
  useEffect(() => {
    if (savedEpisodes.size > 0) {
      localStorage.setItem('podcast-saved-episodes', JSON.stringify(Array.from(savedEpisodes)));
    } else {
      localStorage.removeItem('podcast-saved-episodes');
    }
  }, [savedEpisodes]);

  React.useEffect(() => {
    const loadEpisodes = async () => {
      try {
        const allNews = await fetchAllNews();
        const podcastEpisodes = allNews.filter(
          (item) => item.format === 'Podcast' || item.tags?.some((tag) => tag.toLowerCase().includes('podcast'))
        );
        setEpisodes(podcastEpisodes);
      } catch (error) {
        console.error('Failed to load episodes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEpisodes();
  }, []);

  const filteredAndSortedEpisodes = useMemo(() => {
    let filtered = [...episodes];

    // Apply duration filter
    if (durationFilter !== 'all') {
      filtered = filtered.filter((episode) => {
        const duration = episode.readingTime;
        if (durationFilter === 'short') return duration === '<5' || duration === '5–10';
        if (durationFilter === 'medium') return duration === '10–20';
        if (durationFilter === 'long') return duration === '20+';
        return true;
      });
    }

    // Apply sorting
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'most-listened') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return filtered;
  }, [episodes, sortBy, durationFilter]);

  const latestEpisode = episodes.length > 0 ? episodes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  const averageDuration = episodes.length > 0
    ? Math.round(episodes.reduce((sum, ep) => {
        const dur = formatDuration(ep.readingTime);
        const minutes = parseInt(dur.replace(' min', '')) || 13;
        return sum + minutes;
      }, 0) / episodes.length)
    : 13;

  // Audio player event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedData = () => {
      updateDuration();
    };
    const handleCanPlay = () => {
      updateDuration();
    };

    // Update time more frequently for smoother progress
    const timeInterval = setInterval(updateTime, 100);

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      clearInterval(timeInterval);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const handlePlayEpisode = async (episode: NewsItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!episode.audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    // If clicking the same episode, toggle play/pause
    if (currentlyPlaying === episode.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
      return;
    }

    // Play new episode
    try {
      audio.src = episode.audioUrl;
      setCurrentlyPlaying(episode.id);
      setCurrentTime(0);
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading/playing audio:', error);
    }
  };

  const handlePlayLatest = () => {
    if (latestEpisode) {
      handlePlayEpisode(latestEpisode);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleEpisodeCardClick = (episodeId: string, e: React.MouseEvent) => {
    // Don't expand if clicking the play button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setExpandedEpisode(expandedEpisode === episodeId ? null : episodeId);
  };

  // Share functionality
  const handleShare = async (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/marketplace/news/${episode.id}`;
    const shareData = {
      title: episode.title,
      text: episode.excerpt || '',
      url: shareUrl,
    };

    try {
      // Try Web Share API first (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareSuccess(episode.id);
        setTimeout(() => setShareSuccess(null), 2000);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(episode.id);
        setTimeout(() => setShareSuccess(null), 2000);
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback to clipboard if Web Share fails
        try {
          await navigator.clipboard.writeText(shareUrl);
          setShareSuccess(episode.id);
          setTimeout(() => setShareSuccess(null), 2000);
        } catch (clipboardError) {
          console.error('Error copying to clipboard:', clipboardError);
        }
      }
    }
  };

  // Download functionality
  const handleDownload = async (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!episode.audioUrl) {
      alert('Audio file not available for download');
      return;
    }

    try {
      // Fetch the audio file
      const response = await fetch(episode.audioUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${episode.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Failed to download audio file. Please try again.');
    }
  };

  // Save/Bookmark functionality
  const handleSave = (episode: NewsItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episode.id)) {
        newSet.delete(episode.id);
      } else {
        newSet.add(episode.id);
      }
      return newSet;
    });
  };

  // Parse bold text in markdown
  const parseBold = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<strong key={key++}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Render podcast content (Focus of the Episode and Intended Impact)
  const renderEpisodeContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let keyCounter = 0;
    let firstHeadingSkipped = false;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paraText = currentParagraph.join(' ').trim();
        if (paraText) {
          elements.push(
            <p key={keyCounter++} className="text-gray-700 text-sm leading-relaxed mb-4">
              {parseBold(paraText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (!trimmed) {
        flushParagraph();
        continue;
      }

      // Skip the first heading (main title)
      if (!firstHeadingSkipped && trimmed.match(/^#+\s+/)) {
        firstHeadingSkipped = true;
        continue;
      }

      // Check for headings (## or ###)
      const headingMatch = trimmed.match(/^(##+)\s+(.+)$/);
      if (headingMatch) {
        flushParagraph();
        const level = headingMatch[1].length;
        let headingText = headingMatch[2].trim();
        
        const normalizedHeading = headingText.toLowerCase();
        const isFocusOfEpisode = normalizedHeading.includes('focus of the episode') || 
                                 normalizedHeading.includes('focus of episode') ||
                                 normalizedHeading.includes('goal of this episode') ||
                                 normalizedHeading.includes('goal of episode');
        const isIntendedImpact = normalizedHeading.includes('intended impact');
        
        // Only show Focus of the Episode and Intended Impact
        if (!isFocusOfEpisode && !isIntendedImpact) {
          continue;
        }
        
        const titleCaseHeading = headingText
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        if (level === 2) {
          elements.push(
            <h3 key={keyCounter++} className="text-lg font-bold text-gray-900 mt-6 mb-4 pl-4 relative">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent"></span>
              {titleCaseHeading}
            </h3>
          );
        } else {
          elements.push(
            <h4 key={keyCounter++} className="text-base font-bold text-gray-900 mt-4 mb-3">
              {titleCaseHeading}
            </h4>
          );
        }
        continue;
      }

      // Regular paragraph text
      currentParagraph.push(trimmed);
    }

    flushParagraph();
    return elements;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center text-gray-600">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
      
      <main className="flex-1">
        {/* Breadcrumb Navigation and Action Buttons */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1A2E6E]">
                <HomeIcon size={16} />
                Home
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <Link 
                to={`/marketplace/opportunities?tab=${tabParam}`}
                className="hover:text-[#1A2E6E]"
              >
                DQ Media Center
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-900 line-clamp-1">Action-Solver Podcast</span>
            </nav>
            <div className="flex gap-2 text-sm text-gray-500">
              <button 
                onClick={() => {
                  const shareUrl = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: 'Action-Solver Podcast', url: shareUrl }).catch(() => {
                      navigator.clipboard.writeText(shareUrl);
                    });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                  }
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]"
              >
                <Share2 size={16} />
                Share
              </button>
              <button 
                onClick={() => {
                  const saved = localStorage.getItem('podcast-series-saved');
                  const isSaved = saved === 'true';
                  localStorage.setItem('podcast-series-saved', (!isSaved).toString());
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]"
              >
                <BookmarkIcon size={16} />
                Save
              </button>
            </div>
          </div>
        </section>

        {/* Hero Section with Blurred Background - Matching Blog Style - Full Width */}
        <section className="relative min-h-[500px] md:min-h-[600px] flex items-center" aria-labelledby="podcast-title">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${PODCAST_IMAGE})`,
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/80" />
          
          {/* Content */}
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-24 w-full">
            <div className="max-w-4xl">
              {/* Category Tag */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white mb-4">
                Action-Solver Series
              </span>
              
              {/* Title */}
              <h1 id="podcast-title" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Action-Solver Podcast
              </h1>

              {/* Description */}
              <p className="text-white/90 text-lg mb-6">
                Short conversations that solve real work problems at DQ
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Radio size={16} />
                  <span>{episodes.length} episodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>~{averageDuration} min avg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Weekly</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePlayLatest}
                  className="flex items-center gap-2 rounded-lg bg-[#030f35] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  <Play size={20} />
                  <span>Play Latest Episode</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 font-semibold text-white transition hover:bg-white/20">
                  <Plus size={20} />
                  <span>Follow</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-8">

          {/* About Section */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-gray-900">About</h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              The Action-Solver Podcast delivers concise, actionable insights for busy professionals. Each episode tackles a specific challenge faced by DQ teams, providing practical frameworks and strategies you can implement immediately. Perfect for your commute, lunch break, or quick learning moment.
            </p>
            <button className="text-sm text-[#030f35] hover:opacity-80 transition-colors">
              Read more
            </button>
            
            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                GHC
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Execution
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Leadership
              </span>
            </div>

            {/* Hosted By */}
            
          </div>

          {/* Episodes Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Episodes ({filteredAndSortedEpisodes.length})</h2>
              
              {/* Sorting and Filtering */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy('latest')}
                  className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    sortBy === 'latest'
                      ? 'border-gray-300 bg-gray-100 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ArrowUpDown size={14} />
                  Latest
                </button>
                <button
                  onClick={() => setSortBy('most-listened')}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    sortBy === 'most-listened'
                      ? 'border-gray-300 bg-gray-100 text-gray-900'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Most Listened
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDurationFilter('all')}
                    className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      durationFilter === 'all'
                        ? 'border-gray-300 bg-gray-100 text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronDown size={14} />
                    All
                  </button>
                  <button
                    onClick={() => setDurationFilter('short')}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      durationFilter === 'short'
                        ? 'border-gray-300 bg-gray-100 text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Short
                  </button>
                  <button
                    onClick={() => setDurationFilter('medium')}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      durationFilter === 'medium'
                        ? 'border-gray-300 bg-gray-100 text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setDurationFilter('long')}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      durationFilter === 'long'
                        ? 'border-gray-300 bg-gray-100 text-gray-900'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Long
                  </button>
                </div>
              </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
              {filteredAndSortedEpisodes.map((episode, index) => {
                // EP 1 is the latest when sorted by latest, otherwise use reverse index
                const isNew = index === 0 && sortBy === 'latest';
                const episodeNumber = sortBy === 'latest' 
                  ? filteredAndSortedEpisodes.length - index 
                  : index + 1;
                
                const isCurrentlyPlaying = currentlyPlaying === episode.id;
                
                const isExpanded = expandedEpisode === episode.id;
                
                return (
                  <div
                    key={episode.id}
                    className={`group flex flex-col gap-4 rounded-lg border p-4 transition ${
                      isCurrentlyPlaying
                        ? 'border-[#030f35] bg-[#030f35]/5'
                        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={(e) => handlePlayEpisode(episode, e)}
                        className={`mt-1 flex-shrink-0 rounded-full p-2 transition ${
                          isCurrentlyPlaying
                            ? 'bg-[#030f35] text-white'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-[#030f35] group-hover:text-white'
                        }`}
                      >
                        {isCurrentlyPlaying && isPlaying ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={(e) => handleEpisodeCardClick(episode.id, e)}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">EP {episodeNumber}</span>
                          {isNew && (
                            <span className="rounded-full bg-[#030f35] px-2 py-0.5 text-xs font-semibold text-white">
                              New
                            </span>
                          )}
                        </div>
                        <h3 className={`mb-1 text-lg font-semibold transition ${
                          isCurrentlyPlaying
                            ? 'text-gray-900'
                            : 'text-gray-900 group-hover:text-[#030f35]'
                        }`}>
                          {episode.title}
                        </h3>
                        {!isExpanded && (
                          <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                            {episode.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatDuration(episode.readingTime)}</span>
                          <span>{formatDate(episode.date)}</span>
                          <span>{formatListens(episode.views || 0)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                          <button 
                            onClick={(e) => handleShare(episode, e)}
                            className={`inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 transition-colors ${
                              shareSuccess === episode.id 
                                ? 'bg-green-50 border-green-300 text-green-700' 
                                : 'hover:bg-gray-50'
                            }`}
                            title="Share episode"
                          >
                            <Share2 size={14} />
                            <span>{shareSuccess === episode.id ? 'Copied!' : 'Share'}</span>
                          </button>
                          <button 
                            onClick={(e) => handleDownload(episode, e)}
                            disabled={!episode.audioUrl}
                            className={`inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 transition-colors ${
                              !episode.audioUrl 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-gray-50'
                            }`}
                            title={episode.audioUrl ? 'Download episode' : 'Audio not available'}
                          >
                            <Download size={14} />
                            <span>Download</span>
                          </button>
                          <button 
                            onClick={(e) => handleSave(episode, e)}
                            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
                              savedEpisodes.has(episode.id)
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'border-gray-300 bg-white hover:bg-gray-50'
                            }`}
                            title={savedEpisodes.has(episode.id) ? 'Remove from saved' : 'Save episode'}
                          >
                            <Bookmark size={14} fill={savedEpisodes.has(episode.id) ? 'currentColor' : 'none'} />
                            <span>{savedEpisodes.has(episode.id) ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>
                        
                        {/* Audio Player Controls - shown when this episode is playing */}
                        {isCurrentlyPlaying && (
                          <div className="mt-4 w-full space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#030f35]"
                              />
                              <span className="text-xs text-gray-500">
                                {formatTime(currentTime)} / {formatTime(duration)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded Content */}
                    {isExpanded && episode.content && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="prose prose-sm max-w-none">
                          {renderEpisodeContent(episode.content)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

