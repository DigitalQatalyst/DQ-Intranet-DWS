DWS | KNOWLEDGE CENTER SPECIFICATION
Hi Caleb Kellah Chamath Pabasara Joshua Kibuye 
 
Here are specs to the DWS Knowledge Center
 
1. Overview
 
1.1 Purpose
The DQ Knowledge Center Marketplace is a centralized knowledge repository within DWS that enables associates to understand how DQ works, how decisions are made, and how work is delivered.
 
It provides structured access to:
 
Golden Honeycomb of Competencies (GHC)
Governance & Guidelines
Products & 6xD
Testimonials
Glossary
FAQs
 
2. Objectives
 
2.1  Objectives
Ensure alignment across all associates on DQ frameworks.
Reduce dependency on informal knowledge sharing.
Provide structured documentation of governance and delivery models.
Enable onboarding clarity for new associates.
2.2 User Objectives
Associates should be able to
Quickly find official guidelines.
Understand DQ’s competency model (GHC).
Search for policies and frameworks.
Filter knowledge by category.
Access structured and updated documentation.
 
3. Target Users
 
User Type
	
Use Case


New Associates & Existining Associates
	
Understand DQ structure and frameworks


Scrum Masters
	
Refer to Agile & governance guidelines


Product Teams
	
Access GHC and 6xD documentation


HRA
	
Access HR and policy guidelines


 
	
 
 
 
4. Functional Scope
4.1 Marketplace Structure
Tabs (Primary Navigation)
GHC
Guidelines
6xD
Products
Testimonials
Glossary
FAQs
Each tab dynamically filters the content cards.
 
 
4.2 Card-Based Content Layout
Each knowledge item appears as a card with:
Thumbnail (Standard DQ Gradient Banner)
Title
Short Description (2 lines max)
Category Tag
Published Date
“Read More” CTA
Card Behaviour
Click → Opens detailed content page
Tag → Filters related content
Search → Returns matching cards dynamically
4.3 Search Functionality
Global search within Knowledge Center
Searches:
Real-time filtered results
No external search scope (internal only)
 
4.4 Filters (Dynamic Per Tab)
GHC Tas
GHC Types (1–7)
 
Guidelines Tab
Categorization
Attachments
Location
Filters must:
Be multi-select
Update results instantly
Support “Clear All”
 
4.5 Detailed Page View
Each item page must include:
 
Hero banner
Title
Category Tag
Metadata (Date, Owner Team)
Structured content (Rich text)
Attachment support (PDF, links)
Back to Marketplace button
 
5. Non-Functional Requirements
 
Requirement
	
Description


Performance
	
Load time under 2 seconds


Accessibility
	
WCAG AA compliance


Responsiveness
	
Desktop-first, tablet supported


Security
	
Internal-only access (DQ SSO)


Versioning
	
Content update tracking


Auditability
	
Track last updated by
 
 
6. Governance Model
 
Role
	
Responsibility


Product Owner
	
Marketplace structure & enhancements


Content Owner
	
Accuracy of each document


Compliance
	
Policy validation


Platform Team
	
Technical maintenance
Content must not be published without content owner approval.
 
7. UX Principles
Clean grid layout
Maximum 3 cards per row
Two-line truncation for descriptions
Consistent thumbnail branding
Clear hierarchy between frameworks and policies
 
 
FYI 00. Govern (Specs)
 
Hi Michael Kimeu Tina Kimberly 
 
In the Knowledge Center, the GHC (Golden Honeycomb of Competencies) tab gives associates a structured view of DQ’s competency framework, spanning direction, culture, execution, and decision-making principles. It centralizes learning, reference, and practical resources across four tabs: Overview, Understand, Learn & Practice, and Other Materials, enabling associates to explore, understand, and apply DQ’s core competencies effectively.
 
 
1. Overview
 
1.1 Purpose
The GHC (Golden Honeycomb of Competencies) marketplace provides associates with a structured understanding of DQ’s competency framework, covering direction, culture, execution, and decision-making principles. It consolidates learning, reference, and practice content across four tabs: Overview, Understand, Learn & Practice, Other Materials.
 
1.2 Scope
This feature is part of Stage 1 of the Knowledge Center Marketplace rollout. All content cards link dynamically to internal resources (storybook, video, course materials). Each card supports multi-tab navigation with distinct CTAs per tab.
 
 
 
2. Objectives
 
 
Enable associates to quickly understand the GHC framework.
Provide structured access to learning and reference content.
Link cards to the correct internal resources:

User Objectives
 
Navigate GHC cards easily.
Filter and access resources by tab.
Start practical exercises via Learn & Practice videos.
 
3. Functional Scope
3.1 Card-Based Layout
Each GHC item is a card:
Clicking a card opens the Overview page by default.
3.2 Tabs & CTAs
 
Tab
	
Description
	
CTA Behavior


Overview
	
Read more about GHC item
	
Opens detailed content page in Knowledge Center (internal link)


Understand
	
Key GHC explanations
	
Opens Storybook (internal link)


Learn & Practice
	
Videos or exercises
	
Opens Learning Center Marketplace GHC video


Other Materials
	
Supplemental documents
	
Opens attachments (PDF, links)
 
3.3 Filters & Search
Search within GHC tab returns matching cards dynamically.
Filters:
 
4. Non-Functional Requirements
 
Requirement
	
Description


Performance
	
Load all GHC cards and content under 2s


Accessibility
	
WCAG AA compliance


Responsiveness
	
Desktop-first, tablet & mobile supported


Security
	
Internal-only access via DQ SSO


Auditability
	
Track last updated by content owner


Versioning
	
Maintain content history per GHC item
 
 
7. UX Principles
 
 
Clean grid layout: max 3 cards per row
Consistent thumbnail branding
Two-line truncation for descriptions
Clear hierarchy: Overview → Understand → Learn & Practice → Other Materials
Tab navigation clearly visible and highlights active tab
 
 
 
 
8. Stage Assignment
 
Feature
	
Stage


GHC Marketplace cards & Overview
	
Stage 1


Understand tab (Storybook)
	
Stage 1


Learn & Practice tab (Learning Center Video)
	
Stage 1


Other Materials
	
Stage 2 (optional, if attachments exist later)
 
 
9. Correctness Properties
 
 
Card Navigation – Clicking any GHC card opens Overview by default.
Tab Routing – Tabs correctly route to Storybook, Learning Center, or Other Materials.
Search & Filter – Filters return correct cards dynamically without breaking layout.
Responsive Layout – 1 column mobile, 2–3 column tablet/desktop.
Accessibility – ARIA labels on tabs, buttons, and cards.
Security – Only authenticated associates can access content.
 
 