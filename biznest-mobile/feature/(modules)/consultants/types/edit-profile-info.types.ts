import { z } from 'zod';
export const EditProfileInfoSchema = z.object({
  project_scope: z.string().min(1, { message: 'Project Scope is required' }),
  budget: z.string().min(1, { message: 'Budget is required' }),
  timeline: z.string().min(1, { message: 'Timeline is required' }),
});

export type EditProfileFormData = z.infer<typeof EditProfileInfoSchema>;
