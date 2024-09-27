import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const getUserProgress = async (coruseId: string, userId: string) => {
  // TODO: Valid other fields (existing user, existing course, etc...)

  const publishedChapters = await db.chapter.findMany({
    where: {
      courseId: coruseId,
      isPublished: true,
    },
    select: {
      id: true,
    },
  });

  const publishedChaptersId = publishedChapters.map((chapter) => chapter.id);

  const validCompletedChapter = await db.userProgress.count({
    where: {
      userId: userId,
      chapterId: {
        in: publishedChaptersId,
      },
      isCompleted: true,
    },
  });

  const progressPercentage =
    (validCompletedChapter / publishedChapters.length) * 100;
  console.log(publishedChapters.length);
  console.log({ validCompletedChapter });
  console.log({ progressPercentage });
  return progressPercentage;
};
export const userProgressRouter = createTRPCRouter({
  getPercentage: protectedProcedure
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
  get: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userProgress = await ctx.db.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId: ctx.user.id,
            chapterId: input.chapterId,
          },
        },
      });

      return { userProgress };
    }),
});
