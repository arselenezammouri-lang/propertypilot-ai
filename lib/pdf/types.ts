import { z } from 'zod';

export const PdfTemplateEnum = z.enum(['modern', 'luxury']);
export type PdfTemplate = z.infer<typeof PdfTemplateEnum>;

export const PropertyFeaturesSchema = z.object({
  surface: z.string().optional(),
  rooms: z.string().optional(),
  bathrooms: z.string().optional(),
  price: z.string().optional(),
  address: z.string().optional(),
  status: z.string().optional(),
  propertyType: z.string().optional(),
  floor: z.string().optional(),
  energyClass: z.string().optional(),
  yearBuilt: z.string().optional(),
  parking: z.string().optional(),
  heating: z.string().optional(),
});

export type PropertyFeatures = z.infer<typeof PropertyFeaturesSchema>;

export const BrandingModeEnum = z.enum(['default', 'agency']);
export type BrandingMode = z.infer<typeof BrandingModeEnum>;

export const AgencyBrandingSchema = z.object({
  agency_name: z.string(),
  logo_url: z.string().nullable().optional(),
  primary_color: z.string().default('#1E3A5F'),
  secondary_color: z.string().default('#60A5FA'),
  accent_color: z.string().default('#F59E0B'),
  contact_name: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
  website_url: z.string().nullable().optional(),
});

export type AgencyBrandingData = z.infer<typeof AgencyBrandingSchema>;

export const GeneratePdfRequestSchema = z.object({
  title: z.string().min(1, 'Il titolo è obbligatorio'),
  description: z.string().min(1, 'La descrizione è obbligatoria'),
  features: PropertyFeaturesSchema,
  images: z.array(z.string().url()).max(6, 'Massimo 6 immagini'),
  aiRewrite: z.string().optional(),
  template: PdfTemplateEnum.default('modern'),
  agentName: z.string().optional(),
  agentPhone: z.string().optional(),
  agentEmail: z.string().optional(),
  agencyLogo: z.string().url().optional(),
  brandingMode: BrandingModeEnum.default('default'),
});

export type GeneratePdfRequest = z.infer<typeof GeneratePdfRequestSchema>;

export interface PdfGenerationResult {
  success: boolean;
  pdfBase64?: string;
  fileName?: string;
  error?: string;
}
