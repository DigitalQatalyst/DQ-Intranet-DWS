DWS | LEARNING CENTER SPECIFICATION

1. Page Purpose & Strategy
- Primary entry point for upskilling and certification.
- Orientation: quickly orient new joiners and existing associates.
- Action-oriented: direct users to capability building as a primary action.
- Balanced UX: provide awareness and discovery without overwhelming the user.

2. Target Users
- New Joiners: need guidance, L0 foundations, “where do I start?” paths.
- Existing Associates: need fast access to technical tools (MS Fabric, Power BI) and advanced mastery.
- Leads & Managers: need visibility into team growth frameworks and enablement direction.

3. Information Architecture (priority order)
1) Global Learning Search: scoped retrieval of courses and skills.
2) Content Discovery: high-level toggles (Courses | Learning Tracks | Reviews).
3) Filtering Sidebar: faceted search by Department, SFIA Rating, and Provider.
4) Learning Grid: visual cards for courses and journeys.
5) Detailed Context: full curriculum and learning outcomes on specific pages.

4. Hero & Discovery Specifications
- Primary message: “Orientation, not marketing.” Action-driven headlines.
- Search bar: primary interaction element; scoped to tools, learning, and people.
- UI states: clear distinction between Active content and Coming Soon (visually de-emphasized) modules.

5. Content Design Principles
- Scannability: short sections with one core idea per block.
- User value: “Why it matters to me” framing for every course description.
- Metadata: every card must display Duration, Lesson Count, and SFIA Level.

6. Services & Marketplaces Integration
- Navigation gateway: bridge between documentation and execution.
- Grouping: organized by purpose (e.g., “Data Mastery,” “Collaboration”) rather than strictly by department.

7. Growth & Enablement Sections
- Progressive journeys: learning tracks presented as stepping stones, not exhaustive lists.
- Deep links: homepage focuses on awareness; deep-dive framework education lives on detail pages.

8. Awareness & Communication
- Updates: secondary priority; show 3–5 items (News, Insights, Announcements).
- Social proof: associate quotes and ratings to build trust and validate course quality.

9. Visual & Interaction Guidelines
- Hierarchy: clean spacing over heavy color use.
- Mobile parity: content priority remains consistent across devices.
- Conversion: success = users grasp “what this is” within 5 seconds and start a course within 10 seconds.

10. Out of Scope
- Deep framework education on the home view.
- Long-form storytelling or duplicate marketplace content.

11. Entity Relationship Diagrams (ERD)
11.1 Content Hierarchy Diagram
```plaintext
erDiagram
    LEARNING-PATH ||--o{ PATH-ITEM : contains
    PATH-ITEM }|--|| COURSE : "links to"
    COURSE ||--o{ MODULE : "organized into"
    MODULE ||--o{ LESSON : "contains"
    COURSE ||--o{ LESSON : "can directly contain"
    LESSON ||--o| QUIZ : "has assessment"
    COURSE ||--o| QUIZ : "has final exam"
```

11.2 Logical Database Schema
Detailed mapping of the Supabase tables and their constraints.
```plaintext
erDiagram
    lms_learning_paths {
        string id PK
        string slug UK
        string title
        string provider
        int duration_total
        string level_code
        jsonb faq
    }
    lms_path_items {
        string path_id FK
        string course_id FK
        int position
    }
    lms_courses {
        string id PK
        string slug UK
        string title
        string category
        string course_type
        string level_code
        text outcomes
        numeric rating
    }
    lms_modules {
        string id PK
        string course_id FK
        string title
        int item_order
    }
    lms_lessons {
        string id PK
        string module_id FK
        string course_id FK
        string title
        text content
        string video_url
        int item_order
    }
    lms_quizzes {
        string id PK
        string course_id FK
        string lesson_id FK
        jsonb questions
    }
    lms_learning_paths ||--o{ lms_path_items : defines
    lms_path_items }|--|| lms_courses : includes
    lms_courses ||--o{ lms_modules : segments
    lms_modules ||--o{ lms_lessons : groups
    lms_courses ||--o{ lms_lessons : possesses
    lms_lessons ||--o| lms_quizzes : tests
```

12. Technical Implementation Summary
- Route structure:
  - /lms: main marketplace
  - /lms/:slug: detail page (modules/outcomes)
  - /lms/:slug/lesson/:id: content viewer
