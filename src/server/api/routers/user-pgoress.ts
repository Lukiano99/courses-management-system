import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const userProgressRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // TODO: Valid other fields (existing user, existing course, etc...)

      const publishedChapters = await ctx.db.chapter.findMany({
        where: {
          courseId: input.courseId,
          isPublished: true,
        },
        select: {
          id: true,
        },
      });

      const publishedChaptersId = publishedChapters.map(
        (chapter) => chapter.id,
      );

      const validCompletedChapter = await ctx.db.userProgress.count({
        where: {
          userId: ctx.user.id,
          chapterId: {
            in: publishedChaptersId,
          },
          isCompleted: true,
        },
      });

      const progressPercentage =
        (publishedChapters.length / validCompletedChapter) * 100;

      return progressPercentage;
    }),
});
