import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Invalid email address' });

export const passwordSchema = z
  .string()
  .min(1, { message: 'Password is required' })
  .min(6, { message: 'Password must be at least 6 characters' });

export const nameSchema = z
  .string()
  .min(1, { message: 'Name is required' })
  .min(2, { message: 'Name must be at least 2 characters' });

export const phoneSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
    message: 'Invalid phone number format',
  });

export const otpSchema = z
  .string()
  .min(4, { message: 'OTP must be at least 4 digits' })
  .max(6, { message: 'OTP must be at most 6 digits' })
  .regex(/^\d+$/, { message: 'OTP must contain only numbers' });

export const passwordConfirmSchema = z
  .string()
  .min(1, { message: 'Password confirmation is required' });

export const createPasswordConfirmationSchema = <T extends Record<string, any>>(
  baseSchema: z.ZodType<T>,
  passwordField: keyof T = 'password',
  confirmField: keyof T = 'confirmPassword'
) =>
  baseSchema.refine(
    (data) => data[passwordField] === data[confirmField],
    {
      message: 'Passwords do not match',
      path: [confirmField as string],
    }
  );