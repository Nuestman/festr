import { z } from "zod";

export const resourceKinds = ["aed", "hospital", "first_aid", "other"] as const;

export const resourceKindSchema = z.enum(resourceKinds);

export const createResourceBodySchema = z.object({
  kind: resourceKindSchema,
  name: z.string().min(1).max(200),
  lat: z.number().gte(-90).lte(90),
  lng: z.number().gte(-180).lte(180),
  source: z.string().max(500).optional(),
});

export type CreateResourceBody = z.infer<typeof createResourceBodySchema>;
