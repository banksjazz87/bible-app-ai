import type { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(await (await req.blob()).text(), req.headers.get("stripe-signature") as string, process.env.STRIPE_WEBHOOK_SECRET as string);
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "Unknown error";
		// On error, log and return the error message.
		if (!(err instanceof Error)) console.log(err);
		console.log(`❌ Error message: ${errorMessage}`);
		return NextResponse.json({ message: `Webhook Error: ${errorMessage}` }, { status: 400 });
	}

	// Successfully constructed event.
	console.log("✅ Success:", event.id);

	let subscription;
	let status;

	try {
		switch (event.type) {
			case "customer.subscription.trial_will_end":
				subscription = event.data.object;
				status = subscription.status;
				console.log(`Subscription status is ${status}.`);
				break;

			case "customer.subscription.deleted":
				subscription = event.data.object;
				status = subscription.status;
				console.log(`Subscription status is ${status}.`);
				break;

			case "customer.subscription.created":
				subscription = event.data.object;
				status = subscription.status;
				console.log(`Subscription status is: ${status}`);
				break;

			case "customer.subscription.updated":
				subscription = event.data.object;
				status = subscription.status;
				console.log(`Subscription status is: ${status}`);
				break;

			case "entitlements.active_entitlement_summary.updated":
				subscription = event.data.object;
				console.log(`Active entitlement summary updated for ${subscription}.`);
				break;

			default:
				throw new Error(`Unhandled event: ${event.type}`);
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
	}

	// Return a response to acknowledge receipt of the event.
	return NextResponse.json({ message: "Received" }, { status: 200 });
}
