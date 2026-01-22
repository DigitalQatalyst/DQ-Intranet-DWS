/**
 * BACKUP FILE: Prompt Library Service Cards
 * Created: 2026-01-13
 * Purpose: Backup of all service cards in the Prompt Library category
 * Source: mockMarketplaceData.ts
 */

export const promptLibraryServicesBackup = [
  {
    id: '17',
    title: 'Supabase Full-Stack Development Prompt',
    description:
      'Comprehensive development guidelines for building modern full-stack applications with TypeScript, React, Next.js, Expo, Supabase, and related technologies. Includes best practices for code structure, state management, testing, and deployment in monorepo setups.',
    category: 'Prompt Library',
    serviceType: 'Self-Service',
    deliveryMode: 'Online',
    businessStage: 'All Stages',
    promptType: 'dev_prompts',
    technologies: ['TypeScript', 'React', 'Next.js', 'Expo', 'Supabase', 'Zustand', 'TanStack Query', 'Stripe'],
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
      description:
        'Digital Innovation team curates and maintains a library of AI prompts and development guidelines to accelerate project delivery and ensure consistent code quality.',
    },
    duration: 'Immediate',
    price: 'Free',
    details: [
      'Complete TypeScript and React development guidelines',
      'Supabase integration best practices',
      'State management with Zustand and TanStack Query',
      'Cross-platform development with Expo and React Native',
      'Stripe payment and subscription model implementation',
      'Monorepo management with Turbo',
      'Testing, performance optimization, and error handling patterns',
    ],
    tags: ['Prompt Library', 'Development', 'Full-Stack', 'TypeScript', 'Supabase'],
    featuredImageUrl: '/images/services/react-supabase.jpg',
    sourceUrl: 'https://cursor.directory/rules/supabase',
  },
  {
    id: '18',
    title: 'Next.js 14 + Supabase Full-Stack Prompt',
    description: 'Expert guidelines for building modern full-stack applications with Next.js 14, Supabase, and TypeScript. Focus on React Server Components, SSR features, clean code architecture, and production-ready best practices.',
    category: 'Prompt Library',
    serviceType: 'Self-Service',
    deliveryMode: 'Online',
    businessStage: 'All Stages',
    promptType: 'dev_prompts',
    technologies: ['Next.js 14', 'Supabase', 'TypeScript', 'TailwindCSS', 'React Server Components'],
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Innovation team curates and maintains a library of AI prompts and development guidelines to accelerate project delivery and ensure consistent code quality.',
    },
    duration: 'Immediate',
    price: 'Free',
    details: [
      'Next.js 14 with App Router best practices',
      'Supabase integration and authentication patterns',
      'React Server Components and SSR optimization',
      'TypeScript with strict typing and interfaces',
      'TailwindCSS styling conventions',
      'Error handling and loading states',
      'Production-ready code standards',
    ],
    tags: ['Prompt Library', 'Next.js', 'Supabase', 'TypeScript', 'Full-Stack'],
    featuredImageUrl: '/images/services/nextjs.jpg',
    sourceUrl: 'https://cursor.directory/monorepo-tamagui',
  },
  {
    id: '19',
    title: 'SvelteKit + Supabase Full-Stack Prompt',
    description: 'Expert guidelines for building modern full-stack applications with SvelteKit, Supabase, Tailwind, and TypeScript. Focuses on SvelteKit SSR features, clean code architecture, and production-ready best practices with minimal client-side components.',
    category: 'Prompt Library',
    serviceType: 'Self-Service',
    deliveryMode: 'Online',
    businessStage: 'All Stages',
    promptType: 'dev_prompts',
    technologies: ['SvelteKit', 'Supabase', 'TypeScript', 'Tailwind', 'Svelte'],
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
      description: 'Digital Innovation team curates and maintains a library of AI prompts and development guidelines to accelerate project delivery and ensure consistent code quality.',
    },
    duration: 'Immediate',
    price: 'Free',
    details: [
      'SvelteKit SSR and server-side rendering best practices',
      'Supabase integration and authentication patterns',
      'Svelte stores for global state management',
      'TypeScript with enhanced type safety',
      'Tailwind CSS styling conventions',
      'Error handling and loading states',
      'Kebab-case component naming conventions',
    ],
    tags: ['Prompt Library', 'SvelteKit', 'Supabase', 'TypeScript', 'Full-Stack'],
    featuredImageUrl: '/images/services/supabase.png',
    sourceUrl: 'https://cursor.directory/rules/sveltekit',
  },
  {
    id: '22',
    title: 'AI QA Engineer & Journey Reviewer Prompt',
    description:
      'A specialized prompt for an AI QA engineer that reads real implementation, derives behaviors from code, and generates focused test plans across functional, journey, rendering, and error-handling dimensions.',
    category: 'Prompt Library',
    serviceType: 'Self-Service',
    deliveryMode: 'Online',
    businessStage: 'All Stages',
    promptType: 'qa_prompts',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Vite'],
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
      description:
        'Digital Innovation team curates and maintains a library of AI prompts and development guidelines to accelerate project delivery and ensure consistent code quality.',
    },
    duration: 'Immediate',
    price: 'Free',
    details: [
      'Analyze production code to infer actual implemented behavior',
      'Generate structured feature inventories from real routes, components, and APIs',
      'Create functional, journey, rendering, and error-handling test cases',
      'Focus on observable behavior instead of assumptions or undocumented intent',
      'Produce QA deliverables suitable for manual or automated execution',
    ],
    tags: ['Prompt Library', 'QA', 'Testing', 'Journeys'],
    featuredImageUrl: '/images/services/ai.jpg',
    sourceUrl: null,
  },
];

