import {stripe} from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: Request) {
// 	const { items } = await request.json();

// 	try {
// 		const session = await stripe.checkout.sessions.create({
// 			payment_method_types: ["card"],
// 			line_items: items,
// 			mode: "payment",
// 			success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
// 			cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
// 		});

// 		return NextResponse.json({ sessionId: session.id });
//     } catch (err) {
//         console.warn('Error in the stripe integration ', err);
// 		return NextResponse.json({ error: err });
// 	}
// }


export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { lookup_key } = body;

		if (!lookup_key) {
			return NextResponse.json({ error: "lookup_key is required" }, { status: 400 });
		}

		const prices = await stripe.prices.list({
			lookup_keys: [lookup_key],
			expand: ["data.product"],
		});

		if (!prices.data.length) {
			return NextResponse.json({ error: "Price not found" }, { status: 404 });
		}

		const session = await stripe.checkout.sessions.create({
			billing_address_collection: "auto",
			line_items: [
				{
					price: prices.data[0].id,
					quantity: 1,
				},
			],
			mode: "subscription",
			success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel?session_id{CHECKOUT_SESSION_ID}`,
		});

		// Return the session URL for client-side redirect
		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 });
	}
}
