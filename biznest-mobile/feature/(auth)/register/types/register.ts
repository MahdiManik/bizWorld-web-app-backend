import { z } from 'zod';
import { nameSchema, emailSchema, passwordSchema } from '@/lib/validation/common-schemas';

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;
