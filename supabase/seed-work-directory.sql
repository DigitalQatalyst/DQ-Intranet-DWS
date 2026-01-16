-- ============================================================================
-- Seed Data for Work Directory Tables
-- Matches unitsData and associatesData from src/data/directoryData.ts
-- ============================================================================

-- Work Units (from unitsData)
INSERT INTO public.work_units (
  id, slug, sector, unit_name, unit_type, location, focus_tags, department
) VALUES
(
  'hra-factory', 'hra-factory', 'People & Operations', 'HRA Factory', 'Factory', 'Global',
  ARRAY['Hiring & Onboarding', 'Smart Workplace', 'Performance & QPMS', 'Learning & Growth'],
  'Operations'
),
(
  'finance-factory', 'finance-factory', 'Operations', 'Finance Factory', 'Factory', 'Global',
  ARRAY['Payroll & Benefits', 'Payables & Receivables', 'Budgeting & Investments', 'Finance QPMS'],
  'Operations'
),
(
  'deals-factory', 'deals-factory', 'Growth & Pipeline', 'Deals Factory', 'Factory', 'Global',
  ARRAY['LeadGen & Campaigns', 'Opportunities & Bids', 'Proposals & Designs', 'Funnels & QPMS'],
  'Operations'
),
(
  'stories-factory', 'stories-factory', 'Content & Communication', 'Stories Factory', 'Factory', 'Global',
  ARRAY['Content Templates', 'Portal & Storybook Assets', 'LMS Materials', 'Social Content'],
  'Operations'
),
(
  'intelligence-factory', 'intelligence-factory', 'Analytics & AI Platform', 'Intelligence Factory', 'Factory', 'Global',
  ARRAY['Data Stores & Models', 'Analytics in DXP / DWS / DBP', 'AI Agents & Insights', 'QPMS Analytics'],
  'Platform'
),
(
  'solutions-factory', 'solutions-factory', 'Platform', 'Solutions Factory', 'Factory', 'Global',
  ARRAY['DXP', 'Full-Stack', 'Cloud'],
  'Platform'
),
(
  'secdevops-factory', 'secdevops-factory', 'Platform', 'SecDevOps Factory', 'Factory', 'Global',
  ARRAY['Security', 'DevOps', 'Infrastructure'],
  'Platform'
),
(
  'products-factory', 'products-factory', 'Products & Frameworks', 'Products Factory', 'Factory', 'Global',
  ARRAY['DT2.0 & DTMP', 'DTMA / DTMI / DTMB', 'DTMF Frameworks', 'QPM Systems'],
  'Platform'
),
(
  'deploys-delivery', 'deploys-delivery', 'Delivery', 'DQ Delivery (Deploys)', 'Delivery', 'Global',
  ARRAY['Agile', 'Scrum', 'Deployment'],
  'Delivery'
),
(
  'designs-delivery', 'designs-delivery', 'Delivery', 'DQ Delivery (Designs)', 'Delivery', 'Global',
  ARRAY['Design', 'UX', 'Creative'],
  'Delivery'
),
(
  'accounts-delivery', 'accounts-delivery', 'Delivery', 'DQ Delivery (Accounts)', 'Delivery', 'Global',
  ARRAY['Accounts', 'Client Success', 'Engagement'],
  'Delivery'
)
ON CONFLICT (id) DO UPDATE SET
  sector = EXCLUDED.sector,
  unit_name = EXCLUDED.unit_name,
  unit_type = EXCLUDED.unit_type,
  location = EXCLUDED.location,
  focus_tags = EXCLUDED.focus_tags,
  department = EXCLUDED.department,
  updated_at = NOW();

