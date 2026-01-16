-- ============================================================================
-- Seed Data for Marketplace Services Table
-- Matches data from:
-- - mockCourses from src/utils/mockData.ts
-- - mockFinancialServices from src/utils/mockMarketplaceData.ts
-- - mockNonFinancialServices from src/utils/mockMarketplaceData.ts
-- - mockKnowledgeHubItems from src/utils/mockMarketplaceData.ts
-- - mockOnboardingFlows from src/utils/mockData.ts
-- ============================================================================

-- Service Type Legend:
-- 'course' - LMS Courses
-- 'financial' - Financial Services
-- 'non-financial' - Non-Financial Services (Technology, Business, Digital Worker, etc.)
-- 'guide' - Knowledge Hub / Guides
-- 'onboarding' - Onboarding Flows

-- Example Course Entry
INSERT INTO public.marketplace_services (
  id, title, description, category, service_type, delivery_mode, business_stage,
  provider_name, provider_logo_url, provider_description, tags, image_url,
  date, start_date, price, duration, location, details, learning_outcomes,
  duration_type, time_to_complete, journey_phase, roles, popularity, metadata
) VALUES
(
  'course-example-1',
  'Course Title',
  'Course description',
  'GHC',
  'course',
  'Online',
  'All',
  'Digital Qatalyst',
  '/DWS-Logo.png',
  'Provider description',
  ARRAY['tag1', 'tag2'],
  'https://image-url.com',
  '2025-01-01',
  'Anytime',
  'Free',
  '30 min',
  'Remote',
  ARRAY['Detail 1', 'Detail 2'],
  ARRAY['Outcome 1', 'Outcome 2'],
  'Short',
  '15–30m',
  NULL,
  ARRAY['All'],
  'New',
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  service_type = EXCLUDED.service_type,
  delivery_mode = EXCLUDED.delivery_mode,
  business_stage = EXCLUDED.business_stage,
  provider_name = EXCLUDED.provider_name,
  provider_logo_url = EXCLUDED.provider_logo_url,
  provider_description = EXCLUDED.provider_description,
  tags = EXCLUDED.tags,
  image_url = EXCLUDED.image_url,
  date = EXCLUDED.date,
  start_date = EXCLUDED.start_date,
  price = EXCLUDED.price,
  duration = EXCLUDED.duration,
  location = EXCLUDED.location,
  details = EXCLUDED.details,
  learning_outcomes = EXCLUDED.learning_outcomes,
  duration_type = EXCLUDED.duration_type,
  time_to_complete = EXCLUDED.time_to_complete,
  journey_phase = EXCLUDED.journey_phase,
  roles = EXCLUDED.roles,
  popularity = EXCLUDED.popularity,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Example Financial Service Entry
INSERT INTO public.marketplace_services (
  id, title, description, category, service_type, business_stage,
  provider_name, provider_logo_url, provider_description, tags, image_url,
  amount, interest_rate, duration, eligibility, details, metadata
) VALUES
(
  'fin-1',
  'SME Growth Loan',
  'Low-interest loans designed specifically for small and medium enterprises looking to expand their operations in Abu Dhabi.',
  'Loans',
  'financial',
  'Growth',
  'Abu Dhabi Commercial Bank',
  'https://upload.wikimedia.org/wikipedia/commons/8/80/ADCB_Logo.svg',
  'One of the largest banks in the UAE, offering a wide range of financial services for businesses.',
  ARRAY['Loans', 'Financing', 'Growth'],
  NULL,
  'Up to AED 5 million',
  'Starting from 3%',
  '5-7 years',
  'Business must be operating for at least 2 years with annual revenue of AED 1 million+',
  ARRAY[
    'No collateral required for loans up to AED 1 million',
    'Flexible repayment options',
    'Dedicated relationship manager',
    'Fast approval process within 5 business days',
    'Option for grace period of up to 6 months'
  ],
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  service_type = EXCLUDED.service_type,
  business_stage = EXCLUDED.business_stage,
  provider_name = EXCLUDED.provider_name,
  provider_logo_url = EXCLUDED.provider_logo_url,
  provider_description = EXCLUDED.provider_description,
  tags = EXCLUDED.tags,
  image_url = EXCLUDED.image_url,
  amount = EXCLUDED.amount,
  interest_rate = EXCLUDED.interest_rate,
  duration = EXCLUDED.duration,
  eligibility = EXCLUDED.eligibility,
  details = EXCLUDED.details,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- TODO: Add all remaining marketplace service items:
-- 1. All courses from mockCourses (src/utils/mockData.ts)
-- 2. All financial services from mockFinancialServices (src/utils/mockMarketplaceData.ts)
-- 3. All non-financial services from mockNonFinancialServices (src/utils/mockMarketplaceData.ts)
-- 4. All knowledge hub items from mockKnowledgeHubItems (src/utils/mockMarketplaceData.ts)
-- 5. All onboarding flows from mockOnboardingFlows (src/utils/mockData.ts)
--
-- Follow the same pattern as the examples above, adjusting fields based on service_type

