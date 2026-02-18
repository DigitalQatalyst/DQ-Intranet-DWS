-- DQ Glossary Terms Seed Data
-- Seeds the glossary_terms table with the 10 approved core DWS glossary terms

-- Define constants
\set owner_name 'Digital Qatalyst'
\set status_active 'Active'
\set category_frameworks 'frameworks-models'
\set category_platforms 'platforms-tools'
\set category_governance 'governance-systems'
\set category_roles 'roles-structures'
\set category_ways 'ways-of-working'

-- Define slug constants
\set slug_dws 'dws'
\set slug_dws_1 'dws-1'
\set slug_dws_2 'dws-2'
\set slug_dws_3 'dws-3'
\set slug_dbp 'dbp'
\set slug_dco 'dco'
\set slug_l24 'l24-working-rooms'
\set slug_dtmf 'dtmf'
\set slug_dt2_0 'dt2-0'
\set slug_ghc 'ghc'

-- Define array element constants
\set elem_dws_core 'dws-core'
\set elem_governance 'governance'
\set elem_learning_center 'learning-center'

-- Define common text constants
\set text_at_dq 'At DQ'
\set text_in_dws 'In DWS'
\set text_digital_work 'digital work'
\set text_transformation 'transformation'

-- Define column names to avoid duplication
\set col_term 'term'
\set col_slug 'slug'
\set col_short_def 'short_definition'
\set col_full_def 'full_definition'
\set col_category 'category'
\set col_used_in 'used_in'
\set col_related 'related_terms'
\set col_status 'status'
\set col_owner 'owner'
\set col_updated 'updated_at'

-- Define timestamp constant
\set current_timestamp 'NOW()'

-- Clear existing data (optional - comment out if you want to preserve existing data)
-- TRUNCATE TABLE glossary_terms;

