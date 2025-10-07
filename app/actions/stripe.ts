"use server";

import type { Stripe } from "stripe";

import { headers } from "next/headers";

import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/utils/stripe-helpers";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(data: FormData): Promise<{ client_secret: string | null; url: string | null }> {
	const lookupKey = data.get("lookup_key") as string;
	const prices = await stripe.prices.list({
		lookup_keys: [lookupKey],
		expand: ["data.product"],
    });
    
    console.log("Prices Here !!!!! ", prices);

	const session = await stripe.checkout.sessions.create({
		billing_address_collection: "auto",
		line_items: [
			{
				price: prices.data[0].id,
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/subscription-success/?success=true&session={CHECKOUT_SESSION_ID}`,
		cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/subscription-failure/?canceled=true`,
	});

	console.log("Session here ", session);
	return {
		client_secret: session.client_secret,
		url: session.url,
	};
}


export async function createPortalSession(data: FormData) {
    const sessionID = data.get('session') as string;
    const { customer } = await stripe.checkout.sessions.retrieve(sessionID);
    const returnURL = process.env.NEX_PUBLIC_DOMAIN as string;

    const portalSession = await stripe.billingPortal.sessions.create({
			customer: customer as string,
			return_url: returnURL,
    });
    
    return {
        customer: portalSession.customer,
        url: portalSession.url
    }
}

export async function createPaymentIntent(data: FormData): Promise<{ client_secret: string }> {
	const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
		amount: formatAmountForStripe(Number(data.get("customDonation") as string), CURRENCY),
		automatic_payment_methods: { enabled: true },
		currency: CURRENCY,
	});

	return { client_secret: paymentIntent.client_secret as string };
}

export async function subscribeAction() {
	const { url } = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price: "price_1SDxaFRv9ZEy80pDmAiLFtd2",
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
		cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
	});
}
