/**
 * Company types for Strapi integration
 */
import { StrapiID, StrapiMediaData, StrapiRelation, StrapiRelationArray } from './strapi.types';

// Company status enum values from Strapi
export type CompanyStatus = 'Active' | 'Pending' | 'Rejected';

// Business type enum values from Strapi
export type BusinessType = 'SMALL_BUSINESS' | 'STARTUP' | 'ENTERPRISE';

// Category enum values from Strapi
export type CategoryType = 'ECOMMERCE' | 'FINTECH' | 'MOBILE' | 'HEALTHCARE' | 'EDUCATION' | 'OTHER';

// Represents the attributes of a Company in Strapi
export interface CompanyAttributes {
  name: string;
  logo?: StrapiMediaData;
  industry?: string;
  location?: string;
  whatsup?: string;
  revenue?: string;
  companyStatus?: CompanyStatus;
  website?: string;
  established?: string;
  employees?: string;
  annualRevenue?: string;
  equityOffered?: string;
  revenueGrowth?: string;
  ebitda?: string;
  ebitdaGrowth?: string;
  profitMargin?: string;
  profitMarginGrowth?: string;
  businessType?: BusinessType;
  category?: CategoryType;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  description?: string;
  users_permissions_user?: StrapiRelation<any>;
  user_documents?: StrapiRelationArray<any>;
  listings?: StrapiRelationArray<any>;
}

// Full Company response from Strapi API
export interface Company {
  id: StrapiID;
  attributes: CompanyAttributes;
}

// For creation/update operations (request payload)
export interface CompanyCreateInput {
  name: string;
  industry?: string;
  location?: string;
  whatsup?: string;
  revenue?: string;
  companyStatus?: CompanyStatus;
  website?: string;
  established?: string;
  employees?: string;
  description?: string;
  businessType?: BusinessType;
  category?: CategoryType;
  users_permissions_user?: StrapiID;
  logo?: StrapiID;
}

// Frontend form data structure
export interface CompanyFormData {
  companyName: string;
  companyStatus: CompanyStatus;
  industrySpecialization: string;
  location: string;
  companySize: string;
  revenue: string;
  description?: string;
  companyDocument?: string | File | { uri: string; name: string; type: string } | null;
  whatsup?: string;
  website?: string;
  established?: string;
  businessType?: BusinessType;
  category?: CategoryType;
}
