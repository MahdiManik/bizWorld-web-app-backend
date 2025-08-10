// import { z } from 'zod';

// export const otpEnterSchema = z.object({
//   otp: z
//     .string()
//     .min(4, 'OTP must be 4 digits')
//     .max(4, 'OTP must be 4 digits')
//     .regex(/^\d+$/, 'OTP must contain only digits')
//     .refine((val) => val.length === 4, {
//       message: 'OTP must be exactly 4 digits',
//     }),
// });

// export type OtpEnterFormData = z.infer<typeof otpEnterSchema>;
