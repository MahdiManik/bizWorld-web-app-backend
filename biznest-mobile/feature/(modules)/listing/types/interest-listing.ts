export interface InterestListingResponse {
  data: InterestListing[];
  meta: Meta;
}

export interface InterestListing {
  id: number;
  documentId: string;
  investStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  listing: Listing;
  interestedUsers: InterestedUsers;
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
  publishedAt: string;
  listingStatus: string;
  investmentAmount: number;
  equityPercentage: number;
  minimumInvestment: number;
  expectedROI: number;
  projectedGrowth: number;
  category: string;
  image: Image;
  document: any;
  businessOwner: BusinessOwner;
  revenueBreakDown: RevenueBreakDown;
  likedUser: any[];
  interest_listings: InterestListing[];
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

import { BusinessOwner, InterestedUsers, Role } from '@/types/user';

export { BusinessOwner, InterestedUsers };

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

export interface InterestListing {
  id: number;
  documentId: string;
  investStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
  investmentAmount?: number;
  equityPercentage?: number;
  minimumInvestment?: number;
  expectedROI?: number;
  projectedGrowth?: number;
  category: string;
}

export interface InterestListing2 {
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

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
