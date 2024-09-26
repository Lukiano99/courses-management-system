import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error: unknown) {
    return new NextResponse(
      `Webhook Error: ${String(error) ?? "error message"}`,
      {
        status: 400,
      },
    );
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata.userId!;
  const courseId = session.metadata.courseId as string;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return new NextResponse(`Webhook error: Missing metadata`, {
        status: 400,
      });
    }

    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
        updatedAt: new Date(),
      },
    });
  } else {
    return new NextResponse(
      `Webhook Error: Unhandled even type ${event.type}`,
      {
        status: 200,
      },
    );
  }
  return new NextResponse(null, { status: 200 });
}
