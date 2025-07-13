// Mock data for profile settings

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  whatsappNumber: string
  profileImage: string
  userType: 'consultant' | 'investor' | 'businessOwner'
  subscriptionType: 'free' | 'premium' | 'standard'
  status?: 'all' | 'pending' | 'accepted' | 'rejected'
  rating?: number
  hourlyRate: number
  professionalHeadline: string
  industrySpecialization: string
  introduction: string
  areasOfExpertise: string[]
  portfolioLink: string
  documents: {
    name: string
    size: string
    url: string
  }[]
  companyInfo: {
    name: string
    logo: string
    status: 'active' | 'closing'
    industry: string
    location: string
    size: string
    revenue: string
    website: string
    description: string
    documents: {
      name: string
      size: string
      url: string
    }[]
  }
  favorites: {
    id: string
    name: string
    type: 'listing' | 'investor'
    date: string
  }[]
  notificationSettings: {
    newMessages: boolean
    newListings: boolean
    investorInterest: boolean
    appUpdates: boolean
    marketingEmails: boolean
  }
}

export const mockUserProfile: UserProfile[] = [
  {
    id: 'user001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'johnsmith@gmail.com',
    phoneNumber: '+65 1234 5678',
    whatsappNumber: '+65 9876 5432',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    userType: 'businessOwner',
    subscriptionType: 'free',
    status: 'pending',
    rating: 4.8,
    hourlyRate: 175,
    professionalHeadline: 'User Experience Expert',
    industrySpecialization: 'UI UX Design',
    introduction:
      "Hello! I'm John, a UX Consultant with 5 years of experience crafting intuitive digital experiences.",
    areasOfExpertise: ['User Research', 'Wireframing & Prototyping'],
    portfolioLink: 'https://johnsmithportfolio.com',
    documents: [
      {
        name: 'resume.pdf',
        size: '50 mb',
        url: 'https://example.com/resume.pdf',
      },
    ],
    companyInfo: {
      name: 'UX Lab',
      logo: 'https://ui-avatars.com/api/?name=UX+Lab&background=000000&color=ffffff',
      status: 'active',
      industry: 'Design',
      location: 'London, UK',
      size: '50',
      revenue: '1000000',
      website: 'https://uxlab.com',
      description: 'Design agency focused on user-centered experiences.',
      documents: [
        {
          name: 'company-overview.pdf',
          size: '40 mb',
          url: 'https://example.com/company-overview.pdf',
        },
      ],
    },
    favorites: [],
    notificationSettings: {
      newMessages: true,
      newListings: true,
      investorInterest: true,
      appUpdates: false,
      marketingEmails: false,
    },
  },
  {
    id: 'user002',
    firstName: 'Aisha',
    lastName: 'Rahman',
    email: 'aisha.rahman@outlook.com',
    phoneNumber: '+44 7890 112233',
    whatsappNumber: '+44 7890 998877',
    profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    userType: 'investor',
    subscriptionType: 'premium',
    status: 'accepted',
    rating: 4.5,
    hourlyRate: 190,
    professionalHeadline: 'Venture Capitalist',
    industrySpecialization: 'Fintech',
    introduction:
      "Aisha here. I'm passionate about empowering startups in financial technologies and emerging markets.",
    areasOfExpertise: ['Startup Funding', 'Pitch Evaluation'],
    portfolioLink: 'https://aisharahmanvc.com',
    documents: [
      {
        name: 'investor_profile.pdf',
        size: '10 mb',
        url: 'https://example.com/investor_profile.pdf',
      },
    ],
    companyInfo: {
      name: 'Global Capital Ventures',
      logo: 'https://ui-avatars.com/api/?name=Global+Capital&background=000044&color=gold',
      status: 'active',
      industry: 'Investment',
      location: 'New York, USA',
      size: '200',
      revenue: '50000000',
      website: 'https://globalcapitalvc.com',
      description: 'A global VC firm backing world-changing ideas.',
      documents: [],
    },
    favorites: [],
    notificationSettings: {
      newMessages: true,
      newListings: false,
      investorInterest: true,
      appUpdates: true,
      marketingEmails: true,
    },
  },
  {
    id: 'user003',
    firstName: 'Carlos',
    lastName: 'Ramirez',
    email: 'carlos.ramirez@gmail.com',
    phoneNumber: '+34 655 112 223',
    whatsappNumber: '+34 622 998 877',
    profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
    userType: 'consultant',
    subscriptionType: 'standard',
    status: 'pending',
    rating: 4.7,
    hourlyRate: 165,
    professionalHeadline: 'Business Transformation Consultant',
    industrySpecialization: 'Retail & E-Commerce',
    introduction:
      'Helping retail businesses embrace digital change and boost operational efficiency.',
    areasOfExpertise: ['E-Commerce Strategy', 'Operations Optimization'],
    portfolioLink: 'https://carlosconsulting.com',
    documents: [],
    companyInfo: {
      name: 'Digital Biz Advisors',
      logo: 'https://ui-avatars.com/api/?name=Digital+Biz&background=007acc&color=ffffff',
      status: 'active',
      industry: 'Consulting',
      location: 'Madrid, Spain',
      size: '30',
      revenue: '300000',
      website: 'https://dbizadvisors.com',
      description: 'We help businesses transform and grow digitally.',
      documents: [],
    },
    favorites: [],
    notificationSettings: {
      newMessages: true,
      newListings: false,
      investorInterest: false,
      appUpdates: false,
      marketingEmails: false,
    },
  },
  {
    id: 'user004',
    firstName: 'Mei',
    lastName: 'Tan',
    email: 'mei.tan@techflow.sg',
    phoneNumber: '+65 8123 4567',
    whatsappNumber: '+65 8123 9876',
    profileImage: 'https://randomuser.me/api/portraits/women/65.jpg',
    userType: 'businessOwner',
    subscriptionType: 'premium',
    status: 'rejected',
    rating: 4.2,
    hourlyRate: 155,
    professionalHeadline: 'Tech Startup Founder',
    industrySpecialization: 'AI & SaaS',
    introduction:
      'Founder of TechFlow, building AI-driven automation tools for SMEs.',
    areasOfExpertise: ['Startup Growth', 'Product Management'],
    portfolioLink: 'https://techflow.ai',
    documents: [],
    companyInfo: {
      name: 'TechFlow Pte Ltd',
      logo: 'https://ui-avatars.com/api/?name=TechFlow&background=111111&color=0ff0ff',
      status: 'active',
      industry: 'SaaS',
      location: 'Singapore',
      size: '40',
      revenue: '1200000',
      website: 'https://techflow.ai',
      description:
        'Building smart automation tools with AI for productivity and scale.',
      documents: [],
    },
    favorites: [],
    notificationSettings: {
      newMessages: true,
      newListings: true,
      investorInterest: true,
      appUpdates: true,
      marketingEmails: true,
    },
  },
  {
    id: 'user005',
    firstName: 'David',
    lastName: 'Nguyen',
    email: 'david.nguyen@educonsults.vn',
    phoneNumber: '+84 987 123 456',
    whatsappNumber: '+84 987 654 321',
    profileImage: 'https://randomuser.me/api/portraits/men/19.jpg',
    userType: 'consultant',
    subscriptionType: 'free',
    status: 'accepted',
    rating: 4.9,
    hourlyRate: 185,
    professionalHeadline: 'Education Strategy Consultant',
    industrySpecialization: 'EdTech',
    introduction:
      'Supporting education institutions with digital transformation and learner engagement.',
    areasOfExpertise: ['Curriculum Design', 'Learning Technologies'],
    portfolioLink: 'https://educonsults.vn/david',
    documents: [],
    companyInfo: {
      name: 'EduConsults VN',
      logo: 'https://ui-avatars.com/api/?name=Edu+Consults&background=006600&color=ffffff',
      status: 'active',
      industry: 'Education',
      location: 'Ho Chi Minh City, Vietnam',
      size: '20',
      revenue: '200000',
      website: 'https://educonsults.vn',
      description:
        'We help schools and universities innovate with tech-driven education models.',
      documents: [],
    },
    favorites: [],
    notificationSettings: {
      newMessages: false,
      newListings: true,
      investorInterest: false,
      appUpdates: false,
      marketingEmails: false,
    },
  },
]

