import { z } from "zod";

export const leadPrioritySchema = z.enum(['low', 'medium', 'high']);
export const leadStatusSchema = z.enum(['new', 'contacted', 'followup', 'closed', 'lost']);
export const leadMarketSchema = z.enum(['italy', 'usa']);

export const insertLeadSchema = z.object({
  nome: z.string().min(1, "Nome è obbligatorio"),
  email: z.string().email("Email non valida").optional().nullable(),
  telefono: z.string().optional().nullable(),
  messaggio: z.string().optional().nullable(),
  priorita: leadPrioritySchema.default('medium'),
  status: leadStatusSchema.default('new'),
  lead_score: z.number().int().min(0).max(100).default(0),
  market: leadMarketSchema.default('italy'),
});

export const updateLeadSchema = z.object({
  id: z.string().uuid("ID lead non valido"),
  nome: z.string().min(1, "Nome è obbligatorio").optional(),
  email: z.string().email("Email non valida").optional().nullable(),
  telefono: z.string().optional().nullable(),
  messaggio: z.string().optional().nullable(),
  priorita: leadPrioritySchema.optional(),
  status: leadStatusSchema.optional(),
  lead_score: z.number().int().min(0).max(100).optional(),
  market: leadMarketSchema.optional(),
});

export const insertLeadNoteSchema = z.object({
  lead_id: z.string().uuid("ID lead non valido"),
  nota: z.string().min(1, "La nota non può essere vuota"),
});

export const updateStatusSchema = z.object({
  lead_id: z.string().uuid("ID lead non valido"),
  new_status: leadStatusSchema,
});

export const leadFiltersSchema = z.object({
  status: leadStatusSchema.optional(),
  priorita: leadPrioritySchema.optional(),
  market: leadMarketSchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'nome', 'lead_score']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type UpdateLead = z.infer<typeof updateLeadSchema>;
export type InsertLeadNote = z.infer<typeof insertLeadNoteSchema>;
export type UpdateStatus = z.infer<typeof updateStatusSchema>;
export type LeadFilters = z.infer<typeof leadFiltersSchema>;
