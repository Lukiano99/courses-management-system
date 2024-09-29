import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type Course, type Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

export const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: Record<string, number> = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const analyticsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const purchases = await ctx.db.purchase.findMany({
      where: {
        course: {
          userId: ctx.user.id,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      }),
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  }),
});
