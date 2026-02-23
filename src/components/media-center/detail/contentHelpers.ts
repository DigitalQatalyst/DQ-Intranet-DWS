import type { NewsItem } from '@/data/media/news';
import { toTitleCase } from '@/utils/newsUtils';

// Generate a short, relevant heading for announcements
export const generateAnnouncementHeading = (article: NewsItem): string => {
  if (article.title && article.title.trim()) {
    let title = article.title.trim();
    if (title.length > 80) {
      const parts = title.split('|').map(p => p.trim());
      if (parts.length > 1) {
        title = parts[0];
      } else {
        const sentences = title.split(/[.:]/);
        if (sentences[0] && sentences[0].length > 20 && sentences[0].length < 80) {
          title = sentences[0].trim();
        }
      }
    }
    return toTitleCase(title);
  }
  
  if (article.content) {
    const lines = article.content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const headingMatch = trimmed.match(/^#+\s+(.+)$/);
      if (headingMatch) {
        const headingText = headingMatch[1].trim().replace(/\*\*/g, '').replace(/\*/g, '');
        if (headingText.length > 10 && headingText.length < 100) {
          return toTitleCase(headingText);
        }
      }
    }
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.match(/^#+\s+/) && trimmed.length > 20 && trimmed.length < 100) {
        const cleanLine = trimmed.replace(/\*\*/g, '').replace(/\*/g, '').substring(0, 80);
        return toTitleCase(cleanLine);
      }
    }
  }
  
  if (article.excerpt && article.excerpt.length > 20 && article.excerpt.length < 100) {
    return article.excerpt;
  }
  
  return 'Announcement Details';
};

export { buildOverview } from './buildOverview';

// Helper: Check if a line is a valid paragraph (not a heading or list item)
const isValidParagraphLine = (line: string): boolean => {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.match(/^#+\s+/)) return false; // Skip headings
  if (trimmed.match(/^[-*\d.]\s+/)) return false; // Skip list items
  return true;
};

// Helper: Clean markdown formatting from text
const cleanParagraphText = (text: string): string => {
  return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#+/g, '').trim();
};

// Helper: Ensure paragraph ends with punctuation
const ensurePunctuation = (text: string): string => {
  if (!text.match(/[.!?]$/)) {
    return text + '.';
  }
  return text;
};

// Helper: Extract up to 3 unique paragraphs from content lines
const extractParagraphsFromLines = (lines: string[]): string[] => {
  const paragraphs: string[] = [];
  const seenParagraphs = new Set<string>();
  
  for (const line of lines) {
    if (paragraphs.length >= 3) break;
    
    if (!isValidParagraphLine(line)) continue;
    
    const cleanLine = cleanParagraphText(line);
    if (cleanLine.length <= 40) continue;
    if (seenParagraphs.has(cleanLine)) continue;
    
    seenParagraphs.add(cleanLine);
    paragraphs.push(ensurePunctuation(cleanLine));
    
    // Stop after getting 2 unique paragraphs (we'll add a third if needed)
    if (paragraphs.length >= 2) break;
  }
  
  return paragraphs;
};

// Helper: Get default summary paragraphs
const getDefaultSummary = (): string[] => {
  return [
    'This thought leadership article explores key insights and perspectives on important topics affecting our organization and industry.',
    'The analysis provides valuable context and strategic considerations for stakeholders.',
    'The discussion delves into practical implications and forward-looking perspectives that can inform decision-making processes.'
  ];
};

// Helper: Get fallback paragraphs to fill summary
const getFallbackParagraphs = (): string[] => {
  return [
    'This thought leadership article explores key insights and perspectives on important topics affecting our organization and industry. The analysis provides valuable context and strategic considerations for stakeholders.',
    'The discussion delves into practical implications and forward-looking perspectives that can inform decision-making processes and strategic planning initiatives.'
  ];
};

// Generate a longer summary for blog articles
export const generateBlogSummary = (article: NewsItem): string[] => {
  if (!article.content) {
    return getDefaultSummary();
  }
  
  const lines = article.content.split('\n');
  const summary = extractParagraphsFromLines(lines);
  
  // Fill with fallback content if needed
  if (summary.length < 2) {
    summary.push(getFallbackParagraphs()[0]);
  }
  if (summary.length < 3) {
    summary.push(getFallbackParagraphs()[1]);
  }
  
  return summary.length > 0 ? summary : getDefaultSummary();
};
