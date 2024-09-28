import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { type Chapter, type Category, type Course } from "@prisma/client";
import { getUserProgress } from "./user-pgoress";

type CourseWithProgressWithCategory = Course & {
  Category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

// const { video } = new Mux({
//   tokenId: env.MUX_TOKEN_ID,
//   tokenSecret: env.MUX_TOKEN_ID,
// });

export const dashboardsCoursesRouter = createTRPCRouter({
  get: protectedProcedure.query<Promise<DashboardCourses>>(async ({ ctx }) => {
    const purchasedCourses = await ctx.db.purchase.findMany({
      where: {
        userId: ctx.user.id,
      },
      select: {
        course: {
          include: {
            Category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });
    const courses = purchasedCourses.map(
      (purchase) => purchase.course,
    ) as CourseWithProgressWithCategory[];

    for (const course of courses) {
      const progress = await getUserProgress(course.id, ctx.user.id);
      course.progress = progress;
    }
    console.log(courses.at(0));

    const completedCourses = courses.filter(
      (course) => course.progress === 100,
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100,
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  }),
});
