import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

export const chapterRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user;
      if (!userId) {
        throw new TRPCError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const chapter = await db.chapter.findUnique({
        where: {
          id: input.chapterId,
          courseId: input.courseId,
        },
        include: {
          muxData: true,
        },
      });

      // if (!chapter) {
      //   throw new TRPCError({
      //     message: "Chapter not found",
      //     code: "NOT_FOUND",
      //   });
      // }

      return { chapter };
    }),
});
