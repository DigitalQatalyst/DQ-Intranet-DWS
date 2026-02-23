import type { NewsItem } from '@/data/media/news';

// Generate a brief 4-paragraph overview for the details page
export const buildOverview = (article: NewsItem & { content?: string }) => {
  const overview: string[] = [];
  
  // Check if this is the WFH Guidelines article
  const isWFHGuidelines = article.id === 'dq-wfh-guidelines' || 
                           article.title.toLowerCase().includes('wfh guidelines') ||
                           article.title.toLowerCase().includes('work from home');
  
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