/**
 * COMMENTED OUT SERVICE CARDS (Currently disabled in mockMarketplaceData.ts)
 * These were found in the commented section (lines 687-746)
 */
export const commentedOutServices = [
  {
    id: '2',
    title: 'Support Charter Template',
    description:
      'Support Charter Template is a structured document that outlines the scope, responsibilities, standards, and expectations of the IT support function. It acts as a formal agreement or guideline between the IT support team and the users or departments they serve.',
    category: 'Technology',
    serviceType: 'Self-Service',
    deliveryMode: 'Hybrid',
    businessStage: 'All Stages',
    userCategory: ['Employee', 'Manager'],
    technicalCategory: ['Software'],
    deviceOwnership: ['Company Device'],
    provider: {
      name: 'IT Support',
      logoUrl: '/DWS-Logo.png',
      description:
        'DQ IT Support provides technical assistance and support for all technology-related issues and requests.',
    },
    duration: 'Immediate',
    price: 'Free',
    details: [
      'Understand IT support scope and responsibilities',
      'Define service level agreements',
      'Establish support standards and expectations',
      'Create formal support agreements',
      'Access structured documentation templates',
    ],
    tags: ['Online', 'Technology'],
    featuredImageUrl: '/images/services/tech-support.jpg',
    status: 'COMMENTED_OUT',
    location: 'mockMarketplaceData.ts:687-716',
  },
  {
    id: '3',
    title: 'IT Support Walkthrough',
    description:
      'An instructional video detailing how to successfully launch an IT support request on the DWS platform.',
    category: 'Technology',
    serviceType: 'Self-Service',
    deliveryMode: 'Online',
    businessStage: 'All Stages',
    userCategory: ['Employee', 'Contractor', 'Intern'],
    technicalCategory: ['Software', 'Hardware'],
    deviceOwnership: ['Company Device', 'Personal Device (BYOD)'],
    provider: {
      name: 'IT Support',
      logoUrl: '/DWS-Logo.png',
      description:
        'DQ IT Support provides technical assistance and support for all technology-related issues and requests.',
    },
    duration: '5-10 minutes',
    price: 'Free',
    details: [
      'Navigate the DWS platform effectively',
      'Launch IT support requests correctly',
      'Follow proper request procedures',
      'Understand platform functionality',
      'Learn best practices for submitting requests',
    ],
    tags: ['IT Support', 'Online', 'Technology'],
    featuredImageUrl: '/images/services/IT_Support_Walkthrough.jpg',
    status: 'COMMENTED_OUT',
    location: 'mockMarketplaceData.ts:717-746',
  },
];

/**
 * Backup Metadata
 */
export const backupMetadata = {
  createdAt: '2026-01-13',
  sourceFile: 'src/utils/mockMarketplaceData.ts',
  totalActivePromptLibraryServices: 4,
  totalCommentedOutServices: 2,
  categories: {
    'Prompt Library': 4,
    'Technology (Commented)': 2,
  },
  serviceIds: ['17', '18', '19', '22', '2 (commented)', '3 (commented)'],
  notes: [
    'All Prompt Library services are currently active',
    'Support Charter Template (id:2) and IT Support Walkthrough (id:3) are commented out',
    'All active services use "Self-Service" serviceType',
    'All services have "Online" deliveryMode',
    'All services are available for "All Stages" businessStage',
  ],
};
