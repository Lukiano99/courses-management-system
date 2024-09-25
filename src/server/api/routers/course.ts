import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { reorderChaptersSchema } from "@/schemas/index";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { env } from "@/env";
import { type Category, type Course } from "@prisma/client";
import { getUserProgress } from "./user-pgoress";

type CourseWithProgressWithCategory = Course & {
  Category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

const { video } = new Mux({
  tokenId: env.MUX_TOKEN_ID,
  tokenSecret: env.MUX_TOKEN_ID,
});

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

  getWithSearch: protectedProcedure
    .input(
      z.object({
        categoryId: z.string().optional(),
        title: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const courses = await ctx.db.course.findMany({
        where: {
          isPublished: true,
          title: {
            // this will work properly if we wrote correct our prisma schema
            // previewFeatures = ["fullTextSearch"]
            contains: input.title,
            // searching title doesn't work ("new" !== "New" for example)
          },
          ...(input.categoryId ? { categoryId: input.categoryId } : {}),
        },
        include: {
          // TODO: fix typo in Category => category
          Category: true,
          chapters: {
            where: {
              isPublished: true,
            },
            select: {
              id: true,
            },
          },
          // TODO: fix typo in Purchase => purchase
          Purchase: {
            where: {
              userId: ctx.user.id,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log({ courses });

      const coursesWithProgress: CourseWithProgressWithCategory[] =
        await Promise.all(
          courses.map(async (course) => {
            if (course.Purchase.length === 0) {
              return {
                ...course,
                progress: null,
              };
            }
            const progressPercentage = await getUserProgress(
              course.id,
              ctx.user.id,
            );

            return {
              ...course,
              progress: progressPercentage,
            };
          }),
        );

      return coursesWithProgress;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const courses = await ctx.db.course.findMany({
      where: {
        userId: ctx.user.id, // Filtriraj po korisnikovom ID-u
      },
      // include: {
      //   attachments: {
      //     orderBy: {
      //       createdAt: "desc",
      //     },
      //   },
      //   chapters: {
      //     orderBy: {
      //       position: "asc",
      //     },
      //   },
      // },
      orderBy: {
        createdAt: "desc", // Sortiraj kurseve po datumu kreiranja, najnoviji prvo
      },
    });

    return { courses }; // Vrati sve kurseve korisnika
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
  togglePublish: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
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
        include: {
          chapters: {
            include: {
              muxData: true,
            },
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
      }

      if (course.isPublished) {
        await ctx.db.course.update({
          where: {
            id: input.courseId,
          },
          data: {
            isPublished: false,
          },
        });

        return;
      }

      const hasPublishedChapters = course.chapters.some(
        (chapter) => chapter.isPublished,
      );

      if (
        !course.title ||
        !course.description ||
        !course.imageUrl ||
        !course.categoryId ||
        !hasPublishedChapters
      ) {
        return new NextResponse("Missing required fields", {
          status: 401,
        });
      }

      await ctx.db.course.update({
        where: {
          id: input.courseId,
          userId: user.id,
        },
        data: {
          isPublished: true,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
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
        include: {
          chapters: {
            include: {
              muxData: true,
            },
          },
        },
      });

      if (!course) {
        return new NextResponse("Course not found", {
          status: 404,
        });
      }

      // We need to delte all mux data that course has
      for (const chapter of course.chapters) {
        if (chapter.muxData?.assetId) {
          await video.assets.delete(chapter.muxData.assetId);
        }
      }

      await ctx.db.course.delete({
        where: {
          id: input.courseId,
        },
      });
    }),
});
