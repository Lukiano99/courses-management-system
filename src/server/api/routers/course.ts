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
});
