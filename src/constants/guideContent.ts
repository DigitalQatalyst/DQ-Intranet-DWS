// Content data for the 8 core service area detail pages
// This content should be used exactly as provided - do not summarize or change

export interface GuideContent {
  title: string
  subtitle: string
  shortOverview: string
  highlights: string[]
  storybookIntro: string
  whatYouWillLearn: string[]
}

export const GUIDE_CONTENT: Record<string, GuideContent> = {
  'ghc': {
    title: 'The GHC (The Golden Honeycomb)',
    subtitle: 'The Master Map',
    shortOverview: 'Our big picture. Think of this as our master map. It connects our big dreams to our daily tasks so that everyone moves in the same direction. It holds everything together.',
    highlights: [
      'Everything Connects: See how culture, strategy, and tasks link together.',
      'Built to Grow: A system that works whether we are small or big.',
      'One Language: The terms and ideas we all use to understand each other.'
    ],
    storybookIntro: 'Explore the Framework: This guide illustrates the \'DNA\' of our company. Download this to see how our 7 key parts fit together to build a strong, successful organization.',
    whatYouWillLearn: [
      'The 7 Parts: Learn the seven pieces that make up our ecosystem.',
      'Your Place: See exactly where you fit into the bigger picture.',
      'How We Win: Understand the logic behind our success.'
    ]
  },
  'dq-vision': {
    title: 'The Vision (Purpose)',
    subtitle: 'Why We Are Here',
    shortOverview: 'Our North Star. We exist to make life easier. Our goal is to use technology to make every transaction faster, smarter, and friendlier for everyone.',
    highlights: [
      'Solving Chaos: Using digital blueprints to fix messy problems.',
      'Being Proactive: Fixing things before they even break.',
      'Global Impact: Improving lives in every sector of the economy.'
    ],
    storybookIntro: 'Explore Our Mission: This storybook explains \'Accelerating Life\'s Transactions.\' Read this to understand the big, audacious goal we are all aiming for.',
    whatYouWillLearn: [
      'The Mission: Deeply understand what drives us every day.',
      'The Strategy: How we plan to reach this big goal.',
      'The Story: How to explain our purpose to others.'
    ]
  },
  'dq-hov': {
    title: 'The HoV (Culture)',
    subtitle: 'How We Behave',
    shortOverview: 'Our House of Values. This is our code of conduct. It isn\'t just about what we do, but how we treat each other. It defines how we behave when no one is watching.',
    highlights: [
      'Building Trust: How we create a safe place to work.',
      'Acting Right: The specific behaviors that define a true Qatalyst.',
      'Staying Honest: Making ethical choices in every situation.'
    ],
    storybookIntro: 'Explore Our Culture: Dive into the \'House of Values.\' This guide illustrates the specific behaviors that build trust, safety, and respect in our team.',
    whatYouWillLearn: [
      'Team Rules: How to work well with your colleagues.',
      'Culture Code: Practical examples of our values in action.',
      'Decision Making: How to use our values to make tough choices.'
    ]
  },
  'dq-persona': {
    title: 'The Personas (Identity)',
    subtitle: 'Who We Are',
    shortOverview: 'Finding Your Role. We are more than just job titles. We have unique roles—or \'Personas\'—that help us collaborate. This defines who plays what part in our team.',
    highlights: [
      'Role Clarity: Knowing exactly what is expected of you.',
      'Team Harmony: Understanding how different roles work together.',
      'Growth: Seeing how your role can evolve over time.'
    ],
    storybookIntro: 'Explore Your Identity: Meet the characters of our ecosystem. This storybook explains the different roles we play and the superpowers each one brings to the table.',
    whatYouWillLearn: [
      'Your Superpower: Discover the core strengths of your persona.',
      'Respecting Others: Learn how to work with people who think differently than you.',
      'Career Path: See the journey of growth for your specific role.'
    ]
  },
  'dq-agile-tms': {
    title: 'Agile TMS (Tasks)',
    subtitle: 'How We Work',
    shortOverview: 'Getting Things Done. Big dreams need action. The Task Management System (TMS) is how we break huge projects into small, doable steps so we never get overwhelmed.',
    highlights: [
      'Radical Focus: Focusing on one thing at a time to do it well.',
      'Staying Fast: Measuring our speed to keep improving.',
      'Breaking it Down: Turning big problems into small tasks.'
    ],
    storybookIntro: 'Explore Execution: This guide explains our \'Engine of Execution.\' Download it to learn how we organize our to-do lists to keep moving fast without burnout.',
    whatYouWillLearn: [
      'Manage Your Day: How to organize your backlog efficiently.',
      'Use the Tools: Best practices for our task apps.',
      'Deliver Value: How to finish tasks consistently.'
    ]
  },
  'dq-agile-sos': {
    title: 'Agile SOS (Governance)',
    subtitle: 'How We Stay in Sync',
    shortOverview: 'Working Together. As we grow, we need to stay connected. These are the meetings and checks we use to make sure all teams are moving in harmony without chaos.',
    highlights: [
      'No Bureaucracy: staying organized without slowing down.',
      'Fixing Problems: How to raise a hand when you are stuck.',
      'Team Sync: Ensuring one team helps the other succeed.'
    ],
    storybookIntro: 'Explore Our Rituals: This document explains the \'Scrum of Scrums.\' Read this to understand how we fix blockers and keep multiple teams aligned.',
    whatYouWillLearn: [
      'The Meetings: How to run or join our sync-up calls.',
      'Conflict Resolution: How to solve issues between squads.',
      'The Rhythm: Understanding our weekly and monthly cycles.'
    ]
  },
  'dq-agile-flows': {
    title: 'Agile Flows (Value Streams)',
    subtitle: 'How Work Travels',
    shortOverview: 'From Idea to Done. This maps the journey of our work. It shows how an idea travels through the company, gets built, and is delivered to the customer.',
    highlights: [
      'The Full Picture: Seeing the whole process, not just your part.',
      'Cutting Waste: Removing steps that don\'t add value.',
      'Smooth Flow: Keeping work moving without stops.'
    ],
    storybookIntro: 'Explore the Journey: Follow the flow of value. This storybook illustrates how to spot bottlenecks and ensure our work reaches the finish line smoothly.',
    whatYouWillLearn: [
      'Map Your Work: How to visualize what you do every day.',
      'Spot Delays: How to find where things are getting stuck.',
      'Speed It Up: Simple ways to deliver value faster.'
    ]
  },
  'dq-agile-6xd': {
    title: 'Agile 6xD (Products)',
    subtitle: 'What We Build',
    shortOverview: 'Our Solutions. This is what we offer to the world. It covers the different types of digital products and services we build to solve real problems for our clients.',
    highlights: [
      'Product Thinking: Building things that last, not just quick fixes.',
      'The Lifecycle: From the first idea to the final launch.',
      'Solving Problems: Matching our skills to client needs.'
    ],
    storybookIntro: 'Explore Our Products: Discover our product universe. This guide breaks down the six ways we package our skills to create solutions that matter.',
    whatYouWillLearn: [
      'Our Portfolio: A simple look at the 6 things we sell.',
      'Building Solutions: How to help create great products.',
      'Market Fit: Ensuring we build what people actually want.'
    ]
  }
}
