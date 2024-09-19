import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

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
        },
      });
      if (!course) {
        throw new TRPCError({
          message: "Course does not exist!",
          code: "NOT_FOUND",
        });
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
});