-- Work Associates (from associatesData)
INSERT INTO public.work_associates (
  id, name, current_role, department, unit, location, sfia_rating, status, level, email,
  key_skills, bio, summary
) VALUES
(
  'assoc-001', 'Irene Mwangi', 'HR Specialist', 'Operations', 'HRA Factory', 'NBO', 'L4', 'Active', 'L4',
  'irene@dq.workspace',
  ARRAY['Workforce Planning', 'Talent Management', 'Onboarding'],
  'Managing associate enablement and workforce performance. Leads talent acquisition and onboarding processes.',
  NULL
),
(
  'assoc-002', 'John Kamau', 'HR Specialist', 'Operations', 'HRA Factory', 'NBO', 'L4', 'Active', 'L4',
  'john@dq.workspace',
  ARRAY['Associate Enablement', 'Performance Management', 'HR Operations'],
  'Drives performance management and workforce operations. Ensures associates thrive through structured enablement.',
  NULL
),
(
  'assoc-003', 'SK Omondi', 'Partner Manager', 'Operations', 'Deals Factory', 'NBO', 'L5', 'Active', 'L5',
  'sk@dq.workspace',
  ARRAY['Partnerships', 'Business Development', 'Strategy'],
  'Leading DQ partnerships, business development, and communication growth. Builds strategic alliances that scale impact.',
  NULL
),
(
  'assoc-004', 'Tirsah Njeri', 'Communications Lead', 'Operations', 'Deals Factory', 'NBO', 'L5', 'Active', 'L5',
  'tirsah@dq.workspace',
  ARRAY['MarCom', 'Brand Strategy', 'Communications'],
  'Driving brand strategy and market communications. Orchestrates campaigns that amplify DQ messaging and presence.',
  NULL
),
(
  'assoc-005', 'Ted Wachira', 'BD Manager', 'Operations', 'Deals Factory', 'DXB', 'L6', 'Active', 'L6',
  'ted@dq.workspace',
  ARRAY['Business Development', 'Client Acquisition', 'Growth Strategy'],
  'Leading business development and client acquisition. Converts opportunities into lasting partnerships and revenue.',
  NULL
),
(
  'assoc-006', 'Kevin Odhiambo', 'Data Analyst', 'Platform', 'Intelligence Factory', 'NBO', 'L4', 'Active', 'L4',
  'kevin@dq.platform',
  ARRAY['Analytics', 'SQL', 'Data Modeling'],
  'Building data models, analytics dashboards, and insight frameworks. Transforms data into strategic intelligence for teams.',
  NULL
),
(
  'assoc-007', 'Win J', 'Data Analyst', 'Platform', 'Intelligence Factory', 'NBO', 'L4', 'Active', 'L4',
  'winj@dq.platform',
  ARRAY['Business Intelligence', 'Dashboards', 'Insights'],
  'Crafting business intelligence and visual dashboards. Surfaces insights that drive better decision-making.',
  NULL
),
(
  'assoc-008', 'Dennis Kiprono', 'Full Stack Developer', 'Platform', 'Solutions Factory', 'NBO', 'L5', 'Active', 'L5',
  'dennis@dq.platform',
  ARRAY['React', 'Node.js', 'TypeScript'],
  'Delivering full-stack and API-based solutions for DQ platforms. Builds reliable systems with modern frameworks.',
  NULL
),
(
  'assoc-009', 'Erick Mutai', 'Full Stack Developer', 'Platform', 'Solutions Factory', 'NBO', 'L4', 'Active', 'L4',
  'erick@dq.platform',
  ARRAY['API Development', 'Frontend', 'Backend'],
  'Crafting APIs, frontends, and backends for seamless experiences. Delivers products that connect users to value.',
  NULL
),
(
  'assoc-010', 'Fresha Kimani', 'DevOps Engineer', 'Platform', 'SecDevOps Factory', 'NBO', 'L5', 'Active', 'L5',
  'fresha@dq.platform',
  ARRAY['CI/CD', 'Docker', 'Kubernetes'],
  'Orchestrating CI/CD pipelines, automation, and platform reliability. Ensures deployment velocity and uptime.',
  NULL
),
(
  'assoc-011', 'Dominic Otieno', 'DevOps Engineer', 'Platform', 'SecDevOps Factory', 'NBO', 'L4', 'Active', 'L4',
  'dominic@dq.platform',
  ARRAY['Automation', 'Infrastructure', 'Cloud'],
  'Automating infrastructure and cloud operations. Streamlines deployment and scales DQ platform reliability.',
  NULL
),
(
  'assoc-012', 'Donna Achieng', 'Platform Reliability Engineer', 'Platform', 'SecDevOps Factory', 'DXB', 'L5', 'Active', 'L5',
  'donna@dq.platform',
  ARRAY['SRE', 'Monitoring', 'Incident Management'],
  'Ensuring platform uptime and incident management. Monitors systems to keep services running at peak performance.',
  NULL
),
(
  'assoc-013', 'Salem Mwangi', 'Scrum Master — User Stories', 'Delivery', 'DQ Delivery (Deploys)', 'NBO', 'L5', 'Active', 'L5',
  'salem@dq.workspace',
  ARRAY['Agile', 'Scrum', 'Sprint Planning'],
  'Leading agile sprints and ensuring delivery excellence. Facilitates teams to ship value consistently every cycle.',
  NULL
),
(
  'assoc-014', 'Wilson Ouma', 'Product Manager', 'Platform', 'Products Factory', 'NBO', 'L6', 'Active', 'L6',
  'wilson@dq.platform',
  ARRAY['Product Strategy', 'Roadmapping', 'Backlog Management'],
  'Managing product backlogs, releases, and DTMF incubations. Defines roadmaps that align teams with strategic outcomes.',
  NULL
),
(
  'assoc-015', 'Ben Njuguna', 'Product Owner', 'Platform', 'Products Factory', 'NBO', 'L5', 'Active', 'L5',
  'ben@dq.platform',
  ARRAY['Product Vision', 'Stakeholder Management', 'Feature Prioritization'],
  'Defining product vision and stakeholder priorities. Ensures product backlogs reflect real user and business value.',
  NULL
),
(
  'assoc-016', 'Emm Wanjiru', 'UX Designer', 'Platform', 'Products Factory', 'DXB', 'L4', 'Active', 'L4',
  'emm@dq.platform',
  ARRAY['User Research', 'Wireframing', 'Prototyping'],
  'Creating user-centered designs and experience patterns. Translates research into intuitive interfaces that delight.',
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  current_role = EXCLUDED.current_role,
  department = EXCLUDED.department,
  unit = EXCLUDED.unit,
  location = EXCLUDED.location,
  sfia_rating = EXCLUDED.sfia_rating,
  status = EXCLUDED.status,
  level = EXCLUDED.level,
  email = EXCLUDED.email,
  key_skills = EXCLUDED.key_skills,
  bio = EXCLUDED.bio,
  summary = EXCLUDED.summary,
  updated_at = NOW();

