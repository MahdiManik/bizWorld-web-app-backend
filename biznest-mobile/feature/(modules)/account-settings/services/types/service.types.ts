import { z } from 'zod';
export const addServiceSchema = z.object({
  serviceTitle: z.string().min(1, 'Service title is required'),
  description: z.string().min(1, 'Description is required'),
  hourlyRate: z.string().min(1, 'Hourly rate is required'),
  sessionDuration: z.string().min(1, 'Session duration is required'),
  category: z.string().min(1, 'Category is required'),
  thumbnail: z.object({
    uri: z.string(),
    name: z.string(),
    size: z.number().optional(),
    mimeType: z.string().optional(),
    id: z.number().optional(),
  }),
});

export type AddServiceFormData = z.infer<typeof addServiceSchema>;
