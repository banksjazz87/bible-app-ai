import {stripe} from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { items } = await request.json();

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: items,
			mode: "payment",
			success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
			cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
		});

		return NextResponse.json({ sessionId: session.id });
    } catch (err) {
        console.warn('Error in the stripe integration ', err);
		return NextResponse.json({ error: err });
	}
}
