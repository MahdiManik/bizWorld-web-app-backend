/**
 * Strapi base types for API responses and common patterns
 */

export type StrapiID = number;

export type StrapiMedia = {
  id: StrapiID;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: any | null;
  createdAt: string;
  updatedAt: string;
};

export type StrapiMediaData = {
  data: {
    id: StrapiID;
    attributes: StrapiMedia;
  } | null;
};

export type StrapiRelation<T> = {
  data: {
    id: StrapiID;
    attributes: T;
  } | null;
};

export type StrapiRelationArray<T> = {
  data: Array<{
    id: StrapiID;
    attributes: T;
  }>;
};

export type StrapiResponse<T> = {
  data: {
    id: StrapiID;
    attributes: T;
  };
  meta: Record<string, any>;
};

export type StrapiArrayResponse<T> = {
  data: Array<{
    id: StrapiID;
    attributes: T;
  }>;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiError = {
  status: number;
  name: string;
  message: string;
  details?: Record<string, any>;
};

export type StrapiUploadFile = File | Blob | { uri: string; name: string; type: string };
