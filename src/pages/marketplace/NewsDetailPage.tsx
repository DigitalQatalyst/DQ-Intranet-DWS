import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon, Share2, BookmarkIcon, Calendar, User, Building2, Heart, MessageCircle, FileText } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { fetchAllNews, fetchNewsById } from '@/services/mediaCenterService';

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const fallbackHero =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

const MEDIA_SEEN_STORAGE_KEY = 'dq-media-center-seen-items';

const markMediaItemSeen = (kind: 'news' | 'job', id: string) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(MEDIA_SEEN_STORAGE_KEY);
    let seen: { news: string[]; jobs: string[] } = { news: [], jobs: [] };
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<{ news: string[]; jobs: string[] }>;
      seen = {
        news: parsed.news ?? [],
        jobs: parsed.jobs ?? []
      };
    }

    const key = kind === 'news' ? 'news' : 'jobs';
    if (!seen[key].includes(id)) {
      seen[key] = [...seen[key], id];
      window.localStorage.setItem(MEDIA_SEEN_STORAGE_KEY, JSON.stringify(seen));
    }
  } catch {
    // Ignore storage errors
  }
};

// Generate a brief 4-paragraph overview for the details page
const buildOverview = (article: NewsItem & { content?: string }) => {
  const overview: string[] = [];
  
  // Check if this is the WFH Guidelines article
  const isWFHGuidelines = article.id === 'dq-wfh-guidelines' || 
                           article.title.toLowerCase().includes('wfh guidelines') ||
                           article.title.toLowerCase().includes('work from home');
  
  // Check if this is the Scrum Master structure article
  const isScrumMasterArticle = article.id === 'dq-scrum-master-structure-update' || 
                                article.title.toLowerCase().includes('scrum master structure');
  
  if (isWFHGuidelines) {
    // Paragraph 1: Introduction
    overview.push('The Work From Home (WFH) Guidelines provide a clear framework for how remote work is requested, approved, executed, and monitored across DQ, ensuring productivity, accountability, and culture remain intact while associates work remotely.');
    
    // Paragraph 2: Process summary - convert numbered list to brief paragraph
    if (article.content) {
      const processSteps: string[] = [];
      const lines = article.content.split('\n');
      let inProcessSection = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Detect the WFH Processes section
        if (trimmed.match(/^##+\s+.*[Ww]FH\s+[Pp]rocess/i) || trimmed.match(/^##+\s+.*[Pp]rocess/i)) {
          inProcessSection = true;
          continue;
        }
        
        // Stop at next major section
        if (inProcessSection && trimmed.match(/^##+\s+[^4]/)) {
          break;
        }
        
        // Extract numbered process steps
        if (inProcessSection && trimmed.match(/^\d+\.\s+/)) {
          const stepText = trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim();
          if (stepText.length > 20) {
            processSteps.push(stepText);
          }
        }
      }
      
      if (processSteps.length > 0) {
        // Convert steps to a brief summary paragraph capturing all key details
        const processSummary = `The WFH process begins with associates submitting requests at least 24 hours in advance via the HR Channel, including reason, dates, and expected working hours. Line Managers review and provide pre-approval based on operational needs, followed by HR final approval that verifies compliance and notifies all parties. On the WFH day, associates must create a thread in the HR Channel before work starts with daily actions and engagement links, clock in on DQ Shifts, and remain active on DQ Live24 throughout working hours. Associates must follow their day plan, provide regular updates, respond promptly, attend all calls, and at end of day post completed tasks, outstanding items, and blockers in the HR thread. HRA and Line Managers monitor adherence, and failure to post updates or remain active may result in the day being treated as unpaid and can lead to revocation of WFH privileges or performance review.`;
        overview.push(processSummary);
      } else {
        overview.push('The process requires associates to submit requests 24 hours in advance via the HR Channel with reason and dates, obtain Line Manager pre-approval and HR final approval, post daily action plans and engagement links before work starts, clock in on DQ Shifts and remain active on DQ Live24, execute work with regular updates and communication, and record deliverables at end of day. Failure to comply may result in unpaid workday treatment and revocation of WFH privileges.');
      }
    } else {
      overview.push('The process requires associates to submit requests 24 hours in advance, obtain necessary approvals, maintain visibility through DQ Live24, post daily updates, and comply with all monitoring requirements to ensure accountability and productivity.');
    }
    
    // Paragraph 3: Roles and responsibilities summary
    overview.push('Key roles include Associates who submit requests and maintain daily visibility, Line Managers who provide pre-approval and monitor deliverables, HR who provides final approval and ensures policy compliance, and HRA who oversees overall compliance and adherence to guidelines.');
    
    // Paragraph 4: Principles and tools
    overview.push('The guidelines are built on principles of transparency, accountability, equity, compliance, collaboration, and data security. Essential tools include DQ Live24 for visibility and communication, DQ Shifts for attendance tracking, and the HR Channel for requests and updates.');
  } else if (isScrumMasterArticle) {
    // First paragraph: Introduction about organizational optimization
    overview.push('As part of our organizational optimization, we are updating the leadership structure across functions to streamline responsibilities and enhance ownership.');
    
    // Second paragraph: Previous structure
    overview.push('Previously, our leadership structure included Sector Leads, Factory Leads, Tower Leads, and Scrum Masters. These have now been streamlined into 4 unified Scrum Master framework.');
    
    // Third paragraph: New structure introduction
    overview.push('DQ will now operate under four defined Scrum Master categories:');
    
    // Fourth paragraph: Extract and list the four categories from content
    const categories: string[] = [];
    if (article.content) {
      const lines = article.content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        // Look for headings that might be category names (H2 or H3 level)
        const headingMatch = trimmed.match(/^##+\s+(.+)$/);
        if (headingMatch) {
          const headingText = headingMatch[1].trim();
          // Check if it's a category heading (contains "Scrum Master" or specific patterns)
          if (headingText.includes('Scrum Master') || 
              headingText.includes('COE') || 
              headingText.includes('Delivery') || 
              headingText.includes('Working Room') || 
              headingText.includes('Unit')) {
            // Extract just the category name, removing any parenthetical notes
            const categoryName = headingText.split('(')[0].trim();
            if (categoryName && !categories.includes(categoryName)) {
              categories.push(categoryName);
            }
          }
        }
      }
    }
    
    // If we found categories, list them; otherwise use default
    if (categories.length > 0) {
      const categoryList = categories.slice(0, 4).join(', ');
      overview.push(categoryList + '.');
    } else {
      // Default categories if not found in content
      overview.push('COE Scrum Masters, Delivery Scrum Masters, Working Room Scrum Masters, and Unit Scrum Masters.');
    }
  } else {
    // For other articles, build a structured 4-paragraph overview
    
    // Paragraph 1: Brief introduction using excerpt or first meaningful content
    let introPara = '';
    if (article.excerpt && article.excerpt.length > 30) {
      introPara = article.excerpt;
      // Ensure it ends with proper punctuation
      if (!introPara.match(/[.!?]$/)) {
        introPara += '.';
      }
    } else if (article.content) {
      // Extract first meaningful paragraph from content
      const lines = article.content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        // Skip headings, empty lines, and list markers
        if (trimmed && !trimmed.match(/^#+\s+/) && !trimmed.match(/^[-*\d.]\s+/) && !trimmed.match(/^➜\s+/)) {
          // Remove markdown bold markers for cleaner text
          const cleanLine = trimmed.replace(/\*\*/g, '').replace(/\*/g, '');
          if (cleanLine.length > 50) {
            introPara = cleanLine;
            if (!introPara.match(/[.!?]$/)) {
              introPara += '.';
            }
            break;
          }
        }
      }
    }
    
    if (introPara) {
      overview.push(introPara);
    } else {
      // Default intro if nothing found
      overview.push('This announcement provides important information and updates that will impact our organization.');
    }
    
    // Paragraphs 2-4: Extract meaningful content sections
    if (article.content) {
      const lines = article.content.split('\n');
      const extractedSections: string[] = [];
      let currentSection = '';
      let inSection = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Skip empty lines
        if (!trimmed) {
          if (currentSection && currentSection.trim().length > 80) {
            extractedSections.push(currentSection.trim());
            currentSection = '';
            inSection = false;
          }
          continue;
        }
        
        // Check if this is a heading (H2 or H3) - start a new section
        const headingMatch = trimmed.match(/^##+\s+(.+)$/);
        if (headingMatch) {
          // Save previous section if it exists
          if (currentSection && currentSection.trim().length > 80) {
            extractedSections.push(currentSection.trim());
          }
          // Start new section with heading text
          const headingText = headingMatch[1].trim().replace(/\*\*/g, '').replace(/\*/g, '');
          currentSection = headingText + ': ';
          inSection = true;
          continue;
        }
        
        // Skip list markers but extract their content
        if (trimmed.match(/^[-*\d.]\s+/) || trimmed.match(/^➜\s+/)) {
          const listContent = trimmed.replace(/^[-*\d.]\s+/, '').replace(/^➜\s+/, '').trim();
          const cleanContent = listContent.replace(/\*\*/g, '').replace(/\*/g, '');
          if (cleanContent.length > 30) {
            if (currentSection) {
              currentSection += cleanContent + '. ';
            } else {
              currentSection = cleanContent + '. ';
            }
            inSection = true;
          }
          continue;
        }
        
        // Regular paragraph text
        if (trimmed && !trimmed.match(/^#+\s+/)) {
          const cleanText = trimmed.replace(/\*\*/g, '').replace(/\*/g, '').trim();
          if (cleanText.length > 30) {
            if (currentSection) {
              currentSection += cleanText + ' ';
            } else {
              currentSection = cleanText + ' ';
            }
            inSection = true;
          }
        }
      }
      
      // Add final section if exists
      if (currentSection && currentSection.trim().length > 80) {
        extractedSections.push(currentSection.trim());
      }
      
      // Add extracted sections to overview (ensure proper sentence endings)
      for (const section of extractedSections) {
        if (overview.length >= 4) break;
        
        let cleanSection = section.trim();
        // Ensure it ends with proper punctuation
        if (!cleanSection.match(/[.!?]$/)) {
          cleanSection += '.';
        }
        
        // Skip if too similar to intro or already added
        if (cleanSection.length > 50 && !overview.some(p => p.includes(cleanSection.substring(0, 30)))) {
          overview.push(cleanSection);
        }
      }
    }
    
    // Fill remaining slots with contextual default paragraphs
    const defaultParagraphs = [
      'These guidelines and procedures are designed to ensure consistency, fairness, and operational excellence across all teams and departments.',
      'Implementation of these updates will begin immediately, and we encourage all associates to familiarize themselves with the new requirements.',
      'For questions or clarifications regarding this announcement, please reach out to the relevant contact person listed above or your department lead.'
    ];
    
    while (overview.length < 4) {
      const defaultIndex = overview.length - 1;
      if (defaultIndex < defaultParagraphs.length) {
        overview.push(defaultParagraphs[defaultIndex]);
      } else {
        // Final fallback
        overview.push('We encourage all associates to review the details carefully and reach out with any questions or concerns.');
        break;
      }
    }
  }
  
  // Return exactly 4 paragraphs
  return overview.slice(0, 4);
};

// Parse bold text (**text** or **text**)
const parseBold = (text: string) => {
  const parts: (string | JSX.Element)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add bold text
    parts.push(<strong key={match.index} className="font-bold">{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

// Render full content for blog articles, preserving all formatting exactly as provided
const renderFullContent = (content: string) => {
  if (!content) return null;
  
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentParagraph: string[] = [];
  let listItems: string[] = [];
  let inList = false;
  let keyCounter = 0;

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

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={keyCounter++} className="list-disc list-inside space-y-2 mb-4 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-gray-700 text-sm leading-relaxed">
              {parseBold(item.trim())}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Empty line - flush current paragraph or list
    if (!trimmed) {
      if (inList) {
        flushList();
      } else {
        flushParagraph();
      }
      continue;
    }

    // Check for headings (## or ###)
    const headingMatch = trimmed.match(/^(##+)\s+(.+)$/);
    if (headingMatch) {
      flushList();
      flushParagraph();
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();
      if (level === 2) {
        elements.push(
          <h2 key={keyCounter++} className="text-xl font-bold text-gray-900 mt-6 mb-4">
            {parseBold(headingText)}
          </h2>
        );
      } else {
        elements.push(
          <h3 key={keyCounter++} className="text-lg font-bold text-gray-900 mt-6 mb-4">
            {parseBold(headingText)}
          </h3>
        );
      }
      continue;
    }

    // Check for list items (-, *, or numbered)
    const listMatch = trimmed.match(/^[-*]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      inList = true;
      listItems.push(listMatch[1]);
      continue;
    }

    // Regular paragraph text - preserve all content
    if (inList) {
      flushList();
    }
    currentParagraph.push(trimmed);
  }

  // Flush any remaining content
  flushList();
  flushParagraph();

  return elements.length > 0 ? <div className="space-y-4">{elements}</div> : null;
};


const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes] = useState(47); // Mock likes count - can be replaced with actual data
  const [comments] = useState(12); // Mock comments count - can be replaced with actual data

  const getImageSrc = (item: NewsItem) => {
    if (item.image) return item.image;
    const hash = Math.abs(item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));
    return fallbackImages[hash % fallbackImages.length] || fallbackHero;
  };

  const overview = article ? buildOverview(article) : [];
  const isBlogArticle = article?.type === 'Thought Leadership';

  // Color and label mappings for newsType categories (matching NewsCard)
  const newsTypeColor: Record<NonNullable<NewsItem['newsType']>, string> = {
    'Policy Update': '#8B5CF6',        // Purple for policy/guidelines
    'Upcoming Events': '#F97316',      // Orange for events
    'Company News': '#0EA5E9',         // Blue for company news
    'Holidays': '#16A34A'              // Green for holidays/notices
  };

  const newsTypeLabel: Record<NonNullable<NewsItem['newsType']>, string> = {
    'Policy Update': 'Policy Update',
    'Upcoming Events': 'Upcoming Events',
    'Company News': 'Company News',
    'Holidays': 'Holidays'
  };

  // Get newsType display info (matching NewsCard logic)
  const getNewsTypeDisplay = (item: NewsItem) => {
    // For blog articles (Thought Leadership), always show "Blog" with unique color
    if (item.type === 'Thought Leadership') {
      return {
        label: 'Blog',
        color: '#14B8A6' // Teal color for blogs
      };
    }
    if (item.newsType) {
      return {
        label: newsTypeLabel[item.newsType],
        color: newsTypeColor[item.newsType]
      };
    }
    // Fallback to type if newsType is missing
    const typeFallback: Record<NewsItem['type'], { label: string; color: string }> = {
      Announcement: { label: 'Company News', color: '#0EA5E9' },      // Blue
      Guidelines: { label: 'Policy Update', color: '#8B5CF6' },        // Purple
      Notice: { label: 'Holidays', color: '#16A34A' },                  // Green
      'Thought Leadership': { label: 'Blog', color: '#14B8A6' }         // Teal for blogs
    };
    return typeFallback[item.type];
  };

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadArticle() {
      setIsLoading(true);
      try {
        const [item, allNews] = await Promise.all([fetchNewsById(id || ''), fetchAllNews()]);
        if (!isMounted) return;
        setArticle(item);
        setRelated(allNews.filter((newsItem) => newsItem.id !== id).slice(0, 3));
        if (item) {
          markMediaItemSeen('news', item.id);
        }
        setLoadError(null);
      } catch (error) {
        if (!isMounted) return;
        // eslint-disable-next-line no-console
        console.error('Error loading news article', error);
        setLoadError('Unable to load this article right now.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Loading article' : 'Article not found'}
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            {isLoading
              ? 'Fetching the latest details. Please wait.'
              : "The article you're trying to view is unavailable or has been archived. Please browse the latest announcements."}
          </p>
          {loadError && !isLoading && (
            <p className="text-sm text-red-600 mb-4">{loadError}</p>
          )}
          <button
            onClick={() => navigate(`/marketplace/guides${location.search || ''}`)}
            className="rounded-lg bg-[#030f35] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Media Center
          </button>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const displayAuthor =
    article.type === 'Thought Leadership'
      ? (article.byline || article.author || 'DQ Media Team')
      : article.author;

  // Generate initials for author icon (G|CC style)
  const getAuthorInitials = () => {
    if (article.newsSource) {
      const parts = article.newsSource.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}|${parts[1].substring(0, 2).toUpperCase()}`;
      }
      return article.newsSource.substring(0, 3).toUpperCase();
    }
    if (article.department) {
      const parts = article.department.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}|${parts[1].substring(0, 2).toUpperCase()}`;
      }
      return article.department.substring(0, 3).toUpperCase();
    }
    if (displayAuthor) {
      const names = displayAuthor.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return displayAuthor.substring(0, 2).toUpperCase();
    }
    return 'DQ';
  };

  const announcementDate = article.date ? formatDate(article.date) : '';
  const announcementDateShort = article.date ? new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1A2E6E]">
                <HomeIcon size={16} />
                Home
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <Link to={`/marketplace/guides${location.search || ''}`} className="hover:text-[#1A2E6E]">
                DQ Media Center
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-900 line-clamp-1">{article.title}</span>
            </nav>
            <div className="flex gap-2 text-sm text-gray-500">
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]">
                <Share2 size={16} />
                Share
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]">
                <BookmarkIcon size={16} />
                Save
              </button>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header Card - Updated to match Secret Santa structure */}
                <header className="bg-white rounded-lg shadow p-6" aria-labelledby="article-title">
                  <div className="space-y-4">
                    {/* Category tag and date row */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {(() => {
                        const newsTypeDisplay = getNewsTypeDisplay(article);
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: newsTypeDisplay.color }} />
                            {newsTypeDisplay.label}
                          </span>
                        );
                      })()}
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{announcementDateShort}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h1 id="article-title" className="text-2xl font-bold text-gray-900 leading-tight">
                      {(() => {
                        if (article.id === 'dq-scrum-master-structure-update' || article.title.toLowerCase().includes('scrum master structure')) {
                          return 'Updated Scrum Master Structure';
                        }
                        if (article.id === 'dq-townhall-meeting-agenda' || article.title.toLowerCase().includes('townhall meeting agenda')) {
                          return 'DQ Townhall Meeting';
                        }
                        if (article.id === 'company-wide-lunch-break-schedule' || article.title.toLowerCase().includes('company-wide lunch break schedule') || article.title.toLowerCase().includes('lunch break schedule')) {
                          return 'Company-Wide Lunch Break Schedule';
                        }
                        if (article.id === 'grading-review-program-grp' || article.title.toLowerCase().includes('grading review program') || article.title.toLowerCase().includes('grp')) {
                          return 'Grading Review Program (GRP)';
                        }
                        return article.title;
                      })()}
                    </h1>

                    {/* Author info with circular icon */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                        {getAuthorInitials()}
                      </div>
                      <div>
                        {(article.newsSource || article.department) && (
                          <div className="text-sm font-medium text-gray-900">{article.newsSource || article.department}</div>
                        )}
                        {displayAuthor && (
                          <div className="text-xs text-gray-600">{displayAuthor}</div>
                        )}
                      </div>
                    </div>

                    {/* Hero Image if available */}
                    {getImageSrc(article) && (
                      <div className="relative">
                        <img
                          src={getImageSrc(article)}
                          alt={article.title}
                          className="w-full h-60 object-cover rounded mb-4"
                          loading="lazy"
                        />
                        {/* Badge overlay on image (matching NewsCard style) */}
                        {(() => {
                          const newsTypeDisplay = getNewsTypeDisplay(article);
                          return (
                            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: newsTypeDisplay.color }} />
                              {newsTypeDisplay.label}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </header>

                {/* Article Content - Full content for blogs, overview for announcements */}
                <article className="bg-white rounded-lg shadow p-6 space-y-4">
                  {isBlogArticle && article.content ? (
                    <div className="prose prose-sm max-w-none">
                      {renderFullContent(article.content)}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {overview.map((paragraph, index) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;
                        
                        // Parse bold text in the paragraph
                        const boldText = parseBold(trimmed);
                        
                        return (
                          <p key={index} className="text-gray-700 text-sm leading-relaxed">
                            {boldText}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </article>

                {/* COMPANY NEWS DETAILS Section */}
                <section className="bg-gray-50 rounded-lg p-6 border border-gray-200" aria-label="Company News Details">
                  <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">COMPANY NEWS DETAILS</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ANNOUNCEMENT DATE</div>
                        <div className="text-sm text-gray-900">{announcementDate}</div>
                      </div>
                    </div>
                    {displayAuthor && (
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-gray-500 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">RELEVANT CONTACT</div>
                          <div className="text-sm text-gray-900">{displayAuthor}</div>
                        </div>
                      </div>
                    )}
                    {(article.department || article.domain) && (
                      <div className="flex items-center gap-3">
                        <Building2 size={16} className="text-gray-500 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">DEPARTMENT</div>
                          <div className="text-sm text-gray-900">{article.department || article.domain || 'N/A'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* NEXT STEPS Section */}
                <section className="bg-white rounded-lg shadow p-6" aria-label="Next Steps">
                  <h2 className="text-sm font-bold mb-4 uppercase tracking-wide">NEXT STEPS</h2>
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <FileText size={14} /> Read Full Policy
                    </button>
                  </div>
                </section>

                {/* Engagement Metrics and Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
                        <Heart size={16} />
                        <span>{likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
                        <MessageCircle size={16} />
                        <span>{comments}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${isBookmarked ? 'text-blue-600' : 'text-gray-600'}`}
                        aria-label="Bookmark"
                      >
                        <BookmarkIcon size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: article.title,
                              text: article.excerpt,
                              url: window.location.href,
                            }).catch(() => {});
                          } else {
                            navigator.clipboard.writeText(window.location.href).catch(() => {});
                          }
                        }}
                        className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
                        aria-label="Share"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Questions section */}
                {displayAuthor && (
                  <div className="text-xs text-gray-600 pt-4">
                    <strong className="font-semibold">Questions about this announcement?</strong> Contact {displayAuthor}.
                  </div>
                )}
              </div>

              {/* Right Sidebar - Related Announcements */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {related && related.length > 0 && (
                    <section className="bg-white rounded-lg shadow p-6" aria-label="Related Announcements">
                      <h2 className="text-base font-semibold mb-4">Related Announcements</h2>
                      <div className="space-y-3">
                        {related.slice(0, 3).map((item) => {
                          const relatedDate = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          const newsTypeDisplay = getNewsTypeDisplay(item);
                          return (
                            <Link
                              key={item.id}
                              to={`/marketplace/news/${item.id}${location.search || ''}`}
                              className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mb-1.5 bg-white border border-gray-200 text-gray-700">
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: newsTypeDisplay.color }} />
                                    {newsTypeDisplay.label}
                                  </span>
                                  <div className="text-xs text-gray-500 mb-1.5">{relatedDate}</div>
                                  <div className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug" title={item.title}>{item.title}</div>
                                </div>
                                <ChevronRightIcon size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
