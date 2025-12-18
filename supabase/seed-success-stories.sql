-- Seed success_stories table with existing testimonials
-- This file can be run after the migration to populate initial data

-- Insert existing testimonials from landingPageContent.ts
insert into public.success_stories (
  id,
  name,
  position,
  company,
  company_logo,
  avatar,
  quote,
  full_quote,
  rating,
  video_thumbnail,
  video_url,
  metric,
  metric_label,
  metric_color,
  display_order,
  is_published
) values
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Salem Wasike',
    'Product Owner - DQ Deploys',
    'Digital Qatalyst',
    'https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'Agile Essentials and DTMF learning paths reduced blockers by 40% and sped up feature delivery.',
    'Through the DQ LMS, our teams completed Agile Essentials and DTMF learning paths. The shared practices cut delivery blockers by 40% and improved flow, which helped us ship features faster and with clearer ownership.',
    5,
    'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    '40%',
    'Faster Task Completion',
    'green',
    1,
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Sharavi Chander',
    'Head of DQ Deploys',
    'Digital Qatalyst',
    'https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    '80+ team certifications built a learning culture that lifted consistency across releases.',
    'The LMS pathways and peer sessions led to 80+ certifications across Deploys. That shared foundation in tooling and governance raised our consistency and confidence from planning through release.',
    5,
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    '80+',
    'Team Certifications',
    'orange',
    2,
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Mohamed Thameez',
    'Product Manager',
    'Digital Qatalyst',
    'https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg',
    'https://randomuser.me/api/portraits/men/22.jpg',
    'Cross-unit learning spaces cut our feature turnaround time by 30%.',
    'Standard playbooks, shared boards, and course-led upskilling created tighter handoffs between Design, Build, and Deploy. As a result, our feature turnaround time improved by 30% with fewer reworks.',
    4,
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    '3x',
    'Collaboration Growth',
    'red',
    3,
    true
  )
on conflict (id) do nothing;

