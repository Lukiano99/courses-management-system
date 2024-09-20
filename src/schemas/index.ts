import { z } from "zod";

export const reorderChaptersSchema = z.array(
  z.object({
    id: z.string(),
    position: z.number(),
  }),
);

export type ReorderChaptersType = z.infer<typeof reorderChaptersSchema>;
