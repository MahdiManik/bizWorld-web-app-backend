export interface ListingResponse {
  data: Listing[];
  meta: Meta;
}

export interface Listing {
  id: number;
  documentId: string;
  title: string;
  askingPrice: string;
  category: string;
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
  image: Image;
  document?: Document[];
  businessOwner: BusinessOwner;
  revenueBreakDown: RevenueBreakDown;
  likedUser: BusinessOwner[];
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

export interface InterestListing {
  id: number;
  documentId: string;
  investStatus: string;
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
