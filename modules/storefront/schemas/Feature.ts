import { z } from "zod";

export const FeatureSchema = z.object({
    type: z.literal("Feature"),
    geometry: z.any(),
    properties: z.any(),
    id: z.any(),
    __id: z.any().optional(),
});

export type Feature = z.infer<typeof FeatureSchema>;