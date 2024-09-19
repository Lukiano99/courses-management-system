import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!categories) {
      throw new TRPCError({
        message: "Categories not found",
        code: "NOT_FOUND",
      });
    }

    return { categories };
  }),
});