export const industryOptions: { value: string; label: string }[] = [
  { value: 'it-technology', label: 'IT Technology' },
  { value: 'software-dev', label: 'Software Development' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'energy', label: 'Energy' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'construction', label: 'Construction' },
]

export const expertiseOptions: { value: string; label: string }[] = [
  { value: 'user-research', label: 'User Research' },
  { value: 'information-architecture', label: 'Information Architecture' },
  { value: 'wireframing-prototyping', label: 'Wireframing & Prototyping' },
  { value: 'usability-testing', label: 'Usability Testing' },
  { value: 'interaction-visual-design', label: 'Interaction & Visual Design' },
  {
    value: 'accessibility-responsive-design',
    label: 'Accessibility & Responsive Design',
  },
  {
    value: 'cross-functional-collaboration',
    label: 'Cross-Functional Collaboration',
  },
  {
    value: 'user-testing-feedback-analysis',
    label: 'User Testing & Feedback Analysis',
  },
  { value: 'user-journey-mapping', label: 'User Journey Mapping' },
  { value: 'a-b-testing', label: 'A/B Testing' },
  { value: 'user-training-support', label: 'User Training & Support' },
  {
    value: 'staying-current-with-trends',
    label: 'Staying Current with Trends',
  },
  { value: 'mobile-app-design', label: 'Mobile App Design' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'brand-identity', label: 'Brand Identity' },
  { value: 'content-strategy', label: 'Content Strategy' },
  { value: 'seo-optimization', label: 'SEO Optimization' },
  { value: 'social-media-marketing', label: 'Social Media Marketing' },
  { value: 'email-marketing', label: 'Email Marketing' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'project-management', label: 'Project Management' },
  { value: 'team-leadership', label: 'Team Leadership' },
  { value: 'client-relations', label: 'Client Relations' },
]

// Company status options
export const companyStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'closing', label: 'Closing' },
]
