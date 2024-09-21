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
  updateTitle: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) {
        throw new TRPCError({
          message: "Unauthorized!",
          code: "UNAUTHORIZED",
        });
      }
      const course = await ctx.db.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
      }

      const chapter = await ctx.db.chapter.findUnique({
        where: {
          id: input.chapterId,
          courseId: input.courseId,
        },
      });
      console.log("CHAPTER");
      console.log({ chapter });
      if (!chapter) {
        throw new TRPCError({
          message: "Chapter not found",
          code: "NOT_FOUND",
        });
      }
      const updatedChapter = await ctx.db.chapter.update({
        where: {
          id: chapter.id,
          courseId: chapter.courseId,
        },
        data: {
          title: input.title,
        },
      });

      // TODO: Handle upload video

      return { success: "Chapter title updated successfully", updatedChapter };
    }),
  updateDescription: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) {
        throw new TRPCError({
          message: "Unauthorized!",
          code: "UNAUTHORIZED",
        });
      }
      const course = await ctx.db.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
      }

      const chapter = await ctx.db.chapter.findUnique({
        where: {
          id: input.chapterId,
          courseId: input.courseId,
        },
      });
      console.log("CHAPTER");
      console.log({ chapter });
      if (!chapter) {
        throw new TRPCError({
          message: "Chapter not found",
          code: "NOT_FOUND",
        });
      }
      const updatedChapter = await ctx.db.chapter.update({
        where: {
          id: chapter.id,
          courseId: chapter.courseId,
        },
        data: {
          description: input.description,
        },
      });

      // TODO: Handle upload video

      return { success: "Chapter title updated successfully", updatedChapter };
    }),
  updateIsFree: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
        isFree: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user) {
        throw new TRPCError({
          message: "Unauthorized!",
          code: "UNAUTHORIZED",
        });
      }
      const course = await ctx.db.course.findUnique({
        where: {
          id: input.courseId,
        },
      });

      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
      }

      const chapter = await ctx.db.chapter.findUnique({
        where: {
          id: input.chapterId,
          courseId: input.courseId,
        },
      });
      console.log("CHAPTER");
      console.log({ chapter });
      if (!chapter) {
        throw new TRPCError({
          message: "Chapter not found",
          code: "NOT_FOUND",
        });
      }
      const updatedChapter = await ctx.db.chapter.update({
        where: {
          id: chapter.id,
          courseId: chapter.courseId,
        },
        data: {
          isFree: input.isFree,
        },
      });

      // TODO: Handle upload video

      return { success: "Chapter title updated successfully", updatedChapter };
    }),
});
