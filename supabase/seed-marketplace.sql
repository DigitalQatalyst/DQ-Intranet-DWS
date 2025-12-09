-- Seed marketplace data from mock files
-- Run this after marketplace-schema.sql

-- Clear existing data
TRUNCATE public.news, public.jobs;

-- ===== Seed News Data =====
INSERT INTO public.news (
  id, title, type, date, author, byline, views, excerpt, image, department, location, domain, theme, tags, "readingTime", "newsType", "newsSource", "focusArea", content
) VALUES
-- Original mock data with relevant images - All dates updated to 2025, ordered latest first
('leadership-principles', 'Leadership Principles | What''s Your Leadership Superpower?', 'Thought Leadership', '2025-08-19', 'Leads', 'Stephanie Kioko', 47, 'Researchers have identified more than 1,000 leadership traits, but only a handful consistently drive real impact…', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', 'Stories', 'Remote', null, 'Leadership', ARRAY['Playbook', 'EJP'], '10–20', 'Digital Tech News', 'DQ Leadership', 'Culture & People', 'Researchers have identified more than 1,000 leadership traits, but only a handful consistently drive real impact. This deep dive explores the core leadership principles that separate high-performing teams from the rest. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('dq-storybook-live', 'From Vision to Impact: The DQ Storybook Goes Live!', 'Announcement', '2025-08-14', 'DQ Communications', null, 75, 'We''re excited to announce that the DQ Story is now officially published on the DQ Competencies page…', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80', 'Products', 'Dubai', 'Business', null, null, null, 'Corporate Announcements', 'DQ Communications', 'GHC', 'We''re excited to announce that the DQ Story is now officially published on the DQ Competencies page. This milestone represents months of collaborative work across all studios to codify our shared vision, values, and delivery principles. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('dq-persona-mindset', 'DQ Persona | Not Just a Role – It''s a Qatalyst Mindset', 'Thought Leadership', '2025-08-12', 'DQ Associates', 'Stephanie Kioko', 55, 'Culture eats strategy for breakfast—why a Qatalyst mindset matters for how we work and deliver…', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', 'Stories', 'Remote', null, 'Culture', ARRAY['QMS'], '5–10', 'Events & Campaigns', 'DQ Leadership', 'Culture & People', 'Culture eats strategy for breakfast—why a Qatalyst mindset matters for how we work and deliver. The DQ Persona isn''t just about what we do; it''s about how we think, collaborate, and approach every challenge with curiosity and craft. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('growth-emotional-intelligence', 'Grounded in Growth and Emotional Intelligence', 'Thought Leadership', '2025-08-08', 'Leads', 'Stephanie Kioko', 79, 'People with a Growth Mindset are twice as likely to take on challenges and push through obstacles…', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', 'Intelligence', 'Dubai', null, 'Leadership', ARRAY['EJP', 'Playbook'], '10–20', 'Digital Tech News', 'DQ Leadership', 'Culture & People', 'People with a Growth Mindset are twice as likely to take on challenges and push through obstacles. This research-backed approach to emotional intelligence and continuous learning forms the foundation of how we develop talent and build resilient teams. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('one-vision', 'The One Vision We All Build Toward', 'Thought Leadership', '2025-08-04', 'Partners', 'Stephanie Kioko', 50, 'At DQ, we all share a single powerful vision that guides how we build and deliver value…', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', 'Solutions', 'Remote', null, 'Delivery', ARRAY['Playbook', 'QMS'], '5–10', 'Product / Project Updates', 'DQ Leadership', 'GHC', 'At DQ, we all share a single powerful vision that guides how we build and deliver value. This unified direction ensures every project, every decision, and every innovation contributes to our collective impact. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('life-transactions', 'DQ''s Path to Perfect Life Transactions', 'Thought Leadership', '2025-08-01', 'Leads', 'Stephanie Kioko', 49, 'Every day we make thousands of transactions—here''s how we design for clarity and flow…', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', 'Delivery — Deploys', 'Remote', null, 'DTMF', ARRAY['QMS', 'EJP'], '10–20', 'Product / Project Updates', 'DQ Operations', 'GHC', 'Every day we make thousands of transactions—here''s how we design for clarity and flow. From digital interfaces to human interactions, our approach to transaction design prioritizes user experience and operational efficiency. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('agile-way-week', 'Your Week, the Agile Way', 'Thought Leadership', '2025-07-28', 'DQ Associates', 'Stephanie Kioko', 69, 'Practical ways to plan your week with agile habits—focus, alignment, and iterative delivery…', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80', 'Delivery — Designs', 'Nairobi', null, 'Delivery', ARRAY['Playbook'], '<5', 'Events & Campaigns', 'DQ Operations', 'DWS', 'Practical ways to plan your week with agile habits—focus, alignment, and iterative delivery. This guide provides actionable frameworks for structuring your work cycles to maximize both productivity and team collaboration. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('riyadh-horizon-hub', 'Riyadh Horizon Hub Opens for Cross-Studio Delivery', 'Announcement', '2025-07-25', 'DQ Communications', null, 61, 'The new Riyadh Horizon Hub is live—bringing Delivery, Platform, and People teams together to accelerate Saudi programs.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', 'Delivery — Deploys', 'Riyadh', 'Business', null, null, null, 'Corporate Announcements', 'DQ Leadership', 'GHC', 'The new Riyadh Horizon Hub is live—bringing Delivery, Platform, and People teams together to accelerate Saudi programs. This strategic expansion represents our commitment to local market expertise and cross-cultural collaboration. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('shifts-allocation-guidelines', 'Shifts Allocation Guidelines', 'Guidelines', '2025-07-20', 'DQ Communications', null, 58, 'New guidelines to enhance fairness and transparency for shifts allocation across teams…', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', 'DCO Operations', 'Dubai', 'People', null, null, null, 'Corporate Announcements', 'DQ Operations', 'DWS', 'New guidelines to enhance fairness and transparency for shifts allocation across teams. These updated procedures ensure equitable distribution of responsibilities while maintaining operational excellence. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('islamic-new-year', 'Honoring the Islamic New Year', 'Notice', '2025-06-27', 'DQ Communications', null, 63, 'A reflection on Al-Hijra 1447 AH—renewal, gratitude, and the values that ground our community…', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80', 'HRA (People)', 'Dubai', 'People', null, null, null, 'Events & Campaigns', 'DQ Communications', 'Culture & People', 'A reflection on Al-Hijra 1447 AH—renewal, gratitude, and the values that ground our community. This sacred time reminds us of the importance of reflection, growth, and the shared values that unite our diverse team. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('dq-website-launch', 'DQ Corporate Website Launch!', 'Announcement', '2025-06-24', 'DQ Communications', null, 84, 'Our new DQ corporate website is live—packed with what makes DQ a leader in digital delivery…', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', 'Products', 'Remote', 'Technology', null, null, null, 'Corporate Announcements', 'DQ Communications', 'DWS', 'Our new DQ corporate website is live—packed with what makes DQ a leader in digital delivery. This comprehensive platform showcases our capabilities, culture, and commitment to excellence in every project we undertake. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('po-dev-sync-guidelines', 'Product Owner & Dev Sync Guidelines', 'Guidelines', '2025-06-19', 'DQ Communications', null, 70, 'Standardizing PO–Dev syncs for clarity, cadence, and decision-making across products…', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', 'DBP Delivery', 'Dubai', 'Operations', null, null, null, 'Product / Project Updates', 'DQ Operations', 'DWS', 'Standardizing PO–Dev syncs for clarity, cadence, and decision-making across products. These guidelines establish consistent communication patterns that enhance collaboration and accelerate delivery timelines. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('riyadh-designing-at-scale', 'Designing at Scale for Riyadh Citizen Services', 'Thought Leadership', '2025-06-15', 'Leads', 'Yara Al Harthy', 52, 'How the Riyadh studio co-created digital citizen services with local regulators—pairing delivery playbooks with cultural fluency.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', 'Delivery — Designs', 'Riyadh', null, 'Delivery', ARRAY['Playbook', 'EJP'], '10–20', 'Product / Project Updates', 'DQ Operations', 'GHC', 'How the Riyadh studio co-created digital citizen services with local regulators—pairing delivery playbooks with cultural fluency. This case study demonstrates the power of combining technical excellence with deep cultural understanding. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('azure-devops-task-guidelines', 'Azure DevOps Task Guidelines', 'Guidelines', '2025-06-12', 'DQ Communications', null, 77, 'New task guidelines for ADO: naming, states, and flow so teams ship with less friction…', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', 'SecDevOps', 'Remote', 'Technology', null, null, null, 'Digital Tech News', 'DQ Operations', 'DWS', 'New task guidelines for ADO: naming, states, and flow so teams ship with less friction. These standardized practices streamline our development workflow and improve cross-team collaboration. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

('eid-al-adha', 'Blessed Eid al-Adha!', 'Notice', '2025-06-05', 'DQ Communications', null, 47, 'Warmest wishes to all observing Eid al-Adha—celebrating community and gratitude…', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80', 'HRA (People)', 'Nairobi', 'People', null, null, null, 'Events & Campaigns', 'DQ Communications', 'Culture & People', 'Warmest wishes to all observing Eid al-Adha—celebrating community and gratitude. This blessed occasion reminds us of the importance of sacrifice, generosity, and the bonds that unite our global team. Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments. This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center. Read on for the context, quotes, and resources you can plug into right away.'),

-- New announcements with relevant images - All dates updated to 2025, ordered latest first
('company-wide-lunch-break-schedule', 'DQ CHANGES | COMPANY-WIDE LUNCH BREAK SCHEDULE', 'Announcement', '2025-08-20', 'Hi GOV', 'Corporate Comms', 0, 'Unified lunch break for all associates: 2:00 PM – 3:00 PM DXB Time. Please avoid meetings within this window (except emergencies).', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80', null, 'Dubai', null, null, ARRAY['policy', 'schedule', 'collaboration'], '5–10', 'Corporate Announcements', 'DQ Communications', 'Culture & People', 'To enhance collaboration and synchronize workflows across all studios, we are implementing a unified company-wide lunch break schedule.

Effective immediately, the designated lunch break for all associates will be from 2:00 PM to 3:00 PM Dubai (DXB) Time.

This standardized schedule applies to all associates. The goal is to create a common window for breaks, ensuring seamless collaboration.

To support this initiative, we kindly ask for your cooperation:

All Associates: Please plan to take your lunch during this designated hour to ensure everyone is back online and available from 3:00 PM DXB Time.

Meeting Organizers: Please avoid scheduling meetings during the 2:00 PM - 3:00 PM DXB Time block to respect this common break period. An exception applies only for critical emergency meetings that cannot be scheduled at any other time.

Thank you for your cooperation in helping us build a more synchronized and efficient work environment.'),

('grading-review-program-grp', 'DQ ADP | GRADING REVIEW PROGRAM (GRP)', 'Announcement', '2025-08-20', 'Hi GOV', 'Corporate Comms', 0, 'Launch of the DQ Associate Grade Review Program to align associates to the SFIA-based grading scale; initial focus group led by Araba and Mercy Kyuma.', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', null, null, null, null, ARRAY['SFIA', 'grading', 'capability'], '10–20', 'Corporate Announcements', 'DQ Communications', 'Culture & People', '📢 DQ Associate Grade Review Program – Launch Announcement

Dear DQ Associates,

We are pleased to announce the launch of the DQ Associate Grade Review Program. This program aims to ensure all associates are aligned to the DQ SFIA-based grading scale, reflecting both their competence levels and scope of responsibility.

The review will be led by Araba and Mercy Kyuma, beginning with an initial focus group of about 10 associates before expanding to cover all associates across DQ. Associates included in the initial phase will be contacted directly, and broader communication will follow as the program scales up.

PS: Grading reviews involve Level Confirmation, Upgrade, or in rare cases a downgrade for better Learning and Development for the associate and the organization.

Purpose:
To maintain transparent, fair, and consistent grading standards across the organization, aligned with capability growth and performance.

More details will follow as we progress — stay tuned through this channel for updates!'),

('dq-storybook-latest-links', 'DQ Storybook — Latest Version and Links', 'Announcement', '2025-08-20', 'DQ Communications', null, 0, 'Explore the latest DQ Storybook and quick links to GHC elements including Vision, HoV, Persona, Agile TMS/SoS/Flows, and 6xD.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80', null, null, 'Business', null, ARRAY['story', 'GHC', 'references'], '5–10', 'Corporate Announcements', 'DQ Communications', 'GHC', 'Here''s the latest version of the DQ Storybook — our evolving narrative that brings the Golden Honeycomb of Competencies (GHC) to life. We''re continuing to shape and refine this Storybook, so keep an eye out for new updates and deep dives in the coming weeks.

DQ Storybook: Link

For quick reference, here are the current links to each element:
01. DQ Vision (Purpose) - Link
02. DQ HoV (Culture) - Link
03. DQ Persona (Identity) - Link
04. Agile TMS (Tasks) - Link
05. Agile SoS (Governance) - Link
06. Agile Flows (Value Streams) - Link
07. Agile 6xD (Products) : Link TBU'),

-- Special articles with custom title handling and relevant images - All dates updated to 2025
('dq-scrum-master-structure-update', 'DQ CHANGES | SCRUM MASTER STRUCTURE UPDATE', 'Announcement', '2025-08-20', 'Irene Musyoki', null, 0, 'As part of our organizational optimization, we are updating the leadership structure across functions to streamline responsibilities and enhance ownership.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', 'DQ Operations', 'Dubai', 'Operations', null, ARRAY['scrum master', 'structure', 'leadership'], '10–20', 'Corporate Announcements', 'DQ Operations', 'DWS', 'As part of our organizational optimization, we are updating the leadership structure across functions to streamline responsibilities and enhance ownership.

Previously, our leadership structure included Sector Leads, Factory Leads, Tower Leads, and Scrum Masters. These have now been streamlined into 4 unified Scrum Master framework.

DQ will now operate under four defined Scrum Master categories:

## COE Scrum Masters
Centers of Excellence Scrum Masters focus on establishing best practices, standards, and methodologies across the organization. They drive consistency and excellence in delivery practices.

## Delivery Scrum Masters
Delivery Scrum Masters are responsible for ensuring smooth execution of projects and maintaining delivery velocity. They work closely with teams to remove impediments and optimize workflows.

## Working Room Scrum Masters
Working Room Scrum Masters facilitate collaborative spaces and ensure effective utilization of shared resources. They manage working room protocols and support team coordination.

## Unit Scrum Masters
Unit Scrum Masters operate at the team level, providing direct support to individual squads and ensuring adherence to Agile principles and practices within their units.

This new structure provides clearer ownership, better alignment with our Agile methodology, and enhanced accountability across all levels of the organization.'),

('dq-townhall-meeting-agenda', 'DQ TOWNHALL MEETING AGENDA', 'Announcement', '2025-11-21', 'Irene Musyoki', null, 0, 'Join us for the upcoming DQ Townhall meeting featuring working room guidelines, Scrum Master framework discussions, and important organizational updates.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', 'DQ Operations', 'Dubai', 'Operations', null, ARRAY['townhall', 'meeting', 'agenda', 'framework'], '5–10', 'Corporate Announcements', 'DQ Operations', 'Culture & People', '# DQ Townhall Meeting Agenda

## Welcome & Introduction

Join us for an informative and engaging DQ Townhall meeting where we''ll discuss important updates, share insights, and align on our organizational goals and practices.

## Working Room Guidelines

**Presenter: Sreya L.**

This session will cover essential guidelines for working rooms and collaborative spaces. Topics include:
- Best practices for room usage and booking
- Maintenance and cleanliness standards
- Collaboration etiquette and respect for shared spaces
- Optimizing workspace utilization for maximum productivity

## Scrum Master Framework

**Presenter: Sreya L.**

An in-depth exploration of the Scrum Master framework and its implementation within DQ:
- Core principles and values of Scrum
- Roles and responsibilities within the framework
- Sprint planning and execution best practices
- Continuous improvement and retrospective processes
- How Scrum enhances team collaboration and delivery

## Meeting Objectives

This townhall aims to:
- Align all associates on working room protocols
- Deepen understanding of Agile and Scrum methodologies
- Foster a culture of collaboration and continuous improvement
- Provide a platform for questions and discussion

## Important Notes

- Please arrive on time to ensure we can cover all agenda items
- Questions and discussions are encouraged during designated Q&A segments
- Meeting materials and recordings will be shared following the session'),

-- Additional Guidelines
('dq-wfh-guidelines', 'DQ WFH Guidelines', 'Guidelines', '2025-11-18', 'Felicia Araba', 'HRA (People)', 0, 'Work From Home (WFH) guidelines outlining purpose, roles, processes, tools, KPIs, and compliance for remote work across DQ.', 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1200&q=80', 'HRA (People)', 'Remote', 'People', null, ARRAY['WFH', 'guidelines', 'policy'], '10–20', 'Corporate Announcements', 'DQ Operations', 'Culture & People', '# DQ Work From Home (WFH) Guidelines

## WFH Guideline Overview
The **Work From Home (WFH) Guidelines** provide a clear framework for how remote work is requested, approved, executed, and monitored across DQ. Each section below is designed to keep productivity, accountability, and culture intact while associates are working remotely.

## 1. Purpose and Scope

### Purpose
- Provide structured, standardized processes for WFH implementation, approval, and management.
- Promote accountability, productivity, and collaboration.
- Maintain operational efficiency, cultural alignment, and compliance with company standards.

### Scope
- Applies to **all DQ Associates**.
- Covers the end-to-end process of requesting, approving, monitoring, and reporting WFH arrangements.

## 2. Roles and Responsibilities

### Associate
- Submit WFH requests at least **24 hours in advance** via the HR Channel, with reason and date(s).
- Post daily action updates and relevant channel engagement links in the HR Channel.
- Remain active and visible on **DQ Live24** during working hours.

### Line Manager
- Review and provide **pre-approval** for WFH requests based on operational needs.
- Monitor deliverables and ensure accountability for remote work.
- Provide feedback and flag repeated non-compliance to HR.

### Human Resources (HR)
- Provide **final approval** for all WFH requests once Line Manager pre-approval is confirmed.
- Ensure requests align with policy and are consistent across departments.

### HR & Administration (HRA)
- Oversee overall compliance and adherence to the WFH guidelines.

## 3. Guiding Principles and Controls

- **Transparency** – All WFH activities, updates, and deliverables are visible to key stakeholders.
- **Accountability** – Associates remain responsible for deliverables, timelines, and communication.
- **Equity and Fairness** – Approvals are objective and based on role, performance, and continuity.
- **Compliance and Discipline** – Adhere to WFH policies, timelines, and workflows.
- **Collaboration and Communication** – Use approved tools and maintain active engagement.
- **Data Security and Confidentiality** – Protect company data when working remotely.

## 4. WFH Processes

1. **Submit request** – Associate submits WFH request at least 24 hours in advance via the HR Channel, including reason, dates, and expected working hours.
2. **Line Manager pre-approval** – Line Manager reviews impact on workload and coverage, then pre-approves or requests changes.
3. **HR final approval** – HR verifies compliance, records the decision, and notifies Associate and Line Manager.
4. **Post the day plan** – On the WFH day, Associate creates a thread in the HR Channel before work starts with actions for the day and engagement links.
5. **Clock-in & presence** – Associate clocks in on **DQ Shifts** and stays active on **DQ Live24**.
6. **Work execution & communication** – Follow the day plan, provide regular updates, respond promptly, and attend all calls.
7. **Record deliverables** – At end of day, Associate posts completed tasks, outstanding items, and blockers in the HR thread.
8. **Monitoring & compliance** – HRA and Line Manager monitor adherence; repeated non-compliance triggers formal review.
9. **Escalation & follow-up** – Failure to post updates or remain active on DQ Live24 may be treated as an unpaid workday and can lead to revocation of WFH privileges or performance review.

## 5. Tools and Resources

- **DQ Live24** – Visibility and communication.
- **DQ Logistics Channel** – Sharing approved WFH schedules.
- **HR Portal** – Submitting requests and tracking WFH history.

## 6. Key Performance Indicators (KPIs)

- **Timely Submission** – 100% of WFH requests submitted at least 24 hours in advance.
- **Approval Compliance** – 100% adherence to the approval workflow.
- **Visibility Compliance** – 100% of approved WFH associates post daily actions and engagement links.
- **Attendance Accuracy** – 100% of WFH attendance tracked via DQ Shifts and DQ Live24.
- **Policy Adherence** – Zero unapproved or non-compliant WFH cases per review cycle.
- **Performance Consistency** – Productivity maintained at in-office levels.

## 7. Compliance and Governance

- All WFH requests must follow the 24-hour advance notice rule with Line Manager pre-approval and HR final approval.
- Associates must post daily actions and engagement links; failure to do so may result in the day being treated as unpaid.
- WFH attendance must be logged through DQ Live24 for verification.
- HRA monitors adherence, consistency, and reports non-compliance cases.

## 8. Review and Update Schedule

- **Quarterly Review** – HR and Admin review guidelines every three months.
- **Ad-hoc Updates** – Additional updates may be made when gaps or improvements are identified.

## 9. Appendix and References

- Appendix A – WFH Request Template.
- Appendix B – DQ Shifts Attendance Guide.
- Appendix C – Remote Work Security Checklist.

## Need Help? Contact the Team

**Key Contacts**
- **Pelagie Njiki** – CoE Lead
- **Mauline Wangui** – TechOps Coordinator
- **Martin Wambugu** – Content & Marketing Analyst'),

('dq-dress-code-guideline', 'DQ Dress Code Guidelines', 'Guidelines', '2025-11-18', 'Felicia Araba', 'HRA (People)', 0, 'Dress code guideline balancing professionalism and comfort across the work week, with clear expectations, exceptions, and consequences.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', 'HRA (People)', 'Dubai', 'People', null, ARRAY['dress code', 'guidelines', 'policy'], '10–20', 'Corporate Announcements', 'DQ Operations', 'Culture & People', '# DQ Dress Code Guideline (Version 1.0)

## Context
At **DigitalQatalyst (DQ)**, professional appearance shapes how our brand is perceived, supports personal confidence, and creates an environment where associates feel comfortable and productive. This guideline sets expectations for attire so we strike the right balance between professionalism and comfort.

## Purpose
These dress code guidelines ensure associates align with DQ''s culture of professionalism while allowing flexibility for creativity and comfort. The standard is **business casual Monday–Thursday** with a more relaxed **Casual Friday**, adapted for the diverse nature of work at DQ.

## Key Characteristics

- **Professional Appearance** – Associates dress in a professional, decent, and clean manner; clothing should enhance DQ''s image.
- **Cultural Sensitivity** – Outfits should be respectful of cultural and religious norms.
- **Personal Grooming** – Hair, nails, and hygiene are maintained to a high standard. Fragrances, jewelry, and accessories should not distract from the professional setting.

## Dress Code Details

### Monday to Thursday – Business Casual

- **Men**
  - Well-fitted button-down shirt or polo
  - Tailored trousers, khakis, or chinos
  - Closed-toe shoes such as loafers or formal shoes

- **Women**
  - Blouse or sweater with tailored pants or skirt
  - Knee-length professional skirt or dress
  - Closed-toe shoes (flats or heels)

### Friday – Casual

- **Men**
  - Polo shirts or casual button-down shirts
  - Clean, well-fitted jeans
  - Casual shoes, sneakers, or loafers

- **Women**
  - Casual blouses or t‑shirts with jeans or casual skirt/dress
  - Comfortable, casual closed shoes or sneakers

## Preparation Before Implementation

Before rolling out the dress code:

- **Communicate Dress Code** – Send formal communication via Teams explaining the guideline and effective date.
- **Provide Visuals** – Share example images of acceptable business casual and Casual Friday outfits for men and women.
- **Clarify Exceptions** – Highlight how medical or other special cases will be handled.

## Guidelines During Workdays

- Associates are expected to follow the dress code **every working day** (business casual Monday–Thursday, casual on Friday).
- **Team Leads** oversee compliance within their teams and address non-compliance promptly.
- **HRA** holds overall responsibility for monitoring and enforcing these guidelines.

### Non-Compliance and Escalation

Failure to comply with the dress code may result in:

1. **Verbal warning** – Direct message to the associate.
2. **Written warning** – Formal note placed on the associate''s HR channel.
3. **Further disciplinary action** – May include suspension or other actions as deemed appropriate.

Associates and leaders are jointly responsible for ensuring the guideline is understood and consistently applied.

## Special Considerations

- **Client-Facing Meetings** – More formal business attire may be required; guidance will be communicated in advance.
- **Company Events or Presentations** – Formal business attire is required.
- **Extreme Weather** – Attire may be adjusted for comfort while staying within professional bounds.
- **Medical Exceptions** – Reasonable adjustments can be made for medical reasons; these should be discussed confidentially with HR.

## Prohibited Attire

The following are **strictly prohibited** during working days:

- Ripped jeans
- Graphic t‑shirts or overly casual tops
- Beachwear, sweatpants, gym wear, or shorts
- Flip-flops, sandals, or other overly casual footwear

## Post-Implementation Review

### Monitor Compliance
- Conduct occasional reviews to ensure the dress code is being followed across teams and locations.

### Recognition and Rewards
- **Best Dressed Award** – Recognise associates who consistently model the dress code.
- **Most Improved Award** – Appreciate associates who show clear improvement in adherence.

These recognitions help reinforce the guideline in a positive, motivating way.

### Adjust Guidelines as Needed
- Collect feedback and update the guideline where aspects prove unclear, impractical, or misaligned with DQ culture.

## Visuals and Examples

- **Business Casual** – Button-up shirt, slacks, blazer (men); blouse and pencil skirt or knee-length dress with flats or heels (women).
- **Casual Fridays** – Polo shirt and jeans with casual shoes (men); casual top with jeans and flats/sneakers (women). Always maintain neat, non-revealing, and culturally respectful outfits.

Where in doubt, associates should choose the more professional option and consult HR or their Line Manager for clarification.');

-- ===== Seed Jobs Data =====
INSERT INTO public.jobs (
  id, title, department, "roleType", location, type, seniority, "sfiaLevel", summary, description, responsibilities, requirements, benefits, "postedOn", "applyUrl", image
) VALUES
-- Jobs data - All dates updated to 2025, ordered latest first
('senior-frontend-developer', 'Senior Frontend Developer', 'Products', 'Tech', 'Dubai', 'Full-time', 'Senior', 'L4', 'Join our Products team to build cutting-edge user interfaces for DQ''s digital platforms.', 'We are looking for a Senior Frontend Developer to join our Products team in Dubai. You will be responsible for creating exceptional user experiences across our digital platforms.', ARRAY['Develop responsive web applications using React and TypeScript', 'Collaborate with designers and backend developers', 'Implement modern UI/UX patterns', 'Optimize applications for performance'], ARRAY['5+ years of frontend development experience', 'Expert knowledge of React, TypeScript, and modern CSS', 'Experience with state management libraries', 'Strong understanding of web performance optimization'], ARRAY['Competitive salary and benefits', 'Professional development opportunities', 'Flexible working arrangements', 'Health insurance'], '2025-08-15', 'https://careers.dq.com/apply/senior-frontend-developer', null),

('product-designer', 'Product Designer', 'Delivery — Designs', 'Design', 'Remote', 'Full-time', 'Mid-level', 'L3', 'Shape the future of digital experiences with our design team.', 'We are seeking a talented Product Designer to join our Delivery — Designs team. You will work on diverse projects across multiple industries.', ARRAY['Create user-centered design solutions', 'Conduct user research and usability testing', 'Collaborate with cross-functional teams', 'Maintain design systems and guidelines'], ARRAY['3+ years of product design experience', 'Proficiency in Figma and design tools', 'Strong portfolio demonstrating UX/UI skills', 'Experience with design systems'], ARRAY['Remote-first culture', 'Learning and development budget', 'Flexible working hours', 'Annual team retreats'], '2025-08-10', 'https://careers.dq.com/apply/product-designer', null),

('devops-engineer', 'DevOps Engineer', 'SecDevOps', 'Tech', 'Nairobi', 'Full-time', 'Mid-level', 'L3', 'Build and maintain our cloud infrastructure and deployment pipelines.', 'Join our SecDevOps team to help scale our infrastructure and improve our deployment processes across all DQ projects.', ARRAY['Design and implement CI/CD pipelines', 'Manage cloud infrastructure on AWS/Azure', 'Implement security best practices', 'Monitor and optimize system performance'], ARRAY['3+ years of DevOps experience', 'Experience with containerization (Docker, Kubernetes)', 'Knowledge of cloud platforms (AWS, Azure)', 'Scripting skills in Python or Bash'], ARRAY['Competitive salary package', 'Professional certifications support', 'Flexible working arrangements', 'Health and wellness benefits'], '2025-08-05', 'https://careers.dq.com/apply/devops-engineer', null),

('business-analyst', 'Business Analyst', 'Intelligence', 'Ops', 'Riyadh', 'Full-time', 'Mid-level', 'L3', 'Bridge the gap between business needs and technical solutions.', 'We are looking for a Business Analyst to join our Intelligence team in Riyadh, focusing on data-driven insights and process optimization.', ARRAY['Analyze business requirements and processes', 'Create detailed documentation and specifications', 'Facilitate stakeholder meetings and workshops', 'Support project delivery and change management'], ARRAY['3+ years of business analysis experience', 'Strong analytical and problem-solving skills', 'Experience with process mapping and documentation', 'Excellent communication skills in English and Arabic'], ARRAY['Relocation assistance available', 'Professional development opportunities', 'Comprehensive health insurance', 'Annual performance bonuses'], '2025-07-30', 'https://careers.dq.com/apply/business-analyst', null),

('hr-specialist', 'HR Specialist', 'HRA (People)', 'HR', 'Dubai', 'Full-time', 'Junior', 'L2', 'Support our people operations and help build a great workplace culture.', 'Join our HRA (People) team to support various HR functions including recruitment, employee relations, and organizational development.', ARRAY['Support recruitment and onboarding processes', 'Assist with employee relations and engagement', 'Maintain HR records and documentation', 'Support learning and development initiatives'], ARRAY['2+ years of HR experience', 'Knowledge of UAE labor law', 'Strong interpersonal and communication skills', 'Experience with HRIS systems'], ARRAY['Career growth opportunities', 'Professional HR certifications support', 'Flexible working arrangements', 'Comprehensive benefits package'], '2025-07-25', 'https://careers.dq.com/apply/hr-specialist', null);
