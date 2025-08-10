export interface ListingDetailResponse {
  data: ListingDetail;
  meta: Meta;
}

export interface ListingDetail {
  id: number;
  documentId: string;
  title: string;
  askingPrice: string;
  country: string;
  description: string;
  equityOffered: string;
  employees: string;
  established: string;
  marginYoY: any;
  ebitdaYoY: any;
  revenueYoY: any;
  ebitda: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  listingStatus: string;
  investmentAmount: number;
  equityPercentage: number;
  minimumInvestment: number;
  expectedROI: number;
  projectedGrowth: number;
  category: string;
  image: Image;
  document: Document[];
  businessOwner: BusinessOwner;
  revenueBreakDown: RevenueBreakDown;
  likedUser: BusinessOwner[];
  interest_listings: InterestListing2[];
  profitMargin: string;
  annualRevenue: string;
  growthRate: string;
}

export interface Document {
  id: number;
  documentId: string;
  name: string;
  alternativeText: any;
  caption: any;
  width: any;
  height: any;
  formats: any;
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
  related: Related[];
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

export interface Related {
  __type: string;
  id: number;
  documentId: string;
  title: string;
  askingPrice: string;
  country: string;
  description: string;
  equityOffered: string;
  employees: string;
  established: string;
  marginYoY?: string;
  ebitdaYoY?: string;
  revenueYoY?: string;
  ebitda?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  listingStatus: string;
  investmentAmount?: number;
  equityPercentage?: number;
  minimumInvestment?: number;
  expectedROI?: number;
  projectedGrowth?: number;
  category: string;
}

export interface BusinessOwner {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone: any;
  fullName: string;
  investerStatus: string;
  consultantStatus: string;
  consultantData: any;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate: any;
  requestDate: any;
  autoReply: any;
  autoReplyMessage: any;
  role: Role;
  company: Company;
  documentCv: any;
  listings: Listing[];
  user_profile: any;
  favouriteListings: any[];
  interest_listings: InterestListing[];
  requestConsultants: RequestConsultant[];
  requestedUsers: RequestedUser[];
  conversations: Conversation[];
  messages: Message[];
  engagement_listings: any[];
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
  publishedAt: string;
  companyStatus: boolean;
  companySize: any;
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
  marginYoY: any;
  ebitdaYoY: any;
  revenueYoY: any;
  ebitda: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  listingStatus: string;
  investmentAmount?: number;
  equityPercentage?: number;
  minimumInvestment?: number;
  expectedROI?: number;
  projectedGrowth?: number;
  category: string;
}

export interface InterestListing {
  id: number;
  documentId: string;
  investStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface RequestConsultant {
  id: number;
  documentId: string;
  consultantStatus: string;
  projectScope: string;
  budget: string;
  timeline: string;
  actionDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface RequestedUser {
  id: number;
  documentId: string;
  consultantStatus: string;
  projectScope: string;
  budget: string;
  timeline: string;
  actionDate: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Conversation {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Message {
  id: number;
  documentId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface RevenueBreakDown {
  id: number;
  Jan: string;
  Feb: string;
  Mar: string;
  Apr: string;
  May: string;
  Jun: string;
  Jul: string;
  Aug: string;
  Sep: string;
  Oct: string;
  Nov: string;
  Dec: string;
  EBITDA: string;
}

export interface InterestListing2 {
  id: number;
  documentId: string;
  investStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  listing: Listing2;
  interestedUsers: InterestedUsers;
  businessOwner: BusinessOwner2;
}

export interface Listing2 {
  id: number;
  documentId: string;
  title: string;
  askingPrice: string;
  country: string;
  description: string;
  equityOffered: string;
  employees: string;
  established: string;
  marginYoY: any;
  ebitdaYoY: any;
  revenueYoY: any;
  ebitda: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  listingStatus: string;
  investmentAmount: number;
  equityPercentage: number;
  minimumInvestment: number;
  expectedROI: number;
  projectedGrowth: number;
  category: string;
}

export interface InterestedUsers {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone: any;
  fullName: string;
  investerStatus: string;
  consultantStatus: string;
  consultantData: any;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate: any;
  requestDate: any;
  autoReply: any;
  autoReplyMessage: any;
}

export interface BusinessOwner2 {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone: any;
  fullName: any;
  investerStatus: string;
  consultantStatus: string;
  consultantData: any;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate: any;
  requestDate: any;
  autoReply: any;
  autoReplyMessage: any;
}

export interface Meta {}
