export interface ServiceConsultant {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  phone: string | null;
  fullName: string;
  investerStatus: string;
  consultantStatus: string;
  consultantData: any | null;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  actionDate: string;
  requestDate: string | null;
  autoReply: any | null;
  autoReplyMessage: any | null;
}

export interface ServiceCoverImage {
  id: number;
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface Service {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  description: string;
  sessionDuration: string;
  hourlyRate: number;
  tag: string;
  consultant: ServiceConsultant;
  user: any | null;
  coverImage: ServiceCoverImage | null;
}

export interface ServicesPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ServicesMeta {
  pagination: ServicesPagination;
}

export interface ConsultantServicesResponse {
  data: Service[];
  meta: ServicesMeta;
}

export interface CreateServiceData {
  title: string;
  description: string;
  sessionDuration: string;
  hourlyRate: number;
  tag: string;
  consultant: string;
  coverImage?: number;
}

export interface CreateServiceRequest {
  data: CreateServiceData;
}

export type UpdateServiceData = Partial<CreateServiceData>;

export interface UpdateServiceRequest {
  data: UpdateServiceData;
}