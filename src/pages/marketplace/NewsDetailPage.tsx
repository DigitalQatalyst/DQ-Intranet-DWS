import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon, Share2, BookmarkIcon, ArrowUpRight } from 'lucide-react';
import { NEWS, type NewsItem } from '@/data/media/news';

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const fallbackHero =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

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

const buildBody = (article: NewsItem & { content?: string }) => {
  // Use content field if available, otherwise fall back to default paragraphs
  if (article.content) {
    // Split content into blocks, preserving list structure
    const blocks: string[] = [];
    const lines = article.content.split('\n');
    let currentBlock = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const isEmpty = !line;
      const isListLine = /^[-*\d.]\s+/.test(line) || /^  [-*\d.]\s+/.test(line);
      
      if (isEmpty && currentBlock) {
        // Empty line ends current block
        blocks.push(currentBlock.trim());
        currentBlock = '';
        inList = false;
      } else if (isListLine) {
        // List item - add to current block
        if (currentBlock && !inList) {
          // Previous block wasn't a list, start new block
          if (currentBlock.trim()) {
            blocks.push(currentBlock.trim());
          }
          currentBlock = line;
        } else {
          currentBlock += (currentBlock ? '\n' : '') + line;
        }
        inList = true;
      } else if (line) {
        // Regular content line
        if (inList && currentBlock) {
          // End list block, start new block
          blocks.push(currentBlock.trim());
          currentBlock = line;
          inList = false;
        } else {
          currentBlock += (currentBlock ? '\n' : '') + line;
        }
      }
    }

    // Push remaining block
    if (currentBlock.trim()) {
      blocks.push(currentBlock.trim());
    }

    return blocks.filter(p => p.trim());
  }
  
  return [
    article.excerpt,
    'Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments.',
    'This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center.',
    'Read on for the context, quotes, and resources you can plug into right away.'
  ];
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

// Format content with proper markdown parsing
const formatContent = (content: string, index: number) => {
  const trimmed = content.trim();
  if (!trimmed) return null;

  // Parse H1 headings (# Heading)
  if (trimmed.match(/^#\s+(.+)$/)) {
    const match = trimmed.match(/^#\s+(.+)$/);
    const text = match ? match[1].trim() : trimmed;
    const boldText = parseBold(text);
    return (
      <h1 key={index} className="text-3xl font-bold mb-6 text-gray-900 mt-8 text-center">
        {boldText}
      </h1>
    );
  }

  // Parse H2 headings (## Heading)
  if (trimmed.match(/^##\s+(.+)$/)) {
    const match = trimmed.match(/^##\s+(.+)$/);
    const text = match ? match[1].trim() : trimmed;
    const boldText = parseBold(text);
    return (
      <h2 key={index} className="text-2xl font-bold mb-5 text-gray-900 mt-8 text-center">
        {boldText}
      </h2>
    );
  }

  // Parse H3 headings (### Heading)
  if (trimmed.match(/^###\s+(.+)$/)) {
    const match = trimmed.match(/^###\s+(.+)$/);
    const text = match ? match[1].trim() : trimmed;
    const boldText = parseBold(text);
    return (
      <h3 key={index} className="text-xl font-bold mb-4 text-gray-900 mt-6 text-center">
        {boldText}
      </h3>
    );
  }

  // Parse lists (- item, * item, or 1. item)
  const listMatch = trimmed.match(/^[-*]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
  if (listMatch || content.split('\n').some(line => /^[-*\d.]\s+/.test(line.trim()))) {
    const lines = content.split('\n').filter(line => line.trim());
    const listItems: Array<{ text: string; level: number }> = [];
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      const itemMatch = trimmedLine.match(/^(\s*)([-*\d.]+)\s+(.+)$/);
      if (itemMatch) {
        const level = itemMatch[1].length; // Indentation level
        const itemText = itemMatch[3].trim();
        listItems.push({ text: itemText, level });
      }
    });

    if (listItems.length > 0) {
      return (
        <ul key={index} className="list-disc list-inside mb-6 text-gray-700 space-y-3 max-w-4xl mx-auto">
          {listItems.map((item, itemIndex) => {
            const boldText = parseBold(item.text);
            const indentStyle = item.level > 0 ? { marginLeft: `${item.level * 1.5}rem` } : {};
            return (
              <li key={itemIndex} className="text-left" style={indentStyle}>
                {boldText}
              </li>
            );
          })}
        </ul>
      );
    }
  }

  // Regular paragraphs
  const boldText = parseBold(trimmed);
  return (
    <p key={index} className="mb-6 text-gray-700 text-center text-lg leading-relaxed max-w-4xl mx-auto">
      {boldText}
    </p>
  );
};

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = NEWS.find((item) => item.id === id);
  const related = NEWS.filter((item) => item.id !== id).slice(0, 3);

  const body = article ? buildBody(article) : [];
  useEffect(() => {
    if (article) {
      markMediaItemSeen('news', article.id);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Article not found</h1>
          <p className="text-gray-600 mb-6 max-w-md">
            The article you're trying to view is unavailable or has been archived. Please browse the latest announcements.
          </p>
          <button
            onClick={() => navigate('/marketplace/news')}
            className="rounded-lg bg-[#1A2E6E] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Media Center
          </button>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

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
              <Link to="/marketplace/news" className="hover:text-[#1A2E6E]">
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

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 pb-6">
            <div className="mb-8 rounded-2xl bg-gray-100">
              <img
                src={article.image || fallbackHero}
                alt={article.title}
                className="h-[420px] w-full rounded-2xl object-cover"
                loading="lazy"
              />
            </div>
            <article className="max-w-none">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span>{formatDate(article.date)}</span>
                  <span>•</span>
                  <span>{article.author}</span>
                  {article.readingTime && (
                    <>
                      <span>•</span>
                      <span>{article.readingTime} min read</span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {body.map((paragraph, index) => formatContent(paragraph, index))}
              </div>
            </article>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-[#F8FAFF]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Related Resources</h2>
              <button className="text-sm font-semibold text-[#1A2E6E] inline-flex items-center gap-1">
                See All Resources
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <img
                    src={item.image || fallbackHero}
                    alt={item.title}
                    className="mb-4 h-32 w-full rounded-xl object-cover"
                  />
                  <div className="text-xs text-gray-500">{formatDate(item.date)}</div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
                  <Link
                    to={`/marketplace/news/${item.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#1A2E6E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132456]"
                  >
                    Read Article
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
