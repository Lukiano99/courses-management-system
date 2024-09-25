import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { NextResponse } from "next/server";
import { z } from "zod";

export const purchaseRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const purchase = await ctx.db.purchase.findUnique({
        where: {
          // We can use this because of our schema.prisma
          // @@unique([userId, courseId])
          // @@index([courseId])
          userId_courseId: {
            userId: ctx.user.id,
            courseId: input.courseId,
          },
        },
      });
      if (!purchase) {
        return new NextResponse("No purchases yet");
      }

      return { purchase };
    }),
});
