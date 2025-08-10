import { z } from 'zod';

export type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  passwordConfirmation: string;
};

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, 'Current password must be at least 8 characters long'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long'),
    passwordConfirmation: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters long'),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });
