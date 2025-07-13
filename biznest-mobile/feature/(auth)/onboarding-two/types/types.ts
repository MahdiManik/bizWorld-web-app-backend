export interface CompanyFormData {
  id?: number;
  name: string;
  industry: string;
  location: string;
  size?: string;
  status?: string;
  revenue?: string;
  description?: string;
  companyDocument?: number | null; // Strapi file ID or null
}

export type OnboardingCompleteModalProps = {
  visible: boolean;
  onClose: () => void;
  onBackToSignIn: () => void;
};
