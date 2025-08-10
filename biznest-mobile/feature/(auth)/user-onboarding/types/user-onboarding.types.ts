import { z } from 'zod';

export const userOnboardingSchema = z.object({
  // Step 1 fields
  professionalHeadline: z.string().min(1, 'Professional headline is required'),
  industrySpecialization: z
    .string()
    .min(1, 'Industry specialization is required'),
  areasOfExpertise: z
    .array(z.string())
    .min(1, 'At least one area of expertise is required'),
  portfolioLink: z
    .string()
    .min(1, 'Portfolio link is required')
    .refine((val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, 'Please enter a valid URL'),
  phonePrefix: z.string().min(1, 'Country code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  document: z.any().optional(),
  introduction: z.string().optional(),
  image: z.any().optional(),
  user: z.string().optional(),

  // Step 2 fields
  name: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  location: z.string().min(1, 'Location is required'),
  companyStatus: z.boolean(),
  revenue: z.string().min(1, 'Revenue is required'),
  description: z.string().optional(),
  companyDocument: z.any().optional(),
  companyUser: z.string().optional(),
  companySize: z.string().optional(),
});

export type UserOnboardingFormData = z.infer<typeof userOnboardingSchema>;

export const step1Schema = userOnboardingSchema.pick({
  professionalHeadline: true,
  industrySpecialization: true,
  areasOfExpertise: true,
  portfolioLink: true,
  phonePrefix: true,
  phone: true,
  document: true,
  introduction: true,
  image: true,
  user: true,
});

export const step2Schema = userOnboardingSchema.pick({
  name: true,
  industry: true,
  location: true,
  companyStatus: true,
  revenue: true,
  description: true,
  document: true,
  companyUser: true,
  companySize: true,
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;

export interface DropdownOption {
  label: string;
  value: string;
}