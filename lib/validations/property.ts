import { z } from "zod";

export const propertyInputSchema = z.object({
  location: z.string().min(1, "Location is required"),
  propertyType: z.string().min(1, "Property type is required"),
  size: z.number().positive().optional(),
  rooms: z.number().positive().optional(),
  price: z.string().optional(),
  features: z.string().optional(),
  notes: z.string().optional(),
});

export const generatedContentSchema = z.object({
  professional: z.string(),
  short: z.string(),
  titles: z.array(z.string()),
  english: z.string(),
});

export const savedListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  property_data: propertyInputSchema,
  generated_content: generatedContentSchema,
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;
export type GeneratedContent = z.infer<typeof generatedContentSchema>;
export type SavedListingInput = z.infer<typeof savedListingSchema>;
