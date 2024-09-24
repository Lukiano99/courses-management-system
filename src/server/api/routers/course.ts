import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { reorderChaptersSchema } from "@/schemas/index";

export const courseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
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
      const course = await db.course.create({
        data: {
          userId: user.id,
          title: input.title,
        },
      });
      return { success: "Course successfully created!", course };
    }),

  get: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const course = await ctx.db.course.findUnique({
        where: {
          id: input.courseId,
          userId: ctx.user.id,
        },
        include: {
          attachments: {
            orderBy: {
              createdAt: "desc",
            },
          },
          chapters: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });
      if (!course) {
        return { course: null };
        // throw new TRPCError({
        //   message: "Course does not exist!",
        //   code: "NOT_FOUND",
        // });
      }

      return { course };
    }),

  updateTitle: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
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
      await ctx.db.course.update({
        where: {
          id: input.courseId,
          userId: user.id,
        },
        data: {
          title: input.title,
        },
      });

      return { success: "Title updated successfully" };
    }),
  updateDescription: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
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

      await ctx.db.course.update({
        where: {
          id: input.courseId,
          userId: user.id,
        },
        data: {
          description: input.description,
        },
      });

      return { success: "Description updated successfully" };
    }),
  updateImageUrl: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.course.update({
        where: {
          id: input.courseId,
          userId: ctx.user.id,
        },
        data: {
          imageUrl: input.imageUrl,
        },
      });
    }),
  updateCategory: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await db.course.findFirst({
        where: {
          id: input.courseId,
          userId: ctx.user.id,
        },
      });
      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
      }

      const category = await db.category.findUnique({
        where: {
          id: input.categoryId,
        },
      });
      if (!category) {
        throw new TRPCError({
          message: "Category not found",
          code: "NOT_FOUND",
        });
      }

      await db.course.update({
        where: {
          id: course.id,
          userId: ctx.user.id,
        },
        data: {
          categoryId: category.id,
        },
      });
    }),
  updatePrice: protectedProcedure
    .input(
      z.object({
        price: z.coerce.number(),
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await db.course.findFirst({
        where: {
          id: input.courseId,
          userId: ctx.user.id,
        },
      });
      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
      }

      await db.course.update({
        where: {
          id: course.id,
          userId: ctx.user.id,
        },
        data: {
          price: input.price,
        },
      });
    }),
  addAttachment: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        url: z.string(),
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

      const courseOwner = await db.course.findUnique({
        where: {
          id: course.id,
          userId: user.id,
        },
      });
      if (!courseOwner) {
        throw new TRPCError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const attachment = await db.attachment.create({
        data: {
          url: input.url,
          name: input.url.split("/").pop() ?? "untitled",
          courseId: input.courseId,
        },
      });

      return { attachment };
    }),
  deleteAttachment: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        attachmentId: z.string(),
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

      const courseOwner = await db.course.findUnique({
        where: {
          id: course.id,
          userId: user.id,
        },
      });
      if (!courseOwner) {
        throw new TRPCError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const attachment = await db.attachment.delete({
        where: {
          id: input.attachmentId,
          courseId: input.courseId,
        },
      });

      return { attachment };
    }),
  addChapter: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string(),
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

      const courseOwner = await db.course.findUnique({
        where: {
          id: course.id,
          userId: user.id,
        },
      });
      if (!courseOwner) {
        throw new TRPCError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const lastChapter = await db.chapter.findFirst({
        where: {
          courseId: course.id,
        },
        orderBy: {
          position: "desc",
        },
      });
      const newPosition = lastChapter ? lastChapter.position + 1 : 1;

      const newChapter = await db.chapter.create({
        data: {
          title: input.title,
          courseId: input.courseId,
          position: newPosition,
          updatedAt: new Date(),
        },
      });

      return { success: "Chapter created", chapter: newChapter };
    }),
  reorderChapters: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        list: reorderChaptersSchema,
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
          userId: user.id,
        },
      });

      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
      }

      const courseOwner = await db.course.findUnique({
        where: {
          id: course.id,
          userId: user.id,
        },
      });
      if (!courseOwner) {
        throw new TRPCError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      for (const item of input.list) {
        await db.chapter.update({
          where: {
            id: item.id,
          },
          data: {
            position: item.position,
          },
        });
      }
    }),
});
