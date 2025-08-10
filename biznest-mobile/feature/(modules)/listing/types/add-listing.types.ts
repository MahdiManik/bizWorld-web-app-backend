import { z } from 'zod';

export const addListingStep1Schema = z.object({
  title: z.string().min(1, 'Listing title is required'),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  thumbnail: z
    .union([
      z.string(),
      z.object({
        uri: z.string(),
        name: z.string(),
        size: z.number().optional(),
        mimeType: z.string().optional(),
      }),
    ])
    .optional(),
  isPrivate: z.boolean(),
  askingPrice: z.string().min(1, 'Investment amount is required'),
  equityOffered: z.string().min(1, 'Equity percentage is required'),
  annualRevenue: z.string().min(1, 'Minimum investment is required'),
  profitMargin: z.string().min(1, 'Expected ROI is required'),
  growthRate: z.string().min(1, 'Projected growth is required'),
});

export const addListingStep2Schema = z.object({
  jan: z.string().min(1, 'January revenue is required'),
  feb: z.string().min(1, 'February revenue is required'),
  mar: z.string().min(1, 'March revenue is required'),
  apr: z.string().min(1, 'April revenue is required'),
  may: z.string().min(1, 'May revenue is required'),
  jun: z.string().min(1, 'June revenue is required'),
  jul: z.string().min(1, 'July revenue is required'),
  aug: z.string().min(1, 'August revenue is required'),
  sep: z.string().min(1, 'September revenue is required'),
  oct: z.string().min(1, 'October revenue is required'),
  nov: z.string().min(1, 'November revenue is required'),
  dec: z.string().min(1, 'December revenue is required'),
  ebitda: z.string().min(1, 'EBITDA is required'),
});

export const addListingStep3Schema = z.object({
  documents: z
    .array(
      z.object({
        uri: z.string(),
        name: z.string(),
        size: z.number().optional(),
        mimeType: z.string().optional(),
        id: z.number().optional(),
      })
    )
    .optional(),
});

export const addListingFormSchema = z.object({
  step1: addListingStep1Schema,
  step2: addListingStep2Schema,
  step3: addListingStep3Schema,
});

export type AddListingStep1Data = z.infer<typeof addListingStep1Schema>;
export type AddListingStep2Data = z.infer<typeof addListingStep2Schema>;
export type AddListingStep3Data = z.infer<typeof addListingStep3Schema>;
export type AddListingFormData = z.infer<typeof addListingFormSchema>;
