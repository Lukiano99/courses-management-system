import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    if (!userId) {
      throw new TRPCError({
        message: "Unauthorized",
        code: "UNAUTHORIZED",
      });
    }

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
