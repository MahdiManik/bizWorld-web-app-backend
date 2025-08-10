import { z } from 'zod';
export const forgetPassSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

export type ForgetPassFormData = z.infer<typeof forgetPassSchema>;
