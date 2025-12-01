import * as React from 'react';
import { ReactNode } from 'react';
import { Clock, Users, Award, FileText, Info, BookOpen, ClipboardList } from 'lucide-react';
import { mockNonFinancialServices } from './mockMarketplaceData';
// Define a Tab type for consistency across marketplace pages
export interface MarketplaceTab {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
// Configuration type definitions
export interface AttributeConfig {
  key: string;
  label: string;
  icon: ReactNode;
  formatter?: (value: any) => string;
}
export interface TabConfig {
  id: string;
  label: string;
  icon?: any;
  iconBgColor?: string;
  iconColor?: string;
  renderContent?: (item: any, marketplaceType: string) => React.ReactNode;
}
export interface FilterCategoryConfig {
  id: string;
  title: string;
  options: {
    id: string;
    name: string;
  }[];
}
export interface MarketplaceConfig {
  id: string;
  title: string;
  description: string;
  route: string;
  primaryCTA: string;
  secondaryCTA: string;
  itemName: string;
  itemNamePlural: string;
  attributes: AttributeConfig[];
  detailSections: string[];
  tabs: TabConfig[];
  summarySticky?: boolean;
  filterCategories: FilterCategoryConfig[];
  // New fields for GraphQL integration
  mapListResponse?: (data: any[]) => any[];
  mapDetailResponse?: (data: any) => any;
  mapFilterResponse?: (data: any) => FilterCategoryConfig[];
  // Mock data for fallback and schema reference
  mockData?: {
    items: any[];
    filterOptions: any;
    providers: any[];
  };
}
// Mock data for Service Center (non-financial services)
export const mockNonFinancialServicesData = {
  items: mockNonFinancialServices,
  filterOptions: {
    categories: [{
      id: 'technology',
      name: 'Technology'
    }, {
      id: 'business',
      name: 'Business'
    }, {
      id: 'digital_worker',
      name: 'Digital Worker'
    }, {
      id: 'prompt_library',
      name: 'Prompt Library'
    }, {
      id: 'doc_writer',
      name: 'DOC Writer'
    }, {
      id: 'ai_tools',
      name: 'AI Tools'
    }],
    serviceTypes: [{
      id: 'query',
      name: 'Query'
    }, {
      id: 'support',
      name: 'Support'
    }, {
      id: 'requisition',
      name: 'Requisition'
    }, {
      id: 'self-service',
      name: 'Self-Service'
    }],
    deliveryModes: [{
      id: 'online',
      name: 'Online'
    }, {
      id: 'inperson',
      name: 'In person'
    }, {
      id: 'hybrid',
      name: 'Hybrid'
    }]
  },
  providers: [] // Not used in Service Center, but required by type definition
};

// Define marketplace configurations

export const marketplaceConfig: Record<string, MarketplaceConfig> = {
  'non-financial': {
    id: 'non-financial',
    title: 'Services Center',
    description: "Welcome to DigitalQatalyst's Services Center. We're here to ensure your success with dedicated assistance, efficient solutions, comprehensive tools, expert guidance, and both technical and operational support.",
    route: '/marketplace/services-center',
    primaryCTA: 'Request Service',
    secondaryCTA: 'View Details',
    itemName: 'Business Service',
    itemNamePlural: 'Services Center',
    attributes: [{
      key: 'serviceType',
      label: 'Service Type',
      icon: React.createElement(Award, { size: 18, className: "mr-2" })
    }, {
      key: 'deliveryMode',
      label: 'Service Mode',
      icon: React.createElement(Users, { size: 18, className: "mr-2" })
    }, {
      key: 'duration',
      label: 'Duration',
      icon: React.createElement(Clock, { size: 18, className: "mr-2" })
    }],
    detailSections: ['description', 'deliveryDetails', 'provider', 'related'],
    tabs: [
      {
        id: 'submit_request',
        label: 'Submit Request',
        icon: ClipboardList,
        iconBgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      {
        id: 'self_service_faq',
        label: 'Self-Service & FAQs',
        icon: BookOpen,
        iconBgColor: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      {
        id: 'contact_sla',
        label: 'Contact & SLAs',
        icon: Info,
        iconBgColor: 'bg-amber-50',
        iconColor: 'text-amber-600'
      },
      {
        id: 'required_documents',
        label: 'Required Documents',
        icon: FileText,
        iconBgColor: 'bg-amber-50',
        iconColor: 'text-amber-600'
      }
    ],
    summarySticky: true,
    filterCategories: [{
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [{
        id: 'online',
        name: 'Online'
      }, {
        id: 'inperson',
        name: 'In person'
      }, {
        id: 'hybrid',
        name: 'Hybrid'
      }]
    }, {
      id: 'provider',
      title: 'Department',
      options: [{
        id: 'it_support',
        name: 'IT Support'
      }, {
        id: 'hr',
        name: 'HR'
      }, {
        id: 'finance',
        name: 'Finance'
      }, {
        id: 'admin',
        name: 'Admin'
      }]
    }, {
      id: 'category',
      title: 'Service Category',
      options: [{
        id: 'technology',
        name: 'Technology'
      }, {
        id: 'business',
        name: 'Business'
      }, {
        id: 'digital_worker',
        name: 'Digital Worker'
      }, {
        id: 'prompt_library',
        name: 'Prompt Library'
      }, {
        id: 'doc_writer',
        name: 'DOC Writer'
      }, {
        id: 'ai_tools',
        name: 'AI Tools'
      }]
    }, {
      id: 'location',
      title: 'Location',
      options: [{
        id: 'dubai',
        name: 'Dubai'
      }, {
        id: 'nairobi',
        name: 'Nairobi'
      }, {
        id: 'riyadh',
        name: 'Riyadh'
      }]
    }],
    // Data mapping functions
    mapListResponse: data => {
      return data.map((item: any) => ({
        ...item,
        // Transform any fields if needed
        tags: item.tags || [item.category, item.deliveryMode].filter(Boolean)
      }));
    },
    mapDetailResponse: data => {
      return {
        ...data,
        // Transform any fields if needed
        highlights: data.highlights || data.details || []
      };
    },
    mapFilterResponse: data => {
      return [{
        id: 'deliveryMode',
        title: 'Delivery Mode',
        options: data.deliveryModes || []
      }, {
        id: 'provider',
        title: 'Department',
        options: data.providers || []
      }, {
        id: 'category',
        title: 'Service Category',
        options: data.categories || []
      }, {
        id: 'location',
        title: 'Location',
        options: data.locations || []
      }];
    },
    // Mock data for fallback and schema reference
    mockData: mockNonFinancialServicesData
  }
};
// Helper to get config by marketplace type
export const getMarketplaceConfig = (type: string): MarketplaceConfig => {
  const config = marketplaceConfig[type];
  if (!config) {
    throw new Error(`No configuration found for marketplace type: ${type}`);
  }
  return config;
};

// Tab-specific filters for Services Center
export const getTabSpecificFilters = (tabId?: string): FilterCategoryConfig[] => {
  const baseFilters: FilterCategoryConfig[] = [
    {
      id: 'serviceType',
      title: 'Service Type',
      options: [
        { id: 'query', name: 'Query' },
        { id: 'support', name: 'Support' },
        { id: 'requisition', name: 'Requisition' },
        { id: 'self-service', name: 'Self-Service' }
      ]
    },
    {
      id: 'deliveryMode',
      title: 'Delivery Mode',
      options: [
        { id: 'online', name: 'Online' },
        { id: 'inperson', name: 'In person' },
        { id: 'hybrid', name: 'Hybrid' }
      ]
    },
    {
      id: 'provider',
      title: 'Department',
      options: [
        { id: 'it_support', name: 'IT Support' },
        { id: 'hr', name: 'HR' },
        { id: 'finance', name: 'Finance' },
        { id: 'admin', name: 'Admin' }
      ]
    },
    {
      id: 'location',
      title: 'Location',
      options: [
        { id: 'dubai', name: 'Dubai' },
        { id: 'nairobi', name: 'Nairobi' },
        { id: 'riyadh', name: 'Riyadh' }
      ]
    }
  ];

  // Tab-specific filters for Technology category
  const technologySpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'userCategory',
      title: 'User Category',
      options: [
        { id: 'employee', name: 'Employee' },
        { id: 'contractor', name: 'Contractor' },
        { id: 'intern', name: 'Intern' },
        { id: 'manager', name: 'Manager' }
      ]
    },
    {
      id: 'technicalCategory',
      title: 'Technical Category',
      options: [
        { id: 'hardware', name: 'Hardware' },
        { id: 'software', name: 'Software' },
        { id: 'network', name: 'Network' }
      ]
    },
    {
      id: 'deviceOwnership',
      title: 'Device Ownership',
      options: [
        { id: 'company_device', name: 'Company Device' },
        { id: 'personal_device', name: 'Personal Device (BYOD)' },
        { id: 'fyod', name: 'FYOD' }
      ]
    }
  ];

  // Tab-specific filters for Business category
  const businessSpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'services',
      title: 'Services',
      options: [
        { id: 'human_resources', name: 'Human Resources' },
        { id: 'finance', name: 'Finance' },
        { id: 'procurement', name: 'Procurement' },
        { id: 'administration', name: 'Administration' },
        { id: 'legal', name: 'Legal' },
        { id: 'payroll', name: 'Payroll' }
      ]
    }
  ];

  // Tab-specific filters for Digital Worker category
  const digitalWorkerSpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'serviceDomains',
      title: 'Service Domains',
      options: [
        { id: 'backoffice_operations', name: 'Backoffice Operations' },
        { id: 'automation_integration', name: 'Automation & Integration' },
        { id: 'digital_security', name: 'Digital Security' },
        { id: 'digital_channels', name: 'Digital Channels' },
        { id: 'customer_experiences', name: 'Customer Experiences' },
        { id: 'service_delivery', name: 'Service Delivery' },
        { id: 'marketing_comms', name: 'Marketing & Comms' },
        { id: 'digital_workspace', name: 'Digital Workspace' },
        { id: 'design', name: 'Design' },
        { id: 'business_intelligence', name: 'Business Intelligence' },
        { id: 'it_operations', name: 'IT Operations' }
      ]
    },
    {
      id: 'aiMaturityLevel',
      title: 'AI Maturity Level',
      options: [
        { id: 'level_1', name: 'Level 1 (Prompting)' },
        { id: 'level_2', name: 'Level 2 (Integrate Systems)' },
        { id: 'level_3', name: 'Level 3 (Unified Operations)' },
        { id: 'level_4', name: 'Level 4 (Human Oversight)' },
        { id: 'level_5', name: 'Level 5 (Autonomous)' }
      ]
    }
  ];

  // Tab-specific filters for Prompt Library category
  const promptLibrarySpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'promptType',
      title: 'Prompt Type',
      options: [
        { id: 'business', name: 'Business (Admin, HR, Finance, Ops)' },
        { id: 'tech', name: 'Tech (Hardware, Software)' },
        { id: 'dev_prompts', name: 'Dev Prompts (Software Development)' },
        { id: 'devops_prompts', name: 'DevOps Prompts (Deployment)' },
        { id: 'ai', name: 'AI (Machine Learning)' }
      ]
    }
  ];

  // Tab-specific filters for DOC Writer category
  const docWriterSpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'documentCategory',
      title: 'Document Type',
      options: [
        { id: 'contracts', name: 'Contracts' },
        { id: 'proposals', name: 'Proposals' },
        { id: 'reports', name: 'Reports' },
        { id: 'presentations', name: 'Presentations' },
        { id: 'policies', name: 'Policies' },
        { id: 'procedures', name: 'Procedures' }
      ]
    }
  ];

  // Tab-specific filters for AI Tools category
  const aiToolsSpecificFilters: FilterCategoryConfig[] = [
    {
      id: 'toolCategory',
      title: 'Tool Category',
      options: [
        { id: 'llms', name: 'Large Language Models' },
        { id: 'code_assistants', name: 'Code Assistants' },
        { id: 'design_tools', name: 'Design Tools' },
        { id: 'data_analytics', name: 'Data Analytics' },
        { id: 'automation', name: 'Automation Tools' }
      ]
    }
  ];

  // Return tab-specific filters based on the tab
  if (tabId === 'technology') {
    return [...baseFilters, ...technologySpecificFilters];
  }
  
  if (tabId === 'business') {
    return [...baseFilters, ...businessSpecificFilters];
  }
  
  if (tabId === 'digital_worker') {
    return [...baseFilters, ...digitalWorkerSpecificFilters];
  }
  
  if (tabId === 'prompt_library') {
    return [...baseFilters, ...promptLibrarySpecificFilters];
  }
  
  if (tabId === 'doc_writer') {
    return [...baseFilters, ...docWriterSpecificFilters];
  }
  
  if (tabId === 'ai_tools') {
    return [...baseFilters, ...aiToolsSpecificFilters];
  }
  
  return baseFilters;
};

