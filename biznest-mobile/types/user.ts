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

export interface BaseUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone?: any;
  fullName?: string;
  investerStatus: string;
  consultantStatus: string;
  consultantData?: any;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate?: any;
  requestDate?: any;
  autoReply?: any;
  autoReplyMessage?: any;
  role?: Role;
}

export interface User extends BaseUser {
  company?: any;
  documentCv?: any;
  listings?: any[];
  user_profile?: any;
  favouriteListings?: any[];
  interest_listings?: any[];
  requestConsultants?: any[];
  requestedUsers?: any[];
  conversations?: any[];
  messages?: any[];
  engagement_listings?: any[];
}

export interface BusinessOwner extends BaseUser {}

export interface InterestedUsers extends User {}

export interface AuthUser {
  id: number | string;
  documentId?: string;
  fullName?: string;
  email: string;
  userStatus?: string;
  role?: { id: number; name: string; type: string } | number | null;
}

export interface Me {
  actionDate: any;
  autoReply: any;
  autoReplyMessage: any;
  blocked: boolean;
  company: Company;
  confirmed: boolean;
  consultantData: any;
  consultantStatus: string;
  createdAt: string;
  documentId: string;
  email: string;
  fullName: string;
  id: number;
  investerStatus: string;
  phone: any;
  provider: string;
  publishedAt: string;
  requestDate: any;
  updatedAt: string;
  userStatus: string;
  user_profile: UserProfile;
  username: string;
  consultAvailablity: boolean;
}

export interface Company {
  companySize: any;
  companyStatus: boolean;
  createdAt: string;
  description: string;
  document: any;
  documentId: string;
  id: number;
  industry: string;
  location: string;
  name: string;
  publishedAt: any;
  revenue: string;
  updatedAt: string;
}

export interface UserProfile {
  areasOfExpertise: string[];
  createdAt: string;
  document: Document;
  documentId: string;
  id: number;
  image: Image;
  industrySpecialization: string;
  introduction: string;
  location: any;
  phone: string;
  phonePrefix: any;
  portfolioLink: string;
  professionalHeadline: string;
  publishedAt: string;
  updatedAt: string;
  yearsOfExperience: any;
}

export interface Document {
  alternativeText: any;
  caption: any;
  createdAt: string;
  documentId: string;
  ext: string;
  formats: any;
  hash: string;
  height: any;
  id: number;
  mime: string;
  name: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  publishedAt: string;
  size: number;
  updatedAt: string;
  url: string;
  width: any;
}

export interface Image {
  alternativeText: any;
  caption: any;
  createdAt: string;
  documentId: string;
  ext: string;
  formats: Formats;
  hash: string;
  height: number;
  id: number;
  mime: string;
  name: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  publishedAt: string;
  size: number;
  updatedAt: string;
  url: string;
  width: number;
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
