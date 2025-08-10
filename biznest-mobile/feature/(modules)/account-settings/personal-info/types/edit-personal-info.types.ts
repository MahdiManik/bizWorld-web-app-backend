import { z } from 'zod';

export const editPersonalInfoSchema = z.object({
  documentId: z.string().or(z.number()),
  username: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  image: z.any().optional(),
  phonePrefix: z.string().optional(),
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
  phone: z.string().min(1, 'Phone number is required'),
  document: z.any().nullable(),
  introduction: z.string().optional(),
});

export const partialEditPersonalInfoSchema = editPersonalInfoSchema.partial();

export type EditPersonalInfoFormData = z.infer<typeof editPersonalInfoSchema>;
export type PartialEditPersonalInfoFormData = z.infer<typeof partialEditPersonalInfoSchema>;

export interface PersonalInfoData extends EditPersonalInfoFormData {
  profileImage?: string;
}
