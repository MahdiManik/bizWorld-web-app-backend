export interface ConsultantsListResponse {
  data: ConsultantLink[];
  meta: Meta;
}

export interface ConsultantLink {
  id: number;
  documentId: string;
  consultantStatus: string;
  projectScope: string;
  budget: string;
  timeline: string;
  actionDate: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  request_user: ConsultantUser;
  consultant: ConsultantUser;
}
export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: any;
  caption: any;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
export interface Formats {
  thumbnail: Thumbnail;
}
export interface Thumbnail {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: any;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone: string | null;
  fullName: string | null;
  investerStatus: string;
  consultantStatus: string;
  consultantData: any;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate: string | null;
  requestDate: string | null;
  autoReply: any;
  autoReplyMessage: any;
}

export interface ConsultantUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone: string | null;
  fullName: string | null;
  investerStatus: string;
  consultantStatus: string;
  consultantData: any;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate: string | null;
  requestDate: string | null;
  autoReply: any;
  autoReplyMessage: any;
  user_profile?: UserProfile | null;
}

export interface UserProfile {
  id: number;
  documentId: string;
  professionalHeadline: string;
  industrySpecialization: string;
  portfolioLink: string;
  introduction: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  phone: string;
  areasOfExpertise: string;
  phonePrefix: string | null;
  yearsOfExperience: string | null;
  location: string | null;
  document: any;
  image: Image;
  user: User;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export type SuggestConsultantsResponse = SuggestConsultant[];

export interface SuggestConsultant {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone: string | null;
  fullName: string | null;
  investerStatus: string;
  consultantStatus: string;
  consultantData: any;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate: string | null;
  requestDate: string | null;
  autoReply: any;
  autoReplyMessage: any;
  role: Role;
  company: Company | null;
  documentCv: any;
  listings: Listing[];
  user_profile: UserProfile | null;
  favouriteListings: any[];
  interest_listings: any[];
  requestConsultants: ConsultantRequest[];
  requestedUsers: ConsultantRequest[];
  conversations: Conversation[];
  messages: Message[];
  engagement_listings: EngagementListing[];
}

export interface Role {
  id: number;
  documentId: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Company {
  id: number;
  documentId: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  revenue: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  companyStatus: boolean;
  companySize: string;
}

export interface Listing {
  id: number;
  documentId: string;
  title: string;
  askingPrice: string;
  country: string;
  description: string;
  equityOffered: string;
  employees: string;
  established: string;
  marginYoY: string;
  ebitdaYoY: string;
  revenueYoY: string;
  ebitda: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  listingStatus: string;
  investmentAmount: number;
  equityPercentage: number;
  minimumInvestment: number;
  expectedROI: number;
  projectedGrowth: number;
  category: string;
  profiltMargin: any;
  annualRevenue: any;
}

export interface ConsultantRequest {
  id: number;
  documentId: string;
  consultantStatus: string;
  projectScope: string;
  budget: string;
  timeline: string;
  actionDate: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Conversation {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Message {
  id: number;
  documentId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface EngagementListing {
  id: number;
  documentId: string;
  investStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  remark: any;
}

export interface CreateConsultantData {
  consultantStatus: string;
  projectScope: string;
  budget: string;
  timeline: string;
  request_user: string;
  consultant: string;
}

export interface UpdateConsultantData {
  consultantStatus: string;
  actionDate: string;
}
