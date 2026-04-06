import { z } from "zod";

export const incidentTypes = [
  "medical",
  "fire",
  "traffic",
  "violence",
  "other",
] as const;

export const incidentTypeSchema = z.enum(incidentTypes);

export const createIncidentBodySchema = z.object({
  type: incidentTypeSchema,
  description: z.string().max(4000).optional(),
  lat: z.number().gte(-90).lte(90),
  lng: z.number().gte(-180).lte(180),
  accuracyM: z.number().positive().max(5_000_000).optional(),
  isSilentSecurity: z.boolean().optional().default(false),
});

export type CreateIncidentBody = z.infer<typeof createIncidentBodySchema>;

export const incidentStatuses = ["open", "triaged", "closed"] as const;

export const updateIncidentStatusSchema = z.object({
  incidentId: z.uuid(),
  status: z.enum(incidentStatuses),
});

export type UpdateIncidentStatusInput = z.infer<typeof updateIncidentStatusSchema>;
