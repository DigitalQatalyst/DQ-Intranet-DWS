export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: string[] };

export interface TabContent {
  heading?: string;
  blocks: ContentBlock[];
  action?: {
    label: string;
    // Which field from the item to open if present (e.g., requestUrl or formUrl)
    urlField?: 'requestUrl' | 'formUrl';
    fallbackUrl?: string;
  };
}

// Content store keyed by marketplace type -> service id -> tab id
const SERVICE_DETAILS_CONTENT: Record<
  string,
  Record<string, Record<string, TabContent>>
> = {
  'non-financial': {
    // IT Support Form
    '1': {
      submit_request: {
        heading: 'Submit Request',
        blocks: [
       
          {
            type: 'p',
            text:
              'This tab is where you log new support requests. Click the “Submit Request” button to open the support form. Note: currently this form opens in a new window (hosted externally); we plan to embed it directly on this page in the future for convenience.',
          },
          { type: 'p', text: 'Steps to submit a ticket:' },
          {
            type: 'ol',
            items: [
              'Open the request form: Click the Submit Request button to launch the support form.',
              'Select a category: Choose the most relevant category for your issue (e.g. Hardware, Software, Network) so that your request reaches the right IT team.',
              'Describe the issue: Enter a clear summary and detailed description. Include error messages, impacted accounts, and attach screenshots or log files if possible.',
              'Set urgency: Indicate the priority or urgency level (e.g. High/Urgent for critical outages, or Normal for routine problems).',
              'Submit the form: Review your entries and click Submit. You will receive an email confirmation with a ticket number.',
            ],
          },
          {
            type: 'p',
            text:
              'After submission, the IT team will acknowledge receipt of your request and follow up with any questions or updates. Providing clear, detailed information (including screenshots and category selection) will speed up resolution.',
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'requestUrl',
          fallbackUrl: 'https://forms.office.com/pages/responsepage.aspx?id=Db2eGYYpPU-GWUOIxbKnJCT2lmSqJbRJkPMD7v6Rk31UNjlVQjlRSjFBUk5MSTNGUDJNTjk0S1NMVi4u&route=shorturl'
        },
      },
      self_service_faq: {
        heading: 'Self-Service & FAQs',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Offer troubleshooting tips, common fixes, and resources so you can often resolve issues without submitting a ticket.',
          },
          {
            type: 'p',
            text:
              'Before submitting a ticket, you may find answers to common problems through our self-help resources. Here are quick tips for frequent issues:',
          },
          {
            type: 'ul',
            items: [
              'Account and Password Issues: Confirm correct DQ credentials. If locked out or forgot your password, use the reset tool or contact IT. Verify your DQ account is active.',
              'Network & Connectivity: Check cables/Wi‑Fi, restart your device, ensure VPN is connected for off‑site access, and check for broader outages.',
              'Software Errors or Crashes: Restart the application and your computer, ensure updates are installed, and if needed reinstall or try another device.',
              'Hardware & Peripherals: Verify power and connections; check drivers. For printers/scanners, check paper/ink and network settings.',
              'Microsoft Teams and Email: Sign out/in, try the web version, check Office 365 service status, and ensure your license is active.',
              'General Tips: A quick restart often resolves minor glitches. Consider whether a recent update/installation changed behavior.',
            ],
          },
          {
            type: 'p',
            text:
              'If these steps don’t resolve your issue, use the Submit Request tab to contact IT and include what you’ve already tried.',
          },
        ],
      },
      contact_sla: {
        heading: 'Contact & SLAs',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Provide support contact methods, hours of operation, and expected response times (SLAs).',
          },
          {
            type: 'p',
            text:
              'Support Hours: Monday–Friday, 8:00 AM to 5:00 PM (Nairobi time). Outside these hours, responses may be delayed unless the issue is critical.',
          },
          {
            type: 'ul',
            items: [
              'Ticket/Email (Preferred): Submit a request via the form or email it-support@dq.com for non‑urgent issues.',
              'Phone/Chat (Urgent): For emergencies, message the IT Support group in Microsoft Teams.',
            ],
          },
          {
            type: 'ul',
            items: [
              'Acknowledgment: Ticket acknowledgment typically within minutes.',
              'First Response: For routine issues, initial response within about one business day (often within an hour).',
              'Resolution Time: Varies based on complexity; we’ll keep you updated and prioritize high‑priority issues.',
              'Escalation: Tickets requiring specialist/higher‑level support are escalated appropriately.',
            ],
          },
          {
            type: 'p',
            text:
              'Scope & Eligibility: Support covers DQ‑managed systems for DQ associates. Personal devices or external services are not supported. Please use your DQ login or email when contacting support.',
          },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [{ type: 'p', text: 'No required documents.' }],
      },
    },
    // Support Charter Template
    '2': {
      submit_request: {
        heading: 'Use the Support Charter Template',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Provide a clear, standardized support charter outlining scope, responsibilities, and expectations.',
          },
          {
            type: 'ol',
            items: [
              'Download the template from the Resources section or request it from IT Admin if needed.',
              'Fill out scope, roles/responsibilities, service hours, escalation paths, and SLAs.',
              'Review with your team and relevant stakeholders to confirm accuracy.',
              'Submit the finalized charter for approval and circulation.',
            ],
          },
          {
            type: 'p',
            text:
              'Tip: Keep the charter concise and focused. Revisit quarterly to ensure it reflects current operations and contacts.',
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'templateUrl',
          fallbackUrl: '#',
        },
      },
      self_service_faq: {
        heading: 'Guidance & FAQs',
        blocks: [
          {
            type: 'ul',
            items: [
              'What is a support charter? A short document describing the support scope and expectations.',
              'Who signs off? Typically team lead, service owner, and IT operations lead.',
              'How often to update? At least every quarter or when responsibilities change.',
            ],
          },
        ],
      },
      contact_sla: {
        heading: 'Contacts & Review',
        blocks: [
          { type: 'p', text: 'For help shaping the charter, contact IT Admin or your department lead.' },
          {
            type: 'ul',
            items: [
              'Review cycle: Quarterly (recommended).',
              'Escalation: Department head → IT Operations Lead.',
            ],
          },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [{ type: 'p', text: 'No required documents.' }],
      },
    },
    // IT Support Walkthrough (video/guide)
    '3': {
      submit_request: {
        heading: 'Follow the Walkthrough',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Quickly learn how to submit an IT support ticket correctly using a short walkthrough.',
          },
          {
            type: 'ol',
            items: [
              'Open the walkthrough and watch the steps end‑to‑end.',
              'Gather details: issue summary, steps to reproduce, error messages, attachments.',
              'Open the Submit Request tab and follow the same steps to log your ticket.',
            ],
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'videoUrl',
          fallbackUrl: '#',
        },
      },
      self_service_faq: {
        heading: 'Common Issues to Try First',
        blocks: [
          {
            type: 'ul',
            items: [
              'Restart the app/device and try again.',
              'Check VPN/Network and sign back into Microsoft 365.',
              'Update to the latest version of the affected software.',
            ],
          },
        ],
      },
      contact_sla: {
        heading: 'Support & Response',
        blocks: [
          { type: 'p', text: 'Standard hours: Mon–Fri, 9:00–17:00. For urgent outages, call the IT line.' },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [{ type: 'p', text: 'No required documents.' }],
      },
    },
    // Bookings
    '4': {
      submit_request: {
        heading: 'Submit a Booking',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Request rooms, equipment, or services through Admin/Operations.',
          },
          {
            type: 'ol',
            items: [
              'Open the booking form and choose the required category (room, equipment, logistics).',
              'Provide dates, times, attendees, and any special requirements.',
              'Submit and await confirmation/clarifications from Admin.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Booking Tips',
        blocks: [
          {
            type: 'ul',
            items: [
              'Book early for larger events to secure preferred rooms.',
              'Include setup/teardown time in your request.',
            ],
          },
        ],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Admin responds within 1 business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Staff Requisition
    '5': {
      submit_request: {
        heading: 'Request Staff',
        blocks: [
          { type: 'p', text: 'Purpose: Request staff allocation or temporary support for an activity/project.' },
          {
            type: 'ol',
            items: [
              'Open the staff requisition form.',
              'Specify role, duration, skills needed, and cost center (if applicable).',
              'Submit and await HR/Admin acknowledgment.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Guidance',
        blocks: [{ type: 'p', text: 'Ensure you have approvals/budget alignment before submitting the requisition.' }],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Initial response typically within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Registration
    '6': {
      submit_request: {
        heading: 'Submit a Registration',
        blocks: [
          { type: 'p', text: 'Purpose: Register for programs, platforms, or events managed by Admin/Operations.' },
          {
            type: 'ol',
            items: [
              'Open the registration form and select the registration type.',
              'Fill participant details and any required identifiers.',
              'Submit and watch for confirmation details or next steps.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: { heading: 'FAQs', blocks: [{ type: 'p', text: 'Registrations may close when capacity is reached—apply early.' }] },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Response typically within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // DTMP (Digital Template / Process)
    '7': {
      submit_request: {
        heading: 'Start DTMP',
        blocks: [
          { type: 'p', text: 'Purpose: Initiate a Digital Template/Process request for your team.' },
          {
            type: 'ol',
            items: [
              'Open the DTMP request form.',
              'Describe the process/template required and its intended use.',
              'Attach any examples or existing materials for reference.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: { heading: 'Resources', blocks: [{ type: 'p', text: 'Check if there is an existing DTMP you can reuse.' }] },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'We aim to respond within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Governance
    '8': {
      submit_request: {
        heading: 'Request Governance Review',
        blocks: [
          { type: 'p', text: 'Purpose: Request a governance or policy review for a process or document.' },
          { type: 'ol', items: ['Open the governance request form.', 'Attach current policy/process.', 'Submit for review.'] },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Guidelines',
        blocks: [{ type: 'p', text: 'Ensure you are using the latest templates and reference policies before requesting changes.' }],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Review timeline depends on scope; acknowledgments within one business day.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Proposal
    '9': {
      submit_request: {
        heading: 'Submit Proposal',
        blocks: [
          { type: 'p', text: 'Purpose: Submit a proposal for review and approval.' },
          {
            type: 'ol',
            items: [
              'Open the proposal submission form.',
              'Provide summary, objectives, scope, timeline, and budget (if applicable).',
              'Attach draft proposal or slide deck.',
            ],
          },
        ],
        action: { label: 'Request Service', urlField: 'requestUrl', fallbackUrl: '#' },
      },
      self_service_faq: {
        heading: 'Templates & Tips',
        blocks: [
          { type: 'p', text: 'Use the latest proposal template to speed up approvals.' },
          { type: 'ul', items: ['Be concise', 'Highlight business impact', 'Outline measurable outcomes'] },
        ],
      },
      contact_sla: { heading: 'Contacts & SLAs', blocks: [{ type: 'p', text: 'Initial review typically within two business days.' }] },
      required_documents: { heading: 'Required Documents', blocks: [{ type: 'p', text: 'No required documents.' }] },
    },
    // Cursor AI
    '10': {
      submit_request: {
        heading: 'Request Cursor AI Access',
        blocks: [
          {
            type: 'p',
            text:
              'Cursor AI is an advanced AI-powered code editor that enhances your development workflow with intelligent code completion, natural language editing, and AI-assisted debugging. This tool helps developers write better code faster by leveraging cutting-edge AI technology.',
          },
          {
            type: 'p',
            text:
              'Click the "Request Service" button below to submit your Cursor AI access request. The form will open in a new window where you can provide the necessary information for license provisioning.',
          },
          { type: 'p', text: 'Steps to request Cursor AI access:' },
          {
            type: 'ol',
            items: [
              'Open the request form: Click the Request Service button to launch the Cursor AI access request form.',
              'Provide your details: Enter your name, department, role, and DQ email address.',
              'Specify use case: Describe your primary use case and how Cursor AI will benefit your work (e.g., backend development, frontend work, full-stack projects, code reviews).',
              'Acknowledge policies: Review and accept the AI tool usage policies and best practices guidelines.',
              'Select license type: Choose between individual license or team license (if requesting for multiple team members).',
              'Submit the form: Review your entries and click Submit. You will receive an email confirmation with your request number.',
            ],
          },
          {
            type: 'p',
            text:
              'After submission, the Digital Innovation team will review your request and verify your eligibility. Once approved, you will receive license activation instructions, installation guides, and access to onboarding resources. Initial setup typically takes 1-2 business days.',
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'requestUrl',
          fallbackUrl: 'https://forms.office.com/pages/responsepage.aspx?id=CursorAIRequest',
        },
      },
      self_service_faq: {
        heading: 'Cursor AI FAQs & Best Practices',
        blocks: [
          {
            type: 'p',
            text:
              'Before submitting your request, review these frequently asked questions and best practices to ensure you get the most out of Cursor AI.',
          },
          { type: 'p', text: 'Frequently Asked Questions:' },
          {
            type: 'ul',
            items: [
              'What is Cursor AI? Cursor AI is an AI-powered code editor built on VS Code that provides intelligent code completion, natural language code generation, chat-based coding assistance, and AI-powered debugging capabilities.',
              'Who is eligible? All DQ developers, engineers, and technical staff working on software development projects are eligible to request Cursor AI access.',
              'What does the license include? The license includes full access to Cursor AI features, AI model access (GPT-4, Claude, etc.), unlimited code completions, and integration with DQ development environments.',
              'Do I need training? Yes, basic AI tool usage training is required. You will receive access to a 30-minute onboarding session and documentation covering best practices, security guidelines, and effective prompting techniques.',
              'Can I use it with existing projects? Yes, Cursor AI works with all programming languages and can be integrated into your existing development workflow. It supports all major frameworks and version control systems.',
              'What about data privacy? All code processed by Cursor AI follows DQ data governance policies. Sensitive or proprietary code should be reviewed according to our AI usage guidelines before using AI assistance.',
            ],
          },
          { type: 'p', text: 'Best Practices:' },
          {
            type: 'ul',
            items: [
              'Start with small tasks: Begin by using Cursor AI for code completion and refactoring before moving to more complex tasks.',
              'Review AI-generated code: Always review and test AI-generated code before committing to ensure it meets quality standards and security requirements.',
              'Use natural language effectively: Write clear, specific prompts when asking Cursor AI to generate or modify code.',
              'Leverage context: Cursor AI works best when it has access to relevant files and context in your project.',
              'Follow security guidelines: Do not share sensitive credentials, API keys, or proprietary business logic in prompts.',
              'Stay updated: Regularly check for Cursor AI updates and new feature announcements from the Digital Innovation team.',
            ],
          },
          {
            type: 'p',
            text:
              'For additional resources, tips, and community discussions, join the #cursor-ai channel on Microsoft Teams.',
          },
        ],
      },
      contact_sla: {
        heading: 'Contact & Service Level',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Provide contact information, support hours, and expected response times for Cursor AI access requests and support.',
          },
          {
            type: 'p',
            text:
              'Support Hours: Monday–Friday, 9:00 AM to 5:00 PM (DQ business days). Requests submitted outside these hours will be processed on the next business day.',
          },
          { type: 'p', text: 'Contact Methods:' },
          {
            type: 'ul',
            items: [
              'Access Requests: Submit via the request form or email digital-innovation@dq.com for new access requests.',
              'Technical Support: For installation or usage issues, contact the Digital Innovation team via Microsoft Teams (#cursor-ai channel) or email.',
              'License Issues: For license activation or renewal issues, email digital-innovation@dq.com with your request number.',
              'Training & Onboarding: Schedule onboarding sessions through the Digital Innovation team.',
            ],
          },
          { type: 'p', text: 'Service Level Agreements:' },
          {
            type: 'ul',
            items: [
              'Request Acknowledgment: All requests are acknowledged within 2 hours during business hours.',
              'Initial Response: Eligibility review and initial response within 1 business day.',
              'License Provisioning: Approved requests are processed and licenses provisioned within 1-2 business days.',
              'Technical Support: Installation and technical issues are addressed within 4 hours during business hours.',
              'Training Access: Onboarding materials and training session links provided within 24 hours of license activation.',
            ],
          },
          {
            type: 'p',
            text:
              'Scope & Eligibility: Cursor AI access is available to DQ technical staff with development responsibilities. Requests must include a valid business justification and manager approval for team licenses. Personal or non-DQ projects are not supported.',
          },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [
          {
            type: 'p',
            text:
              'To complete your Cursor AI access request, you may need to provide the following information or documentation:',
          },
          {
            type: 'ul',
            items: [
              'Business Justification: Brief description of how Cursor AI will be used in your role (provided in the request form).',
              'Manager Approval: For individual licenses, manager approval may be required based on your department policy.',
              'Team License Request: For team licenses (5+ users), provide list of team members with names, email addresses, and roles.',
              'Project Details: If requesting for a specific project, provide project name and expected duration of usage.',
              'Training Completion: After receiving access, completion of the mandatory AI tool usage training is required within 5 business days.',
            ],
          },
          {
            type: 'p',
            text:
              'Note: Most individual license requests only require completion of the online form with business justification. Additional documentation is typically only needed for team licenses or special circumstances.',
          },
        ],
      },
    },
    // Lovable AI
    '11': {
      submit_request: {
        heading: 'Request Lovable AI Access',
        blocks: [
          {
            type: 'p',
            text:
              'Lovable AI is an innovative low-code platform that leverages artificial intelligence to help you build full-stack web applications rapidly. With natural language instructions, you can create production-ready applications without extensive coding experience. This platform is ideal for rapid prototyping, MVP development, and bringing ideas to life quickly.',
          },
          {
            type: 'p',
            text:
              'Click the "Request Service" button below to submit your Lovable AI access request. The form will open in a new window where you can provide the necessary information for platform access provisioning.',
          },
          { type: 'p', text: 'Steps to request Lovable AI access:' },
          {
            type: 'ol',
            items: [
              'Open the request form: Click the Request Service button to launch the Lovable AI access request form.',
              'Provide your details: Enter your name, department, role, and DQ email address.',
              'Specify use case: Describe what you plan to build with Lovable AI (e.g., internal tools, customer-facing apps, prototypes, MVPs).',
              'Project information: Provide brief details about your project including expected timeline and business value.',
              'Acknowledge policies: Review and accept the AI tool usage policies, data governance guidelines, and low-code platform best practices.',
              'Select access level: Choose between individual access or team access (if requesting for multiple team members).',
              'Submit the form: Review your entries and click Submit. You will receive an email confirmation with your request number.',
            ],
          },
          {
            type: 'p',
            text:
              'After submission, the Digital Innovation team will review your request and assess the use case. Once approved, you will receive platform access credentials, getting started guides, and links to tutorial resources. Platform access is typically provisioned within 1-2 business days.',
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'requestUrl',
          fallbackUrl: 'https://forms.office.com/pages/responsepage.aspx?id=LovableAIRequest',
        },
      },
      self_service_faq: {
        heading: 'Lovable AI FAQs & Best Practices',
        blocks: [
          {
            type: 'p',
            text:
              'Before submitting your request, review these frequently asked questions and best practices to maximize your success with Lovable AI.',
          },
          { type: 'p', text: 'Frequently Asked Questions:' },
          {
            type: 'ul',
            items: [
              'What is Lovable AI? Lovable AI is a low-code platform powered by AI that enables you to build full-stack web applications using natural language instructions. It generates production-ready code, handles frontend and backend development, and integrates with databases and APIs.',
              'Who should use Lovable AI? Product managers, designers, business analysts, and developers who need to rapidly prototype ideas, build MVPs, or create internal tools without extensive coding are ideal users.',
              'What can I build? You can build various web applications including dashboards, CRUD applications, admin panels, internal tools, customer portals, and prototypes for proof-of-concept projects.',
              'Do I need coding experience? While coding experience is helpful for advanced customizations, Lovable AI is designed to be accessible to users with limited coding knowledge. You describe what you want in natural language, and the AI generates the code.',
              'What technologies does it use? Lovable AI generates modern web applications using React, TypeScript, Node.js, and popular frameworks. The generated code is clean, maintainable, and follows industry best practices.',
              'Can I export the code? Yes, you can export and deploy the generated code to your own infrastructure. The platform generates standard code that you own and can modify as needed.',
              'What about data and security? All applications built on Lovable AI must follow DQ data governance policies. Avoid using production data or sensitive information during development. Review security guidelines before deployment.',
            ],
          },
          { type: 'p', text: 'Best Practices:' },
          {
            type: 'ul',
            items: [
              'Start simple: Begin with a basic application to learn the platform before tackling complex projects.',
              'Be specific in prompts: Provide clear, detailed descriptions of what you want to build. The more specific your instructions, the better the AI-generated results.',
              'Iterate incrementally: Build your application in small steps, testing each feature before adding new ones.',
              'Review generated code: Always review the AI-generated code to understand what was created and ensure it meets your requirements.',
              'Follow naming conventions: Use consistent naming for components, pages, and features to keep your project organized.',
              'Test thoroughly: Test all features and user flows before deploying to production or sharing with stakeholders.',
              'Document your work: Keep notes on your prompts and design decisions to help with future iterations and team handoffs.',
              'Join the community: Connect with other Lovable AI users in the #lovable-ai channel on Microsoft Teams to share tips and learn from others.',
            ],
          },
          {
            type: 'p',
            text:
              'For tutorials, video guides, and template projects, visit the Lovable AI resource center or join the weekly office hours session hosted by the Digital Innovation team.',
          },
        ],
      },
      contact_sla: {
        heading: 'Contact & Service Level',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Provide contact information, support hours, and expected response times for Lovable AI access requests and platform support.',
          },
          {
            type: 'p',
            text:
              'Support Hours: Monday–Friday, 9:00 AM to 5:00 PM (DQ business days). Requests submitted outside these hours will be processed on the next business day.',
          },
          { type: 'p', text: 'Contact Methods:' },
          {
            type: 'ul',
            items: [
              'Access Requests: Submit via the request form or email digital-innovation@dq.com for new access requests.',
              'Platform Support: For platform issues, usage questions, or troubleshooting, contact the Digital Innovation team via Microsoft Teams (#lovable-ai channel) or email.',
              'License Issues: For access problems or account issues, email digital-innovation@dq.com with your request number.',
              'Training & Resources: Join weekly office hours every Wednesday at 2:00 PM or schedule one-on-one sessions through the Digital Innovation team.',
              'Project Consultation: For guidance on whether Lovable AI is suitable for your project, request a consultation with the Digital Innovation team.',
            ],
          },
          { type: 'p', text: 'Service Level Agreements:' },
          {
            type: 'ul',
            items: [
              'Request Acknowledgment: All requests are acknowledged within 2 hours during business hours.',
              'Initial Response: Use case review and eligibility assessment within 1 business day.',
              'Access Provisioning: Approved requests are processed and platform access granted within 1-2 business days.',
              'Technical Support: Platform issues and technical questions are addressed within 4 hours during business hours.',
              'Training Access: Getting started guides and tutorial access provided immediately upon platform access activation.',
              'Consultation Requests: Project consultation meetings scheduled within 3 business days.',
            ],
          },
          {
            type: 'p',
            text:
              'Scope & Eligibility: Lovable AI access is available to DQ staff working on approved internal projects, prototypes, or MVPs. Requests must include a valid use case and business justification. External client projects may require additional approvals. Personal or non-DQ projects are not supported.',
          },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [
          {
            type: 'p',
            text:
              'To complete your Lovable AI access request, you may need to provide the following information:',
          },
          {
            type: 'ul',
            items: [
              'Use Case Description: Detailed description of what you plan to build and the business problem it solves (provided in the request form).',
              'Project Brief: Brief overview of your project including objectives, expected users, and timeline.',
              'Manager Approval: Manager approval may be required for certain projects based on department policy.',
              'Team Access Request: For team access (multiple users), provide list of team members with names, email addresses, and their roles in the project.',
              'Data Governance Acknowledgment: Confirmation that you understand and will comply with DQ data governance policies when building applications.',
              'Training Completion: After receiving access, completion of the getting started tutorial and AI tool usage training is recommended within 5 business days.',
            ],
          },
          {
            type: 'p',
            text:
              'Note: Most individual access requests only require completion of the online form with a clear use case description. Additional documentation is typically only needed for team access or projects involving sensitive data.',
          },
        ],
      },
    },
    // Sora AI
    '12': {
      submit_request: {
        heading: 'Request Sora AI Access',
        blocks: [
          {
            type: 'p',
            text:
              'Sora AI is a cutting-edge AI-powered video generation platform that transforms text descriptions into high-quality professional videos. Whether you need marketing content, training materials, product demonstrations, or creative visual storytelling, Sora AI enables you to create compelling video content without traditional video production expertise or equipment.',
          },
          {
            type: 'p',
            text:
              'Click the "Request Service" button below to submit your Sora AI access request. The form will open in a new window where you can provide the necessary information for platform access provisioning.',
          },
          { type: 'p', text: 'Steps to request Sora AI access:' },
          {
            type: 'ol',
            items: [
              'Open the request form: Click the Request Service button to launch the Sora AI access request form.',
              'Provide your details: Enter your name, department, role, and DQ email address.',
              'Specify use case: Describe your intended use for Sora AI (e.g., marketing videos, training content, product demos, internal communications, presentations).',
              'Content requirements: Outline the type and volume of video content you plan to create, including approximate duration and frequency.',
              'Acknowledge policies: Review and accept the AI content generation policies, brand guidelines, copyright considerations, and ethical AI usage guidelines.',
              'Select access level: Choose between individual access or team access (if requesting for multiple content creators).',
              'Submit the form: Review your entries and click Submit. You will receive an email confirmation with your request number.',
            ],
          },
          {
            type: 'p',
            text:
              'After submission, the Digital Innovation team will review your request and assess the use case for compliance with content guidelines. Once approved, you will receive platform access credentials, video generation tutorials, and links to best practices documentation. Platform access is typically provisioned within 2-3 business days.',
          },
        ],
        action: {
          label: 'Request Service',
          urlField: 'requestUrl',
          fallbackUrl: 'https://forms.office.com/pages/responsepage.aspx?id=SoraAIRequest',
        },
      },
      self_service_faq: {
        heading: 'Sora AI FAQs & Best Practices',
        blocks: [
          {
            type: 'p',
            text:
              'Before submitting your request, review these frequently asked questions and best practices to get the most out of Sora AI video generation.',
          },
          { type: 'p', text: 'Frequently Asked Questions:' },
          {
            type: 'ul',
            items: [
              'What is Sora AI? Sora AI is an AI-powered video generation platform that creates realistic, high-quality videos from text descriptions. It uses advanced machine learning models to generate video content including scenes, movements, camera angles, and visual effects based on your prompts.',
              'Who should use Sora AI? Marketing teams, content creators, L&D professionals, product managers, communications teams, and anyone who needs to create video content quickly without traditional video production resources.',
              'What types of videos can I create? You can create marketing videos, product demonstrations, training modules, explainer videos, social media content, internal communications, presentation videos, concept visualizations, and more.',
              'Do I need video production experience? No video production experience is required. You describe what you want to see in natural language, and Sora AI generates the video. However, understanding basic storytelling and visual communication principles will help you create more effective content.',
              'How long does it take to generate a video? Generation time varies based on video length and complexity. Short videos (15-30 seconds) typically generate in 2-5 minutes, while longer, more complex videos may take 10-20 minutes.',
              'What video formats and quality are supported? Sora AI generates videos in standard formats (MP4, MOV) with resolutions up to 1080p. You can specify aspect ratios for different platforms (16:9 for YouTube, 9:16 for social media stories, 1:1 for Instagram).',
              'Can I edit the generated videos? Yes, you can download generated videos and edit them using standard video editing tools. You can also regenerate specific scenes or create variations using different prompts.',
              'What about copyright and usage rights? Videos generated by Sora AI are owned by DQ and can be used for business purposes. You must follow DQ brand guidelines and cannot use generated content that includes copyrighted materials, trademarked content, or violates third-party rights.',
            ],
          },
          { type: 'p', text: 'Best Practices:' },
          {
            type: 'ul',
            items: [
              'Write clear, detailed prompts: Describe the scene, actions, camera movements, lighting, and mood. The more specific your description, the better the results.',
              'Start with shorter videos: Begin with 15-30 second videos to learn the platform before creating longer content.',
              'Iterate and refine: Generate multiple variations of your video by adjusting your prompts. Test different descriptions to achieve the desired result.',
              'Follow brand guidelines: Ensure generated content aligns with DQ visual identity, brand colors, and messaging guidelines.',
              'Plan your narrative: Outline your story or message structure before generating videos. Break complex stories into shorter scenes.',
              'Review for accuracy: Always review generated content for factual accuracy, appropriate messaging, and alignment with your objectives.',
              'Respect ethical guidelines: Do not create misleading content, deepfakes of real people without consent, or content that could be harmful or offensive.',
              'Optimize for platform: Consider where the video will be used and optimize aspect ratio, duration, and content accordingly.',
              'Combine with other tools: Use Sora AI alongside traditional editing tools for titles, branding, music, and final polish.',
              'Join the community: Connect with other Sora AI users in the #sora-ai channel on Microsoft Teams to share tips and creative techniques.',
            ],
          },
          {
            type: 'p',
            text:
              'For video tutorials, prompt templates, and creative inspiration, visit the Sora AI resource center or attend monthly showcase sessions hosted by the Digital Innovation team.',
          },
        ],
      },
      contact_sla: {
        heading: 'Contact & Service Level',
        blocks: [
          {
            type: 'p',
            text:
              'Purpose: Provide contact information, support hours, and expected response times for Sora AI access requests and video generation support.',
          },
          {
            type: 'p',
            text:
              'Support Hours: Monday–Friday, 9:00 AM to 5:00 PM (DQ business days). Requests submitted outside these hours will be processed on the next business day.',
          },
          { type: 'p', text: 'Contact Methods:' },
          {
            type: 'ul',
            items: [
              'Access Requests: Submit via the request form or email digital-innovation@dq.com for new access requests.',
              'Platform Support: For platform issues, generation problems, or technical questions, contact the Digital Innovation team via Microsoft Teams (#sora-ai channel) or email.',
              'License Issues: For access problems or account issues, email digital-innovation@dq.com with your request number.',
              'Training & Resources: Join monthly showcase sessions (first Thursday at 3:00 PM) or schedule one-on-one training through the Digital Innovation team.',
              'Content Consultation: For guidance on video concepts, brand compliance, or creative direction, request a consultation with the Digital Content team.',
              'Brand Review: For videos requiring brand approval, submit through the Marketing Brand Review process.',
            ],
          },
          { type: 'p', text: 'Service Level Agreements:' },
          {
            type: 'ul',
            items: [
              'Request Acknowledgment: All requests are acknowledged within 2 hours during business hours.',
              'Initial Response: Use case review and compliance assessment within 1 business day.',
              'Access Provisioning: Approved requests are processed and platform access granted within 2-3 business days.',
              'Technical Support: Platform issues and technical questions are addressed within 4 hours during business hours.',
              'Training Access: Getting started guides and tutorial access provided immediately upon platform access activation.',
              'Content Consultation: Creative consultation meetings scheduled within 3-5 business days.',
              'Generation Time: Video generation typically completes within 2-20 minutes depending on complexity.',
            ],
          },
          {
            type: 'p',
            text:
              'Scope & Eligibility: Sora AI access is available to DQ staff working on approved business content, marketing materials, training programs, or internal communications. Requests must include a valid business use case. All generated content must comply with DQ brand guidelines, content policies, and ethical AI usage standards. Personal or non-business content creation is not supported.',
          },
        ],
      },
      required_documents: {
        heading: 'Required Documents',
        blocks: [
          {
            type: 'p',
            text:
              'To complete your Sora AI access request, you may need to provide the following information:',
          },
          {
            type: 'ul',
            items: [
              'Use Case Description: Detailed description of the video content you plan to create and the business purpose it serves (provided in the request form).',
              'Content Plan: Brief overview of your content strategy including target audience, video types, estimated volume, and distribution channels.',
              'Manager Approval: Manager approval is required for all Sora AI access requests to ensure alignment with team objectives and budget.',
              'Brand Compliance Acknowledgment: Confirmation that you understand and will comply with DQ brand guidelines and content policies.',
              'Team Access Request: For team access (multiple users), provide list of team members with names, email addresses, roles, and their specific content creation needs.',
              'Budget Allocation: For high-volume usage, provide cost center information and approved budget allocation.',
              'Training Completion: After receiving access, completion of the Sora AI fundamentals training and ethical AI content creation module is required within 7 business days.',
            ],
          },
          {
            type: 'p',
            text:
              'Note: All access requests require manager approval due to licensing costs and content governance requirements. Individual creators should provide a clear use case and expected content volume. Team licenses require additional justification and budget approval.',
          },
        ],
      },
    },
  },
};

export function getServiceTabContent(
  marketplaceType: string,
  serviceId: string | undefined,
  tabId: string
): TabContent | undefined {
  if (!serviceId) return undefined;
  return SERVICE_DETAILS_CONTENT[marketplaceType]?.[serviceId]?.[tabId];
}


