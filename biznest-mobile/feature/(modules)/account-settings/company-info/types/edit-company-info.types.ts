import { z } from 'zod';

export const editCompanyInfoSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  companyStatus: z.any().optional(),
  location: z.string().min(1, 'Location is required'),
  document: z.any().optional(),
  description: z.string().optional(),
});

export type EditCompanyInfoFormData = z.infer<typeof editCompanyInfoSchema>;

export interface CompanyInfoData extends EditCompanyInfoFormData {
  companyLogo?: string;
}
