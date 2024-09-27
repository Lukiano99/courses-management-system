import type Stripe from "stripe";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.emailAddresses.at(0)?.emailAddress) {
        throw new TRPCError({
          message: "User emails is not provided",
          code: "BAD_REQUEST",
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
        throw new TRPCError({
          message: "Already purchased",
          code: "BAD_REQUEST",
        });
      }

      if (!course) {
        throw new TRPCError({
          message: "Course not found",
          code: "NOT_FOUND",
        });
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
      let stripeCustomer = await ctx.db.stripeCustomer.findFirst({
        where: {
          userId: ctx.user.id,
        },
        select: {
          stripeCustomerId: true,
        },
      });

      // If someone buys for the first time
      if (!stripeCustomer) {
        const customer = await stripe.customers.create({
          email: ctx.user.emailAddresses.at(0)?.emailAddress,
        });

        stripeCustomer = await ctx.db.stripeCustomer.create({
          data: {
            userId: ctx.user.id,
            stripeCustomerId: customer.id,
            // Make this field optional
            updatedAt: new Date(),
          },
        });
      }

      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith("http")
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : `http://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomer.stripeCustomerId,
        line_items,
        mode: "payment",
        // TODO: Check this env variable, not sure about it
        success_url: `${baseUrl}/courses/${course.id}?success=1`,
        cancel_url: `${baseUrl}/courses/${course.id}?canceled=1`,
        metadata: {
          courseId: course.id,
          userId: ctx.user.id,
        },
      });
      return { url: session.url };
    }),
});