// Removed old tab-specific filters as they're no longer needed with category-based tabs
/*
  const tabFilters: Record<string, FilterCategoryConfig[]> = {
    'query': [
      {
        id: 'priority',
        title: 'Priority',
        options: [
          { id: 'high', name: 'High' },
          { id: 'medium', name: 'Medium' },
          { id: 'low', name: 'Low' }
        ]
      },
      {
        id: 'responseTime',
        title: 'Response Time',
        options: [
          { id: 'immediate', name: 'Immediate' },
          { id: '1-2days', name: '1-2 Days' },
          { id: '3-5days', name: '3-5 Days' }
        ]
      },
      {
        id: 'status',
        title: 'Status',
        options: [
          { id: 'open', name: 'Open' },
          { id: 'in_progress', name: 'In Progress' },
          { id: 'resolved', name: 'Resolved' }
        ]
      }
    ],
    'support': [
      {
        id: 'supportType',
        title: 'Support Type',
        options: [
          { id: 'technical', name: 'Technical' },
          { id: 'account', name: 'Account' },
          { id: 'access', name: 'Access' },
          { id: 'system', name: 'System' }
        ]
      },
      {
        id: 'urgency',
        title: 'Urgency',
        options: [
          { id: 'critical', name: 'Critical' },
          { id: 'high', name: 'High' },
          { id: 'medium', name: 'Medium' },
          { id: 'low', name: 'Low' }
        ]
      },
      {
        id: 'status',
        title: 'Status',
        options: [
          { id: 'open', name: 'Open' },
          { id: 'in_progress', name: 'In Progress' },
          { id: 'resolved', name: 'Resolved' }
        ]
      }
    ],
    'requisition': [
      {
        id: 'requestType',
        title: 'Request Type',
        options: [
          { id: 'staff', name: 'Staff' },
          { id: 'equipment', name: 'Equipment' },
          { id: 'booking', name: 'Booking' },
          { id: 'registration', name: 'Registration' }
        ]
      },
      {
        id: 'approvalStatus',
        title: 'Approval Status',
        options: [
          { id: 'pending', name: 'Pending' },
          { id: 'approved', name: 'Approved' },
          { id: 'rejected', name: 'Rejected' }
        ]
      },
      {
        id: 'budgetRange',
        title: 'Budget Range',
        options: [
          { id: 'under_1k', name: 'Under 1K' },
          { id: '1k_10k', name: '1K - 10K' },
          { id: '10k_plus', name: '10K+' }
        ]
      }
    ],
    'self-service': [
      {
        id: 'format',
        title: 'Format',
        options: [
          { id: 'video', name: 'Video' },
          { id: 'guide', name: 'Guide' },
          { id: 'template', name: 'Template' },
          { id: 'walkthrough', name: 'Walkthrough' }
        ]
      },
      {
        id: 'difficulty',
        title: 'Difficulty',
        options: [
          { id: 'beginner', name: 'Beginner' },
          { id: 'intermediate', name: 'Intermediate' },
          { id: 'advanced', name: 'Advanced' }
        ]
      },
      {
        id: 'duration',
        title: 'Duration',
        options: [
          { id: 'quick', name: 'Quick (< 5 min)' },
          { id: 'medium', name: 'Medium (5-15 min)' },
          { id: 'long', name: 'Long (> 15 min)' }
        ]
      }
    ]
  };
*/
