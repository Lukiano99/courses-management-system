import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const analyticsRouter = createTRPCRouter({
  get: protectedProcedure.input(z.object({})).query(async ({ ctx, input }) => {
    return null;
  }),
});
