/**
 * UserProfile types for Strapi integration
 */
import { StrapiID, StrapiMediaData, StrapiRelation, StrapiRelationArray } from './strapi.types';

// Represents the attributes of a UserProfile in Strapi
export interface UserProfileAttributes {
  image?: StrapiMediaData;
  professionalHeadline?: string;
  industrySpecialization?: string;
  areasOfExpertise?: any[]; // JSON type in Strapi
  portfolioLink?: string;
  rating?: number;
  introduction?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  users_permissions_user?: StrapiRelation<any>;
  user_documents?: StrapiRelationArray<any>;
}

// Full UserProfile response from Strapi API
export interface UserProfile {
  id: StrapiID;
  attributes: UserProfileAttributes;
}

// For creation/update operations (request payload)
export interface UserProfileCreateInput {
  professionalHeadline?: string;
  industrySpecialization?: string;
  areasOfExpertise?: any[];
  portfolioLink?: string;
  introduction?: string;
  users_permissions_user?: StrapiID;
  image?: StrapiID;
}

// Frontend form data structure
export interface UserProfileFormData {
  profileImage?: File | { uri: string; name: string; type: string } | null;
  professionalHeadline: string;
  industrySpecialization: string;
  areasOfExpertise: string[] | string;
  portfolioLink: string;
  introduction?: string;
  whatsappNumber?: string; // Not in Strapi schema, kept for UI
  whatsappCountryCode?: string; // Not in Strapi schema, kept for UI
  uploadedDocument?: string | File | { uri: string; name: string; type: string } | null;
}

// Helper type for mapping form data to API input
export interface UserProfileMetadata {
  whatsappNumber?: string;
  whatsappCountryCode?: string;
  // Add other metadata fields here
}
