import { z } from "zod";
import { Mux } from "@mux/mux-node";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: env.MUX_TOKEN_ID,
  tokenSecret: env.MUX_TOKEN_SECRET,
});

export const chapterRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
        courseId: z.string(),
        isPublished: z.boolean().optional(),
        getNextChapter: z.boolean().optional(),
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
          ...(input.isPublished ? { isPublished: input.isPublished } : {}),
        },
        include: {
          muxData: true,
        },
      });

      return { chapter };
    }),
  getNext: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
        position: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const chapter = await db.chapter.findFirst({
        where: {
          id: {
            not: input.chapterId,
          },
          courseId: input.courseId,
          isPublished: true,
          position: {
            gt: input.position,
          },
        },
        orderBy: {
          position: "asc",
        },
        include: {
          muxData: true,
        },
      });
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
  updateVideoUrl: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
        videoUrl: z.string(),
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
          videoUrl: input.videoUrl,
        },
      });

      // Deleting previous video if exists
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: input.chapterId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      // Creating new video
      const asset = await video.assets.create({
        input: [
          {
            url: input.videoUrl,
          },
        ],
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: input.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });

      return { success: "Chapter video updated successfully", updatedChapter };
    }),
  delete: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
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

      if (!chapter) {
        throw new TRPCError({
          message: "Chapter not found",
          code: "NOT_FOUND",
        });
      }

      await ctx.db.chapter.delete({
        where: {
          courseId: input.courseId,
          id: input.chapterId,
        },
      });

      // We need to check if there are any chapter that is published.
      // Course can't be published if there aren't any published chapters.
      // If the chapter we just deleted was the only one which was published
      // we have to unpublished whole course

      const publishedChaptersInCourse = await ctx.db.chapter.findMany({
        where: {
          courseId: input.courseId,
          isPublished: true,
        },
      });

      if (!publishedChaptersInCourse.length) {
        await ctx.db.course.update({
          where: {
            id: input.courseId,
          },
          data: {
            isPublished: false,
          },
        });
      }
    }),
  // Toggle published field
  togglePublish: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
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

      if (!chapter) {
        throw new TRPCError({
          message: "Chapter not found",
          code: "NOT_FOUND",
        });
      }

      if (chapter.isPublished) {
        await ctx.db.chapter.update({
          where: {
            id: input.chapterId,
            courseId: input.courseId,
          },
          data: {
            isPublished: false,
          },
        });

        const publishedChaptersInCourse = await ctx.db.chapter.findMany({
          where: {
            courseId: input.courseId,
            isPublished: true,
          },
        });

        if (!publishedChaptersInCourse.length) {
          await ctx.db.course.update({
            where: {
              id: input.courseId,
            },
            data: {
              isPublished: false,
            },
          });
        }

        return;
      }

      const muxData = await ctx.db.muxData.findUnique({
        where: {
          chapterId: input.chapterId,
        },
      });
      if (
        !chapter ||
        !muxData ||
        !chapter.title ||
        !chapter.description ||
        !chapter.videoUrl
      ) {
        return new NextResponse("Missing required fields", {
          status: 400,
        });
      }

      await ctx.db.chapter.update({
        where: {
          id: input.chapterId,
          courseId: input.courseId,
        },
        data: {
          isPublished: true,
        },
      });
    }),
});
