import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Radio, Clock, Calendar, Play, Pause, Plus, ArrowUpDown, Share2, Download, Bookmark, HomeIcon, ChevronRightIcon, BookmarkIcon, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { fetchAllNews } from '@/services/mediaCenterService';
import { formatDateVeryShort, formatDuration, formatListens, formatTime } from '@/utils/newsUtils';
import { parseBold } from '@/utils/contentParsing';
import { Breadcrumb } from '@/components/media-center/shared/Breadcrumb';

const PODCAST_IMAGE =
  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=1600&q=80';

// Explicit canonical order of Action-Solver podcast episodes (EP1..EP10)
const PODCAST_EPISODE_ORDER: string[] = [
  'why-execution-beats-intelligence',
  'why-we-misdiagnose-problems',
  'turning-conversations-into-action',
  'why-tasks-dont-close-at-dq',
  'happy-talkers-why-talking-feels-productive',
  'execution-styles-why-teams-work-differently',
  'agile-the-dq-way-tasks-core-work-system',
  'leaders-as-multipliers-accelerate-execution',
  'energy-management-for-high-action-days',
  'execution-metrics-that-drive-movement',
];


export default function PodcastSeriesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'latest' | 'most-listened'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Expanded episode state
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);
  const [savedEpisodes, setSavedEpisodes] = useState<Set<string>>(new Set());
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [targetEpisodeId, setTargetEpisodeId] = useState<string | null>(null);

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
      } catch {
        // Error loading saved episodes - handled silently
      }
    }
  }, []);

  // When a target episode is specified and episodes are loaded, scroll to and expand it
  useEffect(() => {
    if (!targetEpisodeId || episodes.length === 0) return;
    if (!episodes.some((ep) => ep.id === targetEpisodeId)) return;

    setExpandedEpisode(targetEpisodeId);

    const el = document.getElementById(`episode-${targetEpisodeId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetEpisodeId, episodes]);

  // Save episodes to localStorage whenever savedEpisodes changes
  useEffect(() => {
    if (savedEpisodes.size > 0) {
      localStorage.setItem('podcast-saved-episodes', JSON.stringify(Array.from(savedEpisodes)));
    } else {
      localStorage.removeItem('podcast-saved-episodes');
    }
  }, [savedEpisodes]);

  // Track targeted episode from URL query (for deep links / search navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const episodeId = params.get('episode');
    setTargetEpisodeId(episodeId);
  }, [location.search]);

  React.useEffect(() => {
    const loadEpisodes = async () => {
      try {
        const allNews = await fetchAllNews();
        const podcastEpisodes = allNews.filter(
          (item) => item.format === 'Podcast' || item.tags?.some((tag) => tag.toLowerCase().includes('podcast'))
        );
        setEpisodes(podcastEpisodes);
      } catch {
        // Error loading episodes - handled by loading state
      } finally {
        setLoading(false);
      }
    };
    loadEpisodes();
  }, []);

  const filteredAndSortedEpisodes = useMemo(() => {
    let filtered = [...episodes];

    // Apply sorting
    if (sortBy === 'latest') {
      // Sort by explicit episode number (EP10 at top, EP1 at bottom)
      const orderMap = new Map<string, number>(
        PODCAST_EPISODE_ORDER.map((id, index) => [id, index + 1])
      );

      filtered.sort((a, b) => {
        const numA = orderMap.get(a.id) ?? 0;
        const numB = orderMap.get(b.id) ?? 0;

        if (numA !== numB) {
          // Higher episode number first
          return numB - numA;
        }

        // Fallback: newer date first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else if (sortBy === 'most-listened') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return filtered;
  }, [episodes, sortBy]);

  const episodeNumberMap = useMemo(() => {
    const map = new Map<string, number>();

    // Assign numbers based on the explicit canonical order first
    PODCAST_EPISODE_ORDER.forEach((id, index) => {
      if (episodes.some(ep => ep.id === id)) {
        map.set(id, index + 1);
      }
    });

    // If any additional podcast episodes exist, number them after the known series
    let nextNumber = PODCAST_EPISODE_ORDER.length + 1;
    episodes.forEach(ep => {
      if (!map.has(ep.id)) {
        map.set(ep.id, nextNumber++);
      }
    });

    return map;
  }, [episodes]);

  const latestEpisode = episodes.length > 0 ? episodes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
  const averageDuration = episodes.length > 0
    ? Math.round(episodes.reduce((sum, ep) => {
        const dur = formatDuration(ep.readingTime);
        const minutes = parseInt(dur.replace(' min', '')) || 13;
        return sum + minutes;
      }, 0) / episodes.length)
    : 13;

  // Audio player event handlers - re-run when currentlyPlaying changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isNaN(audio.currentTime) && isFinite(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      setCurrentTime(0);
    };
    const handlePlay = () => {
      setIsPlaying(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handleLoadedData = () => {
      updateDuration();
    };
    const handleCanPlay = () => {
      updateDuration();
    };
    const handleLoadedMetadata = () => {
      updateDuration();
    };
    const handleProgress = () => {
      // Update duration if available
      if (audio.buffered.length > 0 && audio.duration) {
        updateDuration();
      }
    };

    // Update time frequently for smooth progress bar
    const timeInterval = setInterval(() => {
      if (audio && !audio.paused && !audio.ended) {
        updateTime();
      }
    }, 100);

    // Add all event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('seeked', updateTime);

    // Initialize volume
    audio.volume = isMuted ? 0 : volume;

    // Initial duration check
    if (audio.readyState >= 1) {
      updateDuration();
    }

    return () => {
      clearInterval(timeInterval);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('seeked', updateTime);
    };
  }, [currentlyPlaying, volume, isMuted]); // Re-run when currentlyPlaying, volume, or mute state changes

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
        } catch {
          // Error playing audio - handled silently
        }
      }
      return;
    }

    // Play new episode
    try {
      // Reset time and duration
      setCurrentTime(0);
      setDuration(0);
      
      // Set source and load
      audio.src = episode.audioUrl;
      audio.load();
      
      setCurrentlyPlaying(episode.id);
      
      // Wait for metadata to load before playing
      audio.addEventListener('loadedmetadata', async () => {
        if (audio.duration) {
          setDuration(audio.duration);
        }
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }, { once: true });
      
      // Also try to play immediately if already loaded
      if (audio.readyState >= 2) {
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const handlePlayLatest = () => {
    if (latestEpisode) {
      handlePlayEpisode(latestEpisode);
    }
  };


  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    if (!isNaN(newTime) && isFinite(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeekMouseDown = () => {
    // Pause updates while dragging to prevent jitter
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(newTime) && isFinite(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      // Resume playing if it was playing before
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
  };

  const skipBackward = (seconds: number = 10) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - seconds);
  };

  const skipForward = (seconds: number = 10) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + seconds);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleEpisodeCardClick = (episodeId: string, e: React.MouseEvent) => {
    // Don't expand if clicking the play button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setExpandedEpisode(expandedEpisode === episodeId ? null : episodeId);
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return episodes.filter((episode) =>
      episode.title.toLowerCase().includes(query)
    );
  }, [episodes, searchQuery]);

  const handleSelectEpisodeFromSearch = (episodeId: string) => {
    setSearchQuery('');

    // Ensure URL always points to the series page with tab=podcasts & the specific episode
    const params = new URLSearchParams(location.search);
    params.set('tab', 'podcasts');
    params.set('episode', episodeId);

    navigate(`/marketplace/news/action-solver-podcast?${params.toString()}`);
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
        // Fallback to clipboard if Web Share fails
        try {
          await navigator.clipboard.writeText(shareUrl);
          setShareSuccess(episode.id);
          setTimeout(() => setShareSuccess(null), 2000);
        } catch {
          // Clipboard error - handled silently
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
    } catch {
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


  // Render podcast content (Focus of the Episode only - Intended Impact removed)
  const renderEpisodeContent = (content: string) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let keyCounter = 0;
    let firstHeadingSkipped = false;
    let inFocusSection = false;
    let shouldStop = false;

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
      if (shouldStop) break;
      
      const trimmed = line.trim();
      
      if (!trimmed) {
        if (inFocusSection) {
          flushParagraph();
        }
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
        const level = headingMatch[1].length;
        let headingText = headingMatch[2].trim();
        
        const normalizedHeading = headingText.toLowerCase();
        const isFocusOfEpisode = normalizedHeading.includes('focus of the episode') || 
                                 normalizedHeading.includes('focus of episode') ||
                                 normalizedHeading.includes('goal of this episode') ||
                                 normalizedHeading.includes('goal of episode');
        const isIntendedImpact = normalizedHeading.includes('intended impact');
        
        // If we encounter Intended Impact or any other heading after Focus section, stop processing
        if (inFocusSection && !isFocusOfEpisode) {
          flushParagraph();
          shouldStop = true;
          break;
        }
        
        // Only process Focus of the Episode section
        if (isFocusOfEpisode) {
          flushParagraph();
          inFocusSection = true;
          
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
        
        // Skip any other headings (including Intended Impact)
        if (!inFocusSection) {
          continue;
        }
      }

      // Only collect paragraph text if we're in the Focus section
      if (inFocusSection) {
        currentParagraph.push(trimmed);
      }
    }

    // Flush any remaining paragraph
    if (inFocusSection) {
      flushParagraph();
    }
    
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
      
      <main className={`flex-1 ${currentlyPlaying ? 'pb-20' : ''}`}>
        {/* Breadcrumb Navigation and Action Buttons */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb
              items={[
                {
                  href: `/marketplace/opportunities?tab=${tabParam}`,
                  label: 'DQ Media Center'
                },
                {
                  label: 'Action-Solver Podcast'
                }
              ]}
            />
            <div className="flex gap-2 text-sm text-gray-500">
              <button 
                type="button"
                onClick={() => {
                  const shareUrl = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: 'Action-Solver Podcast', url: shareUrl }).catch(() => {
                      navigator.clipboard.writeText(shareUrl).catch(() => {
                        // Clipboard error
                      });
                    });
                  } else {
                    navigator.clipboard.writeText(shareUrl).catch(() => {
                      // Clipboard error
                    });
                  }
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]"
              >
                <Share2 size={16} />
                Share
              </button>
              <button 
                type="button"
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
        <section className="relative min-h-[320px] md:min-h-[400px] flex items-center" aria-labelledby="podcast-title">
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
                  type="button"
                  onClick={handlePlayLatest}
                  className="flex items-center gap-2 rounded-lg bg-[#030f35] px-6 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  <Play size={20} />
                  <span>Play Latest Episode</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                >
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
              <div className="flex items-center gap-3">
                <div className="relative w-48">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search episodes"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#030f35]"
                  />
                  {searchQuery && searchResults.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => handleSelectEpisodeFromSearch(result.id)}
                          className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900 line-clamp-1">{result.title}</span>
                          <span className="text-xs text-gray-500">EP {episodeNumberMap.get(result.id)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                </div>
              </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
              {filteredAndSortedEpisodes.map((episode, index) => {
                // EP 1 is the latest when sorted by latest, otherwise use reverse index
                const isNew = index === 0 && sortBy === 'latest';
                const episodeNumber = episodeNumberMap.get(episode.id) ?? (
                  sortBy === 'latest'
                    ? filteredAndSortedEpisodes.length - index
                    : index + 1
                );
                
                const isCurrentlyPlaying = currentlyPlaying === episode.id;
                
                const isExpanded = expandedEpisode === episode.id;
                
                return (
                  <div
                    key={episode.id}
                    id={`episode-${episode.id}`}
                    className={`group flex flex-col gap-4 rounded-lg border p-4 transition ${
                      isCurrentlyPlaying
                        ? 'border-[#030f35] bg-[#030f35]/5 shadow-md'
                        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={(e) => handlePlayEpisode(episode, e)}
                        className={`mt-1 flex-shrink-0 rounded-full p-3 transition ${
                          isCurrentlyPlaying
                            ? 'bg-[#030f35] text-white shadow-lg'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-[#030f35] group-hover:text-white'
                        }`}
                      >
                        {isCurrentlyPlaying && isPlaying ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} />
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
                            ? 'text-[#030f35]'
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
                          <span>{formatDateVeryShort(episode.date)}</span>
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
      
      {/* Persistent Bottom Audio Player */}
      {currentlyPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#030f35] bg-gray-100 shadow-2xl">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Episode Info */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#030f35] bg-white">
                  <Radio size={20} className="text-[#030f35]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {episodes.find(e => e.id === currentlyPlaying)?.title || 'Unknown Episode'}
                  </p>
                  <p className="truncate text-xs text-gray-600">Action-Solver Series</p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => skipBackward(10)}
                  className="rounded-full border-2 border-[#030f35] p-2 text-[#030f35] hover:bg-[#030f35] hover:text-white transition-colors"
                  aria-label="Skip backward 10 seconds"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => {
                    const episode = episodes.find(e => e.id === currentlyPlaying);
                    if (episode) handlePlayEpisode(episode);
                  }}
                  className="rounded-full border-2 border-[#030f35] bg-[#030f35] p-3 text-white hover:opacity-90 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => skipForward(10)}
                  className="rounded-full border-2 border-[#030f35] p-2 text-[#030f35] hover:bg-[#030f35] hover:text-white transition-colors"
                  aria-label="Skip forward 10 seconds"
                >
                  <RotateCw size={18} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime || 0}
                  onChange={handleSeek}
                  onMouseDown={handleSeekMouseDown}
                  onMouseUp={handleSeekMouseUp}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg border border-[#030f35]/30 bg-gray-200 accent-[#030f35]"
                  style={{
                    background: `linear-gradient(to right, #030f35 0%, #030f35 ${((currentTime || 0) / (duration || 1)) * 100}%, #e5e7eb ${((currentTime || 0) / (duration || 1)) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <span className="text-xs text-gray-700 whitespace-nowrap font-medium">
                  {formatTime(currentTime || 0)} / {formatTime(duration || 0)}
                </span>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="rounded-full border-2 border-[#030f35] p-2 text-[#030f35] hover:bg-[#030f35] hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="h-1.5 w-20 cursor-pointer appearance-none rounded-lg border border-[#030f35]/30 bg-gray-200 accent-[#030f35]"
                  style={{
                    background: `linear-gradient(to right, #030f35 0%, #030f35 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