-- Insert the 10 approved glossary terms
INSERT INTO glossary_terms (term, slug, short_definition, full_definition, category, used_in, related_terms, status, owner, updated_at)
VALUES
  (
    'Digital Work Solution (DWS)',
    :'slug_dws',
    'The comprehensive digital transformation framework and operating model used across DQ to deliver digital capabilities and solutions.',
    :'text_at_dq' || ', Digital Work Solution (DWS) is our core operating framework that defines how we design, build, and deliver digital transformation. ' || :'text_in_dws' || ', we structure our work across four key dimensions: Digital Work Space (DWS.1), Digital Work Sectors (DWS.2), Digital Working Studios (DWS.3), and supporting governance systems. DWS provides the operational language and methodology that all DQ teams use to align on delivery approaches, quality standards, and ' || :'text_transformation' || ' outcomes.',
    :'category_frameworks',
    ARRAY[:'elem_dws_core', :'elem_governance'],
    ARRAY[:'slug_dws_1', :'slug_dws_2', :'slug_dws_3', :'slug_dbp', :'slug_dco'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Digital Work Space (DWS.1)',
    :'slug_dws_1',
    'The digital environment and infrastructure where DQ associates collaborate, access tools, and execute ' || :'text_digital_work' || '.',
    :'text_in_dws' || ', Digital Work Space (DWS.1) refers to the integrated digital environment that enables DQ associates to collaborate, access shared resources, and execute their work. ' || :'text_at_dq' || ', DWS.1 encompasses our workspace platforms, collaboration tools, knowledge repositories, and the digital infrastructure that connects teams across locations. It is the operational layer where DWS principles are applied daily, ensuring consistent access to frameworks, guidelines, and shared resources.',
    :'category_platforms',
    ARRAY[:'elem_dws_core', :'slug_l24'],
    ARRAY[:'slug_dws', :'slug_dws_2', :'slug_dws_3'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Digital Work Sectors (DWS.2)',
    :'slug_dws_2',
    'The industry-specific domains and vertical markets where DQ applies digital ' || :'text_transformation' || ' capabilities.',
    :'text_at_dq' || ', Digital Work Sectors (DWS.2) represent the industry verticals and market domains where we apply our digital ' || :'text_transformation' || ' expertise. ' || :'text_in_dws' || ', sectors such as Government 4.0, Retail 4.0, Hospitality 4.0, and others define the operational contexts where DQ teams deliver solutions. DWS.2 provides the sector-specific knowledge, frameworks, and best practices that guide how we adapt DWS principles to different industry requirements and ' || :'text_transformation' || ' goals.',
    :'category_frameworks',
    ARRAY[:'elem_dws_core', :'elem_governance'],
    ARRAY[:'slug_dws', :'slug_dws_1', :'slug_dws_3'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Digital Working Studios (DWS.3)',
    :'slug_dws_3',
    'The organizational units and delivery teams within DQ that execute digital ' || :'text_transformation' || ' projects and initiatives.',
    :'text_in_dws' || ', Digital Working Studios (DWS.3) are the operational delivery units within DQ that execute digital ' || :'text_transformation' || ' work. ' || :'text_at_dq' || ', studios represent specialized teams organized around capabilities, technologies, or client engagements. DWS.3 defines how studios operate within the DWS framework, including their structure, governance, quality standards, and how they collaborate across the DWS ecosystem. Studios apply DWS.1 tools and DWS.2 sector knowledge to deliver ' || :'text_transformation' || ' outcomes.',
    :'category_roles',
    ARRAY[:'elem_dws_core', :'elem_governance'],
    ARRAY[:'slug_dws', :'slug_dws_1', :'slug_dws_2'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Digital Business Platform (DBP)',
    :'slug_dbp',
    'The integrated platform and technology stack that enables digital business operations and ' || :'text_transformation' || ' delivery.',
    :'text_at_dq' || ', Digital Business Platform (DBP) is the foundational technology platform that supports digital business operations and ' || :'text_transformation' || ' delivery. ' || :'text_in_dws' || ', DBP provides the core infrastructure, services, and capabilities that enable studios to build and deliver digital solutions efficiently. DBP encompasses development tools, deployment pipelines, data platforms, and shared services that reduce rework and accelerate delivery across DQ projects.',
    :'category_platforms',
    ARRAY[:'elem_dws_core', :'elem_governance'],
    ARRAY[:'slug_dws', :'slug_dco'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Digital Cognitive Organization (DCO)',
    :'slug_dco',
    'The organizational model and operating structure that enables DQ to operate as a learning, adaptive digital organization.',
    :'text_in_dws' || ', Digital Cognitive Organization (DCO) represents DQ''s organizational model for operating as a continuously learning, adaptive digital organization. ' || :'text_at_dq' || ', DCO defines how we structure decision-making, knowledge sharing, and organizational learning to maintain agility and digital mastery. DCO encompasses governance structures, learning systems, and operational practices that enable DQ to evolve its capabilities and respond to changing digital ' || :'text_transformation' || ' needs.',
    :'category_governance',
    ARRAY[:'elem_dws_core', :'elem_governance', :'elem_learning_center'],
    ARRAY[:'slug_dws', :'slug_ghc', :'slug_l24'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'L24 Working Rooms',
    :'slug_l24',
    'The structured collaboration spaces and working environments where DQ teams execute focused work sessions and delivery activities.',
    :'text_at_dq' || ', L24 Working Rooms are the operational collaboration spaces where teams conduct focused work sessions, planning, and delivery activities. ' || :'text_in_dws' || ', L24 Working Rooms provide structured environments for teams to apply DWS frameworks, access shared resources, and execute ' || :'text_transformation' || ' work. These rooms support various work modes including design sprints, development cycles, knowledge sharing, and cross-studio collaboration, all aligned with DWS principles and quality standards.',
    :'category_ways',
    ARRAY[:'slug_l24', :'elem_dws_core'],
    ARRAY[:'slug_dws', :'slug_dws_1', :'slug_dco'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Digital Transformation 2.0 (DT2.0)',
    :'slug_dt2_0',
    'The evolved approach to digital ' || :'text_transformation' || ' that emphasizes continuous adaptation, platform thinking, and ecosystem integration.',
    :'text_at_dq' || ', Digital Transformation 2.0 (DT2.0) represents our evolved framework for ' || :'text_transformation' || ' that moves beyond traditional project-based approaches. ' || :'text_in_dws' || ', DT2.0 emphasizes continuous adaptation, platform-based architectures, and ecosystem integration. DT2.0 guides how DQ teams approach ' || :'text_transformation' || ' initiatives, focusing on building sustainable digital capabilities rather than one-time implementations. This framework informs DWS delivery practices and quality standards.',
    :'category_frameworks',
    ARRAY[:'elem_dws_core', :'elem_governance'],
    ARRAY[:'slug_dws', :'slug_dtmf'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Digital Transformation Management Framework (DTMF)',
    :'slug_dtmf',
    'The management and governance framework that guides how DQ plans, executes, and measures digital ' || :'text_transformation' || ' initiatives.',
    :'text_in_dws' || ', Digital Transformation Management Framework (DTMF) provides the management structure and governance practices for planning, executing, and measuring ' || :'text_transformation' || ' initiatives. ' || :'text_at_dq' || ', DTMF defines how we structure ' || :'text_transformation' || ' programs, manage stakeholder alignment, track progress, and ensure quality outcomes. DTMF integrates with DWS operational practices, providing the management layer that enables studios to deliver ' || :'text_transformation' || ' effectively while maintaining alignment with DQ standards and client expectations.',
    :'category_governance',
    ARRAY[:'elem_dws_core', :'elem_governance'],
    ARRAY[:'slug_dws', :'slug_dt2_0'],
    :'status_active',
    :'owner_name',
    NOW()
  ),
  (
    'Golden Honeycomb of Competence (GHC)',
    :'slug_ghc',
    'The competency framework that defines the essential skills, behaviors, and capabilities expected of DQ associates.',
    :'text_at_dq' || ', Golden Honeycomb of Competence (GHC) is the authoritative competency model that defines the skills, behaviors, and capabilities required for digital mastery. ' || :'text_in_dws' || ', GHC provides the operational language for associate development, performance evaluation, and career progression. GHC encompasses technical competencies, digital thinking, collaboration skills, and leadership capabilities that enable associates to contribute effectively to DQ ' || :'text_transformation' || ' work. The framework guides learning programs, performance management, and organizational capability development.',
    :'category_frameworks',
    ARRAY[:'elem_learning_center', :'elem_governance', :'elem_dws_core'],
    ARRAY[:'slug_dws', :'slug_dco'],
    :'status_active',
    :'owner_name',
    NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  term = EXCLUDED.term,
  short_definition = EXCLUDED.short_definition,
  full_definition = EXCLUDED.full_definition,
  category = EXCLUDED.category,
  used_in = EXCLUDED.used_in,
  related_terms = EXCLUDED.related_terms,
  status = EXCLUDED.status,
  owner = EXCLUDED.owner,
  updated_at = NOW();

