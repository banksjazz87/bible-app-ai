// import type { Stripe } from "stripe";
// import { stripe } from "@/lib/stripe";

// export async function POST(req: Request): Promise<{ client_secret: string | null; url: string | null; status: number; message?: string }> {
// 	const lookupKey = req.subscription as string;
// 	console.log("key = ", lookupKey);

// 	if (lookupKey === "free") {
// 		return {
// 			status: 200,
// 			message: "A free product has been selected, no checkout is required.",
// 			client_secret: null,
// 			url: null,
// 		};
// 	}

// 	const prices = await stripe.prices.retrieve(lookupKey);
// 	console.log("Prices Here !!!!! ", prices);

// 	const session = await stripe.checkout.sessions.create({
// 		ui_mode: "custom",
// 		// Provide the customer ID of the customer you previously created
// 		customer: req.customerId,
// 		line_items: [
// 			{
// 				// Provide the exact Price ID (e.g. price_1234) of the product you want to sell
// 				price: prices.id,
// 				quantity: 1,
// 			},
// 		],
// 		mode: "subscription",
// 		return_url: `${process.env.NEXT_PUBLIC_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
// 	});

// 	console.log("Session here ", session);
// 	return {
// 		status: 200,
// 		client_secret: session.client_secret,
// 		url: session.url,
// 	};
// }
