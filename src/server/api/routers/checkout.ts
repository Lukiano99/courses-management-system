import type Stripe from "stripe";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user?.id || user.emailAddresses[0]) {
        return new TRPCError({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const course = await ctx.db.course.findUnique({
        where: {
          id: input.courseId,
          isPublished: true,
        },
      });

      const purchase = await ctx.db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: ctx.user.id,
            courseId: input.courseId,
          },
        },
      });

      if (purchase) {
        return new NextResponse("Already purchased", { status: 400 });
      }

      if (!course) {
        return new NextResponse("Not found", { status: 404 });
      }

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          quantity: 1,
          price_data: {
            currency: "USD",
            product_data: {
              name: course.title,
              description: course.description!,
            },
            unit_amount: Math.round(course.price! * 100),
          },
        },
      ];

      // TODO: findeUnique instead of findFirst!
      const stripeCustomer = await ctx.db.stripeCustomer.findFirst({
        where: {
          userId: user.id,
        },
        select: {
          stripeCustomerId: true,
        },
      });

      // If someone buys for the first time
      if (!stripeCustomer) {
        const customer = await stripe.customers.create({
          email: user.emailAddresses[0],
        });

        const stripeCustomer = await ctx.db.stripeCustomer.create({
          data: {
            userId: user.id,
            stripeCustomerId: customer.id,
            // Make this field optional
            updatedAt: new Date(),
          },
        });

        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomer.stripeCustomerId,
          line_items,
          mode: "payment",
          // TODO: Check this env variable, not sure about it
          success_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/courses/${course.id}?success=1`,
          cancel_url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/courses/${course.id}?canceled=1`,
          metadata: {
            courseId: course.id,
            userId: user.id,
          },
        });

        return { url: session.url };
      }
    }),
});
